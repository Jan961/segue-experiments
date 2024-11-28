// cypress/component/Select.spec.tsx

import { mount } from 'cypress/react18'; // Adjust import if using a different version
import Select, { SelectProps } from '../../../components/core-ui-lib/Select'; // Adjust the path to your Select component
import BaseComp from '../global/BaseComp'; // Adjust the path if necessary

// Define the setup function as provided
function setup(props: SelectProps) {
  mount(
    <BaseComp>
      <Select {...props} />
    </BaseComp>,
  );
}

describe('Select Component', () => {
  const options = [
    { value: 'option1', text: 'Option 1' },
    { value: 'option2', text: 'Option 2' },
    { value: 'option3', text: 'Option 3' },
  ];

  it('renders correctly with default props', () => {
    const onChange = cy.stub();
    setup({ onChange, options });

    cy.get('[data-testid="core-ui-lib-select"]').should('exist');
    cy.get('[id*="react-select"]').should('exist');
  });

  it('displays options when clicked', () => {
    const onChange = cy.stub();
    setup({ onChange, options });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    options.forEach((option) => {
      cy.contains(`${option.text}`).should('exist');
    });
  });

  it('calls onChange with correct value when an option is selected', () => {
    const onChange = cy.stub();
    setup({ onChange, options });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.contains(`${options[1].text}`).click();

    cy.wrap(onChange).should('have.been.calledOnceWith', options[1].value);
  });

  it('displays placeholder when no value is selected', () => {
    const placeholder = 'Select an option';
    setup({ onChange: cy.stub(), options, placeholder });

    cy.get('[id="react-select-:r3:-placeholder"]').should('contain', placeholder);
  });

  it('renders the label when label prop is provided', () => {
    const label = 'Select Label';
    setup({ onChange: cy.stub(), options, label });

    cy.get('[data-testid="core-ui-lib-select-label"]').should('contain', label);
  });

  it('is disabled when disabled prop is true', () => {
    setup({ onChange: cy.stub(), options, disabled: true });

    cy.get('[data-testid="core-ui-lib-select"] div div').should('have.attr', 'aria-disabled', 'true');
    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('#react-select-:r1:-listbox').should('not.exist');
    cy.get('[role="listbox"]').should('not.exist');
  });

  it('allows multiple selections when isMulti is true', () => {
    const onChange = cy.stub();
    setup({ onChange, options, isMulti: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get(`[data-testid="core-ui-lib-select-option-${options[0].value}"]`).click();
    cy.get(`[data-testid="core-ui-lib-select-option-${options[1].value}"]`).click();

    cy.wrap(onChange).should('have.been.calledTwice');
    cy.wrap(onChange).then((stub) => {
      expect(stub.getCall(1).args[0]).to.deep.equal([options[0].value, options[1].value]);
    });

    cy.get('.react-select__multi-value__label').should('contain', '2 items selected');
  });

  it('allows clearing the selected option when isClearable is true', () => {
    const onChange = cy.stub();
    setup({ onChange, options, isClearable: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get(`[data-testid="core-ui-lib-select-option-${options[0].value}"]`).click();
    cy.get('.react-select__clear-indicator').click();

    cy.wrap(onChange).should('have.been.calledTwice');
    cy.wrap(onChange).then((stub) => {
      expect(stub.getCall(1).args[0]).to.equal(null);
    });
  });

  it('does not allow clearing the selected option when isClearable is false', () => {
    setup({ onChange: cy.stub(), options, isClearable: false });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get(`[data-testid="core-ui-lib-select-option-${options[0].value}"]`).click();
    cy.get('.react-select__clear-indicator').should('not.exist');
  });

  it('applies custom styles when customStyles prop is provided', () => {
    const customStyles = {
      control: (styles) => ({ ...styles, backgroundColor: 'rgb(255, 192, 203)' }), // Pink
    };
    setup({ onChange: cy.stub(), options, customStyles });

    cy.get('.react-select__control').should('have.css', 'background-color', 'rgb(255, 192, 203)');
  });

  it('displays error styles when error prop is true', () => {
    setup({ onChange: cy.stub(), options, error: true });

    cy.get('.border-primary-red').should('exist');
  });

  it('allows searching when isSearchable is true', () => {
    setup({ onChange: cy.stub(), options, isSearchable: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('input').type('Option 2');
    cy.get('.react-select__option').should('have.length', 1);
    cy.get('.react-select__option').should('contain', 'Option 2');
  });

  it('does not allow searching when isSearchable is false', () => {
    setup({ onChange: cy.stub(), options, isSearchable: false });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('input').should('not.exist');
  });

  it('closes menu on select when closeMenuOnSelect is true', () => {
    setup({ onChange: cy.stub(), options, closeMenuOnSelect: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('.react-select__menu').should('exist');
    cy.get(`[data-testid="core-ui-lib-select-option-${options[0].value}"]`).click();
    cy.get('.react-select__menu').should('not.exist');
  });

  it('does not close menu on select when closeMenuOnSelect is false', () => {
    setup({ onChange: cy.stub(), options, closeMenuOnSelect: false });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('.react-select__menu').should('exist');
    cy.get(`[data-testid="core-ui-lib-select-option-${options[0].value}"]`).click();
    cy.get('.react-select__menu').should('exist');
  });

  it('handles no options provided', () => {
    setup({ onChange: cy.stub(), options: [] });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('.react-select__menu').should('not.exist');
  });

  it('renders custom option when renderOption prop is provided', () => {
    const renderOption = (props) => (
      <div data-testid={`custom-option-${props.data.value}`}>{`Custom ${props.data.text}`}</div>
    );

    setup({ onChange: cy.stub(), options, renderOption });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    options.forEach((option) => {
      cy.get(`[data-testid="custom-option-${option.value}"]`).should('exist').and('contain', `Custom ${option.text}`);
    });
  });

  it('changes appearance based on variant prop', () => {
    setup({ onChange: cy.stub(), options, variant: 'transparent' });

    cy.get('.react-select__control').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    setup({ onChange: cy.stub(), options, variant: 'colored' });

    cy.get('.react-select__control').should('have.css', 'background-color', 'rgb(255, 255, 255)');
  });

  it('positions menu according to menuPlacement prop', () => {
    setup({ onChange: cy.stub(), options, menuPlacement: 'top' });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('.react-select__menu--placement-top').should('exist');
  });

  it('calls onBlur when component loses focus', () => {
    const onBlur = cy.stub();
    setup({ onChange: cy.stub(), options, onBlur });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('body').click(0, 0); // Click outside to trigger blur
    cy.wrap(onBlur).should('have.been.calledOnce');
  });

  it('closes menu on scroll when closeMenuOnScroll is true', () => {
    setup({ onChange: cy.stub(), options, closeMenuOnScroll: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.scrollTo('bottom');
    cy.get('.react-select__menu').should('not.exist');
  });

  it('does not close menu on scroll when closeMenuOnScroll is false', () => {
    setup({ onChange: cy.stub(), options, closeMenuOnScroll: false });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.scrollTo('bottom');
    cy.get('.react-select__menu').should('exist');
  });

  it('handles boolean value', () => {
    const boolOptions = [
      { value: true, text: 'Yes' },
      { value: false, text: 'No' },
    ];
    const onChange = cy.stub();
    setup({ onChange, options: boolOptions });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[data-testid="core-ui-lib-select-option-true"]').click();
    cy.wrap(onChange).should('have.been.calledOnceWith', true);

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[data-testid="core-ui-lib-select-option-false"]').click();
    cy.wrap(onChange).should('have.been.calledTwice');
    cy.wrap(onChange).then((stub) => {
      expect(stub.getCall(1).args[0]).to.equal(false);
    });
  });

  it('handles array value when isMulti is true', () => {
    const onChange = cy.stub();
    setup({
      onChange,
      options,
      isMulti: true,
      value: [options[0].value, options[1].value],
    });

    cy.get('.react-select__multi-value__label').should('contain', '2 items selected');
  });

  it('selects all options when "select_all" option is selected', () => {
    const optionsWithSelectAll = [{ value: 'select_all', text: 'Select All' }, ...options];
    const onChange = cy.stub();
    setup({ onChange, options: optionsWithSelectAll, isMulti: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[data-testid="core-ui-lib-select-option-select_all"]').click();

    cy.wrap(onChange).should('have.been.calledOnce');
    cy.wrap(onChange).then((stub) => {
      expect(stub.getCall(0).args[0]).to.deep.equal(options.map((o) => o.value));
    });

    cy.get('.react-select__multi-value__label').should('contain', `${options.length} items selected`);
  });

  it('deselects all options when "select_all" option is deselected', () => {
    const optionsWithSelectAll = [{ value: 'select_all', text: 'Select All' }, ...options];
    const onChange = cy.stub();
    setup({ onChange, options: optionsWithSelectAll, isMulti: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[data-testid="core-ui-lib-select-option-select_all"]').click();
    cy.get('[data-testid="core-ui-lib-select-option-select_all"]').click();

    cy.wrap(onChange).should('have.been.calledTwice');
    cy.wrap(onChange).then((stub) => {
      expect(stub.getCall(1).args[0]).to.deep.equal([]);
    });

    cy.get('.react-select__multi-value__label').should('not.exist');
  });
});

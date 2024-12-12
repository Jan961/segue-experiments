// cypress/component/Select.spec.tsx

import { mount } from 'cypress/react18'; // Adjust import if using a different version
import Select, { SelectProps } from '../../../components/core-ui-lib/Select'; // Adjust the path to your Select component
import { SelectOption } from '../../../components/core-ui-lib/Select/Select';
import BaseComp from '../helpers/BaseComp'; // Adjust the path if necessary

//Create a simple scrollable div component to place the select component in
const setupScrollableDiv = (options: SelectOption[]) => {
  const numberOfElements = 19;
  mount(
    <BaseComp styles={{ width: '200px' }}>
      <div
        data-testid="scrollable-div"
        style={{
          width: '100%',
          height: '200px',
          overflowY: 'scroll',
          border: '1px solid black',
        }}
      >
        {/* Content that exceeds the div's height */}
        <Select options={options} onChange={cy.stub()} closeMenuOnScroll={true} />
        {Array.from({ length: numberOfElements }, (_, i) => (
          <h1 key={i}>Item {i}</h1>
        ))}
        <h1 data-testid="last-item">Item 19</h1>
      </div>
    </BaseComp>,
  );
};

// Define the setup function as provided
function setup(props: SelectProps) {
  mount(
    <BaseComp styles={{ width: '200px' }}>
      <Select {...props} />
    </BaseComp>,
  );
}

// list of names to be used as options
const names = [
  { value: 'Abigail', text: 'Abigail' },
  { value: 'Benjamin', text: 'Benjamin' },
  { value: 'Charlotte', text: 'Charlotte' },
  { value: 'Daniel', text: 'Daniel' },
  { value: 'Ethan', text: 'Ethan' },
  { value: 'Fiona', text: 'Fiona' },
  { value: 'Gabriella', text: 'Gabriella' },
  { value: 'Henry', text: 'Henry' },
  { value: 'Isabella', text: 'Isabella' },
  { value: 'Jackson', text: 'Jackson' },
  { value: 'Katherine', text: 'Katherine' },
  { value: 'Liam', text: 'Liam' },
  { value: 'Madison', text: 'Madison' },
  { value: 'Nathaniel', text: 'Nathaniel' },
  { value: 'Olivia', text: 'Olivia' },
  { value: 'Patrick', text: 'Patrick' },
  { value: 'Quentin', text: 'Quentin' },
  { value: 'Rebecca', text: 'Rebecca' },
  { value: 'Samuel', text: 'Samuel' },
  { value: 'Thomas', text: 'Thomas' },
  { value: 'Uma', text: 'Uma' },
  { value: 'Victoria', text: 'Victoria' },
  { value: 'William', text: 'William' },
  { value: 'William', text: 'William' },
  { value: 'Xavier', text: 'Xavier' },
  { value: 'Yasmine', text: 'Yasmine' },
  { value: 'Zachary', text: 'Zachary' },
  { value: 'Alexandra', text: 'Alexandra' },
  { value: 'Felix', text: 'Felix' },
  { value: 'Ophelia', text: 'Ophelia' },
  { value: 'Long String Name', text: 'akjsdhka laksjlak a kjalsla asjd;aks aks ;a jsadksksksj Long String Name' },
];

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

    cy.get('[id*="react-select-"][id$="-placeholder"] ').should('contain', placeholder);
  });

  it('renders the label when label prop is provided', () => {
    const label = 'Select Label';
    setup({ onChange: cy.stub(), options, label, placeholder: 'Select an option' });

    cy.get('[data-testid="core-ui-lib-select-label"]').should('contain', label);
  });

  it('is disabled when disabled prop is true', () => {
    setup({ onChange: cy.stub(), options, disabled: true });

    cy.get('[data-testid="core-ui-lib-select"] div div').should('have.attr', 'aria-disabled', 'true');
    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[id*=react-select][id$=listbox]').should('not.exist');
    cy.get('[role="listbox"]').should('not.exist');
  });

  it('allows multiple selections when isMulti is true', () => {
    const onChange = cy.stub();
    setup({ onChange, options, isMulti: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.contains(options[0].text).click();
    cy.contains(options[1].text).click();

    cy.wrap(onChange).should('have.been.calledTwice');
    cy.wrap(onChange).then((stub) => {
      expect(stub.getCall(1).args[0]).to.deep.equal([options[0].value, options[1].value]);
    });

    cy.get('[data-testid="core-ui-lib-select"]').should('contain', '2 items selected');
  });

  it('allows clearing the selected option when isClearable is true', () => {
    const onChange = cy.stub();
    setup({ onChange, options, isClearable: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.contains(options[0].text).click();

    //this is indicator (cross sign) is provided by react-select so this is probably the best/easiest selector to use
    cy.get('.css-qrq13a-indicatorContainer').click();

    cy.wrap(onChange).should('have.been.calledTwice');
    cy.wrap(onChange).then((stub) => {
      expect(stub.getCall(1).args[0]).to.equal(null);
    });
  });

  it('does not allow clearing the selected option when isClearable is false', () => {
    setup({ onChange: cy.stub(), options, isClearable: false });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.contains(options[0].text).click();
    cy.get('.css-qrq13a-indicatorContainer').should('not.exist');
  });

  it('applies custom styles when customStyles prop is provided', () => {
    const customStyles = {
      control: (styles) => ({ ...styles, backgroundColor: 'rgb(255, 192, 203)' }), // Pink
    };
    setup({ onChange: cy.stub(), options, customStyles, placeholder: 'Select an option' });

    cy.get('[id*="react-select-"][id$="-placeholder"] ')
      .parent()
      .parent()
      .should('have.css', 'background-color', 'rgb(255, 192, 203)');
  });

  it('displays error styles when error prop is true', () => {
    setup({ onChange: cy.stub(), options, error: true });

    cy.get('.border-primary-red').should('exist');
  });

  it('allows searching when isSearchable is true and displays correct search results', () => {
    // set up a function to filter names based on input
    const filterNames = (input: string) =>
      names.reduce((res, { text }) => (text.toLowerCase().includes(input.toLowerCase()) ? [...res, text] : res), []);

    // set up a function to check if the select filtering behaves as expected after each character is typed
    function checkInput(fullInput: string) {
      // type each character and check if the filtered names are displayed
      for (let i = 0; i < fullInput.length; i++) {
        const char = fullInput.charAt(i);
        cy.get('input').type(char);
        cy.log(`filtered names: ${filterNames(fullInput.slice(0, i + 1))}`);
        // check if each filtered name is displayed
        filterNames(fullInput.slice(0, i + 1)).forEach((name) => {
          cy.contains(name).should('exist');
        });
        // check if the number of displayed options is correct
        cy.get('[id*="react-select"][role="option"]').should(
          'have.length',
          filterNames(fullInput.slice(0, i + 1)).length,
        );
      }
      // clear the input for the next test
      cy.get('input').clear();
    }

    setup({ onChange: cy.stub(), options: names, isSearchable: true, isClearable: true });

    // check some inputs
    checkInput('Abigail');
    checkInput('Benjamin');
    checkInput('Ophelia');
    checkInput('Fake Name');
    checkInput('dhjdaa');

    // problematic case before the FuseFilter settings fix - "Long String Name" is at the end of a long string in the options
    checkInput('Long String Name');
  });

  it('does not allow searching when isSearchable is false', () => {
    setup({ onChange: cy.stub(), options, isSearchable: false });

    const someInput = 'some input';
    cy.get('input').type(someInput, { force: true });
    cy.contains(someInput).should('not.exist');
  });

  it('closes menu on select when closeMenuOnSelect is true', () => {
    setup({ onChange: cy.stub(), options, closeMenuOnSelect: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[id*=react-select][id$=listbox]').should('exist');
    cy.contains(options[0].text).click();
    cy.get('[id*=react-select][id$=listbox]').should('not.exist');
  });

  it('does not close menu on select when closeMenuOnSelect is false', () => {
    setup({ onChange: cy.stub(), options, closeMenuOnSelect: false });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[id*=react-select][id$=listbox]').should('exist');
    cy.contains(options[0].text).click();
    cy.get('[id*=react-select][id$=listbox]').should('exist');
  });

  it('handles no options provided', () => {
    setup({ onChange: cy.stub(), options: [] });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[id*=react-select][id$=listbox]').children().should('have.length', 1);
    cy.contains('No options').should('exist');
  });

  it('renders custom option when renderOption prop is provided', () => {
    const renderOption = (props) => (
      <div data-testid={`custom-option-${props.data.value}`}>{`Custom ${props.data.text}`}</div>
    );

    setup({ onChange: cy.stub(), options, renderOption });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    options.forEach((option) => {
      cy.contains(option.text).should('exist').and('contain', `Custom ${option.text}`);
    });
  });

  it('positions menu according to menuPlacement prop', () => {
    setup({ onChange: cy.stub(), options, menuPlacement: 'top' });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[id*=react-select][id$=listbox]').then(($el1) => {
      cy.get('[data-testid="core-ui-lib-select"]').then(($el2) => {
        const rect1 = $el1[0].getBoundingClientRect();
        const rect2 = $el2[0].getBoundingClientRect();

        // Assert that element1 is above element2
        expect(rect1.bottom).to.be.lessThan(rect2.top);
      });
    });
  });

  it('calls onBlur when component loses focus', () => {
    const onBlur = cy.stub();
    setup({ onChange: cy.stub(), options, onBlur });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('body').click(0, 0); // Click outside to trigger blur
    cy.wrap(onBlur).should('have.been.calledOnce');
  });

  it('closes menu on scroll when closeMenuOnScroll is true', () => {
    setupScrollableDiv(options);

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.get('[data-testid="last-item"]');
    cy.get('[id*=react-select][id$=listbox]').should('not.exist');
  });

  it('does not close menu on scroll when closeMenuOnScroll is false', () => {
    setupScrollableDiv(options);

    cy.get('[data-testid="core-ui-lib-select"]').click();
    // the below will automatically scroll to the bottom of the div - no need to call scrollTo (stupid Cypress - it shouldn't work like this)
    cy.get('[data-testid="last-item"]');
    cy.get('[id*=react-select][id$=listbox]').should('exist');
  });

  it('handles boolean value', () => {
    const boolOptions = [
      { value: true, text: 'Yes' },
      { value: false, text: 'No' },
    ];
    const onChange = cy.stub();
    setup({ onChange, options: boolOptions });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    // the below will automatically scroll to the bottom of the div - no need to call scrollTo (stupid Cypress - it shouldn't work like this)
    cy.contains('Yes').click();
    cy.wrap(onChange).should('have.been.calledOnceWith', true);

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.contains('No').click();
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

    cy.get('[data-testid="core-ui-lib-select"]').should('contain', '2 items selected');
  });

  it('selects all options when "select_all" option is selected', () => {
    const optionsWithSelectAll = [{ value: 'select_all', text: 'Select All' }, ...options];
    const onChange = cy.stub();
    setup({ onChange, options: optionsWithSelectAll, isMulti: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.contains('Select All').click();

    cy.wrap(onChange).should('have.been.calledOnce');
    cy.wrap(onChange).then((stub) => {
      options
        .map((o) => o.value)
        .forEach((value) => {
          expect(stub.getCall(0).args[0]).to.include(value);
        });
    });

    cy.get('[aria-selected="true"]').should('have.length', options.length + 1); // +1 for the "Select All" option
    cy.get('[data-testid="core-ui-lib-select"]').should('contain', `${options.length} items selected`);
  });

  it('deselects all options when "select_all" option is deselected', () => {
    const optionsWithSelectAll = [{ value: 'select_all', text: 'Select All' }, ...options];
    const onChange = cy.stub();
    setup({ onChange, options: optionsWithSelectAll, isMulti: true });

    cy.get('[data-testid="core-ui-lib-select"]').click();
    cy.contains('Select All').click(); // not a double click - click once and then again to deselect
    cy.get('[id*=react-select-][id$=-option-0]').click(); // deselect - use a different CSS selector as Cypress doesn't like the same one for some reason

    cy.wrap(onChange).should('have.been.calledTwice');
    cy.wrap(onChange).then((stub) => {
      options
        .map((o) => o.value)
        .forEach((value) => {
          expect(stub.getCall(1).args[0]).not.to.deep.include(value);
        });
    });

    cy.get('[aria-selected="true"]').should('not.exist');
  });
});

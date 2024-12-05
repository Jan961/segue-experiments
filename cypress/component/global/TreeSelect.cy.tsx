import { mount } from 'cypress/react';
import TreeSelect from '../../../components/global/TreeSelect';
import { TreeItemOption } from '../../../components/global/TreeSelect/types';
import BaseComp from '../helpers/BaseComp'; // Assuming BaseComp is available

describe('TreeSelect Component', () => {
  const options: TreeItemOption[] = [
    {
      id: '1',
      label: 'Option 1',
      checked: false,
      children: [
        {
          id: '1-1',
          label: 'Option 1-1',
          checked: false,
        },
      ],
    },
    {
      id: '2',
      label: 'Option 2',
      checked: false,
    },
  ];

  function setup(props) {
    mount(
      <BaseComp>
        <TreeSelect {...props} />
      </BaseComp>,
    );
  }

  it('should render the component with given options', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange });
    // Check that the 'Select All' checkbox is rendered
    cy.get('[data-testid="tree-select-select-all"]').should('exist');
    // Check that the options are rendered
    cy.get('[data-testid="tree-item"]').should('have.length', options.length);
  });

  it('should select all options when "Select All" is checked', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange });
    // Click on 'Select All' checkbox
    cy.get('[data-testid="tree-select-select-all"]').find('input').check();
    // All options should be checked
    cy.get('[data-testid="tree-item"]').each(($el) => {
      cy.wrap($el).find('input[type="checkbox"]').should('be.checked');
    });
    // onChange should be called with updated options
    cy.get('@onChange').should('have.been.called');
    cy.get('@onChange').should(
      'have.been.calledWith',
      Cypress.sinon.match((opts) => {
        return opts.every((opt) => opt.checked === true);
      }),
    );
  });

  it('should unselect all options when "Select All" is unchecked', () => {
    const onChange = cy.stub().as('onChange');
    // Start with options all checked
    const checkedOptions = options.map((opt) => ({ ...opt, checked: true }));
    setup({ options: checkedOptions, onChange });
    // 'Select All' should be checked
    cy.get('[data-testid="tree-select-select-all"]').find('input').should('be.checked');
    // Uncheck 'Select All'
    cy.get('[data-testid="tree-select-select-all"]').find('input').uncheck();
    // All options should be unchecked
    cy.get('[data-testid="tree-item"]').each(($el) => {
      cy.wrap($el).find('input[type="checkbox"]').should('not.be.checked');
    });
    // onChange should be called with updated options
    cy.get('@onChange').should('have.been.called');
    cy.get('@onChange').should(
      'have.been.calledWith',
      Cypress.sinon.match((opts) => {
        return opts.every((opt) => opt.checked === false);
      }),
    );
  });

  it('should update "Select All" checkbox state when individual options are selected/unselected', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange });
    // Initially, 'Select All' should be unchecked
    cy.get('[data-testid="tree-select-select-all"]').find('input').should('not.be.checked');
    // Check an individual option
    cy.get('[data-testid="tree-item"]').first().find('input[type="checkbox"]').check();
    // 'Select All' should still be unchecked
    cy.get('[data-testid="tree-select-select-all"]').find('input').should('not.be.checked');
    // Check all options
    cy.get('[data-testid="tree-item"]').find('input[type="checkbox"]').check({ multiple: true });
    // 'Select All' should be checked
    cy.get('[data-testid="tree-select-select-all"]').find('input').should('be.checked');
  });

  it('should disable all options when disabled prop is true', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange, disabled: true });
    // 'Select All' should be disabled
    cy.get('[data-testid="tree-select-select-all"]').find('input').should('be.disabled');
    // All options should be disabled
    cy.get('[data-testid="tree-item"]').each(($el) => {
      cy.wrap($el).find('input[type="checkbox"]').should('be.disabled');
    });
  });

  it('should pass defaultOpen prop to TreeItem components', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange, defaultOpen: true });
    // Assuming TreeItem has a class or attribute indicating open state
    cy.get('[data-testid="tree-item"]').each(($el) => {
      cy.wrap($el).should('have.class', 'open');
    });
  });

  it('should update when options prop changes', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange });
    // Initial options are rendered
    cy.get('[data-testid="tree-item"]').should('have.length', options.length);
    // Now, update options by remounting component with new props
    const newOptions = [
      ...options,
      {
        id: '3',
        label: 'Option 3',
        checked: false,
      },
    ];
    mount(
      <BaseComp>
        <TreeSelect options={newOptions} onChange={onChange} />
      </BaseComp>,
    );
    // Now, options should be updated
    cy.get('[data-testid="tree-item"]').should('have.length', newOptions.length);
  });
});

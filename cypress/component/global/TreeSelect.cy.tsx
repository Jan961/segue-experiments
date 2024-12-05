import { mount } from 'cypress/react18';
import TreeSelect from '../../../components/global/TreeSelect';
import { TreeItemOption } from '../../../components/global/TreeSelect/types';
import BaseComp from '../helpers/BaseComp'; // Assuming BaseComp is available
import options from '../helpers/TreeSelectOptions';

describe('TreeSelect Component', () => {
  function setup(props) {
    mount(
      <BaseComp>
        <TreeSelect {...props} />
      </BaseComp>,
    );
  }

  function expandAll() {
    cy.get('[data-testid="tree-item-close"]').click({ multiple: true });
    // break up the clicks avoid cypress errors
    cy.get('[data-testid="tree-item-close"]').eq(0).click();
    cy.get('[data-testid="tree-item-close"]').click();
  }

  it('should render the component with given options', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange });
    // Check that the 'Select All' checkbox is rendered
    cy.get('[data-testid="tree-select-select-all"]').should('exist');
    // Check that the options are rendered - +1 for 'Select All'
    cy.get('[id*="form-input-checkbox"]').should('have.length', options.length + 1);
  });

  it('should select all options when "Select All" is checked', () => {
    const onChange = cy.stub().as('onChange');
    setup({ options, onChange });
    // Click on 'Select All' checkbox
    cy.get('#form-input-checkbox-select-all').check();
    // Expand all options and see if they are checked
    expandAll();
    cy.get('input[type="checkbox"]').each(($el) => {
      cy.wrap($el).should('be.checked');
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

    setup({ options, onChange });
    expandAll();

    // check some options
    cy.get('input[type="checkbox"]').eq(3).click();
    cy.get('input[type="checkbox"]').eq(4).click();
    cy.get('input[type="checkbox"]').eq(7).click();
    cy.get('input[type="checkbox"]').eq(10).click();

    //Click  'Select All' twice
    cy.get('[data-testid="tree-select-select-all"]').click().click();

    // All options should be unchecked
    cy.get('input[type="checkbox"]').each(($el) => {
      cy.wrap($el).should('not.be.checked');
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
    cy.get('[data-testid="tree-select-select-all"]').should('not.be.checked');
    expandAll();
    // select the two top-level options
    cy.get('[data-testid="Option 1"]').click();
    cy.get('[data-testid="Option 2"]').click();

    // All checkboxes, including 'Select All', should be checked
    cy.get('input[type="checkbox"]').each(($el) => {
      cy.wrap($el).should('be.checked');
    });

    // Uncheck one grandchild option
    cy.get('[data-testid="Option 1-1-1"]').click();
    // 'Select All' should be unchecked
    cy.get('[data-testid="tree-select-select-all"]').should('not.be.checked');
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
        value: 'Option 3',
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

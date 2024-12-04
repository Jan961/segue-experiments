// TreeItem.spec.tsx
import { mount } from 'cypress/react';
import TreeItem from '../../../components/global/TreeSelect/TreeItem';
import { TreeItemOption } from '../../../components/global/TreeSelect/types';

// Assuming BaseComp is a wrapper component needed for the tests
import BaseComp from '../helpers/BaseComp';

// Define the setup function as specified
function setup(props) {
  mount(
    <BaseComp>
      <TreeItem {...props} />
    </BaseComp>,
  );
}

describe('TreeItem Component', () => {
  it('renders correctly when it is a leaf node', () => {
    const leafNode: TreeItemOption = {
      id: 'leaf-1',
      value: 'Leaf Node',
      label: 'Leaf Node',
      checked: false,
      disabled: false,
      groupHeader: false,
    };

    const onChange = cy.stub();

    setup({ value: leafNode, onChange, defaultOpen: false });

    // Check that the checkbox and label are rendered
    cy.get(`input[type="checkbox"][id="${leafNode.id}"]`).should('exist');
    cy.contains(leafNode.label).should('exist');

    // Disclosure buttons should not be present for leaf nodes
    cy.get('[data-testid="tree-item-open"]').should('not.exist');
    cy.get('[data-testid="tree-item-close"]').should('not.exist');
  });

  it('renders correctly when it is a non-leaf node', () => {
    const nonLeafNode: TreeItemOption = {
      value: 'Parent Node',
      id: 'nonleaf-1',
      label: 'Non-Leaf Node',
      checked: false,
      disabled: false,
      groupHeader: false,
      options: [
        {
          id: 'child-1',
          value: 'Leaf Node',
          label: 'Child Node 1',
          checked: false,
          disabled: false,
        },
        {
          id: 'child-2',
          value: 'Leaf Node',
          label: 'Child Node 2',
          checked: false,
          disabled: false,
        },
      ],
    };

    const onChange = cy.stub();

    setup({ value: nonLeafNode, onChange, defaultOpen: false });

    // Check that the checkbox and label are rendered
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).should('exist');
    cy.contains(nonLeafNode.label).should('exist');

    // Disclosure button should be present for non-leaf nodes
    cy.get('[data-testid="tree-item-close"]').should('exist');

    // Children should not be visible initially
    cy.contains('Child Node 1').should('not.be.visible');
    cy.contains('Child Node 2').should('not.be.visible');
  });

  it('toggles children visibility when disclosure button is clicked', () => {
    const nonLeafNode: TreeItemOption = {
      id: 'nonleaf-2',
      value: 'Parent Node',
      label: 'Expandable Node',
      checked: false,
      disabled: false,
      groupHeader: false,
      options: [
        {
          id: 'child-3',
          value: 'Leaf Node',
          label: 'Child Node 3',
          checked: false,
          disabled: false,
        },
      ],
    };

    const onChange = cy.stub();

    setup({ value: nonLeafNode, onChange, defaultOpen: false });

    // Children should not be visible initially
    cy.contains('Child Node 3').should('not.be.visible');

    // Click the disclosure button to open
    cy.get('[data-testid="tree-item-close"]').click();

    // Now, children should be visible
    cy.contains('Child Node 3').should('be.visible');

    // The disclosure icon should have changed
    cy.get('[data-testid="tree-item-open"]').should('exist');
    cy.get('[data-testid="tree-item-close"]').should('not.exist');

    // Click the disclosure button to close
    cy.get('[data-testid="tree-item-open"]').click();

    // Children should not be visible again
    cy.contains('Child Node 3').should('not.be.visible');
  });

  it('calls onChange with correct value when a leaf node is selected', () => {
    const leafNode: TreeItemOption = {
      id: 'leaf-2',
      label: 'Selectable Leaf Node',
      value: 'Leaf Node',
      checked: false,
      disabled: false,
      groupHeader: false,
    };

    const onChange = cy.stub().as('onChange');

    setup({ value: leafNode, onChange, defaultOpen: false });

    // Click on the checkbox
    cy.get(`input[type="checkbox"][id="${leafNode.id}"]`).click();

    // Assert that onChange was called once
    cy.get('@onChange').should('have.been.calledOnce');

    // Get the argument passed to onChange
    cy.get('@onChange').then(() => {
      const args = onChange.getCall(0).args[0];
      expect(args).to.deep.equal({ ...leafNode, checked: true, isPartiallySelected: false });
    });
  });

  it('selects all children when a non-leaf node is selected', () => {
    const nonLeafNode: TreeItemOption = {
      id: 'nonleaf-3',
      value: 'Parent Node',
      label: 'Parent Node',
      checked: false,
      disabled: false,
      groupHeader: false,
      options: [
        {
          id: 'child-4',
          label: 'Child Node 4',
          value: 'Leaf Node 1',
          checked: false,
          disabled: false,
        },
        {
          id: 'child-5',
          value: 'Leaf Node 2',
          label: 'Child Node 5',
          checked: false,
          disabled: false,
        },
      ],
    };

    const onChange = cy.stub().as('onChange');

    setup({ value: nonLeafNode, onChange, defaultOpen: true });

    // Click on the parent checkbox
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).click();

    // Assert that onChange was called
    cy.get('@onChange').should('have.been.calledOnce');

    // Children checkboxes should now be checked
    nonLeafNode.options.forEach((child) => {
      cy.get(`input[type="checkbox"][id="${child.id}"]`).should('be.checked');
    });
  });

  it('updates parent state to intermediate when some children are selected', () => {
    const nonLeafNode: TreeItemOption = {
      id: 'nonleaf-4',
      label: 'Partial Parent',
      value: 'Parent Node',
      checked: false,
      disabled: false,
      groupHeader: false,
      options: [
        {
          id: 'child-6',
          label: 'Child Node 6',
          value: 'Leaf Node 1',
          checked: false,
          disabled: false,
        },
        {
          id: 'child-7',
          label: 'Child Node 7',
          value: 'Leaf Node 2',
          checked: false,
          disabled: false,
        },
      ],
    };

    const onChange = cy.stub().as('onChange');

    setup({ value: nonLeafNode, onChange, defaultOpen: true });

    // Select one child
    cy.get(`input[type="checkbox"][id="child-6"]`).click();

    // Parent should now be in intermediate state
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).should('have.prop', 'indeterminate', true);

    // Parent checkbox should not be checked
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).should('not.be.checked');
  });

  it('does not allow interaction with disabled nodes', () => {
    const leafNode: TreeItemOption = {
      id: 'leaf-3',
      value: 'Leaf Node 1',
      label: 'Disabled Leaf Node',
      checked: false,
      disabled: true,
      groupHeader: false,
    };

    const onChange = cy.stub();

    setup({ value: leafNode, onChange, defaultOpen: false });

    // The checkbox should be disabled
    cy.get(`input[type="checkbox"][id="${leafNode.id}"]`).should('be.disabled');

    // Attempt to click the checkbox
    cy.get(`input[type="checkbox"][id="${leafNode.id}"]`).click({ force: true });

    // onChange should not have been called
    expect(onChange).not.to.have.been.called;
  });

  it('applies correct styling when groupHeader is true', () => {
    const leafNode: TreeItemOption = {
      id: 'leaf-4',
      value: 'Leaf Node 1',
      label: 'Group Header Node',
      checked: false,
      disabled: false,
      groupHeader: true,
    };

    const onChange = cy.stub();

    setup({ value: leafNode, onChange, defaultOpen: false });

    // The label should have the 'font-semibold' class
    cy.contains(leafNode.label).should('have.class', 'font-semibold');
  });

  it('applies correct styling when node is disabled', () => {
    const leafNode: TreeItemOption = {
      id: 'leaf-5',
      value: 'Leaf Node 1',
      label: 'Disabled Node',
      checked: false,
      disabled: true,
      groupHeader: false,
    };

    const onChange = cy.stub();

    setup({ value: leafNode, onChange, defaultOpen: false });

    // The label should have the 'bg-disabled-input' class
    cy.contains(leafNode.label).should('have.class', 'bg-disabled-input');
  });

  it('opens non-leaf node when defaultOpen is true', () => {
    const nonLeafNode: TreeItemOption = {
      id: 'nonleaf-5',
      value: 'Parent Node 1',
      label: 'Default Open Node',
      checked: false,
      disabled: false,
      groupHeader: false,
      options: [
        {
          id: 'child-8',
          value: 'Leaf Node 1',
          label: 'Child Node 8',
          checked: false,
          disabled: false,
        },
      ],
    };

    const onChange = cy.stub();

    setup({ value: nonLeafNode, onChange, defaultOpen: true });

    // Child should be visible
    cy.contains('Child Node 8').should('be.visible');

    // The disclosure icon should indicate open state
    cy.get('[data-testid="tree-item-open"]').should('exist');
  });

  it('updates parent to checked state when all children are selected', () => {
    const nonLeafNode: TreeItemOption = {
      id: 'nonleaf-6',
      value: 'Parent Node 2',
      label: 'Select All Parent',
      checked: false,
      disabled: false,
      groupHeader: false,
      options: [
        {
          id: 'child-9',
          value: 'Leaf Node 1',
          label: 'Child Node 9',
          checked: false,
          disabled: false,
        },
        {
          id: 'child-10',
          value: 'Leaf Node 2',
          label: 'Child Node 10',
          checked: false,
          disabled: false,
        },
      ],
    };

    const onChange = cy.stub().as('onChange');

    setup({ value: nonLeafNode, onChange, defaultOpen: true });

    // Select all children
    nonLeafNode.options.forEach((child) => {
      cy.get(`input[type="checkbox"][id="${child.id}"]`).click();
    });

    // Parent should now be checked
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).should('be.checked');

    // Parent should not be in intermediate state
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).should('have.prop', 'indeterminate', false);
  });

  it('updates parent to unchecked state when all children are deselected', () => {
    const nonLeafNode: TreeItemOption = {
      id: 'nonleaf-7',
      value: 'Parent Node 3',
      label: 'Deselect All Parent',
      checked: true,
      disabled: false,
      groupHeader: false,
      options: [
        {
          id: 'child-11',
          value: 'Leaf Node 1',
          label: 'Child Node 11',
          checked: true,
          disabled: false,
        },
        {
          id: 'child-12',
          value: 'Leaf Node 2',
          label: 'Child Node 12',
          checked: true,
          disabled: false,
        },
      ],
    };

    const onChange = cy.stub().as('onChange');

    setup({ value: nonLeafNode, onChange, defaultOpen: true });

    // Deselect all children
    nonLeafNode.options.forEach((child) => {
      cy.get(`input[type="checkbox"][id="${child.id}"]`).click();
    });

    // Parent should now be unchecked
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).should('not.be.checked');

    // Parent should not be in intermediate state
    cy.get(`input[type="checkbox"][id="${nonLeafNode.id}"]`).should('have.prop', 'indeterminate', false);
  });

  it('maintains correct state when nodes are dynamically updated', () => {
    const dynamicNode: TreeItemOption = {
      id: 'nonleaf-8',
      value: 'Dynamic Node',
      label: 'Dynamic Node',
      checked: false,
      disabled: false,
      groupHeader: false,
      options: [],
    };

    const onChange = cy.stub();

    setup({ value: dynamicNode, onChange, defaultOpen: true });

    // Initially, no children should be present
    cy.get(`input[type="checkbox"][id="${dynamicNode.id}"]`).should('exist');
    cy.get('input[type="checkbox"]').should('have.length', 1);

    // Simulate adding a child node dynamically
    dynamicNode.options.push({
      id: 'child-13',
      value: 'Leaf Node 1',
      label: 'Child Node 13',
      checked: false,
      disabled: false,
    });

    setup({ value: dynamicNode, onChange, defaultOpen: true });

    // New child should be rendered
    cy.get('input[type="checkbox"]').should('have.length', 2);
    cy.contains('Child Node 13').should('exist');
  });
});

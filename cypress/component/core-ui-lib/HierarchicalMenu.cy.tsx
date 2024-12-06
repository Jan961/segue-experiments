// HierarchicalMenu.spec.tsx

import { mount } from 'cypress/react18';
import HierarchicalMenu from '../../../components/core-ui-lib/HierarchicalMenu';
import BaseComp from '../global/BaseComp';
import { useEffect, useState } from 'react';

function setup(props, ref = null) {
  mount(
    <BaseComp>
      <HierarchicalMenu ref={ref} {...props} />
    </BaseComp>,
  );
}

describe('HierarchicalMenu Component', () => {
  it('renders the menu options', () => {
    const options = [
      {
        value: '1',
        label: 'Option 1',
        options: [{ value: '1-1', label: 'Option 1-1' }],
      },
      { value: '2', label: 'Option 2', options: [{ value: '2-1', label: 'Option 2-1' }] },
    ];

    setup({ options });

    cy.contains('Option 1').should('exist');
    cy.contains('Option 2').should('exist');
    cy.contains('Option 1-1').should('not.exist');
    cy.contains('Option 2-1').should('not.exist');
  });

  it('calls onClick when a menu item is clicked', () => {
    const options = [{ value: '1', label: 'Option 1' }];

    const handleMenuClick = (option) => {
      if (option) {
        console.log('option', option);
        expect(option).to.have.property('value', '1');
        expect(option).to.have.property('label', 'Option 1');
      }
    };

    setup({ options, onClick: handleMenuClick });

    cy.contains('Option 1').click();
    // Cypress.sinon.assert.calledWith(onClick, Cypress.sinon.match({ value: 1, label: 'Option 1' }));

    // cy.get('@handleClick').should('have.been.calledOnce');
    // cy.get('@handleClick').should('have.been.calledWith', Cypress.sinon.match({ value: 1, label: 'Option 1' }));
  });

  it('calls onToggle when a menu item is toggled', () => {
    const options = [
      {
        value: '1',
        label: 'Option 1',
        options: [{ value: '1-1', label: 'Option 1-1' }],
      },
    ];
    const onToggle = cy.stub();

    setup({ options, onToggle });

    cy.contains('Option 1').next().click();
    cy.wrap(onToggle).should('have.been.called');
  });

  it('expandParentAndChildren method expands parent and its children', () => {
    const options = [
      {
        value: '1',
        label: 'Option 1',
        options: [
          { value: '1-1', label: 'Option 1-1' },
          { value: '1-2', label: 'Option 1-2' },
        ],
      },
      {
        value: '2',
        label: 'Option 2',
        options: [{ value: '2-1', label: 'Option 2-1' }],
      },
    ];
    const onToggle = cy.stub(); // set up a mock function that is passed to the component as a prop
    setup({ options, onToggle }); // mount the component with the options and onToggle prop

    cy.contains('Option 1').next().click();

    // check that the onToggle function passed to the component was called
    cy.wrap(onToggle).should('have.been.called');

    // check if the internal HierarchicalMenu onToggle was called and executed correctly
    cy.contains('Option 1').should('exist');
    cy.contains('Option 1-1').should('be.visible');
    cy.contains('Option 1-2').should('be.visible');
    cy.contains('Option 2-1').should('not.exist');
  });

  it('applies the className prop', () => {
    const options = [];
    const className = 'test-class';

    setup({ options, className });

    cy.get('.test-class').should('exist');
  });

  it('updates when options prop changes', () => {
    const options1 = [{ value: '1', label: 'Option 1' }];
    const options2 = [{ value: '2', label: 'Option 2' }];

    const TestComponent = () => {
      const [options, setOptions] = useState(options1);

      useEffect(() => {
        setTimeout(() => {
          setOptions(options2);
        }, 1000);
      }, []);

      return (
        <BaseComp>
          <HierarchicalMenu options={options} />
        </BaseComp>
      );
    };

    mount(<TestComponent />);

    cy.contains('Option 1').should('exist');
    cy.contains('Option 2').should('not.exist');

    cy.wait(1000);

    cy.contains('Option 1').should('not.exist');
    cy.contains('Option 2').should('exist');
  });

  it("contents don't overflow the container with 3 levels of hierarchy", () => {
    const options = [
      {
        value: '1',
        label: 'Option 1',
        options: [
          {
            value: '1-1',
            label: 'Option 1-1',
            options: [{ value: '1-1-1', label: 'Option 1-1-1' }],
          },
        ],
      },
    ];

    setup({ options });

    cy.contains('Option 1').next().click();
    cy.contains('Option 1-1').next().click();
    cy.contains('Option 1-1-1').should('be.visible');

    cy.contains('Option 1')
      .parent()
      .parent()
      .then(($parent) => {
        const elements = ['Option 1', 'Option 1-1', 'Option 1-1-1'];

        elements.forEach((el) => {
          it(`should ensure that "${el}" is not overflowing its parent`, () => {
            // Select the element by its text content
            cy.contains(el).then(($child) => {
              // Get the parent element
              cy.wrap($child)
                .should('not.be.undefined')
                .parent()
                .then(($parent) => {
                  const parentRect = $parent[0].getBoundingClientRect();
                  const childRect = $child[0].getBoundingClientRect();

                  // Assert that the child's edges are within the parent's edges
                  expect(childRect.top).to.be.at.least(parentRect.top);
                  expect(childRect.left).to.be.at.least(parentRect.left);
                  expect(childRect.bottom).to.be.at.most(parentRect.bottom);
                  expect(childRect.right).to.be.at.most(parentRect.right);
                });
            });
          });
        });
      });
  });
});

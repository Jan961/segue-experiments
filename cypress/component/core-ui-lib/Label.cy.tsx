// Label.spec.tsx
import { mount } from 'cypress/react18';
import Label from '../../../components/core-ui-lib/Label/Label';
import BaseComp from '../global/BaseComp'; // Adjust the import path as needed

// Define the setup function for mounting the component
function setup(props) {
  mount(
    <BaseComp>
      <Label {...props} />
    </BaseComp>,
  );
}

describe('Label Component', () => {
  const baseProps = {
    text: 'Test Label',
  };

  it('renders the label with the given text', () => {
    setup(baseProps);
    cy.get('label').should('contain.text', baseProps.text);
  });

  ['xs', 'sm', 'md', 'lg'].forEach((variant) => {
    it(`applies the correct class for variant '${variant}'`, () => {
      const labelClassMap = {
        xs: 'text-xs',
        sm: 'text-sm leading-8 font-normal',
        md: 'text-base',
        lg: 'text-lg',
      };
      setup({ ...baseProps, variant });
      const expectedClasses = labelClassMap[variant].split(' ');
      expectedClasses.forEach((expectedClass) => {
        cy.get('label').should('have.class', expectedClass);
      });
    });
  });

  it('includes the required asterisk when required is true', () => {
    setup({ ...baseProps, required: true });
    cy.get('label sup').should('exist').and('have.text', '*').and('have.css', 'color', 'rgb(212, 24, 24)'); // Assuming the color is #D41818
  });

  it('does not include the required asterisk when required is false', () => {
    setup({ ...baseProps, required: false });
    cy.get('label sup').should('not.exist');
  });

  it('applies additional className when className prop is provided', () => {
    const additionalClass = 'additional-class';
    setup({ ...baseProps, className: additionalClass });
    cy.get('label').should('have.class', additionalClass);
  });

  it('sets the htmlFor attribute when htmlFor prop is provided', () => {
    const htmlForValue = 'input-id';
    setup({ ...baseProps, htmlFor: htmlForValue });
    cy.get('label').should('have.attr', 'for', htmlForValue);
  });

  it('sets the data-testid attribute when testId prop is provided', () => {
    const testIdValue = 'label-test-id';
    setup({ ...baseProps, testId: testIdValue });
    cy.get(`[data-testid="${testIdValue}"]`).should('exist');
  });
});

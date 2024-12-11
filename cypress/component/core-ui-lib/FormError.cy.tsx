import { mount } from 'cypress/react18';
import FormError from '../../../components/core-ui-lib/FormError';

describe('FormError Component', () => {
  it('renders the component with the error message', () => {
    const errorMessage = 'This field is required.';
    mount(<FormError error={errorMessage} />);
    cy.get('p').should('contain.text', errorMessage);
  });

  it('applies the default variant class when none is provided', () => {
    mount(<FormError error="Error message" />);
    cy.get('p').should('have.class', 'text-xs');
  });

  it('applies the correct class for each variant', () => {
    const variants = ['xs', 'sm', 'md', 'lg'] as const;
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    variants.forEach((variant) => {
      mount(<FormError error="Error message" variant={variant} />);
      cy.get('p')
        .should('have.class', sizeClasses[variant])
        .and('have.class', 'text-primary-red')
        .and('have.class', 'font-calibri');
    });
  });

  it('applies additional className when provided', () => {
    const additionalClass = 'custom-class';
    mount(<FormError error="Error message" className={additionalClass} />);
    cy.get('p').should('have.class', additionalClass);
  });

  it('uses the testId prop when provided', () => {
    const customTestId = 'custom-form-error';
    mount(<FormError error="Error message" testId={customTestId} />);
    cy.get(`[data-testid="${customTestId}"]`).should('exist');
  });

  it('handles an invalid variant by not applying a size class', () => {
    // Assuming that invalid variants result in no size class being applied
    mount(<FormError error="Error message" variant="invalid" />);
    cy.get('p')
      .should('not.have.class', 'text-xs')
      .and('not.have.class', 'text-sm')
      .and('not.have.class', 'text-base')
      .and('not.have.class', 'text-lg');
  });

  it('renders correctly with all props provided', () => {
    const errorMessage = 'Error message';
    const additionalClass = 'custom-class';
    const customTestId = 'custom-form-error';
    mount(<FormError error={errorMessage} className={additionalClass} variant="md" testId={customTestId} />);
    cy.get(`[data-testid="${customTestId}"]`)
      .should('exist')
      .and('have.class', 'text-base')
      .and('have.class', 'text-primary-red')
      .and('have.class', 'font-calibri')
      .and('have.class', additionalClass)
      .and('contain.text', errorMessage);
  });
});

// cypress/component/LoadingOverlay.spec.js

import { mount } from 'cypress/react18';
import LoadingOverlay from '../../../components/core-ui-lib/LoadingOverlay';
import BaseComp from '../global/BaseComp';

// Define the setup function for mounting the component
function setup(props) {
  mount(
    <BaseComp>
      <LoadingOverlay {...props} />
    </BaseComp>,
  );
}

describe('LoadingOverlay Component', () => {
  it('should render with default props', () => {
    setup({});

    // Check that the overlay is rendered with default testId
    cy.get('[data-testid="loading-overlay"]').should('exist');

    // Check that the Spinner component is rendered
    cy.get('[data-testid="core-ui-lib-spinner-undefined"]').should('exist');
  });

  it('should apply custom className', () => {
    const customClass = 'custom-overlay-class';
    setup({ className: customClass });

    cy.get('[data-testid="loading-overlay"]').should('have.class', customClass);
  });

  it('should use custom testId', () => {
    const customTestId = 'custom-loading-overlay';
    setup({ testId: customTestId });

    cy.get(`[data-testid="${customTestId}"]`).should('exist');
  });

  it('should render Spinner when spinner is true', () => {
    setup({ spinner: true });

    cy.get('[data-testid="core-ui-lib-spinner-undefined"]').should('exist');
    cy.get('[data-testid="core-ui-lib-loader"]').should('not.exist');
  });

  it('should render Loader when spinner is false', () => {
    setup({ spinner: false });

    cy.get('[data-testid="core-ui-lib-loader"]').should('exist');
    cy.get('[data-testid="core-ui-lib-spinner-undefined"]').should('not.exist');
  });

  it('should pass loaderClassName and loaderVariant to Loader', () => {
    const loaderClassName = 'custom-loader-class';
    const loaderVariant = 'lg';

    setup({
      spinner: false,
      loaderClassName,
      loaderVariant,
    });

    cy.get('[data-testid="core-ui-lib-loader"]').should('have.class', loaderClassName);
    cy.get('[data-testid="core-ui-lib-loader"] svg').should('have.attr', 'width', '22px'); // this is the size for 'lg' variant
  });
});

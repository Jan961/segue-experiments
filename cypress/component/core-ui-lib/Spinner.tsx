// Spinner.cy.tsx

import Spinner from '../../../components/core-ui-lib/Spinner';
import { mount } from 'cypress/react';

describe('Spinner Component', () => {
  it('renders correctly with default props and undefined size', () => {
    cy.mount(<Spinner size={undefined} />);
    cy.get('div').should('have.class', 'flex').and('have.class', 'justify-center');
    cy.get('div[data-testid="core-ui-lib-spinner-undefined"] div').should('have.attr', 'role', 'status');
    cy.get('[data-testid="core-ui-lib-spinner-undefined"] span').should(
      'have.class',
      '!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]',
    );
  });

  it('applies correct size classes for size="sm"', () => {
    cy.mount(<Spinner size="sm" />);
    cy.get('div > div')
      .should('have.class', 'h-8 w-8')
      .and('not.have.class', 'h-12 w-12')
      .and('not.have.class', 'h-32 w-32');
  });

  it('applies correct size classes for size="md"', () => {
    cy.mount(<Spinner size="md" />);
    cy.get('div > div')
      .should('have.class', 'h-12 w-12')
      .and('not.have.class', 'h-8 w-8')
      .and('not.have.class', 'h-32 w-32');
  });

  it('applies correct size classes for size="lg"', () => {
    cy.mount(<Spinner size="lg" />);
    cy.get('div > div')
      .should('have.class', 'h-32 w-32')
      .and('not.have.class', 'h-8 w-8')
      .and('not.have.class', 'h-12 w-12');
  });

  it('applies custom className to the outer div', () => {
    cy.mount(<Spinner size="md" className="custom-spinner-class" />);
    cy.get('div')
      .should('have.class', 'flex')
      .and('have.class', 'justify-center')
      .and('have.class', 'custom-spinner-class');
  });

  it('sets the correct data-testid attribute', () => {
    cy.mount(<Spinner size="md" testId="test-spinner" />);
    cy.get('[data-testid="core-ui-lib-spinner-test-spinner"]').should('exist');
  });
});

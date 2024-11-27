import ProgressBar from '../../../components/core-ui-lib/ProgressBar';
import { mount } from 'cypress/react';

describe('ProgressBar Component', () => {
  it('renders the progress bar', () => {
    mount(<ProgressBar progress={50} />);
    cy.get('[data-testid="progress-bar"]').should('exist');
  });

  it('applies default background and fill colors', () => {
    mount(<ProgressBar progress={50} />);
    cy.get('[data-testid="progress-bar-background"]').should('have.class', 'bg-gray-300');
    cy.get('[data-testid="progress-bar-fill"]').should('have.class', 'bg-primary-navy');
  });

  it('applies custom background color', () => {
    mount(<ProgressBar backgroundColor="red" progress={50} />);
    cy.get('[data-testid="progress-bar-background"]')
      .should('not.have.class', 'bg-gray-300')
      .and('have.attr', 'style', 'background-color: red;');
  });

  it('applies custom fill color', () => {
    mount(<ProgressBar fillColor="green" progress={50} />);
    cy.get('[data-testid="progress-bar-fill"]')
      .should('not.have.class', 'bg-primary-navy')
      .and('have.attr', 'style')
      .and('include', 'background-color: green;');
  });

  it('sets the fill width based on progress prop', () => {
    mount(<ProgressBar progress={75} />);
    cy.get('[data-testid="progress-bar-fill"]').should('have.attr', 'style').and('include', 'width: 75%');
  });

  it('handles progress of 0%', () => {
    mount(<ProgressBar progress={0} />);
    cy.get('[data-testid="progress-bar-fill"]').should('have.attr', 'style').and('include', 'width: 0%');
  });

  it('handles progress of 100%', () => {
    mount(<ProgressBar progress={100} />);
    cy.get('[data-testid="progress-bar-fill"]').should('have.attr', 'style').and('include', 'width: 100%');
  });

  it('handles progress less than 0%', () => {
    mount(<ProgressBar progress={-10} />);
    cy.get('[data-testid="progress-bar-fill"]').should('have.attr', 'style').and('include', 'width: 0%');
  });

  it('handles progress greater than 100%', () => {
    mount(<ProgressBar progress={110} />);
    cy.get('[data-testid="progress-bar-fill"]').should('have.attr', 'style').and('include', 'width: 100%');
  });
});

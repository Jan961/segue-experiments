// PasswordInput.spec.jsx

import { mount } from 'cypress/react';
import PasswordInput from '../../../components/core-ui-lib/PasswordInput';
import { useState } from 'react';

describe('PasswordInput Component', () => {
  const value = 'password';

  it('renders correctly with default props', () => {
    mount(<PasswordInput />);
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');
    cy.get('[data-testid="password-input-icon"]').should('exist');
  });

  it('toggles password visibility when icon is clicked', () => {
    mount(<PasswordInput value={value} />);
    // Initially, the password should be hidden
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');

    // Click the icon to show the password
    cy.get('[data-testid="password-input-icon"]').click();
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text');

    // Click the icon again to hide the password
    cy.get('[data-testid="password-input-icon"]').click();
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');
  });

  it('does not toggle visibility when disabled', () => {
    mount(<PasswordInput value={value} disabled />);
    cy.get('[data-testid="password-input"]').should('be.disabled');
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');

    // Attempt to click the icon
    cy.get('[data-testid="password-input-icon"]').click();
    // The type should remain 'password'
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');
  });

  it('accepts and displays a placeholder', () => {
    const placeholderText = 'Enter your password';
    mount(<PasswordInput placeholder={placeholderText} />);
    cy.get('[data-testid="password-input"]').should('have.attr', 'placeholder', placeholderText);
  });

  it('applies custom class names', () => {
    const customClass = 'custom-password-input';
    mount(<PasswordInput className={customClass} />);
    cy.get(`.${customClass}`).should('exist');
  });

  it('focuses the input when clicked', () => {
    mount(<PasswordInput />);
    cy.get('[data-testid="password-input"]').click().should('be.focused');
  });
});

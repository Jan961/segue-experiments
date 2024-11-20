import { mount } from 'cypress/react18';
import TextArea from '../../../components/core-ui-lib/TextArea';
import { createRef } from 'react';

describe('TextArea Component', () => {
  it('renders the TextArea component', () => {
    mount(<TextArea />);
    cy.get('[data-testid="core-ui-lib-textarea"]').should('exist');
  });

  it('accepts and displays a value', () => {
    const testValue = 'Test value';
    mount(<TextArea value={testValue} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').should('have.value', testValue);
  });

  it('calls onChange when text changes', () => {
    const handleChange = cy.stub().as('handleChange');
    mount(<TextArea onChange={handleChange} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').type('Hello');
    cy.get('@handleChange').should('have.been.called');
  });

  it('applies the placeholder text', () => {
    const placeholderText = 'Enter text here...';
    mount(<TextArea placeholder={placeholderText} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').should('have.attr', 'placeholder', placeholderText);
  });

  it('applies custom className', () => {
    const customClass = 'custom-textarea-class';
    mount(<TextArea className={customClass} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').should('have.class', customClass);
  });

  it('handles the disabled state', () => {
    mount(<TextArea disabled />);
    cy.get('[data-testid="core-ui-lib-textarea"]').should('be.disabled');
  });

  it('calls onClick when clicked', () => {
    const handleClick = cy.stub().as('handleClick');
    mount(<TextArea onClick={handleClick} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').click();
    cy.get('@handleClick').should('have.been.called');
  });

  it('calls onBlur when focus is lost', () => {
    const handleBlur = cy.stub().as('handleBlur');
    mount(<TextArea onBlur={handleBlur} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').focus().blur();
    cy.get('@handleBlur').should('have.been.called');
  });

  it('forwards the ref correctly', () => {
    const ref = createRef<HTMLTextAreaElement>();
    mount(<TextArea ref={ref} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').then(($el) => {
      expect(ref.current).to.equal($el[0]);
    });
  });

  it('uses the testId prop when provided', () => {
    const customTestId = 'custom-textarea-testid';
    mount(<TextArea testId={customTestId} />);
    cy.get(`[data-testid="${customTestId}"]`).should('exist');
  });

  it('applies the name and id attributes', () => {
    const testName = 'test-textarea';
    const testId = 'test-textarea-id';
    mount(<TextArea name={testName} id={testId} />);
    cy.get('[data-testid="core-ui-lib-textarea"]').should('have.attr', 'name', testName);
    cy.get('[data-testid="core-ui-lib-textarea"]').should('have.attr', 'id', testId);
  });
});

// cypress/component/Toggle.spec.tsx

import React from 'react';
import { mount } from 'cypress/react18';
import Toggle from '../../../components/core-ui-lib/Toggle';

describe('Toggle Component', () => {
  it('renders correctly', () => {
    const onChange = cy.stub();
    mount(<Toggle checked={false} onChange={onChange} />);
    cy.get('[data-testid="core-ui-lib-toggle"]').should('exist');
  });

  it('is unchecked when "checked" prop is false', () => {
    const onChange = cy.stub();
    mount(<Toggle checked={false} onChange={onChange} />);
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-0');
  });

  it('is checked when "checked" prop is true', () => {
    const onChange = cy.stub();
    mount(<Toggle checked={true} onChange={onChange} />);
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-2');
  });

  it('calls onChange with correct value when toggled', () => {
    const onChange = cy.stub();
    mount(<Toggle checked={false} onChange={onChange} />);
    cy.get('[data-testid="core-ui-lib-toggle"]').click();
    cy.wrap(onChange).should('have.been.calledOnceWith', true);
  });

  it('updates when "checked" prop changes', () => {
    function ToggleWrapper() {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <button onClick={() => setChecked(!checked)}>Toggle Prop</button>
          <Toggle checked={checked} onChange={() => {}} />
        </>
      );
    }
    mount(<ToggleWrapper />);
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-0');
    cy.contains('Toggle Prop').click();
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-2');
  });

  it('renders with label when label prop is provided', () => {
    const onChange = cy.stub();
    mount(<Toggle checked={false} onChange={onChange} label="Test Label" />);
    cy.get('[data-testid="core-ui-lib-toggle"] .sr-only').should('have.text', 'Test Label');
  });

  it('applies className prop', () => {
    const onChange = cy.stub();
    mount(<Toggle checked={false} onChange={onChange} className="test-class" />);
    cy.get('[data-testid="core-ui-lib-toggle"]').should('have.class', 'test-class');
  });

  it('uses testId or name prop for data-testid', () => {
    const onChange = cy.stub();
    mount(<Toggle checked={false} onChange={onChange} name="test-toggle" />);
    cy.get('[data-testid="test-toggle"]').should('exist');
  });
});

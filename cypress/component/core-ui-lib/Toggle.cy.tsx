// cypress/component/Toggle.spec.tsx
import { mount } from 'cypress/react18';
import Toggle from '../../../components/core-ui-lib/Toggle';
import BaseComp from '../helpers/BaseComp';
import { useState } from 'react';

describe('Toggle Component Tests', () => {
  it('renders correctly', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange, label: 'Test Label', name: 'test-toggle' };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="test-toggle"]').should('exist');
    cy.get('[data-testid="test-toggle"] .sr-only').should('have.text', 'Test Label');
  });

  it('is unchecked when "checked" prop is false', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"]').should('have.attr', 'aria-checked', 'false');
  });

  it('is checked when "checked" prop is true', () => {
    const onChange = cy.stub();
    const props = { checked: true, onChange };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"]').should('have.attr', 'aria-checked', 'true');
  });

  it('calls onChange with correct value when Wrapped', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"]').click();
    cy.wrap(onChange).should('have.been.calledOnceWith', true);
  });

  it('updates when "checked" prop changes', () => {
    function NoOnChangeWrapper() {
      const [checked, setChecked] = useState(false);
      return (
        <BaseComp>
          <button onClick={() => setChecked(!checked)}>Toggle Prop</button>
          <Toggle checked={checked} onChange={() => {}} />
        </BaseComp>
      );
    }

    mount(<NoOnChangeWrapper />);
    cy.get('[data-testid="core-ui-lib-toggle"]').should('have.attr', 'aria-checked', 'false');
    cy.contains('Toggle Prop').click();
    cy.get('[data-testid="core-ui-lib-toggle"]').should('have.attr', 'aria-checked', 'true');
  });

  it('applies className prop', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange, className: 'test-class' };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"]').should('have.class', 'test-class');
  });
});

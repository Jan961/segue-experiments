// cypress/component/Toggle.spec.tsx
import { mount } from 'cypress/react18';
import Toggle from '../../../components/core-ui-lib/Toggle';
import BaseComp from '../global/BaseComp';
import { useState } from 'react';

describe('Toggle Component Tests', () => {
  it('renders correctly', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"]').should('exist');
  });

  it('is unchecked when "checked" prop is false', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-0');
  });

  it('is checked when "checked" prop is true', () => {
    const onChange = cy.stub();
    const props = { checked: true, onChange };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-2');
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
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-0');
    cy.contains('Toggle Prop').click();
    cy.get('[data-testid="core-ui-lib-toggle"] span[aria-hidden="true"]').should('have.class', 'translate-x-2');
  });

  it('renders with label when label prop is provided', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange, label: 'Test Label' };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-toggle"] .sr-only').should('have.text', 'Test Label');
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

  it('uses testId or name prop for data-testid', () => {
    const onChange = cy.stub();
    const props = { checked: false, onChange, name: 'test-toggle' };
    mount(
      <BaseComp>
        <Toggle {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="test-toggle"]').should('exist');
  });
});

// cypress/component/Checkbox.spec.tsx

import { mount } from 'cypress/react18';
import Checkbox from '../../../components/core-ui-lib/Checkbox';
import { useState } from 'react';
import BaseComp from '../helpers/BaseComp';

describe('Checkbox Component', () => {
  it('renders correctly', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').should('exist');
  });

  it('is unchecked by default', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').should('not.be.checked');
  });

  it('reflects the "checked" prop', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} checked />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').should('be.checked');
  });

  it('calls onChange with correct value when clicked', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').click();
    cy.wrap(onChange).should('have.been.calledOnce');
    cy.wrap(onChange).its('firstCall.args.0.target.value').should('equal', true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} disabled />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').should('be.disabled');
  });

  it('shows indeterminate state when "showIntermediate" is true', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} showIntermediate />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').should(($el) => {
      const input = $el[0] as HTMLInputElement;
      expect(input.indeterminate).to.be.true;
    });
    cy.get('svg').should('exist');
  });

  it('updates indeterminate state when "showIntermediate" prop changes', () => {
    function CheckboxWrapper() {
      const [intermediate, setIntermediate] = useState(false);
      return (
        <BaseComp>
          <button onClick={() => setIntermediate(!intermediate)}>Toggle Intermediate</button>
          <Checkbox id="test-checkbox" onChange={() => {}} showIntermediate={intermediate} />
        </BaseComp>
      );
    }
    mount(<CheckboxWrapper />);
    cy.get('[data-testid="core-ui-lib-checkbox"]').should(($el) => {
      const input = $el[0] as HTMLInputElement;
      expect(input.indeterminate).to.be.false;
    });
    cy.contains('Toggle Intermediate').click();
    cy.get('[data-testid="core-ui-lib-checkbox"]').should(($el) => {
      const input = $el[0] as HTMLInputElement;
      expect(input.indeterminate).to.be.true;
    });
  });

  it('renders label when "label" prop is provided', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} label="Test Label" />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').next().should('have.text', 'Test Label');
    cy.get('[data-testid="core-ui-lib-checkbox-label"]').should('exist');
  });

  it('applies "className" prop to the wrapper div', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} className="test-class" />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox"]').parent().should('have.class', 'test-class');
  });

  it('applies "labelClassName" prop to the Label component', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} label="Test Label" labelClassName="label-test-class" />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox-label"]').should('have.class', 'label-test-class');
  });

  it('passes "required" prop to the Label component', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} label="Test Label" required />
      </BaseComp>,
    );
    cy.get('[data-testid="core-ui-lib-checkbox-label"]').should('contain.text', 'Test Label').and('contain.text', '*');
  });

  it('uses custom "testId" if provided', () => {
    const onChange = cy.stub();
    mount(
      <BaseComp>
        <Checkbox id="test-checkbox" onChange={onChange} testId="custom-test-id" />
      </BaseComp>,
    );
    cy.get('[data-testid="custom-test-id"]').should('exist');
  });

  it('updates when "checked" prop changes', () => {
    function CheckboxWrapper() {
      const [checked, setChecked] = useState(false);
      return (
        <BaseComp>
          <button onClick={() => setChecked(!checked)}>Toggle Checked</button>
          <Checkbox id="test-checkbox" onChange={() => {}} checked={checked} />
        </BaseComp>
      );
    }
    mount(<CheckboxWrapper />);
    cy.get('[data-testid="core-ui-lib-checkbox"]').should('not.be.checked');
    cy.contains('Toggle Checked').click();
    cy.get('[data-testid="core-ui-lib-checkbox"]').should('be.checked');
  });
});

// cypress/component/TimeInput.spec.ts

import { mount } from 'cypress/react18';
import TimeInput, { TimeInputProps } from '../../../components/core-ui-lib/TimeInput';
import BaseComp from '../global/BaseComp'; // Assuming BaseComp is available
import 'cypress-plugin-tab';
import { useState } from 'react';

function setup(props: TimeInputProps) {
  mount(
    <BaseComp>
      <TimeInput {...props} />
    </BaseComp>,
  );
}

describe('TimeInput Component', () => {
  it('renders correctly with default props', () => {
    setup({ value: '', onChange: cy.spy().as('onChangeSpy') });
    cy.get('[data-testid="hourInput"]').should('exist');
    cy.get('[data-testid="minInput"]').should('exist');
    cy.get('[data-testid="hourInput"]').should('have.attr', 'placeholder', 'hh');
    cy.get('[data-testid="minInput"]').should('have.attr', 'placeholder', 'mm');
  });

  it('updates hours input value when typing', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    setup({ value: '', onChange: onChangeSpy });
    cy.get('[data-testid="hourInput"]').type('12');
    cy.get('[data-testid="hourInput"]').should('have.value', '12');
    cy.get('@onChangeSpy').should('have.been.called');
  });

  it('focus moves to minutes input after typing two digits in hours input', () => {
    setup({ value: '', onChange: cy.spy() });
    cy.get('[data-testid="hourInput"]').type('12');
    cy.focused().should('have.attr', 'data-testid', 'minInput');
  });

  it('updates minutes input value when typing', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    setup({ value: '', onChange: onChangeSpy });
    cy.get('[data-testid="minInput"]').type('30');
    cy.get('[data-testid="minInput"]').should('have.value', '30');
    cy.get('@onChangeSpy').should('have.been.called');
  });

  it('does not allow hours input greater than 23', () => {
    setup({ value: '', onChange: cy.spy() });
    cy.get('[data-testid="hourInput"]').type('25');
    cy.get('[data-testid="hourInput"]').should('have.value', '2');
  });

  it('does not allow minutes input greater than 59', () => {
    setup({ value: '', onChange: cy.spy() });
    cy.get('[data-testid="minInput"]').type('61');
    cy.get('[data-testid="minInput"]').should('have.value', '6');
  });

  it('calls onBlur when input blurs', () => {
    const onBlurSpy = cy.spy().as('onBlurSpy');
    setup({ value: '', onChange: cy.spy(), onBlur: onBlurSpy });
    cy.get('[data-testid="hourInput"]').focus().blur();
    cy.get('@onBlurSpy').should('have.been.called');
  });

  it('calls onInput when input changes, if provided', () => {
    const onInputSpy = cy.stub().as('onInputSpy').returns({ name: 'hrs', value: '12' });
    setup({ value: '', onChange: cy.spy(), onInput: onInputSpy });
    cy.get('[data-testid="hourInput"]').type('12');
    cy.get('@onInputSpy').should('have.been.called');
  });

  it('disables inputs when disabled prop is true', () => {
    setup({ value: '', onChange: cy.spy(), disabled: true });
    cy.get('[data-testid="hourInput"]').should('be.disabled');
    cy.get('[data-testid="minInput"]').should('be.disabled');
  });

  it('applies correct classes when disabled', () => {
    setup({ value: '', onChange: cy.spy(), disabled: true });
    cy.get('[data-testid="hourInput"]').should('have.class', '!bg-gray-200');
    cy.get('[data-testid="minInput"]').should('have.class', '!bg-gray-200');
  });

  it('displays correct values when value prop is provided as string', () => {
    setup({ value: '08:15', onChange: cy.spy() });
    cy.get('[data-testid="hourInput"]').should('have.value', '08');
    cy.get('[data-testid="minInput"]').should('have.value', '15');
  });

  it('displays correct values when value prop is provided as Time object', () => {
    setup({ value: { hrs: '10', min: '45' }, onChange: cy.spy() });
    cy.get('[data-testid="hourInput"]').should('have.value', '10');
    cy.get('[data-testid="minInput"]').should('have.value', '45');
  });

  it('handles empty value prop', () => {
    setup({ value: '', onChange: cy.spy() });
    cy.get('[data-testid="hourInput"]').should('have.value', '');
    cy.get('[data-testid="minInput"]').should('have.value', '');
  });

  it('selects input text on focus', () => {
    setup({ value: '12:30', onChange: cy.spy() });
    cy.get('[data-testid="hourInput"]')
      .focus()
      .then(($input) => {
        const input = $input.get(0);
        expect(input.selectionStart).to.equal(0);
        expect(input.selectionEnd).to.equal(input.value.length);
      });
  });

  it('handles Tab key navigation between inputs', () => {
    setup({ value: '', onChange: cy.spy() });
    cy.get('[data-testid="hourInput"]').focus();
    cy.focused().should('have.attr', 'data-testid', 'hourInput');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'minInput');
  });

  it('calls inputFieldJump when appropriate', () => {
    const inputFieldJumpSpy = cy.spy().as('inputFieldJumpSpy');
    setup({ value: '', onChange: cy.spy(), inputFieldJump: inputFieldJumpSpy });
    cy.get('[data-testid="minInput"]').focus();
    cy.focused().tab();
    cy.get('@inputFieldJumpSpy').should('have.been.calledWith', true);
  });

  it('handles Shift+Tab key navigation', () => {
    setup({ value: '', onChange: cy.spy(), inputFieldJump: cy.spy() });
    cy.get('[data-testid="minInput"]').focus();
    cy.focused().tab({ shift: true });
    cy.focused().should('have.attr', 'data-testid', 'hourInput');
  });

  it('adds leading zero on blur if value is one digit', () => {
    const onBlurSpy = cy.spy().as('onBlurSpy');
    setup({ value: '', onChange: cy.spy(), onBlur: onBlurSpy });
    cy.get('[data-testid="hourInput"]').type('5').blur();
    cy.get('@onBlurSpy').should('have.been.calledWithMatch', { target: { value: '05' } });
  });

  it('sets tabIndex correctly based on tabIndexShow prop', () => {
    setup({ value: '', onChange: cy.spy(), tabIndexShow: true });
    cy.get('[data-testid="hourInput"]').should('have.attr', 'tabIndex', '0');
    cy.get('[data-testid="minInput"]').should('have.attr', 'tabIndex', '0');

    setup({ value: '', onChange: cy.spy(), tabIndexShow: false });
    cy.get('[data-testid="hourInput"]').should('have.attr', 'tabIndex', '1');
    cy.get('[data-testid="minInput"]').should('have.attr', 'tabIndex', '2');
  });

  it('applies className prop to container', () => {
    setup({ value: '', onChange: cy.spy(), className: 'test-class' });
    cy.get('div').should('have.class', 'test-class');
  });

  it('updates inputs when value prop changes', () => {
    const onChangeSpy = cy.spy();
    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <>
          <button onClick={() => setValue('09:45')}>Set Time</button>
          <TimeInput value={value} onChange={onChangeSpy} />
        </>
      );
    };

    mount(<TestComponent />);
    cy.get('[data-testid="hourInput"]').should('have.value', '');
    cy.get('[data-testid="minInput"]').should('have.value', '');
    cy.contains('Set Time').click();
    cy.get('[data-testid="hourInput"]').should('have.value', '09');
    cy.get('[data-testid="minInput"]').should('have.value', '45');
  });
});

// TextInput.cy.js
import TextInput from '../../../components/core-ui-lib/TextInput';
import { mount } from 'cypress/react18';
import { createRef } from 'react';

describe('TextInput Component', () => {
  it('renders without crashing', () => {
    mount(<TextInput />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('exist');
  });

  it('displays the placeholder text', () => {
    const placeholder = 'Enter your name';
    mount(<TextInput placeholder={placeholder} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.attr', 'placeholder', placeholder);
  });

  it('accepts and displays the value prop', () => {
    const value = 'John Doe';
    mount(<TextInput value={value} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.value', value);
  });

  it('calls onChange when input value changes', () => {
    const onChange = cy.stub().as('onChange');
    mount(<TextInput onChange={onChange} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').type('Hello');
    cy.get('@onChange').should('have.been.called');
  });

  it('does not call onChange if pattern does not match', () => {
    const onChange = cy.stub().as('onChange');
    const pattern = /^[A-Z]+$/;
    mount(<TextInput onChange={onChange} pattern={pattern} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').type('hello');
    cy.get('@onChange').should('not.have.been.called');
  });

  it('calls onChange if pattern matches', () => {
    const onChange = cy.stub().as('onChange');
    const pattern = /^[A-Z]+$/;
    mount(<TextInput onChange={onChange} pattern={pattern} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').type('HELLO');
    cy.get('@onChange').should('have.been.called');
  });

  it('renders an icon when iconName is provided', () => {
    mount(<TextInput iconName="search" />);
    cy.get('[data-testid="core-ui-lib-text-input-icon"]').should('exist');
  });

  it('does not render an icon when iconName is not provided', () => {
    mount(<TextInput />);
    cy.get('[data-testid="core-ui-lib-text-input-icon"]').should('not.exist');
  });

  it('disables the input when disabled prop is true', () => {
    mount(<TextInput disabled />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('be.disabled');
  });

  it('applies error class when error prop is provided', () => {
    mount(<TextInput error="Error" />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.class', '!border-primary-red');
  });

  it('prevents value change on wheel event when type is number', () => {
    mount(<TextInput type="number" value="10" />);
    cy.get('[data-testid="core-ui-lib-text-input"]').focus().trigger('wheel', { deltaY: -100 });
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.value', '10');
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    mount(<TextInput ref={ref} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').then(() => {
      expect(ref.current).to.exist;
      expect(ref.current.tagName).to.equal('INPUT');
    });
  });

  it('calls onKeyDown when a key is pressed', () => {
    const onKeyDown = cy.stub().as('onKeyDown');
    mount(<TextInput onKeyDown={onKeyDown} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').type('a');
    cy.get('@onKeyDown').should('have.been.called');
  });

  it('calls onFocus when input is focused', () => {
    const onFocus = cy.stub().as('onFocus');
    mount(<TextInput onFocus={onFocus} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').focus();
    cy.get('@onFocus').should('have.been.called');
  });

  it('calls onBlur when input is blurred', () => {
    const onBlur = cy.stub().as('onBlur');
    mount(<TextInput onBlur={onBlur} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').focus().blur();
    cy.get('@onBlur').should('have.been.called');
  });

  it('calls onClick when input is clicked', () => {
    const onClick = cy.stub().as('onClick');
    mount(<TextInput onClick={onClick} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').click();
    cy.get('@onClick').should('have.been.called');
  });

  it('does not call onClick when disabled', () => {
    const onClick = cy.stub().as('onClick');
    mount(<TextInput onClick={onClick} disabled />);
    cy.get('[data-testid="core-ui-lib-text-input"]').click({ force: true });
    cy.get('@onClick').should('not.have.been.called');
  });

  it('passes min and max props to the input element', () => {
    mount(<TextInput type="number" min={5} max={10} />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.attr', 'min', '5');
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.attr', 'max', '10');
  });

  it('sets required attribute when required prop is true', () => {
    mount(<TextInput required />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.attr', 'required');
  });

  it('sets autoComplete attribute based on autoComplete prop', () => {
    mount(<TextInput autoComplete="on" />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.attr', 'autocomplete', 'on');
  });

  it('uses testId prop for data-testid attribute', () => {
    mount(<TextInput testId="custom-test-id" />);
    cy.get('[data-testid="custom-test-id"]').should('exist');
  });

  it('uses testId prop for icon data-testid when iconName is provided', () => {
    mount(<TextInput testId="custom-test-id" iconName="search" />);
    cy.get('[data-testid="custom-test-id-icon"]').should('exist');
  });

  it('applies className prop to input element', () => {
    mount(<TextInput className="custom-class" />);
    cy.get('[data-testid="core-ui-lib-text-input"]').should('have.class', 'custom-class');
  });

  it('applies inputClassName prop to outer div', () => {
    mount(<TextInput inputClassName="custom-div-class" />);
    cy.get('[data-testid="core-ui-lib-text-input"]').parent().should('have.class', 'custom-div-class');
  });
});

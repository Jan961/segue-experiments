import Button from '../../../components/core-ui-lib/Button';
import BaseComp from '../helpers/BaseComp';

const Wrapper = ({ props }) => (
  <BaseComp>
    <Button {...props} />
  </BaseComp>
);

describe('Button tests', () => {
  it('should render the button with provided text and additional classes', () => {
    const props = { text: 'Click Me', className: 'w-32' };
    cy.mount(<Wrapper props={props} />);
    cy.get('button').contains(props.text).should('exist');
    cy.get('button').should('have.class', 'w-32');
    cy.get('button').should('have.class', 'bg-primary-navy');
    cy.get('button').should('have.class', 'text-primary-white');
  });

  it('should render the button as secondary variant', () => {
    const props = { text: 'Click Me', variant: 'secondary', className: 'w-32' };
    cy.mount(<Wrapper props={props} />);
    cy.get('button').should('have.class', 'bg-primary-white');
    cy.get('button').should('have.class', 'text-primary-button-active');
  });

  it('should render the button as tertiary variant', () => {
    const props = { text: 'Click Me', variant: 'tertiary', className: 'w-32' };
    cy.mount(<Wrapper props={props} />);
    cy.get('button').should('have.class', 'bg-primary-red');
    cy.get('button').should('have.class', 'text-primary-white');
  });

  it('should be disabled when the disabled prop is true', () => {
    const props = { text: 'Click Me', disabled: true, className: 'w-32' };
    cy.mount(<Wrapper props={props} />);
    cy.get('button').should('have.class', '!bg-disabled-button');
    cy.get('button').should('have.class', 'text-primary-white');
    cy.get('button').should('have.class', '!cursor-not-allowed');
    cy.get('button').should('have.class', '!pointer-events-none');
  });

  it('should render a prefix icon when prefixIcon prop is provided', () => {
    const props = { text: 'Click Me', prefixIconName: 'search', iconProps: { testId: 'search' }, className: 'w-32' };
    cy.mount(<Wrapper props={props} />);
    cy.get('button').get('svg').should('have.attr', 'data-testid', 'search');
  });

  it('should render a suffix icon when suffixIcon prop is provided', () => {
    const props = { text: 'Click Me', sufixIconName: 'search', iconProps: { testId: 'search' }, className: 'w-32' };
    cy.mount(<Wrapper props={props} />);
    cy.get('button').get('svg').should('have.attr', 'data-testid', 'search');
  });

  it('should call onClick callback when clicked', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    const props = { text: 'Click Me', onClick: onClickSpy, className: 'w-32' };
    cy.mount(<Wrapper props={props} />);
    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });
});

// TabButton.cy.tsx

import TabButton, { ButtonVariant } from '../../../components/core-ui-lib/TabButton';

const classes = [
  'bg-primary-navy text-primary-white hover:bg-primary-button-hover active:bg-primary-button-active',
  'bg-primary-white border border-primary-button-active text-primary-button-active hover:bg-secondary-button-hover active:bg-secondary-button-active',
  'bg-primary-red text-primary-white hover:bg-tertiary-button-hover active:bg-tertiary-button-active',
];

describe('TabButton Component', () => {
  it('renders correctly with default props', () => {
    cy.mount(<TabButton text="Default Button" />);
    cy.get('button').contains('Default Button').should('exist');
    //check base class
    cy.get('button').should(
      'have.class',
      'h-[1.9375rem] min-w-fit px-2 py-1 rounded-md text-center flex justify-center items-center !shadow-sm-shadow font-bold text-sm tracking-[-0.00263re] transition-all',
    );
  });

  it('applies the correct variant classes', () => {
    const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary'];

    variants.forEach((variant, index) => {
      cy.mount(<TabButton text={`${variant} Button`} variant={variant} />);
      cy.get('button').should('have.class', classes[index]);
    });
  });

  it('handles the disabled state', () => {
    cy.mount(<TabButton text="Disabled Button" disabled />);
    cy.get('button').should('be.disabled');
    cy.get('button').should('have.class', '!cursor-not-allowed');
  });

  it('triggers onClick handler when clicked', () => {
    const onClick = cy.spy().as('onClickSpy');
    cy.mount(<TabButton text="Clickable Button" onClick={onClick} />);
    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });

  it('does not trigger onClick handler when disabled', () => {
    const onClick = cy.spy().as('onClickSpy');
    cy.mount(<TabButton text="Disabled Button" onClick={onClick} disabled />);
    cy.get('button').should('be.disabled').click({ force: true });
    cy.get('@onClickSpy').should('not.have.been.called');
  });

  it('renders prefix icon when prefixIconName is provided', () => {
    cy.mount(<TabButton text="With Prefix Icon" prefixIconName="prefix-icon" />);
    cy.get('button').within(() => {
      cy.get('span').first().should('have.class', 'absolute').and('have.class', 'left-2');
    });
  });

  it('renders suffix icon when sufixIconName is provided', () => {
    cy.mount(<TabButton text="With Suffix Icon" sufixIconName="suffix-icon" />);
    cy.get('button').within(() => {
      cy.get('span').last().should('have.class', 'absolute').and('have.class', 'right-2');
    });
  });

  it('renders both prefix and suffix icons when both are provided', () => {
    cy.mount(<TabButton text="With Both Icons" prefixIconName="prefix-icon" sufixIconName="suffix-icon" />);
    cy.get('button').within(() => {
      cy.get('span').should('have.length', 2);
    });
  });

  it('applies custom className', () => {
    cy.mount(<TabButton text="Custom Class" className="custom-class" />);
    cy.get('button').should('have.class', 'custom-class');
  });

  it('renders children when provided', () => {
    cy.mount(
      <TabButton>
        <span data-testid="child-element">Child Element</span>
      </TabButton>,
    );
    cy.get('[data-testid="child-element"]').should('exist').and('contain', 'Child Element');
  });
});

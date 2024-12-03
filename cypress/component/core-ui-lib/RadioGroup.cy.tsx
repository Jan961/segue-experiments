import { mount } from 'cypress/react18';
import RadioGroup, { Direction } from '../../../components/core-ui-lib/RadioGroup';
import { SelectOption } from '../../../components/core-ui-lib/Select/Select';
import BaseComp from '../global/BaseComp';

function setup(props) {
  mount(
    <BaseComp>
      <RadioGroup {...props} />
    </BaseComp>,
  );
}

describe('RadioGroup Component Tests', () => {
  const options: SelectOption[] = [
    { value: 'option1', text: 'Option 1' },
    { value: 'option2', text: 'Option 2' },
  ];

  it('renders the RadioGroup component with given options', () => {
    setup({
      options,
      direction: Direction.VERTICAL,
      value: 'option1',
      onChange: cy.stub(),
    });

    cy.get('[data-testid="core-ui-lib-radio-group"]').should('exist');
    cy.get('input[type="radio"]').should('have.length', options.length);
  });

  it('renders in vertical direction when direction is VERTICAL', () => {
    setup({
      options,
      direction: Direction.VERTICAL,
      value: 'option1',
      onChange: cy.stub(),
    });

    cy.get('[data-testid="core-ui-lib-radio-group"]').should('have.class', 'flex-col');
  });

  it('renders in horizontal direction when direction is HORIZONTAL', () => {
    setup({
      options,
      direction: Direction.HORIZONTAL,
      value: 'option1',
      onChange: cy.stub(),
    });

    cy.get('[data-testid="core-ui-lib-radio-group"]').should('have.class', 'flex-row');
    cy.get('[data-testid="core-ui-lib-radio-group"]').should('have.class', 'items-center');
    cy.get('[data-testid="core-ui-lib-radio-group"]').should('have.class', 'gap-2');
  });

  it('calls onChange handler with correct value when an option is clicked', () => {
    const onChangeStub = cy.stub();
    setup({
      options,
      direction: Direction.VERTICAL,
      value: 'option1',
      onChange: onChangeStub,
    });

    cy.get('input[type="radio"]')
      .eq(1)
      .click()
      .then(() => {
        expect(onChangeStub).to.have.been.calledWith('option2');
      });
  });

  it('initially selects the radio corresponding to the value prop', () => {
    setup({
      options,
      direction: Direction.VERTICAL,
      value: 'option2',
      onChange: cy.stub(),
    });

    cy.get('input[type="radio"]').eq(1).should('be.checked');
    cy.get('input[type="radio"]').eq(0).should('not.be.checked');
  });

  it('renders radios as disabled when disabled prop is true', () => {
    setup({
      options,
      direction: Direction.VERTICAL,
      value: 'option1',
      onChange: cy.stub(),
      disabled: true,
    });

    cy.get('input[type="radio"]').each(($radio) => {
      cy.wrap($radio).should('be.disabled');
    });
  });

  it('all radios have the same name attribute', () => {
    setup({
      options,
      direction: Direction.VERTICAL,
      value: 'option1',
      onChange: cy.stub(),
    });

    let radioName;
    cy.get('input[type="radio"]').each(($radio, index) => {
      if (index === 0) {
        radioName = $radio.attr('name');
      } else {
        expect($radio.attr('name')).to.equal(radioName);
      }
    });
  });
});

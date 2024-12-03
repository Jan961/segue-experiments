import { mount } from 'cypress/react18';
import DateRange, { DateRangeProps } from '../../../components/core-ui-lib/DateRange';
import BaseComp from '../global/BaseComp';
import { UTCDate } from '@date-fns/utc';

function setup(props: DateRangeProps) {
  mount(
    <BaseComp>
      <DateRange {...props} />
    </BaseComp>,
  );
}

describe('DateRange Component', () => {
  it('renders correctly with default props', () => {
    setup({
      onChange: cy.stub(),
    });

    cy.get('[data-testid="start-date-input"]').should('exist');
    cy.get('[data-testid="end-date-input"]').should('exist');
    cy.get('[data-testid="form-typeahead"]').should('exist');
  });

  it('renders label when label prop is provided', () => {
    const label = 'Select Date Range';
    setup({
      onChange: cy.stub(),
      label,
    });

    cy.contains(label).should('exist');
  });

  it('displays dates from value prop', () => {
    const onChange = cy.stub();
    const value = {
      from: new UTCDate('2023-01-01'),
      to: new UTCDate('2023-01-31'),
    };

    setup({
      onChange,
      value,
    });

    cy.get('[data-testid="start-date-input"] input').should('have.value', '01/01/23');
    cy.get('[data-testid="end-date-input"] input').should('have.value', '31/01/23');
  });

  it.only('calls onChange with correct value when "from" date is changed', () => {
    const onChange = cy.spy().as('onChangeSpy');
    setup({
      onChange,
    });

    const fromDate = '01/01/2023';

    cy.get('[data-testid="start-date-input"] input').type(`${fromDate}{enter}`);

    cy.get('@onChangeSpy').should('have.been.calledWithMatch', {
      from: Cypress.sinon.match((value) => value.from),
      to: null,
    });
  });

  it('calls onChange with correct value when "to" date is changed', () => {
    const onChange = cy.spy().as('onChangeSpy');
    setup({
      onChange,
    });

    const toDate = '01/31/2023';

    cy.get('[data-testid="end-date-input"] input').type(`${toDate}{enter}`);

    cy.get('@onChangeSpy').should('have.been.calledWithMatch', {
      from: null,
      to: Cypress.sinon.match((value) => value.toISOString().startsWith('2023-01-31')),
    });
  });

  it('shows error when "to" date is earlier than "from" date', () => {
    const onChange = cy.stub().as('onChangeSpy');
    setup({
      onChange,
    });

    const fromDate = '01/10/2023';
    const toDate = '01/05/2023';

    cy.get('[data-testid="start-date-input"] input').type(`${fromDate}{enter}`);
    cy.get('[data-testid="end-date-input"] input').type(`${toDate}{enter}`);

    cy.get('[data-testid="start-date-input"]').contains('Invalid date').should('exist');
    cy.get('[data-testid="end-date-input"]').contains('Invalid date').should('exist');

    cy.get('@onChangeSpy').should('not.have.been.calledWithMatch', {
      from: Cypress.sinon.match.any,
      to: Cypress.sinon.match.any,
    });
  });

  it('disables the component when disabled prop is true', () => {
    setup({
      onChange: cy.stub(),
      disabled: true,
    });

    cy.get('[data-testid="start-date-input"] input').should('be.disabled');
    cy.get('[data-testid="end-date-input"] input').should('be.disabled');
  });

  it('enforces minDate and maxDate constraints', () => {
    const onChange = cy.stub().as('onChangeSpy');
    const minDate = new UTCDate('2023-01-01');
    const maxDate = new UTCDate('2023-12-31');
    setup({
      onChange,
      minDate,
      maxDate,
    });

    cy.get('[data-testid="start-date-input"] input').type('12/31/2022{enter}');
    cy.get('[data-testid="start-date-input"]').contains('Invalid date').should('exist');

    cy.get('[data-testid="end-date-input"] input').type('01/01/2024{enter}');
    cy.get('[data-testid="end-date-input"]').contains('Invalid date').should('exist');

    cy.get('@onChangeSpy').should('not.have.been.called');
  });

  it('handles null or undefined value props gracefully', () => {
    const onChange = cy.stub();
    setup({
      onChange,
      value: { from: null, to: null },
    });

    cy.get('[data-testid="start-date-input"] input').should('have.value', '');
    cy.get('[data-testid="end-date-input"] input').should('have.value', '');
  });
});

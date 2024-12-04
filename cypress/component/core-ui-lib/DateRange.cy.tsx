import { mount } from 'cypress/react18';
import DateRange, { DateRangeProps } from '../../../components/core-ui-lib/DateRange';
import BaseComp from '../global/BaseComp';
import { UTCDate } from '@date-fns/utc';
import { newDate } from '../../../services/dateService';

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

  it('calls onChange with correct value when "from" date is changed', () => {
    const onChange = cy.stub().as('onChangeSpy');
    setup({
      onChange,
    });

    const fromDate = '05/01/23';

    cy.get('[data-testid="start-date-input"] input').type(`${fromDate}{enter}`);
    cy.get('@onChangeSpy')
      .should('have.been.called')
      .then(() => {
        const args = onChange.getCall(0).args[0];
        // note that DateInput (and as a result DateRange does that as well) uses newDate with 'UK' "locale" parameter
        // and therefore it always interprets '05/01/23' as 5 Jan 2023
        expect(args.from).to.deep.equal(newDate(fromDate, 'UK'));
      });
  });

  it('calls onChange with correct value when "to" date is changed', () => {
    const onChange = cy.spy().as('onChangeSpy');
    setup({
      onChange,
    });

    const toDate = '05/01/23';

    cy.get('[data-testid="end-date-input"] input').type(`${toDate}{enter}`);

    cy.get('@onChangeSpy')
      .should('have.been.called')
      .then(() => {
        const args = onChange.getCall(0).args[0];
        // note that DateInput (and as a result DateRange as well) uses newDate with 'UK' "locale" parameter
        // and therefore it always interprets '05/01/23' as 5 Jan 2023 - it is important never to use the US locale
        // or the UTCDate constructor directly both of which would interpret '05/01/23' as 1 May 2023
        expect(args.to).to.deep.equal(newDate(toDate, 'UK'));
      });
  });

  it('shows error when you start from blank enter a "from" and then an earlier "to" date', () => {
    const onChange = cy.stub().as('onChangeSpy');
    setup({
      onChange,
    });

    const fromDate = '01/10/2023';
    const toDate = '01/05/2023';

    cy.get('[data-testid="start-date-input"] input').type(`${fromDate}{enter}`);
    cy.get('[data-testid="end-date-input"] input').type(`${toDate}{enter}`);
    cy.get('[data-testid="start-date-input"]').should('have.class', 'animate-shake');
    cy.get('[data-testid="end-date-input"]').should('have.class', 'animate-shake');

    cy.get('[data-testid="end-date-input"]').should('not.nested.include.text', '01/05/2023');
    cy.get('[data-testid="end-date-input"]').should('have.value', '');
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });

  it("shows an error when you start from blank, enter a 'to' date and then an later 'from' date", () => {
    const onChange = cy.stub().as('onChangeSpy');
    setup({
      onChange,
    });

    const fromDate = '01/10/2023';
    const toDate = '01/05/2023';
    cy.get('[data-testid="end-date-input"] input').type(`${toDate}{enter}`);
    cy.get('[data-testid="start-date-input"] input').type(`${fromDate}{enter}`);

    cy.get('[data-testid="end-date-input"]').should('not.nested.include.text', '01/05/2023');
    cy.get('[data-testid="end-date-input"]').should('have.value', '');
    cy.get('@onChangeSpy').should('have.been.calledOnce');

    cy.get('[data-testid="start-date-input"]').should('have.class', 'animate-shake');
    cy.get('[data-testid="end-date-input"]').should('have.class', 'animate-shake');
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
    cy.get('[data-testid="start-date-input"]').should('have.class', 'animate-shake');
    cy.get('[data-testid="end-date-input"]').should('have.class', 'animate-shake');

    cy.get('[data-testid="end-date-input"] input').type('01/01/2024{enter}');
    cy.get('[data-testid="start-date-input"]').should('have.class', 'animate-shake');
    cy.get('[data-testid="end-date-input"]').should('have.class', 'animate-shake');

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

  it('handles invalid dates correctly', () => {
    const onChange = cy.stub();
    setup({
      onChange,
    });

    cy.get('[data-testid="start-date-input"] input').type('31/02/23{enter}');
    cy.get('[data-testid="start-date-input"] input').should('not.have.value', '31/02/23');
    cy.get('[data-testid="end-date-input"] input').type('32/01/23{enter}');
    cy.get('[data-testid="end-date-input"] input').should('not.have.value', '32/01/23');
    cy.get('[data-testid="end-date-input"] input').type('31/04/23{enter}');
    cy.get('[data-testid="end-date-input"] input').should('not.have.value', '31/04/23');
  });
});

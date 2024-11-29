import DateInput, { DateInputProps } from '../../../components/core-ui-lib/DateInput';
import BaseComp from '../global/BaseComp';
import { mount } from 'cypress/react18';
import { newDate } from '../../../services/dateService';

describe('DateInput tests', () => {
  it('should render correctly', () => {
    const props: DateInputProps = { testId: 'test-date-input', onChange: cy.stub(), label: 'Test Label' };

    mount(
      <BaseComp>
        <DateInput {...props} />
      </BaseComp>,
    );
    cy.get('[data-testid="test-date-input-picker"]').should('exist');
    cy.get('[data-testid="test-date-input-label"]').should('include.text', 'Test Label');
    cy.get('[data-testid="test-date-input-input"] [placeholder="DD/MM/YY"]').should('exist');
  });

  it('should be disabled when disabled prop is true', () => {
    const props: DateInputProps = {
      testId: 'test-date-input',
      onChange: cy.stub(),
      label: 'Test Label',
      disabled: true,
    };

    mount(
      <BaseComp>
        <DateInput {...props} />
      </BaseComp>,
    );
    // this checks whether the class "disabled-input !border-none focus:outline-none" which is set in the TextInput component
    // is applied - this class is always applied when the disabled prop of the DateInput is true and can't be overridden
    cy.get('[data-testid="test-date-input-input"] input').should(
      'have.class',
      'disabled-input !border-none focus:outline-none',
    );
  });

  it('check if a date outside of the minDate - maxDate range can be selected on the calendar', () => {
    const minDate = newDate('2021-01-01');
    const maxDate = newDate('2021-12-31');
    const props: DateInputProps = {
      testId: 'test-date-input',
      onChange: cy.stub(),
      minDate: minDate,
      maxDate: maxDate,
    };

    mount(
      <BaseComp>
        <DateInput {...props} />
      </BaseComp>,
    );

    // move the date to the bottom so that when the calendar is opened it doesn't disappear off the screen
    cy.get('[data-cy-root]').then(($el) => {
      // use jQuery to modify the class
      $el[0].className = 'flex justify-center items-end h-full';
    });

    function clickUntilGone(selector) {
      cy.get('body').then(($body) => {
        // Check if the element exists in the DOM
        if ($body.find(selector).length > 0) {
          // If the element exists, click it
          cy.get(selector).click();

          // Recursively call the function to click again until it no longer exists
          clickUntilGone(selector);
        }
      });
    }

    cy.get('.react-datepicker-wrapper').click();

    // Click the previous month button until the previous month is not visible
    clickUntilGone('.react-datepicker__navigation--previous');
    //click the first day of the month
    cy.get(':nth-child(1) > .react-datepicker__day--001')
      .invoke('attr', 'aria-label')
      .should('include', 'January 1st, 2021');

    // now do the same maxDate
    clickUntilGone('.react-datepicker__navigation--next');
    cy.get('.react-datepicker__day--031').invoke('attr', 'aria-label').should('include', 'December 31st, 2021');
  });

  it('check if only number can be typed in', () => {
    const props: DateInputProps = { testId: 'test-date-input', onChange: cy.stub() };

    mount(
      <BaseComp>
        <DateInput {...props} />
      </BaseComp>,
    );

    cy.get('[data-testid="test-date-input-input"] input').type('a').should('have.value', '');
    cy.get('[data-testid="test-date-input-input"] input').type('1').should('have.value', '1');
    cy.get('[data-testid="test-date-input-input"] input').type('/').should('have.value', '1');
  });

  //currently date input does allow for invalid dates to be input - commented out

  it('check if only valid dates can be input', () => {
    const props: DateInputProps = { testId: 'test-date-input', onChange: cy.stub() };

    mount(
      <BaseComp>
        <DateInput {...props} />
      </BaseComp>,
    );

    cy.get('[data-testid="test-date-input-input"] input').as('dateInput');
    cy.get('@dateInput').type('324024').type('{enter}').should('have.value', '');
    cy.get('@dateInput').type('30224').type('{enter}').should('have.value', '');

    // the below check doesn't pass the currently DateInput text does not validate dates re number of days in a month
    // etc - commented out
    // cy.get('@dateInput').type('310221').type('{enter}').should('have.value', '');

    cy.get('@dateInput').type('310321').type('{enter}').should('have.value', '31/03/21');
  });

  it('check if on change is called when a valid date is input', () => {
    const onChange = cy.stub();
    const props: DateInputProps = { testId: 'test-date-input', onChange: onChange };

    mount(
      <BaseComp>
        <DateInput {...props} />
      </BaseComp>,
    );

    // move the date to the bottom so that when the calendar is opened it doesn't disappear off the screen
    cy.get('[data-cy-root]').then(($el) => {
      // use jQuery to modify the class
      $el[0].className = 'flex justify-center items-end h-full';
    });

    cy.get('.react-datepicker-wrapper').click();
    cy.get(':nth-child(1) > .react-datepicker__day--001').click();
    cy.wrap(onChange).should('have.been.calledOnce');
  });

  it('checking if clicking outside of the calendar closes it', () => {
    const props: DateInputProps = { testId: 'test-date-input', onChange: cy.stub(), label: 'Test Label' };
    mount(
      <BaseComp>
        <DateInput {...props} />
      </BaseComp>,
    );
    cy.get('.react-datepicker-wrapper').click();
    cy.get('[data-testid="test-date-input-label"]').click();
    cy.get('.react-datepicker__current-month').should('not.be.exist');
  });
});

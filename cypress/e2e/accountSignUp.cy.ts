import { fillDetailsForSignUp, launchUrl } from '../support/common';
import 'cypress-iframe';
import SignupPage from './PageObjects/SignupPage';
import SelectPlanPage from './PageObjects/SelectPlanPage';
import PaymentDeatilsPage from './PageObjects/PaymentDeatilsPage';

describe('Signed in', () => {
  before(() => {
    cy.session('signed-in', () => {
      cy.signIn();
    });
  });

  it('navigate to the dashboard and verify tiles', () => {
    const tiles = ['Bookings', 'Marketing', 'Project Management', 'Contracts', 'Touring Management', 'System Admin'];
    // open dashboard page
    cy.navigateToDashboard();
    // check the dashboard displays all tiles
    cy.get('[data-testid="dashboard-tiles"] li').each((item, index) => {
      cy.wrap(item).should('contain.text', tiles[index]);
    });
  });

  it('Cypress tests for new account journey: Next button should be disabled by default until we fill the required info', () => {
    launchUrl('http://localhost:3000/account/sign-up');
    const signupPage = new SignupPage();
    signupPage.getNextButton().should('be.disabled');
  });

  it('Cypress tests for new account journey: Next button should be enabled after we fill the required info', () => {
    const signupPage = new SignupPage();
    signupPage.getFirstName().type('Ashok');
    signupPage.getLastName().type('Manchala');
    signupPage.getCompanyName().type('ssdc');
    signupPage.getPhoneNumber().type('8978555456');
    signupPage.getAddressLineOne().type('17 Findorhrn Place');
    signupPage.getTownName().type('Kirkcaldy');
    signupPage.getPostCode().type('KY11 6RN');
    signupPage.getCompanyEmailAddress().type('heytestemail@gmail.com');
    signupPage.getCountryDropDown().click();
    cy.wait(1000);
    const country = cy.contains('United Kingdom');
    country.click();
    signupPage.getSaveButton().click();
    cy.wait(2000);
    signupPage.getNextButton().should('be.enabled');
  });

  it('Cypress tests for new account journey: fill company details', () => {
    launchUrl('http://localhost:3000/account/sign-up');
    cy.wait(3000);
    fillDetailsForSignUp(
      'Ashok',
      'Manchala',
      'ssdc',
      '8978555456',
      '17 Findorhrn Place',
      'Kirkcaldy',
      'KY11 6RN',
      'heytestemail@gmail.com',
    );
  });

  it('Cypress tests for new account journey: select plan: segue basic', () => {
    const selectPlanPage = new SelectPlanPage();
    selectPlanPage.getSelectPlanText().should('be.visible');
    selectPlanPage.getDetailsForBasicPlan().click();
    selectPlanPage.basicPlanDeatils().should('be.visible');
  });

  it('Cypress tests for new account journey: select plan: segue pro', () => {
    const selectPlanPage = new SelectPlanPage();
    selectPlanPage.getSelectPlanText().should('be.visible');
    selectPlanPage.getDetailsForProPlan().click();
    selectPlanPage.proPlanDeatils().should('be.visible');
  });

  it('Cypress tests for new account journey: select plan: segue enterprise', () => {
    const selectPlanPage = new SelectPlanPage();
    selectPlanPage.getSelectPlanText().should('be.visible');
    selectPlanPage.getDetailsForEnterprisePlan().click();
    selectPlanPage.enterprisePlanDeatils().should('be.visible');
  });

  it('Cypress tests for new account journey: select plan: choose segue basic: payment details should be visible', () => {
    const selectPlanPage = new SelectPlanPage();
    selectPlanPage.chooseBasicPlan().click();
    cy.contains('Payment Details', { timeout: 10000 }).should('be.visible');
  });

  it('Cypress tests for new account journey: payment details: change plan : select plan should be visible', () => {
    const paymentDeatilsPage = new PaymentDeatilsPage();
    paymentDeatilsPage.getChangePlan().click();
    const selectPlanPage = new SelectPlanPage();
    selectPlanPage.getSelectPlanText().should('be.visible');
  });

  it('Cypress tests for new account journey: select plan: choose segue basic: Payment details form : Previously inputted email should get filled up automatically', () => {
    const selectPlanPage = new SelectPlanPage();
    selectPlanPage.chooseBasicPlan().click();
    const paymentDeatilsPage = new PaymentDeatilsPage();
    paymentDeatilsPage.getPaymentDetailsText().should('be.visible');
    paymentDeatilsPage.getEmail().should('have.attr', 'value', 'heytestemail@gmail.com');
  });

  it('Cypress tests for new account journey: select plan: choose segue basic: Payment details form : Select monthly plan by default', () => {
    const paymentDeatilsPage = new PaymentDeatilsPage();
    paymentDeatilsPage.getPaymentDetailsText().should('be.visible');
    paymentDeatilsPage.getPlanDetails().should('have.attr', 'aria-checked', 'false');
  });

  it('Cypress tests for new account journey: select plan: choose segue basic: Payment details form : Pay Now button should be disabled initially if there is no data', () => {
    const paymentDeatilsPage = new PaymentDeatilsPage();
    paymentDeatilsPage.getPaymentDetailsText().should('be.visible');
    paymentDeatilsPage.getAmount('499').should('be.visible');
    paymentDeatilsPage.getPayNowButton().should('be.disabled');
  });

  it('Cypress tests for new account journey: select plan: choose segue basic: Payment details form : fill card deatils', () => {
    const paymentDeatilsPage = new PaymentDeatilsPage();
    paymentDeatilsPage.getPaymentDetailsText().should('be.visible');

    cy.get('#cardNumber')
      .find('iframe')
      .then(($iframe) => {
        const body = $iframe.contents().find('body');

        // Now you can work within the iframe context

        //cy.wrap(body).find('input[name="card_number"]').type('4242424242424242');
      });

    cy.pause();
  });
});

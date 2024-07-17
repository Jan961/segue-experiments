class SelectPlanPage {
  getSelectPlanText() {
    return cy.contains('Select Plan');
  }

  getDetailsForBasicPlan() {
    return cy.contains('button', 'Choose Segue Basic').next('button').contains('Show Plan Details');
  }

  basicPlanDeatils() {
    return cy.contains('1 Production 1 User', { timeout: 10000 });
  }

  chooseBasicPlan() {
    return cy.contains('button', 'Choose Segue Basic');
  }

  getDetailsForProPlan() {
    return cy.contains('button', 'Choose Segue Pro').next('button').contains('Show Plan Details');
  }

  proPlanDeatils() {
    return cy.contains('5 Productions 5 Users');
  }

  chooseProPlan() {
    return cy.contains('button', 'Choose Segue Pro');
  }

  getDetailsForEnterprisePlan() {
    return cy.contains('button', 'Choose Segue Enterprise').next('button').contains('Show Plan Details');
  }

  enterprisePlanDeatils() {
    return cy.contains('10 Productions 10+ Users');
  }

  chooseEnterpricePlan() {
    return cy.contains('button', 'Choose Segue Enterprise');
  }

  getBackButton() {
    return cy.contains('button', 'Back');
  }
}

export default SelectPlanPage;

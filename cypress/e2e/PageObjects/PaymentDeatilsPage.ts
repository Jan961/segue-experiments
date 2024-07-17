class PaymentDeatilsPage {
  getPaymentDetailsText() {
    return cy.contains('Payment Details');
  }

  getChangePlan() {
    return cy.contains('button', 'Change Plan');
  }

  getEmail() {
    return cy.get('#email');
  }

  getPlanDetails() {
    return cy.get('button[role="switch"]');
  }

  getPayNowButton() {
    return cy.contains('button', 'Pay Now');
  }

  getAmount(uros: any) {
    return cy.contains('£' + uros + ' per month', { timeout: 10000 });
  }
}

export default PaymentDeatilsPage;

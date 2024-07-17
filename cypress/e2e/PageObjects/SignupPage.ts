class SignupPage {
  getFirstName() {
    return cy.get('[data-testid="first-name"]');
  }

  getLastName() {
    return cy.get('[data-testid="last-name"]');
  }

  getCompanyName() {
    return cy.get('[data-testid="company-name"]');
  }

  getPhoneNumber() {
    return cy.get('[data-testid="phone-number"]');
  }

  getAddressLineOne() {
    return cy.get('[data-testid="address-line1"]');
  }

  getTownName() {
    return cy.get('[data-testid="town"]');
  }

  getPostCode() {
    return cy.get('[data-testid="post-code"]');
  }

  getCountryDropDown() {
    return cy.get('#react-select-3-placeholder');
  }

  getCompanyEmailAddress() {
    return cy.get('[data-testid="company-email"]');
  }

  getSaveButton() {
    return cy.contains('button', 'Save');
  }

  getNextButton() {
    return cy.contains('button', 'Next');
  }
}

export default SignupPage;

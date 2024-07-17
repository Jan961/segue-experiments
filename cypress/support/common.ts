import 'cypress-iframe';
import SignupPage from '../e2e/PageObjects/SignupPage';

export const launchUrl = async (url: string) => {
  cy.visit(url);
  cy.wait(3000);
};

export const fillDetailsForSignUp = async (
  firstName: string,
  lastName: string,
  companyName: string,
  phoneNo: string,
  address1: any,
  town: any,
  postCode: any,
  companyEmail: any,
) => {
  const signupPage = new SignupPage();
  signupPage.getFirstName().type(firstName);
  signupPage.getLastName().type(lastName);
  signupPage.getCompanyName().type(companyName);
  signupPage.getPhoneNumber().type(phoneNo);
  signupPage.getAddressLineOne().type(address1);
  signupPage.getTownName().type(town);
  signupPage.getPostCode().type(postCode);
  signupPage.getCompanyEmailAddress().type(companyEmail);
  signupPage.getCountryDropDown().click();
  cy.wait(1000);
  const country = cy.contains('United Kingdom');
  country.click();
  signupPage.getSaveButton().click();
  cy.wait(2000);
  signupPage.getNextButton().click();
  cy.wait(2000);
};

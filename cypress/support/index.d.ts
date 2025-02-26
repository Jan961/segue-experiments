declare namespace Cypress {
  interface Chainable<> {
    signOut(): Chainable<any>;
    signIn(): Chainable<any>;
    navigateToDashboard(): Chainable<any>;
  }
}

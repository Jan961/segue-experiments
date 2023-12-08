/// <reference types="cypress" />

// @ts-nocheck
Cypress.Commands.add(`signOut`, () => {
  cy.log(`sign out by clearing all cookies.`);
  cy.clearCookies({ domain: null });
});

Cypress.Commands.add(`signIn`, () => {
  const WEBA_APP_URI = Cypress.env('WEB_APP_URI');
  cy.log(`Signing in.`);
  const { cyUser, cyPassword } = Cypress.env();
  cy.visit({
    url: WEBA_APP_URI,
    auth: {
      username: cyUser,
      password: cyPassword,
    },
  });

  cy.window()
    .should((window) => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      await cy.clearCookies({ domain: window.location.domain });
      const res = await window.Clerk.client.signIn.create({
        identifier: cyUser,
        password: cyPassword,
      });

      await window.Clerk.setActive({
        session: res.createdSessionId,
      });

      cy.log(`Finished Signing in.`);
    });
});

const navigateToDashboard = () => {
  cy.visit(Cypress.env('WEB_APP_URI'), { failOnStatusCode: false });
};

Cypress.Commands.addAll({ navigateToDashboard });

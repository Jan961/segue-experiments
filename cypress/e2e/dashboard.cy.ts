describe('Dasboard is dispalyed with tiles', () => {
  beforeEach(() => {
    cy.session('signed-in', () => {
      cy.signIn();
    });
  });
  it('Navigate to Dashboard', () => {
    cy.visit('/');
  });
});

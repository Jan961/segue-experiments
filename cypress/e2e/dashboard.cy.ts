describe('Signed in', () => {
  beforeEach(() => {
    cy.session('signed-in', () => {
      cy.signIn();
    });
  });

  it('navigate to the dashboard and verify tiles', () => {
    const tiles = [
      'Bookings',
      'Tasks',
      'Marketing',
      'Venue Contracts',
      'Reports',
      'User Account',
      '',
      'Touring Management',
    ];
    // open dashboard page
    cy.navigateToDashboard();
    // check the dashboard displays all tiles
    cy.get('[data-testid="dashboard-tiles"] li').each((item, index) => {
      cy.wrap(item).should('contain.text', tiles[index]);
    });
  });

  it('Access bookings page from dashboard', () => {
    // open dashboard page
    cy.navigateToDashboard();
    // check the dashboard displays all tiles
    const link = cy.get('[data-testid="dashboard-tiles"] li:first a');
    link.click();
    cy.url().should('include', '/bookings');
  });
});

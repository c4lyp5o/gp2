describe('After login Daerah and start testing', () => {
  it('Test everything at Pentadbir Daerah level', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem(
          'adminToken',
          Cypress.env('ADMINTOKEN_DAERAH')
        );
      },
    });
    cy.get('[data-cy="header"]').should('contain', 'DAERAH');
  });
});

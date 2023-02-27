describe('Display after login for Pentadbir Negeri', () => {
  it('Successfully display after login for Pentadbir Negeri', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem(
          'adminToken',
          Cypress.env('ADMINTOKEN_NEGERI')
        );
      },
    });
    cy.get('[data-cy="header"]').should('contain', 'NEGERI');
  });
});

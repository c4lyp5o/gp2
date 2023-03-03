describe('After login Negeri and start testing', () => {
  it('Test everything at Pentadbir Negeri level', () => {
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

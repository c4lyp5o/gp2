describe('After login Klinik and start testing', () => {
  it('Test everything at Pentadbir Klinik level', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem(
          'adminToken',
          Cypress.env('ADMINTOKEN_KLINIK')
        );
      },
    });
    cy.get('[data-cy="header"]').should('contain', 'KLINIK');
  });
});

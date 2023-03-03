describe('After login HQ and start testing', () => {
  it('Test everything at Pentadbir HQ level', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem('adminToken', Cypress.env('ADMINTOKEN_HQ'));
      },
    });
    cy.get('[data-cy="big-boss"]').should('contain', 'BIG BOSS');
  });
});

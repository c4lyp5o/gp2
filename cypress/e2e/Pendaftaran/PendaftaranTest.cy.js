describe('Login Pendaftaran and start testing', () => {
  it('Test everything at Pendaftaran', () => {
    // load /pendaftaran
    cy.visit(Cypress.env('GIRETCY_BASE_URL'));
    cy.get('[data-cy="klinik"]').click();
    cy.get('[data-cy="pendaftaran"]').click();
    cy.url().should('contain', '/pendaftaran');

    // login Pendaftaran
    cy.get('[data-cy="negeri"]').select(Cypress.env('NEGERI'));
    cy.get('[data-cy="daerah"]').select(Cypress.env('DAERAH'));
    cy.get('[data-cy="klinik"]').select(Cypress.env('KOD_FASILITI'));
    cy.get('[data-cy="password"]').type(
      Cypress.env('FASILITI_PENDAFTARAN_PASSWORD')
    );
    cy.get('[data-cy="submit"]').click();
    cy.url().should('contain', '/daftar');
  });
});

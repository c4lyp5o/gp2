describe('Login Pengguna and start testing', () => {
  it('Test everything at Pengguna', () => {
    // load /pengguna
    cy.visit(Cypress.env('GIRETCY_BASE_URL'));
    cy.get('[data-cy="klinik"]').click();
    cy.get('[data-cy="pengguna"]').click();
    cy.url().should('contain', '/pengguna');

    // login Pengguna
    cy.get('[data-cy="negeri"]').select(Cypress.env('NEGERI'));
    cy.get('[data-cy="daerah"]').select(Cypress.env('DAERAH'));
    cy.get('[data-cy="klinik"]').select(Cypress.env('KOD_FASILITI'));
    cy.get('[data-cy="password"]').type(
      Cypress.env('FASILITI_PENGGUNA_PASSWORD')
    );
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="pilihan-operator"]').select(Cypress.env('NAMA_OPERATOR'));
    cy.get('[data-cy="no-MDC-MDTB"]').type(Cypress.env('MDC_MDTB_OPERATOR'));
    cy.get('[data-cy="pilih-operator-button"]').click();
    cy.url().should('contain', '/landing');
  });
});

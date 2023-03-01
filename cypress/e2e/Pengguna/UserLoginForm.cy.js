describe('Load Pengguna Login Page', () => {
  it('Successfully load /pengguna', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL'));
    cy.get('[data-cy="klinik"]').click();
    cy.get('[data-cy="pengguna"]').click();
    cy.url().should('contain', '/pengguna');
  });
});

describe('Login Pengguna', () => {
  it('Login as Klinik Pergigian Senggarang', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pengguna');
    cy.get('[data-cy="negeri"]').select('Johor');
    cy.get('[data-cy="daerah"]').select('Batu Pahat');
    cy.get('[data-cy="klinik"]').select('J01-002-02');
    cy.get('[data-cy="password"]').type('123456');
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="pilihan-operator"]').select(Cypress.env('NAMA_OPERATOR'));
    cy.get('[data-cy="no-MDC-MDTB"]').type(Cypress.env('MDC_MDTB_OPERATOR'));
    cy.get('[data-cy="pilih-operator-button"]').click();
    cy.url().should('contain', '/landing');
  });
});

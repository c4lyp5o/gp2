describe('Load Pendaftaran Login Page', () => {
  it('Successfully load /pendaftaran', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL'));
    cy.get('[data-cy="klinik"]').click();
    cy.get('[data-cy="pendaftaran"').click();
    cy.url().should('contain', '/pendaftaran');
  });
});

describe('Login Pendaftaran', () => {
  it('Login as Klinik Pergigian Senggarang', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pendaftaran');
    cy.get('[data-cy="negeri"]').select('Johor');
    cy.get('[data-cy="daerah"]').select('Batu Pahat');
    cy.get('[data-cy="klinik"]').select('J01-002-02');
    cy.get('[data-cy="password"]').type('123456');
    cy.get('[data-cy="submit"]').click();
    cy.url().should('include', '/daftar');
  });
});

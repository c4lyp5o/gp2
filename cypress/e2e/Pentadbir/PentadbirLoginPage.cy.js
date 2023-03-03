describe('Pentadbir login page', () => {
  it('Test everything at Pentadbir login page', () => {
    // load /pentadbir
    cy.visit(Cypress.env('GIRETCY_BASE_URL'));
    cy.get('[data-cy="pentadbir"]').click();
    cy.url().should('contain', '/pentadbir');

    // test possible combination for Pentadbir dropdown
    // Klinik
    cy.get('[data-cy="negeri"').select(
      Cypress.env('NEGERI_PENTADBIR_USERNAME')
    );
    cy.get('[data-cy="daerah"]').select(Cypress.env('DAERAH'));
    cy.get('[data-cy="klinik"]').select(Cypress.env('KOD_FASILITI'));
    cy.get('[data-cy="pentadbir-klinik"]').select(
      Cypress.env('MDC_MDTB_OPERATOR')
    );
    cy.get('[data-cy="submit-button-pentadbir"]').should(
      'contain',
      Cypress.env('NAMA_FASILITI')
    );
    // Daerah
    cy.get('[data-cy="negeri"').select(
      Cypress.env('RESET_NEGERI_PENTADBIR_USERNAME')
    ); // reset
    cy.get('[data-cy="negeri"').select(
      Cypress.env('NEGERI_PENTADBIR_USERNAME')
    );
    cy.get('[data-cy="daerah"]').select(Cypress.env('DAERAH'));
    cy.get('[data-cy="submit-button-pentadbir"]').should(
      'contain',
      Cypress.env('DAERAH')
    );
    // Negeri
    cy.get('[data-cy="negeri"').select(
      Cypress.env('RESET_NEGERI_PENTADBIR_USERNAME')
    ); // reset
    cy.get('[data-cy="negeri"').select(
      Cypress.env('NEGERI_PENTADBIR_USERNAME')
    );
    cy.get('[data-cy="submit-button-pentadbir"]').should(
      'contain',
      'negeri ' + Cypress.env('NEGERI_PENTADBIR_USERNAME').split('negeri')[1]
    );
    // PKP KKM
    cy.get('[data-cy="negeri"]').select('hqputrajaya');
    cy.get('[data-cy="submit-button-pentadbir"]').should('contain', 'PKP KKM');
  });
});

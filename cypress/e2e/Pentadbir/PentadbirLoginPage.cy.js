describe('Testing Pentadbir login page', () => {
  it('Test everything at Pentadbir login page', () => {
    // intercept api request
    cy.intercept(
      Cypress.env('GIRETCY_BASE_URL') + '/api/v1/superadmin/getnegeri'
    ).as('getNegeri');
    cy.intercept(
      Cypress.env('GIRETCY_BASE_URL') +
        '/api/v1/superadmin/getdaerah?negeri=' +
        Cypress.env('NEGERI_PENTADBIR_USERNAME')
    ).as('getDaerah');
    cy.intercept(
      Cypress.env('GIRETCY_BASE_URL') +
        '/api/v1/superadmin/getdaerah?negeri=' +
        Cypress.env('RESET_NEGERI_PENTADBIR_USERNAME')
    ).as('getDaerahReset');
    cy.intercept(
      Cypress.env('GIRETCY_BASE_URL') +
        '/api/v1/superadmin/getklinik?daerah=' +
        encodeURI(Cypress.env('DAERAH'))
    ).as('getKlinik');
    cy.intercept(
      Cypress.env('GIRETCY_BASE_URL') +
        '/api/v1/superadmin/getadmins?kodFasiliti=' +
        Cypress.env('KOD_FASILITI')
    ).as('getAdmins');

    // load /pentadbir
    cy.visit(Cypress.env('GIRETCY_BASE_URL'));
    cy.get('[data-cy="pentadbir"]').click();
    cy.wait('@getNegeri');
    cy.url().should('contain', '/pentadbir');

    // test possible combination for Pentadbir dropdown
    // Klinik
    cy.get('[data-cy="negeri"').select(
      Cypress.env('NEGERI_PENTADBIR_USERNAME')
    );
    cy.wait('@getDaerah');
    cy.get('[data-cy="daerah"]').select(Cypress.env('DAERAH'));
    cy.wait('@getKlinik');
    cy.get('[data-cy="klinik"]').select(Cypress.env('KOD_FASILITI'));
    cy.wait('@getAdmins');
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
    cy.wait('@getDaerahReset');
    cy.get('[data-cy="negeri"').select(
      Cypress.env('NEGERI_PENTADBIR_USERNAME')
    );
    cy.wait('@getDaerah');
    cy.get('[data-cy="daerah"]').select(Cypress.env('DAERAH'));
    cy.wait('@getKlinik');
    cy.get('[data-cy="submit-button-pentadbir"]').should(
      'contain',
      Cypress.env('DAERAH')
    );
    // Negeri
    cy.get('[data-cy="negeri"').select(
      Cypress.env('RESET_NEGERI_PENTADBIR_USERNAME')
    ); // reset
    cy.wait('@getDaerahReset');
    cy.get('[data-cy="negeri"').select(
      Cypress.env('NEGERI_PENTADBIR_USERNAME')
    );
    cy.wait('@getDaerah');
    cy.get('[data-cy="submit-button-pentadbir"]').should(
      'contain',
      'negeri ' + Cypress.env('NEGERI_PENTADBIR_USERNAME').split('negeri')[1]
    );
    // PKP KKM
    cy.get('[data-cy="negeri"]').select('hqputrajaya');
    cy.get('[data-cy="submit-button-pentadbir"]').should('contain', 'PKP KKM');
  });
});

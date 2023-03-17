describe('Login Pendaftaran and start testing', () => {
  it('Test everything at Pendaftaran', () => {
    // aliasing all api request for kaunter
    cy.intercept(
      'GET',
      Cypress.env('GIRETCY_BASE_URL') + '/api/v1/kaunter/**'
    ).as('getSinglePersonKaunter');
    cy.intercept(
      'POST',
      Cypress.env('GIRETCY_BASE_URL') + '/api/v1/kaunter'
    ).as('createPersonKaunter');
    cy.intercept(
      'PATCH',
      Cypress.env('GIRETCY_BASE_URL') + '/api/v1/kaunter/**'
    ).as('updatePersonKaunter');
    cy.intercept(
      'GET',
      Cypress.env('GIRETCY_BASE_URL') + '/api/v1/kaunter/check/**'
    ).as('getPersonFromCache');
    cy.intercept(
      'GET',
      Cypress.env('GIRETCY_BASE_URL') + '/api/v1/query/kaunter?**'
    ).as('queryPersonKaunter');

    // visit url and commencing test
    cy.visit(Cypress.env('GIRETCY_BASE_URL'));
    cy.loginPendaftaran({
      negeri: Cypress.env('NEGERI'),
      daerah: Cypress.env('DAERAH'),
      kodFasiliti: Cypress.env('KOD_FASILITI'),
      password: Cypress.env('FASILITI_PENDAFTARAN_PASSWORD'),
    });

    // register pt kp and validate
    cy.registerGeneralPtKp();
    cy.validateRegisteredGeneralPtKp();

    // pt kp delete baru, register balik patut stay baru dan dapat no pendaftaran tadi
    // cy.logoutPendaftaran();
    // cy.loginPengguna({
    //   negeri: Cypress.env('NEGERI'),
    //   daerah: Cypress.env('DAERAH'),
    //   kodFasiliti: Cypress.env('KOD_FASILITI'),
    //   password: Cypress.env('FASILITI_PENDAFTARAN_PASSWORD'),
    //   operator: Cypress.env('NAMA_OPERATOR'),
    //   mdcMdtb: Cypress.env('MDC_MDTB_OPERATOR'),
    // });
    // cy.hapusRegisteredGeneralPtKp();
    // cy.logoutPengguna();

    // pt kp register ulangan, delete ulangan, register ulangan lagi, no pendaftaran stay

    // pt kp register ulangan dua kali, no pendaftaran stay

    // validate senarai daftar pesakit immediately after finish register pt kp
    cy.validateSenaraiDaftarPesakit();
  });
});

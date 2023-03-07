describe('Login Pendaftaran and start testing', () => {
  it('Test everything at Pendaftaran', () => {
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
    cy.logoutPendaftaran();
    cy.loginPengguna({
      negeri: Cypress.env('NEGERI'),
      daerah: Cypress.env('DAERAH'),
      kodFasiliti: Cypress.env('KOD_FASILITI'),
      password: Cypress.env('FASILITI_PENDAFTARAN_PASSWORD'),
      operator: Cypress.env('NAMA_OPERATOR'),
      mdcMdtb: Cypress.env('MDC_MDTB_OPERATOR'),
    });
    // test test test
    cy.logoutPengguna();

    // pt kp register ulangan, delete ulangan, register ulangan lagi, no pendaftaran stay

    // pt kp register ulangan dua kali, no pendaftaran stay

    // validate senarai daftar pesakit immediately after finish register pt kp
  });
});

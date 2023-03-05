describe('Login Pendaftaran and start testing', () => {
  it('Test everything at Pendaftaran', () => {
    cy.loginPendaftaran({
      negeri: Cypress.env('NEGERI'),
      daerah: Cypress.env('DAERAH'),
      kodFasiliti: Cypress.env('KOD_FASILITI'),
      password: Cypress.env('FASILITI_PENDAFTARAN_PASSWORD'),
    });

    cy.registerGeneralPtKp();
    cy.validateRegisteredGeneralPtKp();
  });
});

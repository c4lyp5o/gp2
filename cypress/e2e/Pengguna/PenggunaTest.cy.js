describe('Login Pengguna and start testing', () => {
  it('Test everything at Pengguna', () => {
    cy.loginPengguna({
      negeri: Cypress.env('NEGERI'),
      daerah: Cypress.env('DAERAH'),
      kodFasiliti: Cypress.env('KOD_FASILITI'),
      password: Cypress.env('FASILITI_PENDAFTARAN_PASSWORD'),
      operator: Cypress.env('NAMA_OPERATOR'),
      mdcMdtb: Cypress.env('MDC_MDTB_OPERATOR'),
    });
  });
});

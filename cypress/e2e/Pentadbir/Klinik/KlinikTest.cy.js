describe('After login Klinik and start testing', () => {
  it('Test everything at Pentadbir Klinik level', () => {
    cy.afterLoginPentadbir({ level: 'klinik' });
  });
});

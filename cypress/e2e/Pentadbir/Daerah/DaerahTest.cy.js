describe('After login Daerah and start testing', () => {
  it('Test everything at Pentadbir Daerah level', () => {
    cy.afterLoginPentadbir({ level: 'daerah' });
  });
});

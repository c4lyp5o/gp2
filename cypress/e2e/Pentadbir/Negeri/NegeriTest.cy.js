describe('After login Negeri and start testing', () => {
  it('Test everything at Pentadbir Negeri level', () => {
    cy.afterLoginPentadbir({ level: 'negeri' });
  });
});

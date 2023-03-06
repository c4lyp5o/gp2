describe('After login HQ and start testing', () => {
  it('Test everything at Pentadbir HQ level', () => {
    cy.afterLoginPentadbir({ level: 'HQ' });
  });
});

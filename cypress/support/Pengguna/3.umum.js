// whole test suite for pengguna submodul umum

Cypress.Commands.add('hapusRegisteredGeneralPtKp', () => {
  cy.get('[data-cy="navbar-button-pengguna"]').click();
  cy.get('[data-cy="navbar-pengisian-data"]');
  cy.get('[data-cy="navbar-umum"]');
  cy.get('[data-cy="carian-pesakit-umum"]').should(
    'contain.text',
    'CARIAN PESAKIT UMUM'
  );
});

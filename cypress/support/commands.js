// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('afterLoginPentadbir', ({ level }) => {
  switch (level) {
    case 'klinik':
      cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
        onBeforeLoad: function (window) {
          window.localStorage.setItem(
            'adminToken',
            Cypress.env('ADMINTOKEN_KLINIK')
          );
        },
      });
      cy.get('[data-cy="header"]').should('contain', 'KLINIK');
      break;
    case 'daerah':
      cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
        onBeforeLoad: function (window) {
          window.localStorage.setItem(
            'adminToken',
            Cypress.env('ADMINTOKEN_DAERAH')
          );
        },
      });
      cy.get('[data-cy="header"]').should('contain', 'DAERAH');
      break;
    case 'negeri':
      cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
        onBeforeLoad: function (window) {
          window.localStorage.setItem(
            'adminToken',
            Cypress.env('ADMINTOKEN_NEGERI')
          );
        },
      });
      cy.get('[data-cy="header"]').should('contain', 'NEGERI');
      break;
    default: //HQ
      cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
        onBeforeLoad: function (window) {
          window.localStorage.setItem(
            'adminToken',
            Cypress.env('ADMINTOKEN_HQ')
          );
        },
      });
      cy.get('[data-cy="big-boss"]').should('contain', 'BIG BOSS');
      break;
  }
});

Cypress.Commands.add(
  'loginPendaftaran',
  ({ negeri, daerah, kodFasiliti, password }) => {
    // load /pendaftaran
    cy.get('[data-cy="klinik"]').click();
    cy.get('[data-cy="pendaftaran"]').click();
    cy.url().should('contain', '/pendaftaran');
    // login Pendaftaran
    cy.get('[data-cy="negeri"]').select(negeri);
    cy.get('[data-cy="daerah"]').select(daerah);
    cy.get('[data-cy="klinik"]').select(kodFasiliti);
    cy.get('[data-cy="password"]').type(password);
    cy.get('[data-cy="submit"]').click();
    cy.url().should('contain', '/daftar');
  }
);

Cypress.Commands.add('logoutPendaftaran', () => {
  cy.get('[data-cy="logout-pendaftaran"]').click();
  cy.get('[data-cy="ya-yakin-logout"]').click();
  cy.url().should('not.contain', '/daftar');
  // back to base
  cy.get('[data-cy="kembali-halaman-utama"]').click();
  cy.url().should('not.contain', '/pendaftaran');
});

Cypress.Commands.add(
  'loginPengguna',
  ({ negeri, daerah, kodFasiliti, password, operator, mdcMdtb }) => {
    // load /pengguna
    cy.get('[data-cy="klinik"]').click();
    cy.get('[data-cy="pengguna"]').click();
    cy.url().should('contain', '/pengguna');
    // login Pengguna
    cy.get('[data-cy="negeri"]').select(negeri);
    cy.get('[data-cy="daerah"]').select(daerah);
    cy.get('[data-cy="klinik"]').select(kodFasiliti);
    cy.get('[data-cy="password"]').type(password);
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="pilihan-operator"]').select(operator);
    cy.get('[data-cy="no-MDC-MDTB"]').type(mdcMdtb);
    cy.get('[data-cy="pilih-operator-button"]').click();
    cy.url().should('contain', '/landing');
  }
);

Cypress.Commands.add('logoutPengguna', () => {
  cy.get('[data-cy="logout-pengguna"]').click();
  cy.get('[data-cy="ya-yakin-logout"]').click();
  cy.url().should('not.contain', '/landing');
  // back to base
  cy.get('[data-cy="kembali-halaman-utama"]').click();
  cy.url().should('not.contain', '/pengguna');
});

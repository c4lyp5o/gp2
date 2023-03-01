describe('Display after login for HQ', () => {
  it('Successfully display after login for HQ', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem('adminToken', Cypress.env('ADMINTOKEN_HQ'));
      },
    });
    cy.get('[data-cy="big-boss"]').should('contain', 'BIG BOSS');
  });
});

describe('Display after login for Pentadbir Negeri', () => {
  it('Successfully display after login for Pentadbir Negeri', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem(
          'adminToken',
          Cypress.env('ADMINTOKEN_NEGERI')
        );
      },
    });
    cy.get('[data-cy="header"]').should('contain', 'NEGERI');
  });
});

describe('Display after login for Pentadbir Daerah', () => {
  it('Successfully display after login for Pentadbir Daerah', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem(
          'adminToken',
          Cypress.env('ADMINTOKEN_DAERAH')
        );
      },
    });
    cy.get('[data-cy="header"]').should('contain', 'DAERAH');
  });
});

describe('Display after login for Pentadbir Klinik', () => {
  it('Successfully display after login for Pentadbir Klinik', () => {
    cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pentadbir/landing', {
      onBeforeLoad: function (window) {
        window.localStorage.setItem(
          'adminToken',
          Cypress.env('ADMINTOKEN_KLINIK')
        );
      },
    });
    cy.get('[data-cy="header"]').should('contain', 'KLINIK');
  });
});

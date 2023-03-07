const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1366,
    viewportHeight: 768,
    specPattern: [
      'cypress/e2e/Pentadbir/PentadbirLoginPage.cy.js',
      'cypress/e2e/Pentadbir/HQ/HQTest.cy.js',
      'cypress/e2e/Pentadbir/Negeri/NegeriTest.cy.js',
      'cypress/e2e/Pentadbir/Daerah/DaerahTest.cy.js',
      'cypress/e2e/Pentadbir/Klinik/KlinikTest.cy.js',
      'cypress/e2e/Pendaftaran/PendaftaranTest.cy.js',
      'cypress/e2e/Pengguna/PenggunaTest.cy.js',
      'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    ],
  },
});

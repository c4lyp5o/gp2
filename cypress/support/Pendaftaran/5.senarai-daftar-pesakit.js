// whole test suite for pendaftaran submodul senarai daftar pesakit

Cypress.Commands.add('validateSenaraiDaftarPesakit', () => {
  // start validate daftar pesakit after register general pt kp
  cy.get('[data-cy="navbar-button-pendaftaran"]').click();
  cy.get('[data-cy="navbar-kp"]').click();
  cy.wait('@queryPersonKaunter');
  cy.get('[data-cy="pengenalan-diri"]')
    .eq(-1)
    .then(($pd) => {
      const randomIcPerempuan = $pd.text();
      cy.get('[data-cy="navbar-button-pendaftaran"]').click();
      cy.get('[data-cy="navbar-registry"]').click();
      cy.wait('@queryPersonKaunter');
      // assert exist carian by tarikh
      cy.get('[data-cy="pengenalan-diri"]')
        .eq(-1)
        .should('contain.text', randomIcPerempuan);
      // assert exist carian by ic
      cy.get('[data-cy="carian-tanpa-tarikh"]').click();
      cy.get('[data-cy="pilih-query"]').should('contain.value', 'ic');
      cy.get('[data-cy="id-query').type(randomIcPerempuan);
      cy.get('[data-cy="cari"]').click();
      cy.wait('@queryPersonKaunter');
      cy.get('[data-cy="pengenalan-diri"]')
        .eq(-1)
        .should('contain.text', randomIcPerempuan);
      // // assert exist carian by nama
      // cy.get('[data-cy="pilih-query"]').select('nama');
      // cy.get('[data-cy="name-query"]').type('Siti Aminah binti Abu Salam');
      // cy.get('[data-cy="cari"]').click();
      // cy.wait('@queryPersonKaunter');
      // cy.get('[data-cy="pengenalan-diri"]')
      //   .eq(-1)
      //   .should('contain.text', randomIcPerempuan);
    });
});

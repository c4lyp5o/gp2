// whole test suite for pendaftaran kp

Cypress.Commands.add('registerGeneralPtKp', () => {
  // register patient for kp -----
  cy.get('[data-cy="navbar-button-pendaftaran"]').click();
  cy.get('[data-cy="navbar-kp"]').click();
  cy.get('[data-cy="jenis-fasiliti"]').should('contain', 'Klinik Pergigian');
  cy.get('[data-cy="daftar-pesakit"]').click();
  cy.get('[data-cy="fillable-form-header"]').should(
    'contain',
    'Klinik Pergigian'
  );
  // jenis-pengenalan
  cy.get('[data-cy="jenis-pengenalan"]').select('passport');
  cy.get('[data-cy="not-ic-mykad-mykid"]')
    .should('have.attr', 'placeholder', 'Isi pengenalan diri..')
    .type('FAKEPASSPORT');
  cy.get('[data-cy="jenis-pengenalan"]').select('sijil-lahir');
  cy.get('[data-cy="not-ic-mykad-mykid"]')
    .should('have.attr', 'placeholder', 'Isi pengenalan diri..')
    .should('contain', ''); // check reset
  cy.get('[data-cy="jenis-pengenalan"]').select('birth-of');
  cy.get('[data-cy="not-ic-mykad-mykid"]').should(
    'have.attr',
    'placeholder',
    'Isi pengenalan ibu..'
  );
  cy.get('[data-cy="jenis-pengenalan"]').select('tiada-pengenalan');
  cy.get('[data-cy="jenis-pengenalan"]').select('mykad-mykid');
  cy.get('[data-cy="ic-mykad-mykid"]')
    .should('have.attr', 'placeholder', '901223015432')
    .then(() => {
      const generateRandomIc = (length) => {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      };
      const generateRandomIcNoZero = (length) => {
        let result = '';
        const characters = '123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      };
      let randomIcPerempuan =
        '0' +
        generateRandomIc(1) +
        '0' +
        generateRandomIcNoZero(1) +
        '0' +
        generateRandomIcNoZero(1) +
        generateRandomIc(5) +
        '2'; // haha lol bantai dlu cmni untuk perempuan, ensure jugak dia mesti boleh mengandung
      cy.get('[data-cy="ic-mykad-mykid"]').type(randomIcPerempuan);
    });
  // select option
  cy.get('[data-cy="jantina"]').should('contain.value', 'perempuan'); // assert jantina
  cy.get('[data-cy="kumpulan-etnik"]').select('melayu');
  cy.get('[data-cy="negeri-alamat"]').select('negeri sembilan');
  cy.get('[data-cy="status-pesara"]').select('pesara-atm');
  cy.get('[data-cy="rujuk-daripada"]').select('hospital/institusi-kerajaan');
  // text
  cy.get('[data-cy="nombor-telefon"]').type('0134445566');
  cy.get('[data-cy="tambah-telefon"]').click();
  cy.get('[data-cy="nombor-telefon2"').type('0123334455');
  cy.get('[data-cy="email"]').type('testmail@mail.test');
  cy.get('[data-cy="nama-umum"]').type('Siti Aminah binti Abu Salam');
  cy.get('[data-cy="alamat"]').type('Alamat Fake');
  cy.get('[data-cy="daerah-alamat"]').type('Kota Batu Samar');
  cy.get('[data-cy="poskod-alamat"]').type('99999');
  cy.get('[data-cy="no-pesara"]').type('123PESARA');
  cy.get('[data-cy="no-resit"]').type('RESIT1');
  cy.get('[data-cy="tambah-bayaran"]').click();
  cy.get('[data-cy="no-resit-2"]').type('RESIT2');
  cy.get('[data-cy="tambah-bayaran-2').click();
  cy.get('[data-cy="no-resit-3"]').type('RESIT3');
  cy.get('[data-cy="catatan"]').type('CATATAN APA-APA');
  // checkbox & radio
  cy.get('[type="checkbox"]').check();
  cy.get('[type="radio"]').check();
  // after checkbox & radio
  cy.get('[data-cy="episod-mengandung"]').select('5');
  cy.get('[data-cy="no-oku"]').type('123OKU');
  // submit
  cy.get('[data-cy="submit-pendaftaran"]').click();
  cy.get('[data-cy="submit-confirm-1"]').click();
  cy.get('[data-cy="submit-confirm-2"]').click();
  cy.visit(Cypress.env('GIRETCY_BASE_URL') + '/pendaftaran/daftar/kp'); // preventDefault() workaround bantai dlu lah sementara
});

Cypress.Commands.add('validateRegisteredGeneralPtKp', () => {
  // the assertion for registered patient kp -----
  cy.get('[data-cy="kemaskini"]').eq(-1).click();
  cy.get('[data-cy="fillable-form-header"]').should(
    'contain',
    'Klinik Pergigian'
  );
  // jenis-pengenalan
  cy.get('[data-cy="jenis-pengenalan"]').should('contain.value', 'mykad-mykid');
  // select option
  cy.get('[data-cy="jantina"]').should('contain.value', 'perempuan'); // assert jantina
  cy.get('[data-cy="kumpulan-etnik"]').should('contain.value', 'melayu');
  cy.get('[data-cy="negeri-alamat"]').should(
    'contain.value',
    'negeri sembilan'
  );
  cy.get('[data-cy="status-pesara"]').should('contain.value', 'pesara-atm');
  cy.get('[data-cy="rujuk-daripada"]').should(
    'contain.value',
    'hospital/institusi-kerajaan'
  );
  // text
  cy.get('[data-cy="nombor-telefon"]').should('contain.value', '0134445566');
  cy.get('[data-cy="nombor-telefon2"').should('contain.value', '0123334455');
  cy.get('[data-cy="email"]').should('contain.value', 'testmail@mail.test');
  cy.get('[data-cy="nama-umum"]').should(
    'contain.value',
    'siti aminah binti abu salam'
  );
  cy.get('[data-cy="alamat"]').should('contain.value', 'Alamat Fake');
  cy.get('[data-cy="daerah-alamat"]').should(
    'contain.value',
    'Kota Batu Samar'
  );
  cy.get('[data-cy="poskod-alamat"]').should('contain.value', '99999');
  cy.get('[data-cy="no-pesara"]').should('contain.value', '123PESARA');
  cy.get('[data-cy="no-resit"]').should('contain.value', 'RESIT1');
  cy.get('[data-cy="no-resit-2"]').should('contain.value', 'RESIT2');
  cy.get('[data-cy="no-resit-3"]').should('contain.value', 'RESIT3');
  cy.get('[data-cy="catatan"]').should('contain.value', 'CATATAN APA-APA');
  // checkbox & radio
  cy.get('[type="checkbox"]').each((el) => {
    expect(el[0].checked).to.equal(true);
  });
  cy.get('[name="booking-im"]').last().should('be.checked');
  cy.get('[name="kedatangan-kepp"]').last().should('be.checked');
  // after checkbox & radio
  cy.get('[data-cy="episod-mengandung"]').should('contain.value', '5');
  cy.get('[data-cy="no-oku"]').should('contain.value', '123OKU');
});

describe('Login Pendaftaran and start testing', () => {
  it('Test everything at Pendaftaran', () => {
    cy.loginPendaftaran({
      negeri: Cypress.env('NEGERI'),
      daerah: Cypress.env('DAERAH'),
      kodFasiliti: Cypress.env('KOD_FASILITI'),
      password: Cypress.env('FASILITI_PENDAFTARAN_PASSWORD'),
    });

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
          generateRandomIc(2) +
          '0' +
          generateRandomIcNoZero(1) +
          '0' +
          generateRandomIcNoZero(1) +
          generateRandomIc(5) +
          '2'; // haha lol bantai dlu cmni untuk perempuan
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
    cy.get('[data-cy="nama-umum"]').type('Pak Mat bin Abu Salam');
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
    // the assertion for /kp -----
    // start here..
  });
});

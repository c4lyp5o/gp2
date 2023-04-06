const moment = require('moment');

// we are using this helper function as long as sesi tamat persekolahan is not the same as end of year
const sesiTakwimSekolah = () => {
  // 👇 this is just arbitrary date for indicating sesi tamat sekolah, after this date pass, sekolah need to be added again into the system by pentadbir daerah
  const arbitraryDateSesiSekolahTamat = moment().format('YYYY') + '-03-15';
  // ☝️ this arbitrary date is based on the takwim given by MOEIS
  let sesiTahunSekolah;
  if (moment().isAfter(arbitraryDateSesiSekolahTamat) === true) {
    return (sesiTahunSekolah =
      'SESI ' +
      moment().format('YYYY') +
      '/' +
      moment().add(1, 'years').format('YYYY'));
  }
  if (moment().isAfter(arbitraryDateSesiSekolahTamat) === false) {
    return (sesiTahunSekolah =
      'SESI ' +
      moment().subtract(1, 'years').format('YYYY') +
      '/' +
      moment().format('YYYY'));
  }
};

module.exports = sesiTakwimSekolah;

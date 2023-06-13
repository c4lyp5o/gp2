const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fasilitiSchema = new Schema({
  // main header -----------------------------------------------------------------
  nama: {
    type: String,
  },
  createdByNegeri: {
    type: String,
  },
  createdByDaerah: {
    type: String,
  },
  jenisFasiliti: {
    type: String,
  },
  handler: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  kodFasilitiHandler: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  statusPerkhidmatan: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // kkiakd -----------------------------------------------------------------------
  kodKkiaKd: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // taska, tadika ----------------------------------------------------------------
  kodTastad: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  alamatTastad: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  enrolmenTastad: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  enrolmenKurang4Tahun: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  enrolmen5Tahun: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  enrolmen6Tahun: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  govKe: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // sekolah-rendah, sekolah-menengah ----------------------------------------------
  idInstitusi: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  kodSekolah: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  sesiTakwimSekolah: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  jenisPerkhidmatanSekolah: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  sekolahSelesaiReten: {
    type: Boolean,
    default: false,
  },
  // sr sm => PERSiS
  risikoSekolahPersis: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // sr sm => KOHORT FMR
  statusFMRSekolah: {
    type: String,
    default: 'tidak',
  },
  statusFMRTelahDaftarDarjahSatu: {
    type: Boolean,
    default: false,
  },
  // kp-bergerak makmal-pergigian ------------------------------------------------
  subJenisKPBMPB: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  penggunaanKPBMPB: {
    type: Array,
    default: [],
  },
  // tak pakai pun ni, recheck betul2 nnti boleh comment out
  // sr sm ------------------------------------------------------------------------
  // tarikhMulaSekolah: {
  //   type: String,
  //   default: 'NOT APPLICABLE',
  // },
  // // sr sm => BEGIN
  // melaksanakanBegin: {
  //   type: Boolean,
  //   default: false,
  // },
  // klinik -----------------------------------------------------------------------
  // dah ada dalam User model
  statusRoleKlinik: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // institusi --------------------------------------------------------------------
  // dah ada dalam Event model
  kategoriInstitusi: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  enrolmenInstitusi: {
    // dah ada dalam Even model
    type: String,
    default: 'NOT APPLICABLE',
  },
});

const Fasiliti = mongoose.model('Fasiliti', fasilitiSchema);

module.exports = Fasiliti;

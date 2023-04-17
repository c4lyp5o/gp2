const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fasilitiSchema = new Schema({
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
  // klinik
  statusRoleKlinik: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // fasiliti2 lain
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
  // sr sm
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
  // sr sm => KOHORT FMR
  statusFMRSekolah: {
    type: String,
    default: 'tidak',
  },
  statusFMRTelahDaftarDarjahSatu: {
    type: Boolean,
    default: false,
  },
  sekolahSelesaiReten: {
    type: Boolean,
    default: false,
  },
  // sr sm => BEGIN
  melaksanakanBegin: {
    type: Boolean,
    default: false,
  },
  // sr sm => Persis
  risikoSekolahPersis: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  tarikhMulaSekolah: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // kkia
  kodKkiaKd: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // tas tad
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
  // institusi
  kategoriInstitusi: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  enrolmenInstitusi: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // MPB KPB
  subJenisKPBMPB: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  penggunaanKPBMPB: {
    type: Array,
    default: [],
  },
});

const Fasiliti = mongoose.model('Fasiliti', fasilitiSchema);

module.exports = Fasiliti;

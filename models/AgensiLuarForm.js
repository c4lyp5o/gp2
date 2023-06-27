const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PemeriksaanAgensiLuarSchema = new Schema(
  {
    // main header -----------------------------------------------------------------
    tarikhMulaLawatan: {
      type: String,
      default: '',
    },
    tarikhAkhirLawatan: {
      type: String,
      default: '',
    },
    enrolmenKurang4Tahun: {
      type: Number,
      default: 0,
    },
    enrolmen5Tahun: {
      type: Number,
      default: 0,
    },
    enrolmen6Tahun: {
      type: Number,
      default: 0,
    },
    kedatanganBaru: {
      type: Number,
      default: 0,
    },
    kedatanganUlangan: {
      type: Number,
      default: 0,
    },
    dDesidus: {
      type: Number,
      default: 0,
    },
    mDesidus: {
      type: Number,
      default: 0,
    },
    fDesidus: {
      type: Number,
      default: 0,
    },
    xDesidus: {
      type: Number,
      default: 0,
    },
    aKebersihanMulut: {
      type: Number,
      default: 0,
    },
    cKebersihanMulut: {
      type: Number,
      default: 0,
    },
    eKebersihanMulut: {
      type: Number,
      default: 0,
    },
    takPerluRawatan: {
      type: Number,
      default: 0,
    },
    sapuanFvarnish: {
      type: Number,
      default: 0,
    },
    todDirujuk: {
      type: Number,
      default: 0,
    },
    todAbses: {
      type: Number,
      default: 0,
    },
    penilaianRisikoRendah: {
      type: Number,
      default: 0,
    },
    penilaianRisikoSederhana: {
      type: Number,
      default: 0,
    },
    penilaianRisikoTinggi: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'Pemeriksaanagensiluar',
  PemeriksaanAgensiLuarSchema
);

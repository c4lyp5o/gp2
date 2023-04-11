const mongoose = require('mongoose');

const KohortFMRSchema = new mongoose.Schema(
  {
    // negeri, daerah, kp, operator are associated with each kotak
    createdByNegeri: {
      type: String,
      required: true,
    },
    createdByDaerah: {
      type: String,
      required: true,
    },
    createdByKodFasiliti: {
      type: String,
      required: true,
    },
    createdByKp: {
      type: String,
      required: true,
    },
    createdByMdcMdtb: {
      type: String,
      //   required: true,
    },
    createdByUsername: {
      type: String,
      // required: true,
    },
    // FMR --------------------------------------------------
    nama: {
      type: String,
      default: '',
    },
    ic: {
      type: String,
      default: '',
    },
    namaSekolah: {
      type: String,
      default: '',
    },
    kodSekolah: {
      type: String,
      default: '',
    },
    tahun: {
      type: String,
      default: '',
    },
    kelas: {
      type: String,
      default: '',
    },
    dalamPemantauanKohort: {
      type: String,
      default: '',
      // required: true,
    },
    tahunKohort: {
      type: String,
      default: '',
      // required: true,
    },
    tarikhKumuranTerakhir: {
      type: String,
      default: '',
      // required: true,
    },
    jumlahKumuran: {
      type: Number,
      default: 0,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KohortFMR', KohortFMRSchema);

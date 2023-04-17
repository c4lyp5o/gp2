const mongoose = require('mongoose');

const KohortKotakSchema = new mongoose.Schema(
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
      //   required: true,
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
      required: true,
    },
    // kotak --------------------------------------------------
    statusKotak: {
      type: String,
      default: 'belum mula',
    },
    idIndividu: {
      type: String,
      default: '',
    },
    nama: {
      type: String,
      default: '',
    },
    nomborId: {
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
    tahunTingkatan: {
      type: String,
      default: '',
    },
    kelasPelajar: {
      type: String,
      default: '',
    },
    noTelefon: {
      type: String,
      default: '',
    },
    dalamPemantauanKohort: {
      type: String,
      default: '',
    },
    rokokBiasaKotak: {
      type: Boolean,
      default: false,
    },
    elektronikVapeKotak: {
      type: Boolean,
      default: false,
    },
    shishaKotak: {
      type: Boolean,
      default: false,
    },
    lainLainKotak: {
      type: Boolean,
      default: false,
    },
    tarikhIntervensi1: {
      type: String,
      default: '',
    },
    adaTiadaQTarikh1: {
      type: String,
      default: '',
    },
    tarikhIntervensi2: {
      type: String,
      default: '',
    },
    adaTiadaQTarikh2: {
      type: String,
      default: '',
    },
    tarikhIntervensi3: {
      type: String,
      default: '',
    },
    adaTiadaQTarikh3: {
      type: String,
      default: '',
    },
    tarikhIntervensi4: {
      type: String,
      default: '',
    },
    adaTiadaQTarikh4: {
      type: String,
      default: '',
    },
    rujukGuruKaunseling: {
      type: String,
      default: '',
    },
    tarikhQ: {
      type: String,
      default: '',
    },
    statusSelepas6Bulan: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kohortkotak', KohortKotakSchema);

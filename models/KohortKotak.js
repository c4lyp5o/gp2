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
    createdByKp: {
      type: String,
      required: true,
    },
    createdByKodFasiliti: {
      type: String,
      required: true,
    },
    createdByUsername: {
      type: Array,
      required: true,
      default: [],
    },
    createdByMdcMdtb: {
      type: String,
      required: true,
    },
    // copied over from MOEIS ----------------------------------------
    idInstitusi: {
      type: String,
      default: 'MISSING COPIED ID_INSTITUSI',
    },
    kodSekolah: {
      type: String,
      default: 'MISSING COPIED KOD_INSTITUSI',
    },
    namaSekolah: {
      type: String,
      default: 'MISSING COPIED NAMA INSTITUSI',
    },
    idIndividu: {
      type: String,
      default: 'MISSING COPIED ID_INDIVIDU',
    },
    nomborId: {
      type: String,
      default: 'MISSING COPIED NOMBOR_ID', // pengenalan diri
    },
    nama: {
      type: String,
      default: 'MISSING COPIED NAMA',
    },
    sesiTakwimPelajar: {
      type: String,
      default: 'MISSING COPIED SESI_TAKWIM',
    },
    tahunTingkatan: {
      type: String,
      default: 'MISSING COPIED TAHUN_TINGKATAN',
    },
    kelasPelajar: {
      type: String,
      default: 'MISSING COPIED NAMA KELAS',
    },
    jantina: {
      type: String,
      default: 'MISSING COPIED JANTINA',
    },
    statusOku: {
      type: String,
      default: 'MISSING COPIED STATUS_OKU',
    },
    tarikhLahir: {
      type: String,
      default: 'MISSING COPIED tarikh_lahir',
    },
    umur: {
      type: Number,
      default: 7777777, // lucky seven lol
    },
    keturunan: {
      type: String,
      default: 'MISSING COPIED keturunan',
    },
    warganegara: {
      type: String,
      default: 'MISSING COPIED warganegara',
    },
    // status KOTAK --------------------------------------------------
    statusKotak: {
      type: String,
      default: 'belum mula',
    },
    // start own field --------------------------------------------------
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

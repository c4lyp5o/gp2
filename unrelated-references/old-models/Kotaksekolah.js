const mongoose = require('mongoose');

const KotakSchema = new mongoose.Schema({
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
  createdByUsername: {
    type: String,
    required: true,
  },
  // kotak --------------------------------------------------
  dalamPemantauanKohort: {
    type: String,
    default: '',
  },
  statusM: {
    type: String,
    default: '',
  },
  menerimaNasihatRingkas: {
    type: String,
    default: '',
  },
  inginMelakukanIntervensiMerokok: {
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
  tarikh1: {
    type: String,
    default: '',
  },
  adaTiadaQTarikh1: {
    type: String,
    default: '',
  },
  tarikh2: {
    type: String,
    default: '',
  },
  adaTiadaQTarikh2: {
    type: String,
    default: '',
  },
  tarikh3: {
    type: String,
    default: '',
  },
  adaTiadaQTarikh3: {
    type: String,
    default: '',
  },
  tarikh4: {
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
});

module.exports = mongoose.model('Kotaksekolah', KotakSchema);

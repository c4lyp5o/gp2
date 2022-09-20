const mongoose = require('mongoose');

const SekolahSchema = new mongoose.Schema({
  // model

  komplikasiSelepasCabutan: {
    type: String,
    defaultValue: '0',
  },
  rawatanLain: {
    type: String,
    defaultValue: '0',
  },
  rawatanEndo: {
    type: String,
    defaultValue: '0',
  },
  rawatanOrtho: {
    type: String,
    defaultValue: '0',
  },
  kesPerubatan: {
    type: String,
    defaultValue: '0',
  },
  absesBaru: {
    type: String,
    defaultValue: '0',
  },
  AbsesSemula: {
    type: String,
    defaultValue: '0',
  },
  cabutanSurgical: {
    type: String,
    defaultValue: '0',
  },
  fraktur: {
    type: String,
    defaultValue: '0',
  },
  trauma: {
    type: String,
    defaultValue: '0',
  },
  pembedahanKecilMulut: {
    type: String,
    defaultValue: '0',
  },
  crownBridgeBaru: {
    type: String,
    defaultValue: '0',
  },
  crownBridgeSemula: {
    type: String,
    defaultValue: '0',
  },
  postCoreBaru: {
    type: String,
    defaultValue: '0',
  },
  postCoreSemula: {
    type: String,
    defaultValue: '0',
  },
  prosthodontikPenuhDentur: {
    type: String,
    defaultValue: '0',
  },
  prosthodontikPenuhPesakit: {
    type: String,
    defaultValue: '0',
  },
  prosthodontikSebahagianDentur: {
    type: String,
    defaultValue: '0',
  },
  prosthodontikSebahagianPesakit: {
    type: String,
    defaultValue: '0',
  },
  immediateDenture: {
    type: String,
    defaultValue: '0',
  },
  pembaikanDenture: {
    type: String,
    defaultValue: '0',
  },
  kesSelesai: {
    type: String,
    defaultValue: '0',
  },
  xrayDiambil: {
    type: String,
    defaultValue: '0',
  },
  pesakitDisaringOC: {
    type: String,
    defaultValue: '0',
  },
  pesakitdirujukLesiMulut: {
    type: String,
    defaultValue: '0',
  },
  pesakitDirujukTabiat: {
    type: String,
    defaultValue: '0',
  },
  rokokSaringNasihat: {
    type: String,
    defaultValue: '0',
  },
  rokokIntervensi: {
    type: String,
    defaultValue: '0',
  },
});

module.exports = mongoose.model('Sekolah', SekolahSchema);

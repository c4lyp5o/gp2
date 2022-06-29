const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservoirSchema = new Schema({
  jumlahKedatanganBaru: {
    type: Number,
    // required: true
  },
  jumlahKedatanganUlangan: {
    type: Number,
  },
  jumlahd: {
    type: Number,
    // required: true
  },
  jumlahf: {
    type: Number,
  },
  jumlahx: {
    type: Number,
    // required: true
  },
  jumlahD: {
    type: Number,
  },
  jumlahM: {
    type: Number,
    // required: true
  },
  jumlahF: {
    type: Number,
  },
  jumlahX: {
    type: Number,
    // required: true
  },
  jumlahMBK: {
    type: Number,
  },
  dfxEqualToZero: {
    type: Number,
    // required: true
  },
  statusBebasKaries: {
    type: Number,
  },
  totalStatusGigiKekalSamaKosong: {
    type: Number,
    // required: true
  },
  gigiKekalDMFXsamaAtauKurangDari1: {
    type: Number,
  },
  gigiKekalDMFXsamaAtauKurangDari2: {
    type: Number,
    // required: true
  },
  eMoreThanZero: {
    type: Number,
  },
  statusBebasKariesTapiElebihDariSatu: {
    type: Number,
    // required: true
  },
  kecederaanGigiAnterior: {
    type: Number,
  },
  jumlahTPR: {
    type: Number,
    // required: true
  },
  skorGIS0: {
    type: Number,
  },
  skorGIS1: {
    type: Number,
    // required: true
  },
  skorGIS2: {
    type: Number,
  },
  skorGIS3: {
    type: Number,
    // required: true
  },
  perluFvMurid: {
    type: Number,
  },
  perluPRR1Murid: {
    type: Number,
    // required: true
  },
  perluFSMuridB: {
    type: Number,
  },
  perluFSMuridS: {
    type: Number,
    // required: true
  },
  perluFSGigiB: {
    type: Number,
  },
  perluFSGigiS: {
    type: Number,
    // required: true
  },
  perluTampalanAntGdB: {
    type: Number,
  },
  perluTampalanAntGdS: {
    type: Number,
    // required: true
  },
  perluTampalanAntGkB: {
    type: Number,
  },
  perluTampalanAntGkS: {
    type: Number,
    // required: true
  },
  perluTampalanPosGdB: {
    type: Number,
  },
  perluTampalanPosGdS: {
    type: Number,
    // required: true
  },
  perluTampalanPosGkB: {
    type: Number,
  },
  perluTampalanPosGkS: {
    type: Number,
    // required: true
  },
  perluTampalanAmgGdB: {
    type: Number,
  },
  perluTampalanAmgGdS: {
    type: Number,
    // required: true
  },
  perluTampalanAmgGkB: {
    type: Number,
  },
  perluTampalanAmgGkS: {
    type: Number,
    // required: true
  },
  telahFvMurid: {
    type: Number,
  },
  telahPRR1Murid: {
    type: Number,
    // required: true
  },
  telahFSMuridB: {
    type: Number,
  },
  telahFSMuridS: {
    type: Number,
    // required: true
  },
  telahTampalanAntGdB: {
    type: Number,
  },
  telahTampalanAntGdS: {
    type: Number,
    // required: true
  },
  telahTampalanAntGkB: {
    type: Number,
  },
  telahTampalanAntGkS: {
    type: Number,
    // required: true
  },
  telahTampalanPosGdB: {
    type: Number,
  },
  telahTampalanPosGdS: {
    type: Number,
    // required: true
  },
  telahTampalanPosGkB: {
    type: Number,
  },
  telahTampalanPosGkS: {
    type: Number,
    // required: true
  },
  telahTampalanAmgGdB: {
    type: Number,
  },
  telahTampalanAmgGdS: {
    type: Number,
    // required: true
  },
  telahTampalanAmgGkB: {
    type: Number,
  },
  telahTampalanAmgGkS: {
    type: Number,
    // required: true
  },
  cabutanGd: {
    type: Number,
  },
  cabutanGk: {
    type: Number,
    // required: true
  },
  penskaleran: {
    type: Number,
  },
  caseCompleted: {
    type: Number,
    // required: true
  },
});

const Reservoir = mongoose.model('Reservoir', reservoirSchema);

module.exports = Reservoir;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agensiLuarSchema = new Schema(
  {
    createdByNegeri: { type: String, required: true },
    createdByDaerah: { type: String, required: true },
    tahunSemasa: { type: Number, required: true, default: 0 },
    visitNumber: { type: Number, required: true, default: 0 },
    // Program G-tod --------------------------------------------------
    jenisAgensiLuar: { type: String, default: 'NOT APPLICABLE' },
    namaAgensiLuar: { type: String, default: 'NOT APPLICABLE' },
    statusPenglibatan: { type: String, default: 'NOT APPLICABLE' },
    bilPegawaiPergigian: { type: Number, default: 0 },
    bilJuruterapi: { type: Number, default: 0 },
    enrolmenKurang4Tahun: { type: Number, default: 0 },
    namaTaskaTadika: { type: String, default: 'NOT APPLICABLE' },
    alamatTaskaTadika: { type: String, default: 'NOT APPLICABLE' },
    // pemeriksaan -------------------------------------------------------
    pemeriksaanAgensiLuar1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pemeriksaanagensiluar',
    },
    pemeriksaanAgensiLuar2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pemeriksaanagensiluar',
    },
    // Program Warga Emas --------------------------------------------------
    // TODO later
  },
  { timestamps: true }
);

const AgensiLuar = mongoose.model('Agensiluar', agensiLuarSchema);

module.exports = AgensiLuar;

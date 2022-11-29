const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socmedSchema = new Schema(
  {
    belongsTo: { type: String, required: true },
    createdByNegeri: { type: String },
    createdByDaerah: { type: String },
    createdByKp: { type: String },
    kodProgram: { type: String },
    namaAktiviti: { type: String },
    tarikhMula: { type: String },
    tarikhAkhir: { type: String },
    data: { type: Array },
  },
  { timestamps: true }
);

const MediaSosial = mongoose.model('MediaSosial', socmedSchema);

module.exports = MediaSosial;

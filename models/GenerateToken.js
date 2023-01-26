const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generateTokenSchema = new Schema(
  {
    belongsTo: { type: String, required: true },
    accountType: { type: String, required: true },
    createdByNegeri: { type: String },
    createdByDaerah: { type: String },
    createdByKp: { type: String },
    createdByKodFasiliti: { type: String },
    jenisReten: { type: String },
    jumlahToken: { type: Number },
  },
  { timestamps: true }
);

const GenerateToken = mongoose.model('GenerateToken', generateTokenSchema);

module.exports = GenerateToken;

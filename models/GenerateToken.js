const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generateTokenSchema = new Schema(
  {
    belongsTo: { type: String, required: true },
    accountType: { type: String, required: true },
    jenisReten: { type: String },
    jumlahToken: { type: Number },
    createdByNegeri: { type: String },
    createdByDaerah: { type: String },
    createdByKp: { type: String },
    createdByKodFasiliti: { type: String },
  },
  { timestamps: true }
);

const GenerateToken = mongoose.model('GenerateToken', generateTokenSchema);

module.exports = GenerateToken;

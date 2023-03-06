const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statistikSchema = new Schema(
  {
    numberOfLogins: { type: Number },
    numberOfLogouts: { type: Number },
    numberOfRetensGenerated: { type: Number },
    dataDate: { type: String },
  },
  { timestamps: true }
);

const Statistik = mongoose.model('Statistik', statistikSchema);

module.exports = Statistik;

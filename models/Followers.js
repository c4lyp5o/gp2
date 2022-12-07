const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema(
  {
    belongsTo: { type: String, required: true },
    createdByNegeri: { type: String },
    createdByDaerah: { type: String },
    createdByKp: { type: String },
    bulan: { type: String },
    namaPlatform: { type: String },
    jumlahFollowerBulanTerdahulu: { type: Number },
    jumlahFollowerBulanIni: { type: Number },
  },
  { timestamps: true }
);

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;

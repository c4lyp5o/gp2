const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socmedSchema = new Schema(
  {
    createdByNegeri: { type: String },
    createdByDaerah: { type: String },
    createdByKp: { type: String },
    tarikh: { type: String },
    data: { type: Array },
  },
  { timestamps: true }
);

const MediaSosial = mongoose.model('MediaSosial', socmedSchema);

module.exports = MediaSosial;

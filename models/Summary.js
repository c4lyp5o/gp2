const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const summarySchema = new Schema(
  {
    createdByNegeri: { type: String },
    createdByDaerah: { type: String },
    createdByKp: { type: String },
    createdByUsername: { type: String },
    tarikh: { type: String },
    data: { type: Array },
  },
  { timestamps: true }
);

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;

const mongoose = require('mongoose');

const RunningnumberSchema = new mongoose.Schema({
  runningnumber: {
    type: Number,
  },
  jenis: {
    type: String,
  },
  negeri: {
    type: String,
  },
  daerah: {
    type: String,
  },
  kp: {
    type: String,
  },
  kodFasiliti: {
    type: String,
  },
  tahun: {
    type: Number,
  },
});

module.exports = mongoose.model('Runningnumber', RunningnumberSchema);

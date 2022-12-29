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
  tahun: {
    type: Number,
  },
  kodFasiliti: {
    type: String,
  },
});

module.exports = mongoose.model('Runningnumber', RunningnumberSchema);

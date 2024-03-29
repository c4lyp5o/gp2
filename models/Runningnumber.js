const mongoose = require('mongoose');

const RunningnumberSchema = new mongoose.Schema({
  runningnumber: {
    type: Number,
    // required: [true, 'Please provide running number'],
  },
  jenis: {
    type: String,
    // required: [true, 'Please provide jenis'],
  },
  negeri: {
    type: String,
    // required: [true, 'Please provide negeri'],
  },
  daerah: {
    type: String,
  },
  kp: {
    type: String,
  },
});

module.exports = mongoose.model('Runningnumber', RunningnumberSchema);

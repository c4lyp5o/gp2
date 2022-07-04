const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    negeri: {
      type: String,
      required: [true, 'Please provide negeri'],
    },
    daerah: {
      type: String,
      required: [true, 'Please provide daerah'],
    },
    kp: {
      type: String,
      required: [true, 'Please provide KP'],
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;

const mongoose = require('mongoose');

const UmumSchema = new mongoose.Schema(
  {
    // negeri, daerah, kp, operator are associated with each person
    createdByNegeri: {
      type: String,
      required: true,
    },
    createdByDaerah: {
      type: String,
      required: true,
    },
    createdByKp: {
      type: String,
      required: true,
    },
    createdByUsername: {
      type: String,
      required: true,
    },
    nama: {
      type: String,
      required: [true, 'Please provide nama'],
      trim: true,
    },
    jantina: {
      type: String,
      required: [true, 'Please provide jantina'],
    },
    umur: {
      type: Number,
      required: [true, 'Please provide umur'],
    },
    ic: {
      type: String,
      required: [true, 'Please provide IC'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Umum', UmumSchema);

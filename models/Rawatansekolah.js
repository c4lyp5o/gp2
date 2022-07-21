const mongoose = require('mongoose');

const RawatansekolahSchema = new mongoose.Schema({
  // negeri, daerah, kp, operator are associated with each rawatan
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
  // rawatan ----------------------------------------------------------
  cabutDesidusPenyataAkhir2: {
    type: Number,
    min: 0,
    default: 0,
  },
  cabutKekalPenyataAkhir2: {
    type: Number,
    min: 0,
    default: 0,
  },
});

module.exports = mongoose.model('Rawatansekolah', RawatansekolahSchema);

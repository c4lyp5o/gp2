const mongoose = require('mongoose');

const SekolahSchema = new mongoose.Schema({
  // model

  rokokSaringNasihat: {
    type: String,
    defaultValue: '0',
  },
  rokokIntervensi: {
    type: String,
    defaultValue: '0',
  },
});

module.exports = mongoose.model('Sekolah', SekolahSchema);

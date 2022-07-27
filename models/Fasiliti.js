const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fasilitiSchema = new Schema({
  nama: {
    type: String,
    // required: true
  },
  kodSekolah: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  createdByNegeri: {
    type: String,
    // required: true
  },
  createdByDaerah: {
    type: String,
    // required: true
  },
  handler: {
    type: String,
    // required: true
  },
  jenisFasiliti: {
    type: String,
  },
  keppStatus: {
    type: String,
    default: 'NOT APPLICABLE',
  },
});

const Fasiliti = mongoose.model('Fasiliti', fasilitiSchema);

module.exports = Fasiliti;

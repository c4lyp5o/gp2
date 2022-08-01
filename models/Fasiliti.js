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
    default: 'NOT APPLICABLE',
  },
  jenisFasiliti: {
    type: String,
  },
  melaksanakanBegin: {
    type: Boolean,
    default: false,
  },
  keppStatus: {
    type: Boolean,
    default: false,
  },
});

const Fasiliti = mongoose.model('Fasiliti', fasilitiSchema);

module.exports = Fasiliti;

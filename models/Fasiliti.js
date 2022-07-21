const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fasilitiSchema = new Schema({
  nama: {
    type: String,
    // required: true
  },
  negeri: {
    type: String,
    // required: true
  },
  daerah: {
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
  melaksanakanBegin: {
    type: String,
    default: 'tidak',
  },
});

const Fasiliti = mongoose.model('Fasiliti', fasilitiSchema);

module.exports = Fasiliti;

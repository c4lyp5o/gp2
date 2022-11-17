//
//
// NI UNTUK JENIS PROMOSI
//
//

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jenisPromosiSchema = new Schema({
  nama: {
    type: Array,
    // required: true
    default: ['Facebook', 'Instagram', 'Twitter', 'Youtube', 'Tiktok'],
  },
});

const JenisPromosi = mongoose.model('JenisPromosi', jenisPromosiSchema);

module.exports = JenisPromosi;

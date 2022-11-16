//
//
// NI UNTUK JENIS PROMOSI
//
//

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promosiSchema = new Schema({
  nama: {
    type: String,
    // required: true
  },
});

const Promosi = mongoose.model('Promosi', promosiSchema);

module.exports = Promosi;

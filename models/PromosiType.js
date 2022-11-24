//
//
// NI UNTUK JENIS PROMOSI
//
//

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jenisPromosiSchema = new Schema({
  nama: { type: String, required: true },
  mediaSosial: {
    type: Array,
    default: ['Facebook', 'Instagram', 'Twitter', 'Youtube', 'Tiktok'],
  },
  program: { type: Array, default: [] },
});

jenisPromosiSchema.methods.getMediaSosial = function () {
  return this.mediaSosial;
};

jenisPromosiSchema.methods.getProgram = function () {
  return this.program;
};

const PromosiType = mongoose.model('PromosiType', jenisPromosiSchema);

module.exports = PromosiType;

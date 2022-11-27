const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromosiTypeSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  mediaSosial: {
    type: Array,
    default: ['Facebook', 'Instagram', 'Twitter', 'Youtube', 'Tiktok'],
  },
  program: {
    type: Array,
    default: [],
  },
});

PromosiTypeSchema.methods.getMediaSosial = function () {
  return this.mediaSosial;
};

PromosiTypeSchema.methods.getProgram = function () {
  return this.program;
};

module.exports = mongoose.model('PromosiType', PromosiTypeSchema);

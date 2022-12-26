const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  createdByNegeri: {
    type: String,
    default: '',
  },
  createdByDaerah: {
    type: String,
    default: '',
  },
  createdByKp: {
    type: String,
    default: '',
  },
  createdByKodFasiliti: {
    type: String,
    default: '',
  },
  tarikhStart: {
    type: String,
    default: '',
  },
  tarikhEnd: {
    type: String,
    default: '',
  },
  nama: {
    type: String,
    default: '',
  },
  jenisEvent: {
    type: String,
    default: '',
  },
  tempat: {
    type: String,
    default: '',
  },
  // for programDewasaMuda
  kategoriInstitusi: {
    type: String,
    default: '',
  },
  // for programDewasaMuda, we, oku
  enrolmenInstitusi: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  modPenyampaianPerkhidmatan: {
    type: Array,
    default: [],
  },
  penggunaanKpb: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  penggunaanMpb: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  assignedByDaerah: {
    type: Boolean,
    default: false,
  },
  tahunDibuat: {
    type: Number,
    default: 0,
  },
});

EventSchema.pre('save', async function () {
  try {
    const yearNumber = new Date().getFullYear();
    this.tahunDibuat = yearNumber;
  } catch (error) {
    console.log(error);
  }
});

module.exports = mongoose.model('Event', EventSchema);

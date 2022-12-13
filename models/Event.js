const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  createdByNegeri: {
    type: String,
  },
  createdByDaerah: {
    type: String,
  },
  createdByKp: {
    type: String,
  },
  createdByKodFasiliti: {
    type: String,
  },
  tarikhStart: {
    type: String,
  },
  tarikhEnd: {
    type: String,
  },
  nama: {
    type: String,
  },
  jenisEvent: {
    type: String,
  },
  tempat: {
    type: String,
  },
  modPenyampaianPerkhidmatan: {
    type: Array,
  },
  kategoriInstitusi: {
    type: String,
  },
  assignedByDaerah: {
    type: Boolean,
    default: false,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

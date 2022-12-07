const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  createdByNegeri: {
    type: String,
  },
  createdByDaerah: {
    type: String,
  },
  tarikhStart: {
    type: String,
    // required: true
  },
  tarikhEnd: {
    type: String,
  },
  createdByKp: {
    type: String,
  },
  createdByKodFasiliti: {
    type: String,
  },
  nama: {
    type: String,
  },
  kategoriInstitusi: {
    type: String,
    // required: true
  },
  tarikh: {
    type: String,
  },
  tempat: {
    type: String,
  },
  jenisEvent: {
    type: String,
  },
  modPenyampaianPerkhidmatan: {
    type: Array,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

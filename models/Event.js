const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  nama: {
    type: String,
    // required: true
  },
  tarikh: {
    type: String,
    // required: true
  },
  masaMula: {
    type: String,
    // required: true
  },
  masaTamat: {
    type: String,
    // required: true
  },
  tempat: {
    type: String,
    // required: true
  },
  jenisEvent: {
    type: String,
    // required: true
  },
  modPenyampaianPerkhidmatan: {
    type: String,
    // required: true
  },
  createdByKp: {
    type: String,
    // required: true
  },
  createdByDaerah: {
    type: String,
    // required: true
  },
  createdByNegeri: {
    type: String,
    // required: true
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

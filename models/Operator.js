const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const operatorSchema = new Schema({
  nama: {
    type: String,
    // required: true
  },
  e_mail: {
    type: String,
    // required: true
  },
  mdcNumber: {
    type: String,
    // required: true
  },
  // jp
  mdtbNumber: {
    type: String,
    // required: true
  },
  gred: {
    type: String,
    // required: true
  },
  createdByNegeri: {
    type: String,
    // required: true
  },
  createdByDaerah: {
    type: String,
    // required: true
  },
  kpSkrg: {
    type: String,
    // required: true
  },
  role: {
    type: String,
    // required: true
  },
  statusPegawai: {
    type: String,
    // required: true
  },
  tempKey: {
    type: String,
    // required: true
  },
});

const Operator = mongoose.model('Operator', operatorSchema);

module.exports = Operator;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const operatorSchema = new Schema({
  nama: {
    type: String,
  },
  email: {
    type: String,
  },
  mdcNumber: {
    type: String,
  },
  mdtbNumber: {
    type: String,
  },
  gred: {
    type: String,
  },
  createdByNegeri: {
    type: String,
  },
  createdByDaerah: {
    type: String,
  },
  kpSkrg: {
    type: String,
  },
  kodFasiliti: {
    type: String,
  },
  role: {
    type: String,
  },
  rolePromosiKlinik: {
    type: Boolean,
    default: false,
  },
  statusPegawai: {
    type: String,
  },
  cscspVerified: {
    type: Boolean,
    default: false,
  },
  tempKey: {
    type: String,
  },
  activationStatus: {
    type: Boolean,
    default: false,
  },
  summary: {
    type: Array,
    default: [],
  },
  tempatBertugasSebelumIni: {
    type: Array,
    default: [],
  },
});

const Operator = mongoose.model('Operator', operatorSchema);

module.exports = Operator;

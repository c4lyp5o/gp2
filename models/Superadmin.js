const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  user_name: { type: String, required: true },
  createdByDaerah: { type: String, required: true },
  createdByNegeri: { type: String, required: true },
  tempKey: { type: String },
});

const Superadmin = mongoose.model('Superadmin', adminSchema);

module.exports = Superadmin;

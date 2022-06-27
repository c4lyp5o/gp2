const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  daerah: { type: String, required: true },
  negeri: { type: String, required: true },
  token: { type: String },
  tempKey: { type: String },
});

const Superadmin = mongoose.model('Superadmin', adminSchema);

module.exports = Superadmin;

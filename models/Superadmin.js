const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  user_name: { type: String, required: true },
  kp: { type: String, required: true, default: 'NOT APPLICABLE' },
  daerah: { type: String, required: true },
  negeri: { type: String, required: true },
  e_mail: { type: String },
  accountType: {
    type: String,
    enum: {
      values: [
        'kpSuperadmin',
        'daerahSuperadmin',
        'negeriSuperadmin',
        'hqSuperadmin',
      ],
      message:
        '{VALUE} is not supported. Provide only "kpSuperadmin", "daerahSuperadmin", "negeriSuperadmin", "hqSuperadmin"',
    },
  },
  tempKey: { type: String, default: '' },
});

const Superadmin = mongoose.model('Superadmin', adminSchema);

module.exports = Superadmin;

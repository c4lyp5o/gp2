const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  image: { type: String },
  user_name: { type: String, required: true },
  nama: { type: String },
  tarikhLahir: { type: String },
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
  // totp
  totp: { type: Boolean, default: false },
  ascii: { type: String, default: '' },
  hex: { type: String, default: '' },
  base32: { type: String, default: '' },
  otpauth_url: { type: String, default: '' },
  backup_codes: { type: Array, default: [] },
  hashed_backup_codes: { type: Array, default: [] },
});

adminSchema.pre('save', function (next) {
  if (!this.nama) {
    this.nama = this.user_name;
  }
  next();
});

const Superadmin = mongoose.model('Superadmin', adminSchema);

module.exports = Superadmin;

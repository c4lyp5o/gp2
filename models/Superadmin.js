const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const adminSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  negeri: {
    type: String,
    required: true,
  },
  daerah: {
    type: String,
    required: true,
  },
  e_mail: {
    type: String,
    required: true,
  },
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
  nama: {
    type: String,
    default: '',
  },
  tarikhLahir: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  tempKey: {
    type: String,
    default: '',
  },
  totp: {
    type: Boolean,
    default: false,
  },
  ascii: {
    type: String,
    default: '',
  },
  hex: {
    type: String,
    default: '',
  },
  base32: {
    type: String,
    default: '',
  },
  otpauth_url: {
    type: String,
    default: '',
  },
  backup_codes: {
    type: Array,
    default: [],
  },
  hashed_backup_codes: {
    type: Array,
    default: [],
  },
});

adminSchema.pre('save', function (next) {
  if (!this.nama) {
    this.nama = this.user_name;
  }
  next();
});

adminSchema.methods.getProfile = function () {
  const admin = this;
  const adminObject = admin.toObject();

  adminObject.username = admin.nama;
  delete adminObject.user_name;
  delete adminObject.tempKey;
  delete adminObject.ascii;
  delete adminObject.hex;
  delete adminObject.base32;
  delete adminObject.otpauth_url;
  delete adminObject.backup_codes;
  delete adminObject.hashed_backup_codes;

  return adminObject;
};

adminSchema.methods.createJWT = function () {
  const token = jwt.sign(
    {
      userId: this._id.toString(),
      username: this.nama,
      accountType: this.accountType,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
};

const Superadmin = mongoose.model('Superadmin', adminSchema);

module.exports = Superadmin;

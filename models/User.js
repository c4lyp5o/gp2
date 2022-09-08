const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Runningnumber = require('./Runningnumber');
const emailGen = require('../lib/emailgen');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    unique: true,
  },
  negeri: {
    type: String,
    required: [true, 'Please provide negeri'],
  },
  daerah: {
    type: String,
    required: [true, 'Please provide daerah'],
  },
  kp: {
    type: String,
    required: [true, 'Please provide KP'],
  },
  accountType: {
    type: String,
    required: [true, 'Please provide account type'],
    enum: {
      values: [
        'kpUser',
        'kaunterUser',
        'erkmUser',
        'daerahUser',
        'negeriUser',
        'hqUser',
      ],
      message:
        '{VALUE} is not supported. Provide only "kpUser", "kaunterUser", "erkmUser", "daerahUser", "negeriUser", "hqUser"',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
  },
  kodFasiliti: {
    type: String,
    required: [true, 'Please provide account type'],
    enum: {
      values: ['kp', 'kepp', 'utc', 'rtc', 'visiting'],
      message:
        '{VALUE} is not supported. Provide only "kp", "kepp", "utc", "rtc", "visiting"',
    },
    default: 'kp',
  },
});

UserSchema.pre('save', async function () {
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    const negeriNum = emailGen[this.negeri].kodNegeri;
    const daerahNum = emailGen[this.negeri].daerah[this.daerah];
    const currentRunningNumber = await Runningnumber.findOne({
      jenis: this.kodFasiliti,
      negeri: this.negeri,
    });
    const newRunningNumber = currentRunningNumber.runningnumber + 1;
    const email = `${this.kodFasiliti}${negeriNum}${daerahNum}${newRunningNumber}@moh.gov.my`;
    this.email = email;
    const updateRunningNumber = await Runningnumber.findByIdAndUpdate(
      currentRunningNumber._id,
      { runningnumber: newRunningNumber },
      { new: true }
    );
    console.log(updateRunningNumber);
  } catch (err) {
    console.error(err);
  }
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
      negeri: this.negeri,
      daerah: this.daerah,
      kp: this.kp,
      accountType: this.accountType,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcryptjs.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);

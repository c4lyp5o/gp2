const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Runningnumber = require('./Runningnumber');
const emailGen = require('../lib/emailgen');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: [true, 'Please provide username'],
    unique: true,
  },
  negeri: {
    type: String,
    // required: [true, 'Please provide negeri'],
  },
  daerah: {
    type: String,
    // required: [true, 'Please provide daerah'],
  },
  kp: {
    type: String,
    // required: [true, 'Please provide KP'],
  },
  accountType: {
    type: String,
    // required: [true, 'Please provide account type'],
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
    // required: [true, 'Please provide password'],
    minlength: 6,
  },
  email: {
    type: String,
    // required: [true, 'Please provide email'],
    unique: true,
  },

  // this is klinik
  kodFasiliti: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  statusPerkhidmatan: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  statusRoleKlinik: {
    type: String,
    // required: [true, 'Please provide account type'],
    enum: {
      values: ['klinik', 'kepp', 'utc', 'rtc', 'visiting'],
      message:
        '{VALUE} is not supported. Provide only "klinik", "kepp", "utc", "rtc", "visiting"',
    },
    default: 'klinik',
  },
});

UserSchema.pre('save', async function () {
  try {
    const generateRandomString = (length) => {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };
    // const salt = await bcryptjs.genSalt(10);
    // this.password = await bcryptjs.hash(this.password, salt);
    const negeriNum = emailGen[this.negeri].kodNegeri;
    const daerahNum = emailGen[this.negeri].daerah[this.daerah];
    const randomString = generateRandomString(6);
    this.password = randomString;
    let currentRunningNumber = await Runningnumber.findOne({
      negeri: this.negeri,
      daerah: this.daerah,
    });
    if (!currentRunningNumber) {
      const newRunningNumber = await Runningnumber.create({
        negeri: this.negeri,
        daerah: this.daerah,
        runningnumber: 1,
      });
      const username = `${this.kodFasiliti}${negeriNum}${daerahNum}${newRunningNumber.runningnumber}`;
      this.username = username;
    }
    if (currentRunningNumber) {
      currentRunningNumber.runningnumber += 1;
      await currentRunningNumber.save();
      const username = `${this.kodFasiliti}${negeriNum}${daerahNum}${currentRunningNumber.runningnumber}`;
      this.username = username;
    }
    console.log('updateRunningNumber');
  } catch (err) {
    console.error(err);
  }
});

UserSchema.methods.updateRunningNumber = async function () {
  try {
    const currentRunningNumber = await Runningnumber.findOne({
      jenis: this.kodFasiliti,
      negeri: this.negeri,
      daerah: this.daerah,
    });
    currentRunningNumber.runningNumber += 1;
    await currentRunningNumber.save();
    console.log('updateRunningNumber');
  } catch (err) {
    console.error(err);
  }
};

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

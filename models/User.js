const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Runningnumber = require('./Runningnumber');
const emailGen = require('../lib/emailgen');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  accountType: {
    type: String,
    enum: {
      values: ['kpUser', 'kaunterUser', 'erkmUser'],
      message:
        '{VALUE} is not supported. Provide only "kpUser", "kaunterUser", "erkmUser"',
    },
  },
  password: {
    type: String,
    minlength: 6,
  },
  negeri: {
    type: String,
  },
  daerah: {
    type: String,
  },
  kp: {
    type: String,
  },
  kodFasiliti: {
    type: String,
  },
  email: {
    type: String,
  },
  statusPerkhidmatan: {
    type: String,
  },
  statusRoleKlinik: {
    type: String,
    // required: [true, 'Please provide account type'],
    enum: {
      values: ['klinik', 'kepp', 'utc', 'rtc', 'visiting'],
      message:
        '{VALUE} is not supported. Provide only "klinik", "kepp", "utc", "rtc", "visiting"',
    },
  },
  lastLogin: {
    type: Date,
  },
});

UserSchema.pre('save', async function () {
  if (this.accountType === 'kpUser') {
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
      let acronym = '';
      const simplifiedKlinikName = this.kp.split(' ');
      for (let i = 0; i < simplifiedKlinikName.length; i++) {
        acronym += simplifiedKlinikName[i].charAt(0);
      }
      const randomString = generateRandomString(8);
      this.password = randomString;
      let currentRunningNumber = await Runningnumber.findOne({
        jenis: 'kp',
        negeri: this.negeri,
        daerah: this.daerah,
      });
      if (!currentRunningNumber) {
        const newRunningNumber = await Runningnumber.create({
          jenis: 'kp',
          negeri: this.negeri,
          daerah: this.daerah,
          runningnumber: 1,
        });
        const username = `${acronym.toLowerCase()}${negeriNum}${daerahNum}${
          newRunningNumber.runningnumber
        }`;
        this.username = username;
      }
      if (currentRunningNumber) {
        currentRunningNumber.runningnumber += 1;
        await currentRunningNumber.save();
        const username = `${acronym.toLowerCase()}${negeriNum}${daerahNum}${
          currentRunningNumber.runningnumber
        }`;
        this.username = username;
      }
      console.log('updateRunningNumber');
    } catch (err) {
      console.error(err);
    }
  }
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
      accountType: this.accountType,
      negeri: this.negeri,
      daerah: this.daerah,
      kp: this.kp,
      kodFasiliti: this.kodFasiliti,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.createAdminJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
      accountType: this.accountType,
      negeri: this.negeri,
      daerah: this.daerah,
      kp: this.kp,
      kodFasiliti: this.kodFasiliti,
      email: this.email,
      apiKey: process.env.API_KEY,
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

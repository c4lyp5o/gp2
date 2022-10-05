const jwt = require('jsonwebtoken');
const simpleCrypto = require('simple-crypto-js').default;
const mailer = require('nodemailer');
const Superadmin = require('../models/Superadmin');
const Fasiliti = require('../models/Fasiliti');
const Operator = require('../models/Operator');
const User = require('../models/User');
const Umum = require('../models/Umum');
const Deeproots = require('../models/Deeproots');
const Dictionary = {
  kp: 'klinik',
  pp: 'pegawai',
  jp: 'juruterapi pergigian',
  taska: 'taska',
  tadika: 'tadika',
  sr: 'sekolah-rendah',
  sm: 'sekolah-menengah',
  ins: 'institusi',
  kpb: 'kp-bergerak',
  mp: 'makmal-pergigian',
};

exports.getData = async (req, res, next) => {
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'This is the only way. Proceed carefully',
    });
  }
  if (req.method === 'POST') {
    const { main } = req.body;
    switch (main) {
      case 'DataCenter':
        var { Fn, FType, Data, token, Id } = req.body;
        const theType = Dictionary[FType];
        const dataGeografik = {
          daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
          negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
        };
        switch (Fn) {
          case 'create':
            console.log('create for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'klinik' &&
              theType !== 'juruterapi pergigian'
            ) {
              Data = {
                ...Data,
                jenisFasiliti: theType,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              };
              const data = await Fasiliti.create(Data);
              res.status(200).json(data);
            }
            if (theType === 'pegawai') {
              Data = {
                ...Data,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              };
              const data = await Operator.create(Data);
              res.status(200).json(data);
            }
            if (theType === 'juruterapi pergigian') {
              Data = {
                ...Data,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              };
              const data = await Operator.create(Data);
              res.status(200).json(data);
            }
            if (theType === 'klinik') {
              Data = {
                ...Data,
                daerah: dataGeografik.daerah,
                negeri: dataGeografik.negeri,
              };
              const data = await User.create(Data).then(async () => {
                // creating kaunter user for created klinik
                let acronym = '';
                const simplifiedKlinikName = Data.kp.split(' ');
                for (let i = 0; i < simplifiedKlinikName.length; i++) {
                  acronym += simplifiedKlinikName[i].charAt(0);
                }
                const tempKaunter = await User.create({
                  username: `kaunter${acronym.toLowerCase()}`,
                  negeri: Data.negeri,
                  daerah: Data.daerah,
                  kp: Data.kp,
                  accountType: 'kaunterUser',
                  password: 'temporary',
                });
                console.log('tempKaunter:', tempKaunter);
              });
              res.status(200).json(data);
            }
            break;
          case 'read':
            console.log('read for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik'
            ) {
              const data = await Fasiliti.find({
                jenisFasiliti: theType,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              });
              return res.status(200).json(data);
            }
            if (theType === 'pegawai') {
              const data = await Operator.find({
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
                statusPegawai: 'pp',
              });
              return res.status(200).json(data);
            }
            if (theType === 'juruterapi pergigian') {
              const data = await Operator.find({
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
                statusPegawai: 'jp',
              });
              console.log(data);
              return res.status(200).json(data);
            }
            if (theType === 'klinik') {
              let data = [];
              const kp = await User.find({
                negeri: dataGeografik.negeri,
                daerah: dataGeografik.daerah,
                statusRoleKlinik: 'klinik',
              });
              const kepp = await User.find({
                negeri: dataGeografik.negeri,
                daerah: dataGeografik.daerah,
                statusRoleKlinik: 'kepp',
              });
              const utc = await User.find({
                negeri: dataGeografik.negeri,
                daerah: dataGeografik.daerah,
                statusRoleKlinik: 'utc',
              });
              const rtc = await User.find({
                negeri: dataGeografik.negeri,
                daerah: dataGeografik.daerah,
                statusRoleKlinik: 'rtc',
              });
              const visiting = await User.find({
                negeri: dataGeografik.negeri,
                daerah: dataGeografik.daerah,
                statusRoleKlinik: 'visiting',
              });
              data = [...kp, ...kepp, ...utc, ...rtc, ...visiting];
              return res.status(200).json(data);
            }
            break;
          case 'readOne':
            console.log('readOne for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik'
            ) {
              const data = await Fasiliti.findById({
                _id: Id,
              });
              res.status(200).json(data);
            }
            if (theType === 'pegawai') {
              const data = await Operator.findById({
                _id: Id,
              });
              res.status(200).json(data);
            }
            if (theType === 'juruterapi pergigian') {
              const data = await Operator.findById({
                _id: Id,
              });
              res.status(200).json(data);
            }
            if (theType === 'klinik') {
              const data = await User.findById({
                _id: Id,
              });
              res.status(200).json(data);
            }
            break;
          case 'update':
            console.log('update for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik'
            ) {
              const data = await Fasiliti.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(data);
            }
            if (theType === 'pegawai') {
              const data = await Operator.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(data);
            }
            if (theType === 'juruterapi pergigian') {
              const data = await Operator.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(data);
            }
            if (theType === 'klinik') {
              const data = await User.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(data);
            }
            break;
          case 'delete':
            console.log('delete for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik'
            ) {
              const data = await Fasiliti.findByIdAndDelete({ _id: Id });
              res.status(200).json(data);
            }
            if (theType === 'pegawai') {
              const data = await Operator.findByIdAndDelete({ _id: Id });
              res.status(200).json(data);
            }
            if (theType === 'juruterapi pergigian') {
              const data = await Operator.findByIdAndDelete({ _id: Id });
              res.status(200).json(data);
            }
            if (theType === 'klinik') {
              const klinik = await User.findOne({ _id: Id });
              const fasilitiUnderKlinik = await Fasiliti.find({
                handler: klinik.kp,
              });
              const operatorUnderKlinik = await Operator.find({
                kp: klinik.kp,
              });
              if (
                fasilitiUnderKlinik.length > 0 ||
                operatorUnderKlinik.length > 0
              ) {
                let mustDelete = '';
                if (fasilitiUnderKlinik.length > 0) {
                  console.log(
                    'ada fasiliti under klinik:',
                    fasilitiUnderKlinik
                  );
                  for (let q = 0; q < fasilitiUnderKlinik.length; q++) {
                    mustDelete += fasilitiUnderKlinik[q].nama;
                    mustDelete += ', ';
                  }
                }
                if (operatorUnderKlinik.length > 0) {
                  console.log(
                    'ada operator under klinik:',
                    operatorUnderKlinik
                  );
                  for (let w = 0; w < operatorUnderKlinik.length; w++) {
                    mustDelete += operatorUnderKlinik[w].nama;
                    mustDelete += ', ';
                  }
                }
                console.log(mustDelete);
                return res.status(409).json(mustDelete);
              }
              let acronym = '';
              const simplifiedKlinikName = klinik.kp.split(' ');
              for (let i = 0; i < simplifiedKlinikName.length; i++) {
                acronym += simplifiedKlinikName[i].charAt(0);
              }
              // deleting kaunter and klinik
              const data = await User.findByIdAndDelete({ _id: Id }).then(
                async () => {
                  await User.findOneAndDelete({
                    username: `kaunter${acronym.toLowerCase()}`,
                  });
                }
              );
              res.status(200).json(data);
            }
            break;
          default:
            res.status(200).json({
              message: 'This is the default case for Data Center',
            });
        }
        break;
      case 'UserCenter':
        var { Fn, username, password, email, nama, daerah, negeri, token } =
          req.body;
        switch (Fn) {
          case 'create':
            console.log('create for user');
            const regData = await Superadmin.create({
              e_mail: email,
              user_name: nama,
              daerah: daerah,
              negeri: negeri,
            });
            return res.status(200).json(regData);
          case 'read':
            console.log('read for user');
            const userData = {
              userId: jwt.verify(token, process.env.JWT_SECRET).userId,
              username: jwt.verify(token, process.env.JWT_SECRET).username,
              daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
              negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
            };
            return res.status(200).json(userData);
          case 'readOne':
            console.log('readOne for user');
            const tempUser = await Superadmin.findOne({ user_name: username });
            if (!tempUser) {
              return res.status(401).json({
                status: 'error',
                message: 'Tiada user ini di dalam sistem',
              });
            }
            const theKey = simpleCrypto.generateRandomString(20);
            const update = await Superadmin.findByIdAndUpdate(
              tempUser._id,
              {
                tempKey: theKey,
              },
              { new: true }
            );
            const transporter = mailer.createTransport({
              host: process.env.EMAILER_HOST,
              port: process.env.EMAILER_PORT,
              secure: true,
              auth: {
                user: process.env.EMAILER_ACCT,
                pass: process.env.EMAILER_PASS,
              },
            });
            console.log('email is:', tempUser.e_mail);
            let useEmail = '';
            if (!tempUser.e_mail) {
              useEmail = 'inq@calypsocloud.one';
            }
            if (tempUser.e_mail) {
              useEmail = tempUser.e_mail;
            }
            const mailOptions = {
              from: process.env.EMAILER_ACCT,
              to: useEmail,
              subject: 'Kunci Verifikasi',
              html: `<p>Hi ${tempUser.user_name},</p>
              <p>Anda telah memohon untuk login ke akaun anda. Key verifikasi anda adalah:</p>
              <br /><p>${tempUser.tempKey}</p><br />
              <p>Jika anda tidak memohon untuk login, sila abaikan email ini.</p>
              <p>Terima kasih.</p>`,
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  status: 'error',
                  message: 'Email tidak dapat dihantar',
                });
              }
              console.log('Email sent: ' + info.response);
              return res.status(200).json({
                status: 'success',
                message: 'Email telah dihantar',
              });
            });
            break;
          // const verification = await transporter.sendMail({
          //   from: `"Key Master" <${process.env.EMAILER_ACCT}>`,
          //   to: tempUser.e_mail,
          //   subject: 'Kunci Verifikasi',
          //   text: 'Kunci verifikasi anda adalah: ' + theKey + '\n\n',
          //   html:
          //     '<p>Kunci verifikasi anda adalah: </p>' +
          //     theKey +
          //     '<p>\n\n</p>',
          // });
          // console.log(verification);
          // return res.status(200).json({
          //   status: 'success',
          //   message: 'Email sent to ' + tempUser.e_mail,
          // });
          case 'update':
            console.log('update for user');
            const User = await Superadmin.findOne({ user_name: username });
            if (password !== User.tempKey) {
              const msg = 'Key salah';
              return res.status(401).json({
                status: 'error',
                message: msg,
              });
            }
            const genToken = jwt.sign(
              {
                userId: User._id,
                username: User.user_name,
                daerah: User.daerah,
                negeri: User.negeri,
              },
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            );
            return res.status(200).json({
              status: 'success',
              message: 'Login berjaya',
              adminToken: genToken,
            });
          case 'delete':
            console.log('delete for user');
            break;
          default:
            res.status(200).json({
              message: 'This is the default case for User Center',
            });
        }
        break;
      case 'Deeproots':
        var { Fn, username, password, kodFasiliti } = req.body;
        switch (Fn) {
          case 'create':
            console.log('create for deeproots');
            const createUser = await Deeproots.create({
              username,
              password,
            });
            return res.status(200).json(createUser);
            break;
          case 'read':
            console.log('read for deeproots');
            const checkUser = await Deeproots.findOne({ username });
            if (!checkUser) {
              return res.status(401).json({
                status: 'error',
                message: 'No user found',
              });
            }
            return res.status(200).json({
              status: 'success',
              message: 'User exists',
            });
            break;
          case 'readUmumData':
            console.log('readUmumData for deeproots');
            const response = await Umum.find();
            return res.status(200).json(response);
            break;
          case 'readSpecificUmumData':
            console.log('readSpecificUmumData for deeproots');
            const specificResponse = await Umum.find({
              CreatedByKp: kodFasiliti,
            });
            return res.status(200).json(specificResponse);
            break;
          case 'update':
            console.log('update for deeproots');
            const tempUser = await Deeproots.findOne({ username });
            if (password !== tempUser.password) {
              return res.status(401).json({
                status: 'error',
                message: 'Password salah',
              });
            }
            return res.status(200).json({
              status: 'success',
              message: 'Login berjaya',
            });
            break;
          case 'delete':
            console.log('delete for deeproots');
            break;
          default:
            res.status(200).json({
              message: 'This is the default case for Deeproots',
            });
        }
        break;
      default:
        res.status(200).json({
          message: 'Provide nothing, get nothing',
        });
    }
  }
};

async function sendVerificationEmail(email, userId) {
  let theKey = simpleCrypto.generateRandomString(20);
  const update = await Superadmin.findByIdAndUpdate(
    userId,
    {
      tempKey: theKey,
    },
    { new: true }
  );
  // const transporter = mailer.createTransport({
  //   host: process.env.EMAILER_HOST,
  //   port: process.env.EMAILER_PORT,
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAILER_ACCT,
  //     pass: process.env.EMAILER_PASS,
  //   },
  // });
  // const verification = await transporter.sendMail({
  //   from: `"Admin" <${process.env.EMAILER_ACCT}>`,
  //   to: email,
  //   subject: 'Verifikasi Akaun',
  //   text: 'Kunci verifikasi anda adalah: ' + verificationKey + '\n\n',
  //   html:
  //     '<p>Kunci verifikasi anda adalah: </p>' + verificationKey + '<p>\n\n</p>',
  // });
  // console.log('your key: ' + theKey);
  return theKey;
}

exports.helloUser = async (req, res) => {
  const { username } = req.body;
  const User = await Superadmin.findOne({ user_name: username });
  if (req.method === 'POST') {
    if (!User) {
      res.status(401).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }
    // await sendVerificationEmail(process.env.SEND_TO, User._id).catch((err) => {
    //   console.log(err);
    // });
    const xxxKey = await sendVerificationEmail(
      process.env.SEND_TO,
      User._id
    ).catch((err) => {
      console.log(err);
    });
    return res.status(200).json({
      status: 'success',
      message: 'Email sent to ' + process.env.SEND_TO,
      tempKey: xxxKey,
    });
  }
  if (req.method === 'GET') {
    return res.status(200).json({
      Status: 'Success',
      Message: 'This is the modified server response',
    });
  }
};

exports.getCipher = async (req, res) => {
  const crypt = new simpleCrypto(process.env.API_SECRET);
  const cipherText = crypt.encrypt(process.env.API_KEY);
  res.status(200).json({
    status: 'success',
    message: 'Verification route',
    key: cipherText,
  });
};

exports.loginUser = async (req, res) => {
  // console.log(req.body);
  const { username, password, key } = req.body;
  const crypt = new simpleCrypto(process.env.API_SECRET);
  const decipheredText = crypt.decrypt(key);
  if (decipheredText !== process.env.API_KEY) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid API key',
    });
  }
  const User = await Superadmin.findOne({ user_name: username });
  if (!User) {
    const msg = 'Tiada user ini dalam sistem';
    return res.status(401).json({
      status: 'error',
      message: msg,
    });
  }
  if (password !== User.tempKey) {
    const msg = 'Key salah';
    return res.status(401).json({
      status: 'error',
      message: msg,
    });
  }
  const genToken = jwt.sign(
    {
      userId: User._id,
      username: User.user_name,
      daerah: User.daerah,
      negeri: User.negeri,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return res.status(200).json({
    status: 'success',
    message: 'Login berjaya',
    adminToken: genToken,
  });
};

exports.addAdmin = async (req, res) => {
  const Admin = new Superadmin({
    user_name: req.body.user_name,
    daerah: req.body.daerah,
    negeri: req.body.negeri,
  });
  Admin.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Admin berjaya ditambah',
      });
    }
  });
};

exports.getCurrentUser = async (req, res) => {
  const data = {
    userId: jwt.verify(req.body.token, process.env.JWT_SECRET).userId,
    username: jwt.verify(req.body.token, process.env.JWT_SECRET).username,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
  };
  res.status(200).json(data);
};

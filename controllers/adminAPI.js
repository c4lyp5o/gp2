const jwt = require('jsonwebtoken');
const simpleCrypto = require('simple-crypto-js').default;
const mailer = require('nodemailer');
const Superadmin = require('../models/Superadmin');
const Fasiliti = require('../models/Fasiliti');
const Operator = require('../models/Operator');
const User = require('../models/User');
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
};

exports.getData = async (req, res, next) => {
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'This is the only way. Proceed carefully',
    });
  } else {
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
            if (theType !== 'pegawai' && theType !== 'klinik') {
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
            if (theType === 'klinik') {
              Data = {
                ...Data,
                daerah: dataGeografik.daerah,
                negeri: dataGeografik.negeri,
              };
              const data = await User.create(Data);
              console.log(Data);
              res.status(200).json(data);
            }
            break;
          case 'read':
            console.log('read for', theType);
            if (theType !== 'pegawai' && theType !== 'klinik') {
              const data = await Fasiliti.find({
                jenisFasiliti: theType,
                dataGeografik,
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
                daerah: dataGeografik.daerah,
                negeri: dataGeografik.negeri,
                statusPegawai: 'jp',
              });
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
            if (theType !== 'pegawai' && theType !== 'klinik') {
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
            if (theType === 'klinik') {
              const data = await User.findById({
                _id: Id,
              });
              res.status(200).json(data);
            }
            break;
          case 'update':
            console.log('update for', theType);
            if (theType !== 'pegawai' && theType !== 'klinik') {
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
            if (theType !== 'pegawai' && theType !== 'klinik') {
              const data = await Fasiliti.findByIdAndDelete({ _id: Id });
              res.status(200).json(data);
            }
            if (theType === 'pegawai') {
              const data = await Operator.findByIdAndDelete({ _id: Id });
              res.status(200).json(data);
            }
            if (theType === 'klinik') {
              const data = await User.findByIdAndDelete({ _id: Id });
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
              email,
              nama,
              daerah,
              negeri,
            });
            res.status(200).json(regData);
            break;
          case 'read':
            console.log('read for user');
            const userData = {
              userId: jwt.verify(token, process.env.JWT_SECRET).userId,
              username: jwt.verify(token, process.env.JWT_SECRET).username,
              daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
              negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
            };
            res.status(200).json(userData);
            break;
          case 'readOne':
            console.log('readOne for user');
            const tempUser = await Superadmin.findOne({ user_name: username });
            if (!tempUser) {
              res.status(401).json({
                status: 'error',
                message: 'User not found',
              });
              return;
            }
            const theKey = simpleCrypto.generateRandomString(20);
            const update = await Superadmin.findByIdAndUpdate(
              tempUser._id,
              {
                tempKey: theKey,
              },
              { new: true }
            );
            return res.status(200).json({
              status: 'success',
              message: 'Email sent to ' + process.env.SEND_TO,
              tempKey: theKey,
            });
            break;
          case 'update':
            console.log('update for user');
            // const crypt = new simpleCrypto(process.env.API_SECRET);
            // const decipheredText = crypt.decrypt(key);
            // if (decipheredText !== process.env.API_KEY) {
            //   return res.status(401).json({
            //     status: 'error',
            //     message: 'Invalid API key',
            //   });
            // }
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
            break;
          case 'delete':
            console.log('delete for user');
            break;
          default:
            res.status(200).json({
              message: 'This is the default case for User Center',
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
    password: req.body.password,
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

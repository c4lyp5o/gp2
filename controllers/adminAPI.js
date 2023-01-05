const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const mailer = require('nodemailer');
const moment = require('moment');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const sharp = require('sharp');
const Superadmin = require('../models/Superadmin');
const Fasiliti = require('../models/Fasiliti');
const Operator = require('../models/Operator');
const User = require('../models/User');
const Umum = require('../models/Umum');
const Event = require('../models/Event');
const Sosmed = require('../models/MediaSosial');
const Followers = require('../models/Followers');
const PromosiType = require('../models/PromosiType');
const emailGen = require('../lib/emailgen');

// helper
const Helper = require('../controllers/countHelper');

const Dictionary = {
  kp: 'klinik',
  kkiakd: 'kkiakd',
  pp: 'pegawai',
  ppall: 'pegawai-all',
  jp: 'juruterapi pergigian',
  jpall: 'jp-all',
  taska: 'taska',
  tadika: 'tadika',
  tastad: 'tastad',
  sr: 'sekolah-rendah',
  sm: 'sekolah-menengah',
  ins: 'institusi',
  kpb: 'kp-bergerak',
  'kpb-all': 'kp-bergerak-all',
  mpb: 'makmal-pergigian',
  'mpb-all': 'makmal-pergigian-all',
  event: 'event',
  'sa-a': 'superadmin-all',
  sosmed: 'sosmed',
  sosmedByKodProgram: 'sosmedByKodProgram',
  followers: 'followers',
  program: 'program',
  // negeri
  negerijohor: 'Johor',
  negerikedah: 'Kedah',
  negerikelantan: 'Kelantan',
  negerimelaka: 'Melaka',
  negerinegerisembilan: 'Negeri Sembilan',
  negeripahang: 'Pahang',
  negeripulaupinang: 'Pulau Pinang',
  negeriperak: 'Perak',
  negeriperlis: 'Perlis',
  negeriselangor: 'Selangor',
  negeriterengganu: 'Terengganu',
  negerisabah: 'Sabah',
  negerisarawak: 'Sarawak',
  negeriwpkualalumpur: 'WP Kuala Lumpur',
  negeriwpputrajaya: 'WP Putrajaya',
  negeriwplabuan: 'WP Labuan',
  negeriilk: 'ILK',
};

const socmed = [
  'Facebook',
  'Instagram',
  'Twitter',
  'Youtube',
  'Tiktok',
  'Lain',
];

const transporter = mailer.createTransport({
  host: process.env.EMAILER_HOST,
  port: process.env.EMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAILER_ACCT,
    pass: process.env.EMAILER_PASS,
  },
});

const initialDataNegeri = async (req, res) => {
  const all = await Superadmin.find({ accountType: 'negeriSuperadmin' });
  const allNegeri = _.uniqBy(all, 'negeri');
  let negeri = [];
  allNegeri.forEach((item) => {
    let negeriDetails = {};
    if (item.negeri !== '-') {
      negeriDetails = {
        negeri: item.negeri,
        username: item.user_name,
      };
      negeri.push(negeriDetails);
    }
  });
  res.status(200).json(negeri);
};

const initialDataDaerah = async (req, res) => {
  // let cap;
  const { negeri } = req.query;
  // const spliced = negeri.split('negeri');
  // if (spliced.includes('sembilan')) {
  //   cap = 'Negeri Sembilan';
  // } else {
  //   cap = spliced[1].charAt(0).toUpperCase() + spliced[1].slice(1);
  // }
  // let real = cap;
  // if (cap === 'Wpputrajaya' || cap === 'Wplabuan') {
  //   real = cap.split('Wp');
  //   real = `${real[1]}`;
  //   real = real.charAt(0).toUpperCase() + real.slice(1);
  //   real = `WP ${real}`;
  // }
  // if (cap === 'Wpkualalumpur') {
  //   real = `WP Kuala Lumpur`;
  // }
  // if (cap === 'Pulaupinang') {
  //   real = `Pulau Pinang`;
  // }
  const all = await Superadmin.find({
    negeri: Dictionary[negeri],
    accountType: 'daerahSuperadmin',
  });
  const specDaerah = _.uniqBy(all, 'daerah');
  let daerah = [];
  specDaerah.forEach((item) => {
    let daerahDetails = {};
    if (item.daerah !== '-') {
      daerahDetails = {
        daerah: item.daerah,
        username: item.user_name,
      };
      daerah.push(daerahDetails);
    }
  });
  if (daerah.length === 0) {
    res.status(404).json({ message: 'No daerah found' });
  } else {
    res.status(200).json(daerah);
  }
};

const initialDataKlinik = async (req, res) => {
  const { daerah } = req.query;
  // const spliced = daerah.split('sdo');
  // const cap = spliced[1].charAt(0).toUpperCase() + spliced[1].slice(1);
  const admin = await Superadmin.find({ daerah: daerah });
  const all = await User.find({
    daerah: admin[0].daerah,
    accountType: 'kpUser',
  });
  const specKlinik = _.uniqBy(all, 'kp');
  let klinik = [];
  specKlinik.forEach((item) => {
    let klinikDetails = {};
    klinikDetails = {
      kp: item.kp,
      username: item.username,
      kodFasiliti: item.kodFasiliti,
    };
    klinik.push(klinikDetails);
  });
  if (klinik.length === 0) {
    res.status(404).json({ message: 'No klinik found' });
  } else {
    res.status(200).json(klinik);
  }
};

const initialDataAdmins = async (req, res) => {
  const { kodFasiliti } = req.query;
  const all = await Operator.find({
    kodFasiliti: kodFasiliti,
    role: 'admin',
  });
  let admins = [];
  all.forEach((item) => {
    let regNum = {};
    let adminDetails = {};
    item.mdcNumber
      ? (regNum.mdcNumber = item.mdcNumber)
      : (regNum.mdtbNumber = item.mdtbNumber);
    adminDetails = {
      nama: item.nama,
      email: item.email,
      ...regNum,
    };
    admins.push(adminDetails);
  });
  if (admins.length === 0) {
    res.status(404).json({ message: 'No operators found' });
  } else {
    res.status(200).json(admins);
  }
};

const initialData = async (req, res) => {
  const all = await Superadmin.find({});
  const allKlinik = await User.find({
    role: 'klinik',
  });
  let allData = [];
  let cleanData = [];
  for (let i = 0; i < all.length; i++) {
    let location = {
      daerah: all[i].daerah,
      negeri: all[i].negeri,
      username: all[i].user_name,
    };
    allData.push(location);
  }
  const num = _.findIndex(allData, { negeri: '-' });
  allData.splice(num, 1);
  const negeri = _.uniqBy(allData, 'negeri');
  const daerah = _.uniqBy(allData, 'daerah');
  const username = _.uniqBy(allData, 'username');
  for (let i = 0; i < negeri.length; i++) {
    let temp = [];
    let usernames = [];
    for (let j = 0; j < daerah.length; j++) {
      if (negeri[i].negeri === daerah[j].negeri && daerah[j].daerah !== '-') {
        let tempDaerah = {
          daerah: daerah[j].daerah,
          username: daerah[j].username,
          klinik: [],
        };
        for (let k = 0; k < allKlinik.length; k++) {
          if (
            daerah[j].daerah === allKlinik[k].daerah &&
            allKlinik[k].accountType !== 'kaunterUser'
          ) {
            let tempKlinik = {
              username: allKlinik[k].username,
              nama: allKlinik[k].kp,
              admins: [],
            };
            const admins = await Operator.find({
              kodFasiliti: allKlinik[k].kodFasiliti,
              role: 'admin',
            });
            for (let l = 0; l < admins.length; l++) {
              let tempAdmin = {};
              tempAdmin.nama = admins[l].nama;
              if (admins[l].mdcNumber)
                tempAdmin.mdcNumber = admins[l].mdcNumber;
              if (admins[l].mdtbNumber)
                tempAdmin.mdtbNumber = admins[l].mdtbNumber;
              tempKlinik.admins.push(tempAdmin);
            }
            tempDaerah.klinik.push(tempKlinik);
          }
        }
        temp.push(tempDaerah);
      }
    }
    for (let j = 0; j < username.length; j++) {
      if (
        negeri[i].negeri === username[j].negeri &&
        username[j].daerah === '-'
      ) {
        let tempUser = { username: username[j].username };
        usernames.push(tempUser);
      }
    }
    let temp2 = {
      negeri: negeri[i].negeri,
      usernames: usernames,
      daerah: temp,
    };
    cleanData.push(temp2);
  }
  res.status(200).json(cleanData);
};

const checkUser = async (req, res) => {
  const { username } = req.query;
  const tempUser = await Superadmin.findOne({ user_name: username });
  // if no superadmin
  if (!tempUser) {
    // check kp user
    // const tempKpUser = await User.findOne({ username: username });
    let regNumber = {};
    if (username.includes('MDTB')) {
      regNumber.mdtbNumber = username;
    } else {
      regNumber.mdcNumber = username;
    }
    const admins = await Operator.find(regNumber);
    if (!admins) {
      return res.status(401).json({
        status: 'error',
        message: 'Tiada user ini di dalam sistem',
      });
    }
    const kpemail = await sendVerificationEmail(admins[0]._id);
    return res.status(200).json({
      status: 'success',
      email: kpemail,
      accountType: 'kpSuperadmin',
    });
  }
  // if yes superadmin
  // check if using totp
  if (tempUser.totp) {
    return res.status(200).json({
      status: 'success',
      totp: true,
    });
  }
  // if not using totp
  const currentMail = await sendVerificationEmail(tempUser._id);
  return res.status(200).json({
    status: 'success',
    email: currentMail,
    totp: false,
  });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const adminUser = await Superadmin.findOne({ user_name: username });
  // if kp
  if (!adminUser) {
    console.log('kp user');
    let regNumber = {};
    let userData = {};
    if (username.includes('MDTB')) {
      regNumber.mdtbNumber = username;
    } else {
      regNumber.mdcNumber = username;
    }
    const superOperator = await Operator.findOne(regNumber);
    const kpUser = await User.findOne({
      kodFasiliti: superOperator.kodFasiliti,
    });
    if (password !== superOperator.tempKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Kunci verifikasi anda salah. Sila isi sekali lagi',
      });
    }
    if (superOperator.role === 'admin') {
      userData.role = 'admin';
    }
    if (
      superOperator.role !== 'admin' &&
      superOperator.roleMediaSosialKlinik === true
    ) {
      userData.role = 'sosmedadmin';
    }
    userData = {
      userId: kpUser._id,
      username: kpUser.username,
      officername: superOperator.nama,
      ...userData,
      kodFasiliti: kpUser.kodFasiliti,
      accountType: 'kpUser',
      negeri: kpUser.negeri,
      daerah: kpUser.daerah,
      kp: kpUser.kp,
    };
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    return res.status(200).json({
      status: 'success',
      adminToken: token,
    });
  }
  // if admin
  // check if using totp or not
  if (adminUser.totp) {
    console.log('totp');
    const verified = speakeasy.totp.verify({
      secret: adminUser.hex,
      encoding: 'hex',
      token: password,
      window: 1,
    });
    if (!verified) {
      return res.status(401).json({
        status: 'error',
        message: 'Nombor TOTP anda salah. Sila isi sekali lagi',
      });
    }
    return res.status(200).json({
      status: 'success',
      adminToken: adminUser.createJWT(),
    });
  }
  // using tempKey
  if (password !== adminUser.tempKey) {
    return res.status(401).json({
      status: 'error',
      message: 'Kunci verifikasi anda salah. Sila isi sekali lagi',
    });
  }
  return res.status(200).json({
    status: 'success',
    adminToken: adminUser.createJWT(),
  });
};

const getDataRoute = async (req, res) => {
  console.log('getRoute');
  // 1st phase
  const authKey = req.headers.authorization;
  const currentUser = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  const { negeri, daerah } = currentUser.getProfile();
  const { FType } = req.query;
  const type = Dictionary[FType];
  // 2nd phase
  let data, countedData, owner;
  switch (type) {
    case 'klinik':
      data = await User.find({
        negeri,
        daerah,
        statusRoleKlinik: ['klinik', 'kepp', 'utc', 'rtc', 'visiting'],
      });
      const kaunter = await User.find({
        negeri,
        daerah,
        accountType: 'kaunterUser',
      });
      for (const i in data) {
        for (const j in kaunter) {
          if (data[i].kp === kaunter[j].kp) {
            data[i] = {
              ...data[i]._doc,
              kaunterUsername: kaunter[j].username,
              kaunterPassword: kaunter[j].password,
            };
          }
        }
      }
      break;
    case 'pegawai-all':
      data = await Operator.find({
        statusPegawai: 'pp',
        activationStatus: true,
      });
      break;
    case 'pegawai':
      data = await Operator.find({
        statusPegawai: 'pp',
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        activationStatus: true,
      });
      break;
    case 'jp-all':
      data = await Operator.find({
        statusPegawai: 'jp',
        activationStatus: true,
      });
      break;
    case 'juruterapi pergigian':
      data = await Operator.find({
        statusPegawai: 'jp',
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        activationStatus: true,
      });
      break;
    case 'program':
      data = await Event.find({
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        assignedByDaerah: true,
        tahunDibuat: new Date().getFullYear(),
      });
      break;
    case 'sosmed':
      countedData = [];
      owner = '';
      if (daerah === '-') {
        owner = negeri;
      }
      if (daerah !== '-') {
        owner = daerah;
      }
      sosMeddata = await Sosmed.find({
        belongsTo: owner,
      });
      countedData = sosmedDataCompactor(sosMeddata);
      data = countedData;
      break;
    case 'sosmedByKodProgram':
      owner = '';
      if (daerah === '-') {
        owner = negeri;
      }
      if (daerah !== '-') {
        owner = daerah;
      }
      data = await Sosmed.find({
        belongsTo: owner,
      });
      break;
    case 'followers':
      owner = '';
      if (daerah === '-') {
        owner = negeri;
      }
      if (daerah !== '-') {
        owner = daerah;
      }
      data = await Followers.find({
        belongsTo: owner,
      });
      break;
    default:
      data = await Fasiliti.find({
        jenisFasiliti: type,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
      });
      break;
  }
  // 3rd phase
  res.status(200).json(data);
};

const getDataKpRoute = async (req, res) => {
  console.log('getRouteKp');
  // 1st phase
  const authKey = req.headers.authorization;
  const { kp, daerah, negeri, kodFasiliti } = jwt.verify(
    authKey,
    process.env.JWT_SECRET
  );
  const { FType } = req.query;
  const type = Dictionary[FType];
  // 2nd phase
  let data, countedData;
  switch (type) {
    case 'klinik':
      data = await User.find({
        accountType: 'kpUser',
        negeri,
        daerah,
      });
      break;
    case 'program':
      data = await Event.find({
        createdByKp: kp,
        createdByKodFasiliti: kodFasiliti,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        tahunDibuat: new Date().getFullYear(),
      });
      break;
    case 'sosmed':
      countedData = [];
      data = await Sosmed.find({
        belongsTo: kp,
      });
      if (data.length === 0) {
        return res.status(200).json(data);
      }
      countedData = sosmedDataCompactor(data);
      data = countedData;
      break;
    case 'sosmedByKodProgram':
      data = await Sosmed.find({
        belongsTo: kp,
      });
      break;
    case 'followers':
      data = await Followers.find({
        belongsTo: kp,
      });
      break;
    case 'tastad':
      data = await Fasiliti.find({
        jenisFasiliti: ['taska', 'tadika'],
        handler: kp,
        kodFasilitiHandler: kodFasiliti,
      });
      data.sort((a, b) => {
        return a.jenisFasiliti.localeCompare(b.jenisFasiliti);
      });
      break;
    case 'pegawai':
      data = await Operator.find({
        statusPegawai: 'pp',
        kpSkrg: kp,
        kodFasiliti: kodFasiliti,
        activationStatus: true,
      });
      break;
    case 'juruterapi pergigian':
      data = await Operator.find({
        statusPegawai: 'jp',
        kpSkrg: kp,
        kodFasiliti: kodFasiliti,
        activationStatus: true,
      });
      break;
    case 'institusi':
      data = await Fasiliti.find({
        jenisFasiliti: type,
        handler: kp,
        kodFasilitiHandler: kodFasiliti,
      });
      break;
    case 'kp-bergerak':
      data = await Fasiliti.find({
        jenisFasiliti: type,
        kodFasilitiHandler: kodFasiliti,
      });
      break;
    case 'kp-bergerak-all':
      data = await Fasiliti.find({
        jenisFasiliti: 'kp-bergerak',
      });
      break;
    case 'makmal-pergigian':
      data = await Fasiliti.find({
        jenisFasiliti: type,
        kodFasilitiHandler: kodFasiliti,
      });
      break;
    case 'makmal-pergigian-all':
      data = await Fasiliti.find({
        jenisFasiliti: 'makmal-pergigian',
      });
      break;
    default:
      console.log('default');
      break;
  }
  // 3rd phase
  res.status(200).json(data);
};

const getOneDataRoute = async (req, res) => {
  console.log('getOneDataRoute');
  // 1st phase
  const authKey = req.headers.authorization;
  const { kp, daerah, negeri, kodFasiliti } = jwt.verify(
    authKey,
    process.env.JWT_SECRET
  );
  const { FType, Id } = req.query;
  const type = Dictionary[FType];
  console.log(type);
  // 2nd phase
  let data;
  switch (type) {
    case 'pegawai':
    case 'juruterapi pergigian':
      data = await Operator.findById(Id);
      break;
    case 'klinik':
      data = await User.findById(Id);
      break;
    case 'program':
      data = await Event.findById(Id);
      break;
    default:
      data = await Fasiliti.findById(Id);
      break;
  }
  // 3rd phase
  res.status(200).json(data);
};

const getOneDataKpRoute = async (req, res) => {
  console.log('getOneDataKpRoute');
  // 1st phase
  const authKey = req.headers.authorization;
  const { kp, daerah, negeri, kodFasiliti } = jwt.verify(
    authKey,
    process.env.JWT_SECRET
  );
  const { FType, Id } = req.query;
  const type = Dictionary[FType];
  console.log(type);
  // 2nd phase
  let data;
  switch (type) {
    case 'program':
      data = await Event.findById(Id);
      break;
    case 'pegawai':
    case 'juruterapi pergigian':
      data = await Operator.findById(Id);
      break;
    default:
      data = await Fasiliti.findById(Id);
      break;
  }
  // 3rd phase
  res.status(200).json(data);
};

const postRoute = async (req, res) => {
  console.log('postRoute');
};

const patchRoute = async (req, res) => {
  console.log('patchRoute');
};

const deleteRoute = async (req, res) => {
  console.log('deleteRoute');
};

const getData = async (req, res) => {
  let { main, Fn, token, FType, Id, sosmedId } = req.body;
  let { Data } = req.body;
  switch (main) {
    case 'DataCenter':
      const theType = Dictionary[FType];
      const currentUser = await Superadmin.findById(
        jwt.verify(token, process.env.JWT_SECRET).userId
      );
      var { daerah, negeri } = currentUser.getProfile();
      switch (Fn) {
        case 'create':
          console.log('create for', theType);
          if (
            theType !== 'pegawai' &&
            theType !== 'klinik' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'sosmed' &&
            theType !== 'followers' &&
            theType !== 'program' &&
            theType !== 'taska' &&
            theType !== 'tadika' &&
            theType !== 'kp-bergerak' &&
            theType !== 'makmal-pergigian'
          ) {
            Data = {
              ...Data,
              jenisFasiliti: theType,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            };
            const data = await Fasiliti.create(Data);
            res.status(200).json(data);
          }
          if (theType === 'pegawai') {
            const exists = await Operator.findOne({
              mdcNumber: Data.mdcNumber,
            });
            if (exists) {
              console.log('exists pegawai?');
              exists.createdByNegeri = negeri;
              exists.createdByDaerah = daerah;
              exists.kpSkrg = Data.kpSkrg;
              exists.kodFasiliti = Data.kodFasiliti;
              exists.activationStatus = true;
              exists.nama = Data.nama;
              exists.email = Data.email;
              exists.gred = Data.gred;
              exists.role = Data.role;
              exists.rolePromosiKlinik = Data.rolePromosiKlinik;
              exists.roleMediaSosialKlinik = Data.roleMediaSosialKlinik;
              const prevOfficer = await exists.save();
              return res.status(200).json(prevOfficer);
            }
            Data = {
              ...Data,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            };
            console.log(Data);
            const data = await Operator.create(Data);
            return res.status(200).json(data);
          }
          if (theType === 'juruterapi pergigian') {
            const exists = await Operator.findOne({
              mdtbNumber: Data.mdtbNumber,
            });
            if (exists) {
              console.log('exists jp?');
              exists.createdByNegeri = negeri;
              exists.createdByDaerah = daerah;
              exists.kpSkrg = Data.kpSkrg;
              exists.kodFasiliti = Data.kodFasiliti;
              exists.activationStatus = true;
              exists.nama = Data.nama;
              exists.email = Data.email;
              exists.gred = Data.gred;
              exists.role = Data.role;
              exists.rolePromosiKlinik = Data.rolePromosiKlinik;
              exists.roleMediaSosialKlinik = Data.roleMediaSosialKlinik;
              const prevOfficer = await exists.save();
              return res.status(200).json(prevOfficer);
            }
            Data = {
              ...Data,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            };
            console.log(Data);
            const data = await Operator.create(Data);
            return res.status(200).json(data);
          }
          if (theType === 'klinik') {
            Data = {
              ...Data,
              daerah,
              negeri,
            };
            const data = await User.create(Data).then(async () => {
              // creating kaunter user for created klinik
              let acronym = '';
              const simplifiedKlinikName = Data.kp.split(' ');
              for (let i = 0; i < simplifiedKlinikName.length; i++) {
                acronym += simplifiedKlinikName[i].charAt(0);
              }
              const negeriNum = emailGen[negeri].kodNegeri;
              const daerahNum = emailGen[negeri].daerah[daerah];
              const tempKaunter = await User.create({
                username: `daftar${acronym.toLowerCase()}${negeriNum}${daerahNum}${
                  Data.kodFasiliti
                }`,
                negeri: Data.negeri,
                daerah: Data.daerah,
                kp: Data.kp,
                kodFasiliti: Data.kodFasiliti,
                accountType: 'kaunterUser',
                password: generateRandomString(8),
              });
              console.log('tempKaunter:', tempKaunter);
              // creating generic 5 JP when creating clinic
              for (let ojp = 1; ojp < 6; ojp++) {
                const ojpGen = {
                  nama: 'JP' + ojp,
                  email: '-',
                  mdtbNumber:
                    'MDTBAUTO' +
                    emailGen[negeri].kodNegeri +
                    emailGen[negeri].daerah[daerah] +
                    ojp +
                    Data.kodFasiliti,
                  gred: '',
                  createdByNegeri: negeri,
                  createdByDaerah: daerah,
                  kpSkrg: Data.kp,
                  kodFasiliti: Data.kodFasiliti,
                  role: 'umum',
                  rolePromosiKlinik: false,
                  roleMediaSosialKlinik: false,
                  statusPegawai: 'jp',
                  cscspVerified: false,
                  activationStatus: true,
                };
                const ojpGenCreated = await Operator.create(ojpGen);
                console.log(ojpGenCreated);
              }
            });
            return res.status(200).json(data);
          }
          if (theType === 'taska' || theType === 'tadika') {
            const exists = await Fasiliti.findOne({
              kodTastad: Data.kodTastad,
            });
            if (exists) {
              return res.status(400).json({
                message: 'Taska/Tadika telah wujud',
              });
            } else {
              Data = {
                ...Data,
                jenisFasiliti: theType,
                createdByDaerah: daerah,
                createdByNegeri: negeri,
              };
              const data = await Fasiliti.create(Data);
              res.status(200).json(data);
            }
          }
          if (theType === 'kp-bergerak' || theType === 'makmal-pergigian') {
            const exists = await Fasiliti.findOne({
              nama: Data.nama,
            });
            if (exists) {
              return res.status(400).json({
                message: 'KPB/MPB telah wujud',
              });
            } else {
              Data = {
                ...Data,
                jenisFasiliti: theType,
                createdByDaerah: daerah,
                createdByNegeri: negeri,
              };
              const data = await Fasiliti.create(Data);
              res.status(200).json(data);
            }
          }
          if (theType === 'sosmed') {
            let owner = '';
            if (daerah === '-') {
              owner = negeri;
            }
            if (daerah !== '-') {
              owner = daerah;
            }
            const previousData = await Sosmed.find({
              belongsTo: owner,
              kodProgram: Data.kodProgram,
            });
            if (previousData.length === 0) {
              console.log('previous data not found');
              delete Data.data[0].kodProgram;
              Data.data[0] = {
                id: 1,
                ...Data.data[0],
              };
              const createdSosmed = await Sosmed.create(Data);
              return res.status(200).json(createdSosmed);
            }
            if (previousData.length > 0) {
              console.log('previous data got');
              delete Data.data[0].kodProgram;
              const lastData = previousData[0].data.length;
              const lastIdofData = previousData[0].data[lastData - 1].id;
              Data.data[0] = {
                id: lastIdofData + 1,
                ...Data.data[0],
              };
              const updatedSosmed = await Sosmed.findOneAndUpdate(
                { kodProgram: Data.kodProgram, belongsTo: owner },
                { $push: { data: Data.data[0] } },
                { new: true }
              );
              res.status(200).json(updatedSosmed);
            }
          }
          if (theType === 'followers') {
            const createFollowerData = await Followers.create(Data);
            res.status(200).json(createFollowerData);
          }
          if (theType === 'program') {
            if (negeri) {
              Data.createdByNegeri = negeri;
            }
            if (daerah) {
              Data.createdByDaerah = daerah;
            }
            const createProgramData = await Event.create(Data);
            res.status(200).json(createProgramData);
          }
          break;
        case 'update':
          console.log('update for', theType);
          if (
            theType !== 'pegawai' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'klinik' &&
            theType !== 'program'
          ) {
            const data = await Fasiliti.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            return res.status(200).json(data);
          }
          if (theType === 'pegawai' || theType === 'juruterapi pergigian') {
            const data = await Operator.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            return res.status(200).json(data);
          }
          if (theType === 'klinik') {
            const data = await User.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            return res.status(200).json(data);
          }
          if (theType === 'program') {
            const data = await Event.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            return res.status(200).json(data);
          }
          break;
        case 'delete':
          console.log('delete for', theType);
          if (
            theType !== 'pegawai' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'klinik' &&
            theType !== 'program'
          ) {
            const data = await Fasiliti.findByIdAndDelete({ _id: Id });
            return res.status(200).json(data);
          }
          if (theType === 'pegawai' || theType === 'juruterapi pergigian') {
            const data = await Operator.findById({ _id: Id });
            data.activationStatus = false;
            data.tempatBertugasSebelumIni.push(data.kpSkrg);
            await data.save();
            return res.status(200).json(data);
          }
          if (theType === 'klinik') {
            const klinik = await User.findOne({ _id: Id });
            const fasilitiUnderKlinik = await Fasiliti.find({
              handler: klinik.kp,
              kodFasilitiHandler: klinik.kodFasiliti,
            });
            const operatorUnderKlinik = await Operator.find({
              kpSkrg: klinik.kp,
              kodFasiliti: klinik.kodFasiliti,
              activationStatus: true,
            });
            if (
              fasilitiUnderKlinik.length > 0 ||
              operatorUnderKlinik.length > 0
            ) {
              let mustDelete = '';
              if (fasilitiUnderKlinik.length > 0) {
                for (let q = 0; q < fasilitiUnderKlinik.length; q++) {
                  mustDelete += fasilitiUnderKlinik[q].nama;
                  mustDelete += ', ';
                }
              }
              if (operatorUnderKlinik.length > 0) {
                for (let w = 0; w < operatorUnderKlinik.length; w++) {
                  mustDelete += operatorUnderKlinik[w].nama;
                  mustDelete += ', ';
                }
              }
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
                const negeriNum = emailGen[data.negeri].kodNegeri;
                const daerahNum = emailGen[data.negeri].daerah[klinik.daerah];
                await User.findOneAndDelete({
                  username: `daftar${acronym.toLowerCase()}${negeriNum}${daerahNum}${
                    Data.kodFasiliti
                  }`,
                });
              }
            );
            // deleting events
            const events = await Event.find({
              createdByKp: data.kp,
              createdByDaerah: data.daerah,
              createdByNegeri: data.negeri,
              createdByKodFasiliti: data.kodFasiliti,
            }).then(async () => {
              if (events.length > 0) {
                for (let i = 0; i < events.length; i++) {
                  await Event.findOneAndDelete({
                    _id: events[i]._id,
                  });
                }
              }
            });
            return res.status(200).json(data);
          }
          if (theType === 'program') {
            const program = await Event.findOne({ _id: Id });
            const exists = await Umum.find({
              namaProgram: program.nama,
              jenisProgram: program.jenisEvent,
              createdByKodFasiliti: program.createdByKodFasiliti,
            });
            if (exists.length > 0) {
              return res.status(409).json({
                msg: `Program tidak boleh dihapus kerana ada pesakit yang didaftarkan. Jumlah pesakit: ${exists.length}`,
              });
            }
            const data = await Event.findByIdAndDelete({ _id: Id });
            return res.status(200).json(data);
          }
          if (theType === 'sosmed') {
            console.log(Id);
            let owner = '';
            if (daerah === '-') {
              owner = negeri;
            }
            if (daerah !== '-') {
              owner = daerah;
            }
            const deletedSosmed = await Sosmed.findOneAndUpdate(
              { kodProgram: Id.kodProgram, belongsTo: owner },
              { $pull: { data: { id: Id.id } } },
              { new: true }
            );
            res.status(200).json(deletedSosmed);
          }
          break;
        default:
          console.log('default case for DataCenter');
          break;
      }
      break;
    case 'KpCenter':
      var { kp, daerah, negeri, kodFasiliti } = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      console.log(FType);
      switch (Fn) {
        case 'create':
          console.log('create for kpcenter');
          switch (FType) {
            case 'program':
              Data = {
                ...Data,
                createdByKp: kp,
                createdByKodFasiliti: kodFasiliti,
                createdByDaerah: daerah,
                createdByNegeri: negeri,
              };
              const createdEvent = await Event.create(Data);
              res.status(200).json(createdEvent);
              break;
            case 'sosmed':
              const previousData = await Sosmed.find({
                belongsTo: kp,
                kodProgram: Data.kodProgram,
              });
              if (!previousData.data) {
                console.log('previous data not found');
                delete Data.data[0].kodProgram;
                Data.data[0] = {
                  id: 1,
                  ...Data.data[0],
                };
                const createdSosmed = await Sosmed.create(Data);
                return res.status(200).json(createdSosmed);
              }
              if (previousData.data) {
                console.log('previous data got');
                delete Data.data[0].kodProgram;
                const lastData = previousData[0].data.length;
                const lastIdofData = previousData[0].data[lastData - 1].id;
                Data.data[0] = {
                  id: lastIdofData + 1,
                  ...Data.data[0],
                };
                const updatedSosmed = await Sosmed.findOneAndUpdate(
                  { kodProgram: Data.kodProgram, belongsTo: kp },
                  { $push: { data: Data.data[0] } },
                  { new: true }
                );
                res.status(200).json(updatedSosmed);
              }
              break;
            case 'followers':
              const createFollowerData = await Followers.create(Data);
              res.status(200).json(createFollowerData);
              break;
            default:
              console.log('default case for kpcenter');
              break;
          }
          break;
        case 'update':
          console.log('update for kpcenter');
          switch (FType) {
            case 'program':
              const updateEvent = await Event.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(updateEvent);
              break;
            case 'jp':
            case 'pp':
              const updatePP = await Operator.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(updatePP);
              break;
            case 'tastad':
              const updateTastad = await Fasiliti.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(updateTastad);
              break;
            case 'mpb':
            case 'kpb':
              const updateKpb = await Fasiliti.findByIdAndUpdate(
                { _id: Id },
                { $push: { penggunaanKPBMPB: Data } },
                { new: true }
              );
              res.status(200).json(updateKpb);
              break;
            default:
              console.log('default case for update');
              break;
          }
          break;
        case 'delete':
          console.log('delete for kpcenter');
          switch (FType) {
            case 'program':
              const program = await Event.findOne({ _id: Id });
              const exists = await Umum.find({
                namaProgram: program.nama,
                jenisProgram: program.jenisEvent,
                createdByKodFasiliti: program.createdByKodFasiliti,
              });
              if (exists.length > 0) {
                console.log('patients registered under the program');
                return res.status(409).json({
                  msg: `Program tidak boleh dihapus kerana ada pesakit yang didaftarkan. Jumlah pesakit: ${exists.length}`,
                });
              }
              const data = await Event.findByIdAndDelete({ _id: Id });
              res.status(200).json(data);
              break;
            case 'sosmed':
              console.log(Id);
              const deletedSosmed = await Sosmed.findOneAndUpdate(
                { kodProgram: Id.kodProgram, belongsTo: kp },
                { $pull: { data: { id: Id.id } } },
                { new: true }
              );
              res.status(200).json(deletedSosmed);
              break;
            default:
              console.log('default case for delete');
              break;
          }
          break;
        default:
          console.log('default case for kpcenter');
          break;
      }
      break;
    case 'SuperadminCenter':
      switch (Fn) {
        case 'create':
          console.log('create for superadmincenter');
          break;
        case 'read':
          console.log('read for superadmincenter');
          const all = await Superadmin.find({});
          const allKlinik = await User.find({
            role: 'klinik',
          });
          let allData = [];
          let cleanData = [];
          for (let i = 0; i < all.length; i++) {
            let location = {
              daerah: all[i].daerah,
              negeri: all[i].negeri,
              username: all[i].user_name,
            };
            allData.push(location);
          }
          const num = _.findIndex(allData, { negeri: '-' });
          allData.splice(num, 1);
          const negeri = _.uniqBy(allData, 'negeri');
          const daerah = _.uniqBy(allData, 'daerah');
          const username = _.uniqBy(allData, 'username');
          for (let i = 0; i < negeri.length; i++) {
            let temp = [];
            let usernames = [];
            let klinik = [];
            for (let j = 0; j < daerah.length; j++) {
              if (
                negeri[i].negeri === daerah[j].negeri &&
                daerah[j].daerah !== '-'
              ) {
                let tempDaerah = {
                  daerah: daerah[j].daerah,
                  username: daerah[j].username,
                  klinik: [],
                };
                for (let k = 0; k < allKlinik.length; k++) {
                  if (
                    daerah[j].daerah === allKlinik[k].daerah &&
                    allKlinik[k].accountType !== 'kaunterUser'
                  ) {
                    let tempKlinik = {
                      username: allKlinik[k].username,
                      nama: allKlinik[k].kp,
                    };
                    tempDaerah.klinik.push(tempKlinik);
                  }
                }
                temp.push(tempDaerah);
              }
            }
            for (let j = 0; j < username.length; j++) {
              if (
                negeri[i].negeri === username[j].negeri &&
                username[j].daerah === '-'
              ) {
                let tempUser = { username: username[j].username };
                usernames.push(tempUser);
              }
            }
            let temp2 = {
              negeri: negeri[i].negeri,
              usernames: usernames,
              daerah: temp,
            };
            cleanData.push(temp2);
          }
          res.status(200).json(cleanData);
          break;
        case 'readDaerah':
          console.log('readDaerah for superadmincenter');
          var u = await Superadmin.findById(
            jwt.verify(token, process.env.JWT_SECRET).userId
          );
          const { negeri: currentNegeri } = u.getProfile();
          const d = await User.find({
            negeri: currentNegeri,
          });
          const presentDaerah = _.uniqBy(d, 'daerah');
          const daerahOnly = presentDaerah.map((item) => item.daerah);
          res.status(200).json(daerahOnly);
          break;
        case 'readKlinik':
          console.log('readKlinik for superadmincenter');
          var u = await Superadmin.findById(
            jwt.verify(token, process.env.JWT_SECRET).userId
          );
          if (u.accountType === 'daerahSuperadmin') {
            const { daerah: currentDaerah } = u.getProfile();
            const k = await User.find({
              daerah: currentDaerah,
            });
            const presentKlinik = _.uniqBy(k, 'kp');
            // map kp and kod fasiliti
            const klinikOnly = presentKlinik.map((item) => ({
              kp: item.kp,
              kodFasiliti: item.kodFasiliti,
            }));
            res.status(200).json(klinikOnly);
          }
          if (u.accountType === 'negeriSuperadmin') {
            const { daerah: currentDaerah } = req.body;
            const k = await User.find({
              daerah: currentDaerah,
            });
            const presentKlinik = _.uniqBy(k, 'kp');
            const klinikOnly = presentKlinik.map((item) => ({
              kp: item.kp,
              kodFasiliti: item.kodFasiliti,
            }));
            res.status(200).json(klinikOnly);
          }
          break;
        case 'readOne':
          console.log('readOne for superadmincenter');
          break;
        case 'update':
          console.log('update for superadmincenter');
          break;
        case 'delete':
          console.log('delete for superadmincenter');
          break;
        default:
          console.log('default case for superadmincenter');
          break;
      }
      break;
    case 'UserCenter':
      var { username, password, data } = req.body;
      switch (Fn) {
        case 'create':
          console.log('create for user');
          const { user_name, daerah, negeri, e_mail, accountType } = req.body;
          // const regData = await Superadmin.create({
          //   user_name: user_name,
          //   daerah: daerah,
          //   negeri: negeri,
          //   e_mail: e_mail,
          //   accountType: accountType,
          //   totp: false,
          // });
          const SuperadminList = require('../data/Superadmin.json');
          for (let s = 0; s < SuperadminList.length; s++) {
            const regData = await Superadmin.create(SuperadminList);
            return res.status(201).json(regData);
          }
          // res.status(200).json(regData);
          break;
        case 'read':
          console.log('read for user');
          const userData = await readUserData(token);
          res.status(200).json(userData);
          break;
        case 'readOne':
          console.log('readOne for user');
          const tempUser = await Superadmin.findOne({ user_name: username });
          // if no superadmin
          if (!tempUser) {
            // check kp user
            const tempKpUser = await User.findOne({ username: username });
            if (!tempKpUser && !tempUser) {
              return res.status(401).json({
                status: 'error',
                message: 'Tiada user ini di dalam sistem',
              });
            }
            return res.status(200).json({
              status: 'success',
              accountType: 'kpSuperadmin',
            });
          }
          // if yes superadmin
          // check if using totp
          if (tempUser.totp) {
            return res.status(200).json({
              status: 'success',
              totp: true,
            });
          }
          // if not using totp
          const currentMail = await sendVerificationEmail(tempUser._id);
          return res.status(200).json({
            status: 'success',
            email: currentMail,
            totp: false,
          });
          break;
        case 'update':
          console.log('update for user');
          const adminUser = await Superadmin.findOne({ user_name: username });
          // if kp
          if (!adminUser) {
            console.log('kp user');
            const kpUser = await User.findOne({ username: username });
            if (password !== kpUser.password) {
              return res.status(401).json({
                status: 'error',
                message: 'Password anda salah. Sila isi sekali lagi',
              });
            }
            return res.status(200).json({
              status: 'success',
              adminToken: kpUser.createJWT(),
            });
          }
          // if kp
          // check if using totp or not
          if (adminUser.totp) {
            console.log('totp');
            const verified = speakeasy.totp.verify({
              secret: adminUser.hex,
              encoding: 'hex',
              token: password,
              window: 1,
            });
            if (!verified) {
              return res.status(401).json({
                status: 'error',
                message: 'Nombor TOTP anda salah. Sila isi sekali lagi',
              });
            }
            return res.status(200).json({
              status: 'success',
              adminToken: adminUser.createJWT(),
            });
          }
          // using tempKey
          if (password !== adminUser.tempKey) {
            return res.status(401).json({
              status: 'error',
              message: 'Kunci verifikasi anda salah. Sila isi sekali lagi',
            });
          }
          return res.status(200).json({
            status: 'success',
            adminToken: adminUser.createJWT(),
          });
          break;
        case 'updateOne':
          console.log('updateOne for user');
          const newToken = await updateUserData(token, data);
          res.status(200).json({
            status: 'success',
            adminToken: newToken.createJWT(),
          });
          break;
        case 'delete':
          console.log('delete for user');
          break;
        default:
          console.log('default case for UserCenter');
          break;
      }
      break;
    case 'HqCenter':
      switch (Fn) {
        case 'create':
          console.log('create for hq');
          break;
        case 'read':
          console.log('read for hq');
          const { userId, accountType } = jwt.verify(
            token,
            process.env.JWT_SECRET
          );
          if (accountType === 'kpUser') {
            return res.status(200).json({
              status: 'success',
              message: 'kpuser',
            });
          }
          const { daerah, negeri } = await Superadmin.findOne({
            _id: userId,
          });
          let kpSelectionPayload = {};
          let ptSelectionPayload = {};
          if (accountType === 'hqSuperadmin') {
            console.log('superadmin query');
            kpSelectionPayload = {
              accountType: 'kpUser',
            };
            ptSelectionPayload = {
              jenisFasiliti: 'kp',
            };
          }
          if (accountType === 'negeriSuperadmin') {
            kpSelectionPayload = {
              accountType: 'kpUser',
              negeri: negeri,
            };
            ptSelectionPayload = {
              jenisFasiliti: 'kp',
              negeri: negeri,
            };
          }
          if (accountType === 'daerahSuperadmin') {
            kpSelectionPayload = {
              accountType: 'kpUser',
              negeri: negeri,
              daerah: daerah,
            };
            ptSelectionPayload = {
              jenisFasiliti: 'kp',
              negeri: negeri,
              daerah: daerah,
            };
          }
          const kpData = await User.find({ ...kpSelectionPayload });
          const ptData = await Umum.find({ ...ptSelectionPayload });
          let data = [];
          const negeris = [...new Set(kpData.map((item) => item.negeri))];
          for (n in negeris) {
            const negeri = negeris[n];
            const negeriData = kpData.filter((item) => item.negeri === negeri);
            let kedatangan = [];
            if (accountType !== 'daerahSuperadmin') {
              const negeriPtData = ptData.filter(
                (item) => item.createdByNegeri === negeri
              );
              kedatangan = [
                {
                  kedatangan: negeriPtData.filter(
                    (item) =>
                      item.tarikhKedatangan ===
                      moment().subtract(4, 'days').format('YYYY-MM-DD')
                  ).length,
                  tarikh: moment().subtract(4, 'days').format('YYYY-MM-DD'),
                },
                {
                  kedatangan: negeriPtData.filter(
                    (item) =>
                      item.tarikhKedatangan ===
                      moment().subtract(3, 'days').format('YYYY-MM-DD')
                  ).length,
                  tarikh: moment().subtract(3, 'days').format('YYYY-MM-DD'),
                },
                {
                  kedatangan: negeriPtData.filter(
                    (item) =>
                      item.tarikhKedatangan ===
                      moment().subtract(2, 'days').format('YYYY-MM-DD')
                  ).length,
                  tarikh: moment().subtract(2, 'days').format('YYYY-MM-DD'),
                },
                {
                  kedatangan: negeriPtData.filter(
                    (item) =>
                      item.tarikhKedatangan ===
                      moment().subtract(1, 'days').format('YYYY-MM-DD')
                  ).length,
                  tarikh: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                },
                {
                  kedatangan: negeriPtData.filter(
                    (item) =>
                      item.tarikhKedatangan === moment().format('YYYY-MM-DD')
                  ).length,
                  tarikh: moment().format('YYYY-MM-DD'),
                },
              ];
            }
            const daerah = [...new Set(negeriData.map((item) => item.daerah))];
            const klinik = [];
            for (d in daerah) {
              const daerahData = negeriData.filter(
                (item) => item.daerah === daerah[d]
              );
              if (accountType === 'daerahSuperadmin') {
                const daerahPtData = ptData.filter(
                  (item) => item.createdByDaerah === daerah[d]
                );
                kedatangan = [
                  {
                    kedatangan: daerahPtData.filter(
                      (item) =>
                        item.tarikhKedatangan === moment().format('YYYY-MM-DD')
                    ).length,
                    tarikh: moment().format('YYYY-MM-DD'),
                  },
                  {
                    kedatangan: daerahPtData.filter(
                      (item) =>
                        item.tarikhKedatangan ===
                        moment().subtract(1, 'days').format('YYYY-MM-DD')
                    ).length,
                    tarikh: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                  },
                  {
                    kedatangan: daerahPtData.filter(
                      (item) =>
                        item.tarikhKedatangan ===
                        moment().subtract(2, 'days').format('YYYY-MM-DD')
                    ).length,
                    tarikh: moment().subtract(2, 'days').format('YYYY-MM-DD'),
                  },
                  {
                    kedatangan: daerahPtData.filter(
                      (item) =>
                        item.tarikhKedatangan ===
                        moment().subtract(3, 'days').format('YYYY-MM-DD')
                    ).length,
                    tarikh: moment().subtract(3, 'days').format('YYYY-MM-DD'),
                  },
                  {
                    kedatangan: daerahPtData.filter(
                      (item) =>
                        item.tarikhKedatangan ===
                        moment().subtract(4, 'days').format('YYYY-MM-DD')
                    ).length,
                    tarikh: moment().subtract(4, 'days').format('YYYY-MM-DD'),
                  },
                ];
              }
              const klinikDiDaerah = {
                namaDaerah: daerah[d],
                jumlahPesakit: ptData.filter(
                  (item) => item.createdByDaerah === daerah[d]
                ).length,
                pesakitHariIni: ptData.filter(
                  (item) =>
                    item.createdByDaerah === daerah[d] &&
                    moment(item.tarikhKedatangan).isSame(moment(), 'day')
                ).length,
                pesakitMingguIni: ptData.filter(
                  (item) =>
                    item.createdByDaerah === daerah[d] &&
                    moment(item.tarikhKedatangan).isSame(moment(), 'week')
                ).length,
                pesakitBulanIni: ptData.filter(
                  (item) =>
                    item.createdByDaerah === daerah[d] &&
                    moment(item.tarikhKedatangan).isSame(moment(), 'month')
                ).length,
                klinik: [],
              };
              for (k in daerahData) {
                const klinikData = daerahData[k];
                klinikDiDaerah.klinik.push({
                  namaKlinik: klinikData.kp,
                  kodFasiliti: klinikData.kodFasiliti,
                  // pesakit: [],
                  jumlahPesakit: [],
                  pesakitHariIni: [],
                  pesakitMingguIni: [],
                  pesakitBulanIni: [],
                  pesakitBaru: [],
                  pesakitUlangan: [],
                });
                const pesakitData = ptData.filter(
                  (item) => item.createdByKp === klinikData.kp
                );
                const pesakitHariIni = ptData.filter(
                  (item) =>
                    item.createdByKp === klinikData.kp &&
                    item.tarikhKedatangan === moment().format('YYYY-MM-DD')
                );
                const pesakitMingguIni = ptData.filter(
                  (item) =>
                    item.createdByKp === klinikData.kp &&
                    moment(item.tarikhKedatangan).isBetween(
                      moment().startOf('week'),
                      moment().endOf('week')
                    )
                );
                const pesakitBulanIni = ptData.filter(
                  (item) =>
                    item.createdByKp === klinikData.kp &&
                    moment(item.tarikhKedatangan).isBetween(
                      moment().startOf('month'),
                      moment().endOf('month')
                    )
                );
                const pesakitBaru = ptData.filter(
                  (item) =>
                    item.createdByKp === klinikData.kp &&
                    item.kedatangan === 'baru-kedatangan'
                );
                const pesakitUlangan = ptData.filter(
                  (item) =>
                    item.createdByKp === klinikData.kp &&
                    item.kedatangan === 'ulangan-kedatangan'
                );
                klinikDiDaerah.klinik[k].jumlahPesakit = pesakitData.length;
                klinikDiDaerah.klinik[k].pesakitHariIni = pesakitHariIni.length;
                klinikDiDaerah.klinik[k].pesakitMingguIni =
                  pesakitMingguIni.length;
                klinikDiDaerah.klinik[k].pesakitBulanIni =
                  pesakitBulanIni.length;
                klinikDiDaerah.klinik[k].pesakitBaru = pesakitBaru.length;
                klinikDiDaerah.klinik[k].pesakitUlangan = pesakitUlangan.length;
                // for (p in pesakitData) {
                //   const pesakit = pesakitData[p];
                //   klinikDiDaerah.klinik[k].pesakit.push({
                //     namaPesakit: pesakit.nama,
                //   });
                // }
              }
              klinikDiDaerah.klinik.sort((a, b) => {
                if (a.namaKlinik < b.namaKlinik) {
                  return -1;
                }
                if (a.namaKlinik > b.namaKlinik) {
                  return 1;
                }
                return 0;
              });
              klinik.push(klinikDiDaerah);
            }
            klinik.sort((a, b) => {
              if (a.namaDaerah < b.namaDaerah) {
                return -1;
              }
              if (a.namaDaerah > b.namaDaerah) {
                return 1;
              }
              return 0;
            });
            data.push({
              namaNegeri: negeri,
              kedatanganPt: kedatangan,
              daerah: klinik,
            });
          }
          return res.status(200).json(data);
        case 'readOne':
          console.log('readOne for hq');
          const { id } = req.body;
          let klinikData = await User.find({
            kodFasiliti: id,
          });
          const klinikPtData = await Umum.find({
            createdByKp: klinikData[0].kp,
          });
          const jumlahPt = klinikPtData.length;
          const ptHariIni = klinikPtData.filter(
            (item) => item.tarikhKedatangan === moment().format('YYYY-MM-DD')
          );
          const pt2HariLepas = klinikPtData.filter(
            (item) =>
              item.tarikhKedatangan ===
              moment().subtract(1, 'days').format('YYYY-MM-DD')
          );
          const pt3HariLepas = klinikPtData.filter(
            (item) =>
              item.tarikhKedatangan ===
              moment().subtract(2, 'days').format('YYYY-MM-DD')
          );
          const pt4HariLepas = klinikPtData.filter(
            (item) =>
              item.tarikhKedatangan ===
              moment().subtract(3, 'days').format('YYYY-MM-DD')
          );
          const pt5HariLepas = klinikPtData.filter(
            (item) =>
              item.tarikhKedatangan ===
              moment().subtract(4, 'days').format('YYYY-MM-DD')
          );
          const ptMingguIni = klinikPtData.filter((item) =>
            moment(item.tarikhKedatangan).isBetween(
              moment().startOf('week'),
              moment().endOf('week')
            )
          );
          const ptBulanIni = klinikPtData.filter((item) =>
            moment(item.tarikhKedatangan).isBetween(
              moment().startOf('month'),
              moment().endOf('month')
            )
          );
          const ptBaru = klinikPtData.filter(
            (item) => item.kedatangan === 'baru-kedatangan'
          );
          const ptUlangan = klinikPtData.filter(
            (item) => item.kedatangan === 'ulangan-kedatangan'
          );
          klinikData = {
            ...klinikData[0]._doc,
            jumlahPt,
            ptHariIni: ptHariIni.length,
            ptMingguIni: ptMingguIni.length,
            ptBulanIni: ptBulanIni.length,
            ptBaru: ptBaru.length,
            ptUlangan: ptUlangan.length,
            kedatanganPt: [
              {
                kedatangan: pt5HariLepas.length,
                tarikh: moment().subtract(4, 'days').format('YYYY-MM-DD'),
              },
              {
                kedatangan: pt4HariLepas.length,
                tarikh: moment().subtract(3, 'days').format('YYYY-MM-DD'),
              },
              {
                kedatangan: pt3HariLepas.length,
                tarikh: moment().subtract(2, 'days').format('YYYY-MM-DD'),
              },
              {
                kedatangan: pt2HariLepas.length,
                tarikh: moment().subtract(1, 'days').format('YYYY-MM-DD'),
              },
              {
                kedatangan: ptHariIni.length,
                tarikh: moment().format('YYYY-MM-DD'),
              },
            ],
          };
          return res.status(200).json(klinikData);
        case 'update':
          console.log('update for hq');
          break;
        case 'delete':
          console.log('delete for hq');
          break;
        default:
          console.log('default for hq');
          break;
      }
      break;
    case 'TotpManager':
      const userToken = req.body.token;
      switch (Fn) {
        case 'create':
          console.log('create for totp');
          const { userId, username } = jwt.verify(
            userToken,
            process.env.JWT_SECRET
          );
          let backupCodes = [];
          let hashedBackupCodes = [];
          const secret = speakeasy.generateSecret({
            name: `Gi-Ret 2.0 (${username})`,
          });
          for (let i = 0; i < 10; i++) {
            const randomCode = (Math.random() * 10000000000).toFixed();
            const encrypted = CryptoJS.AES.encrypt(
              randomCode,
              secret.base32
            ).toString();
            backupCodes.push(randomCode);
            hashedBackupCodes.push(encrypted);
          }
          const qrCode = await QRCode.toDataURL(secret.otpauth_url);
          let tempSecret = {
            ascii: secret.ascii,
            hex: secret.hex,
            base32: secret.base32,
            otp_auth_url: secret.otpauth_url,
            backupCodes: backupCodes,
            hashedBackupCodes: hashedBackupCodes,
          };
          const totpToken = jwt.sign(
            {
              userId,
              tempSecret,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '1h',
            }
          );
          res.status(200).json({
            msg: 'success',
            qrcode: qrCode,
            url: tempSecret.otp_auth_url,
            totpToken,
          });
          break;
        case 'read':
          console.log('read for totp');
          const { totpCode } = req.body;
          const { base32 } = await Superadmin.findById(
            jwt.verify(token, process.env.JWT_SECRET).userId
          );
          const verified = speakeasy.totp.verify({
            secret: base32,
            encoding: 'base32',
            token: totpCode,
          });
          if (verified) {
            res.status(200).json({
              msg: 'success',
              verified,
            });
          } else {
            res.status(400).json({
              msg: 'error',
              verified,
            });
          }
          break;
        case 'update':
          const { initialTotpCode, initialTotpToken } = req.body;
          const { tempSecret: userSecret } = jwt.verify(
            initialTotpToken,
            process.env.JWT_SECRET
          );
          const initialVerification = speakeasy.totp.verify({
            secret: userSecret.hex,
            encoding: 'hex',
            token: initialTotpCode,
            window: 1,
          });
          if (initialVerification) {
            console.log('initial verification success');
            const initialAdmin = await Superadmin.findByIdAndUpdate(
              jwt.verify(token, process.env.JWT_SECRET).userId,
              {
                ascii: userSecret.ascii,
                hex: userSecret.hex,
                base32: userSecret.base32,
                otpauth_url: userSecret.otp_auth_url,
                backup_codes: userSecret.backupCodes,
                hashed_backup_codes: userSecret.hashedBackupCodes,
              },
              { new: true }
            );
            res.status(200).json({
              msg: 'success',
              initialVerification,
              initialAdmin,
            });
          } else {
            res.status(400).json({
              msg: 'failed',
              initialVerification,
            });
          }
          break;
        case 'delete':
          console.log('delete for totp');
          break;
        default:
          console.log('default for totp');
          break;
      }
      break;
    case 'ImageResizer':
      switch (Fn) {
        case 'resize':
          console.log('resize for image');
          const { image, type } = req.body;
          const base64 = await resizeProfileImage(image, type);
          if (base64 !== 'err') {
            return res.status(200).json({
              msg: 'success',
              imgSrc: base64,
            });
          } else {
            return res.status(400).json({
              msg: 'error',
            });
          }
          break;
        case 'read':
          console.log('read for image');
          break;
        default:
          console.log('default for image');
          break;
      }
      break;
    case 'AQManager':
      switch (Fn) {
        case 'create':
          console.log('create for aq');
          break;
        case 'read':
          console.log('read for aq');
          const { userId } = jwt.verify(token, process.env.JWT_SECRET);
          const { daerah, negeri } = await Superadmin.findOne({
            _id: userId,
          });
          const { x, y, mengandung, oku, bersekolah, pesara } = req.body;
          const query = await Helper.countAdHocQuery(
            negeri,
            daerah,
            x,
            y,
            mengandung,
            oku,
            bersekolah,
            pesara
          );
          res.status(200).json(query);
          break;
        case 'update':
          console.log('update for aq');
          break;
        case 'delete':
          console.log('delete for aq');
          break;
        default:
          console.log('default for aq');
          break;
      }
      break;
    case 'PromosiManager':
      switch (Fn) {
        case 'create':
          console.log('create for promosi');
          break;
        case 'read':
          console.log('read for promosi');
          const types = await PromosiType.find({ nama: 'current' });
          const { program } = types[0];
          res.status(200).json(program);
          break;
        case 'update':
          console.log('update for promosi');
          break;
        case 'delete':
          console.log('delete for promosi');
          break;
        default:
          console.log('default for promosi');
          break;
      }
      break;
    default:
      res.status(200).json({
        message: 'Provide nothing, get nothing',
      });
      break;
  }
};

const sendVerificationEmail = async (userId) => {
  const mailOptions = (admin, key) => {
    if (admin.e_mail) {
      return {
        from: process.env.EMAILER_ACCT,
        to: admin.e_mail,
        subject: 'Kunci Verifikasi Anda',
        html: html(admin.nama, key),
      };
    } else {
      return {
        from: process.env.EMAILER_ACCT,
        to: admin.email,
        subject: 'Kunci Verifikasi Anda',
        html: html(admin.nama, key),
      };
    }
  };
  const key = generateRandomString(8);
  // const superadmin = await Superadmin.findByIdAndUpdate(
  //   userId,
  //   { tempKey: key },
  //   { new: true }
  // );
  // if (!superadmin) {
  //   const superoperator = await Operator.findByIdAndUpdate(
  //     userId,
  //     { tempKey: key },
  //     { new: true }
  //   );
  // }
  try {
    const superadmin = await Superadmin.findByIdAndUpdate(
      userId,
      { tempKey: key },
      { new: true }
    );
    const e_mail = await transporter.sendMail(mailOptions(superadmin, key));
    return e_mail.accepted[0];
  } catch (err) {
    const superoperator = await Operator.findByIdAndUpdate(
      userId,
      { tempKey: key },
      { new: true }
    );
    const e_mail = await transporter.sendMail(mailOptions(superoperator, key));
    return e_mail.accepted[0];
  }
};

const readUserData = async (token) => {
  let userData;
  const { userId, accountType } = jwt.verify(token, process.env.JWT_SECRET);
  if (accountType !== 'kpUser') {
    const user = await Superadmin.findById(userId);
    userData = user.getProfile();
  }
  if (accountType === 'kpUser') {
    userData = {
      userId: jwt.verify(token, process.env.JWT_SECRET).userId,
      username: jwt.verify(token, process.env.JWT_SECRET).username,
      officername: jwt.verify(token, process.env.JWT_SECRET).officername,
      role: jwt.verify(token, process.env.JWT_SECRET).role,
      kodFasiliti: jwt.verify(token, process.env.JWT_SECRET).kodFasiliti,
      kp: jwt.verify(token, process.env.JWT_SECRET).kp,
      daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
      negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
      accountType: jwt.verify(token, process.env.JWT_SECRET).accountType,
    };
  }
  return userData;
};

const updateUserData = async (token, data) => {
  const updateUserData = await Superadmin.findByIdAndUpdate(
    jwt.verify(token, process.env.JWT_SECRET).userId,
    {
      nama: data.nama,
      tarikhLahir: data.tarikhLahir,
      e_mail: data.e_mail,
      totp: data.totp,
      image: data.image,
    },
    { new: true }
  );
  return updateUserData;
};

const generateRandomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const resizeProfileImage = async (file, type) => {
  const tempFileBuffer = Buffer.from(file, 'base64');
  const tempFileType = type.split('/')[1];
  const name = generateRandomString(10) + '.' + tempFileType;
  fs.writeFileSync(
    path.resolve(process.cwd(), `./public/${name}`),
    tempFileBuffer
  );
  try {
    const resizedImage = await sharp(
      path.resolve(process.cwd(), `./public/${name}`)
    )
      .resize(120, 120)
      .sharpen()
      .toBuffer();
    const dataImagePrefix = `data:image/${tempFileType};base64,`;
    const base64 = `${dataImagePrefix}${resizedImage.toString('base64')}`;
    fs.unlinkSync(path.resolve(process.cwd(), `./public/${name}`));
    return base64;
  } catch (err) {
    console.log(err);
    return 'err';
  }
};

const sosmedDataCompactor = (data) => {
  let countedData = [];
  let keys = {
    Facebook_live_bilAktivitiShareKurang10: 0,
    Facebook_live_bilAktivitiShareLebih10: 0,
    Facebook_live_bilPenonton: 0,
    Facebook_live_bilReach: 0,
    Facebook_live_bilShare: 0,
    Facebook_poster_bilAktivitiShareKurang10: 0,
    Facebook_poster_bilAktivitiShareLebih10: 0,
    Facebook_poster_bilPenonton: 0,
    Facebook_poster_bilReach: 0,
    Facebook_poster_bilShare: 0,
    Facebook_video_bilAktivitiShareKurang10: 0,
    Facebook_video_bilAktivitiShareLebih10: 0,
    Facebook_video_bilPenonton: 0,
    Facebook_video_bilReach: 0,
    Facebook_video_bilShare: 0,
    Instagram_live_bilAktivitiShareKurang10: 0,
    Instagram_live_bilAktivitiShareLebih10: 0,
    Instagram_live_bilPenonton: 0,
    Instagram_live_bilReach: 0,
    Instagram_live_bilShare: 0,
    Instagram_poster_bilAktivitiShareKurang10: 0,
    Instagram_poster_bilAktivitiShareLebih10: 0,
    Instagram_poster_bilPenonton: 0,
    Instagram_poster_bilReach: 0,
    Instagram_poster_bilShare: 0,
    Instagram_video_bilAktivitiShareKurang10: 0,
    Instagram_video_bilAktivitiShareLebih10: 0,
    Instagram_video_bilPenonton: 0,
    Instagram_video_bilReach: 0,
    Instagram_video_bilShare: 0,
    Twitter_poster_bilAktivitiShareKurang10: 0,
    Twitter_poster_bilAktivitiShareLebih10: 0,
    Twitter_poster_bilPenonton: 0,
    Twitter_poster_bilReach: 0,
    Twitter_poster_bilShare: 0,
    Twitter_video_bilAktivitiShareKurang10: 0,
    Twitter_video_bilAktivitiShareLebih10: 0,
    Twitter_video_bilPenonton: 0,
    Twitter_video_bilReach: 0,
    Twitter_video_bilShare: 0,
    Tiktok_live_bilAktivitiShareKurang10: 0,
    Tiktok_live_bilAktivitiShareLebih10: 0,
    Tiktok_live_bilPenonton: 0,
    Tiktok_live_bilReach: 0,
    Tiktok_live_bilShare: 0,
    Tiktok_video_bilAktivitiShareKurang10: 0,
    Tiktok_video_bilAktivitiShareLebih10: 0,
    Tiktok_video_bilPenonton: 0,
    Tiktok_video_bilReach: 0,
    Tiktok_video_bilShare: 0,
    Youtube_live_bilAktivitiShareKurang10: 0,
    Youtube_live_bilAktivitiShareLebih10: 0,
    Youtube_live_bilPenonton: 0,
    Youtube_live_bilReach: 0,
    Youtube_live_bilShare: 0,
    Youtube_video_bilAktivitiShareKurang10: 0,
    Youtube_video_bilAktivitiShareLebih10: 0,
    Youtube_video_bilPenonton: 0,
    Youtube_video_bilReach: 0,
    Youtube_video_bilShare: 0,
    Lain_live_bilAktivitiShareKurang10: 0,
    Lain_live_bilAktivitiShareLebih10: 0,
    Lain_live_bilPenonton: 0,
    Lain_live_bilReach: 0,
    Lain_live_bilShare: 0,
    Lain_poster_bilAktivitiShareKurang10: 0,
    Lain_poster_bilAktivitiShareLebih10: 0,
    Lain_poster_bilPenonton: 0,
    Lain_poster_bilReach: 0,
    Lain_poster_bilShare: 0,
    Lain_video_bilAktivitiShareKurang10: 0,
    Lain_video_bilAktivitiShareLebih10: 0,
    Lain_video_bilPenonton: 0,
    Lain_video_bilReach: 0,
    Lain_video_bilShare: 0,
  };
  for (let j = 0; j < data.length; j++) {
    for (let i = 0; i < data[j].data.length; i++) {
      Object.keys(data[j].data[i]).forEach((key) => {
        keys[key] += parseInt(data[j].data[i][key]);
      });
    }
  }
  delete keys.id;
  delete keys.tarikhAkhir;
  delete keys.tarikhMula;
  delete keys.namaAktiviti;
  // for (let i = 0; i < socmed.length; i++) {
  //   let obj = {};
  //   Object.keys(keys).forEach((key) => {
  //     console.log(`${key}: ${keys[key]}`);
  //     if (key.includes(socmed[i])) {
  //       obj[key] = keys[key];
  //     }
  //   });
  //   countedData.push(obj);
  // }
  for (let i = 0; i < socmed.length; i++) {
    let obj = { name: socmed[i], data: [] };
    let objlive = { name: 'live', data: [] };
    let objvideo = { name: 'video', data: [] };
    let objposter = { name: 'poster', data: [] };
    let livedata = {};
    let videodata = {};
    let posterdata = {};
    Object.keys(keys).forEach((key) => {
      if (key.includes(socmed[i])) {
        if (key.includes('live')) {
          let newKey = key.replace(`${socmed[i]}_live_`, '');
          livedata[newKey] = keys[key];
        } else if (key.includes('video')) {
          let newKey = key.replace(`${socmed[i]}_video_`, '');
          videodata[newKey] = keys[key];
        } else if (key.includes('poster')) {
          let newKey = key.replace(`${socmed[i]}_poster_`, '');
          posterdata[newKey] = keys[key];
        }
      }
    });
    objlive.data.push(livedata);
    objvideo.data.push(videodata);
    objposter.data.push(posterdata);
    obj.data.push(objlive);
    obj.data.push(objvideo);
    obj.data.push(objposter);
    countedData.push(obj);
  }
  return countedData;
};

const html = (nama, key) =>
  `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>
  </title>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <noscript>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        </noscript>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    }
  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-100 {
      width: 100% !important;
      max-width: 100%;
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }
  </style>
</head>

<body style="word-spacing:normal;background-color:#ffffff;">
  <div style="background-color:#ffffff;">
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:200px;">
                                <img alt="" height="auto" src="https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg" style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="200" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#009FE3" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#009FE3;background-color:#009FE3;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#009FE3;background-color:#009FE3;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#009fe3" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#009fe3;background-color:#009fe3;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#009fe3;background-color:#009fe3;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                  <tbody>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                        <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:22px;line-height:1;text-align:left;color:#ffffff;"><span style="color:#FEEB35">Hi ${nama},</span><br /></div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                        <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:15px;line-height:1;text-align:left;color:#ffffff;">Anda telah memohon untuk login ke akaun anda. Kunci verifikasi anda adalah:</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                          <tr>
                            <td align="center" bgcolor="#ffffff" role="presentation" style="border:none;border-radius:10px;cursor:auto;mso-padding-alt:10px 25px;background:#ffffff;" valign="middle">
                              <p style="display:inline-block;background:#ffffff;color:#1AA0E1;font-family:open Sans Helvetica, Arial, sans-serif;font-size:22px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:10px;"> ${key} </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                        <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:15px;line-height:1;text-align:left;color:#ffffff;">Jika anda tidak memohon untuk login, sila abaikan email ini.</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                        <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:15px;line-height:1;text-align:left;color:#ffffff;">Terima kasih, <br /> Team Gi-Ret 2.0</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
  </div>
</body>
</html>`;

module.exports = {
  generateRandomString,
  initialData,
  initialDataNegeri,
  initialDataDaerah,
  initialDataKlinik,
  initialDataAdmins,
  checkUser,
  loginUser,
  getData,
  getDataRoute,
  getDataKpRoute,
  getOneDataRoute,
  getOneDataKpRoute,
};

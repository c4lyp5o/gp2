const _ = require('lodash');
const https = require('https');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const mailer = require('nodemailer');
const moment = require('moment');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Superadmin = require('../models/Superadmin');
const Fasiliti = require('../models/Fasiliti');
const Operator = require('../models/Operator');
const User = require('../models/User');
const Umum = require('../models/Umum');
const Event = require('../models/Event');
const Sekolah = require('../models/Sekolah');
const Sosmed = require('../models/MediaSosial');
const Followers = require('../models/Followers');
const PromosiType = require('../models/PromosiType');
const GenerateToken = require('../models/GenerateToken');
const MaklumatAsasDaerah = require('../models/MaklumatAsasDaerah');
const AgensiLuar = require('../models/AgensiLuar');
const PemeriksaanagensiLuar = require('../models/AgensiLuarForm');
const emailGen = require('../lib/emailgen');
const sesiTakwimSekolah = require('./helpers/sesiTakwimSekolah');
const insertToSekolah = require('./helpers/insertToSekolah');
const { logger } = require('../logs/logger');

// helper
const Helper = require('./countHelperRegular');

const Dictionary = {
  kp: 'klinik',
  kpallnegeri: 'klinik-all-negeri',
  rtc: 'rtc',
  kkiakd: 'kkiakd',
  kkiakdspesifik: 'kkiakd-spesifik',
  kkiakdallnegeri: 'kkiakd-all-negeri',
  pp: 'pegawai',
  ppall: 'pegawai-all',
  pegawaispesifik: 'pegawai-spesifik',
  ppspn: 'pegawai-spesifik-negeri',
  jp: 'juruterapi pergigian',
  jpall: 'jp-all',
  jpspn: 'jp-spesifik-negeri',
  taska: 'taska',
  tadika: 'tadika',
  tastad: 'tastad',
  tastadallnegeri: 'tastad-all-negeri',
  sr: 'sekolah-rendah',
  sm: 'sekolah-menengah',
  'sr-sm-all': 'sr-sm-all',
  ins: 'institusi',
  kpb: 'kp-bergerak',
  'kpb-all': 'kp-bergerak-all',
  kpbmpbspesifik: 'kpbmpb-spesifik',
  mpb: 'makmal-pergigian',
  'mpb-all': 'makmal-pergigian-all',
  event: 'event',
  'sa-a': 'superadmin-all',
  sosmed: 'sosmed',
  sosmedByKodProgram: 'sosmedByKodProgram',
  followers: 'followers',
  program: 'program',
  programspesifik: 'program-spesifik',
  // maklumat asas daerah
  mad: 'maklumat-asas-daerah',
  //agensi luar
  gtod: 'program-gtod',
  wargaemas: 'program-wargaemas',
  pemeriksaanGtod: 'gtod-pemeriksaan',
  pemeriksaanWE: 'wargaemas-pemeriksaan',
  // token
  tokenbal: 'token-balance',
  // carian jana
  janatadika: 'jana-tadika',
  janasekolahrendah: 'jana-sekolah-rendah',
  janasekolahmenengah: 'jana-sekolah-menengah',
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
  const all = await Superadmin.find({
    accountType: 'negeriSuperadmin',
  });
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
  const { negeri } = req.query;
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

  const allRoleAdmin = await Operator.find({
    kodFasiliti: kodFasiliti,
    role: 'admin',
    activationStatus: true,
  }).select('nama email mdcNumber mdtbNumber');

  const allRoleMediaSosialKlinik = await Operator.find({
    kodFasiliti: kodFasiliti,
    role: 'umum',
    roleMediaSosialKlinik: true,
    activationStatus: true,
  }).select('nama email mdcNumber mdtbNumber');

  const all = allRoleAdmin.concat(allRoleMediaSosialKlinik);

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

const checkUser = async (req, res) => {
  const { username } = req.query;
  const tempUser = await Superadmin.findOne({ user_name: username });
  // if no superadmin
  if (!tempUser) {
    // check kp user
    let regNumber = {};
    if (username.includes('MDTB')) {
      regNumber.mdtbNumber = username;
    } else {
      regNumber.mdcNumber = username;
    }
    const admins = await Operator.find(regNumber).select('-summary');
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
    let regNumber = {};
    let userData = {};
    if (username.includes('MDTB')) {
      regNumber.mdtbNumber = username;
    } else {
      regNumber.mdcNumber = username;
    }
    const superOperator = await Operator.findOne(regNumber).select('-summary');
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
      ...userData,
      userId: kpUser._id,
      username: kpUser.username,
      officername: superOperator.nama,
      kodFasiliti: kpUser.kodFasiliti,
      accountType: 'kpUser',
      negeri: kpUser.negeri,
      daerah: kpUser.daerah,
      kp: kpUser.kp,
    };
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    logger.info(
      `[adminAPI/loginUser] kpUser ${userData.username} | ${userData.officername} logged in`
    );
    return res.status(200).json({
      status: 'success',
      adminToken: token,
    });
  }
  // if admin
  // KEPERLUAN DEV
  if (process.env.BUILD_ENV === 'dev' && process.env.IDDQD === 'on') {
    logger.info(`[adminAPI/loginUser] DEV ${adminUser.user_name} logged in`);
    return res.status(200).json({
      status: 'success',
      adminToken: adminUser.createJWT(),
    });
  }
  // KEPERLUAN DEV
  // check if using totp or not
  if (adminUser.totp) {
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
    logger.info(
      `[adminAPI/loginUser] superadminUser ${adminUser.user_name} logged in using totp`
    );
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
  logger.info(
    `[adminAPI/loginUser] superadminUser ${adminUser.user_name} logged in using generated password`
  );
  return res.status(200).json({
    status: 'success',
    adminToken: adminUser.createJWT(),
  });
};

const getDataRoute = async (req, res) => {
  // 1st phase
  const authKey = req.headers.authorization;
  const { negeri, daerah, user_name, accountType } = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  const { FType, kp } = req.query;
  const type = Dictionary[FType];
  logger.info(`[adminAPI/getDataRoute] ${user_name} requested ${type} data`);

  // 2nd phase
  let data, countedData, owner, query;

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
    case 'rtc':
      query = {
        ...(accountType === 'negeriSuperadmin' && { negeri }),
        ...(accountType === 'daerahSuperadmin' && {
          negeri,
          daerah,
        }),
        kp: { $regex: /rtc/i },
        accountType: 'kpUser',
      };
      data = await User.find(query).select('kp negeri kodFasiliti').lean();
      break;
    case 'kkiakd-spesifik':
      data = await Fasiliti.find({
        kodFasilitiHandler: kp,
        jenisFasiliti: 'kkiakd',
      })
        .select('nama kodKkiaKd')
        .lean();
      break;
    case 'kpbmpb-spesifik':
      query = {
        ...(accountType === 'negeriSuperadmin' && { createdByNegeri: negeri }),
        ...(accountType === 'daerahSuperadmin' && {
          createdByNegeri: negeri,
          createdByDaerah: daerah,
        }),
        ...(kp !== '-' && { kodFasilitiHandler: kp }),
        jenisFasiliti: ['kp-bergerak', 'makmal-pergigian'],
      };
      data = await Fasiliti.find(query).select('nama proposedName').lean();
      break;
    case 'pegawai-all':
      data = await Operator.find({
        statusPegawai: 'pp',
        activationStatus: true,
      }).lean();
      break;
    case 'pegawai':
      data = await Operator.find({
        statusPegawai: 'pp',
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        activationStatus: true,
      }).lean();
      break;
    case 'pegawai-spesifik':
      data = await Operator.find({
        kodFasiliti: kp,
        activationStatus: true,
      })
        .select('nama mdcNumber mdtbNumber statusPegawai')
        .lean();
      break;
    case 'pegawai-spesifik-negeri':
      data = await Operator.find({
        createdByNegeri: negeri,
        statusPegawai: 'pp',
        activationStatus: true,
      })
        .sort({ nama: 1 })
        .lean();
      break;
    case 'jp-all':
      data = await Operator.find({
        statusPegawai: 'jp',
        activationStatus: true,
      }).lean();
      break;
    case 'juruterapi pergigian':
      data = await Operator.find({
        statusPegawai: 'jp',
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        activationStatus: true,
      }).lean();
      break;
    case 'jp-spesifik-negeri':
      data = await Operator.find({
        createdByNegeri: negeri,
        statusPegawai: 'jp',
        nama: { $regex: /^((?!jp).)*$/i },
        activationStatus: true,
      })
        .sort({ nama: 1 })
        .lean();
      break;
    case 'sekolah-rendah':
      data = await Fasiliti.find({
        jenisFasiliti: type,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        // sesiTakwimSekolah: sesiTakwimSekolah(), // activate this later when full integration happen
      });
      break;
    case 'sekolah-menengah':
      data = await Fasiliti.find({
        jenisFasiliti: type,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        // sesiTakwimSekolah: sesiTakwimSekolah(), // activate this later when full integration happen
      });
      break;
    case 'sr-sm-all':
      data = await Fasiliti.find({
        jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      });
      break;
    case 'program':
      data = await Event.find({
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        assignedByDaerah: true,
        tahunDibuat: new Date().getFullYear(),
      }).lean();
      break;
    case 'program-spesifik':
      data = await Event.find({
        createdByKodFasiliti: kp,
      })
        .select('nama jenisEvent tarikhStart tarikhEnd')
        .lean();
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
      }).lean();
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
      }).lean();
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
      }).lean();
      break;
    case 'token-balance':
      data = await GenerateToken.find({
        belongsTo: user_name,
      })
        .select('jumlahToken jenisReten')
        .lean();
      break;
    case 'maklumat-asas-daerah':
      data = await MaklumatAsasDaerah.find({
        createdByNegeri: negeri,
        createdByDaerah: daerah,
      }).lean();
      break;
    case 'jana-tadika':
      data = await Fasiliti.find({
        jenisFasiliti: 'tadika',
        ...(daerah === '-'
          ? { createdByNegeri: negeri }
          : { createdByNegeri: negeri, createdByDaerah: daerah }),
      })
        .select('nama kodFasilitiHandler handler kodTastad')
        .lean();
      break;
    case 'jana-sekolah-rendah':
      data = await Fasiliti.find({
        jenisFasiliti: 'sekolah-rendah',
        sekolahSelesaiReten: true,
        ...(daerah === '-'
          ? { createdByNegeri: negeri }
          : { createdByNegeri: negeri, createdByDaerah: daerah }),
      })
        .select('nama kodFasilitiHandler kodSekolah idInstitusi handler')
        .lean();
      break;
    case 'jana-sekolah-menengah':
      data = await Fasiliti.find({
        jenisFasiliti: 'sekolah-menengah',
        sekolahSelesaiReten: true,
        ...(daerah === '-'
          ? { createdByNegeri: negeri }
          : { createdByNegeri: negeri, createdByDaerah: daerah }),
      })
        .select('nama kodFasilitiHandler kodSekolah idInstitusi handler')
        .lean();
    case 'program-gtod':
      console.log('masuk gtod', type);
      data = await AgensiLuar.find({
        createdByNegeri: negeri,
        createdByDaerah: daerah,
        tahunSemasa: new Date().getFullYear(),
      }).populate('pemeriksaanAgensiLuar1 pemeriksaanAgensiLuar2');
      break;
    case 'program-wargaemas':
      data = await AgensiLuar.find({
        createdByNegeri: negeri,
        createdByDaerah: daerah,
        tahunSemasa: new Date().getFullYear(),
      }).lean();
      break;
    case 'gtod-pemeriksaan':
      data = await PemeriksaanagensiLuar.find({
        _id: singleFormId,
      });
      break;
    default:
      data = await Fasiliti.find({
        jenisFasiliti: type,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
      }).lean();
      break;
  }
  // 3rd phase
  if (data.length === 0) {
    logger.error(
      `[adminAPI/getDataRoute] ${user_name} requested ${type} data but no data found`
    );
    return res.status(404).json({
      message: `Tiada data ${type} dijumpai`,
    });
  } else {
    res.status(200).json(data);
  }
};

const getDataKpRoute = async (req, res) => {
  // 1st phase
  const authKey = req.headers.authorization;
  const { kp, daerah, negeri, kodFasiliti, username } = jwt.verify(
    authKey,
    process.env.JWT_SECRET
  );
  const { FType } = req.query;
  const type = Dictionary[FType];
  logger.info(`[adminAPI/getDataKpRoute] ${kp} requested ${type} data`);
  // 2nd phase
  let data, countedData;

  switch (type) {
    case 'klinik':
      data = await User.find({
        accountType: 'kpUser',
        negeri,
        daerah,
        statusPerkhidmatan: 'active',
      });
      break;
    case 'klinik-all-negeri':
      data = await User.find({
        accountType: 'kpUser',
        negeri,
        statusPerkhidmatan: 'active',
      });
      break;
    case 'program':
      data = await Event.find({
        createdByKp: kp,
        createdByKodFasiliti: kodFasiliti,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        tahunDibuat: new Date().getFullYear(),
      }).lean();
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
      }).lean();
      break;
    case 'followers':
      data = await Followers.find({
        belongsTo: kp,
      }).lean();
      break;
    case 'kkiakd':
      data = await Fasiliti.find({
        jenisFasiliti: 'kkiakd',
        createdByNegeri: negeri,
        statusPerkhidmatan: 'active',
      }).lean();
    case 'kkiakd-all-negeri':
      data = await Fasiliti.find({
        jenisFasiliti: 'kkiakd',
        createdByNegeri: negeri,
        statusPerkhidmatan: 'active',
      }).lean();
      break;
    case 'tastad':
      data = await Fasiliti.find({
        jenisFasiliti: ['taska', 'tadika'],
        handler: kp,
        kodFasilitiHandler: kodFasiliti,
        statusPerkhidmatan: 'active',
      }).lean();
      data.sort((a, b) => {
        return a.jenisFasiliti.localeCompare(b.jenisFasiliti);
      });
      break;
    case 'tastad-all-negeri':
      data = await Fasiliti.find({
        jenisFasiliti: ['taska', 'tadika'],
        createdByNegeri: negeri,
        statusPerkhidmatan: 'active',
      }).lean();
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
      })
        .select('-summary')
        .lean();
      break;
    case 'juruterapi pergigian':
      data = await Operator.find({
        statusPegawai: 'jp',
        kpSkrg: kp,
        kodFasiliti: kodFasiliti,
        activationStatus: true,
      })
        .select('-summary')
        .lean();
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
        statusPerkhidmatan: 'active',
      }).lean();
      break;
    case 'kp-bergerak-all':
      data = await Fasiliti.find({
        jenisFasiliti: 'kp-bergerak',
        statusPerkhidmatan: 'active',
      }).lean();
      break;
    case 'makmal-pergigian':
      data = await Fasiliti.find({
        jenisFasiliti: type,
        kodFasilitiHandler: kodFasiliti,
        statusPerkhidmatan: 'active',
      }).lean();
      break;
    case 'makmal-pergigian-all':
      data = await Fasiliti.find({
        jenisFasiliti: 'makmal-pergigian',
        statusPerkhidmatan: 'active',
      }).lean();
      break;
    case 'kkiakd-spesifik':
      data = await Fasiliti.find({
        kodFasilitiHandler: kodFasiliti,
        jenisFasiliti: 'kkiakd',
      })
        .select('nama kodKkiaKd')
        .lean();
      break;
    case 'kpbmpb-spesifik':
      data = await Fasiliti.find({
        kodFasilitiHandler: kodFasiliti,
        jenisFasiliti: { $in: ['kp-bergerak', 'makmal-pergigian'] },
      })
        .select('nama proposedName')
        .lean();
      break;
    case 'program-spesifik':
      data = await Event.find({
        createdByKodFasiliti: kodFasiliti,
      })
        .select('nama jenisEvent tarikhStart tarikhEnd')
        .lean();
      break;
    case 'pegawai-spesifik':
      data = await Operator.find({
        kpSkrg: kp,
        kodFasiliti: kodFasiliti,
        activationStatus: true,
      })
        .select('nama mdcNumber mdtbNumber statusPegawai')
        .lean();
      break;
    case 'sekolah-rendah':
      data = await Fasiliti.find({
        createdByNegeri: negeri,
        jenisFasiliti: 'sekolah-rendah',
      }).lean();
      break;
    case 'sekolah-menengah':
      data = await Fasiliti.find({
        createdByNegeri: negeri,
        jenisFasiliti: 'sekolah-menengah',
      }).lean();
      break;
    case 'token-balance':
      data = await GenerateToken.find({
        belongsTo: username,
      })
        .select('jumlahToken jenisReten')
        .lean();
      break;
    default:
      console.log('default');
      break;
  }
  // 3rd phase
  if (data.length === 0) {
    logger.info(
      `[adminAPI/getDataRoute] ${kp} requested ${type} data but no data found`
    );
    return res.status(404).json({
      message: `Tiada data ${type} dijumpai`,
    });
  } else {
    res.status(200).json(data);
  }
};

const getOneDataRoute = async (req, res) => {
  // 1st phase
  const authKey = req.headers.authorization;
  const { FType, Id } = req.query;
  const { user_name } = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  const type = Dictionary[FType];
  logger.info(
    `[adminAPI/getOneDataRoute] ${user_name} requested ${type} data with id ${Id}`
  );
  // 2nd phase
  let data;

  switch (type) {
    case 'pegawai':
    case 'juruterapi pergigian':
      data = await Operator.findById(Id).select('-summary').lean();
      break;
    case 'klinik':
      data = await User.findById(Id).lean();
      break;
    case 'program':
      data = await Event.findById(Id).lean();
      break;
    case 'program-gtod':
      console.log('masuk gtod', type);
      data = await AgensiLuar.findById(Id).lean();
      console.log(data);
      break;
    case 'program-wargaemas':
      data = await AgensiLuar.findById(Id).lean();
      break;
    case 'gtod-pemeriksaan':
      data = await PemeriksaanagensiLuar.findById(Id).lean();
      break;
    default:
      data = await Fasiliti.findById(Id).lean();
      break;
  }
  // 3rd phase
  if (data.length === 0) {
    logger.info(
      `[adminAPI/getOneDataRoute] ${user_name} requested ${type} data with id ${Id} but no data found`
    );
    return res.status(404).json({
      message: `Tiada data ${type} dengan id ${Id}`,
    });
  } else {
    res.status(200).json(data);
  }
};

const getOneDataKpRoute = async (req, res) => {
  // 1st phase
  const authKey = req.headers.authorization;
  const { FType, Id } = req.query;
  const { kp } = jwt.verify(authKey, process.env.JWT_SECRET);
  const type = Dictionary[FType];
  logger.info(
    `[adminAPI/getOneDataKpRoute] ${kp} requested ${type} data with id ${Id}`
  );
  // 2nd phase
  let data;

  switch (type) {
    case 'program':
      data = await Event.findById(Id).lean();
      break;
    case 'pegawai':
    case 'juruterapi pergigian':
      data = await Operator.findById(Id).select('-summary').lean();
      break;
    default:
      data = await Fasiliti.findById(Id).lean();
      break;
  }
  // 3rd phase
  if (data.length === 0) {
    logger.info(
      `[adminAPI/getOneDataKpRoute] ${kp} requested ${type} data with id ${Id} but no data found`
    );
    return res.status(404).json({
      message: `Tiada data ${type} dengan id ${Id}`,
    });
  } else {
    res.status(200).json(data);
  }
};

const postRoute = async (req, res) => {
  const authKey = req.headers.authorization;
  const { FType, Data } = req.body;
  const { daerah, negeri, user_name } = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  const type = Dictionary[FType];
  logger.info(
    `[adminAPI/postRoute] ${user_name} attempting to create ${type} data`
  );
  let data, exists;

  switch (type) {
    case 'pegawai':
    case 'juruterapi pergigian':
      const query =
        type === 'pegawai'
          ? { mdcNumber: Data.mdcNumber }
          : { mdtbNumber: Data.mdtbNumber };
      exists = await Operator.findOne(query).select('-summary');

      if (exists) {
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
        data = await exists.save();
        logger.info(
          `[adminAPI/DataCenter] ${user_name} reactivated ${type} - ${Data.nama}`
        );
      } else {
        Data = {
          ...Data,
          createdByDaerah: daerah,
          createdByNegeri: negeri,
        };
        data = await Operator.create(Data);
        logger.info(
          `[adminAPI/DataCenter] ${user_name} created ${type} - ${Data.nama}`
        );
      }
      break;
    case 'klinik':
      Data = {
        ...Data,
        daerah,
        negeri,
      };
      data = await User.create(Data).then(async () => {
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
        }
      });
      logger.info(
        `[adminAPI/DataCenter] ${user_name} created ${type} - ${Data.kp}`
      );
      break;
    case 'taska':
    case 'tadika':
      const exists = await Fasiliti.findOne({
        kodTastad: Data.kodTastad,
      });
      if (exists) {
        return res.status(409).json({
          message: 'Kod Taska/Tadika ini telah wujud',
        });
      } else {
        Data = {
          ...Data,
          jenisFasiliti: theType,
          createdByDaerah: daerah,
          createdByNegeri: negeri,
        };
        data = await Fasiliti.create(Data);
        logger.info(
          `[adminAPI/DataCenter] ${user_name} created ${type} - ${Data.nama}`
        );
      }
      break;
    case 'sekolah-rendah':
    case 'sekolah-menengah':
      let tempSekolahData = {
        ...Data,
        jenisFasiliti: theType,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
        sesiTakwimSekolah: sesiTakwimSekolah(),
      };
      try {
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });
        const { data } = await axios.get(
          process.env.MOEIS_INTEGRATION_URL_PELAJAR +
            `?inid=${Data.idInstitusi}`,
          {
            httpsAgent: agent,
            headers: {
              APIKEY: process.env.MOEIS_APIKEY,
            },
          }
        );
        const dataCreatedSRSM = await Fasiliti.create(tempSekolahData);
        logger.info(
          `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${tempSekolahData.nama}`
        );
        // send response registered sekolah first so that client will not wait too long on loading
        res.status(200).json(dataCreatedSRSM);

        // calling insertion function to collection sekolahs
        insertToSekolah(dataCreatedSRSM, data);
        return;
      } catch (error) {
        return res.status(503).json({ msg: error.message });
      }
      break;
    case 'kp-bergerak':
    case 'makmal-pergigian':
      exists = await Fasiliti.findOne({
        nama: Data.nama,
        jenisFasiliti: ['kp-bergerak', 'makmal-pergigian'],
      });
      if (exists) {
        return res.status(409).json({
          message: 'No plat KPB/MPB ini telah wujud',
        });
      } else {
        Data = {
          ...Data,
          jenisFasiliti: theType,
          createdByDaerah: daerah,
          createdByNegeri: negeri,
        };
        data = await Fasiliti.create(Data);
        logger.info(
          `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.nama}`
        );
      }
      break;
    case 'sosmed':
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
        delete Data.data[0].kodProgram;
        Data.data[0] = {
          id: 1,
          ...Data.data[0],
        };
        data = await Sosmed.create(Data);
      } else {
        delete Data.data[0].kodProgram;
        const lastData = previousData[0].data.length;
        const lastIdofData = previousData[0].data[lastData - 1].id;
        Data.data[0] = {
          id: lastIdofData + 1,
          ...Data.data[0],
        };
        data = await Sosmed.findOneAndUpdate(
          { kodProgram: Data.kodProgram, belongsTo: owner },
          { $push: { data: Data.data[0] } },
          { new: true }
        );
        logger.info(
          `[adminAPI/DataCenter] ${user_name} updated ${type} - ${Data.kodProgram}`
        );
      }
      break;
    case 'followers':
      data = await Followers.create(Data);
      logger.info(`${user_name} created ${type} - ${Data.kodProgram}`);
      break;
    case 'program':
      if (negeri) {
        Data.createdByNegeri = negeri;
      }
      if (daerah) {
        Data.createdByDaerah = daerah;
      }
      data = await Event.create(Data);
      logger.info(
        `[adminAPI/DataCenter] ${user_name} created ${type} - ${Data.kodProgram}`
      );
      break;
    case 'maklumat-asas-daerah':
      data = await MaklumatAsasDaerah.create(Data);
      logger.info(
        `[adminAPI/DataCenter] ${user_name} created ${type} for ${Data.createdByDaerah}`
      );
      break;
    case 'program-gtod':
      console.log(Data);
      data = await AgensiLuar.create(Data);
      logger.info(
        `[adminAPI/DataCenter] ${user_name} created ${type} - ${Data.createdByDaerah}`
      );
      break;
    case 'program-wargaemas':
      data = await AgensiLuar.create(Data);
      logger.info(
        `[adminAPI/DataCenter] ${user_name} created ${type} - ${Data.createdByDaerah}`
      );
      break;
    default:
      console.log('default');
      break;
  }

  res.status(200).json(data);
};

const postRouteKp = async (req, res) => {
  const authKey = req.headers.authorization;
  const { FType, Data } = req.body;
  const { kp, daerah, negeri, kodFasiliti } = jwt.verify(
    authKey,
    process.env.JWT_SECRET
  );
  const type = Dictionary[FType];
  logger.info(
    `[adminAPI/postRouteKp] kpUser attempting to create ${type} data`
  );

  let data, exists;

  switch (type) {
    case 'program':
      Data = {
        ...Data,
        createdByKp: kp,
        createdByKodFasiliti: kodFasiliti,
        createdByDaerah: daerah,
        createdByNegeri: negeri,
      };
      data = await Event.create(Data);
      logger.info(`[adminAPI/KpCenter] ${kp} created ${type} - ${data.nama}`);
      break;
    case 'sosmed':
      exists = await Sosmed.find({
        belongsTo: kp,
        kodProgram: Data.kodProgram,
      });
      if (exists.length === 0) {
        delete Data.data[0].kodProgram;
        Data.data[0] = {
          id: 1,
          ...Data.data[0],
        };
        data = await Sosmed.create(Data);
        logger.info(
          `[adminAPI/KpCenter] ${kp} created ${type} - ${data.kodProgram}`
        );
      } else {
        delete Data.data[0].kodProgram;
        const lastData = previousData[0].data.length;
        const lastIdofData = previousData[0].data[lastData - 1].id;
        Data.data[0] = {
          id: lastIdofData + 1,
          ...Data.data[0],
        };
        data = await Sosmed.findOneAndUpdate(
          { kodProgram: Data.kodProgram, belongsTo: kp },
          { $push: { data: Data.data[0] } },
          { new: true }
        );
        logger.info(
          `[adminAPI/KpCenter] ${kp} updated one activity ${type} - ${data.kodProgram}`
        );
      }
      break;
    case 'followers':
      data = await Followers.create(Data);
      logger.info(
        `[adminAPI/KpCenter] ${kp} created ${type} - ${data.namaPlatform}`
      );
      break;
    default:
      console.log('default');
      break;
  }

  res.status(200).json(data);
};

const patchRoute = async (req, res) => {
  const authKey = req.headers.authorization;
  const { FType, Id, Data } = req.body;
  const { user_name } = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  const type = Dictionary[FType];
  logger.info(
    `[adminAPI/patchRoute] ${user_name} attempting to update ${type} data with id ${Id}`
  );

  let data;

  switch (type) {
    case 'pegawai':
    case 'juruterapi pergigian':
      data = await Operator.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      ).select('-summary');
      logger.info(
        `[adminAPI/DataCenter] ${user_name} updated ${type} - ${Data.nama}`
      );
      break;
    case 'program':
      data = await Event.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
      logger.info(
        `[adminAPI/DataCenter] ${user_name} updated ${type} - ${Data.kodProgram}`
      );
      break;
    case 'maklumat-asas-daerah':
      data = await MaklumatAsasDaerah.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
      logger.info(`[adminAPI/DataCenter] ${user_name} updated ${type}`);
      break;
    case 'program-gtod':
      data = await AgensiLuar.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
      logger.info(`[adminAPI/DataCenter] ${user_name} updated ${type}`);
      break;
    case 'program-wargaemas':
      data = await AgensiLuar.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
    default:
      data = await User.findByIdAndUpdate(
        { _id: Id },
        { $set: Data },
        { new: true }
      );
      logger.info(
        `[adminAPI/DataCenter] ${user_name} updated ${type} - ${Data.kp}`
      );
      break;
  }

  res.status(200).json(data);
};

const patchRouteKp = async (req, res) => {
  const authKey = req.headers.authorization;
  const { FType, Id, Data } = req.body;
  const { kp } = jwt.verify(authKey, process.env.JWT_SECRET);
  const type = Dictionary[FType];
  logger.info(
    `[adminAPI/patchRouteKp] kpUser attempting to update ${type} data with id ${Id}`
  );

  let data;

  switch (type) {
    case 'program':
      data = await Event.findByIdAndUpdate(Id, Data, { new: true });
      logger.info(
        `[adminAPI/patchRouteKp] ${kp} updated ${type} - ${data.nama}`
      );
      break;
    case 'jp':
    case 'pp':
      data = await Operator.findByIdAndUpdate(Id, Data, {
        new: true,
        select: '-summary',
      });
      logger.info(
        `[adminAPI/patchRouteKp] ${kp} updated CSCSP ${type} - ${data.nama}`
      );
      break;
    case 'tastad':
      data = await Fasiliti.findByIdAndUpdate(Id, Data, {
        new: true,
      });
      logger.info(
        `[adminAPI/patchRouteKp] ${kp} updated enrolmen ${type} - ${data.nama}`
      );
      break;
    case 'mpb':
    case 'kpb':
      data = await Fasiliti.findByIdAndUpdate(
        Id,
        { $push: { penggunaanKPBMPB: Data } },
        { new: true }
      );
      logger.info(
        `[adminAPI/patchRouteKp] ${kp} updated penggunaan ${type} - ${data.nama}`
      );
      break;
    default:
      console.log('nope');
      break;
  }

  res.status(200).json(data);
};

const deleteRoute = async (req, res) => {
  const authKey = req.headers.authorization;
  const { FType, Id } = req.query;
  const { daerah, negeri, user_name } = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  const type = Dictionary[FType];
  logger.info(
    `[adminAPI/deleteRoute] ${user_name} attempting to delete ${type} data with id ${Id}`
  );

  let data, exists;

  switch (type) {
    case 'pegawai':
    case 'juruterapi pergigian':
      data = await Operator.findById({ _id: Id }).select('-summary');
      data.activationStatus = false;
      data.tempatBertugasSebelumIni.push(data.kpSkrg);
      await data.save();
      logger.info(
        `[adminAPI/deleteRoute] ${user_name} deactivated ${type} - ${data.nama}`
      );
      break;
    case 'klinik':
      const klinik = await User.findOne({ _id: Id });
      const fasilitiUnderKlinik = await Fasiliti.find({
        handler: klinik.kp,
        kodFasilitiHandler: klinik.kodFasiliti,
      });
      const operatorUnderKlinik = await Operator.find({
        kpSkrg: klinik.kp,
        kodFasiliti: klinik.kodFasiliti,
        activationStatus: true,
      }).select('-summary');
      if (fasilitiUnderKlinik.length > 0 || operatorUnderKlinik.length > 0) {
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
      data = await User.findByIdAndDelete({ _id: Id }).then(async () => {
        const negeriNum = emailGen[data.negeri].kodNegeri;
        const daerahNum = emailGen[data.negeri].daerah[klinik.daerah];
        await User.findOneAndDelete({
          username: `daftar${acronym.toLowerCase()}${negeriNum}${daerahNum}${
            data.kodFasiliti
          }`,
        });
      });
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
      logger.info(
        `[adminAPI/DataCenter] ${user_name} deleted ${type} - ${data.kp}`
      );
      break;
    case 'program':
      data = await Event.findOne({ _id: Id });
      exists = await Umum.find({
        jenisProgram: program.jenisEvent,
        namaProgram: program.nama,
        createdByKodFasiliti: program.createdByKodFasiliti,
        tahunDaftar: program.tahunDibuat,
        deleted: false,
      });
      if (exists.length > 0) {
        return res.status(409).json({
          msg: `Program tidak boleh dihapus kerana ada pesakit yang didaftarkan. Jumlah pesakit: ${exists.length}`,
        });
      }
      data = await Event.findByIdAndDelete({ _id: Id });
      logger.info(
        `[adminAPI/DataCenter] ${user_name} deleted ${type} - ${data.nama}`
      );
      break;
    case 'sosmed':
      let owner = '';
      if (daerah === '-') {
        owner = negeri;
      }
      if (daerah !== '-') {
        owner = daerah;
      }
      const checkSosmed = await Sosmed.findOne({
        kodProgram: Id.kodProgram,
      });
      if (checkSosmed.data.length < 2) {
        data = await Sosmed.findOneAndDelete({
          kodProgram: Id.kodProgram,
          belongsTo: owner,
        });
        logger.info(
          `[adminAPI/deleteRoute] ${user_name} deleted ${type} - ${data.kodProgram}`
        );
      } else {
        data = await Sosmed.findOneAndUpdate(
          { kodProgram: Id.kodProgram, belongsTo: owner },
          { $pull: { data: { id: Id.id } } },
          { new: true }
        );
        logger.info(
          `[adminAPI/deleteRoute] ${user_name} deleted one activity ${type} - ${data.kodProgram}`
        );
      }
      break;
    default:
      data = await Fasiliti.findByIdAndDelete({ _id: Id });
      logger.info(
        `[adminAPI/DataCenter] ${user_name} deleted ${type} - ${data.nama}`
      );
      break;
  }

  res.status(200).json(data);
};

const deleteRouteKp = async (req, res) => {
  const authKey = req.headers.authorization;
  const { FType, Id } = req.body;
  const { kp } = jwt.verify(authKey, process.env.JWT_SECRET);
  const type = Dictionary[FType];

  let data;

  switch (type) {
    case 'program':
      const program = await Event.findOne({ _id: Id });
      const exists = await Umum.find({
        jenisProgram: program.jenisEvent,
        namaProgram: program.nama,
        createdByKodFasiliti: program.createdByKodFasiliti,
        tahunDaftar: program.tahunDibuat,
        deleted: false,
      });
      if (exists.length > 0) {
        return res.status(409).json({
          msg: `Program tidak boleh dihapus kerana ada pesakit yang didaftarkan. Jumlah pesakit: ${exists.length}`,
        });
      }
      data = await Event.findByIdAndDelete({ _id: Id });
      logger.info(
        `[adminAPI/deleteKpRoute] ${kp} deleted ${type} - ${data.nama}`
      );
      break;
    case 'sosmed':
      const checkSosmed = await Sosmed.findOne({
        kodProgram: Id.kodProgram,
      });
      if (checkSosmed.data.length < 2) {
        data = await Sosmed.findOneAndDelete({
          kodProgram: Id.kodProgram,
          belongsTo: kp,
        });
        logger.info(
          `[adminAPI/deleteKpRoute] ${kp} deleted ${type} - ${data.kodProgram}`
        );
      } else {
        data = await Sosmed.findOneAndUpdate(
          { kodProgram: Id.kodProgram, belongsTo: kp },
          { $pull: { data: { id: Id.id } } },
          { new: true }
        );
        logger.info(
          `[adminAPI/deleteKpRoute] ${kp} deleted one activity ${type} - ${data.kodProgram}`
        );
      }
      break;
    default:
      console.log('nope');
      break;
  }

  res.status(200).json(data);
};

const getData = async (req, res) => {
  let { main, Fn, token, FType, Id } = req.body;
  let { Data } = req.body;
  const theType = Dictionary[FType];
  switch (main) {
    case 'DataCenter':
      const currentUser = await Superadmin.findById(
        jwt.verify(token, process.env.JWT_SECRET).userId
      );
      var { daerah, negeri } = currentUser.getProfile();
      switch (Fn) {
        case 'create':
          logger.info(
            `[adminAPI/DataCenter] ${currentUser.user_name} using create`
          );
          if (
            theType !== 'pegawai' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'klinik' &&
            theType !== 'taska' &&
            theType !== 'tadika' &&
            theType !== 'sekolah-rendah' &&
            theType !== 'sekolah-menengah' &&
            theType !== 'program' &&
            theType !== 'kp-bergerak' &&
            theType !== 'makmal-pergigian' &&
            theType !== 'sosmed' &&
            theType !== 'followers' &&
            theType !== 'maklumat-asas-daerah' &&
            theType !== 'program-gtod' &&
            theType !== 'program-wargaemas' &&
            theType !== 'gtod-pemeriksaan' &&
            theType !== 'wargaemas-pemeriksaan'
          ) {
            Data = {
              ...Data,
              jenisFasiliti: theType,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            };
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.nama}`
            );
            const data = await Fasiliti.create(Data);
            res.status(200).json(data);
          }
          if (theType === 'pegawai') {
            const exists = await Operator.findOne({
              mdcNumber: Data.mdcNumber,
            }).select('-summary');
            if (exists) {
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
              logger.info(
                `[adminAPI/DataCenter] ${currentUser.user_name} reactivated ${theType} - ${Data.nama}`
              );
              return res.status(200).json(prevOfficer);
            }
            Data = {
              ...Data,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            };
            const data = await Operator.create(Data);
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.nama}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'juruterapi pergigian') {
            const exists = await Operator.findOne({
              mdtbNumber: Data.mdtbNumber,
            }).select('-summary');
            if (exists) {
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
              logger.info(
                `[adminAPI/DataCenter] ${currentUser.user_name} reactivated ${theType} - ${Data.nama}`
              );
              return res.status(200).json(prevOfficer);
            }
            Data = {
              ...Data,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            };
            const data = await Operator.create(Data);
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.nama}`
            );
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
              }
            });
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.kp}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'taska' || theType === 'tadika') {
            const exists = await Fasiliti.findOne({
              kodTastad: Data.kodTastad,
            });
            if (exists) {
              return res.status(409).json({
                message: 'Kod Taska/Tadika ini telah wujud',
              });
            } else {
              Data = {
                ...Data,
                jenisFasiliti: theType,
                createdByDaerah: daerah,
                createdByNegeri: negeri,
              };
              const data = await Fasiliti.create(Data);
              logger.info(
                `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.nama}`
              );
              res.status(200).json(data);
            }
          }
          if (theType === 'sekolah-rendah' || theType === 'sekolah-menengah') {
            Data = {
              ...Data,
              jenisFasiliti: theType,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
              sesiTakwimSekolah: sesiTakwimSekolah(),
            };
            // try {
            //   const agent = new https.Agent({
            //     rejectUnauthorized: false,
            //   });
            //   const { data } = await axios.get(
            //     process.env.MOEIS_INTEGRATION_URL_PELAJAR +
            //       `?inid=${Data.idInstitusi}`,
            //     {
            //       httpsAgent: agent,
            //       headers: {
            //         APIKEY: process.env.MOEIS_APIKEY,
            //       },
            //     }
            //   );
            const dataCreatedSRSM = await Fasiliti.create(Data);
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.nama}`
            );
            // send response registered sekolah first so that client will not wait too long on loading
            res.status(200).json(dataCreatedSRSM);

            // calling insertion function to collection sekolahs
            // insertToSekolah(dataCreatedSRSM, data);
            return;
            // } catch (error) {
            //   return res.status(503).json({ msg: error.message });
            // }
          }
          if (theType === 'program') {
            if (negeri) {
              Data.createdByNegeri = negeri;
            }
            if (daerah) {
              Data.createdByDaerah = daerah;
            }
            const createProgramData = await Event.create(Data);
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.kodProgram}`
            );
            res.status(200).json(createProgramData);
          }
          if (theType === 'kp-bergerak' || theType === 'makmal-pergigian') {
            const exists = await Fasiliti.findOne({
              nama: Data.nama,
              jenisFasiliti: ['kp-bergerak', 'makmal-pergigian'],
            });
            if (exists) {
              return res.status(409).json({
                message: 'No plat KPB/MPB ini telah wujud',
              });
            } else {
              Data = {
                ...Data,
                jenisFasiliti: theType,
                createdByDaerah: daerah,
                createdByNegeri: negeri,
              };
              const data = await Fasiliti.create(Data);
              logger.info(
                `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.nama}`
              );
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
              delete Data.data[0].kodProgram;
              Data.data[0] = {
                id: 1,
                ...Data.data[0],
              };
              const createdSosmed = await Sosmed.create(Data);
              return res.status(200).json(createdSosmed);
            } else {
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
              logger.info(
                `[adminAPI/DataCenter] ${currentUser.user_name} updated ${theType} - ${Data.kodProgram}`
              );
              res.status(200).json(updatedSosmed);
            }
          }
          if (theType === 'followers') {
            const createFollowerData = await Followers.create(Data);
            logger.info(
              `${currentUser.user_name} created ${theType} - ${Data.kodProgram}`
            );
            res.status(200).json(createFollowerData);
          }
          if (theType === 'maklumat-asas-daerah') {
            const createMAD = await MaklumatAsasDaerah.create(Data);
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} for ${Data.createdByDaerah}`
            );
            res.status(200).json(createMAD);
          }
          if (theType === 'program-gtod' || theType === 'program-wargaemas') {
            const createProgramAgensiLuar = await AgensiLuar.create(Data);
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.createdByDaerah}`
            );
            res.status(200).json(createProgramAgensiLuar);
          }
          if (
            theType === 'gtod-pemeriksaan' ||
            theType === 'wargaemas-pemeriksaan'
          ) {
            const createPemeriksaanAgensiLuar =
              await PemeriksaanagensiLuar.create(Data);

            const singleAgensiLuar = await AgensiLuar.findOne({
              _id: Data.Id,
            });
            console.log(singleAgensiLuar);

            const updatePemeriksaanAgensiLuar =
              await AgensiLuar.findByIdAndUpdate(
                { _id: singleAgensiLuar._id },
                {
                  $set: {
                    ...(singleAgensiLuar.visitNumber === 0
                      ? {
                          pemeriksaanAgensiLuar1:
                            createPemeriksaanAgensiLuar._id,
                          visitNumber: 1,
                        }
                      : {}),
                    ...(singleAgensiLuar.visitNumber === 1
                      ? {
                          pemeriksaanAgensiLuar2:
                            createPemeriksaanAgensiLuar._id,
                          visitNumber: 2,
                        }
                      : {}),
                  },
                },
                { new: true }
              );

            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} created ${theType} - ${Data.createdByDaerah}`
            );
            res.status(200).json(updatePemeriksaanAgensiLuar);
          }
          break;
        case 'update':
          logger.info(
            `[adminAPI/DataCenter] ${currentUser.user_name} using update`
          );
          if (
            theType !== 'pegawai' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'klinik' &&
            theType !== 'program' &&
            theType !== 'maklumat-asas-daerah' &&
            theType !== 'program-gtod' &&
            theType !== 'program-wargaemas'
          ) {
            const data = await Fasiliti.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} updated ${theType} - ${Data.nama}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'pegawai' || theType === 'juruterapi pergigian') {
            const data = await Operator.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            ).select('-summary');
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} updated ${theType} - ${Data.nama}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'klinik') {
            const data = await User.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} updated ${theType} - ${Data.kp}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'program') {
            const data = await Event.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} updated ${theType} - ${Data.kodProgram}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'maklumat-asas-daerah') {
            const data = await MaklumatAsasDaerah.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            return res.status(200).json(data);
          }
          if (theType === 'program-gtod' || theType === 'program-wargaemas') {
            const data = await AgensiLuar.findByIdAndUpdate(
              { _id: Id },
              { $set: Data },
              { new: true }
            );
            return res.status(200).json(data);
          }
          break;
        case 'delete':
          logger.info(
            `[adminAPI/DataCenter] ${currentUser.user_name} using DataCenter - delete`
          );
          if (
            theType !== 'pegawai' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'klinik' &&
            theType !== 'program' &&
            theType !== 'sosmed' &&
            theType !== 'followers' &&
            theType !== 'sekolah-rendah' &&
            theType !== 'sekolah-menengah' &&
            theType !== 'program-gtod' &&
            theType !== 'program-wargaemas'
          ) {
            const data = await Fasiliti.findByIdAndDelete({
              _id: Id,
            });
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} deleted ${theType} - ${data.nama}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'pegawai' || theType === 'juruterapi pergigian') {
            const data = await Operator.findById({ _id: Id }).select(
              '-summary'
            );
            data.activationStatus = false;
            data.tempatBertugasSebelumIni.push(data.kpSkrg);
            await data.save();
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} deactivated ${theType} - ${data.nama}`
            );
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
            }).select('-summary');
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
            const data = await User.findByIdAndDelete({
              _id: Id,
            }).then(async () => {
              const negeriNum = emailGen[data.negeri].kodNegeri;
              const daerahNum = emailGen[data.negeri].daerah[klinik.daerah];
              await User.findOneAndDelete({
                username: `daftar${acronym.toLowerCase()}${negeriNum}${daerahNum}${
                  Data.kodFasiliti
                }`,
              });
            });
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
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} deleted ${theType} - ${data.kp}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'sekolah-rendah' || theType === 'sekolah-menengah') {
            const sekolah = await Fasiliti.findOne({ _id: Id });
            console.log(sekolah.kodSekolah);
            const currentPelajar = await Sekolah.find({
              kodSekolah: sekolah.kodSekolah,
              sesiTakwimPelajar: sesiTakwimSekolah(),
            });
            for (let i = 0; i < currentPelajar.length; i++) {
              if (currentPelajar[i].pemeriksaanSekolah) {
                return res.status(409).json({
                  msg: 'Sekolah tidak boleh dihapus kerana ada murid yang telah diisi reten. Sila hubungi Meja Bantuan untuk pertanyaan lanjut',
                });
              }
            }
            const data = await Fasiliti.findByIdAndDelete({
              _id: Id,
            });
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} deleted ${theType} - ${data.nama}`
            );
            return res.status(200).json(data);
            // we are here
          }
          if (theType === 'program') {
            const program = await Event.findOne({ _id: Id });
            const exists = await Umum.find({
              jenisProgram: program.jenisEvent,
              namaProgram: program.nama,
              createdByKodFasiliti: program.createdByKodFasiliti,
              tahunDaftar: program.tahunDibuat,
              deleted: false,
            });
            if (exists.length > 0) {
              return res.status(409).json({
                msg: `Program tidak boleh dihapus kerana ada pesakit yang didaftarkan. Jumlah pesakit: ${exists.length}`,
              });
            }
            const data = await Event.findByIdAndDelete({ _id: Id });
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} deleted ${theType} - ${data.nama}`
            );
            return res.status(200).json(data);
          }
          if (theType === 'sosmed') {
            let owner = '';
            if (daerah === '-') {
              owner = negeri;
            }
            if (daerah !== '-') {
              owner = daerah;
            }
            const checkSosmed = await Sosmed.findOne({
              kodProgram: Id.kodProgram,
            });
            if (checkSosmed.data.length < 2) {
              const deletedSosmed = await Sosmed.findOneAndDelete({
                kodProgram: Id.kodProgram,
                belongsTo: owner,
              });
              logger.info(
                `[adminAPI/DataCenter] ${currentUser.user_name} deleted ${theType} - ${deletedSosmed.kodProgram}`
              );
              return res.status(200).json(deletedSosmed);
            } else {
              const deletedSosmed = await Sosmed.findOneAndUpdate(
                { kodProgram: Id.kodProgram, belongsTo: owner },
                { $pull: { data: { id: Id.id } } },
                { new: true }
              );
              logger.info(
                `[adminAPI/DataCenter] ${currentUser.user_name} deleted one activity ${theType} - ${deletedSosmed.kodProgram}`
              );
              res.status(200).json(deletedSosmed);
            }
          }
          if (theType === 'program-gtod' || theType === 'program-wargaemas') {
            const data = await AgensiLuar.findByIdAndDelete({
              _id: Id,
            });
            if (!data) {
              return res.status(404).json({ msg: 'Data not found' });
            }
            logger.info(
              `[adminAPI/DataCenter] ${currentUser.user_name} deleted ${theType} - ${data.nama}`
            );
            return res.status(200).json(data);
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
      switch (Fn) {
        case 'create':
          logger.info(`[adminAPI/KpCenter] ${kp} using create`);
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
              logger.info(
                `[adminAPI/KpCenter] ${kp} created ${theType} - ${createdEvent.nama}`
              );
              res.status(200).json(createdEvent);
              break;
            case 'sosmed':
              const previousData = await Sosmed.find({
                belongsTo: kp,
                kodProgram: Data.kodProgram,
              });
              if (previousData.length === 0) {
                delete Data.data[0].kodProgram;
                Data.data[0] = {
                  id: 1,
                  ...Data.data[0],
                };
                const createdSosmed = await Sosmed.create(Data);
                logger.info(
                  `[adminAPI/KpCenter] ${kp} created ${theType} - ${createdSosmed.kodProgram}`
                );
                return res.status(200).json(createdSosmed);
              } else {
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
                logger.info(
                  `[adminAPI/KpCenter] ${kp} updated one activity ${theType} - ${updatedSosmed.kodProgram}`
                );
                res.status(200).json(updatedSosmed);
              }
              break;
            case 'followers':
              const createFollowerData = await Followers.create(Data);
              logger.info(
                `[adminAPI/KpCenter] ${kp} created ${theType} - ${createFollowerData.namaPlatform}`
              );
              res.status(200).json(createFollowerData);
              break;
            default:
              console.log('default case for kpcenter');
              break;
          }
          break;
        case 'update':
          logger.info(`[adminAPI/KpCenter] ${kp} using update`);
          switch (FType) {
            case 'program':
              const updateEvent = await Event.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              logger.info(
                `[adminAPI/KpCenter] ${kp} updated ${theType} - ${updateEvent.nama}`
              );
              res.status(200).json(updateEvent);
              break;
            case 'jp':
            case 'pp':
              const updatePP = await Operator.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              ).select('-summary');
              logger.info(
                `[adminAPI/KpCenter] ${kp} updated CSCSP ${theType} - ${updatePP.nama}`
              );
              res.status(200).json(updatePP);
              break;
            case 'tastad':
              const updateTastad = await Fasiliti.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              logger.info(
                `[adminAPI/KpCenter] ${kp} updated enrolmen ${theType} - ${updateTastad.nama}`
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
              logger.info(
                `[adminAPI/KpCenter] ${kp} updated penggunaan ${theType} - ${updateKpb.nama}`
              );
              res.status(200).json(updateKpb);
              break;
            default:
              console.log('default case for update');
              break;
          }
          break;
        case 'delete':
          logger.info(`[adminAPI/KpCenter] ${kp} using delete`);
          switch (FType) {
            case 'program':
              const program = await Event.findOne({ _id: Id });
              const exists = await Umum.find({
                jenisProgram: program.jenisEvent,
                namaProgram: program.nama,
                createdByKodFasiliti: program.createdByKodFasiliti,
                tahunDaftar: program.tahunDibuat,
                deleted: false,
              });
              if (exists.length > 0) {
                return res.status(409).json({
                  msg: `Program tidak boleh dihapus kerana ada pesakit yang didaftarkan. Jumlah pesakit: ${exists.length}`,
                });
              }
              const data = await Event.findByIdAndDelete({ _id: Id });
              logger.info(
                `[adminAPI/KpCenter] ${kp} deleted ${theType} - ${data.nama}`
              );
              res.status(200).json(data);
              break;
            case 'sosmed':
              const checkSosmed = await Sosmed.findOne({
                kodProgram: Id.kodProgram,
              });
              if (checkSosmed.data.length < 2) {
                const deletedSosmed = await Sosmed.findOneAndDelete({
                  kodProgram: Id.kodProgram,
                  belongsTo: kp,
                });
                logger.info(
                  `[adminAPI/KpCenter] ${kp} deleted ${theType} - ${deletedSosmed.kodProgram}`
                );
                return res.status(200).json(deletedSosmed);
              } else {
                const deletedSosmed = await Sosmed.findOneAndUpdate(
                  { kodProgram: Id.kodProgram, belongsTo: kp },
                  { $pull: { data: { id: Id.id } } },
                  { new: true }
                );
                logger.info(
                  `[adminAPI/KpCenter] ${kp} deleted one activity ${theType} - ${deletedSosmed.kodProgram}`
                );
                res.status(200).json(deletedSosmed);
              }
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
          logger.info('[adminAPI/SuperadminCenter] - read accessed');
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
          logger.info('[adminAPI/SuperadminCenter] readDaerah accessed');
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
          logger.info('[adminAPI/SuperadminCenter] readKlinik accessed');
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
          logger.info('[adminAPI/UserCenter] create accessed');
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
          break;
        case 'read':
          logger.info(
            `[adminAPI/UserCenter] read accessed to get current logged in user info`
          );
          const userData = await readUserData(token);
          res.status(200).json(userData);
          break;
        case 'readOne':
          logger.info(
            `[adminAPI/UserCenter] ${username} being checked in readOne`
          );
          const tempUser = await Superadmin.findOne({
            user_name: username,
          });
          // if no superadmin
          if (!tempUser) {
            // check kp user
            const tempKpUser = await User.findOne({
              username: username,
            });
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
          res.status(200).json({
            status: 'success',
            email: currentMail,
            totp: false,
          });
          break;
        case 'update':
          logger.info(`[adminAPI/UserCenter] ${username} submitting in update`);
          const adminUser = await Superadmin.findOne({
            user_name: username,
          });
          // if kp
          if (!adminUser) {
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
          res.status(200).json({
            status: 'success',
            adminToken: adminUser.createJWT(),
          });
          break;
        case 'updateOne':
          logger.info(
            `[adminAPI/UserCenter] ${username} updating info in updateOne`
          );
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
      const { id, idd, idn } = req.body;
      switch (Fn) {
        case 'create':
          console.log('create for hq');
          break;
        case 'read':
          const { userId, username, accountType } = jwt.verify(
            token,
            process.env.JWT_SECRET
          );
          logger.info(
            `[adminAPI/HqCenter] (${accountType})/${username} accessed read`
          );
          if (accountType === 'kpUser') {
            return res.status(200).json({
              status: 'success',
              message: 'kpuser',
            });
          }
          let kpSelectionPayload = { accountType: 'kpUser' };
          if (accountType === 'negeriSuperadmin') {
            kpSelectionPayload.negeri = (
              await Superadmin.findById(userId)
            ).negeri;
          }
          if (accountType === 'daerahSuperadmin') {
            const superadmin = await Superadmin.findById(userId);
            kpSelectionPayload = {
              accountType: 'kpUser',
              negeri: superadmin.negeri,
              daerah: superadmin.daerah,
            };
          }
          const kpData = await User.find(kpSelectionPayload);
          const data = kpData.reduce((result, user) => {
            const { negeri, daerah, kp, kodFasiliti } = user;
            const negeriIndex = result.findIndex(
              (item) => item.namaNegeri === negeri
            );
            if (negeriIndex === -1) {
              result.push({
                namaNegeri: negeri,
                daerah: [
                  {
                    namaDaerah: daerah,
                    klinik: [
                      {
                        namaKlinik: kp,
                        kodFasiliti,
                      },
                    ],
                  },
                ],
              });
            } else {
              const daerahIndex = result[negeriIndex].daerah.findIndex(
                (item) => item.namaDaerah === daerah
              );
              if (daerahIndex === -1) {
                result[negeriIndex].daerah.push({
                  namaDaerah: daerah,
                  klinik: [
                    {
                      namaKlinik: kp,
                      kodFasiliti,
                    },
                  ],
                });
              } else {
                result[negeriIndex].daerah[daerahIndex].klinik.push({
                  namaKlinik: kp,
                  kodFasiliti,
                });
              }
            }
            return result;
          }, []);
          data.forEach((negeri) => {
            negeri.daerah.forEach((daerah) => {
              daerah.klinik.sort((a, b) =>
                a.namaKlinik.localeCompare(b.namaKlinik)
              );
            });
            negeri.daerah.sort((a, b) =>
              a.namaDaerah.localeCompare(b.namaDaerah)
            );
          });
          return res.status(200).json(data);
        case 'readOne':
          //
          const queryObj = {
            tarikhKedatangan: {
              $lte: moment().format('YYYY-MM-DD'),
              $gte: moment().subtract(4, 'days').format('YYYY-MM-DD'),
            },
          };
          if (id) queryObj.createdByKodFasiliti = id;
          if (idn && !idd) queryObj.createdByNegeri = idn;
          if (idn && idd) {
            queryObj.createdByNegeri = idn;
            queryObj.createdByDaerah = idd;
          }
          //
          logger.info(
            `[adminAPI/HqCenter] readOne for ${id || idd || idn} accessed`
          );
          const ptData = await Umum.find(queryObj)
            .lean()
            .select('kedatangan tarikhKedatangan');
          const countPtByDate = (daysAgo) => {
            const date = moment()
              .subtract(daysAgo, 'days')
              .format('YYYY-MM-DD');
            return ptData.filter((item) => item.tarikhKedatangan === date)
              .length;
          };
          const ptHariIni = countPtByDate(0);
          const pt2HariLepas = countPtByDate(1);
          const pt3HariLepas = countPtByDate(2);
          const pt4HariLepas = countPtByDate(3);
          const pt5HariLepas = countPtByDate(4);
          const ptMingguIni = ptData.filter((item) =>
            moment(item.tarikhKedatangan).isBetween(
              moment().startOf('week'),
              moment().endOf('week')
            )
          ).length;
          const ptBulanIni = ptData.filter((item) =>
            moment(item.tarikhKedatangan).isBetween(
              moment().startOf('month'),
              moment().endOf('month')
            )
          ).length;
          const ptBaru = ptData.filter(
            (item) => item.kedatangan === 'baru-kedatangan'
          ).length;
          const ptUlangan = ptData.filter(
            (item) => item.kedatangan === 'ulangan-kedatangan'
          ).length;
          const kedatanganPt = [
            {
              kedatangan: pt5HariLepas,
              tarikh: moment().subtract(4, 'days').format('YYYY-MM-DD'),
            },
            {
              kedatangan: pt4HariLepas,
              tarikh: moment().subtract(3, 'days').format('YYYY-MM-DD'),
            },
            {
              kedatangan: pt3HariLepas,
              tarikh: moment().subtract(2, 'days').format('YYYY-MM-DD'),
            },
            {
              kedatangan: pt2HariLepas,
              tarikh: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            },
            {
              kedatangan: ptHariIni,
              tarikh: moment().format('YYYY-MM-DD'),
            },
          ];
          const jumlahPt = ptData.length;
          const result = {
            nama: '',
            jumlahPt,
            ptHariIni,
            ptMingguIni,
            ptBulanIni,
            ptBaru,
            ptUlangan,
            kedatanganPt,
          };
          if (id) {
            const { kp } = await User.findOne({ kodFasiliti: id })
              .select('kp')
              .lean();
            result.nama = kp;
          }
          if (idn && !idd) {
            result.nama = idn;
          }
          if (idn && idd) {
            result.nama = idd;
          }
          return res.status(200).json(result);
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
          const { userId, username } = jwt.verify(
            userToken,
            process.env.JWT_SECRET
          );
          logger.info(
            `[adminAPI/TotpManager] created totptoken for ${username} because accessing settings`
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
          logger.info(`[adminAPI/TotpManager] read totptoken for validation`);
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
          logger.info(`[adminAPI/TotpManager] update totptoken for validation`);
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
          const { image, type } = req.body;
          // const base64 = await resizeProfileImage(image, type);
          // if (base64 !== 'err') {
          //   return res.status(200).json({
          //     msg: 'success',
          //     imgSrc: base64,
          //   });
          // } else {
          return res.status(400).json({
            msg: 'error',
          });
          // }
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

const getStatisticsData = async (req, res) => {
  // 1st phase
  const authKey = req.headers.authorization;
  const currentUser = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  let negeri, daerah;
  const userData = currentUser.getProfile();
  if (userData.negeri === '-') {
    negeri = req.query.negeri;
    daerah = req.query.daerah;
  } else {
    negeri = userData.negeri;
    daerah = userData.daerah;
  }
  // 2nd phase
  let data;
  if (negeri && daerah) {
    // data = await User.find({ negeri: negeri, daerah: daerah }).distinct('kp');
    data = await Umum.find({
      createdByNegeri: negeri,
      createdByDaerah: daerah,
    })
      .select(
        'kedatangan jantina kumpulanEtnik umur tarikhKedatangan createdByKodFasiliti'
      )
      .lean();
  } else if (negeri && !daerah) {
    // data = await User.find({ negeri: negeri }).distinct('daerah');
    data = await Umum.find({ createdByNegeri: negeri })
      .select(
        'kedatangan jantina kumpulanEtnik umur tarikhKedatangan createdByKodFasiliti'
      )
      .lean();
  }
  // 3rd phase
  res.status(200).json(data);
};

const sendVerificationEmail = async (userId) => {
  const mailOptions = (admin, key) => {
    if (admin.e_mail) {
      return {
        from: process.env.EMAILER_ACCT,
        to: admin.e_mail,
        subject: 'Kunci Verifikasi Anda',
        html: otpForLogin(admin.nama, key),
      };
    } else {
      return {
        from: process.env.EMAILER_ACCT,
        to: admin.email,
        subject: 'Kunci Verifikasi Anda',
        html: otpForLogin(admin.nama, key),
      };
    }
  };
  const key = generateRandomString(8);
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
    ).select('-summary');
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

// const resizeProfileImage = async (file, type) => {
//   const tempFileBuffer = Buffer.from(file, 'base64');
//   const tempFileType = type.split('/')[1];
//   const name = generateRandomString(10) + '.' + tempFileType;
//   fs.writeFileSync(
//     path.resolve(process.cwd(), `./public/${name}`),
//     tempFileBuffer
//   );
//   try {
//     const resizedImage = await sharp(
//       path.resolve(process.cwd(), `./public/${name}`)
//     )
//       .resize(120, 120)
//       .sharpen()
//       .toBuffer();
//     const dataImagePrefix = `data:image/${tempFileType};base64,`;
//     const base64 = `${dataImagePrefix}${resizedImage.toString('base64')}`;
//     fs.unlinkSync(path.resolve(process.cwd(), `./public/${name}`));
//     return base64;
//   } catch (err) {
//     console.log(err);
//     return 'err';
//   }
// };

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

const processFasilitiQuery = async (req, res) => {
  const { negeri, daerah } = req.query;
  if (!negeri || !daerah) {
    return res.status(400).json({ message: 'Invalid query' });
  }
  const { data: allMatchingFS } = await axios.get(
    `https://gpass.nocturnal.quest/api/getfs?negeri=${negeri}&daerah=${daerah}`
  );
  let kodFasiliti = await User.find({
    accountType: 'kpUser',
    negeri,
    daerah,
  }).select('kodFasiliti');
  kodFasiliti = kodFasiliti.map((kod) => kod.kodFasiliti);
  const filteredFS = allMatchingFS.filter(
    (item) => !kodFasiliti.includes(item.kodFasilitiGiret)
  );
  if (filteredFS.length === 0) {
    return res.status(404).json({ message: 'No data found' });
  }
  res.status(200).json(filteredFS);
};

const processOperatorQuery = async (req, res) => {
  const { nama, type } = req.query;
  switch (type) {
    case 'pp':
      const { data: allMatchingPP } = await axios.get(
        `https://gpass.nocturnal.quest/api/getpp?nama=${nama}`
      );
      let mdcNumber = await Operator.find({
        statusPegawai: 'pp',
        activationStatus: true,
      }).select('mdcNumber');
      mdcNumber = mdcNumber.map((mdc) => parseInt(mdc.mdcNumber));
      const filteredPP = allMatchingPP.filter(
        (item) => !mdcNumber.includes(item.mdcNumber)
      );
      if (filteredPP.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }
      res.status(200).json(filteredPP);
      break;
    case 'jp':
      const { data: allMatchingJP } = await axios.get(
        `https://gpass.nocturnal.quest/api/getjp?nama=${nama}`
      );
      let mdtbNumber = await Operator.find({
        statusPegawai: 'jp',
        activationStatus: true,
      }).select('mdtbNumber');
      mdtbNumber = mdtbNumber.map((mdtb) => mdtb.mdtbNumber);
      const filteredJP = allMatchingJP.filter(
        (item) => !mdtbNumber.includes(item.mdtbNumber)
      );
      if (filteredJP.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }
      res.status(200).json(filteredJP);
      break;
    default:
      res.status(400).json({ message: 'Invalid query' });
  }
};

const processKkiakdQuery = async (req, res) => {
  const { negeri } = req.query;
  const { data: allMatchingKKIAKD } = await axios.get(
    `https://gpass.nocturnal.quest/api/getkkiakd?negeri=${negeri}`
  );
  let kodFasiliti = await Fasiliti.find({
    createdByNegeri: negeri,
    jenisFasiliti: 'kkiakd',
  }).select('kodKkiaKd');
  kodFasiliti = kodFasiliti.map((kod) => kod.kodKkiaKd);
  const filteredKKIAKD = allMatchingKKIAKD.filter(
    (item) => !kodFasiliti.includes(item.kodFasiliti)
  );
  if (filteredKKIAKD.length === 0) {
    return res.status(404).json({ message: 'No data found' });
  }
  res.status(200).json(filteredKKIAKD);
};

// for MOEIS integration
const convertToJPNKod = {
  Johor: 'JPA1001',
  Kedah: 'KPA2001',
  Kelantan: 'DPA1001',
  Melaka: 'MPA2001',
  'Negeri Sembilan': 'NPA4001',
  Pahang: 'CPA4001',
  'Pulau Pinang': 'PPA0170',
  Perak: 'APA2242',
  Perlis: 'RPA0001',
  Selangor: 'BPA8002',
  Terengganu: 'TPA3001',
  Sabah: 'XPA4001',
  Sarawak: 'YPA1201',
  'WP Kuala Lumpur': 'WPA0002',
  'WP Labuan': 'WPA1001',
  'WP Putrajaya': 'WPA2001',
};

const jnskodPRA = [
  // for pra ada 10
  10, 19, 105, 108, 24, 102, 106, 417, 412, 212,
];

const jnskodSR = [
  // for sr ada 20
  10, 12, 19, 101, 103, 104, 105, 107, 108, 207, 208, 24, 414, 416, 102, 106,
  417, 412, 212, 418,
];

const jnskodSM = [
  // for sm ada 21
  11, 13, 19, 403, 107, 108, 201, 203, 204, 205, 206, 207, 208, 209, 210, 25,
  415, 416, 417, 413, 419,
];

const processSekolahQuery = async (req, res) => {
  const authKey = req.headers.authorization;
  const { FType } = req.query;
  const { negeri, user_name } = await Superadmin.findById(
    jwt.verify(authKey, process.env.JWT_SECRET).userId
  );
  const type = Dictionary[FType];
  const JPNKod = convertToJPNKod[negeri];
  logger.info(
    `[adminAPI/processSekolahQuery] ${user_name} requested ${type} data`
  );
  // if (
  //   process.env.BUILD_ENV === 'production' ||
  //   process.env.BUILD_ENV === 'dev'
  // ) {
  //   if (type === 'sekolah-rendah') {
  //     let SENARAI_INSTITUSI = [];

  //     for (let i = 0; i < jnskodSR.length; i++) {
  //       const URLquerySR =
  //         process.env.MOEIS_INTEGRATION_URL_SEKOLAH +
  //         `?jkod=${JPNKod}&jnskod=${jnskodSR[i]}`;
  //       console.log(URLquerySR);
  //       try {
  //         const agent = new https.Agent({
  //           rejectUnauthorized: false,
  //         });
  //         const { data } = await axios.get(URLquerySR, {
  //           httpsAgent: agent,
  //           headers: {
  //             APIKEY: process.env.MOEIS_APIKEY,
  //           },
  //         });
  //         SENARAI_INSTITUSI = [...SENARAI_INSTITUSI, ...data.SENARAI_INSTITUSI];
  //       } catch (error) {
  //         return res.status(503).json({ msg: error.message });
  //       }
  //     }
  //     const queryResultSR = { SENARAI_INSTITUSI };

  //     const currentSRSM = await Fasiliti.find({
  //       jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
  //       createdByNegeri: negeri,
  //       idInstitusi: { $ne: null },
  //       sesiTakwimSekolah: sesiTakwimSekolah(),
  //     });
  //     const idInstitusi = currentSRSM.map((srsm) => srsm.idInstitusi);

  //     const filteredResultSR = {
  //       SENARAI_INSTITUSI: queryResultSR.SENARAI_INSTITUSI.filter(
  //         (srsm) => !idInstitusi.includes(srsm.ID_INSTITUSI)
  //       ),
  //     };

  //     return res.status(200).json(filteredResultSR);
  //   }
  //   if (type === 'sekolah-menengah') {
  //     let SENARAI_INSTITUSI = [];

  //     for (let i = 0; i < jnskodSR.length; i++) {
  //       const URLquerySM =
  //         process.env.MOEIS_INTEGRATION_URL_SEKOLAH +
  //         `?jkod=${JPNKod}&jnskod=${jnskodSM[i]}`;
  //       console.log(URLquerySM);
  //       try {
  //         const agent = new https.Agent({
  //           rejectUnauthorized: false,
  //         });
  //         const { data } = await axios.get(URLquerySM, {
  //           httpsAgent: agent,
  //           headers: {
  //             APIKEY: process.env.MOEIS_APIKEY,
  //           },
  //         });
  //         SENARAI_INSTITUSI = [...SENARAI_INSTITUSI, ...data.SENARAI_INSTITUSI];
  //       } catch (error) {
  //         return res.status(503).json({ msg: error.message });
  //       }
  //     }
  //     const queryResultSM = { SENARAI_INSTITUSI };

  //     const currentSRSM = await Fasiliti.find({
  //       jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
  //       createdByNegeri: negeri,
  //       idInstitusi: { $ne: null },
  //       sesiTakwimSekolah: sesiTakwimSekolah(),
  //     });
  //     const idInstitusi = currentSRSM.map((srsm) => srsm.idInstitusi);

  //     const filteredResultSM = {
  //       SENARAI_INSTITUSI: queryResultSM.SENARAI_INSTITUSI.filter(
  //         (srsm) => !idInstitusi.includes(srsm.ID_INSTITUSI)
  //       ),
  //     };

  //     return res.status(200).json(filteredResultSM);
  //   }
  // }
  // if (
  //   process.env.BUILD_ENV === 'training' ||
  //   process.env.BUILD_ENV === 'unstable'
  // ) {
  const URLquery =
    process.env.MOEIS_INTEGRATION_URL_SEKOLAH + `?jkod=${JPNKod}`;
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(URLquery, {
      httpsAgent: agent,
      headers: {
        APIKEY: process.env.MOEIS_APIKEY_MOCKER,
      },
    });

    const currentSRSM = await Fasiliti.find({
      jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      createdByNegeri: negeri,
      idInstitusi: { $ne: null },
      sesiTakwimSekolah: sesiTakwimSekolah(),
    });
    const idInstitusi = currentSRSM.map((srsm) => srsm.idInstitusi);

    const filteredResultSRSM = {
      SENARAI_INSTITUSI: data.SENARAI_INSTITUSI.filter(
        (srsm) => !idInstitusi.includes(srsm.ID_INSTITUSI)
      ),
    };

    return res.status(200).json(filteredResultSRSM);
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
  // }
};

const otpForLogin = (nama, key) =>
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
  initialDataNegeri,
  initialDataDaerah,
  initialDataKlinik,
  initialDataAdmins,
  checkUser,
  loginUser,
  readUserData,
  getData,
  getDataRoute,
  getDataKpRoute,
  getOneDataRoute,
  getOneDataKpRoute,
  postRoute,
  postRouteKp,
  patchRoute,
  patchRouteKp,
  deleteRoute,
  deleteRouteKp,
  getStatisticsData,
  processFasilitiQuery,
  processOperatorQuery,
  processKkiakdQuery,
  processSekolahQuery,
};

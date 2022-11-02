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
const emailGen = require('../lib/emailgen');

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
  event: 'event',
};

const transporter = mailer.createTransport({
  host: process.env.EMAILER_HOST,
  port: process.env.EMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAILER_ACCT,
    pass: process.env.EMAILER_PASS,
  },
});

exports.getData = async (req, res, next) => {
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'This is the only way. Proceed carefully',
    });
  }
  if (req.method === 'POST') {
    const { main, Fn, token } = req.body;
    switch (main) {
      case 'DataCenter':
        var { FType, Data, Id } = req.body;
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
              theType !== 'juruterapi pergigian' &&
              theType !== 'event'
            ) {
              Data = {
                ...Data,
                jenisFasiliti: theType,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              };
              const data = await Fasiliti.create(Data);
              return res.status(200).json(data);
            }
            if (theType === 'event') {
              Data = {
                ...Data,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              };
              const data = await Event.create(Data);
              return res.status(200).json(data);
            }
            if (theType === 'pegawai' || theType === 'juruterapi pergigian') {
              Data = {
                ...Data,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              };
              const data = await Operator.create(Data);
              return res.status(200).json(data);
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
                const negeriNum = emailGen[dataGeografik.negeri].kodNegeri;
                const daerahNum =
                  emailGen[dataGeografik.negeri].daerah[dataGeografik.daerah];
                const tempKaunter = await User.create({
                  username: `daftar${acronym.toLowerCase()}${negeriNum}${daerahNum}`,
                  negeri: Data.negeri,
                  daerah: Data.daerah,
                  kp: Data.kp,
                  accountType: 'kaunterUser',
                  password: 'temporary',
                });
                console.log('tempKaunter:', tempKaunter);
              });
              return res.status(200).json(data);
            }
            break;
          case 'read':
            console.log('read for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik' &&
              theType !== 'event'
            ) {
              const data = await Fasiliti.find({
                jenisFasiliti: theType,
                createdByDaerah: dataGeografik.daerah,
                createdByNegeri: dataGeografik.negeri,
              });
              return res.status(200).json(data);
            }
            if (theType === 'event') {
              const data = await Event.find({
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
              return res.status(200).json(data);
            }
            if (theType === 'klinik') {
              const data = await User.find({
                negeri: dataGeografik.negeri,
                daerah: dataGeografik.daerah,
                statusRoleKlinik: ['klinik', 'kepp', 'utc', 'rtc', 'visiting'],
              });
              const kaunterAcct = await User.find({
                negeri: dataGeografik.negeri,
                daerah: dataGeografik.daerah,
                accountType: 'kaunterUser',
              });
              for (const i in data) {
                for (const j in kaunterAcct) {
                  if (data[i].kp === kaunterAcct[j].kp) {
                    data[i] = {
                      ...data[i]._doc,
                      kaunterUsername: kaunterAcct[j].username,
                      kaunterPassword: kaunterAcct[j].password,
                    };
                  }
                }
              }
              return res.status(200).json(data);
            }
            break;
          case 'readOne':
            console.log('readOne for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik' &&
              theType !== 'event'
            ) {
              const data = await Fasiliti.findById({
                _id: Id,
              });
              return res.status(200).json(data);
            }
            if (theType === 'event') {
              const data = await Event.findById({
                _id: Id,
              });
              return res.status(200).json(data);
            }
            if (theType === 'pegawai' || theType === 'juruterapi pergigian') {
              const data = await Operator.findById({
                _id: Id,
              });
              return res.status(200).json(data);
            }
            if (theType === 'klinik') {
              const data = await User.findById({
                _id: Id,
              });
              return res.status(200).json(data);
            }
            break;
          case 'update':
            console.log('update for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik' &&
              theType !== 'event'
            ) {
              const data = await Fasiliti.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              return res.status(200).json(data);
            }
            if (theType === 'event') {
              const data = await Event.findByIdAndUpdate(
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
            break;
          case 'delete':
            console.log('delete for', theType);
            if (
              theType !== 'pegawai' &&
              theType !== 'juruterapi pergigian' &&
              theType !== 'klinik' &&
              theType !== 'event'
            ) {
              const data = await Fasiliti.findByIdAndDelete({ _id: Id });
              return res.status(200).json(data);
            }
            if (theType === 'event') {
              const data = await Event.findByIdAndDelete({ _id: Id });
              return res.status(200).json(data);
            }
            if (theType === 'pegawai' || theType === 'juruterapi pergigian') {
              const data = await Operator.findByIdAndDelete({ _id: Id });
              return res.status(200).json(data);
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
              // deleting events
              const events = await Event.find({
                createdByKp: data.kp,
                createdByDaerah: data.daerah,
                createdByNegeri: data.negeri,
              }).then(async () => {
                if (events.length > 0) {
                  for (let i = 0; i < events.length; i++) {
                    await Event.findOneAndDelete({
                      nama: events[i].nama,
                    });
                  }
                }
              });
              return res.status(200).json(data);
            }
            break;
          default:
            res.status(200).json({
              message: 'This is the default case for Data Center',
            });
        }
        break;
      case 'UserCenter':
        var { username, password, data } = req.body;
        switch (Fn) {
          case 'create':
            console.log('create for user');
            const { user_name, daerah, negeri, e_mail, accountType } = req.body;
            const regData = await Superadmin.create({
              user_name: user_name,
              daerah: daerah,
              negeri: negeri,
              e_mail: e_mail,
              accountType: accountType,
              totp: false,
            });
            return res.status(200).json(regData);
            break;
          case 'read':
            console.log('read for user');
            const userData = await readUserData(token);
            return res.status(200).json(userData);
            break;
          case 'readOne':
            console.log('readOne for user');
            const tempUser = await Superadmin.findOne({ user_name: username });
            // if no superadmin
            if (!tempUser) {
              // check kp user
              const tempKpUser = await User.findOne({ username: username });
              if (!tempKpUser) {
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
                  message: 'Key salah',
                });
              }
              const generatedToken = await createSuperadminToken(kpUser);
              return res.status(200).json({
                status: 'success',
                adminToken: generatedToken,
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
                  message: 'Key salah',
                });
              }
              const generatedToken = await createSuperadminToken(adminUser);
              return res.status(200).json({
                status: 'success',
                adminToken: generatedToken,
              });
            }
            // using tempKey
            if (password !== adminUser.tempKey) {
              return res.status(401).json({
                status: 'error',
                message: 'Key salah',
              });
            }
            const generatedToken = await createSuperadminToken(adminUser);
            return res.status(200).json({
              status: 'success',
              adminToken: generatedToken,
            });
            break;
          case 'updateOne':
            console.log('updateOne for user');
            const newToken = await updateUserData(token, data);
            return res.status(200).json({
              status: 'success',
              adminToken: newToken,
            });
            break;
          case 'delete':
            console.log('delete for user');
            break;
          default:
            return res.status(200).json({
              message: 'This is the default case for User Center',
            });
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
            const accountType = jwt.verify(
              token,
              process.env.JWT_SECRET
            ).accountType;
            console.log(accountType);
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
                negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
              };
              ptSelectionPayload = {
                jenisFasiliti: 'kp',
                negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
              };
            }
            if (accountType === 'daerahSuperadmin') {
              kpSelectionPayload = {
                accountType: 'kpUser',
                negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
                daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
              };
              ptSelectionPayload = {
                jenisFasiliti: 'kp',
                negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
                daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
              };
            }
            const kpData = await User.find({ ...kpSelectionPayload });
            const ptData = await Umum.find({ ...ptSelectionPayload });
            let data = [];
            const negeris = [...new Set(kpData.map((item) => item.negeri))];
            for (n in negeris) {
              const negeri = negeris[n];
              const negeriData = kpData.filter(
                (item) => item.negeri === negeri
              );
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
              const daerah = [
                ...new Set(negeriData.map((item) => item.daerah)),
              ];
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
                          item.tarikhKedatangan ===
                          moment().format('YYYY-MM-DD')
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
                  klinikDiDaerah.klinik[k].pesakitHariIni =
                    pesakitHariIni.length;
                  klinikDiDaerah.klinik[k].pesakitMingguIni =
                    pesakitMingguIni.length;
                  klinikDiDaerah.klinik[k].pesakitBulanIni =
                    pesakitBulanIni.length;
                  klinikDiDaerah.klinik[k].pesakitBaru = pesakitBaru.length;
                  klinikDiDaerah.klinik[k].pesakitUlangan =
                    pesakitUlangan.length;
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
            const { id, username } = jwt.verify(
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
                userId: id,
                tempSecret,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: '1h',
              }
            );
            return res.status(200).json({
              msg: 'success',
              qrcode: qrCode,
              url: tempSecret.otp_auth_url,
              totpToken,
            });
            break;
          case 'read':
            console.log('read for totp');
            const { totpCode } = req.body;
            const admin = await Superadmin.findById(
              jwt.verify(token, process.env.JWT_SECRET).userId
            );
            const verified = speakeasy.totp.verify({
              secret: admin.base32,
              encoding: 'base32',
              token: totpCode,
            });
            if (verified) {
              return res.status(200).json({
                msg: 'success',
                verified,
              });
            } else {
              return res.status(400).json({
                msg: 'error',
                verified,
              });
            }
            break;
          case 'update':
            const { initialTotpCode, initialTotpToken } = req.body;
            console.log(req.body);
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
              return res.status(200).json({
                msg: 'success',
                initialVerification,
                initialAdmin,
              });
            } else {
              console.log('initial verification failed');
              return res.status(400).json({
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
            const { image } = req.body;
            const buffer = await resizeProfileImage(image);
            return res.status(200).json({
              msg: 'success',
              imgSrc: buffer,
            });
            break;
          case 'read':
            console.log('read for image');
            break;
          default:
            console.log('default for image');
            break;
        }
        break;
      default:
        return res.status(200).json({
          message: 'Provide nothing, get nothing',
        });
        break;
    }
  }
};

exports.getCipher = async (req, res) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(process.env.API_KEY),
    process.env.CRYPTO_JS_SECRET
  ).toString();
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTO_JS_SECRET);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  res.status(200).json({
    status: 'success',
    message: 'Verification route',
    key: ciphertext,
    decryptedKey: decryptedData,
  });
};

async function sendVerificationEmail(userId) {
  const key = generateRandomString(8);
  const emailAdmin = await Superadmin.findByIdAndUpdate(
    userId,
    { tempKey: key },
    { new: true }
  );
  let useEmail = '';
  if (!emailAdmin.e_mail) {
    useEmail = process.env.SEND_TO;
  }
  if (emailAdmin.e_mail) {
    useEmail = emailAdmin.e_mail;
  }
  const mailOptions = {
    from: process.env.EMAILER_ACCT,
    to: useEmail,
    subject: 'Kunci Verifikasi',
    html: html(emailAdmin, key),
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return err;
    }
    return emailAdmin.e_mail;
  });
}

async function readUserData(token) {
  let userData;
  const status = jwt.verify(token, process.env.JWT_SECRET).accountType;
  if (status !== 'kpSuperadmin') {
    userData = {
      userId: jwt.verify(token, process.env.JWT_SECRET).userId,
      username: jwt.verify(token, process.env.JWT_SECRET).username,
      tarikhLahir: jwt.verify(token, process.env.JWT_SECRET).tarikhLahir,
      daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
      negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
      e_mail: jwt.verify(token, process.env.JWT_SECRET).e_mail,
      accountType: jwt.verify(token, process.env.JWT_SECRET).accountType,
      totp: jwt.verify(token, process.env.JWT_SECRET).totp,
      image: jwt.verify(token, process.env.JWT_SECRET).image,
    };
  }
  if (status === 'kpSuperadmin') {
    userData = {
      userId: jwt.verify(token, process.env.JWT_SECRET).userId,
      username: jwt.verify(token, process.env.JWT_SECRET).username,
      kp: jwt.verify(token, process.env.JWT_SECRET).kp,
      daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
      negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
      accountType: jwt.verify(token, process.env.JWT_SECRET).accountType,
    };
  }
  return userData;
}

async function updateUserData(token, data) {
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
  const newToken = createSuperadminToken(updateUserData);
  return newToken;
}

async function createSuperadminToken(userdata) {
  const status = userdata.accountType;
  if (status === 'kpUser') {
    const token = jwt.sign(
      {
        userId: userdata._id,
        username: userdata.username,
        kp: userdata.kp,
        daerah: userdata.daerah,
        negeri: userdata.negeri,
        email: userdata.email,
        accountType: 'kpSuperadmin',
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
    return token;
  }
  if (status !== 'kpUser') {
    const token = jwt.sign(
      {
        userId: userdata._id,
        username: userdata.nama,
        tarikhLahir: userdata.tarikhLahir,
        daerah: userdata.daerah,
        negeri: userdata.negeri,
        e_mail: userdata.e_mail,
        accountType: userdata.accountType,
        totp: userdata.totp,
        image: userdata.image,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
    return token;
  }
}

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

const resizeProfileImage = async (file) => {
  const tempFile = Buffer.from(file, 'base64');
  const name = generateRandomString(10);
  fs.writeFileSync(
    path.resolve(process.cwd(), `./uploads/${name}.png`),
    tempFile
  );
  const resizedImage = await sharp(
    path.resolve(process.cwd(), `./uploads/${name}.png`)
  )
    .resize(80, 80)
    .toBuffer();
  const dataImagePrefix = `data:image/png;base64,`;
  const base64 = `${dataImagePrefix}${resizedImage.toString('base64')}`;
  fs.unlinkSync(path.resolve(process.cwd(), `./uploads/${name}.png`));
  return base64;
};

const html = (data, key) =>
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
                        <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:22px;line-height:1;text-align:left;color:#ffffff;"><span style="color:#FEEB35">Hi ${data.user_name},</span><br /></div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                        <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:15px;line-height:1;text-align:left;color:#ffffff;">Anda telah memohon untuk login ke akaun anda. Key verifikasi anda adalah:</div>
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

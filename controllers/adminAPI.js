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
const PromosiType = require('../models/PromosiType');
const emailGen = require('../lib/emailgen');

// helper
const Helper = require('../controllers/countHelper');

const Dictionary = {
  kp: 'klinik',
  pp: 'pegawai',
  ppall: 'pegawai-all',
  jp: 'juruterapi pergigian',
  taska: 'taska',
  tadika: 'tadika',
  sr: 'sekolah-rendah',
  sm: 'sekolah-menengah',
  ins: 'institusi',
  kpb: 'kp-bergerak',
  mp: 'makmal-pergigian',
  event: 'event',
  'sa-a': 'superadmin-all',
  sosmed: 'sosmed',
  sosmedByKodProgram: 'sosmedByKodProgram',
};

const socmed = ['Facebook', 'Instagram', 'Twitter', 'Youtube', 'Tiktok'];

const transporter = mailer.createTransport({
  host: process.env.EMAILER_HOST,
  port: process.env.EMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAILER_ACCT,
    pass: process.env.EMAILER_PASS,
  },
});

const getData = async (req, res) => {
  let { main, Fn, token, FType, Id } = req.body;
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
            theType !== 'sosmed'
          ) {
            Data = {
              ...Data,
              jenisFasiliti: theType,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            };
            const data = await Fasiliti.create(Data);
            return res.status(200).json(data);
          }
          if (theType === 'pegawai') {
            const exists = await Operator.findOne({
              mdcNumber: Data.mdcNumber,
            });
            if (exists) {
              console.log('exists?');
              exists.createdByNegeri = negeri;
              exists.createdByDaerah = daerah;
              exists.kpSkrg = Data.kpSkrg;
              exists.kodFasiliti = Data.kodFasiliti;
              exists.activationStatus = true;
              exists.email = Data.email;
              exists.gred = Data.gred;
              exists.role = Data.role;
              exists.rolePromosiKlinik = Data.rolePromosiKlinik;
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
              console.log('exists?');
              exists.createdByNegeri = negeri;
              exists.createdByDaerah = daerah;
              exists.kpSkrg = Data.kpSkrg;
              exists.kodFasiliti = Data.kodFasiliti;
              exists.activationStatus = true;
              exists.email = Data.email;
              exists.gred = Data.gred;
              exists.role = Data.role;
              exists.rolePromosiKlinik = Data.rolePromosiKlinik;
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
                username: `daftar${acronym.toLowerCase()}${negeriNum}${daerahNum}`,
                negeri: Data.negeri,
                daerah: Data.daerah,
                kp: Data.kp,
                kodFasiliti: Data.kodFasiliti,
                accountType: 'kaunterUser',
                password: 'temporary',
              });
              console.log('tempKaunter:', tempKaunter);
            });
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
          break;
        case 'read':
          console.log('read for', theType);
          if (
            theType !== 'pegawai' &&
            theType !== 'pegawai-all' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'klinik' &&
            theType !== 'sosmed' &&
            theType !== 'sosmedByKodProgram'
          ) {
            const data = await Fasiliti.find({
              jenisFasiliti: theType,
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            });
            return res.status(200).json(data);
          }
          if (theType === 'pegawai') {
            const data = await Operator.find({
              statusPegawai: 'pp',
              createdByDaerah: daerah,
              createdByNegeri: negeri,
              activationStatus: true,
            });
            return res.status(200).json(data);
          }
          if (theType === 'pegawai-all') {
            const data = await Operator.find({
              statusPegawai: 'pp',
              activationStatus: true,
            });
            return res.status(200).json(data);
          }
          if (theType === 'juruterapi pergigian') {
            const data = await Operator.find({
              createdByDaerah: daerah,
              createdByNegeri: negeri,
              statusPegawai: 'jp',
              activationStatus: true,
            });
            return res.status(200).json(data);
          }
          if (theType === 'klinik') {
            const data = await User.find({
              negeri,
              daerah,
              statusRoleKlinik: ['klinik', 'kepp', 'utc', 'rtc', 'visiting'],
            });
            const kaunterAcct = await User.find({
              negeri,
              daerah,
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
          if (theType === 'sosmed') {
            let countedData = [];
            let owner = '';
            if (daerah === '-') {
              owner = negeri;
            }
            if (daerah !== '-') {
              owner = daerah;
            }
            const data = await Sosmed.find({
              belongsTo: owner,
            });
            countedData = sosmedDataCompactor(data);
            return res.status(200).json(countedData);
          }
          if (theType === 'sosmedByKodProgram') {
            let owner = '';
            if (daerah === '-') {
              owner = negeri;
            }
            if (daerah !== '-') {
              owner = daerah;
            }
            const data = await Sosmed.find({
              belongsTo: owner,
            });
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
            theType !== 'klinik'
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
          break;
        case 'delete':
          console.log('delete for', theType);
          if (
            theType !== 'pegawai' &&
            theType !== 'juruterapi pergigian' &&
            theType !== 'klinik'
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
    case 'KpCenter':
      var { kp, daerah, negeri } = jwt.verify(token, process.env.JWT_SECRET);
      console.log(FType);
      switch (Fn) {
        case 'create':
          console.log('create for kpcenter');
          switch (FType) {
            case 'program':
              Data = {
                ...Data,
                createdByKp: kp,
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
                  { kodProgram: Data.kodProgram, belongsTo: kp },
                  { $push: { data: Data.data[0] } },
                  { new: true }
                );
                res.status(200).json(updatedSosmed);
              }
              break;
            default:
              console.log('default case for kpcenter');
              break;
          }
          break;
        case 'read':
          console.log('read for kpcenter');
          switch (FType) {
            case 'program':
              const eventData = await Event.find({
                createdByKp: kp,
                createdByDaerah: daerah,
                createdByNegeri: negeri,
              });
              res.status(200).json(eventData);
              break;
            case 'sosmed':
              let countedData = [];
              const sosmedData = await Sosmed.find({
                belongsTo: kp,
              });
              if (sosmedData.length === 0) {
                return res.status(200).json(countedData);
              }
              countedData = sosmedDataCompactor(sosmedData);
              res.status(200).json(countedData);
              break;
            case 'sosmedByKodProgram':
              const sosmedDataByProgram = await Sosmed.find({
                belongsTo: kp,
              });
              res.status(200).json(sosmedDataByProgram);
              break;
            case 'tastad':
              let tastadData = [];
              const allTastad = await Fasiliti.find({
                jenisFasiliti: ['taska', 'tadika'],
                handler: kp,
              });
              const studentCount = await Umum.countDocuments({
                jenisFasiliti: ['taska', 'tadika'],
                createdByKp: kp,
              });
              console.log(allTastad, studentCount);
              res.status(200).json(tastadData);
              break;
            case 'pp':
              const ppData = await Operator.find({
                statusPegawai: 'pp',
                kpSkrg: kp,
              });
              res.status(200).json(ppData);
              break;
            case 'jp':
              const jpData = await Operator.find({
                statusPegawai: 'jp',
                kpSkrg: kp,
              });
              res.status(200).json(jpData);
              break;
            case 'ins':
              const institusiData = await Fasiliti.find({
                jenisFasiliti: Dictionary[FType],
                handler: kp,
              });
              res.status(200).json(institusiData);
              break;
            default:
              console.log('default case for read');
              break;
          }
          break;
        case 'readOne':
          console.log('readOne for kpcenter');
          if (FType === 'program') {
            const oneEvent = await Event.findOne({
              _id: Id,
            });
            res.status(200).json(oneEvent);
          }
          if (FType === 'pp' || FType === 'jp') {
            const onePP = await Operator.findOne({
              _id: Id,
            });
            res.status(200).json(onePP);
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
            case 'pp':
              const updatePP = await Operator.findByIdAndUpdate(
                { _id: Id },
                { $set: Data },
                { new: true }
              );
              res.status(200).json(updatePP);
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
              const deletedEvent = await Event.findByIdAndDelete({ _id: Id });
              res.status(200).json(deletedEvent);
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
          const regData = await Superadmin.create({
            user_name: user_name,
            daerah: daerah,
            negeri: negeri,
            e_mail: e_mail,
            accountType: accountType,
            totp: false,
          });
          res.status(200).json(regData);
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
          res.status(200).json({
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

const getCipher = async (req, res) => {
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

const sendVerificationEmail = async (userId) => {
  const key = generateRandomString(8);
  const { nama, e_mail } = await Superadmin.findByIdAndUpdate(
    userId,
    { tempKey: key },
    { new: true }
  );
  const mailOptions = {
    from: process.env.EMAILER_ACCT,
    to: e_mail,
    subject: 'Kunci Verifikasi Anda',
    html: html(nama, key),
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return err;
    }
    console.log('done');
  });
  return e_mail;
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

module.exports = { generateRandomString, getData, getCipher };

'use strict';
const fs = require('fs');
const async = require('async');
const path = require('path');
const moment = require('moment');
const Excel = require('exceljs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Operator = require('../models/Operator');
const Event = require('../models/Event');
const Fasiliti = require('../models/Fasiliti');
const Reservoir = require('../models/Reservoir');
const KohortKotak = require('../models/KohortKotak');
const GenerateToken = require('../models/GenerateToken');
const { generateRandomString } = require('./adminAPI');
const { logger, penjanaanRetenLogger } = require('../logs/logger');

const borderStyle = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};
const noBorderStyle = {
  top: { style: 'none' },
  left: { style: 'none' },
  bottom: { style: 'none' },
  right: { style: 'none' },
};

// error returner
const excelMakerError = (err) => {
  penjanaanRetenLogger.error(`Error making ${err}`);
  throw Error(`Tidak boleh menjana ${err}`);
};

exports.startQueue = async function (req, res) {
  const { authorization } = req.headers;
  const { username, accountType } = jwt.verify(
    authorization,
    process.env.JWT_SECRET
  );
  const { jenisReten, fromEtl } = req.query;

  if (
    accountType !== 'kaunterUser' &&
    fromEtl === 'false' &&
    (jenisReten !== 'PG101A' || jenisReten !== 'PG101C')
  ) {
    logger.info(
      `[generateRetenController] not kaunter user & not from etl, from ${username}`
    );
    let userTokenData = await GenerateToken.findOne({
      belongsTo: username,
      jenisReten,
    });

    if (!userTokenData) {
      switch (accountType) {
        case 'hqSuperadmin':
          userTokenData = await new GenerateToken({
            belongsTo: username,
            accountType,
            jenisReten,
            jumlahToken: 9000,
          }).save();
          break;
        case 'negeriSuperadmin':
          userTokenData = await new GenerateToken({
            belongsTo: username,
            accountType,
            jenisReten,
            jumlahToken: 200,
          }).save();
          break;
        case 'daerahSuperadmin':
          userTokenData = await new GenerateToken({
            belongsTo: username,
            accountType,
            jenisReten,
            jumlahToken: 50,
          }).save();
          break;
        default:
          return res.status(403).json({
            message: 'Anda tidak dibenarkan untuk menjana reten',
          });
      }
    }

    if (
      process.env.BUILD_ENV === 'production' &&
      userTokenData.jumlahToken <= 0
    ) {
      logger.info(
        '[generateRetenController] no more coins left for ' + username
      );
      return res.status(401).json({ msg: 'no more coins left' });
    }
  }

  const downloadQueue = async.queue(async (task) => {
    const result = await task();
    return result;
  }, process.env.GENERATE_WORKERS || 5);

  const result = await new Promise((resolve, reject) => {
    downloadQueue.push(async () => {
      try {
        const result = await downloader(req, res);
        if (
          process.env.BUILD_ENV === 'production' &&
          accountType !== 'kaunterUser' &&
          fromEtl === 'false' &&
          (jenisReten !== 'PG101A' || jenisReten !== 'PG101')
        ) {
          let userTokenData = await GenerateToken.findOne({
            belongsTo: username,
            jenisReten,
          });
          userTokenData.jumlahToken -= 1;
          await userTokenData.save();
          logger.info(
            '[generateRetenController] dah kurangkan token untuk ' +
              username
          );
        } else {
          logger.info(
            '[generateRetenController] not production atau generate bulanan and ' +
              username
          );
        }
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.status(200).send(result);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });

  logger.info(
    '[generateRetenController] que superadmin sekarang: ' +
      downloadQueue.length()
  );
  return result;
};

exports.startQueueKp = async function (req, res) {
  const { authorization } = req.headers;
  const { username, accountType } = jwt.verify(
    authorization,
    process.env.JWT_SECRET
  );
  //
  const { jenisReten, fromEtl } = req.query;
  //
  if (
    fromEtl === 'false' &&
    (jenisReten !== 'PG101A' || jenisReten !== 'PG101C')
  ) {
    logger.info(
      `[generateRetenController] from kpUser & not from etl, from ${username}`
    );
    let userTokenData = await GenerateToken.findOne({
      belongsTo: username,
      jenisReten,
    });

    // create if there is no userTokenData
    if (!userTokenData) {
      const kpUserToken = await new GenerateToken({
        belongsTo: username,
        accountType,
        jenisReten,
        jumlahToken: 25,
      }).save();
      userTokenData = kpUserToken;
      logger.info(
        `[generateRetenController] dah save token kp user ${username}`
      );
    }

    if (
      process.env.BUILD_ENV === 'production' &&
      userTokenData.jumlahToken <= 0
    ) {
      logger.info(
        '[generateRetenController] no more coins left for ' + username
      );
      return res.status(401).json({ msg: 'no more coins left' });
    }
  }

  // get in line soldier!
  const downloadQueueKp = async.queue(async (task) => {
    const result = await task();
    return result;
  }, process.env.GENERATE_WORKERS || 5);

  const result = await new Promise((resolve, reject) => {
    downloadQueueKp.push(async () => {
      try {
        const result = await downloader(req, res);
        if (
          process.env.BUILD_ENV === 'production' &&
          fromEtl === 'false' &&
          (jenisReten !== 'PG101A' || jenisReten !== 'PG101')
        ) {
          let userTokenData = await GenerateToken.findOne({
            belongsTo: username,
            jenisReten,
          });
          userTokenData.jumlahToken -= 1;
          await userTokenData.save();
          logger.info(
            '[generateRetenController] dah kurangkan token untuk ' +
              username
          );
        } else {
          logger.info(
            '[generateRetenController] not production atau generate bulanan and ' +
              username
          );
        }
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.status(200).send(result);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });

  logger.info(
    '[generateRetenController] que kp sekarang: ' +
      downloadQueueKp.length()
  );
  return result;
};

// helper
const Helper = require('../controllers/countHelper');

// gateway
const downloader = async (req, res) => {
  // check query
  let {
    jenisReten,
    negeri,
    daerah,
    klinik,
    pilihanFasiliti,
    pilihanKkia,
    pilihanProgram,
    pilihanKpbMpb,
    pilihanIndividu,
    tarikhMula,
    tarikhAkhir,
    bulan,
    fromEtl,
  } = req.query;
  // check if there is any query
  if (!jenisReten) {
    return new Error('No data found');
  }
  //
  const { authorization } = req.headers;
  //
  let currentKodFasiliti,
    currentDaerah,
    currentNegeri,
    accountType,
    username;

  accountType = jwt.verify(
    authorization,
    process.env.JWT_SECRET
  ).accountType;

  switch (accountType) {
    case 'kaunterUser':
      klinik = currentKodFasiliti;
      daerah = currentDaerah;
      negeri = currentNegeri;
      const { kp } = await User.findOne({ kodFasiliti: klinik });
      username = `Kaunter ${kp}`;
      break;
    default:
      currentKodFasiliti = jwt.verify(
        authorization,
        process.env.JWT_SECRET
      ).kodFasiliti;
      currentDaerah = jwt.verify(
        authorization,
        process.env.JWT_SECRET
      ).daerah;
      currentNegeri = jwt.verify(
        authorization,
        process.env.JWT_SECRET
      ).negeri;
      username = jwt.verify(
        authorization,
        process.env.JWT_SECRET
      ).username;
      break;
  }

  const payload = {
    jenisReten,
    username,
    accountType,
    klinik,
    daerah,
    negeri,
    pilihanFasiliti,
    pilihanKkia,
    pilihanProgram,
    pilihanKpbMpb,
    pilihanIndividu,
    tarikhMula,
    tarikhAkhir,
    bulan,
    fromEtl,
  };

  const excelFile = await mapsOfSeveralRetens.get(jenisReten)(
    payload
  );

  if (excelFile === 'No data found') {
    return new Error('No data found');
  }

  penjanaanRetenLogger.info(
    `[penjanaanReten] ${username} menjana ${jenisReten} untuk ${
      klinik === 'all' ? 'semua klinik' : klinik
    }${daerah === 'all' ? '/semua daerah' : `/${daerah}`}${
      negeri === 'all' ? '/semua negeri' : `/${negeri}`
    }`
  );

  return excelFile;
};

// functions
const makePG101A = async (payload) => {
  logger.info('[generateRetenController] PG101A');
  try {
    let kkia;
    let {
      klinik,
      daerah,
      negeri,
      pilihanKkia,
      username,
      tarikhMula,
      bulan,
      jenisReten,
    } = payload;
    //
    const data = await Helper.countPG101A(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    if (pilihanKkia) {
      const currentKkia = await Fasiliti.findOne({
        kodKkiaKd: pilihanKkia,
      });
      kkia = currentKkia.nama;
    }
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG101A.xlsx'
    );
    let filenameUTC = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG101C.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(
      /utc/i.test(klinik) ? filenameUTC : filename
    );
    let worksheet = workbook.getWorksheet(
      /utc/i.test(klinik) ? 'PG101C' : 'PG101A'
    );
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment().format('YYYY');

    worksheet.getCell('I5').value = monthName;
    worksheet.getCell('M5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    /utc/i.test(klinik)
      ? (intro1.getCell(2).value = 'OUTREACH')
      : (intro1.getCell(2).value = 'PRIMER');

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()} ${
      kkia ? ` / ${kkia.split(' | ')[1].toUpperCase()}` : ''
    }`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah ? daerah.toUpperCase() : ''}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri ? negeri.toUpperCase() : ''}`;
    //
    for (let i = 0; i < data.length; i++) {
      worksheet.getRow(16 + i).height = 33;
      worksheet.getRow(16 + i).font = { name: 'Arial', size: 10 };
      let rowNew = worksheet.getRow(16 + i);
      rowNew.getCell(1).value = moment(
        data[i].tarikhKedatangan
      ).format('DD/MM/YYYY');
      rowNew.getCell(2).value = data[i].noSiri;
      rowNew.getCell(3).value = data[i].waktuSampai;
      if (data[i].noPendaftaranBaru) {
        rowNew.getCell(4).value = data[i].noPendaftaranBaru;
      }
      if (data[i].noPendaftaranUlangan) {
        rowNew.getCell(5).value = data[i].noPendaftaranUlangan;
      }
      rowNew.getCell(6).value = data[i].ic;
      rowNew.getCell(7).value = data[i].nama.toUpperCase();
      rowNew.getCell(8).value = data[i].alamat.toUpperCase();
      rowNew.getCell(9).value = data[i].umur;
      if (data[i].jantina == 'lelaki') {
        rowNew.getCell(10).value = 1;
      }
      if (data[i].jantina == 'perempuan') {
        rowNew.getCell(11).value = 1;
      }
      switch (data[i].kumpulanEtnik) {
        case 'melayu':
          rowNew.getCell(12).value = 1;
          break;
        case 'cina':
          rowNew.getCell(13).value = 1;
          break;
        case 'india':
          rowNew.getCell(14).value = 1;
          break;
        case 'bajau':
          rowNew.getCell(15).value = 1;
          break;
        case 'dusun':
          rowNew.getCell(16).value = 1;
          break;
        case 'kadazan':
          rowNew.getCell(17).value = 1;
          break;
        case 'murut':
          rowNew.getCell(18).value = 1;
          break;
        case 'bumiputera sabah lain':
          rowNew.getCell(19).value = 1;
          break;
        case 'melanau':
          rowNew.getCell(20).value = 1;
          break;
        case 'kedayan':
          rowNew.getCell(21).value = 1;
          break;
        case 'iban':
          rowNew.getCell(22).value = 1;
          break;
        case 'bidayuh':
          rowNew.getCell(23).value = 1;
          break;
        case 'penan':
          rowNew.getCell(24).value = 1;
          break;
        case 'bumiputera sarawak lain':
          rowNew.getCell(25).value = 1;
          break;
        case 'orang asli semenanjung':
          rowNew.getCell(26).value = 1;
          break;
        case 'lain-lain':
          rowNew.getCell(27).value = 1;
          break;
        case 'bukan warganegara':
          rowNew.getCell(28).value = 1;
          break;
        default:
          console.log('');
      }
      if (data[i].ibuMengandung) {
        rowNew.getCell(29).value = 1;
      }
      if (data[i].bersekolah) {
        rowNew.getCell(30).value = 1;
      }
      if (data[i].orangKurangUpaya) {
        rowNew.getCell(31).value = 1;
      }
      switch (data[i].statusPesara) {
        case 'pesara-kerajaan':
          rowNew.getCell(32).value = 1;
          break;
        case 'pesara-atm':
          rowNew.getCell(33).value = 1;
          break;
        default:
          console.log('');
      }
      rowNew.getCell(34).value = data[i].rujukDaripada.toUpperCase(); //rujukDaripada
      if (data[i].deleted) {
        rowNew.getCell(35).value = 'PESAKIT YANG DIHAPUS';
      } else {
        // let catatan = `${
        //   data[i].createdByUsername !== 'kaunter'
        //     ? `Operator: ${data[i].createdByUsername} `
        //     : ''
        // } ${
        //   data[i].rawatanDibuatOperatorLain
        //     ? `Operator Lain: ${data[i].maklumatOperatorLain[0]} ${
        //         data[i].maklumatOperatorLain[0]
        //           ? `${data[i].maklumatOperatorLain[0]}`
        //           : ''
        //       } `
        //     : ''
        // } ${
        //   data[i].rawatanDibuatOperatorLain
        //     ? `Operator Lain: ${data[i].maklumatOperatorLain[1]} ${
        //         data[i].maklumatOperatorLain[1]
        //           ? `${data[i].maklumatOperatorLain[1]}`
        //           : ''
        //       } `
        //     : ''
        // } ${data[i].noOku ? `No. Oku: ${data[i].noOku} ` : ''} ${
        //   data[i].noPesara ? `No. Pesara: ${data[i].noPesara}` : ''
        // } ${
        //   data[i].noBayaran && data[i].noResit
        //     ? `No. Resit dan bayaran: ${data[i].noResit} - ${data[i].noBayaran}`
        //     : ''
        // } ${
        //   data[i].noBayaran2 && data[i].noResit2
        //     ? `No. Resit dan bayaran: ${data[i].noResit2} - ${data[i].noBayaran2}`
        //     : ''
        // } ${
        //   data[i].noBayaran3 && data[i].noResit3
        //     ? `No. Resit dan bayaran: ${data[i].noResit3} - ${data[i].noBayaran3}`
        //     : ''
        // } ${data[i].catatan ? `Catatan: ${data[i].catatan}` : ''}`;
        let catatan = `${
          data[i].createdByUsername !== 'kaunter'
            ? `Operator: ${data[i].createdByUsername}. `
            : ''
        }`;

        if (data[i].rawatanDibuatOperatorLain) {
          for (
            let j = 0;
            j < data[i].maklumatOperatorLain.length;
            j++
          ) {
            if (data[i].maklumatOperatorLain[j]) {
              catatan += `Operator Lain: ${data[i].maklumatOperatorLain[j]}. `;
            }
          }
        }

        catatan += `${
          data[i].noOku ? `No. Oku: ${data[i].noOku} ` : ''
        } ${
          data[i].noPesara ? `No. Pesara: ${data[i].noPesara}` : ''
        } ${
          data[i].noBayaran && data[i].noResit
            ? `No. Resit dan bayaran: ${data[i].noResit} - ${data[i].noBayaran}`
            : ''
        } ${
          data[i].noBayaran2 && data[i].noResit2
            ? `No. Resit dan bayaran: ${data[i].noResit2} - ${data[i].noBayaran2}`
            : ''
        } ${
          data[i].noBayaran3 && data[i].noResit3
            ? `No. Resit dan bayaran: ${data[i].noResit3} - ${data[i].noBayaran3}`
            : ''
        } ${data[i].catatan ? `Catatan: ${data[i].catatan}` : ''}`;

        rowNew.getCell(35).value = catatan;
      }
      for (let z = 1; z < 36; z++) {
        rowNew.getCell(z).border = borderStyle;
      }
    }
    //
    worksheet.getCell('AI6').style = noBorderStyle;
    worksheet.getCell(
      'AI7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell(
      'AI8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG101A';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController] writing file - ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePG101] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG101C = async (payload) => {
  logger.info('[generateRetenController] PG101C');
  try {
    let {
      klinik,
      daerah,
      negeri,
      pilihanProgram,
      pilihanKpbMpb,
      username,
      tarikhMula,
      bulan,
      jenisReten,
    } = payload;
    //
    const data = await Helper.countPG101C(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG101C.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG101C');
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment().format('YYYY');

    worksheet.getCell('I5').value = monthName;
    worksheet.getCell('M5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'OUTREACH';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()} ${
      pilihanProgram ? ` / ${pilihanProgram.toUpperCase()}` : ''
    } ${pilihanKpbMpb ? ` / ${pilihanKpbMpb.toUpperCase()}` : ''}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri.toUpperCase()}`;
    //
    for (let i = 0; i < data.length; i++) {
      worksheet.getRow(16 + i).height = 33;
      let rowNew = worksheet.getRow(16 + i);
      // change tarikh kedatangan to local
      const localDate = moment(data[i].tarikhKedatangan).format(
        'DD/MM/YYYY'
      );
      data[i].tarikhKedatangan = localDate;
      // change tarikh kedatangan to local
      rowNew.getCell(1).value = data[i].tarikhKedatangan;
      rowNew.getCell(2).value = data[i].noSiri;
      rowNew.getCell(3).value = data[i].waktuSampai;
      if (data[i].noPendaftaranBaru) {
        rowNew.getCell(4).value = data[i].noPendaftaranBaru;
      }
      if (data[i].noPendaftaranUlangan) {
        rowNew.getCell(5).value = data[i].noPendaftaranUlangan;
      }
      rowNew.getCell(6).value = data[i].ic;
      rowNew.getCell(7).value = data[i].nama.toUpperCase();
      rowNew.getCell(8).value = data[i].alamat.toUpperCase();
      rowNew.getCell(9).value = data[i].umur;
      if (data[i].jantina == 'lelaki') {
        rowNew.getCell(10).value = 1;
      }
      if (data[i].jantina == 'perempuan') {
        rowNew.getCell(11).value = 1;
      }
      switch (data[i].kumpulanEtnik) {
        case 'melayu':
          rowNew.getCell(12).value = 1;
          break;
        case 'cina':
          rowNew.getCell(13).value = 1;
          break;
        case 'india':
          rowNew.getCell(14).value = 1;
          break;
        case 'bajau':
          rowNew.getCell(15).value = 1;
          break;
        case 'dusun':
          rowNew.getCell(16).value = 1;
          break;
        case 'kadazan':
          rowNew.getCell(17).value = 1;
          break;
        case 'murut':
          rowNew.getCell(18).value = 1;
          break;
        case 'bumiputera sabah lain':
          rowNew.getCell(19).value = 1;
          break;
        case 'melanau':
          rowNew.getCell(20).value = 1;
          break;
        case 'kedayan':
          rowNew.getCell(21).value = 1;
          break;
        case 'iban':
          rowNew.getCell(22).value = 1;
          break;
        case 'bidayuh':
          rowNew.getCell(23).value = 1;
          break;
        case 'penan':
          rowNew.getCell(24).value = 1;
          break;
        case 'bumiputera sarawak lain':
          rowNew.getCell(25).value = 1;
          break;
        case 'orang asli semenanjung':
          rowNew.getCell(26).value = 1;
          break;
        case 'lain-lain':
          rowNew.getCell(27).value = 1;
          break;
        case 'bukan warganegara':
          rowNew.getCell(28).value = 1;
          break;
        default:
          console.log('');
      }
      if (data[i].ibuMengandung) {
        rowNew.getCell(29).value = 1;
      }
      if (data[i].bersekolah) {
        rowNew.getCell(30).value = 1;
      }
      if (data[i].orangKurangUpaya) {
        rowNew.getCell(31).value = 1;
      }
      switch (data[i].statusPesara) {
        case 'pesara-kerajaan':
          rowNew.getCell(32).value = 1;
          break;
        case 'pesara-atm':
          rowNew.getCell(33).value = 1;
          break;
        default:
          console.log('');
      }
      rowNew.getCell(34).value = data[i].rujukDaripada.toUpperCase(); //rujukDaripada
      if (data[i].deleted) {
        rowNew.getCell(35).value = 'PESAKIT YANG DIHAPUS';
      } else {
        let catatan = `${
          data[i].createdByUsername !== 'kaunter'
            ? `Operator: ${data[i].createdByUsername}. `
            : ''
        }`;

        if (data[i].rawatanDibuatOperatorLain) {
          for (
            let j = 0;
            j < data[i].maklumatOperatorLain.length;
            j++
          ) {
            if (data[i].maklumatOperatorLain[j]) {
              catatan += `Operator Lain: ${data[i].maklumatOperatorLain[j]}. `;
            }
          }
        }

        catatan += `${
          data[i].noOku ? `No. Oku: ${data[i].noOku} ` : ''
        } ${
          data[i].noPesara ? `No. Pesara: ${data[i].noPesara}` : ''
        } ${
          data[i].noBayaran && data[i].noResit
            ? `No. Resit dan bayaran: ${data[i].noResit} - ${data[i].noBayaran}`
            : ''
        } ${
          data[i].noBayaran2 && data[i].noResit2
            ? `No. Resit dan bayaran: ${data[i].noResit2} - ${data[i].noBayaran2}`
            : ''
        } ${
          data[i].noBayaran3 && data[i].noResit3
            ? `No. Resit dan bayaran: ${data[i].noResit3} - ${data[i].noBayaran3}`
            : ''
        } ${data[i].catatan ? `Catatan: ${data[i].catatan}` : ''}`;

        rowNew.getCell(35).value = catatan;
      }
      for (let z = 1; z < 36; z++) {
        rowNew.getCell(z).border = borderStyle;
      }
    }

    worksheet.getCell(
      'AI7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell(
      'AI8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG101C';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG101C] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG211A = async (payload) => {
  logger.info('[generateRetenController] PG211A');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data = [];
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPG211A(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG211A.xlsx'
    );
    let filenameUTC = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG211C.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(
      /utc/i.test(klinik) ? filenameUTC : filename
    );
    let worksheet = workbook.getWorksheet(
      /utc/i.test(klinik) ? 'PG211C' : 'PG211A'
    );
    //
    const monthName = moment(bulan ? bulan : tarikhAkhir).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('N5').value = monthName;
    worksheet.getCell('R5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    /utc/i.test(klinik)
      ? (intro1.getCell(2).value = 'OUTREACH')
      : (intro1.getCell(2).value = 'PRIMER');

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(13 + i);
      if (data[i][0]) {
        jumlahReten += data[i][0].jumlahReten;
        jumlahRetenSalah += data[i][0].statusReten;
        rowNew.getCell(4).value = data[i][0].jumlahLelaki; //D13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(5).value = data[i][0].jumlahPerempuan; //E13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(6).value = data[i][0].jumlahMelayu; //F13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(7).value = data[i][0].jumlahCina; //G13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(8).value = data[i][0].jumlahIndia; //H13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(9).value = data[i][0].jumlahBajau; //I13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(10).value = data[i][0].jumlahDusun; //J13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(11).value = data[i][0].jumlahKadazan; //K13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(12).value = data[i][0].jumlahMurut; //L13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(13).value = data[i][0].jumlahBMSL; //M13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(14).value = data[i][0].jumlahMelanau; //N13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(15).value = data[i][0].jumlahKedayan; //O13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(16).value = data[i][0].jumlahIban; //P13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(17).value = data[i][0].jumlahBidayuh; //Q13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(18).value = data[i][0].jumlahPenan; //R13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(19).value = data[i][0].jumlahBMSwL; //R13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(20).value = data[i][0].jumlahOA; //S13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(21).value = data[i][0].jumlahLainlain; //T13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(22).value = data[i][0].jumlahBukanWarganegara; //U13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(23).value = data[i][0].jumlahIbuMengandung; //V13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(24).value = data[i][0].jumlahBersekolah; //W13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(25).value = data[i][0].jumlahOKU; //X13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(26).value = data[i][0].jumlahPesaraKerajaan; //Y13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(27).value = data[i][0].jumlahPesaraATM; //Z13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(28).value = data[i][0].jumlahRujukanDalaman; //AA13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(29).value = data[i][0].jumlahRujukanKP; //AB13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(30).value = data[i][0].jumlahRujukanKK; //AC13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(31).value = data[i][0].jumlahRujukanHospital; //AD13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(32).value = data[i][0].jumlahRujukanSwasta; //AE13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(33).value = data[i][0].jumlahRujukanLainlain; //AF13 Kategori bawah 1 Tahun (baru)
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AG6'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AG7').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AG8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AG6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AG7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AG8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'PG211A';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG211A] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG211C = async (payload) => {
  logger.info('[generateRetenController] PG211C');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPG211C(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG211C.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG211C');
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('N5').value = monthName;
    worksheet.getCell('R5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'OUTREACH';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(13 + i);
      if (data[i][0]) {
        jumlahReten += data[i][0].jumlahReten;
        jumlahRetenSalah += data[i][0].statusReten;
        rowNew.getCell(4).value = data[i][0].jumlahLelaki; //D13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(5).value = data[i][0].jumlahPerempuan; //E13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(6).value = data[i][0].jumlahMelayu; //F13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(7).value = data[i][0].jumlahCina; //G13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(8).value = data[i][0].jumlahIndia; //H13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(9).value = data[i][0].jumlahBajau; //I13	Kategori bawah 1 Tahun (baru)
        rowNew.getCell(10).value = data[i][0].jumlahDusun; //J13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(11).value = data[i][0].jumlahKadazan; //K13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(12).value = data[i][0].jumlahMurut; //L13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(13).value = data[i][0].jumlahBMSL; //M13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(14).value = data[i][0].jumlahMelanau; //N13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(15).value = data[i][0].jumlahKedayan; //O13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(16).value = data[i][0].jumlahIban; //P13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(17).value = data[i][0].jumlahBidayuh; //Q13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(18).value = data[i][0].jumlahPenan; //R13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(19).value = data[i][0].jumlahBMSwL; //R13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(20).value = data[i][0].jumlahOA; //S13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(21).value = data[i][0].jumlahLainlain; //T13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(22).value = data[i][0].jumlahBukanWarganegara; //U13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(23).value = data[i][0].jumlahIbuMengandung; //V13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(24).value = data[i][0].jumlahBersekolah; //W13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(25).value = data[i][0].jumlahOKU; //X13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(26).value = data[i][0].jumlahPesaraKerajaan; //Y13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(27).value = data[i][0].jumlahPesaraATM; //Z13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(28).value = data[i][0].jumlahRujukanDalaman; //AA13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(29).value = data[i][0].jumlahRujukanKP; //AB13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(30).value = data[i][0].jumlahRujukanKK; //AC13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(31).value = data[i][0].jumlahRujukanHospital; //AD13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(32).value = data[i][0].jumlahRujukanSwasta; //AE13 Kategori bawah 1 Tahun (baru)
        rowNew.getCell(33).value = data[i][0].jumlahRujukanLainlain; //AF13 Kategori bawah 1 Tahun (baru)
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AG6'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AG7').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AG8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AG6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AG7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AG8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'PG211C';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG211C] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG206 = async (payload) => {
  logger.info('[generateRetenController] PG206');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPG206(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG206.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG206');
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('V5').value = monthName;
    worksheet.getCell('Z5').value = yearNow;

    if (pilihanIndividu) {
      const currentIndividu = await Operator.findOne({
        mdtbNumber: pilihanIndividu,
      })
        .select('nama')
        .lean();
      worksheet.getCell(
        'B9'
      ).value = `${currentIndividu.nama.toUpperCase()}`;
    }

    worksheet.getCell('B6').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B7').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('B8').value = `${negeri.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    //
    let j = 0;
    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(17 + j);
      if (data[0][i].queryPemeriksaan[0]) {
        jumlahReten += data[0][i].queryPemeriksaan[0].jumlahReten;
        jumlahRetenSalah +=
          data[0][i].queryPemeriksaan[0].statusReten;
        // pemeriksaan
        row.getCell(2).value =
          data[0][i].queryPemeriksaan[0].kedatanganTahunSemasaBaru;
        row.getCell(4).value = data[0][i].queryPemeriksaan[0].jumlahd;
        row.getCell(5).value = data[0][i].queryPemeriksaan[0].jumlahf;
        row.getCell(6).value = data[0][i].queryPemeriksaan[0].jumlahx;
        row.getCell(7).value =
          data[0][i].queryPemeriksaan[0].jumlahdfx;
        if (i > 1) {
          row.getCell(8).value =
            data[0][i].queryPemeriksaan[0].jumlahD;
          row.getCell(9).value =
            data[0][i].queryPemeriksaan[0].jumlahM;
          row.getCell(10).value =
            data[0][i].queryPemeriksaan[0].jumlahF;
          row.getCell(11).value =
            data[0][i].queryPemeriksaan[0].jumlahX;
          row.getCell(12).value =
            data[0][i].queryPemeriksaan[0].jumlahDMFX;
        }
        row.getCell(13).value =
          data[0][i].queryPemeriksaan[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value =
            data[0][i].queryPemeriksaan[0].statusBebasKaries;
        }
        row.getCell(15).value = data[0][i].queryPemeriksaan[0].TPR;
        if (i > 1) {
          row.getCell(16).value =
            data[0][i].queryPemeriksaan[0].skorGISZero;
          row.getCell(17).value =
            data[0][i].queryPemeriksaan[0].skorGISMoreThanZero;
        }
        row.getCell(18).value =
          data[0][i].queryPemeriksaan[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value =
            data[0][
              i
            ].queryPemeriksaan[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value =
            data[0][i].queryPemeriksaan[0].perluJumlahPesakitFS;
          row.getCell(22).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiFS;
        }
        row.getCell(23).value =
          data[0][i].queryPemeriksaan[0].perluPenskaleran;
      }
      j++;
      if (i === 6) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      let row = worksheet.getRow(17 + j);
      if (data[1][i].queryRawatan[0]) {
        // rawatan
        row.getCell(3).value =
          data[1][i].queryRawatan[0].kedatanganTahunSemasaUlangan;
        row.getCell(24).value =
          data[1][i].queryRawatan[0].sapuanFluorida;
        if (i > 1) {
          row.getCell(25).value =
            data[1][i].queryRawatan[0].jumlahPesakitPrrJenis1;
          row.getCell(26).value =
            data[1][i].queryRawatan[0].jumlahGigiPrrJenis1;
          row.getCell(27).value =
            data[1][i].queryRawatan[0].jumlahPesakitDiBuatFs;
          row.getCell(28).value =
            data[1][i].queryRawatan[0].jumlahGigiDibuatFs;
        }
        row.getCell(29).value =
          data[1][i].queryRawatan[0].tampalanAntGdBaru;
        row.getCell(30).value =
          data[1][i].queryRawatan[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(31).value =
            data[1][i].queryRawatan[0].tampalanAntGkBaru;
          row.getCell(32).value =
            data[1][i].queryRawatan[0].tampalanAntGkSemula;
        }
        row.getCell(33).value =
          data[1][i].queryRawatan[0].tampalanPostGdBaru;
        row.getCell(34).value =
          data[1][i].queryRawatan[0].tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(35).value =
            data[1][i].queryRawatan[0].tampalanPostGkBaru;
          row.getCell(36).value =
            data[1][i].queryRawatan[0].tampalanPostGkSemula;
        }
        row.getCell(37).value =
          data[1][i].queryRawatan[0].tampalanPostAmgGdBaru;
        row.getCell(38).value =
          data[1][i].queryRawatan[0].tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(39).value =
            data[1][i].queryRawatan[0].tampalanPostAmgGkBaru;
          row.getCell(40).value =
            data[1][i].queryRawatan[0].tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(43).value =
          data[1][i].queryRawatan[0].tampalanSementara;
        row.getCell(44).value = data[1][i].queryRawatan[0].cabutanGd;
        if (i > 1) {
          row.getCell(45).value =
            data[1][i].queryRawatan[0].cabutanGk;
          row.getCell(46).value =
            data[1][i].queryRawatan[0].penskaleran;
        }
        row.getCell(47).value = data[1][i].queryRawatan[0].kesSelesai;
      }
      j++;
      if (i === 6) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[2].length; i++) {
      let row = worksheet.getRow(17 + j);
      if (data[2][i].querySekolah[0]) {
        // pemeriksaan
        row.getCell(2).value +=
          data[2][i].querySekolah[0].kedatanganTahunSemasaBaru;
        row.getCell(4).value += data[2][i].querySekolah[0].jumlahd;
        row.getCell(5).value += data[2][i].querySekolah[0].jumlahf;
        row.getCell(6).value += data[2][i].querySekolah[0].jumlahx;
        row.getCell(7).value += data[2][i].querySekolah[0].jumlahdfx;
        if (i > 1) {
          row.getCell(8).value += data[2][i].querySekolah[0].jumlahD;
          row.getCell(9).value += data[2][i].querySekolah[0].jumlahM;
          row.getCell(10).value += data[2][i].querySekolah[0].jumlahF;
          row.getCell(11).value += data[2][i].querySekolah[0].jumlahX;
          row.getCell(12).value +=
            data[2][i].querySekolah[0].jumlahDMFX;
        }
        row.getCell(13).value += data[2][i].querySekolah[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value +=
            data[2][i].querySekolah[0].statusBebasKaries;
        }
        row.getCell(15).value += data[2][i].querySekolah[0].TPR;
        if (i > 5) {
          row.getCell(16).value +=
            data[2][i].querySekolah[0].skorBPEZero;
          row.getCell(17).value +=
            data[2][i].querySekolah[0].skorGISMoreThanZero;
        }
        row.getCell(18).value +=
          data[2][i].querySekolah[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value +=
            data[2][i].querySekolah[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitFS;
          row.getCell(22).value +=
            data[2][i].querySekolah[0].perluJumlahGigiFS;
        }
        row.getCell(23).value +=
          data[2][i].querySekolah[0].perluPenskaleran;
        // rawatan
        row.getCell(3).value +=
          data[2][i].querySekolah[0].kedatanganTahunSemasaUlangan;
        row.getCell(24).value +=
          data[2][i].querySekolah[0].sapuanFluorida;
        if (i > 1) {
          row.getCell(25).value +=
            data[2][i].querySekolah[0].jumlahPesakitPrrJenis1;
          row.getCell(26).value +=
            data[2][i].querySekolah[0].jumlahGigiPrrJenis1;
          row.getCell(27).value +=
            data[2][i].querySekolah[0].jumlahPesakitDiBuatFs;
          row.getCell(28).value +=
            data[2][i].querySekolah[0].jumlahGigiDibuatFs;
        }
        row.getCell(29).value +=
          data[2][i].querySekolah[0].tampalanAntGdBaru;
        row.getCell(30).value +=
          data[2][i].querySekolah[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(31).value +=
            data[2][i].querySekolah[0].tampalanAntGkBaru;
          row.getCell(32).value =
            data[2][i].querySekolah[0].tampalanAntGkSemula;
        }
        row.getCell(33).value +=
          data[2][i].querySekolah[0].tampalanPostGdBaru;
        row.getCell(34).value +=
          data[2][i].querySekolah[0].tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(35).value +=
            data[2][i].querySekolah[0].tampalanPostGkBaru;
          row.getCell(36).value +=
            data[2][i].querySekolah[0].tampalanPostGkSemula;
        }
        row.getCell(37).value +=
          data[2][i].querySekolah[0].tampalanPostAmgGdBaru;
        row.getCell(38).value +=
          data[2][i].querySekolah[0].tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(39).value +=
            data[2][i].querySekolah[0].tampalanPostAmgGkBaru;
          row.getCell(40).value +=
            data[2][i].querySekolah[0].tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(43).value +=
          data[2][i].querySekolah[0].tampalanSementara;
        row.getCell(44).value += data[2][i].querySekolah[0].cabutanGd;
        if (i > 1) {
          row.getCell(45).value +=
            data[2][i].querySekolah[0].cabutanGk;
          row.getCell(46).value +=
            data[2][i].querySekolah[0].penskaleran;
        }
        row.getCell(47).value +=
          data[2][i].querySekolah[0].kesSelesai;
      }
      j++;
      if (i === 6) {
        j++;
      }
    }

    if (!pilihanIndividu) {
      j = 0;
      for (let i = 0; i < data[3].length; i++) {
        let row = worksheet.getRow(17 + j);
        if (data[3][i].queryOperatorLain[0]) {
          // rawatan
          // row.getCell(3).value = data[3][i].queryOperatorLain[0].kedatanganTahunSemasaUlangan;
          row.getCell(24).value +=
            data[3][i].queryOperatorLain[0].sapuanFluorida;
          if (i > 1) {
            row.getCell(25).value +=
              data[3][i].queryOperatorLain[0].jumlahPesakitPrrJenis1;
            row.getCell(26).value +=
              data[3][i].queryOperatorLain[0].jumlahGigiPrrJenis1;
            row.getCell(27).value +=
              data[3][i].queryOperatorLain[0].jumlahPesakitDiBuatFs;
            row.getCell(28).value +=
              data[3][i].queryOperatorLain[0].jumlahGigiDibuatFs;
          }
          row.getCell(29).value +=
            data[3][i].queryOperatorLain[0].tampalanAntGdBaru;
          row.getCell(30).value +=
            data[3][i].queryOperatorLain[0].tampalanAntGdSemula;
          if (i > 1) {
            row.getCell(31).value +=
              data[3][i].queryOperatorLain[0].tampalanAntGkBaru;
            row.getCell(32).value +=
              data[3][i].queryOperatorLain[0].tampalanAntGkSemula;
          }
          row.getCell(33).value +=
            data[3][i].queryOperatorLain[0].tampalanPostGdBaru;
          row.getCell(34).value +=
            data[3][i].queryOperatorLain[0].tampalanPostGdSemula;
          if (i > 1) {
            row.getCell(35).value +=
              data[3][i].queryOperatorLain[0].tampalanPostGkBaru;
            row.getCell(36).value +=
              data[3][i].queryOperatorLain[0].tampalanPostGkSemula;
          }
          row.getCell(37).value +=
            data[3][i].queryOperatorLain[0].tampalanPostAmgGdBaru;
          row.getCell(38).value +=
            data[3][i].queryOperatorLain[0].tampalanPostAmgGdSemula;
          if (i > 1) {
            row.getCell(39).value +=
              data[3][i].queryOperatorLain[0].tampalanPostAmgGkBaru;
            row.getCell(40).value +=
              data[3][i].queryOperatorLain[0].tampalanPostAmgGkSemula;
          }
          // skipping cells
          row.getCell(43).value +=
            data[3][i].queryOperatorLain[0].tampalanSementara;
          row.getCell(44).value +=
            data[3][i].queryOperatorLain[0].cabutanGd;
          if (i > 1) {
            row.getCell(45).value +=
              data[3][i].queryOperatorLain[0].cabutanGk;
            row.getCell(46).value +=
              data[3][i].queryOperatorLain[0].penskaleran;
          }
          row.getCell(47).value +=
            data[3][i].queryOperatorLain[0].kesSelesai;
        }
        j++;
        if (i === 6) {
          j++;
        }
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AU5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AU6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AU7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AU8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AU5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AU6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AU7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AU8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'PG206';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG206] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG207 = async (payload) => {
  logger.info('[generateRetenController] PG207');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPG207(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      })
        .select('kp')
        .lean();
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG207.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG207');
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('AO6').value = monthName;
    worksheet.getCell('AU6').value = yearNow;

    if (pilihanIndividu) {
      const currentIndividu = await Operator.findOne({
        mdcNumber: pilihanIndividu,
      })
        .select('nama')
        .lean();
      worksheet.getCell('A6').value = 'PEGAWAI: ';
      worksheet.getCell('A6').font = {
        bold: true,
        size: 12,
        name: 'Arial',
      };
      worksheet.getCell(
        'B6'
      ).value = `${currentIndividu.nama.toUpperCase()}`;
      worksheet.getCell('B6').font = {
        bold: true,
        size: 12,
        name: 'Arial',
      };
      worksheet.getCell('B6').alignment = { horizontal: 'left' };
    }

    worksheet.getCell('B7').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B8').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('B9').value = `${negeri.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(17 + j);
      if (data[0][i].queryPemeriksaan[0]) {
        jumlahReten += data[0][i].queryPemeriksaan[0].jumlahReten;
        jumlahRetenSalah +=
          data[0][i].queryPemeriksaan[0].statusReten;
        // pemeriksaan
        row.getCell(2).value =
          data[0][i].queryPemeriksaan[0].kedatanganTahunSemasaBaru;
        row.getCell(4).value = data[0][i].queryPemeriksaan[0].jumlahd;
        row.getCell(5).value = data[0][i].queryPemeriksaan[0].jumlahf;
        row.getCell(6).value = data[0][i].queryPemeriksaan[0].jumlahx;
        row.getCell(7).value =
          data[0][i].queryPemeriksaan[0].jumlahdfx;
        if (i > 1) {
          row.getCell(8).value =
            data[0][i].queryPemeriksaan[0].jumlahD;
          row.getCell(9).value =
            data[0][i].queryPemeriksaan[0].jumlahM;
          row.getCell(10).value =
            data[0][i].queryPemeriksaan[0].jumlahF;
          row.getCell(11).value =
            data[0][i].queryPemeriksaan[0].jumlahX;
          row.getCell(12).value =
            data[0][i].queryPemeriksaan[0].jumlahDMFX;
        }
        row.getCell(13).value =
          data[0][i].queryPemeriksaan[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value =
            data[0][i].queryPemeriksaan[0].statusBebasKaries;
        }
        row.getCell(15).value = data[0][i].queryPemeriksaan[0].TPR;
        if (i > 5) {
          row.getCell(16).value =
            data[0][i].queryPemeriksaan[0].skorBPEZero;
          row.getCell(17).value =
            data[0][i].queryPemeriksaan[0].skorBPEMoreThanZero;
        }
        row.getCell(18).value =
          data[0][i].queryPemeriksaan[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value =
            data[0][
              i
            ].queryPemeriksaan[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value =
            data[0][i].queryPemeriksaan[0].perluJumlahPesakitFS;
          row.getCell(22).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiFS;
        }
        row.getCell(23).value =
          data[0][i].queryPemeriksaan[0].perluPenskaleran;
        row.getCell(24).value =
          data[0][i].queryPemeriksaan[0].perluEndoAnterior;
        row.getCell(25).value =
          data[0][i].queryPemeriksaan[0].perluEndoPremolar;
        row.getCell(26).value =
          data[0][i].queryPemeriksaan[0].perluEndoMolar;
        if (i > 1) {
          row.getCell(27).value =
            data[0][i].queryPemeriksaan[0].jumlahPerluDenturPenuh;
          row.getCell(28).value =
            data[0][i].queryPemeriksaan[0].jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      let row = worksheet.getRow(17 + j);
      if (data[1][i].queryRawatan[0]) {
        // rawatan
        row.getCell(3).value =
          data[1][i].queryRawatan[0].kedatanganTahunSemasaUlangan;
        row.getCell(29).value =
          data[1][i].queryRawatan[0].sapuanFluorida;
        if (i > 1) {
          row.getCell(30).value =
            data[1][i].queryRawatan[0].jumlahPesakitPrrJenis1;
          row.getCell(31).value =
            data[1][i].queryRawatan[0].jumlahGigiPrrJenis1;
          row.getCell(32).value =
            data[1][i].queryRawatan[0].jumlahPesakitDiBuatFs;
          row.getCell(33).value =
            data[1][i].queryRawatan[0].jumlahGigiDibuatFs;
        }
        row.getCell(34).value =
          data[1][i].queryRawatan[0].tampalanAntGdBaru;
        row.getCell(35).value =
          data[1][i].queryRawatan[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(36).value =
            data[1][i].queryRawatan[0].tampalanAntGkBaru;
          row.getCell(37).value =
            data[1][i].queryRawatan[0].tampalanAntGkSemula;
        }
        row.getCell(38).value =
          data[1][i].queryRawatan[0].tampalanPostGdBaru;
        row.getCell(39).value =
          data[1][i].queryRawatan[0].tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(40).value =
            data[1][i].queryRawatan[0].tampalanPostGkBaru;
          row.getCell(41).value =
            data[1][i].queryRawatan[0].tampalanPostGkSemula;
        }
        row.getCell(42).value =
          data[1][i].queryRawatan[0].tampalanPostAmgGdBaru;
        row.getCell(43).value =
          data[1][i].queryRawatan[0].tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(44).value =
            data[1][i].queryRawatan[0].tampalanPostAmgGkBaru;
          row.getCell(45).value =
            data[1][i].queryRawatan[0].tampalanPostAmgGkSemula;
          row.getCell(46).value =
            data[1][i].queryRawatan[0].inlayOnlayBaru;
          row.getCell(47).value =
            data[1][i].queryRawatan[0].inlayOnlaySemula;
        }
        // skipping cells
        row.getCell(50).value =
          data[1][i].queryRawatan[0].tampalanSementara;
        row.getCell(51).value = data[1][i].queryRawatan[0].cabutanGd;
        row.getCell(52).value = data[1][i].queryRawatan[0].cabutanGk;
        row.getCell(53).value =
          data[1][i].queryRawatan[0].komplikasiSelepasCabutan;
        row.getCell(54).value =
          data[1][i].queryRawatan[0].penskaleran;
        row.getCell(55).value =
          data[1][i].queryRawatan[0].rawatanPerioLain;
        row.getCell(56).value =
          data[1][i].queryRawatan[0].rawatanEndoAnterior;
        row.getCell(57).value =
          data[1][i].queryRawatan[0].rawatanEndoPremolar;
        row.getCell(58).value =
          data[1][i].queryRawatan[0].rawatanEndoMolar;
        row.getCell(59).value =
          data[1][i].queryRawatan[0].rawatanOrtho;
        row.getCell(60).value =
          data[1][i].queryRawatan[0].kesPerubatan;
        row.getCell(61).value = data[1][i].queryRawatan[0].abses;
        row.getCell(62).value =
          data[1][i].queryRawatan[0].kecederaanTulangMuka;
        row.getCell(63).value =
          data[1][i].queryRawatan[0].kecederaanGigi;
        row.getCell(64).value =
          data[1][i].queryRawatan[0].kecederaanTisuLembut;
        row.getCell(65).value =
          data[1][i].queryRawatan[0].cabutanSurgical;
        row.getCell(66).value =
          data[1][i].queryRawatan[0].pembedahanKecilMulut;
        row.getCell(67).value =
          data[1][i].queryRawatan[0].crownBridgeBaru;
        row.getCell(68).value =
          data[1][i].queryRawatan[0].crownBridgeSemula;
        row.getCell(69).value =
          data[1][i].queryRawatan[0].postCoreBaru;
        row.getCell(70).value =
          data[1][i].queryRawatan[0].postCoreSemula;
        row.getCell(71).value =
          data[1][i].queryRawatan[0].prosthodontikPenuhDenturBaru;
        row.getCell(72).value =
          data[1][i].queryRawatan[0].prosthodontikPenuhDenturSemula;
        row.getCell(73).value =
          data[1][i].queryRawatan[0].jumlahPesakitBuatDenturPenuh;
        row.getCell(74).value =
          data[1][i].queryRawatan[0].prosthodontikSeparaDenturBaru;
        row.getCell(75).value =
          data[1][i].queryRawatan[0].prosthodontikSeparaDenturSemula;
        row.getCell(76).value =
          data[1][i].queryRawatan[0].jumlahPesakitBuatDenturSepara;
        row.getCell(77).value =
          data[1][i].queryRawatan[0].immediateDenture;
        row.getCell(78).value =
          data[1][i].queryRawatan[0].pembaikanDenture;
        row.getCell(79).value = data[1][i].queryRawatan[0].kesSelesai;
        row.getCell(80).value =
          data[1][i].queryRawatan[0].xrayDiambil;
        row.getCell(81).value =
          data[1][i].queryRawatan[0].pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[2].length; i++) {
      let row = worksheet.getRow(17 + i);
      if (data[2][i].querySekolah[0]) {
        // pemeriksaan
        row.getCell(2).value +=
          data[2][i].querySekolah[0].kedatanganTahunSemasaBaru;
        row.getCell(4).value += data[2][i].querySekolah[0].jumlahd;
        row.getCell(5).value += data[2][i].querySekolah[0].jumlahf;
        row.getCell(6).value += data[2][i].querySekolah[0].jumlahx;
        row.getCell(7).value += data[2][i].querySekolah[0].jumlahdfx;
        if (i > 1) {
          row.getCell(8).value += data[2][i].querySekolah[0].jumlahD;
          row.getCell(9).value += data[2][i].querySekolah[0].jumlahM;
          row.getCell(10).value += data[2][i].querySekolah[0].jumlahF;
          row.getCell(11).value += data[2][i].querySekolah[0].jumlahX;
          row.getCell(12).value +=
            data[2][i].querySekolah[0].jumlahDMFX;
        }
        row.getCell(13).value += data[2][i].querySekolah[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value +=
            data[2][i].querySekolah[0].statusBebasKaries;
        }
        row.getCell(15).value += data[2][i].querySekolah[0].TPR;
        if (i > 5) {
          row.getCell(16).value +=
            data[2][i].querySekolah[0].skorBPEZero;
          row.getCell(17).value +=
            data[2][i].querySekolah[0].skorBPEMoreThanZero;
        }
        row.getCell(18).value +=
          data[2][i].querySekolah[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value +=
            data[2][i].querySekolah[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitFS;
          row.getCell(22).value +=
            data[2][i].querySekolah[0].perluJumlahGigiFS;
        }
        row.getCell(23).value +=
          data[2][i].querySekolah[0].perluPenskaleran;
        row.getCell(24).value +=
          data[2][i].querySekolah[0].perluEndoAnterior;
        row.getCell(25).value +=
          data[2][i].querySekolah[0].perluEndoPremolar;
        row.getCell(26).value +=
          data[2][i].querySekolah[0].perluEndoMolar;
        if (i > 1) {
          row.getCell(27).value +=
            data[2][i].querySekolah[0].jumlahPerluDenturPenuh;
          row.getCell(28).value +=
            data[2][i].querySekolah[0].jumlahPerluDenturSepara;
        }
        // rawatan
        row.getCell(3).value +=
          data[2][i].querySekolah[0].kedatanganTahunSemasaUlangan;
        row.getCell(29).value +=
          data[2][i].querySekolah[0].sapuanFluorida;
        if (i > 1) {
          row.getCell(30).value +=
            data[2][i].querySekolah[0].jumlahPesakitPrrJenis1;
          row.getCell(31).value +=
            data[2][i].querySekolah[0].jumlahGigiPrrJenis1;
          row.getCell(32).value +=
            data[2][i].querySekolah[0].jumlahPesakitDiBuatFs;
          row.getCell(33).value +=
            data[2][i].querySekolah[0].jumlahGigiDibuatFs;
        }
        row.getCell(34).value +=
          data[2][i].querySekolah[0].tampalanAntGdBaru;
        row.getCell(35).value +=
          data[2][i].querySekolah[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(36).value +=
            data[2][i].querySekolah[0].tampalanAntGkBaru;
          row.getCell(37).value =
            data[2][i].querySekolah[0].tampalanAntGkSemula;
        }
        row.getCell(38).value +=
          data[2][i].querySekolah[0].tampalanPostGdBaru;
        row.getCell(39).value +=
          data[2][i].querySekolah[0].tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(40).value +=
            data[2][i].querySekolah[0].tampalanPostGkBaru;
          row.getCell(41).value +=
            data[2][i].querySekolah[0].tampalanPostGkSemula;
        }
        row.getCell(42).value +=
          data[2][i].querySekolah[0].tampalanPostAmgGdBaru;
        row.getCell(43).value +=
          data[2][i].querySekolah[0].tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(44).value +=
            data[2][i].querySekolah[0].tampalanPostAmgGkBaru;
          row.getCell(45).value +=
            data[2][i].querySekolah[0].tampalanPostAmgGkSemula;
          row.getCell(46).value +=
            data[2][i].querySekolah[0].inlayOnlayBaru;
          row.getCell(47).value +=
            data[2][i].querySekolah[0].inlayOnlaySemula;
        }
        // skipping cells
        row.getCell(50).value +=
          data[2][i].querySekolah[0].tampalanSementara;
        row.getCell(51).value += data[2][i].querySekolah[0].cabutanGd;
        row.getCell(52).value += data[2][i].querySekolah[0].cabutanGk;
        row.getCell(53).value +=
          data[2][i].querySekolah[0].komplikasiSelepasCabutan;
        row.getCell(54).value +=
          data[2][i].querySekolah[0].penskaleran;
        row.getCell(55).value +=
          data[2][i].querySekolah[0].rawatanPerioLain;
        row.getCell(56).value +=
          data[2][i].querySekolah[0].rawatanEndoAnterior;
        row.getCell(57).value +=
          data[2][i].querySekolah[0].rawatanEndoPremolar;
        row.getCell(58).value +=
          data[2][i].querySekolah[0].rawatanEndoMolar;
        row.getCell(59).value +=
          data[2][i].querySekolah[0].rawatanOrtho;
        row.getCell(60).value +=
          data[2][i].querySekolah[0].kesPerubatan;
        row.getCell(61).value += data[2][i].querySekolah[0].abses;
        row.getCell(62).value +=
          data[2][i].querySekolah[0].kecederaanTulangMuka;
        row.getCell(63).value +=
          data[2][i].querySekolah[0].kecederaanGigi;
        row.getCell(64).value +=
          data[2][i].querySekolah[0].kecederaanTisuLembut;
        row.getCell(65).value +=
          data[2][i].querySekolah[0].cabutanSurgical;
        row.getCell(66).value +=
          data[2][i].querySekolah[0].pembedahanKecilMulut;
        row.getCell(67).value +=
          data[2][i].querySekolah[0].crownBridgeBaru;
        row.getCell(68).value +=
          data[2][i].querySekolah[0].crownBridgeSemula;
        row.getCell(69).value +=
          data[2][i].querySekolah[0].postCoreBaru;
        row.getCell(70).value +=
          data[2][i].querySekolah[0].postCoreSemula;
        row.getCell(71).value +=
          data[2][i].querySekolah[0].prosthodontikPenuhDenturBaru;
        row.getCell(72).value +=
          data[2][i].querySekolah[0].prosthodontikPenuhDenturSemula;
        row.getCell(73).value +=
          data[2][i].querySekolah[0].jumlahPesakitBuatDenturPenuh;
        row.getCell(74).value +=
          data[2][i].querySekolah[0].prosthodontikSeparaDenturBaru;
        row.getCell(75).value +=
          data[2][i].querySekolah[0].prosthodontikSeparaDenturSemula;
        row.getCell(76).value +=
          data[2][i].querySekolah[0].jumlahPesakitBuatDenturSepara;
        row.getCell(77).value +=
          data[2][i].querySekolah[0].immediateDenture;
        row.getCell(78).value +=
          data[2][i].querySekolah[0].pembaikanDenture;
        row.getCell(79).value +=
          data[2][i].querySekolah[0].kesSelesai;
        row.getCell(80).value +=
          data[2][i].querySekolah[0].xrayDiambil;
        row.getCell(81).value +=
          data[2][i].querySekolah[0].pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    if (!pilihanIndividu) {
      j = 0;
      for (let i = 0; i < data[3].length; i++) {
        let row = worksheet.getRow(17 + j);
        if (data[3][i].queryOperatorLain[0]) {
          // rawatan
          // row.getCell(3).value += data[3][i].queryOperatorLain[0].kedatanganTahunSemasaUlangan;
          row.getCell(29).value +=
            data[3][i].queryOperatorLain[0].sapuanFluorida;
          if (i > 1) {
            row.getCell(30).value +=
              data[3][i].queryOperatorLain[0].jumlahPesakitPrrJenis1;
            row.getCell(31).value +=
              data[3][i].queryOperatorLain[0].jumlahGigiPrrJenis1;
            row.getCell(32).value +=
              data[3][i].queryOperatorLain[0].jumlahPesakitDiBuatFs;
            row.getCell(33).value +=
              data[3][i].queryOperatorLain[0].jumlahGigiDibuatFs;
          }
          row.getCell(34).value +=
            data[3][i].queryOperatorLain[0].tampalanAntGdBaru;
          row.getCell(35).value +=
            data[3][i].queryOperatorLain[0].tampalanAntGdSemula;
          if (i > 1) {
            row.getCell(36).value +=
              data[3][i].queryOperatorLain[0].tampalanAntGkBaru;
            row.getCell(37).value +=
              data[3][i].queryOperatorLain[0].tampalanAntGkSemula;
          }
          row.getCell(38).value +=
            data[3][i].queryOperatorLain[0].tampalanPostGdBaru;
          row.getCell(39).value +=
            data[3][i].queryOperatorLain[0].tampalanPostGdSemula;
          if (i > 1) {
            row.getCell(40).value +=
              data[3][i].queryOperatorLain[0].tampalanPostGkBaru;
            row.getCell(41).value +=
              data[3][i].queryOperatorLain[0].tampalanPostGkSemula;
          }
          row.getCell(42).value +=
            data[3][i].queryOperatorLain[0].tampalanPostAmgGdBaru;
          row.getCell(43).value +=
            data[3][i].queryOperatorLain[0].tampalanPostAmgGdSemula;
          if (i > 1) {
            row.getCell(44).value +=
              data[3][i].queryOperatorLain[0].tampalanPostAmgGkBaru;
            row.getCell(45).value +=
              data[3][i].queryOperatorLain[0].tampalanPostAmgGkSemula;
            row.getCell(46).value +=
              data[3][i].queryOperatorLain[0].inlayOnlayBaru;
            row.getCell(47).value +=
              data[3][i].queryOperatorLain[0].inlayOnlaySemula;
          }
          // skipping cells
          row.getCell(50).value +=
            data[3][i].queryOperatorLain[0].tampalanSementara;
          row.getCell(51).value +=
            data[3][i].queryOperatorLain[0].cabutanGd;
          row.getCell(52).value +=
            data[3][i].queryOperatorLain[0].cabutanGk;
          row.getCell(53).value +=
            data[3][i].queryOperatorLain[0].komplikasiSelepasCabutan;
          row.getCell(54).value +=
            data[3][i].queryOperatorLain[0].penskaleran;
          row.getCell(55).value +=
            data[3][i].queryOperatorLain[0].rawatanPerioLain;
          row.getCell(56).value +=
            data[3][i].queryOperatorLain[0].rawatanEndoAnterior;
          row.getCell(57).value +=
            data[3][i].queryOperatorLain[0].rawatanEndoPremolar;
          row.getCell(58).value +=
            data[3][i].queryOperatorLain[0].rawatanEndoMolar;
          row.getCell(59).value +=
            data[3][i].queryOperatorLain[0].rawatanOrtho;
          row.getCell(60).value +=
            data[3][i].queryOperatorLain[0].kesPerubatan;
          row.getCell(61).value +=
            data[3][i].queryOperatorLain[0].abses;
          row.getCell(62).value +=
            data[3][i].queryOperatorLain[0].kecederaanTulangMuka;
          row.getCell(63).value +=
            data[3][i].queryOperatorLain[0].kecederaanGigi;
          row.getCell(64).value +=
            data[3][i].queryOperatorLain[0].kecederaanTisuLembut;
          row.getCell(65).value +=
            data[3][i].queryOperatorLain[0].cabutanSurgical;
          row.getCell(66).value +=
            data[3][i].queryOperatorLain[0].pembedahanKecilMulut;
          row.getCell(67).value +=
            data[3][i].queryOperatorLain[0].crownBridgeBaru;
          row.getCell(68).value +=
            data[3][i].queryOperatorLain[0].crownBridgeSemula;
          row.getCell(69).value +=
            data[3][i].queryOperatorLain[0].postCoreBaru;
          row.getCell(70).value +=
            data[3][i].queryOperatorLain[0].postCoreSemula;
          row.getCell(71).value +=
            data[3][
              i
            ].queryOperatorLain[0].prosthodontikPenuhDenturBaru;
          row.getCell(72).value +=
            data[3][
              i
            ].queryOperatorLain[0].prosthodontikPenuhDenturSemula;
          row.getCell(73).value +=
            data[3][
              i
            ].queryOperatorLain[0].jumlahPesakitBuatDenturPenuh;
          row.getCell(74).value +=
            data[3][
              i
            ].queryOperatorLain[0].prosthodontikSeparaDenturBaru;
          row.getCell(75).value +=
            data[3][
              i
            ].queryOperatorLain[0].prosthodontikSeparaDenturSemula;
          row.getCell(76).value +=
            data[3][
              i
            ].queryOperatorLain[0].jumlahPesakitBuatDenturSepara;
          row.getCell(77).value +=
            data[3][i].queryOperatorLain[0].immediateDenture;
          row.getCell(78).value +=
            data[3][i].queryOperatorLain[0].pembaikanDenture;
          row.getCell(79).value +=
            data[3][i].queryOperatorLain[0].kesSelesai;
          row.getCell(80).value +=
            data[3][i].queryOperatorLain[0].xrayDiambil;
          // row.getCell(81).value += data[3][i].queryOperatorLain[0].pesakitDisaringOC;
        }
        j++;
        if (i === 11) {
          j++;
        }
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'CC5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('CC6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'CC7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'CC8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('CC5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('CC6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('CC7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('CC8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'PG207';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG207] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG214 = async (payload) => {
  logger.info('[generateRetenController] PG214');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPG214(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG214.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BULAN');

    worksheet.getCell('J5').value = `BAGI BULAN: ${moment(
      bulan ? bulan : tarikhMula
    )
      .format('MMMM')
      .toUpperCase()}`;
    worksheet.getCell('O5').value = `TAHUN: ${moment().format(
      'YYYY'
    )}`;

    worksheet.getCell('B6').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B7').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('B8').value = `${negeri.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let rowNew;

    for (let i = 0; i < data[0].PG214.length; i++) {
      if (data[0].PG214[i]) {
        switch (data[0].PG214[i]._id) {
          case '60':
            rowNew = worksheet.getRow(13);
            break;
          default:
            break;
        }
      }
      jumlahReten += data[0].PG214[i].jumlahReten;
      jumlahRetenSalah += data[0].PG214[i].statusReten;
      rowNew.getCell(3).value = data[0].PG214[i].jumlahMelayu; //C13	Kategori Umur 60 Tahun
      rowNew.getCell(4).value = data[0].PG214[i].jumlahCina; //D13	Kategori Umur 60 Tahun
      rowNew.getCell(5).value = data[0].PG214[i].jumlahIndia; //E13	Kategori Umur 60 Tahun
      rowNew.getCell(6).value = data[0].PG214[i].jumlahBajau; //F13	Kategori Umur 60 Tahun
      rowNew.getCell(7).value = data[0].PG214[i].jumlahDusun; //G13	Kategori Umur 60 Tahun
      rowNew.getCell(8).value = data[0].PG214[i].jumlahKadazan; //H13 Kategori Umur 60 Tahun
      rowNew.getCell(9).value = data[0].PG214[i].jumlahMurut; //I13	Kategori Umur 60 Tahun
      rowNew.getCell(10).value = data[0].PG214[i].jumlahBMSL; //J13 Kategori Umur 60 Tahun
      rowNew.getCell(11).value = data[0].PG214[i].jumlahMelanau; //K13 Kategori Umur 60 Tahun
      rowNew.getCell(12).value = data[0].PG214[i].jumlahKedayan; //L13 Kategori Umur 60 Tahun
      rowNew.getCell(13).value = data[0].PG214[i].jumlahIban; //M13 Kategori Umur 60 Tahun
      rowNew.getCell(14).value = data[0].PG214[i].jumlahBidayuh; //N13 Kategori Umur 60 Tahun
      rowNew.getCell(15).value = data[0].PG214[i].jumlahPenan; //O13 Kategori Umur 60 Tahun
      rowNew.getCell(16).value = data[0].PG214[i].jumlahBMSwL; //P13 Kategori Umur 60 Tahun
      rowNew.getCell(17).value = data[0].PG214[i].jumlahOAS; //Q13 Kategori Umur 60 Tahun
      rowNew.getCell(18).value = data[0].PG214[i].jumlahLainlain; //R13 Kategori Umur 60 Tahun
      rowNew.getCell(19).value =
        data[0].PG214[i].jumlahBukanWarganegara; //S13 Kategori Umur 60 Tahun
      rowNew.getCell(20).value = data[0].PG214[i].jumlahLelaki; //T13 Kategori Umur 60 Tahun
      rowNew.getCell(21).value = data[0].PG214[i].jumlahPerempuan; //U13 Kategori Umur 60 Tahun
      rowNew.getCell(22).value = data[0].PG214[i].jumlahEdentulous; //V13 Kategori Umur 60 Tahun
      rowNew.getCell(23).value =
        data[0].PG214[i].jumlahGigiLebihAtauSama20; //W13 Kategori Umur 60 Tahun
      rowNew.getCell(24).value = data[0].PG214[i].jumlahGigiKurang20; //X13 Kategori Umur 60 Tahun
      rowNew.getCell(25).value = data[0].PG214[i].jumlahSemuaGigi; //Y13 Kategori Umur 60 Tahun
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i].customPG214[0]) {
        console.log(data[i].customPG214[0]);
        let rowNew = worksheet.getRow(13 + i);
        jumlahReten += data[i].customPG214[0].jumlahReten;
        jumlahRetenSalah += data[i].customPG214[0].statusReten;
        rowNew.getCell(3).value = data[i].customPG214[0].jumlahMelayu; //C13	Kategori Umur 60 Tahun
        rowNew.getCell(4).value = data[i].customPG214[0].jumlahCina; //D13	Kategori Umur 60 Tahun
        rowNew.getCell(5).value = data[i].customPG214[0].jumlahIndia; //E13	Kategori Umur 60 Tahun
        rowNew.getCell(6).value = data[i].customPG214[0].jumlahBajau; //F13	Kategori Umur 60 Tahun
        rowNew.getCell(7).value = data[i].customPG214[0].jumlahDusun; //G13	Kategori Umur 60 Tahun
        rowNew.getCell(8).value =
          data[i].customPG214[0].jumlahKadazan; //H13 Kategori Umur 60 Tahun
        rowNew.getCell(9).value = data[i].customPG214[0].jumlahMurut; //I13	Kategori Umur 60 Tahun
        rowNew.getCell(10).value = data[i].customPG214[0].jumlahBMSL; //J13 Kategori Umur 60 Tahun
        rowNew.getCell(11).value =
          data[i].customPG214[0].jumlahMelanau; //K13 Kategori Umur 60 Tahun
        rowNew.getCell(12).value =
          data[i].customPG214[0].jumlahKedayan; //L13 Kategori Umur 60 Tahun
        rowNew.getCell(13).value = data[i].customPG214[0].jumlahIban; //M13 Kategori Umur 60 Tahun
        rowNew.getCell(14).value =
          data[i].customPG214[0].jumlahBidayuh; //N13 Kategori Umur 60 Tahun
        rowNew.getCell(15).value = data[i].customPG214[0].jumlahPenan; //O13 Kategori Umur 60 Tahun
        rowNew.getCell(16).value = data[i].customPG214[0].jumlahBMSwL; //P13 Kategori Umur 60 Tahun
        rowNew.getCell(17).value = data[i].customPG214[0].jumlahOAS; //Q13 Kategori Umur 60 Tahun
        rowNew.getCell(18).value =
          data[i].customPG214[0].jumlahLainlain; //R13 Kategori Umur 60 Tahun
        rowNew.getCell(19).value =
          data[i].customPG214[0].jumlahBukanWarganegara; //S13 Kategori Umur 60 Tahun
        rowNew.getCell(20).value =
          data[i].customPG214[0].jumlahLelaki; //T13 Kategori Umur 60 Tahun
        rowNew.getCell(21).value =
          data[i].customPG214[0].jumlahPerempuan; //U13 Kategori Umur 60 Tahun
        rowNew.getCell(22).value =
          data[i].customPG214[0].jumlahEdentulous; //V13 Kategori Umur 60 Tahun
        rowNew.getCell(23).value =
          data[i].customPG214[0].jumlahGigiLebihAtauSama20; //W13 Kategori Umur 60 Tahun
        rowNew.getCell(24).value =
          data[i].customPG214[0].jumlahGigiKurang20; //X13 Kategori Umur 60 Tahun
        rowNew.getCell(25).value =
          data[i].customPG214[0].jumlahSemuaGigi; //Y13 Kategori Umur 60 Tahun
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'Z5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('Z6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'Z7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'Z8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('Z5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('Z6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('Z7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('Z8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'PG214';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 1 second
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG214] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePGPR201 = async (payload) => {
  logger.info('[generateRetenController] PGPR201Baru');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPGPR201Baru(payload);
        break;
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PGPR 201_2023.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PGPR201 Pin.1.2022');
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('D6').value = monthName;
    worksheet.getCell('G6').value = yearNow;

    worksheet.getCell('C10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('C9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C8').value = `${negeri.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    let j = 0;
    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(17 + j);
      j++;
      if (data[i][0]) {
        jumlahReten += data[i][0].jumlahReten;
        jumlahRetenSalah += data[i][0].statusReten;
        if (i === 6) {
          let jumlahBesarAG1517 = 0;
          for (let k = 0; k < data.length; k++) {
            if (data[k][0]) {
              jumlahBesarAG1517 += data[k][0].jumlahAGumur1517;
            }
          }
          rowNew.getCell(2).value = jumlahBesarAG1517;
        }
        if (i === 7) {
          let jumlahBesarAG1819 = 0;
          for (let k = 0; k < data.length; k++) {
            if (data[k][0]) {
              jumlahBesarAG1819 += data[k][0].jumlahAGumur1819;
            }
          }
          rowNew.getCell(2).value = jumlahBesarAG1819;
        }
        if (i === 8) {
          let jumlahBesarAG2029 = 0;
          for (let k = 0; k < data.length; k++) {
            if (data[k][0]) {
              jumlahBesarAG2029 += data[k][0].jumlahAGumur2029;
            }
          }
          rowNew.getCell(2).value = jumlahBesarAG2029;
        }
        if (i === 9) {
          let jumlahBesarAG3049 = 0;
          for (let k = 0; k < data.length; k++) {
            if (data[k][0]) {
              jumlahBesarAG3049 += data[k][0].jumlahAGumur3049;
            }
          }
          rowNew.getCell(2).value = jumlahBesarAG3049;
        }
        if (i === 10) {
          let jumlahBesarAG5059 = 0;
          for (let k = 0; k < data.length; k++) {
            if (data[k][0]) {
              jumlahBesarAG5059 += data[k][0].jumlahAGumur5059;
            }
          }
          rowNew.getCell(2).value = jumlahBesarAG5059;
        }
        if (i === 11) {
          let jumlahBesarAG60KeAtas = 0;
          for (let k = 0; k < data.length; k++) {
            if (data[k][0]) {
              jumlahBesarAG60KeAtas +=
                data[k][0].jumlahAGumur60KeAtas;
            }
          }
          rowNew.getCell(2).value = jumlahBesarAG60KeAtas;
        }
        rowNew.getCell(3).value = data[i][0].jumlahLawatanKeRumah; //LMG Ulangan Bawah 1 Tahun
        if (i > 0) {
          rowNew.getCell(4).value =
            data[i][0].jumlahNasihatPergigianIndividu; //Ceramah Baru Bawah 1 Tahun
          rowNew.getCell(5).value =
            data[i][0].jumlahNasihatKesihatanOral; //Ceramah Ulangan Bawah 1 Tahun
          rowNew.getCell(6).value = data[i][0].jumlahNasihatPemakanan; //Kursus Seminar Bengkel Bawah 1 Tahun
          rowNew.getCell(7).value =
            data[i][0].jumlahNasihatKanserMulut; //Main Peranan Bawah 1 Tahun
          rowNew.getCell(8).value = data[i][0].pertunjukanBoneka; //Pertunjukan Boneka Bawah 1 Tahun
          rowNew.getCell(8).value = data[i][0].bercerita; //Bercerita Bawah 1 Tahun
          rowNew.getCell(10).value = data[i][0].kanserMulut; //Kanser Mulut Bawah 1 Tahun
        }
      }
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'J8'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('J9').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'J10'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'J11'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('J8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('J9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('J10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('J11').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGPR201] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePgPro01 = async (payload) => {
  logger.info('[generateRetenController] makePgPro01');
  try {
    let {
      username,
      pilihanIndividu,
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPGPro01(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PGPRO 01_2023_Kod Program.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet(
      'INDIVIDU_PGPRO01 BARU_FFR_Kod P'
    );
    //
    if (pilihanIndividu) {
      const mdcMdtbPicker = () => {
        if (/^MDTB/.test(pilihanIndividu)) {
          return {
            mdtbNumber: pilihanIndividu,
          };
        } else {
          return {
            mdcNumber: pilihanIndividu,
          };
        }
      };
      const query = mdcMdtbPicker();
      const currentIndividu = await Operator.findOne(query)
        .select('nama')
        .lean();
      worksheet.getCell(
        'D11'
      ).value = `${currentIndividu.nama.toUpperCase()}`;
    }
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('N6').value = monthName.toUpperCase();
    worksheet.getCell('S6').value = yearNow;

    worksheet.getCell('AQ6').value = monthName.toUpperCase();
    worksheet.getCell('AV6').value = yearNow;

    worksheet.getCell('D8').value = negeri.toUpperCase();
    worksheet.getCell('D9').value = daerah.toUpperCase();
    worksheet.getCell('D10').value = klinik.toUpperCase();

    let rowNew;

    // for ulangan kumpulan sasaran
    const kodSpesial = new Set([
      'PRO6001',
      'PRO6002',
      'PRO6003',
      'PRO6004',
      'PRO6005',
      'PRO6006',
      'PRO6007',
    ]);

    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        switch (data[i]._id) {
          case 'PRO1001':
            rowNew = worksheet.getRow(19);
            break;
          case 'PRO1002':
            rowNew = worksheet.getRow(20);
            break;
          case 'PRO1003':
            rowNew = worksheet.getRow(21);
            break;
          case 'PRO1004':
            rowNew = worksheet.getRow(22);
            break;
          case 'PRO1005':
            rowNew = worksheet.getRow(23);
            break;
          case 'PRO1006':
            rowNew = worksheet.getRow(24);
            break;
          case 'PRO1007':
            rowNew = worksheet.getRow(25);
            break;
          case 'PRO1008':
            rowNew = worksheet.getRow(26);
            break;
          case 'PRO1009':
            rowNew = worksheet.getRow(27);
            break;
          case 'PRO1010':
            rowNew = worksheet.getRow(28);
            break;
          case 'PRO1011':
            rowNew = worksheet.getRow(29);
            break;
          case 'PRO1012':
            rowNew = worksheet.getRow(30);
            break;
          case 'PRO1013':
            rowNew = worksheet.getRow(31);
            break;
          case 'PRO1014':
            rowNew = worksheet.getRow(32);
            break;
          case 'PRO1015':
            rowNew = worksheet.getRow(33);
            break;
          case 'PRO1016':
            rowNew = worksheet.getRow(34);
            break;
          case 'PRO1017':
            rowNew = worksheet.getRow(35);
            break;
          case 'PRO1018':
            rowNew = worksheet.getRow(36);
            break;
          case 'PRO1019':
            rowNew = worksheet.getRow(37);
            break;
          case 'PRO1020':
            rowNew = worksheet.getRow(38);
            break;
          case 'PRO1021':
            rowNew = worksheet.getRow(39);
            break;
          case 'PRO1022':
            rowNew = worksheet.getRow(40);
            break;
          case 'PRO2001':
            rowNew = worksheet.getRow(42);
            break;
          case 'PRO2002':
            rowNew = worksheet.getRow(43);
            break;
          case 'PRO2003':
            rowNew = worksheet.getRow(44);
            break;
          case 'PRO3001':
            rowNew = worksheet.getRow(46);
            break;
          case 'PRO3002':
            rowNew = worksheet.getRow(47);
            break;
          case 'PRO3003':
            rowNew = worksheet.getRow(48);
            break;
          case 'PRO3004':
            rowNew = worksheet.getRow(49);
            break;
          case 'PRO3005':
            rowNew = worksheet.getRow(50);
            break;
          case 'PRO4001':
            rowNew = worksheet.getRow(52);
            break;
          case 'PRO5001':
            rowNew = worksheet.getRow(54);
            break;
          case 'PRO5002':
            rowNew = worksheet.getRow(55);
            break;
          case 'PRO5003':
            rowNew = worksheet.getRow(56);
            break;
          case 'PRO5004':
            rowNew = worksheet.getRow(57);
            break;
          case 'PRO5005':
            rowNew = worksheet.getRow(58);
            break;
          case 'PRO6001':
            rowNew = worksheet.getRow(60);
            break;
          case 'PRO6002':
            rowNew = worksheet.getRow(61);
            break;
          case 'PRO6003':
            rowNew = worksheet.getRow(62);
            break;
          case 'PRO6004':
            rowNew = worksheet.getRow(63);
            break;
          case 'PRO6005':
            rowNew = worksheet.getRow(64);
            break;
          case 'PRO6006':
            rowNew = worksheet.getRow(65);
            break;
          case 'PRO6007':
            rowNew = worksheet.getRow(66);
            break;
          case 'PRO7001':
            rowNew = worksheet.getRow(68);
            break;
          case 'PRO7002':
            rowNew = worksheet.getRow(69);
            break;
          case 'PRO7003':
            rowNew = worksheet.getRow(70);
            break;
          case 'PRO8001':
            rowNew = worksheet.getRow(72);
            break;
          case 'PRO8002':
            rowNew = worksheet.getRow(73);
            break;
          case 'PRO8003':
            rowNew = worksheet.getRow(74);
            break;
          case 'PRO8004':
            rowNew = worksheet.getRow(75);
            break;
          case 'PRO8005':
            rowNew = worksheet.getRow(76);
            break;
          case 'PRO8006':
            rowNew = worksheet.getRow(77);
            break;
          case 'PRO8007':
            rowNew = worksheet.getRow(78);
            break;
          case 'PRO8008':
            rowNew = worksheet.getRow(79);
            break;
          case 'PRO8009':
            rowNew = worksheet.getRow(80);
            break;
          case 'PRO8010':
            rowNew = worksheet.getRow(81);
            break;
          case 'PRO8011':
            rowNew = worksheet.getRow(82);
            break;
          default:
            console.log('no match');
        }
        rowNew.getCell(5).value = data[i].jumlahAktivitiCeramahBaru; //C15
        rowNew.getCell(6).value = data[i].jumlahPesertaCeramahBaru; //D15
        if (kodSpesial.has(data[i]._id)) {
          rowNew.getCell(7).value =
            data[i].jumlahAktivitiCeramahUlangan; //E15
          rowNew.getCell(8).value =
            data[i].jumlahPesertaCeramahUlangan; //F15
        }
        rowNew.getCell(9).value = data[i].jumlahAktivitiBaruLMG; //G15
        rowNew.getCell(10).value = data[i].jumlahPesertaBaruLMG; //H15
        if (kodSpesial.has(data[i]._id)) {
          rowNew.getCell(11).value = data[i].jumlahAktivitiUlanganLMG; //I15
          rowNew.getCell(12).value = data[i].jumlahPesertaUlanganLMG; //J15
        }
        rowNew.getCell(13).value =
          data[i].jumlahAktivitiPerananKempen; //K15
        rowNew.getCell(14).value = data[i].jumlahPesertaPerananKempen; //L15
        rowNew.getCell(15).value = data[i].jumlahAktivitiBoneka; //M15
        rowNew.getCell(16).value = data[i].jumlahPesertaBoneka; //N15
        rowNew.getCell(17).value = data[i].jumlahAktivitiPeranan; //O15
        rowNew.getCell(18).value = data[i].jumlahPesertaPeranan; //P15
        rowNew.getCell(19).value = data[i].jumlahAktivitiBercerita; //Q15
        rowNew.getCell(20).value = data[i].jumlahPesertaBercerita; //R15
        rowNew.getCell(21).value = data[i].jumlahAktivitiPertandingan; //S15
        rowNew.getCell(22).value = data[i].jumlahPesertaPertandingan; //T15
        rowNew.getCell(23).value = data[i].jumlahAktivitiInteraktif; //U15
        rowNew.getCell(24).value = data[i].jumlahPesertaInteraktif; //V15
        rowNew.getCell(25).value =
          data[i].jumlahAktivitiKursusSeminarBengkel; //W15
        rowNew.getCell(26).value =
          data[i].jumlahPesertaKursusSeminarBengkel; //X15
        rowNew.getCell(27).value = data[i].jumlahAktivitiMultimedia; //Y15
        rowNew.getCell(28).value = data[i].jumlahPesertaMultimedia; //Z15
        rowNew.getCell(29).value =
          data[i].jumlahAktivitiDentalBuskers; //AA15
        rowNew.getCell(30).value = data[i].jumlahPesertaDentalBuskers; //AB15
        rowNew.getCell(31).value = data[i].jumlahAktivitiFlashMob; //AC15
        rowNew.getCell(32).value = data[i].jumlahPesertaFlashMob; //AD15
        rowNew.getCell(33).value = data[i].jumlahAktivitiLawatanRumah; //AE15
        rowNew.getCell(34).value = data[i].jumlahPesertaLawatanRumah; //AF15
        rowNew.getCell(35).value = data[i].jumlahAktivitiPlaqueOHE; //AG15
        rowNew.getCell(36).value = data[i].jumlahPesertaPlaqueOHE; //AH15
        rowNew.getCell(37).value = data[i].jumlahAktivitiOHI; //AI15
        rowNew.getCell(38).value = data[i].jumlahPesertaOHI; //AJ15
        rowNew.getCell(39).value = data[i].jumlahAktivitiDietAdvice; //AK15
        rowNew.getCell(40).value = data[i].jumlahPesertaDietAdvice; //AL15
        rowNew.getCell(41).value =
          data[i].jumlahAktivitiKanserMulutOHE; //AM15
        rowNew.getCell(42).value =
          data[i].jumlahPesertaKanserMulutOHE; //AN15
        rowNew.getCell(43).value = data[i].jumlahAKtivitiHentiRokok; //AO15
        rowNew.getCell(44).value = data[i].jumlahPesertaHentiRokok; //AP15
        rowNew.getCell(45).value = data[i].jumlahAktivitiHentiSirih; //AQ15
        rowNew.getCell(46).value = data[i].jumlahPesertaHentiSirih; //AR15
        rowNew.getCell(47).value = data[i].jumlahAktivitiHentiAlkohol; //AS15
        rowNew.getCell(48).value = data[i].jumlahPesertaHentiAlkohol; //AT15
        rowNew.getCell(49).value =
          data[i].jumlahAktivitiHentiTabiatLain; //AU15
        rowNew.getCell(50).value =
          data[i].jumlahPesertaHentiTabiatLain; //AV15
        rowNew.getCell(53).value = data[i].jumlahAktivitiTelevisyen; //AY15 // cells skipped
        rowNew.getCell(54).value = data[i].jumlahPesertaTelevisyen; //AZ15
        rowNew.getCell(55).value = data[i].jumlahAktivitiRadio; //BA15
        rowNew.getCell(56).value = data[i].jumlahPesertaRadio; //BB15
        rowNew.getCell(57).value = data[i].jumlahAktivitiCetak; //BC15
      }
    }

    worksheet.getCell(
      'BG9'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('BG10').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'BG11'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('BG9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('BG10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('BG11').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGPRO01] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePgPro01Combined = async (payload) => {
  logger.info('[generateRetenController] makePgPro01Combined');
  try {
    let {
      username,
      pilihanIndividu,
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countPGPro01Combined(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PGPRO 01_2023_FFR.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet(
      'INDIVIDU_PGPRO 01 BARU_FFR'
    );
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('L6').value = monthName.toUpperCase();
    worksheet.getCell('Q6').value = yearNow;

    worksheet.getCell('AO6').value = monthName.toUpperCase();
    worksheet.getCell('AT6').value = yearNow;

    if (pilihanIndividu) {
      const mdcMdtbPicker = () => {
        if (/^MDTB/.test(pilihanIndividu)) {
          return {
            mdtbNumber: pilihanIndividu,
          };
        } else {
          return {
            mdcNumber: pilihanIndividu,
          };
        }
      };
      const query = mdcMdtbPicker();
      const currentIndividu = await Operator.findOne(query)
        .select('nama')
        .lean();
      worksheet.getCell(
        'E11'
      ).value = `${currentIndividu.nama.toUpperCase()}`;
    }

    worksheet.getCell('E8').value = negeri.toUpperCase();
    worksheet.getCell('E9').value = daerah.toUpperCase();
    worksheet.getCell('E10').value = klinik.toUpperCase();

    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(19 + i);
      if (data[i]) {
        rowNew.getCell(3).value = data[i].jumlahAktivitiCeramahBaru; //C15
        rowNew.getCell(4).value = data[i].jumlahPesertaCeramahBaru; //D15
        if (i > 8 && i < 16) {
          rowNew.getCell(5).value =
            data[i].jumlahAktivitiCeramahUlangan; //E15
          rowNew.getCell(6).value =
            data[i].jumlahPesertaCeramahUlangan; //F15
        }
        rowNew.getCell(7).value = data[i].jumlahAktivitiBaruLMG; //G15
        rowNew.getCell(8).value = data[i].jumlahPesertaBaruLMG; //H15
        if (i > 8 && i < 16) {
          rowNew.getCell(9).value = data[i].jumlahAktivitiUlanganLMG; //I15
          rowNew.getCell(10).value = data[i].jumlahPesertaUlanganLMG; //J15
        }
        rowNew.getCell(11).value =
          data[i].jumlahAktivitiPerananKempen; //K15
        rowNew.getCell(12).value = data[i].jumlahPesertaPerananKempen; //L15
        rowNew.getCell(13).value = data[i].jumlahAktivitiBoneka; //M15
        rowNew.getCell(14).value = data[i].jumlahPesertaBoneka; //N15
        rowNew.getCell(15).value = data[i].jumlahAktivitiPeranan; //O15
        rowNew.getCell(16).value = data[i].jumlahPesertaPeranan; //P15
        rowNew.getCell(17).value = data[i].jumlahAktivitiBercerita; //Q15
        rowNew.getCell(18).value = data[i].jumlahPesertaBercerita; //R15
        rowNew.getCell(19).value = data[i].jumlahAktivitiPertandingan; //S15
        rowNew.getCell(20).value = data[i].jumlahPesertaPertandingan; //T15
        rowNew.getCell(21).value = data[i].jumlahAktivitiInteraktif; //U15
        rowNew.getCell(22).value = data[i].jumlahPesertaInteraktif; //V15
        rowNew.getCell(23).value =
          data[i].jumlahAktivitiKursusSeminarBengkel; //W15
        rowNew.getCell(24).value =
          data[i].jumlahPesertaKursusSeminarBengkel; //X15
        rowNew.getCell(25).value = data[i].jumlahAktivitiMultimedia; //Y15
        rowNew.getCell(26).value = data[i].jumlahPesertaMultimedia; //Z15
        rowNew.getCell(27).value =
          data[i].jumlahAktivitiDentalBuskers; //AA15
        rowNew.getCell(28).value = data[i].jumlahPesertaDentalBuskers; //AB15
        rowNew.getCell(29).value = data[i].jumlahAktivitiFlashMob; //AC15
        rowNew.getCell(30).value = data[i].jumlahPesertaFlashMob; //AD15
        rowNew.getCell(31).value = data[i].jumlahAktivitiLawatanRumah; //AE15
        rowNew.getCell(32).value = data[i].jumlahPesertaLawatanRumah; //AF15
        rowNew.getCell(33).value = data[i].jumlahAktivitiPlaqueOHE; //AG15
        rowNew.getCell(34).value = data[i].jumlahPesertaPlaqueOHE; //AH15
        rowNew.getCell(35).value = data[i].jumlahAktivitiOHI; //AI15
        rowNew.getCell(36).value = data[i].jumlahPesertaOHI; //AJ15
        rowNew.getCell(37).value = data[i].jumlahAktivitiDietAdvice; //AK15
        rowNew.getCell(38).value = data[i].jumlahPesertaDietAdvice; //AL15
        rowNew.getCell(39).value =
          data[i].jumlahAktivitiKanserMulutOHE; //AM15
        rowNew.getCell(40).value =
          data[i].jumlahPesertaKanserMulutOHE; //AN15
        rowNew.getCell(41).value = data[i].jumlahAKtivitiHentiRokok; //AO15
        rowNew.getCell(42).value = data[i].jumlahPesertaHentiRokok; //AP15
        rowNew.getCell(43).value = data[i].jumlahAktivitiHentiSirih; //AQ15
        rowNew.getCell(44).value = data[i].jumlahPesertaHentiSirih; //AR15
        rowNew.getCell(45).value = data[i].jumlahAktivitiHentiAlkohol; //AS15
        rowNew.getCell(46).value = data[i].jumlahPesertaHentiAlkohol; //AT15
        rowNew.getCell(47).value =
          data[i].jumlahAktivitiHentiTabiatLain; //AU15
        rowNew.getCell(48).value =
          data[i].jumlahPesertaHentiTabiatLain; //AV15
        rowNew.getCell(51).value = data[i].jumlahAktivitiTelevisyen; //AY15
        rowNew.getCell(52).value = data[i].jumlahPesertaTelevisyen; //AZ15
        rowNew.getCell(53).value = data[i].jumlahAktivitiRadio; //BA15
        rowNew.getCell(54).value = data[i].jumlahPesertaRadio; //BB15
        rowNew.getCell(55).value = data[i].jumlahAktivitiCetak; //BC15
      }
    }

    worksheet.getCell(
      'BE9'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('BE10').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'BE11'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('BE9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('BE10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('BE11').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGPRO01Combined] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG201P2 = async (payload) => {
  logger.info('[generateRetenController] PG201 Pind. 2/2022 ');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPG201P2(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG201_P2_2022.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    //get worksheet
    let worksheet = workbook.getWorksheet('PG201');
    //Find Month and Year at the moment
    const monthName = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    const yearNow = moment(new Date()).format('YYYY');
    //write bulan and sesi at the moment
    // let details = worksheet.getRow(5);
    // details.getCell(
    //   2
    // ).value = `BAGI BULAN      ${monthName.toUpperCase()}         SESI      ${yearNow}`;
    // write facility
    let intro1 = worksheet.getRow(7);
    intro1.getCell(4).value = `${klinik.toUpperCase()}`;
    //Write Sekolah/Tadika:
    // let intro2 = worksheet.getRow(8);
    // intro2.getCell(4).value = `${namaFasilitiTaskaTadika.toUpperCase()}`;
    // write pegawai:
    // let intro7 = worksheet.getRow(9);
    // intro7.getCell(2).value = `${pegawai.toUpperCase()}`;
    // write negeri
    // let intro3 = worksheet.getRow(8);
    // intro3.getCell(2).value = `${negeri.toUpperCase()}`;
    // end intro

    // write data
    let rowNumber = 18;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    const rowsToIncrement = [2, 9];

    for (let i = 0; i < data.length; i++) {
      // let rowNew = worksheet.getRow(16 + i);
      console.log(`array ${i}. row ${rowNumber}`);
      if (data[i][0]) {
        console.log(`we have data`);
        console.log(
          data[i][0].jumlahReten,
          data[i][0].jumlahRetenSalah
        );
        jumlahReten += data[i][0].jumlahReten;
        jumlahRetenSalah += data[i][0].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        switch (i) {
          case 0:
            worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
              .enrolmen5Tahun
              ? data[0][0].enrolmen5Tahun
              : 'BELUM DIISI'; //column C (3)
            break;
          case 1:
            worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
              .enrolmen6Tahun
              ? data[0][0].enrolmen6Tahun
              : 'BELUM DIISI'; //column C (3)
            break;
          default:
            break;
        }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value =
          data[i][0].engganKedatangan; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value =
          data[i][0].tidakHadirKehadiran; //column E (5)
        worksheet.getRow(rowNumber).getCell(6).value =
          data[i][0].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value =
          data[i][0].kedatanganTahunSemasaUlangan; //Column G (7)

        //Kebersihan Mulut
        worksheet.getRow(rowNumber).getCell(8).value =
          data[i][0].skorPlakA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value =
          data[i][0].skorPlakC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value =
          data[i][0].skorPlakE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value =
          data[i][0].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value =
          data[i][0].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value =
          data[i][0].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value =
          data[i][0].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(15).value =
          data[i][0].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(15).value =
          data[i][0].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value =
          data[i][0].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value =
          data[i][0].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value =
          data[i][0].dfxSamaKosong; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value =
          data[i][0].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value =
          data[i][0].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(24).value =
          data[i][0].gigiKekalDMFXsamaAtauKurangDari3; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value =
          data[i][0].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value =
          data[i][0].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value =
          data[i][0].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(28).value =
          data[i][0].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value =
          data[i][0].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value =
          data[i][0].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value =
          data[i][0].skorGIS3; //Column AE (31)

        worksheet.getRow(rowNumber).getCell(32).value =
          data[i][0].skorBPE0; //Column AF (32)
        worksheet.getRow(rowNumber).getCell(33).value =
          data[i][0].skorBPE1; //Column AG (33)
        worksheet.getRow(rowNumber).getCell(34).value =
          data[i][0].skorBPE2; //Column AH (34)
        worksheet.getRow(rowNumber).getCell(35).value =
          data[i][0].skorBPE3; //Column AI (35)
        worksheet.getRow(rowNumber).getCell(36).value =
          data[i][0].skorBPE4; //Column AJ (36)

        worksheet.getRow(rowNumber).getCell(37).value =
          data[i][0].jumlahTPRmmi; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value =
          data[i][0].jumlahTPRbiasa; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value =
          data[i][0].jumlahKecederaanTulangMuka; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value =
          data[i][0].jumlahKecederaanGigi; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value =
          data[i][0].jumlahKecederaanTisuLembut; //Column AO (41)

        worksheet.getRow(rowNumber).getCell(42).value =
          data[i][0].jumlahPatientAdaTSL; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value =
          data[i][0].jumlahCleftMurid; //Column AQ (43)
        worksheet.getRow(rowNumber).getCell(44).value =
          data[i][0].jumlahCleftDirujuk; //Column AR (44)

        //rAWATAN PERLU DIBUAT
        worksheet.getRow(rowNumber).getCell(45).value =
          data[i][0].perluSapuanFluoridaBilMurid; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value =
          data[i][0].perluPrrJenis1BilMurid; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value =
          data[i][0].perluPrrJenis1BilGigi; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(48).value =
          data[i][0].perluFissureSealantBilMurid; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value =
          data[i][0].perluFissureSealantBilGigi; //Column AW (49)

        //BELUM ADA VALUE LAGI (COMMENT OUT DULU)
        // worksheet.getRow(rowNumber).getCell(50).value = data[i][0].jumlahGigiPerluTampalanAntGdBaru; //Column AX (50)
        // worksheet.getRow(rowNumber).getCell(51).value = data[i][0].jumlahGigiPerluTampalanAntGdSemula; //Column AY (51)
        // worksheet.getRow(rowNumber).getCell(52).value = data[i][0].jumlahGigiPerluTampalanAntGkBaru; //Column AZ (52)
        // worksheet.getRow(rowNumber).getCell(53).value = data[i][0].jumlahGigiPerluTampalanAntGkSemula; //Column BA (53)

        // worksheet.getRow(rowNumber).getCell(54).value = data[i][0].jumlahGigiPerluTampalanPostGdBaru; //Column BB (54)
        // worksheet.getRow(rowNumber).getCell(55).value = data[i][0].jumlahGigiPerluTampalanPostGdSemula; //Column BC (55)
        // worksheet.getRow(rowNumber).getCell(56).value = data[i][0].jumlahGigiPerluTampalanPostGkBaru; //Column BD (56)
        // worksheet.getRow(rowNumber).getCell(57).value = data[i][0].jumlahGigiPerluTampalanPostGkSemula; //Column BE (57)

        // worksheet.getRow(rowNumber).getCell(58).value = data[i][0].jumlahGigiPerluTampalanPostAmgGdBaru; //Column BF (58)
        // worksheet.getRow(rowNumber).getCell(59).value = data[i][0].jumlahGigiPerluTampalanPostAmgGdSemula; //Column BG (59)
        // worksheet.getRow(rowNumber).getCell(60).value = data[i][0].jumlahGigiPerluTampalanPostAmgGkBaru; //Column BH (60)
        // worksheet.getRow(rowNumber).getCell(61).value = data[i][0].jumlahGigiPerluTampalanPostAmgGkSemula; //Column BI (61)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(62).value =
          data[i][0].telahSapuanFluoridaBilMurid; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(63).value =
          data[i][0].telahPrrJenis1BilMurid; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(64).value =
          data[i][0].telahPrrJenis1BilGigi; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(65).value =
          data[i][0].telahFissureSealantBilMurid; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(66).value =
          data[i][0].telahFissureSealantBilGigi; //Column BN (66)

        worksheet.getRow(rowNumber).getCell(67).value =
          data[i][0].jumlahGigiTelahDibuatTampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(68).value =
          data[i][0].jumlahGigiTelahDibuatTampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(69).value =
          data[i][0].jumlahGigiTelahDibuatTampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(70).value =
          data[i][0].jumlahGigiTelahDibuatTampalanAntGkSemula; //Column BR (70)

        worksheet.getRow(rowNumber).getCell(71).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(72).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(73).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(74).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostGkSemula; //Column BV (74)

        worksheet.getRow(rowNumber).getCell(75).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostAmgGdBaru; //Column BW (75)
        worksheet.getRow(rowNumber).getCell(76).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostAmgGdSemula; //Column BX (76)
        worksheet.getRow(rowNumber).getCell(77).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostAmgGkBaru; //Column BY (77)
        worksheet.getRow(rowNumber).getCell(78).value =
          data[i][0].jumlahGigiTelahDibuatTampalanPostAmgGkSemula; //Column BZ (78)

        worksheet.getRow(rowNumber).getCell(81).value =
          data[i][0].jumlahGigiTelahDibuatTampalanSementara; //Column CC (81)
        worksheet.getRow(rowNumber).getCell(82).value =
          data[i][0].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value =
          data[i][0].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value =
          data[i][0].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value =
          data[i][0].jumlahKesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value =
          data[i][0].jumlahKesSelesaiBiasa; //Column CH (86)
      }
      rowNumber += rowsToIncrement.includes(i) ? 2 : 1;
      console.log(`row number now is ${rowNumber}`);
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'CJ2'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('CJ3').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'CJ4'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'CJ5'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('CJ2').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('CJ3').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('CJ4').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('CJ5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'PG201P2';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG201P2] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePGS203P2 = async (payload) => {
  logger.info('[generateRetenController] PGS203P2');
  try {
    let {
      klinik,
      daerah,
      negeri,
      bulan,
      tarikhMula,
      tarikhAkhir,
      pegawai,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPGS203(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PGS203.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    //get worksheet
    let worksheet = workbook.getWorksheet('PGS203');
    const monthName = moment(bulan ?? tarikhMula).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('AB5').value = `${monthName.toUpperCase()}`;
    worksheet.getCell('AI5').value = `${yearNow}`;
    // write facility
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      worksheet.getCell(
        'B6'
      ).value = `${currentKlinik.kp.toUpperCase()}`;
    } else {
      worksheet.getCell('B6').value = `${klinik.toUpperCase()}`;
    }
    // write daerah
    worksheet.getCell('B7').value = `${daerah.toUpperCase()}`;
    // write negeri
    worksheet.getCell('B8').value = `${negeri.toUpperCase()}`;
    // end intro

    // write data
    let rowNumber = 16;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    const rowsToIncrement = [1, 6, 10, 14, 18, 23, 27, 31];

    for (let i = 0; i < data.length; i++) {
      // let rowNew = worksheet.getRow(16 + i);
      console.log(`array ${i}. row ${rowNumber}`);
      if (data[i][0]) {
        console.log(`we got data in this array`);
        jumlahReten += data[i][0].jumlahReten;
        jumlahRetenSalah += data[i][0].jumlahRetenSalah;
        switch (i) {
          case 0:
            worksheet.getRow(rowNumber).getCell(3).value =
              data[0][0].Kerajaan ?? 'BELUM DIISI';
            worksheet.getRow(rowNumber + 1).getCell(3).value =
              data[0][0].Swasta ?? 'BELUM DIISI';
            break;
          default:
            break;
        }
        worksheet.getRow(rowNumber).getCell(4).value =
          data[i][0].kedatanganTahunSemasaBaru; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value =
          data[i][0].kedatanganTahunSemasaUlangan; //column E (5)

        worksheet.getRow(rowNumber).getCell(6).value =
          data[i][0].jumlahd; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value =
          data[i][0].jumlahf; //Column G (7)
        worksheet.getRow(rowNumber).getCell(8).value =
          data[i][0].jumlahx; //Column F (8)

        worksheet.getRow(rowNumber).getCell(11).value =
          data[i][0].jumlahE; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value =
          data[i][0].jumlahD; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value =
          data[i][0].jumlahM; //Column M (13)
        worksheet.getRow(rowNumber).getCell(14).value =
          data[i][0].jumlahF; //Column N (14)
        worksheet.getRow(rowNumber).getCell(15).value =
          data[i][0].jumlahX; //Column O (15)

        worksheet.getRow(rowNumber).getCell(18).value =
          data[i][0].dfxSamaKosong; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value =
          data[i][0].jumlahMBK; //Column S (19)

        worksheet.getRow(rowNumber).getCell(20).value =
          data[i][0].statusBebasKaries; //Column T (20)
        worksheet.getRow(rowNumber).getCell(21).value =
          data[i][0].xTambahMsamaKosong; //Column U (21)

        worksheet.getRow(rowNumber).getCell(22).value =
          data[i][0].eLebihAtauSamaDenganSatu; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value =
          data[i][0].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column W (23)

        worksheet.getRow(rowNumber).getCell(24).value =
          data[i][0].skorGIS0; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value =
          data[i][0].skorGIS1; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value =
          data[i][0].skorGIS2; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value =
          data[i][0].skorGIS3; //Column AA (27)

        if (i > 10) {
          // nnt kena ubah dah masuk sekolah
          worksheet.getRow(rowNumber).getCell(28).value =
            data[i][0].skorBPE0; //Column AB (28)
          worksheet.getRow(rowNumber).getCell(29).value =
            data[i][0].skorBPE1; //Column AC (29)
          worksheet.getRow(rowNumber).getCell(30).value =
            data[i][0].skorBPE2; //Column AD (30)
          worksheet.getRow(rowNumber).getCell(31).value =
            data[i][0].skorBPE3; //Column AE (31)
          worksheet.getRow(rowNumber).getCell(32).value =
            data[i][0].skorBPE4; //Column AF (32)
        }

        worksheet.getRow(rowNumber).getCell(33).value =
          data[i][0].jumlahTPR; //Column AG (33)
        worksheet.getRow(rowNumber).getCell(34).value =
          data[i][0].perluSapuanFluorida; //Column AH (34)
        worksheet.getRow(rowNumber).getCell(35).value =
          data[i][0].perluJumlahPesakitPrrJenis1; //Column AI (35)
        worksheet.getRow(rowNumber).getCell(36).value =
          data[i][0].perluJumlahGigiPrrJenis1; //Column AJ (36)
        worksheet.getRow(rowNumber).getCell(37).value =
          data[i][0].perluJumlahPesakitFS; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value =
          data[i][0].perluJumlahGigiFS; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value =
          data[i][0].telahSapuanFluorida; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value =
          data[i][0].jumlahPesakitPrrJenis1; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value =
          data[i][0].jumlahGigiPrrJenis1; //Column AO (41)
        worksheet.getRow(rowNumber).getCell(42).value =
          data[i][0].jumlahPesakitDiBuatFs; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value =
          data[i][0].jumlahGigiDibuatFs; //Column AQ (43)

        worksheet.getRow(rowNumber).getCell(44).value =
          data[i][0].tampalanAntGdBaru; //Column AR (44)
        worksheet.getRow(rowNumber).getCell(45).value =
          data[i][0].tampalanAntGdSemula; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value =
          data[i][0].tampalanAntGkBaru; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value =
          data[i][0].tampalanAntGkSemula; //Column AU (47)

        worksheet.getRow(rowNumber).getCell(48).value =
          data[i][0].tampalanPostGdBaru; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value =
          data[i][0].tampalanPostGdSemula; //Column AW (49)
        worksheet.getRow(rowNumber).getCell(50).value =
          data[i][0].tampalanPostGkBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value =
          data[i][0].tampalanPostGkSemula; //Column AY (51)

        worksheet.getRow(rowNumber).getCell(52).value =
          data[i][0].tampalanPostAmgGdBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value =
          data[i][0].tampalanPostAmgGdSemula; //Column BA (53)
        worksheet.getRow(rowNumber).getCell(54).value =
          data[i][0].tampalanPostAmgGkBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value =
          data[i][0].tampalanPostAmgGkSemula; //Column BC (55)

        worksheet.getRow(rowNumber).getCell(58).value =
          data[i][0].cabutanGd; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value =
          data[i][0].cabutanGk; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(61).value =
          data[i][0].penskaleran; //Column BI (61)
        worksheet.getRow(rowNumber).getCell(62).value =
          data[i][0].kesSelesai; //Column BJ (62)
        switch (i) {
          case 0:
            worksheet.getRow(rowNumber).getCell(64).value =
              data[0][0].jumlahTastadKerajaan ?? 0; //Column BL (64)
            break;
          case 1:
            worksheet.getRow(rowNumber).getCell(64).value =
              data[0][0].jumlahTastadSwasta ?? 0; //Column BL (64)
            break;
          default:
            break;
        }
        if (i < 3) {
          worksheet.getRow(rowNumber).getCell(65).value =
            data[0][0].jumlahFasilitiDilawati.length ?? 0; //Column BM (65)
        }
      }
      rowNumber += rowsToIncrement.includes(i) ? 2 : 1;
      console.log(`row number now is ${rowNumber}`);
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'BP4'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('BP5').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'BP6'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'BP7'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('BP4').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('BP5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('BP6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('BP7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'PGS203';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGS203P2] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeMasa = async (payload) => {
  logger.info('[generateRetenController] makeMasa');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pegawai,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countMasa(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'MASA.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    // get first worksheet
    let worksheet = workbook.getWorksheet(
      'LAMPIRAN 2 - MAKLUMAT TAMBAHAN'
    );
    // write facility
    let intro3 = worksheet.getCell('B5');
    intro3.value = `${klinik.toUpperCase()}`;
    // write daerah
    let intro4 = worksheet.getCell('B4');
    intro4.value = `${daerah.toUpperCase()}`;
    // write negeri
    let intro5 = worksheet.getCell('B3');
    intro5.value = `${negeri.toUpperCase()}`;
    // end intro

    let jumlahRetenSalah = 0;
    let jumlahReten = 0;

    let cellNumber = 2;

    for (let j = 0; j < data[0].opData.length; j++) {
      if (data[0].opData[j][0]) {
        jumlahRetenSalah += data[0].opData[j][0].statusReten;
        jumlahReten += data[0].opData[j][0].jumlahReten;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[0].opData[j][0].jumlahPesakit;
        cellNumber = cellNumber + 3;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[0].opData[
            j
          ][0].jumlahPesakitYangDipanggilSebelum30Minit;
        cellNumber = cellNumber + 3;
        worksheet.getRow(j + 15).getCell(cellNumber).value = (
          (jumlahRetenSalah / jumlahReten) *
          100
        ).toFixed(2);
      }
      jumlahReten = 0;
      jumlahRetenSalah = 0;
      if (j === 5) {
        j += 2;
      }
      cellNumber = 2;
    }

    cellNumber = 3;

    for (let j = 0; j < data[1].temujanjiData.length; j++) {
      if (data[1].temujanjiData[j][0]) {
        jumlahRetenSalah += data[1].temujanjiData[j][0].statusReten;
        jumlahReten += data[1].temujanjiData[j][0].jumlahReten;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[1].temujanjiData[j][0].jumlahPesakit;
        cellNumber = cellNumber + 3;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[1].temujanjiData[
            j
          ][0].jumlahPesakitYangDipanggilSebelum30Minit;
        // cellNumber = cellNumber + 3;
        // worksheet.getRow(j + 15).getCell(cellNumber).value = (
        //   (jumlahRetenSalah / jumlahReten) *
        //   100
        // ).toFixed(2);
      }
      jumlahReten = 0;
      jumlahRetenSalah = 0;
      if (j === 5) {
        j += 2;
      }
      cellNumber = 3;
    }

    worksheet.getCell(
      'H3'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('H4').value = `Maklumat dari ${
      bulan
        ? `01-01-${new Date().getFullYear()} - ${moment().format(
            'DD-MM-YYYY'
          )}`
        : `01-01-${new Date().getFullYear()} - ${moment().format(
            'DD-MM-YYYY'
          )}`
    }`;
    worksheet.getCell(
      'H5'
    ).value = `Dijana oleh: ${username} (${moment().format(
      'DD-MM-YYYY'
    )} - ${moment().format('HH:mm:ss')})`;
    worksheet.getCell('H6').value = ' ';

    worksheet.getCell('H3').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('H4').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('H5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('H6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/MASA] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeBp = async (payload) => {
  logger.info('[generateRetenController] Reten BP');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countBp(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'Format BP Pind.2.2023.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    // get first worksheet
    let worksheet = workbook.getWorksheet('Lampiran BP');
    // write bulan
    if (bulan) {
      worksheet.getCell('B6').value = `${moment(bulan).format(
        'MMMM'
      )} / ${moment().format('YYYY')}`;
    } else {
      const monthMula = moment(tarikhMula).format('MMMM');
      const monthAkhir = moment(tarikhAkhir).format('MMMM');
      if (monthMula === monthAkhir) {
        worksheet.getCell(
          'B6'
        ).value = `${monthMula} / ${moment().format('YYYY')}`;
      } else {
        worksheet.getCell(
          'B6'
        ).value = `${monthMula} - ${monthAkhir} / ${moment().format(
          'YYYY'
        )}`;
      }
    }
    worksheet.getCell('B6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    let yangMeminta;
    if (klinik !== 'all') {
      yangMeminta = `${klinik} / ${daerah} / ${negeri}`;
    } else if (daerah !== 'all') {
      yangMeminta = `${daerah} / ${negeri}`;
    } else if (negeri !== 'all') {
      yangMeminta = `${negeri}`;
    } else {
      yangMeminta = 'Malaysia';
    }

    worksheet.getCell('C5').value = `${yangMeminta.toUpperCase()}`;
    worksheet.getCell('C5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.getCell(
      'N4'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('N5').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'N7'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('N4').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('N5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('N7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    let jumlahReten = 0;
    let retenSalah = 0;

    // write data
    let rowNumber = 11;
    let cellNumber = 3;
    for (let j = 0; j < data[0].melayu.length; j++) {
      if (data[0].melayu[j][0]) {
        jumlahReten += data[0].melayu[j][0].jumlahReten;
        retenSalah += data[0].melayu[j][0].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[j][0].jumlahReten;
        if (j < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[0].melayu[j][0].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (j < 4) {
        cellNumber = 3;
      }
      if (j === 4) {
        rowNumber = 11;
        cellNumber = 4;
      }
      if (j > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 17;
    for (let j = 0; j < data[1].cina.length; j++) {
      if (data[1].cina[j][0]) {
        jumlahReten += data[1].cina[j][0].jumlahReten;
        retenSalah += data[1].cina[j][0].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[j][0].jumlahReten;
        if (j < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[1].cina[j][0].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (j < 4) {
        cellNumber = 3;
      }
      if (j === 4) {
        rowNumber = 17;
        cellNumber = 4;
      }
      if (j > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 23;
    for (let j = 0; j < data[2].india.length; j++) {
      if (data[2].india[j][0]) {
        jumlahReten += data[2].india[j][0].jumlahReten;
        retenSalah += data[2].india[j][0].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[j][0].jumlahReten;
        if (j < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[2].india[j][0].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (j < 4) {
        cellNumber = 3;
      }
      if (j === 4) {
        rowNumber = 23;
        cellNumber = 4;
      }
      if (j > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 29;
    for (let j = 0; j < data[3].bumiputeraSabah.length; j++) {
      if (data[3].bumiputeraSabah[j][0]) {
        jumlahReten += data[3].bumiputeraSabah[j][0].jumlahReten;
        retenSalah += data[3].bumiputeraSabah[j][0].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].bumiputeraSabah[j][0].jumlahReten;
        if (j < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].bumiputeraSabah[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].bumiputeraSabah[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[3].bumiputeraSabah[j][0].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (j < 4) {
        cellNumber = 3;
      }
      if (j === 4) {
        rowNumber = 29;
        cellNumber = 4;
      }
      if (j > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 35;
    for (let j = 0; j < data[4].bumiputeraSarawak.length; j++) {
      if (data[4].bumiputeraSarawak[j][0]) {
        jumlahReten += data[4].bumiputeraSarawak[j][0].jumlahReten;
        retenSalah += data[4].bumiputeraSarawak[j][0].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].bumiputeraSarawak[j][0].jumlahReten;
        if (j < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].bumiputeraSarawak[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].bumiputeraSarawak[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[4].bumiputeraSarawak[j][0].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (j < 4) {
        cellNumber = 3;
      }
      if (j === 4) {
        rowNumber = 35;
        cellNumber = 4;
      }
      if (j > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 41;
    for (let j = 0; j < data[5].orangAsliSemenanjung.length; j++) {
      if (data[5].orangAsliSemenanjung[j][0]) {
        jumlahReten += data[5].orangAsliSemenanjung[j][0].jumlahReten;
        retenSalah += data[5].orangAsliSemenanjung[j][0].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[5].orangAsliSemenanjung[j][0].jumlahReten;
        if (j < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[5].orangAsliSemenanjung[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[5].orangAsliSemenanjung[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[5].orangAsliSemenanjung[j][0].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (j < 4) {
        cellNumber = 3;
      }
      if (j === 4) {
        rowNumber = 41;
        cellNumber = 4;
      }
      if (j > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 47;
    for (let j = 0; j < data[6].lain2.length; j++) {
      if (data[6].lain2[j][0]) {
        jumlahReten += data[6].lain2[j][0].jumlahReten;
        retenSalah += data[6].lain2[j][0].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[6].lain2[j][0].jumlahReten;
        if (j < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[6].lain2[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[6].lain2[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[6].lain2[j][0].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (j < 4) {
        cellNumber = 3;
      }
      if (j === 4) {
        rowNumber = 47;
        cellNumber = 4;
      }
      if (j > 4) {
        cellNumber = 4;
      }
    }

    worksheet.getCell('N6').value = `Peratus reten salah: ${(
      (retenSalah / jumlahReten) *
      100
    ).toFixed(2)}%`;
    worksheet.getCell('N6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = moment(bulan).format('MMMM');

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/BP] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeBPE = async (payload) => {
  logger.info('[generateRetenController] Reten BPE');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pegawai,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countBPE(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'Reten BPE Perio.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('Reten BPE');

    worksheet.getCell('C9').value = negeri.toUpperCase();
    worksheet.getCell('C10').value = daerah.toUpperCase();
    worksheet.getCell('C11').value = klinik.toUpperCase();

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    for (let i = 0; i < data.length; i++) {
      let row = worksheet.getRow(19 + i);
      if (data[i][0]) {
        jumlahReten += data[i][0].jumlahReten;
        jumlahRetenSalah += data[i][0].statusReten;
        row.getCell(4).value =
          i % 2 === 0
            ? data[i][0].kedatanganTahunSemasaBaru
            : data[i][0].kedatanganTahunSemasaUlangan; // leong, since match kita odd numbers adalah baru, dan even adalah ulangan, jd aku ckp ngn dia, kalau i/2 xde remainder, dia baru, kalau ada remainder dia ulangan
        row.getCell(5).value =
          i % 2 === 0 ? data[i][0].adaRujukanT2DMdariKK : 0; //Column E (5)
        row.getCell(6).value =
          i % 2 === 0 ? data[i][0].adaRujukanT2DMdariLainLain : 0; //Column F (6)
        row.getCell(7).value =
          i % 2 === 0 ? data[i][0].tiadaRujukanT2DM : 0; //Column G (7)
        row.getCell(8).value = data[i][0].risikoBpeDiabetes; //Column H (8)
        row.getCell(9).value = data[i][0].risikoBpePerokok; //Column I (9)
        row.getCell(10).value = data[i][0].risikoBpeLainLain; //Column J (10)
        row.getCell(11).value =
          i % 2 === 0 ? 0 : data[i][0].engganBPE; //Column K (11)
        row.getCell(12).value = data[i][0].skorBPE0; //Column L (12)
        row.getCell(13).value = data[i][0].skorBPE1; //Column M (13)
        row.getCell(14).value = data[i][0].skorBPE2; //Column N (14)
        row.getCell(15).value = data[i][0].skorBPE3; //Column O (15)
        row.getCell(16).value = data[i][0].skorBPE4; //Column P (16)
        row.getCell(17).value = data[i][0].adaPeriImplantMucositis; //Column Q (17)
        row.getCell(18).value = data[i][0].adaPeriImplantitis; //Column R (18)
        row.getCell(19).value = data[i][0].nasihatKaunselingDiet; //Column S (19)
        row.getCell(20).value = data[i][0].nasihatBerhentiMerokok; //Column T (20)
        row.getCell(21).value = data[i][0].nasihatLainlain; //Column U (21)
        row.getCell(22).value = data[i][0].nasihatOHE; //Column V (22)
        row.getCell(23).value = data[i][0].telahPenskaleran; //Column W (23)
        row.getCell(24).value = data[i][0].telahPendebridmenAkar; //Column X (24)
        row.getCell(25).value =
          data[i][0].telahPengilapanTampalanRungkup; //Column Y (25)
        row.getCell(26).value = data[i][0].telahAdjustasiOklusi; //Column Z (26)
        row.getCell(27).value = data[i][0].telahCabutGigiPerio; //Column AA (27)
        row.getCell(28).value =
          data[i][0].telahExtirpasiPulpaSebabPerio; //Column AB (28)
        row.getCell(29).value = data[i][0].telahRawatanPerioLain; //Column AC (29)
        row.getCell(30).value = data[i][0].telahRujukPakarPerio; //Column AD (30)
        row.getCell(31).value = data[i][0].engganRujukPakarPerio; //Column AE (31)
        row.getCell(32).value = data[i][0].engganRujukPakarPerio; //Column AF (32)
        row.getCell(33).value = data[i][0].rujukanKeKlinikSCD; //Column AG (33)
        row.getCell(34).value = data[i][0].rujukanKeKlinikUPPKA; //Column AH (34)
        row.getCell(35).value = data[i][0].kesSelesaiPerio; //Column AI (35)
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AI3'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AI4').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AI5'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AI6'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AI3').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AI4').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AI5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AI6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );
    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/BPE] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeGender = async (payload) => {
  logger.info('[generateRetenController] makeGender');
  try {
    let {
      klinik,
      daerah,
      negeri,
      bulan,
      tarikhMula,
      tarikhAkhir,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    //
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        const ETL = await Reservoir.find(query).sort({
          createdAt: -1,
        });
        if (ETL.length === 0) {
          return 'No data found';
        }
        data = ETL[0].data;
        break;
      default:
        data = await Helper.countGender(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'GENDER.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('GENDER 2023');

    worksheet.getCell('B3').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('B4').value = moment(new Date()).format('YYYY');
    if (bulan) {
      worksheet.getCell('B5').value = moment(bulan).format('MMMM');
    } else {
      const monthMula = moment(tarikhMula).format('MMMM');
      const monthAkhir = moment(tarikhAkhir).format('MMMM');
      if (monthMula === monthAkhir) {
        worksheet.getCell('B5').value = monthMula;
      } else {
        worksheet.getCell(
          'B5'
        ).value = `${monthMula} - ${monthAkhir}`;
      }
    }

    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }

    worksheet.getCell('B6').value = `${
      klinik ? `${klinik.toUpperCase()} / ` : ''
    } ${daerah ? `${daerah.toUpperCase()}` : ''}`;

    // data lelaki
    if (data[0].dataLelaki[0]) {
      worksheet.getCell('C9').value =
        data[0].dataLelaki[0].pesakitBaru;
      worksheet.getCell('C10').value =
        data[0].dataLelaki[0].pesakitUlangan;
    }

    if (data[0].dataLelaki[1]) {
      worksheet.getCell('H9').value =
        data[0].dataLelaki[1].pesakitBaru;
      worksheet.getCell('H10').value =
        data[0].dataLelaki[1].pesakitUlangan;
    }

    if (data[0].dataLelaki[2]) {
      worksheet.getCell('M9').value =
        data[0].dataLelaki[2].pesakitBaru;
      worksheet.getCell('M10').value =
        data[0].dataLelaki[2].pesakitUlangan;
    }

    if (data[0].dataLelaki[3]) {
      worksheet.getCell('R9').value =
        data[0].dataLelaki[3].pesakitBaru;
      worksheet.getCell('R10').value =
        data[0].dataLelaki[3].pesakitUlangan;
    }

    if (data[0].dataLelaki[4]) {
      worksheet.getCell('C12').value =
        data[0].dataLelaki[4].pesakitBaru;
      worksheet.getCell('C13').value =
        data[0].dataLelaki[4].pesakitUlangan;
    }

    if (data[0].dataLelaki[5]) {
      worksheet.getCell('H12').value =
        data[0].dataLelaki[5].pesakitBaru;
      worksheet.getCell('H13').value =
        data[0].dataLelaki[5].pesakitUlangan;
    }

    if (data[0].dataLelaki[6]) {
      worksheet.getCell('M12').value =
        data[0].dataLelaki[6].pesakitBaru;
      worksheet.getCell('M13').value =
        data[0].dataLelaki[6].pesakitUlangan;
    }

    if (data[0].dataLelaki[7]) {
      worksheet.getCell('R12').value =
        data[0].dataLelaki[7].pesakitBaru;
      worksheet.getCell('R13').value =
        data[0].dataLelaki[7].pesakitUlangan;
    }

    // data perempuan
    if (data[1].dataPerempuan[0]) {
      worksheet.getCell('D9').value =
        data[1].dataPerempuan[0].pesakitBaru;
      worksheet.getCell('D10').value =
        data[1].dataPerempuan[0].pesakitUlangan;
    }

    if (data[1].dataPerempuan[1]) {
      worksheet.getCell('I9').value =
        data[1].dataPerempuan[1].pesakitBaru;
      worksheet.getCell('I10').value =
        data[1].dataPerempuan[1].pesakitUlangan;
    }

    if (data[1].dataPerempuan[2]) {
      worksheet.getCell('N9').value =
        data[1].dataPerempuan[2].pesakitBaru;
      worksheet.getCell('N10').value =
        data[1].dataPerempuan[2].pesakitUlangan;
    }

    if (data[1].dataPerempuan[3]) {
      worksheet.getCell('S9').value =
        data[1].dataPerempuan[3].pesakitBaru;
      worksheet.getCell('S10').value =
        data[1].dataPerempuan[3].pesakitUlangan;
    }

    if (data[1].dataPerempuan[4]) {
      worksheet.getCell('D12').value =
        data[1].dataPerempuan[4].pesakitBaru;
      worksheet.getCell('D13').value =
        data[1].dataPerempuan[4].pesakitUlangan;
    }

    if (data[1].dataPerempuan[5]) {
      worksheet.getCell('I12').value =
        data[1].dataPerempuan[5].pesakitBaru;
      worksheet.getCell('I13').value =
        data[1].dataPerempuan[5].pesakitUlangan;
    }

    if (data[1].dataPerempuan[6]) {
      worksheet.getCell('N12').value =
        data[1].dataPerempuan[6].pesakitBaru;
      worksheet.getCell('N13').value =
        data[1].dataPerempuan[6].pesakitUlangan;
    }

    if (data[1].dataPerempuan[7]) {
      worksheet.getCell('S12').value =
        data[1].dataPerempuan[7].pesakitBaru;
      worksheet.getCell('S13').value =
        data[1].dataPerempuan[7].pesakitUlangan;
    }

    // info
    worksheet.getCell(
      'Y3'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('Y4').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'Y5'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('Y3').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('Y4').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('Y5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'GENDER';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/GENDER] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};

// new
const makeKEPP = async (payload) => {
  logger.info('[generateRetenController] makeKEPP');
  try {
    let data;
    let fromEtl = 'false';
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countKEPP(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    return data;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController] Excel making error. Reason: ${err}`
    );
    excelMakerError(payload.jenisReten);
  }
};
const makeTOD = async (payload) => {
  logger.info('[generateRetenController] makeTOD');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      // fromEtl,
      jenisReten,
    } = payload;
    let data;
    let fromEtl = 'false';
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countTOD(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'TOD 2022.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('TOD');
    //
    worksheet.getCell('C9').value = moment(new Date()).format('YYYY');
    worksheet.getCell('C10').value = moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM');

    // if (pilihanIndividu) {
    //   const currentIndividu = await Operator.findOne({
    //     mdtbNumber: pilihanIndividu,
    //   })
    //     .select('nama')
    //     .lean();
    //   worksheet.getCell('B9').value = `${currentIndividu.nama.toUpperCase()}`;
    // }

    const jumlahPPdanJP = await Operator.aggregate([
      {
        $match: {
          ...(negeri !== 'all' ? { createdByNegeri: negeri } : null),
          ...(daerah !== 'all' ? { createdByDaerah: daerah } : null),
          ...(klinik !== 'all' ? { kodFasiliti: klinik } : null),
          statusPegawai: { $in: ['pp', 'jp'] },
        },
      },
      {
        $group: {
          _id: null,
          jumlah: { $sum: 1 },
        },
      },
    ]);

    worksheet.getCell('C8').value =
      jumlahPPdanJP.length > 0
        ? `${jumlahPPdanJP[0].jumlah}`
        : 'TIADA DATA';
    worksheet.getCell('C7').value = `${klinik.toUpperCase()}`;
    worksheet.getCell(
      'C6'
    ).value = `${daerah.toUpperCase()} / ${negeri.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;
    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(19 + j);
      if (data[0][i].queryBaru[0]) {
        row.getCell(3).value =
          data[0][i].queryBaru[0].kedatanganTahunSemasaBaru;
        row.getCell(5).value = data[0][i].queryBaru[0].jumlahd;
        row.getCell(7).value = data[0][i].queryBaru[0].jumlahf;
        row.getCell(8).value = data[0][i].queryBaru[0].jumlahx;
        // row.getCell(10).value = data[0][i].queryBaru[0].jumlahdfx;
        row.getCell(11).value =
          data[0][i].queryBaru[0].dfxEqualToZero;
        row.getCell(12).value = data[0][i].queryBaru[0].skorPlakA;
        row.getCell(13).value = data[0][i].queryBaru[0].skorPlakC;
        row.getCell(14).value = data[0][i].queryBaru[0].skorPlakE;
        row.getCell(15).value = data[0][i].queryBaru[0].TPR;
        row.getCell(16).value =
          data[0][i].queryBaru[0].jumlahKecederaanTisuLembut;
        row.getCell(17).value =
          data[0][i].queryBaru[0].jumlahKecederaanTisuKeras;
        row.getCell(19).value =
          data[0][i].queryBaru[0].perluSapuanFluorida;
        row.getCell(20).value =
          data[0][i].queryBaru[0].sudahSapuanFluorida;
        row.getCell(21).value =
          data[0][i].queryBaru[0].jumlahTampalanAnteriorBaru;
        row.getCell(22).value =
          data[0][i].queryBaru[0].jumlahTampalanPosteriorBaru;
        // CRA nak data baru je
        row.getCell(30).value = data[0][i].queryBaru[0].craRendah;
        row.getCell(31).value = data[0][i].queryBaru[0].craSederhana;
        row.getCell(32).value = data[0][i].queryBaru[0].craTinggi;
      }
      j += 2;
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      let row = worksheet.getRow(20 + j);
      if (data[1][i].queryBu[0]) {
        row.getCell(4).value =
          data[1][i].queryBu[0].kedatanganTahunSemasaUlangan;
        row.getCell(19).value =
          data[1][i].queryBu[0].perluSapuanFluoridaBu;
        row.getCell(20).value =
          data[1][i].queryBu[0].sudahSapuanFluoridaBu;
        row.getCell(21).value =
          data[1][i].queryBu[0].jumlahTampalanAnteriorBu;
        row.getCell(22).value =
          data[1][i].queryBu[0].jumlahTampalanPosteriorBu;
        row.getCell(24).value = data[1][i].queryBu[0].jumlahCabutan;
        row.getCell(25).value = data[1][i].queryBu[0].jumlahAbses;
        row.getCell(26).value = data[1][i].queryBu[0].jumlahPulpotomi;
        row.getCell(27).value =
          data[1][i].queryBu[0].rujukanAgensiLuar;
      }
      j += 2;
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AF7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AF8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AF9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AF10'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AF7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AF8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AF9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AF10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    for (let i = 0; i < data[2].length; i++) {
      if (data[2][i].query1836[0]) {
        let row = worksheet.getRow(38 + i);
        row.getCell(3).value =
          data[2][i].query1836[0].jumlahKedatanganBaru;
        row.getCell(4).value = data[2][i].query1836[0].jumlahd;
        // row.getCell(5).value = data[2][i].jumlahm;
        row.getCell(6).value = data[2][i].query1836[0].jumlahf;
        row.getCell(7).value = data[2][i].query1836[0].jumlahx;
        row.getCell(10).value =
          data[2][i].query1836[0].dfxEqualToZero;
      }
    }

    worksheet.name = 'TOD';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/TOD] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeBEGIN = async (payload) => {
  logger.info('[generateRetenController] makeBEGIN');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      fromEtl,
      jenisReten,
    } = payload;

    let data;

    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countBEGIN(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'BEGIN.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BEGIN');
    //
    // if (pilihanIndividu) {
    //   const currentIndividu = await Operator.findOne({
    //     mdtbNumber: pilihanIndividu,
    //   })
    //     .select('nama')
    //     .lean();
    //   worksheet.getCell('B9').value = `${currentIndividu.nama.toUpperCase()}`;
    // }

    // worksheet.getCell('C8').value =
    // jumlahPPdanJP.length > 0 ? `${jumlahPPdanJP[0].jumlah}` : 'TIADA DATA';

    worksheet.getCell('F8').value = moment(new Date()).format('YYYY');
    worksheet.getCell('H8').value = moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM');
    worksheet.getCell('C10').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C11').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C12').value = `${klinik.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(18 + i);
      if (data[0][i].queryBegin[0]) {
        row.getCell(3).value =
          data[0][i].queryBegin[0].pesakitBaruBegin;
        row.getCell(4).value =
          data[0][i].queryBegin[0].jumlahFasilitiBegin;
        row.getCell(5).value =
          data[0][i].queryBegin[0].jumlahFasilitiMelaksanakanBegin;
        row.getCell(8).value = data[0][i].queryBegin[0].jumlahx;
        // skipping cells
        row.getCell(6).value = data[0][i].queryBegin[0].risikoRendah;
        row.getCell(7).value =
          data[0][i].queryBegin[0].risikoSederhana;
        row.getCell(8).value = data[0][i].queryBegin[0].risikoTinggi;
        if (i < 2) {
          row.getCell(9).value =
            data[0][i].queryBegin[0].jumlahMuridMelaksanakanBegin;
        }
        if (i > 2) {
          row.getCell(9).value =
            data[0][
              i
            ].queryBegin[0].jumlahMuridRisikoTinggiMelaksanakanBegin;
        }
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'M10'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('M11').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'M12'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'M13'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('M10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('M11').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('M12').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('M13').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'BEGIN';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/BEGIN] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/BEGIN] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/BEGIN] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPIM03 = async (payload) => {
  logger.info('[generateRetenController/makePPIM03] makePPIM03');
  try {
    let {
      sekolah,
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPPIM03(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'KOTAK PPIM 03.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BORANG PPIM 03-2023');
    //
    worksheet.getCell('S5').value = moment(new Date()).format('YYYY');
    worksheet.getCell('O5').value = moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM');
    worksheet.getCell('B7').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('B8').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('B9').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B9').value = `${sekolah.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(18 + i);
      if (data[0][i].queryPPIM03[0]) {
        row.getCell(3).value = data[0][i].queryPPIM03[0].bilEnrolmen;
        // skipping cells - PEROKOK SEMASA
        row.getCell(9).value =
          data[0][i].queryPPIM03[0].jumlahKesMelayuLelaki;
        row.getCell(10).value =
          data[0][i].queryPPIM03[0].jumlahKesCinaLelaki;
        row.getCell(11).value =
          data[0][i].queryPPIM03[0].jumlahKesIndiaLelaki;
        row.getCell(12).value =
          data[0][i].queryPPIM03[0].jumlahKesLainLainLelaki;
        //skipping cells
        row.getCell(14).value =
          data[0][i].queryPPIM03[0].jumlahKesMelayuPerempuan;
        row.getCell(15).value =
          data[0][i].queryPPIM03[0].jumlahKesCinaPerempuan;
        row.getCell(16).value =
          data[0][i].queryPPIM03[0].jumlahKesIndiaPerempuan;
        row.getCell(17).value =
          data[0][i].queryPPIM03[0].jumlahKesLainLainPerempuan;
        row.getCell(18).value =
          data[0][i].queryPPIM03[0].jumlahRokokBiasa;
        row.getCell(19).value =
          data[0][i].queryPPIM03[0].jumlahRokokElektronik;
        row.getCell(20).value =
          data[0][i].queryPPIM03[0].jumlahRokokShisha;
        row.getCell(21).value =
          data[0][i].queryPPIM03[0].jumlahRokokLainlain;
        row.getCell(22).value =
          data[0][i].queryPPIM03[0].bilanganDirujukIntervensi;
        // skipping cells - BEKAS PEROKOK
        row.getCell(25).value =
          data[0][i].queryPPIM03[0].jumlahBekasPerokokLelaki;
        row.getCell(26).value =
          data[0][i].queryPPIM03[0].jumlahBekasPerokokLelaki;
        // skipping cells - PEROKOK PASIF
        row.getCell(25).value =
          data[0][i].queryPPIM03[0].jumlahPerokokPasifLelaki;
        row.getCell(26).value =
          data[0][i].queryPPIM03[0].jumlahPerokokPasifLelaki;
        // skipping cells - BUKAN PEROKOK
        row.getCell(25).value =
          data[0][i].queryPPIM03[0].jumlahBukanPerokokLelaki;
        row.getCell(26).value =
          data[0][i].queryPPIM03[0].jumlahBukanPerokokLelaki;
        // skipping cells - DALAM INTERVENSI
        row.getCell(25).value =
          data[0][i].queryPPIM03[0].jumlahDalamIntervensiLelaki;
        row.getCell(26).value =
          data[0][i].queryPPIM03[0].jumlahDalamIntervensiLelaki;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AL7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AL8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AL9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AL10'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AL7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    // oter nama form dan nama worksheet
    const { jenisFasiliti } = Fasiliti.findOne({
      kodSekolah: sekolah,
    });
    worksheet.getCell('AI1').value =
      jenisFasiliti === 'sekolah-rendah'
        ? 'BORANG PPIM 03-2023 (SR)'
        : 'BORANG PPIM 03-2023 (SM)';
    worksheet.name =
      jenisFasiliti === 'sekolah-rendah'
        ? 'BORANG PPIM 03-2023 (SR)'
        : 'BORANG PPIM 03-2023 (SM)';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makePPIM03] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePPIM03] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPIM03] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPIM04 = async (payload) => {
  logger.info('[generateRetenController/makePPIM04] makePPIM04');
  try {
    let {
      sekolah,
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPPIM04(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'KOTAK PPIM 04.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BORANG PPIM 04-2023');
    //
    worksheet.getCell('H4').value = moment(new Date()).format('YYYY');
    worksheet.getCell('E4').value = moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM');
    worksheet.getCell('B6').value = `${sekolah.toUpperCase()}`;
    worksheet.getCell('B7').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B8').value = `${pegawai.toUpperCase()}`;
    // jumlah perokok semasa berhenti merokok dalam tempoh 6 bulan
    // worksheet.getCell('B10').value = `${pegawai.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    for (let i = 0; i < data.length; i++) {
      let row = worksheet.getRow(15 + i);
      if (data[i]) {
        row.getCell(1).value = data[i].nama;
        row.getCell(2).value = data[i].kelasPelajar;
        row.getCell(3).value = data[i].noTelefon;
        row.getCell(4).value = data[i].tarikhIntervensi1;
        row.getCell(5).value = data[i].tarikhIntervensi2;
        row.getCell(6).value = data[i].tarikhIntervensi3;
        row.getCell(7).value = data[i].tarikhIntervensi4;
        row.getCell(8).value =
          data[i].adaTiadaQTarikh1 &&
          data[i].adaTiadaQTarikh2 &&
          data[i].adaTiadaQTarikh3 &&
          data[i].adaTiadaQTarikh4
            ? '1'
            : '';
        row.getCell(9).value =
          !data[i].adaTiadaQTarikh1 &&
          !data[i].adaTiadaQTarikh2 &&
          !data[i].adaTiadaQTarikh3 &&
          !data[i].adaTiadaQTarikh4
            ? '1'
            : '';
        row.getCell(10).value = data[i].tarikhQ;
        row.getCell(11).value =
          data[i].tarikhIntervensi1 &&
          data[i].tarikhIntervensi2 &&
          data[i].tarikhIntervensi3 &&
          data[i].tarikhIntervensi4
            ? '1'
            : '';
        row.getCell(12).value =
          data[i].statusSelepas6Bulan === 'berhenti' ? '1' : '';
        row.getCell(13).value =
          data[i].statusSelepas6Bulan === 'berhenti' ? '' : '1';
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'M5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('M6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'M7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'M8'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('M5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('M6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('M7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('M8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    // oter nama form dan nama worksheet
    const { jenisFasiliti } = Fasiliti.findOne({
      kodSekolah: sekolah,
    });
    worksheet.getCell('A1').value =
      jenisFasiliti === 'sekolah-rendah'
        ? 'BORANG PPIM 04-2023 (SR) (SULIT)'
        : 'BORANG PPIM 04-2023 (SM) (SULIT)';
    worksheet.name =
      jenisFasiliti === 'sekolah-rendah'
        ? 'BORANG PPIM 04-2023 (SR)(SULIT)'
        : 'BORANG PPIM 04-2023 (SM)(SULIT)';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makePPIM04] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePPIM04] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPIM04] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPIM05 = async (payload) => {
  logger.info('[generateRetenController/makePPIM05] makePPIM05');
  try {
    let {
      sekolah,
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanIndividu,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPPIM05(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'KOTAK PPIM 05.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BORANG PPIM 05-2023');
    //
    worksheet.getCell('I4').value = moment(new Date()).format('YYYY');
    worksheet.getCell('F4').value = moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM');
    worksheet.getCell('B6').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('B7').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('B8').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B9').value = `${sekolah.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(14 + i);
      if (data[0][i].queryPPIM05[0]) {
        row.getCell(2).value =
          data[0][i].queryPPIM05[0].bilPerokokSemasa;
        row.getCell(3).value =
          data[0][i].queryPPIM05[0].bilPerokokMenyertaiIntervensi;
        row.getCell(4).value =
          data[0][i].queryPPIM05[0].jumlahAdaQuitDateLebih3Int;
        // skipping cells
        row.getCell(6).value =
          data[0][i].queryPPIM05[0].jumlahTiadaQuitDateLebih3Int;
        // skipping cells
        row.getCell(8).value =
          data[0][i].queryPPIM05[0].jumlahAdaQuitDateKurang3Int;
        // skipping cells
        row.getCell(10).value =
          data[0][i].queryPPIM05[0].jumlahTiadaQuitDateKurang3Int;
        //skipping cells
        row.getCell(12).value =
          data[0][i].queryPPIM05[0].bilanganDirujukGuruKaunseling;
        row.getCell(13).value =
          data[0][
            i
          ].queryPPIM05[0].jumlahBerhentiMerokokSelepas6Bulan;
        row.getCell(14).value =
          data[0][
            i
          ].queryPPIM05[0].jumlahTidakBerhentiMerokokSelepas6Bulan;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'N6'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('N7').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'N8'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'N9'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('N6').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('N7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('N8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('N9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makePPIM05] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePPIM05] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPIM05] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeDEWASAMUDA = async (payload) => {
  logger.info(
    '[generateRetenController/makeDEWASAMUDA] makeDEWASAMUDA'
  );
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanProgram,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countDEWASAMUDA(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'DEWASA MUDA.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('DEWASA MUDA');
    //
    worksheet.getCell('B6').value = `BAGI BULAN ${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')} TAHUN ${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell(
      'C11'
    ).value = `${pilihanProgram.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(20 + j);
      if (data[0][i].queryDMPemeriksaan[0]) {
        jumlahReten += data[0][i].queryDMPemeriksaan[0].jumlahReten;
        jumlahRetenSalah +=
          data[0][i].queryDMPemeriksaan[0].statusReten;
        // pemeriksaan
        row.getCell(3).value =
          data[0][i].queryDMPemeriksaan[0].kedatanganTahunSemasaBaru;
        row.getCell(6).value =
          data[0][i].queryDMPemeriksaan[0].jumlahPerempuan;
        row.getCell(7).value =
          data[0][i].queryDMPemeriksaan[0].jumlahd;
        row.getCell(8).value =
          data[0][i].queryDMPemeriksaan[0].jumlahf;
        row.getCell(9).value =
          data[0][i].queryDMPemeriksaan[0].jumlahx;
        // skipping cells
        row.getCell(11).value =
          data[0][i].queryDMPemeriksaan[0].jumlahD;
        row.getCell(12).value =
          data[0][i].queryDMPemeriksaan[0].jumlahM;
        row.getCell(13).value =
          data[0][i].queryDMPemeriksaan[0].jumlahF;
        row.getCell(14).value =
          data[0][i].queryDMPemeriksaan[0].jumlahX;
        // skipping cells
        row.getCell(16).value =
          data[0][i].queryDMPemeriksaan[0].jumlahMBK;
        row.getCell(17).value =
          data[0][i].queryDMPemeriksaan[0].statusBebasKaries;
        row.getCell(18).value = data[0][i].queryDMPemeriksaan[0].TPR;
        row.getCell(19).value =
          data[0][i].queryDMPemeriksaan[0].skorBPEZero;
        row.getCell(20).value =
          data[0][i].queryDMPemeriksaan[0].skorBPEMoreThanZero;
        row.getCell(21).value =
          data[0][i].queryDMPemeriksaan[0].jumlahTSL;
        row.getCell(22).value =
          data[0][i].queryDMPemeriksaan[0].perluSapuanFluorida;
        row.getCell(23).value =
          data[0][
            i
          ].queryDMPemeriksaan[0].perluJumlahPesakitPrrJenis1;
        row.getCell(24).value =
          data[0][i].queryDMPemeriksaan[0].perluJumlahGigiPrrJenis1;
        row.getCell(25).value =
          data[0][i].queryDMPemeriksaan[0].perluJumlahPesakitFS;
        row.getCell(26).value =
          data[0][i].queryDMPemeriksaan[0].perluJumlahGigiFS;
        row.getCell(27).value =
          data[0][i].queryDMPemeriksaan[0].perluPenskaleran;
        row.getCell(28).value =
          data[0][i].queryDMPemeriksaan[0].perluEndoAnterior;
        row.getCell(29).value =
          data[0][i].queryDMPemeriksaan[0].perluEndoPremolar;
        row.getCell(30).value =
          data[0][i].queryDMPemeriksaan[0].perluEndoMolar;
        row.getCell(31).value =
          data[0][i].queryDMPemeriksaan[0].jumlahPerluDenturPenuh;
        row.getCell(32).value =
          data[0][i].queryDMPemeriksaan[0].jumlahPerluDenturSepara;
      }
      j++;
      if (i === 3) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      let row = worksheet.getRow(20 + j);
      if (data[1][i].queryDMRawatan[0]) {
        // rawatan
        row.getCell(4).value =
          data[1][i].queryDMRawatan[0].kedatanganTahunSemasaUlangan;
        row.getCell(33).value =
          data[1][i].queryDMRawatan[0].sapuanFluorida;
        row.getCell(34).value =
          data[1][i].queryDMRawatan[0].jumlahPesakitPrrJenis1;
        row.getCell(35).value =
          data[1][i].queryDMRawatan[0].jumlahGigiPrrJenis1;
        row.getCell(36).value =
          data[1][i].queryDMRawatan[0].jumlahPesakitDiBuatFs;
        row.getCell(37).value =
          data[1][i].queryDMRawatan[0].jumlahGigiDibuatFs;
        row.getCell(38).value =
          data[1][i].queryDMRawatan[0].tampalanAntGdBaru;
        row.getCell(39).value =
          data[1][i].queryDMRawatan[0].tampalanAntGdSemula;
        row.getCell(40).value =
          data[1][i].queryDMRawatan[0].tampalanAntGkBaru;
        row.getCell(41).value =
          data[1][i].queryDMRawatan[0].tampalanAntGkSemula;
        row.getCell(42).value =
          data[1][i].queryDMRawatan[0].tampalanPostGdBaru;
        row.getCell(43).value =
          data[1][i].queryDMRawatan[0].tampalanPostGdSemula;
        row.getCell(44).value =
          data[1][i].queryDMRawatan[0].tampalanPostGkBaru;
        row.getCell(45).value =
          data[1][i].queryDMRawatan[0].tampalanPostGkSemula;
        row.getCell(46).value =
          data[1][i].queryDMRawatan[0].tampalanPostAmgGdBaru;
        row.getCell(47).value =
          data[1][i].queryDMRawatan[0].tampalanPostAmgGdSemula;
        row.getCell(48).value =
          data[1][i].queryDMRawatan[0].tampalanPostAmgGkBaru;
        row.getCell(49).value =
          data[1][i].queryDMRawatan[0].tampalanPostAmgGkSemula;
        // skipping cells
        row.getCell(52).value =
          data[1][i].queryDMRawatan[0].tampalanSementara;
        row.getCell(53).value =
          data[1][i].queryDMRawatan[0].cabutanGd;
        row.getCell(54).value =
          data[1][i].queryDMRawatan[0].cabutanGk;
        row.getCell(55).value =
          data[1][i].queryDMRawatan[0].komplikasiSelepasCabutan;
        row.getCell(56).value =
          data[1][i].queryDMRawatan[0].penskaleran;
        row.getCell(57).value = data[1][i].queryDMRawatan[0].abses;
        row.getCell(58).value =
          data[1][i].queryDMRawatan[0].kecederaanTulangMuka;
        row.getCell(59).value =
          data[1][i].queryDMRawatan[0].kecederaanGigi;
        row.getCell(60).value =
          data[1][i].queryDMRawatan[0].kecederaanTisuLembut;
        //
        row.getCell(61).value =
          data[1][i].queryDMRawatan[0].prosthodontikPenuhDenturBaru;
        row.getCell(62).value =
          data[1][i].queryDMRawatan[0].prosthodontikPenuhDenturSemula;
        row.getCell(63).value =
          data[1][i].queryDMRawatan[0].jumlahPesakitBuatDenturPenuh;
        row.getCell(64).value =
          data[1][i].queryDMRawatan[0].prosthodontikSeparaDenturBaru;
        row.getCell(65).value =
          data[1][
            i
          ].queryDMRawatan[0].prosthodontikSeparaDenturSemula;
        row.getCell(66).value =
          data[1][i].queryDMRawatan[0].jumlahPesakitBuatDenturSepara;
        //
        row.getCell(67).value =
          data[1][i].queryDMRawatan[0].immediateDenture;
        row.getCell(68).value =
          data[1][i].queryDMRawatan[0].pembaikanDenture;
        row.getCell(69).value =
          data[1][i].queryDMRawatan[0].kesSelesai;
        row.getCell(70).value =
          data[1][i].queryDMRawatan[0].xrayDiambil;
        row.getCell(71).value =
          data[1][i].queryDMRawatan[0].pesakitDisaringOC;
      }
      j++;
      if (i === 3) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AL7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AL8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AL9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AL10'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AL7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'DEWASA MUDA';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makeDEWASAMUDA] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeDEWASAMUDA] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeDEWASAMUDA] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeOAP = async (payload) => {
  logger.info('[generateRetenController/makeOAP] makeOAP');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanProgram,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countOAP(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'OAP.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('OAP');
    //
    worksheet.getCell('B6').value = `BAGI BULAN ${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')} TAHUN ${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C10').value = `${klinik.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;

    for (const item of data[0]) {
      const { queryOAPPemeriksaan } = item;
      if (queryOAPPemeriksaan?.[0]) {
        const {
          jumlahReten,
          statusReten,
          kedatanganTahunSemasaBaru,
          jumlahd,
          jumlahf,
          jumlahx,
          jumlahD,
          jumlahM,
          jumlahF,
          jumlahX,
          jumlahMBK,
          statusBebasKaries,
          TPR,
          skorBPEZero,
          skorBPEMoreThanZero,
          jumlahTSL,
          perluSapuanFluorida,
          perluJumlahPesakitPrrJenis1,
          perluJumlahGigiPrrJenis1,
          perluJumlahPesakitFS,
          perluJumlahGigiFS,
          perluPenskaleran,
          perluEndoAnterior,
          perluEndoPremolar,
          perluEndoMolar,
          jumlahPerluDenturPenuh,
          jumlahPerluDenturSepara,
        } = queryOAPPemeriksaan[0];
        const row = worksheet.getRow(20 + j);
        jumlahReten += jumlahReten;
        jumlahRetenSalah += statusReten;
        row.getCell(3).value = kedatanganTahunSemasaBaru;
        row.getCell(5).value = jumlahd;
        row.getCell(6).value = jumlahf;
        row.getCell(7).value = jumlahx;
        if (i > 1) {
          row.getCell(11).value = jumlahD;
          row.getCell(12).value = jumlahM;
          row.getCell(13).value = jumlahF;
          row.getCell(14).value = jumlahX;
        }
        row.getCell(16).value = jumlahMBK;
        if (i > 1) {
          row.getCell(17).value = statusBebasKaries;
        }
        row.getCell(18).value = TPR;
        if (i > 5) {
          row.getCell(19).value = skorBPEZero;
          row.getCell(20).value = skorBPEMoreThanZero;
        }
        row.getCell(21).value = jumlahTSL;
        row.getCell(22).value = perluSapuanFluorida;
        if (i > 1) {
          row.getCell(23).value = perluJumlahPesakitPrrJenis1;
          row.getCell(24).value = perluJumlahGigiPrrJenis1;
          row.getCell(25).value = perluJumlahPesakitFS;
          row.getCell(26).value = perluJumlahGigiFS;
        }
        row.getCell(27).value = perluPenskaleran;
        if (i > 1) {
          row.getCell(28).value = perluEndoAnterior;
          row.getCell(29).value = perluEndoPremolar;
          row.getCell(30).value = perluEndoMolar;
          row.getCell(31).value = jumlahPerluDenturPenuh;
          row.getCell(32).value = jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const row = worksheet.getRow(20 + j);
      const [rawatan] = data[1][i].queryOAPRawatan || [];

      if (rawatan) {
        // rawatan
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(31).value = rawatan.sapuanFluorida;

        for (let k = 32; k <= 35; k++) {
          if (i > 1) {
            row.getCell(k).value =
              rawatan[`jumlahPesakitPrrJenis${k - 31}`];
          }
        }

        for (let k = 36; k <= 47; k++) {
          row.getCell(k).value =
            rawatan[
              `tampalan${
                k === 44 ? 'PostAmg' : k < 44 ? 'AntGd' : 'PostGk'
              }${k % 2 === 0 ? 'Baru' : 'Semula'}`
            ];
        }

        row.getCell(50).value = rawatan.tampalanSementara;
        row.getCell(51).value = rawatan.cabutanGd;
        row.getCell(52).value = rawatan.cabutanGk;
        row.getCell(53).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(54).value = rawatan.penskaleran;
        row.getCell(55).value =
          data[1][i].queryRawatan[0].rawatanPerioLain;
        row.getCell(56).value =
          data[1][i].queryRawatan[0].rawatanEndoAnterior;
        row.getCell(57).value =
          data[1][i].queryRawatan[0].rawatanEndoPremolar;
        row.getCell(58).value =
          data[1][i].queryRawatan[0].rawatanEndoMolar;
        row.getCell(59).value =
          data[1][i].queryRawatan[0].rawatanOrtho;
        row.getCell(60).value =
          data[1][i].queryRawatan[0].kesPerubatan;
        row.getCell(61).value = rawatan.abses;
        row.getCell(62).value = rawatan.kecederaanTulangMuka;
        row.getCell(63).value = rawatan.kecederaanGigi;
        row.getCell(64).value = rawatan.kecederaanTisuLembut;
        row.getCell(65).value =
          data[1][i].queryRawatan[0].cabutanSurgical;
        row.getCell(66).value =
          data[1][i].queryRawatan[0].pembedahanKecilMulut;

        for (let k = 67; k <= 76; k++) {
          if (i > 1) {
            row.getCell(k).value =
              data[1][i].queryRawatan[0][
                k % 2 === 1 ? 'crownBridgeSemula' : 'crownBridgeBaru'
              ];
          }
        }

        row.getCell(77).value = rawatan.immediateDenture;
        row.getCell(78).value = rawatan.pembaikanDenture;
        row.getCell(79).value = rawatan.kesSelesai;
        row.getCell(80).value = rawatan.xrayDiambil;
        row.getCell(81).value = rawatan.pesakitDisaringOC;
      }

      j++;
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AL7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AL8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AL9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AL10'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AL7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'OAP';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makeOAP] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeOAP] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeOAP] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeLiputanOAP = async (payload) => {
  logger.info(
    '[generateRetenController/makeLiputanOAP] makeLiputanOAP'
  );
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanProgram,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countOAP(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'OAP.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('OAP');
    //
    worksheet.getCell('B7').value = `BAGI BULAN ${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')} TAHUN ${moment(new Date()).format('YYYY')}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    for (let i = 0; i < data.length; i++) {
      let row = worksheet.getRow(10 + i);
      if (data[i]) {
        row.getCell(4).value = data[i].jumlah;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AL7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AL8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AL9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AL10'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AL7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'OAP';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makeLiputanOAP] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeLiputanOAP] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeLiputanOAP] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeKPBMPB = async (payload) => {
  logger.info('[generateRetenController/makeKPBMPB] makeKPBMPB');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanKpbMpb,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countKPBMPB(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'KPB MPB.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BULANAN');
    //
    worksheet.getCell('B6').value = `BAGI BULAN ${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')} TAHUN ${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C9').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C10').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C11').value = `${klinik.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    // kpb
    for (let i = 0; i < data.length; i++) {
      let row = worksheet.getRow(16 + i);
      if (data[i]) {
        jumlahReten += data[i].jumlahReten;
        jumlahRetenSalah += data[i].statusReten;
        // pemeriksaan
        // row.getCell(3).value = data[i].nasihatBerhentiMerokok;
        // row.getCell(6).value = data[i].bahanApiKenderaan;
        // row.getCell(7).value = data[i].bahanApiGenerator;
        // row.getCell(8).value = data[i].repairKenderaan;
        // row.getCell(9).value = data[i].repairGenerator;
        // row.getCell(10).value = data[i].repairAlatan;
        // row.getCell(11).value = data[i].tuntutanElaun;
        // skipping cell
        row.getCell(13).value = data[i].jumlahHariBeroperasi;
        row.getCell(14).value = data[i].jumlahPesakitBaru;
        row.getCell(15).value = data[i].jumlahPesakitUlangan;
        row.getCell(18).value = data[i].catatan;
      }
    }
    // mpb
    for (let i = 0; i < data.length; i++) {
      let row = worksheet.getRow(16 + i);
      if (data[i]) {
        jumlahReten += data[i].jumlahReten;
        jumlahRetenSalah += data[i].statusReten;
        // pemeriksaan
        row.getCell(3).value = data[i].nasihatBerhentiMerokok;
        row.getCell(6).value = data[i].bahanApiKenderaan;
        row.getCell(7).value = data[i].bahanApiGenerator;
        row.getCell(8).value = data[i].repairKenderaan;
        row.getCell(9).value = data[i].repairGenerator;
        row.getCell(10).value = data[i].repairAlatan;
        row.getCell(11).value = data[i].tuntutanElaun;
        // skipping cell
        row.getCell(13).value = data[i].jumlahHariBeroperasi;
        row.getCell(14).value = data[i].jumlahPesakitBaru;
        row.getCell(15).value = data[i].jumlahPesakitUlangan;
        row.getCell(16).value = data[i].jumlahDenturPenuh;
        row.getCell(17).value = data[i].jumlahDenturSebahagian;
        row.getCell(18).value = data[i].catatan;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AL7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AL8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AL9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AL10'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AL7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'BULANAN';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makeKPBMPB] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeKPBMPB] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeKPBMPB] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};
const makeKOM = async (payload) => {
  logger.info('[generateRetenController/makeKOM] makeKOM');
  try {
    let {
      klinik,
      daerah,
      negeri,
      tarikhMula,
      tarikhAkhir,
      bulan,
      pilihanProgram,
      username,
      fromEtl,
      jenisReten,
    } = payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countDEWASAMUDA(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'KOM.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('KOM');
    //
    worksheet.getCell('B6').value = `BAGI BULAN ${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')} TAHUN ${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell(
      'C11'
    ).value = `${pilihanProgram.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(20 + j);
      if (data[0][i].queryKOMPemeriksaan[0]) {
        jumlahReten += data[0][i].queryKOMPemeriksaan[0].jumlahReten;
        jumlahRetenSalah +=
          data[0][i].queryKOMPemeriksaan[0].statusReten;
        // pemeriksaan
        row.getCell(3).value =
          data[0][i].queryKOMPemeriksaan[0].kedatanganTahunSemasaBaru;
        row.getCell(5).value =
          data[0][i].queryKOMPemeriksaan[0].jumlahd;
        row.getCell(6).value =
          data[0][i].queryKOMPemeriksaan[0].jumlahf;
        row.getCell(7).value =
          data[0][i].queryKOMPemeriksaan[0].jumlahx;
        // skipping cells
        if (i > 1) {
          row.getCell(9).value =
            data[0][i].queryKOMPemeriksaan[0].jumlahD;
          row.getCell(10).value =
            data[0][i].queryKOMPemeriksaan[0].jumlahM;
          row.getCell(11).value =
            data[0][i].queryKOMPemeriksaan[0].jumlahF;
          row.getCell(12).value =
            data[0][i].queryKOMPemeriksaan[0].jumlahX;
        }
        // skipping cells
        row.getCell(14).value =
          data[0][i].queryKOMPemeriksaan[0].jumlahMBK;
        if (i > 1) {
          row.getCell(15).value =
            data[0][i].queryKOMPemeriksaan[0].statusBebasKaries;
        }
        row.getCell(16).value = data[0][i].queryKOMPemeriksaan[0].TPR;
        if (i > 1) {
          row.getCell(17).value =
            data[0][i].queryKOMPemeriksaan[0].skorBPEZero;
          row.getCell(18).value =
            data[0][i].queryKOMPemeriksaan[0].skorBPEMoreThanZero;
        }
        row.getCell(19).value =
          data[0][i].queryKOMPemeriksaan[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(20).value =
            data[0][
              i
            ].queryDMPemeriksaan[0].perluJumlahPesakitPrrJenis1;
          row.getCell(21).value =
            data[0][
              i
            ].queryKOMPemeriksaan[0].perluJumlahGigiPrrJenis1;
          row.getCell(22).value =
            data[0][i].queryKOMPemeriksaan[0].perluJumlahPesakitFS;
          row.getCell(23).value =
            data[0][i].queryKOMPemeriksaan[0].perluJumlahGigiFS;
        }
        row.getCell(24).value =
          data[0][i].queryKOMPemeriksaan[0].perluPenskaleran;
        row.getCell(25).value =
          data[0][i].queryKOMPemeriksaan[0].perluEndoAnterior;
        row.getCell(26).value =
          data[0][i].queryKOMPemeriksaan[0].perluEndoPremolar;
        row.getCell(27).value =
          data[0][i].queryKOMPemeriksaan[0].perluEndoMolar;
        if (i > 1) {
          row.getCell(28).value =
            data[0][i].queryKOMPemeriksaan[0].jumlahPerluDenturPenuh;
          row.getCell(29).value =
            data[0][i].queryKOMPemeriksaan[0].jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      let row = worksheet.getRow(20 + j);
      if (data[1][i].queryKOMRawatan[0]) {
        // rawatan
        row.getCell(4).value =
          data[1][i].queryKOMRawatan[0].kedatanganTahunSemasaUlangan;
        row.getCell(30).value =
          data[1][i].queryKOMRawatan[0].sapuanFluorida;
        if (i > 1) {
          row.getCell(31).value =
            data[1][i].queryKOMRawatan[0].jumlahPesakitPrrJenis1;
          row.getCell(32).value =
            data[1][i].queryKOMRawatan[0].jumlahGigiPrrJenis1;
          row.getCell(33).value =
            data[1][i].queryKOMRawatan[0].jumlahPesakitDiBuatFs;
          row.getCell(34).value =
            data[1][i].queryKOMRawatan[0].jumlahGigiDibuatFs;
        }
        row.getCell(35).value =
          data[1][i].queryKOMRawatan[0].tampalanAntGdBaru;
        row.getCell(36).value =
          data[1][i].queryKOMRawatan[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(37).value =
            data[1][i].queryKOMRawatan[0].tampalanAntGkBaru;
          row.getCell(38).value =
            data[1][i].queryKOMRawatan[0].tampalanAntGkSemula;
        }
        row.getCell(39).value =
          data[1][i].queryKOMRawatan[0].tampalanPostGdBaru;
        row.getCell(40).value =
          data[1][i].queryKOMRawatan[0].tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(41).value =
            data[1][i].queryKOMRawatan[0].tampalanPostGkBaru;
          row.getCell(42).value =
            data[1][i].queryKOMRawatan[0].tampalanPostGkSemula;
        }
        row.getCell(43).value =
          data[1][i].queryKOMRawatan[0].tampalanPostAmgGdBaru;
        row.getCell(44).value =
          data[1][i].queryKOMRawatan[0].tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(45).value =
            data[1][i].queryKOMRawatan[0].tampalanPostAmgGkBaru;
          row.getCell(46).value =
            data[1][i].queryKOMRawatan[0].tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(47).value =
          data[1][i].queryKOMRawatan[0].tampalanSementara;
        row.getCell(48).value =
          data[1][i].queryKOMRawatan[0].cabutanGd;
        row.getCell(49).value =
          data[1][i].queryKOMRawatan[0].cabutanGk;
        row.getCell(50).value =
          data[1][i].queryKOMRawatan[0].komplikasiSelepasCabutan;
        row.getCell(51).value =
          data[1][i].queryKOMRawatan[0].penskaleran;
        row.getCell(52).value = data[1][i].queryKOMRawatan[0].abses;
        row.getCell(53).value =
          data[1][i].queryKOMRawatan[0].kecederaanTulangMuka;
        row.getCell(54).value =
          data[1][i].queryKOMRawatan[0].kecederaanGigi;
        row.getCell(55).value =
          data[1][i].queryKOMRawatan[0].kecederaanTisuLembut;
        //
        if (i > 1) {
          row.getCell(56).value =
            data[1][
              i
            ].queryKOMRawatan[0].prosthodontikPenuhDenturBaru;
          row.getCell(57).value =
            data[1][
              i
            ].queryKOMRawatan[0].prosthodontikPenuhDenturSemula;
          row.getCell(58).value =
            data[1][
              i
            ].queryKOMRawatan[0].jumlahPesakitBuatDenturPenuh;
          row.getCell(59).value =
            data[1][
              i
            ].queryKOMRawatan[0].prosthodontikSeparaDenturBaru;
          row.getCell(60).value =
            data[1][
              i
            ].queryDMRawatan[0].prosthodontikSeparaDenturSemula;
          row.getCell(61).value =
            data[1][
              i
            ].queryKOMRawatan[0].jumlahPesakitBuatDenturSepara;
          //
          row.getCell(62).value =
            data[1][i].queryKOMRawatan[0].immediateDenture;
          row.getCell(63).value =
            data[1][i].queryKOMRawatan[0].pembaikanDenture;
        }
        row.getCell(64).value =
          data[1][i].queryKOMRawatan[0].kesSelesai;
        row.getCell(65).value =
          data[1][i].queryKOMRawatan[0].xrayDiambil;
        row.getCell(66).value =
          data[1][i].queryKOMRawatan[0].pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AL7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AL8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan)
            .startOf('month')
            .format('DD-MM-YYYY')} - ${moment(bulan)
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AL9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell(
      'AL10'
    ).value = `Dijana oleh: ${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.getCell('AL7').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL8').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL9').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };
    worksheet.getCell('AL10').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.name = 'KOM';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makeKOM] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeKOM] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(
      path.resolve(process.cwd(), newfile)
    );

    return file;
  } catch (err) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeKOM] Excel making error. Reason: ${err}`
    );
    excelMakerError(jenisReten);
  }
};

// debug
exports.debug = async (req, res) => {
  logger.info('[generateRetenController] debug test');
  let payload = {
    negeri: 'Perlis',
    // daerah: 'Arau',
    daerah: 'Arau',
    // klinik: 'Klinik Pergigian Kaki Bukit',
    klinik: 'all',
    // bulan: '2023-04-01',
    tarikhMula: '2023-01-01',
    tarikhAkhir: '2023-04-11',
    fromEtl: false,
  };
  console.table(payload);
  const data = await makeTOD(payload);
  // const data = await makePG214(payload);
  // const data = await makePGPR201(klinik);
  // const data = await makePGS203(klinik, bulan, sekolah);
  // res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.status(200).send(data);
  // res.status(200).json(data);
};

// helper
const makeFile = () => {
  return path.join(
    __dirname,
    '..',
    'public',
    'exports',
    `${generateRandomString(20)}.xlsx`
  );
};
const createQuery = ({
  jenisReten,
  pilihanIndividu,
  klinik,
  daerah,
  negeri,
  bulan,
}) => {
  const query = {
    dataType: jenisReten,
    dataFormat: 'Monthly',
    dataDate: moment(bulan).endOf('month').format('YYYY-MM-DD'),
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKodFasiliti: klinik === 'all' ? 'all' : klinik,
    ...(pilihanIndividu && { createdByMdcMdtb: pilihanIndividu }),
  };

  return query;
};

// refresh token
exports.refreshTokens = async function (req, res) {
  // refresh hq tokens
  const hqTokens = await GenerateToken.find({
    accountType: 'hqSuperadmin',
  });

  if (hqTokens) {
    hqTokens.forEach(async (token) => {
      token.jumlahToken = 9000;
      await token.save();
    });
    logger.info('[generateRetenController] dah refresh token hq');
  }

  // refresh negeri tokens
  const negeriTokens = await GenerateToken.find({
    accountType: 'negeriSuperadmin',
  });

  if (negeriTokens) {
    negeriTokens.forEach(async (token) => {
      token.jumlahToken = 200;
      await token.save();
    });
    logger.info('[generateRetenController] dah refresh token negeri');
  }

  // refresh daerah token
  const daerahTokens = await GenerateToken.find({
    accountType: 'daerahSuperadmin',
  });
  if (daerahTokens) {
    daerahTokens.forEach(async (token) => {
      token.jumlahToken = 50;
      await token.save();
    });
    logger.info('[generateRetenController] dah refresh token daerah');
  }

  // refresh kp token
  const kpTokens = await GenerateToken.find({
    accountType: 'kpUser',
  });
  if (kpTokens) {
    kpTokens.forEach(async (token) => {
      token.jumlahToken = 25;
      await token.save();
    });
    logger.info('[generateRetenController] dah refresh token kp');
  }

  res.status(200).json({ message: 'Tokens refreshed' });
};

// kill the tokens
exports.killTokens = async function (req, res) {
  const negeriTokens = await GenerateToken.find({
    accountType: 'negeriSuperadmin',
  });

  if (negeriTokens) {
    negeriTokens.forEach(async (token) => {
      token.jumlahToken = 0;
      await token.save();
    });
    logger.info('[generateRetenController] dah kill token negeri');
  }

  const daerahTokens = await GenerateToken.find({
    accountType: 'daerahSuperadmin',
  });
  if (daerahTokens) {
    daerahTokens.forEach(async (token) => {
      token.jumlahToken = 0;
      await token.save();
    });
    logger.info('[generateRetenController] dah kill token daerah');
  }

  const kpTokens = await GenerateToken.find({
    accountType: 'kpUser',
  });
  if (kpTokens) {
    kpTokens.forEach(async (token) => {
      token.jumlahToken = 0;
      await token.save();
    });
    logger.info('[generateRetenController] dah kill token kp');
  }

  res.status(200).json({ message: 'Tokens killed' });
};

// mapping retens
const mapsOfSeveralRetens = new Map([
  ['PG101A', makePG101A],
  ['PG101C', makePG101C],
  ['PG211A', makePG211A],
  ['PG211C', makePG211C],
  ['PG206', makePG206],
  ['PG207', makePG207],
  ['PG214', makePG214],
  ['PGPR201', makePGPR201],
  ['PGPRO01', makePgPro01],
  ['PGPRO01Combined', makePgPro01Combined],
  ['PG201P2', makePG201P2],
  ['PGS203P2', makePGS203P2],
  ['TODP1', makeTOD],
  ['MASA', makeMasa],
  ['BP', makeBp],
  ['BPE', makeBPE],
  ['GENDER', makeGender],
  ['BEGIN', makeBEGIN],
  ['PPIM03', makePPIM03],
  ['PPIM04', makePPIM04],
  ['PPIM05', makePPIM05],
]);

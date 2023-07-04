'use strict';
const fs = require('fs');
const async = require('async');
const path = require('path');
const moment = require('moment');
const Excel = require('exceljs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Operator = require('../models/Operator');
const Reservoir = require('../models/Reservoir');
const GenerateToken = require('../models/GenerateToken');
const { generateRandomString } = require('./adminAPI');
const { logger, penjanaanRetenLogger } = require('../logs/logger');
const { reten_engine_version } = require('./countHelperFuser');

// helper
const Helper = require('../controllers/countHelperFuser');

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
            '[generateRetenController] dah kurangkan token untuk ' + username
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
      } catch (error) {
        reject(error);
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
            '[generateRetenController] dah kurangkan token untuk ' + username
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
      } catch (error) {
        reject(error);
      }
    });
  });

  logger.info(
    '[generateRetenController] que kp sekarang: ' + downloadQueueKp.length()
  );
  return result;
};

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
    pilihanSekolah,
    tarikhMula,
    tarikhAkhir,
    bulan,
    fromEtl,
  } = req.query;

  if (!jenisReten) {
    return new Error('No data found');
  }
  //
  const { authorization } = req.headers;
  //
  let accountType, username;

  const deciphered = jwt.verify(authorization, process.env.JWT_SECRET);

  accountType = deciphered.accountType;

  switch (accountType) {
    case 'kaunterUser':
      klinik = deciphered.kodFasiliti;
      daerah = deciphered.daerah;
      negeri = deciphered.negeri;
      username = `Kaunter ${deciphered.kp}`;
      break;
    default:
      username = jwt.verify(authorization, process.env.JWT_SECRET).username;
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
    pilihanSekolah,
    tarikhMula,
    tarikhAkhir,
    bulan,
    fromEtl,
  };

  process.env.BUILD_ENV === 'dev' && console.table(payload);

  const excelFile = await mapsOfSeveralRetens.get(jenisReten)(payload);

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
  logger.info('[generateRetenController/makePG101A] PG101A');
  let { klinik, daerah, negeri, username, tarikhMula, bulan, jenisReten } =
    payload;
  try {
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
    await workbook.xlsx.readFile(/utc/i.test(klinik) ? filenameUTC : filename);
    let worksheet = workbook.getWorksheet(
      /utc/i.test(klinik) ? 'PG101C' : 'PG101A'
    );
    //
    // copy worksheet[0] to worksheet[1]
    const copyWorksheet = workbook.addWorksheet('NEW COPY');
    copyWorksheet.model = Object.assign(worksheet.model, {
      mergeCells: worksheet.model.merges,
    });
    worksheet.columns.forEach((column, colNumber) => {
      const copyColumn = copyWorksheet.getColumn(colNumber + 1);
      copyColumn.width = column.width;
      copyColumn.style = Object.assign({}, column.style);
    });
    worksheet.eachRow((row, rowNumber) => {
      const copyRow = copyWorksheet.getRow(rowNumber);
      row.eachCell((cell, colNumber) => {
        const copyCell = copyRow.getCell(colNumber);
        copyCell.value = cell.value;
        copyCell.style = Object.assign({}, cell.style);
        copyCell.alignment = Object.assign({}, cell.alignment);
      });
    });
    copyWorksheet.name = 'COPY OF PG101A';
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
    const yearNow = moment().format('YYYY');

    worksheet.getCell('I5').value = monthName;
    worksheet.getCell('M5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    /utc/i.test(klinik)
      ? (intro1.getCell(2).value = 'OUTREACH')
      : (intro1.getCell(2).value = 'PRIMER');

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah ? daerah.toUpperCase() : ''}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri ? negeri.toUpperCase() : ''}`;
    //
    for (let i = 0; i < data[0].length; i++) {
      worksheet.getRow(16 + i).height = 33;
      worksheet.getRow(16 + i).font = { name: 'Arial', size: 10 };
      let rowNew = worksheet.getRow(16 + i);
      rowNew.getCell(1).value = moment(data[0][i].tarikhKedatangan).format(
        'DD/MM/YYYY'
      );
      rowNew.getCell(2).value = data[0][i].noSiri;
      rowNew.getCell(3).value = data[0][i].waktuSampai;
      if (data[0][i].noPendaftaranBaru) {
        rowNew.getCell(4).value = data[0][i].noPendaftaranBaru;
      }
      if (data[0][i].noPendaftaranUlangan) {
        rowNew.getCell(5).value = data[0][i].noPendaftaranUlangan;
      }
      rowNew.getCell(6).value = data[0][i].ic;
      rowNew.getCell(7).value = data[0][i].nama.toUpperCase();
      rowNew.getCell(8).value = data[0][i].alamat.toUpperCase();
      rowNew.getCell(9).value = data[0][i].umur;
      if (data[0][i].jantina == 'lelaki' || data[0][i].jantina == '') {
        rowNew.getCell(10).value = 1;
      }
      if (data[0][i].jantina == 'perempuan') {
        rowNew.getCell(11).value = 1;
      }
      switch (data[0][i].kumpulanEtnik) {
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
      if (data[0][i].ibuMengandung) {
        rowNew.getCell(29).value = 1;
      }
      if (data[0][i].bersekolah) {
        rowNew.getCell(30).value = 1;
      }
      if (data[0][i].orangKurangUpaya) {
        rowNew.getCell(31).value = 1;
      }
      switch (data[0][i].statusPesara) {
        case 'pesara-kerajaan':
          rowNew.getCell(32).value = 1;
          break;
        case 'pesara-atm':
          rowNew.getCell(33).value = 1;
          break;
        default:
          console.log('');
      }
      rowNew.getCell(34).value = data[0][i].rujukDaripada.toUpperCase(); //rujukDaripada
      if (data[0][i].deleted) {
        rowNew.getCell(35).value = 'PESAKIT YANG DIHAPUS';
      } else {
        let catatan = `${
          data[0][i].createdByUsername !== 'kaunter'
            ? `Operator: ${data[0][i].createdByUsername}. `
            : ''
        }`;

        if (data[0][i].rawatanDibuatOperatorLain) {
          for (let j = 0; j < data[0][i].maklumatOperatorLain.length; j++) {
            if (data[0][i].maklumatOperatorLain[j]) {
              catatan += `Operator Lain: ${data[0][i].maklumatOperatorLain[j]}. `;
            }
          }
        }

        catatan += `${
          data[0][i].noOku ? `No. Oku: ${data[0][i].noOku} ` : ''
        } ${data[0][i].noPesara ? `No. Pesara: ${data[0][i].noPesara}` : ''} ${
          data[0][i].noBayaran && data[0][i].noResit
            ? `No. Resit dan bayaran: ${data[0][i].noResit} - ${data[0][i].noBayaran}`
            : ''
        } ${
          data[0][i].noBayaran2 && data[0][i].noResit2
            ? `No. Resit dan bayaran: ${data[0][i].noResit2} - ${data[0][i].noBayaran2}`
            : ''
        } ${
          data[0][i].noBayaran3 && data[0][i].noResit3
            ? `No. Resit dan bayaran: ${data[0][i].noResit3} - ${data[0][i].noBayaran3}`
            : ''
        } ${data[0][i].catatan ? `Catatan: ${data[0][i].catatan}` : ''}`;

        rowNew.getCell(35).value = catatan;
      }
      for (let z = 1; z < 36; z++) {
        rowNew.getCell(z).border = borderStyle;
      }
    }
    worksheet.getCell('AI6').style = noBorderStyle;
    worksheet.name = `PG101A`;
    //
    if (data[1].length > 0) {
      for (const kkia of data[1]) {
        const kkiaName = kkia[0].nama.split('| ')[1];
        const kkiaCopy = workbook.addWorksheet('COPYLEFT');
        kkiaCopy.model = Object.assign(copyWorksheet.model, {
          mergeCells: copyWorksheet.model.merges,
        });
        copyWorksheet.columns.forEach((column, colNumber) => {
          const copyColumn = kkiaCopy.getColumn(colNumber + 1);
          copyColumn.width = column.width;
          copyColumn.style = Object.assign({}, column.style);
        });
        copyWorksheet.eachRow((row, rowNumber) => {
          const copyRow = kkiaCopy.getRow(rowNumber);
          row.eachCell((cell, colNumber) => {
            const copyCell = copyRow.getCell(colNumber);
            copyCell.value = cell.value;
            copyCell.style = Object.assign({}, cell.style);
            copyCell.alignment = Object.assign({}, cell.alignment);
          });
        });
        // dump it
        for (let i = 1; i < kkia.length; i++) {
          const rowNew = kkiaCopy.getRow(15 + i);
          rowNew.height = 33;
          rowNew.font = { name: 'Arial', size: 10 };
          rowNew.getCell(1).value = i;
          rowNew.getCell(1).value = moment(kkia[i].tarikhKedatangan).format(
            'DD/MM/YYYY'
          );
          rowNew.getCell(2).value = kkia[i].noSiri;
          rowNew.getCell(3).value = kkia[i].waktuSampai;
          if (kkia[i].noPendaftaranBaru) {
            rowNew.getCell(4).value = kkia[i].noPendaftaranBaru;
          }
          if (kkia[i].noPendaftaranUlangan) {
            rowNew.getCell(5).value = kkia[i].noPendaftaranUlangan;
          }
          rowNew.getCell(6).value = kkia[i].ic;
          rowNew.getCell(7).value = kkia[i].nama.toUpperCase();
          rowNew.getCell(8).value = kkia[i].alamat.toUpperCase();
          rowNew.getCell(9).value = kkia[i].umur;
          if (kkia[i].jantina == 'lelaki') {
            rowNew.getCell(10).value = 1;
          }
          if (kkia[i].jantina == 'perempuan') {
            rowNew.getCell(11).value = 1;
          }
          switch (kkia[i].kumpulanEtnik) {
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
          if (kkia[i].ibuMengandung) {
            rowNew.getCell(29).value = 1;
          }
          if (kkia[i].bersekolah) {
            rowNew.getCell(30).value = 1;
          }
          if (kkia[i].orangKurangUpaya) {
            rowNew.getCell(31).value = 1;
          }
          switch (kkia[i].statusPesara) {
            case 'pesara-kerajaan':
              rowNew.getCell(32).value = 1;
              break;
            case 'pesara-atm':
              rowNew.getCell(33).value = 1;
              break;
            default:
              console.log('');
          }
          rowNew.getCell(34).value = kkia[i].rujukDaripada.toUpperCase(); //rujukDaripada
          if (kkia[i].deleted) {
            rowNew.getCell(35).value = 'PESAKIT YANG DIHAPUS';
          } else {
            let catatan = `${
              kkia[i].createdByUsername !== 'kaunter'
                ? `Operator: ${kkia[i].createdByUsername}. `
                : ''
            }`;

            if (kkia[i].rawatanDibuatOperatorLain) {
              for (let j = 0; j < kkia[i].maklumatOperatorLain.length; j++) {
                if (kkia[i].maklumatOperatorLain[j]) {
                  catatan += `Operator Lain: ${kkia[i].maklumatOperatorLain[j]}. `;
                }
              }
            }

            catatan += `${kkia[i].noOku ? `No. Oku: ${kkia[i].noOku} ` : ''} ${
              kkia[i].noPesara ? `No. Pesara: ${kkia[i].noPesara}` : ''
            } ${
              kkia[i].noBayaran && kkia[i].noResit
                ? `No. Resit dan bayaran: ${kkia[i].noResit} - ${kkia[i].noBayaran}`
                : ''
            } ${
              kkia[i].noBayaran2 && kkia[i].noResit2
                ? `No. Resit dan bayaran: ${kkia[i].noResit2} - ${kkia[i].noBayaran2}`
                : ''
            } ${
              kkia[i].noBayaran3 && kkia[i].noResit3
                ? `No. Resit dan bayaran: ${kkia[i].noResit3} - ${kkia[i].noBayaran3}`
                : ''
            } ${kkia[i].catatan ? `Catatan: ${kkia[i].catatan}` : ''}`;

            rowNew.getCell(35).value = catatan;
          }
          for (let z = 1; z < 36; z++) {
            rowNew.getCell(z).border = borderStyle;
          }
        }
        kkiaCopy.getCell('AI6').style = noBorderStyle;
        kkiaCopy.name = `${kkiaName}`;
        kkiaCopy.getCell('I5').value = monthName;
        kkiaCopy.getCell('M5').value = yearNow;
        kkiaCopy.getCell('B6').value = 'PRIMER';
        kkiaCopy.getCell('B7').value = `${kkiaName.toUpperCase()}`;
        kkiaCopy.getCell(
          'B8'
        ).value = `${kkia[0].createdByDaerah.toUpperCase()}`;
        kkiaCopy.getCell(
          'B9'
        ).value = `${kkia[0].createdByNegeri.toUpperCase()}`;
        kkiaCopy.getCell(
          'AI7'
        ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
        kkiaCopy.getCell('AI8').value = `Dijana oleh: ${username} (${moment(
          new Date()
        ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;
      }
    }

    // stamping
    worksheet.getCell(
      'AI7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AI8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

    copyWorksheet.destroy();

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file - ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePG101] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG101C = async (payload) => {
  logger.info('[generateRetenController/makePG101C] PG101C');
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
  try {
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
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
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
      const localDate = moment(data[i].tarikhKedatangan).format('DD/MM/YYYY');
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
          for (let j = 0; j < data[i].maklumatOperatorLain.length; j++) {
            if (data[i].maklumatOperatorLain[j]) {
              catatan += `Operator Lain: ${data[i].maklumatOperatorLain[j]}. `;
            }
          }
        }

        catatan += `${data[i].noOku ? `No. Oku: ${data[i].noOku} ` : ''} ${
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
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AI8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG101C';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG101C] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG211A = async (payload) => {
  logger.info('[generateRetenController/makePG211A] PG211A');
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
  try {
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
    await workbook.xlsx.readFile(/utc/i.test(klinik) ? filenameUTC : filename);
    let worksheet = workbook.getWorksheet(
      /utc/i.test(klinik) ? 'PG211C' : 'PG211A'
    );
    //
    const monthName = moment(bulan ? bulan : tarikhAkhir).format('MMMM');
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
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AG7').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell('AG8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG211A] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG211C = async (payload) => {
  logger.info('[generateRetenController/makePG211C] PG211C');
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
  try {
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
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
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
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AG7').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell('AG8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG211C] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG206 = async (payload) => {
  logger.info('[generateRetenController/makePG206] PG206');
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
  try {
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
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('V5').value = monthName;
    worksheet.getCell('Z5').value = yearNow;

    if (pilihanIndividu) {
      const currentIndividu = await Operator.findOne({
        mdtbNumber: pilihanIndividu,
      })
        .select('nama')
        .lean();
      worksheet.getCell('B9').value = `${currentIndividu.nama.toUpperCase()}`;
    }

    worksheet.getCell('B6').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B7').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('B8').value = `${negeri.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    let j = 0;

    const rowNumbers = {
      'lima-enam': 19,
      'tujuh-sembilan': 20,
      'sepuluh-dua-belas': 21,
      'tiga-belas-empat-belas': 22,
      'lima-belas-tujuh-belas': 23,
    };

    // data pemeriksaan biasa
    j = 0;
    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryPemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(17 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        // pemeriksaan
        row.getCell(2).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(4).value = pemeriksaan.jumlahd;
        row.getCell(5).value = pemeriksaan.jumlahf;
        row.getCell(6).value = pemeriksaan.jumlahx;
        row.getCell(7).value = pemeriksaan.jumlahdfx;
        if (i > 1) {
          row.getCell(8).value = pemeriksaan.jumlahD;
          row.getCell(9).value = pemeriksaan.jumlahM;
          row.getCell(10).value = pemeriksaan.jumlahF;
          row.getCell(11).value = pemeriksaan.jumlahX;
          row.getCell(12).value = pemeriksaan.jumlahDMFX;
        }
        row.getCell(13).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(14).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(15).value = pemeriksaan.TPR;
        if (i > 1) {
          row.getCell(16).value = pemeriksaan.skorGISZero;
          row.getCell(17).value = pemeriksaan.skorGISMoreThanZero;
        }
        row.getCell(18).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(20).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(21).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(22).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(23).value = pemeriksaan.perluPenskaleran;
      }
      j++;
      if (i === 6) {
        j++;
      }
    }

    // data rawatan biasa
    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryRawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(17 + j);
        // rawatan
        row.getCell(3).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(24).value = rawatan.sapuanFluorida;
        if (i > 1) {
          row.getCell(25).value = rawatan.jumlahPesakitPrrJenis1;
          row.getCell(26).value = rawatan.jumlahGigiPrrJenis1;
          row.getCell(27).value = rawatan.jumlahPesakitDiBuatFs;
          row.getCell(28).value = rawatan.jumlahGigiDibuatFs;
        }
        row.getCell(29).value = rawatan.tampalanAntGdBaru;
        row.getCell(30).value = rawatan.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(31).value = rawatan.tampalanAntGkBaru;
          row.getCell(32).value = rawatan.tampalanAntGkSemula;
        }
        row.getCell(33).value = rawatan.tampalanPostGdBaru;
        row.getCell(34).value = rawatan.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(35).value = rawatan.tampalanPostGkBaru;
          row.getCell(36).value = rawatan.tampalanPostGkSemula;
        }
        row.getCell(37).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(38).value = rawatan.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(39).value = rawatan.tampalanPostAmgGkBaru;
          row.getCell(40).value = rawatan.tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(43).value = rawatan.tampalanSementara;
        row.getCell(44).value = rawatan.cabutanGd;
        if (i > 1) {
          row.getCell(45).value = rawatan.cabutanGk;
          row.getCell(46).value = rawatan.penskaleran;
        }
        row.getCell(47).value = rawatan.kesSelesai;
      }
      j++;
      if (i === 6) {
        j++;
      }
    }

    // data pemeriksaan sekolah
    for (const item of data[2]) {
      const rowNumber = rowNumbers[item._id];
      if (rowNumber !== undefined) {
        const row = worksheet.getRow(rowNumber);
        row.getCell(4).value += item.jumlahd;
        row.getCell(5).value += item.jumlahf;
        row.getCell(6).value += item.jumlahx;
        row.getCell(7).value += item.jumlahdfx;
        row.getCell(8).value += item.jumlahD;
        row.getCell(9).value += item.jumlahM;
        row.getCell(10).value += item.jumlahF;
        row.getCell(11).value += item.jumlahX;
        row.getCell(12).value += item.jumlahDMFX;
        row.getCell(13).value += item.jumlahMBK;
        row.getCell(14).value += item.statusBebasKaries;
        row.getCell(15).value += item.TPR;
        if (
          ![
            'lima-enam',
            'tujuh-sembilan',
            'sepuluh-dua-belas',
            'tiga-belas-empat-belas',
          ].includes(item._id)
        ) {
          row.getCell(16).value += item.skorGISZero;
          row.getCell(17).value += item.skorGISNotZero;
        }
        row.getCell(18).value += item.perluSapuanFluorida;
        row.getCell(19).value += item.perluJumlahPesakitPrrJenis1;
        row.getCell(20).value += item.perluJumlahGigiPrrJenis1;
        row.getCell(21).value += item.perluJumlahPesakitFS;
        row.getCell(22).value += item.perluJumlahGigiFS;
        row.getCell(23).value += item.perluPenskaleran;
      }
    }

    // data rawatan sekolah
    for (const item of data[3]) {
      const rowNumber = rowNumbers[item._id];
      if (rowNumber !== undefined) {
        const row = worksheet.getRow(rowNumber);
        row.getCell(24).value += item.sapuanFluorida;
        row.getCell(25).value += item.jumlahPesakitPrrJenis1;
        row.getCell(26).value += item.jumlahGigiPrrJenis1;
        row.getCell(27).value += item.jumlahPesakitDiBuatFs;
        row.getCell(28).value += item.jumlahGigiDibuatFs;
        row.getCell(29).value += item.tampalanAntGdBaru;
        row.getCell(30).value += item.tampalanAntGdSemula;
        row.getCell(31).value += item.tampalanAntGkBaru;
        row.getCell(32).value += item.tampalanAntGkSemula;
        row.getCell(33).value += item.tampalanPostGdBaru;
        row.getCell(34).value += item.tampalanPostGdSemula;
        row.getCell(35).value += item.tampalanPostGkBaru;
        row.getCell(36).value += item.tampalanPostGkSemula;
        row.getCell(37).value += item.tampalanPostAmgGdBaru;
        row.getCell(38).value += item.tampalanPostAmgGdSemula;
        row.getCell(39).value += item.tampalanPostAmgGkBaru;
        row.getCell(40).value += item.tampalanPostAmgGkSemula;
        row.getCell(43).value += item.tampalanSementara;
        row.getCell(44).value += item.cabutanGd;
        row.getCell(45).value += item.cabutanGk;
        row.getCell(46).value += item.penskaleran;
        row.getCell(47).value += item.kesSelesai;
      }
    }

    // BUKAN data pilihan individu
    j = 0;
    if (!pilihanIndividu) {
      for (let i = 0; i < data[4].length; i++) {
        const [operatorLain] = data[4][i].queryOperatorLain || [];

        if (operatorLain) {
          const row = worksheet.getRow(17 + j);
          // rawatan
          // row.getCell(3).value = operatorLain.kedatanganTahunSemasaUlangan;
          row.getCell(24).value += operatorLain.sapuanFluorida;
          if (i > 1) {
            row.getCell(25).value += operatorLain.jumlahPesakitPrrJenis1;
            row.getCell(26).value += operatorLain.jumlahGigiPrrJenis1;
            row.getCell(27).value += operatorLain.jumlahPesakitDiBuatFs;
            row.getCell(28).value += operatorLain.jumlahGigiDibuatFs;
          }
          row.getCell(29).value += operatorLain.tampalanAntGdBaru;
          row.getCell(30).value += operatorLain.tampalanAntGdSemula;
          if (i > 1) {
            row.getCell(31).value += operatorLain.tampalanAntGkBaru;
            row.getCell(32).value += operatorLain.tampalanAntGkSemula;
          }
          row.getCell(33).value += operatorLain.tampalanPostGdBaru;
          row.getCell(34).value += operatorLain.tampalanPostGdSemula;
          if (i > 1) {
            row.getCell(35).value += operatorLain.tampalanPostGkBaru;
            row.getCell(36).value += operatorLain.tampalanPostGkSemula;
          }
          row.getCell(37).value += operatorLain.tampalanPostAmgGdBaru;
          row.getCell(38).value += operatorLain.tampalanPostAmgGdSemula;
          if (i > 1) {
            row.getCell(39).value += operatorLain.tampalanPostAmgGkBaru;
            row.getCell(40).value += operatorLain.tampalanPostAmgGkSemula;
          }
          // skipping cells
          row.getCell(43).value += operatorLain.tampalanSementara;
          row.getCell(44).value += operatorLain.cabutanGd;
          if (i > 1) {
            row.getCell(45).value += operatorLain.cabutanGk;
            row.getCell(46).value += operatorLain.penskaleran;
          }
          row.getCell(47).value += operatorLain.kesSelesai;
        }
        j++;
        if (i === 6) {
          j++;
        }
      }
    }

    // data kedatangan
    for (const item of data[5]) {
      const rowNumber = rowNumbers[item._id];
      if (rowNumber !== undefined) {
        const row = worksheet.getRow(rowNumber);
        const baruAddedUp = row.getCell(2).value + item.kedatanganBaru;
        const ulanganAddedUp = row.getCell(3).value + item.kedatanganUlangan;
        row.getCell(2).value = baruAddedUp;
        row.getCell(3).value = ulanganAddedUp;
      }
    }

    // data OKU pemeriksaan
    for (const item of data[6]) {
      const row = worksheet.getRow(25);
      row.getCell(4).value += item.jumlahd;
      row.getCell(5).value += item.jumlahf;
      row.getCell(6).value += item.jumlahx;
      row.getCell(7).value += item.jumlahdfx;
      row.getCell(8).value += item.jumlahD;
      row.getCell(9).value += item.jumlahM;
      row.getCell(10).value += item.jumlahF;
      row.getCell(11).value += item.jumlahX;
      row.getCell(12).value += item.jumlahDMFX;
      row.getCell(13).value += item.jumlahMBK;
      row.getCell(14).value += item.statusBebasKaries;
      row.getCell(15).value += item.TPR;
      if (
        ![
          'lima-enam',
          'tujuh-sembilan',
          'sepuluh-dua-belas',
          'tiga-belas-empat-belas',
        ].includes(item._id)
      ) {
        row.getCell(16).value += item.skorGISZero;
        row.getCell(17).value += item.skorGISNotZero;
      }
      row.getCell(18).value += item.perluSapuanFluorida;
      row.getCell(19).value += item.perluJumlahPesakitPrrJenis1;
      row.getCell(20).value += item.perluJumlahGigiPrrJenis1;
      row.getCell(21).value += item.perluJumlahPesakitFS;
      row.getCell(22).value += item.perluJumlahGigiFS;
      row.getCell(23).value += item.perluPenskaleran;
    }

    // data OKU rawatan
    for (const item of data[7]) {
      const row = worksheet.getRow(25);
      row.getCell(24).value += item.sapuanFluorida;
      row.getCell(25).value += item.jumlahPesakitPrrJenis1;
      row.getCell(26).value += item.jumlahGigiPrrJenis1;
      row.getCell(27).value += item.jumlahPesakitDiBuatFs;
      row.getCell(28).value += item.jumlahGigiDibuatFs;
      row.getCell(29).value += item.tampalanAntGdBaru;
      row.getCell(30).value += item.tampalanAntGdSemula;
      row.getCell(31).value += item.tampalanAntGkBaru;
      row.getCell(32).value += item.tampalanAntGkSemula;
      row.getCell(33).value += item.tampalanPostGdBaru;
      row.getCell(34).value += item.tampalanPostGdSemula;
      row.getCell(35).value += item.tampalanPostGkBaru;
      row.getCell(36).value += item.tampalanPostGkSemula;
      row.getCell(37).value += item.tampalanPostAmgGdBaru;
      row.getCell(38).value += item.tampalanPostAmgGdSemula;
      row.getCell(39).value += item.tampalanPostAmgGkBaru;
      row.getCell(40).value += item.tampalanPostAmgGkSemula;
      row.getCell(43).value += item.tampalanSementara;
      row.getCell(44).value += item.cabutanGd;
      row.getCell(45).value += item.cabutanGk;
      row.getCell(46).value += item.penskaleran;
      row.getCell(47).value += item.kesSelesai;
    }

    // data BW pemeriksaan
    for (const item of data[8]) {
      const row = worksheet.getRow(26);
      row.getCell(4).value += item.jumlahd;
      row.getCell(5).value += item.jumlahf;
      row.getCell(6).value += item.jumlahx;
      row.getCell(7).value += item.jumlahdfx;
      row.getCell(8).value += item.jumlahD;
      row.getCell(9).value += item.jumlahM;
      row.getCell(10).value += item.jumlahF;
      row.getCell(11).value += item.jumlahX;
      row.getCell(12).value += item.jumlahDMFX;
      row.getCell(13).value += item.jumlahMBK;
      row.getCell(14).value += item.statusBebasKaries;
      row.getCell(15).value += item.TPR;
      if (
        ![
          'lima-enam',
          'tujuh-sembilan',
          'sepuluh-dua-belas',
          'tiga-belas-empat-belas',
        ].includes(item._id)
      ) {
        row.getCell(16).value += item.skorGISZero;
        row.getCell(17).value += item.skorGISNotZero;
      }
      row.getCell(18).value += item.perluSapuanFluorida;
      row.getCell(19).value += item.perluJumlahPesakitPrrJenis1;
      row.getCell(20).value += item.perluJumlahGigiPrrJenis1;
      row.getCell(21).value += item.perluJumlahPesakitFS;
      row.getCell(22).value += item.perluJumlahGigiFS;
      row.getCell(23).value += item.perluPenskaleran;
    }

    // data BW rawatan
    for (const item of data[9]) {
      const row = worksheet.getRow(26);
      row.getCell(24).value += item.sapuanFluorida;
      row.getCell(25).value += item.jumlahPesakitPrrJenis1;
      row.getCell(26).value += item.jumlahGigiPrrJenis1;
      row.getCell(27).value += item.jumlahPesakitDiBuatFs;
      row.getCell(28).value += item.jumlahGigiDibuatFs;
      row.getCell(29).value += item.tampalanAntGdBaru;
      row.getCell(30).value += item.tampalanAntGdSemula;
      row.getCell(31).value += item.tampalanAntGkBaru;
      row.getCell(32).value += item.tampalanAntGkSemula;
      row.getCell(33).value += item.tampalanPostGdBaru;
      row.getCell(34).value += item.tampalanPostGdSemula;
      row.getCell(35).value += item.tampalanPostGkBaru;
      row.getCell(36).value += item.tampalanPostGkSemula;
      row.getCell(37).value += item.tampalanPostAmgGdBaru;
      row.getCell(38).value += item.tampalanPostAmgGdSemula;
      row.getCell(39).value += item.tampalanPostAmgGkBaru;
      row.getCell(40).value += item.tampalanPostAmgGkSemula;
      row.getCell(43).value += item.tampalanSementara;
      row.getCell(44).value += item.cabutanGd;
      row.getCell(45).value += item.cabutanGk;
      row.getCell(46).value += item.penskaleran;
      row.getCell(47).value += item.kesSelesai;
    }

    // data kedatangan OKU
    for (const item of data[10]) {
      const row = worksheet.getRow(25);
      const baruAddedUp = row.getCell(2).value + item.kedatanganBaru;
      const ulanganAddedUp = row.getCell(3).value + item.kedatanganUlangan;
      row.getCell(2).value = baruAddedUp;
      row.getCell(3).value = ulanganAddedUp;
    }

    // data kedatangan BW
    for (const item of data[11]) {
      const row = worksheet.getRow(26);
      const baruAddedUp = row.getCell(2).value + item.kedatanganBaru;
      const ulanganAddedUp = row.getCell(3).value + item.kedatanganUlangan;
      row.getCell(2).value = baruAddedUp;
      row.getCell(3).value = ulanganAddedUp;
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AU5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AU6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AU7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('AU8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
    logger.info(`[generateRetenController/PG206] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController/PG206] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG206] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG207 = async (payload) => {
  logger.info('[generateRetenController/makePG207] PG207');
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
  try {
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
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
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
      worksheet.getCell('B6').value = `${currentIndividu.nama.toUpperCase()}`;
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

    const rowNumbers = {
      'lima-enam': 19,
      'tujuh-sembilan': 20,
      'sepuluh-dua-belas': 21,
      'tiga-belas-empat-belas': 22,
      'lima-belas-tujuh-belas': 23,
    };

    // data pemeriksaan biasa
    j = 0;
    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryPemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(17 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        // pemeriksaan
        row.getCell(2).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(4).value = pemeriksaan.jumlahd;
        row.getCell(5).value = pemeriksaan.jumlahf;
        row.getCell(6).value = pemeriksaan.jumlahx;
        row.getCell(7).value = pemeriksaan.jumlahdfx;
        if (i > 1) {
          row.getCell(8).value = pemeriksaan.jumlahD;
          row.getCell(9).value = pemeriksaan.jumlahM;
          row.getCell(10).value = pemeriksaan.jumlahF;
          row.getCell(11).value = pemeriksaan.jumlahX;
          row.getCell(12).value = pemeriksaan.jumlahDMFX;
        }
        row.getCell(13).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(14).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(15).value = pemeriksaan.TPR;
        if (i > 5) {
          row.getCell(16).value = pemeriksaan.skorBPEZero;
          row.getCell(17).value = pemeriksaan.skorBPEMoreThanZero;
        }
        row.getCell(18).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(20).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(21).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(22).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(23).value = pemeriksaan.perluPenskaleran;
        row.getCell(24).value = pemeriksaan.perluEndoAnterior;
        row.getCell(25).value = pemeriksaan.perluEndoPremolar;
        row.getCell(26).value = pemeriksaan.perluEndoMolar;
        if (i > 1) {
          row.getCell(27).value = pemeriksaan.jumlahPerluDenturPenuh;
          row.getCell(28).value = pemeriksaan.jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    // data rawatan biasa
    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryRawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(17 + j);
        // rawatan
        row.getCell(3).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(29).value = rawatan.sapuanFluorida;
        if (i > 1) {
          row.getCell(30).value = rawatan.jumlahPesakitPrrJenis1;
          row.getCell(31).value = rawatan.jumlahGigiPrrJenis1;
          row.getCell(32).value = rawatan.jumlahPesakitDiBuatFs;
          row.getCell(33).value = rawatan.jumlahGigiDibuatFs;
        }
        row.getCell(34).value = rawatan.tampalanAntGdBaru;
        row.getCell(35).value = rawatan.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(36).value = rawatan.tampalanAntGkBaru;
          row.getCell(37).value = rawatan.tampalanAntGkSemula;
        }
        row.getCell(38).value = rawatan.tampalanPostGdBaru;
        row.getCell(39).value = rawatan.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(40).value = rawatan.tampalanPostGkBaru;
          row.getCell(41).value = rawatan.tampalanPostGkSemula;
        }
        row.getCell(42).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(43).value = rawatan.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(44).value = rawatan.tampalanPostAmgGkBaru;
          row.getCell(45).value = rawatan.tampalanPostAmgGkSemula;
          row.getCell(46).value = rawatan.inlayOnlayBaru;
          row.getCell(47).value = rawatan.inlayOnlaySemula;
        }
        // skipping cells
        row.getCell(50).value = rawatan.tampalanSementara;
        row.getCell(51).value = rawatan.cabutanGd;
        row.getCell(52).value = rawatan.cabutanGk;
        row.getCell(53).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(54).value = rawatan.penskaleran;
        row.getCell(55).value = rawatan.rawatanPerioLain;
        row.getCell(56).value = rawatan.rawatanEndoAnterior;
        row.getCell(57).value = rawatan.rawatanEndoPremolar;
        row.getCell(58).value = rawatan.rawatanEndoMolar;
        row.getCell(59).value = rawatan.rawatanOrtho;
        row.getCell(60).value = rawatan.kesPerubatan;
        row.getCell(61).value = rawatan.abses;
        row.getCell(62).value = rawatan.kecederaanTulangMuka;
        row.getCell(63).value = rawatan.kecederaanGigi;
        row.getCell(64).value = rawatan.kecederaanTisuLembut;
        row.getCell(65).value = rawatan.cabutanSurgical;
        row.getCell(66).value = rawatan.pembedahanKecilMulut;
        if (i > 1) {
          row.getCell(67).value = rawatan.crownBridgeBaru;
          row.getCell(68).value = rawatan.crownBridgeSemula;
          row.getCell(69).value = rawatan.postCoreBaru;
          row.getCell(70).value = rawatan.postCoreSemula;
          row.getCell(71).value = rawatan.prosthodontikPenuhDenturBaru;
          row.getCell(72).value = rawatan.prosthodontikPenuhDenturSemula;
          row.getCell(73).value = rawatan.jumlahPesakitBuatDenturPenuh;
          row.getCell(74).value = rawatan.prosthodontikSeparaDenturBaru;
          row.getCell(75).value = rawatan.prosthodontikSeparaDenturSemula;
          row.getCell(76).value = rawatan.jumlahPesakitBuatDenturSepara;
          row.getCell(77).value = rawatan.immediateDenture;
          row.getCell(78).value = rawatan.pembaikanDenture;
        }
        row.getCell(79).value = rawatan.kesSelesai;
        row.getCell(80).value = rawatan.xrayDiambil;
        row.getCell(81).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    // data pemeriksaan sekolah
    for (const item of data[2]) {
      const rowNumber = rowNumbers[item._id];
      if (rowNumber !== undefined) {
        const row = worksheet.getRow(rowNumber);
        row.getCell(4).value += item.jumlahd;
        row.getCell(5).value += item.jumlahf;
        row.getCell(6).value += item.jumlahx;
        row.getCell(7).value += item.jumlahdfx;
        row.getCell(8).value += item.jumlahD;
        row.getCell(9).value += item.jumlahM;
        row.getCell(10).value += item.jumlahF;
        row.getCell(11).value += item.jumlahX;
        row.getCell(12).value += item.jumlahDMFX;
        row.getCell(13).value += item.jumlahMBK;
        row.getCell(14).value += item.statusBebasKaries;
        row.getCell(15).value += item.TPR;
        if (
          ![
            'lima-enam',
            'tujuh-sembilan',
            'sepuluh-dua-belas',
            'tiga-belas-empat-belas',
          ].includes(item._id)
        ) {
          row.getCell(16).value += item.skorBPEZero;
          row.getCell(17).value += item.skorBPEMoreThanZero;
        }
        row.getCell(18).value += item.perluSapuanFluorida;
        row.getCell(19).value += item.perluJumlahPesakitPrrJenis1;
        row.getCell(20).value += item.perluJumlahGigiPrrJenis1;
        row.getCell(21).value += item.perluJumlahPesakitFS;
        row.getCell(22).value += item.perluJumlahGigiFS;
        row.getCell(23).value += item.perluPenskaleran;
      }
    }

    // data rawatan sekolah
    for (const item of data[3]) {
      const rowNumber = rowNumbers[item._id];
      if (rowNumber !== undefined) {
        const row = worksheet.getRow(rowNumber);
        row.getCell(29).value += item.sapuanFluorida;
        row.getCell(30).value += item.jumlahPesakitPrrJenis1;
        row.getCell(31).value += item.jumlahGigiPrrJenis1;
        row.getCell(32).value += item.jumlahPesakitDiBuatFs;
        row.getCell(33).value += item.jumlahGigiDibuatFs;
        row.getCell(34).value += item.tampalanAntGdBaru;
        row.getCell(35).value += item.tampalanAntGdSemula;
        row.getCell(36).value += item.tampalanAntGkBaru;
        row.getCell(37).value += item.tampalanAntGkSemula;
        row.getCell(38).value += item.tampalanPostGdBaru;
        row.getCell(39).value += item.tampalanPostGdSemula;
        row.getCell(40).value += item.tampalanPostGkBaru;
        row.getCell(41).value += item.tampalanPostGkSemula;
        row.getCell(42).value += item.tampalanPostAmgGdBaru;
        row.getCell(43).value += item.tampalanPostAmgGdSemula;
        row.getCell(44).value += item.tampalanPostAmgGkBaru;
        row.getCell(45).value += item.tampalanPostAmgGkSemula;
        // skipping
        row.getCell(50).value += item.tampalanSementara;
        row.getCell(51).value += item.cabutanGd;
        row.getCell(52).value += item.cabutanGk;
        // skipping
        row.getCell(54).value += item.penskaleran;
        // skipping
        row.getCell(61).value += item.abses;
        // skipping
        row.getCell(79).value += item.kesSelesai;
      }
    }

    // BUKAN data pilihan individu
    j = 0;
    if (!pilihanIndividu) {
      for (let i = 0; i < data[4].length; i++) {
        const [operatorLain] = data[4][i].queryOperatorLain || [];

        if (operatorLain) {
          const row = worksheet.getRow(17 + j);
          // row.getCell(3).value += operatorLain.kedatanganTahunSemasaUlangan;
          row.getCell(29).value += operatorLain.sapuanFluorida;
          if (i > 1) {
            row.getCell(30).value += operatorLain.jumlahPesakitPrrJenis1;
            row.getCell(31).value += operatorLain.jumlahGigiPrrJenis1;
            row.getCell(32).value += operatorLain.jumlahPesakitDiBuatFs;
            row.getCell(33).value += operatorLain.jumlahGigiDibuatFs;
          }
          row.getCell(34).value += operatorLain.tampalanAntGdBaru;
          row.getCell(35).value += operatorLain.tampalanAntGdSemula;
          if (i > 1) {
            row.getCell(36).value += operatorLain.tampalanAntGkBaru;
            row.getCell(37).value += operatorLain.tampalanAntGkSemula;
          }
          row.getCell(38).value += operatorLain.tampalanPostGdBaru;
          row.getCell(39).value += operatorLain.tampalanPostGdSemula;
          if (i > 1) {
            row.getCell(40).value += operatorLain.tampalanPostGkBaru;
            row.getCell(41).value += operatorLain.tampalanPostGkSemula;
          }
          row.getCell(42).value += operatorLain.tampalanPostAmgGdBaru;
          row.getCell(43).value += operatorLain.tampalanPostAmgGdSemula;
          if (i > 1) {
            row.getCell(44).value += operatorLain.tampalanPostAmgGkBaru;
            row.getCell(45).value += operatorLain.tampalanPostAmgGkSemula;
            row.getCell(46).value += operatorLain.inlayOnlayBaru;
            row.getCell(47).value += operatorLain.inlayOnlaySemula;
          }
          // skipping cells
          row.getCell(50).value += operatorLain.tampalanSementara;
          row.getCell(51).value += operatorLain.cabutanGd;
          row.getCell(52).value += operatorLain.cabutanGk;
          row.getCell(53).value += operatorLain.komplikasiSelepasCabutan;
          row.getCell(54).value += operatorLain.penskaleran;
          row.getCell(55).value += operatorLain.rawatanPerioLain;
          row.getCell(56).value += operatorLain.rawatanEndoAnterior;
          row.getCell(57).value += operatorLain.rawatanEndoPremolar;
          row.getCell(58).value += operatorLain.rawatanEndoMolar;
          row.getCell(59).value += operatorLain.rawatanOrtho;
          row.getCell(60).value += operatorLain.kesPerubatan;
          row.getCell(61).value += operatorLain.abses;
          row.getCell(62).value += operatorLain.kecederaanTulangMuka;
          row.getCell(63).value += operatorLain.kecederaanGigi;
          row.getCell(64).value += operatorLain.kecederaanTisuLembut;
          row.getCell(65).value += operatorLain.cabutanSurgical;
          row.getCell(66).value += operatorLain.pembedahanKecilMulut;
          if (i > 1) {
            row.getCell(67).value += operatorLain.crownBridgeBaru;
            row.getCell(68).value += operatorLain.crownBridgeSemula;
            row.getCell(69).value += operatorLain.postCoreBaru;
            row.getCell(70).value += operatorLain.postCoreSemula;
            row.getCell(71).value += operatorLain.prosthodontikPenuhDenturBaru;
            row.getCell(72).value +=
              operatorLain.prosthodontikPenuhDenturSemula;
            row.getCell(73).value += operatorLain.jumlahPesakitBuatDenturPenuh;
            row.getCell(74).value += operatorLain.prosthodontikSeparaDenturBaru;
            row.getCell(75).value +=
              operatorLain.prosthodontikSeparaDenturSemula;
            row.getCell(76).value += operatorLain.jumlahPesakitBuatDenturSepara;
            row.getCell(77).value += operatorLain.immediateDenture;
            row.getCell(78).value += operatorLain.pembaikanDenture;
          }
          // row.getCell(79).value += operatorLain.kesSelesai;
          row.getCell(80).value += operatorLain.xrayDiambil;
          // row.getCell(81).value += operatorLain.pesakitDisaringOC;
        }
        j++;
        if (i === 11) {
          j++;
        }
      }
    }

    // data skor bpe
    j = 0;
    for (let i = 0; i < data[5].length; i++) {
      const [skorBpe] = data[5][i].skorBpe || [];

      if (skorBpe) {
        const row = worksheet.getRow(17 + j);
        if (i > 5) {
          row.getCell(16).value = skorBpe.skorBPEZero;
          row.getCell(17).value = skorBpe.skorBPEMoreThanZero;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    // data kedatangan
    for (const item of data[6]) {
      const rowNumber = rowNumbers[item._id];
      if (rowNumber !== undefined) {
        const row = worksheet.getRow(rowNumber);
        const baruAddedUp = row.getCell(2).value + item.kedatanganBaru;
        const ulanganAddedUp = row.getCell(3).value + item.kedatanganUlangan;
        row.getCell(2).value = baruAddedUp;
        row.getCell(3).value = ulanganAddedUp;
      }
    }

    // data OKU pemeriksaan
    for (const item of data[7]) {
      const row = worksheet.getRow(25);
      row.getCell(4).value += item.jumlahd;
      row.getCell(5).value += item.jumlahf;
      row.getCell(6).value += item.jumlahx;
      row.getCell(7).value += item.jumlahdfx;
      row.getCell(8).value += item.jumlahD;
      row.getCell(9).value += item.jumlahM;
      row.getCell(10).value += item.jumlahF;
      row.getCell(11).value += item.jumlahX;
      row.getCell(12).value += item.jumlahDMFX;
      row.getCell(13).value += item.jumlahMBK;
      row.getCell(14).value += item.statusBebasKaries;
      row.getCell(15).value += item.TPR;
      if (
        ![
          'lima-enam',
          'tujuh-sembilan',
          'sepuluh-dua-belas',
          'tiga-belas-empat-belas',
        ].includes(item._id)
      ) {
        row.getCell(16).value += item.skorBPEZero;
        row.getCell(17).value += item.skorBPEMoreThanZero;
      }
      row.getCell(18).value += item.perluSapuanFluorida;
      row.getCell(19).value += item.perluJumlahPesakitPrrJenis1;
      row.getCell(20).value += item.perluJumlahGigiPrrJenis1;
      row.getCell(21).value += item.perluJumlahPesakitFS;
      row.getCell(22).value += item.perluJumlahGigiFS;
      row.getCell(23).value += item.perluPenskaleran;
    }

    // data OKU rawatan
    for (const item of data[8]) {
      const row = worksheet.getRow(25);
      row.getCell(29).value += item.sapuanFluorida;
      row.getCell(30).value += item.jumlahPesakitPrrJenis1;
      row.getCell(31).value += item.jumlahGigiPrrJenis1;
      row.getCell(32).value += item.jumlahPesakitDiBuatFs;
      row.getCell(33).value += item.jumlahGigiDibuatFs;
      row.getCell(34).value += item.tampalanAntGdBaru;
      row.getCell(35).value += item.tampalanAntGdSemula;
      row.getCell(36).value += item.tampalanAntGkBaru;
      row.getCell(37).value += item.tampalanAntGkSemula;
      row.getCell(38).value += item.tampalanPostGdBaru;
      row.getCell(39).value += item.tampalanPostGdSemula;
      row.getCell(40).value += item.tampalanPostGkBaru;
      row.getCell(41).value += item.tampalanPostGkSemula;
      row.getCell(42).value += item.tampalanPostAmgGdBaru;
      row.getCell(43).value += item.tampalanPostAmgGdSemula;
      row.getCell(44).value += item.tampalanPostAmgGkBaru;
      row.getCell(45).value += item.tampalanPostAmgGkSemula;
      // skipping
      row.getCell(50).value += item.tampalanSementara;
      row.getCell(51).value += item.cabutanGd;
      row.getCell(52).value += item.cabutanGk;
      // skipping
      row.getCell(54).value += item.penskaleran;
      // skipping
      row.getCell(61).value += item.abses;
      // skipping
      row.getCell(79).value += item.kesSelesai;
    }

    // data BW pemeriksaan
    for (const item of data[9]) {
      const row = worksheet.getRow(26);
      row.getCell(4).value += item.jumlahd;
      row.getCell(5).value += item.jumlahf;
      row.getCell(6).value += item.jumlahx;
      row.getCell(7).value += item.jumlahdfx;
      row.getCell(8).value += item.jumlahD;
      row.getCell(9).value += item.jumlahM;
      row.getCell(10).value += item.jumlahF;
      row.getCell(11).value += item.jumlahX;
      row.getCell(12).value += item.jumlahDMFX;
      row.getCell(13).value += item.jumlahMBK;
      row.getCell(14).value += item.statusBebasKaries;
      row.getCell(15).value += item.TPR;
      if (
        ![
          'lima-enam',
          'tujuh-sembilan',
          'sepuluh-dua-belas',
          'tiga-belas-empat-belas',
        ].includes(item._id)
      ) {
        row.getCell(16).value += item.skorBPEZero;
        row.getCell(17).value += item.skorBPEMoreThanZero;
      }
      row.getCell(18).value += item.perluSapuanFluorida;
      row.getCell(19).value += item.perluJumlahPesakitPrrJenis1;
      row.getCell(20).value += item.perluJumlahGigiPrrJenis1;
      row.getCell(21).value += item.perluJumlahPesakitFS;
      row.getCell(22).value += item.perluJumlahGigiFS;
      row.getCell(23).value += item.perluPenskaleran;
    }

    // data BW rawatan
    for (const item of data[10]) {
      const row = worksheet.getRow(26);
      row.getCell(29).value += item.sapuanFluorida;
      row.getCell(30).value += item.jumlahPesakitPrrJenis1;
      row.getCell(31).value += item.jumlahGigiPrrJenis1;
      row.getCell(32).value += item.jumlahPesakitDiBuatFs;
      row.getCell(33).value += item.jumlahGigiDibuatFs;
      row.getCell(34).value += item.tampalanAntGdBaru;
      row.getCell(35).value += item.tampalanAntGdSemula;
      row.getCell(36).value += item.tampalanAntGkBaru;
      row.getCell(37).value += item.tampalanAntGkSemula;
      row.getCell(38).value += item.tampalanPostGdBaru;
      row.getCell(39).value += item.tampalanPostGdSemula;
      row.getCell(40).value += item.tampalanPostGkBaru;
      row.getCell(41).value += item.tampalanPostGkSemula;
      row.getCell(42).value += item.tampalanPostAmgGdBaru;
      row.getCell(43).value += item.tampalanPostAmgGdSemula;
      row.getCell(44).value += item.tampalanPostAmgGkBaru;
      row.getCell(45).value += item.tampalanPostAmgGkSemula;
      // skipping
      row.getCell(50).value += item.tampalanSementara;
      row.getCell(51).value += item.cabutanGd;
      row.getCell(52).value += item.cabutanGk;
      // skipping
      row.getCell(54).value += item.penskaleran;
      // skipping
      row.getCell(61).value += item.abses;
      // skipping
      row.getCell(79).value += item.kesSelesai;
    }

    // data kedatangan OKU
    for (const item of data[11]) {
      const row = worksheet.getRow(25);
      const baruAddedUp = row.getCell(2).value + item.kedatanganBaru;
      const ulanganAddedUp = row.getCell(3).value + item.kedatanganUlangan;
      row.getCell(2).value = baruAddedUp;
      row.getCell(3).value = ulanganAddedUp;
    }

    // data kedatangan BW
    for (const item of data[12]) {
      const row = worksheet.getRow(26);
      const baruAddedUp = row.getCell(2).value + item.kedatanganBaru;
      const ulanganAddedUp = row.getCell(3).value + item.kedatanganUlangan;
      row.getCell(2).value = baruAddedUp;
      row.getCell(3).value = ulanganAddedUp;
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'CC5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('CC6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'CC7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('CC8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG207] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePG214 = async (payload) => {
  logger.info('[generateRetenController/makePG214] PG214');
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
  try {
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
    worksheet.getCell('O5').value = `TAHUN: ${moment().format('YYYY')}`;

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
      rowNew.getCell(19).value = data[0].PG214[i].jumlahBukanWarganegara; //S13 Kategori Umur 60 Tahun
      rowNew.getCell(20).value = data[0].PG214[i].jumlahLelaki; //T13 Kategori Umur 60 Tahun
      rowNew.getCell(21).value = data[0].PG214[i].jumlahPerempuan; //U13 Kategori Umur 60 Tahun
      rowNew.getCell(22).value = data[0].PG214[i].jumlahEdentulous; //V13 Kategori Umur 60 Tahun
      rowNew.getCell(23).value = data[0].PG214[i].jumlahGigiLebihAtauSama20; //W13 Kategori Umur 60 Tahun
      rowNew.getCell(24).value = data[0].PG214[i].jumlahGigiKurang20; //X13 Kategori Umur 60 Tahun
      rowNew.getCell(25).value = data[0].PG214[i].jumlahSemuaGigi; //Y13 Kategori Umur 60 Tahun
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i].customPG214[0]) {
        let rowNew = worksheet.getRow(13 + i);
        jumlahReten += data[i].customPG214[0].jumlahReten;
        jumlahRetenSalah += data[i].customPG214[0].statusReten;
        rowNew.getCell(3).value = data[i].customPG214[0].jumlahMelayu; //C13	Kategori Umur 60 Tahun
        rowNew.getCell(4).value = data[i].customPG214[0].jumlahCina; //D13	Kategori Umur 60 Tahun
        rowNew.getCell(5).value = data[i].customPG214[0].jumlahIndia; //E13	Kategori Umur 60 Tahun
        rowNew.getCell(6).value = data[i].customPG214[0].jumlahBajau; //F13	Kategori Umur 60 Tahun
        rowNew.getCell(7).value = data[i].customPG214[0].jumlahDusun; //G13	Kategori Umur 60 Tahun
        rowNew.getCell(8).value = data[i].customPG214[0].jumlahKadazan; //H13 Kategori Umur 60 Tahun
        rowNew.getCell(9).value = data[i].customPG214[0].jumlahMurut; //I13	Kategori Umur 60 Tahun
        rowNew.getCell(10).value = data[i].customPG214[0].jumlahBMSL; //J13 Kategori Umur 60 Tahun
        rowNew.getCell(11).value = data[i].customPG214[0].jumlahMelanau; //K13 Kategori Umur 60 Tahun
        rowNew.getCell(12).value = data[i].customPG214[0].jumlahKedayan; //L13 Kategori Umur 60 Tahun
        rowNew.getCell(13).value = data[i].customPG214[0].jumlahIban; //M13 Kategori Umur 60 Tahun
        rowNew.getCell(14).value = data[i].customPG214[0].jumlahBidayuh; //N13 Kategori Umur 60 Tahun
        rowNew.getCell(15).value = data[i].customPG214[0].jumlahPenan; //O13 Kategori Umur 60 Tahun
        rowNew.getCell(16).value = data[i].customPG214[0].jumlahBMSwL; //P13 Kategori Umur 60 Tahun
        rowNew.getCell(17).value = data[i].customPG214[0].jumlahOAS; //Q13 Kategori Umur 60 Tahun
        rowNew.getCell(18).value = data[i].customPG214[0].jumlahLainlain; //R13 Kategori Umur 60 Tahun
        rowNew.getCell(19).value =
          data[i].customPG214[0].jumlahBukanWarganegara; //S13 Kategori Umur 60 Tahun
        rowNew.getCell(20).value = data[i].customPG214[0].jumlahLelaki; //T13 Kategori Umur 60 Tahun
        rowNew.getCell(21).value = data[i].customPG214[0].jumlahPerempuan; //U13 Kategori Umur 60 Tahun
        rowNew.getCell(22).value = data[i].customPG214[0].jumlahEdentulous; //V13 Kategori Umur 60 Tahun
        rowNew.getCell(23).value =
          data[i].customPG214[0].jumlahGigiLebihAtauSama20; //W13 Kategori Umur 60 Tahun
        rowNew.getCell(24).value = data[i].customPG214[0].jumlahGigiKurang20; //X13 Kategori Umur 60 Tahun
        rowNew.getCell(25).value = data[i].customPG214[0].jumlahSemuaGigi; //Y13 Kategori Umur 60 Tahun
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'Z5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('Z6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'Z7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('Z8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PG214] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePGPR201 = async (payload) => {
  logger.info('[generateRetenController/makePGPR201] PGPR201Baru');
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
  try {
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
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
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
              jumlahBesarAG60KeAtas += data[k][0].jumlahAGumur60KeAtas;
            }
          }
          rowNew.getCell(2).value = jumlahBesarAG60KeAtas;
        }
        rowNew.getCell(3).value = data[i][0].jumlahLawatanKeRumah; //LMG Ulangan Bawah 1 Tahun
        if (i > 0) {
          rowNew.getCell(4).value = data[i][0].jumlahNasihatPergigianIndividu; //Ceramah Baru Bawah 1 Tahun
          rowNew.getCell(5).value = data[i][0].jumlahNasihatKesihatanOral; //Ceramah Ulangan Bawah 1 Tahun
          rowNew.getCell(6).value = data[i][0].jumlahNasihatPemakanan; //Kursus Seminar Bengkel Bawah 1 Tahun
          rowNew.getCell(7).value = data[i][0].jumlahNasihatKanserMulut; //Main Peranan Bawah 1 Tahun
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
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('J9').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'J10'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('J11').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGPR201] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePgPro01 = async (payload) => {
  logger.info('[generateRetenController/makePgPro01] makePgPro01');
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
  try {
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
    let worksheet = workbook.getWorksheet('INDIVIDU_PGPRO01 BARU_FFR_Kod P');
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
      worksheet.getCell('D11').value = `${currentIndividu.nama.toUpperCase()}`;
    }
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
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
          rowNew.getCell(7).value = data[i].jumlahAktivitiCeramahUlangan; //E15
          rowNew.getCell(8).value = data[i].jumlahPesertaCeramahUlangan; //F15
        }
        rowNew.getCell(9).value = data[i].jumlahAktivitiBaruLMG; //G15
        rowNew.getCell(10).value = data[i].jumlahPesertaBaruLMG; //H15
        if (kodSpesial.has(data[i]._id)) {
          rowNew.getCell(11).value = data[i].jumlahAktivitiUlanganLMG; //I15
          rowNew.getCell(12).value = data[i].jumlahPesertaUlanganLMG; //J15
        }
        rowNew.getCell(13).value = data[i].jumlahAktivitiPerananKempen; //K15
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
        rowNew.getCell(25).value = data[i].jumlahAktivitiKursusSeminarBengkel; //W15
        rowNew.getCell(26).value = data[i].jumlahPesertaKursusSeminarBengkel; //X15
        rowNew.getCell(27).value = data[i].jumlahAktivitiMultimedia; //Y15
        rowNew.getCell(28).value = data[i].jumlahPesertaMultimedia; //Z15
        rowNew.getCell(29).value = data[i].jumlahAktivitiDentalBuskers; //AA15
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
        rowNew.getCell(41).value = data[i].jumlahAktivitiKanserMulutOHE; //AM15
        rowNew.getCell(42).value = data[i].jumlahPesertaKanserMulutOHE; //AN15
        rowNew.getCell(43).value = data[i].jumlahAKtivitiHentiRokok; //AO15
        rowNew.getCell(44).value = data[i].jumlahPesertaHentiRokok; //AP15
        rowNew.getCell(45).value = data[i].jumlahAktivitiHentiSirih; //AQ15
        rowNew.getCell(46).value = data[i].jumlahPesertaHentiSirih; //AR15
        rowNew.getCell(47).value = data[i].jumlahAktivitiHentiAlkohol; //AS15
        rowNew.getCell(48).value = data[i].jumlahPesertaHentiAlkohol; //AT15
        rowNew.getCell(49).value = data[i].jumlahAktivitiHentiTabiatLain; //AU15
        rowNew.getCell(50).value = data[i].jumlahPesertaHentiTabiatLain; //AV15
        rowNew.getCell(53).value = data[i].jumlahAktivitiTelevisyen; //AY15 // cells skipped
        rowNew.getCell(54).value = data[i].jumlahPesertaTelevisyen; //AZ15
        rowNew.getCell(55).value = data[i].jumlahAktivitiRadio; //BA15
        rowNew.getCell(56).value = data[i].jumlahPesertaRadio; //BB15
        rowNew.getCell(57).value = data[i].jumlahAktivitiCetak; //BC15
      }
    }

    worksheet.getCell(
      'BG9'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('BG10').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell('BG11').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    // read file
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGPRO01] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePgPro01Combined = async (payload) => {
  logger.info(
    '[generateRetenController/makePgPro01Combined] makePgPro01Combined'
  );
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
  try {
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
    let worksheet = workbook.getWorksheet('INDIVIDU_PGPRO 01 BARU_FFR');
    //
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
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
      worksheet.getCell('E11').value = `${currentIndividu.nama.toUpperCase()}`;
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
          rowNew.getCell(5).value = data[i].jumlahAktivitiCeramahUlangan; //E15
          rowNew.getCell(6).value = data[i].jumlahPesertaCeramahUlangan; //F15
        }
        rowNew.getCell(7).value = data[i].jumlahAktivitiBaruLMG; //G15
        rowNew.getCell(8).value = data[i].jumlahPesertaBaruLMG; //H15
        if (i > 8 && i < 16) {
          rowNew.getCell(9).value = data[i].jumlahAktivitiUlanganLMG; //I15
          rowNew.getCell(10).value = data[i].jumlahPesertaUlanganLMG; //J15
        }
        rowNew.getCell(11).value = data[i].jumlahAktivitiPerananKempen; //K15
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
        rowNew.getCell(23).value = data[i].jumlahAktivitiKursusSeminarBengkel; //W15
        rowNew.getCell(24).value = data[i].jumlahPesertaKursusSeminarBengkel; //X15
        rowNew.getCell(25).value = data[i].jumlahAktivitiMultimedia; //Y15
        rowNew.getCell(26).value = data[i].jumlahPesertaMultimedia; //Z15
        rowNew.getCell(27).value = data[i].jumlahAktivitiDentalBuskers; //AA15
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
        rowNew.getCell(39).value = data[i].jumlahAktivitiKanserMulutOHE; //AM15
        rowNew.getCell(40).value = data[i].jumlahPesertaKanserMulutOHE; //AN15
        rowNew.getCell(41).value = data[i].jumlahAKtivitiHentiRokok; //AO15
        rowNew.getCell(42).value = data[i].jumlahPesertaHentiRokok; //AP15
        rowNew.getCell(43).value = data[i].jumlahAktivitiHentiSirih; //AQ15
        rowNew.getCell(44).value = data[i].jumlahPesertaHentiSirih; //AR15
        rowNew.getCell(45).value = data[i].jumlahAktivitiHentiAlkohol; //AS15
        rowNew.getCell(46).value = data[i].jumlahPesertaHentiAlkohol; //AT15
        rowNew.getCell(47).value = data[i].jumlahAktivitiHentiTabiatLain; //AU15
        rowNew.getCell(48).value = data[i].jumlahPesertaHentiTabiatLain; //AV15
        rowNew.getCell(51).value = data[i].jumlahAktivitiTelevisyen; //AY15
        rowNew.getCell(52).value = data[i].jumlahPesertaTelevisyen; //AZ15
        rowNew.getCell(53).value = data[i].jumlahAktivitiRadio; //BA15
        rowNew.getCell(54).value = data[i].jumlahPesertaRadio; //BB15
        rowNew.getCell(55).value = data[i].jumlahAktivitiCetak; //BC15
      }
    }

    worksheet.getCell(
      'BE9'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('BE10').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell('BE11').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    // read file
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGPRO01Combined] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePGS201 = async (payload) => {
  logger.info('[generateRetenController/PGS201] PGS201 Pind. 2/2022 ');
  let {
    klinik,
    daerah,
    negeri,
    tarikhMula,
    tarikhAkhir,
    bulan,
    pilihanSekolah,
    username,
    fromEtl,
    jenisReten,
  } = payload;
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPGS201(payload);
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
      'PGS201.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    //get worksheet
    let worksheet = workbook.getWorksheet('PGS201');
    //Find Month and Year at the moment
    const monthName = moment(bulan ? bulan : tarikhMula).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');
    //write bulan and sesi at the moment
    // let details = worksheet.getRow(5);
    // details.getCell(
    //   2
    // ).value = `BAGI BULAN      ${monthName.toUpperCase()}         SESI      ${yearNow}`;
    // write facility
    worksheet.getCell('D7').value = `${klinik.toUpperCase()}`;
    pilihanSekolah
      ? (worksheet.getCell('D8').value = `${pilihanSekolah}`)
      : null;
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

    const rowsToIncrement = [2, 10, 19];

    for (let i = 0; i < 3; i++) {
      // let rowNew = worksheet.getRow(16 + i);
      console.log(`array ${i}. row ${rowNumber}`);
      if (data[i][0]) {
        console.log(`we have data`);
        // console.log(data[i][0].jumlahReten, data[i][0].jumlahRetenSalah);
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
        worksheet.getRow(rowNumber).getCell(8).value = data[i][0].skorPlakA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value = data[i][0].skorPlakC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value = data[i][0].skorPlakE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value = data[i][0].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value = data[i][0].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value = data[i][0].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value = data[i][0].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(16).value = data[i][0].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(17).value = data[i][0].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value = data[i][0].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value = data[i][0].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value =
          data[i][0].dfxSamaKosong; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value = data[i][0].jumlahMBK; //Column V (22)
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

        worksheet.getRow(rowNumber).getCell(28).value = data[i][0].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value = data[i][0].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value = data[i][0].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value = data[i][0].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(32).value = data[i][0].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(33).value = data[i][0].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(34).value = data[i][0].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(35).value = data[i][0].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(36).value = data[i][0].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(37).value = data[i][0].jumlahTPRmmi; //Column AK (37)
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

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(50).value =
          data[i][0].jumlahGigiPerluTampalanAntGdBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value =
          data[i][0].jumlahGigiPerluTampalanAntGdSemula; //Column AY (51)
        worksheet.getRow(rowNumber).getCell(52).value =
          data[i][0].jumlahGigiPerluTampalanAntGkBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value =
          data[i][0].jumlahGigiPerluTampalanAntGkSemula; //Column BA (53)

        worksheet.getRow(rowNumber).getCell(54).value =
          data[i][0].jumlahGigiPerluTampalanPostGdBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value =
          data[i][0].jumlahGigiPerluTampalanPostGdSemula; //Column BC (55)
        worksheet.getRow(rowNumber).getCell(56).value =
          data[i][0].jumlahGigiPerluTampalanPostGkBaru; //Column BD (56)
        worksheet.getRow(rowNumber).getCell(57).value =
          data[i][0].jumlahGigiPerluTampalanPostGkSemula; //Column BE (57)

        worksheet.getRow(rowNumber).getCell(58).value =
          data[i][0].jumlahGigiPerluTampalanPostAmgGdBaru; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value =
          data[i][0].jumlahGigiPerluTampalanPostAmgGdSemula; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(60).value =
          data[i][0].jumlahGigiPerluTampalanPostAmgGkBaru; //Column BH (60)
        worksheet.getRow(rowNumber).getCell(61).value =
          data[i][0].jumlahGigiPerluTampalanPostAmgGkSemula; //Column BI (61)

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
        worksheet.getRow(rowNumber).getCell(82).value = data[i][0].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value = data[i][0].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value = data[i][0].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value =
          data[i][0].jumlahKesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value =
          data[i][0].jumlahKesSelesaiBiasa; //Column CH (86)
      }
      rowNumber += rowsToIncrement.includes(i) ? 2 : 1;
      console.log(`row number now is ${rowNumber}`);
    }

    // sekolah
    for (let i = 0; i < data[4].length; i++) {
      if (data[4][i]) {
        switch (data[4][i]._id) {
          case 'prasek-5tahun':
            rowNumber = 18;
            console.log('pra5');
            break;
          case 'prasek-6tahun':
            rowNumber = 19;
            console.log('pra6');
            break;
          case 'darjah1':
            rowNumber = 23;
            console.log('darjah 1');
            break;
          case 'darjah2':
            rowNumber = 24;
            console.log('darjah 2');
            break;
          case 'darjah3':
            rowNumber = 25;
            console.log('darjah 3');
            break;
          case 'darjah4':
            rowNumber = 26;
            console.log('darjah 4');
            break;
          case 'darjah5':
            rowNumber = 27;
            console.log('darjah 5');
            break;
          case 'darjah6':
            rowNumber = 28;
            console.log('darjah 6');
            break;
          case 'darjah-kki':
            rowNumber = 29;
            console.log('darjah kki');
            break;
          case 'tingkatanPeralihan':
            rowNumber = 33;
            console.log('TP');
            break;
          case 'tingkatan1':
            rowNumber = 34;
            console.log('T1');
            break;
          case 'tingkatan2':
            rowNumber = 35;
            console.log('T2');
            break;
          case 'tingkatan3':
            rowNumber = 36;
            console.log('T3');
            break;
          case 'tingkatan4':
            rowNumber = 37;
            console.log('T4');
            break;
          case 'tingkatan5':
            rowNumber = 38;
            console.log('T5');
            break;
          case 'tingkatan-kki':
            rowNumber = 39;
            console.log('T KKI');
            break;
          default:
            rowNumber = 47;
            console.log('no data');
            break;
        }

        console.log(`data sekolah biasa. row ${rowNumber}`);
        console.log(`we have data`);
        console.log('-------------');
        // console.log(data[4][i].jumlahReten, data[4][i].jumlahRetenSalah);
        // jumlahReten += data[4][i].jumlahReten;
        // jumlahRetenSalah += data[4][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value +=
          data[4][i].engganKedatangan; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value +=
          data[4][i].tidakHadirKehadiran; //column E (5)
        worksheet.getRow(rowNumber).getCell(6).value +=
          data[4][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value +=
          data[4][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Kebersihan Mulut
        worksheet.getRow(rowNumber).getCell(8).value +=
          data[4][i].jumlahKebersihanMulutA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value +=
          data[4][i].jumlahKebersihanMulutC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value +=
          data[4][i].jumlahKebersihanMulutE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value += data[4][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value += data[4][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value += data[4][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value += data[4][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(16).value += data[4][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(17).value += data[4][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value += data[4][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value += data[4][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value +=
          data[4][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value += data[4][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value +=
          data[4][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(24).value +=
          data[4][i].gigiKekalDMFXsamaAtauKurangDari3; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value +=
          data[4][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value +=
          data[4][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value +=
          data[4][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(28).value += data[4][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value += data[4][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value += data[4][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value += data[4][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(32).value += data[4][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(33).value += data[4][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(34).value += data[4][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(35).value += data[4][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(36).value += data[4][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(37).value +=
          data[4][i].jumlahTPRmmi; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value +=
          data[4][i].jumlahTPRbiasa; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value +=
          data[4][i].jumlahKecederaanTulangMuka; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value +=
          data[4][i].jumlahKecederaanGigi; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value +=
          data[4][i].jumlahKecederaanTisuLembut; //Column AO (41)

        worksheet.getRow(rowNumber).getCell(42).value +=
          data[4][i].jumlahPatientAdaTSL; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value +=
          data[4][i].jumlahCleftMurid; //Column AQ (43)
        worksheet.getRow(rowNumber).getCell(44).value +=
          data[4][i].jumlahCleftDirujuk; //Column AR (44)

        //rAWATAN PERLU DIBUAT
        worksheet.getRow(rowNumber).getCell(45).value +=
          data[4][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value +=
          data[4][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value +=
          data[4][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(48).value +=
          data[4][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value +=
          data[4][i].perluJumlahGigiFS; //Column AW (49)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(50).value +=
          data[4][i].jumlahGigiPerluTampalanAntSewarnaGdBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value +=
          data[4][i].jumlahGigiPerluTampalanAntSewarnaGdSemula; //Column AY (51)
        worksheet.getRow(rowNumber).getCell(52).value +=
          data[4][i].jumlahGigiPerluTampalanAntSewarnaGkBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value +=
          data[4][i].jumlahGigiPerluTampalanAntSewarnaGkSemula; //Column BA (53)

        worksheet.getRow(rowNumber).getCell(54).value +=
          data[4][i].jumlahGigiPerluTampalanPostSewarnaGdBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value +=
          data[4][i].jumlahGigiPerluTampalanPostSewarnaGdSemula; //Column BC (55)
        worksheet.getRow(rowNumber).getCell(56).value +=
          data[4][i].jumlahGigiPerluTampalanPostSewarnaGkBaru; //Column BD (56)
        worksheet.getRow(rowNumber).getCell(57).value +=
          data[4][i].jumlahGigiPerluTampalanPostSewarnaGkSemula; //Column BE (57)

        worksheet.getRow(rowNumber).getCell(58).value +=
          data[4][i].jumlahGigiPerluTampalanPosAmalgamGdBaru; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value +=
          data[4][i].jumlahGigiPerluTampalanPosAmalgamGdSemula; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(60).value +=
          data[4][i].jumlahGigiPerluTampalanPosAmalgamGkBaru; //Column BH (60)
        worksheet.getRow(rowNumber).getCell(61).value +=
          data[4][i].jumlahGigiPerluTampalanPosAmalgamGkSemula; //Column BI (61)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(62).value +=
          data[4][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(63).value +=
          data[4][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(64).value +=
          data[4][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(65).value +=
          data[4][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(66).value +=
          data[4][i].jumlahGigiDibuatFs; //Column BN (66)

        worksheet.getRow(rowNumber).getCell(67).value +=
          data[4][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(68).value +=
          data[4][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(69).value +=
          data[4][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(70).value +=
          data[4][i].tampalanAntGkSemula; //Column BR (70)

        worksheet.getRow(rowNumber).getCell(71).value +=
          data[4][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(72).value +=
          data[4][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(73).value +=
          data[4][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(74).value +=
          data[4][i].tampalanPostGkSemula; //Column BV (74)

        worksheet.getRow(rowNumber).getCell(75).value +=
          data[4][i].tampalanPostAmgGdBaru; //Column BW (75)
        worksheet.getRow(rowNumber).getCell(76).value +=
          data[4][i].tampalanPostAmgGdSemula; //Column BX (76)
        worksheet.getRow(rowNumber).getCell(77).value +=
          data[4][i].tampalanPostAmgGkBaru; //Column BY (77)
        worksheet.getRow(rowNumber).getCell(78).value +=
          data[4][i].tampalanPostAmgGkSemula; //Column BZ (78)

        worksheet.getRow(rowNumber).getCell(81).value +=
          data[4][i].tampalanSementara; //Column CC (81)
        worksheet.getRow(rowNumber).getCell(82).value += data[4][i].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value += data[4][i].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value += data[4][i].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value +=
          data[4][i].kesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value += data[4][i].kesSelesai; //Column CH (86)
      }
    }
    for (let i = 0; i < data[5].length; i++) {
      if (data[5][i]) {
        switch (data[5][i]._id) {
          case 'prasek-oku':
            rowNumber = 20;
            console.log('pra-oku');
            break;
          default:
            rowNumber = 47;
            console.log('no data');
            break;
        }

        console.log(`data sekolah oku. row ${rowNumber}`);
        console.log(`we have data`);
        console.log('-----------');
        // console.log(data[5][i].jumlahReten, data[5][i].jumlahRetenSalah);
        // jumlahReten += data[5][i].jumlahReten;
        // jumlahRetenSalah += data[5][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value +=
          data[5][i].engganKedatangan; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value +=
          data[5][i].tidakHadirKehadiran; //column E (5)
        worksheet.getRow(rowNumber).getCell(6).value +=
          data[5][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value +=
          data[5][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Kebersihan Mulut
        worksheet.getRow(rowNumber).getCell(8).value +=
          data[5][i].jumlahKebersihanMulutA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value +=
          data[5][i].jumlahKebersihanMulutC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value +=
          data[5][i].jumlahKebersihanMulutE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value += data[5][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value += data[5][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value += data[5][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value += data[5][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(16).value += data[5][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(17).value += data[5][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value += data[5][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value += data[5][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value +=
          data[5][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value += data[5][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value +=
          data[5][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(24).value +=
          data[5][i].gigiKekalDMFXsamaAtauKurangDari3; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value +=
          data[5][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value +=
          data[5][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value +=
          data[5][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(28).value += data[5][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value += data[5][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value += data[5][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value += data[5][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(32).value += data[5][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(33).value += data[5][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(34).value += data[5][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(35).value += data[5][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(36).value += data[5][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(37).value +=
          data[5][i].jumlahTPRmmi; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value +=
          data[5][i].jumlahTPRbiasa; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value +=
          data[5][i].jumlahKecederaanTulangMuka; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value +=
          data[5][i].jumlahKecederaanGigi; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value +=
          data[5][i].jumlahKecederaanTisuLembut; //Column AO (41)

        worksheet.getRow(rowNumber).getCell(42).value +=
          data[5][i].jumlahPatientAdaTSL; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value +=
          data[5][i].jumlahCleftMurid; //Column AQ (43)
        worksheet.getRow(rowNumber).getCell(44).value +=
          data[5][i].jumlahCleftDirujuk; //Column AR (44)

        //rAWATAN PERLU DIBUAT
        worksheet.getRow(rowNumber).getCell(45).value +=
          data[5][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value +=
          data[5][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value +=
          data[5][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(48).value +=
          data[5][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value +=
          data[5][i].perluJumlahGigiFS; //Column AW (49)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(50).value +=
          data[5][i].jumlahGigiPerluTampalanAntSewarnaGdBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value +=
          data[5][i].jumlahGigiPerluTampalanAntSewarnaGdSemula; //Column AY (51)
        worksheet.getRow(rowNumber).getCell(52).value +=
          data[5][i].jumlahGigiPerluTampalanAntSewarnaGkBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value +=
          data[5][i].jumlahGigiPerluTampalanAntSewarnaGkSemula; //Column BA (53)

        worksheet.getRow(rowNumber).getCell(54).value +=
          data[5][i].jumlahGigiPerluTampalanPostSewarnaGdBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value +=
          data[5][i].jumlahGigiPerluTampalanPostSewarnaGdSemula; //Column BC (55)
        worksheet.getRow(rowNumber).getCell(56).value +=
          data[5][i].jumlahGigiPerluTampalanPostSewarnaGkBaru; //Column BD (56)
        worksheet.getRow(rowNumber).getCell(57).value +=
          data[5][i].jumlahGigiPerluTampalanPostSewarnaGkSemula; //Column BE (57)

        worksheet.getRow(rowNumber).getCell(58).value +=
          data[5][i].jumlahGigiPerluTampalanPosAmalgamGdBaru; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value +=
          data[5][i].jumlahGigiPerluTampalanPosAmalgamGdSemula; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(60).value +=
          data[5][i].jumlahGigiPerluTampalanPosAmalgamGkBaru; //Column BH (60)
        worksheet.getRow(rowNumber).getCell(61).value +=
          data[5][i].jumlahGigiPerluTampalanPosAmalgamGkSemula; //Column BI (61)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(62).value +=
          data[5][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(63).value +=
          data[5][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(64).value +=
          data[5][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(65).value +=
          data[5][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(66).value +=
          data[5][i].jumlahGigiDibuatFs; //Column BN (66)

        worksheet.getRow(rowNumber).getCell(67).value +=
          data[5][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(68).value +=
          data[5][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(69).value +=
          data[5][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(70).value +=
          data[5][i].tampalanAntGkSemula; //Column BR (70)

        worksheet.getRow(rowNumber).getCell(71).value +=
          data[5][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(72).value +=
          data[5][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(73).value +=
          data[5][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(74).value +=
          data[5][i].tampalanPostGkSemula; //Column BV (74)

        worksheet.getRow(rowNumber).getCell(75).value +=
          data[5][i].tampalanPostAmgGdBaru; //Column BW (75)
        worksheet.getRow(rowNumber).getCell(76).value +=
          data[5][i].tampalanPostAmgGdSemula; //Column BX (76)
        worksheet.getRow(rowNumber).getCell(77).value +=
          data[5][i].tampalanPostAmgGkBaru; //Column BY (77)
        worksheet.getRow(rowNumber).getCell(78).value +=
          data[5][i].tampalanPostAmgGkSemula; //Column BZ (78)

        worksheet.getRow(rowNumber).getCell(81).value +=
          data[5][i].tampalanSementara; //Column CC (81)
        worksheet.getRow(rowNumber).getCell(82).value += data[5][i].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value += data[5][i].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value += data[5][i].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value +=
          data[5][i].kesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value += data[5][i].kesSelesai; //Column CH (86)
      }
    }
    for (let i = 0; i < data[6].length; i++) {
      if (data[6][i]) {
        switch (data[6][i]._id) {
          case 'prasek-oap':
            rowNumber = 22;
            console.log('presek oap');
            break;
          case 'darjah1-oap':
            rowNumber = 31;
            console.log('darjah 1 oap');
            break;
          case 'darjah6-oap':
            rowNumber = 32;
            console.log('darjah 6 oap');
            break;
          case 'tingkatan4-oap':
            rowNumber = 41;
            console.log('T4 OAP');
            break;
          default:
            rowNumber = 47;
            console.log('no data');
            break;
        }

        console.log(`data sekolah oap. row ${rowNumber}`);
        console.log(`we have data`);
        console.log('-------------');
        // console.log(data[6][i].jumlahReten, data[6][i].jumlahRetenSalah);
        // jumlahReten += data[6][i].jumlahReten;
        // jumlahRetenSalah += data[6][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value +=
          data[6][i].engganKedatangan; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value +=
          data[6][i].tidakHadirKehadiran; //column E (5)
        worksheet.getRow(rowNumber).getCell(6).value +=
          data[6][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value +=
          data[6][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Kebersihan Mulut
        worksheet.getRow(rowNumber).getCell(8).value +=
          data[6][i].jumlahKebersihanMulutA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value +=
          data[6][i].jumlahKebersihanMulutC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value +=
          data[6][i].jumlahKebersihanMulutE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value += data[6][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value += data[6][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value += data[6][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value += data[6][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(16).value += data[6][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(17).value += data[6][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value += data[6][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value += data[6][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value +=
          data[6][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value += data[6][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value +=
          data[6][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(24).value +=
          data[6][i].gigiKekalDMFXsamaAtauKurangDari3; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value +=
          data[6][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value +=
          data[6][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value +=
          data[6][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(28).value += data[6][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value += data[6][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value += data[6][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value += data[6][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(32).value += data[6][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(33).value += data[6][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(34).value += data[6][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(35).value += data[6][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(36).value += data[6][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(37).value +=
          data[6][i].jumlahTPRmmi; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value +=
          data[6][i].jumlahTPRbiasa; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value +=
          data[6][i].jumlahKecederaanTulangMuka; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value +=
          data[6][i].jumlahKecederaanGigi; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value +=
          data[6][i].jumlahKecederaanTisuLembut; //Column AO (41)

        worksheet.getRow(rowNumber).getCell(42).value +=
          data[6][i].jumlahPatientAdaTSL; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value +=
          data[6][i].jumlahCleftMurid; //Column AQ (43)
        worksheet.getRow(rowNumber).getCell(44).value +=
          data[6][i].jumlahCleftDirujuk; //Column AR (44)

        //rAWATAN PERLU DIBUAT
        worksheet.getRow(rowNumber).getCell(45).value +=
          data[6][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value +=
          data[6][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value +=
          data[6][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(48).value +=
          data[6][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value +=
          data[6][i].perluJumlahGigiFS; //Column AW (49)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(50).value +=
          data[6][i].jumlahGigiPerluTampalanAntSewarnaGdBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value +=
          data[6][i].jumlahGigiPerluTampalanAntSewarnaGdSemula; //Column AY (51)
        worksheet.getRow(rowNumber).getCell(52).value +=
          data[6][i].jumlahGigiPerluTampalanAntSewarnaGkBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value +=
          data[6][i].jumlahGigiPerluTampalanAntSewarnaGkSemula; //Column BA (53)

        worksheet.getRow(rowNumber).getCell(54).value +=
          data[6][i].jumlahGigiPerluTampalanPostSewarnaGdBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value +=
          data[6][i].jumlahGigiPerluTampalanPostSewarnaGdSemula; //Column BC (55)
        worksheet.getRow(rowNumber).getCell(56).value +=
          data[6][i].jumlahGigiPerluTampalanPostSewarnaGkBaru; //Column BD (56)
        worksheet.getRow(rowNumber).getCell(57).value +=
          data[6][i].jumlahGigiPerluTampalanPostSewarnaGkSemula; //Column BE (57)

        worksheet.getRow(rowNumber).getCell(58).value +=
          data[6][i].jumlahGigiPerluTampalanPosAmalgamGdBaru; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value +=
          data[6][i].jumlahGigiPerluTampalanPosAmalgamGdSemula; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(60).value +=
          data[6][i].jumlahGigiPerluTampalanPosAmalgamGkBaru; //Column BH (60)
        worksheet.getRow(rowNumber).getCell(61).value +=
          data[6][i].jumlahGigiPerluTampalanPosAmalgamGkSemula; //Column BI (61)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(62).value +=
          data[6][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(63).value +=
          data[6][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(64).value +=
          data[6][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(65).value +=
          data[6][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(66).value +=
          data[6][i].jumlahGigiDibuatFs; //Column BN (66)

        worksheet.getRow(rowNumber).getCell(67).value +=
          data[6][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(68).value +=
          data[6][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(69).value +=
          data[6][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(70).value +=
          data[6][i].tampalanAntGkSemula; //Column BR (70)

        worksheet.getRow(rowNumber).getCell(71).value +=
          data[6][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(72).value +=
          data[6][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(73).value +=
          data[6][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(74).value +=
          data[6][i].tampalanPostGkSemula; //Column BV (74)

        worksheet.getRow(rowNumber).getCell(75).value +=
          data[6][i].tampalanPostAmgGdBaru; //Column BW (75)
        worksheet.getRow(rowNumber).getCell(76).value +=
          data[6][i].tampalanPostAmgGdSemula; //Column BX (76)
        worksheet.getRow(rowNumber).getCell(77).value +=
          data[6][i].tampalanPostAmgGkBaru; //Column BY (77)
        worksheet.getRow(rowNumber).getCell(78).value +=
          data[6][i].tampalanPostAmgGkSemula; //Column BZ (78)

        worksheet.getRow(rowNumber).getCell(81).value +=
          data[6][i].tampalanSementara; //Column CC (81)
        worksheet.getRow(rowNumber).getCell(82).value += data[6][i].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value += data[6][i].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value += data[6][i].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value +=
          data[6][i].kesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value += data[6][i].kesSelesai; //Column CH (86)
      }
    }
    for (let i = 0; i < data[7].length; i++) {
      if (data[7][i]) {
        switch (data[7][i]._id) {
          case 'all-oap':
            rowNumber = 43;
            console.log('OAP');
            break;
          default:
            rowNumber = 47;
            console.log('no data');
            break;
        }

        console.log(`data all oap. row ${rowNumber}`);
        console.log(`we have data`);
        console.log('------------');
        // console.log(data[7][i].jumlahReten, data[7][i].jumlahRetenSalah);
        // jumlahReten += data[7][i].jumlahReten;
        // jumlahRetenSalah += data[7][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value +=
          data[7][i].engganKedatangan; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value +=
          data[7][i].tidakHadirKehadiran; //column E (5)
        worksheet.getRow(rowNumber).getCell(6).value +=
          data[7][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value +=
          data[7][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Kebersihan Mulut
        worksheet.getRow(rowNumber).getCell(8).value +=
          data[7][i].jumlahKebersihanMulutA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value +=
          data[7][i].jumlahKebersihanMulutC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value +=
          data[7][i].jumlahKebersihanMulutE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value += data[7][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value += data[7][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value += data[7][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value += data[7][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(16).value += data[7][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(17).value += data[7][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value += data[7][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value += data[7][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value +=
          data[7][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value += data[7][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value +=
          data[7][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(24).value +=
          data[7][i].gigiKekalDMFXsamaAtauKurangDari3; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value +=
          data[7][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value +=
          data[7][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value +=
          data[7][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(28).value += data[7][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value += data[7][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value += data[7][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value += data[7][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(32).value += data[7][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(33).value += data[7][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(34).value += data[7][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(35).value += data[7][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(36).value += data[7][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(37).value +=
          data[7][i].jumlahTPRmmi; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value +=
          data[7][i].jumlahTPRbiasa; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value +=
          data[7][i].jumlahKecederaanTulangMuka; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value +=
          data[7][i].jumlahKecederaanGigi; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value +=
          data[7][i].jumlahKecederaanTisuLembut; //Column AO (41)

        worksheet.getRow(rowNumber).getCell(42).value +=
          data[7][i].jumlahPatientAdaTSL; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value +=
          data[7][i].jumlahCleftMurid; //Column AQ (43)
        worksheet.getRow(rowNumber).getCell(44).value +=
          data[7][i].jumlahCleftDirujuk; //Column AR (44)

        //rAWATAN PERLU DIBUAT
        worksheet.getRow(rowNumber).getCell(45).value +=
          data[7][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value +=
          data[7][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value +=
          data[7][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(48).value +=
          data[7][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value +=
          data[7][i].perluJumlahGigiFS; //Column AW (49)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(50).value +=
          data[7][i].jumlahGigiPerluTampalanAntSewarnaGdBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value +=
          data[7][i].jumlahGigiPerluTampalanAntSewarnaGdSemula; //Column AY (51)
        worksheet.getRow(rowNumber).getCell(52).value +=
          data[7][i].jumlahGigiPerluTampalanAntSewarnaGkBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value +=
          data[7][i].jumlahGigiPerluTampalanAntSewarnaGkSemula; //Column BA (53)

        worksheet.getRow(rowNumber).getCell(54).value +=
          data[7][i].jumlahGigiPerluTampalanPostSewarnaGdBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value +=
          data[7][i].jumlahGigiPerluTampalanPostSewarnaGdSemula; //Column BC (55)
        worksheet.getRow(rowNumber).getCell(56).value +=
          data[7][i].jumlahGigiPerluTampalanPostSewarnaGkBaru; //Column BD (56)
        worksheet.getRow(rowNumber).getCell(57).value +=
          data[7][i].jumlahGigiPerluTampalanPostSewarnaGkSemula; //Column BE (57)

        worksheet.getRow(rowNumber).getCell(58).value +=
          data[7][i].jumlahGigiPerluTampalanPosAmalgamGdBaru; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value +=
          data[7][i].jumlahGigiPerluTampalanPosAmalgamGdSemula; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(60).value +=
          data[7][i].jumlahGigiPerluTampalanPosAmalgamGkBaru; //Column BH (60)
        worksheet.getRow(rowNumber).getCell(61).value +=
          data[7][i].jumlahGigiPerluTampalanPosAmalgamGkSemula; //Column BI (61)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(62).value +=
          data[7][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(63).value +=
          data[7][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(64).value +=
          data[7][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(65).value +=
          data[7][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(66).value +=
          data[7][i].jumlahGigiDibuatFs; //Column BN (66)

        worksheet.getRow(rowNumber).getCell(67).value +=
          data[7][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(68).value +=
          data[7][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(69).value +=
          data[7][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(70).value +=
          data[7][i].tampalanAntGkSemula; //Column BR (70)

        worksheet.getRow(rowNumber).getCell(71).value +=
          data[7][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(72).value +=
          data[7][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(73).value +=
          data[7][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(74).value +=
          data[7][i].tampalanPostGkSemula; //Column BV (74)

        worksheet.getRow(rowNumber).getCell(75).value +=
          data[7][i].tampalanPostAmgGdBaru; //Column BW (75)
        worksheet.getRow(rowNumber).getCell(76).value +=
          data[7][i].tampalanPostAmgGdSemula; //Column BX (76)
        worksheet.getRow(rowNumber).getCell(77).value +=
          data[7][i].tampalanPostAmgGkBaru; //Column BY (77)
        worksheet.getRow(rowNumber).getCell(78).value +=
          data[7][i].tampalanPostAmgGkSemula; //Column BZ (78)

        worksheet.getRow(rowNumber).getCell(81).value +=
          data[7][i].tampalanSementara; //Column CC (81)
        worksheet.getRow(rowNumber).getCell(82).value += data[7][i].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value += data[7][i].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value += data[7][i].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value +=
          data[7][i].kesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value += data[7][i].kesSelesai; //Column CH (86)
      }
    }
    for (let i = 0; i < data[8].length; i++) {
      if (data[8][i]) {
        switch (data[8][i]._id) {
          case 'all-oku':
            rowNumber = 44;
            console.log('OKU');
            break;
          default:
            rowNumber = 47;
            console.log('no data');
            break;
        }

        console.log(`data all oku. row ${rowNumber}`);
        console.log(`we have data`);
        console.log('------------');
        // console.log(data[8][i].jumlahReten, data[8][i].jumlahRetenSalah);
        // jumlahReten += data[8][i].jumlahReten;
        // jumlahRetenSalah += data[8][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value +=
          data[8][i].engganKedatangan; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value +=
          data[8][i].tidakHadirKehadiran; //column E (5)
        worksheet.getRow(rowNumber).getCell(6).value +=
          data[8][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value +=
          data[8][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Kebersihan Mulut
        worksheet.getRow(rowNumber).getCell(8).value +=
          data[8][i].jumlahKebersihanMulutA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value +=
          data[8][i].jumlahKebersihanMulutC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value +=
          data[8][i].jumlahKebersihanMulutE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value += data[8][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value += data[8][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value += data[8][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value += data[8][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(16).value += data[8][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(17).value += data[8][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value += data[8][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value += data[8][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value +=
          data[8][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value += data[8][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value +=
          data[8][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(24).value +=
          data[8][i].gigiKekalDMFXsamaAtauKurangDari3; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value +=
          data[8][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value +=
          data[8][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value +=
          data[8][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(28).value += data[8][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value += data[8][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value += data[8][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value += data[8][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(32).value += data[8][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(33).value += data[8][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(34).value += data[8][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(35).value += data[8][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(36).value += data[8][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(37).value +=
          data[8][i].jumlahTPRmmi; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value +=
          data[8][i].jumlahTPRbiasa; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value +=
          data[8][i].jumlahKecederaanTulangMuka; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value +=
          data[8][i].jumlahKecederaanGigi; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value +=
          data[8][i].jumlahKecederaanTisuLembut; //Column AO (41)

        worksheet.getRow(rowNumber).getCell(42).value +=
          data[8][i].jumlahPatientAdaTSL; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value +=
          data[8][i].jumlahCleftMurid; //Column AQ (43)
        worksheet.getRow(rowNumber).getCell(44).value +=
          data[8][i].jumlahCleftDirujuk; //Column AR (44)

        //rAWATAN PERLU DIBUAT
        worksheet.getRow(rowNumber).getCell(45).value +=
          data[8][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value +=
          data[8][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value +=
          data[8][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(48).value +=
          data[8][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value +=
          data[8][i].perluJumlahGigiFS; //Column AW (49)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(50).value +=
          data[8][i].jumlahGigiPerluTampalanAntSewarnaGdBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value +=
          data[8][i].jumlahGigiPerluTampalanAntSewarnaGdSemula; //Column AY (51)
        worksheet.getRow(rowNumber).getCell(52).value +=
          data[8][i].jumlahGigiPerluTampalanAntSewarnaGkBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value +=
          data[8][i].jumlahGigiPerluTampalanAntSewarnaGkSemula; //Column BA (53)

        worksheet.getRow(rowNumber).getCell(54).value +=
          data[8][i].jumlahGigiPerluTampalanPostSewarnaGdBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value +=
          data[8][i].jumlahGigiPerluTampalanPostSewarnaGdSemula; //Column BC (55)
        worksheet.getRow(rowNumber).getCell(56).value +=
          data[8][i].jumlahGigiPerluTampalanPostSewarnaGkBaru; //Column BD (56)
        worksheet.getRow(rowNumber).getCell(57).value +=
          data[8][i].jumlahGigiPerluTampalanPostSewarnaGkSemula; //Column BE (57)

        worksheet.getRow(rowNumber).getCell(58).value +=
          data[8][i].jumlahGigiPerluTampalanPosAmalgamGdBaru; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value +=
          data[8][i].jumlahGigiPerluTampalanPosAmalgamGdSemula; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(60).value +=
          data[8][i].jumlahGigiPerluTampalanPosAmalgamGkBaru; //Column BH (60)
        worksheet.getRow(rowNumber).getCell(61).value +=
          data[8][i].jumlahGigiPerluTampalanPosAmalgamGkSemula; //Column BI (61)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(62).value +=
          data[8][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(63).value +=
          data[8][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(64).value +=
          data[8][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(65).value +=
          data[8][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(66).value +=
          data[8][i].jumlahGigiDibuatFs; //Column BN (66)

        worksheet.getRow(rowNumber).getCell(67).value +=
          data[8][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(68).value +=
          data[8][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(69).value +=
          data[8][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(70).value +=
          data[8][i].tampalanAntGkSemula; //Column BR (70)

        worksheet.getRow(rowNumber).getCell(71).value +=
          data[8][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(72).value +=
          data[8][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(73).value +=
          data[8][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(74).value +=
          data[8][i].tampalanPostGkSemula; //Column BV (74)

        worksheet.getRow(rowNumber).getCell(75).value +=
          data[8][i].tampalanPostAmgGdBaru; //Column BW (75)
        worksheet.getRow(rowNumber).getCell(76).value +=
          data[8][i].tampalanPostAmgGdSemula; //Column BX (76)
        worksheet.getRow(rowNumber).getCell(77).value +=
          data[8][i].tampalanPostAmgGkBaru; //Column BY (77)
        worksheet.getRow(rowNumber).getCell(78).value +=
          data[8][i].tampalanPostAmgGkSemula; //Column BZ (78)

        worksheet.getRow(rowNumber).getCell(81).value +=
          data[8][i].tampalanSementara; //Column CC (81)
        worksheet.getRow(rowNumber).getCell(82).value += data[8][i].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value += data[8][i].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value += data[8][i].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value +=
          data[8][i].kesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value += data[8][i].kesSelesai; //Column CH (86)
      }
    }
    for (let i = 0; i < data[9].length; i++) {
      if (data[9][i]) {
        switch (data[9][i]._id) {
          case 'all':
            rowNumber = 42;
            console.log('all');
            break;
          default:
            rowNumber = 47;
            console.log('no data');
            break;
        }

        console.log(`data all. row ${rowNumber}`);
        console.log(`we have data`);
        // console.log(data[9][i].jumlahReten, data[9][i].jumlahRetenSalah);
        // jumlahReten += data[9][i].jumlahReten;
        // jumlahRetenSalah += data[9][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value +=
          data[9][i].engganKedatangan; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value +=
          data[9][i].tidakHadirKehadiran; //column E (5)
        worksheet.getRow(rowNumber).getCell(6).value +=
          data[9][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value +=
          data[9][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Kebersihan Mulut
        worksheet.getRow(rowNumber).getCell(8).value +=
          data[9][i].jumlahKebersihanMulutA; //Column H (8)
        worksheet.getRow(rowNumber).getCell(9).value +=
          data[9][i].jumlahKebersihanMulutC; //Column I (9)
        worksheet.getRow(rowNumber).getCell(10).value +=
          data[9][i].jumlahKebersihanMulutE; //Column J (10)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(11).value += data[9][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value += data[9][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value += data[9][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(15).value += data[9][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(16).value += data[9][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(17).value += data[9][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(18).value += data[9][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value += data[9][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(21).value +=
          data[9][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(22).value += data[9][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value +=
          data[9][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(24).value +=
          data[9][i].gigiKekalDMFXsamaAtauKurangDari3; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value +=
          data[9][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value +=
          data[9][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value +=
          data[9][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(28).value += data[9][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(29).value += data[9][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(30).value += data[9][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(31).value += data[9][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(32).value += data[9][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(33).value += data[9][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(34).value += data[9][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(35).value += data[9][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(36).value += data[9][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(37).value +=
          data[9][i].jumlahTPRmmi; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value +=
          data[9][i].jumlahTPRbiasa; //Column AL (38)

        worksheet.getRow(rowNumber).getCell(39).value +=
          data[9][i].jumlahKecederaanTulangMuka; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value +=
          data[9][i].jumlahKecederaanGigi; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value +=
          data[9][i].jumlahKecederaanTisuLembut; //Column AO (41)

        worksheet.getRow(rowNumber).getCell(42).value +=
          data[9][i].jumlahPatientAdaTSL; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value +=
          data[9][i].jumlahCleftMurid; //Column AQ (43)
        worksheet.getRow(rowNumber).getCell(44).value +=
          data[9][i].jumlahCleftDirujuk; //Column AR (44)

        //rAWATAN PERLU DIBUAT
        worksheet.getRow(rowNumber).getCell(45).value +=
          data[9][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value +=
          data[9][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value +=
          data[9][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(48).value +=
          data[9][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value +=
          data[9][i].perluJumlahGigiFS; //Column AW (49)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(50).value +=
          data[9][i].jumlahGigiPerluTampalanAntSewarnaGdBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value +=
          data[9][i].jumlahGigiPerluTampalanAntSewarnaGdSemula; //Column AY (51)
        worksheet.getRow(rowNumber).getCell(52).value +=
          data[9][i].jumlahGigiPerluTampalanAntSewarnaGkBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value +=
          data[9][i].jumlahGigiPerluTampalanAntSewarnaGkSemula; //Column BA (53)

        worksheet.getRow(rowNumber).getCell(54).value +=
          data[9][i].jumlahGigiPerluTampalanPostSewarnaGdBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value +=
          data[9][i].jumlahGigiPerluTampalanPostSewarnaGdSemula; //Column BC (55)
        worksheet.getRow(rowNumber).getCell(56).value +=
          data[9][i].jumlahGigiPerluTampalanPostSewarnaGkBaru; //Column BD (56)
        worksheet.getRow(rowNumber).getCell(57).value +=
          data[9][i].jumlahGigiPerluTampalanPostSewarnaGkSemula; //Column BE (57)

        worksheet.getRow(rowNumber).getCell(58).value +=
          data[9][i].jumlahGigiPerluTampalanPosAmalgamGdBaru; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value +=
          data[9][i].jumlahGigiPerluTampalanPosAmalgamGdSemula; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(60).value +=
          data[9][i].jumlahGigiPerluTampalanPosAmalgamGkBaru; //Column BH (60)
        worksheet.getRow(rowNumber).getCell(61).value +=
          data[9][i].jumlahGigiPerluTampalanPosAmalgamGkSemula; //Column BI (61)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(62).value +=
          data[9][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(63).value +=
          data[9][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(64).value +=
          data[9][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(65).value +=
          data[9][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(66).value +=
          data[9][i].jumlahGigiDibuatFs; //Column BN (66)

        worksheet.getRow(rowNumber).getCell(67).value +=
          data[9][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(68).value +=
          data[9][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(69).value +=
          data[9][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(70).value +=
          data[9][i].tampalanAntGkSemula; //Column BR (70)

        worksheet.getRow(rowNumber).getCell(71).value +=
          data[9][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(72).value +=
          data[9][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(73).value +=
          data[9][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(74).value +=
          data[9][i].tampalanPostGkSemula; //Column BV (74)

        worksheet.getRow(rowNumber).getCell(75).value +=
          data[9][i].tampalanPostAmgGdBaru; //Column BW (75)
        worksheet.getRow(rowNumber).getCell(76).value +=
          data[9][i].tampalanPostAmgGdSemula; //Column BX (76)
        worksheet.getRow(rowNumber).getCell(77).value +=
          data[9][i].tampalanPostAmgGkBaru; //Column BY (77)
        worksheet.getRow(rowNumber).getCell(78).value +=
          data[9][i].tampalanPostAmgGkSemula; //Column BZ (78)

        worksheet.getRow(rowNumber).getCell(81).value +=
          data[9][i].tampalanSementara; //Column CC (81)
        worksheet.getRow(rowNumber).getCell(82).value += data[9][i].cabutanGd; //Column CD (82)
        worksheet.getRow(rowNumber).getCell(83).value += data[9][i].cabutanGk; //Column CE (83)
        worksheet.getRow(rowNumber).getCell(84).value += data[9][i].penskaleran; //Column CF (84)

        worksheet.getRow(rowNumber).getCell(85).value +=
          data[9][i].kesSelesaiMMI; //Column CG (85)
        worksheet.getRow(rowNumber).getCell(86).value += data[9][i].kesSelesai; //Column CH (86)
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('CJ2'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('CJ3'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('CJ4'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('CJ5'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'PGS201';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/PGS201] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController/PGS201] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGS201] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePGS203P2 = async (payload) => {
  logger.info('[generateRetenController/PGS203] PGS203P2');
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
  try {
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
      worksheet.getCell('B6').value = `${currentKlinik.kp.toUpperCase()}`;
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

    for (let i = 0; i < data[0].length; i++) {
      console.log(`array ${i}. row ${rowNumber}`);
      const [pemeriksaan] = data[0][i].queryPemeriksaanPGS203 || [];

      if (pemeriksaan) {
        console.log(`we got data in this array`);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.jumlahRetenSalah;
        switch (i) {
          case 0:
            worksheet.getRow(rowNumber).getCell(3).value =
              data[0][0].Kerajaan || 'BELUM DIISI';
            worksheet.getRow(rowNumber + 1).getCell(3).value =
              data[0][0].Swasta || 'BELUM DIISI';
            break;
          default:
            break;
        }
        worksheet.getRow(rowNumber).getCell(4).value =
          pemeriksaan.kedatanganTahunSemasaBaru; //column D (4)
        worksheet.getRow(rowNumber).getCell(5).value =
          pemeriksaan.kedatanganTahunSemasaUlangan; //column E (5)

        worksheet.getRow(rowNumber).getCell(6).value = pemeriksaan.jumlahd; //Column F (6)
        worksheet.getRow(rowNumber).getCell(7).value = pemeriksaan.jumlahf; //Column G (7)
        worksheet.getRow(rowNumber).getCell(8).value = pemeriksaan.jumlahx; //Column F (8)

        worksheet.getRow(rowNumber).getCell(11).value = pemeriksaan.jumlahE; //Column K (11)
        worksheet.getRow(rowNumber).getCell(12).value = pemeriksaan.jumlahD; //Column L (12)
        worksheet.getRow(rowNumber).getCell(13).value = pemeriksaan.jumlahM; //Column M (13)
        worksheet.getRow(rowNumber).getCell(14).value = pemeriksaan.jumlahF; //Column N (14)
        worksheet.getRow(rowNumber).getCell(15).value = pemeriksaan.jumlahX; //Column O (15)

        worksheet.getRow(rowNumber).getCell(18).value =
          pemeriksaan.dfxSamaKosong; //Column R (18)
        worksheet.getRow(rowNumber).getCell(19).value = pemeriksaan.jumlahMBK; //Column S (19)

        worksheet.getRow(rowNumber).getCell(20).value =
          pemeriksaan.statusBebasKaries; //Column T (20)
        worksheet.getRow(rowNumber).getCell(21).value =
          pemeriksaan.xTambahMsamaKosong; //Column U (21)

        worksheet.getRow(rowNumber).getCell(22).value =
          pemeriksaan.eLebihAtauSamaDenganSatu; //Column V (22)
        worksheet.getRow(rowNumber).getCell(23).value =
          pemeriksaan.bebasKariesTetapiElebihAtauSamaDenganSatu; //Column W (23)

        worksheet.getRow(rowNumber).getCell(24).value = pemeriksaan.skorGIS0; //Column X (24)
        worksheet.getRow(rowNumber).getCell(25).value = pemeriksaan.skorGIS1; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(26).value = pemeriksaan.skorGIS2; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(27).value = pemeriksaan.skorGIS3; //Column AA (27)

        if (i > 10) {
          // nnt kena ubah dah masuk sekolah
          worksheet.getRow(rowNumber).getCell(28).value = pemeriksaan.skorBPE0; //Column AB (28)
          worksheet.getRow(rowNumber).getCell(29).value = pemeriksaan.skorBPE1; //Column AC (29)
          worksheet.getRow(rowNumber).getCell(30).value = pemeriksaan.skorBPE2; //Column AD (30)
          worksheet.getRow(rowNumber).getCell(31).value = pemeriksaan.skorBPE3; //Column AE (31)
          worksheet.getRow(rowNumber).getCell(32).value = pemeriksaan.skorBPE4; //Column AF (32)
        }

        worksheet.getRow(rowNumber).getCell(33).value = pemeriksaan.jumlahTPR; //Column AG (33)
        worksheet.getRow(rowNumber).getCell(34).value =
          pemeriksaan.perluSapuanFluorida; //Column AH (34)
        worksheet.getRow(rowNumber).getCell(35).value =
          pemeriksaan.perluJumlahPesakitPrrJenis1; //Column AI (35)
        worksheet.getRow(rowNumber).getCell(36).value =
          pemeriksaan.perluJumlahGigiPrrJenis1; //Column AJ (36)
        worksheet.getRow(rowNumber).getCell(37).value =
          pemeriksaan.perluJumlahPesakitFS; //Column AK (37)
        worksheet.getRow(rowNumber).getCell(38).value =
          pemeriksaan.perluJumlahGigiFS; //Column AL (38)
        switch (i) {
          case 0:
            worksheet.getRow(rowNumber).getCell(64).value =
              data[0][0].jumlahTastadKerajaan || 0; //Column BL (64)
            break;
          case 1:
            worksheet.getRow(rowNumber).getCell(64).value =
              data[0][0].jumlahTastadSwasta || 0; //Column BL (64)
            break;
          default:
            break;
        }
        if (i < 3) {
          worksheet.getRow(rowNumber).getCell(65).value =
            pemeriksaan.jumlahFasilitiDilawati.length || 0; //Column BM (65)
        }
      }
      rowNumber += rowsToIncrement.includes(i) ? 2 : 1;
      console.log(`row number now is ${rowNumber}`);
    }

    rowNumber = 16;
    for (let i = 0; i < data[1].length; i++) {
      console.log(`array ${i}. row ${rowNumber}`);
      const [rawatan] = data[1][i].queryRawatanPGS203 || [];

      if (rawatan) {
        console.log(`we got data in this array`);
        worksheet.getRow(rowNumber).getCell(39).value =
          rawatan.telahSapuanFluorida; //Column AM (39)
        worksheet.getRow(rowNumber).getCell(40).value =
          rawatan.jumlahPesakitPrrJenis1; //Column AN (40)
        worksheet.getRow(rowNumber).getCell(41).value =
          rawatan.jumlahGigiPrrJenis1; //Column AO (41)
        worksheet.getRow(rowNumber).getCell(42).value =
          rawatan.jumlahPesakitDiBuatFs; //Column AP (42)
        worksheet.getRow(rowNumber).getCell(43).value =
          rawatan.jumlahGigiDibuatFs; //Column AQ (43)

        worksheet.getRow(rowNumber).getCell(44).value =
          rawatan.tampalanAntGdBaru; //Column AR (44)
        worksheet.getRow(rowNumber).getCell(45).value =
          rawatan.tampalanAntGdSemula; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(46).value =
          rawatan.tampalanAntGkBaru; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(47).value =
          rawatan.tampalanAntGkSemula; //Column AU (47)

        worksheet.getRow(rowNumber).getCell(48).value =
          rawatan.tampalanPostGdBaru; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(49).value =
          rawatan.tampalanPostGdSemula; //Column AW (49)
        worksheet.getRow(rowNumber).getCell(50).value =
          rawatan.tampalanPostGkBaru; //Column AX (50)
        worksheet.getRow(rowNumber).getCell(51).value =
          rawatan.tampalanPostGkSemula; //Column AY (51)

        worksheet.getRow(rowNumber).getCell(52).value =
          rawatan.tampalanPostAmgGdBaru; //Column AZ (52)
        worksheet.getRow(rowNumber).getCell(53).value =
          rawatan.tampalanPostAmgGdSemula; //Column BA (53)
        worksheet.getRow(rowNumber).getCell(54).value =
          rawatan.tampalanPostAmgGkBaru; //Column BB (54)
        worksheet.getRow(rowNumber).getCell(55).value =
          rawatan.tampalanPostAmgGkSemula; //Column BC (55)

        worksheet.getRow(rowNumber).getCell(58).value = rawatan.cabutanGd; //Column BF (58)
        worksheet.getRow(rowNumber).getCell(59).value = rawatan.cabutanGk; //Column BG (59)
        worksheet.getRow(rowNumber).getCell(61).value = rawatan.penskaleran; //Column BI (61)
        worksheet.getRow(rowNumber).getCell(62).value = rawatan.kesSelesai; //Column BJ (62)
      }
      rowNumber += rowsToIncrement.includes(i) ? 2 : 1;
      console.log(`row number now is ${rowNumber}`);
    }

    // sekolah
    for (let i = 0; i < data[2].length; i++) {
      console.log(`Data KPSKPB ${i}. row ${rowNumber}`);
      if (data[2][i]) {
        switch (data[2][i]._id) {
          case 'darjah1-kps':
            rowNumber = 21;
            console.log('darjah 1');
            break;
          case 'darjah1-kpb':
            rowNumber = 22;
            console.log('darjah 1');
            break;
          case 'darjah6-kps':
            rowNumber = 25;
            console.log('darjah 6');
            break;
          case 'darjah6-kpb':
            rowNumber = 26;
            console.log('darjah 6');
            break;
          case 'tingkatan4-kps':
            rowNumber = 38;
            break;
          case 'tingkatan4-kpb':
            rowNumber = 39;
            break;
          default:
            rowNumber = 52;
            console.log('no data');
            break;
        }

        console.log(`we have data`);
        // console.log(data[2][i].jumlahReten, data[2][i].jumlahRetenSalah);
        // jumlahReten += data[2][i].jumlahReten;
        // jumlahRetenSalah += data[2][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value =
          data[2][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(5).value =
          data[2][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(6).value = data[2][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(7).value = data[2][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(8).value = data[2][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(11).value = data[2][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(12).value = data[2][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(13).value = data[2][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(14).value = data[2][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(15).value = data[2][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(18).value =
          data[2][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(19).value = data[2][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(20).value =
          data[2][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(21).value =
          data[2][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(22).value =
          data[2][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(23).value =
          data[2][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(24).value = data[2][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(25).value = data[2][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(26).value = data[2][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(27).value = data[2][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(28).value = data[2][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(29).value = data[2][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(30).value = data[2][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(31).value = data[2][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(32).value = data[2][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(33).value =
          data[2][i].jumlahTPRbiasa; //Column AL (38)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(34).value =
          data[2][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(35).value =
          data[2][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(36).value =
          data[2][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(37).value =
          data[2][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(38).value =
          data[2][i].perluJumlahGigiFS; //Column AW (49)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(39).value =
          data[2][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(40).value =
          data[2][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(41).value =
          data[2][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(42).value =
          data[2][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(43).value =
          data[2][i].jumlahGigiDibuatFs; //Column BN (66)
        worksheet.getRow(rowNumber).getCell(44).value =
          data[2][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(45).value =
          data[2][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(46).value =
          data[2][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(47).value =
          data[2][i].tampalanAntGkSemula; //Column BR (70)
        worksheet.getRow(rowNumber).getCell(48).value =
          data[2][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(49).value =
          data[2][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(50).value =
          data[2][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(51).value =
          data[2][i].tampalanPostGkSemula;
        worksheet.getRow(rowNumber).getCell(52).value =
          data[2][i].tampalanPostAmgGdBaru;
        worksheet.getRow(rowNumber).getCell(53).value =
          data[2][i].tampalanPostAmgGdSemula;
        worksheet.getRow(rowNumber).getCell(54).value =
          data[2][i].tampalanPostAmgGkBaru;
        worksheet.getRow(rowNumber).getCell(55).value =
          data[2][i].tampalanPostAmgGkSemula;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(58).value = data[2][i].cabutanGd;
        worksheet.getRow(rowNumber).getCell(59).value = data[2][i].cabutanGk;
        worksheet.getRow(rowNumber).getCell(61).value = data[2][i].penskaleran;
        worksheet.getRow(rowNumber).getCell(62).value = data[2][i].kesSelesai;
      }
      rowNumber += rowsToIncrement.includes(i) ? 2 : 1;
    }

    // for (let i = 0; i < data[3].length; i++) {
    //   console.log(`array ${i}. row ${rowNumber}`);
    //   if (data[2][i]) {
    //     switch (data[2][i]._id) {
    //       case 'darjah1-kps':
    //         rowNumber = 21;
    //         console.log('darjah 1');
    //         break;
    //       case 'darjah1-kpb':
    //         rowNumber = 22;
    //         console.log('darjah 1');
    //         break;
    //       case 'darjah1-oap':
    //         rowNumber = 24;
    //         console.log('darjah 1 oap');
    //         break;
    //       case 'darjah6-kps':
    //         rowNumber = 25;
    //         console.log('darjah 6');
    //         break;
    //       case 'darjah6-kpb':
    //         rowNumber = 26;
    //         console.log('darjah 6');
    //         break;
    //       case 'darjah6-oap':
    //         rowNumber = 28;
    //         console.log('darjah 6');
    //         break;
    //       // KKI
    //       case 'darjah-all-kps':
    //         rowNumber = 33;
    //         break;
    //       case 'darjah-all-kpb':
    //         rowNumber = 34;
    //         break;
    //       case 'darjah-all-mbk':
    //         rowNumber = 36;
    //         break;
    //       case 'darjah-all-oap':
    //         rowNumber = 37;
    //         break;
    //       case 'tingkatan4-kps':
    //         rowNumber = 38;
    //         break;
    //       case 'tingkatan4-kpb':
    //         rowNumber = 39;
    //         break;
    //       case 'tingkatan4-oap':
    //         rowNumber = 41;
    //         break;
    //       // KKI
    //       case 'tingkatan-all-kps':
    //         rowNumber = 46;
    //         break;
    //       case 'tingkatan-all-kpb':
    //         rowNumber = 47;
    //         break;
    //       case 'tingkatan-all-mbk':
    //         rowNumber = 49;
    //         break;
    //       case 'tingkatan-all-oap':
    //         rowNumber = 50;
    //         break;
    //       default:
    //         console.log('no data');
    //     }

    //     console.log(`we have data`);
    //     // console.log(data[2][i].jumlahReten, data[2][i].jumlahRetenSalah);
    //     // jumlahReten += data[2][i].jumlahReten;
    //     // jumlahRetenSalah += data[2][i].jumlahRetenSalah;

    //     // bila masuk sekolah kena pakai switch
    //     // switch (i) {
    //     //   case 0:
    //     //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
    //     //       .enrolmen5Tahun
    //     //       ? data[0][0].enrolmen5Tahun
    //     //       : 'BELUM DIISI'; //column C (3)
    //     //     break;
    //     //   case 1:
    //     //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
    //     //       .enrolmen6Tahun
    //     //       ? data[0][0].enrolmen6Tahun
    //     //       : 'BELUM DIISI'; //column C (3)
    //     //     break;
    //     //   default:
    //     //     break;
    //     // }

    //     //Kedatangan
    //     worksheet.getRow(rowNumber).getCell(4).value =
    //       data[2][i].kedatanganTahunSemasaBaru; //Column F (6)
    //     worksheet.getRow(rowNumber).getCell(5).value =
    //       data[2][i].kedatanganTahunSemasaUlangan; //Column G (7)

    //     //Status gigi desidus
    //     worksheet.getRow(rowNumber).getCell(6).value = data[2][i].jumlahd; //Column K (11)
    //     worksheet.getRow(rowNumber).getCell(7).value = data[2][i].jumlahf; //Column L (12)
    //     worksheet.getRow(rowNumber).getCell(8).value = data[2][i].jumlahx; //Column M (13)

    //     //status gigi kekal
    //     worksheet.getRow(rowNumber).getCell(11).value = data[2][i].jumlahE; //Column O (15)
    //     worksheet.getRow(rowNumber).getCell(12).value = data[2][i].jumlahD; //Column P (16)
    //     worksheet.getRow(rowNumber).getCell(13).value = data[2][i].jumlahM; //Column Q (17)
    //     worksheet.getRow(rowNumber).getCell(14).value = data[2][i].jumlahF; //Column R (18)
    //     worksheet.getRow(rowNumber).getCell(15).value = data[2][i].jumlahX; //Column S (19)

    //     //status kesihatan mulut
    //     worksheet.getRow(rowNumber).getCell(18).value =
    //       data[2][i].dfxEqualToZero; //Column U (21)
    //     worksheet.getRow(rowNumber).getCell(19).value = data[2][i].jumlahMBK; //Column V (22)
    //     worksheet.getRow(rowNumber).getCell(20).value =
    //       data[2][i].statusBebasKaries; //Column W (23)
    //     worksheet.getRow(rowNumber).getCell(21).value =
    //       data[2][i].xTambahMsamaKosong; //Column Y (25)
    //     worksheet.getRow(rowNumber).getCell(22).value =
    //       data[2][i].eLebihAtauSamaDenganSatu; //Column Z (26)
    //     worksheet.getRow(rowNumber).getCell(23).value =
    //       data[2][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

    //     worksheet.getRow(rowNumber).getCell(24).value = data[2][i].skorGIS0; //Column AB (28)
    //     worksheet.getRow(rowNumber).getCell(25).value = data[2][i].skorGIS1; //Column AC (29)
    //     worksheet.getRow(rowNumber).getCell(26).value = data[2][i].skorGIS2; //Column AD (30)
    //     worksheet.getRow(rowNumber).getCell(27).value = data[2][i].skorGIS3; //Column AE (31)

    //     if (i > 15) {
    //       worksheet.getRow(rowNumber).getCell(28).value = data[2][i].skorBPE0; //Column AF (32)
    //       worksheet.getRow(rowNumber).getCell(29).value = data[2][i].skorBPE1; //Column AG (33)
    //       worksheet.getRow(rowNumber).getCell(30).value = data[2][i].skorBPE2; //Column AH (34)
    //       worksheet.getRow(rowNumber).getCell(31).value = data[2][i].skorBPE3; //Column AI (35)
    //       worksheet.getRow(rowNumber).getCell(32).value = data[2][i].skorBPE4; //Column AJ (36)
    //     }

    //     worksheet.getRow(rowNumber).getCell(33).value =
    //       data[2][i].jumlahTPRbiasa; //Column AL (38)

    //     // Rawatan Perlu Dibuat
    //     worksheet.getRow(rowNumber).getCell(34).value =
    //       data[2][i].perluSapuanFluorida; //Column AS (45)
    //     worksheet.getRow(rowNumber).getCell(35).value =
    //       data[2][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
    //     worksheet.getRow(rowNumber).getCell(36).value =
    //       data[2][i].perluJumlahGigiPrrJenis1; //Column AU (47)
    //     worksheet.getRow(rowNumber).getCell(37).value =
    //       data[2][i].perluJumlahPesakitFS; //Column AV (48)
    //     worksheet.getRow(rowNumber).getCell(38).value =
    //       data[2][i].perluJumlahGigiFS; //Column AW (49)

    //     //Rawatan telah dibuat
    //     worksheet.getRow(rowNumber).getCell(39).value =
    //       data[2][i].sapuanFluorida; //Column BJ (62)
    //     worksheet.getRow(rowNumber).getCell(40).value =
    //       data[2][i].jumlahPesakitPrrJenis1; //Column BK (63)
    //     worksheet.getRow(rowNumber).getCell(41).value =
    //       data[2][i].jumlahGigiPrrJenis1; //Column BL (64)
    //     worksheet.getRow(rowNumber).getCell(42).value =
    //       data[2][i].jumlahPesakitDiBuatFs; //Column BM (65)
    //     worksheet.getRow(rowNumber).getCell(43).value =
    //       data[2][i].jumlahGigiDibuatFs; //Column BN (66)
    //     worksheet.getRow(rowNumber).getCell(44).value =
    //       data[2][i].tampalanAntGdBaru; //Column BO (67)
    //     worksheet.getRow(rowNumber).getCell(45).value =
    //       data[2][i].tampalanAntGdSemula; //Column BP (68)
    //     worksheet.getRow(rowNumber).getCell(46).value =
    //       data[2][i].tampalanAntGkBaru; //Column BQ (69)
    //     worksheet.getRow(rowNumber).getCell(47).value =
    //       data[2][i].tampalanAntGkSemula; //Column BR (70)
    //     worksheet.getRow(rowNumber).getCell(48).value =
    //       data[2][i].tampalanPostGdBaru; //Column BS (71)
    //     worksheet.getRow(rowNumber).getCell(49).value =
    //       data[2][i].tampalanPostGdSemula; //Column BT (72)
    //     worksheet.getRow(rowNumber).getCell(50).value =
    //       data[2][i].tampalanPostGkBaru; //Column BU (73)
    //     worksheet.getRow(rowNumber).getCell(51).value =
    //       data[2][i].tampalanPostGkSemula;
    //     worksheet.getRow(rowNumber).getCell(52).value =
    //       data[2][i].tampalanPostAmgGdBaru;
    //     worksheet.getRow(rowNumber).getCell(53).value =
    //       data[2][i].tampalanPostAmgGdSemula;
    //     worksheet.getRow(rowNumber).getCell(54).value =
    //       data[2][i].tampalanPostAmgGkBaru;
    //     worksheet.getRow(rowNumber).getCell(55).value =
    //       data[2][i].tampalanPostAmgGkSemula;
    //     // skipping cells
    //     worksheet.getRow(rowNumber).getCell(58).value = data[2][i].cabutanGd;
    //     worksheet.getRow(rowNumber).getCell(59).value = data[2][i].cabutanGk;
    //     worksheet.getRow(rowNumber).getCell(61).value = data[2][i].penskaleran;
    //     worksheet.getRow(rowNumber).getCell(62).value = data[2][i].kesSelesai;
    //   }
    //   rowNumber += rowsToIncrement.includes(i) ? 2 : 1;
    // }

    for (let i = 0; i < data[4].length; i++) {
      console.log(`Data OAP ${i}. row ${rowNumber}`);
      if (data[4][i]) {
        switch (data[4][i]._id) {
          case 'darjah1-oap':
            rowNumber = 24;
            console.log('darjah 1 oap');
            break;
          case 'darjah6-oap':
            rowNumber = 28;
            console.log('darjah 6 oap');
            break;
          case 'tingkatan4-oap':
            rowNumber = 41;
            console.log('ting 4 oap');
            break;
          default:
            rowNumber = 52;
            console.log('no data');
            break;
        }

        console.log(`we have data`);
        // console.log(data[4][i].jumlahReten, data[4][i].jumlahRetenSalah);
        // jumlahReten += data[4][i].jumlahReten;
        // jumlahRetenSalah += data[4][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value =
          data[4][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(5).value =
          data[4][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(6).value = data[4][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(7).value = data[4][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(8).value = data[4][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(11).value = data[4][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(12).value = data[4][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(13).value = data[4][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(14).value = data[4][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(15).value = data[4][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(18).value =
          data[4][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(19).value = data[4][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(20).value =
          data[4][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(21).value =
          data[4][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(22).value =
          data[4][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(23).value =
          data[4][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(24).value = data[4][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(25).value = data[4][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(26).value = data[4][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(27).value = data[4][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(28).value = data[4][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(29).value = data[4][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(30).value = data[4][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(31).value = data[4][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(32).value = data[4][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(33).value =
          data[4][i].jumlahTPRbiasa; //Column AL (38)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(34).value =
          data[4][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(35).value =
          data[4][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(36).value =
          data[4][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(37).value =
          data[4][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(38).value =
          data[4][i].perluJumlahGigiFS; //Column AW (49)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(39).value =
          data[4][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(40).value =
          data[4][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(41).value =
          data[4][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(42).value =
          data[4][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(43).value =
          data[4][i].jumlahGigiDibuatFs; //Column BN (66)
        worksheet.getRow(rowNumber).getCell(44).value =
          data[4][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(45).value =
          data[4][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(46).value =
          data[4][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(47).value =
          data[4][i].tampalanAntGkSemula; //Column BR (70)
        worksheet.getRow(rowNumber).getCell(48).value =
          data[4][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(49).value =
          data[4][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(50).value =
          data[4][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(51).value =
          data[4][i].tampalanPostGkSemula;
        worksheet.getRow(rowNumber).getCell(52).value =
          data[4][i].tampalanPostAmgGdBaru;
        worksheet.getRow(rowNumber).getCell(53).value =
          data[4][i].tampalanPostAmgGdSemula;
        worksheet.getRow(rowNumber).getCell(54).value =
          data[4][i].tampalanPostAmgGkBaru;
        worksheet.getRow(rowNumber).getCell(55).value =
          data[4][i].tampalanPostAmgGkSemula;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(58).value = data[4][i].cabutanGd;
        worksheet.getRow(rowNumber).getCell(59).value = data[4][i].cabutanGk;
        worksheet.getRow(rowNumber).getCell(61).value = data[4][i].penskaleran;
        worksheet.getRow(rowNumber).getCell(62).value = data[4][i].kesSelesai;
      }
    }

    for (let i = 0; i < data[5].length; i++) {
      console.log(`Data ALL KPSKPB ${i}. row ${rowNumber}`);
      if (data[5][i]) {
        switch (data[5][i]._id) {
          case 'darjah-all-kps':
            rowNumber = 33;
            console.log('darjah all kps');
            break;
          case 'darjah-all-kpb':
            rowNumber = 34;
            console.log('darjah all kpb');
            break;
          case 'tingkatan-all-kps':
            rowNumber = 46;
            console.log('tingkatan all kps');
            break;
          case 'tingkatan-all-kpb':
            rowNumber = 47;
            console.log('tingkatan all kpb');
            break;
          default:
            rowNumber = 52;
            console.log('no data');
            break;
        }

        console.log(`we have data`);
        // console.log(data[5][i].jumlahReten, data[5][i].jumlahRetenSalah);
        // jumlahReten += data[5][i].jumlahReten;
        // jumlahRetenSalah += data[5][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value =
          data[5][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(5).value =
          data[5][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(6).value = data[5][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(7).value = data[5][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(8).value = data[5][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(11).value = data[5][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(12).value = data[5][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(13).value = data[5][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(14).value = data[5][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(15).value = data[5][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(18).value =
          data[5][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(19).value = data[5][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(20).value =
          data[5][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(21).value =
          data[5][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(22).value =
          data[5][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(23).value =
          data[5][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(24).value = data[5][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(25).value = data[5][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(26).value = data[5][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(27).value = data[5][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(28).value = data[5][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(29).value = data[5][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(30).value = data[5][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(31).value = data[5][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(32).value = data[5][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(33).value =
          data[5][i].jumlahTPRbiasa; //Column AL (38)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(34).value =
          data[5][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(35).value =
          data[5][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(36).value =
          data[5][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(37).value =
          data[5][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(38).value =
          data[5][i].perluJumlahGigiFS; //Column AW (49)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(39).value =
          data[5][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(40).value =
          data[5][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(41).value =
          data[5][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(42).value =
          data[5][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(43).value =
          data[5][i].jumlahGigiDibuatFs; //Column BN (66)
        worksheet.getRow(rowNumber).getCell(44).value =
          data[5][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(45).value =
          data[5][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(46).value =
          data[5][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(47).value =
          data[5][i].tampalanAntGkSemula; //Column BR (70)
        worksheet.getRow(rowNumber).getCell(48).value =
          data[5][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(49).value =
          data[5][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(50).value =
          data[5][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(51).value =
          data[5][i].tampalanPostGkSemula;
        worksheet.getRow(rowNumber).getCell(52).value =
          data[5][i].tampalanPostAmgGdBaru;
        worksheet.getRow(rowNumber).getCell(53).value =
          data[5][i].tampalanPostAmgGdSemula;
        worksheet.getRow(rowNumber).getCell(54).value =
          data[5][i].tampalanPostAmgGkBaru;
        worksheet.getRow(rowNumber).getCell(55).value =
          data[5][i].tampalanPostAmgGkSemula;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(58).value = data[5][i].cabutanGd;
        worksheet.getRow(rowNumber).getCell(59).value = data[5][i].cabutanGk;
        worksheet.getRow(rowNumber).getCell(61).value = data[5][i].penskaleran;
        worksheet.getRow(rowNumber).getCell(62).value = data[5][i].kesSelesai;
      }
    }

    for (let i = 0; i < data[6].length; i++) {
      console.log(`Data ALL KKI ${i}. row ${rowNumber}`);
      if (data[6][i]) {
        switch (data[6][i]._id) {
          case 'darjah-all-mbk':
            rowNumber = 36;
            break;
          case 'tingkatan-all-mbk':
            rowNumber = 49;
            break;
          default:
            rowNumber = 52;
            console.log('no data');
            break;
        }

        console.log(`we have data`);
        // console.log(data[6][i].jumlahReten, data[6][i].jumlahRetenSalah);
        // jumlahReten += data[6][i].jumlahReten;
        // jumlahRetenSalah += data[6][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value =
          data[6][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(5).value =
          data[6][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(6).value = data[6][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(7).value = data[6][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(8).value = data[6][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(11).value = data[6][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(12).value = data[6][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(13).value = data[6][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(14).value = data[6][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(15).value = data[6][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(18).value =
          data[6][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(19).value = data[6][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(20).value =
          data[6][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(21).value =
          data[6][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(22).value =
          data[6][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(23).value =
          data[6][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(24).value = data[6][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(25).value = data[6][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(26).value = data[6][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(27).value = data[6][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(28).value = data[6][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(29).value = data[6][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(30).value = data[6][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(31).value = data[6][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(32).value = data[6][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(33).value =
          data[6][i].jumlahTPRbiasa; //Column AL (38)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(34).value =
          data[6][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(35).value =
          data[6][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(36).value =
          data[6][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(37).value =
          data[6][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(38).value =
          data[6][i].perluJumlahGigiFS; //Column AW (49)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(39).value =
          data[6][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(40).value =
          data[6][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(41).value =
          data[6][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(42).value =
          data[6][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(43).value =
          data[6][i].jumlahGigiDibuatFs; //Column BN (66)
        worksheet.getRow(rowNumber).getCell(44).value =
          data[6][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(45).value =
          data[6][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(46).value =
          data[6][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(47).value =
          data[6][i].tampalanAntGkSemula; //Column BR (70)
        worksheet.getRow(rowNumber).getCell(48).value =
          data[6][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(49).value =
          data[6][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(50).value =
          data[6][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(51).value =
          data[6][i].tampalanPostGkSemula;
        worksheet.getRow(rowNumber).getCell(52).value =
          data[6][i].tampalanPostAmgGdBaru;
        worksheet.getRow(rowNumber).getCell(53).value =
          data[6][i].tampalanPostAmgGdSemula;
        worksheet.getRow(rowNumber).getCell(54).value =
          data[6][i].tampalanPostAmgGkBaru;
        worksheet.getRow(rowNumber).getCell(55).value =
          data[6][i].tampalanPostAmgGkSemula;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(58).value = data[6][i].cabutanGd;
        worksheet.getRow(rowNumber).getCell(59).value = data[6][i].cabutanGk;
        worksheet.getRow(rowNumber).getCell(61).value = data[6][i].penskaleran;
        worksheet.getRow(rowNumber).getCell(62).value = data[6][i].kesSelesai;
      }
    }

    for (let i = 0; i < data[7].length; i++) {
      console.log(`Data ALL OAP ${i}. row ${rowNumber}`);
      if (data[7][i]) {
        switch (data[7][i]._id) {
          case 'darjah-all-oap':
            rowNumber = 37;
            break;
          case 'tingkatan-all-oap':
            rowNumber = 50;
            break;
          default:
            rowNumber = 52;
            console.log('no data');
            break;
        }

        console.log(`we have data`);
        // console.log(data[7][i].jumlahReten, data[7][i].jumlahRetenSalah);
        // jumlahReten += data[7][i].jumlahReten;
        // jumlahRetenSalah += data[7][i].jumlahRetenSalah;

        // bila masuk sekolah kena pakai switch
        // switch (i) {
        //   case 0:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen5Tahun
        //       ? data[0][0].enrolmen5Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   case 1:
        //     worksheet.getRow(rowNumber).getCell(3).value = data[0][0]
        //       .enrolmen6Tahun
        //       ? data[0][0].enrolmen6Tahun
        //       : 'BELUM DIISI'; //column C (3)
        //     break;
        //   default:
        //     break;
        // }

        //Kedatangan
        worksheet.getRow(rowNumber).getCell(4).value =
          data[7][i].kedatanganTahunSemasaBaru; //Column F (6)
        worksheet.getRow(rowNumber).getCell(5).value =
          data[7][i].kedatanganTahunSemasaUlangan; //Column G (7)

        //Status gigi desidus
        worksheet.getRow(rowNumber).getCell(6).value = data[7][i].jumlahd; //Column K (11)
        worksheet.getRow(rowNumber).getCell(7).value = data[7][i].jumlahf; //Column L (12)
        worksheet.getRow(rowNumber).getCell(8).value = data[7][i].jumlahx; //Column M (13)

        //status gigi kekal
        worksheet.getRow(rowNumber).getCell(11).value = data[7][i].jumlahE; //Column O (15)
        worksheet.getRow(rowNumber).getCell(12).value = data[7][i].jumlahD; //Column P (16)
        worksheet.getRow(rowNumber).getCell(13).value = data[7][i].jumlahM; //Column Q (17)
        worksheet.getRow(rowNumber).getCell(14).value = data[7][i].jumlahF; //Column R (18)
        worksheet.getRow(rowNumber).getCell(15).value = data[7][i].jumlahX; //Column S (19)

        //status kesihatan mulut
        worksheet.getRow(rowNumber).getCell(18).value =
          data[7][i].dfxEqualToZero; //Column U (21)
        worksheet.getRow(rowNumber).getCell(19).value = data[7][i].jumlahMBK; //Column V (22)
        worksheet.getRow(rowNumber).getCell(20).value =
          data[7][i].statusBebasKaries; //Column W (23)
        worksheet.getRow(rowNumber).getCell(21).value =
          data[7][i].xTambahMsamaKosong; //Column Y (25)
        worksheet.getRow(rowNumber).getCell(22).value =
          data[7][i].eLebihAtauSamaDenganSatu; //Column Z (26)
        worksheet.getRow(rowNumber).getCell(23).value =
          data[7][i].bebasKariesTetapiElebihAtauSamaDenganSatu; //Column AA (27)

        worksheet.getRow(rowNumber).getCell(24).value = data[7][i].skorGIS0; //Column AB (28)
        worksheet.getRow(rowNumber).getCell(25).value = data[7][i].skorGIS1; //Column AC (29)
        worksheet.getRow(rowNumber).getCell(26).value = data[7][i].skorGIS2; //Column AD (30)
        worksheet.getRow(rowNumber).getCell(27).value = data[7][i].skorGIS3; //Column AE (31)

        if (i > 15) {
          worksheet.getRow(rowNumber).getCell(28).value = data[7][i].skorBPE0; //Column AF (32)
          worksheet.getRow(rowNumber).getCell(29).value = data[7][i].skorBPE1; //Column AG (33)
          worksheet.getRow(rowNumber).getCell(30).value = data[7][i].skorBPE2; //Column AH (34)
          worksheet.getRow(rowNumber).getCell(31).value = data[7][i].skorBPE3; //Column AI (35)
          worksheet.getRow(rowNumber).getCell(32).value = data[7][i].skorBPE4; //Column AJ (36)
        }

        worksheet.getRow(rowNumber).getCell(33).value =
          data[7][i].jumlahTPRbiasa; //Column AL (38)

        // Rawatan Perlu Dibuat
        worksheet.getRow(rowNumber).getCell(34).value =
          data[7][i].perluSapuanFluorida; //Column AS (45)
        worksheet.getRow(rowNumber).getCell(35).value =
          data[7][i].perluJumlahPesakitPrrJenis1; //Column AT (46)
        worksheet.getRow(rowNumber).getCell(36).value =
          data[7][i].perluJumlahGigiPrrJenis1; //Column AU (47)
        worksheet.getRow(rowNumber).getCell(37).value =
          data[7][i].perluJumlahPesakitFS; //Column AV (48)
        worksheet.getRow(rowNumber).getCell(38).value =
          data[7][i].perluJumlahGigiFS; //Column AW (49)

        //Rawatan telah dibuat
        worksheet.getRow(rowNumber).getCell(39).value =
          data[7][i].sapuanFluorida; //Column BJ (62)
        worksheet.getRow(rowNumber).getCell(40).value =
          data[7][i].jumlahPesakitPrrJenis1; //Column BK (63)
        worksheet.getRow(rowNumber).getCell(41).value =
          data[7][i].jumlahGigiPrrJenis1; //Column BL (64)
        worksheet.getRow(rowNumber).getCell(42).value =
          data[7][i].jumlahPesakitDiBuatFs; //Column BM (65)
        worksheet.getRow(rowNumber).getCell(43).value =
          data[7][i].jumlahGigiDibuatFs; //Column BN (66)
        worksheet.getRow(rowNumber).getCell(44).value =
          data[7][i].tampalanAntGdBaru; //Column BO (67)
        worksheet.getRow(rowNumber).getCell(45).value =
          data[7][i].tampalanAntGdSemula; //Column BP (68)
        worksheet.getRow(rowNumber).getCell(46).value =
          data[7][i].tampalanAntGkBaru; //Column BQ (69)
        worksheet.getRow(rowNumber).getCell(47).value =
          data[7][i].tampalanAntGkSemula; //Column BR (70)
        worksheet.getRow(rowNumber).getCell(48).value =
          data[7][i].tampalanPostGdBaru; //Column BS (71)
        worksheet.getRow(rowNumber).getCell(49).value =
          data[7][i].tampalanPostGdSemula; //Column BT (72)
        worksheet.getRow(rowNumber).getCell(50).value =
          data[7][i].tampalanPostGkBaru; //Column BU (73)
        worksheet.getRow(rowNumber).getCell(51).value =
          data[7][i].tampalanPostGkSemula;
        worksheet.getRow(rowNumber).getCell(52).value =
          data[7][i].tampalanPostAmgGdBaru;
        worksheet.getRow(rowNumber).getCell(53).value =
          data[7][i].tampalanPostAmgGdSemula;
        worksheet.getRow(rowNumber).getCell(54).value =
          data[7][i].tampalanPostAmgGkBaru;
        worksheet.getRow(rowNumber).getCell(55).value =
          data[7][i].tampalanPostAmgGkSemula;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(58).value = data[7][i].cabutanGd;
        worksheet.getRow(rowNumber).getCell(59).value = data[7][i].cabutanGk;
        worksheet.getRow(rowNumber).getCell(61).value = data[7][i].penskaleran;
        worksheet.getRow(rowNumber).getCell(62).value = data[7][i].kesSelesai;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'BP4'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('BP5').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'BP6'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('BP7').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/PGS203P2] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeMasa = async (payload) => {
  logger.info('[generateRetenController/makeMasa] makeMasa');
  let { klinik, daerah, negeri, bulan, username, fromEtl, jenisReten } =
    payload;
  try {
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
    let filename = path.join(__dirname, '..', 'public', 'exports', 'MASA.xlsx');
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    // get first worksheet
    let worksheet = workbook.getWorksheet('LAMPIRAN 2 - MAKLUMAT TAMBAHAN');
    // write negeri
    worksheet.getCell('B3').value = `${negeri.toUpperCase()}`;
    // write daerah
    worksheet.getCell('B4').value = `${daerah.toUpperCase()}`;
    // write facility
    worksheet.getCell('B5').value = `${klinik.toUpperCase()}`;
    // end intro

    // let jumlahRetenSalah = 0;
    // let jumlahReten = 0;
    let j;
    let cellNumber;

    cellNumber = 2;
    j = 0;
    for (let i = 0; i < data[0].opData.length; i++) {
      if (data[0].opData[i]) {
        // jumlahRetenSalah += data[0].opData[i].statusReten;
        // jumlahReten += data[0].opData[i].jumlahReten;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[0].opData[i].jumlahPesakit;
        cellNumber = cellNumber + 3;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[0].opData[i].jumlahPesakitYangDipanggilSebelum30Minit;
        cellNumber = cellNumber + 3;
        // worksheet.getRow(i + 15).getCell(cellNumber).value = (
        //   (jumlahRetenSalah / jumlahReten) *
        //   100
        // ).toFixed(2);
      }
      // jumlahReten = 0;
      // jumlahRetenSalah = 0;
      j++;
      if (i === 5) {
        j++;
      }
      cellNumber = 2;
    }

    cellNumber = 3;
    j = 0;
    for (let i = 0; i < data[1].temujanjiData.length; i++) {
      if (data[1].temujanjiData[i]) {
        // jumlahRetenSalah += data[1].temujanjiData[i].statusReten;
        // jumlahReten += data[1].temujanjiData[i].jumlahReten;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[1].temujanjiData[i].jumlahPesakit;
        cellNumber = cellNumber + 3;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[1].temujanjiData[i].jumlahPesakitYangDipanggilSebelum30Minit;
        cellNumber = cellNumber + 2;
        worksheet
          .getRow(j + 15)
          .getCell(
            cellNumber
          ).value = `${data[1].temujanjiData[i].jumlahPesakitYangDipanggilLebih30Minit} pesakit dikeluarkan kerana lewat`;
        // cellNumber = cellNumber + 3;
        // worksheet.getRow(j + 15).getCell(cellNumber).value = (
        //   (jumlahRetenSalah / jumlahReten) *
        //   100
        // ).toFixed(2);
      }
      // jumlahReten = 0;
      // jumlahRetenSalah = 0;
      j++;
      if (i === 5) {
        j++;
      }
      cellNumber = 3;
    }

    worksheet.getCell(
      'H3'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('H4').value = `Maklumat dari ${
      bulan
        ? `01-01-${new Date().getFullYear()} - ${moment().format('DD-MM-YYYY')}`
        : `01-01-${new Date().getFullYear()} - ${moment().format('DD-MM-YYYY')}`
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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/MASA] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeBp = async (payload) => {
  logger.info('[generateRetenController/makeBp] Reten BP');
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
  try {
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
        worksheet.getCell('B6').value = `${monthMula} / ${moment().format(
          'YYYY'
        )}`;
      } else {
        worksheet.getCell(
          'B6'
        ).value = `${monthMula} - ${monthAkhir} / ${moment().format('YYYY')}`;
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

    let jumlahReten = 0;
    let retenSalah = 0;

    // write data
    let rowNumber = 11;
    let cellNumber = 3;
    for (let i = 0; i < data[0].melayu.length; i++) {
      if (data[0].melayu[i]) {
        jumlahReten += data[0].melayu[i].jumlahReten;
        retenSalah += data[0].melayu[i].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[i].jumlahReten;
        if (i < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[i].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[i].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[0].melayu[i].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (i < 4) {
        cellNumber = 3;
      }
      if (i === 4) {
        rowNumber = 11;
        cellNumber = 4;
      }
      if (i > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 17;
    for (let i = 0; i < data[1].cina.length; i++) {
      if (data[1].cina[i]) {
        jumlahReten += data[1].cina[i].jumlahReten;
        retenSalah += data[1].cina[i].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[i].jumlahReten;
        if (i < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[i].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[i].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[1].cina[i].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (i < 4) {
        cellNumber = 3;
      }
      if (i === 4) {
        rowNumber = 17;
        cellNumber = 4;
      }
      if (i > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 23;
    for (let i = 0; i < data[2].india.length; i++) {
      if (data[2].india[i]) {
        jumlahReten += data[2].india[i].jumlahReten;
        retenSalah += data[2].india[i].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[i].jumlahReten;
        if (i < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[i].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[i].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[2].india[i].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (i < 4) {
        cellNumber = 3;
      }
      if (i === 4) {
        rowNumber = 23;
        cellNumber = 4;
      }
      if (i > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 29;
    for (let i = 0; i < data[3].bumiputeraSabah.length; i++) {
      if (data[3].bumiputeraSabah[i]) {
        jumlahReten += data[3].bumiputeraSabah[i].jumlahReten;
        retenSalah += data[3].bumiputeraSabah[i].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].bumiputeraSabah[i].jumlahReten;
        if (i < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].bumiputeraSabah[i].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].bumiputeraSabah[i].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[3].bumiputeraSabah[i].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (i < 4) {
        cellNumber = 3;
      }
      if (i === 4) {
        rowNumber = 29;
        cellNumber = 4;
      }
      if (i > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 35;
    for (let i = 0; i < data[4].bumiputeraSarawak.length; i++) {
      if (data[4].bumiputeraSarawak[i]) {
        jumlahReten += data[4].bumiputeraSarawak[i].jumlahReten;
        retenSalah += data[4].bumiputeraSarawak[i].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].bumiputeraSarawak[i].jumlahReten;
        if (i < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].bumiputeraSarawak[i].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].bumiputeraSarawak[i].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[4].bumiputeraSarawak[i].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (i < 4) {
        cellNumber = 3;
      }
      if (i === 4) {
        rowNumber = 35;
        cellNumber = 4;
      }
      if (i > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 41;
    for (let i = 0; i < data[5].orangAsliSemenanjung.length; i++) {
      if (data[5].orangAsliSemenanjung[i]) {
        jumlahReten += data[5].orangAsliSemenanjung[i].jumlahReten;
        retenSalah += data[5].orangAsliSemenanjung[i].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[5].orangAsliSemenanjung[i].jumlahReten;
        if (i < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[5].orangAsliSemenanjung[i].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[5].orangAsliSemenanjung[i].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[5].orangAsliSemenanjung[i].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (i < 4) {
        cellNumber = 3;
      }
      if (i === 4) {
        rowNumber = 41;
        cellNumber = 4;
      }
      if (i > 4) {
        cellNumber = 4;
      }
    }

    cellNumber = 3;
    rowNumber = 47;
    for (let i = 0; i < data[6].lain2.length; i++) {
      if (data[6].lain2[i]) {
        jumlahReten += data[6].lain2[i].jumlahReten;
        retenSalah += data[6].lain2[i].statusReten;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[6].lain2[i].jumlahReten;
        if (i < 5) {
          cellNumber += 2;
        } else {
          cellNumber += 3;
        }
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[6].lain2[i].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[6].lain2[i].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value +=
          data[6].lain2[i].jumlahDirujukKeKk;
      }
      rowNumber++;
      if (i < 4) {
        cellNumber = 3;
      }
      if (i === 4) {
        rowNumber = 47;
        cellNumber = 4;
      }
      if (i > 4) {
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

    worksheet.getCell('C5').value = `${yangMeminta.toUpperCase()}`;
    worksheet.getCell('C5').alignment = {
      wrapText: false,
      shrinkToFit: false,
      horizontal: 'right',
    };

    worksheet.getCell(
      'N4'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('N5').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell('N7').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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

    worksheet.name = moment(bulan).format('MMMM');

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/BP] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeBPE = async (payload) => {
  logger.info('[generateRetenController/makeBPE] Reten BPE');
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
  try {
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
      if (data[i]) {
        jumlahReten += data[i].jumlahReten;
        jumlahRetenSalah += data[i].statusReten;
        row.getCell(4).value =
          i % 2 === 0
            ? data[i].jumlahReten
            : data[i].kedatanganTahunSemasaUlangan; // leong, since match kita odd numbers adalah baru, dan even adalah ulangan, jd aku ckp ngn dia, kalau i/2 xde remainder, dia baru, kalau ada remainder dia ulangan
        row.getCell(5).value = i % 2 === 0 ? data[i].adaRujukanT2DMdariKK : 0; //Column E (5)
        row.getCell(6).value =
          i % 2 === 0 ? data[i].adaRujukanT2DMdariLainLain : 0; //Column F (6)
        row.getCell(7).value = i % 2 === 0 ? data[i].tiadaRujukanT2DM : 0; //Column G (7)
        row.getCell(8).value = data[i].risikoBpeDiabetes; //Column H (8)
        row.getCell(9).value = data[i].risikoBpePerokok; //Column I (9)
        row.getCell(10).value = data[i].risikoBpeLainLain; //Column J (10)
        row.getCell(11).value = i % 2 === 0 ? 0 : data[i].engganBPE; //Column K (11)
        row.getCell(12).value = data[i].skorBPE0; //Column L (12)
        row.getCell(13).value = data[i].skorBPE1; //Column M (13)
        row.getCell(14).value = data[i].skorBPE2; //Column N (14)
        row.getCell(15).value = data[i].skorBPE3; //Column O (15)
        row.getCell(16).value = data[i].skorBPE4; //Column P (16)
        row.getCell(17).value = data[i].adaPeriImplantMucositis; //Column Q (17)
        row.getCell(18).value = data[i].adaPeriImplantitis; //Column R (18)
        row.getCell(19).value = data[i].nasihatKaunselingDiet; //Column S (19)
        row.getCell(20).value = data[i].nasihatBerhentiMerokok; //Column T (20)
        row.getCell(21).value = data[i].nasihatLainlain; //Column U (21)
        row.getCell(22).value = data[i].nasihatOHE; //Column V (22)
        row.getCell(23).value = data[i].telahPenskaleran; //Column W (23)
        row.getCell(24).value = data[i].telahPendebridmenAkar; //Column X (24)
        row.getCell(25).value = data[i].telahPengilapanTampalanRungkup; //Column Y (25)
        row.getCell(26).value = data[i].telahAdjustasiOklusi; //Column Z (26)
        row.getCell(27).value = data[i].telahCabutGigiPerio; //Column AA (27)
        row.getCell(28).value = data[i].telahExtirpasiPulpaSebabPerio; //Column AB (28)
        row.getCell(29).value = data[i].telahRawatanPerioLain; //Column AC (29)
        row.getCell(30).value = data[i].telahRujukPakarPerio; //Column AD (30)
        row.getCell(31).value = data[i].engganRujukPakarPerio; //Column AE (31)
        row.getCell(32).value = data[i].engganRujukPakarPerio; //Column AF (32)
        row.getCell(33).value = data[i].rujukanKeKlinikSCD; //Column AG (33)
        row.getCell(34).value = data[i].rujukanKeKlinikUPPKA; //Column AH (34)
        row.getCell(35).value = data[i].kesSelesaiPerio; //Column AI (35)
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AI3'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AI4').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AI5'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('AI6').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/BPE] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeGender = async (payload) => {
  logger.info('[generateRetenController/makeGender] makeGender');
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
  try {
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
        worksheet.getCell('B5').value = `${monthMula} - ${monthAkhir}`;
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
      worksheet.getCell('C9').value = data[0].dataLelaki[0].pesakitBaru;
      worksheet.getCell('C10').value = data[0].dataLelaki[0].pesakitUlangan;
    }

    if (data[0].dataLelaki[1]) {
      worksheet.getCell('H9').value = data[0].dataLelaki[1].pesakitBaru;
      worksheet.getCell('H10').value = data[0].dataLelaki[1].pesakitUlangan;
    }

    if (data[0].dataLelaki[2]) {
      worksheet.getCell('M9').value = data[0].dataLelaki[2].pesakitBaru;
      worksheet.getCell('M10').value = data[0].dataLelaki[2].pesakitUlangan;
    }

    if (data[0].dataLelaki[3]) {
      worksheet.getCell('R9').value = data[0].dataLelaki[3].pesakitBaru;
      worksheet.getCell('R10').value = data[0].dataLelaki[3].pesakitUlangan;
    }

    if (data[0].dataLelaki[4]) {
      worksheet.getCell('C12').value = data[0].dataLelaki[4].pesakitBaru;
      worksheet.getCell('C13').value = data[0].dataLelaki[4].pesakitUlangan;
    }

    if (data[0].dataLelaki[5]) {
      worksheet.getCell('H12').value = data[0].dataLelaki[5].pesakitBaru;
      worksheet.getCell('H13').value = data[0].dataLelaki[5].pesakitUlangan;
    }

    if (data[0].dataLelaki[6]) {
      worksheet.getCell('M12').value = data[0].dataLelaki[6].pesakitBaru;
      worksheet.getCell('M13').value = data[0].dataLelaki[6].pesakitUlangan;
    }

    if (data[0].dataLelaki[7]) {
      worksheet.getCell('R12').value = data[0].dataLelaki[7].pesakitBaru;
      worksheet.getCell('R13').value = data[0].dataLelaki[7].pesakitUlangan;
    }

    // data perempuan
    if (data[1].dataPerempuan[0]) {
      worksheet.getCell('D9').value = data[1].dataPerempuan[0].pesakitBaru;
      worksheet.getCell('D10').value = data[1].dataPerempuan[0].pesakitUlangan;
    }

    if (data[1].dataPerempuan[1]) {
      worksheet.getCell('I9').value = data[1].dataPerempuan[1].pesakitBaru;
      worksheet.getCell('I10').value = data[1].dataPerempuan[1].pesakitUlangan;
    }

    if (data[1].dataPerempuan[2]) {
      worksheet.getCell('N9').value = data[1].dataPerempuan[2].pesakitBaru;
      worksheet.getCell('N10').value = data[1].dataPerempuan[2].pesakitUlangan;
    }

    if (data[1].dataPerempuan[3]) {
      worksheet.getCell('S9').value = data[1].dataPerempuan[3].pesakitBaru;
      worksheet.getCell('S10').value = data[1].dataPerempuan[3].pesakitUlangan;
    }

    if (data[1].dataPerempuan[4]) {
      worksheet.getCell('D12').value = data[1].dataPerempuan[4].pesakitBaru;
      worksheet.getCell('D13').value = data[1].dataPerempuan[4].pesakitUlangan;
    }

    if (data[1].dataPerempuan[5]) {
      worksheet.getCell('I12').value = data[1].dataPerempuan[5].pesakitBaru;
      worksheet.getCell('I13').value = data[1].dataPerempuan[5].pesakitUlangan;
    }

    if (data[1].dataPerempuan[6]) {
      worksheet.getCell('N12').value = data[1].dataPerempuan[6].pesakitBaru;
      worksheet.getCell('N13').value = data[1].dataPerempuan[6].pesakitUlangan;
    }

    if (data[1].dataPerempuan[7]) {
      worksheet.getCell('S12').value = data[1].dataPerempuan[7].pesakitBaru;
      worksheet.getCell('S13').value = data[1].dataPerempuan[7].pesakitUlangan;
    }

    // info
    worksheet.getCell(
      'Y3'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('Y4').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell('Y5').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/GENDER] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};

// new
const makeKEPP = async (payload) => {
  logger.info('[generateRetenController/makeKEPP] makeKEPP');
  let {
    negeri,
    tarikhMula,
    tarikhAkhir,
    bulan,
    username,
    fromEtl,
    jenisReten,
  } = payload;
  try {
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
        data = await Helper.countKEPP(payload);
        break;
    }
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    let filename = path.join(__dirname, '..', 'public', 'exports', 'KEPP.xlsx');
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('KEPP');
    //
    worksheet.getCell('B4').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('B5').value = bulan
      ? `${moment(bulan).format('MMMM')}`
      : `${moment(tarikhMula).format('MMMM')} - ${moment(tarikhAkhir).format(
          'MMMM'
        )}`;
    worksheet.getCell('B6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('YYYY')}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    //
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        let row = worksheet.getRow(12 + i);
        jumlahReten += data[i].jumlahReten;
        jumlahRetenSalah += data[i].statusReten;
        // nama kepp
        row.getCell(1).value = data[i].createdByKp;
        row.getCell(2).value = data[i].jumlahPegawai;
        // kedatangan
        row.getCell(3).value = data[i].jumlahKedatanganBaru;
        row.getCell(4).value = data[i].jumlahKedatanganUlangan;
        // kesEndoperludibuat
        row.getCell(5).value = data[i].jumlahKesEndoPerluAnt;
        row.getCell(6).value = data[i].jumlahKesEndoPerluPreMolar;
        row.getCell(7).value = data[i].jumlahKesEndoPerluMolar;
        row.getCell(8).value = data[i].jumlahKesEndoRedoKP;
        // skipping cells
        // kesEndoselesai
        row.getCell(10).value = data[i].jumlahKesEndoRedoKeppAnt;
        row.getCell(11).value = data[i].jumlahKesEndoRedoKeppPreMolar;
        row.getCell(12).value = data[i].jumlahKesEndoRedoKeppMolar;
        row.getCell(13).value = data[i].rawatSemula;
        row.getCell(14).value = data[i].jumlahKesEndoRedoKeppAnt;
        row.getCell(15).value = data[i].jumlahKesEndoRedoKeppPreMolar;
        row.getCell(16).value = data[i].jumlahKesEndoRedoKeppMolar;
        // skipping cells
        // kesRujukUppr
        row.getCell(18).value = data[i].jumlahKodRDITN3;
        row.getCell(19).value = data[i].jumlahRestoPascaEndo;
        row.getCell(20).value = data[i].jumlahKomplikasiDiKEPP;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('T3'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('T4'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('T5'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('T6'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'KEPP';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/KEPP] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeTOD = async (payload) => {
  logger.info('[generateRetenController/makeTOD] makeTOD');
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
  try {
    let data;
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
    worksheet.getCell('C10').value = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );

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
      jumlahPPdanJP.length > 0 ? `${jumlahPPdanJP[0].jumlah}` : 'TIADA DATA';
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
        row.getCell(11).value = data[0][i].queryBaru[0].dfxEqualToZero;
        row.getCell(12).value = data[0][i].queryBaru[0].skorPlakA;
        row.getCell(13).value = data[0][i].queryBaru[0].skorPlakC;
        row.getCell(14).value = data[0][i].queryBaru[0].skorPlakE;
        row.getCell(15).value = data[0][i].queryBaru[0].TPR;
        row.getCell(16).value =
          data[0][i].queryBaru[0].jumlahKecederaanTisuLembut;
        row.getCell(17).value =
          data[0][i].queryBaru[0].jumlahKecederaanTisuKeras;
        row.getCell(19).value = data[0][i].queryBaru[0].perluSapuanFluorida;
        row.getCell(20).value = data[0][i].queryBaru[0].sudahSapuanFluorida;
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
        row.getCell(19).value = data[1][i].queryBu[0].perluSapuanFluoridaBu;
        row.getCell(20).value = data[1][i].queryBu[0].sudahSapuanFluoridaBu;
        row.getCell(21).value = data[1][i].queryBu[0].jumlahTampalanAnteriorBu;
        row.getCell(22).value = data[1][i].queryBu[0].jumlahTampalanPosteriorBu;
        row.getCell(24).value = data[1][i].queryBu[0].jumlahCabutan;
        row.getCell(25).value = data[1][i].queryBu[0].jumlahAbses;
        row.getCell(26).value = data[1][i].queryBu[0].jumlahPulpotomi;
        row.getCell(27).value = data[1][i].queryBu[0].rujukanAgensiLuar;
      }
      j += 2;
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AF7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AF8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AF9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('AF10').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
        row.getCell(3).value = data[2][i].query1836[0].jumlahKedatanganBaru;
        row.getCell(4).value = data[2][i].query1836[0].jumlahd;
        // row.getCell(5).value = data[2][i].jumlahm;
        row.getCell(6).value = data[2][i].query1836[0].jumlahf;
        row.getCell(7).value = data[2][i].query1836[0].jumlahx;
        row.getCell(10).value = data[2][i].query1836[0].dfxEqualToZero;
      }
    }

    worksheet.name = 'TOD';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController] deleting file ${newfile}`);
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/TOD] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeBEGIN = async (payload) => {
  logger.info('[generateRetenController/makeBEGIN] makeBEGIN');
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
  try {
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
    worksheet.getCell('H8').value = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    worksheet.getCell('C10').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C11').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C12').value = `${klinik.toUpperCase()}`;

    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(18 + i);
      if (data[0][i].queryBegin[0]) {
        row.getCell(3).value = data[0][i].queryBegin[0].pesakitBaruBegin;
        row.getCell(4).value = data[0][i].queryBegin[0].jumlahFasiliti;
        row.getCell(5).value =
          data[0][i].queryBegin[0].jumlahFasilitiMelaksanakanBegin;
        // skipping cells
        row.getCell(6).value = data[0][i].queryBegin[0].craRendah;
        row.getCell(7).value = data[0][i].queryBegin[0].craSederhana;
        row.getCell(8).value = data[0][i].queryBegin[0].craTinggi;
        if (i < 2) {
          row.getCell(9).value =
            data[0][i].queryBegin[0].jumlahMuridMelaksanakanBegin;
        }
        if (i > 2) {
          row.getCell(9).value =
            data[0][i].queryBegin[0].jumlahMuridRisikoTinggiMelaksanakanBegin;
        }
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'M10'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('M11').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'M12'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('M13').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
    logger.info(`[generateRetenController/BEGIN] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController/BEGIN] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/BEGIN] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeCPPC1 = async (payload) => {
  logger.info('[generateRetenController/makeCPPC1] makeCPPC1');
  let {
    klinik,
    daerah,
    negeri,
    tarikhMula,
    tarikhAkhir,
    bulan,
    username,
    pilihanSekolah,
    fromEtl,
    jenisReten,
  } = payload;

  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countCPPC1(payload);
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
      'CPPC 1.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('CPPC 1');
    //
    switch (true) {
      case negeri !== 'all' && negeri !== '-':
        worksheet.getCell('E4').value = negeri;
        break;
      case daerah !== 'all' && daerah !== '-':
        worksheet.getCell('E4').value = daerah;
        break;
      case klinik:
        worksheet.getCell('E4').value = klinik;
        break;
      case pilihanSekolah:
        worksheet.getCell('E4').value = pilihanSekolah;
      default:
        break;
    }
    //
    worksheet.getCell('E5').value = moment(new Date()).format('YYYY');
    //
    const colNumbers = {
      5: 'E',
      6: 'F',
      D1: 'G',
      T1: 'G',
      D2: 'H',
      T2: 'H',
      D3: 'I',
      T3: 'I',
      D4: 'J',
      T4: 'J',
      D5: 'K',
      T5: 'K',
      D6: 'L',
      P: 'M',
      KHAS: 'N',
      KHAM: 'N',
    };

    for (let i = 0; i < data.length; i++) {
      const {
        _id,
        totalStudents,
        totalStudentFsNeed,
        totalTeethFsNeed,
        totalStudentFsRendered,
        totalTeethFsRendered,
        totalStudentPrrNeed,
        totalTeethPrrNeed,
        totalStudentPrrRendered,
        totalTeethPrrRendered,
        totalStudentFvNeed,
        totalTeethFvNeed,
        totalStudentFvRendered,
        totalTeethFvRendered,
        totalCariesFreeStatus,
        totalDMFX,
      } = data[i];
      const cellNumber = 9;
      const colNumber = colNumbers[_id];
      const worksheetCells = [
        { cell: `${colNumber}${cellNumber}`, value: totalStudents },
        { cell: `${colNumber}${cellNumber + 1}`, value: totalStudentFsNeed },
        { cell: `${colNumber}${cellNumber + 2}`, value: totalTeethFsNeed },
        {
          cell: `${colNumber}${cellNumber + 4}`,
          value: totalStudentFsRendered,
        },
        { cell: `${colNumber}${cellNumber + 6}`, value: totalTeethFsRendered },
        { cell: `${colNumber}${cellNumber + 8}`, value: totalStudentPrrNeed },
        { cell: `${colNumber}${cellNumber + 9}`, value: totalTeethPrrNeed },
        {
          cell: `${colNumber}${cellNumber + 11}`,
          value: totalStudentPrrRendered,
        },
        {
          cell: `${colNumber}${cellNumber + 13}`,
          value: totalTeethPrrRendered,
        },
        { cell: `${colNumber}${cellNumber + 15}`, value: totalStudentFvNeed },
        { cell: `${colNumber}${cellNumber + 16}`, value: totalTeethFvNeed },
        {
          cell: `${colNumber}${cellNumber + 18}`,
          value: totalStudentFvRendered,
        },
        { cell: `${colNumber}${cellNumber + 20}`, value: totalTeethFvRendered },
        {
          cell: `${colNumber}${cellNumber + 22}`,
          value: totalCariesFreeStatus,
        },
        { cell: `${colNumber}${cellNumber + 24}`, value: totalDMFX },
      ];
      worksheetCells.forEach(({ cell, value }) => {
        const cellValue = worksheet.getCell(cell).value || 0;
        worksheet.getCell(cell).value = cellValue + value;
      });
    }
    //
    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makeCPPC1] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeCPPC1] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeCPPC1] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeCPPC2 = async (payload) => {
  logger.info('[generateRetenController/makeCPPC2] makeCPPC2');
  let {
    klinik,
    daerah,
    negeri,
    tarikhMula,
    tarikhAkhir,
    bulan,
    username,
    pilihanSekolah,
    fromEtl,
    jenisReten,
  } = payload;

  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countCPPC2(payload);
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
      'CPPC 2.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('CPPC 2');
    //
    switch (true) {
      case negeri:
        worksheet.getCell('E4').value = negeri;
        break;
      case daerah:
        worksheet.getCell('E4').value = daerah;
        break;
      case klinik:
        worksheet.getCell('E4').value = klinik;
        break;
      case pilihanSekolah:
        worksheet.getCell('E4').value = pilihanSekolah;
        break;
      default:
        break;
    }
    worksheet.getCell('E5').value = moment(new Date()).format('YYYY');
    //
    const rowNumbers = {
      5: 11,
      6: 12,
      D1: 13,
      T1: 13,
      D2: 14,
      T2: 14,
      D3: 15,
      T3: 15,
      D4: 16,
      T4: 16,
      D5: 17,
      T5: 17,
      D6: 18,
      P: 19,
      KHAS: 20,
      KHAM: 20,
    };

    for (let i = 0; i < data.length; i++) {
      const {
        _id,
        noOfDandF,
        noOfTeethWithDandFAllClass,
        noOfTeethWithDandFClassI,
      } = data[i];

      const rowNumber = rowNumbers[_id];
      const row = worksheet.getRow(rowNumber);
      row.getCell(2).value += noOfDandF;
      row.getCell(3).value += noOfTeethWithDandFAllClass;
      row.getCell(5).value += noOfTeethWithDandFClassI;
    }
    //
    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makeCPPC2] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeCPPC2] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeCPPC2] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPIM03 = async (payload) => {
  logger.info('[generateRetenController/makePPIM03] makePPIM03');
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
  try {
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
    const newSheet = workbook.addWorksheet('PPIM 05-2023 SM');
    newSheet.model = Object.assign(worksheet.model, {
      mergeCells: worksheet.model.merges,
    });
    worksheet.columns.forEach((column, colNumber) => {
      const copyColumn = newSheet.getColumn(colNumber + 1);
      copyColumn.width = column.width;
      copyColumn.style = Object.assign({}, column.style);
    });
    worksheet.eachRow((row, rowNumber) => {
      const copyRow = newSheet.getRow(rowNumber);
      row.eachCell((cell, colNumber) => {
        const copyCell = copyRow.getCell(colNumber);
        copyCell.value = cell.value;
        copyCell.style = Object.assign({}, cell.style);
        copyCell.alignment = Object.assign({}, cell.alignment);
      });
    });
    newSheet.name = 'PPIM 03-2023 SM';
    newSheet.getCell('S5').value = moment(new Date()).format('YYYY');
    newSheet.getCell('O5').value = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    newSheet.getCell('B7').value = `${negeri.toUpperCase()}`;
    newSheet.getCell('B8').value = `${daerah.toUpperCase()}`;
    // newSheet.getCell('B8').value = `${klinik.toUpperCase()}`;
    // newSheet.getCell('B9').value = `${sekolah.toUpperCase()}`;
    //
    worksheet.getCell('S5').value = moment(new Date()).format('YYYY');
    worksheet.getCell('O5').value = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    worksheet.getCell('B7').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('B8').value = `${daerah.toUpperCase()}`;
    // worksheet.getCell('B9').value = `${klinik.toUpperCase()}`;
    // worksheet.getCell('B9').value = `${sekolah.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    let rowNumber = 0;
    //
    for (let i = 0; i < data[0].length; i++) {
      if (data[0][i]) {
        switch (data[0][i]._id) {
          case 'T1':
            rowNumber = 16;
            console.log('T 1');
            break;
          case 'T2':
            rowNumber = 17;
            console.log('T 2');
            break;
          case 'T3':
            rowNumber = 18;
            console.log('T 3');
            break;
          case 'T4':
            rowNumber = 19;
            console.log('T 4');
            break;
          case 'T5':
            rowNumber = 20;
            console.log('T 5');
            break;
          case 'P':
            rowNumber = 22;
            console.log('P');
            break;
          case 'KHAM':
            rowNumber = 23;
            console.log('KHAM');
            break;
          default:
            rowNumber = 0;
            console.log('no data');
            break;
        }

        newSheet.getRow(rowNumber).getCell(18).value =
          data[0][i].bilPerokokSemasaRokokBiasa;
        newSheet.getRow(rowNumber).getCell(19).value =
          data[0][i].bilPerokokSemasaElecVape;
        newSheet.getRow(rowNumber).getCell(20).value =
          data[0][i].bilPerokokSemasaShisha;
        newSheet.getRow(rowNumber).getCell(21).value =
          data[0][i].bilPerokokSemasaLainlain;
        newSheet.getRow(rowNumber).getCell(22).value =
          data[0][i].bilPerokokSemasaDirujukIntervensi;
      }
    }
    for (let i = 0; i < data[1].length; i++) {
      if (data[1][i]) {
        switch (data[1][i]._id) {
          case 'T1':
            rowNumber = 16;
            console.log('T 1');
            break;
          case 'T2':
            rowNumber = 17;
            console.log('T 2');
            break;
          case 'T3':
            rowNumber = 18;
            console.log('T 3');
            break;
          case 'T4':
            rowNumber = 19;
            console.log('T 4');
            break;
          case 'T5':
            rowNumber = 20;
            console.log('T 5');
            break;
          case 'P':
            rowNumber = 22;
            console.log('P');
            break;
          case 'KHAM':
            rowNumber = 23;
            console.log('KHAM');
            break;
          default:
            rowNumber = 0;
            console.log('no data');
            break;
        }

        newSheet.getRow(rowNumber).getCell(9).value =
          data[1][i].bilPerokokSemasaLelakiMelayu;
        newSheet.getRow(rowNumber).getCell(10).value =
          data[1][i].bilPerokokSemasaLelakiCina;
        newSheet.getRow(rowNumber).getCell(11).value =
          data[1][i].bilPerokokSemasaLelakiIndia;
        newSheet.getRow(rowNumber).getCell(12).value =
          data[1][i].bilPerokokSemasaLelakiLainlain;
        newSheet.getRow(rowNumber).getCell(14).value =
          data[1][i].bilPerokokSemasaPerempuanMelayu;
        newSheet.getRow(rowNumber).getCell(15).value =
          data[1][i].bilPerokokSemasaPerempuanCina;
        newSheet.getRow(rowNumber).getCell(16).value =
          data[1][i].bilPerokokSemasaPerempuanMelayu;
        newSheet.getRow(rowNumber).getCell(17).value =
          data[1][i].bilPerokokSemasaPerempuanLainlain;
        newSheet.getRow(rowNumber).getCell(25).value =
          data[1][i].bilBekasPerokokLelaki;
        newSheet.getRow(rowNumber).getCell(26).value =
          data[1][i].bilBekasPerokokPerempuan;
        newSheet.getRow(rowNumber).getCell(29).value =
          data[1][i].bilPerokokPasifLelaki;
        newSheet.getRow(rowNumber).getCell(30).value =
          data[1][i].bilPerokokPasifPerempuan;
        newSheet.getRow(rowNumber).getCell(33).value =
          data[1][i].bilBukanPerokokLelaki;
        newSheet.getRow(rowNumber).getCell(34).value =
          data[1][i].bilBukanPerokokPerempuan;
        newSheet.getRow(rowNumber).getCell(37).value =
          data[1][i].bilDalamIntervensiLelaki;
        newSheet.getRow(rowNumber).getCell(38).value =
          data[1][i].bilDalamIntervensiPerempuan;
      }
    }
    //
    for (let i = 0; i < data[0].length; i++) {
      if (data[0][i]) {
        switch (data[0][i]._id) {
          case 'D1':
            rowNumber = 16;
            console.log('D 1');
            break;
          case 'D2':
            rowNumber = 17;
            console.log('D 2');
            break;
          case 'D3':
            rowNumber = 18;
            console.log('D 3');
            break;
          case 'D4':
            rowNumber = 19;
            console.log('D 4');
            break;
          case 'D5':
            rowNumber = 20;
            console.log('D 5');
            break;
          case 'D6':
            rowNumber = 21;
            console.log('D 6');
            break;
          case 'KHAS':
            rowNumber = 23;
            console.log('KHAS');
            break;
          default:
            rowNumber = 0;
            console.log('no data');
            break;
        }

        worksheet.name = 'PPIM 03-2023 SR';
        // worksheet.getRow(rowNumber).getCell(2).value +=
        //   data[0][i].enrolmen???;
        worksheet.getRow(rowNumber).getCell(18).value =
          data[0][i].bilPerokokSemasaRokokBiasa;
        worksheet.getRow(rowNumber).getCell(19).value =
          data[0][i].bilPerokokSemasaElecVape;
        worksheet.getRow(rowNumber).getCell(20).value =
          data[0][i].bilPerokokSemasaShisha;
        worksheet.getRow(rowNumber).getCell(21).value =
          data[0][i].bilPerokokSemasaLainlain;
        worksheet.getRow(rowNumber).getCell(22).value =
          data[0][i].bilPerokokSemasaDirujukIntervensi;
      }
    }
    for (let i = 0; i < data[1].length; i++) {
      if (data[1][i]) {
        switch (data[1][i]._id) {
          case 'D1':
            rowNumber = 16;
            console.log('D 1');
            break;
          case 'D2':
            rowNumber = 17;
            console.log('D 2');
            break;
          case 'D3':
            rowNumber = 18;
            console.log('D 3');
            break;
          case 'D4':
            rowNumber = 19;
            console.log('D 4');
            break;
          case 'D5':
            rowNumber = 20;
            console.log('D 5');
            break;
          case 'D6':
            rowNumber = 21;
            console.log('D 6');
            break;
          case 'KHAS':
            rowNumber = 23;
            console.log('KHAS');
            break;
          default:
            rowNumber = 0;
            console.log('no data');
            break;
        }

        worksheet.getRow(rowNumber).getCell(9).value =
          data[1][i].bilPerokokSemasaLelakiMelayu;
        worksheet.getRow(rowNumber).getCell(10).value =
          data[1][i].bilPerokokSemasaLelakiCina;
        worksheet.getRow(rowNumber).getCell(11).value =
          data[1][i].bilPerokokSemasaLelakiIndia;
        worksheet.getRow(rowNumber).getCell(12).value =
          data[1][i].bilPerokokSemasaLelakiLainlain;
        worksheet.getRow(rowNumber).getCell(14).value =
          data[1][i].bilPerokokSemasaPerempuanMelayu;
        worksheet.getRow(rowNumber).getCell(15).value =
          data[1][i].bilPerokokSemasaPerempuanCina;
        worksheet.getRow(rowNumber).getCell(16).value =
          data[1][i].bilPerokokSemasaPerempuanMelayu;
        worksheet.getRow(rowNumber).getCell(17).value =
          data[1][i].bilPerokokSemasaPerempuanLainlain;
        worksheet.getRow(rowNumber).getCell(25).value =
          data[1][i].bilBekasPerokokLelaki;
        worksheet.getRow(rowNumber).getCell(26).value =
          data[1][i].bilBekasPerokokPerempuan;
        worksheet.getRow(rowNumber).getCell(29).value =
          data[1][i].bilPerokokPasifLelaki;
        worksheet.getRow(rowNumber).getCell(30).value =
          data[1][i].bilPerokokPasifPerempuan;
        worksheet.getRow(rowNumber).getCell(33).value =
          data[1][i].bilBukanPerokokLelaki;
        worksheet.getRow(rowNumber).getCell(34).value =
          data[1][i].bilBukanPerokokPerempuan;
        worksheet.getRow(rowNumber).getCell(37).value =
          data[1][i].bilDalamIntervensiLelaki;
        worksheet.getRow(rowNumber).getCell(38).value =
          data[1][i].bilDalamIntervensiPerempuan;
      }
    }
    //
    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'AL7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('AL8').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'AL9'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('AL10').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
    // const { jenisFasiliti } = Fasiliti.findOne({
    //   kodSekolah: sekolah,
    // });
    // worksheet.getCell('AI1').value =
    //   jenisFasiliti === 'sekolah-rendah'
    //     ? 'BORANG PPIM 03-2023 (SR)'
    //     : 'BORANG PPIM 03-2023 (SM)';
    // worksheet.name =
    //   jenisFasiliti === 'sekolah-rendah'
    //     ? 'BORANG PPIM 03-2023 (SR)'
    //     : 'BORANG PPIM 03-2023 (SM)';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makePPIM03] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePPIM03] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPIM03] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPIM04 = async (payload) => {
  logger.info('[generateRetenController/makePPIM04] makePPIM04');
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
  try {
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
    worksheet.getCell('E4').value = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    // worksheet.getCell('B6').value = `${sekolah.toUpperCase()}`;
    worksheet.getCell('B7').value = `${klinik.toUpperCase()}`;
    // worksheet.getCell('B8').value = `${pegawai.toUpperCase()}`;
    // jumlah perokok semasa berhenti merokok dalam tempoh 6 bulan
    // worksheet.getCell('B10').value = `${pegawai.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    for (let i = 0; i < data.length; i++) {
      if (data[0][i]) {
        console.log(data[0][i]);
        let rowNew = worksheet.getRow(15 + i);
        rowNew.getCell(1).value = data[0][i].nama;
        rowNew.getCell(2).value = data[0][i].kelasPelajar;
        rowNew.getCell(3).value = data[0][i].noTelefon;
        rowNew.getCell(4).value = data[0][i].tarikhIntervensi1;
        rowNew.getCell(5).value = data[0][i].tarikhIntervensi2;
        rowNew.getCell(6).value = data[0][i].tarikhIntervensi3;
        rowNew.getCell(7).value = data[0][i].tarikhIntervensi4;
        rowNew.getCell(8).value = data[0][i].adaQuitDate;
        rowNew.getCell(9).value = data[0][i].tiadaQuitDate;
        rowNew.getCell(10).value = data[0][i].tarikhQuit;
        rowNew.getCell(11).value = data[0][i].rujukGuruKaunseling;
        rowNew.getCell(12).value = data[0][i].berhentiMerokok;
        rowNew.getCell(13).value = data[0][i].takBerhentiMerokok;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'M5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('M6').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'M7'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('M8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
    // const { jenisFasiliti } = Fasiliti.findOne({
    //   kodSekolah: sekolah,
    // });
    // worksheet.getCell('A1').value =
    //   jenisFasiliti === 'sekolah-rendah'
    //     ? 'BORANG PPIM 04-2023 (SR) (SULIT)'
    //     : 'BORANG PPIM 04-2023 (SM) (SULIT)';
    // worksheet.name =
    //   jenisFasiliti === 'sekolah-rendah'
    //     ? 'BORANG PPIM 04-2023 (SR)(SULIT)'
    //     : 'BORANG PPIM 04-2023 (SM)(SULIT)';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makePPIM04] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePPIM04] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPIM04] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPIM05 = async (payload) => {
  logger.info('[generateRetenController/makePPIM05] makePPIM05');
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
  try {
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
    worksheet.getCell('F4').value = moment(bulan ? bulan : tarikhMula).format(
      'MMMM'
    );
    worksheet.getCell('B6').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('B7').value = `${daerah.toUpperCase()}`;
    // worksheet.getCell('B8').value = `${klinik.toUpperCase()}`;
    // worksheet.getCell('B9').value = `${sekolah.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    let rowNumber = 0;
    //
    // buat identical copy untuk sm
    if (data[0].some((obj) => obj._id.includes('T'))) {
      const newSheet = workbook.addWorksheet('PPIM 05-2023 SM');
      newSheet.model = Object.assign(worksheet.model, {
        mergeCells: worksheet.model.merges,
      });
      worksheet.columns.forEach((column, colNumber) => {
        const copyColumn = newSheet.getColumn(colNumber + 1);
        copyColumn.width = column.width;
        copyColumn.style = Object.assign({}, column.style);
      });
      worksheet.eachRow((row, rowNumber) => {
        const copyRow = newSheet.getRow(rowNumber);
        row.eachCell((cell, colNumber) => {
          const copyCell = copyRow.getCell(colNumber);
          copyCell.value = cell.value;
          copyCell.style = Object.assign({}, cell.style);
          copyCell.alignment = Object.assign({}, cell.alignment);
        });
      });
      newSheet.name = 'PPIM 05-2023 SM';
      newSheet.getCell('I4').value = moment(new Date()).format('YYYY');
      newSheet.getCell('F4').value = moment(bulan ? bulan : tarikhMula).format(
        'MMMM'
      );
      newSheet.getCell('B6').value = `${negeri.toUpperCase()}`;
      newSheet.getCell('B7').value = `${daerah.toUpperCase()}`;
      // newSheet.getCell('B8').value = `${klinik.toUpperCase()}`;
      // newSheet.getCell('B9').value = `${sekolah.toUpperCase()}`;
      worksheet.getCell('N6').value = '';
      worksheet.getCell('N7').value = '';
      worksheet.getCell('N8').value = '';
      worksheet.getCell('N9').value = '';
      //
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i]) {
          switch (data[0][i]._id) {
            case 'T1':
              rowNumber = 14;
              console.log('t 1');
              break;
            case 'T2':
              rowNumber = 15;
              console.log('T 2');
              break;
            case 'T3':
              rowNumber = 16;
              console.log('T 3');
              break;
            case 'T4':
              rowNumber = 17;
              console.log('T 4');
              break;
            case 'T5':
              rowNumber = 18;
              console.log('T 5');
              break;
            default:
              console.log('no data');
          }

          newSheet.getRow(rowNumber).getCell(2).value =
            data[0][i].bilPerokokSemasa;
          newSheet.getRow(rowNumber).getCell(3).value =
            data[0][i].bilPerokokSertaiIntervensi;
          newSheet.getRow(rowNumber).getCell(4).value =
            data[0][i].bilPerokokAdaQuitDate3Int;
          // skipping cells
          newSheet.getRow(rowNumber).getCell(6).value =
            data[0][i].bilPerokokTiadaQuitDate3Int;
          // skipping cells
          newSheet.getRow(rowNumber).getCell(8).value =
            data[0][i].bilPerokokAdaQuitDateKur3Int;
          // skipping cells
          newSheet.getRow(rowNumber).getCell(10).value =
            data[0][i].bilPerokokTiadaQuitDateKur3Int;
          //skipping cells
          newSheet.getRow(rowNumber).getCell(12).value =
            data[0][i].bilPerokokDirujukGuru;
          newSheet.getRow(rowNumber).getCell(13).value =
            data[0][i].bilPerokokBerhenti6Bulan;
          newSheet.getRow(rowNumber).getCell(14).value =
            data[0][i].bilPerokokTidakBerhenti6Bulan;
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[0][i]) {
        switch (data[0][i]._id) {
          case 'D1':
            rowNumber = 14;
            console.log('derajah 1');
            break;
          case 'D2':
            rowNumber = 15;
            console.log('derajah 2');
            break;
          case 'D3':
            rowNumber = 16;
            console.log('derajah 3');
            break;
          case 'D4':
            rowNumber = 17;
            console.log('derajah 4');
            break;
          case 'D5':
            rowNumber = 18;
            console.log('derajah 5');
            break;
          case 'D6':
            rowNumber = 19;
            console.log('derajah 6');
            break;
          default:
            console.log('no data');
        }

        worksheet.getRow(rowNumber).getCell(2).value =
          data[0][i].bilPerokokSemasa;
        worksheet.getRow(rowNumber).getCell(3).value =
          data[0][i].bilPerokokSertaiIntervensi;
        worksheet.getRow(rowNumber).getCell(4).value =
          data[0][i].bilPerokokAdaQuitDate3Int;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(6).value =
          data[0][i].bilPerokokTiadaQuitDate3Int;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(8).value =
          data[0][i].bilPerokokAdaQuitDateKur3Int;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(10).value =
          data[0][i].bilPerokokTiadaQuitDateKur3Int;
        //skipping cells
        worksheet.getRow(rowNumber).getCell(12).value =
          data[0][i].bilPerokokDirujukGuru;
        worksheet.getRow(rowNumber).getCell(13).value =
          data[0][i].bilPerokokBerhenti6Bulan;
        worksheet.getRow(rowNumber).getCell(14).value =
          data[0][i].bilPerokokTidakBerhenti6Bulan;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    worksheet.getCell(
      'N6'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`;
    worksheet.getCell('N7').value = `Maklumat dari ${
      bulan
        ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
            bulan
          )
            .endOf('month')
            .format('DD-MM-YYYY')}`
        : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
            tarikhAkhir
          ).format('DD-MM-YYYY')}`
    }`;
    worksheet.getCell(
      'N8'
    ).value = `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`;
    worksheet.getCell('N9').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

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
    logger.info(`[generateRetenController/makePPIM05] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePPIM05] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPIM05] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
// data dari sekolah harus ambil bagi 15 - 17 (by umur)
const makeDEWASAMUDA = async (payload) => {
  logger.info('[generateRetenController/makeDEWASAMUDA] makeDEWASAMUDA');
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
  try {
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
    // return data;
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
    worksheet.getCell('AG6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('AL6').value = `${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('C11').value = pilihanProgram?.toUpperCase() ?? 'ALL';
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    let rowNumber = 0;

    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryDMPemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(20 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        // pemeriksaan
        row.getCell(3).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(5).value = pemeriksaan.jumlahLelaki;
        row.getCell(6).value = pemeriksaan.jumlahPerempuan;
        row.getCell(7).value = pemeriksaan.jumlahd;
        row.getCell(8).value = pemeriksaan.jumlahf;
        row.getCell(9).value = pemeriksaan.jumlahx;
        // skipping cells
        row.getCell(11).value = pemeriksaan.jumlahD;
        row.getCell(12).value = pemeriksaan.jumlahM;
        row.getCell(13).value = pemeriksaan.jumlahF;
        row.getCell(14).value = pemeriksaan.jumlahX;
        // skipping cells
        row.getCell(16).value = pemeriksaan.jumlahMBK;
        row.getCell(17).value = pemeriksaan.statusBebasKaries;
        row.getCell(18).value = pemeriksaan.TPR;
        row.getCell(19).value = pemeriksaan.skorBPEZero;
        row.getCell(20).value = pemeriksaan.skorBPEMoreThanZero;
        row.getCell(21).value = pemeriksaan.jumlahTSL;
        row.getCell(22).value = pemeriksaan.perluSapuanFluorida;
        row.getCell(23).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
        row.getCell(24).value = pemeriksaan.perluJumlahGigiPrrJenis1;
        row.getCell(25).value = pemeriksaan.perluJumlahPesakitFS;
        row.getCell(26).value = pemeriksaan.perluJumlahGigiFS;
        row.getCell(27).value = pemeriksaan.perluPenskaleran;
        row.getCell(28).value = pemeriksaan.perluEndoAnterior;
        row.getCell(29).value = pemeriksaan.perluEndoPremolar;
        row.getCell(30).value = pemeriksaan.perluEndoMolar;
        row.getCell(31).value = pemeriksaan.jumlahPerluDenturPenuh;
        row.getCell(32).value = pemeriksaan.jumlahPerluDenturSepara;
      }
      j++;
      if (i === 2) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryDMRawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(20 + j);
        // rawatan
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(33).value = rawatan.sapuanFluorida;
        row.getCell(34).value = rawatan.jumlahPesakitPrrJenis1;
        row.getCell(35).value = rawatan.jumlahGigiPrrJenis1;
        row.getCell(36).value = rawatan.jumlahPesakitDiBuatFs;
        row.getCell(37).value = rawatan.jumlahGigiDibuatFs;
        row.getCell(38).value = rawatan.tampalanAntGdBaru;
        row.getCell(39).value = rawatan.tampalanAntGdSemula;
        row.getCell(40).value = rawatan.tampalanAntGkBaru;
        row.getCell(41).value = rawatan.tampalanAntGkSemula;
        row.getCell(42).value = rawatan.tampalanPostGdBaru;
        row.getCell(43).value = rawatan.tampalanPostGdSemula;
        row.getCell(44).value = rawatan.tampalanPostGkBaru;
        row.getCell(45).value = rawatan.tampalanPostGkSemula;
        row.getCell(46).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(47).value = rawatan.tampalanPostAmgGdSemula;
        row.getCell(48).value = rawatan.tampalanPostAmgGkBaru;
        row.getCell(49).value = rawatan.tampalanPostAmgGkSemula;
        // skipping cells
        row.getCell(52).value = rawatan.tampalanSementara;
        row.getCell(53).value = rawatan.cabutanGd;
        row.getCell(54).value = rawatan.cabutanGk;
        row.getCell(55).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(56).value = rawatan.penskaleran;
        row.getCell(57).value = rawatan.abses;
        row.getCell(58).value = rawatan.kecederaanTulangMuka;
        row.getCell(59).value = rawatan.kecederaanGigi;
        row.getCell(60).value = rawatan.kecederaanTisuLembut;
        //
        row.getCell(61).value = rawatan.prosthodontikPenuhDenturBaru;
        row.getCell(62).value = rawatan.prosthodontikPenuhDenturSemula;
        row.getCell(63).value = rawatan.jumlahPesakitBuatDenturPenuh;
        row.getCell(64).value = rawatan.prosthodontikSeparaDenturBaru;
        row.getCell(65).value = rawatan.prosthodontikSeparaDenturSemula;
        row.getCell(66).value = rawatan.jumlahPesakitBuatDenturSepara;
        //
        row.getCell(67).value = rawatan.immediateDenture;
        row.getCell(68).value = rawatan.pembaikanDenture;
        row.getCell(69).value = rawatan.kesSelesai;
        row.getCell(70).value = rawatan.xrayDiambil;
        row.getCell(71).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 2) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < 2; i++) {
      if (data[2][0]) {
        // switch (data[2][i]._id) {
        //   case 'lima-belas-tujuh-belas':
        //     rowNumber = 23;
        //     console.log('lima-belas-tujuh-belas');
        //     break;
        //   case 'lapan-belas-sembilan-belas':
        //     rowNumber = 24;
        //     console.log('lapan-belas-sembilan-belas');
        //     break;
        //   default:
        //     console.log('no data');
        // }

        if (i === 0) {
          rowNumber = 20;
        } else {
          rowNumber = 29;
        }

        // pemeriksaan
        worksheet.getRow(rowNumber).getCell(3).value +=
          data[2][0].kedatanganTahunSemasaBaru;
        worksheet.getRow(rowNumber).getCell(7).value += data[2][0].jumlahd;
        worksheet.getRow(rowNumber).getCell(8).value += data[2][0].jumlahf;
        worksheet.getRow(rowNumber).getCell(9).value += data[2][0].jumlahx;
        // worksheet.getRow(rowNumber).getCell(10).value += data[2][0].jumlahdfx;
        worksheet.getRow(rowNumber).getCell(11).value += data[2][0].jumlahD;
        worksheet.getRow(rowNumber).getCell(12).value += data[2][0].jumlahM;
        worksheet.getRow(rowNumber).getCell(13).value += data[2][0].jumlahF;
        worksheet.getRow(rowNumber).getCell(14).value += data[2][0].jumlahX;
        // worksheet.getRow(rowNumber).getCell(12).value += data[2][0].jumlahDMFX;
        worksheet.getRow(rowNumber).getCell(16).value += data[2][0].jumlahMBK;
        worksheet.getRow(rowNumber).getCell(17).value +=
          data[2][0].statusBebasKaries;
        worksheet.getRow(rowNumber).getCell(18).value += data[2][0].TPR;
        worksheet.getRow(rowNumber).getCell(19).value += data[2][0].skorBPEZero;
        worksheet.getRow(rowNumber).getCell(20).value +=
          data[2][0].skorBPEMoreThanZero;
        // TSL
        worksheet.getRow(rowNumber).getCell(22).value +=
          data[2][0].perluSapuanFluorida;
        worksheet.getRow(rowNumber).getCell(23).value +=
          data[2][0].perluJumlahPesakitPrrJenis1;
        worksheet.getRow(rowNumber).getCell(24).value +=
          data[2][0].perluJumlahGigiPrrJenis1;
        worksheet.getRow(rowNumber).getCell(25).value +=
          data[2][0].perluJumlahPesakitFS;
        worksheet.getRow(rowNumber).getCell(26).value +=
          data[2][0].perluJumlahGigiFS;
        worksheet.getRow(rowNumber).getCell(27).value +=
          data[2][0].perluPenskaleran;
        // worksheet.getRow(rowNumber).getCell(24).value +=
        //   data[2][0].perluEndoAnterior;
        // worksheet.getRow(rowNumber).getCell(25).value +=
        //   data[2][0].perluEndoPremolar;
        // worksheet.getRow(rowNumber).getCell(26).value +=
        //   data[2][0].perluEndoMolar;
        // worksheet.getRow(rowNumber).getCell(27).value +=
        //   data[2][0].jumlahPerluDenturPenuh;
        // worksheet.getRow(rowNumber).getCell(28).value +=
        //   data[2][0].jumlahPerluDenturSepara;
      }
    }

    j = 0;
    for (let i = 0; i < 2; i++) {
      if (data[3][0]) {
        // switch (data[2][i]._id) {
        //   case 'lima-belas-tujuh-belas':
        //     rowNumber = 23;
        //     console.log('lima-belas-tujuh-belas');
        //     break;
        //   case 'lapan-belas-sembilan-belas':
        //     rowNumber = 24;
        //     console.log('lapan-belas-sembilan-belas');
        //     break;
        //   default:
        //     console.log('no data');
        // }

        if (i === 0) {
          rowNumber = 20;
        } else {
          rowNumber = 29;
        }

        // rawatan
        worksheet.getRow(rowNumber).getCell(4).value +=
          data[3][0].kedatanganTahunSemasaUlangan;
        worksheet.getRow(rowNumber).getCell(33).value +=
          data[3][0].sapuanFluorida;
        worksheet.getRow(rowNumber).getCell(34).value +=
          data[3][0].jumlahPesakitPrrJenis1;
        worksheet.getRow(rowNumber).getCell(35).value +=
          data[3][0].jumlahGigiPrrJenis1;
        worksheet.getRow(rowNumber).getCell(36).value +=
          data[3][0].jumlahPesakitDiBuatFs;
        worksheet.getRow(rowNumber).getCell(37).value +=
          data[3][0].jumlahGigiDibuatFs;
        worksheet.getRow(rowNumber).getCell(38).value +=
          data[3][0].tampalanAntGdBaru;
        worksheet.getRow(rowNumber).getCell(39).value +=
          data[3][0].tampalanAntGdSemula;
        worksheet.getRow(rowNumber).getCell(40).value +=
          data[3][0].tampalanAntGkBaru;
        worksheet.getRow(rowNumber).getCell(41).value +=
          data[3][0].tampalanAntGkSemula;
        worksheet.getRow(rowNumber).getCell(42).value +=
          data[3][0].tampalanPostGdBaru;
        worksheet.getRow(rowNumber).getCell(43).value +=
          data[3][0].tampalanPostGdSemula;
        worksheet.getRow(rowNumber).getCell(44).value +=
          data[3][0].tampalanPostGkBaru;
        worksheet.getRow(rowNumber).getCell(45).value +=
          data[3][0].tampalanPostGkSemula;
        worksheet.getRow(rowNumber).getCell(46).value +=
          data[3][0].tampalanPostAmgGdBaru;
        worksheet.getRow(rowNumber).getCell(47).value +=
          data[3][0].tampalanPostAmgGdSemula;
        worksheet.getRow(rowNumber).getCell(48).value +=
          data[3][0].tampalanPostAmgGkBaru;
        worksheet.getRow(rowNumber).getCell(49).value +=
          data[3][0].tampalanPostAmgGkSemula;
        // worksheet.getRow(rowNumber).getCell(46).value +=
        //   data[3][0].inlayOnlayBaru;
        // worksheet.getRow(rowNumber).getCell(47).value +=
        //   data[3][0].inlayOnlaySemula;
        // skipping cells
        worksheet.getRow(rowNumber).getCell(52).value +=
          data[3][0].tampalanSementara;
        worksheet.getRow(rowNumber).getCell(53).value += data[3][0].cabutanGd;
        worksheet.getRow(rowNumber).getCell(54).value += data[3][0].cabutanGk;
        // worksheet.getRow(rowNumber).getCell(53).value += data[3][0].komplikasiSelepasCabutan;
        worksheet.getRow(rowNumber).getCell(55).value += data[3][0].penskaleran;
        // worksheet.getRow(rowNumber).getCell(55).value += data[3][0].rawatanPerioLain;
        // worksheet.getRow(rowNumber).getCell(56).value += data[3][0].rawatanEndoAnterior;
        // worksheet.getRow(rowNumber).getCell(57).value += data[3][0].rawatanEndoPremolar;
        // worksheet.getRow(rowNumber).getCell(58).value += data[3][0].rawatanEndoMolar;
        // worksheet.getRow(rowNumber).getCell(59).value += data[3][0].rawatanOrtho;
        // worksheet.getRow(rowNumber).getCell(60).value +=
        //   data[3][0].kesPerubatan;
        worksheet.getRow(rowNumber).getCell(56).value += data[3][0].abses;
        // worksheet.getRow(rowNumber).getCell(62).value += data[3][0].kecederaanTulangMuka;
        // worksheet.getRow(rowNumber).getCell(63).value += data[3][0].kecederaanGigi;
        // worksheet.getRow(rowNumber).getCell(64).value += data[3][0].kecederaanTisuLembut;
        // worksheet.getRow(rowNumber).getCell(65).value += data[3][0].cabutanSurgical;
        // worksheet.getRow(rowNumber).getCell(66).value += data[3][0].pembedahanKecilMulut;
        //   worksheet.getRow(rowNumber).getCell(67).value += data[3][0].cworksheet.getRow(rowNumber)nBridgeBaru;
        //   worksheet.getRow(rowNumber).getCell(68).value += data[3][0].cworksheet.getRow(rowNumber)nBridgeSemula;
        //   worksheet.getRow(rowNumber).getCell(69).value += data[3][0].postCoreBaru;
        //   worksheet.getRow(rowNumber).getCell(70).value += data[3][0].postCoreSemula;
        //   worksheet.getRow(rowNumber).getCell(71).value += data[3][0].prosthodontikPenuhDenturBaru;
        //   worksheet.getRow(rowNumber).getCell(72).value += data[3][0].prosthodontikPenuhDenturSemula;
        //   worksheet.getRow(rowNumber).getCell(73).value += data[3][0].jumlahPesakitBuatDenturPenuh;
        //   worksheet.getRow(rowNumber).getCell(74).value += data[3][0].prosthodontikSeparaDenturBaru;
        //   worksheet.getRow(rowNumber).getCell(75).value += data[3][0].prosthodontikSeparaDenturSemula;
        //   worksheet.getRow(rowNumber).getCell(76).value += data[3][0].jumlahPesakitBuatDenturSepara;
        //   worksheet.getRow(rowNumber).getCell(77).value += data[3][0].immediateDenture;
        //   worksheet.getRow(rowNumber).getCell(78).value += data[3][0].pembaikanDenture;
        worksheet.getRow(rowNumber).getCell(69).value += data[3][0].kesSelesai;
        // worksheet.getRow(rowNumber).getCell(80).value += data[3][i].xrayDiambil;
        // worksheet.getRow(rowNumber).getCell(81).value += data[3][i].pesakitDisaringOC;
      }
    }

    // j = 0;
    // for (let i = 0; i < data[2].length; i++) {
    //   const [operatorLain] = data[1][i].queryOperatorLain || [];

    //   if (operatorLain) {
    //     const row = worksheet.getRow(20 + j);
    //     // rawatan
    //     row.getCell(33).value += operatorLain.sapuanFluorida;
    //     row.getCell(34).value += operatorLain.jumlahPesakitPrrJenis1;
    //     row.getCell(35).value += operatorLain.jumlahGigiPrrJenis1;
    //     row.getCell(36).value += operatorLain.jumlahPesakitDiBuatFs;
    //     row.getCell(37).value += operatorLain.jumlahGigiDibuatFs;
    //     row.getCell(38).value += operatorLain.tampalanAntGdBaru;
    //     row.getCell(39).value += operatorLain.tampalanAntGdSemula;
    //     row.getCell(40).value += operatorLain.tampalanAntGkBaru;
    //     row.getCell(41).value += operatorLain.tampalanAntGkSemula;
    //     row.getCell(42).value += operatorLain.tampalanPostGdBaru;
    //     row.getCell(43).value += operatorLain.tampalanPostGdSemula;
    //     row.getCell(44).value += operatorLain.tampalanPostGkBaru;
    //     row.getCell(45).value += operatorLain.tampalanPostGkSemula;
    //     row.getCell(46).value += operatorLain.tampalanPostAmgGdBaru;
    //     row.getCell(47).value += operatorLain.tampalanPostAmgGdSemula;
    //     row.getCell(48).value += operatorLain.tampalanPostAmgGkBaru;
    //     row.getCell(49).value += operatorLain.tampalanPostAmgGkSemula;
    //     // skipping cells
    //     row.getCell(52).value += operatorLain.tampalanSementara;
    //     row.getCell(53).value += operatorLain.cabutanGd;
    //     row.getCell(54).value += operatorLain.cabutanGk;
    //     row.getCell(55).value += operatorLain.komplikasiSelepasCabutan;
    //     row.getCell(56).value += operatorLain.penskaleran;
    //     row.getCell(57).value += operatorLain.abses;
    //     row.getCell(58).value += operatorLain.kecederaanTulangMuka;
    //     row.getCell(59).value += operatorLain.kecederaanGigi;
    //     row.getCell(60).value += operatorLain.kecederaanTisuLembut;
    //     row.getCell(61).value += operatorLain.prosthodontikPenuhDenturBaru;
    //     row.getCell(62).value += operatorLain.prosthodontikPenuhDenturSemula;
    //     row.getCell(63).value += operatorLain.jumlahPesakitBuatDenturPenuh;
    //     row.getCell(64).value += operatorLain.prosthodontikSeparaDenturBaru;
    //     row.getCell(65).value += operatorLain.prosthodontikSeparaDenturSemula;
    //     row.getCell(66).value += operatorLain.jumlahPesakitBuatDenturSepara;
    //     row.getCell(67).value += operatorLain.immediateDenture;
    //     row.getCell(68).value += operatorLain.pembaikanDenture;
    //     row.getCell(69).value += operatorLain.kesSelesai;
    //     row.getCell(70).value += operatorLain.xrayDiambil;
    //   }
    //   j++;
    //   if (i === 2) {
    //     j++;
    //   }
    // }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('BS8'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('BS9'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('BS10'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('BS11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

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
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeDEWASAMUDA] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
// data dari semua fasiliti
const makeOAP = async (payload) => {
  logger.info('[generateRetenController/makeOAP] makeOAP');
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
  try {
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
    // return data;
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({
        kodFasiliti: klinik,
      });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(__dirname, '..', 'public', 'exports', 'OAP.xlsx');
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('OAP');
    //
    worksheet.getCell('AM6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('AT6').value = `${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('D9').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('D10').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('D11').value = `${klinik.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;

    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryOAPPemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(20 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        row.getCell(3).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(5).value = pemeriksaan.jumlahd;
        row.getCell(6).value = pemeriksaan.jumlahf;
        row.getCell(7).value = pemeriksaan.jumlahx;
        // skipping cells
        if (i > 1) {
          row.getCell(9).value = pemeriksaan.jumlahD;
          row.getCell(10).value = pemeriksaan.jumlahM;
          row.getCell(11).value = pemeriksaan.jumlahF;
          row.getCell(12).value = pemeriksaan.jumlahX;
        }
        // skipping cells
        row.getCell(14).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(15).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(16).value = pemeriksaan.TPR;
        if (i > 5) {
          row.getCell(17).value = pemeriksaan.skorBPEZero;
          row.getCell(18).value = pemeriksaan.skorBPEMoreThanZero;
        }
        row.getCell(19).value = pemeriksaan.adaTSL;
        row.getCell(20).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(21).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(22).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(23).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(24).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(25).value = pemeriksaan.perluPenskaleran;
        if (i > 1) {
          row.getCell(26).value = pemeriksaan.perluEndoAnterior;
          row.getCell(27).value = pemeriksaan.perluEndoPremolar;
          row.getCell(28).value = pemeriksaan.perluEndoMolar;
          row.getCell(29).value = pemeriksaan.jumlahPerluDenturPenuh;
          row.getCell(30).value = pemeriksaan.jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryOAPRawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(20 + j);
        // rawatan
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(31).value = rawatan.sapuanFluorida;
        row.getCell(32).value = rawatan.jumlahPesakitPrrJenis1;
        row.getCell(33).value = rawatan.jumlahGigiPrrJenis1;
        row.getCell(34).value = rawatan.jumlahPesakitDiBuatFs;
        row.getCell(35).value = rawatan.jumlahGigiDibuatFs;

        for (let k = 36; k <= 49; k++) {
          if (i > 1) {
            row.getCell(k).value =
              rawatan[
                `tampalan${k === 44 ? 'PostAmg' : k < 44 ? 'AntGd' : 'PostGk'}${
                  k % 2 === 0 ? 'Baru' : 'Semula'
                }`
              ];
          }
        }

        row.getCell(52).value = rawatan.tampalanSementara;
        row.getCell(53).value = rawatan.cabutanGd;
        row.getCell(54).value = rawatan.cabutanGk;
        row.getCell(55).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(56).value = rawatan.penskaleran;
        row.getCell(57).value = rawatan.rawatanPerioLain;
        row.getCell(58).value = rawatan.rawatanEndoAnterior;
        row.getCell(59).value = rawatan.rawatanEndoPremolar;
        row.getCell(60).value = rawatan.rawatanEndoMolar;
        row.getCell(61).value = rawatan.rawatanOrtho;
        row.getCell(62).value = rawatan.kesPerubatan;
        row.getCell(63).value = rawatan.abses;
        row.getCell(64).value = rawatan.kecederaanTulangMuka;
        row.getCell(65).value = rawatan.kecederaanGigi;
        row.getCell(66).value = rawatan.kecederaanTisuLembut;
        row.getCell(67).value = rawatan.cabutanSurgical;
        row.getCell(68).value = rawatan.pembedahanKecilMulut;

        for (let k = 69; k <= 72; k++) {
          if (i > 1) {
            row.getCell(k).value =
              rawatan[k % 2 === 1 ? 'crownBridgeSemula' : 'crownBridgeBaru'];
          }
        }

        if (i > 1) {
          row.getCell(73).value = rawatan.prosthodontikPenuhDenturBaru;
          row.getCell(74).value = rawatan.prosthodontikPenuhDenturSemula;
          row.getCell(75).value = rawatan.jumlahPesakitBuatDenturPenuh;
          row.getCell(76).value = rawatan.prosthodontikSeparaDenturBaru;
          row.getCell(77).value = rawatan.prosthodontikSeparaDenturSemula;
          row.getCell(78).value = rawatan.jumlahPesakitBuatDenturSepara;
          row.getCell(79).value = rawatan.immediateDenture;
          row.getCell(80).value = rawatan.pembaikanDenture;
        }
        row.getCell(81).value = rawatan.kesSelesai;
        row.getCell(82).value = rawatan.xrayDiambil;
        row.getCell(83).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('CE8'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('CE9'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('CE10'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('CE11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'OAP';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makeOAP] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController/makeOAP] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeOAP] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeLiputanOA = async (payload) => {
  logger.info('[generateRetenController/makeLiputanOAP] makeLiputanOAP');
  try {
    let { tarikhMula, tarikhAkhir, bulan, fromEtl, username, jenisReten } =
      payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countLiputanOA(payload);
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
      'LIPUTAN OAP.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    workbook.removeWorksheet('PENAN');
    let worksheet = workbook.getWorksheet('OA');
    //
    worksheet.getCell('B8').value = `BAGI BULAN ${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')} TAHUN ${moment(new Date()).format('YYYY')}`;
    //
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        switch (data[i]._id) {
          case 'perlis':
            worksheet.getCell('D11').value = data[i].jumlah || 0;
            break;
          case 'kedah':
            worksheet.getCell('D12').value = data[i].jumlah || 0;
            break;
          case 'pulau pinang':
            worksheet.getCell('D13').value = data[i].jumlah || 0;
            break;
          case 'perak':
            worksheet.getCell('D14').value = data[i].jumlah || 0;
            break;
          case 'selangor':
            worksheet.getCell('D15').value = data[i].jumlah || 0;
            break;
          case 'wp kuala lumpur':
          case 'wp putrajaya':
            worksheet.getCell('D16').value += data[i].jumlah || 0;
            break;
          case 'negeri sembilan':
            worksheet.getCell('D17').value = data[i].jumlah || 0;
            break;
          case 'melaka':
            worksheet.getCell('D18').value = data[i].jumlah || 0;
            break;
          case 'johor':
            worksheet.getCell('D19').value = data[i].jumlah || 0;
            break;
          case 'pahang':
            worksheet.getCell('D20').value = data[i].jumlah || 0;
            break;
          case 'kelantan':
            worksheet.getCell('D21').value = data[i].jumlah || 0;
            break;
          case 'terengganu':
            worksheet.getCell('D22').value = data[i].jumlah || 0;
            break;
          case 'sabah':
            worksheet.getCell('D23').value = data[i].jumlah || 0;
            break;
          case 'sarawak':
            worksheet.getCell('D24').value = data[i].jumlah || 0;
            break;
          case 'wp labuan':
            worksheet.getCell('D25').value = data[i].jumlah || 0;
            break;
          default:
            console.log('nope');
        }
      }
    }

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('C31'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('C32'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('C33'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'Liputan OA';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makeLiputanOA] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeLiputanOA] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeLiputanOA] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeLiputanPenan = async (payload) => {
  logger.info('[generateRetenController/makeLiputanOAP] makeLiputanPenan');
  try {
    let { tarikhMula, tarikhAkhir, bulan, fromEtl, username, jenisReten } =
      payload;
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countLiputanPenan(payload);
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
      'LIPUTAN OAP.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    workbook.removeWorksheet('OA');
    let worksheet = workbook.getWorksheet('PENAN');
    //
    worksheet.getCell('B8').value = `BAGI BULAN ${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')} TAHUN ${moment(new Date()).format('YYYY')}`;
    //
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        worksheet.getCell('D11').value = data[i].jumlah || 0;
      }
    }

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('C14'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('C15'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('C16'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'Liputan Penan';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(
      `[generateRetenController/makeLiputanPenan] writing file ${newfile}`
    );
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeLiputanPenan] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeLiputanPenan] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeKPBMPBHarian = async (payload) => {
  logger.info('[generateRetenController/makeKPBMPBHarian] makeKPBMPBHarian');
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
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countKPBMPBHarian(payload);
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
      'KPB_MPB A (HARIAN) 1_2023.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('HARIAN');
    //
    worksheet.getCell('H6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('J6').value = `${moment(new Date()).format('YYYY')}`;

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
        row.getCell(3).value = data[i].tarikhMula;
        row.getCell(6).value = data[i].tarikhAkhir;
        // row.getCell(7).value = data[i].bahanApiKenderaan;
        // row.getCell(8).value = data[i].bahanApiGenerator;
        // row.getCell(8).value = data[i].repairKenderaan
        // row.getCell(9).value = data[i].repairGenerator;
        // row.getCell(10).value = data[i].repairAlatan;
        // row.getCell(11).value = data[i].tuntutanElaun;
        // skipping cell
        // row.getCell(13).value = data[i].jumlahHariBeroperasi;
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
        row.getCell(3).value = data[i].tarikhMula;
        row.getCell(6).value = data[i].tarikhAkhir;
        // row.getCell(7).value = data[i].bahanApiKenderaan;
        // row.getCell(8).value = data[i].bahanApiGenerator;
        // row.getCell(8).value = data[i].repairKenderaan
        // row.getCell(9).value = data[i].repairGenerator;
        // row.getCell(10).value = data[i].repairAlatan;
        // row.getCell(11).value = data[i].tuntutanElaun;
        // skipping cell
        // row.getCell(13).value = data[i].jumlahHariBeroperasi;
        row.getCell(14).value = data[i].jumlahPesakitBaru;
        row.getCell(15).value = data[i].jumlahPesakitUlangan;
        row.getCell(16).value = data[i].jumlahDenturPenuh;
        row.getCell(17).value = data[i].jumlahDenturSebahagian;
        row.getCell(18).value = data[i].catatan;
      }
    }

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('Q9'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('Q10'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('Q11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'HARIAN';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makeKPBMPB] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeKPBMPB] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeKPBMPB] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeKPBMPBBulanan = async (payload) => {
  logger.info('[generateRetenController/makeKPBMPBBulanan] makeKPBMPBBulanan');
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
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countKPBMPBBulanan(payload);
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
      'KPB_MPB (BULANAN) 1_2023.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BULANAN');
    //
    worksheet.getCell('H6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('J6').value = `${moment(new Date()).format('YYYY')}`;

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
        // jumlahReten += data[i].jumlahReten;
        // jumlahRetenSalah += data[i].statusReten;
        // pemeriksaan
        row.getCell(3).value = data[i].nama;
        // row.getCell(6).value = data[i].bahanApiKenderaan;
        // row.getCell(7).value = data[i].bahanApiGenerator;
        // row.getCell(8).value = data[i].repairKenderaan;
        // row.getCell(9).value = data[i].repairGenerator;
        // row.getCell(10).value = data[i].repairAlatan;
        // row.getCell(11).value = data[i].tuntutanElaun;
        // skipping cell
        row.getCell(11).value = data[i].jumlahHariPenggunaan;
        row.getCell(12).value = data[i].totalKedatanganBaru;
        row.getCell(13).value = data[i].totalKedatanganUlangan;
        // row.getCell(18).value = data[i].catatan;
      }
    }
    // mpb
    // for (let i = 0; i < data.length; i++) {
    //   let row = worksheet.getRow(16 + i);
    //   if (data[i]) {
    //     jumlahReten += data[i].jumlahReten;
    //     jumlahRetenSalah += data[i].statusReten;
    //     // pemeriksaan
    //     // row.getCell(3).value = data[i].nasihatBerhentiMerokok;
    //     // row.getCell(6).value = data[i].bahanApiKenderaan;
    //     // row.getCell(7).value = data[i].bahanApiGenerator;
    //     // row.getCell(8).value = data[i].repairKenderaan;
    //     // row.getCell(9).value = data[i].repairGenerator;
    //     // row.getCell(10).value = data[i].repairAlatan;
    //     // row.getCell(11).value = data[i].tuntutanElaun;
    //     // skipping cell
    //     row.getCell(13).value = data[i].jumlahHariBeroperasi;
    //     row.getCell(14).value = data[i].jumlahPesakitBaru;
    //     row.getCell(15).value = data[i].jumlahPesakitUlangan;
    //     row.getCell(16).value = data[i].jumlahDenturPenuh;
    //     row.getCell(17).value = data[i].jumlahDenturSebahagian;
    //     row.getCell(18).value = data[i].catatan;
    //   }
    // }

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('P9'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('P10'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('P11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'BULANAN';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makeKPBMPB] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeKPBMPB] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeKPBMPB] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
// khusus (OAP, WE, OKU, PROJEK KOMUNITI, PENJARA)
const makeKOM = async (payload) => {
  logger.info('[generateRetenController/makeKOM] makeKOM');
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
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countKOM(payload);
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
    let filename = path.join(__dirname, '..', 'public', 'exports', 'KOM.xlsx');
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('KOM');
    //
    worksheet.getCell('AF6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('AJ6').value = `${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('C11').value = `${
      pilihanProgram ? pilihanProgram.toUpperCase() : 'ALL'
    }`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    let j;
    //
    j = 0;
    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryKOMPemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(20 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        // pemeriksaan
        row.getCell(3).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(5).value = pemeriksaan.jumlahd;
        row.getCell(6).value = pemeriksaan.jumlahf;
        row.getCell(7).value = pemeriksaan.jumlahx;
        // skipping cells
        if (i > 1) {
          row.getCell(9).value = pemeriksaan.jumlahD;
          row.getCell(10).value = pemeriksaan.jumlahM;
          row.getCell(11).value = pemeriksaan.jumlahF;
          row.getCell(12).value = pemeriksaan.jumlahX;
        }
        // skipping cells
        row.getCell(14).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(15).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(16).value = pemeriksaan.TPR;
        if (i > 1) {
          row.getCell(17).value = pemeriksaan.skorBPEZero;
          row.getCell(18).value = pemeriksaan.skorBPEMoreThanZero;
        }
        row.getCell(19).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(20).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(21).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(22).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(23).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(24).value = pemeriksaan.perluPenskaleran;
        row.getCell(25).value = pemeriksaan.perluEndoAnterior;
        row.getCell(26).value = pemeriksaan.perluEndoPremolar;
        row.getCell(27).value = pemeriksaan.perluEndoMolar;
        if (i > 1) {
          row.getCell(28).value = pemeriksaan.jumlahPerluDenturPenuh;
          row.getCell(29).value = pemeriksaan.jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
      if (i === 15) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryKOMRawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(20 + j);
        // rawatan
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(30).value = rawatan.sapuanFluorida;
        if (i > 1) {
          row.getCell(31).value = rawatan.jumlahPesakitPrrJenis1;
          row.getCell(32).value = rawatan.jumlahGigiPrrJenis1;
          row.getCell(33).value = rawatan.jumlahPesakitDiBuatFs;
          row.getCell(34).value = rawatan.jumlahGigiDibuatFs;
        }
        row.getCell(35).value = rawatan.tampalanAntGdBaru;
        row.getCell(36).value = rawatan.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(37).value = rawatan.tampalanAntGkBaru;
          row.getCell(38).value = rawatan.tampalanAntGkSemula;
        }
        row.getCell(39).value = rawatan.tampalanPostGdBaru;
        row.getCell(40).value = rawatan.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(41).value = rawatan.tampalanPostGkBaru;
          row.getCell(42).value = rawatan.tampalanPostGkSemula;
        }
        row.getCell(43).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(44).value = rawatan.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(45).value = rawatan.tampalanPostAmgGkBaru;
          row.getCell(46).value = rawatan.tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(49).value = rawatan.tampalanSementara;
        row.getCell(50).value = rawatan.cabutanGd;
        row.getCell(51).value = rawatan.cabutanGk;
        row.getCell(52).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(53).value = rawatan.penskaleran;
        row.getCell(54).value = rawatan.abses;
        row.getCell(55).value = rawatan.kecederaanTulangMuka;
        row.getCell(56).value = rawatan.kecederaanGigi;
        row.getCell(57).value = rawatan.kecederaanTisuLembut;
        //
        if (i > 1) {
          row.getCell(58).value = rawatan.prosthodontikPenuhDenturBaru;
          row.getCell(59).value = rawatan.prosthodontikPenuhDenturSemula;
          row.getCell(60).value = rawatan.jumlahPesakitBuatDenturPenuh;
          row.getCell(61).value = rawatan.prosthodontikSeparaDenturBaru;
          row.getCell(62).value = rawatan.prosthodontikSeparaDenturSemula;
          row.getCell(63).value = rawatan.jumlahPesakitBuatDenturSepara;
          row.getCell(64).value = rawatan.immediateDenture;
          row.getCell(65).value = rawatan.pembaikanDenture;
        }
        row.getCell(66).value = rawatan.kesSelesai;
        row.getCell(67).value = rawatan.xrayDiambil;
        row.getCell(68).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 11 || i === 15) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[2].length; i++) {
      const [opLain] = data[2][i].queryKOMOperatorLain || [];

      if (opLain) {
        const row = worksheet.getRow(20 + j);
        // opLain
        row.getCell(4).value = opLain.kedatanganTahunSemasaUlangan;
        row.getCell(30).value = opLain.sapuanFluorida;
        if (i > 1) {
          row.getCell(31).value = opLain.jumlahPesakitPrrJenis1;
          row.getCell(32).value = opLain.jumlahGigiPrrJenis1;
          row.getCell(33).value = opLain.jumlahPesakitDiBuatFs;
          row.getCell(34).value = opLain.jumlahGigiDibuatFs;
        }
        row.getCell(35).value = opLain.tampalanAntGdBaru;
        row.getCell(36).value = opLain.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(37).value = opLain.tampalanAntGkBaru;
          row.getCell(38).value = opLain.tampalanAntGkSemula;
        }
        row.getCell(39).value = opLain.tampalanPostGdBaru;
        row.getCell(40).value = opLain.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(41).value = opLain.tampalanPostGkBaru;
          row.getCell(42).value = opLain.tampalanPostGkSemula;
        }
        row.getCell(43).value = opLain.tampalanPostAmgGdBaru;
        row.getCell(44).value = opLain.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(45).value = opLain.tampalanPostAmgGkBaru;
          row.getCell(46).value = opLain.tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(49).value = opLain.tampalanSementara;
        row.getCell(50).value = opLain.cabutanGd;
        row.getCell(51).value = opLain.cabutanGk;
        row.getCell(52).value = opLain.komplikasiSelepasCabutan;
        row.getCell(53).value = opLain.penskaleran;
        row.getCell(54).value = opLain.abses;
        row.getCell(55).value = opLain.kecederaanTulangMuka;
        row.getCell(56).value = opLain.kecederaanGigi;
        row.getCell(57).value = opLain.kecederaanTisuLembut;
        //
        if (i > 1) {
          row.getCell(58).value = opLain.prosthodontikPenuhDenturBaru;
          row.getCell(59).value = opLain.prosthodontikPenuhDenturSemula;
          row.getCell(60).value = opLain.jumlahPesakitBuatDenturPenuh;
          row.getCell(61).value = opLain.prosthodontikSeparaDenturBaru;
          row.getCell(62).value = opLain.prosthodontikSeparaDenturSemula;
          row.getCell(63).value = opLain.jumlahPesakitBuatDenturSepara;
          row.getCell(64).value = opLain.immediateDenture;
          row.getCell(65).value = opLain.pembaikanDenture;
        }
        // row.getCell(66).value = opLain.kesSelesai;
        // row.getCell(67).value = opLain.xrayDiambil;
        // row.getCell(68).value = opLain.pesakitDisaringOC;
      }
      j++;
      if (i === 11 || i === 15) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('BP8'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('BP9'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('BP10'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('BP11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'KOM';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makeKOM] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController/makeKOM] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeKOM] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPR = async (payload) => {
  logger.info('[generateRetenController/makePPR] makePPR');
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
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPPR(payload);
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
    let filename = path.join(__dirname, '..', 'public', 'exports', 'PPR.xlsx');
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PPR');
    //
    worksheet.getCell('AF6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('AL6').value = `${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('D8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('D9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('D10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('D11').value = pilihanProgram
      ? `${pilihanProgram.toUpperCase()}`
      : 'ALL';
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryPPRPemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(20 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        // pemeriksaan
        row.getCell(3).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(5).value = pemeriksaan.jumlahd;
        row.getCell(6).value = pemeriksaan.jumlahf;
        row.getCell(7).value = pemeriksaan.jumlahx;
        // skipping cells
        if (i > 1) {
          row.getCell(9).value = pemeriksaan.jumlahD;
          row.getCell(10).value = pemeriksaan.jumlahM;
          row.getCell(11).value = pemeriksaan.jumlahF;
          row.getCell(12).value = pemeriksaan.jumlahX;
        }
        // skipping cells
        row.getCell(14).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(15).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(16).value = pemeriksaan.TPR;
        if (i > 1) {
          row.getCell(17).value = pemeriksaan.skorBPEZero;
          row.getCell(18).value = pemeriksaan.skorBPEMoreThanZero;
        }
        row.getCell(19).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(20).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(21).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(22).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(23).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(24).value = pemeriksaan.perluPenskaleran;
        row.getCell(25).value = pemeriksaan.perluEndoAnterior;
        row.getCell(26).value = pemeriksaan.perluEndoPremolar;
        row.getCell(27).value = pemeriksaan.perluEndoMolar;
        if (i > 1) {
          row.getCell(28).value = pemeriksaan.jumlahPerluDenturPenuh;
          row.getCell(29).value = pemeriksaan.jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryPPRRawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(20 + j);
        // rawatan
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(30).value = rawatan.sapuanFluorida;
        if (i > 1) {
          row.getCell(31).value = rawatan.jumlahPesakitPrrJenis1;
          row.getCell(32).value = rawatan.jumlahGigiPrrJenis1;
          row.getCell(33).value = rawatan.jumlahPesakitDiBuatFs;
          row.getCell(34).value = rawatan.jumlahGigiDibuatFs;
        }
        row.getCell(35).value = rawatan.tampalanAntGdBaru;
        row.getCell(36).value = rawatan.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(37).value = rawatan.tampalanAntGkBaru;
          row.getCell(38).value = rawatan.tampalanAntGkSemula;
        }
        row.getCell(39).value = rawatan.tampalanPostGdBaru;
        row.getCell(40).value = rawatan.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(41).value = rawatan.tampalanPostGkBaru;
          row.getCell(42).value = rawatan.tampalanPostGkSemula;
        }
        row.getCell(43).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(44).value = rawatan.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(45).value = rawatan.tampalanPostAmgGkBaru;
          row.getCell(46).value = rawatan.tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(49).value = rawatan.tampalanSementara;
        row.getCell(50).value = rawatan.cabutanGd;
        row.getCell(51).value = rawatan.cabutanGk;
        row.getCell(52).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(53).value = rawatan.penskaleran;
        row.getCell(54).value = rawatan.abses;
        row.getCell(55).value = rawatan.kecederaanTulangMuka;
        row.getCell(56).value = rawatan.kecederaanGigi;
        row.getCell(57).value = rawatan.kecederaanTisuLembut;
        //
        if (i > 1) {
          row.getCell(58).value = rawatan.prosthodontikPenuhDenturBaru;
          row.getCell(59).value = rawatan.prosthodontikPenuhDenturSemula;
          row.getCell(60).value = rawatan.jumlahPesakitBuatDenturPenuh;
          row.getCell(61).value = rawatan.prosthodontikSeparaDenturBaru;
          row.getCell(62).value = rawatan.prosthodontikSeparaDenturSemula;
          row.getCell(63).value = rawatan.jumlahPesakitBuatDenturSepara;
          //
          row.getCell(64).value = rawatan.immediateDenture;
          row.getCell(65).value = rawatan.pembaikanDenture;
        }
        row.getCell(66).value = rawatan.kesSelesai;
        row.getCell(67).value = rawatan.xrayDiambil;
        row.getCell(68).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('BP8'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('BP9'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('BP10'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('BP11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'PPR';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makePPR] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(`[generateRetenController/makePPR] deleting file ${newfile}`);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPR] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makeUTCRTC = async (payload) => {
  logger.info('[generateRetenController/makeUTCRTC] makeUTCRTC');
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
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countUTCRTC(payload);
        break;
    }
    //
    switch (klinik) {
      case 'all':
        klinik = 'all';
        break;
      case 'rtc-tunjung':
        console.log('masuk');
        klinik = 'RTC TUNJUNG, KELANTAN';
        daerah = 'KOTA BHARU';
        break;
      default:
        const currentKlinik = await User.findOne({
          kodFasiliti: klinik,
        });
        klinik = currentKlinik.kp;
        break;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'UTC_RTC.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('UTC_RTC');
    //
    worksheet.getCell('AN6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('AU6').value = `${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C9').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C10').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C11').value = `${klinik.toUpperCase()}`;
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;
    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryUTCRTCPemeriksaan || [];

      if (pemeriksaan) {
        let row = worksheet.getRow(20 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        row.getCell(3).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(5).value = pemeriksaan.jumlahd;
        row.getCell(6).value = pemeriksaan.jumlahf;
        row.getCell(7).value = pemeriksaan.jumlahx;
        // skipping cells
        if (i > 1) {
          row.getCell(9).value = pemeriksaan.jumlahD;
          row.getCell(10).value = pemeriksaan.jumlahM;
          row.getCell(11).value = pemeriksaan.jumlahF;
          row.getCell(12).value = pemeriksaan.jumlahX;
        }
        // skipping cells
        row.getCell(14).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(15).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(16).value = pemeriksaan.TPR;
        if (i > 5) {
          row.getCell(17).value = pemeriksaan.skorBPEZero;
          row.getCell(18).value = pemeriksaan.skorBPEMoreThanZero;
        }
        row.getCell(19).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(20).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(21).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(22).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(23).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(24).value = pemeriksaan.perluPenskaleran;
        row.getCell(25).value = pemeriksaan.perluEndoAnterior;
        row.getCell(26).value = pemeriksaan.perluEndoPremolar;
        row.getCell(27).value = pemeriksaan.perluEndoMolar;
        if (i > 1) {
          row.getCell(28).value = pemeriksaan.jumlahPerluDenturPenuh;
          row.getCell(29).value = pemeriksaan.jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryUTCRTCRawatan || [];

      if (rawatan) {
        let row = worksheet.getRow(20 + j);
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(30).value = rawatan.sapuanFluorida;
        if (i > 1) {
          row.getCell(31).value = rawatan.jumlahPesakitPrrJenis1;
          row.getCell(32).value = rawatan.jumlahGigiPrrJenis1;
          row.getCell(33).value = rawatan.jumlahPesakitDiBuatFs;
          row.getCell(34).value = rawatan.jumlahGigiDibuatFs;
        }
        row.getCell(35).value = rawatan.tampalanAntGdBaru;
        row.getCell(36).value = rawatan.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(37).value = rawatan.tampalanAntGkBaru;
          row.getCell(38).value = rawatan.tampalanAntGkSemula;
        }
        row.getCell(39).value = rawatan.tampalanPostGdBaru;
        row.getCell(40).value = rawatan.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(41).value = rawatan.tampalanPostGkBaru;
          row.getCell(42).value = rawatan.tampalanPostGkSemula;
        }
        row.getCell(43).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(44).value = rawatan.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(45).value = rawatan.tampalanPostAmgGkBaru;
          row.getCell(46).value = rawatan.tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(47).value = rawatan.inlayOnlayBaru;
        row.getCell(48).value = rawatan.inlayOnlaySemula;
        // skipping cells
        row.getCell(51).value = rawatan.tampalanSementara;
        row.getCell(52).value = rawatan.cabutanGd;
        row.getCell(53).value = rawatan.cabutanGk;
        row.getCell(54).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(55).value = rawatan.penskaleran;
        row.getCell(56).value = rawatan.rawatanPerioLain;
        row.getCell(57).value = rawatan.rawatanEndoAnterior;
        row.getCell(58).value = rawatan.rawatanEndoPremolar;
        row.getCell(59).value = rawatan.rawatanEndoMolar;
        row.getCell(60).value = rawatan.rawatanOrtho;
        row.getCell(61).value = rawatan.kesPerubatan;
        row.getCell(62).value = rawatan.abses;
        row.getCell(63).value = rawatan.kecederaanTulangMuka;
        row.getCell(64).value = rawatan.kecederaanGigi;
        row.getCell(65).value = rawatan.kecederaanTisuLembut;
        row.getCell(66).value = rawatan.cabutanSurgical;
        row.getCell(67).value = rawatan.pembedahanKecilMulut;
        if (i > 1) {
          row.getCell(68).value = rawatan.crownBridgeBaru;
          row.getCell(69).value = rawatan.crownBridgeSemula;
          row.getCell(70).value = rawatan.postCoreBaru;
          row.getCell(71).value = rawatan.postCoreSemula;
          row.getCell(72).value = rawatan.prosthodontikPenuhDenturBaru;
          row.getCell(73).value = rawatan.prosthodontikPenuhDenturSemula;
          row.getCell(74).value = rawatan.jumlahPesakitBuatDenturPenuh;
          row.getCell(75).value = rawatan.prosthodontikSeparaDenturBaru;
          row.getCell(76).value = rawatan.prosthodontikSeparaDenturSemula;
          row.getCell(77).value = rawatan.jumlahPesakitBuatDenturSepara;
          row.getCell(78).value = rawatan.immediateDenture;
          row.getCell(79).value = rawatan.pembaikanDenture;
        }
        row.getCell(80).value = rawatan.kesSelesai;
        row.getCell(81).value = rawatan.xrayDiambil;
        row.getCell(82).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('CD8'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('CD9'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('CD10'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('CD11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'UTC_RTC';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makeUTCRTC] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makeUTCRTC] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makeUTCRTC] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePPKPS = async (payload) => {
  logger.info('[generateRetenController/makePPKPS] makePPKPS');
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
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPPKPS(payload);
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
      'PPKPS.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PPKPS');
    //
    worksheet.getCell('AE6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('AK6').value = `${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('D8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('D9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('D10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('D11').value = pilihanProgram
      ? `${pilihanProgram.toUpperCase()}`
      : 'ALL';
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryPPKPSPemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(20 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        // pemeriksaan
        row.getCell(3).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(5).value = pemeriksaan.jumlahd;
        row.getCell(6).value = pemeriksaan.jumlahf;
        row.getCell(7).value = pemeriksaan.jumlahx;
        // skipping cells
        if (i > 1) {
          row.getCell(9).value = pemeriksaan.jumlahD;
          row.getCell(10).value = pemeriksaan.jumlahM;
          row.getCell(11).value = pemeriksaan.jumlahF;
          row.getCell(12).value = pemeriksaan.jumlahX;
        }
        // skipping cells
        row.getCell(14).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(15).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(16).value = pemeriksaan.TPR;
        if (i > 1) {
          row.getCell(17).value = pemeriksaan.skorBPEZero;
          row.getCell(18).value = pemeriksaan.skorBPEMoreThanZero;
        }
        row.getCell(19).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(20).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(21).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(22).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(23).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(24).value = pemeriksaan.perluPenskaleran;
        row.getCell(25).value = pemeriksaan.perluEndoAnterior;
        row.getCell(26).value = pemeriksaan.perluEndoPremolar;
        row.getCell(27).value = pemeriksaan.perluEndoMolar;
        if (i > 1) {
          row.getCell(28).value = pemeriksaan.jumlahPerluDenturPenuh;
          row.getCell(29).value = pemeriksaan.jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryPPKPSRawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(20 + j);
        // rawatan
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(30).value = rawatan.sapuanFluorida;
        if (i > 1) {
          row.getCell(31).value = rawatan.jumlahPesakitPrrJenis1;
          row.getCell(32).value = rawatan.jumlahGigiPrrJenis1;
          row.getCell(33).value = rawatan.jumlahPesakitDiBuatFs;
          row.getCell(34).value = rawatan.jumlahGigiDibuatFs;
        }
        row.getCell(35).value = rawatan.tampalanAntGdBaru;
        row.getCell(36).value = rawatan.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(37).value = rawatan.tampalanAntGkBaru;
          row.getCell(38).value = rawatan.tampalanAntGkSemula;
        }
        row.getCell(39).value = rawatan.tampalanPostGdBaru;
        row.getCell(40).value = rawatan.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(41).value = rawatan.tampalanPostGkBaru;
          row.getCell(42).value = rawatan.tampalanPostGkSemula;
        }
        row.getCell(43).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(44).value = rawatan.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(45).value = rawatan.tampalanPostAmgGkBaru;
          row.getCell(46).value = rawatan.tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(49).value = rawatan.tampalanSementara;
        row.getCell(50).value = rawatan.cabutanGd;
        row.getCell(51).value = rawatan.cabutanGk;
        row.getCell(52).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(53).value = rawatan.penskaleran;
        row.getCell(54).value = rawatan.abses;
        row.getCell(55).value = rawatan.kecederaanTulangMuka;
        row.getCell(56).value = rawatan.kecederaanGigi;
        row.getCell(57).value = rawatan.kecederaanTisuLembut;
        //
        if (i > 1) {
          row.getCell(58).value = rawatan.prosthodontikPenuhDenturBaru;
          row.getCell(59).value = rawatan.prosthodontikPenuhDenturSemula;
          row.getCell(60).value = rawatan.jumlahPesakitBuatDenturPenuh;
          row.getCell(61).value = rawatan.prosthodontikSeparaDenturBaru;
          row.getCell(62).value = rawatan.prosthodontikSeparaDenturSemula;
          row.getCell(63).value = rawatan.jumlahPesakitBuatDenturSepara;
          row.getCell(64).value = rawatan.immediateDenture;
          row.getCell(65).value = rawatan.pembaikanDenture;
        }
        row.getCell(66).value = rawatan.kesSelesai;
        row.getCell(68).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('BP8'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('BP9'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('BP10'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('BP11'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'PPKPS';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makePPKPS] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePPKPS] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePPKPS] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePKAP1 = async (payload) => {
  logger.info('[generateRetenController] makePKAP1');
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
  try {
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
        data = await Helper.countPKAP1(payload);
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
      'PKAP 1.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('MAKLUMAT ASAS');
    //
    worksheet.getCell('B4').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('B5').value = `${moment(new Date()).format('MMMM')}`;
    worksheet.getCell('B6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('YYYY')}`;

    // maklumat program
    for (let i = 0; i < data[0].length; i++) {
      let row = worksheet.getRow(11 + i);
      if (data[0][i]) {
        row.getCell(2).value = daerah;
        row.getCell(3).value = klinik;
        row.getCell(4).value = data[0][i].alamatKA;
        row.getCell(5).value = data[0][i].jarakDariKlinik;
        row.getCell(6).value = data[0][i].jumlahLawatanKeRumah;
        // skipping cells
        row.getCell(8).value = data[0][i].tahunDiAngkat;
        row.getCell(9).value = data[0][i].tarikhDilawati;
      }
    }
    // maklumat keluarga
    for (let i = 0; i < data.length; i++) {
      let row = worksheet.getRow(18 + i);
      if (data[1][i]) {
        row.getCell(3).value = data[1][i].namaKetuaKeluarga;
        row.getCell(4).value = data[1][i].alamatRumah;
        row.getCell(5).value = data[1][i].nomborTelefon;
        row.getCell(6).value = data[1][i].jumlahIsiRumah;
        row.getCell(7).value = data[1][i].jumlahIsiRumahDiperiksa;
        row.getCell(8).value = data[1][i].tarikhDilawati;
        row.getCell(9).value = data[1][i].bilToddlerSapuanFlorida;
      }
    }

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('I6'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('I7'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'MAKLUMAT ASAS';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makePKAP1] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePKAP1] deleting file ${newfile}`
      );
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePKAP1] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};
const makePKAP2 = async (payload) => {
  logger.info('[generateRetenController/makePKAP2] makePKAP2');
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
  try {
    let data;
    switch (fromEtl) {
      case 'true':
        const query = createQuery(payload);
        data = await Reservoir.find(query).sort({ createdAt: -1 });
        break;
      default:
        data = await Helper.countPKAP2(payload);
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
      'PKAP 2.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('BULANAN');
    //
    worksheet.getCell('AD6').value = `${moment(
      bulan ? bulan : tarikhMula
    ).format('MMMM')}`;
    worksheet.getCell('AI6').value = `${moment(new Date()).format('YYYY')}`;

    worksheet.getCell('C8').value = `${negeri.toUpperCase()}`;
    worksheet.getCell('C9').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('C10').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('C11').value = pilihanProgram
      ? `${pilihanProgram.toUpperCase()}`
      : 'ALL';
    //
    let jumlahReten = 0;
    let jumlahRetenSalah = 0;
    //
    let j = 0;

    for (let i = 0; i < data[0].length; i++) {
      const [pemeriksaan] = data[0][i].queryPKAP2Pemeriksaan || [];

      if (pemeriksaan) {
        const row = worksheet.getRow(20 + j);
        jumlahReten += pemeriksaan.jumlahReten;
        jumlahRetenSalah += pemeriksaan.statusReten;
        // pemeriksaan
        row.getCell(3).value = pemeriksaan.kedatanganTahunSemasaBaru;
        row.getCell(5).value = pemeriksaan.jumlahd;
        row.getCell(6).value = pemeriksaan.jumlahf;
        row.getCell(7).value = pemeriksaan.jumlahx;
        // skipping cells
        if (i > 1) {
          row.getCell(9).value = pemeriksaan.jumlahD;
          row.getCell(10).value = pemeriksaan.jumlahM;
          row.getCell(11).value = pemeriksaan.jumlahF;
          row.getCell(12).value = pemeriksaan.jumlahX;
        }
        // skipping cells
        row.getCell(14).value = pemeriksaan.jumlahMBK;
        if (i > 1) {
          row.getCell(15).value = pemeriksaan.statusBebasKaries;
        }
        row.getCell(16).value = pemeriksaan.TPR;
        if (i > 5) {
          row.getCell(17).value = pemeriksaan.skorBPEZero;
          row.getCell(18).value = pemeriksaan.skorBPEMoreThanZero;
        }
        row.getCell(19).value = pemeriksaan.perluSapuanFluorida;
        if (i > 1) {
          row.getCell(20).value = pemeriksaan.perluJumlahPesakitPrrJenis1;
          row.getCell(21).value = pemeriksaan.perluJumlahGigiPrrJenis1;
          row.getCell(22).value = pemeriksaan.perluJumlahPesakitFS;
          row.getCell(23).value = pemeriksaan.perluJumlahGigiFS;
        }
        row.getCell(24).value = pemeriksaan.perluPenskaleran;
        row.getCell(25).value = pemeriksaan.perluEndoAnterior;
        row.getCell(26).value = pemeriksaan.perluEndoPremolar;
        row.getCell(27).value = pemeriksaan.perluEndoMolar;
        if (i > 1) {
          row.getCell(28).value = pemeriksaan.jumlahPerluDenturPenuh;
          row.getCell(29).value = pemeriksaan.jumlahPerluDenturSepara;
        }
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      const [rawatan] = data[1][i].queryPKAP2Rawatan || [];

      if (rawatan) {
        const row = worksheet.getRow(20 + j);
        // rawatan
        row.getCell(4).value = rawatan.kedatanganTahunSemasaUlangan;
        row.getCell(30).value = rawatan.sapuanFluorida;
        if (i > 1) {
          row.getCell(31).value = rawatan.jumlahPesakitPrrJenis1;
          row.getCell(32).value = rawatan.jumlahGigiPrrJenis1;
          row.getCell(33).value = rawatan.jumlahPesakitDiBuatFs;
          row.getCell(34).value = rawatan.jumlahGigiDibuatFs;
        }
        row.getCell(35).value = rawatan.tampalanAntGdBaru;
        row.getCell(36).value = rawatan.tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(37).value = rawatan.tampalanAntGkBaru;
          row.getCell(38).value = rawatan.tampalanAntGkSemula;
        }
        row.getCell(39).value = rawatan.tampalanPostGdBaru;
        row.getCell(40).value = rawatan.tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(41).value = rawatan.tampalanPostGkBaru;
          row.getCell(42).value = rawatan.tampalanPostGkSemula;
        }
        row.getCell(43).value = rawatan.tampalanPostAmgGdBaru;
        row.getCell(44).value = rawatan.tampalanPostAmgGdSemula;
        if (i > 1) {
          row.getCell(45).value = rawatan.tampalanPostAmgGkBaru;
          row.getCell(46).value = rawatan.tampalanPostAmgGkSemula;
        }
        // skipping cells
        row.getCell(49).value = rawatan.tampalanSementara;
        row.getCell(50).value = rawatan.cabutanGd;
        row.getCell(51).value = rawatan.cabutanGk;
        row.getCell(52).value = rawatan.komplikasiSelepasCabutan;
        row.getCell(53).value = rawatan.penskaleran;
        row.getCell(54).value = rawatan.abses;
        row.getCell(55).value = rawatan.kecederaanTulangMuka;
        row.getCell(56).value = rawatan.kecederaanGigi;
        row.getCell(57).value = rawatan.kecederaanTisuLembut;
        //
        if (i > 1) {
          row.getCell(58).value = rawatan.prosthodontikPenuhDenturBaru;
          row.getCell(59).value = rawatan.prosthodontikPenuhDenturSemula;
          row.getCell(60).value = rawatan.jumlahPesakitBuatDenturPenuh;
          row.getCell(61).value = rawatan.prosthodontikSeparaDenturBaru;
          row.getCell(62).value = rawatan.prosthodontikSeparaDenturSemula;
          row.getCell(63).value = rawatan.jumlahPesakitBuatDenturSepara;
          //
          row.getCell(64).value = rawatan.immediateDenture;
          row.getCell(65).value = rawatan.pembaikanDenture;
        }
        row.getCell(66).value = rawatan.kesSelesai;
        row.getCell(67).value = rawatan.xrayDiambil;
        row.getCell(68).value = rawatan.pesakitDisaringOC;
      }
      j++;
      if (i === 11) {
        j++;
      }
    }

    let peratusRetenSalah = (jumlahRetenSalah / jumlahReten) * 100;

    const setCellValue = (cell, value, alignment) => {
      cell.value = value;
      cell.alignment = {
        wrapText: false,
        shrinkToFit: false,
        horizontal: 'right',
        ...alignment,
      };
    };

    setCellValue(
      worksheet.getCell('BP7'),
      `Gi-Ret 2.0 (${process.env.npm_package_version}) / Reten Engine: ${reten_engine_version}`
    );
    setCellValue(
      worksheet.getCell('BP8'),
      `Maklumat dari ${
        bulan
          ? `${moment(bulan).startOf('month').format('DD-MM-YYYY')} - ${moment(
              bulan
            )
              .endOf('month')
              .format('DD-MM-YYYY')}`
          : `${moment(tarikhMula).format('DD-MM-YYYY')} - ${moment(
              tarikhAkhir
            ).format('DD-MM-YYYY')}`
      }`
    );
    setCellValue(
      worksheet.getCell('BP9'),
      `Peratus reten salah: ${peratusRetenSalah.toFixed(2)}%`
    );
    setCellValue(
      worksheet.getCell('BP10'),
      `Dijana oleh: ${username} (${moment(new Date()).format(
        'DD-MM-YYYY'
      )} - ${moment(new Date()).format('HH:mm:ss')})`
    );

    worksheet.name = 'BULANAN';

    const newfile = makeFile();

    await workbook.xlsx.writeFile(newfile);
    logger.info(`[generateRetenController/makePKAP2] writing file ${newfile}`);
    setTimeout(() => {
      fs.unlinkSync(newfile);
      logger.info(
        `[generateRetenController/makePKAP2] deleting file ${newfile}`
      );
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));

    return file;
  } catch (error) {
    penjanaanRetenLogger.error(
      `[generateRetenController/makePKAP2] Excel making error. Reason: ${error}`
    );
    excelMakerError(jenisReten);
  }
};

// debug
exports.debug = async (req, res) => {
  logger.info('[generateRetenController/debugTest] debug test');
  let payload = {
    negeri: 'Selangor',
    // daerah: 'Arau',
    daerah: 'all',
    // klinik: 'Klinik Pergigian Kaki Bukit',
    klinik: 'all',
    // bulan: '2023-04-01',
    tarikhMula: '2023-01-01',
    tarikhAkhir: '2023-01-31',
    jenisReten: 'OAP',
    fromEtl: false,
  };
  // console.table(payload);
  const data = await makeOAP(payload);
  // const data = await makePG214(payload);
  // const data = await makePGPR201(klinik);
  // const data = await makePGS203(klinik, bulan, sekolah);
  // res.setHeader('Content-Type', 'application/vnd.ms-excel');
  // res.status(200).send(data);
  res.status(200).json(data);
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

// mapping retens - JUMLAH RETEN = 44
const mapsOfSeveralRetens = new Map([
  ['PG101A', makePG101A],
  ['PG101C', makePG101C],
  ['PG211A', makePG211A],
  ['PG211C', makePG211C],
  ['PG211C-KPBMPB', makePG211C],
  ['PG206', makePG206],
  ['PG207', makePG207],
  ['PG214', makePG214],
  ['PGPR201', makePGPR201],
  ['PGPRO01', makePgPro01],
  ['PGPRO01Combined', makePgPro01Combined],
  ['PGS201', makePGS201],
  ['PGS203P2', makePGS203P2],
  ['TODP1', makeTOD],
  ['MASA', makeMasa],
  ['BP', makeBp],
  ['BPE', makeBPE],
  ['GENDER', makeGender],
  ['KEPP', makeKEPP],
  // new
  ['BEGIN', makeBEGIN],
  ['CPPC1', makeCPPC1],
  ['CPPC2', makeCPPC2],
  ['PPIM03', makePPIM03],
  ['PPIM04', makePPIM04],
  ['PPIM05', makePPIM05],
  ['DEWASAMUDA', makeDEWASAMUDA],
  ['PPR', makePPR],
  ['PPKPS', makePPKPS],
  // ['PKAP1', makePKAP1],
  ['PKAP2', makePKAP2],
  // variasi reten kom
  ['KOM-OAP', makeKOM],
  ['KOM-WE', makeKOM],
  ['KOM-OKU-PDK', makeKOM],
  ['KOM-Komuniti', makeKOM],
  ['KOM-Penjara', makeKOM],
  ['KOM-FDS', makeKOM],
  ['KOM-ISN', makeKOM],
  ['KOM-HRC', makeKOM],
  // induk kom
  ['KOM', makeKOM],
  ['OAP', makeOAP],
  ['LiputanOA', makeLiputanOA],
  ['LiputanPenan', makeLiputanPenan],
  ['RTC', makeUTCRTC],
  ['UTCRTC', makeUTCRTC],
  // ['KPBMPBHarian', makeKPBMPBHarian],
  ['KPBMPBBulanan', makeKPBMPBBulanan],
]);

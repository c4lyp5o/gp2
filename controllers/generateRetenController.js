'use strict';
const fs = require('fs');
const async = require('async');
const path = require('path');
const moment = require('moment');
const Excel = require('exceljs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const GenerateToken = require('../models/GenerateToken');
const { generateRandomString } = require('./adminAPI');
const logger = require('../logs/logger');

const borderStyle = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

exports.startQueue = async function (req, res) {
  // get userdata
  const { authorization } = req.headers;
  const { username, accountType } = jwt.verify(
    authorization,
    process.env.JWT_SECRET
  );
  //
  const { jenisReten, fromEtl } = req.query;
  //
  if (
    accountType !== 'kaunterUser' &&
    !fromEtl &&
    (jenisReten !== 'PG101A' || jenisReten !== 'PG101C')
  ) {
    console.log('not kaunter user n from etl');
    let userTokenData = await GenerateToken.findOne({
      belongsTo: username,
      jenisReten,
    });

    // create if there is no userTokenData
    if (!userTokenData) {
      switch (accountType) {
        case 'negeriSuperadmin':
          const negeriToken = new GenerateToken({
            belongsTo: username,
            accountType,
            jenisReten,
            jumlahToken: 5,
          });
          await negeriToken.save();
          userTokenData = negeriToken;
          console.log('dah save token negeri');
          break;
        case 'daerahSuperadmin':
          const daerahToken = new GenerateToken({
            belongsTo: username,
            accountType,
            jenisReten,
            jumlahToken: 3,
          });
          await daerahToken.save();
          userTokenData = daerahToken;
          break;
        default:
          res
            .status(403)
            .json({ message: 'Anda tidak dibenarkan untuk menjana reten' });
      }
    }

    if (
      process.env.BUILD_ENV === 'production' &&
      userTokenData.jumlahToken <= 0
    ) {
      console.log('no more coins left');
      return res.status(401).json({ msg: 'no more coins left' });
    }
  }

  // get in line soldier!
  const downloadQueue = async.queue(async (task, callback) => {
    try {
      const result = await task();
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  }, process.env.GENERATE_WORKERS || 5);

  downloadQueue.push(() =>
    downloader(req, res, async (err, result) => {
      if (err) {
        if (err === 'No data found') {
          return res.status(404).json({ message: err });
        }
        return res.status(500).json({ message: err });
      }
      if (
        process.env.BUILD_ENV === 'production' &&
        accountType !== 'kaunterUser' &&
        !fromEtl &&
        (jenisReten !== 'PG101A' || jenisReten !== 'PG101')
      ) {
        userTokenData.jumlahToken -= 1;
        await userTokenData.save();
        console.log('dah kurangkan token');
      } else {
        console.log('not production and ' + accountType);
      }
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.status(200).send(result);
    })
  );
};
exports.refreshTokens = async function (req, res) {
  // refresh negeri tokens
  const negeriTokens = await GenerateToken.find({
    accountType: 'negeriSuperadmin',
  });

  if (negeriTokens) {
    negeriTokens.forEach(async (token) => {
      token.jumlahToken = 5;
      await token.save();
    });
    console.log('dah refresh token negeri');
  }

  // refresh token daerah
  const daerahTokens = await GenerateToken.find({
    accountType: 'daerahSuperadmin',
  });
  if (daerahTokens) {
    daerahTokens.forEach(async (token) => {
      token.jumlahToken = 3;
      await token.save();
    });
    console.log('dah refresh token daerah');
  }

  res.status(200).json({ message: 'Tokens refreshed' });
};

// helper
const Helper = require('../controllers/countHelper');

// gateway
const downloader = async (req, res, callback) => {
  // check query
  let {
    jenisReten,
    negeri,
    daerah,
    klinik,
    pegawai,
    pilihanFasiliti,
    pilihanKkia,
    pilihanProgram,
    pilihanKpbmpb,
    tarikhMula,
    tarikhAkhir,
    bulan,
    id,
  } = req.query;
  // check if there is any query
  if (!jenisReten) {
    return callback('No data found');
  }
  //
  const { authorization } = req.headers;
  //
  let currentKodFasiliti, currentDaerah, currentNegeri, accountType, username;
  if (!authorization) {
    console.log('no authorization');
    // kp = klinikid;
    // daerah = klinikdaerah;
    // negeri = kliniknegeri;
  }
  if (authorization) {
    // console.log(authorization);
    // const token = authorization.split(' ')[1];
    accountType = jwt.verify(authorization, process.env.JWT_SECRET).accountType;
    currentKodFasiliti = jwt.verify(
      authorization,
      process.env.JWT_SECRET
    ).kodFasiliti;
    currentDaerah = jwt.verify(authorization, process.env.JWT_SECRET).daerah;
    currentNegeri = jwt.verify(authorization, process.env.JWT_SECRET).negeri;
    username = jwt.verify(authorization, process.env.JWT_SECRET).username;
  }
  // if kaunter user
  if (accountType === 'kaunterUser') {
    klinik = currentKodFasiliti;
    daerah = currentDaerah;
    negeri = currentNegeri;
    const { kp } = await User.findOne({ kodFasiliti: klinik });
    username = `Kaunter ${kp}`;
  }
  const payload = {
    username,
    id,
    accountType,
    pegawai,
    klinik,
    daerah,
    negeri,
    pilihanFasiliti,
    pilihanKkia,
    pilihanProgram,
    pilihanKpbmpb,
    tarikhMula,
    tarikhAkhir,
    bulan,
  };
  logger.info(`${req.method} ${req.url} ${klinik} Requesting ${jenisReten}`);
  let excelFile;
  switch (jenisReten) {
    case 'PG101A':
      excelFile = await makePG101A(payload);
      break;
    case 'PG101C':
      excelFile = await makePG101C(payload);
      break;
    case 'PG211A':
      excelFile = await makePG211A(payload);
      break;
    case 'PG211C':
      excelFile = await makePG211C(payload);
      break;
    case 'PG214':
      excelFile = await makePG214(payload);
      break;
    case 'PG206':
      excelFile = await makePG206(payload);
      break;
    case 'PG207':
      excelFile = await makePG207(payload);
      break;
    case 'PG201':
      excelFile = await makePG201(payload);
      break;
    case 'PGS203':
      excelFile = await makePGS203(payload);
      break;
    case 'PGPR201':
      excelFile = await makePGPR201(payload);
      break;
    case 'PGPRO01':
      excelFile = await makePgPro01(payload);
      break;
    case 'GENDER':
      excelFile = await makeGender(payload);
      break;
    case 'MASA':
      excelFile = await makeMasa(payload);
      break;
    case 'BP':
      excelFile = await makeBp(payload);
      break;
    case 'BPE':
      excelFile = await makeBPE(payload);
      break;
    default:
      return 'No data found';
  }
  if (excelFile === 'No data found') {
    return callback('No data found');
  }
  return callback(null, excelFile);
};

// functions
const makePG101A = async (payload) => {
  console.log('PG101A');
  try {
    let { klinik, daerah, negeri, username } = payload;
    //
    const data = await Helper.countPG101A(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'PG101A.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG101A');

    const monthName = moment(new Date()).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('I5').value = monthName;
    worksheet.getCell('M5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'PRIMER';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah ? daerah.toUpperCase() : null}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri ? negeri.toUpperCase() : null}`;
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
      let catatan = `Operator: ${
        data[i].createdByUsername !== 'kaunter' ? data[i].createdByUsername : ''
      }${data[i].noBayaran ? data[i].noBayaran : ''} ${
        data[i].noResit ? data[i].noResit : ''
      } ${data[i].noBayaran2 ? data[i].noBayaran2 : ''} ${
        data[i].noResit2 ? data[i].noResit2 : ''
      } ${data[i].noBayaran3 ? data[i].noBayaran3 : ''} ${
        data[i].noResit3 ? data[i].noResit3 : ''
      } ${data[i].catatan}`;
      rowNew.getCell(35).value = catatan; //catatan
      if (data[i].deleted) {
        rowNew.getCell(35).value = 'PESAKIT YANG DIHAPUS';
      }
      for (let z = 1; z < 36; z++) {
        rowNew.getCell(z).border = borderStyle;
      }
    }

    let rowTambahan = 1;
    let rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '* Kedatangan Baru Ibu Mengandung hanya dikira sekali sahaja bagi setiap episod baru mengandung, pada ruangan ini.';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '**Sila masukkan nombor kad OKU bagi pesakit yang berkenaan.';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '***Sila nyatakan nombor kad pesara Kerajaan / ATM di Ruangan Catatan.';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '****Punca rujukan: Rujukan Dalaman, Klinik Pergigian Kerajaan, Klinik Kesihatan Kerajaan, Hospital/Institusi Kerajaan, Swasta atau Lain-lain. Hanya Punca Rujukan Baru sahaja direkod.';
    // info
    // rowTambahan = rowTambahan + 2;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).value = 'Gi-Ret 2.0';
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // // rowNew.getCell(1).font = {
    // //     color: { argb: 'FF0000' },
    // //    };
    // rowNew.getCell(1).value = process.env.npm_package_version;
    // //
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).value = 'Memaparkan maklumat dari';
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // // worksheet.mergeCells(
    // //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // // rowNew.getCell(1).font = {
    // //     color: { argb: 'FF0000' },
    // //    };
    // rowNew.getCell(1).value = `${moment(new Date())
    //   .startOf('month')
    //   .format('DD-MM-YYYY')} - ${moment(new Date()).format('DD-MM-YYYY')}`;
    // //
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).value = 'Tarikh dan masa penjanaan';
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // // rowNew.getCell(1).font = {
    // //     color: { argb: 'FF0000' },
    // //    };
    // rowNew.getCell(1).value = `${moment(new Date()).format(
    //   'DD-MM-YYYY'
    // )} - ${moment(new Date()).format('HH:mm:ss')}`;
    // //
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).value = 'Peratus reten dilaporkan salah';
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // // rowNew.getCell(1).font = {
    // //     color: { argb: 'FF0000' },
    // //    };
    // rowNew.getCell(1).value = 'TIDAK BERKENAAN';
    // //
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).value = 'Dijana oleh';
    // rowTambahan++;
    // console.log(rowTambahan);
    // rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    // rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).font = {
    //     color: { argb: 'FF0000' },
    //    };
    // rowNew.getCell(1).value = username;
    //
    worksheet.getCell(
      'AI7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AI8').value = `${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG101A';

    const newfile = makeFile(payload, 'PG101A');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile);
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (err) {
    console.log(err);
  }
};
const makePG101C = async (payload) => {
  console.log('PG101C');
  try {
    let { klinik, daerah, negeri, bulan, username } = payload;
    //
    const data = await Helper.countPG101C(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
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

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(bulan).format('YYYY');

    worksheet.getCell('I5').value = monthName;
    worksheet.getCell('M5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'OUTREACH';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

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
      let catatan = `Operator: ${
        data[i].createdByUsername !== 'kaunter' ? data[i].createdByUsername : ''
      }${data[i].noBayaran ? data[i].noBayaran : ''} ${
        data[i].noResit ? data[i].noResit : ''
      } ${data[i].noBayaran2 ? data[i].noBayaran2 : ''} ${
        data[i].noResit2 ? data[i].noResit2 : ''
      } ${data[i].noBayaran3 ? data[i].noBayaran3 : ''} ${
        data[i].noResit3 ? data[i].noResit3 : ''
      } ${data[i].catatan}`;
      rowNew.getCell(35).value = catatan; //catatan
      if (data[i].deleted) {
        rowNew.getCell(35).value = 'PESAKIT YANG DIHAPUS';
      }
      for (let z = 1; z < 36; z++) {
        rowNew.getCell(z).border = borderStyle;
      }
    }

    let rowTambahan = 1;
    let rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '* Kedatangan Baru Ibu Mengandung hanya dikira sekali sahaja bagi setiap episod baru mengandung, pada ruangan ini.';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '**Sila masukkan nombor kad OKU bagi pesakit yang berkenaan.';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '***Sila nyatakan nombor kad pesara Kerajaan / ATM di Ruangan Catatan.';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + data.length + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(10).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value =
      '****Punca rujukan: Rujukan Dalaman, Klinik Pergigian Kerajaan, Klinik Kesihatan Kerajaan, Hospital/Institusi Kerajaan, Swasta atau Lain-lain. Hanya Punca Rujukan Baru sahaja direkod.';

    worksheet.getCell(
      'AI7'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AI8').value = `${username} (${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG101C';

    const newfile = makeFile(payload, 'PG101C');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePG211A = async (payload) => {
  console.log('PG211A');
  try {
    const { klinik, daerah, negeri, bulan, username } = payload;
    //
    const data = await Helper.countPG211A(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
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
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG211A');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('N5').value = monthName;
    worksheet.getCell('R5').value = yearNow;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'PRIMER';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri.toUpperCase()}`;
    //
    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(13 + i);
      if (data[i][0]) {
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

    worksheet.getCell(
      'AG6'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AG7').value = `Maklumat dari ${moment(new Date()).format(
      'DD-MM-YYYY'
    )}`;
    worksheet.getCell('AI8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG211A';

    const newfile = makeFile(payload, 'PG211A');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePG211C = async (payload) => {
  console.log('PG211C');
  try {
    const { klinik, daerah, negeri, bulan, username } = payload;
    //
    const data = await Helper.countPG211C(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
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

    const monthName = moment(bulan).format('MMMM');
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
    //
    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(13 + i);
      if (data[i][0]) {
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

    worksheet.getCell(
      'AG6'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AG7').value = `Maklumat dari ${moment(new Date()).format(
      'DD-MM-YYYY'
    )}`;
    worksheet.getCell('AI8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG211C';

    const newfile = makeFile(payload, 'PG211C');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePG214 = async (payload) => {
  console.log('PG214');
  try {
    const { klinik, daerah, negeri, bulan, username } = payload;
    //
    const data = await Helper.countPG214(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
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

    worksheet.getCell('J5').value = `BAGI BULAN ${moment(bulan)
      .format('MMMM')
      .toUpperCase()}`;
    worksheet.getCell('O5').value = `TAHUN ${moment(new Date()).format(
      'YYYY'
    )}`;
    worksheet.getCell('B6').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B7').value = `${daerah.toUpperCase()}`;
    worksheet.getCell('B8').value = `${negeri.toUpperCase()}`;
    //
    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(13 + i);
      if (data[i][0]) {
        rowNew.getCell(3).value = data[i][0].jumlahMelayu; //C13	Kategori Umur 60 Tahun
        rowNew.getCell(4).value = data[i][0].jumlahCina; //D13	Kategori Umur 60 Tahun
        rowNew.getCell(5).value = data[i][0].jumlahIndia; //E13	Kategori Umur 60 Tahun
        rowNew.getCell(6).value = data[i][0].jumlahBajau; //F13	Kategori Umur 60 Tahun
        rowNew.getCell(7).value = data[i][0].jumlahDusun; //G13	Kategori Umur 60 Tahun
        rowNew.getCell(8).value = data[i][0].jumlahKadazan; //H13 Kategori Umur 60 Tahun
        rowNew.getCell(9).value = data[i][0].jumlahMurut; //I13	Kategori Umur 60 Tahun
        rowNew.getCell(10).value = data[i][0].jumlahBMSL; //J13 Kategori Umur 60 Tahun
        rowNew.getCell(11).value = data[i][0].jumlahMelanau; //K13 Kategori Umur 60 Tahun
        rowNew.getCell(12).value = data[i][0].jumlahKedayan; //L13 Kategori Umur 60 Tahun
        rowNew.getCell(13).value = data[i][0].jumlahIban; //M13 Kategori Umur 60 Tahun
        rowNew.getCell(14).value = data[i][0].jumlahBidayuh; //N13 Kategori Umur 60 Tahun
        rowNew.getCell(15).value = data[i][0].jumlahPenan; //O13 Kategori Umur 60 Tahun
        rowNew.getCell(16).value = data[i][0].jumlahBMSwL; //P13 Kategori Umur 60 Tahun
        rowNew.getCell(17).value = data[i][0].jumlahOAS; //Q13 Kategori Umur 60 Tahun
        rowNew.getCell(18).value = data[i][0].jumlahLainlain; //R13 Kategori Umur 60 Tahun
        rowNew.getCell(19).value = data[i][0].jumlahBukanWarganegara; //S13 Kategori Umur 60 Tahun
        rowNew.getCell(20).value = data[i][0].jumlahLelaki; //T13 Kategori Umur 60 Tahun
        rowNew.getCell(21).value = data[i][0].jumlahPerempuan; //U13 Kategori Umur 60 Tahun
        rowNew.getCell(22).value = data[i][0].jumlahEdentulous; //V13 Kategori Umur 60 Tahun
        rowNew.getCell(23).value = data[i][0].jumlahGigiLebihAtauSama20; //W13 Kategori Umur 60 Tahun
        rowNew.getCell(24).value = data[i][0].jumlahGigiKurang20; //X13 Kategori Umur 60 Tahun
        rowNew.getCell(25).value = data[i][0].jumlahSemuaGigi; //Y13 Kategori Umur 60 Tahun
      }
    }

    worksheet.name = 'PG214';

    const newfile = makeFile(payload, 'PG214');

    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 1 second
      console.log('deleting file');
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePG206 = async (payload) => {
  console.log('PG206');
  try {
    let { klinik, daerah, negeri, bulan, pegawai, username } = payload;
    //
    const data = await Helper.countPG206(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
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

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('V5').value = monthName;
    worksheet.getCell('Z5').value = yearNow;

    worksheet.getCell('B6').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B7').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B8').value = `${klinik.toUpperCase()}`;

    if (pegawai) {
      worksheet.getCell('B9').value = `${pegawai.toUpperCase()}`;
    }
    //
    // let j = 0;
    for (let i = 0; i < data[0].length; i++) {
      // j += 2;
      let row = worksheet.getRow(16 + i);
      if (data[0][i].queryPemeriksaan[0]) {
        // pemeriksaan
        row.getCell(2).value =
          data[0][i].queryPemeriksaan[0].kedatanganTahunSemasaBaru;
        row.getCell(4).value = data[0][i].queryPemeriksaan[0].jumlahd;
        row.getCell(5).value = data[0][i].queryPemeriksaan[0].jumlahf;
        row.getCell(6).value = data[0][i].queryPemeriksaan[0].jumlahx;
        row.getCell(7).value = data[0][i].queryPemeriksaan[0].jumlahdfx;
        if (i > 1) {
          row.getCell(8).value = data[0][i].queryPemeriksaan[0].jumlahD;
          row.getCell(9).value = data[0][i].queryPemeriksaan[0].jumlahM;
          row.getCell(10).value = data[0][i].queryPemeriksaan[0].jumlahF;
          row.getCell(11).value = data[0][i].queryPemeriksaan[0].jumlahX;
          row.getCell(12).value = data[0][i].queryPemeriksaan[0].jumlahDMFX;
        }
        row.getCell(13).value = data[0][i].queryPemeriksaan[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value =
            data[0][i].queryPemeriksaan[0].statusBebasKaries;
        }
        row.getCell(15).value = data[0][i].queryPemeriksaan[0].TPR;
        if (i > 1) {
          row.getCell(16).value = data[0][i].queryPemeriksaan[0].skorGISZero;
          row.getCell(17).value =
            data[0][i].queryPemeriksaan[0].skorGISMoreThanZero;
        }
        row.getCell(18).value =
          data[0][i].queryPemeriksaan[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value =
            data[0][i].queryPemeriksaan[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value =
            data[0][i].queryPemeriksaan[0].perluJumlahPesakitFS;
          row.getCell(22).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiFS;
        }
        row.getCell(23).value = data[0][i].queryPemeriksaan[0].perluPenskaleran;
      }
      if (i === 6) {
        i += 2;
      }
    }

    // j = 0;
    for (let i = 0; i < data[1].length; i++) {
      // j += 2;
      let row = worksheet.getRow(16 + i);
      if (data[1][i].queryRawatan[0]) {
        // rawatan
        row.getCell(3).value =
          data[1][i].queryRawatan[0].kedatanganTahunSemasaUlangan;
        row.getCell(24).value = data[1][i].queryRawatan[0].sapuanFluorida;
        if (i > 1) {
          row.getCell(25).value =
            data[1][i].queryRawatan[0].jumlahPesakitPrrJenis1;
          row.getCell(26).value =
            data[1][i].queryRawatan[0].jumlahGigiPrrJenis1;
          row.getCell(27).value =
            data[1][i].queryRawatan[0].jumlahPesakitDiBuatFs;
          row.getCell(28).value = data[1][i].queryRawatan[0].jumlahGigiDibuatFs;
        }
        row.getCell(29).value = data[1][i].queryRawatan[0].tampalanAntGdBaru;
        row.getCell(30).value = data[1][i].queryRawatan[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(31).value = data[1][i].queryRawatan[0].tampalanAntGkBaru;
          row.getCell(32).value =
            data[1][i].queryRawatan[0].tampalanAntGkSemula;
        }
        row.getCell(33).value = data[1][i].queryRawatan[0].tampalanPostGdBaru;
        row.getCell(34).value = data[1][i].queryRawatan[0].tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(35).value = data[1][i].queryRawatan[0].tampalanPostGkBaru;
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
        row.getCell(43).value = data[1][i].queryRawatan[0].tampalanSementara;
        row.getCell(44).value = data[1][i].queryRawatan[0].cabutanGd;
        if (i > 1) {
          row.getCell(45).value = data[1][i].queryRawatan[0].cabutanGk;
          row.getCell(46).value = data[1][i].queryRawatan[0].penskaleran;
        }
        row.getCell(47).value = data[1][i].queryRawatan[0].kesSelesai;
      }
      if (i === 6) {
        i += 2;
      }
    }

    // j = 0;
    for (let i = 0; i < data[2].length; i++) {
      // j += 2;
      let row = worksheet.getRow(16 + i);
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
          row.getCell(12).value += data[2][i].querySekolah[0].jumlahDMFX;
        }
        row.getCell(13).value += data[2][i].querySekolah[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value += data[2][i].querySekolah[0].statusBebasKaries;
        }
        row.getCell(15).value += data[2][i].querySekolah[0].TPR;
        if (i > 5) {
          row.getCell(16).value += data[2][i].querySekolah[0].skorBPEZero;
          row.getCell(17).value +=
            data[2][i].querySekolah[0].skorGISMoreThanZero;
        }
        row.getCell(18).value += data[2][i].querySekolah[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value +=
            data[2][i].querySekolah[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitFS;
          row.getCell(22).value += data[2][i].querySekolah[0].perluJumlahGigiFS;
        }
        row.getCell(23).value += data[2][i].querySekolah[0].perluPenskaleran;
        // rawatan
        row.getCell(3).value +=
          data[2][i].querySekolah[0].kedatanganTahunSemasaUlangan;
        row.getCell(24).value += data[2][i].querySekolah[0].sapuanFluorida;
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
        row.getCell(29).value += data[2][i].querySekolah[0].tampalanAntGdBaru;
        row.getCell(30).value += data[2][i].querySekolah[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(31).value += data[2][i].querySekolah[0].tampalanAntGkBaru;
          row.getCell(32).value =
            data[2][i].querySekolah[0].tampalanAntGkSemula;
        }
        row.getCell(33).value += data[2][i].querySekolah[0].tampalanPostGdBaru;
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
        row.getCell(43).value += data[2][i].querySekolah[0].tampalanSementara;
        row.getCell(44).value += data[2][i].querySekolah[0].cabutanGd;
        if (i > 1) {
          row.getCell(45).value += data[2][i].querySekolah[0].cabutanGk;
          row.getCell(46).value += data[2][i].querySekolah[0].penskaleran;
        }
        row.getCell(47).value += data[2][i].querySekolah[0].kesSelesai;
      }
      if (i === 6) {
        i += 2;
      }
    }

    worksheet.getCell(
      'AU5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AU6').value = `Maklumat dari ${moment(new Date()).format(
      'DD-MM-YYYY'
    )}`;
    worksheet.getCell(
      'AU7'
    ).value = `Peratus reten dilaporkan salah = dlm rest`;
    worksheet.getCell('AU8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG206';

    const newfile = makeFile(payload, 'PG206');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePG207 = async (payload) => {
  console.log('PG207');
  try {
    let { klinik, daerah, negeri, bulan, pegawai, username } = payload;
    //
    const data = await Helper.countPG207(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
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

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    worksheet.getCell('AO5').value = monthName;
    worksheet.getCell('AU5').value = yearNow;

    worksheet.getCell('B7').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B8').value = `${klinik.toUpperCase()}`;
    worksheet.getCell('B9').value = `${klinik.toUpperCase()}`;

    // if (pegawai) {
    //   let intro4 = worksheet.getRow(10);
    //   intro4.getCell(2).value = `${pegawai.toUpperCase()}`;
    // }
    //
    // let j = 0;
    for (let i = 0; i < data[0].length; i++) {
      // j += 2;
      let row = worksheet.getRow(16 + i);
      if (data[0][i].queryPemeriksaan[0]) {
        // pemeriksaan
        row.getCell(2).value =
          data[0][i].queryPemeriksaan[0].kedatanganTahunSemasaBaru;
        row.getCell(4).value = data[0][i].queryPemeriksaan[0].jumlahd;
        row.getCell(5).value = data[0][i].queryPemeriksaan[0].jumlahf;
        row.getCell(6).value = data[0][i].queryPemeriksaan[0].jumlahx;
        row.getCell(7).value = data[0][i].queryPemeriksaan[0].jumlahdfx;
        if (i > 1) {
          row.getCell(8).value = data[0][i].queryPemeriksaan[0].jumlahD;
          row.getCell(9).value = data[0][i].queryPemeriksaan[0].jumlahM;
          row.getCell(10).value = data[0][i].queryPemeriksaan[0].jumlahF;
          row.getCell(11).value = data[0][i].queryPemeriksaan[0].jumlahX;
          row.getCell(12).value = data[0][i].queryPemeriksaan[0].jumlahDMFX;
        }
        row.getCell(13).value = data[0][i].queryPemeriksaan[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value =
            data[0][i].queryPemeriksaan[0].statusBebasKaries;
        }
        row.getCell(15).value = data[0][i].queryPemeriksaan[0].TPR;
        if (i > 5) {
          row.getCell(16).value = data[0][i].queryPemeriksaan[0].skorBPEZero;
          row.getCell(17).value =
            data[0][i].queryPemeriksaan[0].skorBPEMoreThanZero;
        }
        row.getCell(18).value =
          data[0][i].queryPemeriksaan[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value =
            data[0][i].queryPemeriksaan[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value =
            data[0][i].queryPemeriksaan[0].perluJumlahPesakitFS;
          row.getCell(22).value =
            data[0][i].queryPemeriksaan[0].perluJumlahGigiFS;
        }
        row.getCell(23).value = data[0][i].queryPemeriksaan[0].perluPenskaleran;
        row.getCell(24).value =
          data[0][i].queryPemeriksaan[0].perluEndoAnterior;
        row.getCell(25).value =
          data[0][i].queryPemeriksaan[0].perluEndoPremolar;
        row.getCell(26).value = data[0][i].queryPemeriksaan[0].perluEndoMolar;
        if (i > 1) {
          row.getCell(27).value =
            data[0][i].queryPemeriksaan[0].jumlahPerluDenturPenuh;
          row.getCell(28).value =
            data[0][i].queryPemeriksaan[0].jumlahPerluDenturSepara;
        }
      }
      if (i === 11) {
        i += 2;
      }
    }

    // j = 0;
    for (let i = 0; i < data[1].length; i++) {
      // j += 2;
      let row = worksheet.getRow(16 + i);
      if (data[1][i].queryRawatan[0]) {
        // rawatan
        row.getCell(3).value =
          data[1][i].queryRawatan[0].kedatanganTahunSemasaUlangan;
        row.getCell(29).value = data[1][i].queryRawatan[0].sapuanFluorida;
        if (i > 1) {
          row.getCell(30).value =
            data[1][i].queryRawatan[0].jumlahPesakitPrrJenis1;
          row.getCell(31).value =
            data[1][i].queryRawatan[0].jumlahGigiPrrJenis1;
          row.getCell(32).value =
            data[1][i].queryRawatan[0].jumlahPesakitDiBuatFs;
          row.getCell(33).value = data[1][i].queryRawatan[0].jumlahGigiDibuatFs;
        }
        row.getCell(34).value = data[1][i].queryRawatan[0].tampalanAntGdBaru;
        row.getCell(35).value = data[1][i].queryRawatan[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(36).value = data[1][i].queryRawatan[0].tampalanAntGkBaru;
          row.getCell(37).value =
            data[1][i].queryRawatan[0].tampalanAntGkSemula;
        }
        row.getCell(38).value = data[1][i].queryRawatan[0].tampalanPostGdBaru;
        row.getCell(39).value = data[1][i].queryRawatan[0].tampalanPostGdSemula;
        if (i > 1) {
          row.getCell(40).value = data[1][i].queryRawatan[0].tampalanPostGkBaru;
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
          row.getCell(46).value = data[1][i].queryRawatan[0].inlayOnlayBaru;
          row.getCell(47).value = data[1][i].queryRawatan[0].inlayOnlaySemula;
        }
        // skipping cells
        row.getCell(50).value = data[1][i].queryRawatan[0].tampalanSementara;
        row.getCell(51).value = data[1][i].queryRawatan[0].cabutanGd;
        row.getCell(52).value = data[1][i].queryRawatan[0].cabutanGk;
        row.getCell(53).value =
          data[1][i].queryRawatan[0].komplikasiSelepasCabutan;
        row.getCell(54).value = data[1][i].queryRawatan[0].penskaleran;
        row.getCell(55).value = data[1][i].queryRawatan[0].rawatanPerioLain;
        row.getCell(56).value = data[1][i].queryRawatan[0].rawatanEndoAnterior;
        row.getCell(57).value = data[1][i].queryRawatan[0].rawatanEndoPremolar;
        row.getCell(58).value = data[1][i].queryRawatan[0].rawatanEndoMolar;
        row.getCell(59).value = data[1][i].queryRawatan[0].rawatanOrtho;
        row.getCell(60).value = data[1][i].queryRawatan[0].kesPerubatan;
        row.getCell(61).value = data[1][i].queryRawatan[0].abses;
        row.getCell(62).value = data[1][i].queryRawatan[0].kecederaanTulangMuka;
        row.getCell(63).value = data[1][i].queryRawatan[0].kecederaanGigi;
        row.getCell(64).value = data[1][i].queryRawatan[0].kecederaanTisuLembut;
        row.getCell(65).value = data[1][i].queryRawatan[0].cabutanSurgical;
        row.getCell(66).value = data[1][i].queryRawatan[0].pembedahanKecilMulut;
        row.getCell(67).value = data[1][i].queryRawatan[0].crownBridgeBaru;
        row.getCell(68).value = data[1][i].queryRawatan[0].crownBridgeSemula;
        row.getCell(69).value = data[1][i].queryRawatan[0].postCoreBaru;
        row.getCell(70).value = data[1][i].queryRawatan[0].postCoreSemula;
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
        row.getCell(77).value = data[1][i].queryRawatan[0].immediateDenture;
        row.getCell(78).value = data[1][i].queryRawatan[0].pembaikanDenture;
        row.getCell(79).value = data[1][i].queryRawatan[0].kesSelesai;
        row.getCell(80).value = data[1][i].queryRawatan[0].xrayDiambil;
        row.getCell(81).value = data[1][i].queryRawatan[0].pesakitDisaringOC;
      }
      if (i === 11) {
        i += 2;
      }
    }

    // j = 0;
    for (let i = 0; i < data[2].length; i++) {
      // j += 2;
      let row = worksheet.getRow(16 + i);
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
          row.getCell(12).value += data[2][i].querySekolah[0].jumlahDMFX;
        }
        row.getCell(13).value += data[2][i].querySekolah[0].jumlahMBK;
        if (i > 1) {
          row.getCell(14).value += data[2][i].querySekolah[0].statusBebasKaries;
        }
        row.getCell(15).value += data[2][i].querySekolah[0].TPR;
        if (i > 5) {
          row.getCell(16).value += data[2][i].querySekolah[0].skorBPEZero;
          row.getCell(17).value +=
            data[2][i].querySekolah[0].skorBPEMoreThanZero;
        }
        row.getCell(18).value += data[2][i].querySekolah[0].perluSapuanFluorida;
        if (i > 1) {
          row.getCell(19).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitPrrJenis1;
          row.getCell(20).value +=
            data[2][i].querySekolah[0].perluJumlahGigiPrrJenis1;
          row.getCell(21).value +=
            data[2][i].querySekolah[0].perluJumlahPesakitFS;
          row.getCell(22).value += data[2][i].querySekolah[0].perluJumlahGigiFS;
        }
        row.getCell(23).value += data[2][i].querySekolah[0].perluPenskaleran;
        row.getCell(24).value += data[2][i].querySekolah[0].perluEndoAnterior;
        row.getCell(25).value += data[2][i].querySekolah[0].perluEndoPremolar;
        row.getCell(26).value += data[2][i].querySekolah[0].perluEndoMolar;
        if (i > 1) {
          row.getCell(27).value +=
            data[2][i].querySekolah[0].jumlahPerluDenturPenuh;
          row.getCell(28).value +=
            data[2][i].querySekolah[0].jumlahPerluDenturSepara;
        }
        // rawatan
        row.getCell(3).value +=
          data[2][i].querySekolah[0].kedatanganTahunSemasaUlangan;
        row.getCell(29).value += data[2][i].querySekolah[0].sapuanFluorida;
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
        row.getCell(34).value += data[2][i].querySekolah[0].tampalanAntGdBaru;
        row.getCell(35).value += data[2][i].querySekolah[0].tampalanAntGdSemula;
        if (i > 1) {
          row.getCell(36).value += data[2][i].querySekolah[0].tampalanAntGkBaru;
          row.getCell(37).value =
            data[2][i].querySekolah[0].tampalanAntGkSemula;
        }
        row.getCell(38).value += data[2][i].querySekolah[0].tampalanPostGdBaru;
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
          row.getCell(46).value += data[2][i].querySekolah[0].inlayOnlayBaru;
          row.getCell(47).value += data[2][i].querySekolah[0].inlayOnlaySemula;
        }
        // skipping cells
        row.getCell(50).value += data[2][i].querySekolah[0].tampalanSementara;
        row.getCell(51).value += data[2][i].querySekolah[0].cabutanGd;
        row.getCell(52).value += data[2][i].querySekolah[0].cabutanGk;
        row.getCell(53).value +=
          data[2][i].querySekolah[0].komplikasiSelepasCabutan;
        row.getCell(54).value += data[2][i].querySekolah[0].penskaleran;
        row.getCell(55).value += data[2][i].querySekolah[0].rawatanPerioLain;
        row.getCell(56).value += data[2][i].querySekolah[0].rawatanEndoAnterior;
        row.getCell(57).value += data[2][i].querySekolah[0].rawatanEndoPremolar;
        row.getCell(58).value += data[2][i].querySekolah[0].rawatanEndoMolar;
        row.getCell(59).value += data[2][i].querySekolah[0].rawatanOrtho;
        row.getCell(60).value += data[2][i].querySekolah[0].kesPerubatan;
        row.getCell(61).value += data[2][i].querySekolah[0].abses;
        row.getCell(62).value +=
          data[2][i].querySekolah[0].kecederaanTulangMuka;
        row.getCell(63).value += data[2][i].querySekolah[0].kecederaanGigi;
        row.getCell(64).value +=
          data[2][i].querySekolah[0].kecederaanTisuLembut;
        row.getCell(65).value += data[2][i].querySekolah[0].cabutanSurgical;
        row.getCell(66).value +=
          data[2][i].querySekolah[0].pembedahanKecilMulut;
        row.getCell(67).value += data[2][i].querySekolah[0].crownBridgeBaru;
        row.getCell(68).value += data[2][i].querySekolah[0].crownBridgeSemula;
        row.getCell(69).value += data[2][i].querySekolah[0].postCoreBaru;
        row.getCell(70).value += data[2][i].querySekolah[0].postCoreSemula;
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
        row.getCell(77).value += data[2][i].querySekolah[0].immediateDenture;
        row.getCell(78).value += data[2][i].querySekolah[0].pembaikanDenture;
        row.getCell(79).value += data[2][i].querySekolah[0].kesSelesai;
        row.getCell(80).value += data[2][i].querySekolah[0].xrayDiambil;
        row.getCell(81).value += data[2][i].querySekolah[0].pesakitDisaringOC;
      }
      if (i === 11) {
        i += 2;
      }
    }

    worksheet.getCell(
      'AU5'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('CC6').value = `Maklumat dari ${moment(new Date()).format(
      'DD-MM-YYYY'
    )}`;
    worksheet.getCell(
      'CC7'
    ).value = `Peratus reten dilaporkan salah = dlm rest`;
    worksheet.getCell('CC8').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

    worksheet.name = 'PG207';

    const newfile = makeFile(payload, 'PG207');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePG201 = async (payload) => {
  console.log('PG201');
  try {
    const { kp, daerah, negeri, bulan, sekolah } = payload;
    //
    const data = await Helper.countPG201(kp, sekolah);
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
      'PG201.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG201');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let details = worksheet.getRow(5);
    details.getCell(
      2
    ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'PRIMER';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${kp.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri.toUpperCase()}`;
    //
    // let rowNamaKlinik = worksheet.getRow(7);
    // // let klinikFixed = results.dataPemeriksan[0].createdByKp;
    // // klinikFixed = klinikFixed
    // //   .toLowerCase()
    // //   .split(' ')
    // //   .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    // //   .join(' ');
    // rowNamaKlinik.getCell(9).value = 'Klinik Gigi';
    // rowNamaKlinik.commit();
    // // console.log('setting klinik name: ' + klinikFixed);
    // //
    // let rowNamaSekolah = worksheet.getRow(8);
    // let sekolahFixed = data.dataPemeriksaan[0]._id;
    // rowNamaSekolah.getCell(9).value = sekolahFixed;
    // sekolahFixed = sekolahFixed
    //   .toLowerCase()
    //   .split(' ')
    //   .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    //   .join(' ');
    // rowNamaSekolah.getCell(9).value = sekolahFixed;
    // rowNamaSekolah.commit();
    // console.log('setting sekolah name: ' + sekolahFixed);
    // //
    // let rowNamaJenis = worksheet.getRow(9);
    // rowNamaJenis.getCell(9).value = 'PBSR';
    // rowNamaJenis.commit();
    //
    for (let i = 0; i < data.dataPemeriksaan.length; i++) {
      let rowNew = worksheet.getRow(13 + i);
      if (data.dataPemeriksaan[i][0]) {
        //PG201
        // Reten Sekolah (Darjah 1)
        let rowNew = worksheet.getRow(17);
        rowNew.getCell(2).value =
          data.dataPemeriksaan[i].engganKedatanganPendaftaran; //Kedatangan enggan (Darjah 1)
        rowNew.getCell(3).value = data.dataPemeriksaan[i].kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 1)
        rowNew.getCell(4).value = data.dataPemeriksaan[i].enrolmen; //Kedatangan enrolmen (Darjah 1)
        rowNew.getCell(5).value = data.dataPemeriksaan[i].jumlahKedatanganBaru; //Kedatangan baru (Darjah 1)
        rowNew.getCell(6).value =
          data.dataPemeriksaan[i].jumlahKedatanganUlangan; //Kedatangan ulangan (Darjah 1)
        rowNew.getCell(8).value = data.dataPemeriksaan[i].skorPlakA; //Kebersihan Mulut Skor A (Darjah 1)
        rowNew.getCell(9).value = data.dataPemeriksaan[i].jumlahd; //Karies Gigi Desidus (d) (Darjah 1)
        rowNew.getCell(10).value = data.dataPemeriksaan[i].jumlahf; //Telah Ditampal Gigi Desidus (f) (Darjah 1)
        rowNew.getCell(11).value = data.dataPemeriksaan[i].jumlahx; //Gigi Desidus Perlu Ditampal (x) (Darjah 1)
        rowNew.getCell(13).value = data.dataPemeriksaan[i].jumlahE; //Karies Awal Gigi Kekal (E) (Darjah 1)
        rowNew.getCell(14).value = data.dataPemeriksaan[i].jumlahD; //Karies Gigi Kekal (D) (Darjah 1)
        rowNew.getCell(15).value = data.dataPemeriksaan[i].jumlahM; //Gigi Kekal Telah Dicabut (M) (Darjah 1)
        rowNew.getCell(16).value = data.dataPemeriksaan[i].jumlahF; //Gigi Kekal Telah Ditampal (F) (Darjah 1)
        rowNew.getCell(17).value = data.dataPemeriksaan[i].jumlahX; //Jumlah DMFX (Darjah 1)
        rowNew.getCell(19).value =
          data.dataPemeriksaan[i].gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 1)
        rowNew.getCell(20).value =
          data.dataPemeriksaan[i].totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = data.dataPemeriksaan[i].0  (Darjah 1)
        rowNew.getCell(21).value = data.dataPemeriksaan[i].eMoreThanZero; //E≥1 (ada karies awal) (Darjah 1)
        rowNew.getCell(22).value = data.dataPemeriksaan[i].jumlahMBK; //Mulut Bebas Karies (MBK) (Darjah 1)
        rowNew.getCell(23).value = data.dataPemeriksaan[i].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = data.dataPemeriksaan[i].0 (Darjah 1)
        rowNew.getCell(24).value =
          data.dataPemeriksaan[i].statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 1)
        rowNew.getCell(25).value = data.dataPemeriksaan[i].dfxEqualToZero; //dfx=0 (Darjah 1)
        rowNew.getCell(26).value = data.dataPemeriksaan[i].jumlahMBG; //Mulut Bebas Gingivitis (MBG) (Darjah 1)
        rowNew.getCell(27).value = data.dataPemeriksaan[i].jumlahTprICDAS; //TPR ICDAS (Darjah 1)
        rowNew.getCell(28).value =
          data.dataPemeriksaan[i].kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 1)
        rowNew.getCell(29).value = data.dataPemeriksaan[i].cleftAda; //cleft Ada (Darjah 1)
        rowNew.getCell(30).value = data.dataPemeriksaan[i].cleftRujuk; //cleft Rujuk (Darjah 1)
        rowNew.getCell(32).value = data.dataPemeriksaan[i].perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(33).value = data.dataPemeriksaan[i].perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(34).value = data.dataPemeriksaan[i].perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 1)
        rowNew.getCell(35).value = data.dataPemeriksaan[i].perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(36).value = data.dataPemeriksaan[i].perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(37).value = data.dataPemeriksaan[i].perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(38).value = data.dataPemeriksaan[i].perluPRR1GigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(39).value = data.dataPemeriksaan[i].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(40).value = data.dataPemeriksaan[i].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(41).value = data.dataPemeriksaan[i].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(42).value = data.dataPemeriksaan[i].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(43).value = data.dataPemeriksaan[i].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(44).value = data.dataPemeriksaan[i].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(46).value = data.dataRawatan[i].BARU_MuridBuatFs; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(47).value = data.dataRawatan[i].BARU_GgKekalBuatFs; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(48).value = data.dataRawatan[i].BARU_MuridBuatFv; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(49).value = data.dataRawatan[i].BARU_GgKekalBuatFv; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(50).value = data.dataRawatan[i].BARU_MuridBuatPRR1; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(51).value = data.dataRawatan[i].BARU_GgKekalBuatPRR1; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(52).value =
          data.dataRawatan[i].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(53).value =
          data.dataRawatan[i].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(54).value =
          data.dataRawatan[i].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(55).value =
          data.dataRawatan[i].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(56).value =
          data.dataRawatan[i].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(57).value =
          data.dataRawatan[i].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(59).value = data.dataRawatan[i].cabutDesidus; // Gigi Desidus Dicabut (Darjah 1)
        rowNew.getCell(60).value = data.dataRawatan[i].cabutKekal; // Gigi Kekal Dicabut (Darjah 1)
        rowNew.getCell(61).value = data.dataRawatan[i].penskaleran; // Penskelaran (Darjah 1)
        rowNew.getCell(62).value = data.dataRawatan[i].caseCompletedICDAS; // Kes Selesai ICDAS (Darjah 1)
        rowNew.getCell(63).value = data.dataPemeriksaan[i].skorGIS0; // GIS SKOR 0 (Darjah 1)
        rowNew.getCell(64).value = data.dataPemeriksaan[i].skorGIS1; // GIS SKOR 1 (Darjah 1)
        rowNew.getCell(65).value = data.dataPemeriksaan[i].skorGIS2; // GIS SKOR 2 (Darjah 1)
        rowNew.getCell(66).value = data.dataPemeriksaan[i].skorGIS3; // GIS SKOR 3 (Darjah 1)
        rowNew.getCell(68).value = data.dataPemeriksaan[i].toothSurfaceLoss; // Trauma Tooth Surface Loss (Darjah 1)
        rowNew.getCell(69).value = data.dataPemeriksaan[i].traumaTisuLembut; // Trauma Tisu Lembut (Darjah 1)
        rowNew.getCell(70).value = data.dataPemeriksaan[i].traumaTisuKeras; // Trauma Tisu Keras (Darjah 1)
        rowNew.getCell(72).value =
          data.dataPemeriksaan[i].pesakitAdaFullDentureAtas; // Pesakit Ada Full Denture Atas(Darjah 1)
        rowNew.getCell(73).value =
          data.dataPemeriksaan[i].pesakitAdaPartialDentureAtas; // Pesakit Ada Partial Denture Atas (Darjah 1)
        rowNew.getCell(74).value =
          data.dataPemeriksaan[i].pesakitPerluFullDentureAtas; // Pesakit Perlu Full Denture Atas (Darjah 1)
        rowNew.getCell(75).value =
          data.dataPemeriksaan[i].pesakitPerluPartialDentureAtas; // Pesakit Perlu Partial Denture Atas (Darjah 1)
        rowNew.commit();
        console.log('setting row2');
        let rowNew2 = worksheet.getRow(18);
        rowNew2.getCell(8).value = data.dataPemeriksaan[i].skorPlakC; //Kebersihan Mulut Skor C (Darjah 1)
        rowNew2.commit();
        console.log('setting row3');
        let rowNew3 = worksheet.getRow(19);
        rowNew3.getCell(8).value = data.dataPemeriksaan[i].skorPlakE; //Kebersihan Mulut Skor E (Darjah 1)
        rowNew3.getCell(33).value = data.dataPemeriksaan[i].perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 1)
        rowNew3.getCell(35).value = data.dataPemeriksaan[i].perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(36).value = data.dataPemeriksaan[i].perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(37).value = data.dataPemeriksaan[i].perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(38).value = data.dataPemeriksaan[i].perluPRR1GigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(39).value = data.dataPemeriksaan[i].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(40).value = data.dataPemeriksaan[i].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(41).value = data.dataPemeriksaan[i].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(42).value = data.dataPemeriksaan[i].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(43).value = data.dataPemeriksaan[i].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(44).value = data.dataPemeriksaan[i].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(46).value = data.dataRawatan[i].SEMULA_MuridBuatFs; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(47).value = data.dataRawatan[i].SEMULA_GgKekalBuatFs; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(48).value = data.dataRawatan[i].SEMULA_MuridBuatFv; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(49).value = data.dataRawatan[i].SEMULA_GgKekalBuatFv; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(50).value = data.dataRawatan[i].SEMULA_MuridBuatPRR1; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(51).value = data.dataRawatan[i].SEMULA_GgKekalBuatPRR1; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(52).value =
          data.dataRawatan[i].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(53).value =
          data.dataRawatan[i].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(54).value =
          data.dataRawatan[i].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(55).value =
          data.dataRawatan[i].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(56).value =
          data.dataRawatan[i].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(57).value =
          data.dataRawatan[i].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(72).value =
          data.dataPemeriksaan[i].pesakitAdaFullDentureBawah; // Pesakit Ada Full Denture Bawah (Darjah 1)
        rowNew3.getCell(73).value =
          data.dataPemeriksaan[i].pesakitAdaPartialDentureBawah; // Pesakit Ada Partial Denture Bawah (Darjah 1)
        rowNew3.getCell(74).value =
          data.dataPemeriksaan[i].pesakitPerluFullDentureBawah; // Pesakit Perlu Full Denture Bawah (Darjah 1)
        rowNew3.getCell(75).value =
          data.dataPemeriksaan[i].pesakitPerluPartialDentureBawah; // Pesakit Perlu Partial Denture Bawah (Darjah 1)
        rowNew3.commit();
        console.log('setting row4');
        let rowIdnt = worksheet.getRow(47);
        rowIdnt.getCell(1).value = 'Compiled by Gi-Ret';
        console.log('done setting data');
      }
    }

    let newfile = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'test-' + kp + '-PG201.xlsx'
    );

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePGS203 = async (payload) => {
  console.log('PGS203');
  try {
    // const { kp, sekolah } = payload;
    let sekolah = 'Sekolah';
    let klinik = 'Klinik Pergigian Kaki Bukit';
    let bulan = '2022-12-01';
    let bulan2 = '2022-11-01';
    let daerah = 'ARAU';
    let negeri = 'PERLIS';
    //
    const data = await Helper.countPGS203(klinik, bulan, sekolah);
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
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PGS203');

    const monthName = moment(new Date()).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let details = worksheet.getRow(5);
    details.getCell(
      2
    ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'PRIMER';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${daerah.toUpperCase()}`;

    // let intro4 = worksheet.getRow(9);
    // intro4.getCell(2).value = `${negeri.toUpperCase()}`;
    //
    // let rowNamaKlinik = worksheet.getRow(7);
    // // let klinikFixed = results.dataPemeriksan[0].createdByKp;
    // // klinikFixed = klinikFixed
    // //   .toLowerCase()
    // //   .split(' ')
    // //   .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    // //   .join(' ');
    // rowNamaKlinik.getCell(9).value = 'Klinik Gigi';
    // rowNamaKlinik.commit();
    // // console.log('setting klinik name: ' + klinikFixed);
    // //
    // let rowNamaSekolah = worksheet.getRow(8);
    // let sekolahFixed = data.dataPemeriksaan[0]._id;
    // rowNamaSekolah.getCell(9).value = sekolahFixed;
    // sekolahFixed = sekolahFixed
    //   .toLowerCase()
    //   .split(' ')
    //   .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    //   .join(' ');
    // rowNamaSekolah.getCell(9).value = sekolahFixed;
    // rowNamaSekolah.commit();
    // console.log('setting sekolah name: ' + sekolahFixed);
    // //
    // let rowNamaJenis = worksheet.getRow(9);
    // rowNamaJenis.getCell(9).value = 'PBSR';
    // rowNamaJenis.commit();
    //
    for (let i = 0; i < data.dataPemeriksaan.length; i++) {
      let rowNew = worksheet.getRow(20 + i);
      if (data.dataPemeriksaan[i][0]) {
        // let rowNew = worksheet.getRow(20);
        rowNew.getCell(3).value =
          data.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(4).value =
          data.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(5).value = data.dataPemeriksaan[0].jumlahd; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(6).value = data.dataPemeriksaan[0].jumlahf; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(7).value = data.dataPemeriksaan[0].jumlahx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(10).value = data.dataPemeriksaan[0].jumlahD; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(11).value = data.dataPemeriksaan[0].jumlahM; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(12).value = data.dataPemeriksaan[0].jumlahF; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(13).value = data.dataPemeriksaan[0].jumlahX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(16).value = data.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(17).value = data.dataPemeriksaan[0].dfxEqualToZero; //dfx = data.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(18).value = data.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = data.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(19).value =
          data.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //X + M = data.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(20).value =
          data.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(21).value =
          data.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(22).value = data.dataPemeriksaan[0].eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(23).value =
          data.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(24).value =
          data.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(25).value = data.dataPemeriksaan[0].tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(26).value = data.dataPemeriksaan[0].skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(27).value = data.dataPemeriksaan[0].skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(28).value = data.dataPemeriksaan[0].skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(29).value = data.dataPemeriksaan[0].skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew.getCell(30).value = data.dataPemeriksaan[0].perluFvMuridB; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew.getCell(31).value = data.dataPemeriksaan[0].perluPRR1MuridB; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew.getCell(32).value = data.dataPemeriksaan[0].perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(33).value = data.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(34).value = data.dataPemeriksaan[0].perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(35).value = data.dataPemeriksaan[0].perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(36).value = data.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(37).value = data.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(38).value = data.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(39).value = data.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(40).value = data.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(41).value = data.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(42).value = data.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(43).value = data.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(44).value = data.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(45).value = data.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(46).value = data.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(47).value = data.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // campur Baru semua
        rowNew.getCell(50).value = data.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(51).value = data.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // campur baru semula 2 atas ni
        rowNew.getCell(52).value = data.dataRawatan[0].BARU_MuridBuatFs; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(53).value = data.dataRawatan[0].SEMULA_MuridBuatFs; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(54).value = data.dataRawatan[0].BARU_GgKekalBuatFs; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(55).value = data.dataRawatan[0].SEMULA_GgKekalBuatFs; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(56).value =
          data.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(57).value =
          data.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(58).value =
          data.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(59).value =
          data.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(60).value =
          data.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(61).value =
          data.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(62).value =
          data.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(63).value =
          data.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(64).value =
          data.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(65).value =
          data.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(66).value =
          data.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(67).value =
          data.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(70).value = data.dataRawatan[0].cabutDesidus; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(71).value = data.dataRawatan[0].cabutKekal; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew.getCell(73).value = data.dataRawatan[0].penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // ni case completed
        rowNew.getCell(74).value = data.dataRawatan[0].caseCompletedICDAS; //Kes Selesai Klinik atau Pusat Pergigian Sekolah (Tahun 1)a
        // ni case completed
        console.log('setting row4');
        let rowIdnt = worksheet.getRow(47);
        rowIdnt.getCell(1).value = 'Compiled by Gi-Ret';
        console.log('done setting data');
      }
    }

    let newfile = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'test-' + klinik + '-PGS203.xlsx'
    );

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
  }
};
const makePGPR201 = async (payload) => {
  //Formula and excel baru lagi..(dapat dari Dr. Adib 22-01-2023)
  console.log('PGPR201Baru');
  try {
    const { klinik, daerah, negeri, bulan } = payload;
    //
    console.log('Cuba Uji Test');
    const data = await Helper.countPGPR201Baru(payload);
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
      'PGPR201Baru.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PGPR201Baru');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let details = worksheet.getRow(6);
    details.getCell(4).value = `${monthName.toUpperCase()}`;
    details.getCell(7).value = `${yearNow}`;

    let intro1 = worksheet.getRow(8);
    intro1.getCell(3).value = `${negeri.toUpperCase()}`;

    let intro2 = worksheet.getRow(9);
    intro2.getCell(3).value = `${daerah.toUpperCase()}`;

    let intro3 = worksheet.getRow(10);
    intro3.getCell(3).value = `${klinik.toUpperCase()}`;

    let j = 0;
    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(17 + j);
      j++;
      if (data[i][0]) {
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

    let rowIdnt = worksheet.getRow(33);
    rowIdnt.getCell(1).value = 'Compiled by Gi-Ret';

    let newfile = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'test-' + klinik + '-PGPR201Baru.xlsx'
    );

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
  }
};

// new
const makePgPro01 = async (payload) => {
  console.log('makePgPro01');
  try {
    const { pegawai, klinik, daerah, negeri, bulan } = payload;
    //
    const data = await Helper.countPGPro01(payload);
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
      'PGPRO01_KP_FULL.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('KLINIK_PGPRO01 BARU_FFR_Penuh');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    // let details = worksheet.getRow(6);
    // details.getCell(
    //   2
    // ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    // let intro1 = worksheet.getRow(7);
    // intro1.getCell(2).value = `${klinik.toUpperCase()}`;

    // let intro2 = worksheet.getRow(8);
    // intro2.getCell(2).value = `${daerah.toUpperCase()}`;

    // let intro3 = worksheet.getRow(9);
    // intro3.getCell(2).value = `${negeri.toUpperCase()}`;

    // if (pegawai) {
    //   let intro4 = worksheet.getRow(10);
    //   intro4.getCell(2).value = `${pegawai.toUpperCase()}`;
    // }
    //
    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(16 + i);
      if (data[i]) {
        rowNew.getCell(5).value = data[i].jumlahAktivitiCeramahBaru; //C15
        rowNew.getCell(6).value = data[i].jumlahPesertaCeramahBaru; //D15
        rowNew.getCell(7).value = data[i].jumlahAktivitiCeramahUlangan; //E15
        rowNew.getCell(8).value = data[i].jumlahPesertaCeramahUlangan; //F15
        rowNew.getCell(9).value = data[i].jumlahAktivitiBaruLMG; //G15
        rowNew.getCell(10).value = data[i].jumlahPesertaBaruLMG; //H15
        rowNew.getCell(11).value = data[i].jumlahAktivitiUlanganLMG; //I15
        rowNew.getCell(12).value = data[i].jumlahPesertaUlanganLMG; //J15
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
        rowNew.getCell(51).value = data[i].jumlahAktivitiTelevisyen; //AY15
        rowNew.getCell(52).value = data[i].jumlahPesertaTelevisyen; //AZ15
        rowNew.getCell(53).value = data[i].jumlahAktivitiRadio; //BA15
        rowNew.getCell(54).value = data[i].jumlahPesertaRadio; //BB15
        rowNew.getCell(55).value = data[i].jumlahAktivitiCetak; //BC15
      }
    }

    console.log(data);

    const newfile = makeFile(payload, 'PGPRO01');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 30000);
    // read file
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makeGender = async (payload) => {
  console.log('makeGender');
  try {
    const { pegawai, klinik, daerah, negeri, bulan, username } = payload;
    //
    const data = await Helper.countGender(payload);
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
    let worksheet = workbook.getWorksheet('GENDER');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let intro1 = worksheet.getCell('B3');
    intro1.value = `${negeri.toUpperCase()}`;

    let intro2 = worksheet.getCell('B4');
    intro2.value = yearNow;

    let rowNumber;
    let cellNumber;

    rowNumber = 9;
    cellNumber = 3;

    for (let i = 0; i < data[0].dataLelaki.length; i++) {
      if (data[0].dataLelaki[i][0]) {
        console.log(`writing ${rowNumber} & ${cellNumber} lelaki`);
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].dataLelaki[i][0].pesakitLelakiBaru;
        rowNumber++;
        console.log(`writing ${rowNumber} & ${cellNumber} lelaki`);
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].dataLelaki[i][0].pesakitLelakiUlangan;
        rowNumber--;
      }
      cellNumber += 5;
    }

    rowNumber = 9;
    cellNumber = 4;

    for (let i = 0; i < data[1].dataPerempuan.length; i++) {
      if (data[1].dataPerempuan[i][0]) {
        console.log(`writing ${rowNumber} & ${cellNumber} perempuan`);
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].dataPerempuan[i][0].pesakitPerempuanBaru;
        rowNumber++;
        console.log(`writing ${rowNumber} & ${cellNumber} perempuan`);
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].dataPerempuan[i][0].pesakitPerempuanUlangan;
        rowNumber--;
      }
      cellNumber += 5;
    }

    // info
    let rowTambahan = 1;
    let rowNew;
    rowNew = worksheet.getRow(16);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Gi-Ret 2.0';
    rowTambahan++;
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = process.env.npm_package_version;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Memaparkan maklumat dari';
    rowTambahan++;
    rowNew = worksheet.getRow(16 + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = `${moment(new Date())
      .startOf('month')
      .format('DD-MM-YYYY')} - ${moment(new Date()).format('DD-MM-YYYY')}`;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Tarikh dan masa penjanaan';
    rowTambahan++;
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = `${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')}`;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Peratus reten dilaporkan salah';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).font = {
    //     color: { argb: 'FF0000' },
    //    };
    rowNew.getCell(1).value = 'TIDAK BERKENAAN';
    //
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Dijana oleh';
    rowTambahan++;
    console.log(rowTambahan);
    rowNew = worksheet.getRow(16 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).font = {
      color: { argb: 'FF0000' },
    };
    rowNew.getCell(1).value = username;

    worksheet.name = 'GENDER';

    const newfile = makeFile(payload, 'GENDER');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 100000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makeMasa = async (payload) => {
  console.log('makeMasa');
  try {
    let { klinik, daerah, negeri, bulan, pegawai, username } = payload;
    //
    const data = await Helper.countMasa(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(__dirname, '..', 'public', 'exports', 'MASA.xlsx');
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    // get first worksheet
    let worksheet = workbook.getWorksheet('LAMPIRAN 2 - MAKLUMAT TAMBAHAN');
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

    let cellNumber = 2;

    for (let j = 0; j < data[0].opData.length; j++) {
      if (data[0].opData[j][0]) {
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[0].opData[j][0].total;
        console.log(`index number: ${j}, ${data[0].opData[j][0].total}`);
        cellNumber = cellNumber + 3;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[0].opData[j][0].jumlahOpYangDipanggilSebelum30Minit;
        console.log(
          `index number: ${j}, ${data[0].opData[j][0].jumlahOpYangDipanggilSebelum30Minit}`
        );
      }
      if (j === 5) {
        j += 2;
      }
      cellNumber = 2;
    }

    cellNumber = 3;

    for (let j = 0; j < data[1].temujanjiData.length; j++) {
      if (data[1].temujanjiData[j][0]) {
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[1].temujanjiData[j][0].total;
        cellNumber = cellNumber + 3;
        worksheet.getRow(j + 15).getCell(cellNumber).value =
          data[1].temujanjiData[j][0].jumlahOpYangDipanggilSebelum30Minit;
      }
      if (j === 5) {
        j += 2;
      }
      cellNumber = 3;
    }

    // info
    let rowTambahan = 1;
    let rowNew;
    rowNew = worksheet.getRow(34);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Gi-Ret 2.0';
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = process.env.npm_package_version;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Memaparkan maklumat dari';
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = `${moment(new Date())
      .startOf('month')
      .format('DD-MM-YYYY')} - ${moment(new Date()).format('DD-MM-YYYY')}`;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Tarikh dan masa penjanaan';
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = `${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')}`;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Peratus reten dilaporkan salah';
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).font = {
    //     color: { argb: 'FF0000' },
    //    };
    rowNew.getCell(1).value = 'TIDAK BERKENAAN';
    //
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Dijana oleh';
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).font = {
      color: { argb: 'FF0000' },
    };
    rowNew.getCell(1).value = username;

    const newfile = makeFile(payload, 'MASA');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makeBp = async (payload) => {
  console.log('Reten BP');
  try {
    let { klinik, daerah, negeri, bulan, pegawai, username } = payload;
    //
    const data = await Helper.countBp(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
      klinik = currentKlinik.kp;
    }
    //
    let filename = path.join(__dirname, '..', 'public', 'exports', 'BP.xlsx');
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    // get first worksheet
    let worksheet = workbook.getWorksheet('Bulan');
    // write bulan
    let intro1 = worksheet.getCell('F3');
    intro1.value = moment(bulan).format('MMMM');
    // write year
    let intro2 = worksheet.getCell('I3');
    intro2.value = moment(bulan).format('YYYY');
    // write facility
    let intro3 = worksheet.getCell('B4');
    intro3.value = `${klinik.toUpperCase()}`;
    // write daerah
    let intro4 = worksheet.getCell('B5');
    intro4.value = `${daerah.toUpperCase()}`;
    // write negeri
    let intro5 = worksheet.getCell('B6');
    intro5.value = `${negeri.toUpperCase()}`;
    // end intro

    // write data
    let rowNumber = 11;
    let cellNumber = 3;

    for (let j = 0; j < data[0].melayu.length; j++) {
      console.log(`index number ${j}`, data[0].melayu[j][0]);
      if (data[0].melayu[j][0]) {
        //
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[j][0].total;
        console.log('total', data[0].melayu[j][0].total);
        console.log('writing', rowNumber, cellNumber);
        //
        cellNumber = cellNumber + 3;
        //
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[j][0].adaSejarahDarahTinggi;
        console.log('hpt', data[0].melayu[j][0].adaSejarahDarahTinggi);
        console.log('writing', rowNumber, cellNumber);
        //
        cellNumber++;
        //
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[j][0].tiadaSejarahDarahTinggi;
        console.log('no hpt', data[0].melayu[j][0].tiadaSejarahDarahTinggi);
        console.log('writing', rowNumber, cellNumber);
        //
        cellNumber = 13;
        //
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[0].melayu[j][0].jumlahDirujukKeKk;
        console.log('rujuk', data[0].melayu[j][0].jumlahDirujukKeKk);
        console.log('writing', rowNumber, cellNumber) +
          worksheet.getRow(rowNumber).getCell(cellNumber).value;
      }
      rowNumber++;
      if (j < 5) {
        cellNumber = 3;
      }
      if (j >= 4) {
        cellNumber = 4;
      }
      if (j === 4) {
        rowNumber = 11;
      }
    }
    rowNumber = 17;
    cellNumber = 3;
    for (let j = 0; j < data[1].cina.length; j++) {
      if (data[1].cina[j][0]) {
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[j][0].total;
        cellNumber = cellNumber + 3;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[1].cina[j][0].jumlahDirujukKeKk +
          worksheet.getRow(rowNumber).getCell(cellNumber).value;
      }
      rowNumber++;
      if (j < 5) {
        cellNumber = 3;
      }
      if (j >= 4) {
        cellNumber = 4;
      }
      if (j === 4) {
        rowNumber = 17;
      }
    }
    cellNumber = 3;
    rowNumber = 23;
    for (let j = 0; j < data[2].india.length; j++) {
      if (data[2].india[j][0]) {
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[j][0].total;
        cellNumber = cellNumber + 3;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[2].india[j][0].jumlahDirujukKeKk +
          worksheet.getRow(rowNumber).getCell(cellNumber).value;
      }
      rowNumber++;
      if (j < 5) {
        cellNumber = 3;
      }
      if (j >= 4) {
        cellNumber = 4;
      }
      if (j === 4) {
        rowNumber = 23;
      }
    }
    cellNumber = 3;
    rowNumber = 29;
    for (let j = 0; j < data[3].dayak.length; j++) {
      if (data[3].dayak[j][0]) {
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].dayak[j][0].total;
        cellNumber = cellNumber + 3;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].dayak[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].dayak[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[3].dayak[j][0].jumlahDirujukKeKk +
          worksheet.getRow(rowNumber).getCell(cellNumber).value;
      }
      rowNumber++;
      if (j < 5) {
        cellNumber = 3;
      }
      if (j >= 4) {
        cellNumber = 4;
      }
      if (j === 4) {
        rowNumber = 29;
      }
    }
    cellNumber = 3;
    rowNumber = 35;
    for (let j = 0; j < data[4].lain2.length; j++) {
      if (data[4].lain2[j][0]) {
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].lain2[j][0].total;
        cellNumber = cellNumber + 3;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].lain2[j][0].adaSejarahDarahTinggi;
        cellNumber++;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].lain2[j][0].tiadaSejarahDarahTinggi;
        cellNumber = 13;
        worksheet.getRow(rowNumber).getCell(cellNumber).value =
          data[4].lain2[j][0].jumlahDirujukKeKk +
          worksheet.getRow(rowNumber).getCell(cellNumber).value;
      }
      rowNumber++;
      if (j < 5) {
        cellNumber = 3;
      }
      if (j >= 4) {
        cellNumber = 4;
      }
      if (j === 4) {
        rowNumber = 35;
      }
    }

    // info
    let rowTambahan = 1;
    let rowNew;
    rowNew = worksheet.getRow(43);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Gi-Ret 2.0';
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = process.env.npm_package_version;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Memaparkan maklumat dari';
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    // worksheet.mergeCells(
    //   `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    // );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = `${moment(new Date())
      .startOf('month')
      .format('DD-MM-YYYY')} - ${moment(new Date()).format('DD-MM-YYYY')}`;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Tarikh dan masa penjanaan';
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = `${moment(new Date()).format(
      'DD-MM-YYYY'
    )} - ${moment(new Date()).format('HH:mm:ss')}`;
    //
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Peratus reten dilaporkan salah';
    rowTambahan++;
    rowNew = worksheet.getRow(34 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    // rowNew.getCell(1).font = {
    //     color: { argb: 'FF0000' },
    //    };
    rowNew.getCell(1).value = 'TIDAK BERKENAAN';
    //
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).value = 'Dijana oleh';
    rowTambahan++;
    rowNew = worksheet.getRow(43 + rowTambahan);
    worksheet.mergeCells(
      `${rowNew.getCell(1).address}:${rowNew.getCell(4).address}}`
    );
    rowNew.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    rowNew.getCell(1).font = {
      color: { argb: 'FF0000' },
    };
    rowNew.getCell(1).value = username;

    worksheet.name = moment(bulan).format('MMMM');

    const newfile = makeFile(payload, 'BP');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 1000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makeBPE = async (payload) => {
  console.log('Reten BPE');
  try {
    let { klinik, daerah, negeri, bulan, pegawai, username } = payload;
    //
    const data = await Helper.countBPE(payload);
    //
    if (data.length === 0) {
      return 'No data found';
    }
    //
    if (klinik !== 'all') {
      const currentKlinik = await User.findOne({ kodFasiliti: klinik });
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

    for (let i = 0; i < data.length; i++) {
      let row = worksheet.getRow(19 + i);
      if (data[i][0]) {
        row.getCell(4).value =
          i % 2 == 0
            ? data[i][0].kedatanganTahunSemasaBaru
            : data[i][0].kedatanganTahunSemasaUlangan; // leong, since match kita odd numbers adalah baru, dan even adalah ulangan, jd aku ckp ngn dia, kalau i/2 xde remainder, dia baru, kalau ada remainder dia ulangan
        row.getCell(5).value = data[i][0].adaRujukanT2DMdariKK; //Column E (5)
        row.getCell(6).value = data[i][0].adaRujukanT2DMdariLainLain; //Column F (6)
        row.getCell(7).value = data[i][0].tiadaRujukanT2DM; //Column G (7)
        row.getCell(8).value = data[i][0].risikoBpeDiabetes; //Column H (8)
        row.getCell(9).value = data[i][0].risikoBpePerokok; //Column I (9)
        row.getCell(10).value = data[i][0].risikoBpeLainLain; //Column J (10)
        row.getCell(11).value = data[i][0].engganBPE; //Column K (11)
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
        row.getCell(25).value = data[i][0].telahPengilapanTampalanRungkup; //Column Y (25)
        row.getCell(26).value = data[i][0].telahAdjustasiOklusi; //Column Z (26)
        row.getCell(27).value = data[i][0].telahCabutGigiPerio; //Column AA (27)
        row.getCell(28).value = data[i][0].telahExtirpasiPulpaSebabPerio; //Column AB (28)
        row.getCell(29).value = data[i][0].telahRawatanPerioLain; //Column AC (29)
        row.getCell(30).value = data[i][0].telahRujukPakarPerio; //Column AD (30)
        row.getCell(31).value = data[i][0].engganRujukPakarPerio; //Column AE (31)
        row.getCell(32).value = data[i][0].engganRujukPakarPerio; //Column AF (32)
        row.getCell(33).value = data[i][0].rujukanKeKlinikSCD; //Column AG (33)
        row.getCell(34).value = data[i][0].rujukanKeKlinikUPPKA; //Column AH (34)
        row.getCell(35).value = data[i][0].kesSelesaiPerio; //Column AI (35)
      }
    }

    worksheet.getCell(
      'AI3'
    ).value = `Gi-Ret 2.0 (${process.env.npm_package_version})`;
    worksheet.getCell('AI4').value = `Maklumat dari ${moment(new Date()).format(
      'DD-MM-YYYY'
    )}`;
    worksheet.getCell(
      'AI5'
    ).value = `Peratus reten dilaporkan salah = dlm rest`;
    worksheet.getCell('AI6').value = `Dijana oleh: ${username} (${moment(
      new Date()
    ).format('DD-MM-YYYY')} - ${moment(new Date()).format('HH:mm:ss')})`;

    const newfile = makeFile(payload, 'BPE Reten');

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile);
      console.log('deleting file');
    }, 1000);
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    return file;
  } catch (err) {
    console.log(err);
  }
};

// debug
exports.debug = async (req, res) => {
  let payload = {
    negeri: 'Johor',
    // daerah: 'Arau',
    daerah: 'all',
    // klinik: 'Klinik Pergigian Kaki Bukit',
    klinik: 'R01-002-02',
    bulan: '2023-01-01',
  };
  const data = await makePgPro01(payload);
  // const data = await makePG214(payload);
  // const data = await makePGPR201(klinik);
  // const data = await makePGS203(klinik, bulan, sekolah);
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.status(200).send(data);
};

// helper
const makeFile = (payload, reten) => {
  // const { pegawai, klinik, daerah, negeri } = payload;
  // if (pegawai) {
  //   return fileName(pegawai, reten);
  // }
  // if (daerah !== 'all' && klinik !== 'all') {
  //   return fileName(klinik, reten);
  // }
  // if (daerah !== 'all' && klinik === 'all') {
  //   return fileName(daerah, reten);
  // }
  // if (daerah === 'all') {
  //   return fileName(negeri, reten);
  // }
  return fileName(generateRandomString(20), reten);
};

const fileName = (params, reten) => {
  return path.join(
    __dirname,
    '..',
    'public',
    'exports',
    // `test-${params}-${reten}.xlsx`
    `${params}.xlsx`
  );
};

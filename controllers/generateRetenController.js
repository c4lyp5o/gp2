'use strict';
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Excel = require('exceljs');
const jwt = require('jsonwebtoken');
const Umum = require('../models/Umum');
const logger = require('../logs/logger');

// helper
const Helper = require('../controllers/countHelper');

// gateway
exports.downloader = async function (req, res) {
  const { authorization } = req.headers;
  //
  let currentKp, currentDaerah, currentNegeri, username;
  if (!authorization) {
    console.log('no authorization');
    // kp = klinikid;
    // daerah = klinikdaerah;
    // negeri = kliniknegeri;
  }
  if (authorization) {
    const token = authorization.split(' ')[1];
    currentKp = jwt.verify(token, process.env.JWT_SECRET).kp;
    currentDaerah = jwt.verify(token, process.env.JWT_SECRET).daerah;
    currentNegeri = jwt.verify(token, process.env.JWT_SECRET).negeri;
    username = jwt.verify(token, process.env.JWT_SECRET).username;
  }
  // check query
  let {
    jenisReten,
    negeri,
    daerah,
    klinik,
    pegawai,
    tarikhMula,
    tarikhAkhir,
    bulan,
    id,
    formatFile,
  } = req.query;
  // if kaunter user
  if (!klinik) {
    klinik = currentKp;
    daerah = currentDaerah;
    negeri = currentNegeri;
  }
  const payload = {
    klinik,
    daerah,
    negeri,
    username,
    formatFile,
    tarikhMula,
    tarikhAkhir,
    bulan,
    username,
    pegawai,
    id,
  };
  logger.info(`${req.method} ${req.url} ${klinik} Requesting ${jenisReten}`);
  switch (jenisReten) {
    case 'PG101A':
      const data101A = await makePG101A(payload);
      if (data101A === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data101A);
          break;
        case 'pdf':
          let excel101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + klinik + '-PG101.xlsx'
          );
          let pdf101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + klinik + '-PG101.pdf'
          );
          convertToPdf(excel101, pdf101);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf101));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG101C':
      const data101C = await makePG101C(payload);
      if (data101C === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data101C);
          break;
        case 'pdf':
          let excel101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + klinik + '-PG101.xlsx'
          );
          let pdf101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + klinik + '-PG101.pdf'
          );
          convertToPdf(excel101, pdf101);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf101));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG211A':
      const data211A = await makePG211A(payload);
      if (data211A === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data211A);
          break;
        case 'pdf':
          let excel211 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG211.xlsx'
          );
          let pdf211 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG211.pdf'
          );
          convertToPdf(excel211, pdf211);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf211));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG211C':
      const data211C = await makePG211C(payload);
      if (data211C === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data211C);
          break;
        case 'pdf':
          let excel211 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG211.xlsx'
          );
          let pdf211 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG211.pdf'
          );
          convertToPdf(excel211, pdf211);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf211));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG214':
      const data214 = await makePG214(payload);
      if (data214 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data214);
          break;
        case 'pdf':
          let excel214 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG214.xlsx'
          );
          let pdf214 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG214.pdf'
          );
          convertToPdf(excel214, pdf214);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf214));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG206':
      const data206 = await makePG206(payload);
      if (data206 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data206);
          break;
        case 'pdf':
          let excel206 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG206.xlsx'
          );
          let pdf206 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG206.pdf'
          );
          convertToPdf(excel206, pdf206);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf206));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG207':
      const data207 = await makePG207(payload);
      if (data207 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          res.status(200).send(data207);
          break;
        case 'pdf':
          let excel207 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG207.xlsx'
          );
          let pdf207 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG207.pdf'
          );
          convertToPdf(excel207, pdf207);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf207));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG201':
      const data201 = await makePG201(payload);
      if (data201 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data201);
          break;
        case 'pdf':
          let excel201 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG201.xlsx'
          );
          let pdf201 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG201.pdf'
          );
          convertToPdf(excel201, pdf201);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf201));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PGS203':
      const data203 = await makePGS203(payload);
      if (data203 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data203);
          break;
        case 'pdf':
          let excel203 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG203.xlsx'
          );
          let pdf203 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG203.pdf'
          );
          convertToPdf(excel203, pdf203);
          const pdfFile = fs.readFileSync(path.resolve(process.cwd(), pdf203));
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PGPR201':
      const dataPR201 = await makePGPR201(payload);
      if (dataPR201 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(dataPR201);
          break;
        case 'pdf':
          let excelPR201 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PGPR201.xlsx'
          );
          let pdfPR201 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PGPR201.pdf'
          );
          convertToPdf(excelPR201, pdfPR201);
          const pdfFile = fs.readFileSync(
            path.resolve(process.cwd(), pdfPR201)
          );
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    default:
      res.status(404).json({
        message: 'No reten type provided',
      });
      break;
  }
};

// queries for frontend
exports.findFunction = async function (req, res) {
  try {
    const data = await Umum.find(req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.aggFunction = async function (req, res) {
  try {
    const data = await Umum.aggregate(req.body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// functions
const makePG101A = async (payload) => {
  console.log('PG101A');
  try {
    const { klinik, daerah, negeri } = payload;
    //
    const data = await Helper.countPG101A(payload);
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
      'PG101.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG101');

    const monthName = moment(new Date()).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let details = worksheet.getRow(5);
    details.getCell(
      11
    ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'Servis: PRIMER';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `Fasiliti: ${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `Daerah: ${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `Negeri: ${negeri.toUpperCase()}`;
    //
    for (let i = 0; i < data.length; i++) {
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
      // decrypt ic
      // const decryptedIc = cryptoJs.AES.decrypt(
      //   data[i].ic,
      //   process.env.CRYPTO_JS_SECRET
      // ).toString(cryptoJs.enc.Utf8);
      // data[i].ic = decryptedIc;
      // decrypt ic
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
      let catatan = `${data[i].noBayaran ? data[i].noBayaran : ''} ${
        data[i].noResit ? data[i].noResit : ''
      } ${data[i].noBayaran2 ? data[i].noBayaran2 : ''} ${
        data[i].noResit2 ? data[i].noResit2 : ''
      } ${data[i].noBayaran3 ? data[i].noBayaran3 : ''} ${
        data[i].noResit3 ? data[i].noResit3 : ''
      } ${data[i].catatan}`;
      rowNew.getCell(35).value = catatan; //catatan
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 15) {
        row.eachCell((cell, colNumber) => {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.font = {
            name: 'Arial',
            size: 10,
          };
        });
      }
    });

    worksheet.name = 'PG101A';

    const newfile = makeFile(payload, 'PG101A');

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
const makePG101C = async (payload) => {
  console.log('PG101C');
  try {
    const { klinik, daerah, negeri, tarikhMula, tarikhAkhir } = payload;
    //
    const data = await Helper.countPG101C(payload);
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
      'PG101.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG101');

    const monthName = moment(tarikhMula).format('MMMM');
    const yearNow = moment(tarikhMula).format('YYYY');

    let details = worksheet.getRow(5);
    details.getCell(
      11
    ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = 'Servis: PRIMER';

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `Fasiliti: ${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `Daerah: ${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `Negeri: ${negeri.toUpperCase()}`;
    //
    for (let i = 0; i < data.length; i++) {
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
      // decrypt ic
      // const decryptedIc = cryptoJs.AES.decrypt(
      //   data[i].ic,
      //   process.env.CRYPTO_JS_SECRET
      // ).toString(cryptoJs.enc.Utf8);
      // data[i].ic = decryptedIc;
      // decrypt ic
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
      rowNew.getCell(35).value = data[i].catatan; //catatan
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 15) {
        row.eachCell((cell, colNumber) => {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.font = {
            name: 'Arial',
            size: 10,
          };
        });
      }
    });

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
    const { klinik, daerah, negeri, bulan } = payload;
    //
    const data = await Helper.countPG211A(payload);
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
      'PG211.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG211');

    const monthName = moment(bulan).format('MMMM');
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
    const { klinik, daerah, negeri, bulan } = payload;
    //
    const data = await Helper.countPG211C(payload);
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
      'PG211.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG211');

    const monthName = moment(bulan).format('MMMM');
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
    const { klinik, daerah, negeri, bulan } = payload;
    //
    const data = await Helper.countPG214(payload);
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
      'PG214.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG214');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let details = worksheet.getRow(5);
    details.getCell(
      2
    ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    // let intro1 = worksheet.getRow(6);
    // intro1.getCell(2).value = 'PRIMER';

    let intro2 = worksheet.getRow(6);
    intro2.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro3 = worksheet.getRow(7);
    intro3.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro4 = worksheet.getRow(8);
    intro4.getCell(2).value = `${negeri.toUpperCase()}`;
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
    let { klinik, daerah, negeri, bulan, pegawai } = payload;
    //
    const data = await Helper.countPG206(payload);
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
      'PG206.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG206');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let details = worksheet.getRow(6);
    details.getCell(
      2
    ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    let intro1 = worksheet.getRow(6);
    intro1.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro2 = worksheet.getRow(7);
    intro2.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro3 = worksheet.getRow(8);
    intro3.getCell(2).value = `${negeri.toUpperCase()}`;

    if (pegawai) {
      let intro4 = worksheet.getRow(9);
      intro4.getCell(2).value = `${pegawai.toUpperCase()}`;
    }
    //
    let j = 0;
    for (let i = 0; i < data[0].length; i++) {
      j += 2;
      let row = worksheet.getRow(16 + j);
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
        j += 2;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      j += 2;
      let row = worksheet.getRow(16 + j);
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
        j += 2;
      }
    }

    j = 0;
    for (let i = 0; i < data[2].length; i++) {
      j += 2;
      let row = worksheet.getRow(16 + j);
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
        j += 2;
      }
    }

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
    let { klinik, daerah, negeri, bulan, pegawai } = payload;
    //
    const data = await Helper.countPG207(payload);
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
      'PG207.xlsx'
    );
    //
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PG207');

    const monthName = moment(bulan).format('MMMM');
    const yearNow = moment(new Date()).format('YYYY');

    let details = worksheet.getRow(6);
    details.getCell(
      2
    ).value = `BAGI BULAN ${monthName.toUpperCase()} TAHUN ${yearNow}`;

    let intro1 = worksheet.getRow(7);
    intro1.getCell(2).value = `${klinik.toUpperCase()}`;

    let intro2 = worksheet.getRow(8);
    intro2.getCell(2).value = `${daerah.toUpperCase()}`;

    let intro3 = worksheet.getRow(9);
    intro3.getCell(2).value = `${negeri.toUpperCase()}`;

    if (pegawai) {
      let intro4 = worksheet.getRow(10);
      intro4.getCell(2).value = `${pegawai.toUpperCase()}`;
    }
    //
    let j = 0;
    for (let i = 0; i < data[0].length; i++) {
      j += 2;
      let row = worksheet.getRow(16 + j);
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
        j += 2;
      }
    }

    j = 0;
    for (let i = 0; i < data[1].length; i++) {
      j += 2;
      let row = worksheet.getRow(16 + j);
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
        j += 2;
      }
    }

    j = 0;
    for (let i = 0; i < data[2].length; i++) {
      j += 2;
      let row = worksheet.getRow(16 + j);
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
        j += 2;
      }
    }

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
  console.log('PGPR201');
  try {
    // const { kp, sekolah } = payload;
    let klinik = 'Klinik Pergigian Kangar';
    let bulan = '2022-10-01';
    let bulan2 = '2022-11-01';
    let daerah = 'KANGAR';
    let negeri = 'PERLIS';
    //
    const data = await Helper.countPGPR201(klinik, bulan, bulan2);
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
      'PGPR201.xlsx'
    );
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filename);
    let worksheet = workbook.getWorksheet('PGPR201');

    const monthName = moment(bulan).format('MMMM');
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

    let intro4 = worksheet.getRow(9);
    intro4.getCell(2).value = `${negeri.toUpperCase()}`;

    let j = 0;
    for (let i = 0; i < data.length; i++) {
      let rowNew = worksheet.getRow(14 + j);
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

    let rowIdnt = worksheet.getRow(30);
    rowIdnt.getCell(1).value = 'Compiled by Gi-Ret';

    let newfile = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'test-' + klinik + '-PGPR201.xlsx'
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

// debug
exports.debug = async (req, res) => {
  let klinik = 'Klinik Pergigian Arau';
  let bulan = '2022-10-01';
  let bulan2 = '2022-11-01';
  let sekolah = 'RBA0012';
  let payload = {
    negeri: 'Perlis',
    daerah: 'Arau',
    klinik: 'Klinik Pergigian Kaki Bukit',
    bulan: '2022-10-01',
  };
  // let tarikhMula = '2021-01-01';
  // let tarikhAkhir = '2021-01-31';
  // let pegawai = 'dr. faizatul hawa binti mohd zuki';
  const data = await makePG207(payload);
  // const data = await makePG214(payload);
  // const data = await makePGPR201(klinik);
  // const data = await makePGS203(klinik, bulan, sekolah);
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.status(200).send(data);
};

// helper
const makeFile = (payload, reten) => {
  const { pegawai, klinik, daerah, negeri } = payload;
  if (pegawai) {
    return fileName(pegawai, reten);
  }
  if (daerah !== 'all' && klinik !== 'all') {
    return fileName(klinik, reten);
  }
  if (daerah !== 'all' && klinik === 'all') {
    return fileName(daerah, reten);
  }
  if (daerah === 'all') {
    return fileName(negeri, reten);
  }
};

const fileName = (params, reten) => {
  return path.join(
    __dirname,
    '..',
    'public',
    'exports',
    `test-${params}-${reten}.xlsx`
  );
};

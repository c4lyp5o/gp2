'use strict';
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Excel = require('exceljs');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const Umum = require('../models/Umum');

// helper
const Helper = require('../controllers/countHelper');

// gateway
exports.downloader = async function (req, res) {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  const { kp, daerah, negeri } = jwt.verify(token, process.env.JWT_SECRET);
  const { jenisReten, formatFile, tarikhMula, tarikhAkhir } = req.query;
  const payload = {
    kp,
    daerah,
    negeri,
    formatFile,
    tarikhMula,
    tarikhAkhir,
  };
  switch (jenisReten) {
    case 'PG101':
      const data101 = await makePG101(payload);
      if (data101 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data101);
          break;
        case 'pdf':
          let excel101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG101.xlsx'
          );
          let pdf101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG101.pdf'
          );
          convertToPdf(newfile, freshPdf);
          const pdfFile = fs.readFileSync(
            path.resolve(process.cwd(), freshPdf)
          );
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    case 'PG211':
      const data211 = await makePG211(payload);
      switch (formatFile) {
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.status(200).send(data211);
          break;
        case 'pdf':
          let excel101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG101.xlsx'
          );
          let pdf101 = path.join(
            __dirname,
            '..',
            'public',
            'exports',
            'test-' + kp + '-PG101.pdf'
          );
          convertToPdf(newfile, freshPdf);
          const pdfFile = fs.readFileSync(
            path.resolve(process.cwd(), freshPdf)
          );
          res.setHeader('Content-Type', 'application/pdf');
          res.status(200).send(pdfFile);
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
};

// queries for frontend
exports.findFunction = async function (req, res) {
  const { tarikh } = req.query;
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  const { kp } = jwt.verify(token, process.env.JWT_SECRET);
  const data = await Umum.find({
    createdByKp: kp,
  });
  let uniqueDates = [
    ...new Set(data && data.map((item) => item.tarikhKedatangan)),
  ];
  try {
    res.status(200).json(uniqueDates);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.aggFunction = async function (req, res) {
  const { aggregation } = req.body;
  const data = await Umum.aggregate(aggregation);
  try {
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// functions
const makePG101 = async (payload) => {
  console.log('PG101');
  try {
    const { kp, daerah, negeri, tarikhMula, tarikhAkhir } = payload;
    //
    const data = await Helper.countPG101(kp, tarikhMula, tarikhAkhir);
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
    intro2.getCell(2).value = `Fasiliti: ${kp.toUpperCase()}`;

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
      const decryptedIc = cryptoJs.AES.decrypt(
        data[i].ic,
        process.env.CRYPTO_JS_SECRET
      ).toString(cryptoJs.enc.Utf8);
      data[i].ic = decryptedIc;
      // decrypt ic
      rowNew.getCell(6).value = data[i].ic;
      rowNew.getCell(7).value = data[i].nama.toUpperCase();
      rowNew.getCell(8).value = data[i].alamat.toUpperCase();
      rowNew.getCell(9).value = data[i].umur;
      if (data[i].jantina == 'lelaki') {
        rowNew.getCell(10).value = '/';
      }
      if (data[i].jantina == 'perempuan') {
        rowNew.getCell(11).value = '/';
      }
      switch (data[i].kumpulanEtnik) {
        case 'melayu':
          rowNew.getCell(12).value = '/';
          break;
        case 'cina':
          rowNew.getCell(13).value = '/';
          break;
        case 'india':
          rowNew.getCell(14).value = '/';
          break;
        case 'bajau':
          rowNew.getCell(15).value = '/';
          break;
        case 'dusun':
          rowNew.getCell(16).value = '/';
          break;
        case 'kadazan':
          rowNew.getCell(17).value = '/';
          break;
        case 'murut':
          rowNew.getCell(18).value = '/';
          break;
        case 'bumiputera sabah lain':
          rowNew.getCell(19).value = '/';
          break;
        case 'melanau':
          rowNew.getCell(20).value = '/';
          break;
        case 'kedayan':
          rowNew.getCell(21).value = '/';
          break;
        case 'iban':
          rowNew.getCell(22).value = '/';
          break;
        case 'bidayuh':
          rowNew.getCell(23).value = '/';
          break;
        case 'penan':
          rowNew.getCell(24).value = '/';
          break;
        case 'bumiputera sarawak lain':
          rowNew.getCell(25).value = '/';
          break;
        case 'orang asli semenanjung':
          rowNew.getCell(26).value = '/';
          break;
        case 'lain-lain':
          rowNew.getCell(27).value = '/';
          break;
        case 'bukan warganegara':
          rowNew.getCell(28).value = '/';
          break;
        default:
          console.log('');
      }
      if (data[i].ibuMengandung) {
        rowNew.getCell(29).value = '/';
      }
      if (data[i].bersekolah) {
        rowNew.getCell(30).value = '/';
      }
      if (data[i].orangKurangUpaya) {
        rowNew.getCell(31).value = '/';
      }
      switch (data[i].statusPesara) {
        case 'pesara-kerajaan':
          rowNew.getCell(32).value = '/';
          break;
        case 'pesara-atm':
          rowNew.getCell(33).value = '/';
          break;
        default:
          console.log('');
      }
      rowNew.getCell(34).value = data[i].rujukDaripada.toUpperCase(); //rujukDaripada
      rowNew.getCell(35).value = data[i].catatan; //catatan
    }

    let newfile = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'test-' + kp + '-PG101.xlsx'
    );

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 30000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
const makePG211 = async (payload) => {
  console.log('PG211');
  try {
    const { kp, daerah, negeri } = payload;
    //
    const data = await Helper.countPG211(kp);
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

    const monthName = moment(new Date()).format('MMMM');
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

    let newfile = path.join(
      __dirname,
      '..',
      'public',
      'exports',
      'test-' + kp + '-PG211.xlsx'
    );

    // Write the file
    await workbook.xlsx.writeFile(newfile);
    console.log('writing file');
    setTimeout(() => {
      fs.unlinkSync(newfile); // delete this file after 30 seconds
      console.log('deleting file');
    }, 30000);
    // read file for returning
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    // return file
    return file;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

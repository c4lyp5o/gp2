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
  console.log(req.headers);
  const { authorization, klinikid, klinikdaerah, kliniknegeri } = req.headers;
  //
  let kp, daerah, negeri;
  if (!authorization) {
    kp = klinikid;
    daerah = klinikdaerah;
    negeri = kliniknegeri;
  }
  if (authorization) {
    const token = authorization.split(' ')[1];
    kp = jwt.verify(token, process.env.JWT_SECRET).kp;
    daerah = jwt.verify(token, process.env.JWT_SECRET).daerah;
    negeri = jwt.verify(token, process.env.JWT_SECRET).negeri;
  }
  const { jenisReten, formatFile, tarikhMula, tarikhAkhir, bulan } = req.query;
  const payload = {
    kp,
    daerah,
    negeri,
    formatFile,
    tarikhMula,
    tarikhAkhir,
    bulan,
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
      if (data101 === 'No data found') {
        return res.status(404).json({
          message: 'No data found',
        });
      }
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
    case 'PG206':
      const data206 = await makePG206and207(payload);
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
    const { kp, daerah, negeri, bulan } = payload;
    //
    const data = await Helper.countPG211(kp, bulan);
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
const makePG206and207 = async (payload) => {
  console.log('PG206 or PG207');
  try {
    const { kp, daerah, negeri, tarikhMula, tarikhAkhir, pegawai } = payload;
    //
    const data = await Helper.countPG101(kp, tarikhMula, tarikhAkhir, pegawai);
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
    let rowNew1 = worksheet.getRow(17);
    rowNew1.getCell(3).value = data.kedatanganTahunSemasa; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(4).value = data.sapuanFluorida; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(5).value = data.prrJenis1; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(6).value = data.muridBaruFS; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(7).value = data.muridSemulaFS; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(8).value = data.gigiBaruFS; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(9).value = data.gigiSemulaFS; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(10).value = data.tampalanAntGdBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(11).value = data.tampalanAntGdSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(12).value = data.tampalanAntGkBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(13).value = data.tampalanAntGkSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(14).value = data.tampalanPostGdBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(15).value = data.tampalanPostGdSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(16).value = data.tampalanPostGkBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(17).value = data.tampalanPostGkSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(18).value = data.tampalanPostAmgGdBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(19).value = data.tampalanPostAmgGdSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(20).value = data.tampalanPostAmgGkBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(21).value = data.tampalanPostAmgGkSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(22).value = data.inlayOnlayBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(23).value = data.inlayOnlaySemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(24).value = data.jumlahTampalanBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(25).value = data.jumlahTampalanSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(26).value = data.tampalanSementara; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(27).value = data.cabutanGd; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(28).value = data.cabutanGk; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(29).value = data.komplikasiSelepasCabutan; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(30).value = data.penskaleran; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(31).value = data.rawatanPerioLain; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(32).value = data.rawatanEndo; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(33).value = data.rawatanOrtho; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(34).value = data.kesPerubatan; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(35).value = data.absesBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(36).value = data.AbsesSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(37).value = data.cabutanSurgical; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(38).value = data.fraktur; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(39).value = data.trauma; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(40).value = data.pembedahanKecilMulut; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(41).value = data.crownBridgeBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(42).value = data.crownBridgeSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(43).value = data.postCoreBaru; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(44).value = data.postCoreSemula; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(45).value = data.prosthodontikPenuhDentur; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(46).value = data.prosthodontikPenuhPesakit; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(47).value = data.prosthodontikSebahagianDentur; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(48).value = data.prosthodontikSebahagianPesakit; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(49).value = data.immediateDenture; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(50).value = data.pembaikanDenture; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(51).value = data.kesSelesai; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(52).value = data.xrayDiambil; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(53).value = data.pesakitDisaringOC; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(54).value = data.pesakitdirujukLesiMulut; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(55).value = data.pesakitDirujukTabiat; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(56).value = data.rokokSaringNasihat; //C17          Bawah 1 tahun Baru
    rowNew1.getCell(57).value = data.rokokIntervensi; //C17          Bawah 1 tahun Baru
    rowNew1.commit();

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
const makePG201 = async (payload) => {
  console.log('PG201');
  try {
    const { kp, sekolah } = payload;
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

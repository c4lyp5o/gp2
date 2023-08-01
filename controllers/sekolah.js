const https = require('https');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Excel = require('exceljs');
const moment = require('moment');
const Sekolah = require('../models/Sekolah');
const Runningnumber = require('../models/Runningnumber');
const Pemeriksaansekolah = require('../models/Pemeriksaansekolah');
const Rawatansekolah = require('../models/Rawatansekolah');
const KohortKotak = require('../models/KohortKotak');
const Fasiliti = require('../models/Fasiliti');
const sesiTakwimSekolah = require('../controllers/helpers/sesiTakwimSekolah');
const insertToSekolah = require('../controllers/helpers/insertToSekolah');
const { generateRandomString } = require('./adminAPI');
const { logger, unauthorizedLogger } = require('../logs/logger');

// GET /
const getAllPersonSekolahsVanilla = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kp, kodFasiliti } = req.user;

  const sesiTakwim = sesiTakwimSekolah();

  const fasilitiSekolahs = await Fasiliti.find({
    handler: kp,
    kodFasilitiHandler: kodFasiliti,
    jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
    sesiTakwimSekolah: sesiTakwim,
  });

  const kodSekolahs = new Set();
  fasilitiSekolahs.forEach((fasiliti) => kodSekolahs.add(fasiliti.kodSekolah));

  // just query kodSekolah, statusRawatan & pemeriksaanSekolah to save network bandwith because UserSenaraiSekolah will pull all sekolah for that kp
  const allPersonSekolahs = await Sekolah.find({
    kodSekolah: { $in: [...kodSekolahs] },
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  }).select('kodSekolah statusRawatan pemeriksaanSekolah');

  res.status(200).json({ allPersonSekolahs, fasilitiSekolahs });
};

// GET /:personSekolahId
const getSinglePersonSekolahVanilla = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const singlePersonSekolah = await Sekolah.findOne({
    _id: req.params.personSekolahId,
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  });

  if (!singlePersonSekolah) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personSekolahId}` });
  }

  res.status(200).json({ singlePersonSekolah });
};

// GET /populate/:personSekolahId
const getSinglePersonSekolahWithPopulate = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kp, kodFasiliti } = req.user;

  const sesiTakwim = sesiTakwimSekolah();

  const personSekolahWithPopulate = await Sekolah.findOne({
    _id: req.params.personSekolahId,
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  })
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah');

  const fasilitiSekolah = await Fasiliti.findOne({
    handler: kp,
    kodFasilitiHandler: kodFasiliti,
    kodSekolah: personSekolahWithPopulate.kodSekolah,
    sesiTakwimSekolah: sesiTakwim,
  });

  if (!personSekolahWithPopulate) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personSekolahId}` });
  }

  res.status(201).json({
    personSekolahWithPopulate,
    fasilitiSekolah,
  });
};

// GET /populate-satu-sekolah/:kodSekolah
const getAllPersonSekolahsWithPopulate = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kp, kodFasiliti } = req.user;

  const sesiTakwim = sesiTakwimSekolah();

  const fasilitiSekolah = await Fasiliti.findOne({
    handler: kp,
    kodFasilitiHandler: kodFasiliti,
    kodSekolah: req.params.kodSekolah,
    sesiTakwimSekolah: sesiTakwim,
  });

  const allPersonSekolahs = await Sekolah.find({
    kodSekolah: req.params.kodSekolah,
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  })
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah')
    .sort({ nama: 1 });

  res.status(200).json({ allPersonSekolahs, fasilitiSekolah });
};

// not used
// GET /kemaskini/:fasilitiId
const kemaskiniSenaraiPelajar = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const fasilitiSekolah = await Fasiliti.findOne({
    _id: req.params.fasilitiId,
    sesiTakwimSekolah: sesiTakwim,
  });

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(
      process.env.MOEIS_INTEGRATION_URL_PELAJAR +
        `?inid=${fasilitiSekolah.idInstitusi}`,
      {
        httpsAgent: agent,
        headers: {
          APIKEY: process.env.MOEIS_APIKEY,
        },
      }
    );
    insertToSekolah(fasilitiSekolah, data);
    return res
      .status(200)
      .json({ msg: `Successfully refreshed pelajar ${fasilitiSekolah.nama}` });
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
};

// GET /muatturun/:kodSekolah
const muatturunSenaraiPelajar = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kodSekolah } = req.params;

  const { rujukan } = req.query;

  const sesiTakwim = sesiTakwimSekolah();

  // download murid rujukan
  if (rujukan === 'true') {
    const makeFile = () => {
      return path.join(
        __dirname,
        '..',
        'public',
        'exports',
        `${generateRandomString(20)}.xlsx`
      );
    };

    let match_stage = {
      $match: {
        kodSekolah: kodSekolah,
        deleted: false,
      },
    };

    let project_stage = {
      $project: {
        nama: 1,
        namaSekolah: 1,
        tahunTingkatan: 1,
        kelasPelajar: 1,
        jantina: 1,
        umur: 1,
        keturunan: 1,
        warganegara: 1,
      },
    };

    const semuaPelajarSatuSekolah = await Sekolah.find({
      kodSekolah: kodSekolah,
      sesiTakwimSekolah: sesiTakwim,
      deleted: false,
    }).select(
      'nama naamSekolah tahunTingkatan kelasPelajar jantina umur keturunan warganegara'
    );
    const semuaTahun = new Set(
      semuaPelajarSatuSekolah.map((budak) => budak.tahunTingkatan)
    );

    let blank = path.join(__dirname, '..', 'public', 'exports', 'blank.xlsx');
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(blank);

    workbook.removeWorksheet('Sheet1');

    for (const tahun of semuaTahun) {
      const worksheet = workbook.addWorksheet(tahun);

      const studentsInClass = semuaPelajarSatuSekolah.filter(
        (student) => student.tahunTingkatan === tahun
      );

      studentsInClass.sort((a, b) => {
        if (a.kelasPelajar < b.kelasPelajar) {
          return -1;
        }
        if (a.kelasPelajar > b.kelasPelajar) {
          return 1;
        }
        if (a.nama < b.nama) {
          return -1;
        }
        if (a.nama > b.nama) {
          return 1;
        }
        return 0;
      });

      worksheet.columns = [
        { header: 'BIL', key: 'bil', width: 5, height: 26 },
        { header: 'NAMA', key: 'nama', width: 60, height: 26 },
        {
          header: 'TAHUN/TINGKATAN',
          key: 'tahunTingkatan',
          width: 35,
          height: 26,
        },
        { header: 'KELAS', key: 'kelasPelajar', width: 15, height: 26 },
        { header: 'JANTINA', key: 'jantina', width: 15, height: 26 },
        { header: 'UMUR', key: 'umur', width: 10, height: 26 },
        { header: 'KETURUNAN', key: 'keturunan', width: 15, height: 26 },
        {
          header: 'WARGANEGARA',
          key: 'warganegara',
          width: 40,
          height: 26,
        },
      ];

      worksheet.addRows(studentsInClass);

      worksheet.getColumn('bil').eachCell((cell, number) => {
        if (number !== 1) {
          cell.value = number - 1;
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      worksheet.getColumn('nama').eachCell((cell, number) => {
        if (number !== 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });

      worksheet.getColumn('warganegara').eachCell((cell) => {
        cell.value = cell.value || 'TIADA MAKLUMAT';
      });

      worksheet.columns.forEach((column) => {
        column.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      });

      worksheet.getRow(1).font = { bold: true, size: 15, name: 'Calibri' };

      worksheet.getRow(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      worksheet.eachRow((row) => {
        row.height = 15;
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });
    }

    const listPelajar = makeFile();

    await workbook.xlsx.writeFile(listPelajar);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    const fileStream = fs.createReadStream(listPelajar);
    fileStream.pipe(res);
    fileStream.on('close', () => {
      return fs.unlinkSync(listPelajar);
    });
    return;
  }

  // download murid biasa
  const makeFile = () => {
    return path.join(
      __dirname,
      '..',
      'public',
      'exports',
      `${generateRandomString(20)}.xlsx`
    );
  };

  let match_stage = {
    $match: {
      kodSekolah: kodSekolah,
      deleted: false,
    },
  };

  let project_stage = {
    $project: {
      nama: 1,
      namaSekolah: 1,
      tahunTingkatan: 1,
      kelasPelajar: 1,
      jantina: 1,
      umur: 1,
      keturunan: 1,
      warganegara: 1,
    },
  };

  const semuaPelajarSatuSekolah = await Sekolah.aggregate([
    match_stage,
    project_stage,
  ]);
  const semuaTahun = new Set(
    semuaPelajarSatuSekolah.map((budak) => budak.tahunTingkatan)
  );

  let blank = path.join(__dirname, '..', 'public', 'exports', 'blank.xlsx');
  let workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(blank);

  workbook.removeWorksheet('Sheet1');

  for (const tahun of semuaTahun) {
    const worksheet = workbook.addWorksheet(tahun);

    const studentsInClass = semuaPelajarSatuSekolah.filter(
      (student) => student.tahunTingkatan === tahun
    );

    studentsInClass.sort((a, b) => {
      if (a.kelasPelajar < b.kelasPelajar) {
        return -1;
      }
      if (a.kelasPelajar > b.kelasPelajar) {
        return 1;
      }
      if (a.nama < b.nama) {
        return -1;
      }
      if (a.nama > b.nama) {
        return 1;
      }
      return 0;
    });

    worksheet.columns = [
      { header: 'BIL', key: 'bil', width: 5, height: 26 },
      { header: 'NAMA', key: 'nama', width: 60, height: 26 },
      {
        header: 'TAHUN/TINGKATAN',
        key: 'tahunTingkatan',
        width: 35,
        height: 26,
      },
      { header: 'KELAS', key: 'kelasPelajar', width: 15, height: 26 },
      { header: 'JANTINA', key: 'jantina', width: 15, height: 26 },
      { header: 'UMUR', key: 'umur', width: 10, height: 26 },
      { header: 'KETURUNAN', key: 'keturunan', width: 15, height: 26 },
      {
        header: 'WARGANEGARA',
        key: 'warganegara',
        width: 40,
        height: 26,
      },
    ];

    worksheet.addRows(studentsInClass);

    worksheet.getColumn('bil').eachCell((cell, number) => {
      if (number !== 1) {
        cell.value = number - 1;
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.getColumn('nama').eachCell((cell, number) => {
      if (number !== 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });

    worksheet.getColumn('warganegara').eachCell((cell) => {
      cell.value = cell.value || 'TIADA MAKLUMAT';
    });

    worksheet.columns.forEach((column) => {
      column.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    worksheet.getRow(1).font = { bold: true, size: 15, name: 'Calibri' };

    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    worksheet.eachRow((row) => {
      row.height = 15;
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
  }

  const listPelajar = makeFile();

  await workbook.xlsx.writeFile(listPelajar);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  const fileStream = fs.createReadStream(listPelajar);
  fileStream.pipe(res);
  fileStream.on('close', () => {
    return fs.unlinkSync(listPelajar);
  });
  return;
};

// POST /
const createPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // const sesiTakwim = sesiTakwimSekolah();

  // const personSekolahExist = await Sekolah.findOne({
  //   nomborId: req.body.nomborId,
  //   sesiTakwimPelajar: sesiTakwim,
  //   berpindah: false,
  //   deleted: false,
  // });

  // if (personSekolahExist) {
  //   return res.status(409).json({
  //     msg: `Pelajar ini telah wujud di sekolah ${personSekolahExist.namaSekolah} bagi ${sesiTakwim}`,
  //   });
  // }

  if (req.body.umur <= 3) {
    return res.status(409).json({
      msg: 'Umur pelajar tidak boleh kurang daripada 3 tahun',
    });
  }

  const personSekolah = await Sekolah.create({
    idInstitusi: req.body.idInstitusi,
    kodSekolah: req.body.kodSekolah,
    namaSekolah: req.body.namaSekolah,
    nomborId: req.body.nomborId,
    nama: req.body.nama,
    sesiTakwimPelajar: req.body.sesiTakwimPelajar,
    tahunTingkatan: req.body.tahunTingkatan,
    jantina: req.body.jantina,
    statusOku: req.body.statusOku,
    tarikhLahir: req.body.tarikhLahir,
    umur: req.body.umur,
    keturunan: req.body.keturunan,
    warganegara: req.body.warganegara,
  });

  res.status(201).json({ personSekolah });
};

// POST /pemeriksaan/:personSekolahId
// set statusRawatan according to handleSubmit FE when creating pemeriksaan
const createPemeriksaanWithSetPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const singlePersonSekolah = await Sekolah.findOne({
    _id: req.params.personSekolahId,
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  });

  // check xleh submit pemeriksaan kalau singlePersonSekolah tak lengkap
  if (singlePersonSekolah.umur <= 3 || singlePersonSekolah.umur === 7777777) {
    return res.status(409).json({
      msg: `Tidak boleh mengisi reten pelajar ini kerana pelajar ${singlePersonSekolah.nama} berumur ${singlePersonSekolah.umur}`,
    });
  }
  if (singlePersonSekolah.keturunan === 'TIADA MAKLUMAT') {
    return res.status(409).json({
      msg: `Tidak boleh mengisi reten pelajar ini kerana pelajar ${singlePersonSekolah.nama} tidak mempunyai keturunan`,
    });
  }
  if (singlePersonSekolah.warganegara === '') {
    return res.status(409).json({
      msg: `Tidak boleh mengisi reten pelajar ini kerana pelajar ${singlePersonSekolah.nama} tidak mempunyai warganegara`,
    });
  }

  // associate negeri, daerah, kp to each person sekolah when creating pemeriksaan
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;

  // handling penggunaanKPBMPB, kedatanganKPBMPB & noPendaftaranKPBMPB
  if (
    req.body.menggunakanKPBMPB === 'ya-menggunakan-kpb-mpb' &&
    req.body.penggunaanKPBMPB !== ''
  ) {
    // find if this person already use this KPBMPB, find by ic
    const personExistForKPBMPB = await Sekolah.findOne({
      _id: req.params.personSekolahId,
      sesiTakwimPelajar: sesiTakwim,
      deleted: false,
    });
    if (personExistForKPBMPB.kedatanganKPBMPB === 'ulangan-kedatangan-KPBMP') {
      console.log('pernah guna KPBMPB ni ' + req.body.penggunaanKPBMPB);
      req.body.kedatanganKPBMPB = 'ulangan-kedatangan-KPBMPB';
      req.body.noPendaftaranUlanganKPBMPB =
        personExistForKPBMPB.noPendaftaranBaruKPBMPB;
      console.log(
        'no pendaftaran ulangan KPBMPB: ',
        req.body.noPendaftaranUlanganKPBMPB
      );
      const personSekolahUseKPBMPB = await Sekolah.findOneAndUpdate(
        {
          _id: req.params.personSekolahId,
          sesiTakwimPelajar: sesiTakwim,
          deleted: false,
        },
        {
          $set: {
            kedatanganKPBMPB: req.body.kedatanganKPBMPB,
            noPendaftaranUlanganKPBMPB: req.body.noPendaftaranUlanganKPBMPB,
          },
        },
        { new: true }
      );
    }
    if (personExistForKPBMPB.kedatanganKPBMPB === 'baru-kedatangan-KPBMP') {
      console.log('pernah guna KPBMPB ni ' + req.body.penggunaanKPBMPB);
      req.body.kedatanganKPBMPB = 'ulangan-kedatangan-KPBMPB';
      req.body.noPendaftaranUlanganKPBMPB =
        personExistForKPBMPB.noPendaftaranBaruKPBMPB;
      console.log(
        'no pendaftaran ulangan KPBMPB: ',
        req.body.noPendaftaranUlanganKPBMPB
      );
      const personSekolahUseKPBMPB = await Sekolah.findOneAndUpdate(
        {
          _id: req.params.personSekolahId,
          sesiTakwimPelajar: sesiTakwim,
          deleted: false,
        },
        {
          $set: {
            kedatanganKPBMPB: req.body.kedatanganKPBMPB,
            noPendaftaranUlanganKPBMPB: req.body.noPendaftaranUlanganKPBMPB,
          },
        },
        { new: true }
      );
    }
    if (personExistForKPBMPB.kedatanganKPBMPB === '') {
      console.log('tak pernah guna KPBMPB ni ' + req.body.penggunaanKPBMPB);
      req.body.kedatanganKPBMPB = 'baru-kedatangan-KPBMPB';

      // check running number for this KPBMPB
      let currentRunningNumberKPBMPB = await Runningnumber.findOne({
        jenis: 'KPBMPB',
        tahun: new Date().getFullYear(),
        kodFasiliti: req.body.penggunaanKPBMPB,
      });

      // start no 1 running number kalau tak exist untuk KPBMPB ni
      if (!currentRunningNumberKPBMPB) {
        const newRunningNumberKPBMPB = await Runningnumber.create({
          runningnumber: 1,
          jenis: 'KPBMPB',
          tahun: new Date().getFullYear(),
          kodFasiliti: req.body.penggunaanKPBMPB,
        });
        const newRegKPBMPB = `KPBMPB/${req.body.penggunaanKPBMPB}/${
          newRunningNumberKPBMPB.runningnumber
        }/${new Date().getFullYear()}`;
        req.body.noPendaftaranBaruKPBMPB = newRegKPBMPB;
        console.log('no pendaftaran baru KPBMPB: ', newRegKPBMPB);
      }

      // increment +1 running number KPBMPB ni kalau exist
      if (currentRunningNumberKPBMPB) {
        currentRunningNumberKPBMPB.runningnumber += 1;
        await currentRunningNumberKPBMPB.save();
        const newRegKPBMPB = `KPBMPB/${req.body.penggunaanKPBMPB}/${
          currentRunningNumberKPBMPB.runningnumber
        }/${new Date().getFullYear()}`;
        req.body.noPendaftaranBaruKPBMPB = newRegKPBMPB;
        console.log('no pendaftaran baru KPBMPB: ', newRegKPBMPB);
      }

      const personSekolahUseKPBMPB = await Sekolah.findOneAndUpdate(
        {
          _id: req.params.personSekolahId,
          sesiTakwimPelajar: sesiTakwim,
          deleted: false,
        },
        {
          $set: {
            kedatanganKPBMPB: req.body.kedatanganKPBMPB,
            noPendaftaranBaruKPBMPB: req.body.noPendaftaranBaruKPBMPB,
          },
        },
        { new: true }
      );
    }
  }

  const pemeriksaanSekolah = await Pemeriksaansekolah.create(req.body);

  // masukkan pemeriksaan ID dalam personSekolah
  const personSekolah = await Sekolah.findOneAndUpdate(
    {
      _id: req.params.personSekolahId,
      sesiTakwimPelajar: sesiTakwim,
      deleted: false,
    },
    {
      $set: {
        pemeriksaanSekolah: pemeriksaanSekolah._id,
        statusRawatan: req.body.statusRawatan,
        kesSelesaiMmi: req.body.kesSelesaiMmi,
      },
    },
    { new: true }
  );

  // if bersediaDirujuk, masukkan dalam kohort kotak
  if (req.body.bersediaDirujuk === 'ya-bersedia-dirujuk') {
    await KohortKotak.create({
      createdByNegeri: req.user.negeri,
      createdByDaerah: req.user.daerah,
      createdByKp: req.user.kp,
      createdByKodFasiliti: req.user.kodFasiliti,
      // copied MOEIS data
      idInstitusi: personSekolah.idInstitusi,
      kodSekolah: personSekolah.kodSekolah,
      namaSekolah: personSekolah.namaSekolah,
      idIndividu: personSekolah.idIndividu,
      nomborId: personSekolah.nomborId,
      nama: personSekolah.nama,
      sesiTakwimPelajar: personSekolah.sesiTakwimPelajar,
      tahunTingkatan: personSekolah.tahunTingkatan,
      kelasPelajar: personSekolah.kelasPelajar,
      jantina: personSekolah.jantina,
      statusOku: personSekolah.statusOku,
      tarikhLahir: personSekolah.tarikhLahir,
      umur: personSekolah.umur,
      keturunan: personSekolah.keturunan,
      warganegara: personSekolah.warganegara,
    });
  }

  res.status(201).json({ personSekolah });
};

// POST /rawatan/:personSekolahId
// set statusRawatan according to handleSubmit FE when creating rawatan
const createRawatanWithPushPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  // associate negeri, daerah & kp to each person sekolah when creating rawatan
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;

  // handling penggunaanKPBMPB, kedatanganKPBMPB & noPendaftaranKPBMPB
  if (
    req.body.menggunakanKPBMPB === 'ya-menggunakan-kpb-mpb' &&
    req.body.penggunaanKPBMPB !== ''
  ) {
    // find if this person already use this KPBMPB, find by ic
    const personExistForKPBMPB = await Sekolah.findOne({
      _id: req.params.personSekolahId,
      sesiTakwimPelajar: sesiTakwim,
      deleted: false,
    });
    if (personExistForKPBMPB.kedatanganKPBMPB === 'ulangan-kedatangan-KPBMPB') {
      console.log('pernah guna KPBMPB ni ' + req.body.penggunaanKPBMPB);
      req.body.kedatanganKPBMPB = 'ulangan-kedatangan-KPBMPB';
      req.body.noPendaftaranUlanganKPBMPB =
        personExistForKPBMPB.noPendaftaranBaruKPBMPB;
      console.log(
        'no pendaftaran ulangan KPBMPB: ',
        req.body.noPendaftaranUlanganKPBMPB
      );
      const personSekolahUseKPBMPB = await Sekolah.findOneAndUpdate(
        {
          _id: req.params.personSekolahId,
          sesiTakwimPelajar: sesiTakwim,
          deleted: false,
        },
        {
          $set: {
            kedatanganKPBMPB: req.body.kedatanganKPBMPB,
            noPendaftaranUlanganKPBMPB: req.body.noPendaftaranUlanganKPBMPB,
          },
        },
        { new: true }
      );
    }
    if (personExistForKPBMPB.kedatanganKPBMPB === 'baru-kedatangan-KPBMPB') {
      console.log('pernah guna KPBMPB ni ' + req.body.penggunaanKPBMPB);
      req.body.kedatanganKPBMPB = 'ulangan-kedatangan-KPBMPB';
      req.body.noPendaftaranUlanganKPBMPB =
        personExistForKPBMPB.noPendaftaranBaruKPBMPB;
      console.log(
        'no pendaftaran ulangan KPBMPB: ',
        req.body.noPendaftaranUlanganKPBMPB
      );
      const personSekolahUseKPBMPB = await Sekolah.findOneAndUpdate(
        {
          _id: req.params.personSekolahId,
          sesiTakwimPelajar: sesiTakwim,
          deleted: false,
        },
        {
          $set: {
            kedatanganKPBMPB: req.body.kedatanganKPBMPB,
            noPendaftaranUlanganKPBMPB: req.body.noPendaftaranUlanganKPBMPB,
          },
        },
        { new: true }
      );
    }
    if (personExistForKPBMPB.kedatanganKPBMPB === '') {
      console.log('tak pernah guna KPBMPB ni ' + req.body.penggunaanKPBMPB);
      req.body.kedatanganKPBMPB = 'baru-kedatangan-KPBMPB';

      // check running number for this KPBMPB
      let currentRunningNumberKPBMPB = await Runningnumber.findOne({
        jenis: 'KPBMPB',
        tahun: new Date().getFullYear(),
        kodFasiliti: req.body.penggunaanKPBMPB,
      });

      // start no 1 running number kalau tak exist untuk KPBMPB ni
      if (!currentRunningNumberKPBMPB) {
        const newRunningNumberKPBMPB = await Runningnumber.create({
          runningnumber: 1,
          jenis: 'KPBMPB',
          tahun: new Date().getFullYear(),
          kodFasiliti: req.body.penggunaanKPBMPB,
        });
        const newRegKPBMPB = `KPBMPB/${req.body.penggunaanKPBMPB}/${
          newRunningNumberKPBMPB.runningnumber
        }/${new Date().getFullYear()}`;
        req.body.noPendaftaranBaruKPBMPB = newRegKPBMPB;
        console.log('no pendaftaran baru KPBMPB: ', newRegKPBMPB);
      }

      // increment +1 running number KPBMPB ni kalau exist
      if (currentRunningNumberKPBMPB) {
        currentRunningNumberKPBMPB.runningnumber += 1;
        await currentRunningNumberKPBMPB.save();
        const newRegKPBMPB = `KPBMPB/${req.body.penggunaanKPBMPB}/${
          currentRunningNumberKPBMPB.runningnumber
        }/${new Date().getFullYear()}`;
        req.body.noPendaftaranBaruKPBMPB = newRegKPBMPB;
        console.log('no pendaftaran baru KPBMPB: ', newRegKPBMPB);
      }

      const personSekolahUseKPBMPB = await Sekolah.findOneAndUpdate(
        {
          _id: req.params.personSekolahId,
          sesiTakwimPelajar: sesiTakwim,
          deleted: false,
        },
        {
          $set: {
            kedatanganKPBMPB: req.body.kedatanganKPBMPB,
            noPendaftaranBaruKPBMPB: req.body.noPendaftaranBaruKPBMPB,
          },
        },
        { new: true }
      );
    }
  }

  const rawatanSekolah = await Rawatansekolah.create(req.body);

  // masukkan rawatan ID dalam personSekolah
  const personSekolah = await Sekolah.findOneAndUpdate(
    {
      _id: req.params.personSekolahId,
      sesiTakwimPelajar: sesiTakwim,
      deleted: false,
    },
    {
      $push: { rawatanSekolah: rawatanSekolah._id },
      $set: {
        statusRawatan: req.body.statusRawatan,
        kesSelesaiMmi: req.body.kesSelesaiMmi,
      },
    },
    { new: true }
  );

  res.status(201).json({ personSekolah });
};

// // not used
// // POST /kotak/:personSekolahId
// const createKotakWithSetPersonSekolah = async (req, res) => {
//   if (req.user.accountType !== 'kpUser') {
//     return res.status(401).json({ msg: 'Unauthorized' });
//   }

//   // associate negeri, daerah, kp to each person sekolah when creating kotak
//   req.body.createdByNegeri = req.user.negeri;
//   req.body.createdByDaerah = req.user.daerah;
//   req.body.createdByKp = req.user.kp;

//   const kotakSekolah = await Kotaksekolah.create(req.body);

//   // masukkan kotak ID dalam personSekolah
//   const personSekolah = await Sekolah.findOneAndUpdate(
//     { _id: req.params.personSekolahId },
//     {
//       $set: {
//         kotakSekolah: kotakSekolah._id,
//       },
//     },
//     { new: true }
//   );

//   res.status(201).json({ personSekolah });
// };

// PATCH /fasiliti/:fasilitiId
const updateFasiliti = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const fasilitiSekolah = await Fasiliti.findOne({
    _id: req.params.fasilitiId,
  });

  if (fasilitiSekolah.sekolahSelesaiReten === true) {
    unauthorizedLogger.warn(
      `${req.method} ${req.url} [sekolahController - updateFasiliti] Unauthorized fasilitiSekolah ${fasilitiSekolah.nama} has TUTUP RETEN tampering by {kp: ${req.user.kp}, kodFasiliti: ${req.user.kodFasiliti}} from ${req.ip}`
    );
    return res.status(403).json({
      msg: `${fasilitiSekolah.nama} telah ditutup reten`,
    });
  }

  const allPersonSekolahs = await Sekolah.find({
    kodSekolah: fasilitiSekolah.kodSekolah,
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  });

  // check xleh tutup sekolah kalau singlePersonSekolah tak lengkap
  for (let i = 0; i < allPersonSekolahs.length; i++) {
    if (
      allPersonSekolahs[i].umur <= 3 ||
      allPersonSekolahs[i].umur === 7777777
    ) {
      return res.status(409).json({
        msg: `Tidak boleh menutup reten sekolah ini kerana pelajar ${allPersonSekolahs[i].nama} berumur ${allPersonSekolahs[i].umur}`,
      });
    }
    if (allPersonSekolahs[i].keturunan === 'TIADA MAKLUMAT') {
      return res.status(409).json({
        msg: `Tidak boleh menutup reten sekolah ini kerana pelajar ${allPersonSekolahs[i].nama} tidak mempunyai keturunan`,
      });
    }
    if (allPersonSekolahs[i].warganegara === '') {
      return res.status(409).json({
        msg: `Tidak boleh menutup reten sekolah ini kerana pelajar ${allPersonSekolahs[i].nama} tidak mempunyai warganegara`,
      });
    }
  }

  const updatedFasiliti = await Fasiliti.findOneAndUpdate(
    { _id: req.params.fasilitiId },
    {
      $set: {
        sekolahSelesaiReten: req.body.sekolahSelesaiReten,
        tarikhSekolahSelesaiReten: moment().format('YYYY-MM-DD'),
      },
    },
    { new: true }
  );

  res.status(200).json({ updatedFasiliti });
};

// PATCH /ubah/:personSekolahId
const updatePersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const singlePersonSekolah = await Sekolah.findOne({
    _id: req.params.personSekolahId,
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  });

  if (
    singlePersonSekolah.pemeriksaanSekolah &&
    !req.body.tarikhMelaksanakanBegin
  ) {
    unauthorizedLogger.warn(
      `${req.method} ${req.url} [sekolahController - updatePersonSekolah] Unauthorized singlePersonSekolah ${singlePersonSekolah.nama} has PEMERIKSAAN tampering by {kp: ${req.user.kp}, kodFasiliti: ${req.user.kodFasiliti}} from ${req.ip}`
    );
    return res.status(403).json({
      msg: `${singlePersonSekolah.nama} telah diisi reten`,
    });
  }

  // BEGIN PATCH
  if (req.body.tarikhMelaksanakanBegin) {
    if (singlePersonSekolah.tarikhMelaksanakanBegin) {
      unauthorizedLogger.warn(
        `${req.method} ${req.url} [sekolahController - updatePersonSekolah] Unauthorized singlePersonSekolah ${singlePersonSekolah.nama} has BEGIN tampering by {kp: ${req.user.kp}, kodFasiliti: ${req.user.kodFasiliti}} from ${req.ip}`
      );
      return res.status(403).json({
        msg: `${singlePersonSekolah.nama} telah diisi BEGIN`,
      });
    }
    if (!singlePersonSekolah.pemeriksaanSekolah) {
      unauthorizedLogger.warn(
        `${req.method} ${req.url} [sekolahController - updatePersonSekolah] Unauthorized singlePersonSekolah ${singlePersonSekolah.nama} no PEMERIKSAAN for BEGIN tampering by {kp: ${req.user.kp}, kodFasiliti: ${req.user.kodFasiliti}} from ${req.ip}`
      );
      return res.status(403).json({
        msg: `${singlePersonSekolah.nama} belum diisi reten`,
      });
    }
    const updatedPersonSekolahBegin = await Sekolah.findOneAndUpdate(
      {
        _id: req.params.personSekolahId,
        sesiTakwimPelajar: sesiTakwim,
        deleted: false,
      },
      {
        $set: {
          tarikhMelaksanakanBegin: req.body.tarikhMelaksanakanBegin,
          namaPelaksanaBegin: req.body.namaPelaksanaBegin,
        },
      },
      { new: true }
    );
    return res.status(200).json({ updatedPersonSekolahBegin });
  }

  // const personSekolahExist = await Sekolah.findOne({
  //   nomborId: req.body.nomborId,
  //   sesiTakwimPelajar: sesiTakwim,
  //   berpindah: false,
  //   deleted: false,
  // });

  // if (
  //   personSekolahExist &&
  //   personSekolahExist.nomborId !== singlePersonSekolah.nomborId
  // ) {
  //   return res.status(409).json({
  //     msg: `Pelajar ini telah wujud di sekolah ${personSekolahExist.namaSekolah} bagi ${sesiTakwim}`,
  //   });
  // }

  // kemaskini pelajar PATCH
  if (req.body.umur <= 3) {
    return res.status(409).json({
      msg: 'Umur pelajar tidak boleh kurang daripada 3 tahun',
    });
  }

  const updatedPersonSekolah = await Sekolah.findOneAndUpdate(
    {
      _id: req.params.personSekolahId,
      sesiTakwimPelajar: sesiTakwim,
      deleted: false,
    },
    req.body,
    { new: true }
  );

  if (!updatedPersonSekolah) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personSekolahId}` });
  }

  res.status(200).json({ updatedPersonSekolah });
};

// PATCH /delete/:personSekolahId
const softDeletePersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const { deleteReason } = req.body;

  const singlePersonSekolah = await Sekolah.findOne({
    _id: req.params.personSekolahId,
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  }).populate('pemeriksaanSekolah');

  if (!singlePersonSekolah) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personSekolahId}` });
  }

  if (singlePersonSekolah.pemeriksaanSekolah) {
    unauthorizedLogger.warn(
      `${req.method} ${req.url} [sekolahController - softDeletePersonSekolah] Unauthorized singlePersonSekolah ${singlePersonSekolah.nama} has PEMERIKSAAN tampering by {kp: ${req.user.kp}, kodFasiliti: ${req.user.kodFasiliti}} from ${req.ip}`
    );
    return res.status(403).json({
      msg: `${singlePersonSekolah.nama} telah diisi reten`,
    });
  }

  const singlePersonSekolahToDelete = await Sekolah.findOneAndUpdate(
    {
      _id: req.params.personSekolahId,
      sesiTakwimPelajar: sesiTakwim,
      deleted: false,
    },
    {
      deleted: true,
      deleteReason,
      deletedForOfficer: `${req.body.createdByMdcMdtb} has deleted this pelajar`,
    },
    { new: true }
  );

  res.status(200).json({ singlePersonSekolahToDelete });
};

// PATCH /delete-filled/:personSekolahId
const softDeletePersonSekolahAfterFilled = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const { deleteReason } = req.body;

  const singlePersonSekolahToDeleteAfterFilled = await Sekolah.findOneAndUpdate(
    {
      _id: req.params.personSekolahId,
      sesiTakwimPelajar: sesiTakwim,
      deleted: false,
    },
    {
      deleted: true,
      deleteReason,
      deletedForOfficer: `${req.body.createdByMdcMdtb} has deleted this pelajar`,
    },
    { new: true }
  );

  res.status(200).json({ singlePersonSekolahToDeleteAfterFilled });
};

// PATCH /pemeriksaan/ubah/:pemeriksaanSekolahId
const updatePemeriksaanSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const createdSalahreten = {
    createdByUsernameSalah: req.body.createdByUsernameSalah,
    createdByMdcMdtbSalah: req.body.createdByMdcMdtbSalah,
    dataRetenSalah: req.body.dataRetenSalah,
  };

  const updatedSinglePemeriksaan = await Pemeriksaansekolah.findOneAndUpdate(
    { _id: req.params.pemeriksaanSekolahId },
    {
      // $set: {
      //   ...req.body,
      // },
      $push: {
        createdSalahreten: createdSalahreten,
      },
    },
    { new: true }
  );

  if (!updatedSinglePemeriksaan) {
    return res
      .status(404)
      .json({ msg: `No document with id ${req.params.pemeriksaanSekolahId}` });
  }

  res.status(200).json({ updatedSinglePemeriksaan });
};

// PATCH /rawatan/ubah/:rawatanSekolahId
const updateRawatanSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  const createdSalahreten = {
    createdByUsernameSalah: req.body.createdByUsernameSalah,
    createdByMdcMdtbSalah: req.body.createdByMdcMdtbSalah,
    dataRetenSalah: req.body.dataRetenSalah,
  };

  const updatedSingleRawatan = await Rawatansekolah.findOneAndUpdate(
    { _id: req.params.rawatanSekolahId },
    {
      // $set: {
      //   ...req.body,
      // },
      $push: {
        createdSalahreten: createdSalahreten,
      },
    },
    { new: true }
  );

  if (!updatedSingleRawatan) {
    return res
      .status(404)
      .json({ msg: `No document with id ${req.params.rawatanSekolahId}` });
  }

  res.status(200).json({ updatedSingleRawatan });
};

// not used
// PATCH /kotak/ubah/:kotakSekolahId
// kotak tak handle status rawatan
// const updateKotakSekolah = async (req, res) => {
//   if (req.user.accountType !== 'kpUser') {
//     return res.status(401).json({ msg: 'Unauthorized' });
//   }

//   const updatedSingleKotak = await Kotaksekolah.findOneAndUpdate(
//     { _id: req.params.kotakSekolahId },
//     req.body,
//     { new: true }
//   );

//   if (!updatedSingleKotak) {
//     return res
//       .status(404)
//       .json({ msg: `No document with id ${req.params.kotakSekolahId}` });
//   }

//   res.status(200).json({ updatedSingleKotak });
// };

// query /sekolah
const queryPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const sesiTakwim = sesiTakwimSekolah();

  const {
    user: { kp },
    query: { nama, nomborId, namaSekolah, tahunTingkatan, kelasPelajar },
  } = req;
  const queryObject = {
    statusRawatan: { $ne: 'belum mula' },
    sesiTakwimPelajar: sesiTakwim,
    deleted: false,
  };

  if (namaSekolah) {
    queryObject.namaSekolah = namaSekolah;
  }

  if (nama) {
    queryObject.nama = { $regex: nama, $options: 'i' };
  }

  if (nomborId) {
    queryObject.nomborId = { $regex: nomborId, $options: 'i' };
  }

  if (tahunTingkatan) {
    queryObject.tahunTingkatan = { $regex: tahunTingkatan, $options: 'i' };
  }

  // if (kelasPelajar) {
  //   queryObject.kelasPelajar = { $regex: kelasPelajar, $options: 'i' };
  // }

  const sekolahResultQuery = await Sekolah.find(queryObject)
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah');

  res.status(200).json({ sekolahResultQuery });
};

module.exports = {
  getAllPersonSekolahsVanilla,
  getSinglePersonSekolahVanilla,
  getAllPersonSekolahsWithPopulate,
  getSinglePersonSekolahWithPopulate,
  kemaskiniSenaraiPelajar,
  muatturunSenaraiPelajar,
  createPersonSekolah,
  createPemeriksaanWithSetPersonSekolah,
  createRawatanWithPushPersonSekolah,
  updateFasiliti,
  updatePersonSekolah,
  softDeletePersonSekolah,
  softDeletePersonSekolahAfterFilled,
  updatePemeriksaanSekolah,
  updateRawatanSekolah,
  queryPersonSekolah,
};

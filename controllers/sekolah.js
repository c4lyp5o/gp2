const https = require('https');
const axios = require('axios');
const fs = require('fs');
const async = require('async');
const path = require('path');
const Excel = require('exceljs');
const Sekolah = require('../models/Sekolah');
const Pemeriksaansekolah = require('../models/Pemeriksaansekolah');
const Rawatansekolah = require('../models/Rawatansekolah');
const Kotaksekolah = require('../models/Kotaksekolah');
const KohortKotak = require('../models/KohortKotak');
const Fasiliti = require('../models/Fasiliti');
const sesiTakwimSekolah = require('../controllers/helpers/sesiTakwimSekolah');
const insertToSekolah = require('../controllers/helpers/insertToSekolah');
const { generateRandomString } = require('./adminAPI');

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

  const allPersonSekolahs = await Sekolah.find({
    kodSekolah: { $in: [...kodSekolahs] },
    sesiTakwimPelajar: sesiTakwim,
  }).lean();

  res.status(200).json({ allPersonSekolahs, fasilitiSekolahs });
};

// not used
// GET /:personSekolahId
const getSinglePersonSekolahVanilla = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personSekolahId },
  } = req;

  const singlePersonSekolah = await Sekolah.findOne({ _id: personSekolahId });

  if (!singlePersonSekolah) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personSekolahId}` });
  }

  res.status(200).json({ singlePersonSekolah });
};

// GET /populate-satu-sekolah/:kodSekolah
const getAllPersonSekolahsWithPopulate = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kp, kodFasiliti } = req.user;
  const fasilitiSekolahs = await Fasiliti.findOne({
    handler: kp,
    kodFasilitiHandler: kodFasiliti,
    kodSekolah: req.params.kodSekolah,
    sesiTakwimSekolah: sesiTakwimSekolah(),
  });

  // const namaSekolahs = fasilitiSekolahs.reduce(
  //   (arrNamaSekolahs, singleFasilitiSekolah) => {
  //     if (!arrNamaSekolahs.includes(singleFasilitiSekolah.nama)) {
  //       arrNamaSekolahs.push(singleFasilitiSekolah.nama);
  //     }
  //     return arrNamaSekolahs.filter((valid) => valid);
  //   },
  //   ['']
  // );

  // const kodSekolahs = fasilitiSekolahs.reduce(
  //   (arrKodSekolahs, singleFasilitiSekolah) => {
  //     if (!arrKodSekolahs.includes(singleFasilitiSekolah.kodSekolah)) {
  //       arrKodSekolahs.push(singleFasilitiSekolah.kodSekolah);
  //     }
  //     return arrKodSekolahs.filter((valid) => valid);
  //   },
  //   ['']
  // );

  const allPersonSekolahs = await Sekolah.find({
    kodSekolah: req.params.kodSekolah,
    sesiTakwimPelajar: sesiTakwimSekolah(),
  })
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah')
    .sort({ nama: 1 });
  // .populate('kotakSekolah');

  res.status(200).json({ allPersonSekolahs, fasilitiSekolahs });
};

// not used
// GET /faceted/:kodSekolah
const getAllPersonSekolahFaceted = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kodFasiliti } = req.user;

  const { kodSekolah } = req.params;

  const dataSekolahDenganPelajar = await Fasiliti.aggregate([
    {
      $match: {
        kodFasilitiHandler: kodFasiliti,
        kodSekolah,
        sesiTakwimSekolah: sesiTakwimSekolah(),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
      },
    },
    {
      $facet: {
        fasilitiSekolahs: [],
        allPersonSekolahs: [
          {
            $lookup: {
              from: 'sekolahs',
              let: {
                kodSekolah: '$kodSekolah',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$kodSekolah', '$$kodSekolah'],
                        },
                        {
                          $eq: ['$sesiTakwimPelajar', sesiTakwimSekolah()],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    statusRawatan: 1,
                    idInstitusi: 1,
                    kodSekolah: 1,
                    namaSekolah: 1,
                    idIndividu: 1,
                    nomborId: 1,
                    nama: 1,
                    sesiTakwimPelajar: 1,
                    tahunTingkatan: 1,
                    kelasPelajar: 1,
                    jantina: 1,
                    statusOku: 1,
                    tarikhLahir: 1,
                    umur: 1,
                    keturunan: 1,
                    warganegara: 1,
                    berpindah: 1,
                    tarikhMelaksanakanBegin: 1,
                    namaPelaksanaBegin: 1,
                    kesSelesaiMmi: 1,
                    pemeriksaanSekolah: 1,
                    rawatanSekolah: 1,
                  },
                },
              ],
              as: 'sekolah',
            },
          },
          {
            $unwind: '$sekolah',
          },
          {
            $project: {
              _id: '$sekolah._id',
              // jenisFasiliti: 1,
              statusRawatan: '$sekolah.statusRawatan',
              idInstitusi: '$sekolah.idInstitusi',
              kodSekolah: '$sekolah.kodSekolah',
              namaSekolah: '$sekolah.namaSekolah',
              idIndividu: '$sekolah.idIndividu',
              nomborId: '$sekolah.nomborId',
              nama: '$sekolah.nama',
              sesiTakwimPelajar: '$sekolah.sesiTakwimPelajar',
              tahunTingkatan: '$sekolah.tahunTingkatan',
              kelasPelajar: '$sekolah.kelasPelajar',
              jantina: '$sekolah.jantina',
              statusOku: '$sekolah.statusOku',
              tarikhLahir: '$sekolah.tarikhLahir',
              umur: '$sekolah.umur',
              keturunan: '$sekolah.keturunan',
              warganegara: '$sekolah.warganegara',
              berpindah: '$sekolah.berpindah',
              tarikhMelaksanakanBegin: '$sekolah.tarikhMelaksanakanBegin',
              namaPelaksanaBegin: '$sekolah.namaPelaksanaBegin',
              kesSelesaiMmi: '$sekolah.kesSelesaiMmi',
              pemeriksaanSekolah: '$sekolah.pemeriksaanSekolah',
              rawatanSekolah: '$sekolah.rawatanSekolah',
            },
          },
          {
            $lookup: {
              from: 'pemeriksaansekolahs',
              localField: 'pemeriksaanSekolah',
              foreignField: '_id',
              as: 'pemeriksaanSekolah',
            },
          },
          {
            $unwind: {
              path: '$pemeriksaanSekolah',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'rawatansekolahs',
              localField: 'rawatanSekolah',
              foreignField: '_id',
              as: 'rawatanSekolah',
            },
          },
          {
            $sort: {
              nama: 1,
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    fasilitiSekolahs: dataSekolahDenganPelajar[0].fasilitiSekolahs,
    allPersonSekolahs: dataSekolahDenganPelajar[0].allPersonSekolahs,
  });
};

// GET /populate/:personSekolahId
const getSinglePersonSekolahWithPopulate = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const personSekolahWithPopulate = await Sekolah.findOne({
    _id: req.params.personSekolahId,
    sesiTakwimPelajar: sesiTakwimSekolah(),
  })
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah');
  // .populate('kotakSekolah');

  if (!personSekolahWithPopulate) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personSekolahId}` });
  }

  res.status(201).json({ personSekolahWithPopulate });
};

// GET /kemaskini/:fasilitiId
const kemaskiniSenaraiPelajar = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const fasilitiSekolah = await Fasiliti.findOne({
    _id: req.params.fasilitiId,
    sesiTakwimSekolah: sesiTakwimSekolah(),
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

// GET /muat-turun/:fasilitiId
const muatturunSenaraiPelajar = async (req, res) => {
  const { fasilitiId } = req.params;

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  let match_stage = {
    $match: {
      kodSekolah: fasilitiId,
    },
  };

  let project_stage = {
    $project: {
      nama: 1,
      nomborId: 1,
      tahunTingkatan: 1,
      namaSekolah: 1,
      kelasPelajar: 1,
      tarikhLahir: 1,
      umur: 1,
    },
  };

  try {
    const semuaPelajarSatuSekolah = await Sekolah.aggregate([
      match_stage,
      project_stage,
    ]);
    const semuaTahun = new Set(
      semuaPelajarSatuSekolah.map((budak) => budak.tahunTingkatan)
    );

    // dan tulislah segala yang akan berlaku sehingga hari kiamat
    let blank = path.join(__dirname, '..', 'public', 'exports', 'blank.xlsx');
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(blank);

    // delete the default worksheet
    workbook.removeWorksheet('Sheet1');

    for (const tahun of semuaTahun) {
      console.log(tahun);
      // create a blank worksheet with the name of our class
      const worksheet = workbook.addWorksheet(tahun);

      // filter the students based on their class
      const studentsInClass = semuaPelajarSatuSekolah.filter(
        (student) => student.tahunTingkatan === tahun
      );

      // console.log(studentsInClass);

      // add column headers
      worksheet.columns = [
        { header: 'Nama', key: 'nama', width: 30 },
        { header: 'Nombor ID', key: 'nomborId', width: 15 },
        { header: 'Kelas', key: 'kelasPelajar', width: 15 },
        { header: 'Tarikh Lahir', key: 'tarikhLahir', width: 15 },
        { header: 'Umur', key: 'umur', width: 15 },
      ];

      // add rows for students in current class
      worksheet.addRows(studentsInClass);

      // format the header row
      worksheet.getRow(1).font = { bold: true };

      // format all rows
      worksheet.eachRow((row, number) => {
        row.alignment = { vertical: 'middle', horizontal: 'center' };
        row.height = 30;
      });

      // format all columns
      worksheet.columns.forEach((column) => {
        column.width = column.header.length < 12 ? 12 : column.header.length;
      });
    }

    const listPelajar = makeFile();

    await workbook.xlsx.writeFile(listPelajar);
    const file = fs.readFileSync(path.resolve(process.cwd(), listPelajar));

    console.log(file);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=senarai-pelajar.xlsx'
    );
    const fileStream = fs.createReadStream(newfile);
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const makeFile = () => {
  return path.join(
    __dirname,
    '..',
    'public',
    'exports',
    `${generateRandomString(20)}.xlsx`
  );
};

// not used
// POST /
const createPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const personSekolah = await Sekolah.create(req.body);

  res.status(201).json({ personSekolah });
};

// POST /pemeriksaan/:personSekolahId
// set statusRawatan according to handleSubmit FE when creating pemeriksaan
const createPemeriksaanWithSetPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah, kp to each person sekolah when creating pemeriksaan
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;

  const pemeriksaanSekolah = await Pemeriksaansekolah.create(req.body);

  // masukkan pemeriksaan ID dalam personSekolah
  const personSekolah = await Sekolah.findOneAndUpdate(
    { _id: req.params.personSekolahId },
    {
      $set: {
        pemeriksaanSekolah: pemeriksaanSekolah._id,
        statusRawatan: req.body.statusRawatan,
        kesSelesaiMmi: req.body.kesSelesaiMmi,
      },
    },
    { new: true }
  );

  //set fasilitiSekolah's tarikhPemeriksaanSemasa from pemeriksaanSekolah only one personSekolah and not from latest
  if (req.body.tarikhPemeriksaanSemasa > 0) {
    await Fasiliti.findOneAndUpdate(
      {
        nama: personSekolah.namaSekolah,
        kodSekolah: personSekolah.kodSekolah,
      },
      {
        $set: {
          tarikhMulaSekolah: req.body.tarikhPemeriksaanSemasa,
        },
      },
      { new: true }
    );
  }

  // if bersediaDirujuk, masukkan dalam kohort kotak
  if (req.body.bersediaDirujuk === 'ya-bersedia-dirujuk') {
    await KohortKotak.create({
      createdByNegeri: req.user.negeri,
      createdByDaerah: req.user.daerah,
      createdByKp: req.user.kp,
      createdByKodFasiliti: req.user.kodFasiliti,
      // createdByUsername: req.body.createdByUsername,
      // createdByMdcMdtb: req.body.createdByMdcMdtb,
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
      // noTelefon: req.body.noTelMuridKotak,
      // dalamPemantauanKohort: 'JAN - JUN 2023', // default
    });
  }

  res.status(201).json({ personSekolah });
};

// POST /rawatan/:personSekolahId
const createRawatanWithPushPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah & kp to each person sekolah when creating rawatan
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;

  const rawatanSekolah = await Rawatansekolah.create(req.body);

  // masukkan rawatan ID dalam personSekolah
  const personSekolah = await Sekolah.findOneAndUpdate(
    { _id: req.params.personSekolahId },
    {
      $push: { rawatanSekolah: rawatanSekolah._id },
      $set: {
        statusRawatan: req.body.statusRawatan,
        kesSelesaiMmi: req.body.kesSelesaiMmi,
      },
    },
    { new: true }
  );

  // set fasilitiSekolah's begin to true
  if (
    req.body.yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ===
    'ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
  ) {
    await Fasiliti.findOneAndUpdate(
      {
        nama: personSekolah.namaSekolah,
        kodSekolah: personSekolah.kodSekolah,
      },
      { $set: { melaksanakanBegin: true } },
      { new: true }
    );
  }

  res.status(201).json({ personSekolah });
};

// not used
// POST /kotak/:personSekolahId
// kotak tak handle statusRawatan
const createKotakWithSetPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah, kp to each person sekolah when creating kotak
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;

  const kotakSekolah = await Kotaksekolah.create(req.body);

  // masukkan kotak ID dalam personSekolah
  const personSekolah = await Sekolah.findOneAndUpdate(
    { _id: req.params.personSekolahId },
    {
      $set: {
        kotakSekolah: kotakSekolah._id,
      },
    },
    { new: true }
  );

  res.status(201).json({ personSekolah });
};

// PATCH /fasiliti/:fasilitiId
const updateFasiliti = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const updatedFasiliti = await Fasiliti.findOneAndUpdate(
    { _id: req.params.fasilitiId },
    req.body,
    { new: true }
  );

  res.status(201).json({ updatedFasiliti });
};

// PATCH /ubah/:personSekolahId
const updatePersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const updatedPersonSekolah = await Sekolah.findOneAndUpdate(
    { _id: req.params.personSekolahId },
    req.body,
    { new: true }
  );

  if (!updatedPersonSekolah) {
    return res
      .status(404)
      .json({ msg: `No document with id ${req.params.personSekolahId}` });
  }

  res.status(200).json({ updatedPersonSekolah });
};

// PATCH /pemeriksaan/ubah/:pemeriksaanSekolahId?personSekolahId=
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
      $set: {
        ...req.body,
      },
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

  // const personSekolah = await Sekolah.findOneAndUpdate(
  //   { _id: req.query.personSekolahId },
  //   { $set: { statusRawatan: 'belum selesai' } }
  // );

  res.status(200).json({ updatedSinglePemeriksaan });
};

// not used
// PATCH /kotak/ubah/:kotakSekolahId
// kotak tak handle status rawatan
const updateKotakSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const updatedSingleKotak = await Kotaksekolah.findOneAndUpdate(
    { _id: req.params.kotakSekolahId },
    req.body,
    { new: true }
  );

  if (!updatedSingleKotak) {
    return res
      .status(404)
      .json({ msg: `No document with id ${req.params.kotakSekolahId}` });
  }

  res.status(200).json({ updatedSingleKotak });
};

// query /sekolah
const queryPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp },
    query: { nama, nomborId, namaSekolah, tahunTingkatan, kelasPelajar },
  } = req;
  const queryObject = {};

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

  if (kelasPelajar) {
    queryObject.kelasPelajar = { $regex: kelasPelajar, $options: 'i' };
  }

  const sekolahResultQuery = await Sekolah.find(queryObject)
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah')
    .populate('kotakSekolah');

  res.status(200).json({ sekolahResultQuery });
};

module.exports = {
  getAllPersonSekolahsVanilla,
  getSinglePersonSekolahVanilla,
  getAllPersonSekolahsWithPopulate,
  getAllPersonSekolahFaceted,
  getSinglePersonSekolahWithPopulate,
  kemaskiniSenaraiPelajar,
  muatturunSenaraiPelajar,
  createPersonSekolah,
  createPemeriksaanWithSetPersonSekolah,
  createRawatanWithPushPersonSekolah,
  createKotakWithSetPersonSekolah,
  updateFasiliti,
  updatePersonSekolah,
  updatePemeriksaanSekolah,
  updateKotakSekolah,
  queryPersonSekolah,
};

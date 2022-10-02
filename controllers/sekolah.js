const Sekolah = require('../models/Sekolah');
const Pemeriksaansekolah = require('../models/Pemeriksaansekolah');
const Rawatansekolah = require('../models/Rawatansekolah');
const Kotaksekolah = require('../models/Kotaksekolah');
const Fasiliti = require('../models/Fasiliti');

// GET /
const getAllPersonSekolahsVanilla = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kp } = req.user;
  const fasilitiSekolahs = await Fasiliti.find({
    handler: kp,
    jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
  });

  const namaSekolahs = fasilitiSekolahs.reduce(
    (arrNamaSekolahs, singleFasilitiSekolah) => {
      if (!arrNamaSekolahs.includes(singleFasilitiSekolah.nama)) {
        arrNamaSekolahs.push(singleFasilitiSekolah.nama);
      }
      return arrNamaSekolahs.filter((valid) => valid);
    },
    ['']
  );

  const allPersonSekolahs = await Sekolah.find({
    namaSekolah: { $in: [...namaSekolahs] },
  });

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

// GET /populate
const getAllPersonSekolahsWithPopulate = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kp } = req.user;
  const fasilitiSekolahs = await Fasiliti.find({
    handler: kp,
    jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
  });

  const namaSekolahs = fasilitiSekolahs.reduce(
    (arrNamaSekolahs, singleFasilitiSekolah) => {
      if (!arrNamaSekolahs.includes(singleFasilitiSekolah.nama)) {
        arrNamaSekolahs.push(singleFasilitiSekolah.nama);
      }
      return arrNamaSekolahs.filter((valid) => valid);
    },
    ['']
  );

  const kodSekolahs = fasilitiSekolahs.reduce(
    (arrKodSekolahs, singleFasilitiSekolah) => {
      if (!arrKodSekolahs.includes(singleFasilitiSekolah.kodSekolah)) {
        arrKodSekolahs.push(singleFasilitiSekolah.kodSekolah);
      }
      return arrKodSekolahs.filter((valid) => valid);
    },
    ['']
  );

  const allPersonSekolahs = await Sekolah.find({
    namaSekolah: { $in: [...namaSekolahs] },
    kodSekolah: { $in: [...kodSekolahs] },
  })
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah')
    .populate('kotakSekolah');

  res.status(200).json({ allPersonSekolahs, fasilitiSekolahs });
};

// GET /populate/:personSekolahId
const getSinglePersonSekolahWithPopulate = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const personSekolahWithPopulate = await Sekolah.findOne({
    _id: req.params.personSekolahId,
  })
    .populate('pemeriksaanSekolah')
    .populate('rawatanSekolah')
    .populate('kotakSekolah');

  if (!personSekolahWithPopulate) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personSekolahId}` });
  }

  res.status(201).json({ personSekolahWithPopulate });
};

// not used
// POST /
// will use for ERKM
const createPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const personSekolah = await Sekolah.create(req.body);

  res.status(201).json({ personSekolah });
};

// POST /pemeriksaan/:personSekolahId
// set statusRawatan to 'belum selesai' when creating pemeriksaan
const createPemeriksaanWithSetPersonSekolah = async (req, res) => {
  // associate negeri, daerah, kp to each person sekolah when creating pemeriksaan
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;

  const pemeriksaanSekolah = await Pemeriksaansekolah.create(req.body);

  // masukkan pemeriksaan ID dalam personSekolah
  const personSekolah = await Sekolah.findOneAndUpdate(
    { _id: req.params.personSekolahId },
    {
      $set: {
        pemeriksaanSekolah: pemeriksaanSekolah._id,
        statusRawatan: 'belum selesai',
      },
    },
    { new: true }
  );

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

  const rawatanSekolah = await Rawatansekolah.create(req.body);

  // masukkan rawatan ID dalam personSekolah
  const personSekolah = await Sekolah.findOneAndUpdate(
    { _id: req.params.personSekolahId },
    {
      $push: { rawatanSekolah: rawatanSekolah._id },
      $set: { statusRawatan: req.body.statusRawatan },
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

// PATCH /pemeriksaan/ubah/:pemeriksaanSekolahId?personSekolahId=
// reset statusRawatan to 'belum selesai'
const updatePemeriksaanSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const updatedSinglePemeriksaan = await Pemeriksaansekolah.findOneAndUpdate(
    { _id: req.params.pemeriksaanSekolahId },
    req.body,
    { new: true }
  );

  if (!updatedSinglePemeriksaan) {
    return res
      .status(404)
      .json({ msg: `No document with id ${req.params.pemeriksaanSekolahId}` });
  }

  const personSekolah = await Sekolah.findOneAndUpdate(
    { _id: req.query.personSekolahId },
    { $set: { statusRawatan: 'belum selesai' } }
  );

  // delete KOTAK if inginMelakukanIntervensiMerokok === tidak || ''
  if (
    personSekolah.kotakSekolah &&
    (req.body.inginMelakukanIntervensiMerokok === '' ||
      req.body.inginMelakukanIntervensiMerokok ===
        'tidak-ingin-melakukan-intervensi-merokok')
  ) {
    await Kotaksekolah.findOneAndRemove({
      _id: personSekolah.kotakSekolah._id,
    });
    await Sekolah.findOneAndUpdate(
      { _id: req.query.personSekolahId },
      { $unset: { kotakSekolah: 1 } }
    );
  }

  res.status(200).json({ updatedSinglePemeriksaan });
};

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

// not used
// query route
const queryPersonSekolah = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp },
    query: { namaSekolah, darjah, tingkatan, kelas },
  } = req;
  const queryObject = {};

  if (namaSekolah) {
    queryObject.namaSekolah = namaSekolah;
  }

  if (darjah) {
    queryObject.darjah = darjah;
  }

  if (tingkatan) {
    queryObject.tingkatan = tingkatan;
  }

  if (kelas) {
    queryObject.kelas = kelas;
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
  getSinglePersonSekolahWithPopulate,
  createPersonSekolah,
  createPemeriksaanWithSetPersonSekolah,
  createRawatanWithPushPersonSekolah,
  createKotakWithSetPersonSekolah,
  updatePemeriksaanSekolah,
  updateKotakSekolah,
  queryPersonSekolah,
};

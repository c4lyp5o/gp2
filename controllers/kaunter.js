const moment = require('moment');
const Umum = require('../models/Umum');
const Runningnumber = require('../models/Runningnumber');
const Event = require('../models/Event');
const Fasiliti = require('../models/Fasiliti');
const { logger } = require('../logs/logger');

// GET /:personKaunterId
const getSinglePersonKaunter = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kaunterController] getSinglePersonKaunter called`
  );
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const singlePersonKaunter = await Umum.findOne({
    _id: req.params.personKaunterId,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });

  if (!singlePersonKaunter) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personKaunterId}` });
  }

  res.status(201).json({ singlePersonKaunter });
};

// POST /
const createPersonKaunter = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kaunterController] createPersonKaunter called`
  );
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah, kp, tahunDaftar to each person umum for every creation
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;
  req.body.tahunDaftar = new Date().getFullYear();

  // converting tarikhKedatangan again at the backend just in case
  req.body.tarikhKedatangan = moment(req.body.tarikhKedatangan).format(
    'YYYY-MM-DD'
  );

  // handling baby of. kena buat system wide & sentiasa baru-kedatangan jugak untuk mengelakkan ic ibunya menjadi ulangan-kedatangan apabila didaftarkan sebagai pesakit biasa (Boss pun setuju)
  if (req.body.jenisIc === 'birth-of') {
    let currentRunningNumber = await Runningnumber.findOne({
      jenis: 'birth-of',
      tahun: new Date().getFullYear(),
    });
    if (!currentRunningNumber) {
      const newRunningNumber = await Runningnumber.create({
        runningnumber: 1,
        jenis: 'birth-of',
        tahun: new Date().getFullYear(),
      });
      req.body.ic = 'B/O ' + newRunningNumber.runningnumber + ' ' + req.body.ic;
    }
    if (currentRunningNumber) {
      currentRunningNumber.runningnumber += 1;
      await currentRunningNumber.save(),
        (req.body.ic =
          'B/O ' + currentRunningNumber.runningnumber + ' ' + req.body.ic);
    }
  }

  // system wide running number for tiada-pengenalan. Will be running for one whole year and patient will always be counted as baru-kedatangan (Boss said). It's also should be done here before finding personExist because if ic is empty string ('') it will cause duplication in finding
  if (req.body.jenisIc === 'tiada-pengenalan') {
    let currentRunningNumber = await Runningnumber.findOne({
      jenis: 'tiada-pengenalan',
      tahun: new Date().getFullYear(),
    });
    if (!currentRunningNumber) {
      const newRunningNumber = await Runningnumber.create({
        runningnumber: 1,
        jenis: 'tiada-pengenalan',
        tahun: new Date().getFullYear(),
      });
      req.body.ic = 'TIADA PENGENALAN ' + newRunningNumber.runningnumber;
    }
    if (currentRunningNumber) {
      currentRunningNumber.runningnumber += 1;
      await currentRunningNumber.save();
      req.body.ic = 'TIADA PENGENALAN ' + currentRunningNumber.runningnumber;
    }
  }

  // find if person already exist
  const personExist = await Umum.findOne({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    createdByKp: req.user.kp,
    createdByKodFasiliti: req.user.kodFasiliti,
    tahunDaftar: req.body.tahunDaftar,
    ic: req.body.ic,
    jenisFasiliti: req.body.jenisFasiliti,
    kodFasilitiKkKd: req.body.kodFasilitiKkKd,
    kodFasilitiTaskaTadika: req.body.kodFasilitiTaskaTadika,
    jenisProgram: req.body.jenisProgram,
    namaProgram: req.body.namaProgram,
  }).sort({ createdAt: -1 });

  // tagging person according to their status
  if (personExist) {
    logger.info(
      `[kaunterController] IC telah wujud. check status hapus dan status ulangan`
    );
    // see if it is deleted beforehand
    if (personExist.kedatangan === 'baru-kedatangan' && personExist.deleted) {
      logger.info(
        `[kaunterController] IC telah wujud tetapi dihapuskan pada kedatangan pertama. TAG: baru`
      );
      req.body.kedatangan = 'baru-kedatangan';
      req.body.noPendaftaranBaru = personExist.noPendaftaranBaru;
      req.body.deleted = true;
    }
    if (
      personExist.kedatangan === 'baru-kedatangan' &&
      !personExist.deleted &&
      personExist.statusKehadiran
    ) {
      logger.info(
        `[kaunterController] IC telah wujud tetapi tidak mendapatkan pemeriksaan pada kedatangan pertama. TAG: ulangan`
      );
      req.body.kedatangan = 'ulangan-kedatangan';
      req.body.noPendaftaranUlangan = personExist.noPendaftaranBaru;
      req.body.checkupEnabled = true;
    }
    if (
      personExist.kedatangan === 'baru-kedatangan' &&
      !personExist.deleted &&
      !personExist.statusKehadiran
    ) {
      logger.info(
        `[kaunterController] IC telah wujud dan telah mendapatkan pemeriksaan pada kedatangan pertama. TAG: ulangan`
      );
      req.body.kedatangan = 'ulangan-kedatangan';
      req.body.noPendaftaranUlangan = personExist.noPendaftaranBaru;
    }
    if (
      personExist.kedatangan === 'ulangan-kedatangan' &&
      !personExist.deleted &&
      !personExist.statusKehadiran
    ) {
      logger.info(
        `[kaunterController] IC telah wujud dan kedatangan ulangan. TAG: ulangan`
      );
      req.body.kedatangan = 'ulangan-kedatangan';
      req.body.noPendaftaranUlangan = personExist.noPendaftaranUlangan;
    }
  }

  if (!personExist) {
    logger.info(`[kaunterController] IC tidak wujud. TAG: baru`);
    req.body.kedatangan = 'baru-kedatangan';
  }

  const singlePersonKaunter = await Umum.create(req.body);

  res.status(201).json({ singlePersonKaunter });
};

// PATCH /:personKaunterId
const updatePersonKaunter = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kaunterController] updatePersonKaunter called`
  );
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { fromResit } = req.query;

  // converting tarikhKedatangan again at the backend just in case
  if (fromResit !== 'true') {
    req.body.tarikhKedatangan = moment(req.body.tarikhKedatangan).format(
      'YYYY-MM-DD'
    );
  }

  const updatedSinglePersonKaunter = await Umum.findOneAndUpdate(
    {
      _id: req.params.personKaunterId,
      tahunDaftar: new Date().getFullYear(),
      deleted: false,
    },
    req.body,
    { new: true }
  );

  if (!updatedSinglePersonKaunter) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personKaunterId}` });
  }

  res.status(200).json({ updatedSinglePersonKaunter });
};

// not used
// DELETE /:personKaunterId
const deletePersonKaunter = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const deletedSinglePersonUmum = await Umum.findOneAndRemove({
    _id: req.params.personKaunterId,
  });

  if (!deletedSinglePersonUmum) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personKaunterId} ` });
  }

  res.status(200).json({
    msg: `Person with id ${req.params.personKaunterId} succesfully deleted`,
  });
};

// check from db if ic is same
// GET /check
const getPersonFromCache = async (req, res) => {
  const { personKaunterId } = req.params;
  try {
    const person = await Umum.findOne({ ic: personKaunterId }, null, {
      sort: { _id: -1 },
    });
    return res.status(200).json({ person });
  } catch (error) {
    res.status(404).json({ msg: 'No person found' });
  }
};

// query /kaunter
const queryPersonKaunter = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp, kodFasiliti, daerah, negeri },
    query: {
      nama,
      tarikhKedatangan,
      jenisFasiliti,
      ic,
      jenisProgram,
      namaProgram,
    },
  } = req;

  const queryObject = {
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKp: kp,
    createdByKodFasiliti: kodFasiliti,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  };

  if (nama) {
    queryObject.nama = { $regex: nama, $options: 'i' };
  }

  if (tarikhKedatangan) {
    queryObject.tarikhKedatangan = tarikhKedatangan;
  }

  if (jenisFasiliti) {
    queryObject.jenisFasiliti = jenisFasiliti;
  }

  if (ic) {
    queryObject.ic = { $regex: ic, $options: 'i' };
  }

  if (jenisProgram) {
    queryObject.jenisProgram = jenisProgram;
  }

  if (namaProgram) {
    queryObject.namaProgram = namaProgram;
  }

  const kaunterResultQuery = await Umum.find(queryObject)
    .select(
      'tarikhKedatangan createdByUsername waktuSampai noPendaftaranBaru noPendaftaranUlangan nama ic umur bersekolah kumpulanEtnik ibuMengandung orangKurangUpaya statusPesara kakitanganKerajaan noTelefon noTelefon2 emel noBayaran noResit noBayaran2 noResit2 noBayaran3 noResit3 catatan statusReten jenisFasiliti namaFasilitiKkKd namaFasilitiTaskaTadika jenisProgram namaProgram'
    )
    .lean();

  res.status(200).json({ kaunterResultQuery });
};

// query /kaunter/kk-kd
const getKkKdList = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  logger.info(
    `${req.method} ${req.url} [kaunterController] getKkKdList called`
  );

  const kkKdAll = await Fasiliti.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    handler: req.user.kp,
    kodFasilitiHandler: req.user.kodFasiliti,
    jenisFasiliti: 'kkiakd',
    statusPerkhidmatan: 'active',
  });

  res.status(200).json({ kkKdAll });
};

// query /kaunter/taska-tadika
const getTaskaTadikaList = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  logger.info(
    `${req.method} ${req.url} [kaunterController] getTaskaTadikaList called`
  );

  const taskaTadikaAll = await Fasiliti.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    handler: req.user.kp,
    kodFasilitiHandler: req.user.kodFasiliti,
    jenisFasiliti: ['taska', 'tadika'],
    statusPerkhidmatan: 'active',
  });

  res.status(200).json({ taskaTadikaAll });
};

// query /kaunter/events
const getProjekKomuniti = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  logger.info(
    `${req.method} ${req.url} [kaunterController] getProjekKomuniti called`
  );

  const projekKomuniti = await Event.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    createdByKp: req.user.kp,
    createdByKodFasiliti: req.user.kodFasiliti,
    tarikhStart: { $nin: [null, ''] },
    tarikhEnd: { $nin: [null, ''] },
    tahunDibuat: new Date().getFullYear(),
  });

  res.status(200).json({ projekKomuniti });
};

module.exports = {
  getSinglePersonKaunter,
  createPersonKaunter,
  updatePersonKaunter,
  deletePersonKaunter,
  getPersonFromCache,
  queryPersonKaunter,
  getKkKdList,
  getTaskaTadikaList,
  getProjekKomuniti,
};

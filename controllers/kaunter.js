const Umum = require('../models/Umum');
const Runningnumber = require('../models/Runningnumber');
const Event = require('../models/Event');
const Fasiliti = require('../models/Fasiliti');
const logger = require('../logs/logger');
const LRU = require('lru-cache');
const axios = require('axios').default;

const options = {
  max: 5000,
  // for use with tracking overall storage size
  maxSize: 50000,
  sizeCalculation: (value, key) => {
    return 1;
  },
  ttl: 1000 * 60 * 60 * 24 * 30, // 30 days
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
  fetchMethod: async (key, staleValue, { options, signal }) => {},
};

const cache = new LRU(options);

// GET /:personKaunterId
const getSinglePersonKaunter = async (req, res) => {
  logger.info(`${req.method} ${req.url} getSinglePersonKaunter called`);
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
  logger.info(`${req.method} ${req.url} createPersonKaunter called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah, kp, tahunDaftar to each person umum for every creation
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;
  req.body.tahunDaftar = new Date().getFullYear();

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
  });

  // tagging person according to their status
  if (personExist) {
    logger.info(`${req.method} ${req.url} ic telah wujud. tagging ulangan`);
    req.body.kedatangan = 'ulangan-kedatangan';
    req.body.noPendaftaranUlangan = personExist.noPendaftaranBaru;
  }

  if (!personExist) {
    logger.info(`${req.method} ${req.url} ic tidak wujud. tagging baru`);
    console.log('belum wujud. tagging baru');
    req.body.kedatangan = 'baru-kedatangan';
  }

  logger.info(`${req.method} ${req.url} sending to cache`);
  // cache.set(req.body.ic, req.body);
  const resp = await axios.post(process.env.CACHE_SERVER_URL, req.body, {
    headers: {
      'x-api-key': process.env.CACHE_SERVER_PASS,
    },
  });

  const singlePersonKaunter = await Umum.create(req.body);

  res.status(201).json({ singlePersonKaunter });
};

// PATCH /:personKaunterId
const updatePersonKaunter = async (req, res) => {
  logger.info(`${req.method} ${req.url} updatePersonKaunter called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
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

// check from cache if ic is same
// GET /check
const getPersonFromCache = async (req, res) => {
  const { personKaunterId } = req.params;
  // const person = await cache.get(ic.toString());
  try {
    const { data } = await axios.get(
      process.env.CACHE_SERVER_URL + `?pid=${personKaunterId}`,
      {
        headers: {
          'x-api-key': process.env.CACHE_SERVER_PASS,
        },
      }
    );
    return res.status(200).json({ person: data });
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

  const queryObject = {};
  queryObject.createdByNegeri = negeri;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByKp = kp;
  queryObject.createdByKodFasiliti = kodFasiliti;
  queryObject.tahunDaftar = new Date().getFullYear();
  queryObject.deleted = false;

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
    queryObject.ic = ic;
  }

  if (jenisProgram) {
    queryObject.jenisProgram = jenisProgram;
  }

  if (namaProgram) {
    queryObject.namaProgram = namaProgram;
  }

  const kaunterResultQuery = await Umum.find(queryObject);

  res.status(200).json({ kaunterResultQuery });
};

// query /kaunter/kk-kd
const getKkKdList = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

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
  logger.info(`${req.method} ${req.url} getProjekKomuniti called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

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

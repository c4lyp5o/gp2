const Umum = require('../models/Umum');
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
  });

  if (!singlePersonKaunter) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personKaunterId}` });
  }

  // decrypt
  // const decryptedIc = cryptoJs.AES.decrypt(
  //   singlePersonKaunter.ic,
  //   process.env.CRYPTO_JS_SECRET
  // ).toString(cryptoJs.enc.Utf8);
  // singlePersonKaunter.ic = decryptedIc;

  res.status(201).json({ singlePersonKaunter });
};

// POST /
const createPersonKaunter = async (req, res) => {
  logger.info(`${req.method} ${req.url} createPersonKaunter called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah & kp to each person umum for every creation
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;

  // find if person already exist using ic
  const personExist = await Umum.findOne({
    ic: req.body.ic,
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    createdByKp: req.user.kp,
    createdByKodFasiliti: req.user.kodFasiliti,
    jenisFasiliti: req.body.jenisFasiliti,
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
  const resp = await axios.post(
    'https://erkm.calypsocloud.one/cache',
    req.body,
    {
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );

  const singlePersonKaunter = await Umum.create(req.body);

  res.status(201).json({ singlePersonKaunter });
};

// PATCH /:personKaunterId
const updatePersonKaunter = async (req, res) => {
  logger.info(`${req.method} ${req.url} updatePersonKaunter called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // encrypt
  // const encryptedIc = cryptoJs.AES.encrypt(
  //   req.body.ic,
  //   process.env.CRYPTO_JS_SECRET
  // ).toString();
  // req.body.ic = encryptedIc;

  const updatedSinglePersonKaunter = await Umum.findOneAndUpdate(
    { _id: req.params.personKaunterId },
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
  queryObject.createdByKp = kp;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByNegeri = negeri;
  queryObject.createdByKodFasiliti = kodFasiliti;

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
  });

  res.status(200).json({ taskaTadikaAll });
};

// TODO to refactor for prefix /kaunter & recheck who else using this controller
// query /events
const getProjekKomuniti = async (req, res) => {
  logger.info(`${req.method} ${req.url} getProjekKomuniti called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const projekKomuniti = await Event.find({
    createdByKp: req.user.kp,
    createdByKodFasiliti: req.user.kodFasiliti,
    createdByDaerah: req.user.daerah,
    createdByNegeri: req.user.negeri,
  });

  res.status(200).json({ projekKomuniti });
};

// check from cache if ic is same
// GET /check
const getPersonFromCache = async (req, res) => {
  const { personKaunterId } = req.params;
  // const person = await cache.get(ic.toString());
  try {
    const { data } = await axios.get(
      `https://erkm.calypsocloud.one/cache?pid=${personKaunterId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return res.status(200).json({ person: data });
  } catch (error) {
    res.status(404).json({ msg: 'No person found' });
  }
};

module.exports = {
  getSinglePersonKaunter,
  createPersonKaunter,
  updatePersonKaunter,
  deletePersonKaunter,
  queryPersonKaunter,
  getTaskaTadikaList,
  getProjekKomuniti,
  getPersonFromCache,
};

const Umum = require('../models/Umum');
const Event = require('../models/Event');
const Fasiliti = require('../models/Fasiliti');
const logger = require('../logs/logger');
const LRU = require('lru-cache');
const cryptoJs = require('crypto-js');

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
  const decryptedIc = cryptoJs.AES.decrypt(
    singlePersonKaunter.ic,
    process.env.CRYPTO_JS_SECRET
  ).toString(cryptoJs.enc.Utf8);
  singlePersonKaunter.ic = decryptedIc;

  res.status(201).json({ singlePersonKaunter });
};

// GET
const getProjekKomuniti = async (req, res) => {
  logger.info(`${req.method} ${req.url} getProjekKomuniti called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const projekKomuniti = await Event.find({
    createdByKp: req.user.kp,
    createdByDaerah: req.user.daerah,
    createdByNegeri: req.user.negeri,
  });

  res.status(200).json({ projekKomuniti });
};

// POST /
const createPersonKaunter = async (req, res) => {
  logger.info(`${req.method} ${req.url} createPersonKaunter called`);
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah & kp to each person sekolah for every creation
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;

  // generate unique id
  let uniqueId = '';
  const simplifiedKp = req.body.createdByKp.split(' ');
  for (let i = 0; i < simplifiedKp.length; i++) {
    uniqueId += simplifiedKp[i].charAt(0);
  }
  uniqueId += '-';
  const simplifiedName = req.body.nama.split(' ');
  for (let i = 0; i < simplifiedName.length; i++) {
    uniqueId += simplifiedName[i].charAt(0);
  }
  uniqueId += '-';
  const dateOfBirth = req.body.tarikhLahir.split('-').join('');
  uniqueId += dateOfBirth;

  // tagging unique id
  req.body.uniqueId = uniqueId;
  logger.info(`${req.method} ${req.url} uniqueId: ${uniqueId} generated`);

  // find if person already exist using unique id
  const personExist = await Umum.findOne({
    uniqueId: uniqueId,
    jenisFasiliti: req.body.jenisFasiliti,
  });

  // tagging person according to their status
  if (personExist) {
    logger.info(
      `${req.method} ${req.url} unique id yang sama telah wujud. check ic sama atau tidak`
    );
    console.log('unique id yang sama telah wujud. check ic sama atau tidak');
    const decryptedIc = cryptoJs.AES.decrypt(
      personExist.ic,
      process.env.CRYPTO_JS_SECRET
    ).toString(cryptoJs.enc.Utf8);
    console.log('ic', decryptedIc);
    if (decryptedIc === req.body.ic) {
      logger.info(`${req.method} ${req.url} ic sama. tagging ulangan`);
      console.log('ic sama. tagging ulangan');
      req.body.kedatangan = 'ulangan-kedatangan';
      req.body.noPendaftaranUlangan = personExist.noPendaftaranBaru;
    }
    if (decryptedIc !== req.body.ic) {
      logger.info(`${req.method} ${req.url} ic tidak sama`);
      console.log('ic tidak sama');
      const last4digitIc = req.body.ic.slice(-4);
      console.log('last4digitIc', last4digitIc);
      uniqueId += '-' + last4digitIc;
      logger.info(`${req.method} ${req.url} uniqueId: ${uniqueId} generated`);
      console.log('uniqueId', uniqueId);
      // check person with new unique id
      const personExistWithNewUniqueId = await Umum.findOne({
        uniqueId: uniqueId,
        jenisFasiliti: req.body.jenisFasiliti,
      });
      if (personExistWithNewUniqueId) {
        logger.info(
          `${req.method} ${req.url} unique id yang sama telah wujud. tagging ulangan`
        );
        console.log('unique id baru yang sama telah wujud. tagging ulangan');
        req.body.kedatangan = 'ulangan-kedatangan';
        req.body.noPendaftaranUlangan =
          personExistWithNewUniqueId.noPendaftaranBaru;
      }
      if (!personExistWithNewUniqueId) {
        console.log('unique id baru yang sama tidak wujud. tagging baru');
        req.body.uniqueId = uniqueId;
        req.body.kedatangan = 'baru-kedatangan';
      }
    }
  }

  if (!personExist) {
    logger.info(`${req.method} ${req.url} unique id tidak wujud. tagging baru`);
    console.log('belum wujud. tagging baru');
    req.body.kedatangan = 'baru-kedatangan';
  }

  // encrypt
  const encryptedIc = cryptoJs.AES.encrypt(
    req.body.ic,
    process.env.CRYPTO_JS_SECRET
  ).toString();

  // send to cache before encrypting
  logger.info(`${req.method} ${req.url} sending to cache`);
  cache.set(req.body.ic, req.body);

  // replace ic with encrypted ic
  req.body.ic = encryptedIc;

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
  const encryptedIc = cryptoJs.AES.encrypt(
    req.body.ic,
    process.env.CRYPTO_JS_SECRET
  ).toString();
  req.body.ic = encryptedIc;

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

// query route
const queryPersonKaunter = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp },
    query: { nama, tarikhKedatangan, jenisFasiliti, uniqueId },
  } = req;

  const queryObject = {};
  queryObject.createdByKp = kp;

  if (nama) {
    queryObject.nama = { $regex: nama, $options: 'i' };
  }

  if (tarikhKedatangan) {
    queryObject.tarikhKedatangan = tarikhKedatangan;
  }

  if (jenisFasiliti) {
    queryObject.jenisFasiliti = jenisFasiliti;
  }

  if (uniqueId) {
    queryObject.uniqueId = uniqueId;
  }

  const kaunterResultQuery = await Umum.find(queryObject);

  // decrypt
  kaunterResultQuery.forEach((p) => {
    const decryptedIc = cryptoJs.AES.decrypt(
      p.ic,
      process.env.CRYPTO_JS_SECRET
    ).toString(cryptoJs.enc.Utf8);
    p.ic = decryptedIc;
  });

  res.status(200).json({ kaunterResultQuery });
};

// query /taska-tadika
const getTaskaTadikaList = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const taskaTadikaAll = await Fasiliti.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    handler: req.user.kp,
    jenisFasiliti: ['taska', 'tadika'],
  });

  res.status(200).json({ taskaTadikaAll });
};

// get from cache if ic is same
const getPersonFromCache = async (req, res) => {
  const { ic } = req.body;
  const person = await cache.get(ic.toString());
  if (person) {
    return res.status(200).json({ person });
  }
  res.status(404).json({ msg: 'No person found' });
};

module.exports = {
  getSinglePersonKaunter,
  createPersonKaunter,
  updatePersonKaunter,
  deletePersonKaunter,
  queryPersonKaunter,
  getProjekKomuniti,
  getTaskaTadikaList,
  getPersonFromCache,
};

const Umum = require('../models/Umum');
const Fasiliti = require('../models/Fasiliti');
const cryptoJs = require('crypto-js');

// GET /:personKaunterId
const getSinglePersonKaunter = async (req, res) => {
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

// POST /
const createPersonKaunter = async (req, res) => {
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

  // find if person already exist using unique id
  const personExist = await Umum.findOne({
    uniqueId: uniqueId,
    jenisFasiliti: req.body.jenisFasiliti,
  });

  // tagging person according to their status
  if (personExist) {
    console.log('telah wujud. tagging ulangan');
    req.body.kedatangan = 'ulangan-kedatangan';
    req.body.noPendaftaranUlangan = personExist.noPendaftaranBaru;
  }
  if (!personExist) {
    console.log('belum wujud. tagging baru dalam pre');
    req.body.kedatangan = 'baru-kedatangan';
  }

  // encrypt
  const encryptedIc = cryptoJs.AES.encrypt(
    req.body.ic,
    process.env.CRYPTO_JS_SECRET
  ).toString();
  req.body.ic = encryptedIc;

  const singlePersonKaunter = await Umum.create(req.body);

  res.status(201).json({ singlePersonKaunter });
};

// PATCH /:personKaunterId
const updatePersonKaunter = async (req, res) => {
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
    query: { nama, tarikhKedatangan, jenisFasiliti },
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

module.exports = {
  getSinglePersonKaunter,
  createPersonKaunter,
  updatePersonKaunter,
  deletePersonKaunter,
  queryPersonKaunter,
  getTaskaTadikaList,
};

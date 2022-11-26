const Umum = require('../models/Umum');
const Operator = require('../models/Operator');
const Fasiliti = require('../models/Fasiliti');
const cryptoJs = require('crypto-js');

// GET /
const getAllPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kp } = req.user;

  const allPersonUmum = await Umum.find({ createdByKp: kp });

  res.status(200).json({ allPersonUmum });
};

// GET /:id
const getSinglePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  const singlePersonUmum = await Umum.findOne({ _id: personUmumId });

  if (!singlePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  // decrypt KIV
  // const decryptedIc = cryptoJs.AES.decrypt(
  //   singlePersonUmum.ic,
  //   process.env.CRYPTO_JS_SECRET
  // ).toString(cryptoJs.enc.Utf8);
  // singlePersonUmum.ic = decryptedIc;

  res.status(200).json({ singlePersonUmum });
};

// PATCH /:id
const updatePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  // associate negeri, daerah & kp to each person sekolah for every update
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;

  // encrypt KIV
  // if (req.body.ic) {
  //   const encryptedIc = cryptoJs.AES.encrypt(
  //     req.body.ic,
  //     process.env.CRYPTO_JS_SECRET
  //   ).toString();
  //   req.body.ic = encryptedIc;
  // }

  if (req.body.statusReten === 'telah diisi') {
    let summary = {};
    let shortened = {};
    Object.keys(req.body).forEach((key) => {
      if (
        key !== '' ||
        key !== null ||
        key !== undefined ||
        key !== 0 ||
        key !== false
      ) {
        shortened[key] = req.body[key];
      }
    });
    const singlePersonInfo = await Umum.findById({ _id: personUmumId });
    summary = { ...singlePersonInfo._doc, ...shortened };
    const updatedOfficerSummary = await Operator.findOneAndUpdate(
      {
        nomborMdc: req.body.createdByMdcMdtb,
      },
      { $push: { summary } },
      { new: true }
    );
  }

  const updatedSinglePersonUmum = await Umum.findOneAndUpdate(
    { _id: personUmumId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedSinglePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ updatedSinglePersonUmum });
};

// DELETE /:id
const deletePersonUmum = async (req, res) => {
  const {
    params: { id: personUmumId },
  } = req;

  const deletedSinglePersonUmum = await Umum.findOneAndDelete({
    _id: personUmumId,
  });

  res.status(200).json({ deletedSinglePersonUmum });
};

// query route
const queryPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp },
    query: { nama, tarikhKedatangan, jenisFasiliti, jenisProgram },
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

  if (jenisProgram) {
    queryObject.jenisProgram = jenisProgram;
  }

  const umumResultQuery = await Umum.find(queryObject);

  // decrypt KIV
  // umumResultQuery.forEach((p) => {
  //   const decryptedIc = cryptoJs.AES.decrypt(
  //     p.ic,
  //     process.env.CRYPTO_JS_SECRET
  //   ).toString(cryptoJs.enc.Utf8);
  //   p.ic = decryptedIc;
  // });

  res.status(200).json({ umumResultQuery });
};

// query /taska-tadika
const getTaskaTadikaList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
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
  getAllPersonUmum,
  getSinglePersonUmum,
  updatePersonUmum,
  deletePersonUmum,
  queryPersonUmum,
  getTaskaTadikaList,
};

const Umum = require('../models/Umum');
const cryptoJs = require('crypto-js');

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

  // decrypt
  const decryptedIc = cryptoJs.AES.decrypt(
    singlePersonUmum.ic,
    process.env.CRYPTO_JS_SECRET
  ).toString(cryptoJs.enc.Utf8);
  singlePersonUmum.ic = decryptedIc;

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

  // encrypt
  if (req.body.ic) {
    const encryptedIc = cryptoJs.AES.encrypt(
      req.body.ic,
      process.env.CRYPTO_JS_SECRET
    ).toString();
    req.body.ic = encryptedIc;
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

// query route
const queryPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
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

  const umumResultQuery = await Umum.find(queryObject);

  // decrypt
  umumResultQuery.forEach((p) => {
    const decryptedIc = cryptoJs.AES.decrypt(
      p.ic,
      process.env.CRYPTO_JS_SECRET
    ).toString(cryptoJs.enc.Utf8);
    p.ic = decryptedIc;
  });

  res.status(200).json({ umumResultQuery });
};

module.exports = { getSinglePersonUmum, updatePersonUmum, queryPersonUmum };

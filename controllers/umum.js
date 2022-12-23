const Umum = require('../models/Umum');
const Operator = require('../models/Operator');
const Fasiliti = require('../models/Fasiliti');

// GET /
const getAllPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kp, kodFasiliti } = req.user;

  const allPersonUmum = await Umum.find({
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKp: kp,
    createdByKodFasiliti: kodFasiliti,
  });

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

  // associate negeri, daerah & kp to each person umum for every update
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;

  // save summary of patient history to each operator
  let summary = {};
  let shortened = {};
  Object.keys(req.body).forEach((key) => {
    if (
      key !== '' ||
      key !== '' ||
      key !== null ||
      key !== undefined ||
      key !== 0 ||
      key !== false
    ) {
      shortened[key] = req.body[key];
    }
  });
  const singlePersonUmum = await Umum.findById({ _id: personUmumId });
  summary = { ...singlePersonUmum._doc, ...shortened };
  let regNum = {};
  if (req.body.createdByMdcMdtb.includes('MDTB') === false) {
    console.log('is pp');
    regNum = { mdcNumber: req.body.createdByMdcMdtb };
  }
  if (req.body.createdByMdcMdtb.includes('MDTB') === true) {
    console.log('is jp');
    regNum = { mdtbNumber: req.body.createdByMdcMdtb };
  }
  const updatedOfficerSummary = await Operator.findOneAndUpdate(
    regNum,
    { $push: { summary } },
    { new: true }
  );

  // handling rawatan operator lain
  if (req.query.operatorLain === 'rawatan-operator-lain') {
    if (req.body.statusReten === 'telah diisi') {
      const updatedStatusReten = await Umum.findOneAndUpdate(
        { _id: personUmumId },
        { $set: { statusReten: req.body.statusReten } },
        { new: true }
      );
    }

    const updatedSinglePersonUmumRawatanOperatorLain =
      await Umum.findOneAndUpdate(
        { _id: personUmumId },
        { $push: { rawatanOperatorLain: summary } },
        { new: true }
      );

    return res.status(200).json({ updatedSinglePersonUmumRawatanOperatorLain });
  }

  // default initial reten
  const updatedSinglePersonUmum = await Umum.findOneAndUpdate(
    { _id: personUmumId },
    req.body,
    { new: true }
  );

  if (!updatedSinglePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ updatedSinglePersonUmum });
};

// PATCH /delete/:id
const softDeletePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  const { deleteReason } = req.body;

  const singlePersonUmum = await Umum.findOne({ _id: personUmumId });

  if (!singlePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  const singlePersonUmumToDelete = await Umum.findByIdAndUpdate(
    { _id: personUmumId },
    {
      deleted: true,
      deleteReason,
      deletedForOfficer: `${req.body.createdByMdcMdtb} has deleted this patient for ${singlePersonUmum.createdByMdcMdtb}`,
    },
    { new: true }
  );

  res.status(200).json({ singlePersonUmumToDelete });
};

// not used
// DELETE /:id (hard delete)
const deletePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  const deletedSinglePersonUmum = await Umum.findOneAndDelete({
    _id: personUmumId,
  });

  if (!deletedSinglePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ deletedSinglePersonUmum });
};

// query /umum
const queryPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { negeri, daerah, kp, kodFasiliti },
    query: { nama, tarikhKedatangan, jenisFasiliti, jenisProgram },
  } = req;
  const queryObject = {};
  queryObject.createdByNegeri = negeri;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByKp = kp;
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

  if (jenisProgram) {
    queryObject.jenisProgram = jenisProgram;
  }

  const umumResultQuery = await Umum.find(queryObject);

  res.status(200).json({ umumResultQuery });
};

// query /umum/taska-tadika
const getTaskaTadikaList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
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

module.exports = {
  getAllPersonUmum,
  getSinglePersonUmum,
  updatePersonUmum,
  deletePersonUmum,
  softDeletePersonUmum,
  queryPersonUmum,
  getTaskaTadikaList,
};

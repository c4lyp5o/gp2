const PromosiType = require('../models/PromosiType');
const Promosi = require('../models/Promosi');

// GET /
const getAllProgramPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const types = await PromosiType.find({ nama: 'current' });
  const { program } = types[0];

  res.status(200).json({ allProgramPromosi: program });
};

// not used
// GET /aktviti
const getAllAktivitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kp } = req.user;

  const allAktivitPromosi = await Promosi.find({
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKp: kp,
  });

  res.status(200).json({ allAktivitPromosi });
};

// GET /aktiviti/:aktivitiId
const getSingleAktivitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const singleAktivitiPromosi = await Promosi.findOne({
    _id: req.params.aktivitiId,
  });

  if (!singleAktivitiPromosi) {
    return res
      .status(404)
      .json({ msg: `No aktiviti with id ${req.params.aktivitiId}` });
  }

  res.status(200).json({ singleAktivitiPromosi });
};

// POST /aktiviti
const createAktivitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // associate negeri, daerah & kp to each aktiviti for every creation
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;

  const singleAktivitiPromosi = await Promosi.create(req.body);

  res.status(201).json({ singleAktivitiPromosi });
};

// PATCH /aktiviti/:aktivitiId
const updateAktvitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const updatedSingleAktivitiPromosi = await Promosi.findOneAndUpdate(
    { _id: req.params.aktivitiId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedSingleAktivitiPromosi) {
    return res
      .status(404)
      .json({ msg: `No aktiviti with id ${req.params.aktivitiId}` });
  }

  res.status(200).json({ updatedSingleAktivitiPromosi });
};

// DELETE /aktiviti/:aktivitiId
const deleteAktvitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const deletedAktvitiPromosi = await Promosi.findOneAndUpdate({
    _id: req.params.aktivitiId,
  });

  if (!deletedAktvitiPromosi) {
    return res
      .status(404)
      .json({ msg: `No aktiviti with id ${req.params.aktivitiId}` });
  }

  res.status(200).json({ deletedAktvitiPromosi });
};

// query /promosi
const queryAktivitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { negeri, daerah, kp },
    query: { kodProgram },
  } = req;
  const queryObject = {};
  queryObject.createdByNegeri = negeri;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByKp = kp;

  if (kodProgram) {
    queryObject.kodProgram = kodProgram;
  }
  if (!kodProgram) {
    return res.status(200).json({ aktivitiPromosiResultQuery: [] });
  }

  const aktivitiPromosiResultQuery = await Promosi.find(queryObject);

  res.status(200).json({ aktivitiPromosiResultQuery });
};

module.exports = {
  getAllProgramPromosi,
  getAllAktivitiPromosi,
  getSingleAktivitiPromosi,
  createAktivitiPromosi,
  updateAktvitiPromosi,
  deleteAktvitiPromosi,
  queryAktivitiPromosi,
};

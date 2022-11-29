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

// GET /akvtiviti/:aktivitiId
// HERE..

// POST /aktiviti
const createAktivitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;

  const singleAktivitiPromosi = await Promosi.create(req.body);

  res.status(201).json({ singleAktivitiPromosi });
};

// PATCH /aktviti/:aktivitiId
// HERE..

// query route /promosi
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
  createAktivitiPromosi,
  queryAktivitiPromosi,
};

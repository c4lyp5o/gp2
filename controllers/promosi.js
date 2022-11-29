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

// GET /aktviti
// HERE..

// GET /akvtivit/:aktivitiId
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
const getAktivitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const aktivitiPromosi = { yo: 'sup' };

  res.status(200).json({ aktivitiPromosi });
};

module.exports = {
  getAllProgramPromosi,
  createAktivitiPromosi,
  getAktivitiPromosi,
};

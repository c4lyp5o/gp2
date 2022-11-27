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

// POST /aktiviti/:aktivitiId
// HERE..

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
  getAktivitiPromosi,
};

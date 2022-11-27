const PromosiTypeJSON = require('../models/PromosiType.json');
const PromosiType = require('../models/PromosiType');
const Promosi = require('../models/Promosi');

// query /promosi
const getProgramPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    query: { kodProgram, jenisProgram, namaProgram },
  } = req;
  const queryObject = {};

  if (kodProgram) {
    queryObject.kodProgram = kodProgram;
  }

  if (jenisProgram) {
    queryObject.jenisProgram = jenisProgram;
  }

  if (namaProgram) {
    queryObject.namaProgram = namaProgram;
  }

  const types = await PromosiType.find({ nama: 'current' });
  const { program } = types[0];

  const filteredProgramPromosi = program.filter((p) => {
    return (
      p.kodProgram === queryObject.kodProgram ||
      p.jenisProgram === queryObject.jenisProgram ||
      p.namaProgram === queryObject.namaProgram
    );
  });

  if (!kodProgram && !jenisProgram && !namaProgram) {
    return res.status(200).json({ filteredProgramPromosi: program });
  }

  res.status(200).json({ filteredProgramPromosi });
};

// query route /promosi/aktiviti
const getAktivitiPromosi = async (req, res) => {
  // if (req.user.accountType !== 'kpUser') {
  //   return res.status(401).json({ msg: 'Unauthorized' });
  // }

  const aktivitiPromosi = { yo: 'sup' };

  res.status(200).json({ aktivitiPromosi });
};

module.exports = {
  getProgramPromosi,
  getAktivitiPromosi,
};

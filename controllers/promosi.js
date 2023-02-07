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

  const { negeri, daerah, kp, kodFasiliti } = req.user;

  const allAktivitPromosi = await Promosi.find({
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKp: kp,
    createdByKodFasiliti: kodFasiliti,
    tahunDibuat: new Date().getFullYear(),
    deleted: false,
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
    tahunDibuat: new Date().getFullYear(),
    deleted: false,
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

  // associate negeri, daerah, kp, tahunDibuat to each aktiviti for every creation
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;
  req.body.tahunDibuat = new Date().getFullYear();

  const singleAktivitiPromosi = await Promosi.create(req.body);

  res.status(201).json({ singleAktivitiPromosi });
};

// PATCH /aktiviti/:aktivitiId
const updateAktvitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const updatedSingleAktivitiPromosi = await Promosi.findOneAndUpdate(
    {
      _id: req.params.aktivitiId,
      tahunDibuat: new Date().getFullYear(),
      deleted: false,
    },
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

// PATCH /aktiviti/delete/:aktivitiId
const softDeleteAktivitiPromosi = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { deleteReason } = req.body;

  const singleAktivitiPromosi = await Promosi.findOne({
    _id: req.params.aktivitiId,
    tahunDibuat: new Date().getFullYear(),
    deleted: false,
  });

  if (!singleAktivitiPromosi) {
    return res
      .status(404)
      .json({ msg: `No aktiviti with id ${req.params.aktivitiId}` });
  }

  const singleAktivitiPromosiToDelete = await Promosi.findOneAndUpdate(
    {
      _id: req.params.aktivitiId,
      tahunDibuat: new Date().getFullYear(),
      deleted: false,
    },
    {
      deleted: true,
      deleteReason,
      deletedForOfficer: `${req.body.createdByMdcMdtb} has deleted this aktiviti promosi for ${singleAktivitiPromosi.createdByMdcMdtb}`,
    },
    { new: true }
  );

  res.status(200).json({ singleAktivitiPromosiToDelete });
};

// not used
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
    user: { negeri, daerah, kp, kodFasiliti },
    query: { kodProgram, individuOrKlinik },
  } = req;
  const queryObject = {};
  queryObject.createdByNegeri = negeri;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByKp = kp;
  queryObject.createdByKodFasiliti = kodFasiliti;
  queryObject.tahunDibuat = new Date().getFullYear();
  queryObject.deleted = false;

  if (individuOrKlinik === 'promosi-individu') {
    queryObject.promosiIndividu = true;
    queryObject.promosiKlinik = false;
  }

  if (individuOrKlinik === 'promosi-klinik') {
    queryObject.promosiIndividu = false;
    queryObject.promosiKlinik = true;
  }

  // if (kodProgram) {
  //   queryObject.kodProgram = kodProgram;
  // }
  // if (!kodProgram) {
  //   return res.status(200).json({ aktivitiPromosiResultQuery: [] });
  // }

  const aktivitiPromosiResultQuery = await Promosi.find(queryObject);

  res.status(200).json({ aktivitiPromosiResultQuery });
};

module.exports = {
  getAllProgramPromosi,
  getAllAktivitiPromosi,
  getSingleAktivitiPromosi,
  createAktivitiPromosi,
  updateAktvitiPromosi,
  softDeleteAktivitiPromosi,
  deleteAktvitiPromosi,
  queryAktivitiPromosi,
};

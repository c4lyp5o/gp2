const moment = require('moment');
const KohortKotak = require('../models/KohortKotak');
// kohort lain
// kohort lain
const { logger } = require('../logs/logger');

// GET /:personKohortId
const getSinglePersonKohort = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kohortController] getSinglePersonKohort called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kohortType, personKohortId } = req.params;

  let singlePersonKohort;

  switch (kohortType) {
    case 'kotak':
      singlePersonKohort = await KohortKotak.findOne({
        _id: personKohortId,
      });
      break;
    default:
      console.log('nope');
      break;
  }

  if (!singlePersonKohort) {
    return res.status(404).json({ msg: `No person with id ${personKohortId}` });
  }

  res.status(201).json({ singlePersonKohort });
};

// POST /
// proposed createPersonKohort

// PATCH /:personKohortId
const updatePersonKohort = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kohortController] updatePersonKohort called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kohortType, personKohortId } = req.params;

  let updatedSinglePersonKohort;

  switch (kohortType) {
    case 'kotak':
      updatedSinglePersonKohort = await KohortKotak.findOneAndUpdate(
        {
          _id: req.params.personKohortId,
        },
        req.body,
        { new: true }
      );
      break;
    default:
      console.log('nope');
      break;
  }

  if (!updatedSinglePersonKohort) {
    return res.status(404).json({ msg: `No person with id ${personKohortId}` });
  }

  res.status(200).json({ updatedSinglePersonKohort });
};

// not used
// DELETE /:personKohortId
const deletePersonKohort = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kohortType, personKohortId } = req.params;

  let deletedSinglePersonKohort;

  switch (kohortType) {
    case 'kotak':
      deletedSinglePersonKohort = await KohortKotak.findOneAndDelete({
        _id: personKohortId,
      });
      break;
    default:
      console.log('nope');
      break;
  }

  if (!deletedSinglePersonKohort) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortId} ` });
  }

  res.status(200).json({
    msg: `Person with id ${personKohortId} succesfully deleted`,
  });
};

// query /kohort
const queryPersonKohort = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp, kodFasiliti, daerah, negeri },
    query: {
      jenisKohort,
      nama,
      ic,
      tarikhKedatangan,
      jenisFasiliti,
      jenisProgram,
      namaProgram,
    },
  } = req;

  const queryObject = {};
  queryObject.createdByNegeri = negeri;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByKp = kp;
  //   queryObject.createdByKodFasiliti = kodFasiliti;
  //   queryObject.tahunDaftar = new Date().getFullYear();
  //   queryObject.deleted = false;

  //   if (nama) {
  //     queryObject.nama = { $regex: nama, $options: 'i' };
  //   }

  //   if (ic) {
  //     queryObject.ic = { $regex: ic, $options: 'i' };
  //   }

  //   if (tarikhKedatangan) {
  //     queryObject.tarikhKedatangan = tarikhKedatangan;
  //   }

  //   if (jenisFasiliti) {
  //     queryObject.jenisFasiliti = jenisFasiliti;
  //   }

  //   if (jenisProgram) {
  //     queryObject.jenisProgram = jenisProgram;
  //   }

  //   if (namaProgram) {
  //     queryObject.namaProgram = namaProgram;
  //   }

  let kohortResultQuery;

  switch (jenisKohort) {
    case 'kotak':
      kohortResultQuery = await KohortKotak.find(queryObject).sort({
        namaSekolah: -1,
        namaKelas: -1,
        nama: -1,
      });
      break;
    default:
      console.log('nope');
      break;
  }

  res.status(200).json({ kohortResultQuery });
};

module.exports = {
  getSinglePersonKohort,
  updatePersonKohort,
  deletePersonKohort,
  queryPersonKohort,
};

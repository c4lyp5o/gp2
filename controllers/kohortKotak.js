const moment = require('moment');
const KohortKotak = require('../models/KohortKotak');
const { logger } = require('../logs/logger');

// GET /:personKohortKotakId
const getSinglePersonKohortKotak = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kohortKotakController] getSinglePersonKohort called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { personKohortKotakId } = req.params;

  const singlePersonKohortKotak = await KohortKotak.findOne({
    _id: personKohortKotakId,
  });

  if (!personKohortKotakId) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortKotakId}` });
  }

  res.status(201).json({ singlePersonKohortKotak });
};

// POST /
// proposed createPersonKohort

// PATCH /:personKohortKotakId
const updatePersonKohortKotak = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kohortKotakController] updatePersonKohort called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { personKohortKotakId } = req.params;

  const createdByNameMdcMdtb = {
    createdByUsername: req.body.createdByUsername,
    createdByMdcMdtb: req.body.createdByMdcMdtb,
    thisUsernameData: req.body.thisUsernameData,
  };

  const updatedSinglePersonKohortKotak = await KohortKotak.findOneAndUpdate(
    {
      _id: req.params.personKohortKotakId,
    },
    {
      $set: {
        ...req.body,
      },
      $push: {
        createdByNameMdcMdtb: createdByNameMdcMdtb,
      },
    },
    { new: true }
  );

  if (!updatedSinglePersonKohortKotak) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortKotakId}` });
  }

  res.status(200).json({ updatedSinglePersonKohortKotak });
};

// not used
// DELETE /:personKohortKotakId
const deletePersonKohortKotak = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { personKohortKotakId } = req.params;

  const deletedSinglePersonKohortKotak = await KohortKotak.findOneAndDelete({
    _id: personKohortKotakId,
  });

  if (!deletedSinglePersonKohortKotak) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortKotakId} ` });
  }

  res.status(200).json({
    msg: `Person with id ${personKohortKotakId} succesfully deleted`,
  });
};

// query /
const queryPersonKohortKotak = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp, kodFasiliti, daerah, negeri },
    query: {
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

  const kohortKotakResultQuery = await KohortKotak.find(queryObject).sort({
    namaSekolah: -1,
    // namaKelas: -1,
    nama: -1,
  });

  res.status(200).json({ kohortKotakResultQuery });
};

module.exports = {
  getSinglePersonKohortKotak,
  updatePersonKohortKotak,
  deletePersonKohortKotak,
  queryPersonKohortKotak,
};

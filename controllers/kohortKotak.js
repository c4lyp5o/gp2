const moment = require('moment');
const KohortKotak = require('../models/KohortKotak');
const Sekolah = require('../models/Sekolah');
const Pemeriksaansekolah = require('../models/Pemeriksaansekolah');
const { logger, unauthorizedLogger } = require('../logs/logger');

// GET /:personKohortKotakId
const getSinglePersonKohortKotak = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kohortKotakController] getSinglePersonKOTAK called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { personKohortKotakId } = req.params;

  const singlePersonKohortKotak = await KohortKotak.findOne({
    _id: personKohortKotakId,
    deleted: false,
  });

  if (!personKohortKotakId) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortKotakId}` });
  }

  res.status(201).json({ singlePersonKohortKotak });
};

// PATCH /:personKohortKotakId
const updatePersonKohortKotak = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kohortKotakController] updatePersonKOTAK called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const createdByNameMdcMdtb = {
    createdByUsername: req.body.createdByUsername,
    createdByMdcMdtb: req.body.createdByMdcMdtb,
    thisUsernameData: req.body.thisUsernameData,
  };

  const updatedSinglePersonKohortKotak = await KohortKotak.findOneAndUpdate(
    {
      _id: req.params.personKohortKotakId,
      deleted: false,
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
      .json({ msg: `No person with id ${req.params.personKohortKotakId}` });
  }

  res.status(200).json({ updatedSinglePersonKohortKotak });
};

// PATCH /delete/:personKohortKotakId
const softDeletePersonKOTAK = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [kohortKotakController] softDeletePersonKOTAK called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    deleteReason,
    melaksanakanSaringanMerokok,
    statusM,
    menerimaNasihatRingkas,
  } = req.body;

  const singlePersonKotak = await KohortKotak.findOne({
    _id: req.params.personKohortKotakId,
    deleted: false,
  });

  if (!singlePersonKotak) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personKohortKotakId}` });
  }

  if (singlePersonKotak.statusKotak !== 'belum mula') {
    unauthorizedLogger.warn(
      `${req.method} ${req.url} [kohortKotakController - softDeletePersonKOTAK] Unauthorized singlePersonKotak ${singlePersonKotak.nama} has STATUS KOTAK !== 'belum mula' tampering by {kp: ${req.user.kp}, kodFasiliti: ${req.user.kodFasiliti}} from ${req.ip}`
    );
    return res.status(403).json({
      msg: `${singlePersonKotak.nama} berada di dalam pemantauan kohort kotak`,
    });
  }

  // delete pelajar kohort tu
  const singlePersonKotakToDelete = await KohortKotak.findOneAndUpdate(
    {
      _id: req.params.personKohortKotakId,
      deleted: false,
    },
    {
      deleted: true,
      deleteReason,
      deletedForOfficer: `${req.body.createdByMdcMdtb} has deleted this kohort kotak pelajar`,
    },
    { new: true }
  );
  // search pelajar tu di sekolah
  const pelajarSekolah = await Sekolah.findOne({
    nama: singlePersonKotak.nama,
    sesiTakwimPelajar: singlePersonKotak.sesiTakwimPelajar,
    kodSekolah: singlePersonKotak.kodSekolah,
    tahunTingkatan: singlePersonKotak.tahunTingkatan,
    deleted: false,
  });
  // update pulak dia punya pemeriksaan
  await Pemeriksaansekolah.findOneAndUpdate(
    {
      _id: pelajarSekolah.pemeriksaanSekolah,
    },
    {
      melaksanakanSaringanMerokok,
      statusM,
      menerimaNasihatRingkas,
      bersediaDirujuk: '',
    },
    { new: true }
  );

  res.status(200).json({ singlePersonKotakToDelete });
};

// not used
// DELETE /:personKohortKotakId
const deletePersonKohortKotak = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
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
  queryObject.createdByKodFasiliti = kodFasiliti;
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
    nama: -1,
  });

  res.status(200).json({ kohortKotakResultQuery });
};

module.exports = {
  getSinglePersonKohortKotak,
  updatePersonKohortKotak,
  softDeletePersonKOTAK,
  deletePersonKohortKotak,
  queryPersonKohortKotak,
};

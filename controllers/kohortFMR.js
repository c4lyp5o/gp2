const moment = require('moment');
const Fasiliti = require('../models/Fasiliti');
const Sekolah = require('../models/Sekolah');
const KohortFMR = require('../models/KohortFMR');
const { logger } = require('../logs/logger');

// GET /
const getAllSekolahKohortFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllSekolahKohortFMR called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kodFasiliti } = req.user;

  const allSekolahKohortFMR = await Fasiliti.find({
    jenisFasiliti: { $eq: 'sekolah-rendah' },
    statusFMRSekolah: 'ya',
    kodFasilitiHandler: kodFasiliti,
  });

  res.status(200).json({ allSekolahKohortFMR });
};

const getAllD1StudentInSekolah = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllD1StudentInSekolah called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { singleSekolahId } = req.params;

  const singleSekolah = await Fasiliti.findOne({
    kodSekolah: singleSekolahId,
  });

  if (!singleSekolah) {
    return res.status(404).json({ msg: 'No sekolah found' });
  }

  const allD1Students = await Sekolah.find({
    kodSekolah: singleSekolahId,
    tahun: 'D1',
  });

  if (allD1Students.length < 1) {
    return res.status(404).json({ msg: 'No students found' });
  }

  // const preprocessing = allStudents.map((student) => {
  //   return {
  //     createdByNegeri: negeri,
  //     createdByDaerah: daerah,
  //     createdByKodFasiliti: kodFasiliti,
  //     createdByKp: kp,
  //     // createdByMdcMdtb: student.createdByMdcMdtb,
  //     // createdByUsername: student.createdByUsername,
  //     nama: student.nama,
  //     ic: student.noKp,
  //     namaSekolah: student.namaSekolah,
  //     kodSekolah: student.kodSekolah,
  //     tahun: student.tahun,
  //     kelas: student.namaKelas,
  //     // noTelefon: student.noTelefon,
  //     dalamPemantauanKohort: true,
  //   };
  // });

  // await KohortFMR.insertMany(preprocessing);
  // await singleSekolah.updateOne({
  //   statusFMRTelahDaftarDarjahSatu: true,
  // });
  // console.log(allD1Students);

  res.status(200).json({ allD1Students });
};

const getAllD1Student = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllD1Student called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kodFasiliti, kp } = req.user;

  const allSekolah = await Fasiliti.find({
    kodFasilitiHandler: kodFasiliti,
    jenisFasiliti: 'sekolah-rendah',
  })
    .select('kodSekolah')
    .lean();

  if (!allSekolah) {
    return res.status(404).json({ msg: 'No sekolah found' });
  }

  console.log(allSekolah.flatMap((x) => x.kodSekolah));

  // const allD1Students = await Sekolah.find({
  //   kodSekolah: singleSekolahId,
  //   tahun: 'D1',
  // });

  // if (allD1Students.length < 1) {
  //   return res.status(404).json({ msg: 'No students found' });
  // }

  // const preprocessing = allStudents.map((student) => {
  //   return {
  //     createdByNegeri: negeri,
  //     createdByDaerah: daerah,
  //     createdByKodFasiliti: kodFasiliti,
  //     createdByKp: kp,
  //     // createdByMdcMdtb: student.createdByMdcMdtb,
  //     // createdByUsername: student.createdByUsername,
  //     nama: student.nama,
  //     ic: student.noKp,
  //     namaSekolah: student.namaSekolah,
  //     kodSekolah: student.kodSekolah,
  //     tahun: student.tahun,
  //     kelas: student.namaKelas,
  //     // noTelefon: student.noTelefon,
  //     dalamPemantauanKohort: true,
  //   };
  // });

  // await KohortFMR.insertMany(preprocessing);
  // await singleSekolah.updateOne({
  //   statusFMRTelahDaftarDarjahSatu: true,
  // });
  // console.log(allD1Students);

  res.status(200).json([]);
};

const registerSekolahFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] registerSingleSekolahFMR called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kodFasiliti, kp } = req.user;
  const { kodSekolah } = req.query;

  const singleSekolah = await Fasiliti.findOne({
    kodSekolah,
  });

  if (!singleSekolah) {
    return res.status(404).json({ msg: 'No sekolah found' });
  }

  const allD1Students = await Sekolah.find({
    kodSekolah,
    tahun: 'D1',
  });

  if (allD1Students.length < 1) {
    return res.status(404).json({ msg: 'No students found' });
  }

  // const preprocessing = allStudents.map((student) => {
  //   return {
  //     createdByNegeri: negeri,
  //     createdByDaerah: daerah,
  //     createdByKodFasiliti: kodFasiliti,
  //     createdByKp: kp,
  //     // createdByMdcMdtb: student.createdByMdcMdtb,
  //     // createdByUsername: student.createdByUsername,
  //     nama: student.nama,
  //     ic: student.noKp,
  //     namaSekolah: student.namaSekolah,
  //     kodSekolah: student.kodSekolah,
  //     tahun: student.tahun,
  //     kelas: student.namaKelas,
  //     // noTelefon: student.noTelefon,
  //     dalamPemantauanKohort: true,
  //   };
  // });

  // await KohortFMR.insertMany(preprocessing);
  // await singleSekolah.updateOne({
  //   statusFMRTelahDaftarDarjahSatu: true,
  // });

  res.status(200).json({ allD1Students });
};

const getAllPersonKohortFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllPersonKohortFMR called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kodFasiliti } = req.user;

  const allPersonKohortFMR = await KohortFMR.find({
    createdByKodFasiliti: kodFasiliti,
  });

  console.log(allPersonKohortFMR);

  res.status(200).json({ allPersonKohortFMR });
};

// GET /:personKohortFMRId
const getPersonKohortFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getSinglePersonKohort called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { personKohortFMRId } = req.params;

  const singlePersonKohortFMR = await KohortFMR.findOne({
    _id: personKohortFMRId,
  });

  if (!personKohortFMRId) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortFMRId}` });
  }

  res.status(201).json({ singlePersonKohortFMR });
};

// PATCH /:personKohortFMRId
const updatePersonKohortFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] updatePersonKohort called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { personKohortFMRId } = req.params;

  const updatedSinglePersonKohortFMR = await KohortFMR.findOneAndUpdate(
    {
      _id: req.params.personKohortFMRId,
    },
    req.body,
    { new: true }
  );

  if (!updatedSinglePersonKohortFMR) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortFMRId}` });
  }

  res.status(200).json({ updatedSinglePersonKohortFMR });
};

// DELETE /:personKohortFMRId
const deletePersonKohortFMR = async (req, res) => {
  if (req.user.accountType !== 'kaunterUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { personKohortFMRId } = req.query;

  const deletedSinglePersonKohortFMR = await KohortFMR.findOneAndDelete({
    _id: personKohortFMRId,
  });

  if (!deletedSinglePersonKohortFMR) {
    return res
      .status(404)
      .json({ msg: `No person with id ${personKohortFMRId} ` });
  }

  res.status(200).json({
    msg: `Person with id ${personKohortFMRId} succesfully deleted`,
  });
};

// query /
const queryPersonKohortFMR = async (req, res) => {
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

  const KohortFMRResultQuery = await KohortFMR.find(queryObject).sort({
    namaSekolah: -1,
    namaKelas: -1,
    nama: -1,
  });

  res.status(200).json({ KohortFMRResultQuery });
};

module.exports = {
  getAllSekolahKohortFMR,
  getAllD1Student,
  getAllD1StudentInSekolah,
  getAllPersonKohortFMR,
  registerSekolahFMR,
  getPersonKohortFMR,
  updatePersonKohortFMR,
  deletePersonKohortFMR,
  queryPersonKohortFMR,
};

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

// GET /query
const getAllD1StudentInRegisteredSekolah = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllD1StudentInRegisteredSekolah called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kodFasiliti } = req.user;

  const dataSekolahDenganPelajar = await Fasiliti.aggregate([
    {
      $match: {
        kodFasilitiHandler: kodFasiliti,
        statusFMRSekolah: 'ya',
        jenisFasiliti: 'sekolah-rendah',
      },
    },
    {
      $facet: {
        fasilitiSekolah: [
          // {
          //   $lookup: {
          //     from: 'sekolahs',
          //     let: {
          //       kodSekolah: '$kodSekolah',
          //     },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $and: [
          //               {
          //                 $eq: ['$kodSekolah', '$$kodSekolah'],
          //               },
          //             ],
          //           },
          //         },
          //       },
          //       {
          //         $group: {
          //           _id: null,
          //           semuaTahun: {
          //             $addToSet: '$tahun',
          //           },
          //           // semuaKelas: {
          //           //   $addToSet: "$namaKelas"
          //           // },
          //         },
          //       },
          //       {
          //         $project: {
          //           _id: 0,
          //           semuaTahun: 1,
          //           // semuaKelas: 1,
          //         },
          //       },
          //     ],
          //     as: 'sedikitDetail',
          //   },
          // },
          // {
          //   $project: {
          //     _id: 0,
          //     idInstitusi: 1,
          //     nama: 1,
          //     kodSekolah: 1,
          //     sekolahSelesaiReten: 1,
          //     tarikhMulaSekolah: 1,
          //     // tahunSekolah: '$sedikitDetail.semuaTahun',
          //     // kelasSekolah: '$sedikitDetail.semuaKelas',
          //   },
          // },
        ],
        allD1PelajarSekolah: [
          {
            $lookup: {
              from: 'sekolahs',
              let: {
                kodSekolah: '$kodSekolah',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$kodSekolah', '$$kodSekolah'],
                        },
                        {
                          $eq: ['$tahun', 'D1'],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    nama: 1,
                    noKp: 1,
                    kodJantina: 1,
                    kaum: 1,
                    tahun: 1,
                    namaKelas: 1,
                    statusRawatan: 1,
                  },
                },
              ],
              as: 'sekolah',
            },
          },
          {
            $unwind: '$sekolah',
          },
          {
            $project: {
              _id: '$sekolah._id',
              namaSekolah: '$nama',
              kodSekolah: '$kodSekolah',
              jenisFasiliti: 1,
              nama: '$sekolah.nama',
              noKp: '$sekolah.noKp',
              kodJantina: '$sekolah.kodJantina',
              kaum: '$sekolah.kaum',
              tahun: '$sekolah.tahun',
              namaKelas: '$sekolah.namaKelas',
              statusRawatan: '$sekolah.statusRawatan',
            },
          },
          {
            $sort: {
              nama: 1,
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    allD1PelajarSekolah: dataSekolahDenganPelajar[0].allD1PelajarSekolah,
    fasilitiSekolah: dataSekolahDenganPelajar[0].fasilitiSekolah,
  });

  // const singleSekolah = await Fasiliti.findOne({
  //   kodSekolah: singleSekolahId,
  // });

  // if (!singleSekolah) {
  //   return res.status(404).json({ msg: 'No sekolah found' });
  // }

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

  // res.status(200).json({ allD1Students });
};

// PATCH /daftar-kumuran
const daftarKumuranFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] daftarKumuran called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kodFasiliti, kp } = req.user;

  const { muridKumuran, startKumuran } = req.body;

  console.log(muridKumuran, startKumuran);

  muridKumuran.forEach(async (murid) => {
    const singlePersonKohortFMR = await KohortFMR.findOne({
      nomborId: murid.nomborId,
    });

    const updatedSinglePersonKohortFMR = await KohortFMR.findOneAndUpdate(
      {
        nomborId: murid.nomborId,
      },
      {
        $push: {
          tarikhKumuranMurid: startKumuran,
        },
      },
      { new: true }
    );
  });

  res.status(200).json({ msg: 'OK' });
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
  getAllD1StudentInRegisteredSekolah,
  daftarKumuranFMR,
  deletePersonKohortFMR,
  queryPersonKohortFMR,
};

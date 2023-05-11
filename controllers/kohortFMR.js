const Fasiliti = require('../models/Fasiliti');
const Sekolah = require('../models/Sekolah');
const KohortFMR = require('../models/KohortFMR');
const { logger } = require('../logs/logger');

// GET /
const getAllSekolahFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllSekolahKohortFMR called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { kodFasiliti } = req.user;

  const allSekolahFMR = await Fasiliti.find({
    jenisFasiliti: { $eq: 'sekolah-rendah' },
    kodFasilitiHandler: kodFasiliti,
    statusFMRSekolah: 'ya',
  });

  res.status(200).json({ allSekolahFMR });
};

// GET /semua-murid
const getAllD1StudentInSekolahFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllD1StudentInSekolahFMR called`
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
                          $eq: ['$tahunTingkatan', 'TAHUN DUA'],
                        },
                        // {
                        //   $eq: ['$telahDaftarKohortFMR', false],
                        // },
                      ],
                    },
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
              idInstitusi: 1,
              namaSekolah: '$nama',
              kodSekolah: 1,
              jenisFasiliti: 1,
              nama: '$sekolah.nama',
              idIndividu: '$sekolah.idIndividu',
              nomborId: '$sekolah.nomborId',
              jantina: '$sekolah.jantina',
              kaum: '$sekolah.kaum',
              tahunTingkatan: '$sekolah.tahunTingkatan',
              kelasPelajar: '$sekolah.kelasPelajar',
              tarikhKumuranKohortFMR: '$sekolah.tarikhKumuranKohortFMR',
              telahDaftarKohortFMR: '$sekolah.telahDaftarKohortFMR',
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
};

// GET /pilih-murid/:singleSekolahFMRId
const getAllD1StudentInSingleSekolahFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getAllD1StudentInSingleSekolahFMR called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { singleSekolahFMRId } = req.params;

  console.log(singleSekolahFMRId);

  const dataSemuaPelajarD1SingleSekolah = await Sekolah.find({
    kodSekolah: singleSekolahFMRId,
    tahunTingkatan: 'TAHUN DUA',
  })
    .sort({ nama: 1 })
    .lean();

  res.status(200).json({ dataSemuaPelajarD1SingleSekolah });
};

// GET /murid-kohort
const getMuridDalamKohortFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] getMuridDalamKohortFMR called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kodFasiliti, kp } = req.user;

  const muridDalamKohortFMR = await KohortFMR.find({
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKodFasiliti: kodFasiliti,
    createdByKp: kp,
  });

  res.status(200).json({ muridDalamKohortFMR });
};

// PATCH /daftar-kumuran || untuk kumuran budak yang umum
const daftarKumuranFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] daftarKumuranFMR called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { muridKumuran, startKumuran } = req.body;

  muridKumuran.forEach(async (murid) => {
    // console.log(murid);
    await Sekolah.findOneAndUpdate(
      {
        nomborId: murid.nomborId,
      },
      {
        $push: {
          tarikhKumuranKohortFMR: startKumuran,
        },
      },
      { new: true }
    );
  });

  res.status(200).json({ msg: 'OK' });
};

// PATCH /daftar-kumuran-kohort || untuk kumuran budak yang ada dalam kohort
const daftarKumuranKohortFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] daftarKumuranFMR called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { muridKumuran, startKumuran } = req.body;

  muridKumuran.forEach(async (murid) => {
    await KohortFMR.findOneAndUpdate(
      {
        nomborId: murid.nomborId,
      },
      {
        $push: {
          tarikhKumuranKohortFMR: startKumuran,
        },
        $inc: {
          jumlahKumuran: 1,
        },
      },
      { new: true }
    );
  });

  res.status(200).json({ msg: 'OK' });
};

// POST /daftar-murid
const daftarMuridMasukKohortFMR = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [KohortFMRController] daftarMuridFMR called`
  );

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kodFasiliti, kp } = req.user;
  const { semuaMuridKumuran } = req.body;
  const kodSekolah = new Set();

  await Promise.all(
    semuaMuridKumuran.map(async (murid) => {
      process.env.BUILD_ENV === 'dev' && console.log(`Murid: ${murid.nama}.}`);
      const newKohortFMR = new KohortFMR({
        createdByNegeri: negeri,
        createdByDaerah: daerah,
        createdByKodFasiliti: kodFasiliti,
        createdByKp: kp,
        idIndividu: murid.idIndividu,
        nama: murid.nama,
        nomborId: murid.nomborId,
        namaSekolah: murid.namaSekolah,
        kodSekolah: murid.kodSekolah,
        tahunTingkatan: murid.tahunTingkatan,
        kelasPelajar: murid.kelasPelajar,
        dalamPemantauanKohort: true,
        tahunKohortFMR: `JAN - DIS ${new Date().getFullYear()}`,
        tarikhKumuranKohortFMR: murid.tarikhKumuranKohortFMR,
        jumlahKumuran: murid.tarikhKumuranKohortFMR?.length || 0,
      });

      try {
        await newKohortFMR.save();
        kodSekolah.add(murid.kodSekolah);
      } catch (error) {
        console.log('Error while saving KohortFMR document:', error);
        throw error;
      }
    })
  );

  await Promise.all(
    Array.from(kodSekolah).map(async (kod) => {
      process.env.BUILD_ENV === 'dev' &&
        console.log('update field statusFMR untuk ', kod);
      try {
        await Fasiliti.updateOne(
          { kodSekolah: kod },
          { statusFMRTelahDaftarDarjahSatu: true }
        );
      } catch (error) {
        console.log('Error while updating Fasiliti document:', error);
        throw error;
      }
    })
  );

  console.log('siap daftar');

  res.status(200).json({ msg: 'Murid telah didaftarkan' });
};

// DELETE /hapus-murid-kohort/:singlePersonKohortFMRId
const deletePersonKohortFMR = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  logger.info(
    `${req.method} ${req.url} [KohortFMRController] deletePersonKohortFMR called`
  );

  const { singlePersonKohortFMRId } = req.params;

  const deletedSinglePersonKohortFMR = await KohortFMR.findOneAndDelete({
    nomborId: singlePersonKohortFMRId,
  });

  if (!deletedSinglePersonKohortFMR) {
    return res
      .status(404)
      .json({ msg: `No person with id ${singlePersonKohortFMRId} ` });
  }

  res.status(200).json({
    msg: `Person with id ${singlePersonKohortFMRId} succesfully deleted`,
  });
};

module.exports = {
  getAllSekolahFMR,
  getAllD1StudentInSekolahFMR,
  getAllD1StudentInSingleSekolahFMR,
  getMuridDalamKohortFMR,
  daftarMuridMasukKohortFMR,
  daftarKumuranFMR,
  daftarKumuranKohortFMR,
  deletePersonKohortFMR,
};

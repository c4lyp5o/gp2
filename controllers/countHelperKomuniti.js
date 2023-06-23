// const User = require('../models/User');
const Umum = require('../models/Umum');
const Sekolah = require('../models/Sekolah');
const Pemeriksaan = require('../models/Pemeriksaansekolah');
const Rawatan = require('../models/Rawatansekolah');
const KohortKotak = require('../models/KohortKotak');
const Fasiliti = require('../models/Fasiliti');
const { errorRetenLogger } = require('../logs/logger');
const {
  placeModifier,
  getParamsKOM,
  getParamsOAP,
  getParamsUTCRTC,
  getParamsPKAP,
  // getParamsOperatorLain,
} = require('../controllers/countHelperParams');

const countPPIM03 = async (payload) => {
  const dataPPIM03 = await KohortKotak.aggregate([
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && {
          createdByKodFasiliti: payload.klinik,
        }),
        statusKotak: { $ne: 'belum mula' },
      },
    },
    {
      $lookup: {
        from: 'sekolahs',
        let: { nama: '$nama' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$nama', '$$nama'] },
            },
          },
          { $limit: 1 },
        ],
        as: 'data_sekolah',
      },
    },
    {
      $unwind: '$data_sekolah',
    },
    {
      $lookup: {
        from: 'pemeriksaansekolahs',
        let: {
          pemeriksaanSekolah: '$data_sekolah.pemeriksaanSekolah',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$pemeriksaanSekolah'],
              },
            },
          },
          { $limit: 1 },
        ],
        as: 'data_pemeriksaan',
      },
    },
    {
      $unwind: '$data_pemeriksaan',
    },
    {
      $addFields: {
        statusMerokok: '$data_pemeriksaan.statusM',
      },
    },
    {
      $project: {
        data_sekolah: 0,
        data_pemeriksaan: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
    {
      $group: {
        _id: '$tahunTingkatan',
        bilPerokokSemasaRokokBiasa: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$rokokBiasaKotak', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaElecVape: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$elektronikVapeKotak', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaShisha: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$shishaKotak', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaLainlain: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$lainLainKotak', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaDirujukIntervensi: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $ne: ['$tarikhIntervensi1', ''],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const monsterOfDataSekolah = await Fasiliti.aggregate([
    {
      $match: {
        sekolahSelesaiReten: true,
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
      },
    },
    {
      $project: {
        _id: 0,
        // nama: 1,
        // jenisFasiliti: 1,
        // kodFasilitiHandler: 1,
        kodSekolah: 1,
        sesiTakwimSekolah: 1,
      },
    },
    {
      $lookup: {
        from: 'sekolahs',
        localField: 'kodSekolah',
        foreignField: 'kodSekolah',
        as: 'result',
      },
    },
    {
      $unwind: {
        path: '$result',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        'result.pemeriksaanSekolah': {
          $ne: null,
        },
      },
    },
    {
      $addFields: {
        keturunan: '$result.keturunan',
        tahunTingkatan: '$result.tahunTingkatan',
        kelasPelajar: '$result.kelasPelajar',
        jantina: '$result.jantina',
        statusM: '$result.statusM',
        pemeriksaanSekolah: '$result.pemeriksaanSekolah',
      },
    },
    {
      $project: {
        result: 0,
      },
    },
    {
      $lookup: {
        from: 'pemeriksaansekolahs',
        localField: 'pemeriksaanSekolah',
        foreignField: '_id',
        as: 'pemeriksaanSekolah',
      },
    },
    {
      $unwind: {
        path: '$pemeriksaanSekolah',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        jantina: 1,
        umur: 1,
        keturunan: 1,
        warganegara: 1,
        tahunTingkatan: 1,
        kelasPelajar: 1,
        statusMerokok: '$pemeriksaanSekolah.statusM',
      },
    },
    {
      $group: {
        _id: '$tahunTingkatan',
        bilPerokokSemasaLelakiMelayu: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                  {
                    $eq: ['$keturunan', 'MELAYU'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaLelakiCina: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                  {
                    $eq: ['$keturunan', 'CINA'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaLelakiIndia: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                  {
                    $eq: ['$keturunan', 'INDIA'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaLelakiLainlain: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                  {
                    $ne: ['$keturunan', 'MELAYU'],
                  },
                  {
                    $ne: ['$keturunan', 'CINA'],
                  },
                  {
                    $ne: ['$keturunan', 'INDIA'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaPerempuanMelayu: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                  {
                    $eq: ['$keturunan', 'MELAYU'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaPerempuanCina: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                  {
                    $eq: ['$keturunan', 'CINA'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaPerempuanMelayu: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                  {
                    $eq: ['$keturunan', 'INDIA'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSemasaPerempuanLainlain: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-semasa'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                  {
                    $ne: ['$keturunan', 'MELAYU'],
                  },
                  {
                    $ne: ['$keturunan', 'CINA'],
                  },
                  {
                    $ne: ['$keturunan', 'INDIA'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilBekasPerokokLelaki: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'bekas-perokok'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilBekasPerokokPerempuan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'bekas-perokok'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokPasifLelaki: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-pasif'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokPasifPerempuan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'perokok-pasif'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilBukanPerokokLelaki: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'bukan-perokok'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilBukanPerokokPerempuan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'bukan-perokok'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilDalamIntervensiLelaki: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'dalam-intervensi'],
                  },
                  {
                    $eq: ['$jantina', 'LELAKI'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilDalamIntervensiPerempuan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusMerokok', 'dalam-intervensi'],
                  },
                  {
                    $eq: ['$jantina', 'PEREMPUAN'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  // console.log(monsterOfDataSekolah);

  // throw new Error('test');

  // bismillah
  try {
    let bigData = [];

    bigData.push(dataPPIM03);
    bigData.push(monsterOfDataSekolah);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPPIM04 = async (payload) => {
  const dataPPIM04 = await KohortKotak.aggregate([
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && {
          createdByKodFasiliti: payload.klinik,
        }),
        statusKotak: {
          $ne: 'belum mula',
        },
      },
    },
    {
      $project: {
        _id: 0,
        nama: 1,
        kelas: {
          $concat: ['$tahunTingkatan', ' ', '$kelasPelajar'],
        },
        noTelefon: 1,
        tarikhIntervensi1: 1,
        tarikhIntervensi2: 1,
        tarikhIntervensi3: 1,
        tarikhIntervensi4: 1,
        adaQuitDate: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ne: ['$tarikhQ', ''],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        tiadaQuitDate: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$tarikhQ', ''],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        tarikhQuit: {
          $ifNull: [
            {
              $cond: {
                if: {
                  $ne: ['$tarikhQ', ''],
                },
                then: '$tarikhQ',
                else: null,
              },
            },
            'Unknown',
          ],
        },
        rujukGuruKaunseling: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$rujukGuruKaunseling', 'ya-rujuk-guru-kaunseling'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        berhentiMerokok: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusSelepas6Bulan', 'berhenti'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        takBerhentiMerokok: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusSelepas6Bulan', 'tidak'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  try {
    let bigData = [];

    bigData.push(dataPPIM04);

    return bigData;
  } catch (error) {
    throw new Error(error);
  }
};
const countPPIM05 = async (payload) => {
  const dataPPIM05 = await KohortKotak.aggregate([
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && {
          createdByKodFasiliti: payload.klinik,
        }),
        statusKotak: {
          $ne: 'belum mula',
        },
      },
    },
    {
      $lookup: {
        from: 'sekolahs',
        let: {
          nama: '$nama',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$nama', '$$nama'],
              },
            },
          },
          {
            $limit: 1,
          },
        ],
        as: 'data_sekolah',
      },
    },
    {
      $unwind: '$data_sekolah',
    },
    {
      $lookup: {
        from: 'pemeriksaansekolahs',
        let: {
          pemeriksaanSekolah: '$data_sekolah.pemeriksaanSekolah',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$pemeriksaanSekolah'],
              },
            },
          },
          {
            $limit: 1,
          },
        ],
        as: 'data_pemeriksaan',
      },
    },
    {
      $unwind: '$data_pemeriksaan',
    },
    {
      $addFields: {
        statusMerokok: '$data_pemeriksaan.statusM',
      },
    },
    {
      $project: {
        data_sekolah: 0,
        data_pemeriksaan: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
    {
      $group: {
        _id: '$tahunTingkatan',
        bilPerokokSemasa: {
          $sum: {
            $cond: [
              {
                $eq: ['$statusMerokok', 'perokok-semasa'],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokSertaiIntervensi: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$statusKotak', 'dalam intervensi'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokAdaQuitDate3Int: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $and: [
                      {
                        $ne: ['$tarikhIntervensi1', ''],
                      },
                      {
                        $ne: ['$tarikhIntervensi2', ''],
                      },
                      {
                        $ne: ['$tarikhIntervensi3', ''],
                      },
                    ],
                  },
                  {
                    $ne: ['$tarikhQ', ''],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokTiadaQuitDate3Int: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $and: [
                      {
                        $ne: ['$tarikhIntervensi1', ''],
                      },
                      {
                        $ne: ['$tarikhIntervensi2', ''],
                      },
                      {
                        $ne: ['$tarikhIntervensi3', ''],
                      },
                    ],
                  },
                  {
                    $eq: ['$tarikhQ', ''],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokAdaQuitDateKur3Int: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $and: [
                      {
                        $eq: ['$tarikhIntervensi1', ''],
                      },
                      {
                        $eq: ['$tarikhIntervensi2', ''],
                      },
                      {
                        $eq: ['$tarikhIntervensi3', ''],
                      },
                    ],
                  },
                  {
                    $ne: ['$tarikhQ', ''],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokTiadaQuitDateKur3Int: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $and: [
                      {
                        $eq: ['$tarikhIntervensi1', ''],
                      },
                      {
                        $eq: ['$tarikhIntervensi2', ''],
                      },
                      {
                        $eq: ['$tarikhIntervensi3', ''],
                      },
                    ],
                  },
                  {
                    $eq: ['$tarikhQ', ''],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokDirujukGuru: {
          $sum: {
            $cond: [
              {
                $ne: ['$rujukGuruKaunseling', 'ya-rujuk-guru-kaunseling'],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokBerhenti6Bulan: {
          $sum: {
            $cond: [
              {
                $ne: ['$statusSelepas6Bulan', 'berhenti'],
              },
              1,
              0,
            ],
          },
        },
        bilPerokokTidakBerhenti6Bulan: {
          $sum: {
            $cond: [
              {
                $ne: ['$statusSelepas6Bulan', 'tidakberhenti'],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  try {
    let bigData = [];

    bigData.push(dataPPIM05);

    return bigData;
  } catch (error) {
    throw new Error(error);
  }
};
const countBEGIN = async (payload) => {
  let match_stage_umum = [];
  let match_stage_sekolah = [];
  // dari umum
  const taska = [
    {
      $match: {
        ...getParamsPGS201(payload),
        jenisFasiliti: { $eq: 'taska-tadika' },
      },
    },
    {
      $lookup: {
        from: 'fasilitis',
        localField: 'kodFasilitiTaskaTadika',
        foreignField: 'kodTastad',
        as: 'fasiliti_data',
      },
    },
    {
      $unwind: '$fasiliti_data',
    },
    {
      $addFields: {
        melaksanakanBegin: '$fasiliti_data.melaksanakanBegin',
      },
    },
    {
      $project: {
        fasiliti_data: 0,
      },
    },
  ];
  const pra_tad = [
    //ada masalah nak tahu patient tu tahun semasa / darjah mana
    {
      $match: {
        ...getParamsPGS201(payload),
        jenisFasiliti: { $in: ['taska-tadika', 'sekolah-rendah'] },
      },
    },
    {
      $lookup: {
        from: 'fasilitis',
        localField: 'kodFasilitiTaskaTadika',
        foreignField: 'kodTastad',
        as: 'fasiliti_data',
      },
    },
    {
      $unwind: '$fasiliti_data',
    },
    {
      $addFields: {
        kodTastad: '$fasiliti_data.kodTastad',
      },
    },
    {
      $project: {
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kodTastad: { $regex: /tad/i },
      },
    },
  ];
  // dari sekolah
  const sr_tahun1 = [
    {
      $match: {
        ...getParamsPGS201(payload),
        tahunTingkatan: 'TAHUN SATU',
        tarikhMelaksanakanBegin: { $ne: '' },
      },
    },
  ];
  const sr_tahun26 = [
    {
      $match: {
        ...getParamsPGS201(payload),
        tahunTingkatan: { $ne: 'TAHUN SATU' },
        tarikhMelaksanakanBegin: { $ne: '' },
      },
    },
  ];

  match_stage_umum = [taska, pra_tad];
  match_stage_sekolah = [sr_tahun1, sr_tahun26];
  //
  const group_stage_umum = [
    {
      $group: {
        _id: placeModifier(payload),
        jumlahReten: { $sum: 1 },
        jumlahRetenSalah: {
          $sum: {
            $cond: [{ $eq: ['$statusReten', 'reten salah'] }, 1, 0],
          },
        },
        //
        pesakitBaruBegin: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$tarikhMelaksanakanBegin', ''] },
                  { $eq: ['$kedatangan', 'baru-kedatangan'] },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahFasiliti: {
          $sum: {
            $cond: [
              {
                $eq: ['$melaksanakanBegin', 'tidak-hadir-taska-tadika'],
              },
              1,
              0,
            ],
          },
        },
        jumlahFasilitiMelaksanakanBegin: {
          $sum: {
            $cond: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }, 1, 0],
          },
        },
        craRendah: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lte: [{ $toInt: '$jumlahFaktorRisiko' }, 2] },
                  {
                    $eq: [
                      '$yaTidakPesakitMempunyaiGigi',
                      'ya-pesakit-mempunyai-gigi',
                    ],
                  },
                  { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                  { $eq: ['$adaKekalPemeriksaanUmum', false] },
                  { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        craSederhana: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$yaTidakPesakitMempunyaiGigi',
                              'ya-pesakit-mempunyai-gigi',
                            ],
                          },
                          {
                            $eq: ['$adaDesidusPemeriksaanUmum', true],
                          },
                          {
                            $eq: ['$adaKekalPemeriksaanUmum', false],
                          },
                        ],
                      },
                      {
                        $or: [
                          {
                            $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
                          },
                          {
                            $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
                          },
                        ],
                      },
                      {
                        $gte: [{ $toInt: '$jumlahFaktorRisiko' }, 3],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$yaTidakPesakitMempunyaiGigi',
                              'ya-pesakit-mempunyai-gigi',
                            ],
                          },
                          {
                            $eq: ['$adaDesidusPemeriksaanUmum', true],
                          },
                          {
                            $eq: ['$adaKekalPemeriksaanUmum', false],
                          },
                        ],
                      },
                      {
                        $or: [
                          {
                            $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1],
                          },
                          {
                            $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 1],
                          },
                        ],
                      },
                      {
                        $eq: [{ $toInt: '$jumlahFaktorRisiko' }, 0],
                      },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        craTinggi: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$yaTidakPesakitMempunyaiGigi',
                              'ya-pesakit-mempunyai-gigi',
                            ],
                          },
                          {
                            $eq: ['$adaDesidusPemeriksaanUmum', true],
                          },
                          {
                            $eq: ['$adaKekalPemeriksaanUmum', false],
                          },
                        ],
                      },
                      {
                        $or: [
                          {
                            $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1],
                          },
                          {
                            $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 1],
                          },
                        ],
                      },
                      {
                        $and: [
                          {
                            $gte: [{ $toInt: '$jumlahFaktorRisiko' }, 1],
                          },
                          {
                            $lte: [{ $toInt: '$jumlahFaktorRisiko' }, 2],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$yaTidakPesakitMempunyaiGigi',
                              'ya-pesakit-mempunyai-gigi',
                            ],
                          },
                          {
                            $eq: ['$adaDesidusPemeriksaanUmum', true],
                          },
                          {
                            $eq: ['$adaKekalPemeriksaanUmum', false],
                          },
                        ],
                      },
                      {
                        $or: [
                          {
                            $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1],
                          },
                          {
                            $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 1],
                          },
                        ],
                      },
                      {
                        $gte: [{ $toInt: '$jumlahFaktorRisiko' }, 3],
                      },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahMuridMelaksanakanBegin: {
          $sum: {
            $cond: [
              {
                $and: [{ $ne: ['$tarikhMelaksanakanBegin', ''] }],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ];

  // bismillah
  let bigData = [];

  try {
    for (const stage of group_stage_umum) {
      const queryBEGIN = await Umum.aggregate([...stage, ...group_stage_umum]);
      bigData.push({ queryBEGIN });
    }

    const dataFasiliti = await Fasiliti.find({
      ...(payload.negeri != 'all' && {
        createdByNegeri: payload.negeri,
      }),
      ...(payload.daerah != 'all' && {
        createdByDaerah: payload.daerah,
      }),
      ...(payload.klinik != 'all' && {
        kodFasilitiHandler: payload.klinik,
      }),
      jenisFasiliti: { $in: ['taska', 'tadika'] },
    })
      .select('jenisFasiliti enrolmen5Tahun enrolmen6Tahun statusPerkhidmatan')
      .lean();

    // nnt nk kena masuk taska
    const totalEnrolmentTastadPra = dataFasiliti.reduce(
      (
        totals,
        { jenisFasiliti, enrolmen5Tahun, enrolmen6Tahun, statusPerkhidmatan }
      ) => {
        if (jenisFasiliti === 'tadika' && statusPerkhidmatan === 'active') {
          totals = {
            ...totals,
            enrolmen5Tahun:
              (totals.enrolmen5Tahun ?? 0) +
              (enrolmen5Tahun ? parseInt(enrolmen5Tahun) : 0),
            enrolmen6Tahun:
              (totals.enrolmen6Tahun ?? 0) +
              (enrolmen6Tahun ? parseInt(enrolmen6Tahun) : 0),
          };
        }
        return totals;
      },
      {}
    );

    bigData[0][0] = { ...bigData[0][0], ...totalEnrolmentTastadPra };

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countDEWASAMUDA = async (payload) => {
  const main_switch = [
    {
      $match: {
        ...getParamsKOM(payload),
        jenisProgram: 'programDewasaMuda',
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'namaProgram',
        foreignField: 'nama',
        as: 'event_data',
      },
    },
    {
      $unwind: '$event_data',
    },
    {
      $addFields: {
        kategoriInstitusi: '$event_data.kategoriInstitusi',
      },
    },
    {
      $project: {
        event_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: {
          $in: [
            'kolej-komuniti',
            'kolej-vokasional',
            'ipg',
            'ipta',
            'lain-lain',
          ],
        },
      },
    },
  ];

  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_15to17years = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 15, $lte: 17 },
      },
    },
  ];
  const match_pemeriksaan_18to19years = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 18, $lte: 19 },
      },
    },
  ];
  const match_pemeriksaan_20to29years = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 20, $lte: 29 },
      },
    },
  ];
  const match_pemeriksaan_ibumengandung = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 7 },
        ibuMengandung: true,
      },
    },
  ];
  const match_pemeriksaan_oku = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        orangKurangUpaya: true,
      },
    },
  ];
  const match_pemeriksaan_bukanWarganegara = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        kumpulanEtnik: { $eq: 'bukan warganegara' },
      },
    },
  ];
  const match_pemeriksaan_oap = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      },
    },
  ];
  const match_pemeriksaan_kpb = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
      },
    },
  ];
  const match_pemeriksaan_sekolah_menangah = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        jenisFasiliti: 'sekolah-menengah', // ni placeholder saja ok
      },
    },
  ];
  const match_pemeriksaan_kolej_komuniti = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        kategoriInstitusi: { $eq: 'kolej-komuniti' },
      },
    },
  ];
  const match_pemeriksaan_kolej_vokasional = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        kategoriInstitusi: { $eq: 'kolej-vokasional' },
      },
    },
  ];
  const match_pemeriksaan_ipg = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        kategoriInstitusi: { $eq: 'ipg' },
      },
    },
  ];
  const match_pemeriksaan_ipta = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        kategoriInstitusi: { $eq: 'ipta' },
      },
    },
  ];
  const match_pemeriksaan_lainipt = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
        kategoriInstitusi: { $eq: 'lain-lain' },
      },
    },
  ];

  match_stage_pemeriksaan.push(
    match_pemeriksaan_15to17years,
    match_pemeriksaan_18to19years,
    match_pemeriksaan_20to29years,
    match_pemeriksaan_ibumengandung,
    match_pemeriksaan_oku,
    match_pemeriksaan_bukanWarganegara,
    match_pemeriksaan_oap,
    match_pemeriksaan_kpb,
    match_pemeriksaan_sekolah_menangah,
    match_pemeriksaan_kolej_komuniti,
    match_pemeriksaan_kolej_vokasional,
    match_pemeriksaan_ipg,
    match_pemeriksaan_ipta,
    match_pemeriksaan_lainipt
  );

  const group_pemeriksaan = [
    {
      $group: {
        _id: placeModifier(payload),
        // stats
        jumlahReten: { $sum: 1 },
        statusReten: {
          $sum: {
            $cond: [
              {
                $eq: ['$statusReten', 'reten salah'],
              },
              1,
              0,
            ],
          },
        },
        //
        // pemeriksaan
        kedatanganTahunSemasaBaru: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }],
              },
              1,
              0,
            ],
          },
        },
        jumlahLelaki: {
          $sum: {
            $cond: [
              {
                $eq: ['$jantina', 'lelaki'],
              },
              1,
              0,
            ],
          },
        },
        jumlahPerempuan: {
          $sum: {
            $cond: [
              {
                $eq: ['$jantina', 'perempuan'],
              },
              1,
              0,
            ],
          },
        },
        // perlu rawatan
        jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
        jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
        jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
        jumlahdfx: {
          $sum: {
            $add: [
              '$dAdaGigiDesidusPemeriksaanUmum',
              '$fAdaGigiDesidusPemeriksaanUmum',
              '$xAdaGigiDesidusPemeriksaanUmum',
            ],
          },
        },
        jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
        jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
        jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
        jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
        jumlahDMFX: {
          $sum: {
            $add: [
              '$dAdaGigiKekalPemeriksaanUmum',
              '$mAdaGigiKekalPemeriksaanUmum',
              '$fAdaGigiKekalPemeriksaanUmum',
              '$xAdaGigiKekalPemeriksaanUmum',
            ],
          },
        },
        jumlahMBK: {
          //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      { $lt: ['$umur', 1] },
                      {
                        $eq: [
                          '$yaTidakPesakitMempunyaiGigi',
                          'tidak-pesakit-mempunyai-gigi',
                        ],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 1] },
                      { $lte: ['$umur', 17] },
                      {
                        $eq: [
                          '$yaTidakPesakitMempunyaiGigi',
                          'tidak-pesakit-mempunyai-gigi',
                        ],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 1] },
                      { $lte: ['$umur', 17] },
                      { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                      { $eq: ['$adaKekalPemeriksaanUmum', false] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 1] },
                      { $lte: ['$umur', 17] },
                      { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                      { $eq: ['$adaKekalPemeriksaanUmum', true] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        statusBebasKaries: {
          //DMFX=0
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      { $gte: ['$umur', 5] },
                      { $eq: ['$adaKekalPemeriksaanUmum', true] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        TPR: {
          //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
          $sum: {
            $cond: [
              {
                $or: [
                  // baby punya kira
                  {
                    $and: [
                      { $lt: ['$umur', 1] },
                      {
                        $eq: [
                          '$yaTidakPesakitMempunyaiGigi',
                          'tidak-pesakit-mempunyai-gigi',
                        ],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $lt: ['$umur', 1] },
                      { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                      { $eq: ['$adaKekalPemeriksaanUmum', false] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    ],
                  },
                  // 1 tahun
                  {
                    $and: [
                      { $gte: ['$umur', 1] },
                      { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                      { $eq: ['$adaKekalPemeriksaanUmum', false] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                      {
                        $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 1] },
                      { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                      { $eq: ['$adaKekalPemeriksaanUmum', true] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                      {
                        $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 1] },
                      { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                      { $eq: ['$adaKekalPemeriksaanUmum', true] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                      {
                        $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 5] },
                      { $lte: ['$umur', 14] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                      {
                        $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                      },
                      {
                        $or: [
                          {
                            $eq: [
                              '$skorGisMulutOralHygienePemeriksaanUmum',
                              '0',
                            ],
                          },
                          {
                            $eq: [
                              '$skorGisMulutOralHygienePemeriksaanUmum',
                              '2',
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 15] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                      {
                        $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                      },
                      {
                        $or: [
                          {
                            $eq: [
                              '$skorGisMulutOralHygienePemeriksaanUmum',
                              '0',
                            ],
                          },
                          {
                            $eq: [
                              '$skorGisMulutOralHygienePemeriksaanUmum',
                              '2',
                            ],
                          },
                          {
                            $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    $and: [
                      { $gte: ['$umur', 1] },
                      { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                      { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        skorBPEZero: {
          $sum: {
            $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
          },
        },
        skorBPEMoreThanZero: {
          $sum: {
            $cond: [
              {
                $gte: ['$skorBpeOralHygienePemeriksaanUmum', '1'],
              },
              1,
              0,
            ],
          },
        },
        jumlahTSL: {
          $sum: {
            $cond: [
              {
                $eq: ['$toothSurfaceLossTraumaPemeriksaanUmum', true],
              },
              1,
              0,
            ],
          },
        },
        perluSapuanFluorida: {
          $sum: {
            $cond: [
              {
                $eq: [
                  '$fvPerluSapuanPemeriksaanUmum',
                  'ya-fv-perlu-sapuan-pemeriksaan-umum',
                ],
              },
              1,
              0,
            ],
          },
        },
        perluJumlahPesakitPrrJenis1: {
          $sum: {
            $cond: [
              {
                $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
              },
              1,
              0,
            ],
          },
        },
        perluJumlahGigiPrrJenis1: {
          $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
        },
        perluJumlahPesakitFS: {
          $sum: {
            $cond: [
              {
                $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
              },
              1,
              0,
            ],
          },
        },
        perluJumlahGigiFS: {
          $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
        },
        perluPenskaleran: {
          $sum: {
            $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
          },
        },
        perluEndoAnterior: {
          $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
        },
        perluEndoPremolar: {
          $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
        },
        perluEndoMolar: {
          $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
        },
        jumlahPerluDenturPenuh: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: [
                      '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                      'penuh-atas-perlu-denture-pemeriksaan-umum',
                    ],
                  },
                  {
                    $eq: [
                      '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                      'penuh-bawah-perlu-denture-pemeriksaan-umum',
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahPerluDenturSepara: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: [
                      '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                      'separa-atas-perlu-denture-pemeriksaan-umum',
                    ],
                  },
                  {
                    $eq: [
                      '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                      'separa-bawah-perlu-denture-pemeriksaan-umum',
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ];

  let match_stage_rawatan = [];

  const match_rawatan_15to17years = [
    {
      $match: {
        umur: { $gte: 15, $lte: 17 },
      },
    },
  ];
  const match_rawatan_18to19years = [
    {
      $match: {
        umur: { $gte: 18, $lte: 19 },
      },
    },
  ];
  const match_rawatan_20to29years = [
    {
      $match: {
        umur: { $gte: 20, $lte: 29 },
      },
    },
  ];
  const match_rawatan_ibumengandung = [
    {
      $match: {
        umur: { $gte: 7 },
        ibuMengandung: true,
      },
    },
  ];
  const match_rawatan_oku = [
    {
      $match: {
        orangKurangUpaya: true,
      },
    },
  ];
  const match_rawatan_bukanWarganegara = [
    {
      $match: {
        kumpulanEtnik: { $eq: 'bukan warganegara' },
      },
    },
  ];
  const match_rawatan_oap = [
    {
      $match: {
        kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      },
    },
  ];
  const match_rawatan_kpb = [
    {
      $match: {
        menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
      },
    },
  ];
  const match_sekolah_menangah = [
    {
      $match: {
        kategoriInstitusi: 'sekolah-menengah', // ni placeholder saja ok
      },
    },
  ];
  const match_rawatan_kolej_komuniti = [
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-komuniti' },
      },
    },
  ];
  const match_rawatan_kolej_vokasional = [
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-vokasional' },
      },
    },
  ];
  const match_rawatan_ipg = [
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipg' },
      },
    },
  ];
  const match_rawatan_ipta = [
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipta' },
      },
    },
  ];
  const match_rawatan_lainipt = [
    {
      $match: {
        kategoriInstitusi: { $eq: 'lain-lain' },
      },
    },
  ];

  const group_rawatan = [
    {
      $group: {
        _id: placeModifier(payload),
        kedatanganTahunSemasaUlangan: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
              },
              1,
              0,
            ],
          },
        },
        // dibuat rawatan
        sapuanFluorida: {
          //fvMuridB
          $sum: {
            $cond: [
              {
                $eq: ['$pesakitDibuatFluorideVarnish', true],
              },
              1,
              0,
            ],
          },
        },
        jumlahPesakitPrrJenis1: {
          //prrJ1MuridB
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gte: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 1],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahGigiPrrJenis1: {
          $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
        },
        jumlahPesakitDiBuatFs: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahGigiDibuatFs: {
          $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
        },
        tampalanAntGdBaru: {
          $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanAntGdSemula: {
          $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanAntGkBaru: {
          $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanAntGkSemula: {
          $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostGdBaru: {
          $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostGdSemula: {
          $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostGkBaru: {
          $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostGkSemula: {
          $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostAmgGdBaru: {
          $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostAmgGdSemula: {
          $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostAmgGkBaru: {
          $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        tampalanPostAmgGkSemula: {
          $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        tampalanSementara: {
          $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
        },
        cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
        cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
        komplikasiSelepasCabutan: {
          $sum: '$komplikasiSelepasCabutanRawatanUmum',
        },
        penskaleran: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$penskaleranRawatanUmum', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        abses: {
          //data sini campur sekolah form & umum form. blh ke?
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kecederaanTulangMuka: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$kecederaanTulangMukaUmum', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kecederaanGigi: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$kecederaanGigiUmum', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kecederaanTisuLembut: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$kecederaanTisuLembutUmum', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        prosthodontikPenuhDenturBaru: {
          $sum: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
        },
        prosthodontikPenuhDenturSemula: {
          $sum: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
        },
        jumlahPesakitBuatDenturPenuh: {
          $sum: {
            $add: [
              '$baruPenuhJumlahDenturProstodontikRawatanUmum',
              '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
            ],
          },
        },
        prosthodontikSeparaDenturBaru: {
          $sum: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
        },
        prosthodontikSeparaDenturSemula: {
          $sum: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
        },
        jumlahPesakitBuatDenturSepara: {
          $sum: {
            $add: [
              '$baruSeparaJumlahDenturProstodontikRawatanUmum',
              '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
            ],
          },
        },
        immediateDenture: {
          $sum: '$immediateDenturProstodontikRawatanUmum',
        },
        pembaikanDenture: {
          $sum: '$pembaikanDenturProstodontikRawatanUmum',
        },
        kesSelesai: {
          $sum: {
            $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
          },
        },
        xrayDiambil: { $sum: '$bilanganXrayYangDiambilRawatanUmum' },
        pesakitDisaringOC: {
          $sum: {
            $cond: [
              {
                $eq: [
                  '$disaringProgramKanserMulutPemeriksaanUmum',
                  'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ];

  match_stage_rawatan.push(
    match_rawatan_15to17years,
    match_rawatan_18to19years,
    match_rawatan_20to29years,
    match_rawatan_ibumengandung,
    match_rawatan_oku,
    match_rawatan_bukanWarganegara,
    match_rawatan_oap,
    match_rawatan_kpb,
    match_sekolah_menangah,
    match_rawatan_kolej_komuniti,
    match_rawatan_kolej_vokasional,
    match_rawatan_ipg,
    match_rawatan_ipta,
    match_rawatan_lainipt
  );

  // for gandalf
  const monsterOfDataSekolahPemeriksaan = await Fasiliti.aggregate([
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        jenisFasiliti: { $in: ['sekolah-menengah'] },
      },
    },
    {
      $project: {
        _id: 0,
        kodSekolah: 1,
        sesiTakwimSekolah: 1,
      },
    },
    {
      $lookup: {
        from: 'sekolahs',
        localField: 'kodSekolah',
        foreignField: 'kodSekolah',
        as: 'result',
      },
    },
    {
      $unwind: {
        path: '$result',
      },
    },
    {
      $addFields: {
        umur: '$result.umur',
        keturunan: '$result.keturunan',
        warganegara: '$result.warganegara',
        statusOku: '$result.statusOku',
        statusRawatan: '$result.statusRawatan',
        tahunTingkatan: '$result.tahunTingkatan',
        kelasPelajar: '$result.kelasPelajar',
        jantina: '$result.jantina',
        pemeriksaanSekolah: '$result.pemeriksaanSekolah',
      },
    },
    {
      $project: {
        result: 0,
      },
    },
    {
      $lookup: {
        from: 'pemeriksaansekolahs',
        localField: 'pemeriksaanSekolah',
        foreignField: '_id',
        as: 'pemeriksaanSekolah',
      },
    },
    {
      $unwind: {
        path: '$pemeriksaanSekolah',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        statusRawatan: 1,
        kodSekolah: 1,
        jantina: 1,
        umur: 1,
        keturunan: 1,
        warganegara: 1,
        statusOku: 1,
        tahunTingkatan: 1,
        kelasPelajar: 1,
        merged: {
          $mergeObjects: [
            '$pemeriksaanSekolah',
            // '$rawatanSekolah'
          ],
        },
      },
    },
    {
      $match: {
        umur: { $gte: 15, $lte: 17 },
        'merged.createdByMdcMdtb': { $regex: /^(?!mdtb).*$/i },
        'merged.tarikhPemeriksaanSemasa': {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
    {
      $group: {
        // _id: {
        //   $switch: {
        //     branches: [
        //       {
        //         case: {
        //           $and: [{ $gte: ['$umur', 15] }, { $lte: ['$umur', 17] }],
        //         },
        //         then: 'lima-belas-tujuh-belas',
        //       },
        //     ],
        //     default: 'Unknown',
        //   },
        // },
        _id: null,
        jumlahPelajar: {
          $sum: 1,
        },
        kedatanganTahunSemasaBaru: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahd: {
          $sum: '$merged.dAdaGigiDesidus',
        },
        jumlahf: {
          $sum: '$merged.fAdaGigiDesidus',
        },
        jumlahx: {
          $sum: '$merged.xAdaGigiDesidus',
        },
        jumlahdfx: {
          $sum: {
            $add: [
              '$merged.dAdaGigiDesidus',
              '$merged.fAdaGigiDesidus',
              '$merged.xAdaGigiDesidus',
            ],
          },
        },
        jumlahD: {
          $sum: '$merged.dAdaGigiKekal',
        },
        jumlahM: {
          $sum: '$merged.mAdaGigiKekal',
        },
        jumlahF: {
          $sum: '$merged.fAdaGigiKekal',
        },
        jumlahX: {
          $sum: '$merged.xAdaGigiKekal',
        },
        jumlahDMFX: {
          $sum: {
            $add: [
              '$merged.dAdaGigiKekal',
              '$merged.mAdaGigiKekal',
              '$merged.fAdaGigiKekal',
              '$merged.xAdaGigiKekal',
            ],
          },
        },
        jumlahMBK: {
          //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      {
                        $gte: ['$merged.umur', 1],
                      },
                      {
                        $lte: ['$merged.umur', 59],
                      },
                      {
                        $eq: ['$merged.dAdaGigiDesidusPemeriksaanUmum', 0],
                      },
                      {
                        $eq: ['$merged.mAdaGigiDesidusPemeriksaanUmum', 0],
                      },
                      {
                        $eq: ['$merged.fAdaGigiDesidusPemeriksaanUmum', 0],
                      },
                      {
                        $eq: ['$merged.xAdaGigiDesidusPemeriksaanUmum', 0],
                      },
                      {
                        $eq: ['$merged.dAdaGigiKekalPemeriksaanUmum', 0],
                      },
                      {
                        $eq: ['$merged.mAdaGigiKekalPemeriksaanUmum', 0],
                      },
                      {
                        $eq: ['$merged.fAdaGigiKekalPemeriksaanUmum', 0],
                      },
                      {
                        $eq: ['$merged.xAdaGigiKekalPemeriksaanUmum', 0],
                      },
                    ],
                  },
                  // {
                  //   $and: [
                  //     { $lte: ['$merge.umur', 6] },
                  //     { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
                  //     { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
                  //     { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
                  //   ],
                  // },
                ],
              },
              1,
              0,
            ],
          },
        },
        statusBebasKaries: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gte: ['$merged.umur', 1],
                  },
                  {
                    $lte: ['$merged.umur', 59],
                  },
                  {
                    $eq: ['$merged.dAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$merged.mAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$merged.fAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$merged.xAdaGigiKekal', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        TPR: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.dAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$merged.dAdaGigiDesidus', 0],
                  },
                  {
                    $eq: ['$merged.xAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$merged.xAdaGigiDesidus', 0],
                  },
                  {
                    $or: [
                      {
                        $eq: ['$merged.skorGisMulutOralHygiene', '0'],
                      },
                      {
                        $eq: ['$merged.skorGisMulutOralHygiene', '2'],
                      },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        skorBPEZero: {
          $sum: {
            $cond: [
              {
                $eq: ['$merged.skorBpeOralHygiene', '0'],
              },
              1,
              0,
            ],
          },
        },
        skorBPEMoreThanZero: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$merged.skorBpeOralHygiene', '0'] },
                  {
                    $eq: [
                      '$yaTidakPesakitMempunyaiGigi',
                      'ya-pesakit-mempunyai-gigi',
                    ],
                  },
                  { $ne: ['$merged.skorBpeOralHygiene', 'tiada'] },
                  {
                    $ne: ['$merged.skorBpeOralHygiene', ''],
                  },
                  {
                    $ne: ['$merged.skorBpeOralHygiene', null],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        // perlu rawatan
        perluSapuanFluorida: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.baruJumlahMuridPerluFv', true],
                  },
                  {
                    $gt: ['$merged.semulaJumlahMuridPerluFv', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        perluJumlahPesakitPrrJenis1: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.baruJumlahGigiKekalPerluPrrJenis1', true],
                  },
                  {
                    $gt: ['$merged.semulaJumlahGigiKekalPerluPrrJenis1', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        perluJumlahGigiPrrJenis1: {
          $sum: {
            $add: [
              '$merged.baruJumlahGigiKekalPerluPrrJenis1',
              '$merged.semulaJumlahGigiKekalPerluPrrJenis1',
            ],
          },
        },
        perluJumlahPesakitFS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.baruJumlahMuridPerluFs', true],
                  },
                  {
                    $gt: ['$merged.semulaJumlahMuridPerluFs', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        perluJumlahGigiFS: {
          $sum: '$merged.semulaJumlahGigiKekalPerluFs',
        },
        //
        perluPenskaleran: {
          $sum: {
            $cond: [
              { $eq: ['$merged.perluPenskaleranOralHygiene', true] },
              1,
              0,
            ],
          },
        },
        // mungkin akan digunakan di masa depan hehe boi
        // perluEndoAnterior: {
        //   $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
        // },
        // perluEndoPremolar: {
        //   $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
        // },
        // perluEndoMolar: {
        //   $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
        // },
        // jumlahPerluDenturPenuh: {
        //   $sum: {
        //     $cond: [
        //       {
        //         $or: [
        //           {
        //             $eq: [
        //               '$separaPenuhAtasPerluDenturePemeriksaanUmum',
        //               'penuh-atas-perlu-denture-pemeriksaan-umum',
        //             ],
        //           },
        //           {
        //             $eq: [
        //               '$separaPenuhBawahPerluDenturePemeriksaanUmum',
        //               'penuh-bawah-perlu-denture-pemeriksaan-umum',
        //             ],
        //           },
        //         ],
        //       },
        //       1,
        //       0,
        //     ],
        //   },
        // },
        // jumlahPerluDenturSepara: {
        //   $sum: {
        //     $cond: [
        //       {
        //         $or: [
        //           {
        //             $eq: [
        //               '$separaPenuhAtasPerluDenturePemeriksaanUmum',
        //               'separa-atas-perlu-denture-pemeriksaan-umum',
        //             ],
        //           },
        //           {
        //             $eq: [
        //               '$separaPenuhBawahPerluDenturePemeriksaanUmum',
        //               'separa-bawah-perlu-denture-pemeriksaan-umum',
        //             ],
        //           },
        //         ],
        //       },
        //       1,
        //       0,
        //     ],
        //   },
        // },
      },
    },
  ]);

  const monsterOfDataSekolahRawatan = await Fasiliti.aggregate([
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        jenisFasiliti: { $in: ['sekolah-menengah'] },
      },
    },
    {
      $project: {
        _id: 0,
        kodSekolah: 1,
        sesiTakwimSekolah: 1,
      },
    },
    {
      $lookup: {
        from: 'sekolahs',
        localField: 'kodSekolah',
        foreignField: 'kodSekolah',
        as: 'result',
      },
    },
    {
      $unwind: {
        path: '$result',
      },
    },
    {
      $addFields: {
        umur: '$result.umur',
        keturunan: '$result.keturunan',
        warganegara: '$result.warganegara',
        statusOku: '$result.statusOku',
        statusRawatan: '$result.statusRawatan',
        tahunTingkatan: '$result.tahunTingkatan',
        kelasPelajar: '$result.kelasPelajar',
        jantina: '$result.jantina',
        rawatanSekolah: '$result.rawatanSekolah',
      },
    },
    {
      $project: {
        result: 0,
      },
    },
    {
      $lookup: {
        from: 'rawatansekolahs',
        localField: 'rawatanSekolah',
        foreignField: '_id',
        as: 'rawatanSekolah',
      },
    },
    {
      $unwind: {
        path: '$rawatanSekolah',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        statusRawatan: 1,
        kodSekolah: 1,
        jantina: 1,
        umur: 1,
        keturunan: 1,
        warganegara: 1,
        statusOku: 1,
        tahunTingkatan: 1,
        kelasPelajar: 1,
        merged: {
          $mergeObjects: [
            // '$pemeriksaanSekolah',
            '$rawatanSekolah',
          ],
        },
      },
    },
    {
      $match: {
        umur: { $gte: 15, $lte: 17 },
        'merged.createdByMdcMdtb': { $regex: /^(?!mdtb).*$/i },
        'merged.tarikhRawatanSemasa': {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
    {
      $group: {
        // _id: {
        //   $switch: {
        //     branches: [
        //       {
        //         case: {
        //           $and: [{ $gte: ['$umur', 15] }, { $lte: ['$umur', 17] }],
        //         },
        //         then: 'lima-belas-tujuh-belas',
        //       },
        //     ],
        //     default: 'Unknown',
        //   },
        // },
        _id: null,
        // rawatan
        kedatanganTahunSemasaUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.kedatangan', 'ulangan-kedatangan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        sapuanFluorida: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                  },
                  {
                    $gt: ['$merged.baruJumlahGigiKekalDiberiFv', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahPesakitPrrJenis1: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                  },
                  {
                    $eq: ['$merged.muridDiberiPrrJenis1', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahGigiPrrJenis1: {
          $sum: '$merged.baruJumlahGigiKekalDiberiPrrJenis1',
        },
        jumlahPesakitDiBuatFs: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                  },
                  {
                    $eq: ['$merged.muridDibuatFs', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahGigiDibuatFs: {
          $sum: '$merged.baruJumlahGigiKekalDibuatFs',
        },
        tampalanAntGdBaru: {
          $sum: '$merged.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanAntGdSemula: {
          $sum: '$merged.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanAntGkBaru: {
          $sum: '$merged.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanAntGkSemula: {
          $sum: '$merged.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanPostGdBaru: {
          $sum: '$merged.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanPostGdSemula: {
          $sum: '$merged.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanPostGkBaru: {
          $sum: '$merged.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanPostGkSemula: {
          $sum: '$merged.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
        },
        tampalanPostAmgGdBaru: {
          $sum: '$merged.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
        },
        tampalanPostAmgGdSemula: {
          $sum: '$merged.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
        },
        tampalanPostAmgGkBaru: {
          $sum: '$merged.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
        },
        tampalanPostAmgGkSemula: {
          $sum: '$merged.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
        },
        tampalanSementara: {
          $sum: '$merged.jumlahTampalanSementaraSekolahRawatan',
        },
        cabutanGd: {
          $sum: '$merged.cabutDesidusSekolahRawatan',
        },
        cabutanGk: {
          $sum: '$merged.cabutKekalSekolahRawatan',
        },
        penskaleran: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.penskaleranSekolahRawatan', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        abses: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$merged.absesSekolahRawatan', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kesSelesai: {
          $sum: {
            $cond: [
              {
                $eq: ['$merged.kesSelesaiSekolahRawatan', true],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  // operator lain

  // let match_stage_operatorLain = [];

  // const match_operatorLain_15to17years = [
  //   {
  //     $match: {
  //       umur: { $gte: 15, $lte: 17 },
  //       rawatanDibuatOperatorLain: true,
  //     },
  //   },
  // ];
  // const match_operatorLain_18to19years = [
  //   {
  //     $match: {
  //       umur: { $gte: 18, $lte: 19 },
  //       rawatanDibuatOperatorLain: true,
  //     },
  //   },
  // ];
  // const match_operatorLain_20to29years = [
  //   {
  //     $match: {
  //       umur: { $gte: 20, $lte: 29 },
  //       rawatanDibuatOperatorLain: true,
  //     },
  //   },
  // ];
  // const match_operatorLain_ibumengandung = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       umur: { $gte: 7 },
  //       ibuMengandung: true,
  //     },
  //   },
  // ];
  // const match_operatorLain_oku = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       orangKurangUpaya: true,
  //     },
  //   },
  // ];
  // const match_operatorLain_bukanWarganegara = [
  //   {
  //     $match: {
  //       kumpulanEtnik: { $eq: 'bukan warganegara' },
  //       rawatanDibuatOperatorLain: true,
  //     },
  //   },
  // ];
  // const match_operatorLain_oap = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
  //     },
  //   },
  // ];
  // const match_operatorLain_kpb = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
  //     },
  //   },
  // ];
  // // sm - placeholder
  // const match_operatorLain_kolej_komuniti = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       kategoriInstitusi: { $eq: 'kolej-komuniti' },
  //     },
  //   },
  // ];
  // const match_operatorLain_kolej_vokasional = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       kategoriInstitusi: { $eq: 'kolej-vokasional' },
  //     },
  //   },
  // ];
  // const match_operatorLain_ipg = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       kategoriInstitusi: { $eq: 'ipg' },
  //     },
  //   },
  // ];
  // const match_operatorLain_ipta = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       kategoriInstitusi: { $eq: 'ipta' },
  //     },
  //   },
  // ];
  // const match_operatorLain_lainipt = [
  //   {
  //     $match: {
  //       rawatanDibuatOperatorLain: true,
  //       kategoriInstitusi: { $eq: 'lain-lain' },
  //     },
  //   },
  // ];

  // match_stage_operatorLain.push(
  //   match_operatorLain_15to17years,
  //   match_operatorLain_18to19years,
  //   match_operatorLain_20to29years,
  //   match_operatorLain_ibumengandung,
  //   match_operatorLain_oku,
  //   match_operatorLain_bukanWarganegara,
  //   match_operatorLain_oap,
  //   match_operatorLain_kpb,
  //   match_operatorLain_kolej_komuniti,
  //   match_operatorLain_kolej_vokasional,
  //   match_operatorLain_ipg,
  //   match_operatorLain_ipta,
  //   match_operatorLain_lainipt
  // );

  // const group_operatorLain = [
  //   {
  //     $group: {
  //       _id: placeModifier(payload),
  //       // dibuat rawatan
  //       sapuanFluorida: {
  //         //fvMuridB
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$pesakitDibuatFluorideVarnish', true],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       jumlahPesakitPrrJenis1: {
  //         //prrJ1MuridB
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $gte: [
  //                     {
  //                       $cond: [
  //                         {
  //                           $eq: [
  //                             '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                             '',
  //                           ],
  //                         },
  //                         0,
  //                         {
  //                           $toInt:
  //                             '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                         },
  //                       ],
  //                     },
  //                     1,
  //                   ],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       jumlahGigiPrrJenis1: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       jumlahPesakitDiBuatFs: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $gte: [
  //                     {
  //                       $cond: [
  //                         {
  //                           $eq: [
  //                             '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //                             '',
  //                           ],
  //                         },
  //                         0,
  //                         {
  //                           $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //                         },
  //                       ],
  //                     },
  //                     1,
  //                   ],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       jumlahGigiDibuatFs: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanAntGdBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanAntGdSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanAntGkBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanAntGkSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostGdBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostGdSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostGkBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostGkSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostAmgGdBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostAmgGdSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostAmgGkBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       tampalanPostAmgGkSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       inlayOnlayBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       }, //data sudah dpt dari form umum
  //       inlayOnlaySemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       }, //data sudah dpt dari form umum
  //       tampalanSementara: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //                 '',
  //               ],
  //             },
  //             0,
  //             {
  //               $toInt:
  //                 '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       cabutanGd: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$cabutDesidusRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$cabutDesidusRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       cabutanGk: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$cabutKekalRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$cabutKekalRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       komplikasiSelepasCabutan: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$komplikasiSelepasCabutanRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       penskaleran: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$penskaleranRawatanUmum', true],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       rawatanPerioLain: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$rawatanLainPeriodontikRawatanUmum', true],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       rawatanEndoAnterior: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$jumlahAnteriorKesEndodontikSelesaiRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       rawatanEndoPremolar: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$jumlahPremolarKesEndodontikSelesaiRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       rawatanEndoMolar: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$jumlahMolarKesEndodontikSelesaiRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       rawatanOrtho: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $eq: ['$rawatanOrtodontikRawatanUmum', true],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       kesPerubatan: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $eq: ['$kesPerubatanMulutRawatanUmum', true],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       abses: {
  //         //data sini campur sekolah form & umum form. blh ke?
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       kecederaanTulangMuka: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $eq: ['$kecederaanTulangMukaUmum', true],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       kecederaanGigi: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $eq: ['$kecederaanGigiUmum', true],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       kecederaanTisuLembut: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $and: [
  //                 {
  //                   $eq: ['$kecederaanTisuLembutUmum', true],
  //                 },
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       cabutanSurgical: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$cabutanSurgikalPembedahanMulutRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$cabutanSurgikalPembedahanMulutRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       pembedahanKecilMulut: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
  //                 'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //       crownBridgeBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruJumlahCrownBridgeRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruJumlahCrownBridgeRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       crownBridgeSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$semulaJumlahCrownBridgeRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$semulaJumlahCrownBridgeRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       postCoreBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruJumlahPostCoreRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruJumlahPostCoreRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       postCoreSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$semulaJumlahPostCoreRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$semulaJumlahPostCoreRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       prosthodontikPenuhDenturBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       prosthodontikPenuhDenturSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       jumlahPesakitBuatDenturPenuh: {
  //         $sum: {
  //           $add: [
  //             {
  //               $cond: [
  //                 {
  //                   $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //                 },
  //                 0,
  //                 {
  //                   $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //                 },
  //               ],
  //             },
  //             {
  //               $cond: [
  //                 {
  //                   $eq: [
  //                     '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //                     '',
  //                   ],
  //                 },
  //                 0,
  //                 {
  //                   $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //       prosthodontikSeparaDenturBaru: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       prosthodontikSeparaDenturSemula: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       jumlahPesakitBuatDenturSepara: {
  //         $sum: {
  //           $add: [
  //             {
  //               $cond: [
  //                 {
  //                   $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //                 },
  //                 0,
  //                 {
  //                   $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //                 },
  //               ],
  //             },
  //             {
  //               $cond: [
  //                 {
  //                   $eq: [
  //                     '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
  //                     '',
  //                   ],
  //                 },
  //                 0,
  //                 {
  //                   $toInt: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //       immediateDenture: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$immediateDenturProstodontikRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$immediateDenturProstodontikRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       pembaikanDenture: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$pembaikanDenturProstodontikRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$pembaikanDenturProstodontikRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       kesSelesai: {
  //         $sum: {
  //           $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
  //         },
  //       },
  //       xrayDiambil: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ['$bilanganXrayYangDiambilRawatanUmum', ''],
  //             },
  //             0,
  //             {
  //               $toInt: '$bilanganXrayYangDiambilRawatanUmum',
  //             },
  //           ],
  //         },
  //       },
  //       pesakitDisaringOC: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: [
  //                 '$disaringProgramKanserMulutPemeriksaanUmum',
  //                 'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
  //               ],
  //             },
  //             1,
  //             0,
  //           ],
  //         },
  //       },
  //     },
  //   },
  // ];

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataOperatorLain = [];
    let bigData = [];

    for (const pemeriksaan of match_stage_pemeriksaan) {
      const queryDMPemeriksaan = await Umum.aggregate([
        ...main_switch,
        ...pemeriksaan,
        ...group_pemeriksaan,
      ]);
      dataPemeriksaan.push({ queryDMPemeriksaan });
    }

    for (const rawatan of match_stage_rawatan) {
      const queryDMRawatan = await Umum.aggregate([
        ...main_switch,
        ...rawatan,
        ...group_rawatan,
      ]);
      dataRawatan.push({ queryDMRawatan });
    }

    // if (!payload.pilihanIndividu) {
    //   for (const opLain of match_stage_operatorLain) {
    //     const queryOperatorLain = await Umum.aggregate([
    //       ...main_switch,
    //       ...opLain,
    //       ...getParamsOperatorLain,
    //       ...group_operatorLain,
    //     ]);
    //     dataOperatorLain.push({ queryOperatorLain });
    //   }
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    bigData.push(monsterOfDataSekolahPemeriksaan);
    bigData.push(monsterOfDataSekolahRawatan);
    // bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countOAP = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsOAP(payload),
    },
  };

  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };

  match_stage_pemeriksaan.push(
    match_pemeriksaan_below1year,
    match_pemeriksaan_1to4years,
    match_pemeriksaan_5to6years,
    match_pemeriksaan_7to9years,
    match_pemeriksaan_10to12years,
    match_pemeriksaan_13to14years,
    match_pemeriksaan_15to17years,
    match_pemeriksaan_18to19years,
    match_pemeriksaan_20to29years,
    match_pemeriksaan_30to49years,
    match_pemeriksaan_50to59years,
    match_pemeriksaan_60yearsandup,
    match_pemeriksaan_ibumengandung,
    match_pemeriksaan_oku
  );

  const group_pemeriksaan = {
    $group: {
      _id: placeModifier(payload),
      // stats
      jumlahReten: { $sum: 1 },
      statusReten: {
        $sum: {
          $cond: [
            {
              $eq: ['$statusReten', 'reten salah'],
            },
            1,
            0,
          ],
        },
      },
      //
      // pemeriksaan
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // perlu rawatan
      jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
      jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
      jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
      jumlahdfx: {
        $sum: {
          $add: [
            '$dAdaGigiDesidusPemeriksaanUmum',
            '$fAdaGigiDesidusPemeriksaanUmum',
            '$xAdaGigiDesidusPemeriksaanUmum',
          ],
        },
      },
      jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
      jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
      jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
      jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
      jumlahDMFX: {
        $sum: {
          $add: [
            '$dAdaGigiKekalPemeriksaanUmum',
            '$mAdaGigiKekalPemeriksaanUmum',
            '$fAdaGigiKekalPemeriksaanUmum',
            '$xAdaGigiKekalPemeriksaanUmum',
          ],
        },
      },
      jumlahMBK: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKaries: {
        //DMFX=0
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $or: [
                // baby punya kira
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                // 1 tahun
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $lte: ['$umur', 14] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 15] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                        {
                          $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      skorBPEZero: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPEMoreThanZero: {
        $sum: {
          $cond: [
            {
              $gte: ['$skorBpeOralHygienePemeriksaanUmum', '1'],
            },
            1,
            0,
          ],
        },
      },
      adaTSL: {
        $sum: {
          $cond: [
            {
              $eq: ['$toothSurfaceLossTraumaPemeriksaanUmum', true],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$fvPerluSapuanPemeriksaanUmum',
                'ya-fv-perlu-sapuan-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
      },
      perluPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      jumlahPerluDenturPenuh: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'penuh-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'penuh-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahPerluDenturSepara: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'separa-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'separa-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage = [];

  const match_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      orangKurangUpaya: true,
    },
  };

  match_stage.push(
    match_below1year,
    match_1to4years,
    match_5to6years,
    match_7to9years,
    match_10to12years,
    match_13to14years,
    match_15to17years,
    match_18to19years,
    match_20to29years,
    match_30to49years,
    match_50to59years,
    match_60yearsandup,
    match_ibumengandung,
    match_oku
  );

  const group = {
    $group: {
      _id: placeModifier(payload),
      kedatanganTahunSemasaUlangan: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // dibuat rawatan
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $eq: ['$pesakitDibuatFluorideVarnish', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitPrrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
      },
      tampalanAntGdBaru: {
        $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGdSemula: {
        $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkBaru: {
        $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkSemula: {
        $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdBaru: {
        $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdSemula: {
        $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkBaru: {
        $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkSemula: {
        $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdBaru: {
        $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdSemula: {
        $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkBaru: {
        $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkSemula: {
        $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      inlayOnlayBaru: {
        $sum: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
      }, //data sudah dpt dari form umum
      inlayOnlaySemula: {
        $sum: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
      }, //data sudah dpt dari form umum
      tampalanSementara: {
        $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
      },
      cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
      cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
      komplikasiSelepasCabutan: {
        $sum: '$komplikasiSelepasCabutanRawatanUmum',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$penskaleranRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      rawatanPerioLain: {
        $sum: '$rawatanLainPeriodontikRawatanUmum',
      },
      rawatanEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
      },
      rawatanEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
      },
      rawatanEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
      },
      rawatanOrtho: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$rawatanOrtodontikRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kesPerubatan: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kesPerubatanMulutRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      abses: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTulangMuka: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTulangMukaUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanGigi: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanGigiUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTisuLembut: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      cabutanSurgical: {
        $sum: '$cabutanSurgikalPembedahanMulutRawatanUmum',
      },
      pembedahanKecilMulut: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
                'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      crownBridgeBaru: {
        $sum: '$baruJumlahCrownBridgeRawatanUmum',
      },
      crownBridgeSemula: {
        $sum: '$semulaJumlahCrownBridgeRawatanUmum',
      },
      postCoreBaru: { $sum: '$baruJumlahPostCoreRawatanUmum' },
      postCoreSemula: { $sum: '$semulaJumlahPostCoreRawatanUmum' },
      prosthodontikPenuhDenturBaru: {
        $sum: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikPenuhDenturSemula: {
        $sum: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            '$baruPenuhJumlahDenturProstodontikRawatanUmum',
            '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikSeparaDenturSemula: {
        $sum: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      immediateDenture: {
        $sum: '$immediateDenturProstodontikRawatanUmum',
      },
      pembaikanDenture: {
        $sum: '$pembaikanDenturProstodontikRawatanUmum',
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: { $sum: '$bilanganXrayYangDiambilRawatanUmum' },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$disaringProgramKanserMulutPemeriksaanUmum',
                'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // untuk sekolah

  // let match_stage_sekolah = [];

  // const match_sekolah_below1year = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //   },
  // };
  // const match_sekolah_1to4years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     umur: { $gte: 1, $lte: 4 },
  //   },
  // };
  // const match_sekolah_5to6years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 5, $lte: 6 },
  //   },
  // };
  // const match_sekolah_7to9years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7, $lte: 9 },
  //   },
  // };
  // const match_sekolah_10to12years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 10, $lte: 12 },
  //   },
  // };
  // const match_sekolah_13to14years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 13, $lte: 14 },
  //   },
  // };
  // const match_sekolah_15to17years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 15, $lte: 17 },
  //   },
  // };
  // const match_sekolah_18to19years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 18, $lte: 19 },
  //   },
  // };
  // const match_sekolah_20to29years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     umur: { $gte: 20, $lte: 29 },
  //   },
  // };
  // const match_sekolah_30to49years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     umur: { $gte: 30, $lte: 49 },
  //   },
  // };
  // const match_sekolah_50to59years = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     umur: { $gte: 50, $lte: 59 },
  //   },
  // };
  // const match_sekolah_60yearsandup = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     umur: { $gte: 60 },
  //   },
  // };
  // const match_sekolah_ibumengandung = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //   },
  // };
  // const match_sekolah_oku = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     orangKurangUpaya: true,
  //   },
  // };
  // const match_sekolah_bukanWarganegara = {
  //   $match: {
  //     ...getParams207sekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     kumpulanEtnik: { $eq: 'bukan warganegara' },
  //   },
  // };

  // match_stage_sekolah.push(match_sekolah_below1year);
  // match_stage_sekolah.push(match_sekolah_1to4years);
  // match_stage_sekolah.push(match_sekolah_5to6years);
  // match_stage_sekolah.push(match_sekolah_7to9years);
  // match_stage_sekolah.push(match_sekolah_10to12years);
  // match_stage_sekolah.push(match_sekolah_13to14years);
  // match_stage_sekolah.push(match_sekolah_15to17years);
  // match_stage_sekolah.push(match_sekolah_18to19years);
  // match_stage_sekolah.push(match_sekolah_20to29years);
  // match_stage_sekolah.push(match_sekolah_30to49years);
  // match_stage_sekolah.push(match_sekolah_50to59years);
  // match_stage_sekolah.push(match_sekolah_60yearsandup);
  // match_stage_sekolah.push(match_sekolah_ibumengandung);
  // match_stage_sekolah.push(match_sekolah_oku);
  // match_stage_sekolah.push(match_sekolah_bukanWarganegara);

  // let pipeline_sekolah = [
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$pemeriksaanSekolah',
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'rawatansekolahs',
  //       localField: 'rawatanSekolah',
  //       foreignField: '_id',
  //       as: 'rawatanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$rawatanSekolah',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: { $toInt: '$umur' },
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       merged: {
  //         $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: 1,
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       createdByKp: '$merged.createdByKp',
  //       tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
  //       merged: 1,
  //     },
  //   },
  // ];

  // const group_sekolah = {
  //   $group: {
  //     _id: '$merged.createdByKp',
  //     jumlahPelajar: {
  //       $sum: 1,
  //     },
  //     kedatanganTahunSemasaBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahd: {
  //       $sum: '$merged.dAdaGigiDesidus',
  //     },
  //     jumlahf: {
  //       $sum: '$merged.fAdaGigiDesidus',
  //     },
  //     jumlahx: {
  //       $sum: '$merged.xAdaGigiDesidus',
  //     },
  //     jumlahdfx: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiDesidus',
  //           '$merged.fAdaGigiDesidus',
  //           '$merged.xAdaGigiDesidus',
  //         ],
  //       },
  //     },
  //     jumlahD: {
  //       $sum: '$merged.dAdaGigiKekal',
  //     },
  //     jumlahM: {
  //       $sum: '$merged.mAdaGigiKekal',
  //     },
  //     jumlahF: {
  //       $sum: '$merged.fAdaGigiKekal',
  //     },
  //     jumlahX: {
  //       $sum: '$merged.xAdaGigiKekal',
  //     },
  //     jumlahDMFX: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiKekal',
  //           '$merged.mAdaGigiKekal',
  //           '$merged.fAdaGigiKekal',
  //           '$merged.xAdaGigiKekal',
  //         ],
  //       },
  //     },
  //     jumlahMBK: {
  //       //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $gte: ['$merge.umur', 1] },
  //                   { $lte: ['$merge.umur', 59] },
  //                   {
  //                     $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                 ],
  //               },
  //               // {
  //               //   $and: [
  //               //     { $lte: ['$merge.umur', 6] },
  //               //     { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //   ],
  //               // },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     statusBebasKaries: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               { $gte: ['$merge.umur', 1] },
  //               { $lte: ['$merge.umur', 59] },
  //               { $eq: ['$merged.dAdaGigiKekal', 0] },
  //               { $eq: ['$merged.mAdaGigiKekal', 0] },
  //               { $eq: ['$merged.fAdaGigiKekal', 0] },
  //               { $eq: ['$merged.xAdaGigiKekal', 0] },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     TPR: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $eq: ['$merged.dAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.dAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.mAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.mAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.fAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.fAdaGigiDesidus', 0] },
  //                   { $eq: ['$merged.xAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.xAdaGigiDesidus', 0] },
  //                   {
  //                     $or: [
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '0'],
  //                       },
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '2'],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //               {
  //                 $eq: ['$tidakPerluRawatan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.skorBpeOralHygiene', 0],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEMoreThanZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $gte: ['$merged.skorBpeOralHygiene', 1],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluSapuanFluorida: {
  //       $sum: {
  //         $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
  //       },
  //     },
  //     perluJumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
  //     },
  //     perluJumlahPesakitFS: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.fissureSealant', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiFS: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluFS',
  //     },
  //     perluPenskaleran: {
  //       $sum: {
  //         $eq: ['$merged.perluPenskaleran', true],
  //       },
  //     },
  //     perluEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikDiperlukan',
  //     },
  //     perluEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikDiperlukan',
  //     },
  //     perluEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikDiperlukan',
  //     },
  //     jumlahPerluDenturPenuh: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'penuh-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'penuh-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPerluDenturSepara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'separa-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'separa-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kedatanganTahunSemasaUlangan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'ulangan-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     sapuanFluorida: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $or: [
  //                   {
  //                     $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                   {
  //                     $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $eq: ['$merged.pesakitDibuatPRRJenis1', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: '$merged.pesakitDibuatFissureSealant',
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: '$merged.baruJumlahGigiKekalDibuatFS',
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: '$merged.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: '$merged.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: '$merged.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: '$merged.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     inlayOnlayBaru: {
  //       $sum: '$merged.baruInlayOnlayJumlahTampalanDibuat',
  //     },
  //     inlayOnlaySemula: {
  //       $sum: '$merged.semulaInlayOnlayJumlahTampalanDibuat',
  //     },
  //     tampalanSementara: {
  //       $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
  //     },
  //     cabutanGd: {
  //       $sum: '$merged.cabutDesidus',
  //     },
  //     cabutanGk: {
  //       $sum: '$merged.cabutKekal',
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: '$merged.komplikasiSelepasCabutan',
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.penskaleran', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: '$merged.rawatanLainPeriodontik',
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikSelesai',
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikSelesai',
  //     },
  //     rawatanEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikSelesai',
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.rawatanOrtodontik', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kesPerubatanMulut', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.yaTidakAbsesPembedahan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: '$merged.cabutanSurgikalPembedahanMulut',
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.yaTidakPembedahanKecilMulutPembedahan',
  //               'ya-pembedahan-kecil-mulut-pembedahan',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: '$merged.baruJumlahCrownBridge',
  //     },
  //     crownBridgeSemula: {
  //       $sum: '$merged.semulaJumlahCrownBridge',
  //     },
  //     postCoreBaru: {
  //       $sum: '$merged.baruJumlahPostCore',
  //     },
  //     postCoreSemula: {
  //       $sum: '$merged.semulaJumlahPostCore',
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: '$merged.baruPenuhJumlahDenturProstodontik',
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: '$merged.semulaPenuhJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruPenuhJumlahDenturProstodontik',
  //           '$merged.semulaPenuhJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: '$merged.baruSeparaJumlahDenturProstodontik',
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: '$merged.semulaSeparaJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruSeparaJumlahDenturProstodontik',
  //           '$merged.semulaSeparaJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: '$merged.immediateDenturProstodontik',
  //     },
  //     pembaikanDenture: {
  //       $sum: '$merged.pembaikanDenturProstodontik',
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.kesSelesai', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: '$merged.bilanganXrayYangDiambil',
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.disaringProgramKanserMulut',
  //               'ya-disaring-program-kanser-mulut',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  // let match_stage_operatorLain = [];

  // const match_operatorLain_below1year = {
  //   $match: {
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_1to4years = {
  //   $match: {
  //     umur: { $gte: 1, $lte: 4 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_5to6years = {
  //   $match: {
  //     umur: { $gte: 5, $lte: 6 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_7to9years = {
  //   $match: {
  //     umur: { $gte: 7, $lte: 9 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_10to12years = {
  //   $match: {
  //     umur: { $gte: 10, $lte: 12 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_13to14years = {
  //   $match: {
  //     umur: { $gte: 13, $lte: 14 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_15to17years = {
  //   $match: {
  //     umur: { $gte: 15, $lte: 17 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_18to19years = {
  //   $match: {
  //     umur: { $gte: 18, $lte: 19 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_20to29years = {
  //   $match: {
  //     umur: { $gte: 20, $lte: 29 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_30to49years = {
  //   $match: {
  //     umur: { $gte: 30, $lte: 49 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_50to59years = {
  //   $match: {
  //     umur: { $gte: 50, $lte: 59 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_60yearsandup = {
  //   $match: {
  //     umur: { $gte: 60 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_ibumengandung = {
  //   $match: {
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oku = {
  //   $match: {
  //     orangKurangUpaya: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };

  // match_stage_operatorLain.push(
  //   match_operatorLain_below1year,
  //   match_operatorLain_1to4years,
  //   match_operatorLain_5to6years,
  //   match_operatorLain_7to9years,
  //   match_operatorLain_10to12years,
  //   match_operatorLain_13to14years,
  //   match_operatorLain_15to17years,
  //   match_operatorLain_18to19years,
  //   match_operatorLain_20to29years,
  //   match_operatorLain_30to49years,
  //   match_operatorLain_50to59years,
  //   match_operatorLain_60yearsandup,
  //   match_operatorLain_ibumengandung,
  //   match_operatorLain_oku
  // );

  // const group_operatorLain = {
  //   $group: {
  //     _id: placeModifier(payload),
  //     // dibuat rawatan
  //     sapuanFluorida: {
  //       //fvMuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pesakitDibuatFluorideVarnish', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       //prrJ1MuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: [
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                           '',
  //                         ],
  //                       },
  //                       0,
  //                       {
  //                         $toInt:
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //                       },
  //                       0,
  //                       {
  //                         $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     inlayOnlayBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     inlayOnlaySemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     tampalanSementara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGd: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutDesidusRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutDesidusRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGk: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutKekalRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutKekalRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$komplikasiSelepasCabutanRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$penskaleranRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$rawatanLainPeriodontikRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahAnteriorKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahPremolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoMolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahMolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$rawatanOrtodontikRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kesPerubatanMulutRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       //data sini campur sekolah form & umum form. blh ke?
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutanSurgikalPembedahanMulutRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutanSurgikalPembedahanMulutRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
  //               'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     crownBridgeSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$immediateDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$immediateDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembaikanDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pembaikanDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$pembaikanDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$bilanganXrayYangDiambilRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$bilanganXrayYangDiambilRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$disaringProgramKanserMulutPemeriksaanUmum',
  //               'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  //

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataSekolah = [];
    // let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        main_switch,
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryOAPPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryOAPPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, match_stage[i], group];
      const queryOAPRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryOAPRawatan });
    }

    // for (let i = 0; i < match_stage_sekolah.length; i++) {
    //   const pipeline = [
    //     ...pipeline_sekolah,
    //     match_stage_sekolah[i],
    //     group_sekolah,
    //   ];
    //   const querySekolah = await Sekolah.aggregate(pipeline);
    //   dataSekolah.push({ querySekolah });
    // }

    // if (!payload.pilihanIndividu) {
    //   for (let i = 0; i < match_stage_operatorLain.length; i++) {
    //     const pipeline = [
    //       main_switch,
    //       match_stage_operatorLain[i],
    //       ...getParamsOperatorLain,
    //       group_operatorLain,
    //     ];
    //     const queryOAPOperatorLain = await Umum.aggregate(pipeline);
    //     dataOperatorLain.push({ queryOAPOperatorLain });
    //   }
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    // bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countLiputanOAP = async (payload) => {
  const match = {
    $match: {
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      kedatangan: 'baru-kedatangan',
      jenisFasiliti: { $ne: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    },
  };

  const group = {
    $group: {
      _id: '$negeriAlamat',
      jumlah: { $sum: 1 },
    },
  };

  try {
    const data = await Umum.aggregate([match, group]);

    if (data.length === 0) {
      errorRetenLogger.error(
        `Error mengira reten: ${payload.jenisReten}. Tiada data yang dijumpai.`
      );
      throw new Error('Tiada data yang dijumpai');
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
const countKPBMPBHarian = async (payload) => {
  const { negeri, daerah, klinik } = payload;

  let match_stage = [];

  let match = {
    $match: {
      ...(negeri ? { createdByNegeri: negeri } : []),
      ...(daerah ? { createdByDaerah: daerah } : []),
      ...(klinik ? { createdByKodFasiliti: klinik } : []),
      jenisFasiliti: { $in: ['kpb', 'mpb'] },
    },
  };

  match_stage.push(match);

  try {
    const data = await Umum.aggregate([match_stage]);

    if (data.length === 0) {
      errorRetenLogger.error(
        `Error mengira reten: ${payload.jenisReten}. Tiada data yang dijumpai.`
      );
      throw new Error('Tiada data yang dijumpai');
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
const countKPBMPBBulanan = async (payload) => {
  const { negeri, daerah, klinik } = payload;

  let match = {
    $match: {
      ...(negeri !== 'all' ? { createdByNegeri: negeri } : []),
      ...(daerah !== 'all' ? { createdByDaerah: daerah } : []),
      ...(klinik !== 'all' ? { createdByKodFasiliti: klinik } : []),
      jenisFasiliti: 'kp-bergerak',
    },
  };

  let project = {
    $project: {
      nama: 1,
      // penggunaanKPBMPB: 1,
    },
  };

  try {
    let kpbMpbData = await Fasiliti.aggregate([match, project]);

    kpbMpbData = await Promise.all(
      kpbMpbData.map(async (item) => {
        const data = await Umum.aggregate([
          {
            $match: {
              penggunaanKPBMPB: item.nama,
            },
          },
          {
            $group: {
              _id: '$tarikhKedatangan',
              nama: {
                $first: '$nama',
              },
              jumlahKedatanganBaru: {
                $sum: {
                  $cond: [
                    {
                      $eq: ['$kedatangan', 'baru-kedatangan'],
                    },
                    1,
                    0,
                  ],
                },
              },
              jumlahKedatanganUlangan: {
                $sum: {
                  $cond: [
                    {
                      $eq: ['$kedatangan', 'ulangan-kedatangan'],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              jumlahHariPenggunaan: {
                $sum: 1,
              },
              totalKedatanganBaru: {
                $sum: '$jumlahKedatanganBaru',
              },
              totalKedatanganUlangan: {
                $sum: '$jumlahKedatanganUlangan',
              },
            },
          },
          {
            $project: {
              jumlahHariPenggunaan: 1,
              totalKedatanganBaru: 1,
              totalKedatanganUlangan: 1,
            },
          },
        ]);
        return { ...item, ...data[0] };
      })
    );

    // console.log(kpbMpbData);

    if (kpbMpbData.length === 0) {
      errorRetenLogger.error(
        `Error mengira reten: ${payload.jenisReten}. Tiada data yang dijumpai.`
      );
      throw new Error('Tiada data yang dijumpai');
    }

    return kpbMpbData;
  } catch (error) {
    throw new Error(error);
  }
};
const countKOM = async (payload) => {
  const { jenisReten } = payload;

  const currentJenisReten = (() => {
    switch (jenisReten) {
      case 'KOM-OAP':
        return {
          $or: [
            {
              'event_data.subProgram': {
                $elemMatch: {
                  $eq: 'oap',
                },
              },
            },
            {
              jenisProgram: 'oap',
            },
          ],
        };
      case 'KOM-WE':
        return { jenisProgram: 'we' };
      case 'KOM-OKU-PDK':
        return { jenisProgram: 'oku' };
      case 'KOM-Komuniti':
        return { jenisProgram: 'projek-komuniti' };
      case 'KOM-Penjara':
        return { jenisProgram: 'penjara-koreksional' };
      case 'KOM-FDS':
        return { jenisProgram: 'fds' };
      case 'KOM-ISN':
        return { jenisProgram: 'isn' };
      case 'KOM-HRC':
        return {
          $or: [
            {
              'event_data.subProgram': {
                $elemMatch: {
                  $eq: 'hrc',
                },
              },
            },
          ],
        };
      default:
        return {};
    }
  })();

  const main_switch = [
    {
      $match: {
        ...getParamsKOM(payload),
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'namaProgram',
        foreignField: 'nama',
        as: 'event_data',
      },
    },
    {
      $match: {
        ...(currentJenisReten ? currentJenisReten : {}),
      },
    },
  ];

  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bw = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_oap = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_dewasamuda = {
    $match: {
      kedatangan: 'baru-kedatangan',
      jenisProgram: 'programDewasaMuda',
    },
  };
  const match_pemeriksaan_pkap = {
    $match: {
      kedatangan: 'baru-kedatangan',
      jenisProgram: 'kampungAngkatPergigian',
    },
  };
  const match_pemeriksaan_ppr = {
    $match: {
      kedatangan: 'baru-kedatangan',
      jenisProgram: 'ppr',
    },
  };
  const match_pemeriksaan_ppkps = {
    $match: {
      kedatangan: 'baru-kedatangan',
      jenisProgram: 'ppkps',
    },
  };
  const match_pemeriksaan_ikk = {
    $match: {
      kedatangan: 'baru-kedatangan',
      jenisProgram: 'oku',
    },
  };
  const match_pemeriksaan_iwe = {
    $match: {
      kedatangan: 'baru-kedatangan',
      jenisProgram: 'we',
    },
  };
  const match_pemeriksaan_kpb = {
    $match: {
      kedatangan: 'baru-kedatangan',
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage_pemeriksaan.push(
    match_pemeriksaan_below1year,
    match_pemeriksaan_1to4years,
    match_pemeriksaan_5to6years,
    match_pemeriksaan_7to9years,
    match_pemeriksaan_10to12years,
    match_pemeriksaan_13to14years,
    match_pemeriksaan_15to17years,
    match_pemeriksaan_18to19years,
    match_pemeriksaan_20to29years,
    match_pemeriksaan_30to49years,
    match_pemeriksaan_50to59years,
    match_pemeriksaan_60yearsandup,
    match_pemeriksaan_ibumengandung,
    match_pemeriksaan_oku,
    match_pemeriksaan_bw,
    match_pemeriksaan_oap,
    match_pemeriksaan_dewasamuda,
    match_pemeriksaan_pkap,
    match_pemeriksaan_ppr,
    match_pemeriksaan_ppkps,
    match_pemeriksaan_ikk,
    match_pemeriksaan_iwe,
    match_pemeriksaan_kpb
  );

  const group_pemeriksaan = {
    $group: {
      _id: placeModifier(payload),
      // stats
      jumlahReten: { $sum: 1 },
      statusReten: {
        $sum: {
          $cond: [
            {
              $eq: ['$statusReten', 'reten salah'],
            },
            1,
            0,
          ],
        },
      },
      //
      // pemeriksaan
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // perlu rawatan
      jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
      jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
      jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
      jumlahdfx: {
        $sum: {
          $add: [
            '$dAdaGigiDesidusPemeriksaanUmum',
            '$fAdaGigiDesidusPemeriksaanUmum',
            '$xAdaGigiDesidusPemeriksaanUmum',
          ],
        },
      },
      jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
      jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
      jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
      jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
      jumlahDMFX: {
        $sum: {
          $add: [
            '$dAdaGigiKekalPemeriksaanUmum',
            '$mAdaGigiKekalPemeriksaanUmum',
            '$fAdaGigiKekalPemeriksaanUmum',
            '$xAdaGigiKekalPemeriksaanUmum',
          ],
        },
      },
      jumlahMBK: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKaries: {
        //DMFX=0
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $or: [
                // baby punya kira
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                // 1 tahun
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $lte: ['$umur', 14] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 15] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                        {
                          $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      skorBPEZero: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPEMoreThanZero: {
        $sum: {
          $cond: [
            {
              $and: [
                { $ne: ['$skorBpeOralHygienePemeriksaanUmum', '0'] },
                { $ne: ['$skorBpeOralHygienePemeriksaanUmum', 'tiada'] },
                { $ne: ['$skorBpeOralHygienePemeriksaanUmum', ''] },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$fvPerluSapuanPemeriksaanUmum',
                'ya-fv-perlu-sapuan-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
      },
      perluPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      jumlahPerluDenturPenuh: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'penuh-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'penuh-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahPerluDenturSepara: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'separa-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'separa-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage = [];

  const match_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      orangKurangUpaya: true,
    },
  };
  const match_bw = {
    $match: {
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_oap = {
    $match: {
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_dewasamuda = {
    $match: {
      kategoriInstitusi: {
        $in: ['kolej-komuniti', 'kolej-vokasional', 'ipg', 'ipta', 'lain-lain'],
      },
    },
  };
  const match_pkap = {
    $match: {
      kgAngkat: {
        $in: ['komuniti-kg-angkat', 'lawatan-ke-rumah-kg-angkat'],
      },
    },
  };
  const match_ppr = {
    $match: {
      jenisEvent: 'ppr',
    },
  };
  const match_ppkps = {
    $match: {
      jenisEvent: 'ppkps',
    },
  };
  const match_ikk = {
    $match: {
      jenisEvent: 'oku',
    },
  };
  const match_iwe = {
    $match: {
      jenisEvent: 'we',
    },
  };
  const match_kpb = {
    $match: {
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage.push(
    match_below1year,
    match_1to4years,
    match_5to6years,
    match_7to9years,
    match_10to12years,
    match_13to14years,
    match_15to17years,
    match_18to19years,
    match_20to29years,
    match_30to49years,
    match_50to59years,
    match_60yearsandup,
    match_ibumengandung,
    match_oku,
    match_bw,
    match_oap,
    match_dewasamuda,
    match_pkap,
    match_ppr,
    match_ppkps,
    match_ikk,
    match_iwe,
    match_kpb
  );

  const group = {
    $group: {
      _id: placeModifier(payload),
      kedatanganTahunSemasaUlangan: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // dibuat rawatan
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $eq: ['$pesakitDibuatFluorideVarnish', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitPrrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
      },
      tampalanAntGdBaru: {
        $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGdSemula: {
        $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkBaru: {
        $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkSemula: {
        $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdBaru: {
        $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdSemula: {
        $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkBaru: {
        $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkSemula: {
        $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdBaru: {
        $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdSemula: {
        $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkBaru: {
        $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkSemula: {
        $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanSementara: {
        $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
      },
      cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
      cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
      komplikasiSelepasCabutan: {
        $sum: '$komplikasiSelepasCabutanRawatanUmum',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$penskaleranRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      abses: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTulangMuka: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTulangMukaUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanGigi: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanGigiUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTisuLembut: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      prosthodontikPenuhDenturBaru: {
        $sum: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikPenuhDenturSemula: {
        $sum: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            '$baruPenuhJumlahDenturProstodontikRawatanUmum',
            '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikSeparaDenturSemula: {
        $sum: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      immediateDenture: {
        $sum: '$immediateDenturProstodontikRawatanUmum',
      },
      pembaikanDenture: {
        $sum: '$pembaikanDenturProstodontikRawatanUmum',
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: { $sum: '$bilanganXrayYangDiambilRawatanUmum' },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$disaringProgramKanserMulutPemeriksaanUmum',
                'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // untuk sekolah

  // let match_stage_sekolah = [];

  // const match_sekolah_below1year = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //   },
  // };
  // const match_sekolah_1to4years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 1, $lte: 4 },
  //   },
  // };
  // const match_sekolah_5to6years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 5, $lte: 6 },
  //   },
  // };
  // const match_sekolah_7to9years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7, $lte: 9 },
  //   },
  // };
  // const match_sekolah_10to12years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 10, $lte: 12 },
  //   },
  // };
  // const match_sekolah_13to14years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 13, $lte: 14 },
  //   },
  // };
  // const match_sekolah_15to17years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 15, $lte: 17 },
  //   },
  // };
  // const match_sekolah_18to19years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 18, $lte: 19 },
  //   },
  // };
  // const match_sekolah_20to29years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 20, $lte: 29 },
  //   },
  // };
  // const match_sekolah_30to49years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 30, $lte: 49 },
  //   },
  // };
  // const match_sekolah_50to59years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 50, $lte: 59 },
  //   },
  // };
  // const match_sekolah_60yearsandup = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 60 },
  //   },
  // };
  // const match_sekolah_ibumengandung = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //   },
  // };
  // const match_sekolah_oku = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     orangKurangUpaya: true,
  //   },
  // };
  // const match_sekolah_bukanWarganegara = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     kumpulanEtnik: { $eq: 'bukan warganegara' },
  //   },
  // };

  // match_stage_sekolah.push(match_sekolah_below1year);
  // match_stage_sekolah.push(match_sekolah_1to4years);
  // match_stage_sekolah.push(match_sekolah_5to6years);
  // match_stage_sekolah.push(match_sekolah_7to9years);
  // match_stage_sekolah.push(match_sekolah_10to12years);
  // match_stage_sekolah.push(match_sekolah_13to14years);
  // match_stage_sekolah.push(match_sekolah_15to17years);
  // match_stage_sekolah.push(match_sekolah_18to19years);
  // match_stage_sekolah.push(match_sekolah_20to29years);
  // match_stage_sekolah.push(match_sekolah_30to49years);
  // match_stage_sekolah.push(match_sekolah_50to59years);
  // match_stage_sekolah.push(match_sekolah_60yearsandup);
  // match_stage_sekolah.push(match_sekolah_ibumengandung);
  // match_stage_sekolah.push(match_sekolah_oku);
  // match_stage_sekolah.push(match_sekolah_bukanWarganegara);

  // let pipeline_sekolah = [
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$pemeriksaanSekolah',
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'rawatansekolahs',
  //       localField: 'rawatanSekolah',
  //       foreignField: '_id',
  //       as: 'rawatanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$rawatanSekolah',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: { $toInt: '$umur' },
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       merged: {
  //         $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: 1,
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       createdByKp: '$merged.createdByKp',
  //       tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
  //       merged: 1,
  //     },
  //   },
  // ];

  // const group_sekolah = {
  //   $group: {
  //     _id: '$merged.createdByKp',
  //     jumlahPelajar: {
  //       $sum: 1,
  //     },
  //     kedatanganTahunSemasaBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahd: {
  //       $sum: '$merged.dAdaGigiDesidus',
  //     },
  //     jumlahf: {
  //       $sum: '$merged.fAdaGigiDesidus',
  //     },
  //     jumlahx: {
  //       $sum: '$merged.xAdaGigiDesidus',
  //     },
  //     jumlahdfx: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiDesidus',
  //           '$merged.fAdaGigiDesidus',
  //           '$merged.xAdaGigiDesidus',
  //         ],
  //       },
  //     },
  //     jumlahD: {
  //       $sum: '$merged.dAdaGigiKekal',
  //     },
  //     jumlahM: {
  //       $sum: '$merged.mAdaGigiKekal',
  //     },
  //     jumlahF: {
  //       $sum: '$merged.fAdaGigiKekal',
  //     },
  //     jumlahX: {
  //       $sum: '$merged.xAdaGigiKekal',
  //     },
  //     jumlahDMFX: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiKekal',
  //           '$merged.mAdaGigiKekal',
  //           '$merged.fAdaGigiKekal',
  //           '$merged.xAdaGigiKekal',
  //         ],
  //       },
  //     },
  //     jumlahMBK: {
  //       //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $gte: ['$merge.umur', 1] },
  //                   { $lte: ['$merge.umur', 59] },
  //                   {
  //                     $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                 ],
  //               },
  //               // {
  //               //   $and: [
  //               //     { $lte: ['$merge.umur', 6] },
  //               //     { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //   ],
  //               // },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     statusBebasKaries: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               { $gte: ['$merge.umur', 1] },
  //               { $lte: ['$merge.umur', 59] },
  //               { $eq: ['$merged.dAdaGigiKekal', 0] },
  //               { $eq: ['$merged.mAdaGigiKekal', 0] },
  //               { $eq: ['$merged.fAdaGigiKekal', 0] },
  //               { $eq: ['$merged.xAdaGigiKekal', 0] },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     TPR: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $eq: ['$merged.dAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.dAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.mAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.mAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.fAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.fAdaGigiDesidus', 0] },
  //                   { $eq: ['$merged.xAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.xAdaGigiDesidus', 0] },
  //                   {
  //                     $or: [
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '0'],
  //                       },
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '2'],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //               {
  //                 $eq: ['$tidakPerluRawatan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.skorBpeOralHygiene', 0],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEMoreThanZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $gte: ['$merged.skorBpeOralHygiene', 1],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluSapuanFluorida: {
  //       $sum: {
  //         $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
  //       },
  //     },
  //     perluJumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
  //     },
  //     perluJumlahPesakitFS: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.fissureSealant', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiFS: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluFS',
  //     },
  //     perluPenskaleran: {
  //       $sum: {
  //         $eq: ['$merged.perluPenskaleran', true],
  //       },
  //     },
  //     perluEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikDiperlukan',
  //     },
  //     perluEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikDiperlukan',
  //     },
  //     perluEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikDiperlukan',
  //     },
  //     jumlahPerluDenturPenuh: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'penuh-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'penuh-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPerluDenturSepara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'separa-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'separa-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kedatanganTahunSemasaUlangan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'ulangan-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     sapuanFluorida: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $or: [
  //                   {
  //                     $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                   {
  //                     $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $eq: ['$merged.pesakitDibuatPRRJenis1', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: '$merged.pesakitDibuatFissureSealant',
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: '$merged.baruJumlahGigiKekalDibuatFS',
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: '$merged.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: '$merged.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: '$merged.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: '$merged.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     inlayOnlayBaru: {
  //       $sum: '$merged.baruInlayOnlayJumlahTampalanDibuat',
  //     },
  //     inlayOnlaySemula: {
  //       $sum: '$merged.semulaInlayOnlayJumlahTampalanDibuat',
  //     },
  //     tampalanSementara: {
  //       $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
  //     },
  //     cabutanGd: {
  //       $sum: '$merged.cabutDesidus',
  //     },
  //     cabutanGk: {
  //       $sum: '$merged.cabutKekal',
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: '$merged.komplikasiSelepasCabutan',
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.penskaleran', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: '$merged.rawatanLainPeriodontik',
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikSelesai',
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikSelesai',
  //     },
  //     rawatanEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikSelesai',
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.rawatanOrtodontik', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kesPerubatanMulut', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.yaTidakAbsesPembedahan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: '$merged.cabutanSurgikalPembedahanMulut',
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.yaTidakPembedahanKecilMulutPembedahan',
  //               'ya-pembedahan-kecil-mulut-pembedahan',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: '$merged.baruJumlahCrownBridge',
  //     },
  //     crownBridgeSemula: {
  //       $sum: '$merged.semulaJumlahCrownBridge',
  //     },
  //     postCoreBaru: {
  //       $sum: '$merged.baruJumlahPostCore',
  //     },
  //     postCoreSemula: {
  //       $sum: '$merged.semulaJumlahPostCore',
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: '$merged.baruPenuhJumlahDenturProstodontik',
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: '$merged.semulaPenuhJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruPenuhJumlahDenturProstodontik',
  //           '$merged.semulaPenuhJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: '$merged.baruSeparaJumlahDenturProstodontik',
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: '$merged.semulaSeparaJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruSeparaJumlahDenturProstodontik',
  //           '$merged.semulaSeparaJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: '$merged.immediateDenturProstodontik',
  //     },
  //     pembaikanDenture: {
  //       $sum: '$merged.pembaikanDenturProstodontik',
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.kesSelesai', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: '$merged.bilanganXrayYangDiambil',
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.disaringProgramKanserMulut',
  //               'ya-disaring-program-kanser-mulut',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  // let match_stage_operatorLain = [];

  // const match_operatorLain_below1year = {
  //   $match: {
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_1to4years = {
  //   $match: {
  //     umur: { $gte: 1, $lte: 4 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_5to6years = {
  //   $match: {
  //     umur: { $gte: 5, $lte: 6 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_7to9years = {
  //   $match: {
  //     umur: { $gte: 7, $lte: 9 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_10to12years = {
  //   $match: {
  //     umur: { $gte: 10, $lte: 12 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_13to14years = {
  //   $match: {
  //     umur: { $gte: 13, $lte: 14 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_15to17years = {
  //   $match: {
  //     umur: { $gte: 15, $lte: 17 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_18to19years = {
  //   $match: {
  //     umur: { $gte: 18, $lte: 19 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_20to29years = {
  //   $match: {
  //     umur: { $gte: 20, $lte: 29 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_30to49years = {
  //   $match: {
  //     umur: { $gte: 30, $lte: 49 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_50to59years = {
  //   $match: {
  //     umur: { $gte: 50, $lte: 59 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_60yearsandup = {
  //   $match: {
  //     umur: { $gte: 60 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_ibumengandung = {
  //   $match: {
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oku = {
  //   $match: {
  //     orangKurangUpaya: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_bw = {
  //   $match: {
  //     kumpulanEtnik: 'bukan warganegara',
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oap = {
  //   $match: {
  //     kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_dewasamuda = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     kategoriInstitusi: {
  //       $in: ['kolej-komuniti', 'kolej-vokasional', 'ipg', 'ipta', 'lain-lain'],
  //     },
  //   },
  // };
  // const match_operatorLain_pkap = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     kgAngkat: {
  //       $in: ['komuniti-kg-angkat', 'lawatan-ke-rumah-kg-angkat'],
  //     },
  //   },
  // };
  // const match_operatorLain_ppr = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     jenisEvent: 'ppr',
  //   },
  // };
  // const match_operatorLain_ppkps = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     jenisEvent: 'ppkps',
  //   },
  // };
  // const match_operatorLain_ikk = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     jenisEvent: 'oku',
  //   },
  // };
  // const match_operatorLain_iwe = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     jenisEvent: 'we',
  //   },
  // };
  // const match_operatorLain_kpb = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
  //   },
  // };

  // match_stage_operatorLain.push(
  //   match_operatorLain_below1year,
  //   match_operatorLain_1to4years,
  //   match_operatorLain_5to6years,
  //   match_operatorLain_7to9years,
  //   match_operatorLain_10to12years,
  //   match_operatorLain_13to14years,
  //   match_operatorLain_15to17years,
  //   match_operatorLain_18to19years,
  //   match_operatorLain_20to29years,
  //   match_operatorLain_30to49years,
  //   match_operatorLain_50to59years,
  //   match_operatorLain_60yearsandup,
  //   match_operatorLain_ibumengandung,
  //   match_operatorLain_oku,
  //   match_operatorLain_bw,
  //   match_operatorLain_oap,
  //   match_operatorLain_dewasamuda,
  //   match_operatorLain_pkap,
  //   match_operatorLain_ppr,
  //   match_operatorLain_ppkps,
  //   match_operatorLain_ikk,
  //   match_operatorLain_iwe,
  //   match_operatorLain_kpb
  // );

  // const group_operatorLain = {
  //   $group: {
  //     _id: placeModifier(payload),
  //     // dibuat rawatan
  //     sapuanFluorida: {
  //       //fvMuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pesakitDibuatFluorideVarnish', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       //prrJ1MuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: [
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                           '',
  //                         ],
  //                       },
  //                       0,
  //                       {
  //                         $toInt:
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //                       },
  //                       0,
  //                       {
  //                         $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     inlayOnlayBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     inlayOnlaySemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     tampalanSementara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGd: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutDesidusRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutDesidusRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGk: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutKekalRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutKekalRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$komplikasiSelepasCabutanRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$penskaleranRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$rawatanLainPeriodontikRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahAnteriorKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahPremolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoMolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahMolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$rawatanOrtodontikRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kesPerubatanMulutRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       //data sini campur sekolah form & umum form. blh ke?
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutanSurgikalPembedahanMulutRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutanSurgikalPembedahanMulutRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
  //               'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     crownBridgeSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$immediateDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$immediateDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembaikanDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pembaikanDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$pembaikanDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$bilanganXrayYangDiambilRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$bilanganXrayYangDiambilRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$disaringProgramKanserMulutPemeriksaanUmum',
  //               'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  //

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataSekolah = [];
    // let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        ...main_switch,
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryKOMPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryKOMPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [...main_switch, match_stage[i], group];
      const queryKOMRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryKOMRawatan });
    }

    // for (let i = 0; i < match_stage_sekolah.length; i++) {
    //   const pipeline = [
    //     ...pipeline_sekolah,
    //     match_stage_sekolah[i],
    //     group_sekolah,
    //   ];
    //   const querySekolah = await Sekolah.aggregate(pipeline);
    //   dataSekolah.push({ querySekolah });
    // }

    // if (!payload.pilihanIndividu) {
    //   for (let i = 0; i < match_stage_operatorLain.length; i++) {
    //     const pipeline = [
    //       ...main_switch,
    //       match_stage_operatorLain[i],
    //       ...getParamsOperatorLain,
    //       group_operatorLain,
    //     ];
    //     const queryKOMOperatorLain = await Umum.aggregate(pipeline);
    //     dataOperatorLain.push({ queryKOMOperatorLain });
    //   }
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    // bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countPPR = async (payload) => {
  const main_switch = [
    {
      $match: {
        ...getParamsKOM(payload),
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'jenisProgram',
        foreignField: 'subProgram',
        as: 'event_data',
      },
    },
    {
      $match: {
        $or: [
          {
            'event_data.subProgram': {
              $elemMatch: {
                $eq: 'ppr',
              },
            },
          },
          {
            jenisProgram: 'ppr',
          },
        ],
      },
    },
  ];

  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bw = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_oap = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_kpb = {
    $match: {
      kedatangan: 'baru-kedatangan',
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage_pemeriksaan.push(
    match_pemeriksaan_below1year,
    match_pemeriksaan_1to4years,
    match_pemeriksaan_5to6years,
    match_pemeriksaan_7to9years,
    match_pemeriksaan_10to12years,
    match_pemeriksaan_13to14years,
    match_pemeriksaan_15to17years,
    match_pemeriksaan_18to19years,
    match_pemeriksaan_20to29years,
    match_pemeriksaan_30to49years,
    match_pemeriksaan_50to59years,
    match_pemeriksaan_60yearsandup,
    match_pemeriksaan_ibumengandung,
    match_pemeriksaan_oku,
    match_pemeriksaan_bw,
    match_pemeriksaan_oap,
    match_pemeriksaan_kpb
  );

  const group_pemeriksaan = {
    $group: {
      _id: placeModifier(payload),
      // stats
      jumlahReten: { $sum: 1 },
      statusReten: {
        $sum: {
          $cond: [
            {
              $eq: ['$statusReten', 'reten salah'],
            },
            1,
            0,
          ],
        },
      },
      //
      // pemeriksaan
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // perlu rawatan
      jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
      jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
      jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
      jumlahdfx: {
        $sum: {
          $add: [
            '$dAdaGigiDesidusPemeriksaanUmum',
            '$fAdaGigiDesidusPemeriksaanUmum',
            '$xAdaGigiDesidusPemeriksaanUmum',
          ],
        },
      },
      jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
      jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
      jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
      jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
      jumlahDMFX: {
        $sum: {
          $add: [
            '$dAdaGigiKekalPemeriksaanUmum',
            '$mAdaGigiKekalPemeriksaanUmum',
            '$fAdaGigiKekalPemeriksaanUmum',
            '$xAdaGigiKekalPemeriksaanUmum',
          ],
        },
      },
      jumlahMBK: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKaries: {
        //DMFX=0
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $or: [
                // baby punya kira
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                // 1 tahun
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $lte: ['$umur', 14] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 15] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                        {
                          $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      skorBPEZero: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPEMoreThanZero: {
        $sum: {
          $cond: [
            {
              $gte: ['$skorBpeOralHygienePemeriksaanUmum', '1'],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$fvPerluSapuanPemeriksaanUmum',
                'ya-fv-perlu-sapuan-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
      },
      perluPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      jumlahPerluDenturPenuh: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'penuh-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'penuh-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahPerluDenturSepara: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'separa-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'separa-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage = [];

  const match_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      orangKurangUpaya: true,
    },
  };
  const match_bw = {
    $match: {
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_oap = {
    $match: {
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_kpb = {
    $match: {
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage.push(
    match_below1year,
    match_1to4years,
    match_5to6years,
    match_7to9years,
    match_10to12years,
    match_13to14years,
    match_15to17years,
    match_18to19years,
    match_20to29years,
    match_30to49years,
    match_50to59years,
    match_60yearsandup,
    match_ibumengandung,
    match_oku,
    match_bw,
    match_oap,
    match_kpb
  );

  const group = {
    $group: {
      _id: placeModifier(payload),
      kedatanganTahunSemasaUlangan: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // dibuat rawatan
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $eq: ['$pesakitDibuatFluorideVarnish', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitPrrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
      },
      tampalanAntGdBaru: {
        $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGdSemula: {
        $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkBaru: {
        $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkSemula: {
        $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdBaru: {
        $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdSemula: {
        $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkBaru: {
        $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkSemula: {
        $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdBaru: {
        $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdSemula: {
        $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkBaru: {
        $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkSemula: {
        $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanSementara: {
        $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
      },
      cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
      cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
      komplikasiSelepasCabutan: {
        $sum: '$komplikasiSelepasCabutanRawatanUmum',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$penskaleranRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      abses: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTulangMuka: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTulangMukaUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanGigi: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanGigiUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTisuLembut: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      prosthodontikPenuhDenturSemula: {
        $sum: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            '$baruPenuhJumlahDenturProstodontikRawatanUmum',
            '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikSeparaDenturSemula: {
        $sum: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      immediateDenture: {
        $sum: '$immediateDenturProstodontikRawatanUmum',
      },
      pembaikanDenture: {
        $sum: '$pembaikanDenturProstodontikRawatanUmum',
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: { $sum: '$bilanganXrayYangDiambilRawatanUmum' },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$disaringProgramKanserMulutPemeriksaanUmum',
                'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // untuk sekolah

  // let match_stage_sekolah = [];

  // const match_sekolah_below1year = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //   },
  // };
  // const match_sekolah_1to4years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 1, $lte: 4 },
  //   },
  // };
  // const match_sekolah_5to6years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 5, $lte: 6 },
  //   },
  // };
  // const match_sekolah_7to9years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7, $lte: 9 },
  //   },
  // };
  // const match_sekolah_10to12years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 10, $lte: 12 },
  //   },
  // };
  // const match_sekolah_13to14years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 13, $lte: 14 },
  //   },
  // };
  // const match_sekolah_15to17years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 15, $lte: 17 },
  //   },
  // };
  // const match_sekolah_18to19years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 18, $lte: 19 },
  //   },
  // };
  // const match_sekolah_20to29years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 20, $lte: 29 },
  //   },
  // };
  // const match_sekolah_30to49years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 30, $lte: 49 },
  //   },
  // };
  // const match_sekolah_50to59years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 50, $lte: 59 },
  //   },
  // };
  // const match_sekolah_60yearsandup = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 60 },
  //   },
  // };
  // const match_sekolah_ibumengandung = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //   },
  // };
  // const match_sekolah_oku = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     orangKurangUpaya: true,
  //   },
  // };
  // const match_sekolah_bukanWarganegara = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     kumpulanEtnik: { $eq: 'bukan warganegara' },
  //   },
  // };

  // match_stage_sekolah.push(match_sekolah_below1year);
  // match_stage_sekolah.push(match_sekolah_1to4years);
  // match_stage_sekolah.push(match_sekolah_5to6years);
  // match_stage_sekolah.push(match_sekolah_7to9years);
  // match_stage_sekolah.push(match_sekolah_10to12years);
  // match_stage_sekolah.push(match_sekolah_13to14years);
  // match_stage_sekolah.push(match_sekolah_15to17years);
  // match_stage_sekolah.push(match_sekolah_18to19years);
  // match_stage_sekolah.push(match_sekolah_20to29years);
  // match_stage_sekolah.push(match_sekolah_30to49years);
  // match_stage_sekolah.push(match_sekolah_50to59years);
  // match_stage_sekolah.push(match_sekolah_60yearsandup);
  // match_stage_sekolah.push(match_sekolah_ibumengandung);
  // match_stage_sekolah.push(match_sekolah_oku);
  // match_stage_sekolah.push(match_sekolah_bukanWarganegara);

  // let pipeline_sekolah = [
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$pemeriksaanSekolah',
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'rawatansekolahs',
  //       localField: 'rawatanSekolah',
  //       foreignField: '_id',
  //       as: 'rawatanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$rawatanSekolah',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: { $toInt: '$umur' },
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       merged: {
  //         $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: 1,
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       createdByKp: '$merged.createdByKp',
  //       tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
  //       merged: 1,
  //     },
  //   },
  // ];

  // const group_sekolah = {
  //   $group: {
  //     _id: '$merged.createdByKp',
  //     jumlahPelajar: {
  //       $sum: 1,
  //     },
  //     kedatanganTahunSemasaBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahd: {
  //       $sum: '$merged.dAdaGigiDesidus',
  //     },
  //     jumlahf: {
  //       $sum: '$merged.fAdaGigiDesidus',
  //     },
  //     jumlahx: {
  //       $sum: '$merged.xAdaGigiDesidus',
  //     },
  //     jumlahdfx: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiDesidus',
  //           '$merged.fAdaGigiDesidus',
  //           '$merged.xAdaGigiDesidus',
  //         ],
  //       },
  //     },
  //     jumlahD: {
  //       $sum: '$merged.dAdaGigiKekal',
  //     },
  //     jumlahM: {
  //       $sum: '$merged.mAdaGigiKekal',
  //     },
  //     jumlahF: {
  //       $sum: '$merged.fAdaGigiKekal',
  //     },
  //     jumlahX: {
  //       $sum: '$merged.xAdaGigiKekal',
  //     },
  //     jumlahDMFX: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiKekal',
  //           '$merged.mAdaGigiKekal',
  //           '$merged.fAdaGigiKekal',
  //           '$merged.xAdaGigiKekal',
  //         ],
  //       },
  //     },
  //     jumlahMBK: {
  //       //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $gte: ['$merge.umur', 1] },
  //                   { $lte: ['$merge.umur', 59] },
  //                   {
  //                     $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                 ],
  //               },
  //               // {
  //               //   $and: [
  //               //     { $lte: ['$merge.umur', 6] },
  //               //     { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //   ],
  //               // },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     statusBebasKaries: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               { $gte: ['$merge.umur', 1] },
  //               { $lte: ['$merge.umur', 59] },
  //               { $eq: ['$merged.dAdaGigiKekal', 0] },
  //               { $eq: ['$merged.mAdaGigiKekal', 0] },
  //               { $eq: ['$merged.fAdaGigiKekal', 0] },
  //               { $eq: ['$merged.xAdaGigiKekal', 0] },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     TPR: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $eq: ['$merged.dAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.dAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.mAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.mAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.fAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.fAdaGigiDesidus', 0] },
  //                   { $eq: ['$merged.xAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.xAdaGigiDesidus', 0] },
  //                   {
  //                     $or: [
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '0'],
  //                       },
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '2'],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //               {
  //                 $eq: ['$tidakPerluRawatan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.skorBpeOralHygiene', 0],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEMoreThanZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $gte: ['$merged.skorBpeOralHygiene', 1],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluSapuanFluorida: {
  //       $sum: {
  //         $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
  //       },
  //     },
  //     perluJumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
  //     },
  //     perluJumlahPesakitFS: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.fissureSealant', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiFS: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluFS',
  //     },
  //     perluPenskaleran: {
  //       $sum: {
  //         $eq: ['$merged.perluPenskaleran', true],
  //       },
  //     },
  //     perluEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikDiperlukan',
  //     },
  //     perluEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikDiperlukan',
  //     },
  //     perluEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikDiperlukan',
  //     },
  //     jumlahPerluDenturPenuh: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'penuh-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'penuh-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPerluDenturSepara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'separa-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'separa-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kedatanganTahunSemasaUlangan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'ulangan-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     sapuanFluorida: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $or: [
  //                   {
  //                     $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                   {
  //                     $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $eq: ['$merged.pesakitDibuatPRRJenis1', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: '$merged.pesakitDibuatFissureSealant',
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: '$merged.baruJumlahGigiKekalDibuatFS',
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: '$merged.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: '$merged.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: '$merged.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: '$merged.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     inlayOnlayBaru: {
  //       $sum: '$merged.baruInlayOnlayJumlahTampalanDibuat',
  //     },
  //     inlayOnlaySemula: {
  //       $sum: '$merged.semulaInlayOnlayJumlahTampalanDibuat',
  //     },
  //     tampalanSementara: {
  //       $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
  //     },
  //     cabutanGd: {
  //       $sum: '$merged.cabutDesidus',
  //     },
  //     cabutanGk: {
  //       $sum: '$merged.cabutKekal',
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: '$merged.komplikasiSelepasCabutan',
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.penskaleran', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: '$merged.rawatanLainPeriodontik',
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikSelesai',
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikSelesai',
  //     },
  //     rawatanEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikSelesai',
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.rawatanOrtodontik', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kesPerubatanMulut', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.yaTidakAbsesPembedahan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: '$merged.cabutanSurgikalPembedahanMulut',
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.yaTidakPembedahanKecilMulutPembedahan',
  //               'ya-pembedahan-kecil-mulut-pembedahan',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: '$merged.baruJumlahCrownBridge',
  //     },
  //     crownBridgeSemula: {
  //       $sum: '$merged.semulaJumlahCrownBridge',
  //     },
  //     postCoreBaru: {
  //       $sum: '$merged.baruJumlahPostCore',
  //     },
  //     postCoreSemula: {
  //       $sum: '$merged.semulaJumlahPostCore',
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: '$merged.baruPenuhJumlahDenturProstodontik',
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: '$merged.semulaPenuhJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruPenuhJumlahDenturProstodontik',
  //           '$merged.semulaPenuhJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: '$merged.baruSeparaJumlahDenturProstodontik',
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: '$merged.semulaSeparaJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruSeparaJumlahDenturProstodontik',
  //           '$merged.semulaSeparaJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: '$merged.immediateDenturProstodontik',
  //     },
  //     pembaikanDenture: {
  //       $sum: '$merged.pembaikanDenturProstodontik',
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.kesSelesai', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: '$merged.bilanganXrayYangDiambil',
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.disaringProgramKanserMulut',
  //               'ya-disaring-program-kanser-mulut',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  // let match_stage_operatorLain = [];

  // const match_operatorLain_below1year = {
  //   $match: {
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_1to4years = {
  //   $match: {
  //     umur: { $gte: 1, $lte: 4 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_5to6years = {
  //   $match: {
  //     umur: { $gte: 5, $lte: 6 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_7to9years = {
  //   $match: {
  //     umur: { $gte: 7, $lte: 9 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_10to12years = {
  //   $match: {
  //     umur: { $gte: 10, $lte: 12 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_13to14years = {
  //   $match: {
  //     umur: { $gte: 13, $lte: 14 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_15to17years = {
  //   $match: {
  //     umur: { $gte: 15, $lte: 17 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_18to19years = {
  //   $match: {
  //     umur: { $gte: 18, $lte: 19 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_20to29years = {
  //   $match: {
  //     umur: { $gte: 20, $lte: 29 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_30to49years = {
  //   $match: {
  //     umur: { $gte: 30, $lte: 49 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_50to59years = {
  //   $match: {
  //     umur: { $gte: 50, $lte: 59 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_60yearsandup = {
  //   $match: {
  //     umur: { $gte: 60 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_ibumengandung = {
  //   $match: {
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oku = {
  //   $match: {
  //     orangKurangUpaya: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_bw = {
  //   $match: {
  //     kumpulanEtnik: 'bukan warganegara',
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oap = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     kumpulanEtnik: {
  //       $in: ['orang asli semenanjung', 'penan'],
  //     },
  //   },
  // };
  // const match_operatorLain_kpb = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
  //   },
  // };

  // match_stage_operatorLain.push(
  //   match_operatorLain_below1year,
  //   match_operatorLain_1to4years,
  //   match_operatorLain_5to6years,
  //   match_operatorLain_7to9years,
  //   match_operatorLain_10to12years,
  //   match_operatorLain_13to14years,
  //   match_operatorLain_15to17years,
  //   match_operatorLain_18to19years,
  //   match_operatorLain_20to29years,
  //   match_operatorLain_30to49years,
  //   match_operatorLain_50to59years,
  //   match_operatorLain_60yearsandup,
  //   match_operatorLain_ibumengandung,
  //   match_operatorLain_oku,
  //   match_operatorLain_bw,
  //   match_operatorLain_oap,
  //   match_operatorLain_kpb
  // );

  // const group_operatorLain = {
  //   $group: {
  //     _id: placeModifier(payload),
  //     // dibuat rawatan
  //     sapuanFluorida: {
  //       //fvMuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pesakitDibuatFluorideVarnish', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       //prrJ1MuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: [
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                           '',
  //                         ],
  //                       },
  //                       0,
  //                       {
  //                         $toInt:
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //                       },
  //                       0,
  //                       {
  //                         $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     inlayOnlayBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     inlayOnlaySemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     tampalanSementara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGd: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutDesidusRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutDesidusRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGk: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutKekalRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutKekalRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$komplikasiSelepasCabutanRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$penskaleranRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$rawatanLainPeriodontikRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahAnteriorKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahPremolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoMolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahMolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$rawatanOrtodontikRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kesPerubatanMulutRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       //data sini campur sekolah form & umum form. blh ke?
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutanSurgikalPembedahanMulutRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutanSurgikalPembedahanMulutRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
  //               'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     crownBridgeSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$immediateDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$immediateDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembaikanDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pembaikanDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$pembaikanDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$bilanganXrayYangDiambilRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$bilanganXrayYangDiambilRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$disaringProgramKanserMulutPemeriksaanUmum',
  //               'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  //

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataSekolah = [];
    // let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        ...main_switch,
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryPPRPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPPRPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [...main_switch, match_stage[i], group];
      const queryPPRRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryPPRRawatan });
    }

    // for (let i = 0; i < match_stage_sekolah.length; i++) {
    //   const pipeline = [
    //     ...pipeline_sekolah,
    //     match_stage_sekolah[i],
    //     group_sekolah,
    //   ];
    //   const querySekolah = await Sekolah.aggregate(pipeline);
    //   dataSekolah.push({ querySekolah });
    // }

    // if (!payload.pilihanIndividu) {
    //   for (let i = 0; i < match_stage_operatorLain.length; i++) {
    //     const pipeline = [
    //       ...main_switch,
    //       match_stage_operatorLain[i],
    //       ...getParamsOperatorLain,
    //       group_operatorLain,
    //     ];
    //     const queryPPROperatorLain = await Umum.aggregate(pipeline);
    //     dataOperatorLain.push({ queryPPROperatorLain });
    //   }
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    // bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countUTCRTC = async (payload) => {
  const { jenisReten, klinik } = payload;

  const main_switch = () => {
    switch (jenisReten) {
      case 'RTC':
        return {
          $match: {
            ...getParamsUTCRTC(payload),
            ...(klinik === 'rtc-tunjung'
              ? {}
              : { createdByKp: { $regex: /rtc/i } }),
          },
        };
      case 'UTC':
        return {
          $match: {
            ...getParamsUTCRTC(payload),
            createdByKp: { $regex: /utc/i },
          },
        };
      default:
        console.log('Error: Jenis reten tidak dikenali');
        break;
    }
  };

  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bw = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };

  match_stage_pemeriksaan.push(
    match_pemeriksaan_below1year,
    match_pemeriksaan_1to4years,
    match_pemeriksaan_5to6years,
    match_pemeriksaan_7to9years,
    match_pemeriksaan_10to12years,
    match_pemeriksaan_13to14years,
    match_pemeriksaan_15to17years,
    match_pemeriksaan_18to19years,
    match_pemeriksaan_20to29years,
    match_pemeriksaan_30to49years,
    match_pemeriksaan_50to59years,
    match_pemeriksaan_60yearsandup,
    match_pemeriksaan_ibumengandung,
    match_pemeriksaan_oku,
    match_pemeriksaan_bw
  );

  const group_pemeriksaan = {
    $group: {
      _id: placeModifier(payload),
      // stats
      jumlahReten: { $sum: 1 },
      statusReten: {
        $sum: {
          $cond: [
            {
              $eq: ['$statusReten', 'reten salah'],
            },
            1,
            0,
          ],
        },
      },
      //
      // pemeriksaan
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // perlu rawatan
      jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
      jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
      jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
      jumlahdfx: {
        $sum: {
          $add: [
            '$dAdaGigiDesidusPemeriksaanUmum',
            '$fAdaGigiDesidusPemeriksaanUmum',
            '$xAdaGigiDesidusPemeriksaanUmum',
          ],
        },
      },
      jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
      jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
      jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
      jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
      jumlahDMFX: {
        $sum: {
          $add: [
            '$dAdaGigiKekalPemeriksaanUmum',
            '$mAdaGigiKekalPemeriksaanUmum',
            '$fAdaGigiKekalPemeriksaanUmum',
            '$xAdaGigiKekalPemeriksaanUmum',
          ],
        },
      },
      jumlahMBK: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKaries: {
        //DMFX=0
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $or: [
                // baby punya kira
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                // 1 tahun
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $lte: ['$umur', 14] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 15] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                        {
                          $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      skorBPEZero: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPEMoreThanZero: {
        $sum: {
          $cond: [
            {
              $gte: ['$skorBpeOralHygienePemeriksaanUmum', '1'],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$fvPerluSapuanPemeriksaanUmum',
                'ya-fv-perlu-sapuan-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
      },
      perluPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      jumlahPerluDenturPenuh: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'penuh-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'penuh-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahPerluDenturSepara: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'separa-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'separa-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage = [];

  const match_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      orangKurangUpaya: true,
    },
  };
  const match_bw = {
    $match: {
      kumpulanEtnik: 'bukan warganegara',
    },
  };

  match_stage.push(
    match_below1year,
    match_1to4years,
    match_5to6years,
    match_7to9years,
    match_10to12years,
    match_13to14years,
    match_15to17years,
    match_18to19years,
    match_20to29years,
    match_30to49years,
    match_50to59years,
    match_60yearsandup,
    match_ibumengandung,
    match_oku,
    match_bw
  );

  const group = {
    $group: {
      _id: placeModifier(payload),
      kedatanganTahunSemasaUlangan: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // dibuat rawatan
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $eq: ['$pesakitDibuatFluorideVarnish', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitPrrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
      },
      tampalanAntGdBaru: {
        $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGdSemula: {
        $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkBaru: {
        $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkSemula: {
        $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdBaru: {
        $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdSemula: {
        $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkBaru: {
        $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkSemula: {
        $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdBaru: {
        $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdSemula: {
        $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkBaru: {
        $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkSemula: {
        $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      inlayOnlayBaru: {
        $sum: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
      }, //data sudah dpt dari form umum
      inlayOnlaySemula: {
        $sum: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
      }, //data sudah dpt dari form umum
      tampalanSementara: {
        $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
      },
      cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
      cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
      komplikasiSelepasCabutan: {
        $sum: '$komplikasiSelepasCabutanRawatanUmum',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$penskaleranRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      rawatanPerioLain: {
        $sum: '$rawatanLainPeriodontikRawatanUmum',
      },
      rawatanEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
      },
      rawatanEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
      },
      rawatanEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
      },
      rawatanOrtho: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$rawatanOrtodontikRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kesPerubatan: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kesPerubatanMulutRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      abses: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTulangMuka: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTulangMukaUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanGigi: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanGigiUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTisuLembut: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      cabutanSurgical: {
        $sum: '$cabutanSurgikalPembedahanMulutRawatanUmum',
      },
      pembedahanKecilMulut: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
                'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      crownBridgeBaru: {
        $sum: '$baruJumlahCrownBridgeRawatanUmum',
      },
      crownBridgeSemula: {
        $sum: '$semulaJumlahCrownBridgeRawatanUmum',
      },
      postCoreBaru: { $sum: '$baruJumlahPostCoreRawatanUmum' },
      postCoreSemula: { $sum: '$semulaJumlahPostCoreRawatanUmum' },
      prosthodontikPenuhDenturBaru: {
        $sum: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikPenuhDenturSemula: {
        $sum: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            '$baruPenuhJumlahDenturProstodontikRawatanUmum',
            '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikSeparaDenturSemula: {
        $sum: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      immediateDenture: {
        $sum: '$immediateDenturProstodontikRawatanUmum',
      },
      pembaikanDenture: {
        $sum: '$pembaikanDenturProstodontikRawatanUmum',
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: { $sum: '$bilanganXrayYangDiambilRawatanUmum' },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$disaringProgramKanserMulutPemeriksaanUmum',
                'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // untuk sekolah

  // let match_stage_sekolah = [];

  // const match_sekolah_below1year = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //   },
  // };
  // const match_sekolah_1to4years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 1, $lte: 4 },
  //   },
  // };
  // const match_sekolah_5to6years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 5, $lte: 6 },
  //   },
  // };
  // const match_sekolah_7to9years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7, $lte: 9 },
  //   },
  // };
  // const match_sekolah_10to12years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 10, $lte: 12 },
  //   },
  // };
  // const match_sekolah_13to14years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 13, $lte: 14 },
  //   },
  // };
  // const match_sekolah_15to17years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 15, $lte: 17 },
  //   },
  // };
  // const match_sekolah_18to19years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 18, $lte: 19 },
  //   },
  // };
  // const match_sekolah_20to29years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 20, $lte: 29 },
  //   },
  // };
  // const match_sekolah_30to49years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 30, $lte: 49 },
  //   },
  // };
  // const match_sekolah_50to59years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 50, $lte: 59 },
  //   },
  // };
  // const match_sekolah_60yearsandup = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 60 },
  //   },
  // };
  // const match_sekolah_ibumengandung = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //   },
  // };
  // const match_sekolah_oku = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     orangKurangUpaya: true,
  //   },
  // };
  // const match_sekolah_bukanWarganegara = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     kumpulanEtnik: { $eq: 'bukan warganegara' },
  //   },
  // };

  // match_stage_sekolah.push(match_sekolah_below1year);
  // match_stage_sekolah.push(match_sekolah_1to4years);
  // match_stage_sekolah.push(match_sekolah_5to6years);
  // match_stage_sekolah.push(match_sekolah_7to9years);
  // match_stage_sekolah.push(match_sekolah_10to12years);
  // match_stage_sekolah.push(match_sekolah_13to14years);
  // match_stage_sekolah.push(match_sekolah_15to17years);
  // match_stage_sekolah.push(match_sekolah_18to19years);
  // match_stage_sekolah.push(match_sekolah_20to29years);
  // match_stage_sekolah.push(match_sekolah_30to49years);
  // match_stage_sekolah.push(match_sekolah_50to59years);
  // match_stage_sekolah.push(match_sekolah_60yearsandup);
  // match_stage_sekolah.push(match_sekolah_ibumengandung);
  // match_stage_sekolah.push(match_sekolah_oku);
  // match_stage_sekolah.push(match_sekolah_bukanWarganegara);

  // let pipeline_sekolah = [
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$pemeriksaanSekolah',
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'rawatansekolahs',
  //       localField: 'rawatanSekolah',
  //       foreignField: '_id',
  //       as: 'rawatanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$rawatanSekolah',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: { $toInt: '$umur' },
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       merged: {
  //         $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: 1,
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       createdByKp: '$merged.createdByKp',
  //       tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
  //       merged: 1,
  //     },
  //   },
  // ];

  // const group_sekolah = {
  //   $group: {
  //     _id: '$merged.createdByKp',
  //     jumlahPelajar: {
  //       $sum: 1,
  //     },
  //     kedatanganTahunSemasaBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahd: {
  //       $sum: '$merged.dAdaGigiDesidus',
  //     },
  //     jumlahf: {
  //       $sum: '$merged.fAdaGigiDesidus',
  //     },
  //     jumlahx: {
  //       $sum: '$merged.xAdaGigiDesidus',
  //     },
  //     jumlahdfx: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiDesidus',
  //           '$merged.fAdaGigiDesidus',
  //           '$merged.xAdaGigiDesidus',
  //         ],
  //       },
  //     },
  //     jumlahD: {
  //       $sum: '$merged.dAdaGigiKekal',
  //     },
  //     jumlahM: {
  //       $sum: '$merged.mAdaGigiKekal',
  //     },
  //     jumlahF: {
  //       $sum: '$merged.fAdaGigiKekal',
  //     },
  //     jumlahX: {
  //       $sum: '$merged.xAdaGigiKekal',
  //     },
  //     jumlahDMFX: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiKekal',
  //           '$merged.mAdaGigiKekal',
  //           '$merged.fAdaGigiKekal',
  //           '$merged.xAdaGigiKekal',
  //         ],
  //       },
  //     },
  //     jumlahMBK: {
  //       //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $gte: ['$merge.umur', 1] },
  //                   { $lte: ['$merge.umur', 59] },
  //                   {
  //                     $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                 ],
  //               },
  //               // {
  //               //   $and: [
  //               //     { $lte: ['$merge.umur', 6] },
  //               //     { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //   ],
  //               // },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     statusBebasKaries: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               { $gte: ['$merge.umur', 1] },
  //               { $lte: ['$merge.umur', 59] },
  //               { $eq: ['$merged.dAdaGigiKekal', 0] },
  //               { $eq: ['$merged.mAdaGigiKekal', 0] },
  //               { $eq: ['$merged.fAdaGigiKekal', 0] },
  //               { $eq: ['$merged.xAdaGigiKekal', 0] },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     TPR: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $eq: ['$merged.dAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.dAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.mAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.mAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.fAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.fAdaGigiDesidus', 0] },
  //                   { $eq: ['$merged.xAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.xAdaGigiDesidus', 0] },
  //                   {
  //                     $or: [
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '0'],
  //                       },
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '2'],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //               {
  //                 $eq: ['$tidakPerluRawatan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.skorBpeOralHygiene', 0],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEMoreThanZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $gte: ['$merged.skorBpeOralHygiene', 1],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluSapuanFluorida: {
  //       $sum: {
  //         $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
  //       },
  //     },
  //     perluJumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
  //     },
  //     perluJumlahPesakitFS: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.fissureSealant', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiFS: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluFS',
  //     },
  //     perluPenskaleran: {
  //       $sum: {
  //         $eq: ['$merged.perluPenskaleran', true],
  //       },
  //     },
  //     perluEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikDiperlukan',
  //     },
  //     perluEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikDiperlukan',
  //     },
  //     perluEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikDiperlukan',
  //     },
  //     jumlahPerluDenturPenuh: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'penuh-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'penuh-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPerluDenturSepara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'separa-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'separa-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kedatanganTahunSemasaUlangan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'ulangan-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     sapuanFluorida: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $or: [
  //                   {
  //                     $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                   {
  //                     $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $eq: ['$merged.pesakitDibuatPRRJenis1', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: '$merged.pesakitDibuatFissureSealant',
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: '$merged.baruJumlahGigiKekalDibuatFS',
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: '$merged.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: '$merged.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: '$merged.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: '$merged.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     inlayOnlayBaru: {
  //       $sum: '$merged.baruInlayOnlayJumlahTampalanDibuat',
  //     },
  //     inlayOnlaySemula: {
  //       $sum: '$merged.semulaInlayOnlayJumlahTampalanDibuat',
  //     },
  //     tampalanSementara: {
  //       $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
  //     },
  //     cabutanGd: {
  //       $sum: '$merged.cabutDesidus',
  //     },
  //     cabutanGk: {
  //       $sum: '$merged.cabutKekal',
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: '$merged.komplikasiSelepasCabutan',
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.penskaleran', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: '$merged.rawatanLainPeriodontik',
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikSelesai',
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikSelesai',
  //     },
  //     rawatanEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikSelesai',
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.rawatanOrtodontik', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kesPerubatanMulut', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.yaTidakAbsesPembedahan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: '$merged.cabutanSurgikalPembedahanMulut',
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.yaTidakPembedahanKecilMulutPembedahan',
  //               'ya-pembedahan-kecil-mulut-pembedahan',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: '$merged.baruJumlahCrownBridge',
  //     },
  //     crownBridgeSemula: {
  //       $sum: '$merged.semulaJumlahCrownBridge',
  //     },
  //     postCoreBaru: {
  //       $sum: '$merged.baruJumlahPostCore',
  //     },
  //     postCoreSemula: {
  //       $sum: '$merged.semulaJumlahPostCore',
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: '$merged.baruPenuhJumlahDenturProstodontik',
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: '$merged.semulaPenuhJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruPenuhJumlahDenturProstodontik',
  //           '$merged.semulaPenuhJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: '$merged.baruSeparaJumlahDenturProstodontik',
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: '$merged.semulaSeparaJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruSeparaJumlahDenturProstodontik',
  //           '$merged.semulaSeparaJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: '$merged.immediateDenturProstodontik',
  //     },
  //     pembaikanDenture: {
  //       $sum: '$merged.pembaikanDenturProstodontik',
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.kesSelesai', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: '$merged.bilanganXrayYangDiambil',
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.disaringProgramKanserMulut',
  //               'ya-disaring-program-kanser-mulut',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  let match_stage_operatorLain = [];

  const match_operatorLain_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_18to19years = {
    $match: {
      umur: { $gte: 18, $lte: 19 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_20to29years = {
    $match: {
      umur: { $gte: 20, $lte: 29 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_30to49years = {
    $match: {
      umur: { $gte: 30, $lte: 49 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_50to59years = {
    $match: {
      umur: { $gte: 50, $lte: 59 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_60yearsandup = {
    $match: {
      umur: { $gte: 60 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_ibumengandung = {
    $match: {
      umur: { $gte: 7 },
      ibuMengandung: true,
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_oku = {
    $match: {
      orangKurangUpaya: true,
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_bw = {
    $match: {
      kumpulanEtnik: 'bukan warganegara',
      rawatanDibuatOperatorLain: true,
    },
  };

  match_stage_operatorLain.push(
    match_operatorLain_below1year,
    match_operatorLain_1to4years,
    match_operatorLain_5to6years,
    match_operatorLain_7to9years,
    match_operatorLain_10to12years,
    match_operatorLain_13to14years,
    match_operatorLain_15to17years,
    match_operatorLain_18to19years,
    match_operatorLain_20to29years,
    match_operatorLain_30to49years,
    match_operatorLain_50to59years,
    match_operatorLain_60yearsandup,
    match_operatorLain_ibumengandung,
    match_operatorLain_oku,
    match_operatorLain_bw
  );

  const group_operatorLain = {
    $group: {
      _id: placeModifier(payload),
      // dibuat rawatan
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $eq: ['$pesakitDibuatFluorideVarnish', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitPrrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: [
                    {
                      $cond: [
                        {
                          $eq: [
                            '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
                            '',
                          ],
                        },
                        0,
                        {
                          $toInt:
                            '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
                        },
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
            },
          ],
        },
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: [
                    {
                      $cond: [
                        {
                          $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
                        },
                        0,
                        {
                          $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
                        },
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
            },
          ],
        },
      },
      tampalanAntGdBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanAntGdSemula: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanAntGkBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanAntGkSemula: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostGdBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostGdSemula: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt:
                '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostGkBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostGkSemula: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt:
                '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostAmgGdBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostAmgGdSemula: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt:
                '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostAmgGkBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      tampalanPostAmgGkSemula: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt:
                '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      inlayOnlayBaru: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      }, //data sudah dpt dari form umum
      inlayOnlaySemula: {
        $sum: {
          $cond: [
            {
              $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      }, //data sudah dpt dari form umum
      tampalanSementara: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
                '',
              ],
            },
            0,
            {
              $toInt: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
            },
          ],
        },
      },
      cabutanGd: {
        $sum: {
          $cond: [
            {
              $eq: ['$cabutDesidusRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$cabutDesidusRawatanUmum',
            },
          ],
        },
      },
      cabutanGk: {
        $sum: {
          $cond: [
            {
              $eq: ['$cabutKekalRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$cabutKekalRawatanUmum',
            },
          ],
        },
      },
      komplikasiSelepasCabutan: {
        $sum: {
          $cond: [
            {
              $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$komplikasiSelepasCabutanRawatanUmum',
            },
          ],
        },
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $eq: ['$penskaleranRawatanUmum', true],
            },
            1,
            0,
          ],
        },
      },
      rawatanPerioLain: {
        $sum: {
          $cond: [
            {
              $eq: ['$rawatanLainPeriodontikRawatanUmum', true],
            },
            1,
            0,
          ],
        },
      },
      rawatanEndoAnterior: {
        $sum: {
          $cond: [
            {
              $eq: ['$jumlahAnteriorKesEndodontikSelesaiRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
            },
          ],
        },
      },
      rawatanEndoPremolar: {
        $sum: {
          $cond: [
            {
              $eq: ['$jumlahPremolarKesEndodontikSelesaiRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
            },
          ],
        },
      },
      rawatanEndoMolar: {
        $sum: {
          $cond: [
            {
              $eq: ['$jumlahMolarKesEndodontikSelesaiRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
            },
          ],
        },
      },
      rawatanOrtho: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$rawatanOrtodontikRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kesPerubatan: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kesPerubatanMulutRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      abses: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTulangMuka: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTulangMukaUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanGigi: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanGigiUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTisuLembut: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      cabutanSurgical: {
        $sum: {
          $cond: [
            {
              $eq: ['$cabutanSurgikalPembedahanMulutRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$cabutanSurgikalPembedahanMulutRawatanUmum',
            },
          ],
        },
      },
      pembedahanKecilMulut: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
                'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      crownBridgeBaru: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruJumlahCrownBridgeRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruJumlahCrownBridgeRawatanUmum',
            },
          ],
        },
      },
      crownBridgeSemula: {
        $sum: {
          $cond: [
            {
              $eq: ['$semulaJumlahCrownBridgeRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$semulaJumlahCrownBridgeRawatanUmum',
            },
          ],
        },
      },
      postCoreBaru: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruJumlahPostCoreRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruJumlahPostCoreRawatanUmum',
            },
          ],
        },
      },
      postCoreSemula: {
        $sum: {
          $cond: [
            {
              $eq: ['$semulaJumlahPostCoreRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$semulaJumlahPostCoreRawatanUmum',
            },
          ],
        },
      },
      prosthodontikPenuhDenturBaru: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
            },
          ],
        },
      },
      prosthodontikPenuhDenturSemula: {
        $sum: {
          $cond: [
            {
              $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
            },
          ],
        },
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            {
              $cond: [
                {
                  $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
                },
                0,
                {
                  $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
                },
              ],
            },
            {
              $cond: [
                {
                  $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
                },
                0,
                {
                  $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
                },
              ],
            },
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            },
          ],
        },
      },
      prosthodontikSeparaDenturSemula: {
        $sum: {
          $cond: [
            {
              $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            },
          ],
        },
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            {
              $cond: [
                {
                  $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
                },
                0,
                {
                  $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
                },
              ],
            },
            {
              $cond: [
                {
                  $eq: ['$semulaSeparaJumlahDenturProstodontikRawatanUmum', ''],
                },
                0,
                {
                  $toInt: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
                },
              ],
            },
          ],
        },
      },
      immediateDenture: {
        $sum: {
          $cond: [
            {
              $eq: ['$immediateDenturProstodontikRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$immediateDenturProstodontikRawatanUmum',
            },
          ],
        },
      },
      pembaikanDenture: {
        $sum: {
          $cond: [
            {
              $eq: ['$pembaikanDenturProstodontikRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$pembaikanDenturProstodontikRawatanUmum',
            },
          ],
        },
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: {
        $sum: {
          $cond: [
            {
              $eq: ['$bilanganXrayYangDiambilRawatanUmum', ''],
            },
            0,
            {
              $toInt: '$bilanganXrayYangDiambilRawatanUmum',
            },
          ],
        },
      },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$disaringProgramKanserMulutPemeriksaanUmum',
                'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  //

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataSekolah = [];
    // let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        main_switch(),
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryUTCRTCPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryUTCRTCPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch(), match_stage[i], group];
      const queryUTCRTCRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryUTCRTCRawatan });
    }

    // for (let i = 0; i < match_stage_sekolah.length; i++) {
    //   const pipeline = [
    //     ...pipeline_sekolah,
    //     match_stage_sekolah[i],
    //     group_sekolah,
    //   ];
    //   const querySekolah = await Sekolah.aggregate(pipeline);
    //   dataSekolah.push({ querySekolah });
    // }

    // if (!payload.pilihanIndividu) {
    //   for (let i = 0; i < match_stage_operatorLain.length; i++) {
    //     const pipeline = [
    //       ...main_switch(),
    //       match_stage_operatorLain[i],
    //       ...getParamsOperatorLain,
    //       group_operatorLain,
    //     ];
    //     const queryOperatorLain = await Umum.aggregate(pipeline);
    //     dataOperatorLain.push({ queryOperatorLain });
    //   }
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    // bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countPPKPS = async (payload) => {
  const main_switch = [
    {
      $match: {
        ...getParamsKOM(payload),
        jenisProgram: 'ppkps',
      },
    },
    // {
    //   $lookup: {
    //     from: 'events',
    //     localField: 'namaProgram',
    //     foreignField: 'nama',
    //     as: 'event_data',
    //   },
    // },
    // {
    //   $unwind: '$event_data',
    // },
    // {
    //   $addFields: {
    //     jenisEvent: '$event_data.jenisEvent',
    //   },
    // },
    // {
    //   $project: {
    //     fasiliti_data: 0,
    //   },
    // },
    // {
    //   $match: {
    //     jenisEvent: 'ppkps',
    //   },
    // },
  ];

  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bw = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_oap = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_kpb = {
    $match: {
      kedatangan: 'baru-kedatangan',
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage_pemeriksaan.push(
    match_pemeriksaan_below1year,
    match_pemeriksaan_1to4years,
    match_pemeriksaan_5to6years,
    match_pemeriksaan_7to9years,
    match_pemeriksaan_10to12years,
    match_pemeriksaan_13to14years,
    match_pemeriksaan_15to17years,
    match_pemeriksaan_18to19years,
    match_pemeriksaan_20to29years,
    match_pemeriksaan_30to49years,
    match_pemeriksaan_50to59years,
    match_pemeriksaan_60yearsandup,
    match_pemeriksaan_ibumengandung,
    match_pemeriksaan_oku,
    match_pemeriksaan_bw,
    match_pemeriksaan_oap,
    match_pemeriksaan_kpb
  );

  const group_pemeriksaan = {
    $group: {
      _id: placeModifier(payload),
      // stats
      jumlahReten: { $sum: 1 },
      statusReten: {
        $sum: {
          $cond: [
            {
              $eq: ['$statusReten', 'reten salah'],
            },
            1,
            0,
          ],
        },
      },
      //
      // pemeriksaan
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // perlu rawatan
      jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
      jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
      jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
      jumlahdfx: {
        $sum: {
          $add: [
            '$dAdaGigiDesidusPemeriksaanUmum',
            '$fAdaGigiDesidusPemeriksaanUmum',
            '$xAdaGigiDesidusPemeriksaanUmum',
          ],
        },
      },
      jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
      jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
      jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
      jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
      jumlahDMFX: {
        $sum: {
          $add: [
            '$dAdaGigiKekalPemeriksaanUmum',
            '$mAdaGigiKekalPemeriksaanUmum',
            '$fAdaGigiKekalPemeriksaanUmum',
            '$xAdaGigiKekalPemeriksaanUmum',
          ],
        },
      },
      jumlahMBK: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKaries: {
        //DMFX=0
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $or: [
                // baby punya kira
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                // 1 tahun
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $lte: ['$umur', 14] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 15] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                        {
                          $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      skorBPEZero: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPEMoreThanZero: {
        $sum: {
          $cond: [
            {
              $gte: ['$skorBpeOralHygienePemeriksaanUmum', '1'],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$fvPerluSapuanPemeriksaanUmum',
                'ya-fv-perlu-sapuan-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
      },
      perluPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      jumlahPerluDenturPenuh: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'penuh-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'penuh-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahPerluDenturSepara: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'separa-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'separa-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage = [];

  const match_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      orangKurangUpaya: true,
    },
  };
  const match_bw = {
    $match: {
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_oap = {
    $match: {
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_kpb = {
    $match: {
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage.push(
    match_below1year,
    match_1to4years,
    match_5to6years,
    match_7to9years,
    match_10to12years,
    match_13to14years,
    match_15to17years,
    match_18to19years,
    match_20to29years,
    match_30to49years,
    match_50to59years,
    match_60yearsandup,
    match_ibumengandung,
    match_oku,
    match_bw,
    match_oap,
    match_kpb
  );

  const group = {
    $group: {
      _id: placeModifier(payload),
      kedatanganTahunSemasaUlangan: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // dibuat rawatan
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $eq: ['$pesakitDibuatFluorideVarnish', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitPrrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
      },
      tampalanAntGdBaru: {
        $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGdSemula: {
        $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkBaru: {
        $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkSemula: {
        $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdBaru: {
        $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdSemula: {
        $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkBaru: {
        $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkSemula: {
        $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdBaru: {
        $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdSemula: {
        $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkBaru: {
        $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkSemula: {
        $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanSementara: {
        $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
      },
      cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
      cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
      komplikasiSelepasCabutan: {
        $sum: '$komplikasiSelepasCabutanRawatanUmum',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$penskaleranRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      abses: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTulangMuka: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTulangMukaUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanGigi: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanGigiUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTisuLembut: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      prosthodontikPenuhDenturBaru: {
        $sum: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikPenuhDenturSemula: {
        $sum: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            '$baruPenuhJumlahDenturProstodontikRawatanUmum',
            '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikSeparaDenturSemula: {
        $sum: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      immediateDenture: {
        $sum: '$immediateDenturProstodontikRawatanUmum',
      },
      pembaikanDenture: {
        $sum: '$pembaikanDenturProstodontikRawatanUmum',
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: { $sum: '$bilanganXrayYangDiambilRawatanUmum' },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$disaringProgramKanserMulutPemeriksaanUmum',
                'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // untuk sekolah

  // let match_stage_sekolah = [];

  // const match_sekolah_below1year = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //   },
  // };
  // const match_sekolah_1to4years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 1, $lte: 4 },
  //   },
  // };
  // const match_sekolah_5to6years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 5, $lte: 6 },
  //   },
  // };
  // const match_sekolah_7to9years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7, $lte: 9 },
  //   },
  // };
  // const match_sekolah_10to12years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 10, $lte: 12 },
  //   },
  // };
  // const match_sekolah_13to14years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 13, $lte: 14 },
  //   },
  // };
  // const match_sekolah_15to17years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 15, $lte: 17 },
  //   },
  // };
  // const match_sekolah_18to19years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 18, $lte: 19 },
  //   },
  // };
  // const match_sekolah_20to29years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 20, $lte: 29 },
  //   },
  // };
  // const match_sekolah_30to49years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 30, $lte: 49 },
  //   },
  // };
  // const match_sekolah_50to59years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 50, $lte: 59 },
  //   },
  // };
  // const match_sekolah_60yearsandup = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 60 },
  //   },
  // };
  // const match_sekolah_ibumengandung = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //   },
  // };
  // const match_sekolah_oku = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     orangKurangUpaya: true,
  //   },
  // };
  // const match_sekolah_bukanWarganegara = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     kumpulanEtnik: { $eq: 'bukan warganegara' },
  //   },
  // };

  // match_stage_sekolah.push(match_sekolah_below1year);
  // match_stage_sekolah.push(match_sekolah_1to4years);
  // match_stage_sekolah.push(match_sekolah_5to6years);
  // match_stage_sekolah.push(match_sekolah_7to9years);
  // match_stage_sekolah.push(match_sekolah_10to12years);
  // match_stage_sekolah.push(match_sekolah_13to14years);
  // match_stage_sekolah.push(match_sekolah_15to17years);
  // match_stage_sekolah.push(match_sekolah_18to19years);
  // match_stage_sekolah.push(match_sekolah_20to29years);
  // match_stage_sekolah.push(match_sekolah_30to49years);
  // match_stage_sekolah.push(match_sekolah_50to59years);
  // match_stage_sekolah.push(match_sekolah_60yearsandup);
  // match_stage_sekolah.push(match_sekolah_ibumengandung);
  // match_stage_sekolah.push(match_sekolah_oku);
  // match_stage_sekolah.push(match_sekolah_bukanWarganegara);

  // let pipeline_sekolah = [
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$pemeriksaanSekolah',
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'rawatansekolahs',
  //       localField: 'rawatanSekolah',
  //       foreignField: '_id',
  //       as: 'rawatanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$rawatanSekolah',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: { $toInt: '$umur' },
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       merged: {
  //         $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: 1,
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       createdByKp: '$merged.createdByKp',
  //       tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
  //       merged: 1,
  //     },
  //   },
  // ];

  // const group_sekolah = {
  //   $group: {
  //     _id: '$merged.createdByKp',
  //     jumlahPelajar: {
  //       $sum: 1,
  //     },
  //     kedatanganTahunSemasaBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahd: {
  //       $sum: '$merged.dAdaGigiDesidus',
  //     },
  //     jumlahf: {
  //       $sum: '$merged.fAdaGigiDesidus',
  //     },
  //     jumlahx: {
  //       $sum: '$merged.xAdaGigiDesidus',
  //     },
  //     jumlahdfx: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiDesidus',
  //           '$merged.fAdaGigiDesidus',
  //           '$merged.xAdaGigiDesidus',
  //         ],
  //       },
  //     },
  //     jumlahD: {
  //       $sum: '$merged.dAdaGigiKekal',
  //     },
  //     jumlahM: {
  //       $sum: '$merged.mAdaGigiKekal',
  //     },
  //     jumlahF: {
  //       $sum: '$merged.fAdaGigiKekal',
  //     },
  //     jumlahX: {
  //       $sum: '$merged.xAdaGigiKekal',
  //     },
  //     jumlahDMFX: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiKekal',
  //           '$merged.mAdaGigiKekal',
  //           '$merged.fAdaGigiKekal',
  //           '$merged.xAdaGigiKekal',
  //         ],
  //       },
  //     },
  //     jumlahMBK: {
  //       //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $gte: ['$merge.umur', 1] },
  //                   { $lte: ['$merge.umur', 59] },
  //                   {
  //                     $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                 ],
  //               },
  //               // {
  //               //   $and: [
  //               //     { $lte: ['$merge.umur', 6] },
  //               //     { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //   ],
  //               // },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     statusBebasKaries: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               { $gte: ['$merge.umur', 1] },
  //               { $lte: ['$merge.umur', 59] },
  //               { $eq: ['$merged.dAdaGigiKekal', 0] },
  //               { $eq: ['$merged.mAdaGigiKekal', 0] },
  //               { $eq: ['$merged.fAdaGigiKekal', 0] },
  //               { $eq: ['$merged.xAdaGigiKekal', 0] },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     TPR: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $eq: ['$merged.dAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.dAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.mAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.mAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.fAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.fAdaGigiDesidus', 0] },
  //                   { $eq: ['$merged.xAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.xAdaGigiDesidus', 0] },
  //                   {
  //                     $or: [
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '0'],
  //                       },
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '2'],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //               {
  //                 $eq: ['$tidakPerluRawatan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.skorBpeOralHygiene', 0],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEMoreThanZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $gte: ['$merged.skorBpeOralHygiene', 1],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluSapuanFluorida: {
  //       $sum: {
  //         $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
  //       },
  //     },
  //     perluJumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
  //     },
  //     perluJumlahPesakitFS: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.fissureSealant', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiFS: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluFS',
  //     },
  //     perluPenskaleran: {
  //       $sum: {
  //         $eq: ['$merged.perluPenskaleran', true],
  //       },
  //     },
  //     perluEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikDiperlukan',
  //     },
  //     perluEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikDiperlukan',
  //     },
  //     perluEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikDiperlukan',
  //     },
  //     jumlahPerluDenturPenuh: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'penuh-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'penuh-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPerluDenturSepara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'separa-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'separa-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kedatanganTahunSemasaUlangan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'ulangan-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     sapuanFluorida: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $or: [
  //                   {
  //                     $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                   {
  //                     $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $eq: ['$merged.pesakitDibuatPRRJenis1', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: '$merged.pesakitDibuatFissureSealant',
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: '$merged.baruJumlahGigiKekalDibuatFS',
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: '$merged.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: '$merged.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: '$merged.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: '$merged.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     inlayOnlayBaru: {
  //       $sum: '$merged.baruInlayOnlayJumlahTampalanDibuat',
  //     },
  //     inlayOnlaySemula: {
  //       $sum: '$merged.semulaInlayOnlayJumlahTampalanDibuat',
  //     },
  //     tampalanSementara: {
  //       $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
  //     },
  //     cabutanGd: {
  //       $sum: '$merged.cabutDesidus',
  //     },
  //     cabutanGk: {
  //       $sum: '$merged.cabutKekal',
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: '$merged.komplikasiSelepasCabutan',
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.penskaleran', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: '$merged.rawatanLainPeriodontik',
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikSelesai',
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikSelesai',
  //     },
  //     rawatanEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikSelesai',
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.rawatanOrtodontik', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kesPerubatanMulut', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.yaTidakAbsesPembedahan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: '$merged.cabutanSurgikalPembedahanMulut',
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.yaTidakPembedahanKecilMulutPembedahan',
  //               'ya-pembedahan-kecil-mulut-pembedahan',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: '$merged.baruJumlahCrownBridge',
  //     },
  //     crownBridgeSemula: {
  //       $sum: '$merged.semulaJumlahCrownBridge',
  //     },
  //     postCoreBaru: {
  //       $sum: '$merged.baruJumlahPostCore',
  //     },
  //     postCoreSemula: {
  //       $sum: '$merged.semulaJumlahPostCore',
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: '$merged.baruPenuhJumlahDenturProstodontik',
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: '$merged.semulaPenuhJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruPenuhJumlahDenturProstodontik',
  //           '$merged.semulaPenuhJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: '$merged.baruSeparaJumlahDenturProstodontik',
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: '$merged.semulaSeparaJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruSeparaJumlahDenturProstodontik',
  //           '$merged.semulaSeparaJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: '$merged.immediateDenturProstodontik',
  //     },
  //     pembaikanDenture: {
  //       $sum: '$merged.pembaikanDenturProstodontik',
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.kesSelesai', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: '$merged.bilanganXrayYangDiambil',
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.disaringProgramKanserMulut',
  //               'ya-disaring-program-kanser-mulut',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  // let match_stage_operatorLain = [];

  // const match_operatorLain_below1year = {
  //   $match: {
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_1to4years = {
  //   $match: {
  //     umur: { $gte: 1, $lte: 4 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_5to6years = {
  //   $match: {
  //     umur: { $gte: 5, $lte: 6 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_7to9years = {
  //   $match: {
  //     umur: { $gte: 7, $lte: 9 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_10to12years = {
  //   $match: {
  //     umur: { $gte: 10, $lte: 12 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_13to14years = {
  //   $match: {
  //     umur: { $gte: 13, $lte: 14 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_15to17years = {
  //   $match: {
  //     umur: { $gte: 15, $lte: 17 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_18to19years = {
  //   $match: {
  //     umur: { $gte: 18, $lte: 19 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_20to29years = {
  //   $match: {
  //     umur: { $gte: 20, $lte: 29 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_30to49years = {
  //   $match: {
  //     umur: { $gte: 30, $lte: 49 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_50to59years = {
  //   $match: {
  //     umur: { $gte: 50, $lte: 59 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_60yearsandup = {
  //   $match: {
  //     umur: { $gte: 60 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_ibumengandung = {
  //   $match: {
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oku = {
  //   $match: {
  //     orangKurangUpaya: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_bw = {
  //   $match: {
  //     kumpulanEtnik: 'bukan warganegara',
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oap = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     kumpulanEtnik: {
  //       $in: ['orang asli semenanjung', 'penan'],
  //     },
  //   },
  // };
  // const match_operatorLain_kpb = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
  //   },
  // };

  // match_stage_operatorLain.push(
  //   match_operatorLain_below1year,
  //   match_operatorLain_1to4years,
  //   match_operatorLain_5to6years,
  //   match_operatorLain_7to9years,
  //   match_operatorLain_10to12years,
  //   match_operatorLain_13to14years,
  //   match_operatorLain_15to17years,
  //   match_operatorLain_18to19years,
  //   match_operatorLain_20to29years,
  //   match_operatorLain_30to49years,
  //   match_operatorLain_50to59years,
  //   match_operatorLain_60yearsandup,
  //   match_operatorLain_ibumengandung,
  //   match_operatorLain_oku,
  //   match_operatorLain_bw,
  //   match_operatorLain_oap,
  //   match_operatorLain_kpb
  // );

  // const group_operatorLain = {
  //   $group: {
  //     _id: placeModifier(payload),
  //     // dibuat rawatan
  //     sapuanFluorida: {
  //       //fvMuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pesakitDibuatFluorideVarnish', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       //prrJ1MuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: [
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                           '',
  //                         ],
  //                       },
  //                       0,
  //                       {
  //                         $toInt:
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //                       },
  //                       0,
  //                       {
  //                         $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     inlayOnlayBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     inlayOnlaySemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     tampalanSementara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGd: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutDesidusRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutDesidusRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGk: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutKekalRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutKekalRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$komplikasiSelepasCabutanRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$penskaleranRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$rawatanLainPeriodontikRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahAnteriorKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahPremolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoMolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahMolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$rawatanOrtodontikRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kesPerubatanMulutRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       //data sini campur sekolah form & umum form. blh ke?
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutanSurgikalPembedahanMulutRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutanSurgikalPembedahanMulutRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
  //               'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     crownBridgeSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$immediateDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$immediateDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembaikanDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pembaikanDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$pembaikanDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$bilanganXrayYangDiambilRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$bilanganXrayYangDiambilRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$disaringProgramKanserMulutPemeriksaanUmum',
  //               'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  //

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataSekolah = [];
    // let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        ...main_switch,
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryPPKPSPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPPKPSPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [...main_switch, match_stage[i], group];
      const queryPPKPSRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryPPKPSRawatan });
    }

    // for (let i = 0; i < match_stage_sekolah.length; i++) {
    //   const pipeline = [
    //     ...pipeline_sekolah,
    //     match_stage_sekolah[i],
    //     group_sekolah,
    //   ];
    //   const querySekolah = await Sekolah.aggregate(pipeline);
    //   dataSekolah.push({ querySekolah });
    // }

    // if (!payload.pilihanIndividu) {
    //   for (let i = 0; i < match_stage_operatorLain.length; i++) {
    //     const pipeline = [
    //       ...main_switch,
    //       match_stage_operatorLain[i],
    //       ...getParamsOperatorLain,
    //       group_operatorLain,
    //     ];
    //     const queryOperatorLain = await Umum.aggregate(pipeline);
    //     dataOperatorLain.push({ queryOperatorLain });
    //   }
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    // bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
// pkap 1
const countPKAP2 = async (payload) => {
  const main_switch = [
    {
      $match: {
        ...getParamsPKAP(payload),
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'namaProgram',
        foreignField: 'nama',
        as: 'event_data',
      },
    },
    {
      $match: {
        $or: [
          {
            'event_data.subProgram': {
              $elemMatch: {
                $eq: 'kampungAngkatPergigian',
              },
            },
          },
          {
            jenisProgram: 'kampungAngkatPergigian',
          },
        ],
      },
    },
  ];

  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bw = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_oap = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_kpb = {
    $match: {
      kedatangan: 'baru-kedatangan',
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage_pemeriksaan.push(
    match_pemeriksaan_below1year,
    match_pemeriksaan_1to4years,
    match_pemeriksaan_5to6years,
    match_pemeriksaan_7to9years,
    match_pemeriksaan_10to12years,
    match_pemeriksaan_13to14years,
    match_pemeriksaan_15to17years,
    match_pemeriksaan_18to19years,
    match_pemeriksaan_20to29years,
    match_pemeriksaan_30to49years,
    match_pemeriksaan_50to59years,
    match_pemeriksaan_60yearsandup,
    match_pemeriksaan_ibumengandung,
    match_pemeriksaan_oku,
    match_pemeriksaan_bw,
    match_pemeriksaan_oap,
    match_pemeriksaan_kpb
  );

  const group_pemeriksaan = {
    $group: {
      _id: placeModifier(payload),
      // stats
      jumlahReten: { $sum: 1 },
      statusReten: {
        $sum: {
          $cond: [
            {
              $eq: ['$statusReten', 'reten salah'],
            },
            1,
            0,
          ],
        },
      },
      //
      // pemeriksaan
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // perlu rawatan
      jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
      jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
      jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
      jumlahdfx: {
        $sum: {
          $add: [
            '$dAdaGigiDesidusPemeriksaanUmum',
            '$fAdaGigiDesidusPemeriksaanUmum',
            '$xAdaGigiDesidusPemeriksaanUmum',
          ],
        },
      },
      jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
      jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
      jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
      jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
      jumlahDMFX: {
        $sum: {
          $add: [
            '$dAdaGigiKekalPemeriksaanUmum',
            '$mAdaGigiKekalPemeriksaanUmum',
            '$fAdaGigiKekalPemeriksaanUmum',
            '$xAdaGigiKekalPemeriksaanUmum',
          ],
        },
      },
      jumlahMBK: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $lte: ['$umur', 17] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKaries: {
        //DMFX=0
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $or: [
                // baby punya kira
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    {
                      $eq: [
                        '$yaTidakPesakitMempunyaiGigi',
                        'tidak-pesakit-mempunyai-gigi',
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $lt: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  ],
                },
                // 1 tahun
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', true] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 5] },
                    { $lte: ['$umur', 14] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 15] },
                    { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                        },
                        {
                          $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                        },
                        {
                          $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                        },
                      ],
                    },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$umur', 1] },
                    { $eq: ['$adaDesidusPemeriksaanUmum', false] },
                    { $eq: ['$adaKekalPemeriksaanUmum', false] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      skorBPEZero: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPEMoreThanZero: {
        $sum: {
          $cond: [
            {
              $gte: ['$skorBpeOralHygienePemeriksaanUmum', '1'],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$fvPerluSapuanPemeriksaanUmum',
                'ya-fv-perlu-sapuan-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
      },
      perluPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluEndoAnterior: {
        $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoPremolar: {
        $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      perluEndoMolar: {
        $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
      },
      jumlahPerluDenturPenuh: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'penuh-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'penuh-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahPerluDenturSepara: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$separaPenuhAtasPerluDenturePemeriksaanUmum',
                    'separa-atas-perlu-denture-pemeriksaan-umum',
                  ],
                },
                {
                  $eq: [
                    '$separaPenuhBawahPerluDenturePemeriksaanUmum',
                    'separa-bawah-perlu-denture-pemeriksaan-umum',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage = [];

  const match_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      orangKurangUpaya: true,
    },
  };
  const match_bw = {
    $match: {
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_oap = {
    $match: {
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_kpb = {
    $match: {
      menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
    },
  };

  match_stage.push(
    match_below1year,
    match_1to4years,
    match_5to6years,
    match_7to9years,
    match_10to12years,
    match_13to14years,
    match_15to17years,
    match_18to19years,
    match_20to29years,
    match_30to49years,
    match_50to59years,
    match_60yearsandup,
    match_ibumengandung,
    match_oku,
    match_bw,
    match_oap,
    match_kpb
  );

  const group = {
    $group: {
      _id: placeModifier(payload),
      kedatanganTahunSemasaUlangan: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
            },
            1,
            0,
          ],
        },
      },
      // dibuat rawatan
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $eq: ['$pesakitDibuatFluorideVarnish', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitPrrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
      },
      tampalanAntGdBaru: {
        $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGdSemula: {
        $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkBaru: {
        $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanAntGkSemula: {
        $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdBaru: {
        $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGdSemula: {
        $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkBaru: {
        $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostGkSemula: {
        $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdBaru: {
        $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGdSemula: {
        $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkBaru: {
        $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanPostAmgGkSemula: {
        $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
      },
      tampalanSementara: {
        $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
      },
      cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
      cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
      komplikasiSelepasCabutan: {
        $sum: '$komplikasiSelepasCabutanRawatanUmum',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$penskaleranRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      abses: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTulangMuka: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTulangMukaUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanGigi: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanGigiUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      kecederaanTisuLembut: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      prosthodontikPenuhDenturBaru: {
        $sum: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikPenuhDenturSemula: {
        $sum: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            '$baruPenuhJumlahDenturProstodontikRawatanUmum',
            '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
      },
      prosthodontikSeparaDenturSemula: {
        $sum: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            '$baruSeparaJumlahDenturProstodontikRawatanUmum',
            '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
          ],
        },
      },
      immediateDenture: {
        $sum: '$immediateDenturProstodontikRawatanUmum',
      },
      pembaikanDenture: {
        $sum: '$pembaikanDenturProstodontikRawatanUmum',
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: { $sum: '$bilanganXrayYangDiambilRawatanUmum' },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$disaringProgramKanserMulutPemeriksaanUmum',
                'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // untuk sekolah

  // let match_stage_sekolah = [];

  // const match_sekolah_below1year = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //   },
  // };
  // const match_sekolah_1to4years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 1, $lte: 4 },
  //   },
  // };
  // const match_sekolah_5to6years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 5, $lte: 6 },
  //   },
  // };
  // const match_sekolah_7to9years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7, $lte: 9 },
  //   },
  // };
  // const match_sekolah_10to12years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 10, $lte: 12 },
  //   },
  // };
  // const match_sekolah_13to14years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 13, $lte: 14 },
  //   },
  // };
  // const match_sekolah_15to17years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 15, $lte: 17 },
  //   },
  // };
  // const match_sekolah_18to19years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 18, $lte: 19 },
  //   },
  // };
  // const match_sekolah_20to29years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 20, $lte: 29 },
  //   },
  // };
  // const match_sekolah_30to49years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 30, $lte: 49 },
  //   },
  // };
  // const match_sekolah_50to59years = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 50, $lte: 59 },
  //   },
  // };
  // const match_sekolah_60yearsandup = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     umur: { $gte: 60 },
  //   },
  // };
  // const match_sekolah_ibumengandung = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //   },
  // };
  // const match_sekolah_oku = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     orangKurangUpaya: true,
  //   },
  // };
  // const match_sekolah_bukanWarganegara = {
  //   $match: {
  //     ...getParamsKOMsekolah(payload),
  //     statusRawatan: 'belum selesai',
  //     kumpulanEtnik: { $eq: 'bukan warganegara' },
  //   },
  // };

  // match_stage_sekolah.push(match_sekolah_below1year);
  // match_stage_sekolah.push(match_sekolah_1to4years);
  // match_stage_sekolah.push(match_sekolah_5to6years);
  // match_stage_sekolah.push(match_sekolah_7to9years);
  // match_stage_sekolah.push(match_sekolah_10to12years);
  // match_stage_sekolah.push(match_sekolah_13to14years);
  // match_stage_sekolah.push(match_sekolah_15to17years);
  // match_stage_sekolah.push(match_sekolah_18to19years);
  // match_stage_sekolah.push(match_sekolah_20to29years);
  // match_stage_sekolah.push(match_sekolah_30to49years);
  // match_stage_sekolah.push(match_sekolah_50to59years);
  // match_stage_sekolah.push(match_sekolah_60yearsandup);
  // match_stage_sekolah.push(match_sekolah_ibumengandung);
  // match_stage_sekolah.push(match_sekolah_oku);
  // match_stage_sekolah.push(match_sekolah_bukanWarganegara);

  // let pipeline_sekolah = [
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$pemeriksaanSekolah',
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'rawatansekolahs',
  //       localField: 'rawatanSekolah',
  //       foreignField: '_id',
  //       as: 'rawatanSekolah',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$rawatanSekolah',
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: { $toInt: '$umur' },
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       merged: {
  //         $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       statusRawatan: 1,
  //       daerah: 1,
  //       namaSekolah: 1,
  //       kodSekolah: 1,
  //       namaKelas: 1,
  //       nama: 1,
  //       kodJantina: 1,
  //       umur: 1,
  //       noKp: 1,
  //       tarikhLahir: 1,
  //       kaum: 1,
  //       createdByKp: '$merged.createdByKp',
  //       tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
  //       merged: 1,
  //     },
  //   },
  // ];

  // const group_sekolah = {
  //   $group: {
  //     _id: '$merged.createdByKp',
  //     jumlahPelajar: {
  //       $sum: 1,
  //     },
  //     kedatanganTahunSemasaBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahd: {
  //       $sum: '$merged.dAdaGigiDesidus',
  //     },
  //     jumlahf: {
  //       $sum: '$merged.fAdaGigiDesidus',
  //     },
  //     jumlahx: {
  //       $sum: '$merged.xAdaGigiDesidus',
  //     },
  //     jumlahdfx: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiDesidus',
  //           '$merged.fAdaGigiDesidus',
  //           '$merged.xAdaGigiDesidus',
  //         ],
  //       },
  //     },
  //     jumlahD: {
  //       $sum: '$merged.dAdaGigiKekal',
  //     },
  //     jumlahM: {
  //       $sum: '$merged.mAdaGigiKekal',
  //     },
  //     jumlahF: {
  //       $sum: '$merged.fAdaGigiKekal',
  //     },
  //     jumlahX: {
  //       $sum: '$merged.xAdaGigiKekal',
  //     },
  //     jumlahDMFX: {
  //       $sum: {
  //         $add: [
  //           '$merged.dAdaGigiKekal',
  //           '$merged.mAdaGigiKekal',
  //           '$merged.fAdaGigiKekal',
  //           '$merged.xAdaGigiKekal',
  //         ],
  //       },
  //     },
  //     jumlahMBK: {
  //       //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $gte: ['$merge.umur', 1] },
  //                   { $lte: ['$merge.umur', 59] },
  //                   {
  //                     $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                   {
  //                     $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0],
  //                   },
  //                 ],
  //               },
  //               // {
  //               //   $and: [
  //               //     { $lte: ['$merge.umur', 6] },
  //               //     { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //     { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
  //               //   ],
  //               // },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     statusBebasKaries: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               { $gte: ['$merge.umur', 1] },
  //               { $lte: ['$merge.umur', 59] },
  //               { $eq: ['$merged.dAdaGigiKekal', 0] },
  //               { $eq: ['$merged.mAdaGigiKekal', 0] },
  //               { $eq: ['$merged.fAdaGigiKekal', 0] },
  //               { $eq: ['$merged.xAdaGigiKekal', 0] },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     TPR: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $and: [
  //                   { $eq: ['$merged.dAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.dAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.mAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.mAdaGigiDesidus', 0] },
  //                   { $gte: ['$merged.fAdaGigiKekal', 0] },
  //                   { $gte: ['$merged.fAdaGigiDesidus', 0] },
  //                   { $eq: ['$merged.xAdaGigiKekal', 0] },
  //                   { $eq: ['$merged.xAdaGigiDesidus', 0] },
  //                   {
  //                     $or: [
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '0'],
  //                       },
  //                       {
  //                         $eq: ['$merged.skorGisMulutOralHygiene', '2'],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //               {
  //                 $eq: ['$tidakPerluRawatan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.skorBpeOralHygiene', 0],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     skorBPEMoreThanZero: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $gte: ['$merged.skorBpeOralHygiene', 1],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluSapuanFluorida: {
  //       $sum: {
  //         $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
  //       },
  //     },
  //     perluJumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
  //     },
  //     perluJumlahPesakitFS: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $gt: ['$merged.fissureSealant', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     perluJumlahGigiFS: {
  //       $sum: '$merged.baruJumlahGigiKekalPerluFS',
  //     },
  //     perluPenskaleran: {
  //       $sum: {
  //         $eq: ['$merged.perluPenskaleran', true],
  //       },
  //     },
  //     perluEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikDiperlukan',
  //     },
  //     perluEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikDiperlukan',
  //     },
  //     perluEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikDiperlukan',
  //     },
  //     jumlahPerluDenturPenuh: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'penuh-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'penuh-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPerluDenturSepara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $or: [
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhAtasPerluDenture',
  //                   'separa-atas-perlu-denture',
  //                 ],
  //               },
  //               {
  //                 $eq: [
  //                   '$merged.separaPenuhBawahPerluDenture',
  //                   'separa-bawah-perlu-denture',
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kedatanganTahunSemasaUlangan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'ulangan-kedatangan'],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     sapuanFluorida: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $or: [
  //                   {
  //                     $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                   {
  //                     $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kedatangan', 'baru-kedatangan'],
  //               },
  //               {
  //                 $eq: ['$merged.pesakitDibuatPRRJenis1', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: '$merged.pesakitDibuatFissureSealant',
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: '$merged.baruJumlahGigiKekalDibuatFS',
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: '$merged.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: '$merged.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: '$merged.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: '$merged.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: '$merged.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: '$merged.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: '$merged.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: '$merged.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  //     },
  //     inlayOnlayBaru: {
  //       $sum: '$merged.baruInlayOnlayJumlahTampalanDibuat',
  //     },
  //     inlayOnlaySemula: {
  //       $sum: '$merged.semulaInlayOnlayJumlahTampalanDibuat',
  //     },
  //     tampalanSementara: {
  //       $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
  //     },
  //     cabutanGd: {
  //       $sum: '$merged.cabutDesidus',
  //     },
  //     cabutanGk: {
  //       $sum: '$merged.cabutKekal',
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: '$merged.komplikasiSelepasCabutan',
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.penskaleran', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: '$merged.rawatanLainPeriodontik',
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: '$merged.jumlahAnteriorKesEndodontikSelesai',
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: '$merged.jumlahPremolarKesEndodontikSelesai',
  //     },
  //     rawatanEndoMolar: {
  //       $sum: '$merged.jumlahMolarKesEndodontikSelesai',
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.rawatanOrtodontik', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kesPerubatanMulut', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.yaTidakAbsesPembedahan', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$merged.kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: '$merged.cabutanSurgikalPembedahanMulut',
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.yaTidakPembedahanKecilMulutPembedahan',
  //               'ya-pembedahan-kecil-mulut-pembedahan',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: '$merged.baruJumlahCrownBridge',
  //     },
  //     crownBridgeSemula: {
  //       $sum: '$merged.semulaJumlahCrownBridge',
  //     },
  //     postCoreBaru: {
  //       $sum: '$merged.baruJumlahPostCore',
  //     },
  //     postCoreSemula: {
  //       $sum: '$merged.semulaJumlahPostCore',
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: '$merged.baruPenuhJumlahDenturProstodontik',
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: '$merged.semulaPenuhJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruPenuhJumlahDenturProstodontik',
  //           '$merged.semulaPenuhJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: '$merged.baruSeparaJumlahDenturProstodontik',
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: '$merged.semulaSeparaJumlahDenturProstodontik',
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           '$merged.baruSeparaJumlahDenturProstodontik',
  //           '$merged.semulaSeparaJumlahDenturProstodontik',
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: '$merged.immediateDenturProstodontik',
  //     },
  //     pembaikanDenture: {
  //       $sum: '$merged.pembaikanDenturProstodontik',
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$merged.kesSelesai', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: '$merged.bilanganXrayYangDiambil',
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$merged.disaringProgramKanserMulut',
  //               'ya-disaring-program-kanser-mulut',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  // let match_stage_operatorLain = [];

  // const match_operatorLain_below1year = {
  //   $match: {
  //     umur: { $lt: 1 },
  //     umurBulan: { $lt: 13 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_1to4years = {
  //   $match: {
  //     umur: { $gte: 1, $lte: 4 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_5to6years = {
  //   $match: {
  //     umur: { $gte: 5, $lte: 6 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_7to9years = {
  //   $match: {
  //     umur: { $gte: 7, $lte: 9 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_10to12years = {
  //   $match: {
  //     umur: { $gte: 10, $lte: 12 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_13to14years = {
  //   $match: {
  //     umur: { $gte: 13, $lte: 14 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_15to17years = {
  //   $match: {
  //     umur: { $gte: 15, $lte: 17 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_18to19years = {
  //   $match: {
  //     umur: { $gte: 18, $lte: 19 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_20to29years = {
  //   $match: {
  //     umur: { $gte: 20, $lte: 29 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_30to49years = {
  //   $match: {
  //     umur: { $gte: 30, $lte: 49 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_50to59years = {
  //   $match: {
  //     umur: { $gte: 50, $lte: 59 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_60yearsandup = {
  //   $match: {
  //     umur: { $gte: 60 },
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_ibumengandung = {
  //   $match: {
  //     umur: { $gte: 7 },
  //     ibuMengandung: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oku = {
  //   $match: {
  //     orangKurangUpaya: true,
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_bw = {
  //   $match: {
  //     kumpulanEtnik: 'bukan warganegara',
  //     rawatanDibuatOperatorLain: true,
  //   },
  // };
  // const match_operatorLain_oap = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     kumpulanEtnik: {
  //       $in: ['orang asli semenanjung', 'penan'],
  //     },
  //   },
  // };
  // const match_operatorLain_kpb = {
  //   $match: {
  //     rawatanDibuatOperatorLain: true,
  //     menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
  //   },
  // };

  // match_stage_operatorLain.push(
  //   match_operatorLain_below1year,
  //   match_operatorLain_1to4years,
  //   match_operatorLain_5to6years,
  //   match_operatorLain_7to9years,
  //   match_operatorLain_10to12years,
  //   match_operatorLain_13to14years,
  //   match_operatorLain_15to17years,
  //   match_operatorLain_18to19years,
  //   match_operatorLain_20to29years,
  //   match_operatorLain_30to49years,
  //   match_operatorLain_50to59years,
  //   match_operatorLain_60yearsandup,
  //   match_operatorLain_ibumengandung,
  //   match_operatorLain_oku,
  //   match_operatorLain_bw,
  //   match_operatorLain_oap,
  //   match_operatorLain_kpb
  // );

  // const group_operatorLain = {
  //   $group: {
  //     _id: placeModifier(payload),
  //     // dibuat rawatan
  //     sapuanFluorida: {
  //       //fvMuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pesakitDibuatFluorideVarnish', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahPesakitPrrJenis1: {
  //       //prrJ1MuridB
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: [
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                           '',
  //                         ],
  //                       },
  //                       0,
  //                       {
  //                         $toInt:
  //                           '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiPrrJenis1: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitDiBuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $gte: [
  //                   {
  //                     $cond: [
  //                       {
  //                         $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //                       },
  //                       0,
  //                       {
  //                         $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //                       },
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     jumlahGigiDibuatFs: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanAntGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGdSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     tampalanPostAmgGkSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt:
  //               '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     inlayOnlayBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     inlayOnlaySemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     }, //data sudah dpt dari form umum
  //     tampalanSementara: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //               '',
  //             ],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGd: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutDesidusRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutDesidusRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     cabutanGk: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutKekalRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutKekalRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     komplikasiSelepasCabutan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$komplikasiSelepasCabutanRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     penskaleran: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$penskaleranRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanPerioLain: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$rawatanLainPeriodontikRawatanUmum', true],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     rawatanEndoAnterior: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahAnteriorKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoPremolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahPremolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanEndoMolar: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$jumlahMolarKesEndodontikSelesaiRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     rawatanOrtho: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$rawatanOrtodontikRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kesPerubatan: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kesPerubatanMulutRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     abses: {
  //       //data sini campur sekolah form & umum form. blh ke?
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTulangMuka: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTulangMukaUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanGigi: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanGigiUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     kecederaanTisuLembut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $and: [
  //               {
  //                 $eq: ['$kecederaanTisuLembutUmum', true],
  //               },
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     cabutanSurgical: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$cabutanSurgikalPembedahanMulutRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$cabutanSurgikalPembedahanMulutRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembedahanKecilMulut: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',
  //               'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //     crownBridgeBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     crownBridgeSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahCrownBridgeRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahCrownBridgeRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     postCoreSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaJumlahPostCoreRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaJumlahPostCoreRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikPenuhDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturPenuh: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaPenuhJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturBaru: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     prosthodontikSeparaDenturSemula: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     jumlahPesakitBuatDenturSepara: {
  //       $sum: {
  //         $add: [
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$baruSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$baruSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //           {
  //             $cond: [
  //               {
  //                 $eq: ['$semulaSeparaJumlahDenturProstodontikRawatanUmum', ''],
  //               },
  //               0,
  //               {
  //                 $toInt: '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //     immediateDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$immediateDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$immediateDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pembaikanDenture: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$pembaikanDenturProstodontikRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$pembaikanDenturProstodontikRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     kesSelesai: {
  //       $sum: {
  //         $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
  //       },
  //     },
  //     xrayDiambil: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: ['$bilanganXrayYangDiambilRawatanUmum', ''],
  //           },
  //           0,
  //           {
  //             $toInt: '$bilanganXrayYangDiambilRawatanUmum',
  //           },
  //         ],
  //       },
  //     },
  //     pesakitDisaringOC: {
  //       $sum: {
  //         $cond: [
  //           {
  //             $eq: [
  //               '$disaringProgramKanserMulutPemeriksaanUmum',
  //               'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
  //             ],
  //           },
  //           1,
  //           0,
  //         ],
  //       },
  //     },
  //   },
  // };

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataSekolah = [];
    // let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        ...main_switch,
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryPKAP2Pemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      console.log(queryPKAP2Pemeriksaan);
      dataPemeriksaan.push({ queryPKAP2Pemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [...main_switch, match_stage[i], group];
      const queryPKAP2Rawatan = await Umum.aggregate(pipeline);
      console.log(queryPKAP2Rawatan);
      dataRawatan.push({ queryPKAP2Rawatan });
    }

    // for (let i = 0; i < match_stage_sekolah.length; i++) {
    //   const pipeline = [
    //     ...pipeline_sekolah,
    //     match_stage_sekolah[i],
    //     group_sekolah,
    //   ];
    //   const querySekolah = await Sekolah.aggregate(pipeline);
    //   dataSekolah.push({ querySekolah });
    // }

    // if (!payload.pilihanIndividu) {
    //   for (let i = 0; i < match_stage_operatorLain.length; i++) {
    //     const pipeline = [
    //       ...main_switch,
    //       match_stage_operatorLain[i],
    //       ...getParamsOperatorLain,
    //       group_operatorLain,
    //     ];
    //     const queryOperatorLain = await Umum.aggregate(pipeline);
    //     dataOperatorLain.push({ queryOperatorLain });
    //   }
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    // bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};

module.exports = {
  countPPIM03,
  countPPIM04,
  countPPIM05,
  countBEGIN,
  countDEWASAMUDA,
  countOAP,
  countLiputanOAP,
  countKPBMPBHarian,
  countKPBMPBBulanan,
  countKOM,
  countPPR,
  countUTCRTC,
  countPPKPS,
  // pkap 1
  countPKAP2,
};

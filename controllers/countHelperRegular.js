const moment = require('moment');
const Umum = require('../models/Umum');
const Promosi = require('../models/Promosi');
const Fasiliti = require('../models/Fasiliti');
const KohortKotak = require('../models/KohortKotak');
const MediaSosial = require('../models/MediaSosial');
const { errorRetenLogger } = require('../logs/logger');
const {
  ultimateCutoff,
  ultimateCutoffPromosiEdition,
  placeModifier,
  getParams101,
  getParams211,
  getParams214,
  getParams206,
  getParams207,
  getParams206207sekolah,
  getParamsPgpr201,
  getParamsPGS201,
  getParamsPGS203,
  getParamsPgPro,
  getParamsGender,
  getParamsPiagamMasa,
  getParamsBp,
  getParamsBPE,
  getParamsTOD,
  getParamsOplainP1,
  getParamsOplainP2,
} = require('./countHelperParams');
const {
  // pipeline
  pipelineSekolahPemeriksaan,
  pipelineSekolahRawatan,
  pipelineEnrolmenSekolah,
  pipelineTutupSekolah,
  pipelineKepp,
  pipelineTod,
  pipelineBegin,
  // id
  id201Biasa,
  id201KhasKham,
  id201OAP,
  id201AllOAP,
  id201AllOKU,
  id203KPSKPB,
  id203KKI,
  id203OAP,
  id203AllKPSKPB,
  id203AllOAP,
  idPPIM03All,
  outputReqPgpr201,
  outputReq211,
  groupPG214,
  groupSekolah,
  groupPemeriksaanBiasa,
  groupRawatanBiasa,
  groupUmum,
  groupIm,
  groupOplain,
  groupSekolahPemeriksaan,
  groupSekolahRawatan,
  groupSekolahPemeriksaanOKUBW,
  groupSekolahRawatanOKUBW,
  groupKesSelesaiSekolah,
  groupKesSelesaiSekolahOKUBW,
} = require('./countHelperPipeline');
const sesiTakwimSekolah = require('../controllers/helpers/sesiTakwimSekolah');

// Reten Kaunter
const countPG101A = async (payload) => {
  const { daerah, klinik, tarikhMula, tarikhAkhir, jenisReten } = payload;

  const bigData = [];

  const match_stage = { $match: getParams101(payload, 'A') };

  const ultimateCutOff = { $match: { ...ultimateCutoff(payload) } };

  const project_stage = {
    $project: {
      _id: placeModifier(payload),
      deleted: 1,
      createdByUsername: 1,
      tarikhKedatangan: '$tarikhKedatangan',
      noSiri: '$noSiri',
      noPendaftaranBaru: '$noPendaftaranBaru',
      noPendaftaranUlangan: '$noPendaftaranUlangan',
      nama: '$nama',
      jantina: '$jantina',
      umur: '$umur',
      ic: '$ic',
      alamat: '$alamat',
      umur: '$umur',
      waktuSampai: '$waktuSampai',
      jantina: '$jantina',
      ibuMengandung: '$ibuMengandung',
      orangKurangUpaya: '$orangKurangUpaya',
      bersekolah: '$bersekolah',
      noOku: '$noOku',
      noPesara: 1,
      kategoriPesakit: 1,
      statusPesara: 1,
      kumpulanEtnik: 1,
      rujukDaripada: 1,
      noBayaran: 1,
      noResit: 1,
      noBayaran2: 1,
      noResit2: 1,
      noBayaran3: 1,
      noResit3: 1,
      catatan: 1,
      rawatanDibuatOperatorLain: 1,
      maklumatOperatorLain: {
        $map: {
          input: '$rawatanOperatorLain',
          as: 'nama',
          in: '$$nama.createdByUsername',
        },
      },
      idOperatorLain: {
        $map: {
          input: '$rawatanOperatorLain',
          as: 'nomborMdc',
          in: '$$nomborMdc.createdByMdcMdtb',
        },
      },
    },
  };
  const sort_stage = {
    $sort: {
      tarikhKedatangan: 1,
    },
  };

  let kkiaMatch;

  if (daerah !== 'all' && klinik !== 'all') {
    kkiaMatch = await Fasiliti.find({
      jenisFasiliti: 'kkiakd',
      kodFasilitiHandler: klinik,
    }).select('nama kodKkiaKd createdByNegeri createdByDaerah');
  }
  if (daerah !== 'all' && klinik === 'all') {
    // kkiaMatch = await Fasiliti.find({
    //   jenisFasiliti: 'kkiakd',
    //   createdByDaerah: daerah,
    // })
    //   .select('nama kodKkiaKd createdByNegeri createdByDaerah')
    console.log('KKIA find for DAERAH not yet implemented');
  }
  if (daerah === 'all') {
    // kkiaMatch = await Fasiliti.find({
    //   jenisFasiliti: 'kkiakd',
    //   createdByNegeri: negeri,
    // })
    //   .select('nama kodKkiaKd createdByNegeri createdByDaerah')
    console.log('KKIA find for NEGERI not yet implemented');
  }

  const kkiaData = [];

  try {
    // cari pt kp
    const pipeline = [match_stage, ultimateCutOff, project_stage, sort_stage];
    const kpData = await Umum.aggregate(pipeline);

    // cari pt kkiakd
    if (kkiaMatch) {
      for (let i = 0; i < kkiaMatch.length; i++) {
        const kkiaMatchPipeline = [
          {
            $match: {
              jenisFasiliti: 'kk-kd',
              kodFasilitiKkKd: kkiaMatch[i].kodKkiaKd,
              tarikhKedatangan: {
                $gte: moment(tarikhMula).format('YYYY-MM-DD'),
                $lte: moment(tarikhAkhir).format('YYYY-MM-DD'),
              },
              oncall: { $in: [false, null] },
            },
          },
          {
            $match: {
              ...ultimateCutoff(payload),
            },
          },
          {
            ...project_stage,
          },
          {
            ...sort_stage,
          },
        ];
        let temp = await Umum.aggregate(kkiaMatchPipeline);
        temp = [
          {
            nama: kkiaMatch[i].nama,
            kodKkiaKd: kkiaMatch[i].kodKkiaKd,
            createdByNegeri: kkiaMatch[i].createdByNegeri,
            createdByDaerah: kkiaMatch[i].createdByDaerah,
          },
          ...temp,
        ];
        kkiaData.push(temp);
      }
    }

    if (kpData.length === 0) {
      errorRetenLogger.error(
        `Error mengira reten: ${jenisReten}. Tiada data yang dijumpai.`
      );
      throw new Error('Tiada data yang dijumpai');
    }

    bigData.push(kpData);
    bigData.push(kkiaData);

    return bigData;
  } catch (error) {
    throw new Error(error);
  }
};
const countPG101C = async (payload) => {
  const match_stage = { $match: getParams101(payload, 'C') };

  const ultimateCutOff = { $match: { ...ultimateCutoff(payload) } };

  const project_stage = {
    $project: {
      _id: placeModifier(payload),
      deleted: 1,
      createdByUsername: 1,
      tarikhKedatangan: '$tarikhKedatangan',
      noSiri: '$noSiri',
      noPendaftaranBaru: '$noPendaftaranBaru',
      noPendaftaranUlangan: '$noPendaftaranUlangan',
      nama: '$nama',
      jantina: '$jantina',
      umur: '$umur',
      ic: '$ic',
      alamat: '$alamat',
      umur: '$umur',
      waktuSampai: '$waktuSampai',
      jantina: '$jantina',
      ibuMengandung: '$ibuMengandung',
      orangKurangUpaya: '$orangKurangUpaya',
      bersekolah: '$bersekolah',
      noOku: '$noOku',
      noPesara: 1,
      kategoriPesakit: '$kategoriPesakit',
      statusPesara: '$statusPesara',
      kumpulanEtnik: '$kumpulanEtnik',
      rujukDaripada: '$rujukDaripada',
      catatan: '$catatan',
      catatan: 1,
      rawatanDibuatOperatorLain: 1,
      maklumatOperatorLain: {
        $map: {
          input: '$rawatanOperatorLain',
          as: 'nama',
          in: '$$nama.createdByUsername',
        },
      },
      idOperatorLain: {
        $map: {
          input: '$rawatanOperatorLain',
          as: 'nomborMdc',
          in: '$$nomborMdc.createdByMdcMdtb',
        },
      },
    },
  };

  const sort_stage = {
    $sort: {
      tarikhKedatangan: 1,
    },
  };

  try {
    const pipeline = [match_stage, ultimateCutOff, project_stage, sort_stage];

    const PG101C = await Umum.aggregate(pipeline);

    if (PG101C.length === 0) {
      errorRetenLogger.error(
        `Error mengira reten: ${payload.jenisReten}. Tiada data yang dijumpai.`
      );
      throw new Error('Tiada data yang dijumpai');
    }

    return PG101C;
  } catch (error) {
    throw new Error(error);
  }
};
const countPG211A = async (payload) => {
  const main_switch = {
    $match: {
      ...getParams211(payload, 'A'),
      ...ultimateCutoff(payload),
    },
  };

  const facet_stage = {
    $facet: {
      dataBaru: [
        {
          $match: {
            kedatangan: 'baru-kedatangan',
          },
        },
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [
              0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 40, 50, 60, 61, 65, 66, 70,
              75, 150,
            ],
            default: 'Other',
            output: {
              ...outputReq211,
            },
          },
        },
      ],
      dataUlangan: [
        {
          $match: {
            kedatangan: 'ulangan-kedatangan',
          },
        },
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [
              0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 40, 50, 60, 61, 65, 66, 70,
              75, 150,
            ],
            default: 'Other',
            output: {
              ...outputReq211,
            },
          },
        },
      ],
    },
  };

  try {
    const pipeline = [main_switch, facet_stage];
    const PG211A = await Umum.aggregate(pipeline);

    return PG211A;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPG211C = async (payload) => {
  const main_switch = {
    $match: {
      ...getParams211(payload, 'C'),
      ...ultimateCutoff(payload),
    },
  };

  const facet_stage = {
    $facet: {
      dataBaru: [
        {
          $match: {
            kedatangan: 'baru-kedatangan',
          },
        },
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [
              0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 40, 50, 60, 61, 65, 66, 70,
              75, 150,
            ],
            default: 'Other',
            output: {
              ...outputReq211,
            },
          },
        },
      ],
      dataUlangan: [
        {
          $match: {
            kedatangan: 'ulangan-kedatangan',
          },
        },
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [
              0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 40, 50, 60, 61, 65, 66, 70,
              75, 150,
            ],
            default: 'Other',
            output: {
              ...outputReq211,
            },
          },
        },
      ],
    },
  };

  try {
    const pipeline = [main_switch, facet_stage];
    const PG211C = await Umum.aggregate(pipeline);

    return PG211C;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

//Reten Umum
const countPG206 = async (payload) => {
  const main_switch = {
    $match: {
      ...getParams206(payload),
      ...ultimateCutoff(payload),
    },
  };

  const data206 = await Umum.aggregate([
    main_switch,
    {
      $facet: {
        umumPemeriksaan: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
            },
          },
          {
            $bucket: {
              groupBy: '$umur',
              boundaries: [0, 1, 5, 7, 10, 13, 15, 18],
              default: 'Other',
              output: {
                ...groupPemeriksaanBiasa,
              },
            },
          },
        ],
        umumRawatan: [
          {
            $bucket: {
              groupBy: '$umur',
              boundaries: [0, 1, 5, 7, 10, 13, 15, 18],
              default: 'Other',
              output: {
                ...groupRawatanBiasa,
              },
            },
          },
        ],
        okuPemeriksaan: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              orangKurangUpaya: true,
            },
          },
          {
            $group: {
              _id: null,
              ...groupPemeriksaanBiasa,
            },
          },
        ],
        okuRawatan: [
          {
            $match: {
              orangKurangUpaya: true,
            },
          },
          {
            $group: {
              _id: null,
              ...groupRawatanBiasa,
            },
          },
        ],
        bwPemeriksaan: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              kumpulanEtnik: {
                $eq: 'bukan warganegara',
              },
            },
          },
          {
            $group: {
              _id: null,
              ...groupPemeriksaanBiasa,
            },
          },
        ],
        bwRawatan: [
          {
            $match: {
              kumpulanEtnik: {
                $eq: 'bukan warganegara',
              },
            },
          },
          {
            $group: {
              _id: null,
              ...groupRawatanBiasa,
            },
          },
        ],
      },
    },
  ]);
  const data206oplain = await Umum.aggregate([
    {
      $match: {
        ...ultimateCutoff(payload),
        ...getParamsOplainP1(payload),
      },
    },
    ...getParamsOplainP2,
    {
      $match: {
        ...(payload.pilihanIndividu
          ? { createdByMdcMdtb: payload.pilihanIndividu }
          : { createdByMdcMdtb: { $regex: /^mdtb/i } }),
      },
    },
    {
      $facet: {
        oplainRawatan: [
          {
            $bucket: {
              groupBy: '$umur',
              boundaries: [0, 1, 5, 7, 10, 13, 15, 18],
              default: 'Other',
              output: {
                ...groupOplain,
              },
            },
          },
        ],
        oplainOku: [
          {
            $match: {
              orangKurangUpaya: true,
            },
          },
          {
            $group: {
              _id: null,
              ...groupOplain,
            },
          },
        ],
        oplainBw: [
          {
            $match: {
              kumpulanEtnik: 'bukan warganegara',
            },
          },
          {
            $group: {
              _id: null,
              ...groupOplain,
            },
          },
        ],
      },
    },
  ]);

  // for frodo
  const sesiTakwim = sesiTakwimSekolah();

  const pipeline_pemeriksaan_sekolah = [
    {
      $match: {
        ...getParams206207sekolah(payload),
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
        pipeline: [
          {
            $match: {
              deleted: false,
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: { $ne: null },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$result',
      },
    },
    {
      $addFields: {
        statusRawatan: '$result.statusRawatan',
        tahunTingkatan: '$result.tahunTingkatan',
        kelasPelajar: '$result.kelasPelajar',
        jantina: '$result.jantina',
        statusOku: '$result.statusOku',
        umur: '$result.umur',
        keturunan: '$result.keturunan',
        warganegara: '$result.warganegara',
        kesSelesaiMmi: '$result.kesSelesaiMmi',
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
      $match: {
        'pemeriksaanSekolah.createdByMdcMdtb': payload.pilihanIndividu
          ? payload.pilihanIndividu
          : { $regex: /^mdtb/i },
        'pemeriksaanSekolah.tarikhPemeriksaanSemasa': {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
  ];
  const pipeline_rawatan_sekolah = [
    {
      $match: {
        ...getParams206207sekolah(payload),
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
        pipeline: [
          {
            $match: {
              deleted: false,
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: { $ne: null },
              rawatanSekolah: { $ne: [] },
            },
          },
        ],
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
      $match: {
        'rawatanSekolah.createdByMdcMdtb': payload.pilihanIndividu
          ? payload.pilihanIndividu
          : { $regex: /^mdtb/i },
        'rawatanSekolah.tarikhRawatanSemasa': {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
  ];
  const pipeline_kedatangan_sekolah = [
    {
      $match: {
        ...getParams206207sekolah(payload),
      },
    },
    {
      $project: {
        _id: 1,
        jenisFasiliti: 1,
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
        pipeline: [
          {
            $match: {
              deleted: false,
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: { $ne: null },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$result',
      },
    },
    {
      $addFields: {
        nama: '$result.nama',
        umur: '$result.umur',
        warganegara: '$result.warganegara',
        statusOku: '$result.statusOku',
        pemeriksaanSekolah: '$result.pemeriksaanSekolah',
        rawatanSekolah: '$result.rawatanSekolah',
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
      $lookup: {
        from: 'rawatansekolahs',
        localField: 'rawatanSekolah',
        foreignField: '_id',
        as: 'rawatanSekolah',
      },
    },
    {
      $addFields: {
        tarikhPemeriksaan: '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
        operatorPemeriksaan: '$pemeriksaanSekolah.createdByMdcMdtb',
        lastRawatan: {
          $arrayElemAt: [
            '$rawatanSekolah',
            {
              $subtract: [
                {
                  $size: '$rawatanSekolah',
                },
                1,
              ],
            },
          ],
        },
      },
    },
    {
      $project: {
        nama: 1,
        umur: 1,
        warganegara: 1,
        statusOku: 1,
        tarikhPemeriksaan: 1,
        operatorPemeriksaan: 1,
        tarikhRawatan: '$lastRawatan.tarikhRawatanSemasa',
        operatorRawatan: '$lastRawatan.createdByMdcMdtb',
      },
    },
    {
      $match: {
        tarikhPemeriksaan: {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
        $or: [
          {
            operatorPemeriksaan: payload.pilihanIndividu
              ? payload.pilihanIndividu
              : { $regex: /^mdtb/i },
          },
          {
            operatorRawatan: payload.pilihanIndividu
              ? payload.pilihanIndividu
              : { $regex: /^mdtb/i },
          },
        ],
      },
    },
  ];
  const group_kedatangan_sekolah = [
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 5],
                    },
                    {
                      $lte: ['$umur', 6],
                    },
                  ],
                },
                then: 'lima-enam',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 7],
                    },
                    {
                      $lte: ['$umur', 9],
                    },
                  ],
                },
                then: 'tujuh-sembilan',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 10],
                    },
                    {
                      $lte: ['$umur', 12],
                    },
                  ],
                },
                then: 'sepuluh-dua-belas',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 13],
                    },
                    {
                      $lte: ['$umur', 14],
                    },
                  ],
                },
                then: 'tiga-belas-empat-belas',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 15],
                    },
                    {
                      $lte: ['$umur', 17],
                    },
                  ],
                },
                then: 'lima-belas-tujuh-belas',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 18],
                    },
                    {
                      $lte: ['$umur', 19],
                    },
                  ],
                },
                then: 'lapan-belas-sembilan-belas',
              },
            ],
            default: 'Unknown',
          },
        },
        kedatanganBaru: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ifNull: ['$tarikhRawatan', true] },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $ne: ['$operatorPemeriksaan', '$operatorRawatan'],
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
        kedatanganUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ifNull: ['$tarikhRawatan', false],
                  },
                  {
                    $ne: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                  },
                  {
                    $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
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
  // const pipeline_kesSelesai_sekolah = [
  //   {
  //     $match: {
  //       ...getParams206207sekolah(payload),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'sekolahs',
  //       localField: 'kodSekolah',
  //       foreignField: 'kodSekolah',
  //       as: 'result',
  //       pipeline: [
  //         {
  //           $match: {
  //             deleted: false,
  //             sesiTakwimPelajar: sesiTakwim,
  //             pemeriksaanSekolah: { $ne: null },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $unwind: '$result',
  //   },
  //   {
  //     $addFields: {
  //       umur: '$result.umur',
  //       keturunan: '$result.keturunan',
  //       warganegara: '$result.warganegara',
  //       statusOku: '$result.statusOku',
  //       statusRawatan: '$result.statusRawatan',
  //       tahunTingkatan: '$result.tahunTingkatan',
  //       kelasPelajar: '$result.kelasPelajar',
  //       jantina: '$result.jantina',
  //       pemeriksaanSekolah: '$result.pemeriksaanSekolah',
  //       rawatanSekolah: '$result.rawatanSekolah',
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
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
  //     $match: {
  //       'pemeriksaanSekolah.createdByMdcMdtb': payload.pilihanIndividu
  //         ? payload.pilihanIndividu
  //         : { $regex: /mdtb/i },
  //       'pemeriksaanSekolah.tarikhPemeriksaanSemasa': {
  //         $gte: payload.tarikhMula,
  //         $lte: payload.tarikhAkhir,
  //       },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       kesSelesaiPemeriksaan: {
  //         $cond: {
  //           if: {
  //             $in: [
  //               'ya-kes-selesai',
  //               {
  //                 $map: {
  //                   input: '$pemeriksaanSekolah',
  //                   as: 'item',
  //                   in: '$$item.kesSelesai',
  //                 },
  //               },
  //             ],
  //           },
  //           then: 'ya-kes-selesai',
  //           else: 'tidak-kes-selesai',
  //         },
  //       },
  //       kesSelesaiRawatan: {
  //         $cond: {
  //           if: {
  //             $in: [
  //               'ya-kes-selesai-penyata-akhir-2',
  //               {
  //                 $map: {
  //                   input: '$rawatanSekolah',
  //                   as: 'item',
  //                   in: '$$item.kesSelesaiSekolahRawatan',
  //                 },
  //               },
  //             ],
  //           },
  //           then: 'ya-kes-selesai',
  //           else: 'tidak-kes-selesai',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       kodSekolah: 1,
  //       sesiTakwimSekolah: 1,
  //       umur: 1,
  //       keturunan: 1,
  //       warganegara: 1,
  //       statusOku: 1,
  //       statusRawatan: 1,
  //       tahunTingkatan: 1,
  //       kelasPelajar: 1,
  //       jantina: 1,
  //       kesSelesaiPemeriksaan: 1,
  //       kesSelesaiRawatan: 1,
  //     },
  //   },
  // ];

  const dataSekolahPemeriksaan = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $group: {
        ...groupSekolahPemeriksaan,
      },
    },
  ]);
  const dataSekolahRawatan = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $group: {
        ...groupSekolahRawatan,
      },
    },
  ]);
  const dataSekolahPemeriksaanOKU = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $match: {
        statusOku: 'OKU',
      },
    },
    {
      $group: {
        ...groupSekolahPemeriksaan,
      },
    },
  ]);
  const dataSekolahRawatanOKU = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $match: {
        statusOku: 'OKU',
      },
    },
    {
      $group: {
        ...groupSekolahRawatan,
      },
    },
  ]);
  const dataSekolahPemeriksaanBW = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $match: {
        warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
      },
    },
    {
      $group: {
        ...groupSekolahPemeriksaan,
      },
    },
  ]);
  const dataSekolahRawatanBW = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $match: {
        warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
      },
    },
    {
      $group: {
        ...groupSekolahRawatan,
      },
    },
  ]);

  // for sam
  const kedatanganSekolah = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    ...group_kedatangan_sekolah,
  ]);
  const kedatanganSekolahOKU = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    {
      $match: {
        statusOku: 'OKU',
      },
    },
    {
      $group: {
        _id: null,
        jumlah: { $sum: 1 },
        kedatanganEnggan: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'enggan'],
                  },
                  {
                    $eq: ['$statusRawatan', 'enggan rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganTidakHadir: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'tidak hadir'],
                  },
                  {
                    $eq: ['$statusRawatan', 'tidak hadir rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganBaru: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ifNull: ['$tarikhPemeriksaan', false] },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $ne: ['$operatorPemeriksaan', '$operatorRawatan'],
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
        kedatanganUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ifNull: ['$tarikhRawatan', false],
                  },
                  {
                    $ne: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                  },
                  {
                    $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
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
  const kedatanganSekolahBW = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    {
      $match: {
        warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
      },
    },
    {
      $group: {
        _id: null,
        jumlah: { $sum: 1 },
        kedatanganEnggan: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'enggan'],
                  },
                  {
                    $eq: ['$statusRawatan', 'enggan rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganTidakHadir: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'tidak hadir'],
                  },
                  {
                    $eq: ['$statusRawatan', 'tidak hadir rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganBaru: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ifNull: ['$tarikhPemeriksaan', false] },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $ne: ['$operatorPemeriksaan', '$operatorRawatan'],
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
        kedatanganUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ifNull: ['$tarikhRawatan', false],
                  },
                  {
                    $ne: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                  },
                  {
                    $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
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

  // for aragorn
  // const kesSelesaiBiasa = await Fasiliti.aggregate([
  //   ...pipeline_kesSelesai_sekolah,
  //   {
  //     $group: {
  //       ...groupKesSelesaiSekolah,
  //     },
  //   },
  // ]);
  // const kesSelesaiOKU = await Fasiliti.aggregate([
  //   ...pipeline_kesSelesai_sekolah,
  //   {
  //     $match: {
  //       statusOku: 'OKU',
  //     },
  //   },
  //   {
  //     $group: {
  //       ...groupKesSelesaiSekolahOKUBW,
  //     },
  //   },
  // ]);
  // const kesSelesaiBW = await Fasiliti.aggregate([
  //   ...pipeline_kesSelesai_sekolah,
  //   {
  //     $match: {
  //       warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
  //     },
  //   },
  //   {
  //     $group: {
  //       ...groupKesSelesaiSekolahOKUBW,
  //     },
  //   },
  // ]);

  try {
    let bigData = [];

    bigData.push(
      data206,
      data206oplain,
      // hal sekolah
      dataSekolahPemeriksaan,
      dataSekolahRawatan,
      kedatanganSekolah,
      dataSekolahPemeriksaanOKU,
      dataSekolahRawatanOKU,
      dataSekolahPemeriksaanBW,
      dataSekolahRawatanBW,
      kedatanganSekolahOKU,
      kedatanganSekolahBW
      // kesSelesaiBiasa,
      // kesSelesaiOKU,
      // kesSelesaiBW
    );

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPG207 = async (payload) => {
  const main_switch = {
    $match: {
      ...getParams207(payload),
      ...ultimateCutoff(payload),
    },
  };

  const data207 = await Umum.aggregate([
    main_switch,
    {
      $facet: {
        umumPemeriksaan: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
            },
          },
          {
            $bucket: {
              groupBy: '$umur',
              boundaries: [0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
              default: 'Other',
              output: {
                ...groupPemeriksaanBiasa,
              },
            },
          },
        ],
        umumRawatan: [
          {
            $bucket: {
              groupBy: '$umur',
              boundaries: [0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
              default: 'Other',
              output: {
                ...groupRawatanBiasa,
              },
            },
          },
        ],
        imPemeriksaan: [
          {
            $match: {
              umur: { $gte: 7 },
              ibuMengandung: true,
              bookingIM: 'ya-booking-im',
              mengandungDahGravida: false,
            },
          },
          {
            $group: {
              _id: null,
              ...groupIm,
            },
          },
        ],
        imRawatan: [
          {
            $match: {
              umur: { $gte: 7 },
              ibuMengandung: true,
              bookingIM: 'ya-booking-im',
            },
          },
          {
            $group: {
              _id: null,
              ...groupIm,
            },
          },
        ],
        okuPemeriksaan: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              orangKurangUpaya: true,
            },
          },
          {
            $group: {
              _id: null,
              ...groupPemeriksaanBiasa,
            },
          },
        ],
        okuRawatan: [
          {
            $match: {
              orangKurangUpaya: true,
            },
          },
          {
            $group: {
              _id: null,
              ...groupRawatanBiasa,
            },
          },
        ],
        bwPemeriksaan: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              kumpulanEtnik: {
                $eq: 'bukan warganegara',
              },
            },
          },
          {
            $group: {
              _id: null,
              ...groupPemeriksaanBiasa,
            },
          },
        ],
        bwRawatan: [
          {
            $match: {
              kumpulanEtnik: {
                $eq: 'bukan warganegara',
              },
            },
          },
          {
            $group: {
              _id: null,
              ...groupRawatanBiasa,
            },
          },
        ],
      },
    },
  ]);
  const data207oplain = await Umum.aggregate([
    {
      $match: {
        ...ultimateCutoff(payload),
        ...getParamsOplainP1(payload),
      },
    },
    ...getParamsOplainP2,
    {
      $match: {
        ...(payload.pilihanIndividu
          ? { createdByMdcMdtb: payload.pilihanIndividu }
          : { createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i } }),
      },
    },
    {
      $facet: {
        oplainRawatan: [
          {
            $bucket: {
              groupBy: '$umur',
              boundaries: [0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
              default: 'Other',
              output: {
                ...groupOplain,
              },
            },
          },
        ],
        oplainIm: [
          {
            $match: {
              umur: { $gte: 7 },
              ibuMengandung: true,
            },
          },
          {
            $group: {
              _id: null,
              ...groupOplain,
            },
          },
        ],
        oplainOku: [
          {
            $match: {
              orangKurangUpaya: true,
            },
          },
          {
            $group: {
              _id: null,
              ...groupOplain,
            },
          },
        ],
        oplainBw: [
          {
            $match: {
              kumpulanEtnik: 'bukan warganegara',
            },
          },
          {
            $group: {
              _id: null,
              ...groupOplain,
            },
          },
        ],
      },
    },
  ]);

  // for frodo
  const sesiTakwim = sesiTakwimSekolah();

  const pipeline_pemeriksaan_sekolah = [
    {
      $match: {
        ...getParams206207sekolah(payload),
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
        pipeline: [
          {
            $match: {
              deleted: false,
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: { $ne: null },
            },
          },
        ],
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
      $match: {
        'pemeriksaanSekolah.createdByMdcMdtb': payload.pilihanIndividu
          ? payload.pilihanIndividu
          : { $regex: /^(?!mdtb).*$/i },
        'pemeriksaanSekolah.tarikhPemeriksaanSemasa': {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
  ];
  const pipeline_rawatan_sekolah = [
    {
      $match: {
        ...getParams206207sekolah(payload),
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
        pipeline: [
          {
            $match: {
              deleted: false,
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: { $ne: null },
              rawatanSekolah: { $ne: [] },
            },
          },
        ],
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
      $match: {
        'rawatanSekolah.createdByMdcMdtb': payload.pilihanIndividu
          ? payload.pilihanIndividu
          : { $regex: /^(?!mdtb).*$/i },
        'rawatanSekolah.tarikhRawatanSemasa': {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
  ];
  const pipeline_kedatangan_sekolah = [
    {
      $match: {
        ...getParams206207sekolah(payload),
      },
    },
    {
      $project: {
        _id: 1,
        jenisFasiliti: 1,
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
        pipeline: [
          {
            $match: {
              deleted: false,
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: { $ne: null },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$result',
      },
    },
    {
      $addFields: {
        nama: '$result.nama',
        umur: '$result.umur',
        warganegara: '$result.warganegara',
        statusOku: '$result.statusOku',
        pemeriksaanSekolah: '$result.pemeriksaanSekolah',
        rawatanSekolah: '$result.rawatanSekolah',
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
      $lookup: {
        from: 'rawatansekolahs',
        localField: 'rawatanSekolah',
        foreignField: '_id',
        as: 'rawatanSekolah',
      },
    },
    {
      $addFields: {
        tarikhPemeriksaan: '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
        operatorPemeriksaan: '$pemeriksaanSekolah.createdByMdcMdtb',
        lastRawatan: {
          $arrayElemAt: [
            '$rawatanSekolah',
            {
              $subtract: [
                {
                  $size: '$rawatanSekolah',
                },
                1,
              ],
            },
          ],
        },
      },
    },
    {
      $project: {
        nama: 1,
        umur: 1,
        warganegara: 1,
        statusOku: 1,
        tarikhPemeriksaan: 1,
        operatorPemeriksaan: 1,
        tarikhRawatan: '$lastRawatan.tarikhRawatanSemasa',
        operatorRawatan: '$lastRawatan.createdByMdcMdtb',
      },
    },
    {
      $match: {
        tarikhPemeriksaan: {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
        $or: [
          {
            operatorPemeriksaan: payload.pilihanIndividu
              ? payload.pilihanIndividu
              : { $regex: /^(?!mdtb).*$/i },
          },
          {
            operatorRawatan: payload.pilihanIndividu
              ? payload.pilihanIndividu
              : { $regex: /^(?!mdtb).*$/i },
          },
        ],
      },
    },
  ];
  const group_kedatangan_sekolah = [
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 5],
                    },
                    {
                      $lte: ['$umur', 6],
                    },
                  ],
                },
                then: 'lima-enam',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 7],
                    },
                    {
                      $lte: ['$umur', 9],
                    },
                  ],
                },
                then: 'tujuh-sembilan',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 10],
                    },
                    {
                      $lte: ['$umur', 12],
                    },
                  ],
                },
                then: 'sepuluh-dua-belas',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 13],
                    },
                    {
                      $lte: ['$umur', 14],
                    },
                  ],
                },
                then: 'tiga-belas-empat-belas',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 15],
                    },
                    {
                      $lte: ['$umur', 17],
                    },
                  ],
                },
                then: 'lima-belas-tujuh-belas',
              },
              {
                case: {
                  $and: [
                    {
                      $gte: ['$umur', 18],
                    },
                    {
                      $lte: ['$umur', 19],
                    },
                  ],
                },
                then: 'lapan-belas-sembilan-belas',
              },
            ],
            default: 'Unknown',
          },
        },
        kedatanganBaru: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ifNull: ['$tarikhRawatan', true] },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $ne: ['$operatorPemeriksaan', '$operatorRawatan'],
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
        kedatanganUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ifNull: ['$tarikhRawatan', false],
                  },
                  {
                    $ne: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                  },
                  {
                    $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
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
  // const pipeline_kesSelesai_sekolah = [
  //   {
  //     $match: {
  //       ...getParams206207sekolah(payload),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'sekolahs',
  //       localField: 'kodSekolah',
  //       foreignField: 'kodSekolah',
  //       as: 'result',
  //       pipeline: [
  //         {
  //           $match: {
  //             deleted: false,
  //             sesiTakwimPelajar: sesiTakwim,
  //             pemeriksaanSekolah: { $ne: null },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $unwind: '$result',
  //   },
  //   {
  //     $addFields: {
  //       umur: '$result.umur',
  //       keturunan: '$result.keturunan',
  //       warganegara: '$result.warganegara',
  //       statusOku: '$result.statusOku',
  //       statusRawatan: '$result.statusRawatan',
  //       tahunTingkatan: '$result.tahunTingkatan',
  //       kelasPelajar: '$result.kelasPelajar',
  //       jantina: '$result.jantina',
  //       pemeriksaanSekolah: '$result.pemeriksaanSekolah',
  //       rawatanSekolah: '$result.rawatanSekolah',
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'pemeriksaansekolahs',
  //       localField: 'pemeriksaanSekolah',
  //       foreignField: '_id',
  //       as: 'pemeriksaanSekolah',
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
  //     $match: {
  //       'pemeriksaanSekolah.createdByMdcMdtb': payload.pilihanIndividu
  //         ? payload.pilihanIndividu
  //         : { $regex: /^(?!mdtb).*$/i },
  //       'pemeriksaanSekolah.tarikhPemeriksaanSemasa': {
  //         $gte: payload.tarikhMula,
  //         $lte: payload.tarikhAkhir,
  //       },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       kesSelesaiPemeriksaan: {
  //         $cond: {
  //           if: {
  //             $in: [
  //               'ya-kes-selesai',
  //               {
  //                 $map: {
  //                   input: '$pemeriksaanSekolah',
  //                   as: 'item',
  //                   in: '$$item.kesSelesai',
  //                 },
  //               },
  //             ],
  //           },
  //           then: 'ya-kes-selesai',
  //           else: 'tidak-kes-selesai',
  //         },
  //       },
  //       kesSelesaiRawatan: {
  //         $cond: {
  //           if: {
  //             $in: [
  //               'ya-kes-selesai-penyata-akhir-2',
  //               {
  //                 $map: {
  //                   input: '$rawatanSekolah',
  //                   as: 'item',
  //                   in: '$$item.kesSelesaiSekolahRawatan',
  //                 },
  //               },
  //             ],
  //           },
  //           then: 'ya-kes-selesai',
  //           else: 'tidak-kes-selesai',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       kodSekolah: 1,
  //       sesiTakwimSekolah: 1,
  //       umur: 1,
  //       keturunan: 1,
  //       warganegara: 1,
  //       statusOku: 1,
  //       statusRawatan: 1,
  //       tahunTingkatan: 1,
  //       kelasPelajar: 1,
  //       jantina: 1,
  //       kesSelesaiPemeriksaan: 1,
  //       kesSelesaiRawatan: 1,
  //     },
  //   },
  // ];

  const dataSekolahPemeriksaan = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $group: {
        ...groupSekolahPemeriksaan,
      },
    },
  ]);
  const dataSekolahRawatan = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $group: {
        ...groupSekolahRawatan,
      },
    },
  ]);
  const dataSekolahPemeriksaanOKU = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $match: {
        statusOku: 'OKU',
      },
    },
    {
      $group: {
        ...groupSekolahPemeriksaanOKUBW,
      },
    },
  ]);
  const dataSekolahRawatanOKU = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $match: {
        statusOku: 'OKU',
      },
    },
    {
      $group: {
        ...groupSekolahRawatanOKUBW,
      },
    },
  ]);
  const dataSekolahPemeriksaanBW = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $match: {
        warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
      },
    },
    {
      $group: {
        ...groupSekolahPemeriksaanOKUBW,
      },
    },
  ]);
  const dataSekolahRawatanBW = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $match: {
        warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
      },
    },
    {
      $group: {
        ...groupSekolahRawatanOKUBW,
      },
    },
  ]);

  // for sam
  const kedatanganSekolah = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    ...group_kedatangan_sekolah,
  ]);
  const kedatanganSekolahOKU = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    {
      $match: {
        statusOku: 'OKU',
      },
    },
    {
      $group: {
        _id: null,
        jumlah: { $sum: 1 },
        kedatanganEnggan: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'enggan'],
                  },
                  {
                    $eq: ['$statusRawatan', 'enggan rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganTidakHadir: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'tidak hadir'],
                  },
                  {
                    $eq: ['$statusRawatan', 'tidak hadir rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganBaru: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ifNull: ['$tarikhPemeriksaan', false] },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $ne: ['$operatorPemeriksaan', '$operatorRawatan'],
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
        kedatanganUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ifNull: ['$tarikhRawatan', false],
                  },
                  {
                    $ne: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                  },
                  {
                    $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
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
  const kedatanganSekolahBW = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    {
      $match: {
        warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
      },
    },
    {
      $group: {
        _id: null,
        jumlah: { $sum: 1 },
        kedatanganEnggan: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'enggan'],
                  },
                  {
                    $eq: ['$statusRawatan', 'enggan rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganTidakHadir: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$statusRawatan', 'tidak hadir'],
                  },
                  {
                    $eq: ['$statusRawatan', 'tidak hadir rawatan'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganBaru: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ifNull: ['$tarikhPemeriksaan', false] },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                      },
                      {
                        $ne: ['$operatorPemeriksaan', '$operatorRawatan'],
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
        kedatanganUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ifNull: ['$tarikhRawatan', false],
                  },
                  {
                    $ne: ['$tarikhPemeriksaan', '$tarikhRawatan'],
                  },
                  {
                    $eq: ['$operatorPemeriksaan', '$operatorRawatan'],
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

  // for aragorn
  // const kesSelesaiBiasa = await Fasiliti.aggregate([
  //   ...pipeline_kesSelesai_sekolah,
  //   {
  //     $group: {
  //       ...groupKesSelesaiSekolah,
  //     },
  //   },
  // ]);
  // const kesSelesaiOKU = await Fasiliti.aggregate([
  //   ...pipeline_kesSelesai_sekolah,
  //   {
  //     $match: {
  //       statusOku: 'OKU',
  //     },
  //   },
  //   {
  //     $group: {
  //       ...groupKesSelesaiSekolahOKUBW,
  //     },
  //   },
  // ]);
  // const kesSelesaiBW = await Fasiliti.aggregate([
  //   ...pipeline_kesSelesai_sekolah,
  //   {
  //     $match: {
  //       warganegara: { $nin: ['WARGANEGARA', 'MALAYSIA'] },
  //     },
  //   },
  //   {
  //     $group: {
  //       ...groupKesSelesaiSekolahOKUBW,
  //     },
  //   },
  // ]);

  // BPE BUAT HAL

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
  const match_bukanWarganegara = {
    $match: {
      kumpulanEtnik: { $eq: 'bukan warganegara' },
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
    match_bukanWarganegara
  );

  const switch_bpe = [
    {
      $match: {
        ...getParamsBPE(payload),
      },
    },
    {
      $sort: {
        skorBpeOralHygienePemeriksaanUmum: -1,
      },
    },
    {
      $group: {
        _id: '$nama',
        firstDocument: { $first: '$$ROOT' },
      },
    },
    {
      $match: {
        'firstDocument.skorBpeOralHygienePemeriksaanUmum': { $ne: 'tiada' },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$firstDocument',
      },
    },
  ];

  const group_bpe = {
    $group: {
      _id: placeModifier(payload),
      skorBPEZero: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] },
                {
                  $eq: [
                    '$yaTidakPesakitMempunyaiGigi',
                    'ya-pesakit-mempunyai-gigi',
                  ],
                },
                {
                  $ne: ['$skorBpeOralHygienePemeriksaanUmum', 'tiada'],
                },
                {
                  $ne: ['$skorBpeOralHygienePemeriksaanUmum', ''],
                },
                {
                  $ne: ['$skorBpeOralHygienePemeriksaanUmum', null],
                },
                { $ne: ['$engganBpeImplan', true] },
              ],
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
                { $ne: ['$skorBpeOralHygienePemeriksaanUmum', '0'] },
                {
                  $eq: [
                    '$yaTidakPesakitMempunyaiGigi',
                    'ya-pesakit-mempunyai-gigi',
                  ],
                },
                { $ne: ['$skorBpeOralHygienePemeriksaanUmum', 'tiada'] },
                {
                  $ne: ['$skorBpeOralHygienePemeriksaanUmum', ''],
                },
                {
                  $ne: ['$skorBpeOralHygienePemeriksaanUmum', null],
                },
                { $ne: ['$engganBpeImplan', true] },
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
    let skorBpe = [];
    let bigData = [];

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline_pemeriksaan = [...switch_bpe, match_stage[i], group_bpe];
      const skorBpe = await Umum.aggregate(pipeline_pemeriksaan);
      skorBpe.push({ skorBpe });
    }

    bigData.push(
      data207,
      data207oplain,
      dataSekolahPemeriksaan,
      dataSekolahRawatan,
      skorBpe,
      // sekolah
      kedatanganSekolah,
      dataSekolahPemeriksaanOKU,
      dataSekolahRawatanOKU,
      dataSekolahPemeriksaanBW,
      dataSekolahRawatanBW,
      kedatanganSekolahOKU,
      kedatanganSekolahBW
      // kesSelesaiBiasa,
      // kesSelesaiOKU,
      // kesSelesaiBW
    );

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countPG214 = async (payload) => {
  const pipeline214 = [
    {
      $match: {
        ...getParams214(payload),
        ...ultimateCutoff(payload),
      },
    },
    {
      $facet: {
        takNormal: [
          {
            $match: {
              umur: { $gte: 59, $lte: 60 },
            },
          },
          {
            $group: {
              _id: '$ic',
              ages: {
                $push: '$umur',
              },
              tarikhKedatangan: {
                $push: '$tarikhKedatangan',
              },
              patientInfoIds: {
                $first: '$_id',
              },
            },
          },
          {
            $match: {
              ages: {
                $all: [59, 60],
              },
            },
          },
          {
            $addFields: {
              tarikhKedatanganAged60: {
                $arrayElemAt: [
                  '$tarikhKedatangan',
                  {
                    $indexOfArray: ['$ages', 60],
                  },
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'umums',
              localField: 'patientInfoIds',
              foreignField: '_id',
              as: 'patientInfo',
              pipeline: [
                {
                  $project: {
                    statusReten: 1,
                    kumpulanEtnik: 1,
                    jantina: 1,
                    bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$patientInfo',
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ['$$ROOT', '$patientInfo'],
              },
            },
          },
          {
            $project: {
              _id: 0,
              statusReten: 1,
              kumpulanEtnik: 1,
              jantina: 1,
              bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum: 1,
            },
          },
          {
            $group: {
              _id: null,
              ...groupPG214,
            },
          },
        ],
        normal: [
          {
            $match: {
              umur: {
                $gte: 60,
              },
              kedatangan: 'baru-kedatangan',
            },
          },
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $and: [
                          {
                            $eq: ['$umur', 60],
                          },
                        ],
                      },
                      then: 'umur60',
                    },
                    {
                      case: {
                        $and: [
                          {
                            $gte: ['$umur', 61],
                          },
                          {
                            $lte: ['$umur', 64],
                          },
                        ],
                      },
                      then: 'umur6164',
                    },
                    {
                      case: {
                        $and: [
                          {
                            $eq: ['$umur', 65],
                          },
                        ],
                      },
                      then: 'umur65',
                    },
                    {
                      case: {
                        $and: [
                          {
                            $gte: ['$umur', 66],
                          },
                          {
                            $lte: ['$umur', 69],
                          },
                        ],
                      },
                      then: 'umur6669',
                    },
                    {
                      case: {
                        $and: [
                          {
                            $gte: ['$umur', 70],
                          },
                          {
                            $lte: ['$umur', 74],
                          },
                        ],
                      },
                      then: 'umur7074',
                    },
                    {
                      case: {
                        $and: [
                          {
                            $gte: ['$umur', 75],
                          },
                        ],
                      },
                      then: 'umur75',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...groupPG214,
            },
          },
        ],
      },
    },
  ];

  const PG214 = await Umum.aggregate(pipeline214);

  return PG214;
};
const countPGPR201 = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsPgpr201(payload),
      ...ultimateCutoff(payload),
    },
  };

  const facet_stage = {
    $facet: {
      biasa: [
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
            default: 'Other',
            output: {
              ...outputReqPgpr201,
            },
          },
        },
      ],
      ibuMengandung: [
        {
          $match: {
            ibuMengandung: true,
          },
        },
        {
          $group: {
            _id: null,
            ...outputReqPgpr201,
          },
        },
      ],
      orangKurangUpaya: [
        {
          $match: {
            orangKurangUpaya: true,
          },
        },
        {
          $group: {
            _id: null,
            ...outputReqPgpr201,
          },
        },
      ],
      opLain: [
        ...getParamsOplainP2,
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
            default: 'Other',
            output: {
              ...outputReqPgpr201,
            },
          },
        },
      ],
    },
  };

  try {
    const pipeline = [main_switch, facet_stage];
    const PGPR201 = await Umum.aggregate(pipeline);

    return PGPR201;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPGPR201CustomIM = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsPgpr201(payload),
      ...ultimateCutoff(payload),
      ibuMengandung: true,
      bookingIM: 'ya-booking-im',
    },
  };

  const facet_stage = {
    $facet: {
      biasa: [
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
            default: 'Other',
            output: {
              ...outputReqPgpr201,
            },
          },
        },
      ],
      ibuMengandung: [
        {
          $match: {
            ibuMengandung: true,
          },
        },
        {
          $group: {
            _id: null,
            ...outputReqPgpr201,
          },
        },
      ],
      orangKurangUpaya: [
        {
          $match: {
            orangKurangUpaya: true,
          },
        },
        {
          $group: {
            _id: null,
            ...outputReqPgpr201,
          },
        },
      ],
      opLain: [
        ...getParamsOplainP2,
        {
          $bucket: {
            groupBy: '$umur',
            boundaries: [7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
            default: 'Other',
            output: {
              ...outputReqPgpr201,
            },
          },
        },
      ],
    },
  };

  try {
    const pipeline = [main_switch, facet_stage];
    const PGPR201CUSTOMIM = await Umum.aggregate(pipeline);

    return PGPR201CUSTOMIM;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// Reten Sekolah
const countPGS201 = async (payload) => {
  let match_stage = [];
  //
  const pra_tad_Lima_Tahun = [
    {
      $match: {
        ...getParamsPGS201(payload),
        ...ultimateCutoff(payload),
        $expr: {
          $and: [
            {
              $eq: [
                {
                  $subtract: [
                    {
                      $year: new Date(),
                    },
                    {
                      $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                    },
                  ],
                },
                5,
              ],
            },
          ],
        },
        jenisFasiliti: { $eq: 'taska-tadika' },
        orangKurangUpaya: false,
      },
    },
  ];
  const pra_Enam_tahun = [
    {
      $match: {
        ...getParamsPGS201(payload),
        ...ultimateCutoff(payload),
        $expr: {
          $and: [
            {
              $eq: [
                {
                  $subtract: [
                    {
                      $year: new Date(),
                    },
                    {
                      $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                    },
                  ],
                },
                6,
              ],
            },
          ],
        },
        jenisFasiliti: { $eq: 'taska-tadika' },
        orangKurangUpaya: false,
      },
    },
  ];
  const pra_tad_OKU = [
    {
      $match: {
        ...ultimateCutoff(payload),
        ...getParamsPGS201(payload),
        $expr: {
          $and: [
            {
              $gte: [
                {
                  $subtract: [
                    {
                      $year: new Date(),
                    },
                    {
                      $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                    },
                  ],
                },
                5,
              ],
            },
            {
              $lte: [
                {
                  $subtract: [
                    {
                      $year: new Date(),
                    },
                    {
                      $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                    },
                  ],
                },
                6,
              ],
            },
          ],
        },
        jenisFasiliti: { $eq: 'taska-tadika' },
        orangKurangUpaya: true,
      },
    },
  ];
  const pra_tad_OA_penan = [
    {
      $match: {
        ...ultimateCutoff(payload),
        ...getParamsPGS201(payload),
        $expr: {
          $and: [
            {
              $gte: [
                {
                  $subtract: [
                    {
                      $year: new Date(),
                    },
                    {
                      $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                    },
                  ],
                },
                5,
              ],
            },
            {
              $lte: [
                {
                  $subtract: [
                    {
                      $year: new Date(),
                    },
                    {
                      $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                    },
                  ],
                },
                6,
              ],
            },
          ],
        },
        jenisFasiliti: { $eq: 'taska-tadika' },
        kumpulanEtnik: { $in: ['penan', 'orang asli semenanjung'] },
      },
    },
  ];

  match_stage.push(
    pra_tad_Lima_Tahun,
    pra_Enam_tahun,
    pra_tad_OKU,
    pra_tad_OA_penan
  );
  //
  const group_stage = [
    {
      $group: {
        _id: placeModifier(payload),
        jumlahReten: { $sum: 1 },
        jumlahRetenSalah: {
          $sum: {
            $cond: [{ $eq: ['$statusReten', 'reten salah'] }, 1, 0],
          },
        },
        engganKedatangan: {
          $sum: {
            $cond: [{ $eq: ['$engganTaskaTadika', true] }, 1, 0],
          },
        },
        tidakHadirKehadiran: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ['$tidakHadirTaskaTadika', true],
                  },
                  { $eq: ['$statusKehadiran', true] },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganTahunSemasaBaru: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$kedatangan', 'baru-kedatangan'] },
                  { $eq: ['$statusKehadiran', false] },
                ],
              },
              1,
              0,
            ],
          },
        },
        kedatanganTahunSemasaUlangan: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$kedatangan', 'ulangan-kedatangan'] },
                  { $eq: ['$statusKehadiran', false] },
                ],
              },
              1,
              0,
            ],
          },
        },
        skorPlakA: {
          $sum: {
            $cond: [
              {
                $eq: ['$kebersihanMulutOralHygienePemeriksaanUmum', 'A'],
              },
              1,
              0,
            ],
          },
        },
        skorPlakC: {
          $sum: {
            $cond: [
              {
                $eq: ['$kebersihanMulutOralHygienePemeriksaanUmum', 'C'],
              },
              1,
              0,
            ],
          },
        },
        skorPlakE: {
          $sum: {
            $cond: [
              {
                $eq: ['$kebersihanMulutOralHygienePemeriksaanUmum', 'E'],
              },
              1,
              0,
            ],
          },
        },
        jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
        jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
        jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
        jumlahE: { $sum: '$eAdaGigiKekalPemeriksaanUmum' },
        jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
        jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
        jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
        jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
        dfxSamaKosong: {
          //dfx=0
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                ],
              },
              1,
              0,
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
                      { $gte: ['$umur', 6] },
                      { $lte: ['$umur', 18] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    ],
                  },
                  {
                    $and: [
                      { $lte: ['$umur', 6] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                    ],
                  },
                  {
                    $and: [
                      { $lte: ['$umur', 6] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
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
                $and: [
                  { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        gigiKekalDMFXsamaAtauKurangDari3: {
          $sum: {
            $cond: [
              {
                $lte: [
                  {
                    $add: [
                      '$dAdaGigiKekalPemeriksaanUmum',
                      '$mAdaGigiKekalPemeriksaanUmum',
                      '$fAdaGigiKekalPemeriksaanUmum',
                      '$xAdaGigiKekalPemeriksaanUmum',
                    ],
                  },
                  3,
                ],
              },
              1,
              0,
            ],
          },
        },
        xTambahMsamaKosong: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        eLebihAtauSamaDenganSatu: {
          $sum: {
            $cond: [{ $gt: ['$eAdaGigiKekalPemeriksaanUmum', 0] }, 1, 0],
          },
        },
        bebasKariesTetapiElebihAtauSamaDenganSatu: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  { $gt: ['$eAdaGigiKekalPemeriksaanUmum', 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        skorGIS0: {
          $sum: {
            $cond: [
              {
                $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
              },
              1,
              0,
            ],
          },
        },
        skorGIS1: {
          $sum: {
            $cond: [
              {
                $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '1'],
              },
              1,
              0,
            ],
          },
        },
        skorGIS2: {
          $sum: {
            $cond: [
              {
                $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
              },
              1,
              0,
            ],
          },
        },
        skorGIS3: {
          $sum: {
            $cond: [
              {
                $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '3'],
              },
              1,
              0,
            ],
          },
        },
        skorBPE0: {
          $sum: {
            $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
          },
        },
        skorBPE1: {
          $sum: {
            $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '1'] }, 1, 0],
          },
        },
        skorBPE2: {
          $sum: {
            $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'] }, 1, 0],
          },
        },
        skorBPE3: {
          $sum: {
            $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '3'] }, 1, 0],
          },
        },
        skorBPE4: {
          $sum: {
            $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '4'] }, 1, 0],
          },
        },
        jumlahTPRmmi: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
                  { $eq: ['$eAdaGigiKekalPemeriksaanUmum', 0] },
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
              1,
              0,
            ],
          },
        },
        jumlahTPRbiasa: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
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
              1,
              0,
            ],
          },
        },
        jumlahKecederaanTulangMuka: {
          $sum: {
            $cond: [{ $eq: ['$kecederaanTulangMukaUmum', true] }, 1, 0],
          },
        },
        jumlahKecederaanGigi: {
          $sum: {
            $cond: [{ $eq: ['$kecederaanGigiUmum', true] }, 1, 0],
          },
        },
        jumlahKecederaanTisuLembut: {
          $sum: {
            $cond: [{ $eq: ['$kecederaanTisuLembutUmum', true] }, 1, 0],
          },
        },
        jumlahPatientAdaTSL: {
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
        jumlahCleftMurid: {
          $sum: {
            $cond: [{ $eq: ['$adaCleftLipPemeriksaanUmum', true] }, 1, 0],
          },
        },
        jumlahCleftDirujuk: {
          $sum: {
            $cond: [{ $eq: ['$rujukCleftLipPemeriksaanUmum', true] }, 1, 0],
          },
        },
        //rawatan perlu dibuat
        perluSapuanFluoridaBilMurid: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$baruJumlahMuridPerluFv', true],
                  },
                  {
                    $gt: ['$semulaJumlahMuridPerluFv', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        perluPrrJenis1BilMurid: {
          $sum: {
            $cond: [
              {
                $eq: ['$baruJumlahMuridPerluPrrJenis1', true],
              },
              1,
              0,
            ],
          },
        },
        perluPrrJenis1BilGigi: {
          $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
        },
        perluFissureSealantBilMurid: {
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
        perluFissureSealantBilGigi: {
          $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum',
        },
        jumlahGigiPerluTampalanAntGdBaru: {
          $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanAntGdSemula: {
          $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanAntGkBaru: {
          $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanAntGkSemula: {
          $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostGdBaru: {
          $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostGdSemula: {
          $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostGkBaru: {
          $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostGkSemula: {
          $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostAmgGdBaru: {
          $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostAmgGdSemula: {
          $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostAmgGkBaru: {
          $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiPerluTampalanPostAmgGkSemula: {
          $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        //jenis rawatan diberi
        telahSapuanFluoridaBilMurid: {
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
        telahPrrJenis1BilMurid: {
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
        telahPrrJenis1BilGigi: {
          $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
        },
        telahFissureSealantBilMurid: {
          $sum: {
            $cond: [
              {
                $gte: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 1],
              },
              1,
              0,
            ],
          },
        },
        telahFissureSealantBilGigi: {
          $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanAntGdBaru: {
          $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanAntGdSemula: {
          $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanAntGkBaru: {
          $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanAntGkSemula: {
          $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostGdBaru: {
          $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostGdSemula: {
          $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostGkBaru: {
          $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostGkSemula: {
          $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostAmgGdBaru: {
          $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostAmgGdSemula: {
          $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostAmgGkBaru: {
          $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanPostAmgGkSemula: {
          $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
        jumlahGigiTelahDibuatTampalanSementara: {
          $sum: '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
        },
        cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
        cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
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
        jumlahKesSelesaiMMI: {
          $sum: {
            $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
          },
        },
        jumlahKesSelesaiBiasa: {
          $sum: {
            $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
          },
        },
        jumlahFasilitiDilawati: {
          $addToSet: '$kodFasilitiTaskaTadika',
        },
      },
    },
  ];

  // bismillah
  try {
    let bigData = [];

    if (
      payload.pilihanTadika ||
      (!payload.pilihanTadika && !payload.pilihanSekolah)
    ) {
      for (const stage of match_stage) {
        const dataPG201 = await Umum.aggregate([...stage, ...group_stage]);
        bigData.push(dataPG201);
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
      }).select(
        'jenisFasiliti enrolmen5Tahun enrolmen6Tahun statusPerkhidmatan'
      );

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
    }

    if (!payload.pilihanTadika && payload.pilihanSekolah) {
      bigData.push([], [], [], []);
    }

    if (
      payload.pilihanSekolah ||
      (!payload.pilihanTadika && !payload.pilihanSekolah)
    ) {
      // sekolah
      // // one ring to rule them all
      const dataSekolahPemeriksaan = await Fasiliti.aggregate([
        ...pipelineSekolahPemeriksaan(payload, 'pgs201'),
        {
          $facet: {
            dataBiasa: [
              {
                $group: {
                  ...id201Biasa,
                  ...groupSekolah,
                },
              },
            ],
            dataKhasKham: [
              {
                $group: {
                  ...id201KhasKham,
                  ...groupSekolah,
                },
              },
            ],
            dataOAP: [
              {
                $group: {
                  ...id201OAP,
                  ...groupSekolah,
                },
              },
            ],
            dataAllOAP: [
              {
                $group: {
                  ...id201AllOAP,
                  ...groupSekolah,
                },
              },
            ],
            dataAllOKU: [
              {
                $group: {
                  ...id201AllOKU,
                  ...groupSekolah,
                },
              },
            ],
          },
        },
      ]);

      const dataSekolahRawatan = await Fasiliti.aggregate([
        ...pipelineSekolahRawatan(payload, 'pgs201'),
        {
          $facet: {
            dataBiasa: [
              {
                $group: {
                  ...id201Biasa,
                  ...groupSekolah,
                },
              },
            ],
            dataKhasKham: [
              {
                $group: {
                  ...id201KhasKham,
                  ...groupSekolah,
                },
              },
            ],
            dataOAP: [
              {
                $group: {
                  ...id201OAP,
                  ...groupSekolah,
                },
              },
            ],
            dataAllOAP: [
              {
                $group: {
                  ...id201AllOAP,
                  ...groupSekolah,
                },
              },
            ],
            dataAllOKU: [
              {
                $group: {
                  ...id201AllOKU,
                  ...groupSekolah,
                },
              },
            ],
          },
        },
      ]);

      const enrolmenSekolah = await Fasiliti.aggregate([
        ...pipelineEnrolmenSekolah(payload, 'pgs201'),
        {
          $facet: {
            enrolmenKelas: [
              {
                $group: {
                  ...id201Biasa,
                  jumlah: {
                    $sum: 1,
                  },
                },
              },
            ],
            enrolmenKhasKham: [
              {
                $group: {
                  ...id201KhasKham,
                  jumlah: {
                    $sum: 1,
                  },
                },
              },
            ],
            enrolmenOAP: [
              {
                $group: {
                  ...id201OAP,
                  jumlah: {
                    $sum: 1,
                  },
                },
              },
            ],
            enrolmenAllOAP: [
              {
                $group: {
                  ...id201AllOAP,
                  jumlah: {
                    $sum: 1,
                  },
                },
              },
            ],
            enrolmenAllOKU: [
              {
                $group: {
                  ...id201AllOKU,
                  jumlah: {
                    $sum: 1,
                  },
                },
              },
            ],
          },
        },
      ]);

      bigData.push(dataSekolahPemeriksaan, enrolmenSekolah, dataSekolahRawatan);
    }

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPGS203 = async (payload) => {
  const group_stage_pemeriksaan = {
    $group: {
      _id: null,
      jumlahReten: { $sum: 1 },
      jumlahRetenSalah: {
        $sum: {
          $cond: [{ $eq: ['$statusReten', 'reten salah'] }, 1, 0],
        },
      },
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kedatangan', 'baru-kedatangan'] },
                { $eq: ['$statusKehadiran', false] },
              ],
            },
            1,
            0,
          ],
        },
      },
      kedatanganTahunSemasaUlangan: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kedatangan', 'ulangan-kedatangan'] },
                { $eq: ['$statusKehadiran', false] },
              ],
            },
            1,
            0,
          ],
        },
      },
      //status gigi desidus
      jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
      jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
      jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
      //status gigi kekal
      jumlahE: { $sum: '$eAdaGigiKekalPemeriksaanUmum' },
      jumlahD: { $sum: '$dAdaGigiKekalPemeriksaanUmum' },
      jumlahM: { $sum: '$mAdaGigiKekalPemeriksaanUmum' },
      jumlahF: { $sum: '$fAdaGigiKekalPemeriksaanUmum' },
      jumlahX: { $sum: '$xAdaGigiKekalPemeriksaanUmum' },
      //status kesihatan mulut murid
      dfxSamaKosong: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
              ],
            },
            1,
            0,
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
      xTambahMsamaKosong: {
        // X+M = 0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$adaKekalPemeriksaanUmum', true] },
                { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      eLebihAtauSamaDenganSatu: {
        $sum: {
          $cond: [{ $gt: ['$eAdaGigiKekalPemeriksaanUmum', 0] }, 1, 0],
        },
      },
      bebasKariesTetapiElebihAtauSamaDenganSatu: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                { $gte: ['$eAdaGigiKekalPemeriksaanUmum', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      skorGIS0: {
        $sum: {
          $cond: [
            {
              $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
            },
            1,
            0,
          ],
        },
      },
      skorGIS1: {
        $sum: {
          $cond: [
            {
              $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '1'],
            },
            1,
            0,
          ],
        },
      },
      skorGIS2: {
        $sum: {
          $cond: [
            {
              $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
            },
            1,
            0,
          ],
        },
      },
      skorGIS3: {
        $sum: {
          $cond: [
            {
              $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '3'],
            },
            1,
            0,
          ],
        },
      },
      skorBPE0: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPE1: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '1'] }, 1, 0],
        },
      },
      skorBPE2: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'] }, 1, 0],
        },
      },
      skorBPE3: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '3'] }, 1, 0],
        },
      },
      skorBPE4: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '4'] }, 1, 0],
        },
      },
      jumlahTPR: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
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
            1,
            0,
          ],
        },
      },
      //rawatan pencegahan perlu dibuat
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
              $gte: ['$BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
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
      jumlahFasilitiDilawati: {
        $addToSet: '$kodFasilitiTaskaTadika',
      },
    },
  };
  const group_stage_rawatan = {
    $group: {
      _id: null,
      //jenis rawatan diberi
      telahSapuanFluorida: {
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
        //Pesaakit Dibaut FS
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
      cabutanGd: { $sum: '$cabutDesidusRawatanUmum' },
      cabutanGk: { $sum: '$cabutKekalRawatanUmum' },
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
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
    },
  };

  // bismillah
  try {
    let bigData = [];

    const dataTad = await Umum.aggregate([
      {
        $match: {
          ...getParamsPGS203(payload),
          ...ultimateCutoff(payload),
          $expr: {
            $and: [
              {
                $lte: [
                  {
                    $subtract: [
                      {
                        $year: new Date(),
                      },
                      {
                        $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                      },
                    ],
                  },
                  6,
                ],
              },
              {
                $gte: [
                  {
                    $subtract: [
                      {
                        $year: new Date(),
                      },
                      {
                        $toInt: { $substr: ['$tarikhLahir', 0, 4] },
                      },
                    ],
                  },
                  5,
                ],
              },
            ],
          },
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
          govKe: '$fasiliti_data.govKe',
          kodTastad: '$fasiliti_data.kodTastad',
          statusPerkhidmatan: '$fasiliti_data.statusPerkhidmatan',
        },
      },
      {
        $project: {
          fasiliti_data: 0,
        },
      },
      {
        $facet: {
          praTadKerajaanPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                govKe: 'Kerajaan',
                kodTastad: { $regex: /tad/i },
                statusPerkhidmatan: 'active',
              },
            },
            group_stage_pemeriksaan,
          ],
          praTadSwastaPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                govKe: 'Swasta',
                kodTastad: { $regex: /tad/i },
                statusPerkhidmatan: 'active',
              },
            },
            group_stage_pemeriksaan,
          ],
          praTadOkuPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                orangKurangUpaya: true,
                kodTastad: { $regex: /tad/i },
              },
            },
            group_stage_pemeriksaan,
          ],
          praTadOAPPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                kumpulanEtnik: { $in: ['penan', 'orang asli semenanjung'] },
                kodTastad: { $regex: /tad/i },
              },
            },
            group_stage_pemeriksaan,
          ],
          praTadKerajaanRawatan: [
            {
              $match: {
                govKe: 'Kerajaan',
                kodTastad: { $regex: /tad/i },
                statusPerkhidmatan: 'active',
              },
            },
            group_stage_rawatan,
          ],
          praTadSwastaRawatan: [
            {
              $match: {
                govKe: 'Swasta',
                kodTastad: { $regex: /tad/i },
                statusPerkhidmatan: 'active',
              },
            },
            group_stage_rawatan,
          ],
          praTadOkuRawatan: [
            {
              $match: {
                orangKurangUpaya: true,
                kodTastad: { $regex: /tad/i },
              },
            },
            group_stage_rawatan,
          ],
          praTadOAPRawatan: [
            {
              $match: {
                kumpulanEtnik: { $in: ['penan', 'orang asli semenanjung'] },
                kodTastad: { $regex: /tad/i },
              },
            },
            group_stage_rawatan,
          ],
        },
      },
    ]);

    const dataFasilitiFull = await Fasiliti.aggregate([
      {
        $match: {
          $and: [
            ...(payload.negeri !== 'all'
              ? [{ createdByNegeri: payload.negeri }]
              : []),
            ...(payload.daerah !== 'all'
              ? [{ createdByDaerah: payload.daerah }]
              : []),
            ...(payload.klinik !== 'all'
              ? [{ kodFasilitiHandler: payload.klinik }]
              : []),
            { jenisFasiliti: { $in: ['tadika'] } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          jumlahTastadKerajaan: {
            $sum: {
              $cond: [
                {
                  $eq: ['$govKe', 'Kerajaan'],
                },
                1,
                0,
              ],
            },
          },
          enrolmenTastadKerajaan: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$govKe', 'Kerajaan'] },
                    { $ne: ['$enrolmenTastad', 'NOT APPLICABLE'] },
                    { $ne: ['$enrolmenTastad', ''] },
                    { $ne: ['$enrolmenTastad', null] },
                  ],
                },
                { $toInt: '$enrolmenTastad' },
                0,
              ],
            },
          },
          jumlahTastadSwasta: {
            $sum: {
              $cond: [
                {
                  $eq: ['$govKe', 'Swasta'],
                },
                1,
                0,
              ],
            },
          },
          enrolmenTastadSwasta: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$govKe', 'Swasta'] },
                    { $ne: ['$enrolmenTastad', 'NOT APPLICABLE'] },
                    { $ne: ['$enrolmenTastad', ''] },
                    { $ne: ['$enrolmenTastad', null] },
                  ],
                },
                { $toInt: '$enrolmenTastad' },
                0,
              ],
            },
          },
        },
      },
    ]);

    const allFasilitiDilawati = [];

    if (dataTad[0] && dataTad[0].praTadKerajaanPemeriksaan[0] !== undefined) {
      for (const kodTastad of dataTad[0].praTadKerajaanPemeriksaan[0]
        .jumlahFasilitiDilawati) {
        try {
          const dataFasiliti = await Fasiliti.find({ kodTastad }).select(
            'jenisFasiliti govKe enrolmenTastad statusPerkhidmatan'
          );
          allFasilitiDilawati.push(dataFasiliti[0]);
        } catch (error) {
          console.error(error);
        }
      }
    }

    if (dataTad[0] && dataTad[0].praTadSwastaPemeriksaan[0] !== undefined) {
      for (const kodTastad of dataTad[0].praTadSwastaPemeriksaan[0]
        .jumlahFasilitiDilawati) {
        try {
          const dataFasiliti = await Fasiliti.find({ kodTastad }).select(
            'jenisFasiliti govKe enrolmenTastad statusPerkhidmatan'
          );
          allFasilitiDilawati.push(dataFasiliti[0]);
        } catch (error) {
          console.error(error);
        }
      }
    }

    const totalEnrolmentTastadPra = allFasilitiDilawati.reduce(
      (
        totals,
        { jenisFasiliti, govKe, enrolmenTastad, statusPerkhidmatan }
      ) => {
        if (
          jenisFasiliti === 'tadika' &&
          statusPerkhidmatan === 'active' &&
          (govKe === 'Kerajaan' || govKe === 'Swasta')
        ) {
          const kategori = govKe || 'tiadaStatus';
          if (enrolmenTastad !== 'NOT APPLICABLE') {
            const enrolment = parseInt(enrolmenTastad) || 0;
            totals[kategori] = (totals[kategori] || 0) + enrolment;
          }
        }
        return totals;
      },
      {}
    );

    // // one ring to rule them all
    // sekolah
    const dataSekolahPemeriksaan = await Fasiliti.aggregate([
      ...pipelineSekolahPemeriksaan(payload, 'pgs203'),
      {
        $facet: {
          dataKPSKPB: [
            {
              $group: {
                ...id203KPSKPB,
                ...groupSekolah,
              },
            },
          ],
          dataKKI: [
            {
              $group: {
                ...id203KKI,
                ...groupSekolah,
              },
            },
          ],
          dataOAP: [
            {
              $group: {
                ...id203OAP,
                ...groupSekolah,
              },
            },
          ],
          dataAllKPSKPB: [
            {
              $group: {
                ...id203AllKPSKPB,
                ...groupSekolah,
              },
            },
          ],
          dataAllOAP: [
            {
              $group: {
                ...id203AllOAP,
                ...groupSekolah,
              },
            },
          ],
        },
      },
    ]);

    const dataSekolahRawatan = await Fasiliti.aggregate([
      ...pipelineSekolahRawatan(payload, 'pgs203'),
      {
        $facet: {
          dataKPSKPB: [
            {
              $group: {
                ...id203KPSKPB,
                ...groupSekolah,
              },
            },
          ],
          dataKKI: [
            {
              $group: {
                ...id203KKI,
                ...groupSekolah,
              },
            },
          ],
          dataOAP: [
            {
              $group: {
                ...id203OAP,
                ...groupSekolah,
              },
            },
          ],
          dataAllKPSKPB: [
            {
              $group: {
                ...id203AllKPSKPB,
                ...groupSekolah,
              },
            },
          ],
          dataAllOAP: [
            {
              $group: {
                ...id203AllOAP,
                ...groupSekolah,
              },
            },
          ],
        },
      },
    ]);

    // enrolmen
    const enrolmenSekolah = await Fasiliti.aggregate([
      ...pipelineEnrolmenSekolah(payload),
      {
        $facet: {
          enrolmenKPSKPB: [
            {
              $group: {
                ...id203KPSKPB,
                jumlah: {
                  $sum: 1,
                },
              },
            },
          ],
          enrolmenKKI: [
            {
              $group: {
                ...id203KKI,
                jumlah: {
                  $sum: 1,
                },
              },
            },
          ],
          enrolmenOAP: [
            {
              $group: {
                ...id203OAP,
                jumlah: {
                  $sum: 1,
                },
              },
            },
          ],
          enrolmenAllKPSKPB: [
            {
              $group: {
                ...id203AllKPSKPB,
                jumlah: {
                  $sum: 1,
                },
              },
            },
          ],
          enrolmenAllOAP: [
            {
              $group: {
                ...id203AllOAP,
                jumlah: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ]);

    // data tutup sekolah
    const tutupSekolah = await Fasiliti.aggregate([
      ...pipelineTutupSekolah(payload),
    ]);

    bigData.push(
      dataTad,
      [],
      dataSekolahPemeriksaan,
      enrolmenSekolah,
      tutupSekolah,
      dataSekolahRawatan,
      dataFasilitiFull,
      [totalEnrolmentTastadPra]
    );

    return bigData;
  } catch (error) {
    console.log(error);
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countFS = async (payload) => {
  try {
    const dataFS = await Fasiliti.aggregate([
      ...pipelineSekolahPemeriksaan(payload),
      {
        $group: {
          _id: null,
          // jumlah: { $sum: 1 },
          // jumlahRetenSalah: {
          //   $sum: {
          //     $cond: [
          //       {
          //         $eq: ['$statusReten', 'reten salah'],
          //       },
          //       1,
          //       0,
          //     ],
          //   },
          // },
          bilGigiFs3TahunLps: {
            $sum: {
              $add: [
                '$merged.gicBilanganFsDibuat3TahunLepas',
                '$merged.resinBilanganFsDibuat3TahunLepas',
                '$merged.lainLainBilanganFsDibuat3TahunLepas',
              ],
            },
          },
          bilGigiFs3TahunLpsJdDMFX: {
            $sum: {
              $add: [
                '$merged.dBilanganFsDibuat3TahunLepasTerjadi',
                '$merged.mBilanganFsDibuat3TahunLepasTerjadi',
                '$merged.fBilanganFsDibuat3TahunLepasTerjadi',
                '$merged.xBilanganFsDibuat3TahunLepasTerjadi',
              ],
            },
          },
        },
      },
      {
        $project: {
          bilGigiFs3TakJadiDMFX: {
            $subtract: ['$bilGigiFs3TahunLps', '$bilGigiFs3TahunLpsJdDMFX'],
          },
          bilGigiFs3TahunLps: 1,
        },
      },
    ]);

    return dataFS;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// Reten Promosi
const countPGPro01 = async (payload) => {
  const match_stage = {
    $match: {
      ...getParamsPgPro(payload),
      ...ultimateCutoffPromosiEdition(payload),
    },
  };

  const group_stage = {
    $group: {
      _id: '$kodProgram',
      jumlahAktivitiCeramahBaru: {
        $sum: '$bilanganAktivitiBaruCeramahBahagianA',
      },
      jumlahPesertaCeramahBaru: {
        $sum: '$bilanganPesertaBaruCeramahBahagianA',
      },
      jumlahAktivitiCeramahUlangan: {
        $sum: '$bilanganAktivitiUlangCeramahBahagianA',
      },
      jumlahPesertaCeramahUlangan: {
        $sum: '$bilanganPesertaUlangCeramahBahagianA',
      },
      jumlahAktivitiBaruLMG: {
        $sum: '$bilanganAktivitiBaruLatihanMemberusGigiBahagianA',
      },
      jumlahPesertaBaruLMG: {
        $sum: '$bilanganPesertaBaruLatihanMemberusGigiBahagianA',
      },
      jumlahAktivitiUlanganLMG: {
        $sum: '$bilanganAktivitiUlangLatihanMemberusGigiBahagianA',
      },
      jumlahPesertaUlanganLMG: {
        $sum: '$bilanganPesertaUlangLatihanMemberusGigiBahagianA',
      },
      jumlahAktivitiPerananKempen: {
        $sum: '$bilanganAktivitiPameranKempenBahagianB',
      },
      jumlahPesertaPerananKempen: {
        $sum: '$bilanganPesertaPameranKempenBahagianB',
      },
      jumlahAktivitiBoneka: {
        $sum: '$bilanganAktivitiPertunjukanBonekaBahagianB',
      },
      jumlahPesertaBoneka: {
        $sum: '$bilanganPesertaPertunjukanBonekaBahagianB',
      },
      jumlahAktivitiPeranan: {
        $sum: '$bilanganAktivitiMainPerananBahagianB',
      },
      jumlahPesertaPeranan: {
        $sum: '$bilanganPesertaMainPerananBahagianB',
      },
      jumlahAktivitiBercerita: {
        $sum: '$bilanganAktivitiBerceritaBahagianB',
      },
      jumlahPesertaBercerita: {
        $sum: '$bilanganPesertaBerceritaBahagianB',
      },
      jumlahAktivitiPertandingan: {
        $sum: '$bilanganAktivitiPertandinganBahagianB',
      },
      jumlahPesertaPertandingan: {
        $sum: '$bilanganPesertaPertandinganBahagianB',
      },
      jumlahAktivitiInteraktif: {
        $sum: '$bilanganAktivitiPermainanInteraktifBahagianB',
      },
      jumlahPesertaInteraktif: {
        $sum: '$bilanganPesertaPermainanInteraktifBahagianB',
      },
      jumlahAktivitiKursusSeminarBengkel: {
        $sum: '$bilanganAktivitiKursusSeminarBengkelBahagianB',
      },
      jumlahPesertaKursusSeminarBengkel: {
        $sum: '$bilanganPesertaKursusSeminarBengkelBahagianB',
      },
      jumlahAktivitiMultimedia: {
        $sum: '$bilanganAktivitiPertunjukanMultimediaBahagianB',
      },
      jumlahPesertaMultimedia: {
        $sum: '$bilanganPesertaPertunjukanMultimediaBahagianB',
      },
      jumlahAktivitiDentalBuskers: {
        $sum: '$bilanganAktivitiDentalBuskerBahagianB',
      },
      jumlahPesertaDentalBuskers: {
        $sum: '$bilanganPesertaDentalBuskerBahagianB',
      },
      jumlahAktivitiFlashMob: {
        $sum: '$bilanganAktivitiFlashmobBahagianB',
      },
      jumlahPesertaFlashMob: {
        $sum: '$bilanganPesertaFlashmobBahagianB',
      },
      jumlahAktivitiLawatanRumah: {
        $sum: '$bilanganAktivitiLawatanKeRumahBahagianB',
      },
      jumlahPesertaLawatanRumah: {
        $sum: '$bilanganPesertaLawatanKeRumahBahagianB',
      },
      jumlahAktivitiPlaqueOHE: {
        $sum: '$bilanganAktivitiPlakGigiBahagianB',
      },
      jumlahPesertaPlaqueOHE: {
        $sum: '$bilanganPesertaPlakGigiBahagianB',
      },
      jumlahAktivitiOHI: {
        $sum: '$bilanganAktivitiPenjagaanKesihatanMulutBahagianB',
      },
      jumlahPesertaOHI: {
        $sum: '$bilanganPesertaPenjagaanKesihatanMulutBahagianB',
      },
      jumlahAktivitiDietAdvice: {
        $sum: '$bilanganAktivitiDietPemakananBahagianB',
      },
      jumlahPesertaDietAdvice: {
        $sum: '$bilanganPesertaDietPemakananBahagianB',
      },
      jumlahAktivitiKanserMulutOHE: {
        $sum: '$bilanganAktivitiKanserMulutBahagianB',
      },
      jumlahPesertaKanserMulutOHE: {
        $sum: '$bilanganPesertaKanserMulutBahagianB',
      },
      jumlahAKtivitiHentiRokok: {
        $sum: '$bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiRokok: {
        $sum: '$bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiHentiSirih: {
        $sum: '$bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiSirih: {
        $sum: '$bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiHentiAlkohol: {
        $sum: '$bilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiAlkohol: {
        $sum: '$bilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiHentiTabiatLain: {
        $sum: '$bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiTabiatLain: {
        $sum: '$bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiTelevisyen: {
        $sum: '$bilanganAktivitiTelevisyen',
      },
      jumlahPesertaTelevisyen: { $sum: '$bilanganPesertaTelevisyen' },
      jumlahAktivitiRadio: { $sum: '$bilanganAktivitiRadio' },
      jumlahPesertaRadio: { $sum: '$bilanganPesertaRadio' },
      jumlahAktivitiCetak: { $sum: '$bilanganAktivitiCetak' },
    },
  };

  try {
    const pipeline = [match_stage, group_stage];
    const PGPro01 = await Promosi.aggregate(pipeline);
    return PGPro01;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPGPro02 = async (payload) => {
  // match stage
  let match_stage = [];

  const allData = {
    $match: {
      belongsTo: getParamsPgPro02(payload),
    },
  };

  match_stage.push(allData);
  //
  const project_stage = {
    $project: {
      // go live
      jumlahFBGoLivePenonton: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.facebook.Facebook_live_bilPenonton',
          },
        },
      },
      jumlahFBGoLiveShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.facebook.Facebook_live_bilShare',
          },
        },
      },
      jumlahIGGoLivePenonton: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.instagram.Instagram_live_bilPenonton',
          },
        },
      },
      jumlahIGGoLiveShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.instagram.Instagram_live_bilShare',
          },
        },
      },
      jumlahYTGoLivePenonton: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.youtube.Youtube_live_bilPenonton',
          },
        },
      },
      jumlahYTGoLiveShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.youtube.Youtube_live_bilShare',
          },
        },
      },
      // poster infografik
      jumlahFBPosterReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.facebook.Facebook_poster_bilReach',
          },
        },
      },
      jumlahFBPosterShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.facebook.Facebook_poster_bilShare',
          },
        },
      },
      jumlahIGPosterReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.instagram.Instagram_poster_bilReach',
          },
        },
      },
      jumlahIGPosterShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.instagram.Instagram_poster_bilShare',
          },
        },
      },
      jumlahTWPosterReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.twitter.Twitter_poster_bilReach',
          },
        },
      },
      jumlahTWPosterShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.twitter.Twitter_poster_bilShare',
          },
        },
      },
      // video
      jumlahFBVideoReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.facebook.Facebook_video_bilReach',
          },
        },
      },
      jumlahFBVideoShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.facebook.Facebook_video_bilShare',
          },
        },
      },
      jumlahIGVideoReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.instagram.Instagram_video_bilReach',
          },
        },
      },
      jumlahIGVideoShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.instagram.Instagram_video_bilShare',
          },
        },
      },
      jumlahTWVideoReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.twitter.Twitter_video_bilReach',
          },
        },
      },
      jumlahTWVideoShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.twitter.Twitter_video_bilShare',
          },
        },
      },
      jumlahYTVideoReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.youtube.Youtube_video_bilReach',
          },
        },
      },
      jumlahYTVideoShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.youtube.Youtube_video_bilShare',
          },
        },
      },
      jumlahTTVideoReach: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.tiktok.Tiktok_video_bilReach',
          },
        },
      },
      jumlahTTVideoShare: {
        $sum: {
          $map: {
            input: '$data',
            as: 'activity',
            in: '$$activity.tiktok.Tiktok_video_bilShare',
          },
        },
      },
    },
  };
  // bismillah
  let bigData = await MediaSosial.aggregate([...match_stage, group_stage]);
  return bigData;
};
const countPGPro01Combined = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsPgPro(payload),
      ...ultimateCutoffPromosiEdition(payload),
    },
  };

  let match_stage = [];
  //
  const kodePRO1k = {
    $match: {
      kodProgram: {
        $in: [
          'PRO1001',
          'PRO1002',
          'PRO1003',
          'PRO1004',
          'PRO1005',
          'PRO1006',
          'PRO1007',
          'PRO1008',
          'PRO1009',
          'PRO1010',
          'PRO1011',
          'PRO1012',
          'PRO1013',
          'PRO1014',
          'PRO1015',
          'PRO1016',
          'PRO1017',
          'PRO1018',
          'PRO1019',
          'PRO1020',
          'PRO1021',
          'PRO1022',
        ],
      },
    },
  };
  const kodePRO2k = {
    $match: {
      kodProgram: { $in: ['PRO2001', 'PRO2002', 'PRO2003'] },
    },
  };
  const kodePRO3k = {
    $match: {
      kodProgram: {
        $in: ['PRO3001', 'PRO3002', 'PRO3003', 'PRO3004', 'PRO3005'],
      },
    },
  };
  const kodePRO4k = {
    $match: {
      kodProgram: { $in: ['PRO4001'] },
    },
  };
  const kodePRO5k1 = {
    $match: {
      kodProgram: {
        $in: ['PRO5001'],
      },
    },
  };
  const kodePRO5k2 = {
    $match: {
      kodProgram: {
        $in: ['PRO5002'],
      },
    },
  };
  const kodePRO5k3 = {
    $match: {
      kodProgram: {
        $in: ['PRO5003'],
      },
    },
  };
  const kodePRO5k4 = {
    $match: {
      kodProgram: {
        $in: ['PRO5004'],
      },
    },
  };
  const kodePRO5k5 = {
    $match: {
      kodProgram: {
        $in: ['PRO5005'],
      },
    },
  };
  const kodePRO6k1 = {
    $match: {
      kodProgram: {
        $in: ['PRO6001'],
      },
    },
  };
  const kodePRO6k2 = {
    $match: {
      kodProgram: {
        $in: ['PRO6002'],
      },
    },
  };
  const kodePRO6k3 = {
    $match: {
      kodProgram: {
        $in: ['PRO6003'],
      },
    },
  };
  const kodePRO6k4 = {
    $match: {
      kodProgram: {
        $in: ['PRO6004'],
      },
    },
  };
  const kodePRO6k5 = {
    $match: {
      kodProgram: {
        $in: ['PRO6005'],
      },
    },
  };
  const kodePRO6k6 = {
    $match: {
      kodProgram: {
        $in: ['PRO6006'],
      },
    },
  };
  const kodePRO6k7 = {
    $match: {
      kodProgram: {
        $in: ['PRO6007'],
      },
    },
  };
  const kodePRO7k = {
    $match: {
      kodProgram: { $in: ['PRO7001', 'PRO7002', 'PRO7003'] },
    },
  };
  const kodePRO8k = {
    $match: {
      kodProgram: {
        $in: [
          'PRO8001',
          'PRO8002',
          'PRO8003',
          'PRO8004',
          'PRO8005',
          'PRO8006',
          'PRO8007',
          'PRO8008',
          'PRO8009',
          'PRO8010',
          'PRO8011',
        ],
      },
    },
  };

  match_stage.push(
    kodePRO1k,
    kodePRO2k,
    kodePRO3k,
    kodePRO4k,
    kodePRO5k1,
    kodePRO5k2,
    kodePRO5k3,
    kodePRO5k4,
    kodePRO5k5,
    kodePRO6k1,
    kodePRO6k2,
    kodePRO6k3,
    kodePRO6k4,
    kodePRO6k5,
    kodePRO6k6,
    kodePRO6k7,
    kodePRO7k,
    kodePRO8k
  );

  const group_stage = {
    $group: {
      _id: placeModifier(payload),
      jumlahAktivitiCeramahBaru: {
        $sum: '$bilanganAktivitiBaruCeramahBahagianA',
      },
      jumlahPesertaCeramahBaru: {
        $sum: '$bilanganPesertaBaruCeramahBahagianA',
      },
      jumlahAktivitiCeramahUlangan: {
        $sum: '$bilanganAktivitiUlangCeramahBahagianA',
      },
      jumlahPesertaCeramahUlangan: {
        $sum: '$bilanganPesertaUlangCeramahBahagianA',
      },
      jumlahAktivitiBaruLMG: {
        $sum: '$bilanganAktivitiBaruLatihanMemberusGigiBahagianA',
      },
      jumlahPesertaBaruLMG: {
        $sum: '$bilanganPesertaBaruLatihanMemberusGigiBahagianA',
      },
      jumlahAktivitiUlanganLMG: {
        $sum: '$bilanganAktivitiUlangLatihanMemberusGigiBahagianA',
      },
      jumlahPesertaUlanganLMG: {
        $sum: '$bilanganPesertaUlangLatihanMemberusGigiBahagianA',
      },
      jumlahAktivitiPerananKempen: {
        $sum: '$bilanganAktivitiPameranKempenBahagianB',
      },
      jumlahPesertaPerananKempen: {
        $sum: '$bilanganPesertaPameranKempenBahagianB',
      },
      jumlahAktivitiBoneka: {
        $sum: '$bilanganAktivitiPertunjukanBonekaBahagianB',
      },
      jumlahPesertaBoneka: {
        $sum: '$bilanganPesertaPertunjukanBonekaBahagianB',
      },
      jumlahAktivitiPeranan: {
        $sum: '$bilanganAktivitiMainPerananBahagianB',
      },
      jumlahPesertaPeranan: {
        $sum: '$bilanganPesertaMainPerananBahagianB',
      },
      jumlahAktivitiBercerita: {
        $sum: '$bilanganAktivitiBerceritaBahagianB',
      },
      jumlahPesertaBercerita: {
        $sum: '$bilanganPesertaBerceritaBahagianB',
      },
      jumlahAktivitiPertandingan: {
        $sum: '$bilanganAktivitiPertandinganBahagianB',
      },
      jumlahPesertaPertandingan: {
        $sum: '$bilanganPesertaPertandinganBahagianB',
      },
      jumlahAktivitiInteraktif: {
        $sum: '$bilanganAktivitiPermainanInteraktifBahagianB',
      },
      jumlahPesertaInteraktif: {
        $sum: '$bilanganPesertaPermainanInteraktifBahagianB',
      },
      jumlahAktivitiKursusSeminarBengkel: {
        $sum: '$bilanganAktivitiKursusSeminarBengkelBahagianB',
      },
      jumlahPesertaKursusSeminarBengkel: {
        $sum: '$bilanganPesertaKursusSeminarBengkelBahagianB',
      },
      jumlahAktivitiMultimedia: {
        $sum: '$bilanganAktivitiPertunjukanMultimediaBahagianB',
      },
      jumlahPesertaMultimedia: {
        $sum: '$bilanganPesertaPertunjukanMultimediaBahagianB',
      },
      jumlahAktivitiDentalBuskers: {
        $sum: '$bilanganAktivitiDentalBuskerBahagianB',
      },
      jumlahPesertaDentalBuskers: {
        $sum: '$bilanganPesertaDentalBuskerBahagianB',
      },
      jumlahAktivitiFlashMob: {
        $sum: '$bilanganAktivitiFlashmobBahagianB',
      },
      jumlahPesertaFlashMob: {
        $sum: '$bilanganPesertaFlashmobBahagianB',
      },
      jumlahAktivitiLawatanRumah: {
        $sum: '$bilanganAktivitiLawatanKeRumahBahagianB',
      },
      jumlahPesertaLawatanRumah: {
        $sum: '$bilanganPesertaLawatanKeRumahBahagianB',
      },
      jumlahAktivitiPlaqueOHE: {
        $sum: '$bilanganAktivitiPlakGigiBahagianB',
      },
      jumlahPesertaPlaqueOHE: {
        $sum: '$bilanganPesertaPlakGigiBahagianB',
      },
      jumlahAktivitiOHI: {
        $sum: '$bilanganAktivitiPenjagaanKesihatanMulutBahagianB',
      },
      jumlahPesertaOHI: {
        $sum: '$bilanganPesertaPenjagaanKesihatanMulutBahagianB',
      },
      jumlahAktivitiDietAdvice: {
        $sum: '$bilanganAktivitiDietPemakananBahagianB',
      },
      jumlahPesertaDietAdvice: {
        $sum: '$bilanganPesertaDietPemakananBahagianB',
      },
      jumlahAktivitiKanserMulutOHE: {
        $sum: '$bilanganAktivitiKanserMulutBahagianB',
      },
      jumlahPesertaKanserMulutOHE: {
        $sum: '$bilanganPesertaKanserMulutBahagianB',
      },
      jumlahAKtivitiHentiRokok: {
        $sum: '$bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiRokok: {
        $sum: '$bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiHentiSirih: {
        $sum: '$bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiSirih: {
        $sum: '$bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiHentiAlkohol: {
        $sum: '$bilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiAlkohol: {
        $sum: '$bilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiHentiTabiatLain: {
        $sum: '$bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi',
      },
      jumlahPesertaHentiTabiatLain: {
        $sum: '$bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi',
      },
      jumlahAktivitiTelevisyen: {
        $sum: '$bilanganAktivitiTelevisyen',
      },
      jumlahPesertaTelevisyen: { $sum: '$bilanganPesertaTelevisyen' },
      jumlahAktivitiRadio: { $sum: '$bilanganAktivitiRadio' },
      jumlahPesertaRadio: { $sum: '$bilanganPesertaRadio' },
      jumlahAktivitiCetak: { $sum: '$bilanganAktivitiCetak' },
    },
  };

  try {
    let bigData = [];
    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, match_stage[i], group_stage];
      const data = await Promosi.aggregate(pipeline);
      bigData.push(data[0]);
    }
    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPPIM03 = async (payload) => {
  const sesiTakwim = sesiTakwimSekolah();

  const dataKohort = await KohortKotak.aggregate([
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && {
          createdByKodFasiliti: payload.klinik,
        }),
        statusKotak: { $ne: 'belum mula' },
        sesiTakwimPelajar: sesiTakwim,
        tarikhIntervensi1: {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
    {
      $lookup: {
        from: 'fasilitis',
        localField: 'kodSekolah',
        foreignField: 'kodSekolah',
        as: 'result',
      },
    },
    {
      $unwind: '$result',
    },
    {
      $addFields: {
        sekolahKki: '$result.sekolahKki',
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        result: 0,
      },
    },
    {
      $group: {
        ...idPPIM03All,
        bilPerokokSemasaRokokBiasa: {
          $sum: {
            $cond: [
              {
                $and: [
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
                    $eq: ['$lainLainKotak', true],
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

  const dataSekolah = await Fasiliti.aggregate([
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
        sesiTakwimSekolah: sesiTakwim,
        sekolahSelesaiReten: true,
        tarikhSekolahSelesaiReten: {
          $gte: payload.tarikhMula,
          $lte: payload.tarikhAkhir,
        },
      },
    },
    {
      $facet: {
        dataSekolah: [
          {
            $lookup: {
              from: 'sekolahs',
              localField: 'kodSekolah',
              foreignField: 'kodSekolah',
              as: 'result',
              pipeline: [
                {
                  $match: {
                    deleted: false,
                    sesiTakwimPelajar: sesiTakwim,
                    pemeriksaanSekolah: { $ne: null },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$result',
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $lookup: {
              from: 'pemeriksaansekolahs',
              localField: 'result.pemeriksaanSekolah',
              foreignField: '_id',
              as: 'pemeriksaan',
            },
          },
          {
            $unwind: {
              path: '$pemeriksaan',
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $addFields: {
              jantina: '$result.jantina',
              keturunan: '$result.keturunan',
              tahunTingkatan: '$result.tahunTingkatan',
              statusMerokok: '$pemeriksaan.statusM',
              bersediaDirujuk: '$pemeriksaan.bersediaDirujuk',
            },
          },
          {
            $match: {
              statusMerokok: {
                $ne: '',
              },
            },
          },
          {
            $project: {
              _id: 0,
              jantina: 1,
              keturunan: 1,
              tahunTingkatan: 1,
              sekolahKki: 1,
              statusMerokok: 1,
              statusKotak: 1,
              bersediaDirujuk: 1,
              elektronikVapeKotak: 1,
              shishaKotak: 1,
              lainLainKotak: 1,
              tarikhIntervensi1: 1,
              tarikhIntervensi2: 1,
              tarikhIntervensi3: 1,
              tarikhQ: 1,
              rujukGuruKaunseling: 1,
              statusSelepas6Bulan: 1,
            },
          },
          {
            $group: {
              ...idPPIM03All,
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
              bilPerokokSemasaDirujukIntervensi: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        {
                          $eq: ['$bersediaDirujuk', 'ya-bersedia-dirujuk'],
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
        ],
        dataEnrolmen: [
          {
            $lookup: {
              from: 'sekolahs',
              localField: 'kodSekolah',
              foreignField: 'kodSekolah',
              as: 'result',
              pipeline: [
                {
                  $match: {
                    deleted: false,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$result',
          },
          {
            $project: {
              _id: 0,
              jenisFasiliti: 1,
              sekolahKki: 1,
              tahunTingkatan: '$result.tahunTingkatan',
            },
          },
          {
            $group: {
              ...idPPIM03All,
              jumlah: {
                $sum: 1,
              },
            },
          },
        ],
      },
    },
  ]);

  // bismillah
  try {
    let bigData = [];

    bigData.push(dataKohort);
    bigData.push(dataSekolah);

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
            'Tiada Tarikh',
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
        localField: 'nama',
        foreignField: 'nama',
        pipeline: [
          {
            $match: {
              pemeriksaanSekolah: {
                $exists: true,
                $ne: null,
              },
            },
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
        localField: 'data_sekolah.pemeriksaanSekolah',
        foreignField: '_id',
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
        _id: 0,
        tahunTingkatan: 1,
        statusMerokok: 1,
        statusKotak: 1,
        tarikhIntervensi1: 1,
        tarikhIntervensi2: 1,
        tarikhIntervensi3: 1,
        tarikhQ: 1,
        rujukGuruKaunseling: 1,
        statusSelepas6Bulan: 1,
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
        jumlahMB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: [
                      '$melaksanakanAktivitiBeginPromosiUmum',
                      'ya-melaksanakan-aktiviti-begin-promosi-umum',
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahFasilitiMB: {
          $addToSet: '$kodTastad',
        },
        jumlahCRARendah: {
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
        jumlahCRASederhana: {
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
        jumlahCRATinggi: {
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
      },
    },
    {
      $project: {
        jumlah: '$jumlahReten',
        jumlahRetenSalah: 1,
        jumlahFasilitiMB: { $size: '$jumlahFasilitiMB' },
        jumlahCRARendah: 1,
        jumlahCRASederhana: 1,
        jumlahCRATinggi: 1,
      },
    },
  ];

  // dari umum
  const taska_tadika = [
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
        kodTastad: '$fasiliti_data.kodTastad',
        melaksanakanBegin: '$fasiliti_data.melaksanakanBegin',
      },
    },
    {
      $project: {
        fasiliti_data: 0,
      },
    },
    {
      $facet: {
        dataTaska: [
          {
            $match: {
              kodTastad: { $regex: /tas/i },
            },
          },
          ...group_stage_umum,
        ],
        dataTadika: [
          {
            $match: {
              kodTastad: { $regex: /tad/i },
            },
          },
          ...group_stage_umum,
        ],
      },
    },
  ];

  // bismillah
  let bigData = [];

  try {
    const tastadBegin = await Umum.aggregate([...taska_tadika]);
    const sekolahBegin = await Fasiliti.aggregate([...pipelineBegin(payload)]);

    bigData.push(tastadBegin[0], sekolahBegin[0]);

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
      jenisFasiliti: {
        $in: ['taska', 'tadika', 'sekolah-rendah'],
      },
    }).select('jenisFasiliti enrolmen5Tahun enrolmen6Tahun statusPerkhidmatan');

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

    const totalFasiliti = dataFasiliti.reduce(
      (totals, { jenisFasiliti, statusPerkhidmatan }) => {
        if (jenisFasiliti === 'tadika' && statusPerkhidmatan === 'active') {
          totals = {
            ...totals,
            totalFasilitiTadika: (totals.totalFasilitiTadika ?? 0) + 1,
          };
        }
        if (jenisFasiliti === 'taska' && statusPerkhidmatan === 'active') {
          totals = {
            ...totals,
            totalFasilitiTaska: (totals.totalFasilitiTaska ?? 0) + 1,
          };
        }
        if (
          jenisFasiliti === 'sekolah-rendah' &&
          statusPerkhidmatan === 'active'
        ) {
          totals = {
            ...totals,
            totalFasilitiSR: (totals.totalFasilitiSR ?? 0) + 1,
          };
        }
        return totals;
      },
      {}
    );

    // console.log(totalEnrolmentTastadPra);
    // console.log(totalFasiliti);

    bigData[0][0] = {
      ...bigData[0][0],
      ...totalEnrolmentTastadPra,
      ...totalFasiliti,
    };

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// Reten Lain-lain??
const countGender = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsGender(payload),
      ...ultimateCutoff(payload),
    },
  };
  //
  let match_stage_lelaki = [];
  let match_stage_perempuan = [];
  //
  const pesakitLelakiPrimer1859 = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: { $in: ['kp', 'kk-kd'] },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitPerempuanPrimer1859 = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: { $in: ['kp', 'kk-kd'] },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitLelakiPakar1859 = {
    $match: {
      jenisFasiliti: { $eq: 'kepakaran' },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitPerempuanPakar1859 = {
    $match: {
      jenisFasiliti: { $in: ['kepakaran'] },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitLelakiOutreach1859 = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: {
        $nin: ['kp', 'kk-kd', 'kepakaran', 'incremental', 'taska-tadika'],
      },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitPerempuanOutreach1859 = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: {
        $nin: ['kp', 'kk-kd', 'kepakaran', 'incremental', 'taska-tadika'],
      },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitLelakiUtc1859 = {
    $match: {
      createdByKp: { $regex: /utc/i },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitPerempuanUtc1859 = {
    $match: {
      createdByKp: { $regex: /utc/i },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
    },
  };

  const pesakitLelakiPrimer60above = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
    },
  };

  const pesakitPerempuanPrimer60above = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
    },
  };

  const pesakitLelakiPakar60above = {
    $match: {
      jenisFasiliti: { $in: ['kepakaran'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
    },
  };

  const pesakitPerempuanPakar60above = {
    $match: {
      jenisFasiliti: { $in: ['kepakaran'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
    },
  };

  const pesakitLelakiOutreach60above = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: {
        $nin: ['kp', 'kk-kd', 'kepakaran', 'incremental', 'taska-tadika'],
      },
      jantina: 'lelaki',
      umur: { $gte: 60 },
    },
  };

  const pesakitPerempuanOutreach60above = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: {
        $nin: ['kp', 'kk-kd', 'kepakaran', 'incremental', 'taska-tadika'],
      },
      jantina: 'perempuan',
      umur: { $gte: 60 },
    },
  };

  const pesakitLelakiUtc60above = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
    },
  };

  const pesakitPerempuanUtc60above = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
    },
  };

  match_stage_lelaki.push(
    pesakitLelakiPrimer1859,
    pesakitLelakiPakar1859,
    pesakitLelakiOutreach1859,
    pesakitLelakiUtc1859
  );

  match_stage_lelaki.push(
    pesakitLelakiPrimer60above,
    pesakitLelakiPakar60above,
    pesakitLelakiOutreach60above,
    pesakitLelakiUtc60above
  );

  match_stage_perempuan.push(
    pesakitPerempuanPrimer1859,
    pesakitPerempuanPakar1859,
    pesakitPerempuanOutreach1859,
    pesakitPerempuanUtc1859
  );

  match_stage_perempuan.push(
    pesakitPerempuanPrimer60above,
    pesakitPerempuanPakar60above,
    pesakitPerempuanOutreach60above,
    pesakitPerempuanUtc60above
  );
  //
  const group_stage = {
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
      pesakitBaru: {
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
      pesakitUlangan: {
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
  };

  //bismillah
  let dataLelaki = [];
  let dataPerempuan = [];
  let bigData = [];

  try {
    for (let i = 0; i < match_stage_lelaki.length; i++) {
      const result = await Umum.aggregate([
        main_switch,
        match_stage_lelaki[i],
        group_stage,
      ]);
      dataLelaki.push(result[0]);
    }

    for (let i = 0; i < match_stage_perempuan.length; i++) {
      const result = await Umum.aggregate([
        main_switch,
        match_stage_perempuan[i],
        group_stage,
      ]);
      dataPerempuan.push(result[0]);
    }

    bigData.push({ dataLelaki });
    bigData.push({ dataPerempuan });

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countMasa = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsPiagamMasa(payload),
      ...ultimateCutoff(payload),
    },
  };
  let match_stage_op = [];
  let match_stage_temujanji = [];
  //
  const opJanuari = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-01-01`,
        $lte: `${new Date().getFullYear()}-01-31`,
      },
      temujanji: false,
    },
  };
  const opFebruari = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-02-01`,
        $lte: `${new Date().getFullYear()}-02-29`,
      },
      temujanji: false,
    },
  };
  const opMac = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-03-01`,
        $lte: `${new Date().getFullYear()}-03-31`,
      },
      temujanji: false,
    },
  };
  const opApril = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-04-01`,
        $lte: `${new Date().getFullYear()}-04-30`,
      },
      temujanji: false,
    },
  };
  const opMei = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-05-01`,
        $lte: `${new Date().getFullYear()}-05-31`,
      },
      temujanji: false,
    },
  };
  const opJun = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-06-01`,
        $lte: `${new Date().getFullYear()}-06-30`,
      },
      temujanji: false,
    },
  };
  const opJulai = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-07-01`,
        $lte: `${new Date().getFullYear()}-07-31`,
      },
      temujanji: false,
    },
  };
  const opOgos = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-08-01`,
        $lte: `${new Date().getFullYear()}-08-31`,
      },
      temujanji: false,
    },
  };
  const opSeptember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-09-01`,
        $lte: `${new Date().getFullYear()}-09-30`,
      },
      temujanji: false,
    },
  };
  const opOktober = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-10-01`,
        $lte: `${new Date().getFullYear()}-10-31`,
      },
      temujanji: false,
    },
  };
  const opNovember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-11-01`,
        $lte: `${new Date().getFullYear()}-11-30`,
      },
      temujanji: false,
    },
  };
  const opDisember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-12-01`,
        $lte: `${new Date().getFullYear()}-12-31`,
      },
      temujanji: false,
    },
  };

  match_stage_op.push(
    opJanuari,
    opFebruari,
    opMac,
    opApril,
    opMei,
    opJun,
    opJulai,
    opOgos,
    opSeptember,
    opOktober,
    opNovember,
    opDisember
  );

  const temujanjiJanuari = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-01-01`,
        $lte: `${new Date().getFullYear()}-01-31`,
      },
      temujanji: true,
    },
  };
  const temujanjiFebruari = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-02-01`,
        $lte: `${new Date().getFullYear()}-02-29`,
      },
      temujanji: true,
    },
  };
  const temujanjiMac = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-03-01`,
        $lte: `${new Date().getFullYear()}-03-31`,
      },
      temujanji: true,
    },
  };
  const temujanjiApril = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-04-01`,
        $lte: `${new Date().getFullYear()}-04-30`,
      },
      temujanji: true,
    },
  };
  const temujanjiMei = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-05-01`,
        $lte: `${new Date().getFullYear()}-05-31`,
      },
      temujanji: true,
    },
  };
  const temujanjiJun = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-06-01`,
        $lte: `${new Date().getFullYear()}-06-30`,
      },
      temujanji: true,
    },
  };
  const temujanjiJulai = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-07-01`,
        $lte: `${new Date().getFullYear()}-07-31`,
      },
      temujanji: true,
    },
  };
  const temujanjiOgos = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-08-01`,
        $lte: `${new Date().getFullYear()}-08-31`,
      },
      temujanji: true,
    },
  };
  const temujanjiSeptember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-09-01`,
        $lte: `${new Date().getFullYear()}-09-30`,
      },
      temujanji: true,
    },
  };
  const temujanjiOktober = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-10-01`,
        $lte: `${new Date().getFullYear()}-10-31`,
      },
      temujanji: true,
    },
  };
  const temujanjiNovember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-11-01`,
        $lte: `${new Date().getFullYear()}-11-30`,
      },
      temujanji: true,
    },
  };
  const temujanjiDisember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-12-01`,
        $lte: `${new Date().getFullYear()}-12-31`,
      },
      temujanji: true,
    },
  };

  match_stage_temujanji.push(
    temujanjiJanuari,
    temujanjiFebruari,
    temujanjiMac,
    temujanjiApril,
    temujanjiMei,
    temujanjiJun,
    temujanjiJulai,
    temujanjiOgos,
    temujanjiSeptember,
    temujanjiOktober,
    temujanjiNovember,
    temujanjiDisember
  );

  const add_fields_stage = {
    $addFields: {
      waktuDipanggilUnix: {
        $toLong: {
          $dateFromString: {
            dateString: {
              $concat: ['1970-01-01T', '$waktuDipanggil'],
            },
          },
        },
      },
      waktuSampaiUnix: {
        $toLong: {
          $dateFromString: {
            dateString: {
              $concat: ['1970-01-01T', '$waktuSampai'],
            },
          },
        },
      },
    },
  };

  const group_stage = {
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
      jumlahPesakit: { $sum: 1 },
      jumlahPesakitYangDipanggilSebelum30Minit: {
        $sum: {
          $cond: [
            {
              $lt: [
                {
                  $subtract: ['$waktuDipanggilUnix', '$waktuSampaiUnix'],
                },
                30 * 60 * 1000,
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  const group_stage_temujanji = {
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
      jumlahPesakit: { $sum: 1 },
      jumlahPesakitYangDipanggilSebelum30Minit: {
        $sum: {
          $cond: [
            {
              $lt: [
                {
                  $subtract: ['$waktuDipanggilUnix', '$waktuSampaiUnix'],
                },
                30 * 60 * 1000,
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahPesakitYangDipanggilLebih30Minit: {
        $sum: {
          $cond: [
            {
              $gt: [
                {
                  $subtract: ['$waktuDipanggilUnix', '$waktuSampaiUnix'],
                },
                30 * 60 * 1000,
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  //bismillah
  let bigData = [];
  let temujanjiData = [];
  let opData = [];

  try {
    for (let i = 0; i < match_stage_op.length; i++) {
      const dataOp = await Umum.aggregate([
        main_switch,
        match_stage_op[i],
        add_fields_stage,
        group_stage,
      ]);
      opData.push(dataOp[0]);
    }

    for (let i = 0; i < match_stage_temujanji.length; i++) {
      const dataTemujanji = await Umum.aggregate([
        main_switch,
        match_stage_temujanji[i],
        add_fields_stage,
        group_stage_temujanji,
      ]);
      temujanjiData.push(dataTemujanji[0]);
    }

    bigData.push({ opData });
    bigData.push({ temujanjiData });

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countBp = async (payload) => {
  //
  const umur1829lelaki = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 18,
          $lte: 29,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur3039lelaki = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 30,
          $lte: 39,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur4049lelaki = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 40,
          $lte: 49,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur5059lelaki = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 50,
          $lte: 59,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur60keataslelaki = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: { $gte: 60 },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur1829perempuan = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 18,
          $lte: 29,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur3039perempuan = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 30,
          $lte: 39,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur4049perempuan = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 40,
          $lte: 49,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur5059perempuan = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: {
          $gte: 50,
          $lte: 59,
        },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };

  const umur60keatasperempuan = (payload, kaum, jantina) => {
    return {
      $match: {
        umur: { $gte: 60 },
        ...getParamsBp(payload, kaum, jantina),
      },
    };
  };
  //
  let match_stage_melayu = [
    umur1829lelaki(payload, 'melayu', 'l'),
    umur3039lelaki(payload, 'melayu', 'l'),
    umur4049lelaki(payload, 'melayu', 'l'),
    umur5059lelaki(payload, 'melayu', 'l'),
    umur60keataslelaki(payload, 'melayu', 'l'),
    umur1829perempuan(payload, 'melayu', 'p'),
    umur3039perempuan(payload, 'melayu', 'p'),
    umur4049perempuan(payload, 'melayu', 'p'),
    umur5059perempuan(payload, 'melayu', 'p'),
    umur60keatasperempuan(payload, 'melayu', 'p'),
  ];
  let match_stage_cina = [
    umur1829lelaki(payload, 'cina', 'l'),
    umur3039lelaki(payload, 'cina', 'l'),
    umur4049lelaki(payload, 'cina', 'l'),
    umur5059lelaki(payload, 'cina', 'l'),
    umur60keataslelaki(payload, 'cina', 'l'),
    umur1829perempuan(payload, 'cina', 'p'),
    umur3039perempuan(payload, 'cina', 'p'),
    umur4049perempuan(payload, 'cina', 'p'),
    umur5059perempuan(payload, 'cina', 'p'),
    umur60keatasperempuan(payload, 'cina', 'p'),
  ];
  let match_stage_india = [
    umur1829lelaki(payload, 'india', 'l'),
    umur3039lelaki(payload, 'india', 'l'),
    umur4049lelaki(payload, 'india', 'l'),
    umur5059lelaki(payload, 'india', 'l'),
    umur60keataslelaki(payload, 'india', 'l'),
    umur1829perempuan(payload, 'india', 'p'),
    umur3039perempuan(payload, 'india', 'p'),
    umur4049perempuan(payload, 'india', 'p'),
    umur5059perempuan(payload, 'india', 'p'),
    umur60keatasperempuan(payload, 'india', 'p'),
  ];
  let match_stage_bumiputeraSabah = [
    umur1829lelaki(payload, 'bumiputeraSabah', 'l'),
    umur3039lelaki(payload, 'bumiputeraSabah', 'l'),
    umur4049lelaki(payload, 'bumiputeraSabah', 'l'),
    umur5059lelaki(payload, 'bumiputeraSabah', 'l'),
    umur60keataslelaki(payload, 'bumiputeraSabah', 'l'),
    umur1829perempuan(payload, 'bumiputeraSabah', 'p'),
    umur3039perempuan(payload, 'bumiputeraSabah', 'p'),
    umur4049perempuan(payload, 'bumiputeraSabah', 'p'),
    umur5059perempuan(payload, 'bumiputeraSabah', 'p'),
    umur60keatasperempuan(payload, 'bumiputeraSabah', 'p'),
  ];
  let match_stage_bumiputeraSarawak = [
    umur1829lelaki(payload, 'bumiputeraSarawak', 'l'),
    umur3039lelaki(payload, 'bumiputeraSarawak', 'l'),
    umur4049lelaki(payload, 'bumiputeraSarawak', 'l'),
    umur5059lelaki(payload, 'bumiputeraSarawak', 'l'),
    umur60keataslelaki(payload, 'bumiputeraSarawak', 'l'),
    umur1829perempuan(payload, 'bumiputeraSarawak', 'p'),
    umur3039perempuan(payload, 'bumiputeraSarawak', 'p'),
    umur4049perempuan(payload, 'bumiputeraSarawak', 'p'),
    umur5059perempuan(payload, 'bumiputeraSarawak', 'p'),
    umur60keatasperempuan(payload, 'bumiputeraSarawak', 'p'),
  ];
  let match_stage_orangAsliSemenanjung = [
    umur1829lelaki(payload, 'oas', 'l'),
    umur3039lelaki(payload, 'oas', 'l'),
    umur4049lelaki(payload, 'oas', 'l'),
    umur5059lelaki(payload, 'oas', 'l'),
    umur60keataslelaki(payload, 'oas', 'l'),
    umur1829perempuan(payload, 'oas', 'p'),
    umur3039perempuan(payload, 'oas', 'p'),
    umur4049perempuan(payload, 'oas', 'p'),
    umur5059perempuan(payload, 'oas', 'p'),
    umur60keatasperempuan(payload, 'oas', 'p'),
  ];
  let match_stage_lain = [
    umur1829lelaki(payload, 'lain-lain', 'l'),
    umur3039lelaki(payload, 'lain-lain', 'l'),
    umur4049lelaki(payload, 'lain-lain', 'l'),
    umur5059lelaki(payload, 'lain-lain', 'l'),
    umur60keataslelaki(payload, 'lain-lain', 'l'),
    umur1829perempuan(payload, 'lain-lain', 'p'),
    umur3039perempuan(payload, 'lain-lain', 'p'),
    umur4049perempuan(payload, 'lain-lain', 'p'),
    umur5059perempuan(payload, 'lain-lain', 'p'),
    umur60keatasperempuan(payload, 'lain-lain', 'p'),
  ];
  //
  const group_stage = {
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
      adaSejarahDarahTinggi: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$sejarahDarahTinggi', true] },
                {
                  $or: [
                    { $gte: ['$systolicTekananDarah', 140] },
                    { $gte: ['$diastolicTekananDarah', 90] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      tiadaSejarahDarahTinggi: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$sejarahDarahTinggi', false] },
                {
                  $or: [
                    { $gte: ['$systolicTekananDarah', 140] },
                    { $gte: ['$diastolicTekananDarah', 90] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahDirujukKeKk: {
        $sum: {
          $cond: [
            {
              $eq: ['$rujukKeKlinik', true],
            },
            1,
            0,
          ],
        },
      },
    },
  };
  // bismillah
  let bigData = [];
  let melayu = [];
  let cina = [];
  let india = [];
  let bumiputeraSabah = [];
  let bumiputeraSarawak = [];
  let orangAsliSemenanjung = [];
  let lain2 = [];

  try {
    for (let i = 0; i < match_stage_melayu.length; i++) {
      const dataMelayu = await Umum.aggregate([
        {
          $match: {
            ...ultimateCutoff(payload),
          },
        },
        match_stage_melayu[i],
        group_stage,
      ]);
      melayu.push(dataMelayu[0]);
    }
    for (let i = 0; i < match_stage_cina.length; i++) {
      const dataCina = await Umum.aggregate([
        {
          $match: {
            ...ultimateCutoff(payload),
          },
        },
        match_stage_cina[i],
        group_stage,
      ]);
      cina.push(dataCina[0]);
    }
    for (let i = 0; i < match_stage_india.length; i++) {
      const dataIndia = await Umum.aggregate([
        {
          $match: {
            ...ultimateCutoff(payload),
          },
        },
        match_stage_india[i],
        group_stage,
      ]);
      india.push(dataIndia[0]);
    }
    for (let i = 0; i < match_stage_bumiputeraSabah.length; i++) {
      const dataBumiputeraSabah = await Umum.aggregate([
        {
          $match: {
            ...ultimateCutoff(payload),
          },
        },
        match_stage_bumiputeraSabah[i],
        group_stage,
      ]);
      bumiputeraSabah.push(dataBumiputeraSabah[0]);
    }
    for (let i = 0; i < match_stage_bumiputeraSarawak.length; i++) {
      const dataBumiputeraSarawak = await Umum.aggregate([
        {
          $match: {
            ...ultimateCutoff(payload),
          },
        },
        match_stage_bumiputeraSarawak[i],
        group_stage,
      ]);
      bumiputeraSarawak.push(dataBumiputeraSarawak[0]);
    }
    for (let i = 0; i < match_stage_orangAsliSemenanjung.length; i++) {
      const dataOrangAsliSemenanjung = await Umum.aggregate([
        {
          $match: {
            ...ultimateCutoff(payload),
          },
        },
        match_stage_orangAsliSemenanjung[i],
        group_stage,
      ]);
      orangAsliSemenanjung.push(dataOrangAsliSemenanjung[0]);
    }
    for (let i = 0; i < match_stage_lain.length; i++) {
      const dataLain = await Umum.aggregate([
        {
          $match: {
            ...ultimateCutoff(payload),
          },
        },
        match_stage_lain[i],
        group_stage,
      ]);
      lain2.push(dataLain[0]);
    }

    bigData.push(
      { melayu },
      { cina },
      { india },
      { bumiputeraSabah },
      { bumiputeraSarawak },
      { orangAsliSemenanjung },
      { lain2 }
    );

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countBPE = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsBPE(payload),
      ...ultimateCutoff(payload),
    },
  };
  //
  const getParamsFirstDocOnly = [
    {
      $sort: {
        skorBpeOralHygienePemeriksaanUmum: -1,
      },
    },
    {
      $group: {
        _id: '$nama',
        firstDocument: { $first: '$$ROOT' },
      },
    },
    {
      $match: {
        'firstDocument.skorBpeOralHygienePemeriksaanUmum': { $ne: 'tiada' },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$firstDocument',
      },
    },
  ];
  //
  let match_stage = [];
  //
  const bKurang18 = [
    ...getParamsFirstDocOnly,
    {
      $match: {
        umur: { $gt: 14, $lt: 18 },
        // kedatangan: { $eq: 'baru-kedatangan' },
      },
    },
  ];
  const bUmur1819 = [
    ...getParamsFirstDocOnly,
    {
      $match: {
        umur: { $gte: 18, $lte: 19 },
        // kedatangan: { $eq: 'baru-kedatangan' },
      },
    },
  ];
  const bUmur2029 = [
    ...getParamsFirstDocOnly,
    {
      $match: {
        umur: { $gte: 20, $lte: 29 },
        // kedatangan: { $eq: 'baru-kedatangan' },
      },
    },
  ];
  const bUmur3049 = [
    ...getParamsFirstDocOnly,
    {
      $match: {
        umur: { $gte: 30, $lte: 49 },
        // kedatangan: { $eq: 'baru-kedatangan' },
      },
    },
  ];
  const bUmur5059 = [
    ...getParamsFirstDocOnly,
    {
      $match: {
        umur: { $gte: 50, $lte: 59 },
        // kedatangan: { $eq: 'baru-kedatangan' },
      },
    },
  ];
  const bUmur60keatas = [
    ...getParamsFirstDocOnly,
    {
      $match: {
        umur: { $gte: 60 },
        // kedatangan: { $eq: 'baru-kedatangan' },
      },
    },
  ];

  const uKurang18 = [
    {
      $match: {
        umur: { $lt: 18 },
        kedatangan: { $eq: 'ulangan-kedatangan' },
      },
    },
  ];
  const uUmur1819 = [
    {
      $match: {
        umur: { $gte: 18, $lte: 19 },
        kedatangan: { $eq: 'ulangan-kedatangan' },
      },
    },
  ];
  const uUmur2029 = [
    {
      $match: {
        umur: { $gte: 20, $lte: 29 },
        kedatangan: { $eq: 'ulangan-kedatangan' },
      },
    },
  ];
  const uUmur3049 = [
    {
      $match: {
        umur: { $gte: 30, $lte: 49 },
        kedatangan: { $eq: 'ulangan-kedatangan' },
      },
    },
  ];
  const uUmur5059 = [
    {
      $match: {
        umur: { $gte: 50, $lte: 59 },
        kedatangan: { $eq: 'ulangan-kedatangan' },
      },
    },
  ];
  const uUmur60keatas = [
    {
      $match: {
        umur: { $gte: 60 },
        kedatangan: { $eq: 'ulangan-kedatangan' },
      },
    },
  ];

  match_stage.push(
    bKurang18,
    uKurang18,
    bUmur1819,
    uUmur1819,
    bUmur2029,
    uUmur2029,
    bUmur3049,
    uUmur3049,
    bUmur5059,
    uUmur5059,
    bUmur60keatas,
    uUmur60keatas
  );
  //
  const group_stage = {
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
      //kedatangan
      kedatanganTahunSemasaBaru: {
        $sum: {
          $cond: [
            {
              $and: [
                //{ $eq: ['$kedatangan', 'baru-kedatangan'] },
                { $ne: ['$engganBpeImplan', true] },
              ],
            },
            1,
            0,
          ],
        },
      },
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
      //Punca Rujukan T2DM
      adaRujukanT2DMdariKK: {
        $sum: {
          $cond: [
            {
              $and: [{ $eq: ['$puncaRujukan', 'klinik-kesihatan'] }],
            },
            1,
            0,
          ],
        },
      },
      adaRujukanT2DMdariLainLain: {
        $sum: {
          $cond: [{ $eq: ['$puncaRujukan', 'lain-lain'] }, 1, 0],
        },
      },
      tiadaRujukanT2DM: {
        $sum: {
          $cond: [{ $eq: ['$puncaRujukan', 'tiada'] }, 1, 0],
        },
      },
      //Risiko Perio - Perio Risk
      risikoBpeDiabetes: {
        // $sum: { $cond: [{ $eq: ['$diabetesFaktorRisikoBpe', true] }, 1, 0] },
        $sum: {
          $cond: [{ $eq: ['$puncaRujukan', 'klinik-kesihatan'] }, 1, 0],
        },
      },
      risikoBpePerokok: {
        $sum: {
          $cond: [{ $eq: ['$perokokFaktorRisikoBpe', true] }, 1, 0],
        },
      },
      risikoBpeLainLain: {
        $sum: {
          $cond: [{ $eq: ['$lainLainFaktorRisikoBpe', true] }, 1, 0],
        },
      },
      //Basic Periodontal Examination (BPE)
      engganBPE: {
        $sum: {
          $cond: [{ $eq: ['$engganBpeImplan', true] }, 1, 0],
        },
      },
      skorBPE0: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        },
      },
      skorBPE1: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '1'] }, 1, 0],
        },
      },
      skorBPE2: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'] }, 1, 0],
        },
      },
      skorBPE3: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '3'] }, 1, 0],
        },
      },
      skorBPE4: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '4'] }, 1, 0],
        },
      },
      adaPeriImplantMucositis: {
        $sum: {
          $cond: [{ $eq: ['$periImplantMucositis', true] }, 1, 0],
        },
      },
      adaPeriImplantitis: {
        $sum: { $cond: [{ $eq: ['$periImplantitis', true] }, 1, 0] },
      },

      // Periodontium therapy - Terapi Periodontium - Pengurusan Faktor Risiko - Perio Risk Management

      nasihatKaunselingDiet: {
        //ada mmasalah tak dapat baca value sini
        $sum: {
          $cond: [
            {
              $eq: ['$dietPemakananNasihatPergigianIndividuPromosiUmum', true],
            },
            1,
            0,
          ],
        },
      },

      nasihatBerhentiMerokok: {
        $sum: {
          $cond: [{ $eq: ['$nasihatBerhentiMerokok', true] }, 1, 0],
        },
      },
      nasihatLainlain: {
        $sum: {
          $cond: [{ $eq: ['$lainLainPengurusanFaktorRisiko', true] }, 1, 0],
        },
      },

      //Periodontium therapy - Terapi Periodontium - Pengurusan Faktor Risiko Setempat - Perio Risk Management (Local)
      nasihatOHE: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: ['plakGigiNasihatPergigianIndividuPromosiUmum', true],
                },
                {
                  $eq: [
                    '$penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum',
                    true,
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },

      telahPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$penskaleranRawatanUmum', true] }, 1, 0],
        },
      },
      telahPendebridmenAkar: {
        $sum: { $cond: [{ $eq: ['$pendebridmenAkar', true] }, 1, 0] },
      },
      telahPengilapanTampalanRungkup: {
        //telah remove overhang filling
        $sum: {
          $cond: [{ $eq: ['$pengilapanTampalanRungkup', true] }, 1, 0],
        },
      },
      telahAdjustasiOklusi: {
        $sum: { $cond: [{ $eq: ['$adjustasiOklusi', true] }, 1, 0] },
      },
      telahCabutGigiPerio: {
        $sum: '$cabutanDisebabkanPeriodontitisRawatanUmum',
      },
      telahExtirpasiPulpaSebabPerio: {
        $sum: { $cond: [{ $eq: ['$ektiparsiPulpa', true] }, 1, 0] },
      },
      telahRawatanPerioLain: {
        $sum: {
          $cond: [{ $eq: ['$rawatanLainPeriodontikRawatanUmum', true] }, 1, 0],
        },
      },

      //Referral
      telahRujukPakarPerio: {
        $sum: {
          $cond: [
            {
              $eq: ['$rujukanPakarPeriodontik', 'ya-rujukan-pakar-periodontik'],
            },
            1,
            0,
          ],
        },
      },
      engganRujukPakarPerio: {
        $sum: {
          $cond: [
            {
              $and: [
                // {
                //   $eq: [
                //     '$rujukanPakarPeriodontik',
                //     'tidak-rujukan-pakar-periodontik',
                //   ],
                // },
                {
                  $eq: [
                    '$engganLainRujukanPakarPeriodontik',
                    'enggan-rujukan-pakar-periodontik',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      engganLainRujukPakarPerio: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: [
                    '$rujukanPakarPeriodontik',
                    'tidak-rujukan-pakar-periodontik',
                  ],
                },
                {
                  $eq: [
                    '$engganLainRujukanPakarPeriodontik',
                    'lain-rujukan-pakar-periodontik',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      // lainlainPakar: { $sum: 1 },
      rujukanKeKlinikSCD: {
        $sum: {
          $cond: [
            {
              $eq: ['$rujukanPakarScd', true],
            },
            1,
            0,
          ],
        },
      },
      rujukanKeKlinikUPPKA: {
        $sum: {
          $cond: [
            {
              $eq: ['$rujukanPakarUpkka', true],
            },
            1,
            0,
          ],
        },
      },
      kesSelesaiPerio: {
        $sum: {
          $cond: [
            {
              $eq: ['$kesSelesaiPeriodontium', true],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // bismillah
  let bigData = [];

  try {
    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, ...match_stage[i], group_stage];
      const dataBPE = await Umum.aggregate(pipeline);
      bigData.push(dataBPE[0]);
    }
    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countKEPP = async (payload) => {
  try {
    const dataKepp = await Umum.aggregate(pipelineKepp(payload));

    return dataKepp;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countTOD = async (payload) => {
  // 18 dan 36 bulan
  let match_stage_1836 = [];

  const match_stage_18 = [
    {
      $match: {
        ...getParamsTOD(payload),
        ...ultimateCutoff(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $eq: 1 },
        umurBulan: { $eq: 6 },
      },
    },
  ];

  const match_stage_36 = [
    {
      $match: {
        ...getParamsTOD(payload),
        ...ultimateCutoff(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $eq: 3 },
        umurBulan: { $eq: 0 },
      },
    },
  ];

  match_stage_1836.push(match_stage_18);
  match_stage_1836.push(match_stage_36);

  const group_1836 = [
    {
      $group: {
        _id: null,
        jumlahKedatanganBaru: {
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
        jumlahd: { $sum: '$dAdaGigiDesidusPemeriksaanUmum' },
        jumlahf: { $sum: '$fAdaGigiDesidusPemeriksaanUmum' },
        jumlahx: { $sum: '$xAdaGigiDesidusPemeriksaanUmum' },
        dfxEqualToZero: {
          //dfx=0
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: [
                      '$yaTidakPesakitMempunyaiGigi',
                      'ya-pesakit-mempunyai-gigi',
                    ],
                  },
                  { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
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

  try {
    let bigData = [];
    let data1836 = [];

    const TOD = await Umum.aggregate([...pipelineTod(payload)]);

    for (const stage of match_stage_1836) {
      const query1836 = await Umum.aggregate([...stage, ...group_1836]);
      data1836.push({ query1836 });
    }

    bigData.push(TOD, data1836);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// Ad Hoc Query
const countAdHocQuery = async (
  negeri,
  daerah,
  x,
  y,
  mengandung,
  oku,
  bersekolah,
  pesara
) => {
  const Dictionary = {
    '': false,
    Pegawai: '$createdByUsername',
    Masa: '$tarikhKedatangan',
    Klinik: '$createdByKp',
    'Jumlah Semua Pesakit': '',
    'Jumlah Pesakit Baru': 'baru-kedatangan',
    'Jumlah Pesakit Ulangan': 'ulangan-kedatangan',
    'Jumlah Ibu Mengandung': true,
    'Jumlah OKU': true,
    'Jumlah Bersekolah': true,
    'Jumlah Pesara': true,
  };

  let match_stage = [
    {
      $match: {
        $and: [
          { createdByNegeri: negeri },
          { createdByDaerah: daerah },
          // { createdByKp: klinik },
          { createdByUsername: { $not: { $eq: 'kaunter' } } },
          { kedatangan: Dictionary[y] },
          // { ibuMengandung: Dictionary[mengandung] },
          // { orangKurangUpaya: Dictionary[oku] },
          // { bersekolah: Dictionary[bersekolah] },
          // { statusPesara: Dictionary[pesara] },
        ],
      },
    },
  ];

  if (y === 'Jumlah Semua Pesakit') {
    match_stage = [
      {
        $match: {
          $and: [
            { createdByNegeri: negeri },
            { createdByDaerah: daerah },
            // { createdByKp: klinik },
            { createdByUsername: { $not: { $eq: 'kaunter' } } },
            // { kedatangan: Dictionary[y] },
            // { ibuMengandung: Dictionary[mengandung] },
            // { orangKurangUpaya: Dictionary[oku] },
            // { bersekolah: Dictionary[bersekolah] },
            // { statusPesara: Dictionary[pesara] },
          ],
        },
      },
    ];
  }

  let project_stage = {
    $project: {
      _id: 0,
      negeri: '$_id.negeri',
      daerah: '$_id.daerah',
      klinik: '$_id.klinik',
      pegawai: '$_id.pegawai',
      tahun: '$_id.tahun',
      jumlah: 1,
    },
  };
  let group_stage = {
    $group: {
      // _id:
      // negeri: '$createdByNegeri',
      // daerah: '$createdByDaerah',
      // klinik: '$createdByKp',
      // pegawai: '$createdByUsername'
      // tahun: '$tahun',
      // ,
      _id: Dictionary[x],
      jumlah: { $sum: 1 },
    },
  };

  try {
    const pipeline = [match_stage[0], group_stage];
    const query = await Umum.aggregate(pipeline);
    // sort by date
    if (x === 'Masa') {
      query.sort((a, b) => {
        return new Date(a._id) - new Date(b._id);
      });
    }
    return query;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

module.exports = {
  countPG101A,
  countPG101C,
  countPG211A,
  countPG211C,
  countPG214,
  countPG206,
  countPG207,
  countPGPR201,
  countPGPR201CustomIM,
  countPGS201,
  countPGS203,
  countPGPro01,
  countPGPro02,
  countPGPro01Combined,
  countPPIM03,
  countPPIM04,
  countPPIM05,
  countBEGIN,
  countGender,
  countMasa,
  countBp,
  countBPE,
  // new
  countKEPP,
  countTOD,
  countFS,
  // adhoc
  countAdHocQuery,
};

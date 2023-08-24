const Umum = require('../models/Umum');
const Event = require('../models/Event');
const Fasiliti = require('../models/Fasiliti');
const { errorRetenLogger } = require('../logs/logger');
const {
  ultimateCutoff,
  placeModifier,
  getParamsKOM,
  getParamsOAP,
  getParamsUTCRTC,
  getParamsPKAP,
  getParamsOplainP2,
} = require('../controllers/countHelperParams');
const {
  groupSekolah,
  groupPemeriksaanBiasa,
  groupRawatanBiasa,
  groupOplain,
  pipelineCPPC1Biasa,
  pipelineCPPC1PraSekolah,
  pipelineCPPC2Biasa,
  pipelineCPPC2PraSekolah,
} = require('../controllers/countHelperPipeline');

const countCPPC1 = async (payload) => {
  const dataCPPC1biasa = await Fasiliti.aggregate(pipelineCPPC1Biasa(payload));
  const dataCPPC1pra = await Fasiliti.aggregate(
    pipelineCPPC1PraSekolah(payload)
  );

  dataCPPC1biasa.push(...dataCPPC1pra);

  return dataCPPC1biasa;
};
const countCPPC2 = async (payload) => {
  const dataCPPC2biasa = await Fasiliti.aggregate(pipelineCPPC2Biasa(payload));
  const dataCPPC2pra = await Fasiliti.aggregate(
    pipelineCPPC2PraSekolah(payload)
  );

  dataCPPC2biasa.push(...dataCPPC2pra);

  return dataCPPC2biasa;
};
const countDEWASAMUDA = async (payload) => {
  const main_switch = [
    {
      $match: {
        ...getParamsKOM(payload),
        ...ultimateCutoff(payload),
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

  try {
    let bigData = [];

    const dataDM = await Umum.aggregate([
      ...main_switch,
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
                boundaries: [15, 18, 20, 29],
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
                boundaries: [15, 18, 20, 29],
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
                kedatangan: 'baru-kedatangan',
                umur: {
                  $gte: 7,
                },
                ibuMengandung: true,
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          imRawatan: [
            {
              $match: {
                umur: {
                  $gte: 7,
                },
                ibuMengandung: true,
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
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
          oapPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                kumpulanEtnik: {
                  $in: ['orang asli semenanjung', 'penan'],
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
          oapRawatan: [
            {
              $match: {
                kumpulanEtnik: {
                  $in: ['orang asli semenanjung', 'penan'],
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
          kpbMpbPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                menggunakanKPBMPB: {
                  $eq: 'ya-menggunakan-kpb-mpb',
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
          kpbMpbRawatan: [
            {
              $match: {
                menggunakanKPBMPB: {
                  $eq: 'ya-menggunakan-kpb-mpb',
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
          institusiPemeriksaan: [
            {
              $match: {
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
                          $eq: ['$kategoriInstitusi', 'kolej-komuniti'],
                        },
                        then: 'kolej-komuniti',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'kolej-vokasional'],
                        },
                        then: 'kolej-vokasional',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'ipg'],
                        },
                        then: 'ipg',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'ipta'],
                        },
                        then: 'ipta',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'lain-lain'],
                        },
                        then: 'lain-lain',
                      },
                    ],
                    default: 'Unknown',
                  },
                },
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          institusiRawatan: [
            {
              $group: {
                _id: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'kolej-komuniti'],
                        },
                        then: 'kolej-komuniti',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'kolej-vokasional'],
                        },
                        then: 'kolej-vokasional',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'ipg'],
                        },
                        then: 'ipg',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'ipta'],
                        },
                        then: 'ipta',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'lain-lain'],
                        },
                        then: 'lain-lain',
                      },
                    ],
                    default: 'Unknown',
                  },
                },
                ...groupRawatanBiasa,
              },
            },
          ],
          umumOplain: [
            ...getParamsOplainP2,
            {
              $bucket: {
                groupBy: '$umur',
                boundaries: [15, 18, 20, 29],
                default: 'Other',
                output: {
                  ...groupOplain,
                },
              },
            },
          ],
          imOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                umur: {
                  $gte: 7,
                },
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
          okuOplain: [
            ...getParamsOplainP2,
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
          bwOplain: [
            ...getParamsOplainP2,
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
                ...groupOplain,
              },
            },
          ],
          oapOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                kumpulanEtnik: {
                  $in: ['orang asli semenanjung', 'penan'],
                },
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          kpbMpbOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                menggunakanKPBMPB: {
                  $eq: 'ya-menggunakan-kpb-mpb',
                },
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          institusiOplain: [
            ...getParamsOplainP2,
            {
              $group: {
                _id: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'kolej-komuniti'],
                        },
                        then: 'kolej-komuniti',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'kolej-vokasional'],
                        },
                        then: 'kolej-vokasional',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'ipg'],
                        },
                        then: 'ipg',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'ipta'],
                        },
                        then: 'ipta',
                      },
                      {
                        case: {
                          $eq: ['$kategoriInstitusi', 'lain-lain'],
                        },
                        then: 'lain-lain',
                      },
                    ],
                    default: 'Unknown',
                  },
                },
                ...groupOplain,
              },
            },
          ],
        },
      },
    ]);

    const dataSekolahPemeriksaan = await Fasiliti.aggregate([
      {
        $match: {
          ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
          ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
          ...(payload.klinik !== 'all' && {
            kodFasilitiHandler: payload.klinik,
          }),
          sekolahSelesaiReten: true,
          jenisFasiliti: { $in: ['sekolah-menengah'] },
        },
      },
      {
        $project: {
          _id: 0,
          jenisFasiliti: 1,
          jenisPerkhidmatanSekolah: 1,
          kodSekolah: 1,
          sesiTakwimSekolah: 1,
          sekolahMmi: 1,
          sekolahKki: 1,
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
                umur: { $gte: 15, $lte: 17 },
                pemeriksaanSekolah: { $exists: true, $ne: null },
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
          warganegara: '$result.warganegara',
          kelasPelajar: '$result.kelasPelajar',
          jantina: '$result.jantina',
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
          statusRawatan: 1,
          kodSekolah: 1,
          sekolahMmi: 1,
          sekolahKki: 1,
          jenisFasiliti: 1,
          jenisPerkhidmatanSekolah: 1,
          jantina: 1,
          umur: 1,
          keturunan: 1,
          warganegara: 1,
          statusOku: 1,
          tahunTingkatan: 1,
          kelasPelajar: 1,
          tarikhPemeriksaan: 1,
          operatorPemeriksaan: 1,
          tarikhRawatan: '$lastRawatan.tarikhRawatanSemasa',
          operatorRawatan: '$lastRawatan.createdByMdcMdtb',
          kesSelesaiPemeriksaan: '$pemeriksaanSekolah.kesSelesai',
          kesSelesaiIcdasPemeriksaan: '$pemeriksaanSekolah.kesSelesaiIcdas',
          kesSelesaiRawatan: '$rawatanSekolah.kesSelesaiSekolahRawatan',
          kesSelesaiIcdasRawatan:
            '$rawatanSekolah.kesSelesaiIcdasSekolahRawatan',
          merged: {
            $mergeObjects: ['$pemeriksaanSekolah'],
          },
        },
      },
      {
        $match: {
          'merged.tarikhPemeriksaanSemasa': {
            $gte: payload.tarikhMula,
            $lte: payload.tarikhAkhir,
          },
        },
      },
      {
        $facet: {
          sekolahAll: [
            {
              $group: {
                _id: null,
                ...groupSekolah,
              },
            },
          ],
          sekolahOku: [
            {
              $match: {
                statusOku: 'OKU',
              },
            },
            {
              $group: {
                _id: null,
                ...groupSekolah,
              },
            },
          ],
          sekolahOap: [
            {
              $match: {
                keturunan: {
                  $in: [
                    'PENAN',
                    'ORANG ASLI (SEMENANJUNG)',
                    'JAKUN',
                    'NEGRITO',
                    'SAKAI',
                    'SEMAI',
                    'SEMALAI',
                    'TEMIAR',
                    'SENOI',
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                ...groupSekolah,
              },
            },
          ],
        },
      },
    ]);
    const dataSekolahRawatan = await Fasiliti.aggregate([
      {
        $match: {
          ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
          ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
          ...(payload.klinik !== 'all' && {
            kodFasilitiHandler: payload.klinik,
          }),
          sekolahSelesaiReten: true,
          jenisFasiliti: { $in: ['sekolah-menengah'] },
        },
      },
      {
        $project: {
          _id: 0,
          jenisFasiliti: 1,
          jenisPerkhidmatanSekolah: 1,
          kodSekolah: 1,
          sesiTakwimSekolah: 1,
          sekolahMmi: 1,
          sekolahKki: 1,
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
                umur: { $gte: 15, $lte: 17 },
                rawatanSekolah: { $exists: true, $ne: [] },
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
          sekolahMmi: 1,
          sekolahKki: 1,
          jenisFasiliti: 1,
          jenisPerkhidmatanSekolah: 1,
          jantina: 1,
          umur: 1,
          keturunan: 1,
          warganegara: 1,
          statusOku: 1,
          tahunTingkatan: 1,
          kelasPelajar: 1,
          merged: {
            $mergeObjects: ['$rawatanSekolah'],
          },
        },
      },
      {
        $match: {
          'merged.tarikhRawatanSemasa': {
            $gte: payload.tarikhMula,
            $lte: payload.tarikhAkhir,
          },
        },
      },
      {
        $facet: {
          sekolahAll: [
            {
              $group: {
                _id: null,
                ...groupSekolah,
              },
            },
          ],
          sekolahOku: [
            {
              $match: {
                statusOku: 'OKU',
              },
            },
            {
              $group: {
                _id: null,
                ...groupSekolah,
              },
            },
          ],
          sekolahOap: [
            {
              $match: {
                keturunan: {
                  $in: [
                    'PENAN',
                    'ORANG ASLI (SEMENANJUNG)',
                    'JAKUN',
                    'NEGRITO',
                    'SAKAI',
                    'SEMAI',
                    'SEMALAI',
                    'TEMIAR',
                    'SENOI',
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                ...groupSekolah,
              },
            },
          ],
        },
      },
    ]);

    bigData.push(dataDM, dataSekolahPemeriksaan, dataSekolahRawatan);

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
      ...ultimateCutoff(payload),
    },
  };

  try {
    let bigData = [];

    const dataOAP = await Umum.aggregate([
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
                kedatangan: 'baru-kedatangan',
                umur: {
                  $gte: 7,
                },
                ibuMengandung: true,
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          imRawatan: [
            {
              $match: {
                umur: {
                  $gte: 7,
                },
                ibuMengandung: true,
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
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
          umumOplain: [
            ...getParamsOplainP2,
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
          imOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                umur: {
                  $gte: 7,
                },
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
          okuOplain: [
            ...getParamsOplainP2,
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
        },
      },
    ]);

    const dataSekolah = await Fasiliti.aggregate([
      {
        $match: {
          ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
          ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
          ...(payload.klinik !== 'all' && {
            kodFasilitiHandler: payload.klinik,
          }),
          sekolahSelesaiReten: true,
          jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
        },
      },
      {
        $project: {
          _id: 0,
          jenisFasiliti: 1,
          jenisPerkhidmatanSekolah: 1,
          kodSekolah: 1,
          sesiTakwimSekolah: 1,
          sekolahMmi: 1,
          sekolahKki: 1,
        },
      },
      {
        $facet: {
          pemeriksaan: [
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
                      keturunan: {
                        $in: [
                          'PENAN',
                          'ORANG ASLI (SEMENANJUNG)',
                          'JAKUN',
                          'NEGRITO',
                          'SAKAI',
                          'SEMAI',
                          'SEMALAI',
                          'TEMIAR',
                          'SENOI',
                        ],
                      },
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
                umur: '$result.umur',
                keturunan: '$result.keturunan',
                warganegara: '$result.warganegara',
                statusOku: '$result.statusOku',
                statusRawatan: '$result.statusRawatan',
                tahunTingkatan: '$result.tahunTingkatan',
                warganegara: '$result.warganegara',
                kelasPelajar: '$result.kelasPelajar',
                jantina: '$result.jantina',
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
                tarikhPemeriksaan:
                  '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
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
                statusRawatan: 1,
                kodSekolah: 1,
                sekolahMmi: 1,
                sekolahKki: 1,
                jenisFasiliti: 1,
                jenisPerkhidmatanSekolah: 1,
                jantina: 1,
                umur: 1,
                keturunan: 1,
                warganegara: 1,
                statusOku: 1,
                tahunTingkatan: 1,
                kelasPelajar: 1,
                tarikhPemeriksaan: 1,
                operatorPemeriksaan: 1,
                tarikhRawatan: '$lastRawatan.tarikhRawatanSemasa',
                operatorRawatan: '$lastRawatan.createdByMdcMdtb',
                kesSelesaiPemeriksaan: '$pemeriksaanSekolah.kesSelesai',
                kesSelesaiIcdasPemeriksaan:
                  '$pemeriksaanSekolah.kesSelesaiIcdas',
                kesSelesaiRawatan: '$rawatanSekolah.kesSelesaiSekolahRawatan',
                kesSelesaiIcdasRawatan:
                  '$rawatanSekolah.kesSelesaiIcdasSekolahRawatan',
                merged: {
                  $mergeObjects: ['$pemeriksaanSekolah'],
                },
              },
            },
            {
              $match: {
                'merged.tarikhPemeriksaanSemasa': {
                  $gte: payload.tarikhMula,
                  $lte: payload.tarikhAkhir,
                },
              },
            },
            {
              $bucket: {
                groupBy: '$umur',
                boundaries: [0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
                default: 'Other',
                output: {
                  ...groupSekolah,
                },
              },
            },
          ],
          rawatan: [
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
                      keturunan: {
                        $in: [
                          'PENAN',
                          'ORANG ASLI (SEMENANJUNG)',
                          'JAKUN',
                          'NEGRITO',
                          'SAKAI',
                          'SEMAI',
                          'SEMALAI',
                          'TEMIAR',
                          'SENOI',
                        ],
                      },
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
                statusRawatan: '$result.statusRawatan',
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
                sekolahMmi: 1,
                sekolahKki: 1,
                jenisFasiliti: 1,
                jenisPerkhidmatanSekolah: 1,
                jantina: 1,
                umur: 1,
                keturunan: 1,
                warganegara: 1,
                statusOku: 1,
                tahunTingkatan: 1,
                kelasPelajar: 1,
                merged: {
                  $mergeObjects: ['$rawatanSekolah'],
                },
              },
            },
            {
              $match: {
                'merged.tarikhRawatanSemasa': {
                  $gte: payload.tarikhMula,
                  $lte: payload.tarikhAkhir,
                },
              },
            },
            {
              $bucket: {
                groupBy: '$umur',
                boundaries: [0, 1, 5, 7, 10, 13, 15, 18, 20, 30, 50, 60, 150],
                default: 'Other',
                output: {
                  ...groupSekolah,
                },
              },
            },
          ],
        },
      },
    ]);

    bigData.push(dataOAP, dataSekolah);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countLiputanOA = async (payload) => {
  const { negeri, daerah, klinik } = payload;

  const match = {
    $match: {
      ...(negeri !== 'all' && { createdByNegeri: negeri }),
      ...(daerah !== 'all' && { createdByDaerah: daerah }),
      ...(klinik !== 'all' && { createdByKodFasiliti: klinik }),
      kumpulanEtnik: { $in: ['orang asli semenanjung'] },
      kedatangan: 'baru-kedatangan',
      jenisFasiliti: { $nin: ['kp', 'kk-kd'] },
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
const countLiputanPenan = async (payload) => {
  const { negeri, daerah, klinik } = payload;

  const match = {
    $match: {
      ...(negeri !== 'all' && { createdByNegeri: negeri }),
      ...(daerah !== 'all' && { createdByDaerah: daerah }),
      ...(klinik !== 'all' && { createdByKodFasiliti: klinik }),
      kumpulanEtnik: { $in: ['penan'] },
      kedatangan: 'baru-kedatangan',
      jenisFasiliti: { $nin: ['kp', 'kk-kd'] },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    },
  };

  const group = {
    $group: {
      _id: '$kumpulanEtnik',
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
      ...(negeri && { createdByNegeri: negeri }),
      ...(daerah && { createdByDaerah: daerah }),
      ...(klinik && { createdByKodFasiliti: klinik }),
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
  const { pilihanKpbMpb } = payload;

  let match = {
    $match: {
      // ...(negeri !== 'all' ? { createdByNegeri: negeri } : []),
      // ...(daerah !== 'all' ? { createdByDaerah: daerah } : []),
      // ...(klinik !== 'all' ? { createdByKodFasiliti: klinik } : []),
      nama: pilihanKpbMpb,
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
              penggunaanKPBMPB: pilihanKpbMpb,
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

  let maklumatAsas;

  if (jenisReten === 'KOM-Komuniti') {
    maklumatAsas = await Event.aggregate([
      {
        $match: {
          jenisEvent: 'projek-komuniti',
          createdByNegeri: payload.negeri,
        },
      },
      {
        $lookup: {
          from: 'umums',
          localField: 'nama',
          foreignField: 'namaProgram',
          as: 'result',
          pipeline: [
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          tarikhStart: 1,
          result: 1,
        },
      },
      {
        $group: {
          _id: null,
          jumlahProjekBulanIni: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        {
                          $month: {
                            $toDate: payload.tarikhMula,
                          },
                        },
                        {
                          $month: {
                            $toDate: '$tarikhStart',
                          },
                        },
                      ],
                    },
                    {
                      $gt: [
                        {
                          $size: '$result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          jumlahProjekSemua: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: '$result',
                    },
                    0,
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
  }

  const currentJenisReten = (async () => {
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
        ...ultimateCutoff(payload),
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

  try {
    const KOM = await Umum.aggregate([
      ...main_switch,
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
                kedatangan: 'baru-kedatangan',
                umur: {
                  $gte: 7,
                },
                ibuMengandung: true,
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          imRawatan: [
            {
              $match: {
                umur: {
                  $gte: 7,
                },
                ibuMengandung: true,
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
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
          oapPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                kumpulanEtnik: {
                  $in: ['orang asli semenanjung', 'penan'],
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
          oapRawatan: [
            {
              $match: {
                kumpulanEtnik: {
                  $in: ['orang asli semenanjung', 'penan'],
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
          dmPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                jenisProgram: 'programDewasaMuda',
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          dmRawatan: [
            {
              $match: {
                jenisProgram: 'programDewasaMuda',
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
              },
            },
          ],
          pkapPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                jenisProgram: 'kampungAngkatPergigian',
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          pkapRawatan: [
            {
              $match: {
                jenisProgram: 'kampungAngkatPergigian',
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
              },
            },
          ],
          pprPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                jenisProgram: 'ppr',
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          pprRawatan: [
            {
              $match: {
                jenisProgram: 'ppr',
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
              },
            },
          ],
          ppkpsPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                jenisProgram: 'ppkps',
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          ppkpsRawatan: [
            {
              $match: {
                jenisProgram: 'ppkps',
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
              },
            },
          ],
          ikkPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                jenisProgram: 'oku',
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          ikkRawatan: [
            {
              $match: {
                jenisProgram: 'oku',
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
              },
            },
          ],
          iwePemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                jenisProgram: 'we',
              },
            },
            {
              $group: {
                _id: null,
                ...groupPemeriksaanBiasa,
              },
            },
          ],
          iweRawatan: [
            {
              $match: {
                jenisProgram: 'we',
              },
            },
            {
              $group: {
                _id: null,
                ...groupRawatanBiasa,
              },
            },
          ],
          kpbMpbPemeriksaan: [
            {
              $match: {
                kedatangan: 'baru-kedatangan',
                menggunakanKPBMPB: {
                  $eq: 'ya-menggunakan-kpb-mpb',
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
          kpbMpbRawatan: [
            {
              $match: {
                menggunakanKPBMPB: {
                  $eq: 'ya-menggunakan-kpb-mpb',
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
          // op lain
          umumOplain: [
            ...getParamsOplainP2,
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
          imOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                umur: {
                  $gte: 7,
                },
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
          okuOplain: [
            ...getParamsOplainP2,
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
          bwOplain: [
            ...getParamsOplainP2,
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
                ...groupOplain,
              },
            },
          ],
          oapOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                kumpulanEtnik: {
                  $in: ['orang asli semenanjung', 'penan'],
                },
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          dmOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                jenisProgram: 'programDewasaMuda',
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          pkapOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                jenisProgram: 'kampungAngkatPergigian',
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          pprOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                jenisProgram: 'ppr',
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          ppkpsOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                jenisProgram: 'ppkps',
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          ikkOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                jenisProgram: 'oku',
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          iweOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                jenisProgram: 'we',
              },
            },
            {
              $group: {
                _id: null,
                ...groupOplain,
              },
            },
          ],
          kpbMpbOplain: [
            ...getParamsOplainP2,
            {
              $match: {
                menggunakanKPBMPB: {
                  $eq: 'ya-menggunakan-kpb-mpb',
                },
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

    return KOM;
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
        ...ultimateCutoff(payload),
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
              $and: [
                {
                  $eq: [
                    '$disaringProgramKanserMulutPemeriksaanUmum',
                    'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
                  ],
                },
                {
                  $ne: ['$kumpulanEtnik', 'bukan warganegara'],
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
    //       ...getParamsOplainP2,
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
            ...ultimateCutoff(payload),
            ...(klinik === 'rtc-tunjung'
              ? {}
              : { createdByKp: { $regex: /rtc/i } }),
          },
        };
      case 'UTC':
        return {
          $match: {
            ...getParamsUTCRTC(payload),
            ...ultimateCutoff(payload),
            createdByKp: { $regex: /utc/i },
          },
        };
      default:
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
              $and: [
                {
                  $eq: [
                    '$disaringProgramKanserMulutPemeriksaanUmum',
                    'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
                  ],
                },
                {
                  $ne: ['$kumpulanEtnik', 'bukan warganegara'],
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
              $and: [
                {
                  $eq: [
                    '$disaringProgramKanserMulutPemeriksaanUmum',
                    'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
                  ],
                },
                {
                  $ne: ['$kumpulanEtnik', 'bukan warganegara'],
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

  //

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let dataOperatorLain = [];
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

    // for (let i = 0; i < match_stage_operatorLain.length; i++) {
    //   const pipeline = [
    //     main_switch(),
    //     match_stage_operatorLain[i],
    //     ...getParamsOplainP2,
    //     group_operatorLain,
    //   ];
    //   const queryUTCRTCOperatorLain = await Umum.aggregate(pipeline);
    //   dataOperatorLain.push({ queryUTCRTCOperatorLain });
    // }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    bigData.push(dataOperatorLain);

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
        ...ultimateCutoff(payload),
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
              $and: [
                {
                  $eq: [
                    '$disaringProgramKanserMulutPemeriksaanUmum',
                    'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
                  ],
                },
                {
                  $ne: ['$kumpulanEtnik', 'bukan warganegara'],
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
    //       ...getParamsOplainP2,
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
        ...ultimateCutoff(payload),
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
              $and: [
                {
                  $eq: [
                    '$disaringProgramKanserMulutPemeriksaanUmum',
                    'ya-disaring-program-kanser-mulut-pemeriksaan-umum',
                  ],
                },
                {
                  $ne: ['$kumpulanEtnik', 'bukan warganegara'],
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
      // console.log(queryPKAP2Pemeriksaan);
      dataPemeriksaan.push({ queryPKAP2Pemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [...main_switch, match_stage[i], group];
      const queryPKAP2Rawatan = await Umum.aggregate(pipeline);
      // console.log(queryPKAP2Rawatan);
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
    //       ...getParamsOplainP2,
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
  countCPPC1,
  countCPPC2,
  countDEWASAMUDA,
  countOAP,
  countLiputanOA,
  countLiputanPenan,
  countKPBMPBHarian,
  countKPBMPBBulanan,
  countKOM,
  countPPR,
  countUTCRTC,
  countPPKPS,
  // pkap 1
  countPKAP2,
};

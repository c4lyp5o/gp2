const moment = require('moment');
const {
  ultimateCutoff,
  getParamsTOD,
  getParamsOplainP2,
} = require('./countHelperParams');
const sesiTakwimSekolah = require('../controllers/helpers/sesiTakwimSekolah');

// the mother of all pipeline sekolah
const pipelineSekolahPemeriksaan = (payload) => {
  const sesiTakwim = sesiTakwimSekolah();

  const { tarikhMula, tarikhAkhir } = payload;

  const mula = moment(tarikhMula).format('MM-DD');
  const akhir = moment(tarikhAkhir).format('MM-DD');

  return [
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
        sekolahSelesaiReten: true,
        ...(mula === '01-01' && akhir === '06-30'
          ? {
              tarikhSekolahSelesaiReten: {
                $lte: '2023-07-06',
              },
            }
          : {
              tarikhSekolahSelesaiReten: {
                $gte: tarikhMula,
                $lte: tarikhAkhir,
              },
            }),
        sesiTakwimSekolah: sesiTakwim,
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
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: {
                $ne: null,
              },
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
        kesSelesaiIcdasRawatan: '$rawatanSekolah.kesSelesaiIcdasSekolahRawatan',
        merged: {
          $mergeObjects: ['$pemeriksaanSekolah'],
        },
      },
    },
    {
      $match: {
        ...(payload.menengahMmi === 'jana-menengah-mmi' && {
          $or: [
            {
              $and: [
                { jenisFasiliti: 'sekolah-menengah' },
                { sekolahMmi: 'ya-sekolah-mmi' },
              ],
            },
          ],
        }),
      },
    },
  ];
};

const pipelineSekolahRawatan = (payload) => {
  const sesiTakwim = sesiTakwimSekolah();

  const { tarikhMula, tarikhAkhir } = payload;

  const mula = moment(tarikhMula).format('MM-DD');
  const akhir = moment(tarikhAkhir).format('MM-DD');

  return [
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
        sekolahSelesaiReten: true,
        ...(mula === '01-01' && akhir === '06-30'
          ? {
              tarikhSekolahSelesaiReten: {
                $lte: '2023-07-06',
              },
            }
          : {
              tarikhSekolahSelesaiReten: {
                $gte: tarikhMula,
                $lte: tarikhAkhir,
              },
            }),
        sesiTakwimSekolah: sesiTakwim,
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
              sesiTakwimPelajar: sesiTakwim,
              rawatanSekolah: {
                $ne: [],
              },
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
        ...(payload.menengahMmi === 'jana-menengah-mmi' && {
          $or: [
            {
              $and: [
                { jenisFasiliti: 'sekolah-menengah' },
                { sekolahMmi: 'ya-sekolah-mmi' },
              ],
            },
          ],
        }),
      },
    },
  ];
};

const pipelineEnrolmenSekolah = (payload, jenis) => {
  const sesiTakwim = sesiTakwimSekolah();

  return [
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && {
          kodFasilitiHandler: payload.klinik,
        }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
        ...(jenis === 'pgs201' && { sekolahSelesaiReten: true }),
        sesiTakwimSekolah: sesiTakwim,
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
              sesiTakwimPelajar: sesiTakwim,
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
        statusOku: '$result.statusOku',
        tahunTingkatan: '$result.tahunTingkatan',
      },
    },
    {
      $project: {
        result: 0,
      },
    },
  ];
};

const pipelineTutupSekolah = (payload) => {
  const sesiTakwim = sesiTakwimSekolah();

  return [
    {
      $match: {
        jenisFasiliti: {
          $in: ['sekolah-rendah', 'sekolah-menengah'],
        },
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && {
          kodFasilitiHandler: payload.klinik,
        }),
      },
    },
    {
      $project: {
        _id: 1,
        jenisFasiliti: 1,
        jenisPerkhidmatanSekolah: 1,
        kodSekolah: 1,
        sesiTakwimSekolah: 1,
        sekolahSelesaiReten: 1,
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
              sesiTakwimPelajar: sesiTakwim,
              pemeriksaanSekolah: { $ne: null },
            },
          },
          {
            $limit: 1,
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        semuaSekolah: {
          $sum: 1,
        },
        semuaSekolahTutupReten: {
          $sum: {
            $cond: [
              {
                $eq: ['$sekolahSelesaiReten', true],
              },
              1,
              0,
            ],
          },
        },
        liputanSRKKIKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKKIKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKKIKPSSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        liputanSRKKIKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKKIKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKKIKPBSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        liputanSRKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKPSSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        liputanSRKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSRKPBSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        liputanSMKKIKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKKIKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKKIKPSSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        liputanSMKKIKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKKIKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKKIKPBSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        liputanSMKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKPS: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKPSSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        liputanSMKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $gt: [{ $size: '$result' }, 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKPB: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        semuaSMKPBSelesai: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                  {
                    $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                  },
                  {
                    $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
                  },
                  {
                    $eq: ['$sekolahSelesaiReten', true],
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
};

// pipeline kepp
const pipelineKepp = (payload) => {
  return [
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && {
          createdByKodFasiliti: payload.klinik,
        }),
        statusReten: {
          $in: ['telah diisi', 'reten salah'],
        },
        kepp: true,
        deleted: false,
        statusKehadiran: false,
        onCall: { $in: [null, false] },
        ...ultimateCutoff(payload),
      },
    },
    {
      $group: {
        _id: '$createdByKodFasiliti',
        jumlah: { $sum: 1 },
        jumlahSalah: {
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
        kodFasiliti: {
          $first: '$createdByKodFasiliti',
        },
        namaKepp: {
          $first: '$createdByKp',
        },
        jumlahPegawaiKepp: {
          $addToSet: '$createdByMdcMdtb',
        },
        kedatanganBaru: {
          $sum: {
            $cond: [
              {
                $eq: ['$kedatanganKepp', 'baru-kedatangan-kepp'],
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
                $eq: ['$kedatanganKepp', 'ulangan-kedatangan-kepp'],
              },
              1,
              0,
            ],
          },
        },
        jumlahKesEndoPerluAnt: {
          $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
        },
        jumlahKesEndoPerluPremolar: {
          $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
        },
        jumlahKesEndoPerluMolar: {
          $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
        },
        jumlahKesEndoPerluRedoDariKp: {
          $sum: '$rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum',
        },
        jumlahKesEndoSelesaiAnt: {
          $sum: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
        },
        jumlahKesEndoSelesaiPremolar: {
          $sum: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
        },
        jumlahKesEndoSelesaiMolar: {
          $sum: '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
        },
        jumlahKesEndoSelesaiRedoDariKp: {
          $sum: '$rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum',
        },
        jumlahKesEndoRedoDiKeppAnt: {
          $sum: '$jumlahAnteriorRawatanSemulaKeppRawatanUmum',
        },
        jumlahKesEndoRedoDiKeppPremolar: {
          $sum: '$jumlahPremolarRawatanSemulaKeppRawatanUmum',
        },
        jumlahKesEndoRedoDiKeppMolar: {
          $sum: '$jumlahPremolarRawatanSemulaKeppRawatanUmum',
        },
        jumlahKodRDITN3: {
          $sum: {
            $cond: [
              {
                $eq: ['$memenuhiRditnKod3KesRujukUpprRawatanUmum', true],
              },
              1,
              0,
            ],
          },
        },
        jumlahRestoPascaEndo: {
          $sum: {
            $cond: [
              {
                $eq: ['$restorasiPascaEndodontikKesRujukUpprRawatanUmum', true],
              },
              1,
              0,
            ],
          },
        },
        jumlahKomplikasiDiKEPP: {
          $sum: {
            $cond: [
              {
                $eq: [
                  '$komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum',
                  true,
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
        _id: 0,
        klinik: '$namaKepp',
        jumlahPegawaiKepp: {
          $size: '$jumlahPegawaiKepp',
        },
        kedatanganBaru: 1,
        kedatanganUlangan: 1,
        jumlahKesEndoPerluAnt: 1,
        jumlahKesEndoPerluPremolar: 1,
        jumlahKesEndoPerluMolar: 1,
        jumlahKesEndoPerluRedoDariKp: 1,
        jumlahKesEndoSelesaiAnt: 1,
        jumlahKesEndoSelesaiPremolar: 1,
        jumlahKesEndoSelesaiMolar: 1,
        jumlahKesEndoSelesaiRedoDariKp: 1,
        jumlahKesEndoRedoDiKeppAnt: 1,
        jumlahKesEndoRedoDiKeppPremolar: 1,
        jumlahKesEndoRedoDiKeppMolar: 1,
        jumlahKodRDITN3: 1,
        jumlahRestoPascaEndo: 1,
        jumlahKomplikasiDiKEPP: 1,
      },
    },
  ];
};

// pipeline tod dan perkakasnya
const tambahFieldKiraCRA = {
  $addFields: {
    jumlahFaktorRisiko: {
      $cond: {
        if: {
          $eq: [
            {
              $ifNull: ['$jumlahFaktorRisikoPemeriksaanUmum', ''],
            },
            '',
          ],
        },
        then: 0,
        else: { $toInt: '$jumlahFaktorRisikoPemeriksaanUmum' },
      },
    },
  },
};

const groupBaruTod = {
  $group: {
    _id: '$jenisFasiliti',
    // stats
    jumlahReten: {
      $sum: 1,
    },
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
            $eq: ['$kedatangan', 'baru-kedatangan'],
          },
          1,
          0,
        ],
      },
    },
    // perlu rawatan
    jumlahd: {
      $sum: '$dAdaGigiDesidusPemeriksaanUmum',
    },
    jumlahf: {
      $sum: '$fAdaGigiDesidusPemeriksaanUmum',
    },
    jumlahx: {
      $sum: '$xAdaGigiDesidusPemeriksaanUmum',
    },
    jumlahdfx: {
      $sum: {
        $add: [
          '$dAdaGigiDesidusPemeriksaanUmum',
          '$fAdaGigiDesidusPemeriksaanUmum',
          '$xAdaGigiDesidusPemeriksaanUmum',
        ],
      },
    },
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
              {
                $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
              },
              {
                $eq: ['$fAdaGigiDesidusPemeriksaanUmum', 0],
              },
              {
                $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
              },
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
            $and: [
              {
                $eq: ['$kebersihanMulutOralHygienePemeriksaanUmum', 'A'],
              },
              {
                $eq: [
                  '$yaTidakPesakitMempunyaiGigi',
                  'ya-pesakit-mempunyai-gigi',
                ],
              },
            ],
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
            $and: [
              {
                $eq: ['$kebersihanMulutOralHygienePemeriksaanUmum', 'C'],
              },
              {
                $eq: [
                  '$yaTidakPesakitMempunyaiGigi',
                  'ya-pesakit-mempunyai-gigi',
                ],
              },
            ],
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
            $and: [
              {
                $eq: ['$kebersihanMulutOralHygienePemeriksaanUmum', 'E'],
              },
              {
                $eq: [
                  '$yaTidakPesakitMempunyaiGigi',
                  'ya-pesakit-mempunyai-gigi',
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
      $sum: {
        $cond: [
          {
            $or: [
              // baby punya kira
              {
                $and: [
                  {
                    $lt: ['$umurTahunLahir', 1],
                  },
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
                  {
                    $lt: ['$umurTahunLahir', 1],
                  },
                  {
                    $eq: ['$adaDesidusPemeriksaanUmum', true],
                  },
                  {
                    $eq: ['$adaKekalPemeriksaanUmum', false],
                  },
                  {
                    $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                ],
              },
              // 1 tahun
              {
                $and: [
                  {
                    $gte: ['$umurTahunLahir', 1],
                  },
                  {
                    $eq: ['$adaDesidusPemeriksaanUmum', true],
                  },
                  {
                    $eq: ['$adaKekalPemeriksaanUmum', false],
                  },
                  {
                    $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                  },
                ],
              },
              {
                $and: [
                  {
                    $gte: ['$umurTahunLahir', 1],
                  },
                  {
                    $eq: ['$adaDesidusPemeriksaanUmum', true],
                  },
                  {
                    $eq: ['$adaKekalPemeriksaanUmum', true],
                  },
                  {
                    $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                  },
                ],
              },
              {
                $and: [
                  {
                    $gte: ['$umurTahunLahir', 1],
                  },
                  {
                    $eq: ['$adaDesidusPemeriksaanUmum', false],
                  },
                  {
                    $eq: ['$adaKekalPemeriksaanUmum', true],
                  },
                  {
                    $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$perluPenskaleranPemeriksaanUmum', false],
                  },
                ],
              },
              {
                $and: [
                  {
                    $gte: ['$umurTahunLahir', 5],
                  },
                  {
                    $lte: ['$umurTahunLahir', 14],
                  },
                  {
                    $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
                  },
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
                  {
                    $gte: ['$umurTahunLahir', 15],
                  },
                  {
                    $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0],
                  },
                  {
                    $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
                  },
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
                  {
                    $gte: ['$umurTahunLahir', 1],
                  },
                  {
                    $eq: ['$adaDesidusPemeriksaanUmum', false],
                  },
                  {
                    $eq: ['$adaKekalPemeriksaanUmum', false],
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
    jumlahKecederaanTisuLembut: {
      $sum: {
        $cond: [
          {
            $eq: ['$kecederaanTisuLembutUmum', true],
          },
          1,
          0,
        ],
      },
    },
    jumlahKecederaanTisuKeras: {
      $sum: {
        $cond: [
          {
            $eq: ['$kecederaanGigiUmum', true], // TODO gabung kecederaanGigiUmum & kecederaanTulangMukaUmum
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
    sudahSapuanFluorida: {
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
    jumlahTampalanAnteriorBaru: {
      $sum: {
        $add: [
          '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        ],
      },
    },
    jumlahTampalanPosteriorBaru: {
      $sum: {
        $add: [
          '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          // nnti tambah semula posterior sewarna
          '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
          // nnti tambah semula posterior amalgam
        ],
      },
    },
    craRendah: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $lte: [
                  {
                    $toInt: '$jumlahFaktorRisiko',
                  },
                  2,
                ],
              },
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
              {
                $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0],
              },
              {
                $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0],
              },
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
                    $gte: [
                      {
                        $toInt: '$jumlahFaktorRisiko',
                      },
                      3,
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
                    $eq: [
                      {
                        $toInt: '$jumlahFaktorRisiko',
                      },
                      0,
                    ],
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
                        $gte: [
                          {
                            $toInt: '$jumlahFaktorRisiko',
                          },
                          1,
                        ],
                      },
                      {
                        $lte: [
                          {
                            $toInt: '$jumlahFaktorRisiko',
                          },
                          2,
                        ],
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
                    $gte: [
                      {
                        $toInt: '$jumlahFaktorRisiko',
                      },
                      3,
                    ],
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
};

const groupBuTod = {
  $group: {
    _id: '$jenisFasiliti',
    // stats
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
    perluSapuanFluoridaBu: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: [
                  '$fvPerluSapuanPemeriksaanUmum',
                  'ya-fv-perlu-sapuan-pemeriksaan-umum',
                ],
              },
              {
                $eq: ['$kedatangan', 'ulangan-kedatangan'],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    sudahSapuanFluoridaBu: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$pesakitDibuatFluorideVarnish', true],
              },
              {
                $eq: ['$kedatangan', 'ulangan-kedatangan'],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    jumlahTampalanAnteriorBu: {
      $sum: {
        $add: [
          '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        ],
      },
    },
    jumlahTampalanPosteriorBu: {
      $sum: {
        $add: [
          '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          // nnti tambah semula posterior sewarna
          '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
          // nnti tambah semula posterior amalgam
        ],
      },
    },
    jumlahCabutan: {
      $sum: '$cabutDesidusRawatanUmum',
    },
    jumlahAbses: {
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
    jumlahPulpotomi: {
      $sum: {
        $add: [
          '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum',
          '$jumlahPremolarKesEndodontikSelesaiRawatanUmum',
          '$jumlahMolarKesEndodontikSelesaiRawatanUmum',
          '$rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum',
        ],
      },
    },
    rujukanAgensiLuar: {
      $sum: {
        $cond: [
          {
            $or: [
              {
                $eq: ['$rujukDaripada', 'hospital/institusi-kerajaan'],
              },
              { $eq: ['$rujukDaripada', 'swasta'] },
              { $eq: ['$rujukDaripada', 'lain-lain'] },
            ],
          },
          1,
          0,
        ],
      },
    },
  },
};

const groupOplainTod = {
  $group: {
    _id: '$jenisFasiliti',
    // dibuat rawatan
    perluSapuanFluoridaBu: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: [
                  '$fvPerluSapuanPemeriksaanUmum',
                  'ya-fv-perlu-sapuan-pemeriksaan-umum',
                ],
              },
              {
                $eq: ['$kedatangan', 'ulangan-kedatangan'],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    sudahSapuanFluoridaBu: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$pesakitDibuatFluorideVarnish', true],
              },
              {
                $eq: ['$kedatangan', 'ulangan-kedatangan'],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    jumlahTampalanAnteriorBu: {
      $sum: {
        $add: [
          {
            $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          },
          {
            $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          },
        ],
      },
    },
    jumlahTampalanPosteriorBu: {
      $sum: {
        $add: [
          {
            $toInt: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          },
          {
            $toInt: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
          },
          // nnti tambah semula posterior sewarna
          // nnti tambah semula posterior amalgam
        ],
      },
    },
    jumlahCabutan: {
      $sum: { $toInt: '$cabutDesidusRawatanUmum' },
    },
    jumlahAbses: {
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
    jumlahPulpotomi: {
      $sum: {
        $add: [
          { $toInt: '$jumlahAnteriorKesEndodontikSelesaiRawatanUmum' },
          { $toInt: '$jumlahPremolarKesEndodontikSelesaiRawatanUmum' },
          { $toInt: '$jumlahMolarKesEndodontikSelesaiRawatanUmum' },
          {
            $toInt:
              '$rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum',
          },
        ],
      },
    },
    rujukanAgensiLuar: {
      $sum: {
        $cond: [
          {
            $or: [
              {
                $eq: ['$rujukDaripada', 'hospital/institusi-kerajaan'],
              },
              { $eq: ['$rujukDaripada', 'swasta'] },
              { $eq: ['$rujukDaripada', 'lain-lain'] },
            ],
          },
          1,
          0,
        ],
      },
    },
  },
};

const pipelineTod = (payload) => {
  return [
    {
      $match: {
        ...getParamsTOD(payload),
        ...ultimateCutoff(payload),
        $expr: {
          $lte: [
            {
              $subtract: [
                new Date().getFullYear(),
                {
                  $toInt: {
                    $substr: ['$tarikhLahir', 0, 4],
                  },
                },
              ],
            },
            4,
          ],
        },
      },
    },
    {
      $facet: {
        baru_taska: [
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
              statusPerkhidmatan: '$fasiliti_data.statusPerkhidmatan',
            },
          },
          {
            $project: {
              fasiliti_data: 0,
            },
          },
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              jenisFasiliti: 'taska-tadika',
              statusPerkhidmatan: 'active',
              kodTastad: {
                $regex: /tas/i,
              },
            },
          },
          tambahFieldKiraCRA,
          groupBaruTod,
        ],
        baru_tadika: [
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
              statusPerkhidmatan: '$fasiliti_data.statusPerkhidmatan',
            },
          },
          {
            $project: {
              fasiliti_data: 0,
            },
          },
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              jenisFasiliti: 'taska-tadika',
              statusPerkhidmatan: 'active',
              kodTastad: {
                $regex: /tad/i,
              },
            },
          },
          tambahFieldKiraCRA,
          groupBaruTod,
        ],
        baru_kkia: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              jenisFasiliti: 'kk-kd',
            },
          },
          tambahFieldKiraCRA,
          groupBaruTod,
        ],
        baru_op: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              jenisFasiliti: 'kp',
            },
          },
          tambahFieldKiraCRA,
          groupBaruTod,
        ],
        baru_outreach: [
          {
            $match: {
              kedatangan: 'baru-kedatangan',
              jenisFasiliti: 'projek-komuniti-lain',
            },
          },
          tambahFieldKiraCRA,
          groupBaruTod,
        ],
        baruUlangan_taska: [
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
              statusPerkhidmatan: '$fasiliti_data.statusPerkhidmatan',
            },
          },
          {
            $project: {
              fasiliti_data: 0,
            },
          },
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'taska-tadika',
              statusPerkhidmatan: 'active',
              kodTastad: {
                $regex: /tas/i,
              },
            },
          },
          groupBuTod,
        ],
        baruUlangan_tadika: [
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
              statusPerkhidmatan: '$fasiliti_data.statusPerkhidmatan',
            },
          },
          {
            $project: {
              fasiliti_data: 0,
            },
          },
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'taska-tadika',
              statusPerkhidmatan: 'active',
              kodTastad: {
                $regex: /tad/i,
              },
            },
          },
          groupBuTod,
        ],
        baruUlangan_kkia: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'kk-kd',
            },
          },
          groupBuTod,
        ],
        baruUlangan_op: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'kp',
            },
          },
          groupBuTod,
        ],
        baruUlangan_outreach: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'projek-komuniti-lain',
            },
          },
          groupBuTod,
        ],
        opLain_taska: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'taska-tadika',
              statusPerkhidmatan: 'active',
              kodTastad: {
                $regex: /tas/i,
              },
            },
          },
          ...getParamsOplainP2,
          groupOplainTod,
        ],
        opLain_tadika: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'taska-tadika',
              statusPerkhidmatan: 'active',
              kodTastad: {
                $regex: /tad/i,
              },
            },
          },
          ...getParamsOplainP2,
          groupOplainTod,
        ],
        opLain_kkia: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'kk-kd',
            },
          },
          ...getParamsOplainP2,
          groupOplainTod,
        ],
        opLain_op: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'kp',
            },
          },
          ...getParamsOplainP2,
          groupOplainTod,
        ],
        opLain_outreach: [
          {
            $match: {
              kedatangan: 'ulangan-kedatangan',
              jenisFasiliti: 'projek-komuniti-lain',
            },
          },
          ...getParamsOplainP2,
          groupOplainTod,
        ],
      },
    },
  ];
};

// pipeline begin
const pipelineBegin = (payload) => {
  return [
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && {
          kodFasilitiHandler: payload.klinik,
        }),
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
              umur: {
                $lte: 12,
              },
              pemeriksaanSekolah: {
                $ne: null,
              },
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
        tahunTingkatan: '$result.tahunTingkatan',
        pemeriksaanSekolah: '$result.pemeriksaanSekolah',
        tarikhMelaksanakanBegin: '$result.tarikhMelaksanakanBegin',
        namaPelaksanaBegin: '$result.namaPelaksanaBegin',
      },
    },
    {
      $lookup: {
        from: 'pemeriksaansekolahs',
        localField: 'pemeriksaanSekolah',
        foreignField: '_id',
        as: 'result_pem',
      },
    },
    {
      $unwind: '$result_pem',
    },
    {
      $addFields: {
        tahapFaktorRisikoKaries: '$result_pem.penandaRisikoKaries',
      },
    },
    {
      $project: {
        _id: 0,
        result: 0,
        result_pem: 0,
        pemeriksaanSekolah: 0,
      },
    },
    {
      $facet: {
        prasekolah: [
          {
            $match: {
              tahunTingkatan: 'PRASEKOLAH',
            },
          },
          {
            $group: {
              _id: null,
              jumlah: {
                $sum: 1,
              },
              jumlahMB: {
                $sum: {
                  $cond: [
                    {
                      $ne: ['$tarikhMelaksanakanBegin', ''],
                    },
                    1,
                    0,
                  ],
                },
              },
              //
              jumlahFasilitiMB: {
                $addToSet: '$kodSekolah',
              },
              jumlahCRARendah: {
                $sum: {
                  $cond: [
                    {
                      $eq: ['$tahapFaktorRisikoKaries', 'rendah'],
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
                      $eq: ['$tahapFaktorRisikoKaries', 'sederhana'],
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
                      $eq: ['$tahapFaktorRisikoKaries', 'tinggi'],
                    },
                    1,
                    0,
                  ],
                },
              },
              //
            },
          },
          {
            $project: {
              _id: 0,
              jumlah: 1,
              jumlahMB: 1,
              jumlahFasilitiMB: {
                $size: '$jumlahFasilitiMB',
              },
              jumlahCRARendah: 1,
              jumlahCRASederhana: 1,
              jumlahCRATinggi: 1,
            },
          },
        ],
        darjah1: [
          {
            $match: {
              tahunTingkatan: 'D1',
            },
          },
          {
            $group: {
              _id: null,
              jumlah: {
                $sum: 1,
              },
              jumlahMB: {
                $sum: {
                  $cond: [
                    {
                      $ne: ['$tarikhMelaksanakanBegin', ''],
                    },
                    1,
                    0,
                  ],
                },
              },
              //
              jumlahFasilitiMB: {
                $addToSet: '$kodSekolah',
              },
              jumlahCRARendah: {
                $sum: {
                  $cond: [
                    {
                      $eq: ['$tahapFaktorRisikoKaries', 'rendah'],
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
                      $eq: ['$tahapFaktorRisikoKaries', 'sederhana'],
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
                      $eq: ['$tahapFaktorRisikoKaries', 'tinggi'],
                    },
                    1,
                    0,
                  ],
                },
              },
              //
            },
          },
          {
            $project: {
              _id: 0,
              jumlah: 1,
              jumlahMB: 1,
              jumlahFasilitiMB: {
                $size: '$jumlahFasilitiMB',
              },
              jumlahCRARendah: 1,
              jumlahCRASederhana: 1,
              jumlahCRATinggi: 1,
            },
          },
        ],
        lebihDarjah1: [
          {
            $match: {
              tahunTingkatan: {
                $nin: ['PRASEKOLAH', 'D1'],
              },
              sekolahKki: 'tidak-sekolah-kki',
            },
          },
          {
            $group: {
              _id: null,
              jumlah: {
                $sum: 1,
              },
              jumlahMB: {
                $sum: {
                  $cond: [
                    {
                      $ne: ['$tarikhMelaksanakanBegin', ''],
                    },
                    1,
                    0,
                  ],
                },
              },
              //
              jumlahFasilitiMB: {
                $addToSet: '$kodSekolah',
              },
              jumlahCRARendah: {
                $sum: {
                  $cond: [
                    {
                      $eq: ['$tahapFaktorRisikoKaries', 'rendah'],
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
                      $eq: ['$tahapFaktorRisikoKaries', 'sederhana'],
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
                      $eq: ['$tahapFaktorRisikoKaries', 'tinggi'],
                    },
                    1,
                    0,
                  ],
                },
              },
              //
              jumlahCRATinggiBuatBegin: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        {
                          $eq: ['$tahapFaktorRisikoKaries', 'tinggi'],
                        },
                        {
                          $ne: ['$tarikhMelaksanakanBegin', ''],
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
              _id: 0,
              jumlah: 1,
              jumlahMB: 1,
              jumlahFasilitiMB: {
                $size: '$jumlahFasilitiMB',
              },
              jumlahCRARendah: 1,
              jumlahCRASederhana: 1,
              jumlahCRATinggi: 1,
              jumlahCRATinggiBuatBegin: 1,
            },
          },
        ],
      },
    },
  ];
};

// id data dan enrolmen 201
const id201Biasa = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              { $eq: ['$umur', 5] },
              { $eq: ['$tahunTingkatan', 'PRASEKOLAH'] },
            ],
          },
          then: 'prasek-5tahun',
        },
        {
          case: {
            $and: [
              { $eq: ['$umur', 6] },
              { $eq: ['$tahunTingkatan', 'PRASEKOLAH'] },
            ],
          },
          then: 'prasek-6tahun',
        },
        {
          case: {
            $and: [
              { $eq: ['$umur', 7] },
              { $eq: ['$tahunTingkatan', 'PRASEKOLAH'] },
            ],
          },
          then: 'prasek-7tahun',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'D1'],
          },
          then: 'darjah1',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'D2'],
          },
          then: 'darjah2',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'D3'],
          },
          then: 'darjah3',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'D4'],
          },
          then: 'darjah4',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'D5'],
          },
          then: 'darjah5',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'D6'],
          },
          then: 'darjah6',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'P'],
          },
          then: 'tingkatanPeralihan',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'T1'],
          },
          then: 'tingkatan1',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'T2'],
          },
          then: 'tingkatan2',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'T3'],
          },
          then: 'tingkatan3',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'T4'],
          },
          then: 'tingkatan4',
        },
        {
          case: {
            $eq: ['$tahunTingkatan', 'T5'],
          },
          then: 'tingkatan5',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id201KhasKham = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              {
                $eq: ['$statusOku', 'OKU'],
              },
              {
                $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
            ],
          },
          then: 'prasek-oku',
        },
        {
          case: {
            $or: [
              {
                $eq: ['$tahunTingkatan', 'KHAS'],
              },
            ],
          },
          then: 'darjah-khas',
        },
        {
          case: {
            $or: [
              {
                $eq: ['$tahunTingkatan', 'KHAM'],
              },
            ],
          },
          then: 'tingkatan-khas',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id201OAP = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'prasek-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'D1'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'darjah1-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'D6'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'darjah6-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'T4'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'tingkatan4-oap',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id201AllOAP = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'all-oap',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id201AllOKU = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $or: [
              {
                $eq: ['$tahunTingkatan', 'KHAS'],
              },
              {
                $eq: ['$tahunTingkatan', 'KHAM'],
              },
              {
                $eq: ['$sekolahKki', 'ya-sekolah-kki'],
              },
            ],
          },
          then: 'all-oku',
        },
      ],
      default: 'Unknown',
    },
  },
};

// id data dan enrolmen 203
const id203KPSKPB = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
          },
          then: 'prasekolah',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'KHAS'],
              },
            ],
          },
          then: 'darjah-khas',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'KHAM'],
              },
            ],
          },
          then: 'tingkatan-khas',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'D1'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
              },
            ],
          },
          then: 'darjah1-kps',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'D1'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
              },
            ],
          },
          then: 'darjah1-kpb',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'D6'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
              },
            ],
          },
          then: 'darjah6-kps',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'D6'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
              },
            ],
          },
          then: 'darjah6-kpb',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'T4'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
              },
            ],
          },
          then: 'tingkatan4-kps',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$tahunTingkatan', 'T4'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
              },
            ],
          },
          then: 'tingkatan4-kpb',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id203KKI = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
              {
                $eq: ['$statusOku', 'OKU'],
              },
            ],
          },
          then: 'prasek-oku',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'ya-sekolah-kki'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-rendah'],
              },
            ],
          },
          then: 'darjah-kki-all-kpb',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'ya-sekolah-kki'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-rendah'],
              },
            ],
          },
          then: 'darjah-kki-all-kps',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'ya-sekolah-kki'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-menengah'],
              },
            ],
          },
          then: 'tingkatan-kki-all-kpb',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'ya-sekolah-kki'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-menengah'],
              },
            ],
          },
          then: 'tingkatan-kki-all-kps',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id203OAP = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'prasek-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'D1'],
              },
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'darjah1-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'D6'],
              },
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'darjah6-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$tahunTingkatan', 'T4'],
              },
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'tingkatan4-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$jenisFasiliti', 'sekolah-rendah'],
              },
              {
                $eq: ['$sekolahKki', 'ya-sekolah-kki'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'darjah-kki-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$jenisFasiliti', 'sekolah-menengah'],
              },
              {
                $eq: ['$sekolahKki', 'ya-sekolah-kki'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'tingkatan-kki-oap',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id203AllKPSKPB = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              {
                $ne: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-rendah'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
              },
            ],
          },
          then: 'darjah-all-kps',
        },
        {
          case: {
            $and: [
              {
                $ne: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-rendah'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
              },
            ],
          },
          then: 'darjah-all-kpb',
        },
        {
          case: {
            $and: [
              {
                $ne: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-menengah'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
              },
            ],
          },
          then: 'tingkatan-all-kps',
        },
        {
          case: {
            $and: [
              {
                $ne: ['$tahunTingkatan', 'PRASEKOLAH'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-menengah'],
              },
              {
                $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
              },
            ],
          },
          then: 'tingkatan-all-kpb',
        },
      ],
      default: 'Unknown',
    },
  },
};
const id203AllOAP = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-rendah'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'darjah-all-oap',
        },
        {
          case: {
            $and: [
              {
                $eq: ['$sekolahKki', 'tidak-sekolah-kki'],
              },
              {
                $eq: ['$jenisFasiliti', 'sekolah-menengah'],
              },
              {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
            ],
          },
          then: 'tingkatan-all-oap',
        },
      ],
      default: 'Unknown',
    },
  },
};

// id data dan enrolmen ppim03
const idPPIM03All = {
  _id: {
    $switch: {
      branches: [
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'D1'] },
            ],
          },
          then: 'darjah1',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'D2'] },
            ],
          },
          then: 'darjah2',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'D3'] },
            ],
          },
          then: 'darjah3',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'D4'] },
            ],
          },
          then: 'darjah4',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'D5'] },
            ],
          },
          then: 'darjah5',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'D6'] },
            ],
          },
          then: 'darjah6',
        },
        {
          case: {
            $or: [
              {
                $and: [
                  { $eq: ['$sekolahKki', 'ya-sekolah-kki'] },
                  { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                ],
              },
              {
                $eq: ['$tahunTingkatan', 'KHAS'],
              },
            ],
          },
          then: 'kki-sr',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'T1'] },
            ],
          },
          then: 'tingkatan1',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'T2'] },
            ],
          },
          then: 'tingkatan2',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'T3'] },
            ],
          },
          then: 'tingkatan3',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'T4'] },
            ],
          },
          then: 'tingkatan4',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'T5'] },
            ],
          },
          then: 'tingkatan5',
        },
        {
          case: {
            $and: [
              { $eq: ['$sekolahKki', 'tidak-sekolah-kki'] },
              { $eq: ['$tahunTingkatan', 'P'] },
            ],
          },
          then: 'peralihan',
        },
        {
          case: {
            $or: [
              {
                $and: [
                  { $eq: ['$sekolahKki', 'ya-sekolah-kki'] },
                  { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                ],
              },
              {
                $eq: ['$tahunTingkatan', 'KHAM'],
              },
            ],
          },
          then: 'kki-sm',
        },
      ],
      default: 'Unknown',
    },
  },
};

// ni untuk pgpr201
const outputReqPgpr201 = {
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
  count: { $sum: 1 },
  jumlahAGumur1517: {
    $sum: '$umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum',
  },
  //
  jumlahAGumur1819: {
    $sum: '$umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum',
  },
  //
  jumlahAGumur2029: {
    $sum: '$umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum',
  },
  //
  jumlahAGumur3049: {
    $sum: '$umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum',
  },
  //
  jumlahAGumur5059: {
    $sum: '$umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum',
  },
  //
  jumlahAGumur60KeAtas: {
    $sum: '$umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum',
  },
  //
  jumlahLawatanKeRumah: {
    $sum: {
      $cond: [
        {
          $eq: [
            '$lawatanKeRumahPromosiUmum',
            'ya-lawatan-ke-rumah-promosi-umum',
          ],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahNasihatPergigianIndividu: {
    $sum: {
      $cond: [
        {
          $eq: ['$plakGigiNasihatPergigianIndividuPromosiUmum', true],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahNasihatKesihatanOral: {
    $sum: {
      $cond: [
        {
          $eq: [
            '$penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum',
            true,
          ],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahNasihatPemakanan: {
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
  //
  jumlahNasihatKanserMulut: {
    $sum: {
      $cond: [
        {
          $eq: ['$kanserMulutNasihatPergigianIndividuPromosiUmum', true],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahKedayan: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'kedayan'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahIban: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'iban'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahBidayuh: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bidayuh'],
        },
        1,
        0,
      ],
    },
  },
};

// ni untuk 211
const outputReq211 = {
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
  jumlahLelaki: {
    $sum: {
      $cond: [
        {
          $or: [
            { $eq: ['$jantina', 'lelaki'] },
            { $eq: ['$jantina', null] }, // sementara waktu
            { $eq: ['$jantina', ''] }, // sementara waktu
          ],
        },
        1,
        0,
      ],
    },
  },
  //
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
  //
  jumlahMelayu: {
    $sum: {
      $cond: [
        {
          $or: [
            { $eq: ['$kumpulanEtnik', 'melayu'] },
            { $eq: ['$kumpulanEtnik', null] }, // sementara waktu
            { $eq: ['$kumpulanEtnik', ''] }, // sementara waktu
          ],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahCina: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'cina'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahIndia: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'india'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahBajau: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bajau'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahDusun: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'dusun'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahKadazan: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'kadazan'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahMurut: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'murut'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahBMSL: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bumiputera sabah lain'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahMelanau: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'melanau'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahKedayan: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'kedayan'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahIban: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'iban'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahBidayuh: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bidayuh'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahPenan: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'penan'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahBMSwL: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bumiputera sarawak lain'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahOA: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'orang asli semenanjung'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahLainlain: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'lain-lain'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahBukanWarganegara: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bukan warganegara'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahIbuMengandung: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $eq: ['$ibuMengandung', true],
            },
            {
              $gte: ['$umur', 7],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahBersekolah: {
    $sum: {
      $cond: [
        {
          $eq: ['$bersekolah', true],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahOKU: {
    $sum: {
      $cond: [
        {
          $eq: ['$orangKurangUpaya', true],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahPesaraKerajaan: {
    $sum: {
      $cond: [
        {
          $eq: ['$statusPesara', 'pesara-kerajaan'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahPesaraATM: {
    $sum: {
      $cond: [
        {
          $eq: ['$statusPesara', 'pesara-atm'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahRujukanDalaman: {
    $sum: {
      $cond: [
        {
          $eq: ['$rujukDaripada', 'dalaman'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahRujukanKP: {
    $sum: {
      $cond: [
        {
          $eq: ['$rujukDaripada', 'kp'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahRujukanKK: {
    $sum: {
      $cond: [
        {
          $eq: ['$rujukDaripada', 'kk'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahRujukanHospital: {
    $sum: {
      $cond: [
        {
          $eq: ['$rujukDaripada', 'hospital/institusi-kerajaan'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahRujukanSwasta: {
    $sum: {
      $cond: [
        {
          $eq: ['$rujukDaripada', 'swasta'],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahRujukanLainlain: {
    $sum: {
      $cond: [
        {
          $eq: ['$rujukDaripada', 'lain-lain'],
        },
        1,
        0,
      ],
    },
  },
};

// ni untuk 214
const groupPG214 = {
  jumlahReten: {
    $sum: 1,
  },
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
  jumlahMelayu: {
    $sum: {
      $cond: [
        {
          $or: [
            { $eq: ['$kumpulanEtnik', 'melayu'] },
            { $eq: ['$kumpulanEtnik', null] }, // sementara waktu
            { $eq: ['$kumpulanEtnik', ''] }, // sementara waktu
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahCina: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'cina'],
        },
        1,
        0,
      ],
    },
  },
  jumlahIndia: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'india'],
        },
        1,
        0,
      ],
    },
  },
  jumlahBajau: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bajau'],
        },
        1,
        0,
      ],
    },
  },
  jumlahDusun: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'dusun'],
        },
        1,
        0,
      ],
    },
  },
  jumlahKadazan: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'kadazan'],
        },
        1,
        0,
      ],
    },
  },
  jumlahMurut: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'murut'],
        },
        1,
        0,
      ],
    },
  },
  jumlahBMSL: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bumiputera sabah lain'],
        },
        1,
        0,
      ],
    },
  },
  jumlahMelanau: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'melanau'],
        },
        1,
        0,
      ],
    },
  },
  jumlahKedayan: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'kedayan'],
        },
        1,
        0,
      ],
    },
  },
  jumlahIban: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'iban'],
        },
        1,
        0,
      ],
    },
  },
  jumlahBidayuh: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bidayuh'],
        },
        1,
        0,
      ],
    },
  },
  jumlahPenan: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'penan'],
        },
        1,
        0,
      ],
    },
  },
  jumlahBMSwL: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bumiputera sarawak lain'],
        },
        1,
        0,
      ],
    },
  },
  jumlahOAS: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'orang asli semenanjung'],
        },
        1,
        0,
      ],
    },
  },
  jumlahLainlain: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'lain-lain'],
        },
        1,
        0,
      ],
    },
  },
  jumlahBukanWarganegara: {
    $sum: {
      $cond: [
        {
          $eq: ['$kumpulanEtnik', 'bukan warganegara'],
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
          $or: [
            { $eq: ['$jantina', 'lelaki'] },
            { $eq: ['$jantina', null] }, // sementara waktu
            { $eq: ['$jantina', ''] }, // sementara waktu
          ],
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
  jumlahEdentulous: {
    $sum: {
      $cond: [
        {
          $eq: [
            '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
            0,
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahGigiLebihAtauSama20: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $gte: [
                '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
                20,
              ],
            },
            {
              $eq: [
                '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
                null,
              ],
            },
            {
              $eq: [
                '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
                '',
              ],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahGigiKurang20: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $lt: [
                '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
                20,
              ],
            },
            {
              $gt: [
                '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
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
  jumlahSemuaGigi: {
    $sum: '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
  },
};

// ni untuk 201, 203, DEWASAMUDA
const groupSekolah = {
  jumlahPelajar: {
    $sum: 1,
  },
  jumlahLelaki: {
    $sum: {
      $cond: [
        {
          $eq: ['$jantina', 'LELAKI'],
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
          $eq: ['$jantina', 'PEREMPUAN'],
        },
        1,
        0,
      ],
    },
  },
  kedatanganEnggan: {
    $sum: {
      $cond: [
        {
          $or: [
            { $eq: ['$statusRawatan', 'enggan'] },
            { $eq: ['$statusRawatan', 'enggan rawatan'] },
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
            { $eq: ['$statusRawatan', 'tidak hadir'] },
            { $eq: ['$statusRawatan', 'tidak hadir rawatan'] },
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
            { $ifNull: ['$tarikhRawatan', true] },
            {
              $and: [
                { $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'] },
                { $eq: ['$operatorPemeriksaan', '$operatorRawatan'] },
              ],
            },
            {
              $and: [
                { $eq: ['$tarikhPemeriksaan', '$tarikhRawatan'] },
                { $ne: ['$operatorPemeriksaan', '$operatorRawatan'] },
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
            { $ifNull: ['$tarikhRawatan', false] },
            { $ne: ['$tarikhPemeriksaan', '$tarikhRawatan'] },
            { $eq: ['$operatorPemeriksaan', '$operatorRawatan'] },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahKebersihanMulutA: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
              ],
            },
            { $eq: ['$merged.kebersihanMulutOralHygiene', 'A'] },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahKebersihanMulutC: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
              ],
            },
            { $eq: ['$merged.kebersihanMulutOralHygiene', 'C'] },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahKebersihanMulutE: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
              ],
            },
            { $eq: ['$merged.kebersihanMulutOralHygiene', 'E'] },
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
  jumlahE: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $eq: ['$jenisFasiliti', 'sekolah-rendah'],
            },
            {
              $and: [
                { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
              ],
            },
          ],
        },
        '$merged.eAdaGigiKekal',
        0,
      ],
    },
  },
  jumlahD: { $sum: '$merged.dAdaGigiKekal' },
  jumlahM: { $sum: '$merged.mAdaGigiKekal' },
  jumlahF: { $sum: '$merged.fAdaGigiKekal' },
  jumlahX: { $sum: '$merged.xAdaGigiKekal' },
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
  dfxEqualToZero: {
    $sum: {
      $cond: [
        {
          $and: [
            { $eq: ['$merged.adaDesidus', true] },
            { $eq: ['$merged.dAdaGigiDesidus', 0] },
            { $eq: ['$merged.fAdaGigiDesidus', 0] },
            { $eq: ['$merged.xAdaGigiDesidus', 0] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', false] },
                { $eq: ['$merged.dAdaGigiDesidus', 0] },
                { $eq: ['$merged.fAdaGigiDesidus', 0] },
                { $eq: ['$merged.xAdaGigiDesidus', 0] },
              ],
            },
            {
              $and: [
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
                { $eq: ['$merged.dAdaGigiDesidus', 0] },
                { $eq: ['$merged.fAdaGigiDesidus', 0] },
                { $eq: ['$merged.xAdaGigiDesidus', 0] },
                { $eq: ['$merged.dAdaGigiKekal', 0] },
                { $eq: ['$merged.mAdaGigiKekal', 0] },
                { $eq: ['$merged.fAdaGigiKekal', 0] },
                { $eq: ['$merged.xAdaGigiKekal', 0] },
              ],
            },
            {
              $and: [
                { $eq: ['$merged.adaDesidus', false] },
                { $eq: ['$merged.adaKekal', true] },
                { $eq: ['$merged.dAdaGigiKekal', 0] },
                { $eq: ['$merged.mAdaGigiKekal', 0] },
                { $eq: ['$merged.fAdaGigiKekal', 0] },
                { $eq: ['$merged.xAdaGigiKekal', 0] },
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
                { $eq: ['$merged.adaKekal', true] },
                { $eq: ['$merged.dAdaGigiKekal', 0] },
                { $eq: ['$merged.mAdaGigiKekal', 0] },
                { $eq: ['$merged.fAdaGigiKekal', 0] },
                { $eq: ['$merged.xAdaGigiKekal', 0] },
              ],
            },
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
          $and: [
            {
              $eq: ['$merged.adaKekal', true],
            },
            {
              $lte: [
                {
                  $add: [
                    '$merged.dAdaGigiKekal',
                    '$merged.mAdaGigiKekal',
                    '$merged.fAdaGigiKekal',
                    '$merged.xAdaGigiKekal',
                  ],
                },
                3,
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
    $sum: {
      $cond: [
        {
          $and: [
            { $eq: ['$merged.adaKekal', true] },
            { $eq: ['$merged.mAdaGigiKekal', 0] },
            { $eq: ['$merged.xAdaGigiKekal', 0] },
          ],
        },
        1,
        0,
      ],
    },
  },
  eLebihAtauSamaDenganSatu: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                {
                  $and: [
                    { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                    { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
                  ],
                },
              ],
            },
            { $eq: ['$merged.adaKekal', true] },
            { $gt: ['$merged.eAdaGigiKekal', 0] },
          ],
        },
        1,
        0,
      ],
    },
  },
  bebasKariesTetapiElebihAtauSamaDenganSatu: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                },
                {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$sekolahMmi', 'ya-sekolah-mmi'],
                    },
                  ],
                },
              ],
            },
            {
              $eq: ['$merged.adaKekal', true],
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
            {
              $gt: ['$merged.eAdaGigiKekal', 0],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahTPRmmi: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                {
                  $and: [
                    { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                    { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
                  ],
                },
              ],
            },
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$merged.adaDesidus', true] },
                    { $eq: ['$merged.dAdaGigiDesidus', 0] },
                    { $eq: ['$merged.xAdaGigiDesidus', 0] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$merged.adaKekal', true] },
                    { $eq: ['$merged.dAdaGigiKekal', 0] },
                    { $eq: ['$merged.xAdaGigiKekal', 0] },
                    { $eq: ['$merged.eAdaGigiKekal', 0] },
                  ],
                },
              ],
            },
            {
              $eq: ['$merged.perluPenskaleranOralHygiene', false],
            },
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$merged.skorGisMulutOralHygiene', ''] },
                    { $eq: ['$merged.skorBpeOralHygiene', '0'] },
                  ],
                },
                {
                  $and: [
                    {
                      $or: [
                        { $eq: ['$merged.skorGisMulutOralHygiene', '0'] },
                        { $eq: ['$merged.skorGisMulutOralHygiene', '2'] },
                      ],
                    },
                    { $eq: ['$merged.skorBpeOralHygiene', ''] },
                  ],
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
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$merged.adaDesidus', true] },
                    { $eq: ['$merged.dAdaGigiDesidus', 0] },
                    { $eq: ['$merged.xAdaGigiDesidus', 0] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$merged.adaKekal', true] },
                    { $eq: ['$merged.dAdaGigiKekal', 0] },
                    { $eq: ['$merged.xAdaGigiKekal', 0] },
                  ],
                },
              ],
            },
            { $eq: ['$merged.perluPenskaleranOralHygiene', false] },
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$merged.skorGisMulutOralHygiene', ''] },
                    { $eq: ['$merged.skorBpeOralHygiene', '0'] },
                  ],
                },
                {
                  $and: [
                    {
                      $or: [
                        { $eq: ['$merged.skorGisMulutOralHygiene', '0'] },
                        { $eq: ['$merged.skorGisMulutOralHygiene', '2'] },
                      ],
                    },
                    { $eq: ['$merged.skorBpeOralHygiene', ''] },
                  ],
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
  skorGIS0: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $eq: ['$merged.skorGisMulutOralHygiene', '0'],
            },
          ],
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
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $eq: ['$merged.skorGisMulutOralHygiene', '1'],
            },
          ],
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
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $eq: ['$merged.skorGisMulutOralHygiene', '2'],
            },
          ],
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
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $eq: ['$merged.skorGisMulutOralHygiene', '3'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorBPE0: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $or: [
                {
                  $eq: ['$tahunTingkatan', 'T3'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T4'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T5'],
                },
              ],
            },
            {
              $eq: ['$merged.skorBpeOralHygiene', '0'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorBPE1: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $or: [
                {
                  $eq: ['$tahunTingkatan', 'T3'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T4'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T5'],
                },
              ],
            },
            {
              $eq: ['$merged.skorBpeOralHygiene', '1'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorBPE2: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $or: [
                {
                  $eq: ['$tahunTingkatan', 'T3'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T4'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T5'],
                },
              ],
            },
            {
              $eq: ['$merged.skorBpeOralHygiene', '2'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorBPE3: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $or: [
                {
                  $eq: ['$tahunTingkatan', 'T3'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T4'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T5'],
                },
              ],
            },
            {
              $eq: ['$merged.skorBpeOralHygiene', '3'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorBPE4: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $eq: ['$merged.adaDesidus', true],
                },
                {
                  $eq: ['$merged.adaKekal', true],
                },
              ],
            },
            {
              $or: [
                {
                  $eq: ['$tahunTingkatan', 'T3'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T4'],
                },
                {
                  $eq: ['$tahunTingkatan', 'T5'],
                },
              ],
            },
            {
              $eq: ['$merged.skorBpeOralHygiene', '4'],
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
      $cond: [
        {
          $eq: ['$merged.tisuKerasTrauma', true],
        },
        1,
        0,
      ],
    },
  },
  jumlahKecederaanGigi: {
    $sum: {
      $cond: [
        {
          $eq: ['$merged.kecederaanGigiAnteriorTrauma', true],
        },
        1,
        0,
      ],
    },
  },
  jumlahKecederaanTisuLembut: {
    $sum: {
      $cond: [
        {
          $eq: ['$merged.tisuLembutTrauma', true],
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
          $eq: ['$merged.toothSurfaceLoss', true],
        },
        1,
        0,
      ],
    },
  },
  jumlahCleftMurid: {
    $sum: {
      $cond: [
        {
          $eq: ['$merged.adaCleftLip', true],
        },
        1,
        0,
      ],
    },
  },
  jumlahCleftDirujuk: {
    $sum: {
      $cond: [
        {
          $eq: ['$merged.rujukCleftLip', true],
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
              $gt: ['$merged.baruJumlahGigiKekalPerluFv', 0],
            },
            {
              $or: [
                {
                  $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                },
                {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$sekolahMmi', 'ya-sekolah-mmi'],
                    },
                  ],
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
  perluJumlahPesakitPrrJenis1: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $gt: ['$merged.baruJumlahGigiKekalPerluPrrJenis1', 0],
            },
            {
              $or: [
                {
                  $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                },
                {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$sekolahMmi', 'ya-sekolah-mmi'],
                    },
                  ],
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
  perluJumlahGigiPrrJenis1: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $eq: ['$jenisFasiliti', 'sekolah-rendah'],
            },
            {
              $or: [
                {
                  $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                },
                {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$sekolahMmi', 'ya-sekolah-mmi'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        '$merged.baruJumlahGigiKekalPerluPrrJenis1',
        0,
      ],
    },
  },
  perluJumlahPesakitFS: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $gt: ['$merged.baruJumlahGigiKekalPerluFs', 0],
            },
            {
              $or: [
                {
                  $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                },
                {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$sekolahMmi', 'ya-sekolah-mmi'],
                    },
                  ],
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
  perluJumlahGigiFS: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $or: [
                {
                  $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                },
                {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$sekolahMmi', 'ya-sekolah-mmi'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        '$merged.baruJumlahGigiKekalPerluFs',
        0,
      ],
    },
  },
  perluPenskaleran: {
    $sum: {
      $cond: [
        {
          $eq: ['$merged.perluPenskaleranOralHygiene', true],
        },
        1,
        0,
      ],
    },
  },
  perluDenturPenuh: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $eq: ['$merged.separaPenuhAtasPerluDenture', true],
            },
            {
              $eq: ['$merged.separaPenuhBawahPerluDenture', true],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  perluDenturSepara: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $eq: ['$merged.separaPenuhAtasSediaAdaDenture', true],
            },
            {
              $eq: ['$merged.separaPenuhBawahSediaAdaDenture', true],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  //
  jumlahGigiPerluTampalanAntSewarnaGdBaru: {
    $sum: '$merged.baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanAntSewarnaGdSemula: {
    $sum: '$merged.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanAntSewarnaGkBaru: {
    $sum: '$merged.baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanAntSewarnaGkSemula: {
    $sum: '$merged.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
  },
  //
  jumlahGigiPerluTampalanPostSewarnaGdBaru: {
    $sum: '$merged.baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanPostSewarnaGdSemula: {
    $sum: '$merged.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanPostSewarnaGkBaru: {
    $sum: '$merged.baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanPostSewarnaGkSemula: {
    $sum: '$merged.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
  },
  //
  jumlahGigiPerluTampalanPosAmalgamGdBaru: {
    $sum: '$merged.baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanPosAmalgamGdSemula: {
    $sum: '$merged.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanPosAmalgamGkBaru: {
    $sum: '$merged.baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
  },
  jumlahGigiPerluTampalanPosAmalgamGkSemula: {
    $sum: '$merged.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
  },
  // rawatan
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
              $gt: ['$merged.baruJumlahGigiKekalDiberiPrrJenis1', 0],
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
              $gt: ['$merged.baruJumlahGigiKekalDibuatFs', 0],
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
  kesSelesaiMMI: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $eq: ['$kesSelesaiIcdasPemeriksaan', 'ya-kes-selesai-icdas'],
            },
            {
              $eq: [
                '$kesSelesaiIcdasRawatan',
                'ya-kes-selesai-icdas-penyata-akhir-2',
              ],
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
          $or: [
            {
              $eq: ['$kesSelesaiPemeriksaan', 'ya-kes-selesai'],
            },
            {
              $eq: ['$kesSelesaiRawatan', 'ya-kes-selesai-penyata-akhir-2'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
};

// ni untuk 206 dan 207
const groupPemeriksaanBiasa = {
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
      $cond: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }, 1, 0],
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
  TPR: {
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
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
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
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
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
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
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
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
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
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
                {
                  $or: [
                    {
                      $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
                    },
                    {
                      $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
                    },
                    { $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] },
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
  skorGISZero: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                { $eq: ['$adaKekalPemeriksaanUmum', true] },
              ],
            },
            {
              $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorGISMoreThanZero: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                { $eq: ['$adaKekalPemeriksaanUmum', true] },
              ],
            },
            {
              $ne: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
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
      $cond: [
        {
          $eq: ['$perluPenskaleranPemeriksaanUmum', true],
        },
        1,
        0,
      ],
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
};

const groupRawatanBiasa = {
  retenSalah: { $sum: '$retenSalah' },
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
    $sum: {
      $cond: [
        {
          $and: [
            {
              $gt: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', 0],
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
              $gt: ['$baruJumlahGigiKekalDibuatFSRawatanUmum', 0],
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
  },
  inlayOnlaySemula: {
    $sum: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum',
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
          $eq: ['$penskaleranRawatanUmum', true],
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
          $eq: ['$yaTidakPembedahanKecilMulutPembedahanRawatanUmum', true],
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
};

const groupOplain = {
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
                      $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
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
        { $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum' },
      ],
    },
  },
  tampalanAntGdBaru: {
    $sum: {
      $cond: [
        {
          $eq: ['$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
        },
        0,
        {
          $toInt: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
      ],
    },
  },
  tampalanPostGkBaru: {
    $sum: {
      $cond: [
        {
          $eq: ['$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum', ''],
        },
        0,
        {
          $toInt: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        },
      ],
    },
  },
  tampalanPostAmgGdBaru: {
    $sum: {
      $cond: [
        {
          $eq: ['$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum', ''],
        },
        0,
        {
          $toInt: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
      ],
    },
  },
  tampalanPostAmgGkBaru: {
    $sum: {
      $cond: [
        {
          $eq: ['$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum', ''],
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
          $eq: ['$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum', ''],
        },
        0,
        {
          $toInt: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        },
      ],
    },
  },
  inlayOnlayBaru: {
    $sum: {
      $cond: [
        { $eq: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum', ''] },
        0,
        { $toInt: '$baruInlayOnlayJumlahTampalanDibuatRawatanUmum' },
      ],
    },
  },
  inlayOnlaySemula: {
    $sum: {
      $cond: [
        { $eq: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum', ''] },
        0,
        { $toInt: '$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum' },
      ],
    },
  },
  tampalanSementara: {
    $sum: {
      $cond: [
        {
          $eq: ['$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum', ''],
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
        { $eq: ['$cabutDesidusRawatanUmum', ''] },
        0,
        { $toInt: '$cabutDesidusRawatanUmum' },
      ],
    },
  },
  cabutanGk: {
    $sum: {
      $cond: [
        { $eq: ['$cabutKekalRawatanUmum', ''] },
        0,
        { $toInt: '$cabutKekalRawatanUmum' },
      ],
    },
  },
  komplikasiSelepasCabutan: {
    $sum: {
      $cond: [
        { $eq: ['$komplikasiSelepasCabutanRawatanUmum', ''] },
        0,
        { $toInt: '$komplikasiSelepasCabutanRawatanUmum' },
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
          $eq: ['$yaTidakPembedahanKecilMulutPembedahanRawatanUmum', true],
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
};

const groupSekolahPemeriksaan = {
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
  jumlahPelajar: {
    $sum: 1,
  },
  jumlahd: { $sum: '$pemeriksaanSekolah.dAdaGigiDesidus' },
  jumlahf: { $sum: '$pemeriksaanSekolah.fAdaGigiDesidus' },
  jumlahx: { $sum: '$pemeriksaanSekolah.xAdaGigiDesidus' },
  jumlahdfx: {
    $sum: {
      $add: [
        '$pemeriksaanSekolah.dAdaGigiDesidus',
        '$pemeriksaanSekolah.fAdaGigiDesidus',
        '$pemeriksaanSekolah.xAdaGigiDesidus',
      ],
    },
  },
  jumlahD: { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' },
  jumlahM: { $sum: '$pemeriksaanSekolah.mAdaGigiKekal' },
  jumlahF: { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
  jumlahX: { $sum: '$pemeriksaanSekolah.xAdaGigiKekal' },
  jumlahDMFX: {
    $sum: {
      $add: [
        '$pemeriksaanSekolah.dAdaGigiKekal',
        '$pemeriksaanSekolah.mAdaGigiKekal',
        '$pemeriksaanSekolah.fAdaGigiKekal',
        '$pemeriksaanSekolah.xAdaGigiKekal',
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
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', false] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
              ],
            },
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', false] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
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
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
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
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                    { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                    { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                    { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                    { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                  ],
                },
              ],
            },
            { $eq: ['$pemeriksaanSekolah.perluPenskaleranOralHygiene', false] },
            {
              $or: [
                {
                  $and: [
                    {
                      $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', ''],
                    },
                    { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '0'] },
                  ],
                },
                {
                  $and: [
                    {
                      $or: [
                        {
                          $eq: [
                            '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                            '0',
                          ],
                        },
                        {
                          $eq: [
                            '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                            '2',
                          ],
                        },
                      ],
                    },
                    { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', ''] },
                  ],
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
  skorGISZero: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorGISMoreThanZero: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $ne: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
          $and: [
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $or: [
                { $eq: ['$tahunTingkatan', 'T3'] },
                { $eq: ['$tahunTingkatan', 'T4'] },
                { $eq: ['$tahunTingkatan', 'T5'] },
              ],
            },
            {
              $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '0'],
            },
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
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $or: [
                { $eq: ['$tahunTingkatan', 'T3'] },
                { $eq: ['$tahunTingkatan', 'T4'] },
                { $eq: ['$tahunTingkatan', 'T5'] },
              ],
            },
            {
              $ne: ['$pemeriksaanSekolah.skorBpeOralHygiene', '0'],
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
          $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv', 0],
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
          $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1', 0],
        },
        1,
        0,
      ],
    },
  },
  perluJumlahGigiPrrJenis1: {
    $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
  },
  perluJumlahPesakitFS: {
    $sum: {
      $cond: [
        {
          $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs', 0],
        },
        1,
        0,
      ],
    },
  },
  perluJumlahGigiFS: {
    $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
  },
  //
  perluPenskaleran: {
    $sum: {
      $cond: [
        {
          $eq: ['$pemeriksaanSekolah.perluPenskaleranOralHygiene', true],
        },
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
  kesSelesaiPemeriksaan: {
    $sum: {
      $cond: [
        {
          $eq: ['$pemeriksaanSekolah.kesSelesai', 'ya-kes-selesai'],
        },
        1,
        0,
      ],
    },
  },
};

const groupSekolahRawatan = {
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
  jumlahPelajar: {
    $sum: 1,
  },
  // rawatan
  sapuanFluorida: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $eq: ['$rawatanSekolah.kedatangan', 'baru-kedatangan'],
            },
            {
              $gt: ['$rawatanSekolah.baruJumlahGigiKekalDiberiFv', 0],
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
              $eq: ['$rawatanSekolah.kedatangan', 'baru-kedatangan'],
            },
            {
              $gt: ['$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1', 0],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahGigiPrrJenis1: {
    $sum: '$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1',
  },
  jumlahPesakitDiBuatFs: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $eq: ['$rawatanSekolah.kedatangan', 'baru-kedatangan'],
            },
            {
              $gt: ['$rawatanSekolah.baruJumlahGigiKekalDibuatFs', 0],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahGigiDibuatFs: {
    $sum: '$rawatanSekolah.baruJumlahGigiKekalDibuatFs',
  },
  tampalanAntGdBaru: {
    $sum: '$rawatanSekolah.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanAntGdSemula: {
    $sum: '$rawatanSekolah.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanAntGkBaru: {
    $sum: '$rawatanSekolah.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanAntGkSemula: {
    $sum: '$rawatanSekolah.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGdBaru: {
    $sum: '$rawatanSekolah.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGdSemula: {
    $sum: '$rawatanSekolah.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGkBaru: {
    $sum: '$rawatanSekolah.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGkSemula: {
    $sum: '$rawatanSekolah.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostAmgGdBaru: {
    $sum: '$rawatanSekolah.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanPostAmgGdSemula: {
    $sum: '$rawatanSekolah.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanPostAmgGkBaru: {
    $sum: '$rawatanSekolah.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanPostAmgGkSemula: {
    $sum: '$rawatanSekolah.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanSementara: {
    $sum: '$rawatanSekolah.jumlahTampalanSementaraSekolahRawatan',
  },
  cabutanGd: {
    $sum: '$rawatanSekolah.cabutDesidusSekolahRawatan',
  },
  cabutanGk: {
    $sum: '$rawatanSekolah.cabutKekalSekolahRawatan',
  },
  penskaleran: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $eq: ['$rawatanSekolah.penskaleranSekolahRawatan', true],
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
              $eq: ['$rawatanSekolah.absesSekolahRawatan', true],
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
          $eq: [
            '$rawatanSekolah.kesSelesaiSekolahRawatan',
            'ya-kes-selesai-penyata-akhir-2',
          ],
        },
        1,
        0,
      ],
    },
  },
};

const groupSekolahPemeriksaanOKUBW = {
  _id: null,
  jumlahPelajar: {
    $sum: 1,
  },
  jumlahd: {
    $sum: '$pemeriksaanSekolah.dAdaGigiDesidus',
  },
  jumlahf: {
    $sum: '$pemeriksaanSekolah.fAdaGigiDesidus',
  },
  jumlahx: {
    $sum: '$pemeriksaanSekolah.xAdaGigiDesidus',
  },
  jumlahdfx: {
    $sum: {
      $add: [
        '$pemeriksaanSekolah.dAdaGigiDesidus',
        '$pemeriksaanSekolah.fAdaGigiDesidus',
        '$pemeriksaanSekolah.xAdaGigiDesidus',
      ],
    },
  },
  jumlahD: {
    $sum: '$pemeriksaanSekolah.dAdaGigiKekal',
  },
  jumlahM: {
    $sum: '$pemeriksaanSekolah.mAdaGigiKekal',
  },
  jumlahF: {
    $sum: '$pemeriksaanSekolah.fAdaGigiKekal',
  },
  jumlahX: {
    $sum: '$pemeriksaanSekolah.xAdaGigiKekal',
  },
  jumlahDMFX: {
    $sum: {
      $add: [
        '$pemeriksaanSekolah.dAdaGigiKekal',
        '$pemeriksaanSekolah.mAdaGigiKekal',
        '$pemeriksaanSekolah.fAdaGigiKekal',
        '$pemeriksaanSekolah.xAdaGigiKekal',
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
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', false] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
              ],
            },
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', false] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
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
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
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
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                    { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                    { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
                    { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                    { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                  ],
                },
              ],
            },
            { $eq: ['$pemeriksaanSekolah.perluPenskaleranOralHygiene', false] },
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'] },
                { $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'] },
              ],
            },
            { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', 0] },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorGISZero: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  skorGISMoreThanZero: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $ne: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
          $and: [
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $or: [
                { $eq: ['$tahunTingkatan', 'T3'] },
                { $eq: ['$tahunTingkatan', 'T4'] },
                { $eq: ['$tahunTingkatan', 'T5'] },
              ],
            },
            {
              $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '0'],
            },
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
            {
              $or: [
                { $eq: ['$pemeriksaanSekolah.adaDesidus', true] },
                { $eq: ['$pemeriksaanSekolah.adaKekal', true] },
              ],
            },
            {
              $or: [
                { $eq: ['$tahunTingkatan', 'T3'] },
                { $eq: ['$tahunTingkatan', 'T4'] },
                { $eq: ['$tahunTingkatan', 'T5'] },
              ],
            },
            {
              $ne: ['$pemeriksaanSekolah.skorBpeOralHygiene', '0'],
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
          $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv', 0],
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
          $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1', 0],
        },
        1,
        0,
      ],
    },
  },
  perluJumlahGigiPrrJenis1: {
    $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
  },
  perluJumlahPesakitFS: {
    $sum: {
      $cond: [
        {
          $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs', 0],
        },
        1,
        0,
      ],
    },
  },
  perluJumlahGigiFS: {
    $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
  },
  //
  perluPenskaleran: {
    $sum: {
      $cond: [
        {
          $eq: ['$pemeriksaanSekolah.perluPenskaleranOralHygiene', true],
        },
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
};

const groupSekolahRawatanOKUBW = {
  _id: null,
  jumlahPelajar: {
    $sum: 1,
  },
  // rawatan
  sapuanFluorida: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $eq: ['$rawatanSekolah.kedatangan', 'baru-kedatangan'],
            },
            {
              $gt: ['$rawatanSekolah.baruJumlahGigiKekalDiberiFv', 0],
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
              $eq: ['$rawatanSekolah.kedatangan', 'baru-kedatangan'],
            },
            {
              $gt: ['$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1', 0],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahGigiPrrJenis1: {
    $sum: '$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1',
  },
  jumlahPesakitDiBuatFs: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $eq: ['$rawatanSekolah.kedatangan', 'baru-kedatangan'],
            },
            {
              $gt: ['$rawatanSekolah.baruJumlahGigiKekalDibuatFs', 0],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
  jumlahGigiDibuatFs: {
    $sum: '$rawatanSekolah.baruJumlahGigiKekalDibuatFs',
  },
  tampalanAntGdBaru: {
    $sum: '$rawatanSekolah.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanAntGdSemula: {
    $sum: '$rawatanSekolah.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanAntGkBaru: {
    $sum: '$rawatanSekolah.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanAntGkSemula: {
    $sum: '$rawatanSekolah.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGdBaru: {
    $sum: '$rawatanSekolah.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGdSemula: {
    $sum: '$rawatanSekolah.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGkBaru: {
    $sum: '$rawatanSekolah.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostGkSemula: {
    $sum: '$rawatanSekolah.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
  },
  tampalanPostAmgGdBaru: {
    $sum: '$rawatanSekolah.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanPostAmgGdSemula: {
    $sum: '$rawatanSekolah.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanPostAmgGkBaru: {
    $sum: '$rawatanSekolah.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanPostAmgGkSemula: {
    $sum: '$rawatanSekolah.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
  },
  tampalanSementara: {
    $sum: '$rawatanSekolah.jumlahTampalanSementaraSekolahRawatan',
  },
  cabutanGd: {
    $sum: '$rawatanSekolah.cabutDesidusSekolahRawatan',
  },
  cabutanGk: {
    $sum: '$rawatanSekolah.cabutKekalSekolahRawatan',
  },
  penskaleran: {
    $sum: {
      $cond: [
        {
          $and: [
            {
              $eq: ['$rawatanSekolah.penskaleranSekolahRawatan', true],
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
              $eq: ['$rawatanSekolah.absesSekolahRawatan', true],
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
          $eq: [
            '$rawatanSekolah.kesSelesaiSekolahRawatan',
            'ya-kes-selesai-penyata-akhir-2',
          ],
        },
        1,
        0,
      ],
    },
  },
};

const groupKesSelesaiSekolah = {
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
  kesSelesai: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $eq: ['$kesSelesaiPemeriksaan', 'ya-kes-selesai'],
            },
            {
              $eq: ['$kesSelesaiRawatan', 'ya-kes-selesai'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
};

const groupKesSelesaiSekolahOKUBW = {
  _id: null,
  kesSelesai: {
    $sum: {
      $cond: [
        {
          $or: [
            {
              $eq: ['$kesSelesaiPemeriksaan', 'ya-kes-selesai'],
            },
            {
              $eq: ['$kesSelesaiRawatan', 'ya-kes-selesai'],
            },
          ],
        },
        1,
        0,
      ],
    },
  },
};

const groupKedatanganSekolah = [
  {
    $group: {
      _id: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  {
                    $eq: ['$umur', 5],
                  },
                  {
                    $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
                  },
                ],
              },
              then: 'prasek-5tahun',
            },
            {
              case: {
                $and: [
                  {
                    $eq: ['$umur', 6],
                  },
                  {
                    $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
                  },
                ],
              },
              then: 'prasek-6tahun',
            },
            {
              case: {
                $and: [
                  {
                    $eq: ['$umur', 7],
                  },
                  {
                    $eq: ['$tahunTingkatan', 'PRASEKOLAH'],
                  },
                ],
              },
              then: 'prasek-7tahun',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'D1'],
              },
              then: 'darjah1',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'D2'],
              },
              then: 'darjah2',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'D3'],
              },
              then: 'darjah3',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'D4'],
              },
              then: 'darjah4',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'D5'],
              },
              then: 'darjah5',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'D6'],
              },
              then: 'darjah6',
            },
            {
              case: {
                $and: [
                  {
                    $eq: ['$tahunTingkatan', 'KHAS'],
                  },
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                  },
                ],
              },
              then: 'darjah-khas',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'P'],
              },
              then: 'tingkatanPeralihan',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'T1'],
              },
              then: 'tingkatan1',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'T2'],
              },
              then: 'tingkatan2',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'T3'],
              },
              then: 'tingkatan3',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'T4'],
              },
              then: 'tingkatan4',
            },
            {
              case: {
                $eq: ['$tahunTingkatan', 'T5'],
              },
              then: 'tingkatan5',
            },
            {
              case: {
                $and: [
                  {
                    $eq: ['$tahunTingkatan', 'KHAM'],
                  },
                  {
                    $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                  },
                ],
              },
              then: 'tingkatan-khas',
            },
          ],
          default: 'Unknown',
        },
      },
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

const groupKedatanganSekolahAllOAP = [
  {
    $group: {
      _id: {
        $switch: {
          branches: [
            {
              case: {
                $or: [
                  {
                    $eq: ['$keturunan', 'PENAN'],
                  },
                  {
                    $eq: ['$keturunan', 'ORANG ASLI (SEMENANJUNG)'],
                  },
                  {
                    $eq: ['$keturunan', 'JAKUN'],
                  },
                  {
                    $eq: ['$keturunan', 'NEGRITO'],
                  },
                  {
                    $eq: ['$keturunan', 'SAKAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMAI'],
                  },
                  {
                    $eq: ['$keturunan', 'SEMALAI'],
                  },
                  {
                    $eq: ['$keturunan', 'TEMIAR'],
                  },
                  {
                    $eq: ['$keturunan', 'SENOI'],
                  },
                ],
              },
              then: 'all-oap',
            },
          ],
          default: 'Unknown',
        },
      },
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
];

const groupKedatanganSekolahAllOKU = [
  {
    $group: {
      _id: {
        $switch: {
          branches: [
            {
              case: {
                $or: [
                  {
                    $eq: ['$tahunTingkatan', 'KHAS'],
                  },
                  {
                    $eq: ['$tahunTingkatan', 'KHAM'],
                  },
                  {
                    $eq: ['$sekolahKki', 'ya-sekolah-kki'],
                  },
                ],
              },
              then: 'all-oku',
            },
          ],
          default: 'Unknown',
        },
      },
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

// ni untuk cppc
const pipelineCPPC1 = (payload) => {
  return [
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && {
          kodFasilitiHandler: payload.klinik,
        }),
        ...(payload.pilihanSekolah && {
          kodSekolah: payload.pilihanSekolah,
        }),
        sekolahSelesaiReten: true,
        jenisFasiliti: {
          $in: ['sekolah-rendah', 'sekolah-menengah'],
        },
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
              pemeriksaanSekolah: {
                $exists: true,
                $ne: [],
              },
              rawatanSekolah: {
                $exists: true,
                $ne: [],
              },
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
        deleted: '$result.deleted',
        umur: '$result.umur',
        keturunan: '$result.keturunan',
        warganegara: '$result.warganegara',
        statusOku: '$result.statusOku',
        statusRawatan: '$result.statusRawatan',
        tahunTingkatan: '$result.tahunTingkatan',
        kelasPelajar: '$result.kelasPelajar',
        jantina: '$result.jantina',
        pemeriksaanSekolah: '$result.pemeriksaanSekolah',
        rawatanSekolah: '$result.rawatanSekolah',
      },
    },
    {
      $project: {
        result: 0,
      },
    },
    {
      $match: {
        deleted: false,
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
      $unwind: {
        path: '$rawatanSekolah',
        preserveNullAndEmptyArrays: false,
      },
    },
  ];
};

const groupCPPC1 = {
  $group: {
    _id: '$tahunTingkatan',
    totalStudents: {
      $sum: 1,
    },
    isFacilityICDAS: {
      $sum: {
        $cond: [
          {
            $gt: ['$pemeriksaanSekolah.eAdaGigiKekal', 0],
          },
          1,
          0,
        ],
      },
    },
    // FS
    totalStudentFsNeed: {
      $sum: {
        $cond: [
          {
            $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs', 0],
          },
          1,
          0,
        ],
      },
    },
    totalTeethFsNeed: {
      $sum: {
        $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs'],
      },
    },
    totalStudentFsRendered: {
      $sum: {
        $cond: [
          {
            $or: [
              {
                $gt: ['$rawatanSekolah.baruJumlahGigiKekalDibuatFs', 0],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    totalTeethFsRendered: {
      $sum: {
        $add: ['$rawatanSekolah.baruJumlahGigiKekalDibuatFs'],
      },
    },
    // PRR
    totalStudentPrrNeed: {
      $sum: {
        $cond: [
          {
            $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1', 0],
          },
          1,
          0,
        ],
      },
    },
    totalTeethPrrNeed: {
      $sum: {
        $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1'],
      },
    },
    totalStudentPrrRendered: {
      $sum: {
        $cond: [
          {
            $gt: ['$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1', 0],
          },
          1,
          0,
        ],
      },
    },
    totalTeethPrrRendered: {
      $sum: {
        $add: ['$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1'],
      },
    },
    // FV
    totalStudentFvNeed: {
      $sum: {
        $cond: [
          {
            $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv', 0],
          },
          1,
          0,
        ],
      },
    },
    totalTeethFvNeed: {
      $sum: {
        $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv'],
      },
    },
    totalStudentFvRendered: {
      $sum: {
        $cond: [
          {
            $eq: ['$rawatanSekolah.muridDiberiFv', true],
          },
          1,
          0,
        ],
      },
    },
    totalTeethFvRendered: {
      $sum: {
        $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv'],
      },
    },
    // CF
    totalCariesFreeStatus: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $gte: ['$umur', 1],
              },
              {
                $lte: ['$umur', 59],
              },
              {
                $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    // DMFX
    totalDMFX: {
      $sum: {
        $add: [
          '$pemeriksaanSekolah.dAdaGigiKekal',
          '$pemeriksaanSekolah.mAdaGigiKekal',
          '$pemeriksaanSekolah.fAdaGigiKekal',
          '$pemeriksaanSekolah.xAdaGigiKekal',
        ],
      },
    },
  },
};

const pipelineCPPC1Biasa = (payload) => {
  return [
    ...pipelineCPPC1(payload),
    {
      $match: {
        tahunTingkatan: { $ne: 'PRASEKOLAH' },
      },
    },
    groupCPPC1,
  ];
};

const pipelineCPPC1PraSekolah = (payload) => {
  return [
    ...pipelineCPPC1(payload),
    {
      $match: {
        tahunTingkatan: { $eq: 'PRASEKOLAH' },
      },
    },
    {
      $group: {
        _id: '$umur',
        totalStudents: {
          $sum: 1,
        },
        isFacilityICDAS: {
          $sum: {
            $cond: [
              {
                $gt: ['$pemeriksaanSekolah.eAdaGigiKekal', 0],
              },
              1,
              0,
            ],
          },
        },
        // FS
        totalStudentFsNeed: {
          $sum: {
            $cond: [
              {
                $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs', 0],
              },
              1,
              0,
            ],
          },
        },
        totalTeethFsNeed: {
          $sum: {
            $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs'],
          },
        },
        totalStudentFsRendered: {
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $gt: ['$rawatanSekolah.baruJumlahGigiKekalDibuatFs', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalTeethFsRendered: {
          $sum: {
            $add: ['$rawatanSekolah.baruJumlahGigiKekalDibuatFs'],
          },
        },
        // PRR
        totalStudentPrrNeed: {
          $sum: {
            $cond: [
              {
                $gt: [
                  '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
                  0,
                ],
              },
              1,
              0,
            ],
          },
        },
        totalTeethPrrNeed: {
          $sum: {
            $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1'],
          },
        },
        totalStudentPrrRendered: {
          $sum: {
            $cond: [
              {
                $gt: ['$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1', 0],
              },
              1,
              0,
            ],
          },
        },
        totalTeethPrrRendered: {
          $sum: {
            $add: ['$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1'],
          },
        },
        // FV
        totalStudentFvNeed: {
          $sum: {
            $cond: [
              {
                $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv', 0],
              },
              1,
              0,
            ],
          },
        },
        totalTeethFvNeed: {
          $sum: {
            $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv'],
          },
        },
        totalStudentFvRendered: {
          $sum: {
            $cond: [
              {
                $eq: ['$rawatanSekolah.muridDiberiFv', true],
              },
              1,
              0,
            ],
          },
        },
        totalTeethFvRendered: {
          $sum: {
            $add: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv'],
          },
        },
        // CF
        totalCariesFreeStatus: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gte: ['$umur', 1],
                  },
                  {
                    $lte: ['$umur', 59],
                  },
                  {
                    $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0],
                  },
                  {
                    $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        // DMFX
        totalDMFX: {
          $sum: {
            $add: [
              '$pemeriksaanSekolah.dAdaGigiKekal',
              '$pemeriksaanSekolah.mAdaGigiKekal',
              '$pemeriksaanSekolah.fAdaGigiKekal',
              '$pemeriksaanSekolah.xAdaGigiKekal',
            ],
          },
        },
      },
    },
  ];
};

const pipelineCPPC2 = (payload) => {
  return [
    {
      $match: {
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && {
          kodFasilitiHandler: payload.klinik,
        }),
        ...(payload.pilihanSekolah && {
          kodSekolah: payload.pilihanSekolah,
        }),
        sekolahSelesaiReten: true,
        jenisFasiliti: {
          $in: ['sekolah-rendah', 'sekolah-menengah'],
        },
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
              pemeriksaanSekolah: {
                $exists: true,
                $ne: [],
              },
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
        deleted: '$result.deleted',
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
      $match: {
        deleted: false,
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
  ];
};

const groupCPPC2 = {
  $group: {
    _id: '$tahunTingkatan',
    totalStudents: {
      $sum: 1,
    },
    noOfDandF: {
      $sum: {
        $add: [
          '$pemeriksaanSekolah.dAdaGigiKekal',
          '$pemeriksaanSekolah.fAdaGigiKekal',
        ],
      },
    },
    noOfTeethWithDandFAllClass: {
      $sum: {
        $add: [
          '$pemeriksaanSekolah.classID',
          '$pemeriksaanSekolah.classIID',
          '$pemeriksaanSekolah.classIF',
          '$pemeriksaanSekolah.classIIF',
        ],
      },
    },
    noOfTeethWithDandFClassI: {
      $sum: {
        $add: ['$pemeriksaanSekolah.classID', '$pemeriksaanSekolah.classIF'],
      },
    },
  },
};

const pipelineCPPC2Biasa = (payload) => {
  return [
    ...pipelineCPPC2(payload),
    {
      $match: {
        tahunTingkatan: { $ne: 'PRASEKOLAH' },
      },
    },
    groupCPPC2,
  ];
};

const pipelineCPPC2PraSekolah = (payload) => {
  return [
    ...pipelineCPPC2(payload),
    {
      $match: {
        tahunTingkatan: { $eq: 'PRASEKOLAH' },
      },
    },
    {
      $group: {
        _id: '$umur',
        totalStudents: {
          $sum: 1,
        },
        noOfDandF: {
          $sum: {
            $add: [
              '$pemeriksaanSekolah.dAdaGigiKekal',
              '$pemeriksaanSekolah.fAdaGigiKekal',
            ],
          },
        },
        noOfTeethWithDandFAllClass: {
          $sum: {
            $add: [
              '$pemeriksaanSekolah.classID',
              '$pemeriksaanSekolah.classIID',
              '$pemeriksaanSekolah.classIF',
              '$pemeriksaanSekolah.classIIF',
            ],
          },
        },
        noOfTeethWithDandFClassI: {
          $sum: {
            $add: [
              '$pemeriksaanSekolah.classID',
              '$pemeriksaanSekolah.classIF',
            ],
          },
        },
      },
    },
  ];
};

module.exports = {
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
  // 206 207
  groupPemeriksaanBiasa,
  groupRawatanBiasa,
  groupOplain,
  groupSekolahPemeriksaan,
  groupSekolahRawatan,
  groupSekolahPemeriksaanOKUBW,
  groupSekolahRawatanOKUBW,
  groupKesSelesaiSekolah,
  groupKesSelesaiSekolahOKUBW,
  groupKedatanganSekolah,
  groupKedatanganSekolahAllOAP,
  groupKedatanganSekolahAllOKU,
  pipelineCPPC1Biasa,
  pipelineCPPC1PraSekolah,
  pipelineCPPC2Biasa,
  pipelineCPPC2PraSekolah,
};

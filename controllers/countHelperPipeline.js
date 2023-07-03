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
        ...(payload.kp !== 'all' && { createdByKp: payload.kp }),
        ...(payload.pilihanSekolah && {
          kodSekolah: payload.pilihanSekolah,
        }),
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
        ...(payload.kp !== 'all' && { createdByKp: payload.kp }),
        ...(payload.pilihanSekolah && {
          kodSekolah: payload.pilihanSekolah,
        }),
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
  pipelineCPPC1Biasa,
  pipelineCPPC1PraSekolah,
  pipelineCPPC2Biasa,
  pipelineCPPC2PraSekolah,
};

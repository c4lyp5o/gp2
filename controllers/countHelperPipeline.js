const pipelineSekolah = (payload) => {
  return [
    {
      $match: {
        sekolahSelesaiReten: true,
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
      },
    },
    {
      $project: {
        _id: 0,
        jenisPerkhidmatanSekolah: 1,
        jenisFasiliti: 1,
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
        preserveNullAndEmptyArrays: true,
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
          $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
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

// ni untuk 201 dan 203
const groupSekolah = {
  jumlahPelajar: {
    $sum: 1,
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
            {
              $eq: ['$merged.kebersihanMulutOralHygiene', 'A'],
            },
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
            {
              $eq: ['$merged.kebersihanMulutOralHygiene', 'C'],
            },
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
            {
              $eq: ['$merged.kebersihanMulutOralHygiene', 'E'],
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
        '$merged.eAdaGigiKekal',
        0,
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
            { $eq: ['$merged.dAdaGigiKekal', 0] },
            { $eq: ['$merged.mAdaGigiKekal', 0] },
            { $eq: ['$merged.fAdaGigiKekal', 0] },
            { $eq: ['$merged.xAdaGigiKekal', 0] },
            { $gt: ['$merged.eAdaGigiKekal', 0] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
                { $eq: ['$merged.adaDesidus', true] },
                { $eq: ['$merged.adaKekal', true] },
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
              $eq: ['$merged.skorBpeOralHygiene', '4'],
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
            { $eq: ['$merged.perluPenskaleranOralHygiene', false] },
            {
              $or: [
                { $eq: ['$merged.skorGisMulutOralHygiene', '0'] },
                { $eq: ['$merged.skorGisMulutOralHygiene', '2'] },
              ],
            },
            { $eq: ['$merged.skorBpeOralHygiene', 0] },
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
                { $eq: ['$merged.skorGisMulutOralHygiene', '0'] },
                { $eq: ['$merged.skorGisMulutOralHygiene', '2'] },
              ],
            },
            { $eq: ['$merged.skorBpeOralHygiene', 0] },
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
  jumlahPatientAdaTSL: {
    $sum: {
      $cond: [
        {
          $eq: ['$merged.toothSurfaceLossTrauma', true],
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
                { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                {
                  $and: [
                    { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                    { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
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
                { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                {
                  $and: [
                    { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                    { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
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
                { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                {
                  $and: [
                    { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                    { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
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
                { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                {
                  $and: [
                    { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                    { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
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
                { $eq: ['$jenisFasiliti', 'sekolah-rendah'] },
                {
                  $and: [
                    { $eq: ['$jenisFasiliti', 'sekolah-menengah'] },
                    { $eq: ['$sekolahMmi', 'ya-sekolah-mmi'] },
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
              $eq: ['$merged.kesSelesaiIcdas', 'ya-kes-selesai-icdas'],
            },
            {
              $eq: [
                '$merged.kesSelesaiIcdasSekolahRawatan',
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
              $eq: ['$merged.kesSelesai', 'ya-kes-selesai'],
            },
            {
              $eq: [
                '$merged.kesSelesaiSekolahRawatan',
                'ya-kes-selesai-penyata-akhir-2',
              ],
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

const pipelineKedatanganSekolah = (payload) => {
  return [
    {
      $match: {
        sekolahSelesaiReten: true,
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: {
          $in: ['sekolah-rendah', 'sekolah-menengah'],
        },
      },
    },
    {
      $project: {
        _id: 0,
        jenisPerkhidmatanSekolah: 1,
        jenisFasiliti: 1,
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
        nama: '$result.nama',
        umur: '$result.umur',
        tahunTingkatan: '$result.tahunTingkatan',
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
        sekolahMmi: 1,
        sekolahKki: 1,
        jenisFasiliti: 1,
        jenisPerkhidmatanSekolah: 1,
        nama: 1,
        umur: 1,
        tahunTingkatan: 1,
        warganegara: 1,
        statusOku: 1,
        tarikhPemeriksaan: 1,
        operatorPemeriksaan: 1,
        tarikhRawatan: '$lastRawatan.tarikhRawatanSemasa',
        operatorRawatan: '$lastRawatan.createdByMdcMdtb',
      },
    },
  ];
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

const pipelineEnrolmenSekolah = (payload) => {
  return [
    {
      $match: {
        sekolahSelesaiReten: true,
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
      },
    },
    {
      $project: {
        _id: 0,
        jenisFasiliti: 1,
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

const pipelineCPPC1 = (payload) => {
  return [
    {
      $match: {
        sekolahSelesaiReten: true,
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && {
          createdByKodFasiliti: payload.klinik,
        }),
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
          createdByKodFasiliti: payload.klinik,
        }),
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
  pipelineSekolah,
  groupSekolah,
  groupSekolahPemeriksaan,
  groupSekolahRawatan,
  groupSekolahPemeriksaanOKUBW,
  groupSekolahRawatanOKUBW,
  groupKesSelesaiSekolah,
  groupKesSelesaiSekolahOKUBW,
  pipelineKedatanganSekolah,
  groupKedatanganSekolah,
  groupKedatanganSekolahAllOAP,
  groupKedatanganSekolahAllOKU,
  pipelineEnrolmenSekolah,
  pipelineCPPC1Biasa,
  pipelineCPPC1PraSekolah,
  pipelineCPPC2Biasa,
  pipelineCPPC2PraSekolah,
};

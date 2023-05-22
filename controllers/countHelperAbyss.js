// unused counts
const countPG307 = async (payload) => {
  let match_stage = [];
  let project_stage = [];
  let sort_stage = [];

  let match = { $match: getParams307(payload) };

  const project = {
    $project: {
      _id: placeModifier(payload),
      createdByUsername: 1,
      noSiri: 1,
      nama: 1,
      enrolmen: 1,
      kumpulanEtnik: 1,
      kedatangan: 1,
      jantina: 1,
      kedatangan: 1,
      kebersihanMulutOralHygienePemeriksaanUmum: 1,
      dAdaGigiDesidusPemeriksaanUmum: 1,
      fAdaGigiDesidusPemeriksaanUmum: 1,
      xAdaGigiDesidusPemeriksaanUmum: 1,
      jumlahdfx: {
        $sum: [
          '$dAdaGigiDesidusPemeriksaanUmum',
          '$fAdaGigiDesidusPemeriksaanUmum',
          '$xAdaGigiDesidusPemeriksaanUmum',
        ],
      },
      eAdaGigiKekalPemeriksaanUmum: 1,
      dAdaGigiKekalPemeriksaanUmum: 1,
      mAdaGigiKekalPemeriksaanUmum: 1,
      fAdaGigiKekalPemeriksaanUmum: 1,
      xAdaGigiKekalPemeriksaanUmum: 1,
      totalOfdfx: {
        $sum: [
          '$dAdaGigiKekalPemeriksaanUmum',
          '$mAdaGigiKekalPemeriksaanUmum',
          '$fAdaGigiKekalPemeriksaanUmum',
          'xAdaGigiKekalPemeriksaanUmum',
        ],
      },
      adalahdfx0: {
        $cond: [
          {
            $eq: [
              {
                $sum: [
                  '$dAdaGigiDesidusPemeriksaanUmum',
                  '$fAdaGigiDesidusPemeriksaanUmum',
                  '$xAdaGigiDesidusPemeriksaanUmum',
                ],
              },
              0,
            ],
          },
          1,
        ],
      },
      adalahMBK: {
        $cond: [
          {
            $or: [
              {
                $and: [
                  { $gt: ['$umur', 6] },
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
                ],
              },
            ],
          },
          1,
        ],
      },
      adalahBK: {
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
        ],
      },
      DMFXkurangsama3: {
        $cond: [
          {
            $lte: [
              {
                $sum: [
                  '$dAdaGigiKekalPemeriksaanUmum',
                  '$mAdaGigiKekalPemeriksaanUmum',
                  'fAdaGigiKekalPemeriksaanUmum',
                  '$xAdaGigiKekalPemeriksaanUmum',
                ],
              },
              3,
            ],
          },
          1,
        ],
      },
      XtambahMsama0: {
        $cond: [
          {
            $eq: [
              {
                $sum: [
                  '$xAdaGigiKekalPemeriksaanUmum',
                  '$mAdaGigiKekalPemeriksaanUmum',
                ],
              },
              0,
            ],
          },
          1,
        ],
      },
      Elebihsama1: {
        $cond: [
          {
            $lte: ['$eAdaGigiKekalPemeriksaanUmum', 1],
          },
          1,
        ],
      },
      BKtapiElebih1: {
        $cond: [
          {
            $and: [
              {
                $and: [
                  { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                  { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                ],
              },
              {
                $gt: ['$eAdaGigiKekalPemeriksaanUmum', 1],
              },
            ],
          },
          1,
        ],
      },
      skorGisMulutOralHygienePemeriksaanUmum: 1,
      skorBpeOralHygienePemeriksaanUmum: 1,
      tidakPerluRawatanPemeriksaanUmumMMI: 1, // kena kautim
      tidakPerluRawatanPemeriksaanUmum: 1,
      kecederaanTulangMukaUmum: 1,
      kecederaanGigiUmum: 1,
      kecederaanTisuLembutUmum: 1,
      adaCleftLipPemeriksaanUmum: 1,
      rujukCleftLipPemeriksaanUmum: 1,
      fvPerluSapuanPemeriksaanUmum: 1,
      prrJenis1PemeriksaanUmum: 1,
      baruJumlahGigiKekalPerluPRRJenis1RawatanUmum: 1,
      fissureSealantPemeriksaanUmum: 1,
      baruJumlahGigiKekalPerluFSRawatanUmum: 1,
      // perlu tampal (tiada data lg)
      // rawatan
      pesakitDibuatFluorideVarnish: 1,
      baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum: 1,
      baruJumlahGigiKekalDibuatFSRawatanUmum: 1,
      gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: 1,
      gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: 1,
      gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: 1,
      gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: 1,
      gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: 1,
      jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum: 1,
      // cabut gigi desidus - tiada data
      // cabut gigi kekal - tiada data
      penskaleranRawatanUmum: 1,
      // kes selesai mmi - tiada data
      kesSelesaiRawatanUmum: 1,
    },
  };

  const sort = {
    $sort: {
      tarikhKedatangan: 1,
    },
  };

  match_stage.push(match);
  project_stage.push(project);
  sort_stage.push(sort);

  const pipeline = match_stage.concat(project_stage, sort_stage);

  const data = await Umum.aggregate(pipeline);

  return data;
};
const countPG201 = async (payload) => {
  const { kodSekolah, tahun } = payload;

  let match_stage = [];
  // pra/tadika
  const match_5tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 5 },
    },
  };
  const match_6tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 6 },
    },
  };
  const match_pratad_mbk = {
    $match: {
      kodSekolah: sekolah,
      orangKurangUpaya: true,
    },
  };
  const match_pratad_oap = {
    $match: {
      kodSekolah: sekolah,
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: [{ $or: ['orang-asli', 'penan'] }],
    },
  };
  // year selector
  console.log('in year selector');
  let pilihanTahun = [];
  if (sekolah.match(/^RC|^RB/)) {
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  // sr/srpk/sm/smpk
  const match_grade1 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[0],
    },
  };
  const match_grade2 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[1],
    },
  };
  const match_grade3 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[2],
    },
  };
  const match_grade4 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[3],
    },
  };
  const match_grade5 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[4],
    },
  };
  const match_grade6p = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[5],
    },
  };
  const match_oap_tahun1 = {
    $match: {
      kodSekolah: sekolah,
      tahun: 'D1',
      kumpulanEtnik: [{ $or: ['orang-asli', 'penan'] }],
    },
  };
  const match_oap_tahun6 = {
    $match: {
      kodSekolah: sekolah,
      tahun: 'D6',
      kumpulanEtnik: [{ $or: ['orang-asli', 'penan'] }],
    },
  };
  const match_oap_tingkatan4 = {
    $match: {
      kodSekolah: sekolah,
      tahun: 'T4',
      kumpulanEtnik: [{ $or: ['orang-asli', 'penan'] }],
    },
  };

  match_stage.push(match_5tahun);
  match_stage.push(match_6tahun);
  match_stage.push(match_pratad_mbk);
  match_stage.push(match_pratad_oap);
  match_stage.push(match_grade1);
  match_stage.push(match_grade2);
  match_stage.push(match_grade3);
  match_stage.push(match_grade4);
  match_stage.push(match_grade5);
  match_stage.push(match_grade6p);
  match_stage.push(match_oap_tahun1);
  match_stage.push(match_oap_tahun6);
  match_stage.push(match_oap_tingkatan4);

  // pemeriksaan
  let lookup_stage_1 = {
    $lookup: {
      from: Pemeriksaan.collection.name,
      localField: 'pemeriksaanSekolah',
      foreignField: '_id',
      as: 'pemeriksaanSekolah',
    },
  };
  let unwind_stage_1 = { $unwind: '$pemeriksaanSekolah' };
  let lookup_stage_2 = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let unwind_stage_2 = { $unwind: '$rawatanSekolah' };
  let lookup_stage_3 = {
    $lookup: {
      from: Kotak.collection.name,
      localField: 'kotakSekolah',
      foreignField: '_id',
      as: 'kotakSekolah',
    },
  };
  let unwind_stage_3 = {
    $unwind: {
      path: '$kotakSekolah',
      preserveNullAndEmptyArrays: true,
    },
  };
  let group_stage_1 = {
    $group: {
      _id: '$namaSekolah',
      // namaKlinik: '$pemeriksaanSekolah.createdByKp',
      jumlahBudak: { $sum: 1 },
      engganKedatanganPendaftaran: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.engganKedatanganPendaftaran', true],
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
              $eq: [
                '$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran',
                true,
              ],
            },
            1,
            0,
          ],
        },
      },
      // ambil dari fasilitis
      // enrolmen: {
      //   $sum: {
      //     $cond: [
      //       {
      //         $eq: ['$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran', true],
      //       },
      //       1,
      //       0,
      //     ],
      //   },
      // },
      jumlahKedatanganBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
              ],
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
              $ne: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'A'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'C'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'E'],
            },
            1,
            0,
          ],
        },
      },
      jumlahd: { $sum: '$pemeriksaanSekolah.dAdaGigiDesidus' },
      jumlahf: { $sum: '$pemeriksaanSekolah.fAdaGigiDesidus' },
      jumlahx: { $sum: '$pemeriksaanSekolah.xAdaGigiDesidus' },
      jumlahE: { $sum: '$pemeriksaanSekolah.eAdaGigiKekal' },
      jumlahD: { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' },
      jumlahM: { $sum: '$pemeriksaanSekolah.mAdaGigiKekal' },
      jumlahF: { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
      jumlahX: { $sum: '$pemeriksaanSekolah.xAdaGigiKekal' },
      gigiKekalDMFXsamaAtauKurangDari3: {
        //DMFX<=3 //Formula updated - edited by Leong 03.08.2022
        //DMFX ≤ 3
        $sum: {
          $cond: [
            {
              $lte: [
                {
                  $add: [
                    '$pemeriksaanSekolah.dAdaGigiKekal',
                    '$pemeriksaanSekolah.mAdaGigiKekal',
                    '$pemeriksaanSekolah.fAdaGigiKekal',
                    '$pemeriksaanSekolah.xAdaGigiKekal',
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
      totalStatusGigiKekalSamaKosong: {
        //X+M = 0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      eMoreThanZero: {
        //E≥1 (data utk PGS203)
        $sum: {
          $cond: [
            {
              $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBK: {
        //Formula updated (copied from 201SMKP) - edited by Leong 03.08.2022
        //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
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
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKariesTapiElebihDariSatu: {
        //DMFX=0 ; E≥1
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                { $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      dfxEqualToZero: {
        //dfx=0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBG: {
        //Mulut bebas gingivitis
        $sum: {
          $cond: [
            {
              $and: [
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
      jumlahTprICDAS: {
        //TPR ICDAS - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling, E10 = 0 (perlu FS); E11 = 0 (perlu PRR) ; E12 = 0 (perlu FV)
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
                },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
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
                {
                  $or: [
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                    },
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'],
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
      kecederaanGigiAnterior: {
        $sum: {
          $toDouble: '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
        },
        // $sum: { $kecederaanGigiAnteriorTrauma: 0 },
      },
      cleftAda: {
        $sum: { $toDouble: '$pemeriksaanSekolah.adaCleftLip' },
        // $sum: { $adaCleftLip: 0 },
      },
      cleftRujuk: {
        $sum: { $toDouble: '$pemeriksaanSekolah.rujukCleftLip' },
        // $sum: { $rujukCleftLip: 0 },
      },
      perluFSMuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFs', 'true'],
                },
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFSGigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
      },
      perluFSGigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
      },
      perluFsBilGigiFailed: {
        $sum: '$pemeriksaanSekolah.jumlahGigiFsGagal',
      },
      perluFvMuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFv', 'true'],
                },
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFvMuridS: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv', 0],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFvGigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv',
      },
      perluFvGigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv',
      },
      perluPRR1MuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: [
                    '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
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
      perluPRR1MuridS: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
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
      perluPRR1GigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
      },
      perluPRR1GigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
      },
      perluTampalanAntGdB: {
        $sum: '$pemeriksaanSekolah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkB: {
        $sum: '$pemeriksaanSekolah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      skorGIS0: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '1'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '3'],
            },
            1,
            0,
          ],
        },
      },
      toothSurfaceLoss: {
        $sum: '$pemeriksaanSekolah.toothSurfaceLossTrauma',
      },
      traumaTisuLembut: {
        $sum: '$pemeriksaanSekolah.tisuLembutTrauma',
      },
      traumaTisuKeras: {
        $sum: '$pemeriksaanSekolah.tisuKerasTrauma',
      },
      pesakitAdaFullDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasSediaAdaDenture',
                'penuh-atas-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaPartialDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasSediaAdaDenture',
                'separa-atas-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluFullDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'penuh-atas-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluPartialDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'separa-atas-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaFullDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhBawahSediaAdaDenture',
                'penuh-bawah-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaPartialDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhBawahSediaAdaDenture',
                'separa-bawah-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluFullDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'penuh-bawah-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluPartialDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'separa-bawah-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // rawatan
  let lookup_stage = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let project_stage = {
    $project: {
      namaSekolah: '$namaSekolah',
      rawatanYgDilakukan: {
        $reduce: {
          input: '$rawatanSekolah',
          initialValue: {
            baruJumlahGigiKekalDibuatFs: 0,
            semulaJumlahGigiKekalDibuatFs: 0,
            baruJumlahMuridDibuatFs: 0,
            semulaJumlahMuridDibuatFs: 0,
            baruJumlahGigiKekalDiberiFv: 0,
            semulaJumlahGigiKekalDiberiFv: 0,
            baruJumlahMuridDiberiFv: 0,
            semulaJumlahMuridDiberiFv: 0,
            baruJumlahGigiKekalDiberiPrrJenis1: 0,
            semulaJumlahGigiKekalDiberiPrrJenis1: 0,
            baruJumlahMuridDiberiPrrJenis1: 0,
            semulaJumlahMuridDiberiPrrJenis1: 0,
            baruJumlahGigiYangDiberiSdf: 0,
            semulaJumlahGigiYangDiberiSdf: 0,
            gdBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            cabutDesidus: 0,
            cabutKekal: 0,
            jumlahTampalanSementara: 0,
            pulpotomi: 0,
            endodontik: 0,
            abses: 0,
            penskaleran: 0,
          },
          in: {
            BARU_GgKekalBuatFs: {
              $add: [
                '$$value.baruJumlahGigiKekalDibuatFs',
                '$$this.baruJumlahGigiKekalDibuatFs',
              ],
            },
            BARU_MuridBuatFs: {
              $add: [
                '$$value.baruJumlahMuridDibuatFs',
                '$$this.baruJumlahMuridDibuatFs',
              ],
            },
            BARU_GgKekalBuatFv: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiFv',
                '$$this.baruJumlahGigiKekalDiberiFv',
              ],
            },
            BARU_MuridBuatFv: {
              $add: [
                '$$value.baruJumlahMuridDiberiFv',
                '$$this.baruJumlahMuridDiberiFv',
              ],
            },
            BARU_GgKekalBuatPRR1: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiPrrJenis1',
                '$$this.baruJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            BARU_MuridBuatPRR1: {
              $add: [
                '$$value.baruJumlahMuridDiberiPrrJenis1',
                '$$this.baruJumlahMuridDiberiPrrJenis1',
              ],
            },
            BARU_GgKekalBuatSdf: {
              $add: [
                '$$value.baruJumlahGigiYangDiberiSdf',
                '$$this.baruJumlahGigiYangDiberiSdf',
              ],
            },
            BARU_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            SEMULA_GgKekalBuatFs: {
              $add: [
                '$$value.semulaJumlahGigiKekalDibuatFs',
                '$$this.semulaJumlahGigiKekalDibuatFs',
              ],
            },
            SEMULA_MuridBuatFs: {
              $add: [
                '$$value.semulaJumlahMuridDibuatFs',
                '$$this.semulaJumlahMuridDibuatFs',
              ],
            },
            SEMULA_GgKekalBuatFv: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiFv',
                '$$this.semulaJumlahGigiKekalDiberiFv',
              ],
            },
            SEMULA_MuridBuatFv: {
              $add: [
                '$$value.semulaJumlahMuridDiberiFv',
                '$$this.semulaJumlahMuridDiberiFv',
              ],
            },
            SEMULA_GgKekalBuatPRR1: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiPrrJenis1',
                '$$this.semulaJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            SEMULA_MuridBuatPRR1: {
              $add: [
                '$$value.semulaJumlahMuridDiberiPrrJenis1',
                '$$this.semulaJumlahMuridDiberiPrrJenis1',
              ],
            },
            SEMULA_GgKekalBuatSdf: {
              $add: [
                '$$value.semulaJumlahGigiYangDiberiSdf',
                '$$this.semulaJumlahGigiYangDiberiSdf',
              ],
            },
            SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            cabutDesidus: {
              $add: [
                '$$value.cabutDesidus',
                '$$this.cabutDesidusSekolahRawatan',
              ],
            },
            cabutKekal: {
              $add: ['$$value.cabutKekal', '$$this.cabutKekalSekolahRawatan'],
            },
            tampalanSementara: {
              $add: [
                '$$value.jumlahTampalanSementara',
                '$$this.jumlahTampalanSementaraSekolahRawatan',
              ],
            },
            pulpotomi: {
              $add: ['$$value.pulpotomi', '$$this.pulpotomiSekolahRawatan'],
            },
            endodontik: {
              $add: ['$$value.endodontik', '$$this.endodontikSekolahRawatan'],
            },
            abses: {
              $add: ['$$value.abses', '$$this.absesSekolahRawatan'],
            },
            penskaleran: {
              $add: ['$$value.penskaleran', '$$this.penskaleranSekolahRawatan'],
            },
          },
        },
      },
    },
  };
  let group_stage = {
    $group: {
      _id: '$namaSekolah',
      jumlahBudak: { $sum: 1 },
      BARU_GgKekalBuatFs: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatFs',
      },
      BARU_MuridBuatFs: {
        $sum: '$rawatanYgDilakukan.BARU_MuridBuatFs',
      },
      BARU_GgKekalBuatFv: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatFv',
      },
      BARU_MuridBuatFv: {
        $sum: '$rawatanYgDilakukan.BARU_MuridBuatFv',
      },
      BARU_GgKekalBuatPRR1: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatPRR1',
      },
      BARU_MuridBuatPRR1: {
        $sum: '$rawatanYgDilakukan.BARU_MuridBuatPRR1',
      },
      BARU_GgKekalBuatSdf: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatSdf',
      },
      BARU_GgDesidusAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgDesidusAnteriorBuatTampalanSewarna',
      },
      BARU_GgKekalAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalAnteriorBuatTampalanSewarna',
      },
      BARU_GgDesidusPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgDesidusPosteriorBuatTampalanSewarna',
      },
      BARU_GgKekalPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalPosteriorBuatTampalanSewarna',
      },
      BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.BARU_GgDesidusPosteriorBuatTampalanAmalgam',
      },
      BARU_GgKekalPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalPosteriorBuatTampalanAmalgam',
      },
      //
      SEMULA_GgKekalBuatFs: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatFs',
      },
      SEMULA_MuridBuatFs: {
        $sum: '$rawatanYgDilakukan.SEMULA_MuridBuatFs',
      },
      SEMULA_GgKekalBuatFv: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatFv',
      },
      SEMULA_MuridBuatFv: {
        $sum: '$rawatanYgDilakukan.SEMULA_MuridBuatFv',
      },
      SEMULA_GgKekalBuatPRR1: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatPRR1',
      },
      SEMULA_MuridBuatPRR1: {
        $sum: '$rawatanYgDilakukan.SEMULA_MuridBuatPRR1',
      },
      SEMULA_GgKekalBuatSdf: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatSdf',
      },
      SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgDesidusAnteriorBuatTampalanSewarna',
      },
      SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalAnteriorBuatTampalanSewarna',
      },
      SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgDesidusPosteriorBuatTampalanSewarna',
      },
      SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalPosteriorBuatTampalanSewarna',
      },
      SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgDesidusPosteriorBuatTampalanAmalgam',
      },
      SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalPosteriorBuatTampalanAmalgam',
      },
      //
      cabutDesidus: {
        $sum: '$rawatanYgDilakukan.cabutDesidus',
      },
      cabutKekal: {
        $sum: '$rawatanYgDilakukan.cabutKekal',
      },
      tampalanSementara: {
        $sum: '$rawatanYgDilakukan.jumlahTampalanSementara',
      },
      pulpotomi: {
        $sum: '$rawatanYgDilakukan.pulpotomi',
      },
      endodontik: {
        $sum: '$rawatanYgDilakukan.endodontik',
      },
      abses: {
        $sum: '$rawatanYgDilakukan.abses',
      },
      penskaleran: {
        $sum: '$rawatanYgDilakukan.penskaleran',
      },
    },
  };

  // bismillah
  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let bigData = [];

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage[i],
        lookup_stage_1,
        unwind_stage_1,
        lookup_stage_2,
        unwind_stage_2,
        lookup_stage_3,
        unwind_stage_3,
        group_stage_1,
      ];
      const queryPemeriksaan = await Sekolah.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [
        match_stage[i],
        lookup_stage,
        project_stage,
        group_stage,
      ];
      const queryRawatan = await Sekolah.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countSMKPG201 = async (klinik, bulan, sekolah) => {
  let match_stage = [];
  // pra/tadika
  const match_5tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 5 },
    },
  };
  const match_6tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 6 },
    },
  };
  const match_pratad_mbk = {
    $match: {
      kodSekolah: sekolah,
      orangKurangUpaya: true,
    },
  };
  const match_pratad_oap = {
    $match: {
      kodSekolah: sekolah,
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: [{ $or: ['orang-asli', 'penan'] }],
    },
  };
  // year selector
  console.log('in year selector');
  let pilihanTahun = [];
  if (sekolah.match(/^RC|^RB/)) {
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  // sr/srpk/sm/smpk
  const match_grade1 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[0],
    },
  };
  const match_grade2 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[1],
    },
  };
  const match_grade3 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[2],
    },
  };
  const match_grade4 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[3],
    },
  };
  const match_grade5 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[4],
    },
  };
  const match_grade6p = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[5],
    },
  };

  match_stage.push(match_5tahun);
  match_stage.push(match_6tahun);
  match_stage.push(match_pratad_mbk);
  match_stage.push(match_pratad_oap);
  match_stage.push(match_grade1);
  match_stage.push(match_grade2);
  match_stage.push(match_grade3);
  match_stage.push(match_grade4);
  match_stage.push(match_grade5);
  match_stage.push(match_grade6p);

  // pemeriksaan
  let lookup_stage_1 = {
    $lookup: {
      from: Pemeriksaan.collection.name,
      localField: 'pemeriksaanSekolah',
      foreignField: '_id',
      as: 'pemeriksaanSekolah',
    },
  };
  let unwind_stage_1 = { $unwind: '$pemeriksaanSekolah' };
  let lookup_stage_2 = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let unwind_stage_2 = { $unwind: '$rawatanSekolah' };
  let lookup_stage_3 = {
    $lookup: {
      from: Kotak.collection.name,
      localField: 'kotakSekolah',
      foreignField: '_id',
      as: 'kotakSekolah',
    },
  };
  let unwind_stage_3 = {
    $unwind: {
      path: '$kotakSekolah',
      preserveNullAndEmptyArrays: true,
    },
  };
  let group_stage_1 = {
    $group: {
      _id: '$namaSekolah',
      // namaKlinik: '$pemeriksaanSekolah.createdByKp',
      jumlahBudak: { $sum: 1 },
      engganKedatanganPendaftaran: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.engganKedatanganPendaftaran', true],
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
              $eq: [
                '$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran',
                true,
              ],
            },
            1,
            0,
          ],
        },
      },
      // ambil dari fasilitis
      // enrolmen: {
      //   $sum: {
      //     $cond: [
      //       {
      //         $eq: ['$tidakHadirKedatanganPendaftaran', true],
      //       },
      //       1,
      //       0,
      //     ],
      //   },
      // },
      jumlahKedatanganBaru: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
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
              $ne: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'A'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'C'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'E'],
            },
            1,
            0,
          ],
        },
      },
      jumlahd: { $sum: '$pemeriksaanSekolah.dAdaGigiDesidus' },
      jumlahf: { $sum: '$pemeriksaanSekolah.fAdaGigiDesidus' },
      jumlahx: { $sum: '$pemeriksaanSekolah.xAdaGigiDesidus' },
      jumlahD: { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' },
      jumlahM: { $sum: '$pemeriksaanSekolah.mAdaGigiKekal' },
      jumlahF: { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
      jumlahX: { $sum: '$pemeriksaanSekolah.xAdaGigiKekal' },
      gigiKekalDMFXsamaAtauKurangDari3: {
        //DMFX<=3 //Formula updated - edited by Leong 03.08.2022
        //DMFX ≤ 3
        $sum: {
          $cond: [
            {
              $lte: [
                {
                  $add: [
                    '$pemeriksaanSekolah.dAdaGigiKekal',
                    '$pemeriksaanSekolah.mAdaGigiKekal',
                    '$pemeriksaanSekolah.fAdaGigiKekal',
                    '$pemeriksaanSekolah.xAdaGigiKekal',
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
      totalStatusGigiKekalSamaKosong: {
        //X+M = 0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBK: {
        //Formula updated (copied from 201SMKP) - edited by Leong 03.08.2022
        //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
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
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      dfxEqualToZero: {
        //dfx=0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBG: {
        //Mulut bebas gingivitis
        $sum: {
          $cond: [
            {
              $and: [
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
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $and: [
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
                {
                  $or: [
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                    },
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'],
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
      kecederaanGigiAnterior: {
        $sum: {
          $toDouble: '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
        },
        // $sum: { $kecederaanGigiAnteriorTrauma: 0 },
      },
      cleftAda: {
        $sum: { $toDouble: '$pemeriksaanSekolah.adaCleftLip' },
        // $sum: { $adaCleftLip: 0 },
      },
      cleftRujuk: {
        $sum: { $toDouble: '$pemeriksaanSekolah.rujukCleftLip' },
        // $sum: { $rujukCleftLip: 0 },
      },
      perluFSMuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs', 0],
                },
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
                    '0',
                  ],
                },
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFSGigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
      },
      perluFSGigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
      },
      perluFsBilGigiFailed: {
        $sum: '$pemeriksaanSekolah.jumlahGigiFsGagal',
      },
      perluPRR1GigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
      },
      perluPRR1GigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
      },
      perluTampalanAntGdB: {
        $sum: '$pemeriksaanSekolah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkB: {
        $sum: '$pemeriksaanSekolah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      skorGIS0: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '1'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '3'],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // rawatan
  let lookup_stage = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let unwind_stage = {
    $unwind: {
      path: '$rawatanSekolah',
      preserveNullAndEmptyArrays: true,
    },
  };
  let project_stage = {
    $project: {
      namaSekolah: '$namaSekolah',
      rawatanYgDilakukan: {
        $reduce: {
          input: '$rawatanSekolah',
          initialValue: {
            baruJumlahGigiKekalDibuatFs: 0,
            semulaJumlahGigiKekalDibuatFs: 0,
            baruJumlahMuridDibuatFs: 0,
            semulaJumlahMuridDibuatFs: 0,
            gdBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            cabutDesidusSekolahRawatan: 0,
            cabutKekalSekolahRawatan: 0,
            penskaleranSekolahRawatan: 0,
            kesSelesaiSekolahRawatan: 0,
          },
          in: {
            BARU_GgKekalBuatFs: {
              $add: [
                '$$value.baruJumlahGigiKekalDibuatFs',
                '$$this.baruJumlahGigiKekalDibuatFs',
              ],
            },
            BARU_MuridBuatFs: {
              $add: [
                '$$value.baruJumlahMuridDibuatFs',
                '$$this.baruJumlahMuridDibuatFs',
              ],
            },
            BARU_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //semula
            SEMULA_GgKekalBuatFs: {
              $add: [
                '$$value.semulaJumlahGigiKekalDibuatFs',
                '$$this.semulaJumlahGigiKekalDibuatFs',
              ],
            },
            SEMULA_MuridBuatFs: {
              $add: [
                '$$value.semulaJumlahMuridDibuatFs',
                '$$this.semulaJumlahMuridDibuatFs',
              ],
            },
            SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            cabutDesidus: {
              $add: [
                '$$value.cabutDesidusSekolahRawatan',
                '$$this.cabutDesidusSekolahRawatan',
              ],
            },
            cabutKekal: {
              $add: [
                '$$value.cabutDesidusSekolahRawatan',
                '$$this.cabutKekalSekolahRawatan',
              ],
            },
            penskaleran: {
              $add: [
                '$$value.penskaleranSekolahRawatan',
                '$$this.penskaleranSekolahRawatan',
              ],
            },
            caseCompleted: {
              $add: [
                '$$value.kesSelesaiSekolahRawatan',
                '$$this.kesSelesaiSekolahRawatan',
              ],
            },
          },
        },
      },
    },
  };
  let group_stage = {
    $group: {
      _id: '$namaSekolah',
      jumlahBudak: { $sum: 1 },
      telahFSMuridB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDibuatFs',
      },
      telahFSMuridS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDibuatFs',
      },
      telahFSGigiB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDibuatFs',
      },
      telahFSGigiS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDibuatFs',
      },
      telahTampalanAntGdB: {
        $sum: '$rawatanSekolah.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGdS: {
        $sum: '$rawatanSekolah.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGkB: {
        $sum: '$rawatanSekolah.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGkS: {
        $sum: '$rawatanSekolah.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGdB: {
        $sum: '$rawatanSekolah.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGdS: {
        $sum: '$rawatanSekolah.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGkB: {
        $sum: '$rawatanSekolah.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGkS: {
        $sum: '$rawatanSekolah.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAmgGdB: {
        $sum: '$rawatanSekolah.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGdS: {
        $sum: '$rawatanSekolah.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGkB: {
        $sum: '$rawatanSekolah.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGkS: {
        $sum: '$rawatanSekolah.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
      },
      cabutanGd: {
        $sum: '$rawatanSekolah.cabutDesidusSekolahRawatan',
      },
      cabutanGk: {
        $sum: '$rawatanSekolah.cabutKekalSekolahRawatan',
      },
      penskaleran: {
        $sum: '$rawatanSekolah.penskaleranSekolahRawatan',
      },
      caseCompleted: {
        $sum: {
          $cond: [
            {
              $eq: ['$rawatanSekolah.kesSelesaiIcdasSekolahRawatan', true],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // bismillah
  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let bigData = [];

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage[i],
        lookup_stage_1,
        unwind_stage_1,
        lookup_stage_2,
        unwind_stage_2,
        lookup_stage_3,
        unwind_stage_3,
        group_stage_1,
      ];
      const queryPemeriksaan = await Sekolah.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [
        match_stage[i],
        lookup_stage,
        project_stage,
        group_stage,
      ];
      const queryRawatan = await Sekolah.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPG201A = async (klinik, bulan, sekolah) => {
  let match_stage = [];
  // pra/tadika
  const match_5tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 5 },
    },
  };
  const match_6tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 6 },
    },
  };
  const match_pratad_mbk = {
    $match: {
      kodSekolah: sekolah,
      orangKurangUpaya: true,
    },
  };
  const match_pratad_oap = {
    $match: {
      kodSekolah: sekolah,
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: [{ $or: ['orang-asli', 'penan'] }],
    },
  };
  // year selector
  console.log('in year selector');
  let pilihanTahun = [];
  if (sekolah.match(/^RC|^RB/)) {
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  // sr/srpk/sm/smpk
  const match_grade1 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[0],
    },
  };
  const match_grade2 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[1],
    },
  };
  const match_grade3 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[2],
    },
  };
  const match_grade4 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[3],
    },
  };
  const match_grade5 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[4],
    },
  };
  const match_grade6p = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[5],
    },
  };

  match_stage.push(match_5tahun);
  match_stage.push(match_6tahun);
  match_stage.push(match_pratad_mbk);
  match_stage.push(match_pratad_oap);
  match_stage.push(match_grade1);
  match_stage.push(match_grade2);
  match_stage.push(match_grade3);
  match_stage.push(match_grade4);
  match_stage.push(match_grade5);
  match_stage.push(match_grade6p);

  // pemeriksaan
  let lookup_stage_1 = {
    $lookup: {
      from: Pemeriksaan.collection.name,
      localField: 'pemeriksaanSekolah',
      foreignField: '_id',
      as: 'pemeriksaanSekolah',
    },
  };
  let unwind_stage_1 = { $unwind: '$pemeriksaanSekolah' };
  let lookup_stage_2 = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let unwind_stage_2 = { $unwind: '$rawatanSekolah' };
  let lookup_stage_3 = {
    $lookup: {
      from: Kotak.collection.name,
      localField: 'kotakSekolah',
      foreignField: '_id',
      as: 'kotakSekolah',
    },
  };
  let unwind_stage_3 = {
    $unwind: {
      path: '$kotakSekolah',
      preserveNullAndEmptyArrays: true,
    },
  };
  let group_stage_1 = {
    $group: {
      _id: '$namaSekolah',
      // namaKlinik: '$pemeriksaanSekolah.createdByKp',
      jumlahBudak: { $sum: 1 },
      engganKedatanganPendaftaran: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.engganKedatanganPendaftaran', true],
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
              $eq: [
                '$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran',
                true,
              ],
            },
            1,
            0,
          ],
        },
      },
      // ambil dari fasilitis
      // enrolmen: {
      //   $sum: {
      //     $cond: [
      //       {
      //         $eq: ['$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran', true],
      //       },
      //       1,
      //       0,
      //     ],
      //   },
      // },
      jumlahKedatanganBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
              ],
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
              $ne: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'A'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'C'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'E'],
            },
            1,
            0,
          ],
        },
      },
      jumlahd: { $sum: '$pemeriksaanSekolah.dAdaGigiDesidus' },
      jumlahf: { $sum: '$pemeriksaanSekolah.fAdaGigiDesidus' },
      jumlahx: { $sum: '$pemeriksaanSekolah.xAdaGigiDesidus' },
      jumlahE: { $sum: '$pemeriksaanSekolah.eAdaGigiKekal' },
      jumlahD: { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' },
      jumlahM: { $sum: '$pemeriksaanSekolah.mAdaGigiKekal' },
      jumlahF: { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
      jumlahX: { $sum: '$pemeriksaanSekolah.xAdaGigiKekal' },
      gigiKekalDMFXsamaAtauKurangDari3: {
        //DMFX ≤ 3
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 1] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 1] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 1] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      totalStatusGigiKekalSamaKosong: {
        //X+M = 0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      eMoreThanZero: {
        //E≥1 (ada karies awal)
        $sum: {
          $cond: [
            {
              $and: [{ $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] }],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBK: {
        //MBK
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0],
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
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKariesTapiElebihDariSatu: {
        //DMFX=0 ; E≥1
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                { $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      dfxEqualToZero: {
        //dfx=0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBG: {
        //Mulut bebas gingivitis
        $sum: {
          $cond: [
            {
              $and: [
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
      jumlahTprICDAS: {
        //TPR ICDAS - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling, E10 = 0 (perlu FS); E11 = 0 (perlu PRR) ; E12 = 0 (perlu FV)
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
                },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
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
                {
                  $or: [
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                    },
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'],
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
      kecederaanGigiAnterior: {
        $sum: {
          $toDouble: '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
        },
        // $sum: { $kecederaanGigiAnteriorTrauma: 0 },
      },
      cleftAda: {
        $sum: { $toDouble: '$pemeriksaanSekolah.adaCleftLip' },
        // $sum: { $adaCleftLip: 0 },
      },
      cleftRujuk: {
        $sum: { $toDouble: '$pemeriksaanSekolah.rujukCleftLip' },
        // $sum: { $rujukCleftLip: 0 },
      },
      perluFSMuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFs', 'true'],
                },
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFSGigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
      },
      perluFSGigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
      },
      perluFsBilGigiFailed: {
        $sum: '$pemeriksaanSekolah.jumlahGigiFsGagal',
      },
      perluFvMuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFv', 'true'],
                },
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFvMuridS: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv', 0],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFvGigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv',
      },
      perluFvGigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv',
      },
      perluPRR1MuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: [
                    '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
                    'true',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluPRR1MuridS: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
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
      perluPRR1GigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
      },
      perluPRR1GigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
      },
      perluTampalanAntGdB: {
        $sum: '$pemeriksaanSekolah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkB: {
        $sum: '$pemeriksaanSekolah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      skorGIS0: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '1'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '3'],
            },
            1,
            0,
          ],
        },
      },
      toothSurfaceLoss: {
        $sum: '$pemeriksaanSekolah.toothSurfaceLossTrauma',
      },
      traumaTisuLembut: {
        $sum: '$pemeriksaanSekolah.tisuLembutTrauma',
      },
      traumaTisuKeras: {
        $sum: '$pemeriksaanSekolah.tisuKerasTrauma',
      },
      pesakitAdaFullDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasSediaAdaDenture',
                'penuh-atas-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaPartialDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasSediaAdaDenture',
                'separa-atas-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluFullDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'penuh-atas-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluPartialDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'separa-atas-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaFullDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhBawahSediaAdaDenture',
                'penuh-bawah-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaPartialDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhBawahSediaAdaDenture',
                'separa-bawah-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluFullDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'penuh-bawah-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluPartialDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'separa-bawah-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // rawatan
  let lookup_stage = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let project_stage = {
    $project: {
      namaSekolah: '$namaSekolah',
      rawatanYgDilakukan: {
        $reduce: {
          input: '$rawatanSekolah',
          initialValue: {
            baruJumlahGigiKekalDibuatFs: 0,
            semulaJumlahGigiKekalDibuatFs: 0,
            baruJumlahMuridDibuatFs: 0,
            semulaJumlahMuridDibuatFs: 0,
            baruJumlahGigiKekalDiberiFv: 0,
            semulaJumlahGigiKekalDiberiFv: 0,
            baruJumlahMuridDiberiFv: 0,
            semulaJumlahMuridDiberiFv: 0,
            baruJumlahGigiKekalDiberiPrrJenis1: 0,
            semulaJumlahGigiKekalDiberiPrrJenis1: 0,
            baruJumlahMuridDiberiPrrJenis1: 0,
            semulaJumlahMuridDiberiPrrJenis1: 0,
            baruJumlahGigiYangDiberiSdf: 0,
            semulaJumlahGigiYangDiberiSdf: 0,
            gdBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            cabutDesidus: 0,
            cabutKekal: 0,
            jumlahTampalanSementara: 0,
            pulpotomi: 0,
            endodontik: 0,
            abses: 0,
            penskaleran: 0,
          },
          in: {
            BARU_GgKekalBuatFs: {
              $add: [
                '$$value.baruJumlahGigiKekalDibuatFs',
                '$$this.baruJumlahGigiKekalDibuatFs',
              ],
            },
            BARU_MuridBuatFs: {
              $add: [
                '$$value.baruJumlahMuridDibuatFs',
                '$$this.baruJumlahMuridDibuatFs',
              ],
            },
            BARU_GgKekalBuatFv: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiFv',
                '$$this.baruJumlahGigiKekalDiberiFv',
              ],
            },
            BARU_MuridBuatFv: {
              $add: [
                '$$value.baruJumlahMuridDiberiFv',
                '$$this.baruJumlahMuridDiberiFv',
              ],
            },
            BARU_GgKekalBuatPRR1: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiPrrJenis1',
                '$$this.baruJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            BARU_MuridBuatPRR1: {
              $add: [
                '$$value.baruJumlahMuridDiberiPrrJenis1',
                '$$this.baruJumlahMuridDiberiPrrJenis1',
              ],
            },
            BARU_GgKekalBuatSdf: {
              $add: [
                '$$value.baruJumlahGigiYangDiberiSdf',
                '$$this.baruJumlahGigiYangDiberiSdf',
              ],
            },
            BARU_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            SEMULA_GgKekalBuatFs: {
              $add: [
                '$$value.semulaJumlahGigiKekalDibuatFs',
                '$$this.semulaJumlahGigiKekalDibuatFs',
              ],
            },
            SEMULA_MuridBuatFs: {
              $add: [
                '$$value.semulaJumlahMuridDibuatFs',
                '$$this.semulaJumlahMuridDibuatFs',
              ],
            },
            SEMULA_GgKekalBuatFv: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiFv',
                '$$this.semulaJumlahGigiKekalDiberiFv',
              ],
            },
            SEMULA_MuridBuatFv: {
              $add: [
                '$$value.semulaJumlahMuridDiberiFv',
                '$$this.semulaJumlahMuridDiberiFv',
              ],
            },
            SEMULA_GgKekalBuatPRR1: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiPrrJenis1',
                '$$this.semulaJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            SEMULA_MuridBuatPRR1: {
              $add: [
                '$$value.semulaJumlahMuridDiberiPrrJenis1',
                '$$this.semulaJumlahMuridDiberiPrrJenis1',
              ],
            },
            SEMULA_GgKekalBuatSdf: {
              $add: [
                '$$value.semulaJumlahGigiYangDiberiSdf',
                '$$this.semulaJumlahGigiYangDiberiSdf',
              ],
            },
            SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            cabutDesidus: {
              $add: [
                '$$value.cabutDesidus',
                '$$this.cabutDesidusSekolahRawatan',
              ],
            },
            cabutKekal: {
              $add: ['$$value.cabutKekal', '$$this.cabutKekalSekolahRawatan'],
            },
            tampalanSementara: {
              $add: [
                '$$value.jumlahTampalanSementara',
                '$$this.jumlahTampalanSementaraSekolahRawatan',
              ],
            },
            pulpotomi: {
              $add: ['$$value.pulpotomi', '$$this.pulpotomiSekolahRawatan'],
            },
            endodontik: {
              $add: ['$$value.endodontik', '$$this.endodontikSekolahRawatan'],
            },
            abses: {
              $add: ['$$value.abses', '$$this.absesSekolahRawatan'],
            },
            penskaleran: {
              $add: ['$$value.penskaleran', '$$this.penskaleranSekolahRawatan'],
            },
          },
        },
      },
    },
  };
  let group_stage = {
    $group: {
      _id: '$namaSekolah',
      jumlahBudak: { $sum: 1 },
      telahFSMuridB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDibuatFs',
      },
      telahFSMuridS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDibuatFs',
      },
      telahFSGigiB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDibuatFs',
      },
      telahFSGigiS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDibuatFs',
      },
      telahFvMuridB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDiberiFv',
      },
      telahFvMuridS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDiberiFv',
      },
      telahFvGigiB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDiberiFv',
      },
      telahFvGigiS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDiberiFv',
      },
      telahPRR1MuridB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1',
      },
      telahPRR1MuridS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDiberiPrrJenis1',
      },
      telahPRR1GigiB: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1',
      },
      telahPRR1GigiS: {
        $sum: '$rawatanSekolah.semulaJumlahGigiKekalDiberiPrrJenis1',
      },
      telahTampalanAntGdB: {
        $sum: '$rawatanSekolah.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGdS: {
        $sum: '$rawatanSekolah.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGkB: {
        $sum: '$rawatanSekolah.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGkS: {
        $sum: '$rawatanSekolah.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGdB: {
        $sum: '$rawatanSekolah.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGdS: {
        $sum: '$rawatanSekolah.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGkB: {
        $sum: '$rawatanSekolah.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGkS: {
        $sum: '$rawatanSekolah.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAmgGdB: {
        $sum: '$rawatanSekolah.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGdS: {
        $sum: '$rawatanSekolah.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGkB: {
        $sum: '$rawatanSekolah.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGkS: {
        $sum: '$rawatanSekolah.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
      },
      cabutanGd: {
        $sum: '$rawatanSekolah.cabutDesidusSekolahRawatan',
      },
      cabutanGk: {
        $sum: '$rawatanSekolah.cabutKekalSekolahRawatan',
      },
      penskaleran: {
        $sum: '$rawatanSekolah.penskaleranSekolahRawatan',
      },
      caseCompletedICDAS: {
        $sum: {
          $cond: [
            {
              $eq: ['$rawatanSekolah.kesSelesaiIcdasSekolahRawatan', true],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // bismillah
  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let bigData = [];

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage[i],
        lookup_stage_1,
        unwind_stage_1,
        lookup_stage_2,
        unwind_stage_2,
        lookup_stage_3,
        unwind_stage_3,
        group_stage_1,
      ];
      const queryPemeriksaan = await Sekolah.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [
        match_stage[i],
        lookup_stage,
        project_stage,
        group_stage,
      ];
      const queryRawatan = await Sekolah.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPG201PindSatu2022 = async (payload) => {
  let match_stage = [];
  // pra/tadika
  const match_5tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 5 },
    },
  };
  const match_6tahun = {
    $match: {
      kodSekolah: sekolah,
      umur: { $eq: 6 },
    },
  };
  const match_pratad_mbk = {
    $match: {
      kodSekolah: sekolah,
      orangKurangUpaya: true,
    },
  };
  const match_pratad_oap = {
    $match: {
      kodSekolah: sekolah,
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: [{ $or: ['orang-asli', 'penan'] }],
    },
  };
  // year selector
  console.log('in year selector');
  let pilihanTahun = [];
  if (sekolah.match(/^RC|^RB/)) {
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  // sr/srpk/sm/smpk
  const match_grade1 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[0],
    },
  };
  const match_grade2 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[1],
    },
  };
  const match_grade3 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[2],
    },
  };
  const match_grade4 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[3],
    },
  };
  const match_grade5 = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[4],
    },
  };
  const match_grade6p = {
    $match: {
      kodSekolah: sekolah,
      tahun: pilihanTahun[5],
    },
  };

  match_stage.push(match_5tahun);
  match_stage.push(match_6tahun);
  match_stage.push(match_pratad_mbk);
  match_stage.push(match_pratad_oap);
  match_stage.push(match_grade1);
  match_stage.push(match_grade2);
  match_stage.push(match_grade3);
  match_stage.push(match_grade4);
  match_stage.push(match_grade5);
  match_stage.push(match_grade6p);

  // pemeriksaan
  let lookup_stage_1 = {
    $lookup: {
      from: Pemeriksaan.collection.name,
      localField: 'pemeriksaanSekolah',
      foreignField: '_id',
      as: 'pemeriksaanSekolah',
    },
  };
  let unwind_stage_1 = { $unwind: '$pemeriksaanSekolah' };
  let lookup_stage_2 = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let unwind_stage_2 = { $unwind: '$rawatanSekolah' };
  let lookup_stage_3 = {
    $lookup: {
      from: Kotak.collection.name,
      localField: 'kotakSekolah',
      foreignField: '_id',
      as: 'kotakSekolah',
    },
  };
  let unwind_stage_3 = {
    $unwind: {
      path: '$kotakSekolah',
      preserveNullAndEmptyArrays: true,
    },
  };
  let group_stage_1 = {
    $group: {
      _id: '$namaSekolah',
      // namaKlinik: '$pemeriksaanSekolah.createdByKp',
      jumlahBudak: { $sum: 1 },
      engganKedatanganPendaftaran: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.engganKedatanganPendaftaran', true],
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
              $eq: [
                '$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran',
                true,
              ],
            },
            1,
            0,
          ],
        },
      },
      // ambil dari fasilitis
      // enrolmen: {
      //   $sum: {
      //     $cond: [
      //       {
      //         $eq: ['$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran', true],
      //       },
      //       1,
      //       0,
      //     ],
      //   },
      // },
      jumlahKedatanganBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
              ],
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
              $ne: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'A'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'C'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'E'],
            },
            1,
            0,
          ],
        },
      },
      jumlahd: { $sum: '$pemeriksaanSekolah.dAdaGigiDesidus' },
      jumlahf: { $sum: '$pemeriksaanSekolah.fAdaGigiDesidus' },
      jumlahx: { $sum: '$pemeriksaanSekolah.xAdaGigiDesidus' },
      jumlahE: { $sum: '$pemeriksaanSekolah.eAdaGigiKekal' },
      jumlahD: { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' },
      jumlahM: { $sum: '$pemeriksaanSekolah.mAdaGigiKekal' },
      jumlahF: { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
      jumlahX: { $sum: '$pemeriksaanSekolah.xAdaGigiKekal' },
      dfxEqualToZero: {
        //dfx=0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBK: {
        //Formula updated (copied from 201SMKP) - edited by Leong 03.08.2022
        //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
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
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      gigiKekalDMFXsamaAtauKurangDari3: {
        //DMFX<=3 //Formula updated - edited by Leong 03.08.2022
        //DMFX ≤ 3
        $sum: {
          $cond: [
            {
              $lte: [
                {
                  $add: [
                    '$pemeriksaanSekolah.dAdaGigiKekal',
                    '$pemeriksaanSekolah.mAdaGigiKekal',
                    '$pemeriksaanSekolah.fAdaGigiKekal',
                    '$pemeriksaanSekolah.xAdaGigiKekal',
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
      totalStatusGigiKekalSamaKosong: {
        //X+M = 0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      eMoreThanZero: {
        //E≥1 (ada karies awal)
        $sum: {
          $cond: [
            {
              $and: [{ $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] }],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKariesTapiElebihDariSatu: {
        //DMFX=0 ; E≥1
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                { $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] },
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '1'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '3'],
            },
            1,
            0,
          ],
        },
      },
      jumlahTprICDAS: {
        //TPR ICDAS - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling, E10 = 0 (perlu FS); E11 = 0 (perlu PRR) ; E12 = 0 (perlu FV)
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
                },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
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
                {
                  $or: [
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                    },
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'],
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
      TPR: {
        //TPR Biasa - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling
        $sum: {
          $cond: [
            {
              $and: [
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
                {
                  $or: [
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                    },
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'],
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
      traumaTisuKeras: {
        $sum: '$pemeriksaanSekolah.tisuKerasTrauma',
      },
      kecederaanGigi: {
        $sum: {
          $toDouble: '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
        },
        // $sum: { $kecederaanGigiAnteriorTrauma: 0 },
      },
      traumaTisuLembut: {
        $sum: '$pemeriksaanSekolah.tisuLembutTrauma',
      },
      toothSurfaceLoss: {
        $sum: '$pemeriksaanSekolah.toothSurfaceLossTrauma',
      },
      cleftAda: {
        $sum: { $toDouble: '$pemeriksaanSekolah.adaCleftLip' },
        // $sum: { $adaCleftLip: 0 },
      },
      cleftRujuk: {
        $sum: { $toDouble: '$pemeriksaanSekolah.rujukCleftLip' },
        // $sum: { $rujukCleftLip: 0 },
      },
      perluFvMurid: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFv', '0'],
                },
                {
                  $gt: ['$pemeriksaanSekolah.semulaJumlahMuridPerluFv', '0'],
                },
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv', '0'],
                },
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv',
                    '0',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluPRR1Murid: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $gt: [
                    '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
                    '0',
                  ],
                },
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
                    '0',
                  ],
                },
                {
                  $gt: [
                    '$pemeriksaanSekolah.baruJumlahMuridPerluPrrJenis1',
                    '0',
                  ],
                },
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahMuridPerluPrrJenis1',
                    '0',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluPRR1Gigi: {
        $sum: {
          $and: [
            '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
            '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
          ],
        },
      },
      perluFSMurid: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFs', '0'],
                },
                {
                  $gt: ['$pemeriksaanSekolah.semulaJumlahMuridPerluFs', '0'],
                },
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs', '0'],
                },
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
                    '0',
                  ],
                },
                {
                  $gt: ['$pemeriksaanSekolah.jumlahGigiFsGagal', '0'],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFSGigi: {
        $sum: {
          $and: [
            '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
            'pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
            'pemeriksaanSekolah.jumlahGigiFsGagal',
          ],
        },
      },
      perluTampalanAntGdB: {
        $sum: '$pemeriksaanSekolah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkB: {
        $sum: '$pemeriksaanSekolah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
    },
  };

  // rawatan
  let lookup_stage = {
    $lookup: {
      from: Rawatan.collection.name,
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };
  let project_stage = {
    $project: {
      namaSekolah: '$namaSekolah',
      rawatanYgDilakukan: {
        $reduce: {
          input: '$rawatanSekolah',
          initialValue: {
            baruJumlahGigiKekalDibuatFs: 0,
            semulaJumlahGigiKekalDibuatFs: 0,
            baruJumlahMuridDibuatFs: 0,
            semulaJumlahMuridDibuatFs: 0,
            baruJumlahGigiKekalDiberiFv: 0,
            semulaJumlahGigiKekalDiberiFv: 0,
            baruJumlahMuridDiberiFv: 0,
            semulaJumlahMuridDiberiFv: 0,
            baruJumlahGigiKekalDiberiPrrJenis1: 0,
            semulaJumlahGigiKekalDiberiPrrJenis1: 0,
            baruJumlahMuridDiberiPrrJenis1: 0,
            semulaJumlahMuridDiberiPrrJenis1: 0,
            baruJumlahGigiYangDiberiSdf: 0,
            semulaJumlahGigiYangDiberiSdf: 0,
            gdBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            cabutDesidus: 0,
            cabutKekal: 0,
            jumlahTampalanSementara: 0,
            pulpotomi: 0,
            endodontik: 0,
            abses: 0,
            penskaleran: 0,
          },
          in: {
            BARU_GgKekalBuatFs: {
              $add: [
                '$$value.baruJumlahGigiKekalDibuatFs',
                '$$this.baruJumlahGigiKekalDibuatFs',
              ],
            },
            BARU_MuridBuatFs: {
              $add: [
                '$$value.baruJumlahMuridDibuatFs',
                '$$this.baruJumlahMuridDibuatFs',
              ],
            },
            BARU_GgKekalBuatFv: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiFv',
                '$$this.baruJumlahGigiKekalDiberiFv',
              ],
            },
            BARU_MuridBuatFv: {
              $add: [
                '$$value.baruJumlahMuridDiberiFv',
                '$$this.baruJumlahMuridDiberiFv',
              ],
            },
            BARU_GgKekalBuatPRR1: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiPrrJenis1',
                '$$this.baruJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            BARU_MuridBuatPRR1: {
              $add: [
                '$$value.baruJumlahMuridDiberiPrrJenis1',
                '$$this.baruJumlahMuridDiberiPrrJenis1',
              ],
            },
            BARU_GgKekalBuatSdf: {
              $add: [
                '$$value.baruJumlahGigiYangDiberiSdf',
                '$$this.baruJumlahGigiYangDiberiSdf',
              ],
            },
            BARU_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            SEMULA_GgKekalBuatFs: {
              $add: [
                '$$value.semulaJumlahGigiKekalDibuatFs',
                '$$this.semulaJumlahGigiKekalDibuatFs',
              ],
            },
            SEMULA_MuridBuatFs: {
              $add: [
                '$$value.semulaJumlahMuridDibuatFs',
                '$$this.semulaJumlahMuridDibuatFs',
              ],
            },
            SEMULA_GgKekalBuatFv: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiFv',
                '$$this.semulaJumlahGigiKekalDiberiFv',
              ],
            },
            SEMULA_MuridBuatFv: {
              $add: [
                '$$value.semulaJumlahMuridDiberiFv',
                '$$this.semulaJumlahMuridDiberiFv',
              ],
            },
            SEMULA_GgKekalBuatPRR1: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiPrrJenis1',
                '$$this.semulaJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            SEMULA_MuridBuatPRR1: {
              $add: [
                '$$value.semulaJumlahMuridDiberiPrrJenis1',
                '$$this.semulaJumlahMuridDiberiPrrJenis1',
              ],
            },
            SEMULA_GgKekalBuatSdf: {
              $add: [
                '$$value.semulaJumlahGigiYangDiberiSdf',
                '$$this.semulaJumlahGigiYangDiberiSdf',
              ],
            },
            SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            cabutDesidus: {
              $add: [
                '$$value.cabutDesidus',
                '$$this.cabutDesidusSekolahRawatan',
              ],
            },
            cabutKekal: {
              $add: ['$$value.cabutKekal', '$$this.cabutKekalSekolahRawatan'],
            },
            tampalanSementara: {
              $add: [
                '$$value.jumlahTampalanSementara',
                '$$this.jumlahTampalanSementaraSekolahRawatan',
              ],
            },
            pulpotomi: {
              $add: ['$$value.pulpotomi', '$$this.pulpotomiSekolahRawatan'],
            },
            endodontik: {
              $add: ['$$value.endodontik', '$$this.endodontikSekolahRawatan'],
            },
            abses: {
              $add: ['$$value.abses', '$$this.absesSekolahRawatan'],
            },
            penskaleran: {
              $add: ['$$value.penskaleran', '$$this.penskaleranSekolahRawatan'],
            },
          },
        },
      },
    },
  };
  let group_stage = {
    $group: {
      _id: '$namaSekolah',
      jumlahBudak: { $sum: 1 },
      telahFvMurid: {
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
      telahPRR1Murid: {
        $sum: {
          $cond: [
            {
              $eq: ['$rawatanSekolah.muridDiberiPrrJenis1', true],
            },
            1,
            0,
          ],
        },
      },
      telahPRR1Gigi: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDiberiPrrJenis1',
      },
      telahFSMurid: {
        $sum: {
          $cond: [
            {
              $eq: ['$rawatanSekolah.muridDibuatFs', true],
            },
            1,
            0,
          ],
        },
      },
      telahFSGigi: {
        $sum: '$rawatanSekolah.baruJumlahGigiKekalDibuatFs',
      },
      telahTampalanAntGdB: {
        $sum: '$rawatanSekolah.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGdS: {
        $sum: '$rawatanSekolah.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGkB: {
        $sum: '$rawatanSekolah.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAntGkS: {
        $sum: '$rawatanSekolah.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGdB: {
        $sum: '$rawatanSekolah.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGdS: {
        $sum: '$rawatanSekolah.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGkB: {
        $sum: '$rawatanSekolah.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanPosGkS: {
        $sum: '$rawatanSekolah.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
      },
      telahTampalanAmgGdB: {
        $sum: '$rawatanSekolah.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGdS: {
        $sum: '$rawatanSekolah.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGkB: {
        $sum: '$rawatanSekolah.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
      },
      telahTampalanAmgGkS: {
        $sum: '$rawatanSekolah.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
      },
      tampalanSementara: {
        $sum: '$jumlahTampalanSementaraSekolahRawatan',
      },
      cabutanGd: {
        $sum: '$rawatanSekolah.cabutDesidusSekolahRawatan',
      },
      cabutanGk: {
        $sum: '$rawatanSekolah.cabutKekalSekolahRawatan',
      },
      penskaleran: {
        $sum: '$rawatanSekolah.penskaleranSekolahRawatan',
      },
      caseCompletedICDAS: {
        $sum: {
          $cond: [
            {
              $eq: ['$rawatanSekolah.kesSelesaiIcdasSekolahRawatan', true],
            },
            1,
            0,
          ],
        },
      },
      caseCompleted: {
        $sum: {
          $cond: [
            {
              $eq: ['$rawatanSekolah.kesSelesaiIcdasSekolahRawatan', true],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // bismillah
  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let bigData = [];

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage[i],
        lookup_stage_1,
        unwind_stage_1,
        lookup_stage_2,
        unwind_stage_2,
        lookup_stage_3,
        unwind_stage_3,
        group_stage_1,
      ];
      const queryPemeriksaan = await Sekolah.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [
        match_stage[i],
        lookup_stage,
        project_stage,
        group_stage,
      ];
      const queryRawatan = await Sekolah.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPGPR201Lama = async (payload) => {
  let match_stage = [];

  const age_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 13,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_30_49 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const age_60yearsandup = {
    $match: {
      umur: {
        $gte: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload),
    },
  };
  const ibumengandung = {
    $match: {
      kedatangan: { $eq: 'baru-kedatangan' },
      ibuMengandung: true,
      ...getParams211(payload),
    },
  };
  const oku = {
    $match: {
      kedatangan: { $eq: 'baru-kedatangan' },
      orangKurangUpaya: true,
      ...getParams211(payload),
    },
  };

  match_stage.push(age_below_1);
  match_stage.push(age_1_4);
  match_stage.push(age_5_6);
  match_stage.push(age_7_9);
  match_stage.push(age_10_12);
  match_stage.push(age_13_14);
  match_stage.push(age_15_17);
  match_stage.push(age_18_19);
  match_stage.push(age_20_29);
  match_stage.push(age_30_49);
  match_stage.push(age_50_59);
  match_stage.push(age_60yearsandup);
  match_stage.push(ibumengandung);
  match_stage.push(oku);

  const group_stage = {
    $group: {
      _id: placeModifier(payload),
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
      //
    },
  };

  let data = [];

  for (let i = 0; i < match_stage.length; i++) {
    const pipeline = [match_stage[i], group_stage];
    const query = await Umum.aggregate(pipeline);
    data.push(query);
  }

  return data;
};
const countPGS203Sek = async (klinik, bulan, sekolah) => {
  let match_stage = [];
  // pra/tadika
  const match_pra_kerajaan = {
    $match: {
      govKe: 'kerajaan',
      // createdByKp: klinik,
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      umur: { $gte: 5, $lte: 6 },
    },
  };

  const match_pra_swasta = {
    $match: {
      govKe: 'swasta',
      // createdByKp: klinik,
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      umur: { $gte: 5, $lte: 6 },
    },
  };

  const match_pratad_mbk = {
    $match: {
      // kodSekolah: sekolah,
      // createdByKp: klinik,
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      orangKurangUpaya: true,
    },
  };

  const match_pratad_oap = {
    $match: {
      // kodSekolah: sekolah,
      // createdByKp: klinik,
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };

  // sr/srpk/sm/smpk
  const match_grade1 = {
    $match: {
      // createdByKp: klinik,
      tahun: 'D1',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_grade1_kpb = {
    $match: {
      // createdByKp: klinik,
      tahun: 'D1',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_grade1_oap = {
    $match: {
      // createdByKp: klinik,
      tahun: 'D1',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };

  const match_grade6 = {
    $match: {
      // createdByKp: klinik,
      tahun: 'D6',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_grade6_kpb = {
    $match: {
      // createdByKp: klinik,
      tahun: 'D6',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_grade6_oap = {
    $match: {
      // createdByKp: klinik,
      tahun: 'D6',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };

  const match_allgrade_srpk = {
    $match: {
      // createdByKp: klinik,
      tahun: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allgrade_srpk_kpb = {
    $match: {
      // createdByKp: klinik,
      tahun: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allgrade_srpk_mbk = {
    $match: {
      // createdByKp: klinik,
      tahun: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      orangKurangUpaya: true,
    },
  };

  const match_allgrade_srpk_oap = {
    $match: {
      // createdByKp: klinik,
      tahun: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };

  const match_allgrade = {
    $match: {
      // createdByKp: klinik,
      tahun: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allgrade_kpb = {
    $match: {
      // createdByKp: klinik,
      tahun: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allgrade_oap = {
    $match: {
      // createdByKp: klinik,
      tahun: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };
  const match_ting4 = {
    $match: {
      // createdByKp: klinik,
      tahun: 'T4',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_ting4_kpb = {
    $match: {
      // createdByKp: klinik,
      tahun: 'T4',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_ting4_oap = {
    $match: {
      // createdByKp: klinik,
      tahun: 'T4',
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };

  const match_allting_smpk = {
    $match: {
      // createdByKp: klinik,
      tahun: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allting_smpk_kpb = {
    $match: {
      // createdByKp: klinik,
      tahun: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allting_smpk_oap = {
    $match: {
      // createdByKp: klinik,
      tahun: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };

  const match_allting = {
    $match: {
      // createdByKp: klinik,
      tahun: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allting_kpb = {
    $match: {
      // createdByKp: klinik,
      tahun: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
    },
  };

  const match_allting_mbk = {
    $match: {
      // createdByKp: klinik,
      tahun: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      orangKurangUpaya: true,
    },
  };

  const match_allting_oap = {
    $match: {
      // createdByKp: klinik,
      tahun: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      // tarikhKedatangan: {
      //   $gte: moment('2022-01-01').startOf('month').format('YYYY-MM-DD'),
      //   $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      // },
      kumpulanEtnik: ['orang-asli', 'penan'],
    },
  };

  match_stage.push(match_pra_kerajaan);
  match_stage.push(match_pra_swasta);
  match_stage.push(match_pratad_mbk);
  match_stage.push(match_pratad_oap);
  match_stage.push(match_grade1);
  match_stage.push(match_grade1_kpb);
  match_stage.push(match_grade1_oap);
  match_stage.push(match_grade6);
  match_stage.push(match_grade6_kpb);
  match_stage.push(match_grade6_oap);
  match_stage.push(match_allgrade_srpk);
  match_stage.push(match_allgrade_srpk_kpb);
  match_stage.push(match_allgrade_srpk_mbk);
  match_stage.push(match_allgrade_srpk_oap);
  match_stage.push(match_allgrade);
  match_stage.push(match_allgrade_kpb);
  match_stage.push(match_allgrade_oap);
  match_stage.push(match_ting4);
  match_stage.push(match_ting4_kpb);
  match_stage.push(match_ting4_oap);
  match_stage.push(match_allting_smpk);
  match_stage.push(match_allting_smpk_kpb);
  match_stage.push(match_allting_smpk_oap);
  match_stage.push(match_allting);
  match_stage.push(match_allting_kpb);
  match_stage.push(match_allting_mbk);
  match_stage.push(match_allting_oap);

  // pemeriksaan
  let lookup_stage_1 = {
    $lookup: {
      from: 'pemeriksaansekolahs',
      localField: 'pemeriksaanSekolah',
      foreignField: '_id',
      as: 'pemeriksaanSekolah',
    },
  };

  let unwind_stage_1 = { $unwind: '$pemeriksaanSekolah' };

  let lookup_stage_2 = {
    $lookup: {
      from: 'rawatansekolahs',
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };

  let unwind_stage_2 = { $unwind: '$rawatanSekolah' };

  let lookup_stage_3 = {
    $lookup: {
      from: 'kotaksekolahs',
      localField: 'kotakSekolah',
      foreignField: '_id',
      as: 'kotakSekolah',
    },
  };

  let unwind_stage_3 = {
    $unwind: {
      path: '$kotakSekolah',
      preserveNullAndEmptyArrays: true,
    },
  };

  let group_stage_1 = {
    $group: {
      _id: '$pemeriksaanSekolah.createdByKp',
      // namaKlinik: '$pemeriksaanSekolah.createdByKp',
      jumlahBudak: { $sum: 1 },
      engganKedatanganPendaftaran: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.engganKedatanganPendaftaran', true],
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
              $eq: [
                '$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran',
                true,
              ],
            },
            1,
            0,
          ],
        },
      },
      // ambil dari fasilitis
      // enrolmen: {
      //   $sum: {
      //     $cond: [
      //       {
      //         $eq: ['$pemeriksaanSekolah.tidakHadirKedatanganPendaftaran', true],
      //       },
      //       1,
      //       0,
      //     ],
      //   },
      // },
      jumlahKedatanganBaru: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
              ],
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
              $ne: [
                '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                '$rawatanSekolah.tarikhRawatanSemasa',
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'A'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'C'],
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
              $eq: ['$pemeriksaanSekolah.kebersihanMulutOralHygiene', 'E'],
            },
            1,
            0,
          ],
        },
      },
      jumlahd: { $sum: '$pemeriksaanSekolah.dAdaGigiDesidus' },
      jumlahf: { $sum: '$pemeriksaanSekolah.fAdaGigiDesidus' },
      jumlahx: { $sum: '$pemeriksaanSekolah.xAdaGigiDesidus' },
      jumlahE: { $sum: '$pemeriksaanSekolah.eAdaGigiKekal' },
      jumlahD: { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' },
      jumlahM: { $sum: '$pemeriksaanSekolah.mAdaGigiKekal' },
      jumlahF: { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
      jumlahX: { $sum: '$pemeriksaanSekolah.xAdaGigiKekal' },
      gigiKekalDMFXsamaAtauKurangDari3: {
        //DMFX ≤ 3
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 1] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 1] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 1] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      totalStatusGigiKekalSamaKosong: {
        //X+M = 0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      eMoreThanZero: {
        //E≥1 (ada karies awal)
        $sum: {
          $cond: [
            {
              $and: [{ $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] }],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBK: {
        //MBK
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0],
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
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      statusBebasKariesTapiElebihDariSatu: {
        //DMFX=0 ; E≥1
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                { $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      dfxEqualToZero: {
        //dfx=0
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahMBG: {
        //Mulut bebas gingivitis
        $sum: {
          $cond: [
            {
              $and: [
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
      jumlahTprICDAS: {
        //TPR ICDAS - d/D = 0 ; x/X = 0 ; GIS = 0/2 ; BPE = 0 ; Tidak perlu scaling, E10 = 0 (perlu FS); E11 = 0 (perlu PRR) ; E12 = 0 (perlu FV)
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1],
                },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                {
                  $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
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
                {
                  $or: [
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'],
                    },
                    {
                      $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'],
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
      kecederaanGigiAnterior: {
        $sum: {
          $toDouble: '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
        },
        // $sum: { $kecederaanGigiAnteriorTrauma: 0 },
      },
      cleftAda: {
        $sum: { $toDouble: '$pemeriksaanSekolah.adaCleftLip' },
        // $sum: { $adaCleftLip: 0 },
      },
      cleftRujuk: {
        $sum: { $toDouble: '$pemeriksaanSekolah.rujukCleftLip' },
        // $sum: { $rujukCleftLip: 0 },
      },
      perluFSMuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFs', 'true'],
                },
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFSGigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
      },
      perluFSGigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
      },
      perluFsBilGigiFailed: {
        $sum: '$pemeriksaanSekolah.jumlahGigiFsGagal',
      },
      perluFvMuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.baruJumlahMuridPerluFv', 'true'],
                },
                {
                  $eq: [
                    '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                    '$rawatanSekolah.tarikhRawatanSemasa',
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFvMuridS: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: ['$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv', 0],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluFvGigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv',
      },
      perluFvGigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv',
      },
      perluPRR1MuridB: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: [
                    '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
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
      perluPRR1MuridS: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $gt: [
                    '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
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
      perluPRR1GigiB: {
        $sum: '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
      },
      perluPRR1GigiS: {
        $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
      },
      perluTampalanAntGdB: {
        $sum: '$pemeriksaanSekolah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkB: {
        $sum: '$pemeriksaanSekolah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAntGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanPosGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdB: {
        $sum: '$pemeriksaanSekolah.baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGdS: {
        $sum: '$pemeriksaanSekolah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkB: {
        $sum: '$pemeriksaanSekolah.baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      perluTampalanAmgGkS: {
        $sum: '$pemeriksaanSekolah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
      },
      skorGIS0: {
        $sum: {
          $cond: [
            {
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '1'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'],
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
              $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '3'],
            },
            1,
            0,
          ],
        },
      },
      toothSurfaceLoss: {
        $sum: '$pemeriksaanSekolah.toothSurfaceLossTrauma',
      },
      traumaTisuLembut: {
        $sum: '$pemeriksaanSekolah.tisuLembutTrauma',
      },
      traumaTisuKeras: {
        $sum: '$pemeriksaanSekolah.tisuKerasTrauma',
      },
      pesakitAdaFullDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasSediaAdaDenture',
                'penuh-atas-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaPartialDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasSediaAdaDenture',
                'separa-atas-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluFullDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'penuh-atas-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluPartialDentureAtas: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'separa-atas-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaFullDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhBawahSediaAdaDenture',
                'penuh-bawah-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitAdaPartialDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhBawahSediaAdaDenture',
                'separa-bawah-sedia-ada-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluFullDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'penuh-bawah-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerluPartialDentureBawah: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                'separa-bawah-perlu-denture',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  // rawatan
  let lookup_stage = {
    $lookup: {
      from: 'rawatansekolahs',
      localField: 'rawatanSekolah',
      foreignField: '_id',
      as: 'rawatanSekolah',
    },
  };

  let project_stage = {
    $project: {
      namaSekolah: '$namaSekolah',
      rawatanYgDilakukan: {
        $reduce: {
          input: '$rawatanSekolah',
          initialValue: {
            baruJumlahGigiKekalDibuatFs: 0,
            semulaJumlahGigiKekalDibuatFs: 0,
            baruJumlahMuridDibuatFs: 0,
            semulaJumlahMuridDibuatFs: 0,
            baruJumlahGigiKekalDiberiFv: 0,
            semulaJumlahGigiKekalDiberiFv: 0,
            baruJumlahMuridDiberiFv: 0,
            semulaJumlahMuridDiberiFv: 0,
            baruJumlahGigiKekalDiberiPrrJenis1: 0,
            semulaJumlahGigiKekalDiberiPrrJenis1: 0,
            baruJumlahMuridDiberiPrrJenis1: 0,
            semulaJumlahMuridDiberiPrrJenis1: 0,
            baruJumlahGigiYangDiberiSdf: 0,
            semulaJumlahGigiYangDiberiSdf: 0,
            gdBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
            gdBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
            cabutDesidus: 0,
            cabutKekal: 0,
            jumlahTampalanSementara: 0,
            pulpotomi: 0,
            endodontik: 0,
            abses: 0,
            penskaleran: 0,
          },
          in: {
            BARU_GgKekalBuatFs: {
              $add: [
                '$$value.baruJumlahGigiKekalDibuatFs',
                '$$this.baruJumlahGigiKekalDibuatFs',
              ],
            },
            BARU_MuridBuatFs: {
              $add: [
                '$$value.baruJumlahMuridDibuatFs',
                '$$this.baruJumlahMuridDibuatFs',
              ],
            },
            BARU_GgKekalBuatFv: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiFv',
                '$$this.baruJumlahGigiKekalDiberiFv',
              ],
            },
            BARU_MuridBuatFv: {
              $add: [
                '$$value.baruJumlahMuridDiberiFv',
                '$$this.baruJumlahMuridDiberiFv',
              ],
            },
            BARU_GgKekalBuatPRR1: {
              $add: [
                '$$value.baruJumlahGigiKekalDiberiPrrJenis1',
                '$$this.baruJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            BARU_MuridBuatPRR1: {
              $add: [
                '$$value.baruJumlahMuridDiberiPrrJenis1',
                '$$this.baruJumlahMuridDiberiPrrJenis1',
              ],
            },
            BARU_GgKekalBuatSdf: {
              $add: [
                '$$value.baruJumlahGigiYangDiberiSdf',
                '$$this.baruJumlahGigiYangDiberiSdf',
              ],
            },
            BARU_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            BARU_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            SEMULA_GgKekalBuatFs: {
              $add: [
                '$$value.semulaJumlahGigiKekalDibuatFs',
                '$$this.semulaJumlahGigiKekalDibuatFs',
              ],
            },
            SEMULA_MuridBuatFs: {
              $add: [
                '$$value.semulaJumlahMuridDibuatFs',
                '$$this.semulaJumlahMuridDibuatFs',
              ],
            },
            SEMULA_GgKekalBuatFv: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiFv',
                '$$this.semulaJumlahGigiKekalDiberiFv',
              ],
            },
            SEMULA_MuridBuatFv: {
              $add: [
                '$$value.semulaJumlahMuridDiberiFv',
                '$$this.semulaJumlahMuridDiberiFv',
              ],
            },
            SEMULA_GgKekalBuatPRR1: {
              $add: [
                '$$value.semulaJumlahGigiKekalDiberiPrrJenis1',
                '$$this.semulaJumlahGigiKekalDiberiPrrJenis1',
              ],
            },
            SEMULA_MuridBuatPRR1: {
              $add: [
                '$$value.semulaJumlahMuridDiberiPrrJenis1',
                '$$this.semulaJumlahMuridDiberiPrrJenis1',
              ],
            },
            SEMULA_GgKekalBuatSdf: {
              $add: [
                '$$value.semulaJumlahGigiYangDiberiSdf',
                '$$this.semulaJumlahGigiYangDiberiSdf',
              ],
            },
            SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
              $add: [
                '$$value.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
              $add: [
                '$$value.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                '$$this.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
              ],
            },
            //
            cabutDesidus: {
              $add: [
                '$$value.cabutDesidus',
                '$$this.cabutDesidusSekolahRawatan',
              ],
            },
            cabutKekal: {
              $add: ['$$value.cabutKekal', '$$this.cabutKekalSekolahRawatan'],
            },
            tampalanSementara: {
              $add: [
                '$$value.jumlahTampalanSementara',
                '$$this.jumlahTampalanSementaraSekolahRawatan',
              ],
            },
            pulpotomi: {
              $add: ['$$value.pulpotomi', '$$this.pulpotomiSekolahRawatan'],
            },
            endodontik: {
              $add: ['$$value.endodontik', '$$this.endodontikSekolahRawatan'],
            },
            abses: {
              $add: ['$$value.abses', '$$this.absesSekolahRawatan'],
            },
            penskaleran: {
              $add: ['$$value.penskaleran', '$$this.penskaleranSekolahRawatan'],
            },
          },
        },
      },
    },
  };

  let group_stage = {
    $group: {
      _id: '$namaSekolah',
      jumlahBudak: { $sum: 1 },
      BARU_GgKekalBuatFs: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatFs',
      },
      BARU_MuridBuatFs: {
        $sum: '$rawatanYgDilakukan.BARU_MuridBuatFs',
      },
      BARU_GgKekalBuatFv: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatFv',
      },
      BARU_MuridBuatFv: {
        $sum: '$rawatanYgDilakukan.BARU_MuridBuatFv',
      },
      BARU_GgKekalBuatPRR1: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatPRR1',
      },
      BARU_MuridBuatPRR1: {
        $sum: '$rawatanYgDilakukan.BARU_MuridBuatPRR1',
      },
      BARU_GgKekalBuatSdf: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalBuatSdf',
      },
      BARU_GgDesidusAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgDesidusAnteriorBuatTampalanSewarna',
      },
      BARU_GgKekalAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalAnteriorBuatTampalanSewarna',
      },
      BARU_GgDesidusPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgDesidusPosteriorBuatTampalanSewarna',
      },
      BARU_GgKekalPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalPosteriorBuatTampalanSewarna',
      },
      BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.BARU_GgDesidusPosteriorBuatTampalanAmalgam',
      },
      BARU_GgKekalPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.BARU_GgKekalPosteriorBuatTampalanAmalgam',
      },
      //
      SEMULA_GgKekalBuatFs: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatFs',
      },
      SEMULA_MuridBuatFs: {
        $sum: '$rawatanYgDilakukan.SEMULA_MuridBuatFs',
      },
      SEMULA_GgKekalBuatFv: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatFv',
      },
      SEMULA_MuridBuatFv: {
        $sum: '$rawatanYgDilakukan.SEMULA_MuridBuatFv',
      },
      SEMULA_GgKekalBuatPRR1: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatPRR1',
      },
      SEMULA_MuridBuatPRR1: {
        $sum: '$rawatanYgDilakukan.SEMULA_MuridBuatPRR1',
      },
      SEMULA_GgKekalBuatSdf: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalBuatSdf',
      },
      SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgDesidusAnteriorBuatTampalanSewarna',
      },
      SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalAnteriorBuatTampalanSewarna',
      },
      SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgDesidusPosteriorBuatTampalanSewarna',
      },
      SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalPosteriorBuatTampalanSewarna',
      },
      SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgDesidusPosteriorBuatTampalanAmalgam',
      },
      SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
        $sum: '$rawatanYgDilakukan.SEMULA_GgKekalPosteriorBuatTampalanAmalgam',
      },
      //
      cabutDesidus: {
        $sum: '$rawatanYgDilakukan.cabutDesidus',
      },
      cabutKekal: {
        $sum: '$rawatanYgDilakukan.cabutKekal',
      },
      tampalanSementara: {
        $sum: '$rawatanYgDilakukan.jumlahTampalanSementara',
      },
      pulpotomi: {
        $sum: '$rawatanYgDilakukan.pulpotomi',
      },
      endodontik: {
        $sum: '$rawatanYgDilakukan.endodontik',
      },
      abses: {
        $sum: '$rawatanYgDilakukan.abses',
      },
      penskaleran: {
        $sum: '$rawatanYgDilakukan.penskaleran',
      },
    },
  };

  // bismillah
  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let bigData = [];

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage[i],
        lookup_stage_1,
        unwind_stage_1,
        lookup_stage_2,
        unwind_stage_2,
        lookup_stage_3,
        unwind_stage_3,
        group_stage_1,
      ];
      const queryPemeriksaan = await Sekolah.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [
        match_stage[i],
        lookup_stage,
        project_stage,
        group_stage,
      ];
      const queryRawatan = await Sekolah.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// unused params
const getParams307 = (payload, reten) => {
  const { negeri, daerah, klinik, tastad } = payload;

  const byTadika = () => {
    return {
      tarikhKedatangan: dateModifier(payload),
      kodFasilitiTaskaTadika: tastad,
      jenisFasiliti: 'taska-tadika',
    };
  };

  const byKp = () => {
    return {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: klinik,
      jenisFasiliti: 'taska-tadika',
    };
  };

  const byDaerah = () => {
    return {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      jenisFasiliti: 'taska-tadika',
    };
  };

  const byNegeri = () => {
    return {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: negeri,
      jenisFasiliti: 'taska-tadika',
    };
  };

  if (tastad) {
    return byTadika(payload);
  }
  if (daerah !== 'all' && klinik !== 'all') {
    return byKp(payload);
  }
  if (daerah !== 'all' && klinik === 'all') {
    return byDaerah(payload);
  }
  if (daerah === 'all') {
    return byNegeri(payload);
  }
};

const moment = require('moment');
const User = require('../models/User');
const Umum = require('../models/Umum');
const Sekolah = require('../models/Sekolah');
const Pemeriksaan = require('../models/Pemeriksaansekolah');
const Rawatan = require('../models/Rawatansekolah');
const Promosi = require('../models/Promosi');
const KohortKotak = require('../models/KohortKotak');
const Fasiliti = require('../models/Fasiliti');
const MediaSosial = require('../models/MediaSosial');
const { errorRetenLogger } = require('../logs/logger');

const countPPIM03 = async (klinik, bulan, sekolah) => {
  let match_stage = [];

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
      jumlahEnrolment: { $sum: 1 },
      perokokSemasaLelakiMelayu: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'L'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                { $eq: ['$kaum', 'MELAYU'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokSemasaLelakiCina: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'L'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                { $eq: ['kaum', 'CINA'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokSemasaLelakiIndia: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'L'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                { $eq: ['$kaum', 'INDIA'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokSemasaLelakiLainLain: {
        // lain-lain di sini
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'L'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                {
                  $or: [
                    // { $ne: ['kaum', 'MELAYU'] },
                    // { $ne: ['kaum', 'INDIA'] },
                    // { $ne: ['kaum', 'CINA'] },

                    { $eq: ['$kaum', 'INDONESIA'] },
                    { $eq: ['$kaum', 'IBAN ATAU SEA DAYAK'] },
                    { $eq: ['$kaum', 'BISAYA'] },
                    { $eq: ['$kaum', 'PAKISTANI'] },
                    { $eq: ['$kaum', 'MELANAU'] },
                    { $eq: ['$kaum', 'IRANUN'] },
                    { $eq: ['$kaum', 'RUNGUS'] },
                    { $eq: ['$kaum', 'SIAM'] },
                    { $eq: ['$kaum', 'BIDAYUH ATAU LAND DAYAK'] },
                    { $eq: ['$kaum', 'SUNGAI'] },
                    { $eq: ['$kaum', 'KADAZAN'] },
                    { $eq: ['$kaum', 'DUSUN'] },
                    { $eq: ['$kaum', 'IRANUN'] },
                    { $eq: ['$kaum', 'MELAYU SARAWAK'] },
                    { $eq: ['$kaum', 'BRUNEI'] },
                    { $eq: ['$kaum', 'THAI'] },
                    { $eq: ['$kaum', 'TIADA MAKLUMAT'] },
                    { $eq: ['$kaum', 'ORANG ASLI (SEMENANJUNG)'] },
                    { $eq: ['$kaum', 'MYANMAR'] },
                    { $eq: ['$kaum', 'SULUK'] },
                    { $eq: ['$kaum', 'BAJAU'] },
                    { $eq: ['$kaum', 'KENYAH'] },
                    { $eq: ['$kaum', 'PUNJABI'] },
                    { $eq: ['$kaum', 'KHMER'] },
                    { $eq: ['$kaum', 'INDIA MUSLIM'] },
                    { $eq: ['$kaum', 'ETNIK SABAH'] },
                    { $eq: ['$kaum', 'BUGIS'] },
                    { $eq: ['$kaum', 'LAIN-LAIN'] },
                    { $eq: ['$kaum', 'MURUT'] },
                    { $eq: ['$kaum', 'JAWA'] },
                    { $eq: ['$kaum', 'KEMBOJA'] },
                    {
                      $eq: ['$kaum', 'LAIN-LAIN ASIA/BUKAN WARGANEGARA'],
                    },
                    { $eq: ['$kaum', 'KAYAN'] },
                    { $eq: ['$kaum', 'FILIPINOS'] },
                    { $eq: ['$kaum', 'NIGERIA'] },
                    { $eq: ['$kaum', 'SINO-NATIVE'] },
                    { $eq: ['$kaum', 'HOKKIEN'] },
                    { $eq: ['$kaum', 'KHEK (HAKKA)'] },
                    { $eq: ['$kaum', 'VIETNAMESE'] },
                    { $eq: ['$kaum', 'ARAB'] },
                    { $eq: ['$kaum', 'FILIPINOS'] },
                    { $eq: ['$kaum', 'BANJAR'] },
                    { $eq: ['$kaum', 'FOOCHOW'] },
                    { $eq: ['$kaum', 'MINANGKABAU'] },
                    { $eq: ['$kaum', 'CANTONESE'] },
                    { $eq: ['$kaum', 'DUSUN'] },
                    { $eq: ['$kaum', 'BANGLADESHI'] },
                    { $eq: ['$kaum', 'LAOS'] },
                    { $eq: ['$kaum', 'KENYAH'] },
                    { $eq: ['$kaum', 'MALI'] },
                    { $eq: ['$kaum', 'COCOS'] },
                    { $eq: ['$kaum', 'PUNAN'] },
                    { $eq: ['$kaum', 'BURMESE'] },
                    { $eq: ['$kaum', 'EUROPEAN'] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokSemasaPerempuanMelayu: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'P'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                { $eq: ['$kumpulanEtnik', 'melayu'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokSemasaPerempuanCina: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'P'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                { $eq: ['$kumpulanEtnik', 'cina'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokSemasaPerempuanIndia: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'P'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                { $eq: ['$kumpulanEtnik', 'india'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokSemasaPerempuanLainLain: {
        // lain-lain di sini
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'P'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'],
                },
                {
                  $or: [
                    // { $ne: ['kaum', 'MELAYU'] },
                    // { $ne: ['kaum', 'INDIA'] },
                    // { $ne: ['kaum', 'CINA'] },

                    { $eq: ['$kaum', 'INDONESIA'] },
                    { $eq: ['$kaum', 'IBAN ATAU SEA DAYAK'] },
                    { $eq: ['$kaum', 'BISAYA'] },
                    { $eq: ['$kaum', 'PAKISTANI'] },
                    { $eq: ['$kaum', 'MELANAU'] },
                    { $eq: ['$kaum', 'IRANUN'] },
                    { $eq: ['$kaum', 'RUNGUS'] },
                    { $eq: ['$kaum', 'SIAM'] },
                    { $eq: ['$kaum', 'BIDAYUH ATAU LAND DAYAK'] },
                    { $eq: ['$kaum', 'SUNGAI'] },
                    { $eq: ['$kaum', 'KADAZAN'] },
                    { $eq: ['$kaum', 'DUSUN'] },
                    { $eq: ['$kaum', 'IRANUN'] },
                    { $eq: ['$kaum', 'MELAYU SARAWAK'] },
                    { $eq: ['$kaum', 'BRUNEI'] },
                    { $eq: ['$kaum', 'THAI'] },
                    { $eq: ['$kaum', 'TIADA MAKLUMAT'] },
                    { $eq: ['$kaum', 'ORANG ASLI (SEMENANJUNG)'] },
                    { $eq: ['$kaum', 'MYANMAR'] },
                    { $eq: ['$kaum', 'SULUK'] },
                    { $eq: ['$kaum', 'BAJAU'] },
                    { $eq: ['$kaum', 'KENYAH'] },
                    { $eq: ['$kaum', 'PUNJABI'] },
                    { $eq: ['$kaum', 'KHMER'] },
                    { $eq: ['$kaum', 'INDIA MUSLIM'] },
                    { $eq: ['$kaum', 'ETNIK SABAH'] },
                    { $eq: ['$kaum', 'BUGIS'] },
                    { $eq: ['$kaum', 'LAIN-LAIN'] },
                    { $eq: ['$kaum', 'MURUT'] },
                    { $eq: ['$kaum', 'JAWA'] },
                    { $eq: ['$kaum', 'KEMBOJA'] },
                    {
                      $eq: ['$kaum', 'LAIN-LAIN ASIA/BUKAN WARGANEGARA'],
                    },
                    { $eq: ['$kaum', 'KAYAN'] },
                    { $eq: ['$kaum', 'FILIPINOS'] },
                    { $eq: ['$kaum', 'NIGERIA'] },
                    { $eq: ['$kaum', 'SINO-NATIVE'] },
                    { $eq: ['$kaum', 'HOKKIEN'] },
                    { $eq: ['$kaum', 'KHEK (HAKKA)'] },
                    { $eq: ['$kaum', 'VIETNAMESE'] },
                    { $eq: ['$kaum', 'ARAB'] },
                    { $eq: ['$kaum', 'FILIPINOS'] },
                    { $eq: ['$kaum', 'BANJAR'] },
                    { $eq: ['$kaum', 'FOOCHOW'] },
                    { $eq: ['$kaum', 'MINANGKABAU'] },
                    { $eq: ['$kaum', 'CANTONESE'] },
                    { $eq: ['$kaum', 'DUSUN'] },
                    { $eq: ['$kaum', 'BANGLADESHI'] },
                    { $eq: ['$kaum', 'LAOS'] },
                    { $eq: ['$kaum', 'KENYAH'] },
                    { $eq: ['$kaum', 'MALI'] },
                    { $eq: ['$kaum', 'COCOS'] },
                    { $eq: ['$kaum', 'PUNAN'] },
                    { $eq: ['$kaum', 'BURMESE'] },
                    { $eq: ['$kaum', 'EUROPEAN'] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jenisRokokBiasa: {
        $sum: {
          $cond: [
            {
              $eq: ['$kotakSekolah.rokokBiasaKotak', true],
            },
            1,
            0,
          ],
        },
      },
      jenisRokokElektronik: {
        $sum: {
          $cond: [
            {
              $eq: ['$kotakSekolah.elektronikVapeKotak', true],
            },
            1,
            0,
          ],
        },
      },
      jenisRokokShisha: {
        $sum: {
          $cond: [
            {
              $eq: ['$kotakSekolah.shishaKotak', true],
            },
            1,
            0,
          ],
        },
      },
      jenisRokokLainLain: {
        $sum: {
          $cond: [
            {
              $eq: ['$kotakSekolah.lainLainKotak', true],
            },
            1,
            0,
          ],
        },
      },
      bekasPerokokLelaki: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'L'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'bekas-perokok'],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      bekasPerokokPerempuan: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$jantina', 'perempuan'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'bekas-perokok'],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokPasifLelaki: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'L'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-pasif'],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perokokPasifPerempuan: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'P'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'perokok-pasif'],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      bukanPerokokLelaki: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'L'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'bukan-perokok'],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      bukanPerokokPerempuan: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kodJantina', 'P'] },
                {
                  $eq: ['$pemeriksaanSekolah.statusM', 'bukan-perokok'],
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
const countPPIM04 = async (payload) => {
  let match_stage = [];
  let sort_stage = [];

  let match = { $match: getParamsPPIM04(payload) };

  const sort = {
    $sort: {
      tarikhKedatangan: 1,
    },
  };

  match_stage.push(match);
  sort_stage.push(sort);

  try {
    const data = await KohortKotak.aggregate([...match_stage, ...sort_stage]);

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
// ppim05
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
  // for umum
  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_15to17years = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 15, $lte: 17 },
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
        fasiliti_data: 0,
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
  const match_pemeriksaan_18to19years = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 18, $lte: 19 },
      },
    },
  ];
  const match_pemeriksaan_20to29years = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 20, $lte: 29 },
      },
    },
  ];
  const match_pemeriksaan_ibumengandung = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 7 },
        ibuMengandung: true,
      },
    },
  ];
  const match_pemeriksaan_oku = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        orangKurangUpaya: true,
      },
    },
  ];
  const match_pemeriksaan_bukanWarganegara = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        kumpulanEtnik: { $eq: 'bukan warganegara' },
      },
    },
  ];
  const match_pemeriksaan_oap = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      },
    },
  ];
  const match_pemeriksaan_kpb = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
      },
    },
  ];
  // sm - placeholder
  const match_pemeriksaan_kolej_komuniti = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-komuniti' },
      },
    },
  ];
  const match_pemeriksaan_kolej_vokasional = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-vokasional' },
      },
    },
  ];
  const match_pemeriksaan_ipg = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipg' },
      },
    },
  ];
  const match_pemeriksaan_ipta = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipta' },
      },
    },
  ];
  const match_pemeriksaan_lainipt = [
    {
      $match: {
        ...getParamsDM(payload),
        kedatangan: 'baru-kedatangan',
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
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
        ...getParamsDM(payload),
        umur: { $gte: 15, $lte: 17 },
      },
    },
  ];
  const match_rawatan_18to19years = [
    {
      $match: {
        ...getParamsDM(payload),
        umur: { $gte: 18, $lte: 19 },
      },
    },
  ];
  const match_rawatan_20to29years = [
    {
      $match: {
        ...getParamsDM(payload),
        umur: { $gte: 20, $lte: 29 },
      },
    },
  ];
  const match_rawatan_ibumengandung = [
    {
      $match: {
        ...getParamsDM(payload),
        umur: { $gte: 7 },
        ibuMengandung: true,
      },
    },
  ];
  const match_rawatan_oku = [
    {
      $match: {
        ...getParamsDM(payload),
        orangKurangUpaya: true,
      },
    },
  ];
  const match_rawatan_bukanWarganegara = [
    {
      $match: {
        ...getParamsDM(payload),
        kumpulanEtnik: { $eq: 'bukan warganegara' },
      },
    },
  ];
  const match_rawatan_oap = [
    {
      $match: {
        ...getParamsDM(payload),
        kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      },
    },
  ];
  const match_rawatan_kpb = [
    {
      $match: {
        ...getParamsDM(payload),
        menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
      },
    },
  ];
  // sm - placeholder
  const match_rawatan_kolej_komuniti = [
    {
      $match: {
        ...getParamsDM(payload),
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-komuniti' },
      },
    },
  ];
  const match_rawatan_kolej_vokasional = [
    {
      $match: {
        ...getParamsDM(payload),
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-vokasional' },
      },
    },
  ];
  const match_rawatan_ipg = [
    {
      $match: {
        ...getParamsDM(payload),
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipg' },
      },
    },
  ];
  const match_rawatan_ipta = [
    {
      $match: {
        ...getParamsDM(payload),
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipta' },
      },
    },
  ];
  const match_rawatan_lainipt = [
    {
      $match: {
        ...getParamsDM(payload),
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
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
    match_rawatan_kolej_komuniti,
    match_rawatan_kolej_vokasional,
    match_rawatan_ipg,
    match_rawatan_ipta,
    match_rawatan_lainipt
  );

  //

  let match_stage_operatorLain = [];

  const match_operatorLain_15to17years = [
    {
      $match: {
        ...getParamsDM(payload),
        umur: { $gte: 15, $lte: 17 },
        rawatanDibuatOperatorLain: true,
      },
    },
  ];
  const match_operatorLain_18to19years = [
    {
      $match: {
        ...getParamsDM(payload),
        umur: { $gte: 18, $lte: 19 },
        rawatanDibuatOperatorLain: true,
      },
    },
  ];
  const match_operatorLain_20to29years = [
    {
      $match: {
        ...getParamsDM(payload),
        umur: { $gte: 20, $lte: 29 },
        rawatanDibuatOperatorLain: true,
      },
    },
  ];
  const match_operatorLain_ibumengandung = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        umur: { $gte: 7 },
        ibuMengandung: true,
      },
    },
  ];
  const match_operatorLain_oku = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        orangKurangUpaya: true,
      },
    },
  ];
  const match_operatorLain_bukanWarganegara = [
    {
      $match: {
        ...getParamsDM(payload),
        kumpulanEtnik: { $eq: 'bukan warganegara' },
        rawatanDibuatOperatorLain: true,
      },
    },
  ];
  const match_operatorLain_oap = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      },
    },
  ];
  const match_operatorLain_kpb = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        menggunakanKPBMPB: { $eq: 'ya-menggunakan-kpb-mpb' },
      },
    },
  ];
  // sm - placeholder
  const match_operatorLain_kolej_komuniti = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-komuniti' },
      },
    },
  ];
  const match_operatorLain_kolej_vokasional = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'kolej-vokasional' },
      },
    },
  ];
  const match_operatorLain_ipg = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipg' },
      },
    },
  ];
  const match_operatorLain_ipta = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'ipta' },
      },
    },
  ];
  const match_operatorLain_lainipt = [
    {
      $match: {
        ...getParamsDM(payload),
        rawatanDibuatOperatorLain: true,
        jenisFasiliti: { $eq: 'program-komuniti-lain' },
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
        fasiliti_data: 0,
      },
    },
    {
      $match: {
        kategoriInstitusi: { $eq: 'lain-lain' },
      },
    },
  ];

  match_stage_operatorLain.push(
    match_operatorLain_15to17years,
    match_operatorLain_18to19years,
    match_operatorLain_20to29years,
    match_operatorLain_ibumengandung,
    match_operatorLain_oku,
    match_operatorLain_bukanWarganegara,
    match_operatorLain_oap,
    match_operatorLain_kpb,
    match_operatorLain_kolej_komuniti,
    match_operatorLain_kolej_vokasional,
    match_operatorLain_ipg,
    match_operatorLain_ipta,
    match_operatorLain_lainipt
  );

  const group_operatorLain = [
    {
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
                            $eq: [
                              '$baruJumlahGigiKekalDibuatFSRawatanUmum',
                              '',
                            ],
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
                $toInt:
                  '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
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
                $toInt:
                  '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
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
                $toInt:
                  '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
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
                $toInt:
                  '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
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
                $toInt:
                  '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
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
                $toInt:
                  '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
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
                $toInt:
                  '$jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum',
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
                    $eq: [
                      '$semulaPenuhJumlahDenturProstodontikRawatanUmum',
                      '',
                    ],
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
                    $eq: [
                      '$semulaSeparaJumlahDenturProstodontikRawatanUmum',
                      '',
                    ],
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
    },
  ];

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    // let dataSekolah = [];
    let dataOperatorLain = [];
    let bigData = [];

    for (const pemeriksaan of match_stage_pemeriksaan) {
      const queryDMPemeriksaan = await Umum.aggregate([
        ...pemeriksaan,
        ...group_pemeriksaan,
      ]);
      dataPemeriksaan.push({ queryDMPemeriksaan });
    }

    for (const rawatan of match_stage_rawatan) {
      const queryDMRawatan = await Umum.aggregate([
        ...rawatan,
        ...group_rawatan,
      ]);
      dataRawatan.push({ queryDMRawatan });
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

    if (!payload.pilihanIndividu) {
      for (const opLain of match_stage_operatorLain) {
        const queryOperatorLain = await Umum.aggregate([
          ...opLain,
          ...getParamsOperatorLain,
          ...group_operatorLain,
        ]);
        dataOperatorLain.push({ queryOperatorLain });
      }
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countOAP = async (payload) => {
  // for umum
  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
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
      ...getParams207(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_1to4years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 1, $lte: 4 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_5to6years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_7to9years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 7, $lte: 9 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_10to12years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 10, $lte: 12 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_13to14years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 13, $lte: 14 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_15to17years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 15, $lte: 17 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_18to19years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 18, $lte: 19 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_20to29years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 20, $lte: 29 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_30to49years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 30, $lte: 49 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_50to59years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 50, $lte: 59 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_60yearsandup = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 60 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    },
  };
  const match_ibumengandung = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 7 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      ...getParams207(payload),
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
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

  let match_stage_operatorLain = [];

  const match_operatorLain_below1year = {
    $match: {
      ...getParams207(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_1to4years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 1, $lte: 4 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_5to6years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 5, $lte: 6 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_7to9years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 7, $lte: 9 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_10to12years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 10, $lte: 12 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_13to14years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 13, $lte: 14 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_15to17years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 15, $lte: 17 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_18to19years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 18, $lte: 19 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_20to29years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 20, $lte: 29 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_30to49years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 30, $lte: 49 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_50to59years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 50, $lte: 59 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_60yearsandup = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 60 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_ibumengandung = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 7 },
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      ibuMengandung: true,
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_oku = {
    $match: {
      ...getParams207(payload),
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      orangKurangUpaya: true,
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
    match_operatorLain_oku
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
    let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [match_stage[i], group];
      const queryRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
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

    if (!payload.pilihanIndividu) {
      for (let i = 0; i < match_stage_operatorLain.length; i++) {
        const pipeline = [
          match_stage_operatorLain[i],
          ...getParamsOperatorLain,
          group_operatorLain,
        ];
        const queryOperatorLain = await Umum.aggregate(pipeline);
        dataOperatorLain.push({ queryOperatorLain });
      }
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countLiputanOAP = async (payload) => {
  let match_stage = [];

  let match = {
    $match: {
      kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
      statusKedatangan: false,
      deleted: false,
      statusReten: 'telah diisi',
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
const countKOM = async (payload) => {
  // for umum
  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bw = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_dewasamuda = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
    },
  };
  const match_pemeriksaan_pkap = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      kgAngkat: { $in: ['komuniti-kg-angkat', 'lawatan-ke-rumah-kg-angkat'] },
    },
  };
  const match_pemeriksaan_ppr = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_ppkps = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_ikk = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_iwe = {
    $match: {
      ...getParamsKOM(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: 'bukan warganegara',
    },
  };
  const match_pemeriksaan_kpb = {
    $match: {
      ...getParamsKOM(payload),
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
      ...getParamsKOM(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      ...getParamsKOM(payload),
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
      ...getParamsKOM(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_1to4years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 1, $lte: 4 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_5to6years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 5, $lte: 6 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_7to9years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 7, $lte: 9 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_10to12years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 10, $lte: 12 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_13to14years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 13, $lte: 14 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_15to17years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 15, $lte: 17 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_18to19years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 18, $lte: 19 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_20to29years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 20, $lte: 29 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_30to49years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 30, $lte: 49 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_50to59years = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 50, $lte: 59 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_60yearsandup = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 60 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_ibumengandung = {
    $match: {
      ...getParamsKOM(payload),
      umur: { $gte: 7 },
      ibuMengandung: true,
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_oku = {
    $match: {
      ...getParamsKOM(payload),
      orangKurangUpaya: true,
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
    match_operatorLain_oku
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
    let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [match_stage[i], group];
      const queryRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
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

    if (!payload.pilihanIndividu) {
      for (let i = 0; i < match_stage_operatorLain.length; i++) {
        const pipeline = [
          match_stage_operatorLain[i],
          ...getParamsOperatorLain,
          group_operatorLain,
        ];
        const queryOperatorLain = await Umum.aggregate(pipeline);
        dataOperatorLain.push({ queryOperatorLain });
      }
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    // bigData.push(dataSekolah);
    bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};

// ppim03
const getParamsPPIM04 = (payload, reten) => {
  const { negeri, daerah, klinik, sekolah, pilihanIndividu } = payload;

  const bySekolah = () => {
    const forSekolah = {
      createdByKodFasiliti: { $eq: klinik },
    };
  };

  const byPegawai = () => {
    const forPegawai = {
      createdByKodFasiliti: { $eq: klinik },
      createdByNameMdcMdtb: { $eq: pilihanIndividu },
    };
  };

  if (pilihanIndividu === 'all') {
    return bySekolah(payload);
  } else {
    return byPegawai(payload);
  }
};
// ppim05
// begin
const getParamsDM = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: 'projek-komuniti-lain',
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: 'projek-komuniti-lain',
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: 'projek-komuniti-lain',
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: 'projek-komuniti-lain',
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: 'projek-komuniti-lain',
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
  }
  if (pilihanIndividu) {
    return byPegawai(payload);
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
// oap
// liputanoap
// kpbmpb hari
// kpbmbp bulan
const getParamsKOM = (payload) => {
  const { negeri, daerah, klinik, pilihanProgram } = payload;

  const byProgram = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      jenisFasiliti: 'program-komuniti-lain',
      namaProgram: pilihanProgram,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      jenisFasiliti: 'program-komuniti-lain',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      jenisFasiliti: 'program-komuniti-lain',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      jenisFasiliti: 'program-komuniti-lain',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      jenisFasiliti: 'program-komuniti-lain',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
  }
  if (pilihanIndividu) {
    return byPegawai(payload);
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

// operator lain punya hal
const getParamsOperatorLain = [
  {
    $unwind: {
      path: '$rawatanOperatorLain',
      includeArrayIndex: 'operatorLain',
    },
  },
  {
    $project: {
      _id: 0,
      rawatanOperatorLain: 1,
    },
  },
  {
    $replaceRoot: {
      newRoot: '$rawatanOperatorLain',
    },
  },
];

// place
const placeModifier = (payload) => {
  const { klinik, daerah, negeri, pilihanIndividu } = payload;

  if (negeri === 'all') {
    return null;
  }

  if (pilihanIndividu) {
    return '$createdByUsername';
  }
  if (daerah !== 'all' && klinik !== 'all') {
    return '$createdByKodFasiliti';
  }
  if (daerah !== 'all' && klinik === 'all') {
    return '$createdByDaerah';
  }
  if (daerah === 'all') {
    return '$createdByNegeri';
  }
};

// date
const dateModifier = (payload) => {
  const { tarikhMula, tarikhAkhir, bulan } = payload;

  if (tarikhMula && tarikhAkhir) {
    return {
      $gte: moment(tarikhMula).format('YYYY-MM-DD'),
      $lte: moment(tarikhAkhir).format('YYYY-MM-DD'),
    };
  }
  if (bulan) {
    return {
      $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
      $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
    };
  }
};

module.exports = {
  countPPIM03,
  countPPIM04,
  countBEGIN,
  countDEWASAMUDA,
  countOAP,
  countLiputanOAP,
  countKPBMPBHarian,
  countKPBMPBBulanan,
  countKOM,
};

const moment = require('moment');
const Umum = require('../models/Umum');
const Operator = require('../models/Operator');
const Promosi = require('../models/Promosi');
const Fasiliti = require('../models/Fasiliti');
const MediaSosial = require('../models/MediaSosial');
const { errorRetenLogger } = require('../logs/logger');
const {
  placeModifier,
  getParams101,
  getParams211,
  getParams214,
  getParams206,
  getParams207,
  getParamsPgpr201,
  getParamsPGS201,
  getParamsPGS203,
  getParamsPgPro,
  getParamsGender,
  getParamsPiagamMasa,
  getParamsBp,
  getParamsBPE,
  getParamsTOD,
  getParamsOperatorLain,
} = require('./countHelperParams');

//Reten Kaunter
const countPG101A = async (payload) => {
  const { daerah, klinik, tarikhMula, tarikhAkhir, jenisReten } = payload;

  const bigData = [];

  const match = { $match: getParams101(payload, 'A') };
  const project = {
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
  const sort = {
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

  let kkiaData = [];

  try {
    // cari pt kp
    const pipeline = [match, project, sort];
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
            ...project,
          },
          {
            ...sort,
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
  let match_stage = [];
  let project_stage = [];
  let sort_stage = [];

  let match = { $match: getParams101(payload, 'C') };

  const project = {
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

  const sort = {
    $sort: {
      tarikhKedatangan: 1,
    },
  };

  match_stage.push(match);
  project_stage.push(project);
  sort_stage.push(sort);

  try {
    const pipeline = match_stage.concat(project_stage, sort_stage);

    const data = await Umum.aggregate(pipeline);

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
const countPG211A = async (payload) => {
  const main_switch = {
    $match: {
      ...getParams211(payload, 'A'),
    },
  };

  let match_stage = [];

  const bage_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };

  const uage_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 13,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };

  match_stage.push(bage_below_1);
  match_stage.push(uage_below_1);

  match_stage.push(bage_1_4);
  match_stage.push(uage_1_4);

  match_stage.push(bage_5_6);
  match_stage.push(uage_5_6);

  match_stage.push(bage_7_9);
  match_stage.push(uage_7_9);

  match_stage.push(bage_10_12);
  match_stage.push(uage_10_12);

  match_stage.push(bage_13_14);
  match_stage.push(uage_13_14);

  match_stage.push(bage_15_17);
  match_stage.push(uage_15_17);

  match_stage.push(bage_18_19);
  match_stage.push(uage_18_19);

  match_stage.push(bage_20_29);
  match_stage.push(uage_20_29);

  match_stage.push(bage_30_39);
  match_stage.push(uage_30_39);

  match_stage.push(bage_40_49);
  match_stage.push(uage_40_49);

  match_stage.push(bage_50_59);
  match_stage.push(uage_50_59);

  match_stage.push(bage_60);
  match_stage.push(uage_60);

  match_stage.push(bage_61_64);
  match_stage.push(uage_61_64);

  match_stage.push(bage_65);
  match_stage.push(uage_65);

  match_stage.push(bage_66_69);
  match_stage.push(uage_66_69);

  match_stage.push(bage_70_74);
  match_stage.push(uage_70_74);

  match_stage.push(bage_lebih_75);
  match_stage.push(uage_lebih_75);

  let group_stage = {
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
      jumlahLelaki: {
        $sum: {
          $cond: [
            {
              $or: [
                { $eq: ['$jantina', 'lelaki'] },
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
                {
                  $eq: ['$kumpulanEtnik', 'melayu'],
                },
                {
                  $eq: ['$kumpulanEtnik', null],
                },
                {
                  $eq: ['$kumpulanEtnik', ''],
                },
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
    },
  };

  let data = [];

  try {
    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, match_stage[i], group_stage];
      const query = await Umum.aggregate(pipeline);
      data.push(query);
    }
    return data;
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
    },
  };

  let match_stage = [];

  const bage_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 13,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };

  const uage_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 13,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };

  match_stage.push(bage_below_1);
  match_stage.push(uage_below_1);

  match_stage.push(bage_1_4);
  match_stage.push(uage_1_4);

  match_stage.push(bage_5_6);
  match_stage.push(uage_5_6);

  match_stage.push(bage_7_9);
  match_stage.push(uage_7_9);

  match_stage.push(bage_10_12);
  match_stage.push(uage_10_12);

  match_stage.push(bage_13_14);
  match_stage.push(uage_13_14);

  match_stage.push(bage_15_17);
  match_stage.push(uage_15_17);

  match_stage.push(bage_18_19);
  match_stage.push(uage_18_19);

  match_stage.push(bage_20_29);
  match_stage.push(uage_20_29);

  match_stage.push(bage_30_39);
  match_stage.push(uage_30_39);

  match_stage.push(bage_40_49);
  match_stage.push(uage_40_49);

  match_stage.push(bage_50_59);
  match_stage.push(uage_50_59);

  match_stage.push(bage_60);
  match_stage.push(uage_60);

  match_stage.push(bage_61_64);
  match_stage.push(uage_61_64);

  match_stage.push(bage_65);
  match_stage.push(uage_65);

  match_stage.push(bage_66_69);
  match_stage.push(uage_66_69);

  match_stage.push(bage_70_74);
  match_stage.push(uage_70_74);

  match_stage.push(bage_lebih_75);
  match_stage.push(uage_lebih_75);

  let group_stage = {
    $group: {
      _id: null,
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
                {
                  $eq: ['$kumpulanEtnik', 'melayu'],
                },
                {
                  $eq: ['$kumpulanEtnik', null],
                },
                {
                  $eq: ['$kumpulanEtnik', ''],
                },
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
              $eq: ['$ibuMengandung', true],
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
              $eq: ['$rujukDaripada', 'laoin-lain'],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let data = [];

  try {
    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, match_stage[i], group_stage];
      const query = await Umum.aggregate(pipeline);
      data.push(query);
    }
    return data;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPG214 = async (payload) => {
  const main_switch = {
    $match: {
      ...getParams214(payload),
    },
  };

  const match_stage = {
    $match: {
      umur: { $gte: 59, $lte: 60 },
    },
  };

  const first_group_stage = {
    $group: {
      _id: {
        ic: '$ic',
        visitMonth: {
          $month: {
            $dateFromString: { dateString: '$tarikhKedatangan' },
          },
        },
      },
      //
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
      age: { $max: '$umur' },
      kedatangan: { $first: '$kedatangan' },
      jumlahMelayu: {
        $sum: {
          $cond: [
            {
              $eq: ['$kumpulanEtnik', 'melayu'],
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
      //
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
      //
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
      //
      jumlahSemuaGigi: {
        $sum: '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
      },
    },
  };

  const second_group_stage = {
    $group: {
      _id: {
        $cond: [
          { $lt: ['$age', 61] },
          '60',
          {
            $cond: [
              { $lt: ['$age', 65] },
              '61 - 64',
              {
                $cond: [
                  { $eq: ['$age', 65] },
                  '65',
                  {
                    $cond: [
                      { $lt: ['$age', 70] },
                      '66 - 69',
                      {
                        $cond: [
                          { $lt: ['$age', 75] },
                          '70 - 74',
                          {
                            $cond: [{ $eq: ['$age', 75] }, 75, '75++'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
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
      jumlahMelayu: { $sum: '$jumlahMelayu' },
      jumlahCina: { $sum: '$jumlahCina' },
      jumlahIndia: { $sum: '$jumlahIndia' },
      //
      jumlahBajau: { $sum: '$jumlahBajau' },
      //
      jumlahDusun: {
        $sum: '$jumlahDusun',
      },
      //
      jumlahKadazan: {
        $sum: '$jumlahKadazan',
      },
      //
      jumlahMurut: {
        $sum: '$jumlahMurut',
      },
      //
      jumlahBMSL: {
        $sum: '$jumlahBMSL',
      },
      //
      jumlahMelanau: {
        $sum: '$jumlahMelanau',
      },
      //
      jumlahKedayan: {
        $sum: '$jumlahKedayan',
      },
      //
      jumlahIban: {
        $sum: '$jumlahIban',
      },
      //
      jumlahBidayuh: {
        $sum: '$jumlahBidayuh',
      },
      //
      jumlahPenan: {
        $sum: '$jumlahPenan',
      },
      //
      jumlahBMSwL: {
        $sum: '$jumlahBMSwL',
      },
      //
      jumlahOAS: {
        $sum: '$jumlahOAS',
      },
      //
      jumlahLainlain: {
        $sum: '$jumlahLainlain',
      },
      //
      jumlahBukanWarganegara: {
        $sum: '$jumlahBukanWarganegara',
      },
      //
      jumlahLelaki: {
        $sum: '$jumlahLelaki',
      },
      //
      jumlahPerempuan: {
        $sum: '$jumlahPerempuan',
      },
      //
      jumlahEdentulous: {
        $sum: '$jumlahEdentulous',
      },
      //
      jumlahGigiLebihAtauSama20: {
        $sum: '$jumlahGigiLebihAtauSama20',
      },
      //
      jumlahGigiKurang20: {
        $sum: '$jumlahGigiKurang20',
      },
      //
      jumlahSemuaGigi: {
        $sum: '$jumlahSemuaGigi',
      },
    },
  };

  let match_stage_custom = [];

  const match_stage_custom_6164 = {
    $match: {
      umur: { $gte: 61, $lte: 64 },
    },
  };
  const match_stage_custom_65 = {
    $match: {
      umur: { $eq: 65 },
    },
  };
  const match_stage_custom_6669 = {
    $match: {
      umur: { $gte: 66, $lte: 69 },
    },
  };
  const match_stage_custom_7074 = {
    $match: {
      umur: { $gte: 70, $lte: 74 },
    },
  };
  const match_stage_custom_75 = {
    $match: {
      umur: { $gte: 75 },
    },
  };

  match_stage_custom = [
    match_stage_custom_6164,
    match_stage_custom_65,
    match_stage_custom_6669,
    match_stage_custom_7074,
    match_stage_custom_75,
  ];

  const first_custom_group_stage = {
    $group: {
      _id: placeModifier(payload),
      //
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
      jumlahMelayu: {
        $sum: {
          $cond: [
            {
              $eq: ['$kumpulanEtnik', 'melayu'],
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
      //
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
      //
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
      //
      jumlahSemuaGigi: {
        $sum: '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
      },
    },
  };

  let bigData = [];

  const pipeline = [
    main_switch,
    match_stage,
    first_group_stage,
    second_group_stage,
  ];

  const PG214 = await Umum.aggregate(pipeline);
  bigData.push({ PG214 });

  for (let i = 0; i < match_stage_custom.length; i++) {
    const custom_pipeline = [
      main_switch,
      match_stage_custom[i],
      first_custom_group_stage,
    ];
    const customPG214 = await Umum.aggregate(custom_pipeline);
    bigData.push({ customPG214 });
  }

  return bigData;
};

//Reten Umum
const countPG206 = async (payload) => {
  const main_switch = {
    $match: {
      ...getParams206(payload),
    },
  };

  let match_stage_pemeriksaan = [];

  // pemeriksaan

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
  const match_pemeriksaan_oku = {
    $match: {
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bukanWarganegara = {
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
    match_pemeriksaan_oku,
    match_pemeriksaan_bukanWarganegara
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
      skorGISZero: {
        $sum: {
          $cond: [
            { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'] },
            1,
            0,
          ],
        },
      },
      skorGISMoreThanZero: {
        $sum: {
          $cond: [
            { $ne: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'] },
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
    match_oku,
    match_bukanWarganegara
  );

  const group = {
    $group: {
      _id: placeModifier(payload),
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
      tampalanSementara: {
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
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
    },
  };

  // for frodo
  const pipeline_pemeriksaan_sekolah = [
    {
      $match: {
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
        pipeline: [
          {
            $match: {
              pemeriksaanSekolah: { $exists: true, $ne: [] },
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
        pipeline: [
          {
            $match: {
              pemeriksaanSekolah: { $exists: true, $ne: [] },
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
  const group_sekolah_pemeriksaan = {
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
      //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
      $sum: {
        $cond: [
          {
            $or: [
              {
                $and: [
                  {
                    $gte: ['$pemeriksaanSekolah.umur', 1],
                  },
                  {
                    $lte: ['$pemeriksaanSekolah.umur', 59],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.dAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.mAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.fAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.xAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.dAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.mAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.fAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.xAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
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
                $gte: ['$pemeriksaanSekolah.umur', 1],
              },
              {
                $lte: ['$pemeriksaanSekolah.umur', 59],
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
    TPR: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0],
              },
              {
                $or: [
                  {
                    $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
                  },
                  {
                    $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'],
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
            $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
          },
          1,
          0,
        ],
      },
    },
    skorGISNotZero: {
      $sum: {
        $cond: [
          {
            $ne: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
                $eq: ['$pemeriksaanSekolah.baruJumlahMuridPerluFv', true],
              },
              {
                $gt: ['$pemeriksaanSekolah.semulaJumlahMuridPerluFv', 0],
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
                $eq: [
                  '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
                  true,
                ],
              },
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
    perluJumlahGigiPrrJenis1: {
      $sum: {
        $add: [
          '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
          '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
        ],
      },
    },
    perluJumlahPesakitFS: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$pemeriksaanSekolah.baruJumlahMuridPerluFs', true],
              },
              {
                $gt: ['$pemeriksaanSekolah.semulaJumlahMuridPerluFs', 0],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    perluJumlahGigiFS: {
      $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
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
  const group_sekolah_rawatan = {
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
                $eq: ['$rawatanSekolah.muridDiberiPrrJenis1', true],
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
                $eq: ['$rawatanSekolah.muridDibuatFs', true],
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
            $eq: ['$rawatanSekolah.kesSelesaiSekolahRawatan', true],
          },
          1,
          0,
        ],
      },
    },
  };
  const pipeline_kedatangan_sekolah = [
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        sekolahSelesaiReten: true,
        jenisFasiliti: {
          $in: ['sekolah-rendah', 'sekolah-menengah'],
        },
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
              pemeriksaanSekolah: {
                $exists: true,
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
        $or: [
          {
            operatorPemeriksaan: {
              $regex: /mdtb/i,
            },
          },
          {
            operatorRawatan: {
              $regex: /mdtb/i,
            },
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

  const dataSekolahPemeriksaan = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $group: {
        ...group_sekolah_pemeriksaan,
      },
    },
  ]);

  const dataSekolahRawatan = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $group: {
        ...group_sekolah_rawatan,
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
        ...group_sekolah_pemeriksaan,
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
        ...group_sekolah_rawatan,
      },
    },
  ]);

  const dataSekolahPemeriksaanBW = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $match: {
        warganegara: { $ne: 'WARGANEGARA' },
      },
    },
    {
      $group: {
        ...group_sekolah_pemeriksaan,
      },
    },
  ]);

  const dataSekolahRawatanBW = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $match: {
        warganegara: { $ne: 'WARGANEGARA' },
      },
    },
    {
      $group: {
        ...group_sekolah_rawatan,
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
    ...group_kedatangan_sekolah,
  ]);

  const kedatanganSekolahBW = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    {
      $match: {
        warganegara: { $ne: 'WARGANEGARA' },
      },
    },
    ...group_kedatangan_sekolah,
  ]);

  // throw new Error('test');

  let match_stage_operatorLain = [];

  const match_OperatorLain_below1year = {
    $match: {
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_1to4years = {
    $match: {
      umur: { $gte: 1, $lte: 4 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_5to6years = {
    $match: {
      umur: { $gte: 5, $lte: 6 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_7to9years = {
    $match: {
      umur: { $gte: 7, $lte: 9 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_10to12years = {
    $match: {
      umur: { $gte: 10, $lte: 12 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_13to14years = {
    $match: {
      umur: { $gte: 13, $lte: 14 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_15to17years = {
    $match: {
      umur: { $gte: 15, $lte: 17 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_oku = {
    $match: {
      rawatanDibuatOperatorLain: true,
      orangKurangUpaya: true,
    },
  };
  const match_OperatorLain_bukanWarganegara = {
    $match: {
      rawatanDibuatOperatorLain: true,
      kumpulanEtnik: { $eq: 'bukan warganegara' },
    },
  };

  match_stage_operatorLain.push(
    match_OperatorLain_below1year,
    match_OperatorLain_1to4years,
    match_OperatorLain_5to6years,
    match_OperatorLain_7to9years,
    match_OperatorLain_10to12years,
    match_OperatorLain_13to14years,
    match_OperatorLain_15to17years,
    match_OperatorLain_oku,
    match_OperatorLain_bukanWarganegara
  );

  const group_operatorLain = {
    $group: {
      _id: placeModifier(payload),
      retenSalah: { $sum: '$retenSalah' },
      // kedatanganTahunSemasaUlangan: {
      //   $sum: {
      //     $cond: [
      //       {
      //         $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
      //       },
      //       1,
      //       0,
      //     ],
      //   },
      // },
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
        //Pesaakit Dibaut FS
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

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let dataOperatorLain = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        main_switch,
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, match_stage[i], group];
      const queryRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
    }

    for (let i = 0; i < match_stage_operatorLain.length; i++) {
      const pipeline = [
        main_switch,
        match_stage_operatorLain[i],
        ...getParamsOperatorLain,
        ...hotfix206,
        group_operatorLain,
      ];
      const queryOperatorLain = await Umum.aggregate(pipeline);
      dataOperatorLain.push({ queryOperatorLain });
    }

    bigData.push(
      dataPemeriksaan,
      dataRawatan,
      dataSekolahPemeriksaan,
      dataSekolahRawatan,
      dataOperatorLain,
      kedatanganSekolah,
      dataSekolahPemeriksaanOKU,
      dataSekolahRawatanOKU,
      dataSekolahPemeriksaanBW,
      dataSekolahRawatanBW,
      kedatanganSekolahOKU,
      kedatanganSekolahBW
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
    },
  };

  // for umum

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
  const match_pemeriksaan_bukanWarganegara = {
    $match: {
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $eq: 'bukan warganegara' },
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
    match_pemeriksaan_bukanWarganegara
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

  // for frodo
  const pipeline_pemeriksaan_sekolah = [
    {
      $match: {
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
        pipeline: [
          {
            $match: {
              pemeriksaanSekolah: { $exists: true, $ne: [] },
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
        pipeline: [
          {
            $match: {
              pemeriksaanSekolah: { $exists: true, $ne: [] },
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
  const group_sekolah_pemeriksaan = {
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
      //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
      $sum: {
        $cond: [
          {
            $or: [
              {
                $and: [
                  {
                    $gte: ['$pemeriksaanSekolah.umur', 1],
                  },
                  {
                    $lte: ['$pemeriksaanSekolah.umur', 59],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.dAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.mAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.fAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.xAdaGigiDesidusPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.dAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.mAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.fAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
                  },
                  {
                    $eq: [
                      '$pemeriksaanSekolah.xAdaGigiKekalPemeriksaanUmum',
                      0,
                    ],
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
                $gte: ['$pemeriksaanSekolah.umur', 1],
              },
              {
                $lte: ['$pemeriksaanSekolah.umur', 59],
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
    TPR: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0],
              },
              {
                $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0],
              },
              {
                $or: [
                  {
                    $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
                  },
                  {
                    $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '2'],
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
            $eq: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
            $ne: ['$pemeriksaanSekolah.skorGisMulutOralHygiene', '0'],
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
                $eq: ['$pemeriksaanSekolah.baruJumlahMuridPerluFv', true],
              },
              {
                $gt: ['$pemeriksaanSekolah.semulaJumlahMuridPerluFv', 0],
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
                $eq: [
                  '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
                  true,
                ],
              },
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
    perluJumlahGigiPrrJenis1: {
      $sum: {
        $add: [
          '$pemeriksaanSekolah.baruJumlahGigiKekalPerluPrrJenis1',
          '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluPrrJenis1',
        ],
      },
    },
    perluJumlahPesakitFS: {
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$pemeriksaanSekolah.baruJumlahMuridPerluFs', true],
              },
              {
                $gt: ['$pemeriksaanSekolah.semulaJumlahMuridPerluFs', 0],
              },
            ],
          },
          1,
          0,
        ],
      },
    },
    perluJumlahGigiFS: {
      $sum: '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
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
  const group_sekolah_rawatan = {
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
                $eq: ['$rawatanSekolah.muridDiberiPrrJenis1', true],
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
                $eq: ['$rawatanSekolah.muridDibuatFs', true],
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
            $eq: ['$rawatanSekolah.kesSelesaiSekolahRawatan', true],
          },
          1,
          0,
        ],
      },
    },
  };
  const pipeline_kedatangan_sekolah = [
    {
      $match: {
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        sekolahSelesaiReten: true,
        jenisFasiliti: {
          $in: ['sekolah-rendah', 'sekolah-menengah'],
        },
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
              pemeriksaanSekolah: {
                $exists: true,
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
        $or: [
          {
            operatorPemeriksaan: {
              $regex: /^(?!mdtb).*$/i,
            },
          },
          {
            operatorRawatan: {
              $regex: /^(?!mdtb).*$/i,
            },
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

  const dataSekolahPemeriksaan = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $group: {
        ...group_sekolah_pemeriksaan,
      },
    },
  ]);

  const dataSekolahRawatan = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $group: {
        ...group_sekolah_rawatan,
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
        ...group_sekolah_pemeriksaan,
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
        ...group_sekolah_rawatan,
      },
    },
  ]);

  const dataSekolahPemeriksaanBW = await Fasiliti.aggregate([
    ...pipeline_pemeriksaan_sekolah,
    {
      $match: {
        warganegara: { $ne: 'WARGANEGARA' },
      },
    },
    {
      $group: {
        ...group_sekolah_pemeriksaan,
      },
    },
  ]);

  const dataSekolahRawatanBW = await Fasiliti.aggregate([
    ...pipeline_rawatan_sekolah,
    {
      $match: {
        warganegara: { $ne: 'WARGANEGARA' },
      },
    },
    {
      $group: {
        ...group_sekolah_rawatan,
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
    ...group_kedatangan_sekolah,
  ]);

  const kedatanganSekolahBW = await Fasiliti.aggregate([
    ...pipeline_kedatangan_sekolah,
    {
      $match: {
        warganegara: { $ne: 'WARGANEGARA' },
      },
    },
    ...group_kedatangan_sekolah,
  ]);

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
      rawatanDibuatOperatorLain: true,
      umur: { $gte: 60 },
    },
  };
  const match_operatorLain_ibumengandung = {
    $match: {
      rawatanDibuatOperatorLain: true,
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_operatorLain_oku = {
    $match: {
      rawatanDibuatOperatorLain: true,
      orangKurangUpaya: true,
    },
  };
  const match_operatorLain_bukanWarganegara = {
    $match: {
      kumpulanEtnik: { $eq: 'bukan warganegara' },
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
    match_operatorLain_bukanWarganegara
  );

  const group_operatorLain = {
    $group: {
      _id: placeModifier(payload),
      // kedatanganTahunSemasaUlangan: {
      //   $sum: {
      //     $cond: [
      //       {
      //         $and: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }],
      //       },
      //       1,
      //       0,
      //     ],
      //   },
      // },
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

  // BPE BUAT HAL
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
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let dataOperatorLain = [];
    let skorBpe = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        main_switch,
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
      ];
      const queryPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, match_stage[i], group];
      const queryRawatan = await Umum.aggregate(pipeline);
      dataRawatan.push({ queryRawatan });
    }

    if (!payload.pilihanIndividu) {
      for (let i = 0; i < match_stage_operatorLain.length; i++) {
        const pipeline = [
          main_switch,
          match_stage_operatorLain[i],
          ...getParamsOperatorLain,
          ...hotfix207,
          group_operatorLain,
        ];
        const queryOperatorLain = await Umum.aggregate(pipeline);
        dataOperatorLain.push({ queryOperatorLain });
      }
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline_pemeriksaan = [...switch_bpe, match_stage[i], group_bpe];
      const skorBpe = await Umum.aggregate(pipeline_pemeriksaan);
      skorBpe.push({ skorBpe });
    }

    bigData.push(
      dataPemeriksaan,
      dataRawatan,
      dataSekolahPemeriksaan,
      dataSekolahRawatan,
      dataOperatorLain,
      skorBpe,
      kedatanganSekolah,
      dataSekolahPemeriksaanOKU,
      dataSekolahRawatanOKU,
      dataSekolahPemeriksaanBW,
      dataSekolahRawatanBW,
      kedatanganSekolahOKU,
      kedatanganSekolahBW
    );

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
  }
};
const countPGPR201Baru = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsPgpr201(payload),
    },
  };

  let match_stage = [];

  const age_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 13,
      },
    },
  };
  const age_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
    },
  };
  const age_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
    },
  };
  const age_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
    },
  };
  const age_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
    },
  };
  const age_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
    },
  };
  const age_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
    },
  };
  const age_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
    },
  };
  const age_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
    },
  };
  const age_30_49 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 49,
      },
    },
  };
  const age_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
    },
  };
  const age_60yearsandup = {
    $match: {
      umur: {
        $gte: 60,
      },
    },
  };
  const ibumengandung = {
    $match: {
      ibuMengandung: true,
    },
  };
  const oku = {
    $match: {
      orangKurangUpaya: true,
    },
  };

  match_stage.push(
    age_below_1,
    age_1_4,
    age_5_6,
    age_7_9,
    age_10_12,
    age_13_14,
    age_15_17,
    age_18_19,
    age_20_29,
    age_30_49,
    age_50_59,
    age_60yearsandup,
    ibumengandung,
    oku
  );

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
        //nanti ini tukar ke intervensi tabiat merokok (saringan) - data dari KOTAK
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
        //nanti ini tukar ke intervensi tabiat merokok (nasihat ringkas) - data dari KOTAK
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
        //nanti ini tukar ke intervensi tabiat merokok (intervensi) - data dari KOTAK
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

  let bigData = [];

  try {
    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [main_switch, match_stage[i], group_stage];
      const query = await Umum.aggregate(pipeline);
      bigData.push(query);
    }
    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// Reten Sekolah
const countPGS201 = async (payload) => {
  const { menengahMmi } = payload;

  let match_stage = [];
  //
  const pra_tad_Lima_Tahun = [
    {
      $match: {
        ...getParamsPGS201(payload),
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
  const pra_Enam_tahun = [
    {
      $match: {
        ...getParamsPGS201(payload),
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
  const pra_tad_OKU = [
    {
      $match: {
        ...getParamsPGS201(payload),
        // umur: { $gte: 5, $lt: 7 },
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
  const pra_tad_OA_penan = [
    {
      $match: {
        ...getParamsPGS201(payload),
        // umur: { $gte: 5, $lt: 7 },
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

  match_stage.push(pra_tad_Lima_Tahun);
  match_stage.push(pra_Enam_tahun);
  match_stage.push(pra_tad_OKU);
  match_stage.push(pra_tad_OA_penan);
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

        //Kebersihan Mulut
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
          //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
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
          //DMFX<=3 //Formula updated - edited by Leong 03.08.2022
          //DMFX ≤ 3
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
          // X+M = 0
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
          //TPR MMI sama dgn TPR ICDAS
          // d/D = 0 ; x/X = 0 ; GIS = 0 / 2 ; BPE = 0 ; tidak perlu scaling ; E10 = 0 ; E12 = 0 ; E13 = 0
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
                // $eq: [
                //   '$pesakitDibuatFluorideVarnish',
                //   'pesakit-dibuat-fluoride-varnish',
                $eq: ['$pesakitDibuatFluorideVarnish', true],
                // ],
              },
              1,
              0,
            ],
          },
        },
        telahPrrJenis1BilMurid: {
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
        telahPrrJenis1BilGigi: {
          $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
        },
        telahFissureSealantBilMurid: {
          //Pesaakit Dibaut FS
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

  // for sekolah

  const pipeline_sekolah = [
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
        // nama: 1,
        jenisFasiliti: 1,
        // kodFasilitiHandler: 1,
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
        jenisFasiliti: 1,
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
  ];
  const pipeline_sekolah_mmi = [
    {
      $match: {
        sekolahSelesaiReten: true,
        sekolahMmi: 'ya-sekolah-mmi',
        ...(payload.negeri !== 'all' && { createdByNegeri: payload.negeri }),
        ...(payload.daerah !== 'all' && { createdByDaerah: payload.daerah }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: { $in: ['sekolah-menengah'] },
      },
    },
    {
      $project: {
        _id: 0,
        // nama: 1,
        jenisFasiliti: 1,
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
        jenisFasiliti: 1,
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
  ];
  const group_sekolah = {
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
    jumlahKebersihanMulutA: {
      $sum: {
        $cond: [
          {
            $eq: ['$merged.kebersihanMulutOralHygiene', 'A'],
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
            $eq: ['$merged.kebersihanMulutOralHygiene', 'C'],
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
            $eq: ['$merged.kebersihanMulutOralHygiene', 'E'],
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
      $sum: '$merged.eAdaGigiKekal',
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
      //dfx=0
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$merged.dAdaGigiDesidus', 0],
              },
              {
                $eq: ['$merged.fAdaGigiDesidus', 0],
              },
              {
                $eq: ['$merged.xAdaGigiDesidus', 0],
              },
            ],
          },
          1,
          0,
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
    gigiKekalDMFXsamaAtauKurangDari3: {
      //DMFX<=3 //Formula updated - edited by Leong 03.08.2022
      //DMFX ≤ 3
      $sum: {
        $cond: [
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
              {
                $eq: ['$merged.mAdaGigiKekal', 0],
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
    eLebihAtauSamaDenganSatu: {
      $sum: {
        $cond: [
          {
            $gt: ['$merged.eAdaGigiKekal', 0],
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
    skorGIS0: {
      $sum: {
        $cond: [
          {
            $eq: ['$merged.skorGisMulutOralHygiene', '0'],
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
            $eq: ['$merged.skorGisMulutOralHygiene', '1'],
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
            $eq: ['$merged.skorGisMulutOralHygiene', '2'],
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
            $eq: ['$merged.skorGisMulutOralHygiene', '3'],
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
            $eq: ['$merged.skorBpeOralHygiene', '0'],
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
            $eq: ['$merged.skorBpeOralHygiene', '1'],
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
            $eq: ['$merged.skorBpeOralHygiene', '2'],
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
            $eq: ['$merged.skorBpeOralHygiene', '3'],
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
            $eq: ['$merged.skorBpeOralHygiene', '4'],
          },
          1,
          0,
        ],
      },
    },
    jumlahTPRmmi: {
      //TPR MMI sama dgn TPR ICDAS
      // d/D = 0 ; x/X = 0 ; GIS = 0 / 2 ; BPE = 0 ; tidak perlu scaling ; E10 = 0 ; E12 = 0 ; E13 = 0
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
                $eq: ['$merged.perluPenskaleran', false],
              },
              {
                $eq: ['$merged.eAdaGigiKekal', 0],
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
    jumlahTPRbiasa: {
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
            $eq: ['$merged.tisuKerasTrauma', true],
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
    // // rawatan
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
    kesSelesaiMMI: {
      $sum: {
        $cond: [
          {
            $eq: ['$merged.kesSelesaiIcdasSekolahRawatan', true],
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
  };
  const pipeline_kedatangan_sekolah = [
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
              pemeriksaanSekolah: {
                $exists: true,
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
  const pipeline_kedatangan_sekolah_mmi = [
    {
      $match: {
        sekolahSelesaiReten: true,
        sekolahMmi: 'ya-sekolah-mmi',
        ...(!['all', '-'].includes(payload.negeri) && {
          createdByNegeri: payload.negeri,
        }),
        ...(!['all', '-'].includes(payload.daerah) && {
          createdByDaerah: payload.daerah,
        }),
        ...(payload.klinik !== 'all' && { kodFasilitiHandler: payload.klinik }),
        ...(payload.pilihanSekolah && { kodSekolah: payload.pilihanSekolah }),
        jenisFasiliti: {
          $in: ['sekolah-menengah'],
        },
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
              pemeriksaanSekolah: {
                $exists: true,
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
                then: 'darjah-kki',
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
                then: 'tingkatan-kki',
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

  // for sam

  // const kedatanganSekolahOKU = await Fasiliti.aggregate([
  //   ...pipeline_kedatangan_sekolah,
  //   {
  //     $match: {
  //       statusOku: 'OKU',
  //     },
  //   },
  //   ...group_kedatangan_sekolah,
  // ]);

  // const kedatanganSekolahBW = await Fasiliti.aggregate([
  //   ...pipeline_kedatangan_sekolah,
  //   {
  //     $match: {
  //       warganegara: { $ne: 'WARGANEGARA' },
  //     },
  //   },
  //   ...group_kedatangan_sekolah,
  // ]);

  // bismillah
  try {
    let bigData = [];

    for (const stage of match_stage) {
      const dataPG201P2 = await Umum.aggregate([...stage, ...group_stage]);
      bigData.push(dataPG201P2);
    }

    switch (menengahMmi) {
      case 'jana-menengah-mmi':
        console.log('jana mmi plak');
        const dataSekolahMMI = await Fasiliti.aggregate([
          ...pipeline_sekolah_mmi,
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
                      then: 'darjah-kki',
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
                      then: 'tingkatan-kki',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahMMIOKU = await Fasiliti.aggregate([
          ...pipeline_sekolah_mmi,
          {
            $group: {
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
                      then: 'darjah-oku',
                    },
                    {
                      case: {
                        $or: [
                          {
                            $eq: ['$tahunTingkatan', 'KHAM'],
                          },
                        ],
                      },
                      then: 'tingkatan-oku',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahMMIOAP = await Fasiliti.aggregate([
          ...pipeline_sekolah_mmi,
          {
            $group: {
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
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahMMIAllOAP = await Fasiliti.aggregate([
          ...pipeline_sekolah_mmi,
          {
            $group: {
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
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahMMIAllOKU = await Fasiliti.aggregate([
          ...pipeline_sekolah_mmi,
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
                        ],
                      },
                      then: 'all-oku',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahMMIAll = await Fasiliti.aggregate([
          ...pipeline_sekolah_mmi,
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $or: [
                          {
                            $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                          },
                          {
                            $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                          },
                        ],
                      },
                      then: 'all',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const kedatanganSekolahMmi = await Fasiliti.aggregate([
          ...pipeline_kedatangan_sekolah_mmi,
          ...group_kedatangan_sekolah,
        ]);
        // MUATKANNNNNNN
        bigData.push(
          dataSekolahMMI,
          dataSekolahMMIOKU,
          dataSekolahMMIOAP,
          dataSekolahMMIAllOAP,
          dataSekolahMMIAllOKU,
          dataSekolahMMIAll,
          kedatanganSekolahMmi
        );
        break;
      default:
        console.log('jana biyasa');
        const dataSekolahBiasa = await Fasiliti.aggregate([
          ...pipeline_sekolah,
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
                      then: 'darjah-kki',
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
                      then: 'tingkatan-kki',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahOKU = await Fasiliti.aggregate([
          ...pipeline_sekolah,
          {
            $group: {
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
                      then: 'darjah-oku',
                    },
                    {
                      case: {
                        $or: [
                          {
                            $eq: ['$tahunTingkatan', 'KHAM'],
                          },
                        ],
                      },
                      then: 'tingkatan-oku',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahOAP = await Fasiliti.aggregate([
          ...pipeline_sekolah,
          {
            $group: {
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
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahAllOAP = await Fasiliti.aggregate([
          ...pipeline_sekolah,
          {
            $group: {
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
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahAllOKU = await Fasiliti.aggregate([
          ...pipeline_sekolah,
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
                        ],
                      },
                      then: 'all-oku',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const dataSekolahAll = await Fasiliti.aggregate([
          ...pipeline_sekolah,
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $or: [
                          {
                            $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                          },
                          {
                            $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                          },
                        ],
                      },
                      then: 'all',
                    },
                  ],
                  default: 'Unknown',
                },
              },
              ...group_sekolah,
            },
          },
        ]);
        const kedatanganSekolah = await Fasiliti.aggregate([
          ...pipeline_kedatangan_sekolah,
          ...group_kedatangan_sekolah,
        ]);
        // MASUKKANNNNNNN
        bigData.push(
          dataSekolahBiasa,
          dataSekolahOKU,
          dataSekolahOAP,
          dataSekolahAllOAP,
          dataSekolahAllOKU,
          dataSekolahAll,
          kedatanganSekolah
        );
        break;
    }

    // bigData.push(...dataSekolahBiasa);

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

    bigData[0][0] = { ...bigData[0][0], ...totalEnrolmentTastadPra };

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPGS203 = async (payload) => {
  let match_stage = [];
  //
  const pra_tad_kerajaan = [
    {
      $match: {
        ...getParamsPGS203(payload),
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
        govKe: '$fasiliti_data.govKe',
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
        govKe: 'Kerajaan',
        kodTastad: { $regex: /tad/i },
      },
    },
  ];
  const pra_tad_swasta = [
    {
      $match: {
        ...getParamsPGS203(payload),
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
        govKe: '$fasiliti_data.govKe',
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
        govKe: 'Swasta',
        kodTastad: { $regex: /tad/i },
      },
    },
  ];
  const pra_tad_OKU = [
    {
      $match: {
        ...getParamsPGS203(payload),
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
        orangKurangUpaya: true,
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
  const pra_tad_OA_penan = [
    {
      $match: {
        ...getParamsPGS203(payload),
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
        kumpulanEtnik: { $in: ['penan', 'orang asli semenanjung'] },
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
  //
  match_stage.push(pra_tad_kerajaan);
  match_stage.push(pra_tad_swasta);
  match_stage.push(pra_tad_OKU);
  match_stage.push(pra_tad_OA_penan);
  //
  const baru = [
    {
      $match: {
        kedatangan: 'baru-kedatangan',
      },
    },
  ];

  const group_stage_pemeriksaan = [
    {
      $group: {
        _id: placeModifier(payload),
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
          //MBK criterias; No 1 (dmfx = 0 + sm =0 ; ) +/- No 2 (DFMX = 0); Cuma boleh gigi susu and mixed dentition
          $sum: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      { $gte: ['$umur', 6] },
                      { $lte: ['$umur', 18] },
                      { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                      { $eq: ['$mAdaGigiDesidusPemeriksaanUmum', 0] },
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
        xTambahMsamaKosong: {
          // X+M = 0
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
    },
  ];

  const group_stage_rawatan = [
    {
      $group: {
        _id: placeModifier(payload),
        //jenis rawatan diberi
        telahSapuanFluorida: {
          $sum: {
            $cond: [
              {
                // $eq: [
                //   '$pesakitDibuatFluorideVarnish',
                //   'pesakit-dibuat-fluoride-varnish',
                $eq: ['$pesakitDibuatFluorideVarnish', true],
                // ],
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
    },
  ];

  // for sekolah

  const pipeline_sekolah = [
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
        jenisFasiliti: 1,
        // kodFasilitiHandler: 1,
        kodSekolah: 1,
        sesiTakwimSekolah: 1,
        jenisPerkhidmatanSekolah: 1,
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
        jantina: 1,
        umur: 1,
        keturunan: 1,
        warganegara: 1,
        statusOku: 1,
        tahunTingkatan: 1,
        kelasPelajar: 1,
        jenisPerkhidmatanSekolah: 1,
        jenisFasiliti: 1,
        merged: {
          $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
        },
      },
    },
  ];
  const group_sekolah = {
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
    jumlahKebersihanMulutA: {
      $sum: {
        $cond: [
          {
            $eq: ['$merged.kebersihanMulutOralHygiene', 'A'],
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
            $eq: ['$merged.kebersihanMulutOralHygiene', 'C'],
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
            $eq: ['$merged.kebersihanMulutOralHygiene', 'E'],
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
      $sum: '$merged.eAdaGigiKekal',
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
      //dfx=0
      $sum: {
        $cond: [
          {
            $and: [
              {
                $eq: ['$merged.dAdaGigiDesidus', 0],
              },
              {
                $eq: ['$merged.fAdaGigiDesidus', 0],
              },
              {
                $eq: ['$merged.xAdaGigiDesidus', 0],
              },
            ],
          },
          1,
          0,
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
    gigiKekalDMFXsamaAtauKurangDari3: {
      //DMFX<=3 //Formula updated - edited by Leong 03.08.2022
      //DMFX ≤ 3
      $sum: {
        $cond: [
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
              {
                $eq: ['$merged.mAdaGigiKekal', 0],
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
    eLebihAtauSamaDenganSatu: {
      $sum: {
        $cond: [
          {
            $gt: ['$merged.eAdaGigiKekal', 0],
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
    skorGIS0: {
      $sum: {
        $cond: [
          {
            $eq: ['$merged.skorGisMulutOralHygiene', '0'],
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
            $eq: ['$merged.skorGisMulutOralHygiene', '1'],
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
            $eq: ['$merged.skorGisMulutOralHygiene', '2'],
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
            $eq: ['$merged.skorGisMulutOralHygiene', '3'],
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
            $eq: ['$merged.skorBpeOralHygiene', '0'],
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
            $eq: ['$merged.skorBpeOralHygiene', '1'],
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
            $eq: ['$merged.skorBpeOralHygiene', '2'],
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
            $eq: ['$merged.skorBpeOralHygiene', '3'],
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
            $eq: ['$merged.skorBpeOralHygiene', '4'],
          },
          1,
          0,
        ],
      },
    },
    jumlahTPRmmi: {
      //TPR MMI sama dgn TPR ICDAS
      // d/D = 0 ; x/X = 0 ; GIS = 0 / 2 ; BPE = 0 ; tidak perlu scaling ; E10 = 0 ; E12 = 0 ; E13 = 0
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
                $eq: ['$merged.perluPenskaleran', false],
              },
              {
                $eq: ['$merged.eAdaGigiKekal', 0],
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
    jumlahTPRbiasa: {
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
            $eq: ['$merged.tisuKerasTrauma', true],
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
    // // rawatan
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
    kesSelesaiMMI: {
      $sum: {
        $cond: [
          {
            $eq: ['$merged.kesSelesaiIcdasSekolahRawatan', true],
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
  };

  const dataSekolahKPSKPB = await Fasiliti.aggregate([
    ...pipeline_sekolah,
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
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
        ...group_sekolah,
      },
    },
  ]);
  const dataSekolahKKI = await Fasiliti.aggregate([
    ...pipeline_sekolah,
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                    },
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                    },
                  ],
                },
                then: 'darjah-all-kpb',
              },
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                    },
                    {
                      $eq: ['$statusOku', 'OKU'],
                    },
                  ],
                },
                then: 'darjah-all-mbk',
              },
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$statusOku', 'OKU'],
                    },
                  ],
                },
                then: 'tingkatan-all-mbk',
              },
            ],
            default: 'Unknown',
          },
        },
        ...group_sekolah,
      },
    },
  ]);
  const dataSekolahOAP = await Fasiliti.aggregate([
    ...pipeline_sekolah,
    {
      $group: {
        _id: {
          $switch: {
            branches: [
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
        ...group_sekolah,
      },
    },
  ]);
  const dataSekolahAllKPSKPB = await Fasiliti.aggregate([
    ...pipeline_sekolah,
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                    },
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                    },
                  ],
                },
                then: 'darjah-all-kps',
              },
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                    },
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                    },
                  ],
                },
                then: 'darjah-all-kpb',
              },
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisPerkhidmatanSekolah', 'kps'],
                    },
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                  ],
                },
                then: 'tingkatan-all-kps',
              },
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisPerkhidmatanSekolah', 'kpb'],
                    },
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                  ],
                },
                then: 'tingkatan-all-kpb',
              },
            ],
            default: 'Unknown',
          },
        },
        ...group_sekolah,
      },
    },
  ]);
  const dataSekolahAllKKI = await Fasiliti.aggregate([
    ...pipeline_sekolah,
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-rendah'],
                    },
                    {
                      $eq: ['$statusOku', 'OKU'],
                    },
                  ],
                },
                then: 'darjah-all-mbk',
              },
              {
                case: {
                  $and: [
                    {
                      $eq: ['$jenisFasiliti', 'sekolah-menengah'],
                    },
                    {
                      $eq: ['$statusOku', 'OKU'],
                    },
                  ],
                },
                then: 'tingkatan-all-mbk',
              },
            ],
            default: 'Unknown',
          },
        },
        ...group_sekolah,
      },
    },
  ]);
  const dataSekolahAllOAP = await Fasiliti.aggregate([
    ...pipeline_sekolah,
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
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
        ...group_sekolah,
      },
    },
  ]);

  // bismillah
  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let bigData = [];

    for (const stage of match_stage) {
      const queryPemeriksaanPGS203 = await Umum.aggregate([
        ...stage,
        ...baru,
        ...group_stage_pemeriksaan,
      ]);
      dataPemeriksaan.push({ queryPemeriksaanPGS203 });
    }

    for (const stage of match_stage) {
      const queryRawatanPGS203 = await Umum.aggregate([
        ...stage,
        ...group_stage_rawatan,
      ]);
      dataRawatan.push({ queryRawatanPGS203 });
    }

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
          // jumlahTastadTiadaStatus: {
          //   $sum: {
          //     $cond: [
          //       {
          //         $eq: ['$govKe', ''],
          //       },
          //       1,
          //       0,
          //     ],
          //   },
          // },
          // jumlahTastadTiadaEnrolmen: {
          //   $sum: {
          //     $cond: [
          //       {
          //         $eq: ['$enrolmenTastad', 'NOT APPLICABLE'],
          //       },
          //       1,
          //       0,
          //     ],
          //   },
          // },
          // sumEnrolmenTastadKerajaan: {
          //   $sum: {
          //     $cond: [
          //       {
          //         $in: ['$govKe', ['Kerajaan']],
          //       },
          //       {
          //         $convert: {
          //           input: {
          //             $ifNull: ['$enrolmenTastad', '0'],
          //           },
          //           to: 'int',
          //           onError: 0,
          //           onNull: 0,
          //         },
          //       },
          //       0,
          //     ],
          //   },
          // },
          // sumEnrolmenTastadSwasta: {
          //   $sum: {
          //     $cond: [
          //       {
          //         $in: ['$govKe', ['Swasta']],
          //       },
          //       {
          //         $convert: {
          //           input: {
          //             $ifNull: ['$enrolmenTastad', '0'],
          //           },
          //           to: 'int',
          //           onError: 0,
          //           onNull: 0,
          //         },
          //       },
          //       0,
          //     ],
          //   },
          // },
        },
      },
    ]);

    const allFasilitiDilawati = [];

    // console.log(dataPemeriksaan[0].queryPemeriksaanPGS203[0]);

    // throw new Error('test');

    if (dataPemeriksaan[0]?.queryPemeriksaanPGS203[0]) {
      for (const kodTastad of dataPemeriksaan[0]?.queryPemeriksaanPGS203[0]
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

    if (dataPemeriksaan[1]?.queryPemeriksaanPGS203[0]) {
      for (const kodTastad of dataPemeriksaan[1]?.queryPemeriksaanPGS203[0]
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

    // console.log(allFasilitiDilawati);

    // nnt nk kena masuk taska
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

    // console.log(totalEnrolmentTastadPra);

    // throw new Error('test');

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    bigData.push(dataSekolahKPSKPB);
    bigData.push(dataSekolahKKI);
    bigData.push(dataSekolahOAP);
    bigData.push(dataSekolahAllKPSKPB);
    bigData.push(dataSekolahAllKKI);
    bigData.push(dataSekolahAllOAP);

    bigData[0][0] = {
      ...(bigData[0][0] || {}),
      ...(dataFasilitiFull[0] || {}),
      ...totalEnrolmentTastadPra,
    };

    // console.log(bigData);

    // throw new Error('test');

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// Reten Promosi
const countPGPro01 = async (payload) => {
  //PGPRO01 Pind.2 - 2022 - FFR
  const match_stage = {
    $match: {
      ...getParamsPgPro(payload),
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

  // run aggregate
  try {
    const pipeline = [match_stage, group_stage];
    const data = await Promosi.aggregate(pipeline);
    return data;
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

// Reten Lain-lain??
const countGender = async (payload) => {
  const main_switch = {
    $match: {
      ...getParamsGender(payload),
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
        match_stage_melayu[i],
        group_stage,
      ]);
      melayu.push(dataMelayu[0]);
    }
    for (let i = 0; i < match_stage_cina.length; i++) {
      const dataCina = await Umum.aggregate([match_stage_cina[i], group_stage]);
      cina.push(dataCina[0]);
    }
    for (let i = 0; i < match_stage_india.length; i++) {
      const dataIndia = await Umum.aggregate([
        match_stage_india[i],
        group_stage,
      ]);
      india.push(dataIndia[0]);
    }
    for (let i = 0; i < match_stage_bumiputeraSabah.length; i++) {
      const dataBumiputeraSabah = await Umum.aggregate([
        match_stage_bumiputeraSabah[i],
        group_stage,
      ]);
      bumiputeraSabah.push(dataBumiputeraSabah[0]);
    }
    for (let i = 0; i < match_stage_bumiputeraSarawak.length; i++) {
      const dataBumiputeraSarawak = await Umum.aggregate([
        match_stage_bumiputeraSarawak[i],
        group_stage,
      ]);
      bumiputeraSarawak.push(dataBumiputeraSarawak[0]);
    }
    for (let i = 0; i < match_stage_orangAsliSemenanjung.length; i++) {
      const dataOrangAsliSemenanjung = await Umum.aggregate([
        match_stage_orangAsliSemenanjung[i],
        group_stage,
      ]);
      orangAsliSemenanjung.push(dataOrangAsliSemenanjung[0]);
    }
    for (let i = 0; i < match_stage_lain.length; i++) {
      const dataLain = await Umum.aggregate([match_stage_lain[i], group_stage]);
      lain2.push(dataLain[0]);
    }

    bigData.push({ melayu });
    bigData.push({ cina });
    bigData.push({ india });
    bigData.push({ bumiputeraSabah });
    bigData.push({ bumiputeraSarawak });
    bigData.push({ orangAsliSemenanjung });
    bigData.push({ lain2 });

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
  const { negeri } = payload;

  try {
    let keppPt = await Umum.aggregate([
      {
        $match: {
          kepp: true,
          createdByNegeri: negeri,
        },
      },
      {
        $group: {
          _id: '$createdByKodFasiliti',
          kodFasiliti: { $first: '$createdByKodFasiliti' },
          createdByKp: { $first: '$createdByKp' },
        },
      },
    ]);

    keppPt = await Promise.all(
      keppPt.map(async (kepp) => {
        const { kodFasiliti } = kepp;
        const jumlahPegawai = await Operator.countDocuments({
          statusPegawai: 'pp',
          kodFasiliti,
        });
        return { ...kepp, jumlahPegawai };
      })
    );

    keppPt = await Promise.all(
      keppPt.map(async (kepp) => {
        const pesakit = await Umum.aggregate([
          {
            $match: { createdByKodFasiliti: kepp.kodFasiliti, kepp: true },
          },
          {
            $group: {
              _id: '$createdByKodFasiliti',
              jumlahPesakit: { $sum: 1 },
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
              jumlahKesEndoPerluAnt: {
                $sum: '$jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum',
              },
              jumlahKesEndoPerluPreMolar: {
                $sum: '$jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum',
              },
              jumlahKesEndoPerluMolar: {
                $sum: '$jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum',
              },
              jumlahKesEndoPerluRedo: {
                $sum: '$rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum',
              },
              jumlahKesEndoRedoKP: {
                $sum: '$rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum',
              },
              jumlahKesEndoRedoKeppAnt: {
                $sum: '$jumlahAnteriorRawatanSemulaKeppRawatanUmum',
              },
              jumlahKesEndoRedoKeppPreMolar: {
                $sum: '$jumlahPremolarRawatanSemulaKeppRawatanUmum',
              },
              jumlahKesEndoRedoKeppMolar: {
                $sum: '$jumlahMolarRawatanSemulaKeppRawatanUmum',
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
                      $eq: [
                        '$restorasiPascaEndodontikKesRujukUpprRawatanUmum',
                        true,
                      ],
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
        ]);
        return { ...kepp, ...pesakit[0] };
      })
    );

    return keppPt;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countTOD = async (payload) => {
  let match_stage_baru = [];

  // pemeriksaan

  const match_baru_taska = [
    {
      $match: {
        ...getParamsTOD(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'taska-tadika',
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
        statusPerkhidmatan: 'active',
        kodTastad: { $regex: /tas/i },
      },
    },
  ];
  const match_baru_tadika = [
    {
      $match: {
        ...getParamsTOD(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'taska-tadika',
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
        statusPerkhidmatan: 'active',
        kodTastad: { $regex: /tad/i },
      },
    },
  ];
  const match_baru_kkia = [
    {
      $match: {
        ...getParamsTOD(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'kk-kd',
      },
    },
  ];
  const match_baru_op = [
    {
      $match: {
        ...getParamsTOD(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'kp',
      },
    },
  ];
  const match_baru_outreach = [
    {
      $match: {
        ...getParamsTOD(payload),
        kedatangan: 'baru-kedatangan',
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'projek-komuniti-lain',
      },
    },
  ];

  match_stage_baru.push(
    match_baru_taska,
    match_baru_tadika,
    match_baru_kkia,
    match_baru_op,
    match_baru_outreach
  );

  const group_baru = [
    {
      $group: {
        _id: '$jenisFasiliti',
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
                $eq: ['$kecederaanGigiUmum', true],
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
              '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            ],
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
      },
    },
  ];

  let match_stage_bu = [];

  const match_bu_taska = [
    {
      $match: {
        ...getParamsTOD(payload),
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'taska-tadika',
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
        statusPerkhidmatan: 'active',
        kodTastad: { $regex: /tas/i },
      },
    },
  ];
  const match_bu_tadika = [
    {
      $match: {
        ...getParamsTOD(payload),
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'taska-tadika',
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
        statusPerkhidmatan: 'active',
        kodTastad: { $regex: /tad/i },
      },
    },
  ];
  const match_bu_kkia = [
    {
      $match: {
        ...getParamsTOD(payload),
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'kk-kd',
      },
    },
  ];
  const match_bu_op = [
    {
      $match: {
        ...getParamsTOD(payload),
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'kp',
      },
    },
  ];
  const match_bu_outreach = [
    {
      $match: {
        ...getParamsTOD(payload),
        umur: { $gte: 0, $lte: 4 },
        jenisFasiliti: 'projek-komuniti-lain',
      },
    },
  ];

  match_stage_bu.push(
    match_bu_taska,
    match_bu_tadika,
    match_bu_kkia,
    match_bu_op,
    match_bu_outreach
  );

  const add_field_baru = [
    {
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
            else: '$jumlahFaktorRisikoPemeriksaanUmum',
          },
        },
      },
    },
  ];

  const group_bu = [
    {
      $group: {
        _id: '$jenisFasiliti',
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
              '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
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
    },
  ];

  // 18 dan 36 bulan
  let match_stage_1836 = [];

  const match_stage_18 = [
    {
      $match: {
        ...getParamsTOD(payload),
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

  // oplain
  const group_oplain = [
    {
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
        jumlahTampalanAnteriorBaru: {
          $sum: {
            $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          },
        },
        jumlahTampalanPosteriorBaru: {
          $sum: {
            $add: [
              {
                $toInt:
                  '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              },
              {
                $toInt:
                  '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
              },
            ],
          },
        },
        jumlahTampalanAnteriorBu: {
          $sum: {
            $toInt: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          },
        },
        jumlahTampalanPosteriorBu: {
          $sum: {
            $add: [
              {
                $toInt:
                  '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              },
              {
                $toInt:
                  '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
              },
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
    },
  ];

  try {
    let dataBaru = [];
    let dataBu = [];
    let data1836 = [];
    let dataOplain = [];
    let bigData = [];

    for (const stage of match_stage_baru) {
      const queryBaru = await Umum.aggregate([
        ...stage,
        ...add_field_baru,
        ...group_baru,
      ]);
      dataBaru.push({ queryBaru });
    }

    for (const stage of match_stage_bu) {
      const queryBu = await Umum.aggregate([...stage, ...group_bu]);
      dataBu.push({ queryBu });
    }

    for (const stage of match_stage_1836) {
      const query1836 = await Umum.aggregate([...stage, ...group_1836]);
      data1836.push({ query1836 });
    }

    for (const stage of match_stage_bu) {
      const queryOplain = await Umum.aggregate([
        ...stage,
        ...getParamsOperatorLain,
        ...group_oplain,
      ]);
      dataOplain.push({ queryOplain });
    }

    bigData.push(dataBaru, dataBu, data1836, dataOplain);

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

// temp fix
const hotfix206 = [
  {
    $match: {
      createdByMdcMdtb: { $regex: /^mdtb/i },
    },
  },
];

const hotfix207 = [
  {
    $match: {
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i },
    },
  },
];

module.exports = {
  countPG101A,
  countPG101C,
  countPG211A,
  countPG211C,
  countPG214,
  countPG206,
  countPG207,
  countPGPR201Baru,
  countPGS201,
  countPGS203,
  countPGPro01,
  countPGPro02,
  countPGPro01Combined,
  countGender,
  countMasa,
  countBp,
  countBPE,
  // new
  countKEPP,
  countTOD,
  // adhoc
  countAdHocQuery,
};

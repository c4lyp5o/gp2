const moment = require('moment');
const User = require('../models/User');
const Umum = require('../models/Umum');
const Sekolah = require('../models/Sekolah');
const Pemeriksaan = require('../models/Pemeriksaansekolah');
const Rawatan = require('../models/Rawatansekolah');
const Kotak = require('../models/Kotaksekolah');
const Promosi = require('../models/Promosi');
const Fasiliti = require('../models/Fasiliti');
const MediaSosial = require('../models/MediaSosial');
const { errorRetenLogger } = require('../logs/logger');

//Reten Kaunter
const countPG101A = async (payload) => {
  let match_stage = [];
  let project_stage = [];
  let sort_stage = [];

  let match = { $match: getParams101(payload, 'A') };

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

  match_stage.push(match);
  project_stage.push(project);
  sort_stage.push(sort);

  const pipeline = match_stage.concat(project_stage, sort_stage);

  const data = await Umum.aggregate(pipeline);

  if (data.length === 0) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }

  return data;
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

  const pipeline = match_stage.concat(project_stage, sort_stage);

  const data = await Umum.aggregate(pipeline);

  if (data.length === 0) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }

  return data;
};
const countPG211A = async (payload) => {
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
      ...getParams211(payload, 'A'),
    },
  };
  const bage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const bage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'A'),
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
      ...getParams211(payload, 'A'),
    },
  };
  const uage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
    },
  };
  const uage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'A'),
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
      const pipeline = [match_stage[i], group_stage];
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
      ...getParams211(payload, 'C'),
    },
  };
  const bage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const bage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams211(payload, 'C'),
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
      ...getParams211(payload, 'C'),
    },
  };
  const uage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
    },
  };
  const uage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams211(payload, 'C'),
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
      const pipeline = [match_stage[i], group_stage];
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
  const match_stage = {
    $match: {
      ...getParams211(payload),
      umur: { $gte: 59 },
      kedatangan: 'baru-kedatangan',
      statusKehadiran: false,
    },
  };

  const first_group_stage = {
    $group: {
      _id: {
        ic: '$ic',
        visitMonth: {
          $month: { $dateFromString: { dateString: '$tarikhKedatangan' } },
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
              $gte: [
                '$bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
                20,
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

  let data = [];

  const pipeline = [match_stage, first_group_stage, second_group_stage];
  const PG214 = await Umum.aggregate(pipeline);
  data.push({ PG214 });

  return data;
};
//Reten Umum
const countPG206 = async (payload) => {
  let match_stage_pemeriksaan = [];

  // pemeriksaan

  const match_pemeriksaan_below1year = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bukanWarganegara = {
    $match: {
      ...getParams206(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $eq: 'bukan warganegara' },
    },
  };

  match_stage_pemeriksaan.push(match_pemeriksaan_below1year);
  match_stage_pemeriksaan.push(match_pemeriksaan_1to4years);
  match_stage_pemeriksaan.push(match_pemeriksaan_5to6years);
  match_stage_pemeriksaan.push(match_pemeriksaan_7to9years);
  match_stage_pemeriksaan.push(match_pemeriksaan_10to12years);
  match_stage_pemeriksaan.push(match_pemeriksaan_13to14years);
  match_stage_pemeriksaan.push(match_pemeriksaan_15to17years);
  match_stage_pemeriksaan.push(match_pemeriksaan_oku);
  match_stage_pemeriksaan.push(match_pemeriksaan_bukanWarganegara);

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
      perluJumlahGigiFS: { $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum' },
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
      ...getParams206(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_1to4years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_oku = {
    $match: {
      ...getParams206(payload),
      orangKurangUpaya: true,
    },
  };
  const match_bukanWarganegara = {
    $match: {
      ...getParams206(payload),
      kumpulanEtnik: { $eq: 'bukan warganegara' },
    },
  };

  match_stage.push(match_below1year);
  match_stage.push(match_1to4years);
  match_stage.push(match_5to6years);
  match_stage.push(match_7to9years);
  match_stage.push(match_10to12years);
  match_stage.push(match_13to14years);
  match_stage.push(match_15to17years);
  match_stage.push(match_oku);
  match_stage.push(match_bukanWarganegara);

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
      jumlahGigiDibuatFs: { $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum' },
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

  // untuk sekolah

  let match_stage_sekolah = [];

  const match_pemeriksaan_sekolah_below1year = {
    $match: {
      ...getParams206sekolah(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_sekolah_1to4years = {
    $match: {
      ...getParams206sekolah(payload),
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_sekolah_5to6years = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_sekolah_7to9years = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_sekolah_10to12years = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_sekolah_13to14years = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_sekolah_15to17years = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_sekolah_oku = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_sekolah_bukanWarganegara = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      kumpulanEtnik: { $eq: 'bukan warganegara' },
    },
  };

  match_stage_sekolah.push(match_pemeriksaan_sekolah_below1year);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_1to4years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_5to6years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_7to9years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_10to12years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_13to14years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_15to17years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_oku);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_bukanWarganegara);

  let pipeline_sekolah = [
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
        _id: 0,
        statusRawatan: 1,
        daerah: 1,
        namaSekolah: 1,
        kodSekolah: 1,
        namaKelas: 1,
        nama: 1,
        kodJantina: 1,
        umur: { $toInt: '$umur' },
        noKp: 1,
        tarikhLahir: 1,
        kaum: 1,
        merged: {
          $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
        },
      },
    },
    {
      $project: {
        _id: 0,
        statusRawatan: 1,
        daerah: 1,
        namaSekolah: 1,
        kodSekolah: 1,
        namaKelas: 1,
        nama: 1,
        kodJantina: 1,
        umur: 1,
        noKp: 1,
        tarikhLahir: 1,
        kaum: 1,
        createdByKp: '$merged.createdByKp',
        tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
        merged: 1,
      },
    },
  ];

  const group_sekolah = {
    $group: {
      _id: '$merged.createdByKp',
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
                    { $gte: ['$merge.umur', 1] },
                    { $lte: ['$merge.umur', 59] },
                    { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0] },
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
                { $gte: ['$merge.umur', 1] },
                { $lte: ['$merge.umur', 59] },
                { $eq: ['$merged.dAdaGigiKekal', 0] },
                { $eq: ['$merged.mAdaGigiKekal', 0] },
                { $eq: ['$merged.fAdaGigiKekal', 0] },
                { $eq: ['$merged.xAdaGigiKekal', 0] },
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
                        { $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] },
                        { $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'] },
                      ],
                    },
                  ],
                },
                {
                  $eq: ['$merged.tidakPerluRawatan', true],
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
                  $eq: ['$merged.kedatangan', 'baru-kedatangan'],
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
      skorGISMoreThanZero: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                },
                {
                  $ne: ['$merged.skorGisMulutOralHygiene', '0'],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gte: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gte: ['$merged.baruJumlahGigiKekalPerluFSRawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$merged.baruJumlahGigiKekalPerluFS',
      },
      perluPenskaleran: {
        $sum: {
          $eq: ['$merged.perluPenskaleran', true],
        },
      },
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
                  $or: [
                    {
                      $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
                    },
                    {
                      $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
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
      jumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                },
                {
                  $eq: ['$merged.pesakitDibuatPRRJenis1', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
      },
      jumlahPesakitDiBuatFs: {
        $sum: {
          $cond: [
            {
              $gte: [
                '$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
                '1',
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiDibuatFs: {
        $sum: '$merged.baruJumlahGigiKekalDibuatFS',
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
        $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
      },
      cabutanGd: {
        $sum: '$merged.cabutDesidus',
      },
      cabutanGk: {
        $sum: '$merged.cabutKekal',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$merged.penskaleran', true],
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
              $eq: ['$merged.kesSelesai', true],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage_operatorLain = [];

  const match_OperatorLain_below1year = {
    $match: {
      ...getParams206(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_1to4years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 1, $lte: 4 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_5to6years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 5, $lte: 6 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_7to9years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 7, $lte: 9 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_10to12years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 10, $lte: 12 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_13to14years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 13, $lte: 14 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_15to17years = {
    $match: {
      ...getParams206(payload),
      umur: { $gte: 15, $lte: 17 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_OperatorLain_oku = {
    $match: {
      ...getParams206(payload),
      rawatanDibuatOperatorLain: true,
      orangKurangUpaya: true,
    },
  };
  const match_OperatorLain_bukanWarganegara = {
    $match: {
      ...getParams206(payload),
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
            { $eq: ['$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum', ''] },
            0,
            { $toInt: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum' },
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
                        { $toInt: '$baruJumlahGigiKekalDibuatFSRawatanUmum' },
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
            { $toInt: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum' },
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
            { $toInt: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum' },
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
    let dataSekolah = [];
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

    for (let i = 0; i < match_stage_sekolah.length; i++) {
      const pipeline = [
        ...pipeline_sekolah,
        match_stage_sekolah[i],
        group_sekolah,
      ];
      const querySekolah = await Sekolah.aggregate(pipeline);
      dataSekolah.push({ querySekolah });
    }

    for (let i = 0; i < match_stage_operatorLain.length; i++) {
      const pipeline = [
        match_stage_operatorLain[i],
        ...getParamsOperatorLain,
        ...hotfix206,
        group_operatorLain,
      ];
      const queryOperatorLain = await Umum.aggregate(pipeline);
      dataOperatorLain.push({ queryOperatorLain });
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    bigData.push(dataSekolah);
    bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
const countPG207 = async (payload) => {
  // for umum
  let match_stage_pemeriksaan = [];

  const match_pemeriksaan_below1year = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_1to4years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_5to6years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_7to9years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_10to12years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_13to14years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_15to17years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_18to19years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_20to29years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_30to49years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_50to59years = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_60yearsandup = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_ibumengandung = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_oku = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_bukanWarganegara = {
    $match: {
      ...getParams207(payload),
      kedatangan: 'baru-kedatangan',
      kumpulanEtnik: { $eq: 'bukan warganegara' },
    },
  };

  match_stage_pemeriksaan.push(match_pemeriksaan_below1year);
  match_stage_pemeriksaan.push(match_pemeriksaan_1to4years);
  match_stage_pemeriksaan.push(match_pemeriksaan_5to6years);
  match_stage_pemeriksaan.push(match_pemeriksaan_7to9years);
  match_stage_pemeriksaan.push(match_pemeriksaan_10to12years);
  match_stage_pemeriksaan.push(match_pemeriksaan_13to14years);
  match_stage_pemeriksaan.push(match_pemeriksaan_15to17years);
  match_stage_pemeriksaan.push(match_pemeriksaan_18to19years);
  match_stage_pemeriksaan.push(match_pemeriksaan_20to29years);
  match_stage_pemeriksaan.push(match_pemeriksaan_30to49years);
  match_stage_pemeriksaan.push(match_pemeriksaan_50to59years);
  match_stage_pemeriksaan.push(match_pemeriksaan_60yearsandup);
  match_stage_pemeriksaan.push(match_pemeriksaan_ibumengandung);
  match_stage_pemeriksaan.push(match_pemeriksaan_oku);
  match_stage_pemeriksaan.push(match_pemeriksaan_bukanWarganegara);

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
      perluJumlahGigiFS: { $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum' },
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
    },
  };
  const match_1to4years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_5to6years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_7to9years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_10to12years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_13to14years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_15to17years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_18to19years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_20to29years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_30to49years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_50to59years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_60yearsandup = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 60 },
    },
  };
  const match_ibumengandung = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_oku = {
    $match: {
      ...getParams207(payload),
      orangKurangUpaya: true,
    },
  };
  const match_bukanWarganegara = {
    $match: {
      ...getParams207(payload),
      kumpulanEtnik: { $eq: 'bukan warganegara' },
    },
  };

  match_stage.push(match_below1year);
  match_stage.push(match_1to4years);
  match_stage.push(match_5to6years);
  match_stage.push(match_7to9years);
  match_stage.push(match_10to12years);
  match_stage.push(match_13to14years);
  match_stage.push(match_15to17years);
  match_stage.push(match_18to19years);
  match_stage.push(match_20to29years);
  match_stage.push(match_30to49years);
  match_stage.push(match_50to59years);
  match_stage.push(match_60yearsandup);
  match_stage.push(match_ibumengandung);
  match_stage.push(match_oku);
  match_stage.push(match_bukanWarganegara);

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
      jumlahGigiDibuatFs: { $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum' },
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
      rawatanPerioLain: { $sum: '$rawatanLainPeriodontikRawatanUmum' },
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

  let match_stage_sekolah = [];

  const match_sekolah_below1year = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_sekolah_1to4years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_sekolah_5to6years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_sekolah_7to9years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_sekolah_10to12years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_sekolah_13to14years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_sekolah_15to17years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_sekolah_18to19years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_sekolah_20to29years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_sekolah_30to49years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_sekolah_50to59years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_sekolah_60yearsandup = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 60 },
    },
  };
  const match_sekolah_ibumengandung = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_sekolah_oku = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      orangKurangUpaya: true,
    },
  };
  const match_sekolah_bukanWarganegara = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      kumpulanEtnik: { $eq: 'bukan warganegara' },
    },
  };

  match_stage_sekolah.push(match_sekolah_below1year);
  match_stage_sekolah.push(match_sekolah_1to4years);
  match_stage_sekolah.push(match_sekolah_5to6years);
  match_stage_sekolah.push(match_sekolah_7to9years);
  match_stage_sekolah.push(match_sekolah_10to12years);
  match_stage_sekolah.push(match_sekolah_13to14years);
  match_stage_sekolah.push(match_sekolah_15to17years);
  match_stage_sekolah.push(match_sekolah_18to19years);
  match_stage_sekolah.push(match_sekolah_20to29years);
  match_stage_sekolah.push(match_sekolah_30to49years);
  match_stage_sekolah.push(match_sekolah_50to59years);
  match_stage_sekolah.push(match_sekolah_60yearsandup);
  match_stage_sekolah.push(match_sekolah_ibumengandung);
  match_stage_sekolah.push(match_sekolah_oku);
  match_stage_sekolah.push(match_sekolah_bukanWarganegara);

  let pipeline_sekolah = [
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
        _id: 0,
        statusRawatan: 1,
        daerah: 1,
        namaSekolah: 1,
        kodSekolah: 1,
        namaKelas: 1,
        nama: 1,
        kodJantina: 1,
        umur: { $toInt: '$umur' },
        noKp: 1,
        tarikhLahir: 1,
        kaum: 1,
        merged: {
          $mergeObjects: ['$pemeriksaanSekolah', '$rawatanSekolah'],
        },
      },
    },
    {
      $project: {
        _id: 0,
        statusRawatan: 1,
        daerah: 1,
        namaSekolah: 1,
        kodSekolah: 1,
        namaKelas: 1,
        nama: 1,
        kodJantina: 1,
        umur: 1,
        noKp: 1,
        tarikhLahir: 1,
        kaum: 1,
        createdByKp: '$merged.createdByKp',
        tarikhKedatangan: '$merged.tarikhPemeriksaanSemasa',
        merged: 1,
      },
    },
  ];

  const group_sekolah = {
    $group: {
      _id: '$merged.createdByKp',
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
                    { $gte: ['$merge.umur', 1] },
                    { $lte: ['$merge.umur', 59] },
                    { $eq: ['$merge.dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.mAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.fAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.xAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$merge.dAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$merge.mAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$merge.fAdaGigiKekalPemeriksaanUmum', 0] },
                    { $eq: ['$merge.xAdaGigiKekalPemeriksaanUmum', 0] },
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
                { $gte: ['$merge.umur', 1] },
                { $lte: ['$merge.umur', 59] },
                { $eq: ['$merged.dAdaGigiKekal', 0] },
                { $eq: ['$merged.mAdaGigiKekal', 0] },
                { $eq: ['$merged.fAdaGigiKekal', 0] },
                { $eq: ['$merged.xAdaGigiKekal', 0] },
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
                {
                  $and: [
                    { $eq: ['$merged.dAdaGigiKekal', 0] },
                    { $eq: ['$merged.dAdaGigiDesidus', 0] },
                    { $gte: ['$merged.mAdaGigiKekal', 0] },
                    { $gte: ['$merged.mAdaGigiDesidus', 0] },
                    { $gte: ['$merged.fAdaGigiKekal', 0] },
                    { $gte: ['$merged.fAdaGigiDesidus', 0] },
                    { $eq: ['$merged.xAdaGigiKekal', 0] },
                    { $eq: ['$merged.xAdaGigiDesidus', 0] },
                    {
                      $or: [
                        { $eq: ['$merged.skorGisMulutOralHygiene', '0'] },
                        { $eq: ['$merged.skorGisMulutOralHygiene', '2'] },
                      ],
                    },
                  ],
                },
                {
                  $eq: ['$tidakPerluRawatan', true],
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
              $eq: ['$merged.skorBpeOralHygiene', 0],
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
                  $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                },
                {
                  $gte: ['$merged.skorBpeOralHygiene', 1],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      perluSapuanFluorida: {
        $sum: {
          $eq: ['$merged.fvPerluSapuan', 'ya-fv-perlu-sapuan'],
        },
      },
      perluJumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $gt: ['$merged.BaruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [
            {
              $gt: ['$merged.fissureSealant', true],
            },
            1,
            0,
          ],
        },
      },
      perluJumlahGigiFS: {
        $sum: '$merged.baruJumlahGigiKekalPerluFS',
      },
      perluPenskaleran: {
        $sum: {
          $eq: ['$merged.perluPenskaleran', true],
        },
      },
      perluEndoAnterior: {
        $sum: '$merged.jumlahAnteriorKesEndodontikDiperlukan',
      },
      perluEndoPremolar: {
        $sum: '$merged.jumlahPremolarKesEndodontikDiperlukan',
      },
      perluEndoMolar: {
        $sum: '$merged.jumlahMolarKesEndodontikDiperlukan',
      },
      jumlahPerluDenturPenuh: {
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $eq: [
                    '$merged.separaPenuhAtasPerluDenture',
                    'penuh-atas-perlu-denture',
                  ],
                },
                {
                  $eq: [
                    '$merged.separaPenuhBawahPerluDenture',
                    'penuh-bawah-perlu-denture',
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
                    '$merged.separaPenuhAtasPerluDenture',
                    'separa-atas-perlu-denture',
                  ],
                },
                {
                  $eq: [
                    '$merged.separaPenuhBawahPerluDenture',
                    'separa-bawah-perlu-denture',
                  ],
                },
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
                  $or: [
                    {
                      $gt: ['$merged.baruJumlahGigiKekalDiberiFV', 0],
                    },
                    {
                      $gt: ['$merged.semulaJumlahGigiKekalDiberiFV', 0],
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
      jumlahPesakitPrrJenis1: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                },
                {
                  $eq: ['$merged.pesakitDibuatPRRJenis1', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        $sum: '$merged.baruJumlahGigiKekalDiberiPRRJenis1',
      },
      jumlahPesakitDiBuatFs: {
        $sum: '$merged.pesakitDibuatFissureSealant',
      },
      jumlahGigiDibuatFs: {
        $sum: '$merged.baruJumlahGigiKekalDibuatFS',
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
      inlayOnlayBaru: {
        $sum: '$merged.baruInlayOnlayJumlahTampalanDibuat',
      },
      inlayOnlaySemula: {
        $sum: '$merged.semulaInlayOnlayJumlahTampalanDibuat',
      },
      tampalanSementara: {
        $sum: '$merged.jumlahTampalanSementaraJumlahTampalanDibuat',
      },
      cabutanGd: {
        $sum: '$merged.cabutDesidus',
      },
      cabutanGk: {
        $sum: '$merged.cabutKekal',
      },
      komplikasiSelepasCabutan: {
        $sum: '$merged.komplikasiSelepasCabutan',
      },
      penskaleran: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$merged.penskaleran', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      rawatanPerioLain: {
        $sum: '$merged.rawatanLainPeriodontik',
      },
      rawatanEndoAnterior: {
        $sum: '$merged.jumlahAnteriorKesEndodontikSelesai',
      },
      rawatanEndoPremolar: {
        $sum: '$merged.jumlahPremolarKesEndodontikSelesai',
      },
      rawatanEndoMolar: {
        $sum: '$merged.jumlahMolarKesEndodontikSelesai',
      },
      rawatanOrtho: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$merged.rawatanOrtodontik', true],
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
                  $eq: ['$merged.kesPerubatanMulut', true],
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
                  $eq: ['$merged.yaTidakAbsesPembedahan', true],
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
                  $eq: ['$merged.kecederaanTulangMukaUmum', true],
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
                  $eq: ['$merged.kecederaanGigiUmum', true],
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
                  $eq: ['$merged.kecederaanTisuLembutUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      cabutanSurgical: {
        $sum: '$merged.cabutanSurgikalPembedahanMulut',
      },
      pembedahanKecilMulut: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$merged.yaTidakPembedahanKecilMulutPembedahan',
                'ya-pembedahan-kecil-mulut-pembedahan',
              ],
            },
            1,
            0,
          ],
        },
      },
      crownBridgeBaru: {
        $sum: '$merged.baruJumlahCrownBridge',
      },
      crownBridgeSemula: {
        $sum: '$merged.semulaJumlahCrownBridge',
      },
      postCoreBaru: {
        $sum: '$merged.baruJumlahPostCore',
      },
      postCoreSemula: {
        $sum: '$merged.semulaJumlahPostCore',
      },
      prosthodontikPenuhDenturBaru: {
        $sum: '$merged.baruPenuhJumlahDenturProstodontik',
      },
      prosthodontikPenuhDenturSemula: {
        $sum: '$merged.semulaPenuhJumlahDenturProstodontik',
      },
      jumlahPesakitBuatDenturPenuh: {
        $sum: {
          $add: [
            '$merged.baruPenuhJumlahDenturProstodontik',
            '$merged.semulaPenuhJumlahDenturProstodontik',
          ],
        },
      },
      prosthodontikSeparaDenturBaru: {
        $sum: '$merged.baruSeparaJumlahDenturProstodontik',
      },
      prosthodontikSeparaDenturSemula: {
        $sum: '$merged.semulaSeparaJumlahDenturProstodontik',
      },
      jumlahPesakitBuatDenturSepara: {
        $sum: {
          $add: [
            '$merged.baruSeparaJumlahDenturProstodontik',
            '$merged.semulaSeparaJumlahDenturProstodontik',
          ],
        },
      },
      immediateDenture: {
        $sum: '$merged.immediateDenturProstodontik',
      },
      pembaikanDenture: {
        $sum: '$merged.pembaikanDenturProstodontik',
      },
      kesSelesai: {
        $sum: {
          $cond: [
            {
              $eq: ['$merged.kesSelesai', true],
            },
            1,
            0,
          ],
        },
      },
      xrayDiambil: {
        $sum: '$merged.bilanganXrayYangDiambil',
      },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: [
                '$merged.disaringProgramKanserMulut',
                'ya-disaring-program-kanser-mulut',
              ],
            },
            1,
            0,
          ],
        },
      },
    },
  };

  let match_stage_operatorLain = [];

  const match_operatorLain_below1year = {
    $match: {
      ...getParams207(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_1to4years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 1, $lte: 4 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_5to6years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 5, $lte: 6 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_7to9years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 7, $lte: 9 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_10to12years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 10, $lte: 12 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_13to14years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 13, $lte: 14 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_15to17years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 15, $lte: 17 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_18to19years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 18, $lte: 19 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_20to29years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 20, $lte: 29 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_30to49years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 30, $lte: 49 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_50to59years = {
    $match: {
      ...getParams207(payload),
      umur: { $gte: 50, $lte: 59 },
      rawatanDibuatOperatorLain: true,
    },
  };
  const match_operatorLain_60yearsandup = {
    $match: {
      ...getParams207(payload),
      rawatanDibuatOperatorLain: true,
      umur: { $gte: 60 },
    },
  };
  const match_operatorLain_ibumengandung = {
    $match: {
      ...getParams207(payload),
      rawatanDibuatOperatorLain: true,
      umur: { $gte: 7 },
      ibuMengandung: true,
    },
  };
  const match_operatorLain_oku = {
    $match: {
      ...getParams207(payload),
      rawatanDibuatOperatorLain: true,
      orangKurangUpaya: true,
    },
  };
  const match_operatorLain_bukanWarganegara = {
    $match: {
      ...getParams207(payload),
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
    let dataSekolah = [];
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

    for (let i = 0; i < match_stage_sekolah.length; i++) {
      const pipeline = [
        ...pipeline_sekolah,
        match_stage_sekolah[i],
        group_sekolah,
      ];
      const querySekolah = await Sekolah.aggregate(pipeline);
      dataSekolah.push({ querySekolah });
    }

    if (!payload.pilihanIndividu) {
      for (let i = 0; i < match_stage_operatorLain.length; i++) {
        const pipeline = [
          match_stage_operatorLain[i],
          ...getParamsOperatorLain,
          ...hotfix207,
          group_operatorLain,
        ];
        const queryOperatorLain = await Umum.aggregate(pipeline);
        dataOperatorLain.push({ queryOperatorLain });
      }
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    bigData.push(dataSekolah);
    bigData.push(dataOperatorLain);

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw Error(error.message);
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
const countPGPR201Baru = async (payload) => {
  let match_stage = [];

  const age_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 13,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_30_49 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 49,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const age_60yearsandup = {
    $match: {
      umur: {
        $gte: 60,
      },
      ...getParamsPgpr201(payload),
    },
  };
  const ibumengandung = {
    $match: {
      ibuMengandung: true,
      ...getParamsPgpr201(payload),
    },
  };
  const oku = {
    $match: {
      orangKurangUpaya: true,
      ...getParamsPgpr201(payload),
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

  let data = [];

  try {
    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [match_stage[i], group_stage];
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
//Reten Sekolah (Lama)
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
                { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1] },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                { $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1] },
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
//Reten Sekolah (effective until Feb 2023)
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
        $sum: { $toDouble: '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma' },
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
                { $gt: ['$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs', 0] },
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
                { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1] },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                { $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1] },
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
//Reten Sekolah (effective starting on March 2023)
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
                { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1] },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                { $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1] },
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
//PGS203 yang focus pada taska and tadika - dengan harapan nanty campur dengan PGS203 Sek
//utk taska and tadika - data umum sahaja ; belum masuk sekolah lagi
const countPGS203 = async (payload) => {
  let match_stage = [];
  //
  const pra_tad_kerajaan = [
    {
      $match: {
        ...getParamsPGS203(payload),
        // umur: { $lt: 7 },
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
        // umur: { $lt: 7 },
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
        // umur: { $lt: 7 },
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
        kodTastad: { $regex: /tad/i },
      },
    },
  ];
  const pra_tad_OA_penan = [
    {
      $match: {
        ...getParamsPGS203(payload),
        // umur: { $lt: 7 },
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
        kumpulanEtnik: 'penan',
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
  const group_stage = [
    {
      $group: {
        _id: placeModifier(payload),
        jumlahReten: { $sum: 1 },
        jumlahRetenSalah: {
          $sum: { $cond: [{ $eq: ['$statusReten', 'reten salah'] }, 1, 0] },
        },
        //enrolment - dpt dari fasiliti?
        //kedatangan
        kedatanganTahunSemasaBaru: {
          $sum: { $cond: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }, 1, 0] },
        },
        kedatanganTahunSemasaUlangan: {
          $sum: {
            $cond: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }, 1, 0],
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
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'] },
              1,
              0,
            ],
          },
        },
        skorGIS1: {
          $sum: {
            $cond: [
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '1'] },
              1,
              0,
            ],
          },
        },
        skorGIS2: {
          $sum: {
            $cond: [
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'] },
              1,
              0,
            ],
          },
        },
        skorGIS3: {
          $sum: {
            $cond: [
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '3'] },
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
        perluJumlahGigiFS: { $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum' },
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
        jumlahGigiDibuatFs: { $sum: '$baruJumlahGigiKekalDibuatFSRawatanUmum' },
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
        jumlahFasilitiDilawati: { $addToSet: '$kodFasilitiTaskaTadika' },
      },
    },
  ];

  // bismillah
  let bigData = [];

  try {
    for (const stage of match_stage) {
      const dataPGS203 = await Umum.aggregate([...stage, ...group_stage]);
      bigData.push(dataPGS203);
    }

    const dataFasiliti = await Fasiliti.find({
      ...(payload.negeri != 'all' && { createdByNegeri: payload.negeri }),
      ...(payload.daerah != 'all' && { createdByDaerah: payload.daerah }),
      ...(payload.klinik != 'all' && {
        createdByKodFasiliti: payload.klinik,
      }),
      jenisFasiliti: { $in: ['taska', 'tadika'] },
    })
      .select('govKe enrolmenTastad jenisFasiliti')
      .lean();

    let totalEnrolment = dataFasiliti.reduce((totals, fasiliti) => {
      if (
        fasiliti.jenisFasiliti === 'tadika' ||
        fasiliti.jenisFasiliti === 'taska'
      ) {
        const govKe = !fasiliti.govKe ? 'tiadaStatus' : fasiliti.govKe;
        if (
          fasiliti.enrolmenTastad !== 'NOT APPLICABLE' ||
          !fasiliti.enrolmenTastad
        ) {
          const enrolment = parseInt(fasiliti.enrolmenTastad) ?? 0;
          totals[govKe] = (totals[govKe] ?? 0) + enrolment;
        }
      }
      return totals;
    }, {});

    totalEnrolment = { ...totalEnrolment, jumlahFasiliti: dataFasiliti.length };

    bigData[0][0] = { ...bigData[0][0], ...totalEnrolment };

    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};
//PGS yang ada campur sekolah - untuk dimasukkan ke PGS203
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
                { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1] },
                { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                { $gte: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 1] },
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
//Reten Sekolah (Kekal sampai diberitahu kelak)
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                    { $eq: ['$kaum', 'LAIN-LAIN ASIA/BUKAN WARGANEGARA'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-semasa'] },
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
                    { $eq: ['$kaum', 'LAIN-LAIN ASIA/BUKAN WARGANEGARA'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'bekas-perokok'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'bekas-perokok'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-pasif'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'perokok-pasif'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'bukan-perokok'] },
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
                { $eq: ['$pemeriksaanSekolah.statusM', 'bukan-perokok'] },
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
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO2k = {
    $match: {
      kodProgram: { $in: ['PRO2001', 'PRO2002', 'PRO2003'] },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO3k = {
    $match: {
      kodProgram: {
        $in: ['PRO3001', 'PRO3002', 'PRO3003', 'PRO3004', 'PRO3005'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO4k = {
    $match: {
      kodProgram: { $in: ['PRO4001'] },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO5k1 = {
    $match: {
      kodProgram: {
        $in: ['PRO5001'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO5k2 = {
    $match: {
      kodProgram: {
        $in: ['PRO5002'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO5k3 = {
    $match: {
      kodProgram: {
        $in: ['PRO5003'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO5k4 = {
    $match: {
      kodProgram: {
        $in: ['PRO5004'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO5k5 = {
    $match: {
      kodProgram: {
        $in: ['PRO5005'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO6k1 = {
    $match: {
      kodProgram: {
        $in: ['PRO6001'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO6k2 = {
    $match: {
      kodProgram: {
        $in: ['PRO6002'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO6k3 = {
    $match: {
      kodProgram: {
        $in: ['PRO6003'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO6k4 = {
    $match: {
      kodProgram: {
        $in: ['PRO6004'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO6k5 = {
    $match: {
      kodProgram: {
        $in: ['PRO6005'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO6k6 = {
    $match: {
      kodProgram: {
        $in: ['PRO6006'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO6k7 = {
    $match: {
      kodProgram: {
        $in: ['PRO6007'],
      },
      ...getParamsPgPro(payload),
    },
  };
  const kodePRO7k = {
    $match: {
      kodProgram: { $in: ['PRO7001', 'PRO7002', 'PRO7003'] },
      ...getParamsPgPro(payload),
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
      ...getParamsPgPro(payload),
    },
  };

  match_stage.push(kodePRO1k);
  match_stage.push(kodePRO2k);
  match_stage.push(kodePRO3k);
  match_stage.push(kodePRO4k);
  match_stage.push(kodePRO5k1);
  match_stage.push(kodePRO5k2);
  match_stage.push(kodePRO5k3);
  match_stage.push(kodePRO5k4);
  match_stage.push(kodePRO5k5);
  match_stage.push(kodePRO6k1);
  match_stage.push(kodePRO6k2);
  match_stage.push(kodePRO6k3);
  match_stage.push(kodePRO6k4);
  match_stage.push(kodePRO6k5);
  match_stage.push(kodePRO6k6);
  match_stage.push(kodePRO6k7);
  match_stage.push(kodePRO7k);
  match_stage.push(kodePRO8k);

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
      const pipeline = [match_stage[i], group_stage];
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
const countMasa = async (payload) => {
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
      ...getParamsPiagamMasa(payload),
    },
  };
  const opFebruari = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-02-01`,
        $lte: `${new Date().getFullYear()}-02-28`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opMac = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-03-01`,
        $lte: `${new Date().getFullYear()}-03-31`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opApril = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-04-01`,
        $lte: `${new Date().getFullYear()}-04-30`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opMei = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-05-01`,
        $lte: `${new Date().getFullYear()}-05-31`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opJun = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-06-01`,
        $lte: `${new Date().getFullYear()}-06-30`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opJulai = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-07-01`,
        $lte: `${new Date().getFullYear()}-07-31`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opOgos = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-08-01`,
        $lte: `${new Date().getFullYear()}-08-31`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opSeptember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-09-01`,
        $lte: `${new Date().getFullYear()}-09-30`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opOktober = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-10-01`,
        $lte: `${new Date().getFullYear()}-10-31`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opNovember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-11-01`,
        $lte: `${new Date().getFullYear()}-11-30`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };
  const opDisember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-12-01`,
        $lte: `${new Date().getFullYear()}-12-31`,
      },
      temujanji: false,
      ...getParamsPiagamMasa(payload),
    },
  };

  match_stage_op.push(opJanuari);
  match_stage_op.push(opFebruari);
  match_stage_op.push(opMac);
  match_stage_op.push(opApril);
  match_stage_op.push(opMei);
  match_stage_op.push(opJun);
  match_stage_op.push(opJulai);
  match_stage_op.push(opOgos);
  match_stage_op.push(opSeptember);
  match_stage_op.push(opOktober);
  match_stage_op.push(opNovember);
  match_stage_op.push(opDisember);

  const temujanjiJanuari = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-01-01`,
        $lte: `${new Date().getFullYear()}-01-31`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiFebruari = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-02-01`,
        $lte: `${new Date().getFullYear()}-02-28`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiMac = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-03-01`,
        $lte: `${new Date().getFullYear()}-03-31`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiApril = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-04-01`,
        $lte: `${new Date().getFullYear()}-04-30`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiMei = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-05-01`,
        $lte: `${new Date().getFullYear()}-05-31`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiJun = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-06-01`,
        $lte: `${new Date().getFullYear()}-06-30`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiJulai = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-07-01`,
        $lte: `${new Date().getFullYear()}-07-31`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiOgos = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-08-01`,
        $lte: `${new Date().getFullYear()}-08-31`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiSeptember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-09-01`,
        $lte: `${new Date().getFullYear()}-09-30`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiOktober = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-10-01`,
        $lte: `${new Date().getFullYear()}-10-31`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiNovember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-11-01`,
        $lte: `${new Date().getFullYear()}-11-30`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };
  const temujanjiDisember = {
    $match: {
      tarikhKedatangan: {
        $gte: `${new Date().getFullYear()}-12-01`,
        $lte: `${new Date().getFullYear()}-12-31`,
      },
      temujanji: true,
      ...getParamsPiagamMasa(payload),
    },
  };

  match_stage_temujanji.push(temujanjiJanuari);
  match_stage_temujanji.push(temujanjiFebruari);
  match_stage_temujanji.push(temujanjiMac);
  match_stage_temujanji.push(temujanjiApril);
  match_stage_temujanji.push(temujanjiMei);
  match_stage_temujanji.push(temujanjiJun);
  match_stage_temujanji.push(temujanjiJulai);
  match_stage_temujanji.push(temujanjiOgos);
  match_stage_temujanji.push(temujanjiSeptember);
  match_stage_temujanji.push(temujanjiOktober);
  match_stage_temujanji.push(temujanjiNovember);
  match_stage_temujanji.push(temujanjiDisember);

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
                { $subtract: ['$waktuDipanggilUnix', '$waktuSampaiUnix'] },
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
        match_stage_op[i],
        add_fields_stage,
        group_stage,
      ]);
      opData.push(dataOp);
    }

    for (let i = 0; i < match_stage_temujanji.length; i++) {
      const dataTemujanji = await Umum.aggregate([
        match_stage_temujanji[i],
        add_fields_stage,
        group_stage,
      ]);
      temujanjiData.push(dataTemujanji);
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
      melayu.push(dataMelayu);
    }
    for (let i = 0; i < match_stage_cina.length; i++) {
      const dataCina = await Umum.aggregate([match_stage_cina[i], group_stage]);
      cina.push(dataCina);
    }
    for (let i = 0; i < match_stage_india.length; i++) {
      const dataIndia = await Umum.aggregate([
        match_stage_india[i],
        group_stage,
      ]);
      india.push(dataIndia);
    }
    for (let i = 0; i < match_stage_bumiputeraSabah.length; i++) {
      const dataBumiputeraSabah = await Umum.aggregate([
        match_stage_bumiputeraSabah[i],
        group_stage,
      ]);
      bumiputeraSabah.push(dataBumiputeraSabah);
    }
    for (let i = 0; i < match_stage_bumiputeraSarawak.length; i++) {
      const dataBumiputeraSarawak = await Umum.aggregate([
        match_stage_bumiputeraSarawak[i],
        group_stage,
      ]);
      bumiputeraSarawak.push(dataBumiputeraSarawak);
    }
    for (let i = 0; i < match_stage_orangAsliSemenanjung.length; i++) {
      const dataOrangAsliSemenanjung = await Umum.aggregate([
        match_stage_orangAsliSemenanjung[i],
        group_stage,
      ]);
      orangAsliSemenanjung.push(dataOrangAsliSemenanjung);
    }
    for (let i = 0; i < match_stage_lain.length; i++) {
      const dataLain = await Umum.aggregate([match_stage_lain[i], group_stage]);
      lain2.push(dataLain);
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
const countGender = async (payload) => {
  //
  let match_stage_lelaki = [];
  let match_stage_perempuan = [];
  //
  const pesakitLelakiPrimer1859 = {
    $match: {
      jenisFasiliti: { $in: ['kp', 'kk-kd'] },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanPrimer1859 = {
    $match: {
      jenisFasiliti: { $in: ['kp', 'kk-kd'] },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiPakar1859 = {
    $match: {
      jenisFasiliti: { $eq: 'kepakaran' },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanPakar1859 = {
    $match: {
      jenisFasiliti: { $in: ['kepakaran'] },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiOutreach1859 = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: 'projek-komuniti-lain',
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanOutreach1859 = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: 'projek-komuniti-lain',
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiUtc1859 = {
    $match: {
      createdByKp: { $regex: /utc/i },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanUtc1859 = {
    $match: {
      createdByKp: { $regex: /utc/i },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiPrimer60above = {
    $match: {
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanPrimer60above = {
    $match: {
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiPakar60above = {
    $match: {
      jenisFasiliti: { $in: ['kepakaran'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanPakar60above = {
    $match: {
      jenisFasiliti: { $in: ['kepakaran'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiOutreach60above = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: { $nin: ['kp', 'kk-kd', 'taska-tadika'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanOutreach60above = {
    $match: {
      createdByKp: { $regex: /^((?!utc).)*$/i },
      jenisFasiliti: { $nin: ['kp', 'kk-kd', 'taska-tadika'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiUtc60above = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanUtc60above = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      jenisFasiliti: { $in: ['kp'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  match_stage_lelaki.push(pesakitLelakiPrimer1859);
  match_stage_lelaki.push(pesakitLelakiPakar1859);
  match_stage_lelaki.push(pesakitLelakiOutreach1859);
  match_stage_lelaki.push(pesakitLelakiUtc1859);

  match_stage_lelaki.push(pesakitLelakiPrimer60above);
  match_stage_lelaki.push(pesakitLelakiPakar60above);
  match_stage_lelaki.push(pesakitLelakiOutreach60above);
  match_stage_lelaki.push(pesakitLelakiUtc60above);

  match_stage_perempuan.push(pesakitPerempuanPrimer1859);
  match_stage_perempuan.push(pesakitPerempuanPakar1859);
  match_stage_perempuan.push(pesakitPerempuanOutreach1859);
  match_stage_perempuan.push(pesakitPerempuanUtc1859);

  match_stage_perempuan.push(pesakitPerempuanPrimer60above);
  match_stage_perempuan.push(pesakitPerempuanPakar60above);
  match_stage_perempuan.push(pesakitPerempuanOutreach60above);
  match_stage_perempuan.push(pesakitPerempuanUtc60above);
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
      const result = await Umum.aggregate([match_stage_lelaki[i], group_stage]);
      dataLelaki.push(result[0]);
    }

    for (let i = 0; i < match_stage_perempuan.length; i++) {
      const result = await Umum.aggregate([
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
const countBPE = async (payload) => {
  //
  let match_stage = [];
  //
  const bKurang18 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gt: 14, $lt: 18 },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bUmur1819 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 18, $lte: 19 },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bUmur2029 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 20, $lte: 29 },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bUmur3049 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 30, $lte: 49 },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bUmur5059 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 50, $lte: 59 },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };
  const bUmur60keatas = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 60 },
      kedatangan: { $eq: 'baru-kedatangan' },
    },
  };

  const uKurang18 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $lt: 18 },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uUmur1819 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 18, $lte: 19 },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uUmur2029 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 20, $lte: 29 },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uUmur3049 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 30, $lte: 49 },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uUmur5059 = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 50, $lte: 59 },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };
  const uUmur60keatas = {
    $match: {
      ...getParamsBPE(payload),
      umur: { $gte: 60 },
      kedatangan: { $eq: 'ulangan-kedatangan' },
    },
  };

  match_stage.push(bKurang18);
  match_stage.push(uKurang18);

  match_stage.push(bUmur1819);
  match_stage.push(uUmur1819);

  match_stage.push(bUmur2029);
  match_stage.push(uUmur2029);

  match_stage.push(bUmur3049);
  match_stage.push(uUmur3049);

  match_stage.push(bUmur5059);
  match_stage.push(uUmur5059);

  match_stage.push(bUmur60keatas);
  match_stage.push(uUmur60keatas);
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
                { $eq: ['$kedatangan', 'baru-kedatangan'] },
                { $eq: ['$skorBpeOralHygienePemeriksaanUmum', 'tiada'] },
                { $eq: ['$engganBpeImplan', false] },
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
                { $eq: ['$skorBpeOralHygienePemeriksaanUmum', 'tiada'] },
              ],
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
        $sum: { $cond: [{ $eq: ['$puncaRujukan', 'lain-lain'] }, 1, 0] },
      },
      tiadaRujukanT2DM: {
        $sum: {
          $cond: [{ $eq: ['$puncaRujukan', 'tiada'] }, 1, 0],
        },
      },
      //Risiko Perio - Perio Risk
      risikoBpeDiabetes: {
        // $sum: { $cond: [{ $eq: ['$diabetesFaktorRisikoBpe', true] }, 1, 0] },
        $sum: { $cond: [{ $eq: ['$puncaRujukan', 'klinik-kesihatan'] }, 1, 0] },
      },
      risikoBpePerokok: {
        $sum: { $cond: [{ $eq: ['$perokokFaktorRisikoBpe', true] }, 1, 0] },
      },
      risikoBpeLainLain: {
        $sum: { $cond: [{ $eq: ['$lainLainFaktorRisikoBpe', true] }, 1, 0] },
      },
      //Basic Periodontal Examination (BPE)
      engganBPE: {
        $sum: { $cond: [{ $eq: ['$engganBpeImplan', true] }, 1, 0] },
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
        $sum: { $cond: [{ $eq: ['$periImplantMucositis', true] }, 1, 0] },
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
        $sum: { $cond: [{ $eq: ['$nasihatBerhentiMerokok', true] }, 1, 0] },
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
                { $eq: ['plakGigiNasihatPergigianIndividuPromosiUmum', true] },
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
        $sum: { $cond: [{ $eq: ['$pengilapanTampalanRungkup', true] }, 1, 0] },
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
      const pipeline = [match_stage[i], group_stage];
      const dataBPE = await Umum.aggregate(pipeline);
      bigData.push(dataBPE);
    }
    return bigData;
  } catch (error) {
    errorRetenLogger.error(
      `Error mengira reten: ${payload.jenisReten}. ${error}`
    );
    throw new Error(error);
  }
};

// new lagi
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
const countPG201P2 = async (payload) => {
  let match_stage = [];
  //
  const pra_tad_Lima_Tahun = [
    //ada masalah nak tahu patient tu tahun semasa / darjah mana
    {
      $match: {
        ...getParamsPG201P2(payload),
        // umur: { $eq: 5 },
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
        deleted: false,
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
    //ada masalah nak tahu patient tu tahun semasa / darjah mana
    {
      $match: {
        ...getParamsPG201P2(payload),
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
        deleted: false,
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
        ...getParamsPG201P2(payload),
        // umur: { $gte: 5, $lt: 7 },
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
        orangKurangUpaya: true,
        deleted: false,
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
        ...getParamsPG201P2(payload),
        // umur: { $gte: 5, $lt: 7 },
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
        kumpulanEtnik: { $in: ['penan', 'orang asli semenanjung'] },
        deleted: false,
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
          $sum: { $cond: [{ $eq: ['$statusReten', 'reten salah'] }, 1, 0] },
        },

        //enrolment - dpt dari fasiliti?

        //kedatangan
        engganKedatangan: {
          $sum: {
            $cond: [
              { $eq: ['$engganTaskaTadika', 'enggan-taska-tadika'] },
              1,
              0,
            ],
          },
        },
        tidakHadirKehadiran: {
          $sum: {
            $cond: [
              { $eq: ['$tidakHadirTaskaTadika', 'tidak-hadir-taska-tadika'] },
              1,
              0,
            ],
          },
        },
        kedatanganTahunSemasaBaru: {
          $sum: { $cond: [{ $eq: ['$kedatangan', 'baru-kedatangan'] }, 1, 0] },
        },
        kedatanganTahunSemasaUlangan: {
          $sum: {
            $cond: [{ $eq: ['$kedatangan', 'ulangan-kedatangan'] }, 1, 0],
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
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'] },
              1,
              0,
            ],
          },
        },
        skorGIS1: {
          $sum: {
            $cond: [
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '1'] },
              1,
              0,
            ],
          },
        },
        skorGIS2: {
          $sum: {
            $cond: [
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'] },
              1,
              0,
            ],
          },
        },
        skorGIS3: {
          $sum: {
            $cond: [
              { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '3'] },
              1,
              0,
            ],
          },
        },
        // skorBPE0: {
        //   $sum: {
        //     $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '0'] }, 1, 0],
        //   },
        // },
        // skorBPE1: {
        //   $sum: {
        //     $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '1'] }, 1, 0],
        //   },
        // },
        // skorBPE2: {
        //   $sum: {
        //     $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '2'] }, 1, 0],
        //   },
        // },
        // skorBPE3: {
        //   $sum: {
        //     $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '3'] }, 1, 0],
        //   },
        // },
        // skorBPE4: {
        //   $sum: {
        //     $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', '4'] }, 1, 0],
        //   },
        // },
        jumlahTPRmmi: {
          //TPR MMI sama dgn TPR ICDAS
          // d/D = 0 ; x/X = 0 ; GIS = 0 / 2 ; BPE = 0 ; tidak perlu scaling ; E10 = 0 ; E12 = 0 ; E13 = 0
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: [
                      '$tidakPerluRawatanPemeriksaanUmum',
                      'tidak-perlu-rawatan-pemeriksaan-umum',
                    ],
                  },
                  {
                    $eq: [
                      '$fvPerluSapuanPemeriksaanUmum',
                      'tidak-fv-perlu-sapuan-pemeriksaan-umum',
                    ],
                  },
                  { $eq: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 0] },
                  { $eq: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        jumlahTPRbiasa: {
          //tarik dari TPR kotak
          $sum: {
            $cond: [
              {
                $eq: [
                  '$tidakPerluRawatanPemeriksaanUmum',
                  'tidak-perlu-rawatan-pemeriksaan-umum',
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
              { $eq: ['$toothSurfaceLossTraumaPemeriksaanUmum', true] },
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
        perluPrrJenis1BilMurid: {
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

        // jumlahGigiPerluTampalanAntGdBaru: {
        //     $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanAntGdSemula: {
        //     $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanAntGkBaru: {
        //     $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanAntGkSemula: {
        //     $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostGdBaru: {
        //     $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostGdSemula: {
        //     $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostGkBaru: {
        //     $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostGkSemula: {
        //     $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostAmgGdBaru: {
        //     $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostAmgGdSemula: {
        //     $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostAmgGkBaru: {
        //     $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        //   },
        //   jumlahGigiPerluTampalanPostAmgGkSemula: {
        //     $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
        //   },

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
      },
    },
  ];

  // bismillah
  let bigData = [];

  try {
    for (const stage of match_stage) {
      const dataPG201P2 = await Umum.aggregate([...stage, ...group_stage]);
      bigData.push(dataPG201P2);
    }

    const dataFasiliti = await Fasiliti.find({
      ...(payload.negeri != 'all' && { createdByNegeri: payload.negeri }),
      ...(payload.daerah != 'all' && { createdByDaerah: payload.daerah }),
      ...(payload.klinik != 'all' && {
        createdByKodFasiliti: payload.klinik,
      }),
      jenisFasiliti: { $in: ['taska', 'tadika'] },
    })
      .select('enrolmen5Tahun enrolmen6Tahun')
      .lean();

    let enrolmen5Tahun = 0;
    let enrolmen6Tahun = 0;

    dataFasiliti.forEach((fasiliti) => {
      if (enrolmen5Tahun !== 'NOT APPLICABLE') {
        enrolmen5Tahun += parseInt(fasiliti.enrolmen5Tahun);
      }
      if (enrolmen6Tahun !== 'NOT APPLICABLE') {
        enrolmen6Tahun += parseInt(fasiliti.enrolmen6Tahun);
      }
    });

    if (enrolmen5Tahun) {
      bigData[0][0].enrolmen5Tahun = enrolmen5Tahun;
    }
    if (enrolmen6Tahun) {
      bigData[0][0].enrolmen6Tahun = enrolmen6Tahun;
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
  // let { negeri, daerah } = payload;
  let negeri = 'Melaka';
  let daerah = 'Melaka Tengah';

  let all_kepp = [];
  let bigData = [];

  const kepps = await User.find({ statusRoleKlinik: 'kepp', negeri, daerah })
    .select('kodFasiliti')
    .lean();
  console.log(kepps);
  kepps.forEach(async (kepp) => {
    let data = {};
    data = { ...data, kp: kepp.kp, kodFasiliti: kepp.kodFasiliti };
    const pesakit = await Umum.aggregate([
      {
        $match: { createdByKodFasiliti: kepp.kodFasiliti },
      },
      {
        $group: {
          _id: '$createdByKodFasiliti',
          jumlahPesakit: { $sum: 1 },
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
    data = { ...data, ...pesakit[0] };
    bigData.push(data);
  });

  console.log(bigData);

  return bigData;
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
      },
    },
    {
      $project: {
        fasiliti_data: 0,
      },
    },
    {
      $match: {
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

  match_stage_baru.push(match_baru_taska);
  match_stage_baru.push(match_baru_tadika);
  match_stage_baru.push(match_baru_kkia);
  match_stage_baru.push(match_baru_op);
  match_stage_baru.push(match_baru_outreach);

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
                    $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '0'],
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
                    $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '1'],
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
                    $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', '2'],
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
                      { $eq: ['$perluPenskaleranPemeriksaanUmum', false] },
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
            // $cond: [
            // {
            //   $lte: [
            //     {
            $add: [
              '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            ],
            //     },
            //     3,
            //   ],
            // },
            // 1,
            // 0,
            // ],
          },
        },
        jumlahTampalanPosteriorBaru: {
          $sum: {
            // $cond: [
            //   {
            //     $lte: [
            //       {
            $add: [
              '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            ],
            //       },
            //       3,
            //     ],
            //   },
            //   1,
            //   0,
            // ],
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
      },
    },
    {
      $project: {
        fasiliti_data: 0,
      },
    },
    {
      $match: {
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

  match_stage_bu.push(match_bu_taska);
  match_stage_bu.push(match_bu_tadika);
  match_stage_bu.push(match_bu_kkia);
  match_stage_bu.push(match_bu_op);
  match_stage_bu.push(match_bu_outreach);

  const add_field_bu = [
    {
      $addFields: {
        jumlahFaktorRisiko: {
          $cond: {
            if: {
              $eq: [
                { $ifNull: ['$jumlahFaktorRisikoPemeriksaanUmum', ''] },
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
                  { $eq: ['$rujukDaripada', 'hospital/institusi-kerajaan'] },
                  { $eq: ['$rujukDaripada', 'swasta'] },
                  { $eq: ['$rujukDaripada', 'lain-lain'] },
                ],
              },
              1,
              0,
            ],
          },
        },
        craRendah: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lte: ['$jumlahFaktorRisiko', 2] },
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
                          { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                          { $eq: ['$adaKekalPemeriksaanUmum', false] },
                        ],
                      },
                      {
                        $or: [
                          { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                          { $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
                        ],
                      },
                      {
                        $gte: ['$jumlahFaktorRisiko', 3],
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
                          { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                          { $eq: ['$adaKekalPemeriksaanUmum', false] },
                        ],
                      },
                      {
                        $or: [
                          { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1] },
                          { $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 1] },
                        ],
                      },
                      {
                        $eq: ['$jumlahFaktorRisiko', 0],
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
                          { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                          { $eq: ['$adaKekalPemeriksaanUmum', false] },
                        ],
                      },
                      {
                        $or: [
                          { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1] },
                          { $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 1] },
                        ],
                      },
                      {
                        $and: [
                          {
                            $gte: ['$jumlahFaktorRisiko', 1],
                          },
                          {
                            $lte: ['$jumlahFaktorRisiko', 2],
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
                          { $eq: ['$adaDesidusPemeriksaanUmum', true] },
                          { $eq: ['$adaKekalPemeriksaanUmum', false] },
                        ],
                      },
                      {
                        $or: [
                          { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1] },
                          { $gte: ['$xAdaGigiDesidusPemeriksaanUmum', 1] },
                        ],
                      },
                      {
                        $gte: ['$jumlahFaktorRisiko', 3],
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

  try {
    let dataBaru = [];
    let dataBu = [];
    let data1836 = [];
    let bigData = [];

    // for (let i = 0; i < match_stage_baru.length; i++) {
    //   const pipeline_baru = [match_stage_baru[i], group_baru];
    //   const queryBaru = await Umum.aggregate(pipeline_baru);
    //   dataBaru.push({ queryBaru });
    // }
    for (const stage of match_stage_baru) {
      const queryBaru = await Umum.aggregate([...stage, ...group_baru]);
      dataBaru.push({ queryBaru });
    }

    // for (let i = 0; i < match_stage_bu.length; i++) {
    //   const pipeline_bu = [match_stage_bu[i], add_field_bu, group_bu];
    //   const queryBu = await Umum.aggregate(pipeline_bu);
    //   dataBu.push({ queryBu });
    // }
    for (const stage of match_stage_bu) {
      const queryBu = await Umum.aggregate([
        ...stage,
        ...add_field_bu,
        ...group_bu,
      ]);
      dataBu.push({ queryBu });
    }

    for (const stage of match_stage_1836) {
      const query1836 = await Umum.aggregate([...stage, ...group_1836]);
      data1836.push({ query1836 });
    }

    bigData.push(dataBaru);
    bigData.push(dataBu);
    bigData.push(data1836);

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

// helper function
const getParams101 = (payload, reten) => {
  const {
    negeri,
    daerah,
    klinik,
    pilihanFasiliti,
    pilihanKkia,
    pilihanProgram,
    pilihanKpbMpb,
  } = payload;

  const AorC = (reten) => {
    if (reten === 'A' || reten === undefined) {
      return { $eq: 'kp' };
    }
    if (reten === 'C') {
      return { $nin: ['kp', 'kk-kd', 'taska-tadika'] };
    }
  };

  const byKp = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      kodFasilitiKkKd: { $eq: pilihanKkia },
      createdByKodFasiliti: { $eq: klinik },
      jenisFasiliti: { $eq: 'kk-kd' },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByKodFasiliti: { $eq: klinik },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  const byDaerah = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'kk-kd' },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByDaerah: { $eq: daerah },
      // createdByNegeri: { $eq: negeri },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  const byNegeri = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'kk-kd' },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByNegeri: { $eq: negeri },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  const satuMalaysia = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kk-kd' },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
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
const getParams211 = (payload, reten) => {
  const { negeri, daerah, klinik } = payload;

  const AorC = (reten) => {
    if (reten === 'A' || reten === undefined) {
      return { $in: ['kp', 'kk-kd'] };
    }
    if (reten === 'C') {
      return { $nin: ['kp', 'kk-kd', 'taska-tadika'] };
    }
  };

  const byKp = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      jenisFasiliti: AorC(reten),
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      deleted: false,
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      createdByDaerah: { $eq: daerah },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
      deleted: false,
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
      deleted: false,
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
      deleted: false,
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
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
const getParams206 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^mdtb/i },
      tarikhKedatangan: dateModifier(payload),
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
      createdByMdcMdtb: { $regex: /^mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      createdByMdcMdtb: { $regex: /^mdtb/i },
      tarikhKedatangan: dateModifier(payload),
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
const getParams206sekolah = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
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
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
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
const getParams207 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i },
      tarikhKedatangan: dateModifier(payload),
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
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i },
      tarikhKedatangan: dateModifier(payload),
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
const getParams207sekolah = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
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
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };
  const satuMalaysia = () => {
    let param = {
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
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
const getParamsPgpr201 = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const byKp = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      createdByDaerah: { $eq: daerah },
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
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
const getParamsPgPro = (payload) => {
  const { pilihanIndividu, klinik, daerah, negeri } = payload;

  const byIndividu = () => {
    let param = {
      tarikhMula: dateModifier(payload),
      promosiIndividu: true,
      createdByMdcMdtb: pilihanIndividu,
      deleted: false,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      createdByKodFasiliti: klinik,
      deleted: false,
    };
    return param;
  };

  const byDaerah = () => {
    return {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      deleted: false,
    };
  };

  const byNegeri = () => {
    return {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      createdByNegeri: negeri,
      deleted: false,
    };
  };

  const satuMalaysia = () => {
    return {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      deleted: false,
    };
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }
  if (pilihanIndividu) {
    return byIndividu();
  }
  if (daerah !== 'all' && klinik !== 'all') {
    return byKp();
  }
  if (daerah !== 'all' && klinik === 'all') {
    return byDaerah();
  }
  if (daerah === 'all' && klinik === 'all') {
    return byNegeri();
  }
};
const getParamsGender = (payload) => {
  const { klinik, daerah, negeri } = payload;

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
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
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }

  if (klinik !== 'all') {
    return byKp();
  } else if (daerah !== 'all') {
    return byDaerah();
  } else {
    return byNegeri();
  }
};
const getParamsPiagamMasa = (payload, jenis) => {
  const { klinik, daerah, negeri } = payload;
  //
  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }

  if (klinik !== 'all') {
    return byKp();
  } else if (daerah !== 'all') {
    return byDaerah();
  } else {
    return byNegeri();
  }
};
const getParamsBp = (payload, kaum, jantina) => {
  const { klinik, daerah, negeri } = payload;
  //
  let theSex = jantina === 'l' ? 'lelaki' : 'perempuan';
  let pilihanKaum;

  switch (kaum) {
    case 'melayu':
      pilihanKaum = { $eq: 'melayu' };
      break;
    case 'cina':
      pilihanKaum = { $eq: 'cina' };
      break;
    case 'india':
      pilihanKaum = { $eq: 'india' };
      break;
    case 'bumiputeraSabah':
      pilihanKaum = {
        $in: ['bajau', 'dusun', 'kadazan', 'murut', 'bumiputera sabah lain'],
      };
      break;
    case 'bumiputeraSarawak':
      pilihanKaum = {
        $in: [
          'melanau',
          'kedayan',
          'iban',
          'bidayuh',
          'penan',
          'bumiputera sarawak lain',
        ],
      };
      break;
    case 'oas':
      pilihanKaum = { $eq: 'orang asli semenanjung' };
      break;
    case 'lain-lain':
      pilihanKaum = { $eq: 'lain-lain' };
      break;
    default:
      console.log(`bp nope ${kaum}`);
      break;
  }

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: 'telah diisi',
    };
    return param;
  };
  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }

  if (klinik !== 'all') {
    return byKp();
  } else if (daerah !== 'all') {
    return byDaerah();
  } else {
    return byNegeri();
  }
};
const getParamsBPE = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia();
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
const getParamsPGS203 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'taska-tadika' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      jenisFasiliti: { $eq: 'taska-tadika' },
      tarikhKedatangan: dateModifier(payload),
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
      jenisFasiliti: { $eq: 'taska-tadika' },
      tarikhKedatangan: dateModifier(payload),
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
      jenisFasiliti: { $eq: 'taska-tadika' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

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
const getParamsPG201P2 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      // createdByMdcMdtb: { $regex: /mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      // createdByMdcMdtb: { $regex: /mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      // createdByMdcMdtb: { $regex: /mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
    };
    return param;
  };

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
const getParamsTOD = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
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
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
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
  countPG101A,
  countPG101C,
  countPG211A,
  countPG211C,
  countPG214,
  countPG206,
  countPG207,
  countPG201,
  countPG201P2,
  countSMKPG201,
  countPG201A,
  countPG201PindSatu2022,
  countPGS203,
  countPGS203Sek,
  countPGPR201Lama,
  countPGPR201Baru,
  countPG307,
  countPPIM03,
  countAdHocQuery,
  countPGPro01,
  countPGPro02,
  countPGPro01Combined,
  countGender,
  countMasa,
  countBp,
  countBPE,
  countKEPP,
  countTOD,
};

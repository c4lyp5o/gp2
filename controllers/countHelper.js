const async = require('async');
const moment = require('moment');
const Umum = require('../models/Umum');
const Sekolah = require('../models/Sekolah');
const Pemeriksaan = require('../models/Pemeriksaansekolah');
const Rawatan = require('../models/Rawatansekolah');
const Kotak = require('../models/Kotaksekolah');
const Promosi = require('../models/Promosi');

//Reten Kaunter
const countPG101A = async (payload) => {
  let match_stage = [];
  let project_stage = [];
  let sort_stage = [];

  let match = { $match: getParams(payload, 'A') };

  const project = {
    $project: {
      _id: 0,
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
      kategoriPesakit: '$kategoriPesakit',
      statusPesara: '$statusPesara',
      kumpulanEtnik: '$kumpulanEtnik',
      rujukDaripada: '$rujukDaripada',
      noBayaran: 1,
      noResit: 1,
      noBayaran2: 1,
      noResit2: 1,
      noBayaran3: 1,
      noResit3: 1,
      catatan: '$catatan',
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
const countPG101C = async (payload) => {
  let match_stage = [];
  let project_stage = [];
  let sort_stage = [];

  let match = { $match: getParams(payload, 'C') };

  const project = {
    $project: {
      _id: 0,
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
      kategoriPesakit: '$kategoriPesakit',
      statusPesara: '$statusPesara',
      kumpulanEtnik: '$kumpulanEtnik',
      rujukDaripada: '$rujukDaripada',
      catatan: '$catatan',
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
      ...getParams2(payload, 'A'),
    },
  };
  const bage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const bage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'A'),
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
      ...getParams2(payload, 'A'),
    },
  };
  const uage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
    },
  };
  const uage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'A'),
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
      count: { $sum: 1 },
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

  for (let i = 0; i < match_stage.length; i++) {
    const pipeline = [match_stage[i], group_stage];
    const query = await Umum.aggregate(pipeline);
    data.push(query);
  }

  return data;
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
      ...getParams2(payload, 'C'),
    },
  };
  const bage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const bage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload, 'C'),
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
      ...getParams2(payload, 'C'),
    },
  };
  const uage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
    },
  };
  const uage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      ...getParams2(payload, 'C'),
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
      count: { $sum: 1 },
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

  for (let i = 0; i < match_stage.length; i++) {
    const pipeline = [match_stage[i], group_stage(payload)];
    const query = await Umum.aggregate(pipeline);
    data.push(query);
  }

  return data;
};
const countPG214 = async (payload) => {
  let match_stage = [];

  const age_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };

  match_stage.push(age_60);
  match_stage.push(age_61_64);
  match_stage.push(age_65);
  match_stage.push(age_66_69);
  match_stage.push(age_70_74);
  match_stage.push(age_lebih_75);

  let group_stage = {
    $group: {
      _id: placeModifier(payload),
      count: { $sum: 1 },
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
              $and: [
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
      skorGISZero: {
        $sum: {
          $cond: [
            { $eq: ['$skorGisMulutOralHygienePemeriksaanUmum', 0] },
            1,
            0,
          ],
        },
      },
      skorGISMoreThanZero: {
        $sum: {
          $cond: [
            {
              $and: [{ $gt: ['$skorGisMulutOralHygienePemeriksaanUmum', 0] }],
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
          $cond: [{ $eq: ['$prrJenis1PemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [{ $eq: ['$fissureSealantPemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluJumlahGigiFS: { $sum: '$baruJumlahGigiKekalPerluFSRawatanUmum' },
      perluPenskaleran: {
        $sum: {
          $cond: [{ $eq: ['$perluPenskaleranPemeriksaanUmum', true] }, 1, 0],
        },
      },
    },
  };

  const project_pemeriksaan = {
    $project: {
      _id: 1,
      // pemeriksaan
      kedatanganTahunSemasaBaru: '$kedatanganTahunSemasaBaru',
      jumlahd: '$jumlahd',
      jumlahf: '$jumlahf',
      jumlahx: '$jumlahx',
      jumlahdfx: '$jumlahdfx',
      jumlahD: '$jumlahD',
      jumlahF: '$jumlahF',
      jumlahM: '$jumlahM',
      jumlahX: '$jumlahX',
      jumlahDMFX: '$jumlahDMFX',
      jumlahMBK: '$jumlahMBK',
      statusBebasKaries: '$statusBebasKaries',
      TPR: '$TPR',
      skorGISZero: '$skorGISZero',
      skorGISMoreThanZero: '$skorGISMoreThanZero',
      perluSapuanFluorida: '$perluSapuanFluorida',
      perluJumlahPesakitPrrJenis1: '$perluJumlahPesakitPrrJenis1',
      perluJumlahGigiPrrJenis1: '$perluJumlahGigiPrrJenis1',
      perluJumlahPesakitFS: '$perluJumlahPesakitFS',
      perluJumlahGigiFS: '$perluJumlahGigiFS',
      perluPenskaleran: '$perluPenskaleran',
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
                  $eq: ['$pesakitDibuatPRRJenis1', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        //prrJ1MuridB
        // $cond: [
        //   {
        //     $and: [
        //       {
        //         $eq: ['$kedatangan', 'baru-kedatangan'],
        //       },
        //       {
        //         $or: [
        //           {
        //             $gt: [
        //               '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
        //               0,
        //             ],
        //           },
        //           {
        //             $gt: [
        //               '$semulaJumlahGigiKekalDiberiPrrJenis1RawatanUmum',
        //               0,
        //             ],
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   1,
        //   0,
        // ],
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: { $sum: '$pesakitDibuatFissureSealant' },
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

  const project = {
    $project: {
      _id: 1,
      kedatanganTahunSemasaUlangan: '$kedatanganTahunSemasaUlangan',
      // rawatan
      sapuanFluorida: '$sapuanFluorida',
      jumlahPesakitPrrJenis1: '$jumlahPesakitPrrJenis1',
      jumlahGigiPrrJenis1: '$jumlahGigiPrrJenis1',
      jumlahPesakitDiBuatFs: '$jumlahPesakitDiBuatFs',
      jumlahGigiDibuatFs: '$jumlahGigiDibuatFs',
      tampalanAntGdBaru: '$tampalanAntGdBaru',
      tampalanAntGdSemula: '$tampalanAntGdSemula',
      tampalanAntGkBaru: '$tampalanAntGkBaru',
      tampalanAntGkSemula: '$tampalanAntGkSemula',
      tampalanPostGdBaru: '$tampalanPostGdBaru',
      tampalanPostGdSemula: '$tampalanPostGdSemula',
      tampalanPostGkBaru: '$tampalanPostGkBaru',
      tampalanPostGkSemula: '$tampalanPostGkSemula',
      tampalanPostAmgGdBaru: '$tampalanPostAmgGdBaru',
      tampalanPostAmgGdSemula: '$tampalanPostAmgGdSemula',
      tampalanPostAmgGkBaru: '$tampalanPostAmgGkBaru',
      tampalanPostAmgGkSemula: '$tampalanPostAmgGkSemula',
      tampalanSementara: '$tampalanSementara',
      cabutanGd: '$cabutanGd',
      cabutanGk: '$cabutanGk',
      penskaleran: '$penskaleran',
      kesSelesai: '$kesSelesai',
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
  const match_pemeriksaan_sekolah_18to19years = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_sekolah_20to29years = {
    $match: {
      ...getParams206sekolah(payload),
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_sekolah_30to49years = {
    $match: {
      ...getParams206sekolah(payload),
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_sekolah_50to59years = {
    $match: {
      ...getParams206sekolah(payload),
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_sekolah_60yearsandup = {
    $match: {
      ...getParams206sekolah(payload),
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_sekolah_ibumengandung = {
    $match: {
      ...getParams206sekolah(payload),
      statusRawatan: 'belum selesai',
      ibuMengandung: true,
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
  match_stage_sekolah.push(match_pemeriksaan_sekolah_18to19years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_20to29years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_30to49years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_50to59years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_60yearsandup);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_ibumengandung);
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
        $sum: {
          $cond: [
            {
              $eq: ['$merged.dAdaGigiDesidus', 0],
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
      skorGISMoreThanZero: {
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$merged.kedatangan', 'baru-kedatangan'],
                },
                {
                  $gt: ['$merged.skorGisMulutOralHygiene', 0],
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
          $eq: ['$merged.prrJenis1', true],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $eq: ['$merged.fissureSealant', true],
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

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let dataSekolah = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
        project_pemeriksaan,
      ];
      const queryPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [match_stage[i], group, project];
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

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    bigData.push(dataSekolah);

    console.log(bigData);

    return bigData;
  } catch (error) {
    console.log(error);
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
              $and: [
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
      TPR: {
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
      skorBPEZero: {
        $sum: {
          $cond: [{ $eq: ['$skorBpeOralHygienePemeriksaanUmum', 0] }, 1, 0],
        },
      },
      skorBPEMoreThanZero: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kedatangan', 'baru-kedatangan'] },
                { $gt: ['$skorBpeOralHygienePemeriksaanUmum', 0] },
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
          $cond: [{ $eq: ['$prrJenis1PemeriksaanUmum', true] }, 1, 0],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $cond: [{ $eq: ['$fissureSealantPemeriksaanUmum', true] }, 1, 0],
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

  const project_pemeriksaan = {
    $project: {
      _id: 1,
      // pemeriksaan
      kedatanganTahunSemasaBaru: '$kedatanganTahunSemasaBaru',
      sapuanFluorida: '$sapuanFluorida',
      jumlahd: '$jumlahd',
      jumlahf: '$jumlahf',
      jumlahx: '$jumlahx',
      jumlahdfx: '$jumlahdfx',
      jumlahD: '$jumlahD',
      jumlahF: '$jumlahF',
      jumlahM: '$jumlahM',
      jumlahX: '$jumlahX',
      jumlahDMFX: '$jumlahDMFX',
      jumlahMBK: '$jumlahMBK',
      statusBebasKaries: '$statusBebasKaries',
      TPR: '$TPR',
      skorBPEZero: '$skorBPEZero',
      skorBPEMoreThanZero: '$skorBPEMoreThanZero',
      perluSapuanFluorida: '$perluSapuanFluorida',
      perluJumlahPesakitPrrJenis1: '$perluJumlahPesakitPrrJenis1',
      perluJumlahGigiPrrJenis1: '$perluJumlahGigiPrrJenis1',
      perluJumlahPesakitFS: '$perluJumlahPesakitFS',
      perluJumlahGigiFS: '$perluJumlahGigiFS',
      perluPenskaleran: '$perluPenskaleran',
      perluEndoAnterior: '$perluEndoAnterior',
      perluEndoPremolar: '$perluEndoPremolar',
      perluEndoMolar: '$perluEndoMolar',
      jumlahPerluDenturPenuh: '$jumlahPerluDenturPenuh',
      jumlahPerluDenturSepara: '$jumlahPerluDenturSepara',
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
      ibuMengandung: true,
      // orangKurangUpaya: false,
    },
  };
  const match_oku = {
    $match: {
      ...getParams207(payload),
      // ibuMengandung: false,
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
              $and: [
                {
                  $eq: ['$kedatangan', 'baru-kedatangan'],
                },
                {
                  $or: [
                    { $gt: ['$baruJumlahGigiKekalDiberiFVRawatanUmum', 0] },
                    { $gt: ['$semulaJumlahGigiKekalDiberiFVRawatanUmum', 0] },
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
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: ['$kedatangan', 'baru-kedatangan'],
                },
                {
                  $eq: ['$pesakitDibuatPRRJenis1', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      jumlahGigiPrrJenis1: {
        //prrJ1MuridB
        // $cond: [
        //   {
        //     $and: [
        //       {
        //         $eq: ['$kedatangan', 'baru-kedatangan'],
        //       },
        //       {
        //         $or: [
        //           {
        //             $gt: [
        //               '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
        //               0,
        //             ],
        //           },
        //           {
        //             $gt: [
        //               '$semulaJumlahGigiKekalDiberiPrrJenis1RawatanUmum',
        //               0,
        //             ],
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   1,
        //   0,
        // ],
        $sum: '$baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum',
      },
      jumlahPesakitDiBuatFs: { $sum: '$pesakitDibuatFissureSealant' },
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
                  $eq: [
                    '$yaTidakAbsesPembedahanRawatanUmum',
                    'ya-abses-pembedahan-rawatan-umum',
                  ],
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

  const project = {
    $project: {
      _id: 1,
      kedatanganTahunSemasaUlangan: '$kedatanganTahunSemasaUlangan',
      // rawatan
      sapuanFluorida: '$sapuanFluorida',
      jumlahPesakitPrrJenis1: '$jumlahPesakitPrrJenis1',
      jumlahGigiPrrJenis1: '$jumlahGigiPrrJenis1',
      jumlahPesakitDiBuatFs: '$jumlahPesakitDiBuatFs',
      jumlahGigiDibuatFs: '$jumlahGigiDibuatFs',
      tampalanAntGdBaru: '$tampalanAntGdBaru',
      tampalanAntGdSemula: '$tampalanAntGdSemula',
      tampalanAntGkBaru: '$tampalanAntGkBaru',
      tampalanAntGkSemula: '$tampalanAntGkSemula',
      tampalanPostGdBaru: '$tampalanPostGdBaru',
      tampalanPostGdSemula: '$tampalanPostGdSemula',
      tampalanPostGkBaru: '$tampalanPostGkBaru',
      tampalanPostGkSemula: '$tampalanPostGkSemula',
      tampalanPostAmgGdBaru: '$tampalanPostAmgGdBaru',
      tampalanPostAmgGdSemula: '$tampalanPostAmgGdSemula',
      tampalanPostAmgGkBaru: '$tampalanPostAmgGkBaru',
      tampalanPostAmgGkSemula: '$tampalanPostAmgGkSemula',
      inlayOnlayBaru: '$inlayOnlayBaru',
      inlayOnlaySemula: '$inlayOnlaySemula',
      tampalanSementara: '$tampalanSementara',
      cabutanGd: '$cabutanGd',
      cabutanGk: '$cabutanGk',
      komplikasiSelepasCabutan: '$komplikasiSelepasCabutan',
      penskaleran: '$penskaleran',
      rawatanPerioLain: '$rawatanPerioLain',
      rawatanEndoAnterior: '$rawatanEndoAnterior',
      rawatanEndoPremolar: '$rawatanEndoPremolar',
      rawatanEndoMolar: '$rawatanEndoMolar',
      rawatanOrtho: '$rawatanOrtho',
      kesPerubatan: '$kesPerubatan',
      abses: '$abses',
      kecederaanTulangMuka: '$kecederaanTulangMuka',
      kecederaanGigi: '$kecederaanGigi',
      kecederaanTisuLembut: '$kecederaanTisuLembut',
      cabutanSurgical: '$cabutanSurgical',
      pembedahanKecilMulut: '$pembedahanKecilMulut',
      crownBridgeBaru: '$crownBridgeBaru',
      crownBridgeSemula: '$crownBridgeSemula',
      postCoreBaru: '$postCoreBaru',
      postCoreSemula: '$postCoreSemula',
      prosthodontikPenuhDenturBaru: '$prosthodontikPenuhDenturBaru',
      prosthodontikPenuhDenturSemula: '$prosthodontikPenuhDenturSemula',
      jumlahPesakitBuatDenturPenuh: '$jumlahPesakitBuatDenturPenuh',
      prosthodontikSeparaDenturBaru: '$prosthodontikSeparaDenturBaru',
      prosthodontikSeparaDenturSemula: '$prosthodontikSeparaDenturSemula',
      jumlahPesakitBuatDenturSepara: '$jumlahPesakitBuatDenturSepara',
      immediateDenture: '$immediateDenture',
      pembaikanDenture: '$pembaikanDenture',
      kesSelesai: '$kesSelesai',
      xrayDiambil: '$xrayDiambil',
      pesakitDisaringOC: '$pesakitDisaringOC',
    },
  };

  // untuk sekolah

  let match_stage_sekolah = [];

  const match_pemeriksaan_sekolah_below1year = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $lt: 1 },
      umurBulan: { $lt: 13 },
    },
  };
  const match_pemeriksaan_sekolah_1to4years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 1, $lte: 4 },
    },
  };
  const match_pemeriksaan_sekolah_5to6years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 5, $lte: 6 },
    },
  };
  const match_pemeriksaan_sekolah_7to9years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 7, $lte: 9 },
    },
  };
  const match_pemeriksaan_sekolah_10to12years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 10, $lte: 12 },
    },
  };
  const match_pemeriksaan_sekolah_13to14years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 13, $lte: 14 },
    },
  };
  const match_pemeriksaan_sekolah_15to17years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 15, $lte: 17 },
    },
  };
  const match_pemeriksaan_sekolah_18to19years = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      umur: { $gte: 18, $lte: 19 },
    },
  };
  const match_pemeriksaan_sekolah_20to29years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 20, $lte: 29 },
    },
  };
  const match_pemeriksaan_sekolah_30to49years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 30, $lte: 49 },
    },
  };
  const match_pemeriksaan_sekolah_50to59years = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 50, $lte: 59 },
    },
  };
  const match_pemeriksaan_sekolah_60yearsandup = {
    $match: {
      ...getParams207sekolah(payload),
      umur: { $gte: 60 },
    },
  };
  const match_pemeriksaan_sekolah_ibumengandung = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      ibuMengandung: true,
    },
  };
  const match_pemeriksaan_sekolah_oku = {
    $match: {
      ...getParams207sekolah(payload),
      statusRawatan: 'belum selesai',
      orangKurangUpaya: true,
    },
  };
  const match_pemeriksaan_sekolah_bukanWarganegara = {
    $match: {
      ...getParams207sekolah(payload),
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
  match_stage_sekolah.push(match_pemeriksaan_sekolah_18to19years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_20to29years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_30to49years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_50to59years);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_60yearsandup);
  match_stage_sekolah.push(match_pemeriksaan_sekolah_ibumengandung);
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
        $sum: {
          $cond: [
            {
              $eq: ['$merged.dAdaGigiDesidus', 0],
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
                  $gte: ['$merged.mAdaGigiKekal', 0],
                },
                {
                  $gte: ['$merged.mAdaGigiDesidus', 0],
                },
                {
                  $gte: ['$merged.fAdaGigiKekal', 0],
                },
                {
                  $gte: ['$merged.fAdaGigiDesidus', 0],
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
                  $gt: ['$merged.skorBpeOralHygiene', 0],
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
          $eq: ['$merged.prrJenis1', true],
        },
      },
      perluJumlahGigiPrrJenis1: {
        $sum: '$merged.baruJumlahGigiKekalPerluPRRJenis1',
      },
      perluJumlahPesakitFS: {
        $sum: {
          $eq: ['$merged.fissureSealant', true],
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
                  $eq: [
                    '$merged.yaTidakAbsesPembedahan',
                    'ya-abses-pembedahan',
                  ],
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

  //

  try {
    let dataPemeriksaan = [];
    let dataRawatan = [];
    let dataSekolah = [];
    let bigData = [];

    for (let i = 0; i < match_stage_pemeriksaan.length; i++) {
      const pipeline_pemeriksaan = [
        match_stage_pemeriksaan[i],
        group_pemeriksaan,
        project_pemeriksaan,
      ];
      const queryPemeriksaan = await Umum.aggregate(pipeline_pemeriksaan);
      dataPemeriksaan.push({ queryPemeriksaan });
    }

    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [match_stage[i], group, project];
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

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);
    bigData.push(dataSekolah);

    console.log(bigData);

    return bigData;
  } catch (error) {
    console.log(error);
  }
};
const countPGPR201 = async (payload) => {
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
      ...getParams2(payload),
    },
  };
  const age_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_30_49 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 49,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const age_60yearsandup = {
    $match: {
      umur: {
        $gte: 60,
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      ...getParams2(payload),
    },
  };
  const ibumengandung = {
    $match: {
      kedatangan: { $eq: 'baru-kedatangan' },
      ibuMengandung: true,
      ...getParams2(payload),
    },
  };
  const oku = {
    $match: {
      kedatangan: { $eq: 'baru-kedatangan' },
      oku: true,
      ...getParams2(payload),
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
//Reten Sekolah (Lama)
const countPG201 = async (klinik, bulan, sekolah) => {
  console.log(klinik, bulan, sekolah);
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
      oku: true,
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
    console.log('RC/RB');
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    console.log('RE/RF/RH/RR');
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  console.log(pilihanTahun[0]);
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
    console.log(error);
  }
};
//Reten Sekolah (effective until Feb 2023)
const countSMKPG201 = async (klinik, bulan, sekolah) => {
  console.log(klinik, bulan, sekolah);
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
      oku: true,
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
    console.log('RC/RB');
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    console.log('RE/RF/RH/RR');
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  console.log(pilihanTahun[0]);
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
    console.log(error);
  }
};
const countPG201A = async (klinik, bulan, sekolah) => {
  console.log(klinik, bulan, sekolah);
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
      oku: true,
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
    console.log('RC/RB');
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    console.log('RE/RF/RH/RR');
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  console.log(pilihanTahun[0]);
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
    console.log(error);
  }
};
//Reten Sekolah (effective starting on March 2023)
const countPG201PindSatu2022 = async (klinik, bulan, sekolah) => {
  console.log(klinik, bulan, sekolah);
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
      oku: true,
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
    console.log('RC/RB');
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    console.log('RE/RF/RH/RR');
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  console.log(pilihanTahun[0]);
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
    console.log(error);
  }
};
const countPGS203 = async (klinik, bulan, sekolah) => {
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
      oku: true,
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
      oku: true,
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
      oku: true,
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
      console.log(queryRawatan);
      dataRawatan.push({ queryRawatan });
    }

    bigData.push(dataPemeriksaan);
    bigData.push(dataRawatan);

    return bigData;
  } catch (error) {
    console.log(error);
  }
};
//Reten Sekolah (Kekal sampai diberitahu kelak)
const countPPIM03 = async (klinik, bulan, sekolah) => {
  console.log(klinik, bulan, sekolah);
  let match_stage = [];

  // year selector
  console.log('in year selector');
  let pilihanTahun = [];
  if (sekolah.match(/^RC|^RB/)) {
    console.log('RC/RB');
    pilihanTahun = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  }
  if (sekolah.match(/^RE|^RF|^RH|^RR/)) {
    console.log('RE/RF/RH/RR');
    pilihanTahun = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  }
  console.log(pilihanTahun[0]);
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
    console.log(error);
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
  console.log('x', x, 'y', y);
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
    console.log(error);
  }
};

// new tambahan
const countPGPro01 = async (payload) => {
  // match stage
  let match_stage = [];
  //PGPRO01 Pind.2 - 2022 - FFR
  const PRO1001 = {
    $match: {
      kodProgram: 'PRO1001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1002 = {
    $match: {
      kodProgram: 'PRO1002',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1003 = {
    $match: {
      kodProgram: 'PRO1003',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1004 = {
    $match: {
      kodProgram: 'PRO1004',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1005 = {
    $match: {
      kodProgram: 'PRO1005',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1006 = {
    $match: {
      kodProgram: 'PRO1006',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1007 = {
    $match: {
      kodProgram: 'PRO1007',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1008 = {
    $match: {
      kodProgram: 'PRO1008',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1009 = {
    $match: {
      kodProgram: 'PRO1009',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1010 = {
    $match: {
      kodProgram: 'PRO1010',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1011 = {
    $match: {
      kodProgram: 'PRO1011',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1012 = {
    $match: {
      kodProgram: 'PRO1012',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1013 = {
    $match: {
      kodProgram: 'PRO1013',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1014 = {
    $match: {
      kodProgram: 'PRO1014',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1015 = {
    $match: {
      kodProgram: 'PRO1015',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1016 = {
    $match: {
      kodProgram: 'PRO1016',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1017 = {
    $match: {
      kodProgram: 'PRO1017',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1018 = {
    $match: {
      kodProgram: 'PRO1018',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1019 = {
    $match: {
      kodProgram: 'PRO1019',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1020 = {
    $match: {
      kodProgram: 'PRO1020',
      ...getParamsPgPro(payload),
    },
  };

  const PRO1021 = {
    $match: {
      kodProgram: 'PRO1021',
      ...getParamsPgPro(payload),
    },
  };

  const PRO2001 = {
    $match: {
      kodProgram: 'PRO2001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO2002 = {
    $match: {
      kodProgram: 'PRO2002',
      ...getParamsPgPro(payload),
    },
  };

  const PRO2003 = {
    $match: {
      kodProgram: 'PRO2003',
      ...getParamsPgPro(payload),
    },
  };

  const PRO3001 = {
    $match: {
      kodProgram: 'PRO3001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO3002 = {
    $match: {
      kodProgram: 'PRO3002',
      ...getParamsPgPro(payload),
    },
  };

  const PRO3003 = {
    $match: {
      kodProgram: 'PRO3003',
      ...getParamsPgPro(payload),
    },
  };

  const PRO3004 = {
    $match: {
      kodProgram: 'PRO3004',
      ...getParamsPgPro(payload),
    },
  };

  const PRO3005 = {
    $match: {
      kodProgram: 'PRO3005',
      ...getParamsPgPro(payload),
    },
  };

  const PRO4001 = {
    $match: {
      kodProgram: 'PRO4001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO5001 = {
    $match: {
      kodProgram: 'PRO5001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO5002 = {
    $match: {
      kodProgram: 'PRO5002',
      ...getParamsPgPro(payload),
    },
  };

  const PRO5003 = {
    $match: {
      kodProgram: 'PRO5003',
      ...getParamsPgPro(payload),
    },
  };

  const PRO5004 = {
    $match: {
      kodProgram: 'PRO5004',
      ...getParamsPgPro(payload),
    },
  };

  const PRO5005 = {
    $match: {
      kodProgram: 'PRO5005',
      ...getParamsPgPro(payload),
    },
  };

  const PRO6001 = {
    $match: {
      kodProgram: 'PRO6001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO6002 = {
    $match: {
      kodProgram: 'PRO6002',
      ...getParamsPgPro(payload),
    },
  };

  const PRO6003 = {
    $match: {
      kodProgram: 'PRO6003',
      ...getParamsPgPro(payload),
    },
  };

  const PRO6004 = {
    $match: {
      kodProgram: 'PRO6004',
      ...getParamsPgPro(payload),
    },
  };

  const PRO6005 = {
    $match: {
      kodProgram: 'PRO6005',
      ...getParamsPgPro(payload),
    },
  };

  const PRO6006 = {
    $match: {
      kodProgram: 'PRO6006',
      ...getParamsPgPro(payload),
    },
  };

  const PRO6007 = {
    $match: {
      kodProgram: 'PRO6007',
      ...getParamsPgPro(payload),
    },
  };

  const PRO7001 = {
    $match: {
      kodProgram: 'PRO7001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO7002 = {
    $match: {
      kodProgram: 'PRO7002',
      ...getParamsPgPro(payload),
    },
  };

  const PRO7003 = {
    $match: {
      kodProgram: 'PRO7003',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8001 = {
    $match: {
      kodProgram: 'PRO8001',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8002 = {
    $match: {
      kodProgram: 'PRO8002',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8003 = {
    $match: {
      kodProgram: 'PRO8003',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8004 = {
    $match: {
      kodProgram: 'PRO8004',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8005 = {
    $match: {
      kodProgram: 'PRO8005',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8006 = {
    $match: {
      kodProgram: 'PRO8006',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8007 = {
    $match: {
      kodProgram: 'PRO8007',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8008 = {
    $match: {
      kodProgram: 'PRO8008',
      ...getParamsPgPro(payload),
    },
  };

  const PRO8009 = {
    $match: {
      kodProgram: 'PRO8009',
      ...getParamsPgPro(payload),
    },
  };

  match_stage.push(PRO1001);
  match_stage.push(PRO1002);
  match_stage.push(PRO1003);
  match_stage.push(PRO1004);
  match_stage.push(PRO1005);
  match_stage.push(PRO1006);
  match_stage.push(PRO1007);
  match_stage.push(PRO1008);
  match_stage.push(PRO1009);
  match_stage.push(PRO1010);
  match_stage.push(PRO1011);
  match_stage.push(PRO1012);
  match_stage.push(PRO1013);
  match_stage.push(PRO1014);
  match_stage.push(PRO1015);
  match_stage.push(PRO1016);
  match_stage.push(PRO1017);
  match_stage.push(PRO1018);
  match_stage.push(PRO1019);
  match_stage.push(PRO1020);
  match_stage.push(PRO1021);
  match_stage.push(PRO2001);
  match_stage.push(PRO2002);
  match_stage.push(PRO2003);
  match_stage.push(PRO3001);
  match_stage.push(PRO3002);
  match_stage.push(PRO3003);
  match_stage.push(PRO3004);
  match_stage.push(PRO3005);
  match_stage.push(PRO4001);
  match_stage.push(PRO5001);
  match_stage.push(PRO5002);
  match_stage.push(PRO5003);
  match_stage.push(PRO5004);
  match_stage.push(PRO5005);
  match_stage.push(PRO6001);
  match_stage.push(PRO6002);
  match_stage.push(PRO6003);
  match_stage.push(PRO6004);
  match_stage.push(PRO6005);
  match_stage.push(PRO6006);
  match_stage.push(PRO6007);
  match_stage.push(PRO7001);
  match_stage.push(PRO7002);
  match_stage.push(PRO7003);
  match_stage.push(PRO8001);
  match_stage.push(PRO8002);
  match_stage.push(PRO8003);
  match_stage.push(PRO8004);
  match_stage.push(PRO8005);
  match_stage.push(PRO8006);
  match_stage.push(PRO8007);
  match_stage.push(PRO8008);
  match_stage.push(PRO8009);

  const group_stage = {
    $group: {
      _id: '$namaSekolah', //tukar to $nameEvent ??
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
        $sum: '$bilanganAktivitiMainPerananBahagianB',
      },
      jumlahPesertaPerananKempen: {
        $sum: '$bilanganPesertaMainPerananBahagianB',
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
        $sum: 'bilanganPesertaPertandinganBahagianB',
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
      jumlahAktivitiRadio: { $sum: 'bilanganAktivitiRadio' },
      jumlahPesertaRadio: { $sum: 'bilanganPesertaRadio' },
      jumlahAktivitiCetak: { $sum: 'bilanganAktivitiCetak' },
    },
  };

  // run aggregate
  try {
    let data = [];
    for (let i = 0; i < match_stage.length; i++) {
      const pipeline = [match_stage[i], group_stage];
      data = await Promosi.aggregate(pipeline);
      console.log(data);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
const countGender = async (payload) => {
  console.log(payload);
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

  const pesakitLelakiOutreach1859 = {
    $match: {
      jenisFasiliti: { $nin: ['kp', 'kk-kd'] },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanOutreach1859 = {
    $match: {
      jenisFasiliti: { $nin: ['kp', 'kk-kd'] },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiUtc1859 = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      // jenisFasiliti: { $eq: 'utc' },
      jantina: 'lelaki',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanUtc1859 = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      // jenisFasiliti: { $eq: 'utc' },
      jantina: 'perempuan',
      umur: { $gte: 18, $lte: 59 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiPrimer60above = {
    $match: {
      jenisFasiliti: { $in: ['kp', 'kk-kd'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanPrimer60above = {
    $match: {
      jenisFasiliti: { $in: ['kp', 'kk-kd'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiOutreach60above = {
    $match: {
      jenisFasiliti: { $nin: ['kp', 'kk-kd'] },
      jantina: 'lelaki',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanOutreach60above = {
    $match: {
      jenisFasiliti: { $nin: ['kp', 'kk-kd'] },
      jantina: 'perempuan',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitLelakiUtc60above = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      // jenisFasiliti: { $eq: 'utc' },
      jantina: 'lelaki',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  const pesakitPerempuanUtc60above = {
    $match: {
      createdByKp: { $regex: /utc/, $options: 'i' },
      // jenisFasiliti: { $eq: 'utc' },
      jantina: 'perempuan',
      umur: { $gte: 60 },
      ...getParamsGender(payload),
    },
  };

  match_stage_lelaki.push(pesakitLelakiPrimer1859);
  match_stage_perempuan.push(pesakitPerempuanPrimer1859);
  match_stage_lelaki.push(pesakitLelakiOutreach1859);
  match_stage_perempuan.push(pesakitPerempuanOutreach1859);
  match_stage_lelaki.push(pesakitLelakiUtc1859);
  match_stage_perempuan.push(pesakitPerempuanUtc1859);
  match_stage_lelaki.push(pesakitLelakiPrimer60above);
  match_stage_perempuan.push(pesakitPerempuanPrimer60above);
  match_stage_lelaki.push(pesakitLelakiOutreach60above);
  match_stage_perempuan.push(pesakitPerempuanOutreach60above);
  match_stage_lelaki.push(pesakitLelakiUtc60above);
  match_stage_perempuan.push(pesakitPerempuanUtc60above);
  //
  const group_stage = {
    $group: {
      _id: '$createdByNegeri',
      pesakitLelakiBaru: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$jantina', 'lelaki'] },
                { $eq: ['$kedatangan', 'baru-kedatangan'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerempuanBaru: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$jantina', 'perempuan'] },
                { $eq: ['$kedatangan', 'baru-kedatangan'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitLelakiUlangan: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$jantina', 'lelaki'] },
                { $eq: ['$kedatangan', 'ulangan-kedatangan'] },
              ],
            },
            1,
            0,
          ],
        },
      },
      pesakitPerempuanUlangan: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$jantina', 'perempuan'] },
                { $eq: ['$kedatangan', 'ulangan-kedatangan'] },
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
  let dataLelaki = [];
  let dataPerempuan = [];
  let bigData = [];

  for (let i = 0; i < match_stage_lelaki.length; i++) {
    const result = await Umum.aggregate([match_stage_lelaki[i], group_stage]);
    dataLelaki.push(result);
  }

  for (let i = 0; i < match_stage_perempuan.length; i++) {
    const result = await Umum.aggregate([
      match_stage_perempuan[i],
      group_stage,
    ]);
    dataPerempuan.push(result);
  }

  bigData.push(dataLelaki);
  bigData.push(dataPerempuan);

  return bigData;
};

exports.testFunctionPGPro01Pindah2Program = function (req, res) {
  //PGPRO01 Pind.2 - 2022 - Program
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPGPro01Pindah2Program: function (callback) {
        Sekolah.aggregate(
          //Event.aggregate
          [
            {
              $match: {
                statusRawatan: 'selesai', //statusEvent "selesai"??
              },
            },
            {
              $group: {
                _id: '$namaSekolah', //tukar to $nameEvent ??
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
                  $sum: '$bilanganAktivitiMainPerananBahagianB',
                },
                jumlahPesertaPerananKempen: {
                  $sum: '$bilanganPesertaMainPerananBahagianB',
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
                  $sum: 'bilanganPesertaPertandinganBahagianB',
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
                jumlahAktivitiRadio: { $sum: 'bilanganAktivitiRadio' },
                jumlahPesertaRadio: { $sum: 'bilanganPesertaRadio' },
                jumlahAktivitiCetak: { $sum: 'bilanganAktivitiCetak' },
              },
            },
          ],
          callback
        );
      },
    },
    async function (err, results) {
      console.log(results);
      try {
        let filename = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'PGPRO01 Pind2_2022 Program .xlsx'
        );
        console.log('getting workbook: ' + filename);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGPro01');
        console.log('setting row1');

        //PGPRO01 Pind.2 2022 Program
        //KOlaborasi bersama agensi awam/swasta / NGO
        let rowNew = worksheet.get(22);
        rowNew.getCell(2).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiCeramahBaru; //B22
        rowNew.getCell(3).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaCeramahBaru; //C22
        rowNew.getCell(4).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiCeramahUlangan; //D22
        rowNew.getCell(5).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaCeramahUlangan; //E22
        rowNew.getCell(8).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiBaruLMG; //H22
        rowNew.getCell(9).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaBaruLMG; //I22
        rowNew.getCell(10).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiUlanganLMG; //J22
        rowNew.getCell(11).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaUlanganLMG; //K22
        rowNew.getCell(14).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiPerananKempen; //N22
        rowNew.getCell(15).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaPerananKempen; //O22
        rowNew.getCell(16).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiBoneka; //P22
        rowNew.getCell(17).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaBoneka; //Q22
        rowNew.getCell(18).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiPeranan; //R22
        rowNew.getCell(19).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaPeranan; //S22
        rowNew.getCell(20).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiBercerita; //T22
        rowNew.getCell(21).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaBercerita; //U22
        rowNew.getCell(22).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiPertandingan; //V22
        rowNew.getCell(23).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaPertandingan; //W22
        rowNew.getCell(24).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiInteraktif; //X22
        rowNew.getCell(25).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaInteraktif; //Y22
        rowNew.getCell(26).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiKursusSeminarBengkel; //Z22
        rowNew.getCell(27).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaKursusSeminarBengkel; //AA22
        rowNew.getCell(28).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiMultimedia; //AB22
        rowNew.getCell(29).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaMultimedia; //AC22
        rowNew.getCell(30).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiDentalBuskers; //AD22
        rowNew.getCell(31).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaDentalBuskers; //AE22
        rowNew.getCell(32).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiFlashMob; //AF22
        rowNew.getCell(33).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaFlashMob; //AG22
        rowNew.getCell(34).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiLawatanRumah; //AH22
        rowNew.getCell(35).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaLawatanRumah; //AI22
        rowNew.getCell(36).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiPlaqueOHE; //AJ22
        rowNew.getCell(37).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaPlaqueOHE; //AK22
        rowNew.getCell(38).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiOHI; //AL22
        rowNew.getCell(39).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaOHI; //AM22
        rowNew.getCell(40).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiDietAdvice; //AN22
        rowNew.getCell(41).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaDietAdvice; //AO22
        rowNew.getCell(42).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiKanserMulutOHE; //AP22
        rowNew.getCell(43).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaKanserMulutOHE; //AQ22
        rowNew.getCell(44).value =
          results.resultPGPro01Pindah2Program[0].jumlahAKtivitiHentiRokok; //AR22
        rowNew.getCell(45).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaHentiRokok; //AS22
        rowNew.getCell(46).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiHentiSirih; //AT22
        rowNew.getCell(47).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaHentiSirih; //AU22
        rowNew.getCell(48).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiHentiAlkohol; //AV22
        rowNew.getCell(49).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaHentiAlkohol; //AW22
        rowNew.getCell(50).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiHentiTabiatLain; //AX22
        rowNew.getCell(51).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaHentiTabiatLain; //AY22
        rowNew.getCell(54).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiTelevisyen; //BB22
        rowNew.getCell(55).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaTelevisyen; //BC22
        rowNew.getCell(56).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiRadio; //BD22
        rowNew.getCell(57).value =
          results.resultPGPro01Pindah2Program[0].jumlahPesertaRadio; //BE22
        rowNew.getCell(58).value =
          results.resultPGPro01Pindah2Program[0].jumlahAktivitiCetak; //BF22
        rowNew.commit();
        console.log('setting row4');
        let rowIdnt = worksheet.getRow(47);
        rowIdnt.getCell(1).value = 'Compiled by Gi-Ret';
        console.log('done setting data');

        let newfile = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'test-PG201A.xlsx'
        );
        // Write the file
        await workbook.xlsx.writeFile(newfile);
        console.log('writing file');
        setTimeout(function () {
          fs.unlinkSync(newfile); // delete this file after 30 seconds
          console.log('deleting file');
        }, 30000);
        setTimeout(function () {
          console.log('downloading file');
          return res.download(newfile); // delete this file after 30 seconds
        }, 3000);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error });
      }
    }
  );
};
exports.testFunctionPGPro01Pindah2Penuh = function (req, res) {
  //PGPRO01 Pind.2 - 2022 - Penuh
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPGPro01Pindah2Penuh: function (callback) {
        Sekolah.aggregate(
          //Event.aggregate
          [
            {
              $match: {
                statusRawatan: 'selesai', //statusEvent "selesai"??
              },
            },
            {
              $group: {
                _id: '$namaSekolah', //tukar to $nameEvent ??
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
                  $sum: '$bilanganAktivitiMainPerananBahagianB',
                },
                jumlahPesertaPerananKempen: {
                  $sum: '$bilanganPesertaMainPerananBahagianB',
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
                  $sum: 'bilanganPesertaPertandinganBahagianB',
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
                jumlahAktivitiRadio: { $sum: 'bilanganAktivitiRadio' },
                jumlahPesertaRadio: { $sum: 'bilanganPesertaRadio' },
                jumlahAktivitiCetak: { $sum: 'bilanganAktivitiCetak' },
              },
            },
          ],
          callback
        );
      },
    },
    async function (err, results) {
      console.log(results);
      try {
        let filename = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'PGPRO01 Pind2_2022.xlsx'
        );
        console.log('getting workbook: ' + filename);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGPro01');
        console.log('setting row1');

        //PGPRO01 Pind.2 2022 Program
        //KOlaborasi bersama agensi awam/swasta / NGO
        let rowNew = worksheet.get(16);
        rowNew.getCell(4).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiCeramahBaru; //D16
        rowNew.getCell(5).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaCeramahBaru; //E16
        rowNew.getCell(6).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiCeramahUlangan; //F16
        rowNew.getCell(7).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaCeramahUlangan; //G16
        rowNew.getCell(10).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiBaruLMG; //J16
        rowNew.getCell(11).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaBaruLMG; //K16
        rowNew.getCell(12).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiUlanganLMG; //L16
        rowNew.getCell(13).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaUlanganLMG; //M16
        rowNew.getCell(16).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiPerananKempen; //P16
        rowNew.getCell(17).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaPerananKempen; //Q16
        rowNew.getCell(18).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiBoneka; //R16
        rowNew.getCell(19).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaBoneka; //S16
        rowNew.getCell(20).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiPeranan; //T16
        rowNew.getCell(21).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaPeranan; //U16
        rowNew.getCell(22).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiBercerita; //V16
        rowNew.getCell(23).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaBercerita; //W16
        rowNew.getCell(24).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiPertandingan; //X16
        rowNew.getCell(25).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaPertandingan; //Y16
        rowNew.getCell(26).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiInteraktif; //Z16
        rowNew.getCell(27).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaInteraktif; //AA16
        rowNew.getCell(28).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiKursusSeminarBengkel; //AB16
        rowNew.getCell(29).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaKursusSeminarBengkel; //AC16
        rowNew.getCell(30).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiMultimedia; //AD16
        rowNew.getCell(31).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaMultimedia; //AE16
        rowNew.getCell(32).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiDentalBuskers; //AF16
        rowNew.getCell(33).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaDentalBuskers; //AG16
        rowNew.getCell(34).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiFlashMob; //AH16
        rowNew.getCell(35).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaFlashMob; //AI16
        rowNew.getCell(36).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiLawatanRumah; //AJ16
        rowNew.getCell(37).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaLawatanRumah; //AK16
        rowNew.getCell(38).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiPlaqueOHE; //AL16
        rowNew.getCell(39).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaPlaqueOHE; //AM16
        rowNew.getCell(40).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiOHI; //AN16
        rowNew.getCell(41).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaOHI; //AO16
        rowNew.getCell(42).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiDietAdvice; //AP16
        rowNew.getCell(43).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaDietAdvice; //AQ16
        rowNew.getCell(44).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiKanserMulutOHE; //AR16
        rowNew.getCell(45).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaKanserMulutOHE; //AS16
        rowNew.getCell(46).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAKtivitiHentiRokok; //AT16
        rowNew.getCell(47).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaHentiRokok; //AU16
        rowNew.getCell(48).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiHentiSirih; //AV16
        rowNew.getCell(49).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaHentiSirih; //AW16
        rowNew.getCell(50).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiHentiAlkohol; //AX16
        rowNew.getCell(51).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaHentiAlkohol; //AY16
        rowNew.getCell(52).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiHentiTabiatLain; //AZ16
        rowNew.getCell(53).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaHentiTabiatLain; //BA16
        rowNew.getCell(56).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiTelevisyen; //BD16
        rowNew.getCell(57).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaTelevisyen; //BE16
        rowNew.getCell(58).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiRadio; //BF16
        rowNew.getCell(59).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahPesertaRadio; //BG16
        rowNew.getCell(60).value =
          results.resultPGPro01Pindah2Penuh[0].jumlahAktivitiCetak; //BH16
        rowNew.commit();
        console.log('setting row4');
        let rowIdnt = worksheet.getRow(47);
        rowIdnt.getCell(1).value = 'Compiled by Gi-Ret';
        console.log('done setting data');

        let newfile = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'test-PGPRO01Pind2Penuh.xlsx'
        );
        // Write the file
        await workbook.xlsx.writeFile(newfile);
        console.log('writing file');
        setTimeout(function () {
          fs.unlinkSync(newfile); // delete this file after 30 seconds
          console.log('deleting file');
        }, 30000);
        setTimeout(function () {
          console.log('downloading file');
          return res.download(newfile); // delete this file after 30 seconds
        }, 3000);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error });
      }
    }
  );
};

// helper function
const getParams = (payload, reten) => {
  const { negeri, daerah, klinik, tarikhMula, tarikhAkhir } = payload;

  const AorC = (reten) => {
    if (reten === 'A') {
      return { $eq: 'kp' };
    }
    if (reten === 'C') {
      return { $ne: 'kp' };
    }
  };

  const byKp = () => {
    const noEndDate = {
      tarikhKedatangan: {
        $gte: tarikhMula,
      },
      createdByKp: {
        $eq: klinik,
      },
      jenisFasiliti: AorC(reten),
    };

    const withEndDate = {
      tarikhKedatangan: {
        $gte: tarikhMula,
        $lte: tarikhAkhir,
      },
      createdByKp: {
        $eq: klinik,
      },
      jenisFasiliti: AorC(reten),
    };

    if (!tarikhAkhir) {
      return noEndDate;
    } else {
      return withEndDate;
    }
  };

  const byDaerah = () => {
    const noEndDate = {
      tarikhKedatangan: {
        $gte: tarikhMula,
      },
      createdByDaerah: {
        $eq: daerah,
      },
      jenisFasiliti: AorC(reten),
    };
    const withEndDate = {
      tarikhKedatangan: {
        $gte: tarikhMula,
        $lte: tarikhAkhir,
      },
      createdByDaerah: {
        $eq: daerah,
      },
      jenisFasiliti: AorC(reten),
    };
    if (!tarikhAkhir) {
      return noEndDate;
    } else {
      return withEndDate;
    }
  };
  const byNegeri = () => {
    const noEndDate = {
      tarikhKedatangan: {
        $gte: tarikhMula,
      },
      createdByNegeri: {
        $eq: negeri,
      },
      jenisFasiliti: AorC(reten),
    };
    const withEndDate = {
      tarikhKedatangan: {
        $gte: tarikhMula,
        $lte: tarikhAkhir,
      },
      createdByNegeri: {
        $eq: negeri,
      },
      jenisFasiliti: AorC(reten),
    };
    if (!tarikhAkhir) {
      return noEndDate;
    } else {
      return withEndDate;
    }
  };
  if (payload.daerah !== 'all' && payload.klinik !== 'all') {
    return byKp(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik === 'all') {
    return byDaerah(payload);
  }
  if (payload.daerah === 'all') {
    return byNegeri(payload);
  }
};
const getParams2 = (payload, reten) => {
  const { negeri, daerah, klinik, bulan } = payload;

  const AorC = (reten) => {
    if (reten === 'A' || reten === undefined) {
      return { $in: ['kp', 'kk-kd'] };
    }
    if (reten === 'C') {
      return { $ne: 'kp' };
    }
  };

  const byKp = () => {
    let param = {
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
      },
      createdByKodFasiliti: {
        $eq: klinik,
      },
      jenisFasiliti: AorC(reten),
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
      },
      createdByNegeri: {
        $eq: negeri,
      },
      createdByDaerah: {
        $eq: daerah,
      },
      jenisFasiliti: AorC(reten),
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
      },
      createdByNegeri: {
        $eq: negeri,
      },
      jenisFasiliti: AorC(reten),
    };
    return param;
  };

  if (payload.daerah !== 'all' && payload.klinik !== 'all') {
    return byKp(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik === 'all') {
    return byDaerah(payload);
  }
  if (payload.daerah === 'all') {
    return byNegeri(payload);
  }
};
const getParams206 = (payload) => {
  const { negeri, daerah, klinik, bulan, pegawai, id } = payload;

  const byPegawai = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: id,
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      ibuMengandung: false,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      // createdByUsername: { $regex: /^(?!dr.).*$/ },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      // ibuMengandung: false,
      // orangKurangUpaya: false,
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      // ibuMengandung: false,
      // orangKurangUpaya: false,
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      // ibuMengandung: false,
      // orangKurangUpaya: false,
    };
    return param;
  };

  if (payload.pegawai) {
    return byPegawai(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik !== 'all') {
    return byKp(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik === 'all') {
    return byDaerah(payload);
  }
  if (payload.daerah === 'all') {
    console.log('jana negeri');
    return byNegeri(payload);
  }
};
const getParams206sekolah = (payload) => {
  const { negeri, daerah, klinik, bulan, pegawai, id } = payload;

  const byPegawai = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: id,
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      ibuMengandung: false,
      orangKurangUpaya: false,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      // createdByUsername: { $regex: /^(?!dr.).*$/ },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      ibuMengandung: false,
      orangKurangUpaya: false,
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      ibuMengandung: false,
      orangKurangUpaya: false,
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      ibuMengandung: false,
      orangKurangUpaya: false,
    };
    return param;
  };

  if (payload.pegawai) {
    return byPegawai(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik !== 'all') {
    return byKp(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik === 'all') {
    return byDaerah(payload);
  }
  if (payload.daerah === 'all') {
    return byNegeri(payload);
  }
};
const getParams207 = (payload) => {
  const { negeri, daerah, klinik, bulan, pegawai, id } = payload;

  const byPegawai = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: id,
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      // createdByUsername: { $regex: /^dr./, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      // ibuMengandung: false,
      // orangKurangUpaya: false,
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      // ibuMengandung: false,
      // orangKurangUpaya: false,
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      // ibuMengandung: false,
      // orangKurangUpaya: false,
    };
    return param;
  };

  if (payload.pegawai) {
    return byPegawai(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik !== 'all') {
    return byKp(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik === 'all') {
    return byDaerah(payload);
  }
  if (payload.daerah === 'all') {
    return byNegeri(payload);
  }
};
const getParams207sekolah = (payload) => {
  const { negeri, daerah, klinik, bulan, pegawai, id } = payload;

  const byPegawai = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: id,
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      // createdByUsername: { $regex: /^dr./, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      // ibuMengandung: false,
      // orangKurangUpaya: false,
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      ibuMengandung: false,
      orangKurangUpaya: false,
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        // $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      ibuMengandung: false,
      orangKurangUpaya: false,
    };
    return param;
  };

  if (payload.pegawai) {
    return byPegawai(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik !== 'all') {
    return byKp(payload);
  }
  if (payload.daerah !== 'all' && payload.klinik === 'all') {
    return byDaerah(payload);
  }
  if (payload.daerah === 'all') {
    return byNegeri(payload);
  }
};
const getParamsPgPro = (payload) => {
  const { klinik, pegawai } = payload;

  const byIndividu = () => {
    let param = {
      promosiIndividu: true,
      createdByMdcMdtb: pegawai,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      promosiKlinik: true,
      createdByKodFasiliti: klinik,
    };
    return param;
  };

  if (pegawai) {
    return byIndividu();
  }

  if (klinik) {
    return byKp();
  }
};
const getParamsGender = (payload) => {
  const { daerah, negeri } = payload;

  const byDaerah = () => {
    let param = {
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      // deleted: false,
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      // deleted: false,
    };
    return param;
  };

  if (daerah) {
    return byDaerah();
  } else {
    return byNegeri();
  }
};

// place
const placeModifier = (payload) => {
  if (payload.pegawai) {
    return '$createdByUsername';
  }
  if (
    !payload.pegawai &&
    payload.daerah !== 'all' &&
    payload.klinik !== 'all'
  ) {
    return '$createdByKlinik';
  }
  if (payload.daerah !== 'all' && payload.klinik === 'all') {
    return '$createdByDaerah';
  }
  if (payload.daerah === 'all') {
    return '$createdByNegeri';
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
  countSMKPG201,
  countPG201A,
  countPG201PindSatu2022,
  countPGS203,
  countPGPR201,
  countPPIM03,
  countAdHocQuery,
  countPGPro01,
  countGender,
};

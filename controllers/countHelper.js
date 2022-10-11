const async = require('async');
const moment = require('moment');
const Umum = require('../models/Umum');
const Sekolah = require('../models/Sekolah');

const countPG101 = async (klinik, tarikhMula, tarikhAkhir) => {
  let match_stage = [];
  let project_stage = [];
  let sort_stage = [];

  let match = {};

  if (!tarikhAkhir) {
    console.log('tarikh akhir is null');
    match = {
      $match: {
        tarikhKedatangan: {
          $eq: tarikhMula,
        },
        createdByKp: {
          $eq: klinik,
        },
        jenisFasiliti: {
          $eq: 'kp',
        },
      },
    };
  }

  if (tarikhAkhir) {
    console.log('tarikh akhir is not null');
    match = {
      $match: {
        tarikhKedatangan: {
          $gte: tarikhMula,
          $lte: tarikhAkhir,
        },
        createdByKp: {
          $eq: klinik,
        },
      },
    };
  }

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
const countPG211 = async (klinik, bulan) => {
  let match_stage = [];

  const bage_below_1 = {
    $match: {
      umur: {
        $lt: 1,
      },
      umurBulan: {
        $lt: 13,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const bage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'baru-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
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
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_1_4 = {
    $match: {
      umur: {
        $gte: 1,
        $lte: 4,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_5_6 = {
    $match: {
      umur: {
        $gte: 5,
        $lte: 6,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_7_9 = {
    $match: {
      umur: {
        $gte: 7,
        $lte: 9,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_10_12 = {
    $match: {
      umur: {
        $gte: 10,
        $lte: 12,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_13_14 = {
    $match: {
      umur: {
        $gte: 13,
        $lte: 14,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_15_17 = {
    $match: {
      umur: {
        $gte: 15,
        $lte: 17,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_18_19 = {
    $match: {
      umur: {
        $gte: 18,
        $lte: 19,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_20_29 = {
    $match: {
      umur: {
        $gte: 20,
        $lte: 29,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_30_39 = {
    $match: {
      umur: {
        $gte: 30,
        $lte: 39,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_40_49 = {
    $match: {
      umur: {
        $gte: 40,
        $lte: 49,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_50_59 = {
    $match: {
      umur: {
        $gte: 50,
        $lte: 59,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_60 = {
    $match: {
      umur: {
        $eq: 60,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_61_64 = {
    $match: {
      umur: {
        $gte: 61,
        $lte: 64,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_65 = {
    $match: {
      umur: {
        $eq: 65,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_66_69 = {
    $match: {
      umur: {
        $gte: 66,
        $lte: 69,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_70_74 = {
    $match: {
      umur: {
        $gte: 70,
        $lte: 74,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
    },
  };
  const uage_lebih_75 = {
    $match: {
      umur: {
        $gte: 75,
      },
      tarikhKedatangan: {
        $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
        $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
      },
      kedatangan: { $eq: 'ulangan-kedatangan' },
      createdByKp: {
        $eq: klinik,
      },
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

  const group_stage = {
    $group: {
      _id: '$categoryId',
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
const countPG206and207 = async (klinik, tarikhMula, tarikhAkhir, pegawai) => {
  let match_stage = [];
  let group_stage = [];
  let project_stage = [];

  const match = {
    $match: {
      $and: [
        {
          $eq: ['$baruUlanganKedatanganPendaftaran', 'baru-kedatangan'],
        },
        { $le: ['$umur', 1] },
      ],
    },
  };

  const group = {
    $group: {
      _id: '$nama',
      kedatanganTahunSemasa: {
        //how to gorek data? by row? or by column?
        $sum: {
          $cond: [
            {
              $eq: [
                '$baruUlanganKedatanganPendaftaran',
                'baru-kedatangan-pendaftaran',
              ],
            },
            1,
            0,
          ],
        },
      },
      sapuanFluorida: {
        //fvMuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: [
                    '$baruUlanganKedatanganPendaftaran',
                    'baru-kedatangan-pendaftaran',
                  ],
                },
                {
                  $or: [
                    { $gt: ['$baruJumlahGigiKekalDiberiFv', 0] },
                    { $gt: ['$semulaJumlahGigiKekalDiberiFv', 0] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      prrJenis1: {
        //prrJ1MuridB
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: [
                    '$baruUlanganKedatanganPendaftaran',
                    'baru-kedatangan-pendaftaran',
                  ],
                },
                {
                  $or: [
                    {
                      $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', 0],
                    },
                    {
                      $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', 0],
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
      muridBaruFS: {
        //FSmuridBaru (Problem to be solve)
        $sum: {
          $cond: [
            {
              $and: [
                //{ $eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran']},
                //to add button to know patient's previous FS status on that year ;
                //kalau pt pernah buat FS on the same year ; then kira ulangan.
                { $gte: ['$baruJumlahGigiKekalDibuatFs', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      muridSemulaFS: {
        //FSmuridSemula (Problem to be solve)
        $sum: {
          $cond: [
            {
              $and: [
                //{ $eq: ['$baruUlanganKedatanganPendaftaran','ulangan-kedatangan-pendaftaran']},
                //to add button to know patient's previous FS status on that year ;
                //kalau pt pernah buat FS on the same year ; then kira ulangan.
                { $gte: ['$semulaJumlahGigiKekalDibuatFs', 1] },
              ],
            },
            1,
            0,
          ],
        },
      },
      gigiBaruFS: { $sum: ['$baruJumlahGigiKekalDibuatFs'] },
      gigiSemulaFS: { $sum: ['$semulaJumlahGigiKekalDibuatFs'] },
      tampalanAntGdBaru: {
        $sum: ['$gdBaruAnteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanAntGdSemula: {
        $sum: ['$gdSemulaAnteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanAntGkBaru: {
        $sum: ['$gkBaruAnteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanAntGkSemula: {
        $sum: ['$gkSemulaAnteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanPostGdBaru: {
        $sum: ['$gdBaruPosteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanPostGdSemula: {
        $sum: ['$gdSemulaPosteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanPostGkBaru: {
        $sum: ['$gkBaruPosteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanPostGkSemula: {
        $sum: ['$gkSemulaPosteriorSewarnaJumlahTampalanDibuat'],
      },
      tampalanPostAmgGdBaru: {
        $sum: ['$gdBaruPosteriorAmalgamJumlahTampalanDibuat'],
      },
      tampalanPostAmgGdSemula: {
        $sum: ['$gdSemulaPosteriorAmalgamJumlahTampalanDibuat'],
      },
      tampalanPostAmgGkBaru: {
        $sum: ['$gkBaruPosteriorAmalgamJumlahTampalanDibuat'],
      },
      tampalanPostAmgGkSemula: {
        $sum: ['$gkSemulaPosteriorAmalgamJumlahTampalanDibuat'],
      },
      //inlayOnlayBaru: { $sum: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum']},     //data sudah dpt dari form umum
      //inlayOnlaySemula: { $sum: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum']}, //data sudah dpt dari form umum
      tampalanSementara: {
        $sum: ['$jumlahTampalanSementaraPenyataAkhir2'],
      },
      cabutanGd: { $sum: ['$cabutDesidusPenyataAkhir2'] },
      cabutanGk: { $sum: ['$cabutKekalPenyataAkhir2'] },
      //komplikasiSelepasCabutan :{ $sum:['$komplikasiSelepasCabutanRawatanUmum']}   //data sudah dpt dari form umum
      penskaleran: { $sum: ['$penskaleranPenyataAkhir2'] },
      //rawatanPerioLain: { $sum:['$rawatanLainPeriodontikRawatanUmum']},            //data sudah dpt dari form umum
      rawatanEndo: {
        $sum: ['$pulpotomiPenyataAkhir2', '$endodontikPenyataAkhir2'],
      },
      //rawatanOrtho: {$sum:['$rawatanOrtho']},                     //data nanty gorek dari form umum
      //kesPerubatan:{$sum:['$kesPerubatanMulutPenyata??']},        //data nanty gorek dari form umum
      absesBaru: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: [
                    '$baruUlanganKedatanganPendaftaran',
                    'baru-kedatangan-pendaftaran',
                  ],
                },
                { $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true] },
                {
                  $eq: ['$baruSemulaAbsesPembedahanRawatanUmum', true],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      absesSemula: {
        //data sini campur sekolah form & umum form. blh ke?
        $sum: {
          $cond: [
            {
              $and: [
                {
                  $eq: [
                    '$baruUlanganKedatanganPendaftaran',
                    'baru-kedatangan-pendaftaran',
                  ],
                },
                { $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true] },
                {
                  $eq: ['$baruSemulaAbsesPembedahanRawatanUmum', false],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      cabutanSurgical: {
        $sum: ['$cabutanSurgikalPembedahanMulutRawatanUmum'],
      }, //data dari form umum
      fraktur: {
        $sum: {
          $cond: [
            { $eq: ['$yaTidakFrakturPembedahanRawatanUmum', true] },
            1,
            0,
          ],
        },
      },
      trauma: {
        $sum: {
          $cond: [{ $eq: ['$yaTidakTraumaPembedahanRawatanUmum', true] }, 1, 0],
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
        $sum: ['$baruJumlahCrownBridgeRawatanUmum'],
      },
      crownBridgeSemula: {
        $sum: ['$semulaJumlahCrownBridgeRawatanUmum'],
      },
      postCoreBaru: { $sum: ['$baruJumlahPostCoreRawatanUmum'] },
      postCoreSemula: { sum: ['$semulaJumlahPostCoreRawatanUmum'] },
      prosthodontikPenuhDentur: {
        $sum: ['$penuhJumlahDenturProstodontikRawatanUmum'],
      },
      //prosthodontikPenuhPesakit:{$sum:['$penuhJumlahDenturProstodontikRawatanUmum']}, // cari jalan lagi
      prosthodontikSebahagianDentur: {
        $sum: ['$sebahagianJumlahDenturProstodontikRawatanUmum'],
      },
      //prosthodontikSebahagianPesakit:{$sum:['$sebahagianJumlahDenturProstodontikRawatanUmum']}, //cari jalan lagi
      immediateDenture: {
        $sum: ['$immediateDenturProstodontikRawatanUmum'],
      },
      pembaikanDenture: {
        $sum: ['$pembaikanDenturProstodontikRawatanUmum'],
      },
      kesSelesai: {
        $sum: {
          $cond: [{ $eq: ['$kesSelesaiRawatanUmum', true] }, 1, 0],
        },
      },
      xrayDiambil: { $sum: ['$bilanganXrayYangDiambilRawatanUmum'] },
      pesakitDisaringOC: {
        $sum: {
          $cond: [
            {
              $eq: ['$disaringProgramKanserMulutPemeriksaanUmum', true],
            },
            1,
            0,
          ],
        },
      },
      pesakitdirujukLesiMulut: {
        $sum: {
          $cond: [
            {
              $eq: ['$dirujukProgramKanserMulutPemeriksaanUmum', true],
            },
            1,
            0,
          ],
        },
      },
      pesakitDirujukTabiat: {
        $sum: {
          $cond: [
            { $eq: ['$tabiatBerisikoTinggiPemeriksaanUmum', true] },
            1,
            0,
          ],
        },
      },
      rokokSaringNasihat: {
        $sum: {
          $cond: [
            {
              $or: [
                { $eq: ['jenisRUmum', 'perokokSemasa'] },
                { $eq: ['jenisRUmum', 'bekasPerokok'] },
                { $eq: ['jenisRUmum', 'perokokPasif'] },
                { $eq: ['jenisRUmum', 'bukanPerokok'] },
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
      kedatanganTahunSemasa: '$kedatanganTahunSemasa',
      sapuanFluorida: '$sapuanFluorida',
      prrJenis1: '$prrJenis1',
      muridBaruFS: '$muridBaruFS',
      muridSemulaFS: '$muridSemulaFS',
      gigiBaruFS: '$gigiBaruFS',
      gigiSemulaFS: '$gigiSemulaFS',
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
      rawatanEndo: '$rawatanEndo',
      absesBaru: '$absesBaru',
      absesSemula: '$absesSemula',
      cabutanSurgical: '$cabutanSurgical',
      fraktur: '$fraktur',
      trauma: '$trauma',
      pembedahanKecilMulut: '$pembedahanKecilMulut',
      crownBridgeBaru: '$crownBridgeBaru',
      crownBridgeSemula: '$crownBridgeSemula',
      postCoreBaru: '$postCoreBaru',
      postCoreSemula: '$postCoreSemula',
      prosthodontikPenuhDentur: '$prosthodontikPenuhDentur',
      prosthodontikSebahagianDentur: '$prosthodontikSebahagianDentur',
      immediateDenture: '$immediateDenture',
      pembaikanDenture: '$pembaikanDenture',
      kesSelesai: '$kesSelesai',
      xrayDiambil: '$xrayDiambil',
      pesakitDisaringOC: '$pesakitDisaringOC',
      pesakitdirujukLesiMulut: '$pesakitdirujukLesiMulut',
      pesakitDirujukTabiat: '$pesakitDirujukTabiat',
      rokokSaringNasihat: '$rokokSaringNasihat',
    },
  };

  match_stage.push(match);
  group_stage.push(group);
  project_stage.push(project);

  const pipeline = match_stage.concat(group_stage, project_stage);

  const data = await Umum.aggregate(pipeline);

  return data;
};
const countPG201 = async (klinik, sekolah) => {
  const data = async.parallel(
    {
      dataPemeriksaan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                // kelas: '1 adil',
                namaSekolah: sekolah,
                statusRawatan: 'belum selesai',
              },
            },
            {
              $lookup: {
                from: Pemeriksaan.collection.name,
                localField: 'pemeriksaanSekolah',
                foreignField: '_id',
                as: 'pemeriksaanSekolah',
              },
            },
            { $unwind: '$pemeriksaanSekolah' },
            {
              $lookup: {
                from: Rawatan.collection.name,
                localField: 'rawatanSekolah',
                foreignField: '_id',
                as: 'rawatanSekolah',
              },
            },
            { $unwind: '$rawatanSekolah' },
            {
              $lookup: {
                from: Kotak.collection.name,
                localField: 'kotakSekolah',
                foreignField: '_id',
                as: 'kotakSekolah',
              },
            },
            {
              $unwind: {
                path: '$kotakSekolah',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$namaSekolah',
                // namaKlinik: '$pemeriksaanSekolah.createdByKp',
                jumlahBudak: { $sum: 1 },
                engganKedatanganPendaftaran: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$pemeriksaanSekolah.engganKedatanganPendaftaran',
                          true,
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'A',
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'C',
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'E',
                        ],
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
                        $and: [
                          { $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] },
                        ],
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
                            $eq: [
                              '$pemeriksaanSekolah.skorGisMulutOralHygiene',
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
                jumlahTprICDAS: {
                  //TPR ICDAS (Criteria = tidak boleh ada E / cabutan / scaling needed / filling)
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.eAdaGigiKekal', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                kecederaanGigiAnterior: {
                  $sum: {
                    $toDouble:
                      '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
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
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFs',
                              'true',
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
                perluFvMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFv',
                              'true',
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
                perluFvMuridS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '0',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '1',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '2',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '3',
                        ],
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
            },
          ],
          callback
        );
      },
      dataRawatan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                // kelas: '1 adil',
                namaSekolah: sekolah,
                statusRawatan: 'belum selesai',
              },
            },
            {
              $lookup: {
                from: Rawatan.collection.name,
                localField: 'rawatanSekolah',
                foreignField: '_id',
                as: 'rawatanSekolah',
              },
            },
            {
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
                        $add: [
                          '$$value.cabutKekal',
                          '$$this.cabutKekalSekolahRawatan',
                        ],
                      },
                      tampalanSementara: {
                        $add: [
                          '$$value.jumlahTampalanSementara',
                          '$$this.jumlahTampalanSementaraSekolahRawatan',
                        ],
                      },
                      pulpotomi: {
                        $add: [
                          '$$value.pulpotomi',
                          '$$this.pulpotomiSekolahRawatan',
                        ],
                      },
                      endodontik: {
                        $add: [
                          '$$value.endodontik',
                          '$$this.endodontikSekolahRawatan',
                        ],
                      },
                      abses: {
                        $add: ['$$value.abses', '$$this.absesSekolahRawatan'],
                      },
                      penskaleran: {
                        $add: [
                          '$$value.penskaleran',
                          '$$this.penskaleranSekolahRawatan',
                        ],
                      },
                    },
                  },
                },
              },
            },
            {
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
            },
          ],
          callback
        );
      },
    },
    function (err, results) {
      return results;
    }
  );
  return data;
};
const countPGS203 = async () => {
  const data = async.parallel(
    {
      dataPemeriksaan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                // kelas: '1 adil',
                namaSekolah: sekolah,
                statusRawatan: 'belum selesai',
              },
            },
            {
              $lookup: {
                from: Pemeriksaan.collection.name,
                localField: 'pemeriksaanSekolah',
                foreignField: '_id',
                as: 'pemeriksaanSekolah',
              },
            },
            { $unwind: '$pemeriksaanSekolah' },
            {
              $lookup: {
                from: Rawatan.collection.name,
                localField: 'rawatanSekolah',
                foreignField: '_id',
                as: 'rawatanSekolah',
              },
            },
            { $unwind: '$rawatanSekolah' },
            {
              $lookup: {
                from: Kotak.collection.name,
                localField: 'kotakSekolah',
                foreignField: '_id',
                as: 'kotakSekolah',
              },
            },
            {
              $unwind: {
                path: '$kotakSekolah',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$namaSekolah',
                // namaKlinik: '$pemeriksaanSekolah.createdByKp',
                jumlahBudak: { $sum: 1 },
                engganKedatanganPendaftaran: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$pemeriksaanSekolah.engganKedatanganPendaftaran',
                          true,
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

                /*  CPPC 2   No.of Teeth carious experience (D+F)   Saiful                                  
                jumlahDdanF: 
                 { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' }, + 
                { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
                
                jumlahDClass1Dan2: 
                { $sum: '$pemeriksaanSekolah.classID' }, +  
                { $sum: '$pemeriksaanSekolah.classIID' },

                jumlahDClass1: 
                { $sum: '$pemeriksaanSekolah.classID' }
               
                */

                /*
               Ya CO1 SM
               jumlah15-19Tahun : sum tapis berdasarkan umur
               jumlah20-24Tahun : sum tapis berdasarkan umur
               jumlah25-27Tahun : sum tapis berdasarkan umur
               jumlah20-24Tahun : sum tapis berdasarkan umur
               
              sumLelaki: { $sum: '$data jantina Lelaki sekolah oleh ERKM' },
              sumPerempuan: { $sum: '$data jantina Perempuan sekolah oleh ERKM' },


              sumSkorBPE0: { $sum: '$pemeriksaaan umum atau sekolah.SkorBpeOralHygiene', skor 0 },
              sumSkorBPE1: { $sum: '$pemeriksaaan umum atau sekolah.SkorBpeOralHygiene', skor 1 },
              sumSkorBPE2: { $sum: '$pemeriksaaan umum atau sekolah.SkorBpeOralHygiene' ,skor 2 },
              sumSkorBPE3: { $sum: '$pemeriksaaan umum atau sekolah.SkorBpeOralHygiene', skor 3 },
              sumSkorBPE4: { $sum: '$pemeriksaaan umum atau sekolah.SkorBpeOralHygiene', skor 4 },

              sumCRARendah : { $sum: '$     Kesemua ini berdasarkan pengiraan bilangan faktor risiko, Status caries gigi
              sumCRASederhana : { $sum: '$
              sumCRATinggi : { $sum: '$
              
              sumDirujukKeKlinikBedahMulut: Nilai ini tidak dikutip dari form
              sumDirujukKeKlinikBerhentiMerokok: Nilai ini tidak dikutip dari form
              
                */
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'A',
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'C',
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'E',
                        ],
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
                        $and: [
                          { $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] },
                        ],
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
                            $eq: [
                              '$pemeriksaanSekolah.skorGisMulutOralHygiene',
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
                jumlahTprICDAS: {
                  //TPR ICDAS (Criteria = tidak boleh ada E / cabutan / scaling needed / filling)
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.eAdaGigiKekal', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                kecederaanGigiAnterior: {
                  $sum: {
                    $toDouble:
                      '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
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
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFs',
                              'true',
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
                perluFvMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFv',
                              'true',
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
                perluFvMuridS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '0',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '1',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '2',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '3',
                        ],
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
            },
          ],
          callback
        );
      },
      dataRawatan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                // kelas: '1 adil',
                namaSekolah: sekolah,
                statusRawatan: 'belum selesai',
              },
            },
            {
              $lookup: {
                from: Rawatan.collection.name,
                localField: 'rawatanSekolah',
                foreignField: '_id',
                as: 'rawatanSekolah',
              },
            },
            {
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
                        $add: [
                          '$$value.cabutKekal',
                          '$$this.cabutKekalSekolahRawatan',
                        ],
                      },
                      tampalanSementara: {
                        $add: [
                          '$$value.jumlahTampalanSementara',
                          '$$this.jumlahTampalanSementaraSekolahRawatan',
                        ],
                      },
                      pulpotomi: {
                        $add: [
                          '$$value.pulpotomi',
                          '$$this.pulpotomiSekolahRawatan',
                        ],
                      },
                      endodontik: {
                        $add: [
                          '$$value.endodontik',
                          '$$this.endodontikSekolahRawatan',
                        ],
                      },
                      abses: {
                        $add: ['$$value.abses', '$$this.absesSekolahRawatan'],
                      },
                      penskaleran: {
                        $add: [
                          '$$value.penskaleran',
                          '$$this.penskaleranSekolahRawatan',
                        ],
                      },
                    },
                  },
                },
              },
            },
            {
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
            },
          ],
          callback
        );
      },
    },
    function (err, results) {
      return results;
    }
  );
  return data;
};
const countPGPR201 = async () => {
  const data = async.parallel(
    {
      dataPemeriksaan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                // kelas: '1 adil',
                namaSekolah: sekolah,
                statusRawatan: 'belum selesai',
              },
            },
            {
              $lookup: {
                from: Pemeriksaan.collection.name,
                localField: 'pemeriksaanSekolah',
                foreignField: '_id',
                as: 'pemeriksaanSekolah',
              },
            },
            { $unwind: '$pemeriksaanSekolah' },
            {
              $lookup: {
                from: Rawatan.collection.name,
                localField: 'rawatanSekolah',
                foreignField: '_id',
                as: 'rawatanSekolah',
              },
            },
            { $unwind: '$rawatanSekolah' },
            {
              $lookup: {
                from: Kotak.collection.name,
                localField: 'kotakSekolah',
                foreignField: '_id',
                as: 'kotakSekolah',
              },
            },
            {
              $unwind: {
                path: '$kotakSekolah',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$namaSekolah',
                // namaKlinik: '$pemeriksaanSekolah.createdByKp',
                jumlahBudak: { $sum: 1 },
                engganKedatanganPendaftaran: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$pemeriksaanSekolah.engganKedatanganPendaftaran',
                          true,
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'A',
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'C',
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
                        $eq: [
                          '$pemeriksaanSekolah.kebersihanMulutOralHygiene',
                          'E',
                        ],
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
                        $and: [
                          { $gte: ['$pemeriksaanSekolah.eAdaGigiKekal', 1] },
                        ],
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
                            $eq: [
                              '$pemeriksaanSekolah.skorGisMulutOralHygiene',
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
                jumlahTprICDAS: {
                  //TPR ICDAS (Criteria = tidak boleh ada E / cabutan / scaling needed / filling)
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.eAdaGigiKekal', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                kecederaanGigiAnterior: {
                  $sum: {
                    $toDouble:
                      '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
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
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFs',
                              'true',
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
                perluFvMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFv',
                              'true',
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
                perluFvMuridS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFv',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '0',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '1',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '2',
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
                        $eq: [
                          '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                          '3',
                        ],
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
            },
          ],
          callback
        );
      },
      dataRawatan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                // kelas: '1 adil',
                namaSekolah: sekolah,
                statusRawatan: 'belum selesai',
              },
            },
            {
              $lookup: {
                from: Rawatan.collection.name,
                localField: 'rawatanSekolah',
                foreignField: '_id',
                as: 'rawatanSekolah',
              },
            },
            {
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
                        $add: [
                          '$$value.cabutKekal',
                          '$$this.cabutKekalSekolahRawatan',
                        ],
                      },
                      tampalanSementara: {
                        $add: [
                          '$$value.jumlahTampalanSementara',
                          '$$this.jumlahTampalanSementaraSekolahRawatan',
                        ],
                      },
                      pulpotomi: {
                        $add: [
                          '$$value.pulpotomi',
                          '$$this.pulpotomiSekolahRawatan',
                        ],
                      },
                      endodontik: {
                        $add: [
                          '$$value.endodontik',
                          '$$this.endodontikSekolahRawatan',
                        ],
                      },
                      abses: {
                        $add: ['$$value.abses', '$$this.absesSekolahRawatan'],
                      },
                      penskaleran: {
                        $add: [
                          '$$value.penskaleran',
                          '$$this.penskaleranSekolahRawatan',
                        ],
                      },
                    },
                  },
                },
              },
            },
            {
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
            },
          ],
          callback
        );
      },
    },
    function (err, results) {
      return results;
    }
  );
  return data;
};

module.exports = {
  countPG101,
  countPG211,
  countPG206and207,
  countPG201,
  countPGS203,
  countPGPR201,
};

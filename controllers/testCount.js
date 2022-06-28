const fs = require('fs');
const path = require('path');
const async = require('async');
const Excel = require('exceljs');
const Sekolah = require('../models/Sekolah');

exports.testFunction = function (req, res) {
  async.parallel(
    {
      resultTaska: function (callback) {
        Sekolah.aggregate(
          [
            { $match: {} },
            {
              $group: {
                _id: '$createdByDaerah',
                jumlahKPBergerak: {
                  $sum: { $cond: [{ $eq: ['$kpBergerak', true] }, 1, 0] },
                },
                jumlahPPBergerak: {
                  $sum: {
                    $cond: [{ $eq: ['$pasukanPergigianBergerak', true] }, 1, 0],
                  },
                },
                kedatanganBaru: {
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
                kedatanganUlangan: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$baruUlanganKedatanganPendaftaran',
                          'ulangan-kedatangan-pendaftaran',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                adaPemeriksaan: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$adaTiadaPemeriksaanPendaftaran',
                          'ada-pemeriksaan',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                tidakAdaPemeriksaan: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$adaTiadaPemeriksaanPendaftaran',
                          'tiada-pemeriksaan',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                risikoSekolahTinggi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'tinggi-risiko-sekolah',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                risikoSekolahRendah: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'rendah-risiko-sekolah',
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
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultKotaSetar: function (callback) {
        Sekolah.aggregate(
          [
            {
              $group: {
                _id: '$createdByKp',
                jumlahKPBergerak: {
                  $sum: { $cond: [{ $eq: ['$kpBergerak', true] }, 1, 0] },
                },
                jumlahPPBergerak: {
                  $sum: {
                    $cond: [{ $eq: ['$pasukanPergigianBergerak', true] }, 1, 0],
                  },
                },
                kedatanganBaru: {
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
                kedatanganUlangan: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$baruUlanganKedatanganPendaftaran',
                          'ulangan-kedatangan-pendaftaran',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                adaPemeriksaan: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$adaTiadaPemeriksaanPendaftaran',
                          'ada-pemeriksaan',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                tidakAdaPemeriksaan: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$adaTiadaPemeriksaanPendaftaran',
                          'tiada-pemeriksaan',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                risikoSekolahTinggi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'tinggi-risiko-sekolah',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                risikoSekolahRendah: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'rendah-risiko-sekolah',
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
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
    },
    function (err, results) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Error when getting Taska',
          error: err,
        });
      }
      console.log(results);
      return res.json(results);
    }
  );
};

const fs = require('fs');
const path = require('path');
const async = require('async');
const Excel = require('exceljs');
const Sekolah = require('../models/Sekolah');

exports.testFunction = function (req, res) {
  async.parallel(
    {
      // resultPGS203: function (callback) {
      //   Sekolah.aggregate(
      //     [
      //       { $match: {} },
      //       {
      //         $group: {
      //           _id: '$createdByDaerah',
      //           jumlahKedatanganBaru: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$baruUlanganKedatanganPendaftaran',
      //                     'baru-kedatangan-pendaftaran',
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahKedatanganUlangan: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$baruUlanganKedatanganPendaftaran',
      //                     'ulangan-kedatangan-pendaftaran',
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahd: {
      //             $sum: { $dAdaGigiDesidus: 1 },
      //           },
      //           jumlahf: {
      //             $sum: { $fAdaGigiDesidus: 1 },
      //           },
      //           jumlahx: {
      //             $sum: { $xAdaGigiDesidus: 1 },
      //           },
      //           jumlahD: {
      //             $sum: { $dAdaGigiKekal: 1 },
      //           },
      //           jumlahM: {
      //             $sum: { $mAdaGigiKekal: 1 },
      //           },
      //           jumlahF: {
      //             $sum: { $fAdaGigiKekal: 1 },
      //           },
      //           jumlahX: {
      //             $sum: { $xAdaGigiKekal: 1 },
      //           },
      //           jumlahMBK: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $eq: ['$dAdaGigiDesidus', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           dfxEqualToZero: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiDesidus', '0'] },
      //                     { $eq: ['$xAdaGigiDesidus', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           statusBebasKaries: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiDesidus', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           totalStatusGigiKekalSamaKosong: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiDesidus', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           gigiKekalDMFXsamaAtauKurangDari1: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiDesidus', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           gigiKekalDMFXsamaAtauKurangDari2: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiDesidus', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           eMoreThanZero: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiDesidus', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           statusBebasKariesTapiElebihDariSatu: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$eAdaGigiKekal', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           kecederaanGigiAnterior: {
      //             $sum: { $kecederaanGigiAnteriorTrauma: 0 },
      //           },
      //           jumlahTPR: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiKekal', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                     { $eq: ['$eAdaGigiKekal', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           skorGIS0: {
      //             $sum: { $skorGisMulutOralHygiene: 0 },
      //           },
      //           skorGIS1: {
      //             $sum: { $skorGisMulutOralHygiene: 1 },
      //           },
      //           skorGIS2: {
      //             $sum: { $skorGisMulutOralHygiene: 2 },
      //           },
      //           skorGIS3: {
      //             $sum: { $skorGisMulutOralHygiene: 3 },
      //           },
      //           perluFvMurid: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluFv', '0'] },
      //                     { $gt: ['$semulaJumlahGigiKekalPerluFv', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluPRR1Murid: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', '0'] },
      //                     {
      //                       $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', '0'],
      //                     },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFSMuridB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
      //                     {
      //                       $gt: ['$semulaJumlahGigiKekalPerluFs', '0'],
      //                     },
      //                     {
      //                       $eq: [
      //                         '$baruUlanganKedatanganPendaftaran',
      //                         'baru-kedatangan-pendaftaran',
      //                       ],
      //                     },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFSMuridS: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
      //                     {
      //                       $gt: ['$semulaJumlahGigiKekalPerluFs', '0'],
      //                     },
      //                     {
      //                       $eq: [
      //                         '$baruUlanganKedatanganPendaftaran',
      //                         'ulangan-kedatangan-pendaftaran',
      //                       ],
      //                     },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFSGigiB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
      //           },
      //           perluFSGigiS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalPerluFs', '0'] },
      //           },
      //           perluTampalanAntGdB: {
      //             $sum: {
      //               $gt: [
      //                 '$baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanAntGdS: {
      //             $sum: {
      //               $gt: [
      //                 '$semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanAntGkB: {
      //             $sum: {
      //               $gt: [
      //                 '$baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanAntGkS: {
      //             $sum: {
      //               $gt: [
      //                 '$semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanPosGdB: {
      //             $sum: {
      //               $gt: [
      //                 '$baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanPosGdS: {
      //             $sum: {
      //               $gt: [
      //                 '$semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanPosGkB: {
      //             $sum: {
      //               $gt: [
      //                 '$baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanPosGkS: {
      //             $sum: {
      //               $gt: [
      //                 '$semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanAmgGdB: {
      //             $sum: {
      //               $gt: [
      //                 '$baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanAmgGdS: {
      //             $sum: {
      //               $gt: [
      //                 '$semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanAmgGkB: {
      //             $sum: {
      //               $gt: [
      //                 '$baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           perluTampalanAmgGkS: {
      //             $sum: {
      //               $gt: [
      //                 '$semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
      //                 '0',
      //               ],
      //             },
      //           },
      //           telahFvMurid: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$baruJumlahGigiKekalDiberiFv', '0'] },
      //                 { $gt: ['$semulaJumlahGigiKekalDiberiFv', '0'] },
      //               ],
      //             },
      //           },
      //           telahPRR1Murid: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //                 { $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //               ],
      //             },
      //           },
      //           telahFSMuridB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFSMuridS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahTampalanAntGdB: {
      //             $sum: {
      //               $gt: ['$gdBaruAnteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanAntGdS: {
      //             $sum: {
      //               $gt: ['$gdSemulaAnteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanAntGkB: {
      //             $sum: {
      //               $gt: ['$gkBaruAnteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanAntGkS: {
      //             $sum: {
      //               $gt: ['$gkSemulaAnteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanPosGdB: {
      //             $sum: {
      //               $gt: ['$gdBaruPosteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanPosGdS: {
      //             $sum: {
      //               $gt: ['$gdSemulaPosteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanPosGkB: {
      //             $sum: {
      //               $gt: ['$gkBaruPosteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanPosGkS: {
      //             $sum: {
      //               $gt: ['$gkSemulaPosteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanAmgGdB: {
      //             $sum: {
      //               $gt: ['$gdBaruPosteriorAmalgamJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanAmgGdS: {
      //             $sum: {
      //               $gt: ['$gdSemulaPosteriorAmalgamJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanAmgGkB: {
      //             $sum: {
      //               $gt: ['$gkBaruPosteriorAmalgamJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           telahTampalanAmgGkS: {
      //             $sum: {
      //               $gt: ['$gkSemulaPosteriorAmalgamJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           cabutanGd: {
      //             $sum: { $cabutDesidusPenyataAkhir2: 1 },
      //           },
      //           cabutanGk: {
      //             $sum: { $cabutKekalPenyataAkhir2: 1 },
      //           },
      //           penskaleran: {
      //             $sum: { $penskaleranPenyataAkhir2: 1 },
      //           },
      //           caseCompleted: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: ['$kesSelesaiPenyataAkhir2', true],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //         },
      //       },
      //     ],
      //     callback
      //   );
      // },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      // resultBEGIN: function (callback) {
      //   Sekolah.aggregate(
      //     [
      //       { $match: {} },
      //       {
      //         $group: {
      //           _id: '$createdByKp',
      //           pesakitBaru: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$baruUlanganKedatanganPendaftaran',
      //                     'baru-kedatangan-pendaftaran',
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           // ambil dari fasilitis
      //           jumlahFasiliti: {
      //             $sum: {
      //               $cond: [{ $eq: ['$pasukanPergigianBergerak', true] }, 1, 0],
      //             },
      //           },
      //           // ambil dari fasilitis
      //           jumlahFasilitiLaksanakanBEGIN: {
      //             $sum: {
      //               $cond: [{ $eq: ['$pasukanPergigianBergerak', true] }, 1, 0],
      //             },
      //           },
      //           // ambil dari langit
      //           lowCRA: {
      //             $sum: {
      //               $cond: [{ $eq: ['$pasukanPergigianBergerak', true] }, 1, 0],
      //             },
      //           },
      //           // ambil dari langit
      //           moderateCRA: {
      //             $sum: {
      //               $cond: [{ $eq: ['$pasukanPergigianBergerak', true] }, 1, 0],
      //             },
      //           },
      //           // ambil dari langit
      //           highCRA: {
      //             $sum: {
      //               $cond: [{ $eq: ['$pasukanPergigianBergerak', true] }, 1, 0],
      //             },
      //           },
      //           jumlahKKlaksanakanBEGIN: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2',
      //                     true,
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //         },
      //       },
      //     ],
      //     callback
      //   );
      // },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPG201A: function (callback) {
        Sekolah.aggregate(
          [
            { $match: { statusRawatan: 'selesai' } },
            {
              $group: {
                _id: '$namaSekolah',
                engganKedatanganPendaftaran: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$engganKedatanganPendaftaran', true],
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
                        $eq: ['$tidakHadirKedatanganPendaftaran', true],
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
                jumlahKedatanganUlangan: {
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
                skorPlakA: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$kebersihanMulutOralHygiene', 'A'],
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
                        $eq: ['$kebersihanMulutOralHygiene', 'C'],
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
                        $eq: ['$kebersihanMulutOralHygiene', 'E'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahd: { $sum: '$dAdaGigiDesidus' },
                jumlahf: { $sum: '$fAdaGigiDesidus' },
                jumlahx: { $sum: '$xAdaGigiDesidus' },
                jumlahE: { $sum: '$eAdaGigiKekal' },
                jumlahD: { $sum: '$dAdaGigiKekal' },
                jumlahM: { $sum: '$mAdaGigiKekal' },
                jumlahF: { $sum: '$fAdaGigiKekal' },
                jumlahX: { $sum: '$xAdaGigiKekal' },
                gigiKekalDMFXsamaAtauKurangDari3: {
                  //DMFX ≤ 3
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$dAdaGigiKekal', 1] },
                          { $eq: ['$mAdaGigiKekal', 1] },
                          { $eq: ['$fAdaGigiKekal', 1] },
                          { $eq: ['$xAdaGigiKekal', 1] },
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
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
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
                        $and: [{ $gte: ['$eAdaGigiKekal', 1] }],
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
                        $eq: ['$dAdaGigiDesidus', 0],
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
                          { $gte: ['$eAdaGigiKekal', 1] },
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
                          { $eq: ['$dAdaGigiDesidus', 0] },
                          { $eq: ['$fAdaGigiDesidus', 0] },
                          { $eq: ['$xAdaGigiDesidus', 0] },
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
                        $and: [{ $eq: ['$skorGisMulutOralHygiene', '0'] }],
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
                          { $eq: ['$eAdaGigiKekal', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                kecederaanGigiAnterior: {
                  $sum: { $toDouble: '$kecederaanGigiAnteriorTrauma' },
                  // $sum: { $kecederaanGigiAnteriorTrauma: 0 },
                },
                cleftAda: {
                  $sum: { $toDouble: '$adaCleftLip' },
                  // $sum: { $adaCleftLip: 0 },
                },
                cleftRujuk: {
                  $sum: { $toDouble: '$rujukCleftLip' },
                  // $sum: { $rujukCleftLip: 0 },
                },
                perluFSMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluFs', 0] },
                          {
                            $gt: ['$semulaJumlahGigiKekalPerluFs', '0'],
                          },
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'baru-kedatangan-pendaftaran',
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
                  $sum: { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
                },
                perluFSGigiS: {
                  $sum: { $gt: ['$semulaJumlahGigiKekalPerluFs', '0'] },
                },
                perluFsBilGigiFailed: {
                  $sum: { $gt: ['$jumlahGigiFsGagal', '0'] },
                },
                perluFvMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $gt: ['$baruJumlahGigiKekalPerluFv', '0'],
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
                        $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFvGigiB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [{ $gt: ['$baruJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFvGigiS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1MuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', 0] },
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
                            $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1GigiB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1GigiS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluTampalanAntGdB: {
                  $sum: {
                    $gt: ['$baruGDAnteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAntGdS: {
                  $sum: {
                    $gt: [
                      '$semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAntGkB: {
                  $sum: {
                    $gt: ['$baruGKAnteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAntGkS: {
                  $sum: {
                    $gt: [
                      '$semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGdB: {
                  $sum: {
                    $gt: ['$baruGDPosteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanPosGdS: {
                  $sum: {
                    $gt: [
                      '$semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGkB: {
                  $sum: {
                    $gt: ['$baruGKPosteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanPosGkS: {
                  $sum: {
                    $gt: [
                      '$semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGdB: {
                  $sum: {
                    $gt: ['$baruGDPosteriorAmalgamJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAmgGdS: {
                  $sum: {
                    $gt: [
                      '$semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGkB: {
                  $sum: {
                    $gt: ['$baruGKPosteriorAmalgamJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAmgGkS: {
                  $sum: {
                    $gt: [
                      '$semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                telahFSMuridB: {
                  $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', 0] },
                },
                telahFSMuridS: {
                  $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', 0] },
                },
                telahFSGigiB: {
                  $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', 0] },
                },
                telahFSGigiS: {
                  $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', 0] },
                },
                telahFvMuridB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahFvMuridS: {
                  $sum: {
                    $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahFvGigiB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahFvGigiS: {
                  $sum: {
                    $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahPRR1MuridB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', 0] }],
                  },
                },
                telahPRR1MuridS: {
                  $sum: {
                    $and: [
                      { $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', 0] },
                    ],
                  },
                },
                telahPRR1GigiB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', 0] }],
                  },
                },
                telahPRR1GigiS: {
                  $sum: {
                    $and: [
                      { $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', 0] },
                    ],
                  },
                },
                telahTampalanAntGdB: {
                  $sum: {
                    $gt: ['$gdBaruAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAntGdS: {
                  $sum: {
                    $gt: ['$gdSemulaAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAntGkB: {
                  $sum: {
                    $gt: ['$gkBaruAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAntGkS: {
                  $sum: {
                    $gt: ['$gkSemulaAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGdB: {
                  $sum: {
                    $gt: ['$gdBaruPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGdS: {
                  $sum: {
                    $gt: ['$gdSemulaPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGkB: {
                  $sum: {
                    $gt: ['$gkBaruPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGkS: {
                  $sum: {
                    $gt: ['$gkSemulaPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGdB: {
                  $sum: {
                    $gt: ['$gdBaruPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGdS: {
                  $sum: {
                    $gt: ['$gdSemulaPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGkB: {
                  $sum: {
                    $gt: ['$gkBaruPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGkS: {
                  $sum: {
                    $gt: ['$gkSemulaPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                cabutanGd: {
                  $sum: '$cabutDesidusPenyataAkhir2',
                },
                cabutanGk: {
                  $sum: '$cabutKekalPenyataAkhir2',
                },
                penskaleran: {
                  $sum: '$penskaleranPenyataAkhir2',
                },
                caseCompletedICDAS: {
                  //kena finish E; cabutan ;scaling ; tampanlan
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$kesSelesaiPenyataAkhir2', true],
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
                        $eq: ['$skorGisMulutOralHygiene', '0'],
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
                        $eq: ['$skorGisMulutOralHygiene', '1'],
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
                        $eq: ['$skorGisMulutOralHygiene', '2'],
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
                        $eq: ['$skorGisMulutOralHygiene', '3'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                toothSurfaceLoss: {
                  $sum: '$toothSurfaceLossTrauma',
                },
                traumaTisuLembut: {
                  $sum: '$tisuLembutTrauma',
                },
                traumaTisuKeras: {
                  $sum: '$tisuKerasTrauma',
                },
                pesakitAdaFullDentureAtas: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitAdaPartialDentureAtas: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitPerluFullDentureAtas: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
                pesakitPerluPartialDentureAtas: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
                pesakitAdaFullDentureBawah: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitAdaPartialDentureBawah: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitPerluFullDentureBawah: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
                pesakitPerluPartialDentureBawah: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
              },
            },
          ],
          callback
        );
      },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      // resultTOD: function (callback) {
      //   Sekolah.aggregate(
      //     [
      //       { $match: {} },
      //       {
      //         $group: {
      //           _id: '$createdByDaerah',
      //           jumlahBaru: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$baruUlanganKedatanganPendaftaran',
      //                     'baru-kedatangan-pendaftaran',
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahUlangan: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$baruUlanganKedatanganPendaftaran',
      //                     'ulangan-kedatangan-pendaftaran',
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahd: {
      //             $sum: { $dAdaGigiDesidus: 1 },
      //           },
      //           jumlahm: {
      //             $sum: { $mAdaGigiDesidus: 1 },
      //           },
      //           jumlahf: {
      //             $sum: { $fAdaGigiDesidus: 1 },
      //           },
      //           jumlahx: {
      //             $sum: { $xAdaGigiDesidus: 1 },
      //           },
      //           jumlahSpA: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: ['$kebersihanMulutOralHygiene', 'A'],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahSpC: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: ['$kebersihanMulutOralHygiene', 'C'],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahSpE: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: ['$kebersihanMulutOralHygiene', 'E'],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahTisuKeras: {
      //             $sum: { $tisuKerasTrauma: 1 },
      //           },
      //           jumlahTisuLembut: {
      //             $sum: { $tisuLembutTrauma: 1 },
      //           },
      //           jumlahPerluFV: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluFv', '0'] },
      //                     { $gt: ['$semulaJumlahGigiKekalPerluFv', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahTelahFVB: {
      //             $sum: {
      //               $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           jumlahTelahFVS: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahTelahTampalAntB: {
      //             $sum: {
      //               $gt: ['$gdBaruAnteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           jumlahTelahTampalAntS: {
      //             $sum: {
      //               $gt: ['$gdSemulaAnteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           jumlahTelahTampalPosB: {
      //             $sum: {
      //               $gt: ['$gdBaruPosteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           jumlahTelahTampalPosS: {
      //             $sum: {
      //               $gt: ['$gdSemulaPosteriorSewarnaJumlahTampalanDibuat', '0'],
      //             },
      //           },
      //           cabutanGd: {
      //             $sum: { $cabutDesidusPenyataAkhir2: 1 },
      //           },
      //           jumlahAbses: {
      //             $sum: { $absesPenyataAkhir2: 1 },
      //           },
      //           jumlahPulpotomi: {
      //             $sum: { $pulpotomiPenyataAkhir2: 1 },
      //           },
      //           jumlahCTod: {
      //             $sum: { $ceramahPromosiPenyataAkhir2: 1 },
      //           },
      //           jumlahCPar: {
      //             $sum: { $ceramahPromosiPenyataAkhir2: 1 },
      //           },
      //           jumlahLMG: {
      //             $sum: { $lmgPromosiPenyataAkhir2: 1 },
      //           },
      //           // kena kira
      //           jumlahCRAlow: {
      //             $sum: { $lmgPromosiPenyataAkhir2: 1 },
      //           },
      //           jumlahCRAmid: {
      //             $sum: { $lmgPromosiPenyataAkhir2: 1 },
      //           },
      //           jumlahCRAhi: {
      //             $sum: { $lmgPromosiPenyataAkhir2: 1 },
      //           },
      //           // end kita
      //         },
      //       },
      //     ],
      //     callback
      //   );
      // },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      // resultMMI: function (callback) {
      //   Sekolah.aggregate(
      //     [
      //       { $match: {} },
      //       {
      //         $group: {
      //           _id: '$createdByDaerah',
      //           jumlahKedatanganBaru: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$baruUlanganKedatanganPendaftaran',
      //                     'baru-kedatangan-pendaftaran',
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahD: {
      //             $sum: { $dAdaGigiKekal: 1 },
      //           },
      //           eMoreThanZero: {
      //             //E≥1 (ada karies awal)
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gte: ['$eAdaGigiKekal', '1'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           statusBebasKariesTapiElebihDariSatu: {
      //             //DMFX=0 ; E≥1
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiKekal', '0'] },
      //                     { $eq: ['$mAdaGigiKekal', '0'] },
      //                     { $eq: ['$fAdaGigiKekal', '0'] },
      //                     { $eq: ['$xAdaGigiKekal', '0'] },
      //                     { $gte: ['$eAdaGigiKekal', '1'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFSMuridB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
      //                     {
      //                       $gt: ['$semulaJumlahGigiKekalPerluFs', '0'],
      //                     },
      //                     {
      //                       $eq: [
      //                         '$baruUlanganKedatanganPendaftaran',
      //                         'baru-kedatangan-pendaftaran',
      //                       ],
      //                     },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFSGigiB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
      //           },
      //           perluFSGigiS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalPerluFs', '0'] },
      //           },
      //           perluFvMuridB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gt: ['$baruJumlahGigiKekalPerluFv', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFvGigiB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gt: ['$baruJumlahGigiKekalPerluFv', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFvGigiS: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluPRR1MuridB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluPRR1GigiB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluPRR1GigiS: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     {
      //                       $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', '0'],
      //                     },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           telahFSMuridB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFSMuridS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFSGigiB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFSGigiS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFvMuridB: {
      //             $sum: {
      //               $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahFvMuridS: {
      //             $sum: {
      //               $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahFvGigiB: {
      //             $sum: {
      //               $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahFvGigiS: {
      //             $sum: {
      //               $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahPRR1MuridB: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //               ],
      //             },
      //           },
      //           telahPRR1GigiB: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //               ],
      //             },
      //           },
      //           telahPRR1GigiS: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //               ],
      //             },
      //           },
      //         },
      //       },
      //     ],
      //     callback
      //   );
      // },
      // resultPG201: function (callback) {
      //   //belum siap lagi. tengah map lagi
      //   Sekolah.aggregate(
      //     [
      //       { $match: {} },
      //       {
      //         $group: {
      //           _id: '$createdByDaerah',
      //           jumlahKedatanganBaru: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $eq: [
      //                     '$baruUlanganKedatanganPendaftaran',
      //                     'baru-kedatangan-pendaftaran',
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           jumlahD: {
      //             $sum: { '$dAdaGigiKekal', 1 },
      //           },
      //           eMoreThanZero: {
      //             //E≥1 (ada karies awal)
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gte: ['$eAdaGigiKekal', '1'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           statusBebasKariesTapiElebihDariSatu: {
      //             //DMFX=0 ; E≥1
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$dAdaGigiKekal', 0] },
      //                     { $eq: ['$mAdaGigiKekal', 0] },
      //                     { $eq: ['$fAdaGigiKekal', 0] },
      //                     { $eq: ['$xAdaGigiKekal', 0] },
      //                     { $gte: ['$eAdaGigiKekal', 1] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFSMuridB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
      //                     {
      //                       $gt: ['$semulaJumlahGigiKekalPerluFs', '0'],
      //                     },
      //                     {
      //                       $eq: [
      //                         '$baruUlanganKedatanganPendaftaran',
      //                         'baru-kedatangan-pendaftaran',
      //                       ],
      //                     },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFSGigiB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
      //           },
      //           perluFSGigiS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalPerluFs', '0'] },
      //           },
      //           perluFvMuridB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gt: ['$baruJumlahGigiKekalPerluFv', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFvGigiB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gt: ['$baruJumlahGigiKekalPerluFv', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluFvGigiS: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', '0'] }],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluPRR1MuridB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluPRR1GigiB: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', '0'] },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           perluPRR1GigiS: {
      //             $sum: {
      //               $cond: [
      //                 {
      //                   $and: [
      //                     {
      //                       $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', '0'],
      //                     },
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           },
      //           telahFSMuridB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFSMuridS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFSGigiB: {
      //             $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFSGigiS: {
      //             $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', '0'] },
      //           },
      //           telahFvMuridB: {
      //             $sum: {
      //               $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahFvMuridS: {
      //             $sum: {
      //               $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahFvGigiB: {
      //             $sum: {
      //               $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahFvGigiS: {
      //             $sum: {
      //               $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', '0'] }],
      //             },
      //           },
      //           telahPRR1MuridB: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //               ],
      //             },
      //           },
      //           telahPRR1GigiB: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //               ],
      //             },
      //           },
      //           telahPRR1GigiS: {
      //             $sum: {
      //               $and: [
      //                 { $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', '0'] },
      //               ],
      //             },
      //           },
      //         },
      //       },
      //     ],
      //     callback
      //   );
      // },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
    },
    async function (err, results) {
      // if (err) {
      //   console.log(err);
      //   return res.status(500).json({
      //     message: 'Error when getting Data',
      //     error: err,
      //   });
      // }
      console.log(results);
      return res.json(results.resultPG201A[1]._id);
    }
  );
};
exports.getDetails = async function (req, res) {
  console.log(req.query);
  let newfile = path.join(
    __dirname,
    '..',
    'public',
    'exports',
    req.query.jenisReten + '.xlsx'
  );
  try {
    const file = fs.readFileSync(path.resolve(process.cwd(), newfile));
    res.setHeader('Content-Type', 'application/vnd.ms-excel');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${req.query.jenisReten}.xlsx"`
    );
    res.send(file);
  } catch (err) {
    res.status(404).json({ err });
  }
};
exports.testFunction201A = function (req, res) {
  //PG201A
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPG201A: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
            statusRawatan: 'selesai'
              },
            },
            {
              $group: {
                _id: '$namaSekolah',
                engganKedatanganPendaftaran: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$engganKedatanganPendaftaran', true],
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
                        $eq: ['$tidakHadirKedatanganPendaftaran', true],
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
                jumlahKedatanganUlangan: {
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
                skorPlakA: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$kebersihanMulutOralHygiene', 'A'],
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
                        $eq: ['$kebersihanMulutOralHygiene', 'C'],
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
                        $eq: ['$kebersihanMulutOralHygiene', 'E'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahd: { $sum: '$dAdaGigiDesidus' },
                jumlahf: { $sum: '$fAdaGigiDesidus' },
                jumlahx: { $sum: '$xAdaGigiDesidus' },
                jumlahE: { $sum: '$eAdaGigiKekal' },
                jumlahD: { $sum: '$dAdaGigiKekal' },
                jumlahM: { $sum: '$mAdaGigiKekal' },
                jumlahF: { $sum: '$fAdaGigiKekal' },
                jumlahX: { $sum: '$xAdaGigiKekal' },
                gigiKekalDMFXsamaAtauKurangDari3: {
                  //DMFX ≤ 3
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$dAdaGigiKekal', 1] },
                          { $eq: ['$mAdaGigiKekal', 1] },
                          { $eq: ['$fAdaGigiKekal', 1] },
                          { $eq: ['$xAdaGigiKekal', 1] },
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
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
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
                        $and: [{ $gte: ['$eAdaGigiKekal', 1] }],
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
                        $eq: ['$dAdaGigiDesidus', 0],
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
                          { $gte: ['$eAdaGigiKekal', 1] },
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
                          { $eq: ['$dAdaGigiDesidus', 0] },
                          { $eq: ['$fAdaGigiDesidus', 0] },
                          { $eq: ['$xAdaGigiDesidus', 0] },
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
                        $and: [{ $eq: ['$skorGisMulutOralHygiene', '0'] }],
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
                          { $eq: ['$eAdaGigiKekal', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                kecederaanGigiAnterior: {
                  $sum: { $toDouble: '$kecederaanGigiAnteriorTrauma' },
                  // $sum: { $kecederaanGigiAnteriorTrauma: 0 },
                },
                cleftAda: {
                  $sum: { $toDouble: '$adaCleftLip' },
                  // $sum: { $adaCleftLip: 0 },
                },
                cleftRujuk: {
                  $sum: { $toDouble: '$rujukCleftLip' },
                  // $sum: { $rujukCleftLip: 0 },
                },
                perluFSMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluFs', 0] },
                          {
                            $gt: ['$semulaJumlahGigiKekalPerluFs', '0'],
                          },
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'baru-kedatangan-pendaftaran',
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
                  $sum: { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
                },
                perluFSGigiS: {
                  $sum: { $gt: ['$semulaJumlahGigiKekalPerluFs', '0'] },
                },
                perluFsBilGigiFailed: {
                  $sum: { $gt: ['$jumlahGigiFsGagal', '0'] },
                },
                perluFvMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $gt: ['$baruJumlahGigiKekalPerluFv', '0'],
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
                        $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFvGigiB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [{ $gt: ['$baruJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFvGigiS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1MuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', 0] },
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
                            $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1GigiB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1GigiS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluTampalanAntGdB: {
                  $sum: {
                    $gt: ['$baruGDAnteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAntGdS: {
                  $sum: {
                    $gt: [
                      '$semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAntGkB: {
                  $sum: {
                    $gt: ['$baruGKAnteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAntGkS: {
                  $sum: {
                    $gt: [
                      '$semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGdB: {
                  $sum: {
                    $gt: ['$baruGDPosteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanPosGdS: {
                  $sum: {
                    $gt: [
                      '$semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGkB: {
                  $sum: {
                    $gt: ['$baruGKPosteriorSewarnaJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanPosGkS: {
                  $sum: {
                    $gt: [
                      '$semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGdB: {
                  $sum: {
                    $gt: ['$baruGDPosteriorAmalgamJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAmgGdS: {
                  $sum: {
                    $gt: [
                      '$semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGkB: {
                  $sum: {
                    $gt: ['$baruGKPosteriorAmalgamJumlahTampalanDiperlukan', 0],
                  },
                },
                perluTampalanAmgGkS: {
                  $sum: {
                    $gt: [
                      '$semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                telahFSMuridB: {
                  $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', 0] },
                },
                telahFSMuridS: {
                  $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', 0] },
                },
                telahFSGigiB: {
                  $sum: { $gt: ['$baruJumlahGigiKekalDibuatFs', 0] },
                },
                telahFSGigiS: {
                  $sum: { $gt: ['$semulaJumlahGigiKekalDibuatFs', 0] },
                },
                telahFvMuridB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahFvMuridS: {
                  $sum: {
                    $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahFvGigiB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahFvGigiS: {
                  $sum: {
                    $and: [{ $gt: ['$semulaJumlahGigiKekalDiberiFv', 0] }],
                  },
                },
                telahPRR1MuridB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', 0] }],
                  },
                },
                telahPRR1MuridS: {
                  $sum: {
                    $and: [
                      { $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', 0] },
                    ],
                  },
                },
                telahPRR1GigiB: {
                  $sum: {
                    $and: [{ $gt: ['$baruJumlahGigiKekalDiberiPrrJenis1', 0] }],
                  },
                },
                telahPRR1GigiS: {
                  $sum: {
                    $and: [
                      { $gt: ['$semulaJumlahGigiKekalDiberiPrrJenis1', 0] },
                    ],
                  },
                },
                telahTampalanAntGdB: {
                  $sum: {
                    $gt: ['$gdBaruAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAntGdS: {
                  $sum: {
                    $gt: ['$gdSemulaAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAntGkB: {
                  $sum: {
                    $gt: ['$gkBaruAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAntGkS: {
                  $sum: {
                    $gt: ['$gkSemulaAnteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGdB: {
                  $sum: {
                    $gt: ['$gdBaruPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGdS: {
                  $sum: {
                    $gt: ['$gdSemulaPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGkB: {
                  $sum: {
                    $gt: ['$gkBaruPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanPosGkS: {
                  $sum: {
                    $gt: ['$gkSemulaPosteriorSewarnaJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGdB: {
                  $sum: {
                    $gt: ['$gdBaruPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGdS: {
                  $sum: {
                    $gt: ['$gdSemulaPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGkB: {
                  $sum: {
                    $gt: ['$gkBaruPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                telahTampalanAmgGkS: {
                  $sum: {
                    $gt: ['$gkSemulaPosteriorAmalgamJumlahTampalanDibuat', 0],
                  },
                },
                cabutanGd: {
                  $sum: '$cabutDesidusPenyataAkhir2',
                },
                cabutanGk: {
                  $sum: '$cabutKekalPenyataAkhir2',
                },
                penskaleran: {
                  $sum: '$penskaleranPenyataAkhir2',
                },
                caseCompletedICDAS: {
                  //kena finish E; cabutan ;scaling ; tampanlan
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$kesSelesaiIcdasPenyataAkhir2', true],
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
                        $eq: ['$skorGisMulutOralHygiene', '0'],
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
                        $eq: ['$skorGisMulutOralHygiene', '1'],
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
                        $eq: ['$skorGisMulutOralHygiene', '2'],
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
                        $eq: ['$skorGisMulutOralHygiene', '3'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                toothSurfaceLoss: {
                  $sum: '$toothSurfaceLossTrauma',
                },
                traumaTisuLembut: {
                  $sum: '$tisuLembutTrauma',
                },
                traumaTisuKeras: {
                  $sum: '$tisuKerasTrauma',
                },
                pesakitAdaFullDentureAtas: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitAdaPartialDentureAtas: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitPerluFullDentureAtas: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
                pesakitPerluPartialDentureAtas: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
                pesakitAdaFullDentureBawah: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitAdaPartialDentureBawah: {
                  $sum: '$yaTidakSediaAdaStatusDenture',
                },
                pesakitPerluFullDentureBawah: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
                pesakitPerluPartialDentureBawah: {
                  $sum: '$yaTidakPerluStatusDenture',
                },
              },
            },
          ],
          callback
        );
      },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
    },
    async function (err, results) {
      console.log(results);
      try {
        let filename = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'PG201A.xlsx'
        );
        console.log('getting workbook: ' + filename);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PG201A');
        console.log('setting row1');
        let rowNamaKlinik = worksheet.getRow(7);
        rowNamaKlinik.getCell(9).value = 'Kelinik Gigi';
        rowNamaKlinik.commit();

        let rowNamaSekolah = worksheet.getRow(8);
        rowNamaSekolah.getCell(9).value = results.resultPG201A[0]._id;
        rowNamaSekolah.commit();
        console.log('setting sekolah name: ' + results.resultPG201A[0]._id);

        let rowNamaJenis = worksheet.getRow(9);
        rowNamaJenis.getCell(9).value = 'PBSR';
        rowNamaJenis.commit();

        //PG201A
        // Reten Sekolah (Darjah 1)
        let rowNew = worksheet.getRow(17);
        rowNew.getCell(2).value =
          results.resultPG201A[0].engganKedatanganPendaftaran; //Kedatangan enggan (Darjah 1)
        rowNew.getCell(3).value = results.resultPG201A[0].kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 1)
        rowNew.getCell(4).value = results.resultPG201A[0].enrolmen; //Kedatangan enrolmen (Darjah 1)
        rowNew.getCell(5).value = results.resultPG201A[0].jumlahKedatanganBaru; //Kedatangan baru (Darjah 1)
        rowNew.getCell(6).value =
          results.resultPG201A[0].jumlahKedatanganUlangan; //Kedatangan ulangan (Darjah 1)
        rowNew.getCell(8).value = results.resultPG201A[0].skorPlakA; //Kebersihan Mulut Skor A (Darjah 1)
        rowNew.getCell(9).value = results.resultPG201A[0].jumlahd; //Karies Gigi Desidus (d) (Darjah 1)
        rowNew.getCell(10).value = results.resultPG201A[0].jumlahf; //Telah Ditampal Gigi Desidus (f) (Darjah 1)
        rowNew.getCell(11).value = results.resultPG201A[0].jumlahx; //Gigi Desidus Perlu Ditampal (x) (Darjah 1)
        rowNew.getCell(13).value = results.resultPG201A[0].jumlahE; //Karies Awal Gigi Kekal (E) (Darjah 1)
        rowNew.getCell(14).value = results.resultPG201A[0].jumlahD; //Karies Gigi Kekal (D) (Darjah 1)
        rowNew.getCell(15).value = results.resultPG201A[0].jumlahM; //Gigi Kekal Telah Dicabut (M) (Darjah 1)
        rowNew.getCell(16).value = results.resultPG201A[0].jumlahF; //Gigi Kekal Telah Ditampal (F) (Darjah 1)
        rowNew.getCell(17).value = results.resultPG201A[0].jumlahX; //Jumlah DMFX (Darjah 1)
        rowNew.getCell(19).value =
          results.resultPG201A[0].gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 1)
        rowNew.getCell(20).value =
          results.resultPG201A[0].totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.resultPG201A[0].0  (Darjah 1)
        rowNew.getCell(21).value = results.resultPG201A[0].eMoreThanZero; //E≥1 (ada karies awal) (Darjah 1)
        rowNew.getCell(22).value = results.resultPG201A[0].jumlahMBK; //Mulut Bebas Karies (MBK) (Darjah 1)
        rowNew.getCell(23).value = results.resultPG201A[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.resultPG201A[0].0 (Darjah 1)
        rowNew.getCell(24).value =
          results.resultPG201A[0].statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 1)
        rowNew.getCell(25).value = results.resultPG201A[0].dfxEqualToZero; //dfx=0 (Darjah 1)
        rowNew.getCell(26).value = results.resultPG201A[0].jumlahMBG; //Mulut Bebas Gingivitis (MBG) (Darjah 1)
        rowNew.getCell(27).value = results.resultPG201A[0].jumlahTprICDAS; //TPR ICDAS (Darjah 1)
        rowNew.getCell(28).value =
          results.resultPG201A[0].kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 1)
        rowNew.getCell(29).value = results.resultPG201A[0].cleftAda; //cleft Ada (Darjah 1)
        rowNew.getCell(30).value = results.resultPG201A[0].cleftRujuk; //cleft Rujuk (Darjah 1)
        rowNew.getCell(32).value = results.resultPG201A[0].perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(33).value = results.resultPG201A[0].perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(34).value = results.resultPG201A[0].perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 1)
        rowNew.getCell(35).value = results.resultPG201A[0].perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(36).value = results.resultPG201A[0].perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(37).value = results.resultPG201A[0].perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(38).value = results.resultPG201A[0].perluPRR1GigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(39).value = results.resultPG201A[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(40).value = results.resultPG201A[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(41).value = results.resultPG201A[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(42).value = results.resultPG201A[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(43).value = results.resultPG201A[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(44).value = results.resultPG201A[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(46).value = results.resultPG201A[0].telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(47).value = results.resultPG201A[0].telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(48).value = results.resultPG201A[0].telahFvMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(49).value = results.resultPG201A[0].telahFvGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(50).value = results.resultPG201A[0].telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(51).value = results.resultPG201A[0].telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(52).value = results.resultPG201A[0].telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(53).value = results.resultPG201A[0].telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(54).value = results.resultPG201A[0].telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(55).value = results.resultPG201A[0].telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(56).value = results.resultPG201A[0].telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(57).value = results.resultPG201A[0].telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(59).value = results.resultPG201A[0].cabutanGd; // Gigi Desidus Dicabut (Darjah 1)
        rowNew.getCell(60).value = results.resultPG201A[0].cabutanGk; // Gigi Kekal Dicabut (Darjah 1)
        rowNew.getCell(61).value = results.resultPG201A[0].penskaleran; // Penskelaran (Darjah 1)
        rowNew.getCell(62).value = results.resultPG201A[0].caseCompletedICDAS; // Kes Selesai ICDAS (Darjah 1)
        rowNew.getCell(63).value = results.resultPG201A[0].skorGIS0; // GIS SKOR 0 (Darjah 1)
        rowNew.getCell(64).value = results.resultPG201A[0].skorGIS1; // GIS SKOR 1 (Darjah 1)
        rowNew.getCell(65).value = results.resultPG201A[0].skorGIS2; // GIS SKOR 2 (Darjah 1)
        rowNew.getCell(66).value = results.resultPG201A[0].skorGIS3; // GIS SKOR 3 (Darjah 1)
        rowNew.getCell(68).value = results.resultPG201A[0].toothSurfaceLoss; // Trauma Tooth Surface Loss (Darjah 1)
        rowNew.getCell(69).value = results.resultPG201A[0].traumaTisuLembut; // Trauma Tisu Lembut (Darjah 1)
        rowNew.getCell(70).value = results.resultPG201A[0].traumaTisuKeras; // Trauma Tisu Keras (Darjah 1)
        rowNew.getCell(72).value =
          results.resultPG201A[0].pesakitAdaFullDentureAtas; // Pesakit Ada Full Denture Atas(Darjah 1)
        rowNew.getCell(73).value =
          results.resultPG201A[0].pesakitAdaPartialDentureAtas; // Pesakit Ada Partial Denture Atas (Darjah 1)
        rowNew.getCell(74).value =
          results.resultPG201A[0].pesakitPerluFullDentureAtas; // Pesakit Perlu Full Denture Atas (Darjah 1)
        rowNew.getCell(75).value =
          results.resultPG201A[0].pesakitPerluPartialDentureAtas; // Pesakit Perlu Partial Denture Atas (Darjah 1)
        rowNew.commit();
        console.log('setting row2');
        let rowNew2 = worksheet.getRow(18);
        rowNew2.getCell(8).value = results.resultPG201A[0].skorPlakC; //Kebersihan Mulut Skor C (Darjah 1)
        rowNew2.commit();
        console.log('setting row3');
        let rowNew3 = worksheet.getRow(19);
        rowNew3.getCell(8).value = results.resultPG201A[0].skorPlakE; //Kebersihan Mulut Skor E (Darjah 1)
        rowNew3.getCell(33).value = results.resultPG201A[0].perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 1)
        rowNew3.getCell(35).value = results.resultPG201A[0].perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(36).value = results.resultPG201A[0].perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(37).value = results.resultPG201A[0].perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(38).value = results.resultPG201A[0].perluPRR1GigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(39).value = results.resultPG201A[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(40).value = results.resultPG201A[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(41).value = results.resultPG201A[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(42).value = results.resultPG201A[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(43).value = results.resultPG201A[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(44).value = results.resultPG201A[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(46).value = results.resultPG201A[0].telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(47).value = results.resultPG201A[0].telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(48).value = results.resultPG201A[0].telahFvMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(49).value = results.resultPG201A[0].telahFvGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(50).value = results.resultPG201A[0].telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(51).value = results.resultPG201A[0].telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(52).value = results.resultPG201A[0].telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(53).value = results.resultPG201A[0].telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(54).value = results.resultPG201A[0].telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(55).value = results.resultPG201A[0].telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(56).value = results.resultPG201A[0].telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(57).value = results.resultPG201A[0].telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(72).value =
          results.resultPG201A[0].pesakitAdaFullDentureBawah; // Pesakit Ada Full Denture Bawah (Darjah 1)
        rowNew3.getCell(73).value =
          results.resultPG201A[0].pesakitAdaPartialDentureBawah; // Pesakit Ada Partial Denture Bawah (Darjah 1)
        rowNew3.getCell(74).value =
          results.resultPG201A[0].pesakitPerluFullDentureBawah; // Pesakit Perlu Full Denture Bawah (Darjah 1)
        rowNew3.getCell(75).value =
          results.resultPG201A[0].pesakitPerluPartialDentureBawah; // Pesakit Perlu Partial Denture Bawah (Darjah 1)
        rowNew3.commit();
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
exports.testFunction201SMKP = function (req, res) {
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPG201SMKP: function (callback) {
        Sekolah.aggregate(
          [
            { $match: { statusRawatan: 'selesai' } },
            {
              $group: {
                _id: '$createdByDaerah',
                engganKedatanganPendaftaran: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$engganKedatanganPendaftaran', true],
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
                        $eq: ['$tidakHadirKedatanganPendaftaran', true],
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
                jumlahKedatanganUlangan: {
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
                skorPlakA: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$kebersihanMulutOralHygiene', 'A'],
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
                        $eq: ['$kebersihanMulutOralHygiene', 'C'],
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
                        $eq: ['$kebersihanMulutOralHygiene', 'E'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahd: { $sum: '$dAdaGigiDesidus' },
                jumlahf: { $sum: '$fAdaGigiDesidus' },
                jumlahx: { $sum: '$xAdaGigiDesidus' },
                jumlahD: { $sum: '$dAdaGigiKekal' },
                jumlahM: { $sum: '$mAdaGigiKekal' },
                jumlahF: { $sum: '$fAdaGigiKekal' },
                jumlahX: { $sum: '$xAdaGigiKekal' },
                gigiKekalDMFXsamaAtauKurangDari3: {
                  //DMFX ≤ 3
                  $sum: {
                    $cond: [
                      {
                        $lte: [
                          {
                            $add: [
                              '$dAdaGigiKekal',
                              '$mAdaGigiKekal',
                              '$fAdaGigiKekal',
                              '$xAdaGigiKekal',
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
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
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
                        $and: [
                          { $eq: ['$dAdaGigiDesidus', 0] },
                          { $eq: ['$mAdaGigiDesidus', 0] },
                          { $eq: ['$fAdaGigiDesidus', 0] },
                          { $eq: ['$xAdaGigiDesidus', 0] },
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
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
                          { $eq: ['$dAdaGigiDesidus', 0] },
                          { $eq: ['$fAdaGigiDesidus', 0] },
                          { $eq: ['$xAdaGigiDesidus', 0] },
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
                        $and: [{ $eq: ['$skorGisMulutOralHygiene', '0'] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                tpr: {
                  //TPR can be considered if (f/F >1 +/- m/M >1 +/- SM>1); cannot claim TPR if d/D > 1 or x/X > 1 or GIS skor 1 or 3
                  //no mixed dentition ; dx =0 ; sm = 0 ; fm >=0; GIS skor 0 or 2
                  //mixed dentition ; dfmx =0 ; DMFX = 0 ; sm = 0 ; GIS skor 0 or 2
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$dAdaGigiDesidus', 0] },
                          { $gte: ['$mAdaGigiKekal', 0] },
                          { $gte: ['$mAdaGigiDesidus', 0] },
                          { $gte: ['$fAdaGigiKekal', 0] },
                          { $gte: ['$fAdaGigiDesidus', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiDesidus', 0] },
                          {
                            $or: [
                              { $eq: ['$skorGisMulutOralHygiene', '0'] },
                              { $eq: ['$skorGisMulutOralHygiene', '2'] },
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
                  $sum: { $toDouble: '$kecederaanGigiAnteriorTrauma' },
                },
                cleftAda: {
                  $sum: { $toDouble: '$adaCleftLip' },
                },
                cleftRujuk: {
                  $sum: { $toDouble: '$rujukCleftLip' },
                },
                perluFSMuridB: {
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
                              { $gte: ['$baruJumlahGigiKekalPerluFs', 1] },
                              { $gte: ['$semulaJumlahGigiKekalPerluFs', 1] },
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFSGigiB: { $sum: '$baruJumlahGigiKekalPerluFs' },
                perluFSGigiB: { $sum: '$baruJumlahGigiKekalPerluFs' },
                perluFSGigiS: { $sum: '$semulaJumlahGigiKekalPerluFs' },
                perluFsBilGigiFailed: { $sum: '$jumlahGigiFsGagal' },
                perluTampalanAntGdB: {
                  $sum: '$baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanAntGdS: {
                  $sum: '$semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanAntGkB: {
                  $sum: '$baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanAntGkS: {
                  $sum: '$semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanPosGdB: {
                  $sum: '$baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanPosGdS: {
                  $sum: '$semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanPosGkB: {
                  $sum: '$baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanPosGkS: {
                  $sum: '$semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
                },
                perluTampalanAmgGdB: {
                  $sum: '$baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
                },
                perluTampalanAmgGdS: {
                  $sum: '$semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
                },
                perluTampalanAmgGkB: {
                  $sum: '$baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
                },
                perluTampalanAmgGkS: {
                  $sum: '$semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
                },
                telahFSMuridB: {
                  $sum: {
                    $cond: [{ $gt: ['$baruJumlahGigiKekalDibuatFs', 0] }, 1, 0],
                  },
                },
                telahFSMuridS: {
                  $sum: {
                    $cond: [
                      { $gt: ['$semulaJumlahGigiKekalDibuatFs', 0] },
                      1,
                      0,
                    ],
                  },
                },
                telahFSGigiB: { $sum: '$baruJumlahGigiKekalDibuatFs' },
                telahFSGigiS: { $sum: '$semulaJumlahGigiKekalDibuatFs' },
                telahTampalanAntGdB: {
                  $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanAntGdS: {
                  $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanAntGkB: {
                  $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanAntGkS: {
                  $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanPosGdB: {
                  $sum: '$gdBaruPosteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanPosGdS: {
                  $sum: '$gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanPosGkB: {
                  $sum: '$gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanPosGkS: {
                  $sum: '$gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
                },
                telahTampalanAmgGdB: {
                  $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                },
                telahTampalanAmgGdS: {
                  $sum: '$gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                },
                telahTampalanAmgGkB: {
                  $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                },
                telahTampalanAmgGkS: {
                  $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                },
                cabutanGd: {
                  $sum: '$cabutDesidusPenyataAkhir2',
                },
                cabutanGk: {
                  $sum: '$cabutKekalPenyataAkhir2',
                },
                penskaleran: {
                  $sum: '$penskaleranPenyataAkhir2',
                },
                caseCompleted: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$kesSelesaiPenyataAkhir2', true],
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
                        $eq: ['$skorGisMulutOralHygiene', '0'],
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
                        $eq: ['$skorGisMulutOralHygiene', '1'],
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
                        $eq: ['$skorGisMulutOralHygiene', '2'],
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
                        $eq: ['$skorGisMulutOralHygiene', '3'],
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
    async function (err, results) {
      {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting Data',
            error: err,
          });
        }
        console.log(results);
        return res.json(results);
      }
    }
  );
};
exports.testFunctionPPIM04 = async function (req, res) {
  const semuaPelajar = await Sekolah.find({
    namaSekolah: req.query.sekolah,
  });
  for (i = 0; i < semuaPelajar.length; i++) {
    console.log(semuaPelajar[i].namaPelajar);
    console.log(semuaPelajar[i].kelas);
    console.log(semuaPelajar[i].tarikh1);
    console.log(semuaPelajar[i].tarikh2);
    console.log(semuaPelajar[i].tarikh3);
    console.log(semuaPelajar[i].tarikh4);
    console.log(semuaPelajar[i].adaTiadaQ);
    console.log(semuaPelajar[i].tarikhQ);
    // console.log(semuaPelajar.length);
    console.log(semuaPelajar[i].statusSelepas6Bulan);
  }
  return;
};
exports.testFunctionBegin = function (req, res) {
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultbudakBEGIN: function (callback) {
        Sekolah.aggregate(
          [
            // jenis fasiliti mungkin erkm
            {
              $match: {
                $and: [
                  { statusRawatan: 'selesai' },
                  { jenisFasiliti: 'taska/tadika/dll' },
                ],
              },
            },
            {
              $group: {
                _id: '$createdByDaerah',
                jumlahBuatBegin: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2',
                              true,
                            ],
                          },
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'baru-kedatangan-pendaftaran',
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahRisikoRendah: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'rendah',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahRisikoSederhana: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'sederhana',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahRisikoTinggi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'tinggi',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahKanak2BuatBegin: {
                  $sum: {
                    $yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2,
                  },
                },
              },
            },
          ],
          callback
        );
      },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultbudakBEGINtahun2keatas: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                $and: [
                  { statusRawatan: 'selesai' },
                  { jenisFasiliti: 'taska/tadika/dll' },
                ],
              },
            },
            {
              $group: {
                _id: '$createdByDaerah',
                jumlahKanak2BuatBeginBaru: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2',
                              true,
                            ],
                          },
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'baru-kedatangan-pendaftaran',
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahRisikoRendah: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'rendah',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahRisikoSederhana: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'sederhana',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahRisikoTinggi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$tinggiRendahRisikoSekolahPendaftaran',
                          'tinggi',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahKanakHiRiskBuatBegin: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2',
                              true,
                            ],
                          },
                          {
                            $eq: [
                              '$tinggiRendahRisikoSekolahPendaftaran',
                              'tinggi',
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
          ],
          callback
        );
      },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultfasilitiBEGIN: function (callback) {
        Fasiliti.aggregate(
          [
            {
              $match: {
                $and: [{ jenisFasiliti: 'taska/tadika/dll' }],
              },
            },
            {
              $group: {
                _id: '$createdByDaerah',
                jumlahFasiliti: { $sum: 1 },
                jumlahFasilitiBegin: {
                  $sum: '$melakukanBegin',
                },
              },
            },
          ],
          callback
        );
      },
    },
    async function (err, results) {
      {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting Data',
            error: err,
          });
        }
        console.log(results);
        return res.json(results);
      }
    }
  );
};
exports.testFunctionMMI = function (req, res) {
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultMMI: function (callback) {
        Sekolah.aggregate(
          [
            // jenis fasiliti mungkin erkm
            {
              $match: {
                $and: [
                  { statusRawatan: 'selesai' },
                  { jenisFasiliti: 'taska/tadika/dll' },
                ],
              },
            },
            {
              $group: {
                _id: '$createdByDaerah',
                jumlahD: { $sum: '$dAdaGigiKekal' },
                eMoreThanZero: {
                  //E≥1 (ada karies awal)
                  $sum: {
                    $cond: [
                      {
                        $and: [{ $gte: ['$eAdaGigiKekal', 1] }],
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
                          { $eq: ['$dAdaGigiKekal', 0] },
                          { $eq: ['$mAdaGigiKekal', 0] },
                          { $eq: ['$fAdaGigiKekal', 0] },
                          { $eq: ['$xAdaGigiKekal', 0] },
                          { $gte: ['$eAdaGigiKekal', 1] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFSMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluFs', 0] },
                          {
                            $gt: ['$semulaJumlahGigiKekalPerluFs', '0'],
                          },
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'baru-kedatangan-pendaftaran',
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
                  $sum: { $gt: ['$baruJumlahGigiKekalPerluFs', '0'] },
                },
                perluFSGigiS: {
                  $sum: { $gt: ['$semulaJumlahGigiKekalPerluFs', '0'] },
                },
                perluFvMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $gt: ['$baruJumlahGigiKekalPerluFv', '0'],
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
                        $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFvGigiB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [{ $gt: ['$baruJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluFvGigiS: {
                  $sum: {
                    $cond: [
                      {
                        $and: [{ $gt: ['$semulaJumlahGigiKekalPerluFv', 0] }],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1MuridB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', 0] },
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
                            $gt: ['$semulaJumlahGigiKekalPerluPrrJenis1', 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1GigiB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perluPRR1GigiB: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: ['$baruJumlahGigiKekalPerluPrrJenis1', 0],
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
          ],
          callback
        );
      },
    },
    async function (err, results) {
      {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting Data',
            error: err,
          });
        }
        console.log(results);
        return res.json(results);
      }
    }
  );
};
exports.testFunctionFV1 = function (req, res) {
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultFV1: function (callback) {
        Sekolah.aggregate(
          [
            // jenis fasiliti mungkin erkm
            {
              $match: {
                $and: [
                  { statusRawatan: 'selesai' },
                  { namaSekolah: 'taska/tadika/dll' },
                ],
              },
            },
            {
              $group: {
                _id: '$namaSekolah',
                jumlahKedatanganBaru: {
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
                jumlahMBK: {
                  //MBK
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$dAdaGigiDesidus', 0],
                      },
                      1,
                      0,
                    ],
                  },
                },
                klinikYgMelayani: '$handler',
              },
            },
          ],
          callback
        );
      },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
    },
    async function (err, results) {
      {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting Data',
            error: err,
          });
        }
        console.log(results);
        return res.json(results);
      }
    }
  );
};
exports.testFunctionPG211 = function (req, res) {
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPG211: function (callback) {
        Umum.aggregate(
          [
            {
              $match: { $umur: { $gt: 0 } },
            },
            {
              $group: {
                _id: '$namaSekolah',
                jumlahKedatanganBaru: {
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
                jkbLelaki: {
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
                            $eq: ['$jantina', 'lelaki'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbPerempuan: {
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
                            $eq: ['$jantina', 'perempuan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbMelayu: {
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
                            $eq: ['$kumpulanEtnik', 'melayu'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbCina: {
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
                            $eq: ['$kumpulanEtnik', 'cina'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbIndia: {
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
                            $eq: ['$kumpulanEtnik', 'india'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbBajau: {
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
                            $eq: ['$kumpulanEtnik', 'bajau'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbDusun: {
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
                            $eq: ['$kumpulanEtnik', 'dusun'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbKadazan: {
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
                            $eq: ['$kumpulanEtnik', 'kadazan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbMurut: {
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
                            $eq: ['$kumpulanEtnik', 'murut'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbBSabahL: {
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
                            $eq: ['$kumpulanEtnik', 'bumiputera-sabah-lain'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbMelanau: {
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
                            $eq: ['$kumpulanEtnik', 'melanau'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbKedayan: {
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
                            $eq: ['$kumpulanEtnik', 'kedayan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbIban: {
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
                            $eq: ['$kumpulanEtnik', 'iban'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbBSwakLain: {
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
                            $eq: ['$kumpulanEtnik', 'bumiputera-sarawak-lain'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbOrangAsli: {
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
                            $eq: ['$kumpulanEtnik', 'orang-asli'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbLain2: {
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
                            $eq: ['$kumpulanEtnik', 'lain-lain'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbWarganegara: {
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
                            $eq: ['$kumpulanEtnik', 'bukan-warganegara'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbIbuMengandung: {
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
                            $eq: ['$kategoriPesakit', 'hamil'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbBersekolah: {
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
                              { $eq: ['$kategoriPesakit', 'sekolahmenengah'] },
                              { $eq: ['$kategoriPesakit', 'sekolahrendah'] },
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbOKU: {
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
                            $eq: ['$kategoriPesakit', 'oku'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbPesaraKerajaan: {
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
                            $eq: ['$statusPesara', 'kerajaan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbPesaraATM: {
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
                            $eq: ['$statusPesara', 'atm'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbRujDalam: {
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
                            $eq: ['$rujukDaripada', 'dalaman'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbRujKP: {
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
                            $eq: ['$rujukDaripada', 'kp'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbRujKK: {
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
                            $eq: ['$rujukDaripada', 'kk'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbRujHospital: {
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
                            $eq: ['$rujukDaripada', 'hospital'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbRujSwasta: {
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
                            $eq: ['$rujukDaripada', 'swasta'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbRujLain2: {
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
                            $eq: ['$rujukDaripada', 'lain2'],
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
                jkbLelaki: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$jantina', 'lelaki'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuPerempuan: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$jantina', 'perempuan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuMelayu: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'melayu'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuCina: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'cina'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuIndia: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'india'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuBajau: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'bajau'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuDusun: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'dusun'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuKadazan: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'kadazan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuMurut: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'murut'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuBSabahL: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'bumiputera-sabah-lain'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuMelanau: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'melanau'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuKedayan: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'kedayan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuIban: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'iban'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuBSwakLain: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'bumiputera-sarawak-lain'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuOrangAsli: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'orang-asli'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuLain2: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'lain-lain'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuWarganegara: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kumpulanEtnik', 'bukan-warganegara'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuIbuMengandung: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kategoriPesakit', 'hamil'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuBersekolah: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $or: [
                              { $eq: ['$kategoriPesakit', 'sekolahmenengah'] },
                              { $eq: ['$kategoriPesakit', 'sekolahrendah'] },
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuOKU: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$kategoriPesakit', 'oku'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuPesaraKerajaan: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$statusPesara', 'kerajaan'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuPesaraATM: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$statusPesara', 'atm'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuRujDalam: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$rujukDaripada', 'dalaman'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuRujKP: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$rujukDaripada', 'kp'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuRujKK: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$rujukDaripada', 'kk'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuRujHospital: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$rujukDaripada', 'hospital'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuRujSwasta: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$rujukDaripada', 'swasta'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkuRujLain2: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'ulangan-kedatangan-pendaftaran',
                            ],
                          },
                          {
                            $eq: ['$rujukDaripada', 'lain2'],
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
          ],
          callback
        );
      },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
    },
    async function (err, results) {
      {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting Data',
            error: err,
          });
        }
        console.log(results);
        return res.json(results);
      }
    }
  );
};
exports.testFunction4 = function (req, res) {
  //PPIM 05
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPPIM05: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                $and: [
                  { statusRawatan: 'selesai' },
                  { namaSekolah: 'sekolah kebangsaan kebangsaan alor janggus' },
                ],
              },
            },
            {
              $group: {
                _id: '$namaSekolah',

                perokok: {
                  $sum: {
                    $cond: [{ $eq: ['$statusM', 'perokokSemasa'] }, 1, 0],
                  },
                },

                //    Untuk tindakan seterusnya kalau dah add consent di form.

                //  sertaiIntervensi: { // tak dapat buat currently concern is how to know their consent?
                //     $sum: {
                //       $cond: [
                //         {$eq: [//consent'#setuju?' ,true false]},
                //         1,
                //         0,
                //       ],
                //       },

                intervensi3WithQDate: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$adaTiadaQ', true, 'tarikhQ'] },
                          {
                            $or: [
                              { $eq: ['tarikh1', '$tarikh2', 'tarikh3'] },
                              {
                                $eq: [
                                  'tarikh1',
                                  '$tarikh2',
                                  'tarikh3',
                                  'tarikh4',
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

                intervensi3NoQDate: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$adaTiadaQ', false] },
                          {
                            $or: [
                              { $eq: ['tarikh1', '$tarikh2', 'tarikh3'] },
                              {
                                $eq: [
                                  'tarikh1',
                                  '$tarikh2',
                                  'tarikh3',
                                  'tarikh4',
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

                intervensiLess3WithQDate: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$adaTiadaQ', true] },
                          {
                            $or: [
                              { $eq: ['tarikh1', '$tarikh2'] },
                              { $eq: ['tarikh1'] },
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                intervensiLess3NoQDate: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$adaTiadaQ', false] },
                          {
                            $or: [
                              { $eq: ['tarikh1', '$tarikh2'] },
                              { $eq: ['tarikh1'] },
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                dirujukKaunseling: {
                  $sum: {
                    $cond: [{ $eq: ['$dirujukKaunseling', true] }, 1, 0],
                  },
                },

                berhentiRokok6Bulan: {
                  $sum: {
                    $cond: [
                      { $eq: ['$statusSelepas6Bulan', 'berhenti'] },
                      1,
                      0,
                    ],
                  },

                  masihRokok6Bulan: {
                    $sum: {
                      $cond: [
                        { $eq: ['$statusSelepas6Bulan', 'tidakberhenti'] },
                        1,
                        0,
                      ],
                    },
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
    async function (err, results) {
      {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting Data',
            error: err,
          });
        }
        console.log(results);
        return res.json(results);
      }
    }
  );
};
exports.testFunction5 = function (req, res) {
  //CPPC 2
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultCPPC2: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                $and: [
                  { statusRawatan: 'selesai' },
                  { namaSekolah: 'sekolah kebangsaan kebangsaan alor janggus' },
                ],
              },
            },
            {
              $group: {
                _id: '$namaSekolah',

                // dfStatus: {
                //   $sum: {['$dAdaGigiKekal','fAdaGigiKekal'] },
                // },

                dfStatus: {
                  $sum: ['$dAdaGigiKekal', 'fAdaGigiKekal'],
                },

                cIcIIstatus: {
                  $sum: ['$classID', 'classIID', 'classIF', 'classIIF'],
                },
                cIstatus: {
                  $sum: ['$classID', 'classIF'],
                },
              },
            },
          ],
          callback
        );
      },
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
    },
    async function (err, results) {
      {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting Data',
            error: err,
          });
        }
        console.log(results);
        return res.json(results);
      }
    }
  );
};
exports.testFunction6 = function (req, res) { //PG207
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPG207: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                $and: [
                  { $eq:['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran']},
                  { $le:['$umur',1]},
                ],
              },
            }, 
            {
              $group: {
                _id: '$namaSekolah',
           
                kedatanganTahunSemasa: { //how to gorek data? by row? or by column?
                  $sum: {
                    $cond: [{$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},1,0,],
                  },
                },
                sapuanFluorida: { //fvMuridB 
                  $sum: {
                    $cond: [
                        { $and: [
                          { $eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran']},
                          { $or: [
                              {$gt:['$baruJumlahGigiKekalDiberiFv',0]},
                              {$gt:['$semulaJumlahGigiKekalDiberiFv',0]},
                            ],},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                prrJenis1: { //prrJ1MuridB 
                  $sum: {
                    $cond: [
                        { $and: [
                          { $eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran']},
                          { $or: [
                              {$gt:['$baruJumlahGigiKekalDiberiPrrJenis1',0]},
                              {$gt:['$semulaJumlahGigiKekalDiberiPrrJenis1',0]},
                            ],},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                muridBaruFS: { //FSmuridBaru (Problem to be solve)
                  $sum: {
                    $cond: [
                        { $and: [
                          //{ $eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran']},
                          //to add button to know patient's previous FS status on that year ; 
                          //kalau pt pernah buat FS on the same year ; then kira ulangan. 
                          { $gte: ['$baruJumlahGigiKekalDibuatFs',1]},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                muridSemulaFS: { //FSmuridSemula (Problem to be solve)
                  $sum: {
                    $cond: [
                        { $and: [
                          //{ $eq: ['$baruUlanganKedatanganPendaftaran','ulangan-kedatangan-pendaftaran']},
                          //to add button to know patient's previous FS status on that year ; 
                          //kalau pt pernah buat FS on the same year ; then kira ulangan. 
                          { $gte: ['$semulaJumlahGigiKekalDibuatFs',1]},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                gigiBaruFS: { $sum: ['$baruJumlahGigiKekalDibuatFs']},
                gigiSemulaFS: { $sum: ['$semulaJumlahGigiKekalDibuatFs']},
                tampalanAntGdBaru: { $sum: ['$gdBaruAnteriorSewarnaJumlahTampalanDibuat']},
                tampalanAntGdSemula: { $sum: ['$gdSemulaAnteriorSewarnaJumlahTampalanDibuat']},
                tampalanAntGkBaru: { $sum:['$gkBaruAnteriorSewarnaJumlahTampalanDibuat']},
                tampalanAntGkSemula: { $sum: ['$gkSemulaAnteriorSewarnaJumlahTampalanDibuat']},
                tampalanPostGdBaru: { $sum: ['$gdBaruPosteriorSewarnaJumlahTampalanDibuat']},
                tampalanPostGdSemula: {$sum: ['$gdSemulaPosteriorSewarnaJumlahTampalanDibuat']},
                tampalanPostGkBaru: { $sum: ['$gkBaruPosteriorSewarnaJumlahTampalanDibuat']},
                tampalanPostGkSemula: { $sum: ['$gkSemulaPosteriorSewarnaJumlahTampalanDibuat']},
                tampalanPostAmgGdBaru: { $sum:['$gdBaruPosteriorAmalgamJumlahTampalanDibuat']},
                tampalanPostAmgGdSemula:{ $sum:['$gdSemulaPosteriorAmalgamJumlahTampalanDibuat']},
                tampalanPostAmgGkBaru: { $sum:['$gkBaruPosteriorAmalgamJumlahTampalanDibuat']},
                tampalanPostAmgGkSemula: { $sum:['$gkSemulaPosteriorAmalgamJumlahTampalanDibuat']},
                //inlayOnlayBaru: { $sum: ['$baruInlayOnlayJumlahTampalanDibuatRawatanUmum']},     //data sudah dpt dari form umum
                //inlayOnlaySemula: { $sum: ['$semulaInlayOnlayJumlahTampalanDibuatRawatanUmum']}, //data sudah dpt dari form umum
                tampalanSementara: { $sum: ['$jumlahTampalanSementaraPenyataAkhir2']},
                cabutanGd: { $sum:['$cabutDesidusPenyataAkhir2']},
                cabutanGk: { $sum:['$cabutKekalPenyataAkhir2']},
                //komplikasiSelepasCabutan :{ $sum:['$komplikasiSelepasCabutanRawatanUmum']}   //data sudah dpt dari form umum
                penskaleran: { $sum:['$penskaleranPenyataAkhir2']},
                //rawatanPerioLain: { $sum:['$rawatanLainPeriodontikRawatanUmum']},            //data sudah dpt dari form umum
                rawatanEndo: {$sum:['$pulpotomiPenyataAkhir2','$endodontikPenyataAkhir2']},            
                //rawatanOrtho: {$sum:['$rawatanOrtho']},                     //data nanty gorek dari form umum
                //kesPerubatan:{$sum:['$kesPerubatanMulutPenyata??']},        //data nanty gorek dari form umum
                absesBaru:{          //data sini campur sekolah form & umum form. blh ke? 
                  $sum:{
                    $cond:[ 
                      {$and:[
                        { $eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran']},
                        { $eq: ['$yaTidakAbsesPembedahanRawatanUmum',true]}, 
                        { $eq: ['$baruSemulaAbsesPembedahanRawatanUmum',true]}
                      ],},
                      1,
                      0,
                    ],},
                },
                AbsesSemula:{       //data sini campur sekolah form & umum form. blh ke?
                  $sum:{
                    $cond:[ 
                      {$and:[
                        { $eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran']},
                        { $eq: ['$yaTidakAbsesPembedahanRawatanUmum',true]}, 
                        { $eq: ['$baruSemulaAbsesPembedahanRawatanUmum',false]}
                      ],},
                      1,
                      0,
                    ]
                  },
                },
                cabutanSurgical:{ $sum:['$cabutanSurgikalPembedahanMulutRawatanUmum']},     //data dari form umum
                fraktur: {
                  $sum:{
                    $cond:[
                      { $eq:['$yaTidakFrakturPembedahanRawatanUmum',true]},
                      1,
                      0,
                    ]
                  },
                },
                trauma: {
                  $sum:{
                    $cond:[
                      { $eq:['$yaTidakTraumaPembedahanRawatanUmum',true]},
                      1,
                      0,
                    ]
                  },
                },  
                pembedahanKecilMulut:{
                  $sum:{
                    $cond:[
                      { $eq:['$yaTidakPembedahanKecilMulutPembedahanRawatanUmum',true]},
                      1,
                      0,
                    ]
                  },
                },
                crownBridgeBaru:{$sum:['$baruJumlahCrownBridgeRawatanUmum']},
                crownBridgeSemula:{$sum:['$semulaJumlahCrownBridgeRawatanUmum']},
                postCoreBaru:{$sum:['$baruJumlahPostCoreRawatanUmum']},
                postCoreSemula:{sum:['$semulaJumlahPostCoreRawatanUmum']},
                prosthodontikPenuhDentur:{$sum:['$penuhJumlahDenturProstodontikRawatanUmum']},
                //prosthodontikPenuhPesakit:{$sum:['$penuhJumlahDenturProstodontikRawatanUmum']}, // cari jalan lagi
                prosthodontikSebahagianDentur:{$sum:['$sebahagianJumlahDenturProstodontikRawatanUmum']},
                //prosthodontikSebahagianPesakit:{$sum:['$sebahagianJumlahDenturProstodontikRawatanUmum']}, //cari jalan lagi 
                immediateDenture:{$sum:['$immediateDenturProstodontikRawatanUmum']},
                pembaikanDenture:{$sum:['$pembaikanDenturProstodontikRawatanUmum']},
                kesSelesai:{
                  $sum:{
                    $cond:[
                      {$eq:['$kesSelesaiRawatanUmum',true]},
                      1,
                      0,
                    ]},
                  },
                xrayDiambil:{$sum:['$bilanganXrayYangDiambilRawatanUmum']},
                pesakitDisaringOC: {
                  $sum:{
                    $cond:[
                      {$eq:['$disaringProgramKanserMulutPemeriksaanUmum', true]},
                      1,
                      0,
                    ],
                  },
                },
                pesakitdirujukLesiMulut: {
                  $sum:{
                    $cond:[
                      {$eq:['$dirujukProgramKanserMulutPemeriksaanUmum', true]},
                      1,
                      0,
                    ],
                  },
                },
                pesakitDirujukTabiat: {
                  $sum:{
                    $cond:[
                      {$eq:['$tabiatBerisikoTinggiPemeriksaanUmum', true]},
                      1,
                      0,
                    ],
                  },
                },
                rokokSaringNasihat: {
                  $sum: {
                    $cond:[
                      {$or:[
                        {$eq: ['jenisRUmum','perokokSemasa']},
                        {$eq: ['jenisRUmum','bekasPerokok']},
                        {$eq: ['jenisRUmum','perokokPasif']},
                        {$eq: ['jenisRUmum','bukanPerokok']},]
                      },
                      1,
                      0,
                    ],
                  },
                },
              // rokokIntervensi:
              //   $sum:{
              //     $cond:[
              },
          },
            ],
            callback
          );
        },
        // break line to add more aggregate. please add this break line if you are using multiple aggregate
      },
      async function (err, results) {
        {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Error when getting Data',
              error: err,
            });
          }
          console.log(results);
          return res.json(results);
        }
      }
      );
};


exports.testFunctionPG214 = function (req, res) {
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPG214: function (callback) {
        Umum.aggregate(
          [
            {
              $match: { $umur: { $gt: 0 } },
            },
            {
              $group: {
                _id: '$namaSekolah',
                  // nanty tulis formula to classify umur:

                jkbMelayu: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'melayu'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbCina: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'cina'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbIndia: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'india'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbBajau: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'bajau'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbDusun: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'dusun'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbKadazan: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'kadazan'],},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                jkbMurut: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'murut'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbBSabahL: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'bumiputera-sabah-lain'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbMelanau: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'melanau'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbKedayan: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'kedayan'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbIban: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'iban'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bidayuh:{ 
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'bidayuh'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbBSwakLain: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'bumiputera-sarawak-lain'],},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                jkbOrangAsli: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'orang-asli'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbLain2: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'lain-lain'],},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                jkbWarganegara: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$kumpulanEtnik', 'bukan-warganegara'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbLelaki: {
                  $sum: {
                    $cond: [
                      {$and: [
                          { $eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          { $eq: ['$jantina', 'lelaki'],},
                        ],},
                      1,
                      0,
                    ],
                  },
                },
                jkbPerempuan: {
                  $sum: {
                    $cond: [
                      {$and: [
                          {$eq: ['$baruUlanganKedatanganPendaftaran','baru-kedatangan-pendaftaran',],},
                          {$eq: ['$jantina', 'perempuan'],},
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                edentulous: {
                  $sum:{
                    $cond: [
                      {$eq: ['$edentulousWargaEmasPemeriksaanUmum',true]},1,0,],
                  }
                },
                edentulous: {
                  $sum:{
                    $cond: [
                      {$eq: ['$edentulousWargaEmasPemeriksaanUmum',true]},1,0,],
                  }
                },
                gigiSamaAtauLebihDari20Batang: {
                  $sum:{
                    $cond:[
                      {$eq: ['$mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum', true]},1,0,],
                  },
                },
                gigiKurangDari20Batang:{ 
                  $sum:{
                    $cond:[
                      {$eq: ['$mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum', false]},1,0,],
                  },
                },
                bilGigi:{ //macam mana nak tolak gigi? 
                  $sum:{
                    $subtract:{'$mAdaGigiKekalPemeriksaanUmum':[32]}
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
        async function (err, results) {
          {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: 'Error when getting Data',
                error: err,
              });
            }
            console.log(results);
            return res.json(results);
          }
        }
        );
  };
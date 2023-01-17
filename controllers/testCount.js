const fs = require('fs');
const path = require('path');
const async = require('async');
const Excel = require('exceljs');
const Sekolah = require('../models/Sekolah');
const Umum = require('../models/Umum');
const Pemeriksaan = require('../models/Pemeriksaansekolah');
const Rawatan = require('../models/Rawatansekolah');
const Kotak = require('../models/Kotaksekolah');

// aspose

// const aspose = require('aspose.cells');

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
                statusRawatan: 'selesai',
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
                  //   $sum: '$yaTidakSediaAdaStatusDenture',
                  // },
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$separaPenuhAtasSediaAdaDenture',
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
                          '$separaPenuhAtasSediaAdaDenture',
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
                          '$separaPenuhAtasPerluDenture',
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
                          '$separaPenuhAtasPerluDenture',
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
                          '$separaPenuhBawahSediaAdaDenture',
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
                          '$separaPenuhBawahSediaAdaDenture',
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
                          '$separaPenuhAtasPerluDenture',
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
                          '$separaPenuhAtasPerluDenture',
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
exports.testFunctionPPIM04 = function (req, res) {
  //PPIM 03
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPPIM03: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                $eq: [
                  '$baruUlanganKedatanganPendaftaran',
                  'baru-kedatangan-pendaftaran',
                ],
                //{ $lt: ['$umur', 1] }, Kena asingkan sama ada darjah atau tingkatan
              },
            },
            {
              $group: {
                _id: '$namaSekolah',

                perokokLelakiMelayu: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'lelaki'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          { $eq: ['$bangsa', 'melayu'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokLelakiCina: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'lelaki'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          { $eq: ['$bangsa', 'cina'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokLelakiIndia: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'lelaki'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          { $eq: ['$bangsa', 'india'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                perokokLelakiLainLain: {
                  // lain-lain di sini
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'lelaki'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          ////  kena tapiskan untuk lain2 { $eq: ['$bangsa', 'lainlain'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                perokokPerempuanMelayu: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'perempuan'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          { $eq: ['$bangsa', 'melayu'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokPerempuanCina: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'perempuan'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          { $eq: ['$bangsa', 'cina'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokPerempuanIndia: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'perempuan'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          { $eq: ['$bangsa', 'india'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                perokokPerempuanLainLain: {
                  // lain-lain di sini
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$jantina:', 'perempuan'] },
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          ////  kena tapiskan untuk lain2 { $eq: ['$bangsa', 'lainlain'] },
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
                        $eq: ['$jenisR', 'rokokB'],
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
                        $eq: ['$jenisR', 'elektronik'],
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
                        $eq: ['$jenisR', 'shisha'],
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
                        $eq: ['$jenisR', 'lain2'],
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
                          { $eq: ['$jantina:', 'lelaki'] },
                          { $eq: ['$statusM', 'bekasPerokok'] },
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
                          { $eq: ['$jantina:', 'perempuan'] },
                          { $eq: ['$statusM', 'bekasPerokok'] },
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
                          { $eq: ['$jantina:', 'lelaki'] },
                          { $eq: ['$statusM', 'perokokPasif'] },
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
                          { $eq: ['$jantina:', 'perempuan'] },
                          { $eq: ['$statusM', 'perokokPasif'] },
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
                          { $eq: ['$jantina:', 'lelaki'] },
                          { $eq: ['$statusM', 'bukanPerokok'] },
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
                          { $eq: ['$jantina:', 'perempuan'] },
                          { $eq: ['$statusM', 'bukanPerokok'] },
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
exports.testFunctionPPIM05 = function (req, res) {
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
exports.testFunctionCPPC2 = function (req, res) {
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
                      {
                        $and: [
                          {
                            $eq: [
                              '$baruUlanganKedatanganPendaftaran',
                              'baru-kedatangan-pendaftaran',
                            ],
                          },
                          { $eq: ['$kumpulanEtnik', 'melayu'] },
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
                          { $eq: ['$kumpulanEtnik', 'cina'] },
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
                          { $eq: ['$kumpulanEtnik', 'india'] },
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
                          { $eq: ['$kumpulanEtnik', 'bajau'] },
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
                          { $eq: ['$kumpulanEtnik', 'dusun'] },
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
                          { $eq: ['$kumpulanEtnik', 'kadazan'] },
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
                          { $eq: ['$kumpulanEtnik', 'murut'] },
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
                          { $eq: ['$kumpulanEtnik', 'bumiputera-sabah-lain'] },
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
                          { $eq: ['$kumpulanEtnik', 'melanau'] },
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
                          { $eq: ['$kumpulanEtnik', 'kedayan'] },
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
                          { $eq: ['$kumpulanEtnik', 'iban'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bidayuh: {
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
                          { $eq: ['$kumpulanEtnik', 'bidayuh'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jkbPenan: {
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
                          { $eq: ['$kumpulanEtnik', 'Penan'] },
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
                          { $eq: ['$kumpulanEtnik', 'orang-asli'] },
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
                          { $eq: ['$kumpulanEtnik', 'lain-lain'] },
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
                          { $eq: ['$kumpulanEtnik', 'bukan-warganegara'] },
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
                          { $eq: ['$jantina', 'lelaki'] },
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
                          { $eq: ['$jantina', 'perempuan'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                edentulous: {
                  $sum: {
                    $cond: [
                      { $eq: ['$edentulousWargaEmasPemeriksaanUmum', true] },
                      1,
                      0,
                    ],
                  },
                },
                edentulous: {
                  $sum: {
                    $cond: [
                      { $eq: ['$edentulousWargaEmasPemeriksaanUmum', true] },
                      1,
                      0,
                    ],
                  },
                },
                gigiSamaAtauLebihDari20Batang: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
                          true,
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                gigiKurangDari20Batang: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum',
                          false,
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bilGigi: {
                  //macam mana nak tolak gigi?
                  $sum: {
                    $subtract: { $mAdaGigiKekalPemeriksaanUmum: [32] },
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
//PGPRO01
exports.testFunctionPGPro01Pindah2FFR = function (req, res) {
  //PGPRO01 Pind.2 - 2022 - FFR
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPGPro01Pindah2FFR: function (callback) {
        Sekolah.aggregate(
          //Event.aggregate
          [
            {
              $match: {
                statusRawatan: 'selesai',
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
          'PGPRO01 Pind2_2022 FFR .xlsx'
        );
        console.log('getting workbook: ' + filename);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGPro01');
        console.log('setting row1');

        //PGPRO01 Pind.2 2022
        //KOlaborasi bersama agensi awam/swasta / NGO
        let rowNew = worksheet.get(15);
        rowNew.getCell(3).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiCeramahBaru; //C15
        rowNew.getCell(4).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaCeramahBaru; //D15
        rowNew.getCell(5).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiCeramahUlangan; //E15
        rowNew.getCell(6).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaCeramahUlangan; //F15
        rowNew.getCell(7).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiBaruLMG; //G15
        rowNew.getCell(8).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaBaruLMG; //H15
        rowNew.getCell(9).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiUlanganLMG; //I15
        rowNew.getCell(10).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaUlanganLMG; //J15
        rowNew.getCell(11).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiPerananKempen; //K15
        rowNew.getCell(12).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaPerananKempen; //L15
        rowNew.getCell(13).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiBoneka; //M15
        rowNew.getCell(14).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaBoneka; //N15
        rowNew.getCell(15).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiPeranan; //O15
        rowNew.getCell(16).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaPeranan; //P15
        rowNew.getCell(17).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiBercerita; //Q15
        rowNew.getCell(18).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaBercerita; //R15
        rowNew.getCell(19).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiPertandingan; //S15
        rowNew.getCell(20).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaPertandingan; //T15
        rowNew.getCell(21).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiInteraktif; //U15
        rowNew.getCell(22).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaInteraktif; //V15
        rowNew.getCell(23).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiKursusSeminarBengkel; //W15
        rowNew.getCell(24).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaKursusSeminarBengkel; //X15
        rowNew.getCell(25).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiMultimedia; //Y15
        rowNew.getCell(26).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaMultimedia; //Z15
        rowNew.getCell(27).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiDentalBuskers; //AA15
        rowNew.getCell(28).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaDentalBuskers; //AB15
        rowNew.getCell(29).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiFlashMob; //AC15
        rowNew.getCell(30).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaFlashMob; //AD15
        rowNew.getCell(31).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiLawatanRumah; //AE15
        rowNew.getCell(32).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaLawatanRumah; //AF15
        rowNew.getCell(33).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiPlaqueOHE; //AG15
        rowNew.getCell(34).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaPlaqueOHE; //AH15
        rowNew.getCell(35).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiOHI; //AI15
        rowNew.getCell(36).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaOHI; //AJ15
        rowNew.getCell(37).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiDietAdvice; //AK15
        rowNew.getCell(38).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaDietAdvice; //AL15
        rowNew.getCell(39).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiKanserMulutOHE; //AM15
        rowNew.getCell(40).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaKanserMulutOHE; //AN15
        rowNew.getCell(41).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAKtivitiHentiRokok; //AO15
        rowNew.getCell(42).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaHentiRokok; //AP15
        rowNew.getCell(43).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiHentiSirih; //AQ15
        rowNew.getCell(44).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaHentiSirih; //AR15
        rowNew.getCell(45).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiHentiAlkohol; //AS15
        rowNew.getCell(46).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaHentiAlkohol; //AT15
        rowNew.getCell(47).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiHentiTabiatLain; //AU15
        rowNew.getCell(48).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaHentiTabiatLain; //AV15
        rowNew.getCell(51).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiTelevisyen; //AY15
        rowNew.getCell(52).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaTelevisyen; //AZ15
        rowNew.getCell(53).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiRadio; //BA15
        rowNew.getCell(54).value =
          results.resultPGPro01Pindah2FFR[0].jumlahPesertaRadio; //BB15
        rowNew.getCell(55).value =
          results.resultPGPro01Pindah2FFR[0].jumlahAktivitiCetak; //BC15
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

// //Reten Toddler 02 (Pind. 1/2022)
const Toddler02 = async (payload) => {
  let match_stage_pemeriksaan = [];

  //pemeriksaan
  const match_pemeriksaan_below_4years = {
    $match: {
      kedatangan: 'baru-kedatangan',
      umur: { $lte: 4 },
    },
  };
  const match_pemeriksaan_Taska = { $match: { jenisFasiliti: 'taska' } };
  const match_pemeriksaan_Tadika = { $match: { jenisFasiliti: 'tadika' } };
  const match_pemeriksaan_kkiaKD = { $match: { jenisFasiliti: 'kkiakd' } };
  const match_pemeriksaan_pesakit_luar = { $match: { jenisFasiliti: 'kp' } };
  const match_pemeriksaan_komuniti_Program = {
    $match: { jenisFasiliti: 'program' },
  };
  match_stage_pemeriksaan.push(match_pemeriksaan_below_4years);
  match_stage_pemeriksaan.push(match_pemeriksaan_Taska);
  match_stage_pemeriksaan.push(match_pemeriksaan_Tadika);
  match_stage_pemeriksaan.push(match_pemeriksaan_kkiaKD);
  match_stage_pemeriksaan.push(match_pemeriksaan_pesakit_luar);
  match_stage_pemeriksaan.push(match_pemeriksaan_komuniti_Program);

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
      //perlu rawatan
      jumlahd: {
        $sum: '$dAdaGigiDesidusPemeriksaanUmum',
      },
      jumlahf: {
        $sum: '$fAdaGigiDesidusPemeriksaanUmum',
      },
      jumlahx: {
        $sum: '$xAdaGigiDesidusPemeriksaanUmum',
      },
      jumlahDFXkosong: {
        //MBK
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kedatangan', 'baru-kedatangan'] },
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
      TPR: {
        //TPR toddler - d = 0 ; x = 0 ; GIS = 0 / 2
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
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
            1,
            0,
          ],
        },
      },
      perluSapuanFV: {
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
      faktorRiskoRendah: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ['$kedatangan', 'baru-kedatangan'] },
                { $gte: ['$jumlahFaktorRisikoPemeriksaanUmum', '0'] },
                { $lte: ['$jumlahFaktorRisikoPemeriksaanUmum', '2'] },
                { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
              ],
            },
            1,
            0,
          ],
        },
      },
      faktorRiskoSederhana: {
        //formula kena cross check semula
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$jumlahFaktorRisikoPemeriksaanUmum', 0] },
                    {
                      $gte: [
                        '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
                        1,
                      ],
                    },
                    { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                    { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$jumlahFaktorRisikoPemeriksaanUmum', 1] },
                    {
                      $gte: [
                        '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
                        1,
                      ],
                    },
                    { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                    { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$jumlahFaktorRisikoPemeriksaanUmum', 2] },
                    {
                      $gte: [
                        '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
                        1,
                      ],
                    },
                    { $gte: ['$fvPerluSapuanPemeriksaanUmum', 1] },
                    { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 1] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$jumlahFaktorRisikoPemeriksaanUmum', 3] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                    {
                      $eq: ['$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum', 0],
                    },
                    { $eq: ['$fvPerluSapuanPemeriksaanUmum', 0] },
                    { $eq: ['$baruJumlahGigiKekalPerluFSRawatanUmum', 0] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$jumlahFaktorRisikoPemeriksaanUmum', 0] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', 1] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
      faktorRiskoTinggi: {
        //formula kena cross check semula
        $sum: {
          $cond: [
            {
              $or: [
                {
                  $and: [
                    { $eq: ['$jumlahFaktorRisikoPemeriksaanUmum', '1'] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', '1'] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', '1'] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', '1'] },
                  ],
                },
                {
                  $and: [
                    { $eq: ['$jumlahFaktorRisikoPemeriksaanUmum', '2'] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', '1'] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', '1'] },
                    { $gte: ['$dAdaGigiDesidusPemeriksaanUmum', '1'] },
                  ],
                },
                {
                  $and: [
                    { $gte: ['$jumlahFaktorRisikoPemeriksaanUmum', '3'] },
                    {
                      $gte: [
                        '$baruJumlahGigiKekalPerluPRRJenis1RawatanUmum',
                        '1',
                      ],
                    },
                    { $gte: ['$fvPerluSapuanPemeriksaanUmum', '1'] },
                    { $gte: ['$baruJumlahGigiKekalPerluFSRawatanUmum', '1'] },
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
      kedatanganTahunSemasaUlangan: '$kedatanganTahunSemasaUlangan',
      jumlahd: '$jumlahd',
      jumlahf: '$jumlahf',
      jumlahx: '$jumlahx',
      jumlahDFXkosong: '$jumlahDFXkosong',
      skorPlakA: '$skorPlakA',
      skorPlakC: '$skorPlakC',
      skorPlakE: '$skorPlakE',
      TPR: '$TPR',
      perluSapuanFV: '$perluJumlahPesaperluSapuanFVkitPrrJenis1',
      faktorRiskoRendah: '$faktorRiskoRendah',
      faktorRiskoSederhana: '$faktorRiskoSederhana',
      faktorRiskoTinggi: '$faktorRiskoTinggi',
    },
  };

  let match_stage = [];

  const match_below_4years = {
    $match: {
      umur: { $lte: 4 },
    },
  };
  const match_rawatan_Taska = {
    $match: {
      jenisFasiliti: 'taska',
    },
  };
  const match_rawatan_Tadika = {
    $match: {
      jenisFasiliti: 'tadika',
    },
  };
  const match_rawatan_kkiaKD = {
    $match: {
      jenisFasiliti: 'kkiakd',
    },
  };
  const match_rawatan_pesakit_luar = {
    $match: {
      jenisFasiliti: 'kp',
    },
  };
  const match_rawatan_komuniti_Program = {
    $match: {
      jenisFasiliti: 'program',
    },
  };

  match_stage_rawatan.push(match_below_4years);
  match_stage_rawatan.push(match_rawatan_Taska);
  match_stage_rawatan.push(match_rawatan_Tadika);
  match_stage_rawatan.push(match_rawatan_kkiaKD);
  match_stage_rawatan.push(match_rawatan_pesakit_luar);
  match_stage_rawatan.push(match_rawatan_komuniti_Program);

  const group = {
    $group: {
      _id: placeModifier(payload),

      //Rawatan
      kkecederaanTisuLembut: {
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
      kecederaanTisuKeras: {
        $sum: {
          $cond: [
            {
              $eq: ['$kecederaanTulangMukaUmum', true],
            },
            1,
            0,
          ],
        },
      },
      telahDibuatFV: {
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
      telahTampalGigiAnterior: {
        $sum: {
          $add: [
            '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
          ],
        },
      },
      telahTampalGigiPosterior: {
        $sum: {
          $add: [
            '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
            '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
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
              $eq: ['$yaTidakAbsesPembedahanRawatanUmum', true],
            },
            1,
            0,
          ],
        },
      },
      jumlahPulpotomi: {
        $sum: {
          $cond: [
            {
              $eq: ['$ektiparsiPulpa', true],
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
      // rawatan
      kecederaanTisuLembut: '$kecederaanTisuLembut',
      kecederaanTisuKeras: '$kecederaanTisuKeras',
      telahDibuatFV: '$telahDibuatFV',
      telahTampalGigiAnterior: '$telahTampalGigiAnterior',
      telahTampalGigiPosterior: '$telahTampalGigiPosterior',
      jumlahCabutan: '$jumlahCabutan',
      jumlahAbses: '$jumlahAbses',
      jumlahPulpotomi: '$jumlahPulpotomi',
    },
  };

  match_stage.push(match);
  project_stage.push(project);

  const pipeline = match_stage.concat(project_stage);

  const data = await Umum.aggregate(pipeline);

  return data;

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
};

//PG307 (Sekolah RETEN selepas PG 101 kena flow ke sini pulak)
exports.testFunctionPG307 = function (req, res) {
  //PG 307 (Pind.2/2022)
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      resultPG307: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                statusRawatan: 'selesai',
              },
            },
            {
              $group: {
                _id: '$namaSekolah',

                //Pendaftaran
                noSiri: '$noSiri',
                nama: '$nama',
                enrolmen: {
                  // ambil dari fasiliti ?
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
                kumpulanEtnik: '$kumpulanEtnik', //tak pasti dye nak "1" atau "perkataan etnik"
                bukanWarganegara: {
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

                //Kedatangan
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

                //Kebersihan Mulut
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

                //Status Gigi Desidus
                jumlahd: { $sum: '$pemeriksaanSekolah.dAdaGigiDesidus' },
                jumlahf: { $sum: '$pemeriksaanSekolah.fAdaGigiDesidus' },
                jumlahx: { $sum: '$pemeriksaanSekolah.xAdaGigiDesidus' },

                //Status Gigi Kekal
                jumlahE: { $sum: '$pemeriksaanSekolah.eAdaGigiKekal' },
                jumlahD: { $sum: '$pemeriksaanSekolah.dAdaGigiKekal' },
                jumlahM: { $sum: '$pemeriksaanSekolah.mAdaGigiKekal' },
                jumlahF: { $sum: '$pemeriksaanSekolah.fAdaGigiKekal' },
                jumlahX: { $sum: '$pemeriksaanSekolah.xAdaGigiKekal' },

                //Status Kesihatan Mulut Murid
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
                  //MBK
                  // Info dari Glossary PG 207
                  // Condition 1: Pesakit baru ; Deciduous teeth only ; dfx = 0
                  // Condition 2: Pesakit baru ; mixed dentition ; dfx = 0  dan  DMFX = 0
                  // Condition 3: Pesakit baru ; no deciduous / kekal (dfx = nil ; DMFX = nil)
                  //formula updated by Leong on 22-12-2022 ; tak pasti formula ini jalan tak ;
                  //tak ubah lagi counthelper PG201 lain. takut tak jalan
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          {
                            $and: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                                  '$rawatanSekolah.tarikhRawatanSemasa',
                                ],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0],
                              },
                            ],
                          },
                          {
                            $and: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                                  '$rawatanSekolah.tarikhRawatanSemasa',
                                ],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0],
                              },
                              { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                            ],
                          },
                          {
                            $and: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                                  '$rawatanSekolah.tarikhRawatanSemasa',
                                ],
                              },
                              { $eq: ['$pemeriksaanSekolah.adaKekal', false] },
                              {
                                $eq: ['$pemeriksaanSekolah.adaDesidus', false],
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
                statusBebasKaries: {
                  //BK
                  //Info dari Glossary PG 207
                  //condition 1: Pesakit baru ; mixed dentition ;  dfx = 0 dan DMFX = 0
                  //condition 2: Pesakit baru ; permanent teeth ; DMFX = 0 ; dfx = nil
                  //condition 3: Pesakit baru ; mixed dentition ; dfx  ≠ 0 ; DMFX = 0
                  //formula updated by Leong on 22-12-2022 ; tak pasti formula ini jalan tak ;
                  //tak ubah lagi counthelper PG201 lain. takut tak jalan
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          {
                            $and: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                                  '$rawatanSekolah.tarikhRawatanSemasa',
                                ],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0],
                              },
                              { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                            ],
                          },
                          {
                            $and: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                                  '$rawatanSekolah.tarikhRawatanSemasa',
                                ],
                              },
                              {
                                $eq: ['$pemeriksaanSekolah.adaDesidus', false],
                              },
                              { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                              { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                            ],
                          },
                          {
                            $and: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.tarikhPemeriksaanSemasa',
                                  '$rawatanSekolah.tarikhRawatanSemasa',
                                ],
                              },
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
                skorBPE0: {
                  $sum: {
                    $cond: [
                      { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '0'] },
                      1,
                      0,
                    ],
                  },
                },
                skorBPE1: {
                  $sum: {
                    $cond: [
                      { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '1'] },
                      1,
                      0,
                    ],
                  },
                },
                skorBPE2: {
                  $sum: {
                    $cond: [
                      { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '2'] },
                      1,
                      0,
                    ],
                  },
                },
                skorBPE3: {
                  $sum: {
                    $cond: [
                      { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '3'] },
                      1,
                      0,
                    ],
                  },
                },
                skorBPE4: {
                  $sum: {
                    $cond: [
                      { $eq: ['$pemeriksaanSekolah.skorBpeOralHygiene', '4'] },
                      1,
                      0,
                    ],
                  },
                },
                jumlahTprMMI: {
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
                jumlahTPR: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$dAdaGigiKekalPemeriksaanUmum', 0] },
                          { $eq: ['$dAdaGigiDesidusPemeriksaanUmum', 0] },
                          { $gte: ['$mAdaGigiKekalPemeriksaanUmum', 0] },
                          { $gte: ['$mAdaGigiDesidusPemeriksaanUmum', 0] },
                          { $gte: ['$fAdaGigiKekalPemeriksaanUmum', 0] },
                          { $gte: ['$fAdaGigiDesidusPemeriksaanUmum', 0] },
                          { $eq: ['$xAdaGigiKekalPemeriksaanUmum', 0] },
                          { $eq: ['$xAdaGigiDesidusPemeriksaanUmum', 0] },
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
                    $toDouble:
                      '$pemeriksaanSekolah.kecederaanGigiAnteriorTrauma',
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
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFv',
                              '0',
                            ],
                          },
                          {
                            $gt: [
                              '$pemeriksaanSekolah.semulaJumlahMuridPerluFv',
                              '0',
                            ],
                          },
                          {
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv',
                              '0',
                            ],
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
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahMuridPerluFs',
                              '0',
                            ],
                          },
                          {
                            $gt: [
                              '$pemeriksaanSekolah.semulaJumlahMuridPerluFs',
                              '0',
                            ],
                          },
                          {
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
                              '0',
                            ],
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

                //Rawatan
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
                caseCompletedMMI: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$rawatanSekolah.kesSelesaiIcdasSekolahRawatan',
                          true,
                        ],
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
                        $eq: [
                          '$rawatanSekolah.kesSelesaiIcdasSekolahRawatan',
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
          'PG307.xlsx'
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
        rowNamaSekolah.getCell(9).value = results.resultPG307[0]._id;
        rowNamaSekolah.commit();
        console.log('setting sekolah name: ' + results.resultPG307[0]._id);

        let rowNamaJenis = worksheet.getRow(9);
        rowNamaJenis.getCell(9).value = 'PBSR';
        rowNamaJenis.commit();

        // PG 307 (Pind.2/2022)
        let rowNew = worksheet.getRow(17);

        //Pendaftaran
        rowNew.getCell(2).value = results.resultPG307[0].noSiri; //Column B (2) - Nombor Siri
        rowNew.getCell(3).value = results.resultPG307[0].nama; //Column C (3) - Nama Murid
        rowNew.getCell(4).value = results.resultPG307[0].enrolmen; // Column D (4) - Enrolmen
        rowNew.getCell(5).value = results.resultPG307[0].kumpulanEtnik; // Column E (5) - Kumpulan Etnik
        rowNew.getCell(6).value = results.resultPG307[0].bukanWarganegara; //Column F (6) - Bukan Warganegara
        rowNew.getCell(7).value = results.resultPG307[0].jumlahLelaki; //Column G (7) - Jantina Lelaki
        rowNew.getCell(8).value = results.resultPG307[0].jumlahPerempuan; //Column H (8) - Jantina Perempuan

        //Kedatangan
        rowNew.getCell(9).value =
          results.resultPG307[0].engganKedatanganPendaftaran; //Column I (9) - Kedatangan Enggan
        rowNew.getCell(10).value = results.resultPG307[0].kedatanganTidakHadir; //Column J (10) - Kedatangan Tidak Hadir
        rowNew.getCell(11).value = results.resultPG307[0].jumlahKedatanganBaru; //Column K (11) - Kedatangan Baru
        rowNew.getCell(12).value =
          results.resultPG307[0].jumlahKedatanganUlangan; //Column L (12) - Kedatangan Ulangan

        //Kebersihan Mulut
        rowNew.getCell(13).value = results.resultPG307[0].skorPlakA; //Column M (13) - Skor Plak A
        rowNew.getCell(14).value = results.resultPG307[0].skorPlakC; //Column N (14) - Skor Plak C
        rowNew.getCell(15).value = results.resultPG307[0].skorPlakE; //Column O (15) - Skor Plak E

        //Status Gigi Desidus
        rowNew.getCell(16).value = results.resultPG307[0].jumlahd; //Column P (16) - jumlah d (dalam dfx)
        rowNew.getCell(17).value = results.resultPG307[0].jumlahf; //Column Q (17) - jumlah f (dalam dfx)
        rowNew.getCell(18).value = results.resultPG307[0].jumlahx; //Column R (18) - jumlah x (dalam dfx)

        //Status Gigi Kekal
        rowNew.getCell(20).value = results.resultPG307[0].jumlahE; //Column T (20) - jumlah E (dalam DMFX)
        rowNew.getCell(21).value = results.resultPG307[0].jumlahD; //Column U (21) - jumlah D (dalam DMFX)
        rowNew.getCell(22).value = results.resultPG307[0].jumlahM; //Column V (22) - Jumlah M (dalam DMFX)
        rowNew.getCell(23).value = results.resultPG307[0].jumlahF; //Column W (23) - jumlah F (dalam DMFX)
        rowNew.getCell(24).value = results.resultPG307[0].jumlahX; //Column X (24) - jumlah X (dalam DMFX)

        //Status Kesihatan Mulut Murid
        rowNew.getCell(26).value = results.resultPG307[0].dfxEqualToZero; //column Z (26) - dfx=0
        rowNew.getCell(27).value = results.resultPG307[0].jumlahMBK; //Column AA (27) - Mulut Bebas Karies (MBK)
        rowNew.getCell(28).value = results.resultPG307[0].statusBebasKaries; //Column AB (28) - Bebas Karies (BK)
        rowNew.getCell(29).value =
          results.resultPG307[0].gigiKekalDMFXsamaAtauKurangDari3; //Column AC (29) - DMFX ≤ 3
        rowNew.getCell(30).value =
          results.resultPG307[0].totalStatusGigiKekalSamaKosong; //Column AD (30) - X+M=0
        rowNew.getCell(31).value = results.resultPG307[0].eMoreThanZero; //Column AE (31) - E ≥ 1
        rowNew.getCell(32).value =
          results.resultPG307[0].statusBebasKariesTapiElebihDariSatu; //Column AF (32) - Bebas Karies tetapi E≥1
        rowNew.getCell(33).value = results.resultPG307[0].skorGIS0; //Column AG (33) - Skor GIS 0
        rowNew.getCell(34).value = results.resultPG307[0].skorGIS1; //Column AH (34) - Skor GIS 1
        rowNew.getCell(35).value = results.resultPG307[0].skorGIS2; //Column AI (35) - Skor GIS 2
        rowNew.getCell(36).value = results.resultPG307[0].skorGIS3; //Column AJ (36) - Skor GIS 3
        rowNew.getCell(37).value = results.resultPG307[0].skorBPE0; //Column AK (37) - Skor BPE 0
        rowNew.getCell(38).value = results.resultPG307[0].skorBPE1; //Column AL (38) - Skor BPE 1
        rowNew.getCell(39).value = results.resultPG307[0].skorBPE2; //Column AM (39) - Skor BPE 2
        rowNew.getCell(40).value = results.resultPG307[0].skorBPE3; //Column AN (40) - Skor BPE 3
        rowNew.getCell(41).value = results.resultPG307[0].skorBPE4; //Column AO (41) - Skor BPE 4
        rowNew.getCell(42).value = results.resultPG307[0].jumlahTprMMI; //Column AP (42) - TPR MMI
        rowNew.getCell(43).value = results.resultPG307[0].jumlahTPR; //Column AQ (43) - TPR
        rowNew.getCell(44).value = results.resultPG307[0].traumaTisuKeras; //Column AR (44) - Trauma - Kecederaan Tulang Muka
        rowNew.getCell(45).value =
          results.resultPG307[0].kecederaanGigiAnterior; //Column AS (45) - Trauma - Kecederaan gigi Anterior
        rowNew.getCell(46).value = results.resultPG307[0].traumaTisuLembut; //Column AT (46) - Trauma - Kecederaan Tisu Lembut
        rowNew.getCell(47).value = results.resultPG307[0].toothSurfaceLoss; //Column AU (47) - Trauma - Tooth Surface Loss (TSL)
        rowNew.getCell(48).value = results.resultPG307[0].cleftAda; //Column AV (48) - Bilangan Murid ada Cleft
        rowNew.getCell(49).value = results.resultPG307[0].cleftRujuk; //Column AW (49) - Bilangan Murid cleft diruujuk

        //Perlu Dibuat
        rowNew.getCell(50).value = results.resultPG307[0].perluFvMurid; //Column AX (50) - Bil. Murid Perlu FV
        rowNew.getCell(51).value = results.resultPG307[0].perluPRR1Murid; //Column AY (51) - Bil. Murid perlu PRR Jenis 1
        rowNew.getCell(52).value = results.resultPG307[0].perluPRR1Gigi; //Column AZ (52) - Bil. Gigi perlu PRR Jenis 1
        rowNew.getCell(53).value = results.resultPG307[0].perluFSMurid; //Column BA (53) - Bil. Murid perlu Fisur Sealant
        rowNew.getCell(54).value = results.resultPG307[0].perluFSGigi; //Column BB (54) - Bil. Gigi perlu Fisur Sealant
        rowNew.getCell(55).value = results.resultPG307[0].perluTampalanAntGdB; //Column BC (55) - Perlu Tampalan Anterior Sewarna Gigi Decidus Baru
        rowNew.getCell(56).value = results.resultPG307[0].perluTampalanAntGdS; //Column BD (56) - Perlu Tampalan Anterior Sewarna Gigi Decidus Semula
        rowNew.getCell(57).value = results.resultPG307[0].perluTampalanAntGkB; //Column BE (57) - Perlu Tampalan Anterior Sewarna Gigi Kekal Baru
        rowNew.getCell(58).value = results.resultPG307[0].perluTampalanAntGkS; //Column BF (58) - Perlu Tampalan Anterior Sewarna Gigi Kekal Semula
        rowNew.getCell(59).value = results.resultPG307[0].perluTampalanPosGdB; //Column BG (59) - Perlu Tampalan Posterior Sewarna Gigi Decidus Baru
        rowNew.getCell(60).value = results.resultPG307[0].perluTampalanPosGdS; //Column BH (60) - Perlu Tampalan Posterior Sewarna Gigi Decidus Semula
        rowNew.getCell(61).value = results.resultPG307[0].perluTampalanPosGkB; //Column BI (61) - Perlu Tampalan Posterior Sewarna Gigi Kekal Baru
        rowNew.getCell(62).value = results.resultPG307[0].perluTampalanPosGkS; //Column BJ (62) - Perlu Tampalan Posterior Sewarna Gigi Kekal Semula
        rowNew.getCell(63).value = results.resultPG307[0].perluTampalanAmgGdB; //Column BK (63) - Perlu Tampalan Posterior Amalgam Gigi Decidus Baru
        rowNew.getCell(64).value = results.resultPG307[0].perluTampalanAmgGdS; //Column BL (64) - Perlu Tampalan Posterior Amalgam Gigi Decidus Semula
        rowNew.getCell(65).value = results.resultPG307[0].perluTampalanAmgGkB; //Column BM (65) - Perlu Tampalan Posterior Amalgam Gigi Kekal Baru
        rowNew.getCell(66).value = results.resultPG307[0].perluTampalanAmgGkS; //Column BN (66) - Perlu Tampalan Posterior Amalgam Gigi Kekal Semula

        //Rawatan
        rowNew.getCell(67).value = results.resultPG307[0].telahFvMurid; //Column BO (67) - Bil. Murid Telah Menerima Fluoride Varnish
        rowNew.getCell(68).value = results.resultPG307[0].telahPRR1Murid; //Column BP (68) - Bil. Murid Telah Menerima PRR Jenis 1
        rowNew.getCell(69).value = results.resultPG307[0].telahPRR1Gigi; //Column BQ (69) - Bil. Gigi Telah Menerima PRR Jenis 1
        rowNew.getCell(70).value = results.resultPG307[0].telahFSMurid; //Column BR (70) - Bil. Murid Telah Menerima Fisur Sealant
        rowNew.getCell(71).value = results.resultPG307[0].telahFSGigi; //Column BS (71) - Bil. Gigi Telah Menerima Fisur Sealant
        rowNew.getCell(72).value = results.resultPG307[0].telahTampalanAntGdB; //Column BT (72) - Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru
        rowNew.getCell(73).value = results.resultPG307[0].telahTampalanAntGdS; //Column BU (73) - Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula
        rowNew.getCell(74).value = results.resultPG307[0].telahTampalanAntGkB; //Column BV (74) - Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru
        rowNew.getCell(75).value = results.resultPG307[0].telahTampalanAntGkS; //Column BW (75) - Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula
        rowNew.getCell(76).value = results.resultPG307[0].telahTampalanPosGdB; //Column BX (76) - Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru
        rowNew.getCell(77).value = results.resultPG307[0].telahTampalanPosGdS; //Column BY (77) - Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula
        rowNew.getCell(78).value = results.resultPG307[0].telahTampalanPosGkB; //Column BZ (78) - Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru
        rowNew.getCell(79).value = results.resultPG307[0].telahTampalanPosGkS; //Column CA (79) - Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula
        rowNew.getCell(80).value = results.resultPG307[0].telahTampalanAmgGdB; //Column CB (80) - Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru
        rowNew.getCell(81).value = results.resultPG307[0].telahTampalanAmgGdS; //Column CC (81) - Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula
        rowNew.getCell(82).value = results.resultPG307[0].telahTampalanAmgGkB; //Column CD (82) - Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru
        rowNew.getCell(83).value = results.resultPG307[0].telahTampalanAmgGkS; //Column CE (83) - Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula
        rowNew.getCell(86).value = results.resultPG307[0].tampalanSementara; //Column CH (86) - Telah Dibuat Tampalan Sementara
        rowNew.getCell(87).value = results.resultPG307[0].cabutanGd; //Column CI (87) - Gigi Desidus Dicabut
        rowNew.getCell(88).value = results.resultPG307[0].cabutanGk; //Column CJ (88) - Gigi Kekal Dicabut
        rowNew.getCell(89).value = results.resultPG307[0].penskaleran; //Column CK (89) - Penskelaran
        rowNew.getCell(90).value = results.resultPG307[0].caseCompletedMMI; //Column CL (90) - Kes Selesai MMI
        rowNew.getCell(91).value = results.resultPG307[0].caseCompleted; //Column CM (91) - Pesakit Ada Full Denture Atas
        rowNew.commit();

        let newfile = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'test-PG307.xlsx'
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
exports.popAndAgg = function (req, res) {
  async.parallel(
    {
      tryingNow: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                kelas: '1 adil',
                kodSekolah: 'YEE7872',
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
                as: 'rawa',
              },
            },
            { $unwind: '$rawa' },
            {
              $lookup: {
                from: Rawatan.collection.name,
                localField: 'rawatanSekolah',
                foreignField: '_id',
                as: 'rawa',
              },
            },
            {
              $group: {
                _id: '$namaSekolah',
                jumlahBudak: { $sum: 1 },
                dAdaGigiKekal: {
                  $sum: '$peme.dAdaGigiKekal',
                },
                FSKekalBaru: {
                  $sum: '$rawa.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                },
                engganKedatanganPendaftaran: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$peme.engganKedatanganPendaftaran', true],
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
                        $eq: ['$peme.tidakHadirKedatanganPendaftaran', true],
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
                        $eq: [
                          '$peme.baruUlanganKedatanganPendaftaran',
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
                          '$peme.baruUlanganKedatanganPendaftaran',
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
                        $eq: ['$peme.kebersihanMulutOralHygiene', 'A'],
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
                        $eq: ['$peme.kebersihanMulutOralHygiene', 'C'],
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
                        $eq: ['$peme.kebersihanMulutOralHygiene', 'E'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jumlahd: { $sum: '$peme.dAdaGigiDesidus' },
                jumlahf: { $sum: '$peme.fAdaGigiDesidus' },
                jumlahx: { $sum: '$peme.xAdaGigiDesidus' },
                jumlahE: { $sum: '$peme.eAdaGigiKekal' },
                jumlahD: { $sum: '$peme.dAdaGigiKekal' },
                jumlahM: { $sum: '$peme.mAdaGigiKekal' },
                jumlahF: { $sum: '$peme.fAdaGigiKekal' },
                jumlahX: { $sum: '$peme.xAdaGigiKekal' },
              },
            },
            // {
            //   $project: {
            //     _id: 0,
            //     namaSekolah: '$_id',
            //     jumlahBudak: '$jumlahBudak',
            //     dAdaGigiKekal: '$dAdaGigiKekal',
            //     FSKekalBaru: '$FSKekalBaru',
            //   },
            // },
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
exports.popAndAgg2 = function (req, res) {
  async.parallel(
    {
      dataPemeriksaan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                kelas: '1 amanah',
                kodSekolah: 'YEE7872',
                // statusRawatan: 'selesai',
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
            // { $unwind: '$rawatanSekolah' },
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
                          '$rawatanSekolah.tarikhPemeriksaanSemasa',
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
                          '$pemeriksaanSekolah.baruUlanganKedatanganPendaftaran',
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
                              '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
                              0,
                            ],
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
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFs',
                      '0',
                    ],
                  },
                },
                perluFSGigiS: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.semulaJumlahGigiKekalPerluFs',
                      '0',
                    ],
                  },
                },
                perluFsBilGigiFailed: {
                  $sum: { $gt: ['$pemeriksaanSekolah.jumlahGigiFsGagal', '0'] },
                },
                perluFvMuridB: {
                  $sum: {
                    $cond: [
                      {
                        $gt: [
                          '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv',
                          '0',
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
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              '$pemeriksaanSekolah.baruJumlahGigiKekalPerluFv',
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
                perluFvGigiS: {
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
                perluPRR1GigiS: {
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
                perluTampalanAntGdB: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAntGdS: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAntGkB: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAntGkS: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGdB: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.baruGDPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGdS: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGkB: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.baruGKPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanPosGkS: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGdB: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.baruGDPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGdS: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGkB: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.baruGKPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
                },
                perluTampalanAmgGkS: {
                  $sum: {
                    $gt: [
                      '$pemeriksaanSekolah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan',
                      0,
                    ],
                  },
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
                  $sum: '$pemeriksaanSekolah.yaTidakSediaAdaStatusDenture',
                },
                pesakitAdaPartialDentureAtas: {
                  $sum: '$pemeriksaanSekolah.separaPenuhAtasSediaAdaDenture',
                },
                pesakitPerluFullDentureAtas: {
                  $sum: '$pemeriksaanSekolah.separaPenuhAtasPerluDenture',
                },
                pesakitPerluPartialDentureAtas: {
                  $sum: '$pemeriksaanSekolah.yaTidakPerluStatusDenture',
                },
                pesakitAdaFullDentureBawah: {
                  $sum: '$pemeriksaanSekolah.yaTidakSediaAdaStatusDenture',
                },
                pesakitAdaPartialDentureBawah: {
                  $sum: '$pemeriksaanSekolah.separaPenuhBawahSediaAdaDenture',
                },
                pesakitPerluFullDentureBawah: {
                  $sum: '$pemeriksaanSekolah.yaTidakPerluStatusDenture',
                },
                pesakitPerluPartialDentureBawah: {
                  $sum: '$pemeriksaanSekolah.separaPenuhBawahPerluDenture',
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
                kelas: '1 amanah',
                kodSekolah: 'YEE7872',
                // statusRawatan: 'selesai',
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
                namaPelajar: '$nama',
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
                      gkBaruPosteriorSewarnaJumlahTampalanDibuat: 1,
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
                          '$$value.tampal',
                          '$$this.baruJumlahGigiKekalDibuatFs',
                        ],
                      },
                      BARU_MuridBuatFs: {
                        $add: [
                          '$$value.tampal',
                          '$$this.baruJumlahMuridDibuatFs',
                        ],
                      },
                      BARU_GgKekalBuatFv: {
                        $add: [
                          '$$value.tampal',
                          '$$this.baruJumlahGigiKekalDiberiFv',
                        ],
                      },
                      BARU_MuridBuatFv: {
                        $add: [
                          '$$value.tampal',
                          '$$this.baruJumlahMuridDiberiFv',
                        ],
                      },
                      BARU_GgKekalBuatPRR1: {
                        $add: [
                          '$$value.tampal',
                          '$$this.baruJumlahGigiKekalDiberiPrrJenis1',
                        ],
                      },
                      BARU_MuridBuatPRR1: {
                        $add: [
                          '$$value.tampal',
                          '$$this.baruJumlahMuridDiberiPrrJenis1',
                        ],
                      },
                      BARU_GgKekalBuatSdf: {
                        $add: [
                          '$$value.tampal',
                          '$$this.baruJumlahGigiYangDiberiSdf',
                        ],
                      },
                      BARU_GgDesidusAnteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      BARU_GgKekalAnteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      BARU_GgDesidusPosteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gdBaruPosteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      BARU_GgKekalPosteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gkBaruPosteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      BARU_GgDesidusPosteriorBuatTampalanAmalgam: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                        ],
                      },
                      BARU_GgKekalPosteriorBuatTampalanAmalgam: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                        ],
                      },
                      //
                      SEMULA_GgKekalBuatFs: {
                        $add: [
                          '$$value.tampal',
                          '$$this.semulaJumlahGigiKekalDibuatFs',
                        ],
                      },
                      SEMULA_MuridBuatFs: {
                        $add: [
                          '$$value.tampal',
                          '$$this.semulaJumlahMuridDibuatFs',
                        ],
                      },
                      SEMULA_GgKekalBuatFv: {
                        $add: [
                          '$$value.tampal',
                          '$$this.semulaJumlahGigiKekalDiberiFv',
                        ],
                      },
                      SEMULA_MuridBuatFv: {
                        $add: [
                          '$$value.tampal',
                          '$$this.semulaJumlahMuridDiberiFv',
                        ],
                      },
                      SEMULA_GgKekalBuatPRR1: {
                        $add: [
                          '$$value.tampal',
                          '$$this.semulaJumlahGigiKekalDiberiPrrJenis1',
                        ],
                      },
                      SEMULA_MuridBuatPRR1: {
                        $add: [
                          '$$value.tampal',
                          '$$this.semulaJumlahMuridDiberiPrrJenis1',
                        ],
                      },
                      SEMULA_GgKekalBuatSdf: {
                        $add: [
                          '$$value.tampal',
                          '$$this.semulaJumlahGigiYangDiberiSdf',
                        ],
                      },
                      SEMULA_GgDesidusAnteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      SEMULA_GgKekalAnteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      SEMULA_GgDesidusPosteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gdSemulaPosteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      SEMULA_GgKekalPosteriorBuatTampalanSewarna: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gkSemulaPosteriorSewarnaJumlahTampalanDibuat',
                        ],
                      },
                      SEMULA_GgDesidusPosteriorBuatTampalanAmalgam: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                        ],
                      },
                      SEMULA_GgKekalPosteriorBuatTampalanAmalgam: {
                        $add: [
                          '$$value.tampal',
                          '$$this.gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                        ],
                      },
                      //
                      cabutDesidus: {
                        $add: [
                          '$$value.cabut',
                          '$$this.cabutDesidusSekolahRawatan',
                        ],
                      },
                      cabutKekal: {
                        $add: [
                          '$$value.cabut',
                          '$$this.cabutKekalSekolahRawatan',
                        ],
                      },
                      tampalanSementara: {
                        $add: [
                          '$$value.cabut',
                          '$$this.jumlahTampalanSementaraSekolahRawatan',
                        ],
                      },
                      pulpotomi: {
                        $add: [
                          '$$value.cabut',
                          '$$this.pulpotomiSekolahRawatan',
                        ],
                      },
                      endodontik: {
                        $add: [
                          '$$value.cabut',
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
                  $sum: '$rawatanYgDilakukan.tampalanSementara',
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
async function generatePG201(jenisReten, sekolah, klinik) {
  async.parallel(
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
        //
        let rowNamaKlinik = worksheet.getRow(7);
        // let klinikFixed = results.dataPemeriksan[0].createdByKp;
        // klinikFixed = klinikFixed
        //   .toLowerCase()
        //   .split(' ')
        //   .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        //   .join(' ');
        rowNamaKlinik.getCell(9).value = 'Klinik Gigi';
        rowNamaKlinik.commit();
        // console.log('setting klinik name: ' + klinikFixed);
        //
        let rowNamaSekolah = worksheet.getRow(8);
        let sekolahFixed = results.dataPemeriksaan[0]._id;
        rowNamaSekolah.getCell(9).value = sekolahFixed;
        sekolahFixed = sekolahFixed
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
        rowNamaSekolah.getCell(9).value = sekolahFixed;
        rowNamaSekolah.commit();
        console.log('setting sekolah name: ' + sekolahFixed);
        //
        let rowNamaJenis = worksheet.getRow(9);
        rowNamaJenis.getCell(9).value = 'PBSR';
        rowNamaJenis.commit();

        //PG201A
        // Reten Sekolah (Darjah 1)
        let rowNew = worksheet.getRow(17);
        rowNew.getCell(2).value =
          results.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan enggan (Darjah 1)
        rowNew.getCell(3).value =
          results.dataPemeriksaan[0].kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 1)
        rowNew.getCell(4).value = results.dataPemeriksaan[0].enrolmen; //Kedatangan enrolmen (Darjah 1)
        rowNew.getCell(5).value =
          results.dataPemeriksaan[0].jumlahKedatanganBaru; //Kedatangan baru (Darjah 1)
        rowNew.getCell(6).value =
          results.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangan ulangan (Darjah 1)
        rowNew.getCell(8).value = results.dataPemeriksaan[0].skorPlakA; //Kebersihan Mulut Skor A (Darjah 1)
        rowNew.getCell(9).value = results.dataPemeriksaan[0].jumlahd; //Karies Gigi Desidus (d) (Darjah 1)
        rowNew.getCell(10).value = results.dataPemeriksaan[0].jumlahf; //Telah Ditampal Gigi Desidus (f) (Darjah 1)
        rowNew.getCell(11).value = results.dataPemeriksaan[0].jumlahx; //Gigi Desidus Perlu Ditampal (x) (Darjah 1)
        rowNew.getCell(13).value = results.dataPemeriksaan[0].jumlahE; //Karies Awal Gigi Kekal (E) (Darjah 1)
        rowNew.getCell(14).value = results.dataPemeriksaan[0].jumlahD; //Karies Gigi Kekal (D) (Darjah 1)
        rowNew.getCell(15).value = results.dataPemeriksaan[0].jumlahM; //Gigi Kekal Telah Dicabut (M) (Darjah 1)
        rowNew.getCell(16).value = results.dataPemeriksaan[0].jumlahF; //Gigi Kekal Telah Ditampal (F) (Darjah 1)
        rowNew.getCell(17).value = results.dataPemeriksaan[0].jumlahX; //Jumlah DMFX (Darjah 1)
        rowNew.getCell(19).value =
          results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 1)
        rowNew.getCell(20).value =
          results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.dataPemeriksaan[0].0  (Darjah 1)
        rowNew.getCell(21).value = results.dataPemeriksaan[0].eMoreThanZero; //E≥1 (ada karies awal) (Darjah 1)
        rowNew.getCell(22).value = results.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) (Darjah 1)
        rowNew.getCell(23).value = results.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.dataPemeriksaan[0].0 (Darjah 1)
        rowNew.getCell(24).value =
          results.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 1)
        rowNew.getCell(25).value = results.dataPemeriksaan[0].dfxEqualToZero; //dfx=0 (Darjah 1)
        rowNew.getCell(26).value = results.dataPemeriksaan[0].jumlahMBG; //Mulut Bebas Gingivitis (MBG) (Darjah 1)
        rowNew.getCell(27).value = results.dataPemeriksaan[0].jumlahTprICDAS; //TPR ICDAS (Darjah 1)
        rowNew.getCell(28).value =
          results.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 1)
        rowNew.getCell(29).value = results.dataPemeriksaan[0].cleftAda; //cleft Ada (Darjah 1)
        rowNew.getCell(30).value = results.dataPemeriksaan[0].cleftRujuk; //cleft Rujuk (Darjah 1)
        rowNew.getCell(32).value = results.dataPemeriksaan[0].perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(33).value = results.dataPemeriksaan[0].perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(34).value =
          results.dataPemeriksaan[0].perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 1)
        rowNew.getCell(35).value = results.dataPemeriksaan[0].perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(36).value = results.dataPemeriksaan[0].perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(37).value = results.dataPemeriksaan[0].perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(38).value = results.dataPemeriksaan[0].perluPRR1GigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(39).value =
          results.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(40).value =
          results.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(41).value =
          results.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(42).value =
          results.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(43).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(44).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(46).value = results.dataRawatan[0].BARU_MuridBuatFs; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(47).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(48).value = results.dataRawatan[0].BARU_MuridBuatFv; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(49).value = results.dataRawatan[0].BARU_GgKekalBuatFv; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(50).value = results.dataRawatan[0].BARU_MuridBuatPRR1; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(51).value = results.dataRawatan[0].BARU_GgKekalBuatPRR1; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(52).value =
          results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(53).value =
          results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(54).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(55).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(56).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(57).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(59).value = results.dataRawatan[0].cabutDesidus; // Gigi Desidus Dicabut (Darjah 1)
        rowNew.getCell(60).value = results.dataRawatan[0].cabutKekal; // Gigi Kekal Dicabut (Darjah 1)
        rowNew.getCell(61).value = results.dataRawatan[0].penskaleran; // Penskelaran (Darjah 1)
        rowNew.getCell(62).value = results.dataRawatan[0].caseCompletedICDAS; // Kes Selesai ICDAS (Darjah 1)
        rowNew.getCell(63).value = results.dataPemeriksaan[0].skorGIS0; // GIS SKOR 0 (Darjah 1)
        rowNew.getCell(64).value = results.dataPemeriksaan[0].skorGIS1; // GIS SKOR 1 (Darjah 1)
        rowNew.getCell(65).value = results.dataPemeriksaan[0].skorGIS2; // GIS SKOR 2 (Darjah 1)
        rowNew.getCell(66).value = results.dataPemeriksaan[0].skorGIS3; // GIS SKOR 3 (Darjah 1)
        rowNew.getCell(68).value = results.dataPemeriksaan[0].toothSurfaceLoss; // Trauma Tooth Surface Loss (Darjah 1)
        rowNew.getCell(69).value = results.dataPemeriksaan[0].traumaTisuLembut; // Trauma Tisu Lembut (Darjah 1)
        rowNew.getCell(70).value = results.dataPemeriksaan[0].traumaTisuKeras; // Trauma Tisu Keras (Darjah 1)
        rowNew.getCell(72).value =
          results.dataPemeriksaan[0].pesakitAdaFullDentureAtas; // Pesakit Ada Full Denture Atas(Darjah 1)
        rowNew.getCell(73).value =
          results.dataPemeriksaan[0].pesakitAdaPartialDentureAtas; // Pesakit Ada Partial Denture Atas (Darjah 1)
        rowNew.getCell(74).value =
          results.dataPemeriksaan[0].pesakitPerluFullDentureAtas; // Pesakit Perlu Full Denture Atas (Darjah 1)
        rowNew.getCell(75).value =
          results.dataPemeriksaan[0].pesakitPerluPartialDentureAtas; // Pesakit Perlu Partial Denture Atas (Darjah 1)
        rowNew.commit();
        console.log('setting row2');
        let rowNew2 = worksheet.getRow(18);
        rowNew2.getCell(8).value = results.dataPemeriksaan[0].skorPlakC; //Kebersihan Mulut Skor C (Darjah 1)
        rowNew2.commit();
        console.log('setting row3');
        let rowNew3 = worksheet.getRow(19);
        rowNew3.getCell(8).value = results.dataPemeriksaan[0].skorPlakE; //Kebersihan Mulut Skor E (Darjah 1)
        rowNew3.getCell(33).value = results.dataPemeriksaan[0].perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 1)
        rowNew3.getCell(35).value = results.dataPemeriksaan[0].perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(36).value = results.dataPemeriksaan[0].perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(37).value = results.dataPemeriksaan[0].perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(38).value = results.dataPemeriksaan[0].perluPRR1GigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(39).value =
          results.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(40).value =
          results.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(41).value =
          results.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(42).value =
          results.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(43).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(44).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(46).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(47).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(48).value = results.dataRawatan[0].SEMULA_MuridBuatFv; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(49).value = results.dataRawatan[0].SEMULA_GgKekalBuatFv; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(50).value = results.dataRawatan[0].SEMULA_MuridBuatPRR1; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(51).value =
          results.dataRawatan[0].SEMULA_GgKekalBuatPRR1; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(52).value =
          results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(53).value =
          results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(54).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(55).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(56).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(57).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(72).value =
          results.dataPemeriksaan[0].pesakitAdaFullDentureBawah; // Pesakit Ada Full Denture Bawah (Darjah 1)
        rowNew3.getCell(73).value =
          results.dataPemeriksaan[0].pesakitAdaPartialDentureBawah; // Pesakit Ada Partial Denture Bawah (Darjah 1)
        rowNew3.getCell(74).value =
          results.dataPemeriksaan[0].pesakitPerluFullDentureBawah; // Pesakit Perlu Full Denture Bawah (Darjah 1)
        rowNew3.getCell(75).value =
          results.dataPemeriksaan[0].pesakitPerluPartialDentureBawah; // Pesakit Perlu Partial Denture Bawah (Darjah 1)
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
          'test-' + klinik + '-PG201A.xlsx'
        );
        // Write the file
        await workbook.xlsx.writeFile(newfile);
        console.log('writing file');
        setTimeout(() => {
          fs.unlinkSync(newfile); // delete this file after 30 seconds
          console.log('deleting file');
        }, 15000);
        return 'it is done';
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
      }
    }
  );
}
// async function convertToPdf(excelFile, pdfFile) {
//   console.log('converting to pdf');
//   try {
//     var workbook = new aspose.Workbook(excelFile);
//     var saveOptions = aspose.PdfSaveOptions();
//     saveOptions.setOnePagePerSheet(true);
//     workbook.save(pdfFile, saveOptions);
//     setTimeout(() => {
//       fs.unlinkSync(pdfFile); // delete this file after 30 seconds
//       console.log('deleting pdf file');
//     }, 15000);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error });
//   }
// }
exports.mother201 = function (req, res) {
  async.parallel(
    {
      dataPemeriksaan: function (callback) {
        Sekolah.aggregate(
          [
            {
              $match: {
                kelas: '1 adil',
                kodSekolah: 'YEE7872',
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
            //perlu look-up kaunter form ; utk gorek data jantini & etnik
            {
              $group: {
                _id: '$namaSekolah',
                // namaKlinik: '$pemeriksaanSekolah.createdByKp',
                jumlahBudak: { $sum: 1 },

                /*  PGPS 2 2021 Compile Column maklumat Asas
                
                1) Jumlah Prasekolah / Tadika Dalam Daerah / Negeri
                2) Jumlah Prasekolah / Tadika Dilawati
                3) Peratus Prasekolah / Tadika Dilawati (col. 53/col. 52 x 100)
             
                Kotak kecil di bawah juga perlu diisi
                Aktiviti Promosi Kesihatan Pergigian				Bil diadakan			Bil Peserta		

                                
                */

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
                gigiKekalDMFXsamaAtauKurangDari2: {
                  //DMFX<=2 //data untuk PGS203
                  //DMFX ≤ 2
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
                          2,
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                gigiKekalDMFXsamaAtauKurangDari1: {
                  //DMFX<=1 //data untuk PGS203
                  //DMFX ≤ 2
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
                          1,
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
                tpr: {
                  //ini utk keluar reten PG201SMKP - added by Leong 03.08.2022
                  //TPR can be considered if (f/F >1 +/- m/M >1 +/- SM>1); cannot claim TPR if d/D > 1 or x/X > 1 or GIS skor 1 or 3
                  //no mixed dentition ; dx =0 ; sm = 0 ; fm >=0; GIS skor 0 or 2
                  //mixed dentition ; dfmx =0 ; DMFX = 0 ; sm = 0 ; GIS skor 0 or 2
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                          { $gte: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                          { $gte: ['$pemeriksaanSekolah.mAdaGigiDesidus', 0] },
                          { $gte: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                          { $gte: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                          { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                          { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                          {
                            $or: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                                  '0',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                                  '2',
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
                perokokSemasaLelakiMelayu: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'lelaki'] },
                          {
                            $eq: [
                              '$pemeriksaanSekolah.kumpulanEtnik',
                              'melayu',
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokSemasaLelakiCina: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'lelaki'] },
                          {
                            $eq: ['$pemeriksaanSekolah.kumpulanEtnik', 'cina'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokSemasaLelakiIndia: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'lelaki'] },
                          {
                            $eq: ['$pemeriksaanSekolah.kumpulanEtnik', 'india'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokSemasaLelakiLainLain: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'lelaki'] },
                          {
                            $or: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bajau',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'dusun',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'kadazan',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'murut',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bumiputera sabah lain',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'melanau',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'kedayan',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'iban',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bidayuh',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bumiputera sarawak lain',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'orang asli semenanjung',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'lain-lain',
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
                perokokSemasaPerempuanMelayu: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'perempuan'] },
                          {
                            $eq: [
                              '$pemeriksaanSekolah.kumpulanEtnik',
                              'melayu',
                            ],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokSemasaPerempuanCina: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'perempuan'] },
                          {
                            $eq: ['$pemeriksaanSekolah.kumpulanEtnik', 'cina'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokSemasaPerempuanIndia: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'perempuan'] },
                          {
                            $eq: ['$pemeriksaanSekolah.kumpulanEtnik', 'india'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokSemasaPerempuanLainLain: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-semasa',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'perempuan'] },
                          {
                            $or: [
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bajau',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'dusun',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'kadazan',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'murut',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bumiputera sabah lain',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'melanau',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'kedayan',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'iban',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bidayuh',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'bumiputera sarawak lain',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'orang asli semenanjung',
                                ],
                              },
                              {
                                $eq: [
                                  '$pemeriksaanSekolah.kumpulanEtnik',
                                  'lain-lain',
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
                jenisRokokBiasa: {
                  //untuk reten PPIM03 - Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$pemeriksaanSekolah.jenisR', 'rokok-biasa'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jenisRokokElektronik: {
                  //untuk reten PPIM03 - Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$pemeriksaanSekolah.jenisR', 'elektronik'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jenisRokokShisha: {
                  //untuk reten PPIM03 - Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$pemeriksaanSekolah.jenisR', 'shisha'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                jenisRokokLainLain: {
                  //untuk reten PPIM03 - Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$pemeriksaanSekolah.jenisR', 'lain-lain'],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bilDirujukUntukIntervensi: {
                  //Untuk reten PPIM03 //Leong Edited on 05-08-2022 - formula TBC
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$kotakSekolah.rujukGuruKaunseling', true],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bekasPerokokLelaki: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'bekas-perokok',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'lelaki'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bekasPerokokPerempuan: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'bekas-perokok',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'perempuan'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokPasifLelaki: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-pasif',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'lelaki'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                perokokPasifPerempuan: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'perokok-pasif',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'perempuan'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bukanPerokokLelaki: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'bukan-perokok',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'lelaki'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                bukanPerokokPerempuan: {
                  //untuk reten PPIM03 -Leong edited on 05-08-2022
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              '$pemeriksaanSekolah.statusM',
                              'bukan-perokok',
                            ],
                          },
                          { $eq: ['$pemeriksaanSekolah.jantina', 'perempuan'] },
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
        //data rawatan
        Sekolah.aggregate(
          [
            {
              $match: {
                kelas: '1 adil',
                kodSekolah: 'YEE7872',
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
                //ini kita assign initial OR default value
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
                      //ini gorek data dari form yang di-isikan oleh user
                      //$value dpt dari database ; this dari initial value kita declared di atas
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
                //ini utk kira jumlah rawatan data dari atas
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
        //
        let rowNamaKlinik = worksheet.getRow(7);
        // let klinikFixed = results.dataPemeriksan[0].createdByKp;
        // klinikFixed = klinikFixed
        //   .toLowerCase()
        //   .split(' ')
        //   .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        //   .join(' ');
        rowNamaKlinik.getCell(9).value = 'Klinik Gigi';
        rowNamaKlinik.commit();
        // console.log('setting klinik name: ' + klinikFixed);
        //
        let rowNamaSekolah = worksheet.getRow(8);
        let sekolahFixed = results.dataPemeriksaan[0]._id;
        rowNamaSekolah.getCell(9).value = sekolahFixed;
        sekolahFixed = sekolahFixed
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
        rowNamaSekolah.getCell(9).value = sekolahFixed;
        rowNamaSekolah.commit();
        console.log('setting sekolah name: ' + sekolahFixed);
        //
        let rowNamaJenis = worksheet.getRow(9);
        rowNamaJenis.getCell(9).value = 'PBSR';
        rowNamaJenis.commit();

        //PG201A
        // Reten Sekolah (Darjah 1)
        let rowNew = worksheet.getRow(17);
        rowNew.getCell(2).value =
          results.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan enggan (Darjah 1)
        rowNew.getCell(3).value =
          results.dataPemeriksaan[0].kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 1)
        rowNew.getCell(4).value = results.dataPemeriksaan[0].enrolmen; //Kedatangan enrolmen (Darjah 1)
        rowNew.getCell(5).value =
          results.dataPemeriksaan[0].jumlahKedatanganBaru; //Kedatangan baru (Darjah 1)
        rowNew.getCell(6).value =
          results.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangan ulangan (Darjah 1)
        rowNew.getCell(8).value = results.dataPemeriksaan[0].skorPlakA; //Kebersihan Mulut Skor A (Darjah 1)
        rowNew.getCell(9).value = results.dataPemeriksaan[0].jumlahd; //Karies Gigi Desidus (d) (Darjah 1)
        rowNew.getCell(10).value = results.dataPemeriksaan[0].jumlahf; //Telah Ditampal Gigi Desidus (f) (Darjah 1)
        rowNew.getCell(11).value = results.dataPemeriksaan[0].jumlahx; //Gigi Desidus Perlu Ditampal (x) (Darjah 1)
        rowNew.getCell(13).value = results.dataPemeriksaan[0].jumlahE; //Karies Awal Gigi Kekal (E) (Darjah 1)
        rowNew.getCell(14).value = results.dataPemeriksaan[0].jumlahD; //Karies Gigi Kekal (D) (Darjah 1)
        rowNew.getCell(15).value = results.dataPemeriksaan[0].jumlahM; //Gigi Kekal Telah Dicabut (M) (Darjah 1)
        rowNew.getCell(16).value = results.dataPemeriksaan[0].jumlahF; //Gigi Kekal Telah Ditampal (F) (Darjah 1)
        rowNew.getCell(17).value = results.dataPemeriksaan[0].jumlahX; //Jumlah DMFX (Darjah 1)
        rowNew.getCell(19).value =
          results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 1)
        rowNew.getCell(20).value =
          results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.dataPemeriksaan[0].0  (Darjah 1)
        rowNew.getCell(21).value = results.dataPemeriksaan[0].eMoreThanZero; //E≥1 (ada karies awal) (Darjah 1)
        rowNew.getCell(22).value = results.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) (Darjah 1)
        rowNew.getCell(23).value = results.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.dataPemeriksaan[0].0 (Darjah 1)
        rowNew.getCell(24).value =
          results.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 1)
        rowNew.getCell(25).value = results.dataPemeriksaan[0].dfxEqualToZero; //dfx=0 (Darjah 1)
        rowNew.getCell(26).value = results.dataPemeriksaan[0].jumlahMBG; //Mulut Bebas Gingivitis (MBG) (Darjah 1)
        rowNew.getCell(27).value = results.dataPemeriksaan[0].jumlahTprICDAS; //TPR ICDAS (Darjah 1)
        rowNew.getCell(28).value =
          results.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 1)
        rowNew.getCell(29).value = results.dataPemeriksaan[0].cleftAda; //cleft Ada (Darjah 1)
        rowNew.getCell(30).value = results.dataPemeriksaan[0].cleftRujuk; //cleft Rujuk (Darjah 1)
        rowNew.getCell(32).value = results.dataPemeriksaan[0].perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(33).value = results.dataPemeriksaan[0].perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 1)
        rowNew.getCell(34).value =
          results.dataPemeriksaan[0].perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 1)
        rowNew.getCell(35).value = results.dataPemeriksaan[0].perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(36).value = results.dataPemeriksaan[0].perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 1)
        rowNew.getCell(37).value = results.dataPemeriksaan[0].perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(38).value = results.dataPemeriksaan[0].perluPRR1GigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 1)
        rowNew.getCell(39).value =
          results.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(40).value =
          results.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(41).value =
          results.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(42).value =
          results.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(43).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(44).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(46).value = results.dataRawatan[0].BARU_MuridBuatFs; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(47).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 1)
        rowNew.getCell(48).value = results.dataRawatan[0].BARU_MuridBuatFv; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(49).value = results.dataRawatan[0].BARU_GgKekalBuatFv; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew.getCell(50).value = results.dataRawatan[0].BARU_MuridBuatPRR1; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(51).value = results.dataRawatan[0].BARU_GgKekalBuatPRR1; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew.getCell(52).value =
          results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(53).value =
          results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(54).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(55).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(56).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
        rowNew.getCell(57).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
        rowNew.getCell(59).value = results.dataRawatan[0].cabutDesidus; // Gigi Desidus Dicabut (Darjah 1)
        rowNew.getCell(60).value = results.dataRawatan[0].cabutKekal; // Gigi Kekal Dicabut (Darjah 1)
        rowNew.getCell(61).value = results.dataRawatan[0].penskaleran; // Penskelaran (Darjah 1)
        rowNew.getCell(62).value = results.dataRawatan[0].caseCompletedICDAS; // Kes Selesai ICDAS (Darjah 1)
        rowNew.getCell(63).value = results.dataPemeriksaan[0].skorGIS0; // GIS SKOR 0 (Darjah 1)
        rowNew.getCell(64).value = results.dataPemeriksaan[0].skorGIS1; // GIS SKOR 1 (Darjah 1)
        rowNew.getCell(65).value = results.dataPemeriksaan[0].skorGIS2; // GIS SKOR 2 (Darjah 1)
        rowNew.getCell(66).value = results.dataPemeriksaan[0].skorGIS3; // GIS SKOR 3 (Darjah 1)
        rowNew.getCell(68).value = results.dataPemeriksaan[0].toothSurfaceLoss; // Trauma Tooth Surface Loss (Darjah 1)
        rowNew.getCell(69).value = results.dataPemeriksaan[0].traumaTisuLembut; // Trauma Tisu Lembut (Darjah 1)
        rowNew.getCell(70).value = results.dataPemeriksaan[0].traumaTisuKeras; // Trauma Tisu Keras (Darjah 1)
        rowNew.getCell(72).value =
          results.dataPemeriksaan[0].pesakitAdaFullDentureAtas; // Pesakit Ada Full Denture Atas(Darjah 1)
        rowNew.getCell(73).value =
          results.dataPemeriksaan[0].pesakitAdaPartialDentureAtas; // Pesakit Ada Partial Denture Atas (Darjah 1)
        rowNew.getCell(74).value =
          results.dataPemeriksaan[0].pesakitPerluFullDentureAtas; // Pesakit Perlu Full Denture Atas (Darjah 1)
        rowNew.getCell(75).value =
          results.dataPemeriksaan[0].pesakitPerluPartialDentureAtas; // Pesakit Perlu Partial Denture Atas (Darjah 1)
        rowNew.commit();
        console.log('setting row2');
        let rowNew2 = worksheet.getRow(18);
        rowNew2.getCell(8).value = results.dataPemeriksaan[0].skorPlakC; //Kebersihan Mulut Skor C (Darjah 1)
        rowNew2.commit();
        console.log('setting row3');
        let rowNew3 = worksheet.getRow(19);
        rowNew3.getCell(8).value = results.dataPemeriksaan[0].skorPlakE; //Kebersihan Mulut Skor E (Darjah 1)
        rowNew3.getCell(33).value = results.dataPemeriksaan[0].perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 1)
        rowNew3.getCell(35).value = results.dataPemeriksaan[0].perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(36).value = results.dataPemeriksaan[0].perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 1)
        rowNew3.getCell(37).value = results.dataPemeriksaan[0].perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(38).value = results.dataPemeriksaan[0].perluPRR1GigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(39).value =
          results.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(40).value =
          results.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(41).value =
          results.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(42).value =
          results.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(43).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(44).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(46).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(47).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 1)
        rowNew3.getCell(48).value = results.dataRawatan[0].SEMULA_MuridBuatFv; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(49).value = results.dataRawatan[0].SEMULA_GgKekalBuatFv; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 1)
        rowNew3.getCell(50).value = results.dataRawatan[0].SEMULA_MuridBuatPRR1; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(51).value =
          results.dataRawatan[0].SEMULA_GgKekalBuatPRR1; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(52).value =
          results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(53).value =
          results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(54).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(55).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(56).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
        rowNew3.getCell(57).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(72).value =
          results.dataPemeriksaan[0].pesakitAdaFullDentureBawah; // Pesakit Ada Full Denture Bawah (Darjah 1)
        rowNew3.getCell(73).value =
          results.dataPemeriksaan[0].pesakitAdaPartialDentureBawah; // Pesakit Ada Partial Denture Bawah (Darjah 1)
        rowNew3.getCell(74).value =
          results.dataPemeriksaan[0].pesakitPerluFullDentureBawah; // Pesakit Perlu Full Denture Bawah (Darjah 1)
        rowNew3.getCell(75).value =
          results.dataPemeriksaan[0].pesakitPerluPartialDentureBawah; // Pesakit Perlu Partial Denture Bawah (Darjah 1)
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
async function generatePG203(jenisReten, sekolah, klinik) {
  console.log(sekolah);
  console.log(klinik);
  async.parallel(
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
    async function (err, results) {
      console.log(results);
      try {
        let filename = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'PGS203.xlsx'
        );
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGS203');

        //Reten PGS 203
        //Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        let rowNew4 = worksheet.getRow(20);
        rowNew4.getCell(3).value =
          results.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(4).value =
          results.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(5).value = results.dataPemeriksaan[0].jumlahd; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(6).value = results.dataPemeriksaan[0].jumlahf; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(7).value = results.dataPemeriksaan[0].jumlahx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(10).value = results.dataPemeriksaan[0].jumlahD; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(11).value = results.dataPemeriksaan[0].jumlahM; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(12).value = results.dataPemeriksaan[0].jumlahF; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(13).value = results.dataPemeriksaan[0].jumlahX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(16).value = results.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(17).value = results.dataPemeriksaan[0].dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(18).value =
          results.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(19).value =
          results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(20).value =
          results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(21).value =
          results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(22).value = results.dataPemeriksaan[0].eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(23).value =
          results.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(24).value =
          results.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(25).value = results.dataPemeriksaan[0].tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(26).value = results.dataPemeriksaan[0].skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(27).value = results.dataPemeriksaan[0].skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(28).value = results.dataPemeriksaan[0].skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(29).value = results.dataPemeriksaan[0].skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew4.getCell(30).value = results.dataPemeriksaan[0].perluFvMuridB; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew4.getCell(31).value = results.dataPemeriksaan[0].perluPRR1MuridB; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew4.getCell(32).value = results.dataPemeriksaan[0].perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(34).value = results.dataPemeriksaan[0].perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(35).value = results.dataPemeriksaan[0].perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(36).value =
          results.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(37).value =
          results.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(38).value =
          results.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(39).value =
          results.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(40).value =
          results.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(41).value =
          results.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(42).value =
          results.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(43).value =
          results.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(44).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(45).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(46).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(47).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // campur Baru semua
        rowNew4.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // campur baru semula 2 atas ni
        rowNew4.getCell(52).value = results.dataRawatan[0].BARU_MuridBuatFs; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(53).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(54).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(55).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(56).value =
          results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(57).value =
          results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(58).value =
          results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(59).value =
          results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(60).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(61).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(62).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(63).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(64).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(65).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(66).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(67).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(70).value = results.dataRawatan[0].cabutDesidus; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(71).value = results.dataRawatan[0].cabutKekal; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew4.getCell(73).value = results.dataRawatan[0].penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // ni case completed
        rowNew4.getCell(74).value = results.dataRawatan[0].caseCompletedICDAS; //Kes Selesai Klinik atau Pusat Pergigian Sekolah (Tahun 1)a
        // ni case completed
        rowNew4.commit();

        //Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        let rowNew20 = worksheet.getRow(29);
        rowNew20.getCell(3).value =
          results.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(4).value =
          results.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(5).value = results.dataPemeriksaan[0].jumlahd; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(6).value = results.dataPemeriksaan[0].jumlahf; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(7).value = results.dataPemeriksaan[0].jumlahx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(10).value = results.dataPemeriksaan[0].jumlahD; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(11).value = results.dataPemeriksaan[0].jumlahM; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(12).value = results.dataPemeriksaan[0].jumlahF; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(13).value = results.dataPemeriksaan[0].jumlahX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(16).value = results.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(17).value = results.dataPemeriksaan[0].dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(18).value =
          results.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(19).value =
          results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(20).value =
          results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(21).value =
          results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(22).value = results.dataPemeriksaan[0].eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(23).value =
          results.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(24).value =
          results.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(25).value = results.dataPemeriksaan[0].tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(26).value = results.dataPemeriksaan[0].skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(27).value = results.dataPemeriksaan[0].skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(28).value = results.dataPemeriksaan[0].skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(29).value = results.dataPemeriksaan[0].skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew20.getCell(30).value = results.dataPemeriksaan[0].perluFvMuridB; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew20.getCell(31).value = results.dataPemeriksaan[0].perluPRR1MuridB; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // kena campur dgn semula
        rowNew20.getCell(32).value = results.dataPemeriksaan[0].perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(34).value = results.dataPemeriksaan[0].perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(35).value = results.dataPemeriksaan[0].perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(36).value =
          results.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(37).value =
          results.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(38).value =
          results.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(39).value =
          results.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(40).value =
          results.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(41).value =
          results.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(42).value =
          results.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(43).value =
          results.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(44).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(45).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(46).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(47).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // campur Baru semua
        rowNew20.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // campur baru semula 2 atas ni
        rowNew20.getCell(52).value = results.dataRawatan[0].BARU_MuridBuatFs; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(53).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(54).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(55).value =
          results.dataRawatan[0].SEMULA_GgKekalBuatFs; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(56).value =
          results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(57).value =
          results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(58).value =
          results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(59).value =
          results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(60).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(61).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(62).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(63).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(64).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(65).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(66).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(67).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(70).value = results.dataRawatan[0].cabutDesidus; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(71).value = results.dataRawatan[0].cabutKekal; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        rowNew20.getCell(73).value = results.dataRawatan[0].penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        // ni case completed
        rowNew20.getCell(74).value = results.dataRawatan[0].caseCompletedICDAS; //Kes Selesai Klinik atau Pusat Pergigian Sekolah (Tahun 1)a
        // ni case completed
        rowNew20.commit();

        let newfile = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'test-' + klinik + '-PGS203.xlsx'
        );

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
          fs.unlinkSync(newfile); // delete this file after 30 seconds
        }, 30000);
        return 'it is done';
      } catch (error) {
        console.log(error);
        res.status(500).json({ error });
      }
    }
  );
}
async function generatePG201SMKP(jenisReten, sekolah, klinik) {
  async.parallel(
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
    async function (err, results) {
      console.log(results);
      try {
        let filename = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'PG201SMKP.xlsx'
        );
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PG201SMKP');

        // darjah/tingkatan 1
        let rowNew = worksheet.getRow(17);
        rowNew.getCell(2).value =
          results.dataPemeriksaan[0].engganKedatanganPendaftaran; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(3).value =
          results.dataPemeriksaan[0].kedatanganTidakHadir; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(4).value = results.dataPemeriksaan[0].enrolmen; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(5).value =
          results.dataPemeriksaan[0].jumlahKedatanganBaru; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(6).value =
          results.dataPemeriksaan[0].jumlahKedatanganUlangan; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(8).value = results.dataPemeriksaan[0].skorPlakA; // Skor Plak A darjah/tingkatan 1
        rowNew.getCell(9).value = results.dataPemeriksaan[0].jumlahd; // d  darjah/tingkatan 1
        rowNew.getCell(10).value = results.dataPemeriksaan[0].jumlahf; // f  darjah/tingkatan 1
        rowNew.getCell(11).value = results.dataPemeriksaan[0].jumlahx; // x  darjah/tingkatan 1
        rowNew.getCell(13).value = results.dataPemeriksaan[0].jumlahD; // D  darjah/tingkatan 1
        rowNew.getCell(14).value = results.dataPemeriksaan[0].jumlahM; // M  darjah/tingkatan 1
        rowNew.getCell(15).value = results.dataPemeriksaan[0].jumlahF; // F  darjah/tingkatan 1
        rowNew.getCell(16).value = results.dataPemeriksaan[0].jumlahX; // X  darjah/tingkatan 1
        rowNew.getCell(18).value =
          results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 darjah/tingkatan 1
        rowNew.getCell(19).value =
          results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  darjah/tingkatan 1
        rowNew.getCell(20).value = results.dataPemeriksaan[0].jumlahMBK; // Mulut Bebas Karies (MBK)  darjah/tingkatan 1
        rowNew.getCell(21).value = results.dataPemeriksaan[0].statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  darjah/tingkatan 1
        rowNew.getCell(22).value = results.dataPemeriksaan[0].dfxEqualToZero; // dfx = results.0   darjah/tingkatan 1
        rowNew.getCell(23).value = results.dataPemeriksaan[0].jumlahMBG; // Mulut Bebas Gingivitis (MBG)  darjah/tingkatan 1
        // not icdas!!!
        rowNew.getCell(24).value = results.dataPemeriksaan[0].jumlahTprICDAS; // Tidak perlu rawatan  darjah/tingkatan 1
        // not icdas!!!
        rowNew.getCell(25).value =
          results.dataPemeriksaan[0].kecederaanGigiAnterior; // X  darjah/tingkatan 1
        rowNew.getCell(26).value = results.dataPemeriksaan[0].cleftAda; // X  darjah/tingkatan 1
        rowNew.getCell(27).value = results.dataPemeriksaan[0].cleftRujuk; // X  darjah/tingkatan 1
        rowNew.getCell(29).value = results.dataPemeriksaan[0].perluFSMuridB; // X  darjah/tingkatan 1
        rowNew.getCell(30).value = results.dataPemeriksaan[0].perluFSGigiB; // X  darjah/tingkatan 1
        rowNew.getCell(31).value =
          results.dataPemeriksaan[0].perluFsBilGigiFailed; // X  darjah/tingkatan 1
        rowNew.getCell(32).value =
          results.dataPemeriksaan[0].perluTampalanAntGdB; // X  darjah/tingkatan 1
        rowNew.getCell(33).value =
          results.dataPemeriksaan[0].perluTampalanAntGkB; // X  darjah/tingkatan 1
        rowNew.getCell(34).value =
          results.dataPemeriksaan[0].perluTampalanPosGdB; // X  darjah/tingkatan 1
        rowNew.getCell(35).value =
          results.dataPemeriksaan[0].perluTampalanPosGkB; // X  darjah/tingkatan 1
        rowNew.getCell(36).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdB; // X  darjah/tingkatan 1
        rowNew.getCell(37).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkB; // X  darjah/tingkatan 1
        rowNew.getCell(39).value = results.dataRawatan[0].BARU_MuridBuatFs; // telahFSMuridS  darjah/tingkatan 1
        rowNew.getCell(40).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //   darjah/tingkatan 1
        rowNew.getCell(41).value =
          results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
        rowNew.getCell(42).value =
          results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
        rowNew.getCell(43).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
        rowNew.getCell(44).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
        rowNew.getCell(45).value =
          results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; // X  darjah/tingkatan 1
        rowNew.getCell(46).value =
          results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; // X  darjah/tingkatan 1
        rowNew.getCell(48).value = results.dataRawatan[0].cabutDesidus; // Cabutan GD  darjah/tingkatan 1
        rowNew.getCell(49).value = results.dataRawatan[0].cabutKekal; // Cabutan GK  darjah/tingkatan 1
        rowNew.getCell(50).value = results.dataRawatan[0].penskaleran; // Penskaleran  darjah/tingkatan 1
        // kes selesai ni
        rowNew.getCell(51).value = results.dataRawatan[0].caseCompletedICDAS; // Kes selesai  darjah/tingkatan 1
        // kes selesai ni
        rowNew.getCell(52).value = results.dataPemeriksaan[0].skorGIS0; // Skor GIS 0  darjah/tingkatan 1
        rowNew.getCell(53).value = results.dataPemeriksaan[0].skorGIS1; // Skor GIS 1  darjah/tingkatan 1
        rowNew.getCell(54).value = results.dataPemeriksaan[0].skorGIS2; // Skor GIS 2  darjah/tingkatan 1
        rowNew.getCell(55).value = results.dataPemeriksaan[0].skorGIS3; // Skor GIS 3  darjah/tingkatan 1
        rowNew.commit();

        let rowNew2 = worksheet.getRow(18);
        rowNew2.getCell(2).value = results.dataPemeriksaan[0].skorPlakC; // darjah/tingkatan 1
        rowNew2.commit();

        let rowNew3 = worksheet.getRow(19);
        rowNew3.getCell(2).value = results.dataPemeriksaan[0].skorPlakE; // darjah/tingkatan 1
        rowNew3.commit();

        let rowNew4 = worksheet.getRow(19);
        rowNew4.getCell(30).value = results.dataPemeriksaan[0].perluFSGigiS; // darjah/tingkatan 1
        rowNew4.getCell(32).value =
          results.dataPemeriksaan[0].perluTampalanAntGdS; //   darjah/tingkatan 1
        rowNew4.getCell(33).value =
          results.dataPemeriksaan[0].perluTampalanAntGkS; //   darjah/tingkatan 1
        rowNew4.getCell(34).value =
          results.dataPemeriksaan[0].perluTampalanPosGdS; //   darjah/tingkatan 1
        rowNew4.getCell(35).value =
          results.dataPemeriksaan[0].perluTampalanPosGkS; //   darjah/tingkatan 1
        rowNew4.getCell(36).value =
          results.dataPemeriksaan[0].perluTampalanAmgGdS; //   darjah/tingkatan 1
        rowNew4.getCell(37).value =
          results.dataPemeriksaan[0].perluTampalanAmgGkS; //   darjah/tingkatan 1
        rowNew4.getCell(39).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //   darjah/tingkatan 1
        rowNew4.getCell(40).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //   darjah/tingkatan 1
        rowNew4.getCell(41).value =
          results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //   darjah/tingkatan 1
        rowNew4.getCell(42).value =
          results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //   darjah/tingkatan 1
        rowNew4.getCell(43).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //   darjah/tingkatan 1
        rowNew4.getCell(44).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //   darjah/tingkatan 1
        rowNew4.getCell(45).value =
          results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //   darjah/tingkatan 1
        rowNew4.getCell(46).value =
          results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //   darjah/tingkatan 1
        rowNew4.commit();

        // darjah/tingkatan 2
        let rowNew5 = worksheet.getRow(20);

        // darjah/tingkatan 3
        let rowNew9 = worksheet.getRow(23);

        // darjah/tingkatan 4
        let rowNew13 = worksheet.getRow(26);

        // darjah/tingkatan 5
        let rowNew17 = worksheet.getRow(29);

        // 6 /peralihan
        let rowNew21 = worksheet.getRow(32);

        // kki
        let rowNew25 = worksheet.getRow(32);

        // others
        let rowNew29 = worksheet.getRow(7);
        rowNew29.getCell(9).value = klinik; //
        rowNew29.commit();

        let rowNew30 = worksheet.getRow(8);
        rowNew30.getCell(9).value = sekolah; //
        rowNew30.commit();

        // let rowNew31 = worksheet.getRow(9);
        // rowNew31.getCell(9).value = results.jenisPerkhidmatanPergigian; //
        // rowNew31.commit();

        // let rowNew32 = worksheet.getRow(7);
        // rowNew32.getCell(27).value = results.tarikhTempat; //
        // rowNew32.commit();

        // let rowNew33 = worksheet.getRow(8);
        // rowNew33.getCell(27).value = results.bilHariProjek; //
        // rowNew32.commit();

        // let rowNew34 = worksheet.getRow(7);
        // rowNew34.getCell(44).value = results.tarikhMula; //
        // rowNew34.commit();

        // let rowNew35 = worksheet.getRow(8);
        // rowNew35.getCell(44).value = results.tarikhSelesai; //
        // rowNew35.commit();

        // let rowNew36 = worksheet.getRow(9);
        // rowNew36.getCell(44).value = results.namaPetugas; //
        // rowNew36.commit();

        let newfile = path.join(
          __dirname,
          '..',
          'public',
          'exports',
          'test-' + klinik + '-PG201SMKP.xlsx'
        );

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
          fs.unlinkSync(newfile); // delete this file after 30 seconds
        }, 30000);
        return 'it is done';
      } catch (error) {
        console.log(error);
        res.status(500).json({ error });
      }
    }
  );
}
async function getDataSekolah() {
  const dataSekolah = async.parallel({
    dataPemeriksaan: function (callback) {
      // data pemeriksaan
      Sekolah.aggregate(
        [
          {
            $match: {
              kelas: '1 adil',
              kodSekolah: 'YEE7872',
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
              gigiKekalDMFXsamaAtauKurangDari2: {
                //DMFX<=2 //data untuk PGS203
                //DMFX ≤ 2
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
                        2,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              gigiKekalDMFXsamaAtauKurangDari1: {
                //DMFX<=1 //data untuk PGS203
                //DMFX ≤ 2
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
                        1,
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
              tpr: {
                //ini utk keluar reten PG201SMKP - added by Leong 03.08.2022
                //TPR can be considered if (f/F >1 +/- m/M >1 +/- SM>1); cannot claim TPR if d/D > 1 or x/X > 1 or GIS skor 1 or 3
                //no mixed dentition ; dx =0 ; sm = 0 ; fm >=0; GIS skor 0 or 2
                //mixed dentition ; dfmx =0 ; DMFX = 0 ; sm = 0 ; GIS skor 0 or 2
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$pemeriksaanSekolah.dAdaGigiKekal', 0] },
                        { $eq: ['$pemeriksaanSekolah.dAdaGigiDesidus', 0] },
                        { $gte: ['$pemeriksaanSekolah.mAdaGigiKekal', 0] },
                        { $gte: ['$pemeriksaanSekolah.mAdaGigiDesidus', 0] },
                        { $gte: ['$pemeriksaanSekolah.fAdaGigiKekal', 0] },
                        { $gte: ['$pemeriksaanSekolah.fAdaGigiDesidus', 0] },
                        { $eq: ['$pemeriksaanSekolah.xAdaGigiKekal', 0] },
                        { $eq: ['$pemeriksaanSekolah.xAdaGigiDesidus', 0] },
                        {
                          $or: [
                            {
                              $eq: [
                                '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                                '0',
                              ],
                            },
                            {
                              $eq: [
                                '$pemeriksaanSekolah.skorGisMulutOralHygiene',
                                '2',
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
          },
        ],
        callback
      );
    },
    dataRawatan: function (callback) {
      //data rawatan
      Sekolah.aggregate(
        [
          {
            $match: {
              kelas: '1 adil',
              kodSekolah: 'YEE7872',
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
              //ini kita assign initial OR default value
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
                    //ini gorek data dari form yang di-isikan oleh user
                    //$value dpt dari database ; this dari initial value kita declared di atas
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
              //ini utk kira jumlah rawatan data dari atas
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
  });
  return dataSekolah;
}
async function mapperPG201SMKP(results, klinik, sekolah) {
  let filename = path.join(
    __dirname,
    '..',
    'public',
    'exports',
    'PG201SMKP.xlsx'
  );
  let workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);
  let worksheet = workbook.getWorksheet('PG201SMKP');

  // darjah/tingkatan 1
  let rowNew = worksheet.getRow(17);
  rowNew.getCell(2).value =
    results.dataPemeriksaan[0].engganKedatanganPendaftaran; // Kedatangan  darjah/tingkatan 1
  rowNew.getCell(3).value = results.dataPemeriksaan[0].kedatanganTidakHadir; // Kedatangan  darjah/tingkatan 1
  rowNew.getCell(4).value = results.dataPemeriksaan[0].enrolmen; // Kedatangan  darjah/tingkatan 1
  rowNew.getCell(5).value = results.dataPemeriksaan[0].jumlahKedatanganBaru; // Kedatangan  darjah/tingkatan 1
  rowNew.getCell(6).value = results.dataPemeriksaan[0].jumlahKedatanganUlangan; // Kedatangan  darjah/tingkatan 1
  rowNew.getCell(8).value = results.dataPemeriksaan[0].skorPlakA; // Skor Plak A darjah/tingkatan 1
  rowNew.getCell(9).value = results.dataPemeriksaan[0].jumlahd; // d  darjah/tingkatan 1
  rowNew.getCell(10).value = results.dataPemeriksaan[0].jumlahf; // f  darjah/tingkatan 1
  rowNew.getCell(11).value = results.dataPemeriksaan[0].jumlahx; // x  darjah/tingkatan 1
  rowNew.getCell(13).value = results.dataPemeriksaan[0].jumlahD; // D  darjah/tingkatan 1
  rowNew.getCell(14).value = results.dataPemeriksaan[0].jumlahM; // M  darjah/tingkatan 1
  rowNew.getCell(15).value = results.dataPemeriksaan[0].jumlahF; // F  darjah/tingkatan 1
  rowNew.getCell(16).value = results.dataPemeriksaan[0].jumlahX; // X  darjah/tingkatan 1
  rowNew.getCell(18).value =
    results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 darjah/tingkatan 1
  rowNew.getCell(19).value =
    results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  darjah/tingkatan 1
  rowNew.getCell(20).value = results.dataPemeriksaan[0].jumlahMBK; // Mulut Bebas Karies (MBK)  darjah/tingkatan 1
  rowNew.getCell(21).value = results.dataPemeriksaan[0].statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  darjah/tingkatan 1
  rowNew.getCell(22).value = results.dataPemeriksaan[0].dfxEqualToZero; // dfx = results.0   darjah/tingkatan 1
  rowNew.getCell(23).value = results.dataPemeriksaan[0].jumlahMBG; // Mulut Bebas Gingivitis (MBG)  darjah/tingkatan 1
  // not icdas!!!
  rowNew.getCell(24).value = results.dataPemeriksaan[0].jumlahTprICDAS; // Tidak perlu rawatan  darjah/tingkatan 1
  // not icdas!!!
  rowNew.getCell(25).value = results.dataPemeriksaan[0].kecederaanGigiAnterior; // X  darjah/tingkatan 1
  rowNew.getCell(26).value = results.dataPemeriksaan[0].cleftAda; // X  darjah/tingkatan 1
  rowNew.getCell(27).value = results.dataPemeriksaan[0].cleftRujuk; // X  darjah/tingkatan 1
  rowNew.getCell(29).value = results.dataPemeriksaan[0].perluFSMuridB; // X  darjah/tingkatan 1
  rowNew.getCell(30).value = results.dataPemeriksaan[0].perluFSGigiB; // X  darjah/tingkatan 1
  rowNew.getCell(31).value = results.dataPemeriksaan[0].perluFsBilGigiFailed; // X  darjah/tingkatan 1
  rowNew.getCell(32).value = results.dataPemeriksaan[0].perluTampalanAntGdB; // X  darjah/tingkatan 1
  rowNew.getCell(33).value = results.dataPemeriksaan[0].perluTampalanAntGkB; // X  darjah/tingkatan 1
  rowNew.getCell(34).value = results.dataPemeriksaan[0].perluTampalanPosGdB; // X  darjah/tingkatan 1
  rowNew.getCell(35).value = results.dataPemeriksaan[0].perluTampalanPosGkB; // X  darjah/tingkatan 1
  rowNew.getCell(36).value = results.dataPemeriksaan[0].perluTampalanAmgGdB; // X  darjah/tingkatan 1
  rowNew.getCell(37).value = results.dataPemeriksaan[0].perluTampalanAmgGkB; // X  darjah/tingkatan 1
  rowNew.getCell(39).value = results.dataRawatan[0].BARU_MuridBuatFs; // telahFSMuridS  darjah/tingkatan 1
  rowNew.getCell(40).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //   darjah/tingkatan 1
  rowNew.getCell(41).value =
    results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
  rowNew.getCell(42).value =
    results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
  rowNew.getCell(43).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
  rowNew.getCell(44).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; // X  darjah/tingkatan 1
  rowNew.getCell(45).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; // X  darjah/tingkatan 1
  rowNew.getCell(46).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; // X  darjah/tingkatan 1
  rowNew.getCell(48).value = results.dataRawatan[0].cabutDesidus; // Cabutan GD  darjah/tingkatan 1
  rowNew.getCell(49).value = results.dataRawatan[0].cabutKekal; // Cabutan GK  darjah/tingkatan 1
  rowNew.getCell(50).value = results.dataRawatan[0].penskaleran; // Penskaleran  darjah/tingkatan 1
  // kes selesai ni
  rowNew.getCell(51).value = results.dataRawatan[0].caseCompletedICDAS; // Kes selesai  darjah/tingkatan 1
  // kes selesai ni
  rowNew.getCell(52).value = results.dataPemeriksaan[0].skorGIS0; // Skor GIS 0  darjah/tingkatan 1
  rowNew.getCell(53).value = results.dataPemeriksaan[0].skorGIS1; // Skor GIS 1  darjah/tingkatan 1
  rowNew.getCell(54).value = results.dataPemeriksaan[0].skorGIS2; // Skor GIS 2  darjah/tingkatan 1
  rowNew.getCell(55).value = results.dataPemeriksaan[0].skorGIS3; // Skor GIS 3  darjah/tingkatan 1
  rowNew.commit();

  let rowNew2 = worksheet.getRow(18);
  rowNew2.getCell(2).value = results.dataPemeriksaan[0].skorPlakC; // darjah/tingkatan 1
  rowNew2.commit();

  let rowNew3 = worksheet.getRow(19);
  rowNew3.getCell(2).value = results.dataPemeriksaan[0].skorPlakE; // darjah/tingkatan 1
  rowNew3.commit();

  let rowNew4 = worksheet.getRow(19);
  rowNew4.getCell(30).value = results.dataPemeriksaan[0].perluFSGigiS; // darjah/tingkatan 1
  rowNew4.getCell(32).value = results.dataPemeriksaan[0].perluTampalanAntGdS; //   darjah/tingkatan 1
  rowNew4.getCell(33).value = results.dataPemeriksaan[0].perluTampalanAntGkS; //   darjah/tingkatan 1
  rowNew4.getCell(34).value = results.dataPemeriksaan[0].perluTampalanPosGdS; //   darjah/tingkatan 1
  rowNew4.getCell(35).value = results.dataPemeriksaan[0].perluTampalanPosGkS; //   darjah/tingkatan 1
  rowNew4.getCell(36).value = results.dataPemeriksaan[0].perluTampalanAmgGdS; //   darjah/tingkatan 1
  rowNew4.getCell(37).value = results.dataPemeriksaan[0].perluTampalanAmgGkS; //   darjah/tingkatan 1
  rowNew4.getCell(39).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //   darjah/tingkatan 1
  rowNew4.getCell(40).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //   darjah/tingkatan 1
  rowNew4.getCell(41).value =
    results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //   darjah/tingkatan 1
  rowNew4.getCell(42).value =
    results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //   darjah/tingkatan 1
  rowNew4.getCell(43).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //   darjah/tingkatan 1
  rowNew4.getCell(44).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //   darjah/tingkatan 1
  rowNew4.getCell(45).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //   darjah/tingkatan 1
  rowNew4.getCell(46).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //   darjah/tingkatan 1
  rowNew4.commit();

  // darjah/tingkatan 2
  let rowNew5 = worksheet.getRow(20);

  // darjah/tingkatan 3
  let rowNew9 = worksheet.getRow(23);

  // darjah/tingkatan 4
  let rowNew13 = worksheet.getRow(26);

  // darjah/tingkatan 5
  let rowNew17 = worksheet.getRow(29);

  // 6 /peralihan
  let rowNew21 = worksheet.getRow(32);

  // kki
  let rowNew25 = worksheet.getRow(32);

  // others
  let rowNew29 = worksheet.getRow(7);
  rowNew29.getCell(9).value = klinik; // nama klinik
  rowNew29.commit();

  let rowNew30 = worksheet.getRow(8);
  rowNew30.getCell(9).value = sekolah; // nama sekolak
  rowNew30.commit();

  // let rowNew31 = worksheet.getRow(9);
  // rowNew31.getCell(9).value = results.jenisPerkhidmatanPergigian; //
  // rowNew31.commit();

  // let rowNew32 = worksheet.getRow(7);
  // rowNew32.getCell(27).value = results.tarikhTempat; //
  // rowNew32.commit();

  // let rowNew33 = worksheet.getRow(8);
  // rowNew33.getCell(27).value = results.bilHariProjek; //
  // rowNew32.commit();

  // let rowNew34 = worksheet.getRow(7);
  // rowNew34.getCell(44).value = results.tarikhMula; //
  // rowNew34.commit();

  // let rowNew35 = worksheet.getRow(8);
  // rowNew35.getCell(44).value = results.tarikhSelesai; //
  // rowNew35.commit();

  // let rowNew36 = worksheet.getRow(9);
  // rowNew36.getCell(44).value = results.namaPetugas; //
  // rowNew36.commit();

  let newfile = path.join(
    __dirname,
    '..',
    'public',
    'exports',
    'test-' + klinik + '-PG201SMKP.xlsx'
  );

  // Write the file
  await workbook.xlsx.writeFile(newfile);

  setTimeout(function () {
    fs.unlinkSync(newfile); // delete this file after 30 seconds
  }, 30000);
}
async function mapperPG203(results, klinik) {
  let filename = path.join(__dirname, '..', 'public', 'exports', 'PGS203.xlsx');
  let workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);
  let worksheet = workbook.getWorksheet('PGS203');

  //Reten PGS 203
  //Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  let rowNew4 = worksheet.getRow(20);
  rowNew4.getCell(3).value =
    results.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(4).value = results.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(5).value = results.dataPemeriksaan[0].jumlahd; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(6).value = results.dataPemeriksaan[0].jumlahf; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(7).value = results.dataPemeriksaan[0].jumlahx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(10).value = results.dataPemeriksaan[0].jumlahD; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(11).value = results.dataPemeriksaan[0].jumlahM; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(12).value = results.dataPemeriksaan[0].jumlahF; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(13).value = results.dataPemeriksaan[0].jumlahX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(16).value = results.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(17).value = results.dataPemeriksaan[0].dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(18).value = results.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(19).value =
    results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(20).value =
    results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(21).value =
    results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(22).value = results.dataPemeriksaan[0].eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(23).value =
    results.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(24).value = results.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(25).value = results.dataPemeriksaan[0].tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(26).value = results.dataPemeriksaan[0].skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(27).value = results.dataPemeriksaan[0].skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(28).value = results.dataPemeriksaan[0].skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(29).value = results.dataPemeriksaan[0].skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // kena campur dgn semula
  rowNew4.getCell(30).value = results.dataPemeriksaan[0].perluFvMuridB; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // kena campur dgn semula
  rowNew4.getCell(31).value = results.dataPemeriksaan[0].perluPRR1MuridB; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // kena campur dgn semula
  rowNew4.getCell(32).value = results.dataPemeriksaan[0].perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(34).value = results.dataPemeriksaan[0].perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(35).value = results.dataPemeriksaan[0].perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(36).value = results.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(37).value = results.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(38).value = results.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(39).value = results.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(40).value = results.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(41).value = results.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(42).value = results.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(43).value = results.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(44).value = results.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(45).value = results.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(46).value = results.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(47).value = results.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // campur Baru semua
  rowNew4.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // campur baru semula 2 atas ni
  rowNew4.getCell(52).value = results.dataRawatan[0].BARU_MuridBuatFs; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(53).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(54).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(55).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(56).value =
    results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(57).value =
    results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(58).value =
    results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(59).value =
    results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(60).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(61).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(62).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(63).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(64).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(65).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(66).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(67).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(70).value = results.dataRawatan[0].cabutDesidus; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(71).value = results.dataRawatan[0].cabutKekal; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew4.getCell(73).value = results.dataRawatan[0].penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // ni case completed
  rowNew4.getCell(74).value = results.dataRawatan[0].caseCompletedICDAS; //Kes Selesai Klinik atau Pusat Pergigian Sekolah (Tahun 1)a
  // ni case completed
  rowNew4.commit();

  //Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
  let rowNew20 = worksheet.getRow(29);
  rowNew20.getCell(3).value =
    results.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(4).value =
    results.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(5).value = results.dataPemeriksaan[0].jumlahd; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(6).value = results.dataPemeriksaan[0].jumlahf; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(7).value = results.dataPemeriksaan[0].jumlahx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(10).value = results.dataPemeriksaan[0].jumlahD; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(11).value = results.dataPemeriksaan[0].jumlahM; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(12).value = results.dataPemeriksaan[0].jumlahF; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(13).value = results.dataPemeriksaan[0].jumlahX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(16).value = results.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(17).value = results.dataPemeriksaan[0].dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(18).value = results.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(19).value =
    results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(20).value =
    results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(21).value =
    results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(22).value = results.dataPemeriksaan[0].eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(23).value =
    results.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(24).value =
    results.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(25).value = results.dataPemeriksaan[0].tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(26).value = results.dataPemeriksaan[0].skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(27).value = results.dataPemeriksaan[0].skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(28).value = results.dataPemeriksaan[0].skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(29).value = results.dataPemeriksaan[0].skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // kena campur dgn semula
  rowNew20.getCell(30).value = results.dataPemeriksaan[0].perluFvMuridB; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // kena campur dgn semula
  rowNew20.getCell(31).value = results.dataPemeriksaan[0].perluPRR1MuridB; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // kena campur dgn semula
  rowNew20.getCell(32).value = results.dataPemeriksaan[0].perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(34).value = results.dataPemeriksaan[0].perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(35).value = results.dataPemeriksaan[0].perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(36).value = results.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(37).value = results.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(38).value = results.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(39).value = results.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(40).value = results.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(41).value = results.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(42).value = results.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(43).value = results.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(44).value = results.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(45).value = results.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(46).value = results.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(47).value = results.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // campur Baru semua
  rowNew20.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // campur baru semula 2 atas ni
  rowNew20.getCell(52).value = results.dataRawatan[0].BARU_MuridBuatFs; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(53).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(54).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(55).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(56).value =
    results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(57).value =
    results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(58).value =
    results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(59).value =
    results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(60).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(61).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(62).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(63).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(64).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(65).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(66).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(67).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(70).value = results.dataRawatan[0].cabutDesidus; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(71).value = results.dataRawatan[0].cabutKekal; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  rowNew20.getCell(73).value = results.dataRawatan[0].penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tahun 1)
  // ni case completed
  rowNew20.getCell(74).value = results.dataRawatan[0].caseCompletedICDAS; //Kes Selesai Klinik atau Pusat Pergigian Sekolah (Tahun 1)a
  // ni case completed
  rowNew20.commit();

  let newfile = path.join(
    __dirname,
    '..',
    'public',
    'exports',
    'test-' + klinik + '-PGS203.xlsx'
  );

  // Write the file
  await workbook.xlsx.writeFile(newfile);

  setTimeout(function () {
    fs.unlinkSync(newfile); // delete this file after 30 seconds
  }, 30000);
  return 'it is done';
}
async function mapperPG201A(results, klinik, sekolah) {
  let filename = path.join(__dirname, '..', 'public', 'exports', 'PG201A.xlsx');
  console.log('getting workbook: ' + filename);
  let workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);
  let worksheet = workbook.getWorksheet('PG201A');
  console.log('setting row1');
  //
  let rowNamaKlinik = worksheet.getRow(7);
  // let klinikFixed = results.dataPemeriksan[0].createdByKp;
  // klinikFixed = klinikFixed
  //   .toLowerCase()
  //   .split(' ')
  //   .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
  //   .join(' ');
  rowNamaKlinik.getCell(9).value = 'Klinik Gigi';
  rowNamaKlinik.commit();
  // console.log('setting klinik name: ' + klinikFixed);
  //
  let rowNamaSekolah = worksheet.getRow(8);
  let sekolahFixed = results.dataPemeriksaan[0]._id;
  rowNamaSekolah.getCell(9).value = sekolahFixed;
  sekolahFixed = sekolahFixed
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  rowNamaSekolah.getCell(9).value = sekolahFixed;
  rowNamaSekolah.commit();
  console.log('setting sekolah name: ' + sekolahFixed);
  //
  let rowNamaJenis = worksheet.getRow(9);
  rowNamaJenis.getCell(9).value = 'PBSR';
  rowNamaJenis.commit();

  //PG201A
  // Reten Sekolah (Darjah 1)
  let rowNew = worksheet.getRow(17);
  rowNew.getCell(2).value =
    results.dataPemeriksaan[0].engganKedatanganPendaftaran; //Kedatangan enggan (Darjah 1)
  rowNew.getCell(3).value = results.dataPemeriksaan[0].kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 1)
  rowNew.getCell(4).value = results.dataPemeriksaan[0].enrolmen; //Kedatangan enrolmen (Darjah 1)
  rowNew.getCell(5).value = results.dataPemeriksaan[0].jumlahKedatanganBaru; //Kedatangan baru (Darjah 1)
  rowNew.getCell(6).value = results.dataPemeriksaan[0].jumlahKedatanganUlangan; //Kedatangan ulangan (Darjah 1)
  rowNew.getCell(8).value = results.dataPemeriksaan[0].skorPlakA; //Kebersihan Mulut Skor A (Darjah 1)
  rowNew.getCell(9).value = results.dataPemeriksaan[0].jumlahd; //Karies Gigi Desidus (d) (Darjah 1)
  rowNew.getCell(10).value = results.dataPemeriksaan[0].jumlahf; //Telah Ditampal Gigi Desidus (f) (Darjah 1)
  rowNew.getCell(11).value = results.dataPemeriksaan[0].jumlahx; //Gigi Desidus Perlu Ditampal (x) (Darjah 1)
  rowNew.getCell(13).value = results.dataPemeriksaan[0].jumlahE; //Karies Awal Gigi Kekal (E) (Darjah 1)
  rowNew.getCell(14).value = results.dataPemeriksaan[0].jumlahD; //Karies Gigi Kekal (D) (Darjah 1)
  rowNew.getCell(15).value = results.dataPemeriksaan[0].jumlahM; //Gigi Kekal Telah Dicabut (M) (Darjah 1)
  rowNew.getCell(16).value = results.dataPemeriksaan[0].jumlahF; //Gigi Kekal Telah Ditampal (F) (Darjah 1)
  rowNew.getCell(17).value = results.dataPemeriksaan[0].jumlahX; //Jumlah DMFX (Darjah 1)
  rowNew.getCell(19).value =
    results.dataPemeriksaan[0].gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 1)
  rowNew.getCell(20).value =
    results.dataPemeriksaan[0].totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.dataPemeriksaan[0].0  (Darjah 1)
  rowNew.getCell(21).value = results.dataPemeriksaan[0].eMoreThanZero; //E≥1 (ada karies awal) (Darjah 1)
  rowNew.getCell(22).value = results.dataPemeriksaan[0].jumlahMBK; //Mulut Bebas Karies (MBK) (Darjah 1)
  rowNew.getCell(23).value = results.dataPemeriksaan[0].statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.dataPemeriksaan[0].0 (Darjah 1)
  rowNew.getCell(24).value =
    results.dataPemeriksaan[0].statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 1)
  rowNew.getCell(25).value = results.dataPemeriksaan[0].dfxEqualToZero; //dfx=0 (Darjah 1)
  rowNew.getCell(26).value = results.dataPemeriksaan[0].jumlahMBG; //Mulut Bebas Gingivitis (MBG) (Darjah 1)
  rowNew.getCell(27).value = results.dataPemeriksaan[0].jumlahTprICDAS; //TPR ICDAS (Darjah 1)
  rowNew.getCell(28).value = results.dataPemeriksaan[0].kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 1)
  rowNew.getCell(29).value = results.dataPemeriksaan[0].cleftAda; //cleft Ada (Darjah 1)
  rowNew.getCell(30).value = results.dataPemeriksaan[0].cleftRujuk; //cleft Rujuk (Darjah 1)
  rowNew.getCell(32).value = results.dataPemeriksaan[0].perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 1)
  rowNew.getCell(33).value = results.dataPemeriksaan[0].perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 1)
  rowNew.getCell(34).value = results.dataPemeriksaan[0].perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 1)
  rowNew.getCell(35).value = results.dataPemeriksaan[0].perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 1)
  rowNew.getCell(36).value = results.dataPemeriksaan[0].perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 1)
  rowNew.getCell(37).value = results.dataPemeriksaan[0].perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 1)
  rowNew.getCell(38).value = results.dataPemeriksaan[0].perluPRR1GigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 1)
  rowNew.getCell(39).value = results.dataPemeriksaan[0].perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
  rowNew.getCell(40).value = results.dataPemeriksaan[0].perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
  rowNew.getCell(41).value = results.dataPemeriksaan[0].perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
  rowNew.getCell(42).value = results.dataPemeriksaan[0].perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
  rowNew.getCell(43).value = results.dataPemeriksaan[0].perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
  rowNew.getCell(44).value = results.dataPemeriksaan[0].perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
  rowNew.getCell(46).value = results.dataRawatan[0].BARU_MuridBuatFs; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 1)
  rowNew.getCell(47).value = results.dataRawatan[0].BARU_GgKekalBuatFs; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 1)
  rowNew.getCell(48).value = results.dataRawatan[0].BARU_MuridBuatFv; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 1)
  rowNew.getCell(49).value = results.dataRawatan[0].BARU_GgKekalBuatFv; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 1)
  rowNew.getCell(50).value = results.dataRawatan[0].BARU_MuridBuatPRR1; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 1)
  rowNew.getCell(51).value = results.dataRawatan[0].BARU_GgKekalBuatPRR1; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 1)
  rowNew.getCell(52).value =
    results.dataRawatan[0].BARU_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1)
  rowNew.getCell(53).value =
    results.dataRawatan[0].BARU_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1)
  rowNew.getCell(54).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1)
  rowNew.getCell(55).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1)
  rowNew.getCell(56).value =
    results.dataRawatan[0].BARU_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1)
  rowNew.getCell(57).value =
    results.dataRawatan[0].BARU_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1)
  rowNew.getCell(59).value = results.dataRawatan[0].cabutDesidus; // Gigi Desidus Dicabut (Darjah 1)
  rowNew.getCell(60).value = results.dataRawatan[0].cabutKekal; // Gigi Kekal Dicabut (Darjah 1)
  rowNew.getCell(61).value = results.dataRawatan[0].penskaleran; // Penskelaran (Darjah 1)
  rowNew.getCell(62).value = results.dataRawatan[0].caseCompletedICDAS; // Kes Selesai ICDAS (Darjah 1)
  rowNew.getCell(63).value = results.dataPemeriksaan[0].skorGIS0; // GIS SKOR 0 (Darjah 1)
  rowNew.getCell(64).value = results.dataPemeriksaan[0].skorGIS1; // GIS SKOR 1 (Darjah 1)
  rowNew.getCell(65).value = results.dataPemeriksaan[0].skorGIS2; // GIS SKOR 2 (Darjah 1)
  rowNew.getCell(66).value = results.dataPemeriksaan[0].skorGIS3; // GIS SKOR 3 (Darjah 1)
  rowNew.getCell(68).value = results.dataPemeriksaan[0].toothSurfaceLoss; // Trauma Tooth Surface Loss (Darjah 1)
  rowNew.getCell(69).value = results.dataPemeriksaan[0].traumaTisuLembut; // Trauma Tisu Lembut (Darjah 1)
  rowNew.getCell(70).value = results.dataPemeriksaan[0].traumaTisuKeras; // Trauma Tisu Keras (Darjah 1)
  rowNew.getCell(72).value =
    results.dataPemeriksaan[0].pesakitAdaFullDentureAtas; // Pesakit Ada Full Denture Atas(Darjah 1)
  rowNew.getCell(73).value =
    results.dataPemeriksaan[0].pesakitAdaPartialDentureAtas; // Pesakit Ada Partial Denture Atas (Darjah 1)
  rowNew.getCell(74).value =
    results.dataPemeriksaan[0].pesakitPerluFullDentureAtas; // Pesakit Perlu Full Denture Atas (Darjah 1)
  rowNew.getCell(75).value =
    results.dataPemeriksaan[0].pesakitPerluPartialDentureAtas; // Pesakit Perlu Partial Denture Atas (Darjah 1)
  rowNew.commit();
  console.log('setting row2');
  let rowNew2 = worksheet.getRow(18);
  rowNew2.getCell(8).value = results.dataPemeriksaan[0].skorPlakC; //Kebersihan Mulut Skor C (Darjah 1)
  rowNew2.commit();
  console.log('setting row3');
  let rowNew3 = worksheet.getRow(19);
  rowNew3.getCell(8).value = results.dataPemeriksaan[0].skorPlakE; //Kebersihan Mulut Skor E (Darjah 1)
  rowNew3.getCell(33).value = results.dataPemeriksaan[0].perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 1)
  rowNew3.getCell(35).value = results.dataPemeriksaan[0].perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 1)
  rowNew3.getCell(36).value = results.dataPemeriksaan[0].perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 1)
  rowNew3.getCell(37).value = results.dataPemeriksaan[0].perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 1)
  rowNew3.getCell(38).value = results.dataPemeriksaan[0].perluPRR1GigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 1)
  rowNew3.getCell(39).value = results.dataPemeriksaan[0].perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
  rowNew3.getCell(40).value = results.dataPemeriksaan[0].perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
  rowNew3.getCell(41).value = results.dataPemeriksaan[0].perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
  rowNew3.getCell(42).value = results.dataPemeriksaan[0].perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
  rowNew3.getCell(43).value = results.dataPemeriksaan[0].perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
  rowNew3.getCell(44).value = results.dataPemeriksaan[0].perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
  rowNew3.getCell(46).value = results.dataRawatan[0].SEMULA_MuridBuatFs; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 1)
  rowNew3.getCell(47).value = results.dataRawatan[0].SEMULA_GgKekalBuatFs; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 1)
  rowNew3.getCell(48).value = results.dataRawatan[0].SEMULA_MuridBuatFv; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 1)
  rowNew3.getCell(49).value = results.dataRawatan[0].SEMULA_GgKekalBuatFv; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 1)
  rowNew3.getCell(50).value = results.dataRawatan[0].SEMULA_MuridBuatPRR1; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 1)
  rowNew3.getCell(51).value = results.dataRawatan[0].SEMULA_GgKekalBuatPRR1; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 1)
  rowNew3.getCell(52).value =
    results.dataRawatan[0].SEMULA_GgDesidusAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1)
  rowNew3.getCell(53).value =
    results.dataRawatan[0].SEMULA_GgKekalAnteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1)
  rowNew3.getCell(54).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1)
  rowNew3.getCell(55).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanSewarna; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
  rowNew3.getCell(56).value =
    results.dataRawatan[0].SEMULA_GgDesidusPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1)
  rowNew3.getCell(57).value =
    results.dataRawatan[0].SEMULA_GgKekalPosteriorBuatTampalanAmalgam; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1)
  rowNew3.getCell(72).value =
    results.dataPemeriksaan[0].pesakitAdaFullDentureBawah; // Pesakit Ada Full Denture Bawah (Darjah 1)
  rowNew3.getCell(73).value =
    results.dataPemeriksaan[0].pesakitAdaPartialDentureBawah; // Pesakit Ada Partial Denture Bawah (Darjah 1)
  rowNew3.getCell(74).value =
    results.dataPemeriksaan[0].pesakitPerluFullDentureBawah; // Pesakit Perlu Full Denture Bawah (Darjah 1)
  rowNew3.getCell(75).value =
    results.dataPemeriksaan[0].pesakitPerluPartialDentureBawah; // Pesakit Perlu Partial Denture Bawah (Darjah 1)
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
    'test-' + klinik + '-PG201A.xlsx'
  );
  // Write the file
  await workbook.xlsx.writeFile(newfile);
  console.log('writing file');
  setTimeout(function () {
    fs.unlinkSync(newfile); // delete this file after 30 seconds
    console.log('deleting file');
  }, 15000);
  return 'it is done';
}

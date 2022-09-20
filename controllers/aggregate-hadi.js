        //Saiful PPIM 03-2020      
        PPIM03: function (  callback) {
        Sekolah.aggregate(
          [
            { $match:[
                          { $eq: ['$baruUlanganKedatanganPendaftaran', 'baru-kedatangan-pendaftaran'] },
                          //{ $lt: ['$umur', 1] }, Kena asingkan sama ada darjah atau tingkatan
                        
                        ], },
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

                perokokLelakiLainLain: {   // lain-lain di sini
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

                perokokPerempuanLainLain: {   // lain-lain di sini
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




                
        //PPIM 04-2020
        //Nama perokok 1
        let rowNew1= worksheet.getRow(11);
          rowNew1.getCell(1).value=results.nama;                  //C11          Nama perokok 1
          rowNew1.getCell(2).value=results.kelas;                  //C11          Nama perokok 1
          rowNew1.getCell(3).value=results.tarikhIntervensi1;                  //C11          Nama perokok 1
          rowNew1.getCell(4).value=results.tarikhIntervensi2;                  //C11          Nama perokok 1
          rowNew1.getCell(5).value=results.tarikhIntervensi3;                  //C11          Nama perokok 1
          rowNew1.getCell(6).value=results.tarikhIntervensi4;                  //C11          Nama perokok 1
          rowNew1.getCell(7).value=results.adaTiadaQ;                  //C11          Nama perokok 1
          rowNew1.getCell(8).value=results.adaTiadaQ;                  //C11          Nama perokok 1
          rowNew1.getCell(9).value=results.tarikhQ;                  //C11          Nama perokok 1
          rowNew1.getCell(10).value=results.rujukGuruKaunseling;                  //C11          Nama perokok 1
          rowNew1.getCell(11).value=results.statusSelepas6Bulan;                  //C11          Nama perokok 1
          rowNew1.getCell(12).value=results.statusSelepas6Bulan;                  //C11          Nama perokok 1


          // Tutup PPIM 04-2020



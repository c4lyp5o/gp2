//Saiful PPIM 03-2020      resultPGS206FFR: function (callback) {
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


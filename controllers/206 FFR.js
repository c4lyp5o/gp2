exports.testFunction3 = function (req, res) {
  async.parallel(
    {
      // break line to add more aggregate. please add this break line if you are using multiple aggregate
      result206FFR: function (callback) {
        Sekolah.aggregate(
          [
            { $match: {} }, /// match mengikut kategori pesakit
            {
              $group: {
                _id: '$namaSekolah',
                kedatanganTahunSemasa: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$baruUlanganKedatanganPendaftaran', true] },
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
                        $or: [
                          { $gte: ['$baruJumlahGigiKekalDiberiFv', 1] },
                          { $gte: ['$semulaJumlahGigiKekalDiberiFv', 1] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                prrJenis1: {
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $gte: ['$baruUlanganKedatanganPendaftaran', true] },
                          {
                            $gte: ['$semulaJumlahGigiKekalDiberiPrrJenis1', 1],
                          },
                          { $gte: ['$baruJumlahGigiKekalDiberiPrrJenis1', 0] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                /*
                muridBaruFS: {         murid baru & ulangan fissue sealan fissure perlu variable untuk rujukan
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $gte: ['$baruJumlahGigiKekalDiberiPrrJenis1', 1] },
                          {
                            $gte: ['$semulaJumlahGigiKekalDiberiPrrJenis1', 1],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },*/
                gigiBaruFS: { $sum: '$baruJumlahGigiKekalDibuatFs' },
                gigiUlanganFS: { $sum: '$semulaJumlahGigiKekalDibuatFs' },

                tampalanAntGdBaru: {
                  $sum: '$gdBaruAnteriorSewarnaJumlahTampalanDibuat',
                },
                tampalanAntGdUlangan: {
                  $sum: '$gdSemulaAnteriorSewarnaJumlahTampalanDibuat',
                },

                tampalanAntGkBaru: {
                  $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                },
                tampalanAntGkUlangan: {
                  $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                },

                tampalanPostGdBaru: {
                  $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                },
                tampalanPostGdUlangan: {
                  $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                },

                tampalanPostGkBaru: {
                  $sum: '$gkBaruAnteriorSewarnaJumlahTampalanDibuat',
                },
                tampalanPostGkUlangan: {
                  $sum: '$gkSemulaAnteriorSewarnaJumlahTampalanDibuat',
                },

                tampalanPostAmgGdBaru: {
                  $sum: '$gdBaruPosteriorAmalgamJumlahTampalanDibuat',
                },
                tampalanPostAmgGdUlangan: {
                  $sum: '$GdSemulaPosteriorAmalgamJumlahTampalanDibuat',
                },

                tampalanPostAmgGkBaru: {
                  $sum: '$gkBaruPosteriorAmalgamJumlahTampalanDibuat',
                },
                tampalanPostAmgGkUlangan: {
                  $sum: '$gkSemulaPosteriorAmalgamJumlahTampalanDibuat',
                },

                tampalanSementara: {
                  $sum: '$jumlahTampalanSementaraPenyataAkhir2',
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
                kesSelesai: {
                  $sum: '$kesSelesaiPenyataAkhir2',
                },

                rokokSaringNasihat: {
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $eq: ['$statusM', 'perokokSemasa'] },
                          { $eq: ['$statusM', 'bekasPerokok'] },
                          { $eq: ['$statusM', 'perokokPasif'] },
                          { $eq: ['$statusM', 'bukanPerokok'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                rokokIntervensi: {
                  $sum: '$kesSelesaiPenyataAkhir2', // Kira berapa tarikh diisi yang telah diisi
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

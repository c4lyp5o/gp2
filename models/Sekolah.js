const mongoose = require('mongoose');

const SekolahSchema = new mongoose.Schema({
  // save status rawatan when user fill rawatanSekolah -----------------
  statusRawatan: {
    type: String,
    required: true,
    default: 'belum mula',
  },
  // supplied by ERKM --------------------------------------------------
  nama: {
    type: String,
    required: [true, 'Please provide nama'],
    trim: true,
  },
  jantina: {
    type: String,
    required: [true, 'Please provide jantina'],
  },
  umur: {
    type: Number,
    required: [true, 'Please provide umur'],
  },
  namaSekolah: {
    type: String,
    required: [true, 'Please provide nama sekolah'],
  },
  kelas: {
    type: String,
    required: [true, 'Please provide kelas'],
  },
  ic: {
    type: String,
    required: [true, 'Please provide IC'],
  },
  tarikhLahir: {
    type: String,
    required: [true, 'Please provide tarikh lahir'],
  },
  warganegara: {
    type: String,
    required: [true, 'Please provide warganegara'],
  },
  bangsa: {
    type: String,
    required: [true, 'Please provide bangsa'],
  },
  darjah: {
    type: Number,
  },
  tingkatan: {
    type: Number,
  },
  // pemeriksaan -------------------------------------------------------
  pemeriksaanSekolah: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pemeriksaansekolah',
  },
  // rawatan -----------------------------------------------------------
  rawatanSekolah: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rawatansekolah',
    },
  ],
  // kotak -------------------------------------------------------------
  kotakSekolah: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kotaksekolah',
  },
  // // pendaftaran -------------------------------------------------------
  // baruUlanganKedatanganPendaftaran: {
  //   type: String,
  //   default: '',
  // },
  // tinggiRendahRisikoSekolahPendaftaran: {
  //   type: String,
  //   default: '',
  // },
  // // pemeriksaan awal div 1
  // // pemeriksaan awal div 2
  // // pemeriksaan awal div 3
  // // penyata akhir 1 --------------------------------------------------
  // baruJumlahGigiKekalDibuatFs: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // semulaJumlahGigiKekalDibuatFs: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // baruJumlahGigiKekalDiberiFv: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // semulaJumlahGigiKekalDiberiFv: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // baruJumlahGigiKekalDiberiPrrJenis1: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // semulaJumlahGigiKekalDiberiPrrJenis1: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // baruJumlahGigiYangDiberiSdf: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // semulaJumlahGigiYangDiberiSdf: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gdBaruAnteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gdSemulaAnteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gkBaruAnteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gkSemulaAnteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gdBaruPosteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gdSemulaPosteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gkBaruPosteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gkSemulaPosteriorSewarnaJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gdBaruPosteriorAmalgamJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gdSemulaPosteriorAmalgamJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gkBaruPosteriorAmalgamJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // gkSemulaPosteriorAmalgamJumlahTampalanDibuat: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // // penyata akhir 2 --------------------------------------------------
  // cabutDesidusPenyataAkhir2: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // cabutKekalPenyataAkhir2: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // jumlahTampalanSementaraPenyataAkhir2: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // pulpotomiPenyataAkhir2: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // endodontikPenyataAkhir2: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // absesPenyataAkhir2: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // penskaleranPenyataAkhir2: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // kesSelesaiPenyataAkhir2: {
  //   type: Boolean,
  //   default: false,
  // },
  // kesSelesaiIcdasPenyataAkhir2: {
  //   type: Boolean,
  //   default: false,
  // },
  // rujukPenyataAkhir2: {
  //   type: Boolean,
  //   default: false,
  // },
  // ceramahPromosiPenyataAkhir2: {
  //   type: String,
  //   default: '',
  // },
  // lmgPromosiPenyataAkhir2: {
  //   type: String,
  //   default: '',
  // },
  // yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2: {
  //   type: String,
  //   default: '',
  // },
  // plakGigiNasihatPergigianIndividuPromosiPenyataAkhir2: {
  //   type: Boolean,
  //   default: false,
  // },
  // dietPemakananNasihatPergigianIndividuPromosiPenyataAkhir2: {
  //   type: Boolean,
  //   default: false,
  // },
  // penjagaanKesihatanMulutNasihatPergigianIndividuPromosiPenyataAkhir2: {
  //   type: Boolean,
  //   default: false,
  // },
  // kanserMulutNasihatPergigianIndividuPromosiPenyataAkhir2: {
  //   type: Boolean,
  //   default: false,
  // },
  // // kotak --------------------------------------------------
  // tarikh1: {
  //   type: String,
  //   default: '',
  // },
  // tarikh2: {
  //   type: String,
  //   default: '',
  // },
  // tarikh3: {
  //   type: String,
  //   default: '',
  // },
  // tarikh4: {
  //   type: String,
  //   default: '',
  // },
  // adaTiadaQ: {
  //   type: String,
  //   default: '',
  // },
  // rujukGuruKaunseling: {
  //   type: String,
  //   default: '',
  // },
  // tarikhQ: {
  //   type: String,
  //   default: '',
  // },
  // statusSelepas6Bulan: {
  //   type: String,
  //   default: '',
  // },
});

module.exports = mongoose.model('Sekolah', SekolahSchema);

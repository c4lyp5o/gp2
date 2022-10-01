const mongoose = require('mongoose');

const RawatansekolahSchema = new mongoose.Schema({
  // negeri, daerah, kp, operator are associated with each rawatan
  createdByNegeri: {
    type: String,
    required: true,
  },
  createdByDaerah: {
    type: String,
    required: true,
  },
  createdByKp: {
    type: String,
    required: true,
  },
  createdByUsername: {
    type: String,
    required: true,
  },
  // rawatan ----------------------------------------------------------
  tarikhRawatanSemasa: {
    type: String,
    default: '',
  },
  muridDibuatFs: {
    type: Boolean,
    default: false,
  },
  baruJumlahGigiKekalDibuatFs: {
    type: Number,
    min: 0,
    default: 0,
  },
  // semulaJumlahGigiKekalDibuatFs: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // baruJumlahMuridDibuatFs: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // semulaJumlahMuridDibuatFs: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  muridDiberiFv: {
    type: Boolean,
    default: false,
  },
  baruJumlahGigiKekalDiberiFv: {
    type: Number,
    min: 0,
    default: 0,
  },
  // semulaJumlahGigiKekalDiberiFv: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // baruJumlahMuridDiberiFv: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // semulaJumlahMuridDiberiFv: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  muridDiberiPrrJenis1: {
    type: Boolean,
    default: false,
  },
  baruJumlahGigiKekalDiberiPrrJenis1: {
    type: Number,
    min: 0,
    default: 0,
  },
  // semulaJumlahGigiKekalDiberiPrrJenis1: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // baruJumlahMuridDiberiPrrJenis1: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  // semulaJumlahMuridDiberiPrrJenis1: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  baruJumlahGigiYangDiberiSdf: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaJumlahGigiYangDiberiSdf: {
    type: Number,
    min: 0,
    default: 0,
  },
  gdBaruAnteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gdSemulaAnteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gkBaruAnteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gkSemulaAnteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gdBaruPosteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gdSemulaPosteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gkBaruPosteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gkSemulaPosteriorSewarnaJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gdBaruPosteriorAmalgamJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gdSemulaPosteriorAmalgamJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gkBaruPosteriorAmalgamJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  gkSemulaPosteriorAmalgamJumlahTampalanDibuat: {
    type: Number,
    min: 0,
    default: 0,
  },
  cabutDesidusSekolahRawatan: {
    type: Number,
    min: 0,
    default: 0,
  },
  cabutKekalSekolahRawatan: {
    type: Number,
    min: 0,
    default: 0,
  },
  jumlahTampalanSementaraSekolahRawatan: {
    type: Number,
    min: 0,
    default: 0,
  },
  pulpotomiSekolahRawatan: {
    type: Number,
    min: 0,
    default: 0,
  },
  endodontikSekolahRawatan: {
    type: Number,
    min: 0,
    default: 0,
  },
  absesSekolahRawatan: {
    type: Number,
    min: 0,
    default: 0,
  },
  penskaleranSekolahRawatan: {
    type: Number,
    min: 0,
    default: 0,
  },
  kesSelesaiSekolahRawatan: {
    type: Boolean,
    default: false,
  },
  kesSelesaiIcdasSekolahRawatan: {
    type: Boolean,
    default: false,
  },
  rujukSekolahRawatan: {
    type: Boolean,
    default: false,
  },
  ceramahPromosiSekolahRawatan: {
    type: String,
    default: '',
  },
  lmgPromosiSekolahRawatan: {
    type: String,
    default: '',
  },
  yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan: {
    type: String,
    default: '',
  },
  yaTidakLawatanKeRumahPromosiSekolahRawatan: {
    type: String,
    default: '',
  },
  plakGigiNasihatPergigianIndividuPromosiSekolahRawatan: {
    type: Boolean,
    default: false,
  },
  dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan: {
    type: Boolean,
    default: false,
  },
  penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan: {
    type: Boolean,
    default: false,
  },
  kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Rawatansekolah', RawatansekolahSchema);

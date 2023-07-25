const mongoose = require('mongoose');

const RawatansekolahSchema = new mongoose.Schema(
  {
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
    createdByKodFasiliti: {
      type: String,
      required: true,
    },
    createdByUsername: {
      type: String,
      required: true,
    },
    createdByMdcMdtb: {
      type: String,
      required: true,
    },
    // rawatan ----------------------------------------------------------
    engganTidakHadirRawatan: {
      type: String,
      default: '',
    },
    engganRawatan: {
      type: String,
      default: '',
    },
    kebenaranRawatan: {
      type: String,
      default: '',
    },
    tidakHadirRawatan: {
      type: String,
      default: '',
    },
    tarikhRawatanSemasa: {
      type: String,
      default: '',
    },
    // kpmbpb ------------------------------------------------------------
    menggunakanKPBMPB: {
      type: String,
      default: '',
    },
    penggunaanKPBMPB: {
      type: String,
      default: '',
    },
    // rawatan -----------------------------------------------------------
    baruJumlahGigiKekalDibuatFs: {
      type: Number,
      min: 0,
      default: 0,
    },
    muridDiberiFv: {
      type: Boolean,
      default: false,
    },
    baruJumlahGigiKekalDiberiPrrJenis1: {
      type: Number,
      min: 0,
      default: 0,
    },
    // use one day maybe??
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
    jumlahTampalanSementaraSekolahRawatan: {
      type: Number,
      min: 0,
      default: 0,
    },
    penskaleranSekolahRawatan: {
      type: Boolean,
      default: false,
    },
    rujukKlinikSekolahRawatan: {
      type: Boolean,
      default: false,
    },
    rujukKlinikRawatanEndo: {
      type: Boolean,
      default: false,
    },
    rujukKlinikCabutanGigiKekal: {
      type: Boolean,
      default: false,
    },
    rujukKesTrauma: {
      type: Boolean,
      default: false,
    },
    rujukMasalahKesihatan: {
      type: Boolean,
      default: false,
    },
    rujukBukanWarganegara: {
      type: Boolean,
      default: false,
    },
    rujukLainLain: {
      type: Boolean,
      default: false,
    },
    rujukLainLanjutan: {
      type: String,
      default: '',
    },
    rujukRawatanOrtodontikSekolahRawatan: {
      type: Boolean,
      default: false,
    },
    rujukPakarPatologiSekolahRawatan: {
      type: Boolean,
      default: false,
    },
    rujukPakarRestoratifSekolahRawatan: {
      type: Boolean,
      default: false,
    },
    rujukPakarBedahMulutSekolahRawatan: {
      type: Boolean,
      default: false,
    },
    rujukPakarPediatrikSekolahRawatan: {
      type: Boolean,
      default: false,
    },
    kesSelesaiSekolahRawatan: {
      type: String,
      default: '',
    },
    kesSelesaiIcdasSekolahRawatan: {
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
    createdSalahreten: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rawatansekolah', RawatansekolahSchema);

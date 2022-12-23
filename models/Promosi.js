const mongoose = require('mongoose');

const PromosiSchema = new mongoose.Schema(
  {
    // negeri, daerah, kp, operator are associated with each promosi
    createdByNegeri: { type: String, default: '' },
    createdByDaerah: { type: String, default: '' },
    createdByKp: { type: String, default: '' },
    createdByKodFasiliti: { type: String, default: '' },
    createdByUsername: { type: String, required: true },
    createdByMdcMtdb: { type: String, required: true },
    tahunDibuat: { type: Number, default: 0 },
    // promosi individu or klinik ?
    promosiIndividu: { type: Boolean, default: false },
    promosiKlinik: { type: Boolean, default: false },
    // modal promosi
    kodProgram: { type: String, required: true },
    namaAcara: { type: String, default: '' },
    tarikhMula: { type: String, default: '' },
    tarikhAkhir: { type: String, default: '' },
    lokasi: { type: String, default: '' },
    // status reten promosi ----------------------------------------
    statusReten: { type: String, default: 'belum diisi' },
    // soft delete ----------------------------------------------
    deleted: { type: Boolean, default: false },
    deleteReason: { type: String, default: '' },
    deletedForOfficer: { type: String, default: '' },
    //maklumat acara
    mediaMassa: { type: String, default: '' },
    bilanganAktivitiTelevisyen: { type: Number, min: 0, default: 0 },
    bilanganPesertaTelevisyen: { type: Number, min: 0, default: 0 },
    bilanganAktivitiRadio: { type: Number, min: 0, default: 0 },
    bilanganPesertaRadio: { type: Number, min: 0, default: 0 },
    bilanganAktivitiCetak: { type: Number, min: 0, default: 0 },
    //bahagian a
    ceramahBahagianA: { type: Boolean, default: false },
    baruCeramahBahagianA: { type: Boolean, default: false },
    bilanganAktivitiBaruCeramahBahagianA: { type: Number, min: 0, default: 0 },
    bilanganPesertaBaruCeramahBahagianA: { type: Number, min: 0, default: 0 },
    ulangCeramahBahagianA: { type: Boolean, default: false },
    bilanganAktivitiUlangCeramahBahagianA: { type: Number, min: 0, default: 0 },
    bilanganPesertaUlangCeramahBahagianA: { type: Number, min: 0, default: 0 },
    latihanMemberusGigiBahagianA: { type: Boolean, default: false },
    baruLatihanMemberusGigiBahagianA: { type: Boolean, default: false },
    bilanganAktivitiBaruLatihanMemberusGigiBahagianA: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaBaruLatihanMemberusGigiBahagianA: {
      type: Number,
      min: 0,
      default: 0,
    },
    ulangLatihanMemberusGigiBahagianA: { type: Boolean, default: false },
    bilanganAktivitiUlangLatihanMemberusGigiBahagianA: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaUlangLatihanMemberusGigiBahagianA: {
      type: Number,
      min: 0,
      default: 0,
    },
    //bahagian b
    pameranKempenBahagianB: { type: Boolean, default: false },
    bilanganAktivitiPameranKempenBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaPameranKempenBahagianB: { type: Number, min: 0, default: 0 },
    pertunjukanBonekaBahagianB: { type: Boolean, default: false },
    bilanganAktivitiPertunjukanBonekaBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaPertunjukanBonekaBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    mainPerananBahagianB: { type: Boolean, default: false },
    bilanganAktivitiMainPerananBahagianB: { type: Number, min: 0, default: 0 },
    bilanganPesertaMainPerananBahagianB: { type: Number, min: 0, default: 0 },
    berceritaBahagianB: { type: Boolean, default: false },
    bilanganAktivitiBerceritaBahagianB: { type: Number, min: 0, default: 0 },
    bilanganPesertaBerceritaBahagianB: { type: Number, min: 0, default: 0 },
    pertandinganBahagianB: { type: Boolean, default: false },
    bilanganAktivitiPertandinganBahagianB: { type: Number, min: 0, default: 0 },
    bilanganPesertaPertandinganBahagianB: { type: Number, min: 0, default: 0 },
    permainanInteraktifBahagianB: { type: Boolean, default: false },
    bilanganAktivitiPermainanInteraktifBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaPermainanInteraktifBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    kursusSeminarBengkelBahagianB: { type: Boolean, default: false },
    bilanganAktivitiKursusSeminarBengkelBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaKursusSeminarBengkelBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    pertunjukanMultimediaBahagianB: { type: Boolean, default: false },
    bilanganAktivitiPertunjukanMultimediaBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaPertunjukanMultimediaBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    dentalBuskerBahagianB: { type: Boolean, default: false },
    bilanganAktivitiDentalBuskerBahagianB: { type: Number, min: 0, default: 0 },
    bilanganPesertaDentalBuskerBahagianB: { type: Number, min: 0, default: 0 },
    flashmobBahagianB: { type: Boolean, default: false },
    bilanganAktivitiFlashmobBahagianB: { type: Number, min: 0, default: 0 },
    bilanganPesertaFlashmobBahagianB: { type: Number, min: 0, default: 0 },
    lawatanKeRumahBahagianB: { type: Boolean, default: false },
    bilanganAktivitiLawatanKeRumahBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaLawatanKeRumahBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    // nasihat kesihatan pergigian
    plakGigiNasihatKesihatanPergigianBahagianB: {
      type: Boolean,
      default: false,
    },
    bilanganAktivitiPlakGigiBahagianB: { type: Number, min: 0, default: 0 },
    bilanganPesertaPlakGigiBahagianB: { type: Number, min: 0, default: 0 },
    dietPemakananNasihatKesihatanPergigianBahagianB: {
      type: Boolean,
      default: false,
    },
    bilanganAktivitiDietPemakananBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaDietPemakananBahagianB: { type: Number, min: 0, default: 0 },
    penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB: {
      type: Boolean,
      default: false,
    },
    bilanganAktivitiPenjagaanKesihatanMulutBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaPenjagaanKesihatanMulutBahagianB: {
      type: Number,
      min: 0,
      default: 0,
    },
    kanserMulutNasihatKesihatanPergigianBahagianB: {
      type: Boolean,
      default: false,
    },
    bilanganAktivitiKanserMulutBahagianB: { type: Number, min: 0, default: 0 },
    bilanganPesertaKanserMulutBahagianB: { type: Number, min: 0, default: 0 },
    // intervensi tabiat berisiko tinggi
    merokokIntervensiTabiatBerisikoTinggi: { type: Boolean, default: false },
    bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
    mengunyahSirihIntervensiTabiatBerisikoTinggi: {
      type: Boolean,
      default: false,
    },
    bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
    alkoholIntervensiTabiatBerisikoTinggi: { type: Boolean, default: false },
    bilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
    lainLainIntervensiTabiatBerisikoTinggi: { type: Boolean, default: false },
    bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
    bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promosi', PromosiSchema);

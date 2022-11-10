const mongoose = require('mongoose');

const PemeriksaansekolahSchema = new mongoose.Schema({
  // negeri, daerah, kp, operator are associated with each pemeriksaan
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
  // pemeriksaan -----------------------------------------------------------
  tarikhPemeriksaanSemasa: {
    type: String,
    default: '',
  },
  engganKedatanganPendaftaran: {
    type: Boolean,
    default: false,
  },
  tidakHadirKedatanganPendaftaran: {
    type: Boolean,
    default: false,
  },
  adaTiadaPemeriksaanPendaftaran: {
    type: String,
    default: '',
  },
  statikBergerak: {
    type: String,
    default: '',
  },
  kpBergerak: {
    type: Boolean,
    default: false,
  },
  plateNo: {
    type: String,
    default: '',
  },
  yaTidakSediaAdaStatusDenture: {
    type: String,
    default: '',
  },
  separaPenuhAtasSediaAdaDenture: {
    type: String,
    default: '',
  },
  separaPenuhBawahSediaAdaDenture: {
    type: String,
    default: '',
  },
  yaTidakPerluStatusDenture: {
    type: String,
    default: '',
  },
  separaPenuhAtasPerluDenture: {
    type: String,
    default: '',
  },
  separaPenuhBawahPerluDenture: {
    type: String,
    default: '',
  },
  dalamPemantauanKohort: {
    type: String,
    default: '',
  },
  statusM: {
    type: String,
    default: '',
  },
  menerimaNasihatRingkas: {
    type: String,
    default: '',
  },
  inginMelakukanIntervensiMerokok: {
    type: String,
    default: '',
  },
  kebersihanMulutOralHygiene: {
    type: String,
    default: '',
  },
  skorBpeOralHygiene: {
    type: String,
    default: '',
  },
  saringanKanserMulutOralHygiene: {
    type: Boolean,
    default: false,
  },
  skorGisMulutOralHygiene: {
    type: String,
    default: '',
  },
  adaDesidus: {
    type: Boolean,
    default: false,
  },
  dAdaGigiDesidus: {
    type: Number,
    min: 0,
    default: 0,
  },
  mAdaGigiDesidus: {
    type: Number,
    min: 0,
    default: 0,
  },
  fAdaGigiDesidus: {
    type: Number,
    min: 0,
    default: 0,
  },
  xAdaGigiDesidus: {
    type: Number,
    min: 0,
    default: 0,
  },
  // smAdaGigiDesidus: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // },
  adaKekal: {
    type: Boolean,
    default: false,
  },
  dAdaGigiKekal: {
    type: Number,
    min: 0,
    default: 0,
  },
  mAdaGigiKekal: {
    type: Number,
    min: 0,
    default: 0,
  },
  fAdaGigiKekal: {
    type: Number,
    min: 0,
    default: 0,
  },
  eAdaGigiKekal: {
    type: Number,
    min: 0,
    default: 0,
  },
  xAdaGigiKekal: {
    type: Number,
    min: 0,
    default: 0,
  },
  jumlahFaktorRisiko: {
    type: String,
    default: '',
  },
  adaCleftLip: {
    type: Boolean,
    default: false,
  },
  rujukCleftLip: {
    type: Boolean,
    default: false,
  },
  toothSurfaceLossTrauma: {
    type: Boolean,
    default: false,
  },
  kecederaanGigiAnteriorTrauma: {
    type: Boolean,
    default: false,
  },
  tisuLembutTrauma: {
    type: Boolean,
    default: false,
  },
  tisuKerasTrauma: {
    type: Boolean,
    default: false,
  },
  gicBilanganFsDibuat3TahunLepas: {
    type: Number,
    min: 0,
    default: 0,
  },
  resinBilanganFsDibuat3TahunLepas: {
    type: Number,
    min: 0,
    default: 0,
  },
  lainLainBilanganFsDibuat3TahunLepas: {
    type: Number,
    min: 0,
    default: 0,
  },
  dBilanganFsDibuat3TahunLepasTerjadi: {
    type: Number,
    min: 0,
    default: 0,
  },
  mBilanganFsDibuat3TahunLepasTerjadi: {
    type: Number,
    min: 0,
    default: 0,
  },
  fBilanganFsDibuat3TahunLepasTerjadi: {
    type: Number,
    min: 0,
    default: 0,
  },
  eBilanganFsDibuat3TahunLepasTerjadi: {
    type: Number,
    min: 0,
    default: 0,
  },
  xBilanganFsDibuat3TahunLepasTerjadi: {
    type: Number,
    min: 0,
    default: 0,
  },
  classID: {
    type: Number,
    min: 0,
    default: 0,
  },
  classIID: {
    type: Number,
    min: 0,
    default: 0,
  },
  classIF: {
    type: Number,
    min: 0,
    default: 0,
  },
  classIIF: {
    type: Number,
    min: 0,
    default: 0,
  },
  // perlu dibuat --------------------------------------------------------
  baruJumlahGigiKekalPerluFs: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaJumlahGigiKekalPerluFs: {
    type: Number,
    min: 0,
    default: 0,
  },
  jumlahGigiFsGagal: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruJumlahMuridPerluFs: {
    type: Boolean,
    default: false,
  },
  semulaJumlahMuridPerluFs: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruJumlahGigiKekalPerluFv: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaJumlahGigiKekalPerluFv: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruJumlahMuridPerluFv: {
    type: Boolean,
    default: false,
  },
  semulaJumlahMuridPerluFv: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruJumlahGigiKekalPerluPrrJenis1: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaJumlahGigiKekalPerluPrrJenis1: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruJumlahMuridPerluPrrJenis1: {
    type: Boolean,
    default: false,
  },
  semulaJumlahMuridPerluPrrJenis1: {
    type: Number,
    min: 0,
    default: 0,
  },
  yaTidakSilverDiamineFluoridePerluSapuan: {
    type: String,
    default: '',
  },
  baruGDAnteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaGDAnteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruGKAnteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaGKAnteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruGDPosteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaGDPosteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruGKPosteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaGKPosteriorSewarnaJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruGDPosteriorAmalgamJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaGDPosteriorAmalgamJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  baruGKPosteriorAmalgamJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
  semulaGKPosteriorAmalgamJumlahTampalanDiperlukan: {
    type: Number,
    min: 0,
    default: 0,
  },
});

module.exports = mongoose.model('Pemeriksaansekolah', PemeriksaansekolahSchema);

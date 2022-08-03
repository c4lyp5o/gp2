const mongoose = require('mongoose');

const UmumSchema = new mongoose.Schema(
  {
    // negeri, daerah, kp, operator are associated with each person
    createdByNegeri: {
      type: String,
      // required: true,
    },
    createdByDaerah: {
      type: String,
      // required: true,
    },
    createdByKp: {
      type: String,
      // required: true,
    },
    createdByUsername: {
      type: String,
      // required: true,
    },
    // pendaftaran pg101 --------------------------------------------------
    nama: {
      type: String,
      // required: [true, 'Please provide nama'],
      trim: true,
    },
    jenisIc: {
      type: String,
      // required: [true, 'Please provide jenis ic'],
      trim: true,
    },
    ic: {
      type: String,
      // required: [true, 'Please provide IC'],
      trim: true,
    },
    umur: {
      type: Number,
      // required: [true, 'Please provide umur'],
    },
    tarikhLahir: {
      type: String,
      // required: [true, 'Please provide tarikh lahir'],
    },
    tarikhKedatangan: {
      type: String,
      // required: [true, 'Please provide tarikh kedatangan'],
    },
    jantina: {
      type: String,
      // required: [true, 'Please provide jantina'],
    },
    alamat: {
      type: String,
      // required: [true, 'Please provide alamat'],
    },
    waktuSampai: {
      type: String,
      // required: [true, 'Please provide waktu sampai'],
    },
    kategoriPesakit: {
      type: String,
      // required: [true, 'Please provide kategori pesakit'],
    },
    statusPesara: {
      type: String,
      default: 'bukan-pesara',
    },
    kumpulanEtnik: {
      type: String,
      // required: [true, 'Please provide kumpulan etnik'],
    },
    rujukDaripada: {
      type: String,
      // required: [true, 'Please provide rujuk dari'],
    },
    //fasiliti perkhidmatan
    jenisFasiliti: {
      type: String,
      default: '',
    },
    kepp: {
      type: Boolean,
      default: false,
    },
    jenisProgramKomuniti: {
      type: String,
      default: '',
    },
    // end of pendaftaran pg101 -------------------------------------------
    //maklumat lanjut
    kedatangan: {
      type: String,
      default: '',
    },
    fasilitiTaskaTadika: {
      type: String,
      default: '',
    },
    jenisTaskaTadika: {
      type: String,
      default: '',
    },
    kelasToddler: {
      type: Boolean,
      default: false,
    },
    namaFasilitiTaskaTadika: {
      type: String,
      default: '',
    },
    enrolmenTaskaTadika: {
      type: Boolean,
      default: false,
    },
    kedatanganTaskaTadika: {
      type: String,
      default: '',
    },
    engganTaskaTadika: {
      type: Boolean,
      default: false,
    },
    tidakHadirTaskaTadika: {
      type: Boolean,
      default: false,
    },
    pemeriksaanTaskaTadika: {
      type: String,
      default: '',
    },
    kedatanganKEPP: {
      type: String,
      default: '',
    },
    tarikhRujukanKEPP: {
      type: String,
      default: '',
    },
    tarikhRundinganPertama: {
      type: String,
      default: '',
    },
    tarikhMulaRawatanKEPP: {
      type: String,
      default: '',
    },
    kpBergerakMaklumatLanjutUmum: {
      type: Boolean,
      default: false,
    },
    labelKpBergerakMaklumatLanjutUmum: {
      type: String,
      default: '',
    },
    pasukanPergigianBergerakMaklumatLanjutUmum: {
      type: Boolean,
      default: false,
    },
    makmalPergigianBergerakMaklumatLanjutUmum: {
      type: Boolean,
      default: false,
    },
    labelMakmalPergigianBergerakMaklumatLanjutUmum: {
      type: String,
      default: '',
    },
    kgAngkat: {
      type: Boolean,
      default: false,
    },
    institusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    ipgInstitusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    kolejKomunitiInstitusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    politeknikInstitusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    institutLatihanKerajaanInstitusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    giatmaraInstitusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    iptaInstitusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    iptsInstitusiPengajianTinggiKolej: {
      type: String,
      default: '',
    },
    enrolmenInstitusiPengajianTinggiKolej: {
      type: Boolean,
      default: false,
    },
    institusiOku: {
      type: String,
      default: '',
    },
    institusiWargaEmas: {
      type: String,
      default: '',
    },
    kerajaanInstitusiWargaEmas: {
      type: String,
      default: '',
    },
    swastaInstitusiWargaEmas: {
      type: String,
      default: '',
    },
    //pemeriksaan
    adaCleftLipPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    rujukCleftLipPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    yaTidakSediaAdaStatusDenturePemeriksaanUmum: {
      type: String,
      default: '',
    },
    separaPenuhAtasSediaAdaDenturePemeriksaanUmum: {
      type: String,
      default: '',
    },
    separaPenuhBawahSediaAdaDenturePemeriksaanUmum: {
      type: String,
      default: '',
    },
    yaTidakPerluStatusDenturePemeriksaanUmum: {
      type: String,
      default: '',
    },
    separaPenuhAtasPerluDenturePemeriksaanUmum: {
      type: String,
      default: '',
    },
    separaPenuhBawahPerluDenturePemeriksaanUmum: {
      type: String,
      default: '',
    },
    toothSurfaceLossTraumaPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    kecederaanGigiAnteriorTraumaPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    tisuLembutTraumaPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    tisuKerasTraumaPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    fvPerluSapuanPemeriksaanUmum: {
      type: String,
      default: '',
    },
    yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum: {
      type: String,
      default: '',
    },
    //kotak masuk sini
    statusMPemeriksaanUmum: {
      type: String,
      default: '',
    },
    jenisRPemeriksaanUmum: {
      type: String,
      default: '',
    },
    kebersihanMulutOralHygienePemeriksaanUmum: {
      type: String,
      default: '',
    },
    skorBpeOralHygienePemeriksaanUmum: {
      type: String,
      default: '',
    },
    skorGisMulutOralHygienePemeriksaanUmum: {
      type: String,
      default: '',
    },
    adaDesidusPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    dAdaGigiDesidusPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    mAdaGigiDesidusPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    fAdaGigiDesidusPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    smAdaGigiDesidusPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    xAdaGigiDesidusPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    adaKekalPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    dAdaGigiKekalPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    mAdaGigiKekalPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    fAdaGigiKekalPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    eAdaGigiKekalPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    xAdaGigiKekalPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahFaktorRisikoPemeriksaanUmum: {
      type: String,
      default: '',
    },
    edentulousWargaEmasPemeriksaanUmum: {
      type: String,
      default: '',
    },
    mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum: {
      type: String,
      default: '',
    },
    bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    disaringProgramKanserMulutPemeriksaanUmum: {
      type: String,
      default: '',
    },
    dirujukProgramKanserMulutPemeriksaanUmum: {
      type: String,
      default: '',
    },
    lesiMulutPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    tabiatBerisikoTinggiPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    rawatanLainKesEndodontikDiperlukanPemeriksaanUmum: {
      type: String,
      default: '',
    },
    cabutanKesEndodontikDiperlukanPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    tampalanKesEndodontikDiperlukanPemeriksaanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    //rawatan umum
    baruJumlahGigiKekalDibuatFSRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaJumlahGigiKekalDibuatFSRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    baruJumlahGigiKekalDiberiFVRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaJumlahGigiKekalDiberiFVRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    baruJumlahMuridDibuatFVRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaJumlahMuridDibuatFVRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    cabutDesidusRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    cabutKekalRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    komplikasiSelepasCabutanRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    cabutanDisebabkanPeriodontitisRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    yaTidakAbsesPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    baruSemulaAbsesPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    cabutanSurgikalPembedahanMulutRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    yaTidakFrakturPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    yaTidakTraumaPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    yaTidakPembedahanKecilMulutPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    kesSelesaiRawatanUmum: {
      type: Boolean,
      default: false,
    },
    baruJumlahGigiYangDiberiSdfRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaJumlahGigiYangDiberiSdfRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    baruJumlahCrownBridgeRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaJumlahCrownBridgeRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    baruJumlahPostCoreRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaJumlahPostCoreRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    penuhJumlahDenturProstodontikRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    sebahagianJumlahDenturProstodontikRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    immediateDenturProstodontikRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    pembaikanDenturProstodontikRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    penskaleranRawatanUmum: {
      type: Boolean,
      default: false,
    },
    rawatanLainPeriodontikRawatanUmum: {
      type: Boolean,
      default: false,
    },
    bilanganXrayYangDiambilRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    baruInlayOnlayJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaInlayOnlayJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahAnteriorRawatanSemulaKeppRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahPremolarRawatanSemulaKeppRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahMolarRawatanSemulaKeppRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahAnteriorKesEndodontikSelesaiRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahPremolarKesEndodontikSelesaiRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    jumlahMolarKesEndodontikSelesaiRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    memenuhiRditnKod3KesRujukUpprRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    restorasiPascaEndodontikKesRujukUpprRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    //promosi
    ceramahPromosiUmum: {
      type: String,
      default: '',
    },
    lmgPromosiUmum: {
      type: String,
      default: '',
    },
    kursusSeminarBengkelPromosiUmum: {
      type: Boolean,
      default: false,
    },
    mainPerananPromosiUmum: {
      type: Boolean,
      default: false,
    },
    pertunjukanBonekaPromosiUmum: {
      type: Boolean,
      default: false,
    },
    berceritaPromosiUmum: {
      type: Boolean,
      default: false,
    },
    plakGigiNasihatPergigianIndividuPromosiUmum: {
      type: Boolean,
      default: false,
    },
    penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum: {
      type: Boolean,
      default: false,
    },
    dietPemakananNasihatPergigianIndividuPromosiUmum: {
      type: Boolean,
      default: false,
    },
    kanserMulutNasihatPergigianIndividuPromosiUmum: {
      type: Boolean,
      default: false,
    },
    dirujukKaunselingPakarPublicHealthPromosiUmum: {
      type: Boolean,
      default: false,
    },
    umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    melaksanakanAktivitiBeginPromosiUmum: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Umum', UmumSchema);

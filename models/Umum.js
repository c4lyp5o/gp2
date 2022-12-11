const mongoose = require('mongoose');
const Runningnumber = require('./Runningnumber');

const UmumSchema = new mongoose.Schema(
  {
    // soft delete
    deleted: { type: Boolean, default: false },
    // negeri, daerah, kp, operator are associated with each person
    createdByNegeri: { type: String, default: '' },
    createdByDaerah: { type: String, default: '' },
    createdByKp: { type: String, default: '' },
    createdByKodFasiliti: { type: String, default: '' },
    createdByUsername: { type: String, required: true },
    createdByMdcMdtb: { type: String, default: '' },
    // status reten umum ----------------------------------------
    statusReten: { type: String, required: true, default: 'belum diisi' },
    // kaunter --------------------------------------------------
    uniqueId: { type: String },
    noSiri: { type: Number },
    jenisFasiliti: { type: String, required: true },
    tarikhKedatangan: { type: String, default: '' },
    waktuSampai: { type: String, default: '' },
    temujanji: { type: Boolean, default: false },
    kedatangan: { type: String, default: '' },
    noPendaftaranBaru: { type: String, default: '' },
    noPendaftaranUlangan: { type: String, default: '' },
    nama: { type: String, trim: true, default: '' },
    jenisIc: { type: String, default: '' },
    ic: { type: String, default: '' },
    nomborTelefon: { type: String, default: '' },
    emel: { type: String, default: '' },
    tarikhLahir: { type: String, default: '' },
    umur: { type: Number, default: 0 },
    umurBulan: { type: Number, default: 0 },
    jantina: { type: String, default: '' },
    kumpulanEtnik: { type: String, default: '' },
    alamat: { type: String, default: '' },
    daerahAlamat: { type: String, default: '' },
    negeriAlamat: { type: String, default: '' },
    poskodAlamat: { type: String, default: '' },
    ibuMengandung: { type: Boolean, default: false },
    episodeMengandung: { type: String, default: '' },
    orangKurangUpaya: { type: Boolean, default: false },
    bersekolah: { type: Boolean, default: false },
    noOku: { type: String, default: '' },
    statusPesara: { type: String, default: '' },
    noPesara: { type: String, default: '' },
    rujukDaripada: { type: String, default: '' },
    noBayaran: { type: String, default: '' },
    noResit: { type: String, default: '' },
    catatan: { type: String, default: '' },
    // kepp
    kepp: { type: Boolean, default: false },
    kedatanganKepp: { type: String, default: '' },
    tarikhRujukanKepp: { type: String, default: '' },
    tarikhRundinganPertama: { type: String, default: '' },
    tarikhMulaRawatanKepp: { type: String, default: '' },
    // penyampaian perkhidmatan
    kpBergerak: { type: Boolean, default: false },
    labelKpBergerak: { type: String, default: '' },
    pasukanPergigianBergerak: { type: Boolean, default: false },
    makmalPergigianBergerak: { type: Boolean, default: false },
    labelMakmalPergigianBergerak: { type: String, default: '' },
    // taska / tadika
    fasilitiTaskaTadika: { type: String, default: '' },
    kelasToddler: { type: Boolean, default: false },
    namaFasilitiTaskaTadika: { type: String, default: '' },
    enrolmenTaskaTadika: { type: Boolean, default: false },
    // ipt / kolej
    iptKolej: { type: String, default: '' },
    ipg: { type: String, default: '' },
    kolejKomuniti: { type: String, default: '' },
    politeknik: { type: String, default: '' },
    institutLatihanKerajaan: { type: String, default: '' },
    giatmara: { type: String, default: '' },
    ipta: { type: String, default: '' },
    ipts: { type: String, default: '' },
    enrolmenIptKolej: { type: Boolean, default: false },
    // institusi warga emas
    institusiWargaEmas: { type: String, default: '' },
    kerajaanInstitusiWargaEmas: { type: String, default: '' },
    swastaInstitusiWargaEmas: { type: String, default: '' },
    // institusi OKU
    institusiOku: { type: String, default: '' },
    // kampung angkat
    kgAngkat: { type: String, default: '' },
    // program based
    jenisProgram: { type: String, default: 'NOT APPLICABLE' },
    namaProgram: { type: String, default: 'NOT APPLICABLE' },
    // end of kaunter -------------------------------------------
    //pemeriksaan
    statusKehadiran: {
      type: Boolean,
      default: false,
    },
    waktuDipanggil: {
      type: String,
      default: '',
    },
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
    // kecederaanGigiAnteriorTraumaPemeriksaanUmum: {
    //   type: Boolean,
    //   default: false,
    // },
    // tisuLembutTraumaPemeriksaanUmum: {
    //   type: Boolean,
    //   default: false,
    // },
    // tisuKerasTraumaPemeriksaanUmum: {
    //   type: Boolean,
    //   default: false,
    // },
    fissureSealantPemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    baruJumlahGigiKekalPerluFSRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    fvPerluSapuanPemeriksaanUmum: {
      type: String,
      default: '',
    },
    prrJenis1PemeriksaanUmum: {
      type: Boolean,
      default: false,
    },
    baruJumlahGigiKekalPerluPRRJenis1RawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
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
    skorGisMulutOralHygienePemeriksaanUmum: {
      type: String,
      default: '',
    },
    perluPenskaleranPemeriksaanUmum: {
      type: Boolean,
      default: false,
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
    // smAdaGigiDesidusPemeriksaanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
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
    // edentulousWargaEmasPemeriksaanUmum: {
    //   type: String,
    //   default: '',
    // },
    // mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum: {
    //   type: String,
    //   default: '',
    // },
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
    // rawatanLainKesEndodontikDiperlukanPemeriksaanUmum: {
    //   type: String,
    //   default: '',
    // },
    // cabutanKesEndodontikDiperlukanPemeriksaanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // tampalanKesEndodontikDiperlukanPemeriksaanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    puncaRujukan: {
      type: String,
      default: '',
    },
    diabetesFaktorRisikoBpe: {
      type: Boolean,
      default: false,
    },
    perokokFaktorRisikoBpe: {
      type: Boolean,
      default: false,
    },
    lainLainFaktorRisikoBpe: {
      type: Boolean,
      default: false,
    },
    skorBpeOralHygienePemeriksaanUmum: {
      type: String,
      default: '',
    },
    pesakitMempunyaiImplanPergigian: {
      type: Boolean,
      default: false,
    },
    periImplantitis: {
      type: Boolean,
      default: false,
    },
    periImplantMucositis: {
      type: Boolean,
      default: false,
    },
    engganBpeImplan: {
      type: Boolean,
      default: false,
    },
    //rawatan umum
    pesakitDibuatFissureSealant: {
      type: Boolean,
      default: false,
    },
    baruJumlahGigiKekalDibuatFSRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    // semulaJumlahGigiKekalDibuatFSRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // baruJumlahMuridDibuatFsRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // semulaJumlahMuridDibuatFsRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    pesakitDibuatFluorideVarnish: {
      type: Boolean,
      default: false,
    },
    // baruJumlahGigiKekalDiberiFVRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // semulaJumlahGigiKekalDiberiFVRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // baruJumlahMuridDibuatFVRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // semulaJumlahMuridDibuatFVRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    pesakitDibuatPRRJenis1: {
      type: Boolean,
      default: false,
    },
    baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    // semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // baruJumlahMuridDiberiPrrJenis1RawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // semulaJumlahMuridDiberiPrrJenis1RawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
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
    // baruSemulaAbsesPembedahanRawatanUmum: {
    //   type: String,
    //   default: '',
    // },
    cabutanSurgikalPembedahanMulutRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    yaTidakFrakturPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    yaTidakPembedahanKecilMulutPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    yaTidakTraumaPembedahanRawatanUmum: {
      type: String,
      default: '',
    },
    kecederaanTulangMukaUmum: {
      type: Boolean,
      default: false,
    },
    kecederaanGigiUmum: {
      type: Boolean,
      default: false,
    },
    kecederaanTisuLembutUmum: {
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
    baruPenuhJumlahDenturProstodontikRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaPenuhJumlahDenturProstodontikRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    baruSeparaJumlahDenturProstodontikRawatanUmum: {
      type: Number,
      min: 0,
      default: 0,
    },
    semulaSeparaJumlahDenturProstodontikRawatanUmum: {
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
    // penskaleranRawatanUmum: {
    //   type: Boolean,
    //   default: false,
    // },
    // rawatanLainPeriodontikRawatanUmum: {
    //   type: Boolean,
    //   default: false,
    // },
    kaunselingDiet: {
      type: Boolean,
      default: false,
    },
    nasihatBerhentiMerokok: {
      type: Boolean,
      default: false,
    },
    lainLainPengurusanFaktorRisiko: {
      type: Boolean,
      default: false,
    },
    ohePengurusanFaktorSetempat: {
      type: Boolean,
      default: false,
    },
    penskaleranRawatanUmum: {
      type: Boolean,
      default: false,
    },
    pengilapanTampalanRungkup: {
      type: Boolean,
      default: false,
    },
    adjustasiOklusi: {
      type: Boolean,
      default: false,
    },
    cabutanPengurusanFaktorSetempat: {
      type: Boolean,
      default: false,
    },
    ektiparsiPulpa: {
      type: Boolean,
      default: false,
    },
    rawatanLainPeriodontikRawatanUmum: {
      type: Boolean,
      default: false,
    },
    rujukanPakarPeriodontik: {
      type: String,
      default: '',
    },
    engganLainRujukanPakarPeriodontik: {
      type: String,
      default: '',
    },
    rujukanPakarScd: {
      type: Boolean,
      default: false,
    },
    rujukanPakarUpkka: {
      type: Boolean,
      default: false,
    },
    kesSelesaiPeriodontium: {
      type: Boolean,
      default: false,
    },
    rawatanOrtodontikRawatanUmum: {
      type: Boolean,
      default: false,
    },
    kesPerubatanMulutRawatanUmum: {
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
    kesSelesaiRawatanUmum: {
      type: Boolean,
      default: false,
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
    melaksanakanAktivitiBeginPromosiUmum: {
      type: String,
      default: '',
    },
    lawatanKeRumahPromosiUmum: {
      type: String,
      default: '',
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
    dirujukKaunselingPakarPublicHealthPromosiUmum: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UmumSchema.pre('save', async function () {
  try {
    const yearNumber = new Date().getFullYear();
    // no siri punya hal
    if (this.jenisFasiliti === 'kp') {
      const currentNoSiri = await Runningnumber.findOne({
        jenis: 'nosiri',
        negeri: this.createdByNegeri,
        daerah: this.createdByDaerah,
        tahun: yearNumber,
        kp: this.createdByKp,
      });
      if (!currentNoSiri) {
        const newNoSiri = new Runningnumber({
          jenis: 'nosiri',
          negeri: this.createdByNegeri,
          daerah: this.createdByDaerah,
          tahun: yearNumber,
          kp: this.createdByKp,
          runningnumber: 1,
        });
        await newNoSiri.save();
        this.noSiri = newNoSiri.runningnumber;
      }
      if (currentNoSiri) {
        currentNoSiri.runningnumber += 1;
        await currentNoSiri.save();
        this.noSiri = currentNoSiri.runningnumber;
      }
    }
    // no siri punya hal

    // kedatangan baru ulangan punya hal
    if (this.kedatangan === 'baru-kedatangan') {
      // create acronym
      let acronym = '';
      const simplifiedKlinikName = this.createdByKp.split(' ');
      for (let i = 0; i < simplifiedKlinikName.length; i++) {
        acronym += simplifiedKlinikName[i].charAt(0);
      }
      // check running number
      let currentRunningNumber = await Runningnumber.findOne({
        jenis: this.jenisFasiliti,
        negeri: this.createdByNegeri,
        daerah: this.createdByDaerah,
        tahun: yearNumber,
        kp: this.createdByKp,
      });
      // if running number does not exist
      if (!currentRunningNumber) {
        const newRunningNumber = await Runningnumber.create({
          jenis: this.jenisFasiliti,
          negeri: this.createdByNegeri,
          daerah: this.createdByDaerah,
          tahun: yearNumber,
          kp: this.createdByKp,
          runningnumber: 1,
        });
        const newReg = `${this.jenisFasiliti}/${acronym}/${newRunningNumber.runningnumber}/${yearNumber}`;
        this.noPendaftaranBaru = newReg;
        console.log('no pendaftaran baru: ', newReg);
      }
      // if running number exist
      if (currentRunningNumber) {
        currentRunningNumber.runningnumber += 1;
        await currentRunningNumber.save();
        const newReg = `${this.jenisFasiliti}/${acronym}/${currentRunningNumber.runningnumber}/${yearNumber}`;
        this.noPendaftaranBaru = newReg;
        console.log('no pendaftaran baru: ', newReg);
      }
    }
    if (this.kedatangan === 'ulangan-kedatangan') {
      console.log('ini pasien lama');
    }
    // kedatangan baru ulangan punya hal
  } catch (err) {
    console.error(err);
  }
});

module.exports = mongoose.model('Umum', UmumSchema);

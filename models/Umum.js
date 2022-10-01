const mongoose = require('mongoose');
const Runningnumber = require('./Runningnumber');
const dbUmum = require('./Umum');

const UmumSchema = new mongoose.Schema(
  {
    // negeri, daerah, kp, operator are associated with each person
    createdByNegeri: { type: String, default: '' },
    createdByDaerah: { type: String, default: '' },
    createdByKp: { type: String, default: '' },
    createdByUsername: { type: String, required: true },
    // kaunter --------------------------------------------------
    uniqueId: { type: String }, // new
    jenisFasiliti: { type: String, required: true },
    tarikhKedatangan: { type: String, default: '' },
    waktuSampai: { type: String, default: '' },
    kedatangan: { type: String, default: '' },
    noPendaftaranBaru: { type: String, default: '' }, // new
    noPendaftaranUlangan: { type: String, default: '' }, // new
    nama: { type: String, trim: true, default: '' },
    jenisIc: { type: String, default: '' },
    ic: { type: String, default: '' },
    tarikhLahir: { type: String, default: '' },
    umur: { type: Number, default: 0 },
    umurBulan: { type: Number, default: 0 },
    jantina: { type: String, default: '' },
    kumpulanEtnik: { type: String, default: '' },
    alamat: { type: String, default: '' },
    daerahAlamat: { type: String, default: '' },
    negeriAlamat: { type: String, default: '' },
    poskodAlamat: { type: String, default: '' },
    // kategoriPesakit: { type: String, default: '' },
    ibuMengandung: { type: Boolean, default: false },
    orangKurangUpaya: { type: Boolean, default: false },
    bersekolah: { type: Boolean, default: false },
    noOku: { type: String, default: '' },
    statusPesara: { type: String, default: '' },
    rujukDaripada: { type: String, default: '' },
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
    jenisTaskaTadika: { type: String, default: '' },
    kelasToddler: { type: Boolean, default: false },
    namaFasilitiTaskaTadika: { type: String, default: '' },
    enrolmenTaskaTadika: { type: Boolean, default: false },
    engganTaskaTadika: { type: Boolean, default: false },
    tidakHadirTaskaTadika: { type: Boolean, default: false },
    pemeriksaanTaskaTadika: { type: String, default: '' },
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
    // end of kaunter -------------------------------------------
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
    skorBpeOralHygienePemeriksaanUmum: {
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
    penskaleranRawatanUmum: {
      type: Boolean,
      default: false,
    },
    rawatanLainPeriodontikRawatanUmum: {
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
    // jumlahAnteriorRawatanSemulaKeppRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // jumlahPremolarRawatanSemulaKeppRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
    // jumlahMolarRawatanSemulaKeppRawatanUmum: {
    //   type: Number,
    //   min: 0,
    //   default: 0,
    // },
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
    if (this.kedatangan === 'baru-kedatangan') {
      // get year number
      let yearNumber = new Date().getFullYear();
      // create acronym
      let acronym = '';
      const simplifiedKlinikName = this.createdByKp.split(' ');
      for (let i = 0; i < simplifiedKlinikName.length; i++) {
        acronym += simplifiedKlinikName[i].charAt(0);
      }
      // check running number
      let currentRunningNumber = await Runningnumber.findOne({
        jenis: 'umum',
        negeri: this.createdByNegeri,
        daerah: this.createdByDaerah,
        kp: this.createdByKp,
      });
      // if running number does not exist
      if (!currentRunningNumber) {
        const newRunningNumber = await Runningnumber.create({
          jenis: 'umum',
          negeri: this.createdByNegeri,
          daerah: this.createdByDaerah,
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
        console.log('no pendaftaran ulangan: ', newReg);
      }
      // }
      // if pt exists
      // if (currentPt) {
      //   this.kedatangan = 'ulangan-kedatangan';
      //   let currentRunningNumber = await Runningnumber.findOne({
      //     jenis: 'umum',
      //     negeri: this.negeri,
      //     daerah: this.daerah,
      //   });
      //   if (!currentRunningNumber) {
      //     const newRunningNumber = await Runningnumber.create({
      //       jenis: 'umum',
      //       negeri: this.negeri,
      //       daerah: this.daerah,
      //       runningnumber: 1,
      //     });
      //     const repeatReg = `${this.daerah}${newRunningNumber.runningnumber}/${yearNumber}`;
      //     this.noPendaftaranUlangan = repeatReg;
      //     console.log('no pendaftaran baru: ', repeatReg);
      //   }
      //   if (currentRunningNumber) {
      //     currentRunningNumber.runningnumber += 1;
      //     await currentRunningNumber.save();
      //     const repeatReg = `${this.daerah}${currentRunningNumber.runningnumber}/${yearNumber}`;
      //     this.noPendaftaranUlangan = repeatReg;
      //     console.log('no pendaftaran ulangan: ', repeatReg);
      //   }
      // }
    }
    if (this.kedatangan === 'ulangan-kedatangan') {
      console.log('ini pasien lama');
    }
  } catch (err) {
    console.error(err);
  }
});

// UmumSchema.pre01('save', function (next) {
//   let uniqueId = '';
//   const simplifiedKp = this.createdByKp.split(' ');
//   for (let i = 0; i < simplifiedKp.length; i++) {
//     uniqueId += simplifiedKp[i].charAt(0);
//   }
//   uniqueId += '-';
//   const simplifiedName = this.nama.split(' ');
//   for (let i = 0; i < simplifiedName.length; i++) {
//     uniqueId += simplifiedName[i].charAt(0);
//   }
//   uniqueId += '-';
//   const dateOfBirth = this.tarikhLahir.split('-').join('');
//   uniqueId += dateOfBirth;
//   console.log(uniqueId);
//   this.uniqueId = uniqueId;
//   next();
// });

module.exports = mongoose.model('Umum', UmumSchema);

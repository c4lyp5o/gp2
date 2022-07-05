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
    // pendaftaran --------------------------------
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
    tarikhKedatangan: {
      type: String,
      // required: [true, 'Please provide tarikh kedatangan'],
    },
    waktuSampai: {
      type: String,
      // required: [true, 'Please provide waktu sampai'],
    },
    tarikhLahir: {
      type: String,
      // required: [true, 'Please provide tarikh lahir'],
    },
    jantina: {
      type: String,
      // required: [true, 'Please provide jantina'],
    },
    umur: {
      type: Number,
      // required: [true, 'Please provide umur'],
    },
    kategoriPesakit: {
      type: String,
      // required: [true, 'Please provide kategori pesakit'],
    },
    kumpulanEtnik: {
      type: String,
      // required: [true, 'Please provide kumpulan etnik'],
    },
    rujukDaripada: {
      type: String,
      // required: [true, 'Please provide rujuk dari'],
    },
    // end of pg101
    statusPesara: {
      //Leong added this
      //nak tahu pesara kerajaan atau ATM atau tidak - utk generate reten PG211
    },
    jenisFasilitiPerkhidmatan: {
      //Leong added this
      //check-drop down to know the data
    },
    kedatanganSemasa: {
      //Leong added this
      //baru atau ulangan
    },
    ibuMengandung: {
      //Leong added this
      //ya atau tidak
    },
    episodMengandung: {
      //diisi jika patient mengandung
      //baru atau ulangan;
      //Contoh: patient A dtg Januari 2022 ; patient A mengandung 8 bulan then kira episod baru
      //Patient A then bersalin April 2022 ;
      //patient A dtg klinik june 2022 ; kira dewasa ; kedatangan semasa = ulangan ; episode tiada ; sbb not ibu mengandung
      //then patient A mengandung kali kedua dan dtg Aug 2022 ; kira ibu mengandung ; episode baru ;
      // kalau patient A dtg sep 2022 for appt ; kira ibu mengandung ; episode ulangan;
      //utk reten 207 punya ;
    },
    kedatanganKEPP: {
      //Leong added this
      //baru atau ulangan
    },
    tarikhRujukanKEPP: {
      //Leong added this
      // required: [true, 'Please provide umur'],
    },
    tarikhMulaRawatanKEPP: {
      //Leong added this
    },
    penyampaianPerkhidmatanBergerak: {
      //Leong added this
    },
    kampungAngkat: {
      //Leong added this
    },
    institusiOKU: {
      //Leong added this
    },
    institusiWargaEmas: {
      //Leong added this
    },
    jenisFasilitiTadika: {
      //Leong added this
    },
    namaFasilitiTadika: {
      //Leong added this
    },
    enrolmenTadika: {
      //Leong added this
    },
    baruUlanganKedatanganEnrolmenTadika: {
      //Leong added this
    },
    engganKedatanganEnrolmenTadika: {
      //Leong added this
    },
    tidakHadirKedatanganEnrolmenTadika: {
      //Leong added this
    },
    adaTiadaPemeriksaanEnrolmenTadika: {
      //Leong added this
    },
    enrolmenKolejAtauIPG: {
      //Leong added this
    },
    jenisInstitusiKolejAtauIPG: {
      //Leong added this
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Umum', UmumSchema);

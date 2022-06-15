const mongoose = require('mongoose');

const SekolahSchema = mongoose.Schema({
  // negeri, daerah, kp is associated with each person
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
  // --------------------------------------------------
  namaPendaftaranSekolah: {
    type: String,
    required: [true, 'Please provide nama'],
    trim: true,
  },
  umurPendaftaranSekolah: {
    type: String,
    required: [true, 'Please provide umur'],
  },
  kelasPendaftaranSekolah: {
    type: String,
    required: [true, 'Please provide kelas'],
    trim: true,
  },
  //   ennrolmen: {
  //     type: String,
  //     required: true,
  //     trim: true,
  //   },
  //   perokokSemasaLelakiMelayu: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokSemasaLelakiCina: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokSemasaLelakiIndia: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokSemasaLelakiLain: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokSemasaPerempuanMelayu: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokSemasaPerempuanCina: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokSemasaPerempuanCina: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokSemasaPerempuanLainlain: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   bekasPerokokLelaki: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   bekasPerokokPerempuan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokPasifLelaki: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perokokPasifPerempuan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   bukanPerokokLelaki: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   bukanPerokokPerempuan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   berhentiMerokokLebih3: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tidakBerhentiMerokokLebih3: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   berhentiMerokokKurang3: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tidakBerhentiMerokokKurang3: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   catatanSemakan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   nomborSiri: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kelas: {
  //     type: String,
  //     required: [true, 'Please provide value'],
  //     trim: true,
  //   },
  //   nama: {
  //     type: String,
  //     required: [true, 'Masukkan nama'],
  //     trim: true,
  //   },
  //   enrolmen: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kedatanganBaru: {
  //     type: String,
  //     defaultValue: '1',
  //   },
  //   kedatanganUlangan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kedatanganEnggan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kedatanganTidakHadir: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   jantina: {
  //     type: String,
  //     required: [true, 'Sila Pilih Jantina'],
  //   },
  //   umur: {
  //     type: String,
  //     required: [true, 'Sila Masukkan Umur'],
  //   },
  //   Keturunan: {
  //     type: String,
  //     required: [true, 'Sila Pilih Keturunan'],
  //   },
  //   statusMerokok: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   cleftAda: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   cleftRujuk: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   traumaToothSurfaceLoss: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   traumaTisuLembut: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   traumaTisuKeras: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   traumaKecederaanGigiAnterior: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusDenturAdaB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusDenturAdaS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusDenturPerluB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusDenturPerluS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kebersihanMulutA: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kebersihanMulutC: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kebersihanMulutE: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gisSkor0: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gisSkor1: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gisSkor2: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gisSkor3: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiDesidusD: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiDesidusM: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiDesidusF: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiDesidusX: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigidesidusJumlahdfx: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiDesidusdfx0: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gigiDesidusDfxKurangDari3: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiKekalE: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiKekalD: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiKekalM: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiKekalF: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiKekalX: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusGigiKekalJumlahDMFX: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   dFBilGigiCariesE: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   dFClassIdanII: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   dFClassISahaja: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gigiKekalDMFXsamaAtauKurangDari3: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gigiKekalDMFXsamaAtauKurangDari1: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   totalStatusGigiKekalSamaKosong: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusBebasKaries: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusBebasKariesTapiElebihDariSatu: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   MBK: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   eMoreThanZero: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   mulutBebasGingivitis: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tprSMKP: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tprICDAS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   CRA: {
  //     type: String,
  //     required: [true, 'Sila Masukkan Jumlah Faktor Risiko Karies'],
  //   },
  //   craRendah: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   craSederhana: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   craTinggi: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fsDibuatPadaTahunLepas: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fsDibuatPadaTahunSemasaResin: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fsDibuatPadaTahunSemasaGIC: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFSMuridB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFSMuridS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFSGigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFSGigiS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFsBilGigiFailed: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFvMuridB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFvMuridS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFvGigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluFvGigiS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluPRR1MuridB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluPRR1MuridS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluPRR1BGigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluPRR1BGigiS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluPRRatauFissureSealantAtauKeduaDua: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAntGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAntGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAntGkB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAntGkS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanPosGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanPosGdS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanPosGkB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanPosGkS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAmgGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAmgGdS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAmgGkB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   perluTampalanAmgGkS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFSMuridB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFSMuridS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFSGigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFSGigiS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFVMuridB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFVMuridB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFVGigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFVGigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahPRR1GigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahPRR1MuridB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahPRR1GigiB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahPRR1GigiS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahFsOrPrr: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAntGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAntGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAntGkB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAntGkS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanPosGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanPosGdS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanPosGkB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanPosGkS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAmgGdB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAmgGdS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAmgGkB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   telahTampalanAmgGkS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   jumlahTampalanB: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   jumlahTampalanS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tampalanSementara: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   cabutanGd: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   cabutanGk: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   penskaleran: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   abses: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   pulpotomi: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   rawatanEndo: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kesSelesaiICDAS: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kesSelesai: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   rujuk: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kotakJumlahIntervensiLanjutanYangDisertai: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kotakAdaQuitDate: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kotakTiadaQuitDate: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kotakPerokokDirujukKepadaGuruKaunseling: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   catatan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   namaOperatorCharting: {
  //     type: String,
  //     required: [true, 'Sila Masukkan Nama Operator'],
  //     trim: true,
  //   },
  //   sekolahRendah: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   sekolahMenengah: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   namaSekolah: {
  //     type: String,
  //     required: [true, 'Please provide value'],
  //     trim: true,
  //   },
  //   namaKlinikPergigian: {
  //     type: String,
  //     required: [true, 'Sila Masukkan Nama Klinik Pergigian'],
  //     trim: true,
  //   },
  //   darjah: {
  //     type: String,
  //     required: [true, 'Sila Masukkan Darjah'],
  //     trim: true,
  //   },
  //   tingkatan: {
  //     type: String,
  //     required: [true, 'Sila Masukkan Tingkatan'],
  //     trim: true,
  //   },
  //   pasukanBergerak: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   praSekolah: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kanakIstimewa: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   bpeSkor: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   jenisRokok: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   statusBerhentiMerokok: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   menjalankanBEGIN: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gigiDesidus: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   pemeriksaan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   permasyarakatan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   namaPenuhBapa: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   jumlahAhliKeluargaKurangAtauDari17Tahun: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   jumlahAhliKeluargaLebihAtauSamaDari18Tahun: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   selesaiEmpatKaliSapuanDalamDuaTahun: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   kekalBebasKariesSelepasEmpatKaliSapuan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   umurBulanUntukBayiSatuTahunKeBawah: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   sekolahMasyarakatRujukkePP: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   klinikPusatPergigianSekolahStatik: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   pasukanKlinikPergigianBergerak: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   ceramah: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   pameran: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tarikhKehadiranIntervensiMerokokSesiSatu: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tarikhKehadiranIntervensiMerokokSesiDua: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tarikhKehadiranIntervensiMerokokSesiTiga: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tarikhKehadiranIntervensiMerokokSesiLanjutan: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   tarikhBerhentiMerokok: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   gigiKekal: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   dClassI: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   dClassII: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fClassI: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fClassII: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fsTahunLepasGic: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fsTahunLepasResin: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fsTahunLepasLain: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   fsTahunLepasIntactLain: {
  //     type: String,
  //     defaultValue: '0',
  //   },
  //   risikoSekolah: {
  //     type: String,
  //     defaultValue: '0',
  //   },
});

module.exports = mongoose.model('Sekolah', SekolahSchema);

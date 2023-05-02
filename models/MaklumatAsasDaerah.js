const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const maklumatAsasDaerahSchema = new Schema(
  {
    createdByNegeri: { type: String, required: true },
    createdByDaerah: { type: String, required: true },
    // Maklumat Asas
    jumlahPPSedangBerkhidmat: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahJPSedangBerkhidmat: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahPPTerlibatIDC: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahJPTerlibatIDC: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahPPBaharuTahunSemasa: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahJPBaharuTahunSemasa: {
      type: Number,
      //   required: true,
      default: 0,
    },
    // Maklumat KOTAK
    jumlahPPDilatihIntervensiSekolah: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahJPDilatihIntervensiSekolah: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahLatihanKOTAKTahunSemasa: {
      type: Number,
      // required: true,
      default: 0,
    },
    // Maklumat BEGIN
    jumlahPPDilatihBEGIN: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahJPDilatihBEGIN: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahPPDalamDPTDilatihBEGIN: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahJPDalamDPTDilatihBEGIN: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahLatihanBEGINTahunSemasa: {
      type: Number,
      //   required: true,
      default: 0,
    },
    // Maklumat KPMP
    jumlahKlinikDirancangMenjadiKPMP: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahKlinikKPMPSediaAda: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahKlinikKPMPYangRasmi: {
      type: Number,
      //   required: true,
      default: 0,
    },
    // Maklumat Wellness Hub
    jumlahWellnessHubDirancangBuatAktivitiPromosi: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahWellnessHubYangTelahLaksana4Aktiviti: {
      type: Number,
      //   required: true,
      default: 0,
    },
    jumlahWellnessHubYangTelahLaksanaKurang4Aktiviti: {
      type: Number,
      //   required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const MaklumatAsasDaerah = mongoose.model(
  'MaklumatAsasDaerah',
  maklumatAsasDaerahSchema
);

module.exports = MaklumatAsasDaerah;

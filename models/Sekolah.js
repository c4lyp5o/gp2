const mongoose = require('mongoose');

const SekolahSchema = new mongoose.Schema({
  // save status rawatan when user fill rawatanSekolah -----------------
  statusRawatan: {
    type: String,
    required: true,
    enum: {
      values: [
        'belum mula',
        'enggan',
        'tidak hadir',
        'belum selesai',
        'enggan rawatan',
        'tidak hadir rawatan',
        'selesai',
      ],
      message:
        '{VALUE} is not supported. Provide only "belum mula", "enggan", "tidak hadir", "belum selesai", "enggan rawatan", "tidak hadir rawatan", "selesai"',
    },
    default: 'belum mula',
  },
  // supplied by MOEIS --------------------------------------------------
  idInstitusi: {
    type: String,
    default: 'MSSING ID_INSTITUSI',
  },
  kodSekolah: {
    type: String,
    default: 'MSSING KOD_INSTITUSI',
  },
  namaSekolah: {
    type: String,
    default: 'MISSING NAMA INSTITUSI',
  },
  idIndividu: {
    type: String,
    default: 'MISSING ID_INDIVIDU',
  },
  // previously noKp
  nomborId: {
    type: String,
    default: 'MSSING NOMBOR_ID', // pengenalan diri
  },
  nama: {
    type: String,
    default: 'MISSING NAMA',
  },
  sesiTakwimPelajar: {
    type: String,
    default: 'MISSING SESI_TAKWIM',
  },
  // previously tahun
  tahunTingkatan: {
    type: String,
    default: 'MSSING TAHUN_TINGKATAN',
  },
  // previously namaKelas
  kelasPelajar: {
    type: String,
    default: 'MSSING kelas pelajar', // pending
  },
  //previously kodJantina
  jantina: {
    type: String,
    default: 'MSSING JANTINA',
  },
  tarikhLahir: {
    type: String,
    default: 'MSSING tarikh_lahir',
  },
  umur: {
    type: Number,
    default: 0,
  },
  kaum: {
    type: String,
    default: 'MSSING keturunan',
  },
  tarafWarganegara: {
    type: String,
    default: 'MISSING taraf warganegara', // pending
  },
  // pemeriksaan -------------------------------------------------------
  pemeriksaanSekolah: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pemeriksaansekolah',
  },
  // rawatan -----------------------------------------------------------
  rawatanSekolah: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rawatansekolah',
    },
  ],
  // kotak -------------------------------------------------------------
  kotakSekolah: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kotaksekolah',
  },
});

module.exports = mongoose.model('Sekolah', SekolahSchema);

// several field that got deleted
// daerah
// ppd

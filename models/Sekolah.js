const mongoose = require('mongoose');

const SekolahSchema = new mongoose.Schema({
  // save status rawatan when user fill rawatanSekolah -----------------
  statusRawatan: {
    type: String,
    required: true,
    default: 'belum mula',
  },
  // supplied by ERKM --------------------------------------------------
  nama: {
    type: String,
    required: [true, 'Please provide nama'],
    trim: true,
  },
  jantina: {
    type: String,
    required: [true, 'Please provide jantina'],
  },
  umur: {
    type: Number,
    required: [true, 'Please provide umur'],
  },
  namaSekolah: {
    type: String,
    required: [true, 'Please provide nama sekolah'],
  },
  kelas: {
    type: String,
    required: [true, 'Please provide kelas'],
  },
  ic: {
    type: String,
    required: [true, 'Please provide IC'],
  },
  tarikhLahir: {
    type: String,
    required: [true, 'Please provide tarikh lahir'],
  },
  warganegara: {
    type: String,
    required: [true, 'Please provide warganegara'],
  },
  bangsa: {
    type: String,
    required: [true, 'Please provide bangsa'],
  },
  darjah: {
    type: Number,
  },
  tingkatan: {
    type: Number,
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
  // // pendaftaran -------------------------------------------------------
  // baruUlanganKedatanganPendaftaran: {
  //   type: String,
  //   default: '',
  // },
  // tinggiRendahRisikoSekolahPendaftaran: {
  //   type: String,
  //   default: '',
  // },
});

module.exports = mongoose.model('Sekolah', SekolahSchema);

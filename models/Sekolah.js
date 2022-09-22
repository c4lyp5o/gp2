const mongoose = require('mongoose');

const SekolahSchema = new mongoose.Schema({
  // save status rawatan when user fill rawatanSekolah -----------------
  statusRawatan: {
    type: String,
    required: true,
    default: 'belum mula',
  },
  // supplied by ERKM --------------------------------------------------
  idConcat: {
    type: String,
    // required: [true, 'Please provide ID'],
  },
  daerah: {
    type: String,
    required: [true, 'Please provde daerah'],
  },
  ppd: {
    type: String,
    required: [true, 'Please provide PPD'],
  },
  namaSekolah: {
    type: String,
    required: [true, 'Please provide nama sekolah'],
  },
  kodSekolah: {
    type: String,
    required: [true, 'Please provide kod sekolah'],
  },
  tahun: {
    type: String,
    required: [true, 'Please provide tahun'],
  },
  namaKelas: {
    type: String,
    required: [true, 'Please provide nama kelas'],
  },
  nama: {
    type: String,
    required: [true, 'Please provide nama'],
  },
  kodJantina: {
    type: String,
    required: [true, 'Please provide kod jantina'],
  },
  umur: {
    type: String,
    required: [true, 'Please provide umur'],
  },
  noKp: {
    type: String,
    // required: [true, 'Please provide nombor KP'],
  },
  tarikhLahir: {
    type: String,
    required: [true, 'Please provide tarikh lahir'],
  },
  kaum: {
    type: String,
    required: [true, 'Please provide kaum'],
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

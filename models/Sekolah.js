const mongoose = require('mongoose');

const sekolahSchema = mongoose.Schema({
 // negeri, daerah, kp is associated with each person
 createdByNegeri: {
    type: String,
    required: true
},
createdByDaerah: {
    type: String,
    required: true
},
createdByKp: {
    type: String,
    required: true
},
// --------------------------------------------------
namaPendaftaranSekolah: {
    type: String,
    required: [true, 'Please provide nama'],
    trim: true
},
umurPendaftaranSekolah: {
    type: String,
    required: [true, 'Please provide umur'],
},
kelasPendaftaranSekolah: {
    type: String,
    required: [true, 'Please provide kelas'],
    trim: true
},
namaSekolahPendaftaranSekolah: {
    type: String,
    required: [true, 'Please provide nama sekolah'],
    trim: true
}
});

module.exports = mongoose.model('Sekolah', SekolahSchema);
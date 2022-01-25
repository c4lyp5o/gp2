const mongoose = require('mongoose');

const sekolahSchema = mongoose.Schema({
    namaPendaftaranSekolah: {
        type: String,
        required: true,
        trim: true
    },
    umurPendaftaranSekolah: {
        type: Number,
        required: true
    },
    kelasPendaftaranSekolah: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Sekolah', sekolahSchema);
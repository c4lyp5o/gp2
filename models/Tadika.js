const mongoose = require('mongoose');

const TadikaSchema = mongoose.Schema({
    createdByKp: {
        type: String,
        required: true
    },
    namaPendaftaranTadika: {
        type: String,
        required: [true, 'Please provide nama'],
        trim: true,
        unique: true
    },
    umurPendaftaranTadika: {
        type: String,
        required: [true, 'Please provide umur'],
    },
    kelasPendaftaranTadika: {
        type: String,
        required: [true, 'Please provide kelas'],
        trim: true
    }
});

module.exports = mongoose.model('Tadika', TadikaSchema);
const mongoose = require('mongoose');

const TadikaSchema = mongoose.Schema({
    createdByKp: {
        type: String,
        required: true
    },
    namaPendaftaranTadika: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    umurPendaftaranTadika: {
        type: String,
        required: true
    },
    kelasPendaftaranTadika: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Tadika', TadikaSchema);
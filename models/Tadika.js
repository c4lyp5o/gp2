const mongoose = require('mongoose');

const TadikaSchema = mongoose.Schema({
    namaPendaftaranTadika: {
        type: String,
        required: true,
        trim: true
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
})

module.exports = mongoose.model('Tadika', TadikaSchema);
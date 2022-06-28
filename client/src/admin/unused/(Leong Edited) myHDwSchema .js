const mongoose = require('mongoose');

const ffarSchema = new mongoose.Schema({
kedatanganTahunSemasa: {
    type: Number,
    min: 0,
    default: 0,
},
ibuMengandung: {
    type: Number,
    min: 0,
    default: 0,
},
bersekolah: {
    type: Number,
    min: 0,
    default: 0,
},
orangKurangUpaya: {
    type: Number,
    min: 0,
    default: 0,
},
pesaraKerajaan: {
    type: Number,
    min: 0,
    default: 0,
},
pesaraATM: {
    type: Number,
    min: 0,
    default: 0,
},
rujukanDalaman: {
    type: Number,
    min:0, 
    defaultValue: 0,
},
rujukanKPkerajaan: {
    type: Number,
    min: 0,
    defaultValue: 0,
},
rujukanKKkerajaan: {
    type: Number,
    min: 0,
    defaultValue: 0,
},
rujukanHospKerajaan: {
    type: Number,
    min: 0,
    defaultValue: 0,
},
rujukanSwasta: {
    type: Number,
    min: 0,
    defaultValue: 0,
},
rujukanLainLain: {
    type: Number,
    min: 0, 
    default: 0,
},
});

module.exports = mongoose.model('FFAR', ffarSchema);
const mongoose = require('mongoose');

const PrioritySekolahSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  kodSekolah: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('PrioritySekolah', PrioritySekolahSchema);

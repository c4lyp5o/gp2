const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fasilitiSchema = new Schema({
  nama: {
    type: String,
  },
  statusPerkhidmatan: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  kodSekolah: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  createdByNegeri: {
    type: String,
  },
  createdByDaerah: {
    type: String,
  },
  handler: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  kodFasilitiHandler: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  jenisFasiliti: {
    type: String,
  },
  statusRoleKlinik: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  sekolahSelesaiReten: {
    type: Boolean,
    default: false,
  },
  melaksanakanBegin: {
    type: Boolean,
    default: false,
  },
  risikoSekolahPersis: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  kodTastad: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  alamatTastad: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  enrolmenTastad: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  govKe: {
    type: String,
    default: 'NOT APPLICABLE',
  },
  // institusi
  kategoriInstitusi: {
    type: String,
    default: 'NOT APPLICABLE',
  },
});

const Fasiliti = mongoose.model('Fasiliti', fasilitiSchema);

module.exports = Fasiliti;

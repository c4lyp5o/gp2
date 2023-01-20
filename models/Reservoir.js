const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservoirSchema = new Schema({
  createdByNegeri: { type: String, required: true },
  createdByDaerah: { type: String, required: true },
  createdByKodFasiliti: { type: String, required: true },
  dataType: { type: String, required: true },
  dataFormat: { type: String, required: true },
  dataDate: { type: String, required: true },
  data: { type: Array, required: true },
});

const Reservoir = mongoose.model('Reservoir', reservoirSchema);

module.exports = Reservoir;

const mongoose = require('mongoose');

const PromosiSchema = new mongoose.Schema(
  {
    // negeri, daerah, kp, operator are associated with each promosi
    createdByNegeri: { type: String, default: '' },
    createdByDaerah: { type: String, default: '' },
    createdByKp: { type: String, default: '' },
    createdByUsername: { type: String, required: true },
    createdByMdcMtdb: { type: String, required: true },
    // status reten promosi ----------------------------------------
    statusReten: { type: String, required: true, default: 'belum diisi' },
    // start here for all the field --------------------------------
    // REPLACE THIS LINE
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promosi', PromosiSchema);

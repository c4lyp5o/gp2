const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ondemandSchema = new Schema(
  {
    name: { type: String, required: true },
    adminPage: { type: Boolean, required: true, default: true },
    PG101A: { type: Boolean, required: true, default: true },
    PG101C: { type: Boolean, required: true, default: true },
    PG211A: { type: Boolean, required: true, default: true },
    PG211C: { type: Boolean, required: true, default: true },
    PG206: { type: Boolean, required: true, default: true },
    PG207: { type: Boolean, required: true, default: true },
    PG214: { type: Boolean, required: true, default: true },
    PGPR201: { type: Boolean, required: true, default: true },
    PGPRO01: { type: Boolean, required: true, default: true },
    PGPRO01Combined: { type: Boolean, required: true, default: true },
    PGS201: { type: Boolean, required: true, default: true },
    PGS203P2: { type: Boolean, required: true, default: true },
    TODP1: { type: Boolean, required: true, default: true },
    MASA: { type: Boolean, required: true, default: true },
    BP: { type: Boolean, required: true, default: true },
    BPE: { type: Boolean, required: true, default: true },
    GENDER: { type: Boolean, required: true, default: true },
    KEPP: { type: Boolean, required: true, default: true },
    BEGIN: { type: Boolean, required: true, default: true },
    PPIM03: { type: Boolean, required: true, default: true },
    PPIM04: { type: Boolean, required: true, default: true },
    PPIM05: { type: Boolean, required: true, default: true },
    DEWASAMUDA: { type: Boolean, required: true, default: true },
    OAP: { type: Boolean, required: true, default: true },
    LiputanOAP: { type: Boolean, required: true, default: true },
    KPBMPBHarian: { type: Boolean, required: true, default: true },
    KPBMPBBulanan: { type: Boolean, required: true, default: true },
    // variasi KOM
    'KOM-OAP': { type: Boolean, required: true, default: true },
    'KOM-WE': { type: Boolean, required: true, default: true },
    'KOM-OKU-PDK': { type: Boolean, required: true, default: true },
    'KOM-Komuniti': { type: Boolean, required: true, default: true },
    'KOM-Penjara': { type: Boolean, required: true, default: true },
    KOM: { type: Boolean, required: true, default: true },
    PPR: { type: Boolean, required: true, default: true },
    UTCRTC: { type: Boolean, required: true, default: true },
    PPKPS: { type: Boolean, required: true, default: true },
    PKAP1: { type: Boolean, required: true, default: true },
    PKAP2: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const OnDemand = mongoose.model('Ondemand', ondemandSchema);

module.exports = OnDemand;

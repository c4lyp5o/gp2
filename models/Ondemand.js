const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ondemandSchema = new Schema(
  {
    name: { type: String, required: true },
    adminPage: { type: Boolean, required: true, default: false },
    janaTarikh: { type: Boolean, required: true, default: false },
    janaBulan: { type: Boolean, required: true, default: false },
    PG101A: { type: Boolean, required: true, default: false },
    PG101C: { type: Boolean, required: true, default: false },
    PG211A: { type: Boolean, required: true, default: false },
    PG211C: { type: Boolean, required: true, default: false },
    'PG211C-KPBMPB': { type: Boolean, required: true, default: false },
    PG206: { type: Boolean, required: true, default: false },
    PG207: { type: Boolean, required: true, default: false },
    PG214: { type: Boolean, required: true, default: false },
    PGPR201: { type: Boolean, required: true, default: false },
    PGPRO01: { type: Boolean, required: true, default: false },
    PGPRO01Combined: { type: Boolean, required: true, default: false },
    PGS201: { type: Boolean, required: true, default: false },
    PGS203P2: { type: Boolean, required: true, default: false },
    KPIFS: { type: Boolean, required: true, default: false },
    TODP1: { type: Boolean, required: true, default: false },
    MASA: { type: Boolean, required: true, default: false },
    BP: { type: Boolean, required: true, default: false },
    BPE: { type: Boolean, required: true, default: false },
    GENDER: { type: Boolean, required: true, default: false },
    KEPP: { type: Boolean, required: true, default: false },
    BEGIN: { type: Boolean, required: true, default: false },
    CPPC1: { type: Boolean, required: true, default: false },
    CPPC2: { type: Boolean, required: true, default: false },
    PPIM03: { type: Boolean, required: true, default: false },
    PPIM04: { type: Boolean, required: true, default: false },
    PPIM05: { type: Boolean, required: true, default: false },
    DEWASAMUDA: { type: Boolean, required: true, default: false },
    PPR: { type: Boolean, required: true, default: false },
    PPKPS: { type: Boolean, required: true, default: false },
    PKAP1: { type: Boolean, required: true, default: false },
    PKAP2: { type: Boolean, required: true, default: false },
    // variasi KOM
    'KOM-OAP': { type: Boolean, required: true, default: false },
    'KOM-WE': { type: Boolean, required: true, default: false },
    'KOM-OKU-PDK': { type: Boolean, required: true, default: false },
    'KOM-Komuniti': { type: Boolean, required: true, default: false },
    'KOM-Penjara': { type: Boolean, required: true, default: false },
    'KOM-FDS': { type: Boolean, required: true, default: false },
    'KOM-ISN': { type: Boolean, required: true, default: false },
    'KOM-HRC': { type: Boolean, required: true, default: false },
    KOM: { type: Boolean, required: true, default: false },
    OAP: { type: Boolean, required: true, default: false },
    LiputanOA: { type: Boolean, required: true, default: false },
    LiputanPenan: { type: Boolean, required: true, default: false },
    RTC: { type: Boolean, required: true, default: false },
    UTC: { type: Boolean, required: true, default: false },
    KPBMPBHarian: { type: Boolean, required: true, default: false },
    KPBMPBBulanan: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const OnDemand = mongoose.model('Ondemand', ondemandSchema);

module.exports = OnDemand;

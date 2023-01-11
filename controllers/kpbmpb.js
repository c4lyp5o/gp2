const Fasiliti = require('../models/Fasiliti');

// GET /
const getAllKPBMPBForNegeri = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, kodFasiliti } = req.user;

  const allKPBMPBNegeri = await Fasiliti.find({
    createdByNegeri: negeri,
    jenisFasiliti: { $in: ['kp-bergerak', 'makmal-pergigian'] },
  });

  // set new properties dalam object penggunaanKPBMPB
  allKPBMPBNegeri.forEach((singleKPBMPB) => {
    singleKPBMPB.penggunaanKPBMPB.forEach((penggunaan) => {
      penggunaan.nama = singleKPBMPB.nama;
      penggunaan.jenisFasiliti = singleKPBMPB.jenisFasiliti;
    });
  });

  let penggunaanKPBMPB = [];

  // push penggunaanKPBMPB sahaja dalam new array
  allKPBMPBNegeri.forEach((km) => {
    if (km.penggunaanKPBMPB.length > 0) {
      penggunaanKPBMPB.push(...km.penggunaanKPBMPB);
    }
  });

  // filter penggunaanKPBMPB untuk KP tu sahaja
  const penggunaanKPBMPBForKp = penggunaanKPBMPB.filter((pkm) => {
    return pkm.kodKlinikBertanggungjawab === kodFasiliti;
  });

  res.status(200).json({ penggunaanKPBMPBForKp });
};

module.exports = { getAllKPBMPBForNegeri };

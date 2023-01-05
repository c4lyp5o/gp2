const Fasiliti = require('../models/Fasiliti');

// GET /
const getAllKPBMPBForNegeri = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri } = req.user;

  const allKPBMPBNegeri = await Fasiliti.find({
    createdByNegeri: negeri,
    jenisFasiliti: { $in: ['kp-bergerak', 'makmal-pergigian'] },
  });

  res.status(200).json({ allKPBMPBNegeri });
};

module.exports = { getAllKPBMPBForNegeri };

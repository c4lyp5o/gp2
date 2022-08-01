const Operator = require('../models/Operator');
const Fasiliti = require('../models/Fasiliti');

const getOperatorList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const operators = await Operator.find({ kpSkrg: req.user.kp });
  res.status(200).json({ operators });
};

const getFasilitiList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const fasilitis = await Fasiliti.find({
    createdByDaerah: req.user.daerah,
    jenisFasiliti: 'klinik',
  });
  res.status(200).json({ fasilitis });
};

module.exports = { getOperatorList, getFasilitiList };

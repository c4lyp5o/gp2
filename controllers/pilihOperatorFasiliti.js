const Operator = require('../models/Operator');
// const Fasiliti = require('../models/Fasiliti');
const User = require('../models/User');

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

  const fasilitisAll = await User.find({
    negeri: req.user.negeri,
    statusRoleKlinik: ['klinik', 'kepp', 'utc', 'rtc', 'visiting'],
  });

  const fasilitis = fasilitisAll.splice(0, 1);

  res.status(200).json({ fasilitis });
};

module.exports = { getOperatorList, getFasilitiList };

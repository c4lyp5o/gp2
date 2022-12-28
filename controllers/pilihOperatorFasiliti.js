const Operator = require('../models/Operator');
const User = require('../models/User');

const getOperatorList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const operators = await Operator.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    kpSkrg: req.user.kp,
    kodFasiliti: req.user.kodFasiliti,
    activationStatus: true,
  });
  res.status(200).json({ operators });
};

const getFasilitiList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const fasilitisAll = await User.find({
    negeri: req.user.negeri,
    statusRoleKlinik: ['klinik', 'kepp', 'utc', 'rtc', 'visiting'],
    statusPerkhidmatan: 'active',
  });

  const deleteFasiliti = fasilitisAll.map((f) => f.kp).indexOf(req.user.kp);
  const fasilitis = fasilitisAll.filter((f, i) => i !== deleteFasiliti);

  res.status(200).json({ fasilitis });
};

module.exports = { getOperatorList, getFasilitiList };

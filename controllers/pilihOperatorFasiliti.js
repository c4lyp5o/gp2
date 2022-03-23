const Operator = require('../models/Operator');
const Fasiliti = require('../models/Fasiliti');

const getOperatorList = async (req, res) => {
    const operators = await Operator.find({ kpSkrg: req.user.kp });
    res.status(200).json({ operators });
}

const getFasilitiList = async (req, res) => {
    const fasilitis = await Fasiliti.find({ daerah: req.user.daerah, jenisFasiliti: 'klinik' });
    res.status(200).json({ fasilitis });
}

module.exports = { getOperatorList, getFasilitiList };
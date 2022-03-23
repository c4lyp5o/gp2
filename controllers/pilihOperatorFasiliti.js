const Operator = require('../models/Operator');
const Fasiliti = require('../models/Fasiliti');

const getOperatorList = async (req, res) => {
    const operators = await Operator.find({ kpSkrg: req.user.kp });
    console.log(operators);
    res.status(200).json({ operators });
}

const getFasilitiList = async (req, res) => {
    const fasiliti = await Fasiliti.find({ daerah: req.user.daerah });
    console.log(fasiliti);
    res.status(200).send('Fasiliti');
}

module.exports = { getOperatorList, getFasilitiList };
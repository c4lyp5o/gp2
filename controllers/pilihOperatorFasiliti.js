const Operator = require('../models/Operator');
const Fasiliti = require('../models/Fasiliti');

const getOperatorList = async (req, res) => {
    res.status(200).send('Operator');
}

const getFasilitiList = async (req, res) => {
    res.status(200).send('Fasiliti');
}

module.exports = { getOperatorList, getFasilitiList };
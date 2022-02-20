const Tadika = require('../models/Tadika');

const adminGetAllPersonTadikas = async (req, res) => {
    res.status(200).json({ msg: 'admin get all person tadika' });
};

module.exports = { adminGetAllPersonTadikas };
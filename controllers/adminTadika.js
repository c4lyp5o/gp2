const Tadika = require('../models/Tadika');

const adminGetAllPersonTadikas = async (req, res) => {
    if (req.user.accountType === 'negaraUser') {
        const tadikas = await Tadika.find({}).sort('createdByNegeri');
        return res.status(200).json({ tadikas });
    }
    if (req.user.accountType === 'negeriUser') {
        const tadikas = await Tadika.find({ createdByNegeri: req.user.negeri }).sort('createdByDaerah');
        return res.status(200).json({ tadikas });
    }
    if (req.user.accountType === 'daerahUser') {
        const tadikas = await Tadika.find({ createdByDaerah: req.user.daerah }).sort('createdByKp');
        return res.status(200).json({ tadikas });
    }
    else {
        return res.status(401).json({ msg: 'You are kpUser'});
    }
};

module.exports = { adminGetAllPersonTadikas };
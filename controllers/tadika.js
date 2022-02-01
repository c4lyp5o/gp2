const Tadika = require('../models/Tadika');

const createPersonTadika = async (req, res) => {
    try {
        req.body.createdByKp = req.user.kp;
        const tadika = await Tadika.create(req.body);
        res.status(201).json(tadika);
    } catch (error) {
        res.status(400).json({ msg: 'Person already exist'});
    }
}

module.exports = { createPersonTadika };
const Tadika = require('../models/Tadika');

const getAllPersonTadikas = async (req, res) => {
    const tadikas = await Tadika.find( { createdByKp: req.user.kp });

    if (tadikas.length === 0) {
        return res.status(404).json({ msg: `No person created by ${req.user.kp}` })
    }

    res.status(200).json(tadikas);
}

const createPersonTadika = async (req, res) => {
    try {
        req.body.createdByKp = req.user.kp;
        const tadika = await Tadika.create(req.body);
        res.status(201).json(tadika);
    } catch (error) {
        res.status(400).json({ msg: 'Person already exist'});
    }
}

module.exports = { getAllPersonTadikas, createPersonTadika };
const Tadika = require('../models/Tadika');

const createPersonTadika = async (req, res) => {
    try {
        const tadika = await Tadika.create( req.body );
        res.status(201).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { createPersonTadika };
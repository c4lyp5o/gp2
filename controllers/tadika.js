const Tadika = require('../models/Tadika');

const createPersonTadika = async (req, res) => {
    const tadika = await Tadika.create( req.body );
    res.status(201).send();
}

module.exports = { createPersonTadika };
const Sekolah = require('../models/Sekolah');

const createPersonSekolah = async (req, res) => {
    try {
        const tadika = await Sekolah.create( req.body );
        res.status(201).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { createPersonSekolah };
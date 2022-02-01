const Sekolah = require('../models/Sekolah');

const createPersonSekolah = async (req, res) => {
    const sekolah = await Sekolah.create(req.body);
    res.status(201).send();
}

module.exports = { createPersonSekolah };
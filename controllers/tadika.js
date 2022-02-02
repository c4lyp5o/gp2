const Tadika = require('../models/Tadika');

const getAllPersonTadikas = async (req, res) => {
    const tadikas = await Tadika.find( { createdByKp: req.user.kp });

    if (tadikas.length === 0) {
        return res.status(404).json({ msg: `No person created by ${req.user.kp}` })
    }

    res.status(200).json(tadikas);
}

const getSinglePersonTadika = async (req, res) => {
    const { user: { kp }, params: { id: personTadikaId } } = req;

    const tadika = await Tadika.findOne({ _id: personTadikaId, createdByKp: kp });

    if (!tadika) {
        return res.status(404).jason({ msg: `No person with id ${personTadikaId}` });
    }

    res.status(200).json(tadika);
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

const updatePersonTadika = async (req, res) => {
    const { user: { kp }, params: { id: personTadikaId } } = req;

    const tadika = await Tadika.findOneAndUpdate({ _id: personTadikaId, createdByKp: kp }, req.body, { new: true, runValidators: true });
    
    if (!tadika) {
        return res.status(404).json({ msg: `No person with id ${personTadikaId}` });
    }

    res.status(200).json(tadika);
}

const deletePersonTadika = async (req, res) => {
    const { user: { kp }, params: { id: personTadikaId } } = req;

    const tadika = await Tadika.findOneAndRemove({ _id: personTadikaId, createdByKp: kp });

    if (!tadika) {
        return res.status(404).json({ msg: `No person with id ${personTadikaId}` });
    }

    res.status(200).send();
}

module.exports = { getAllPersonTadikas, getSinglePersonTadika, createPersonTadika, updatePersonTadika, deletePersonTadika };
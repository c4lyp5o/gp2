const Sekolah = require('../models/Sekolah');

const getAllPersonSekolahs = async (req, res) => {
    const sekolahs = await Sekolah.find({ createdByKp: req.user.kp }).sort('kelasPendaftaranSekolah');
    res.status(200).json({ sekolahs });
};

const getSinglePersonSekolah = async (req, res) => {
    const { user: { kp }, params: { id: personSekolahId } } = req;

    const sekolah = await Sekolah.findOne({ _id: personSekolahId, createdByKp: kp });

    if (!sekolah) {
        return res.status(404).json({ msg: `No person with id ${personSekolahId}` });
    }

    res.status(200).json({ sekolah });
};

const createPersonSekolah = async (req, res) => {
    // associate negeri, daerah & kp to each person sekolah
    req.body.createdByNegeri = req.user.negeri;
    req.body.createdByDaerah = req.user.daerah;
    req.body.createdByKp = req.user.kp;

    // copy paste these to updatePersonSekolah, to uppercase all created text input
    req.body.namaPendaftaranSekolah = req.body.namaPendaftaranSekolah.toUpperCase();
    req.body.kelasPendaftaranSekolah = req.body.kelasPendaftaranSekolah.toUpperCase();
    req.body.namaSekolahPendaftaranSekolah = req.body.namaSekolahPendaftaranSekolah.toUpperCase();
    // ---------------------------------------------------------------------------

    const sekolah = await Sekolah.create(req.body);
    res.status(201).json({ sekolah });
};

const updatePersonSekolah = async (req, res) => {
    const { user: { kp }, params: { id: personSekolahId } } = req;

    // copy paste from createPersonSekolah, to uppercase all updated text input
    req.body.namaPendaftaranSekolah = req.body.namaPendaftaranSekolah.toUpperCase();
    req.body.kelasPendaftaranSekolah = req.body.kelasPendaftaranSekolah.toUpperCase();
    req.body.namaSekolahPendaftaranSekolah = req.body.namaSekolahPendaftaranSekolah.toUpperCase();
    //------------------------------------------------------------------------

    const sekolah = await Sekolah.findOneAndUpdate({ _id: personSekolahId, createdByKp: kp }, req.body, { new: true, runValidators: true });
    
    if (!sekolah) {
        return res.status(404).json({ msg: `No person with id ${personSekolahId}` });
    }

    res.status(200).json({ sekolah });
};

const deletePersonSekolah = async (req, res) => {
    const { user: { kp }, params: { id: personSekolahId } } = req;

    const sekolah = await Sekolah.findOneAndRemove({ _id: personSekolahId, createdByKp: kp });

    if (!sekolah) {
        return res.status(404).json({ msg: `No person with id ${personSekolahId}` });
    }

    res.status(200).send();
};

// query route
const queryPersonSekolah = async (req, res) => {
    // in future query input we must make uppercase all input at the front end
    // req.query.namaPendaftaranSekolah is UPPERCASE

    const { user: { kp }, query: { namaPendaftaranSekolah, kelasPendaftaranSekolah } } = req;
    const queryObject = {};
    queryObject.createdByKp = kp;

    if (namaPendaftaranSekolah) {
        queryObject.namaPendaftaranSekolah = namaPendaftaranSekolah;
    }

    if (kelasPendaftaranSekolah) { // this query is not used at front end atm, just to justify why queryObject is used
        queryObject.kelasPendaftaranSekolah = kelasPendaftaranSekolah;
    }

    // const sekolah = await Sekolah.find({ namaPendaftaranSekolah, kelasPendaftaranSekolah, createdByKp: kp }); // try this with Postman to justify why queryObject is used
    const sekolah = await Sekolah.find(queryObject);

    res.status(200).json({ sekolah });
};

module.exports = { getAllPersonSekolahs, getSinglePersonSekolah, createPersonSekolah, updatePersonSekolah, deletePersonSekolah, queryPersonSekolah };
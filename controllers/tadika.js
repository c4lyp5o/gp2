const Tadika = require('../models/Tadika');

const getAllPersonTadikas = async (req, res) => {
    const tadikas = await Tadika.find({ createdByKp: req.user.kp }).sort('kelasPendaftaranTadika');
    res.status(200).json({ tadikas });
};

const getSinglePersonTadika = async (req, res) => {
    const { user: { kp }, params: { id: personTadikaId } } = req;

    const tadika = await Tadika.findOne({ _id: personTadikaId, createdByKp: kp });

    if (!tadika) {
        return res.status(404).json({ msg: `No person with id ${personTadikaId}` });
    }

    res.status(200).json({ tadika });
};

const createPersonTadika = async (req, res) => {
    // associate negeri, daerah & kp to each person tadika
    req.body.createdByNegeri = req.user.negeri;
    req.body.createdByDaerah = req.user.daerah;
    req.body.createdByKp = req.user.kp;

    // copy paste these to updatePersonTadika, to uppercase all created text input
    // req.body.namaPendaftaranTadika = req.body.namaPendaftaranTadika.toUpperCase();
    // req.body.kelasPendaftaranTadika = req.body.kelasPendaftaranTadika.toUpperCase();
    // req.body.namaTaskaTadikaPendaftaranTadika = req.body.namaTaskaTadikaPendaftaranTadika.toUpperCase();
    // ---------------------------------------------------------------------------

    // convert from frontend req.body to match Tadika Model
    const createPersonTadika = {};
    createPersonTadika.createdByNegeri = req.user.negeri;
    createPersonTadika.createdByDaerah = req.user.daerah;
    createPersonTadika.createdByKp = req.user.kp;
    createPersonTadika.kelas = req.body.kelas;
    createPersonTadika.nama = req.body.nama;
    createPersonTadika.kedatanganBaru = req.body.kedatanganBaru;

    // createPersonTadika.kedatanganUlangan = req.body.?;
    // createPersonTadika.kedatanganEnggan = req.body.?;
    // createPersonTadika.kedatanganTidakHadir = req.body.?;
    // createPersonTadika.cleftAda = req.body.?;
    // createPersonTadika.cleftRujuk = req.body.?;
    // createPersonTadika.traumaToothSurfaceLoss = req.body.?;

    createPersonTadika.umur = req.body.umur;
    createPersonTadika.klinikPergigian = req.body.klinikPergigian;
    createPersonTadika.namaTadika = req.body.namaTadika;
    createPersonTadika.jenisTadika = req.body.jenisTadika;
    createPersonTadika.operator = req.body.operator;
    createPersonTadika.pasukanPergigian = req.body.pasukanPergigian;

    //---------------------------------------------------------------------------

    const tadika = await Tadika.create(createPersonTadika);
    res.status(201).json({ tadika });
};

const updatePersonTadika = async (req, res) => {
    const { user: { kp }, params: { id: personTadikaId } } = req;

    // copy paste from createPersonTadika, to uppercase all updated text input
    req.body.namaPendaftaranTadika = req.body.namaPendaftaranTadika.toUpperCase();
    req.body.kelasPendaftaranTadika = req.body.kelasPendaftaranTadika.toUpperCase();
    req.body.namaTaskaTadikaPendaftaranTadika = req.body.namaTaskaTadikaPendaftaranTadika.toUpperCase();
    //------------------------------------------------------------------------

    const tadika = await Tadika.findOneAndUpdate({ _id: personTadikaId, createdByKp: kp }, req.body, { new: true, runValidators: true });
    
    if (!tadika) {
        return res.status(404).json({ msg: `No person with id ${personTadikaId}` });
    }

    res.status(200).json({ tadika });
};

const deletePersonTadika = async (req, res) => {
    const { user: { kp }, params: { id: personTadikaId } } = req;

    const tadika = await Tadika.findOneAndRemove({ _id: personTadikaId, createdByKp: kp });

    if (!tadika) {
        return res.status(404).json({ msg: `No person with id ${personTadikaId}` });
    }

    res.status(200).send();
};

// query route
const queryPersonTadika = async (req, res) => {
    // in future query input we must make uppercase all input at the front end
    // req.query.namaPendaftaranTadika is UPPERCASE

    const { user: { kp }, query: { namaPendaftaranTadika, kelasPendaftaranTadika } } = req;
    const queryObject = {};
    queryObject.createdByKp = kp;

    if (namaPendaftaranTadika) {
        queryObject.namaPendaftaranTadika = namaPendaftaranTadika;
    }

    if (kelasPendaftaranTadika) { // this query is not used at front end atm, just to justify why queryObject is used
        queryObject.kelasPendaftaranTadika = kelasPendaftaranTadika;
    }

    // const tadika = await Tadika.find({ namaPendaftaranTadika, kelasPendaftaranTadika, createdByKp: kp }); // try this with Postman to justify why queryObject is used
    const tadika = await Tadika.find(queryObject);

    res.status(200).json({ tadika });
};

module.exports = { getAllPersonTadikas, getSinglePersonTadika, createPersonTadika, updatePersonTadika, deletePersonTadika, queryPersonTadika };
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
    // copy paste these to updatePersonTadika, to uppercase all created text input
    // req.body.namaPendaftaranTadika = req.body.namaPendaftaranTadika.toUpperCase();
    // req.body.kelasPendaftaranTadika = req.body.kelasPendaftaranTadika.toUpperCase();
    // req.body.namaTaskaTadikaPendaftaranTadika = req.body.namaTaskaTadikaPendaftaranTadika.toUpperCase();
    // ---------------------------------------------------------------------------

    // convert from frontend req.body to match Tadika Model
    const createPersonTadika = {};
    createPersonTadika.operator = req.body.namaOperator;
    createPersonTadika.createdByNegeri = req.user.negeri;
    createPersonTadika.createdByDaerah = req.user.daerah;
    
    if (req.body.namaFasiliti === null) {
        createPersonTadika.createdByKp = req.user.kp;
    } else {
        createPersonTadika.createdByKp = req.body.namaFasiliti;
    }

    if (req.body.namaFasiliti === null) {
        createPersonTadika.klinikPergigian = req.user.kp;
    } else {
        createPersonTadika.klinikPergigian = req.body.namaFasiliti;
    }

    createPersonTadika.kelas = req.body.kelasPendaftaranTadika;
    createPersonTadika.nama = req.body.namaPendaftaranTadika;
    createPersonTadika.kedatanganBaru = '1';

    // createPersonTadika.kedatanganUlangan = req.body.?;
    // createPersonTadika.kedatanganEnggan = req.body.?;
    // createPersonTadika.kedatanganTidakHadir = req.body.?;
    // createPersonTadika.cleftAda = req.body.?;
    // createPersonTadika.cleftRujuk = req.body.?;
    // createPersonTadika.traumaToothSurfaceLoss = req.body.?;

    createPersonTadika.umur = req.body.umurPendaftaranTadika;
    createPersonTadika.namaTadika = req.body.namaTaskaTadikaPendaftaranTadika;
    createPersonTadika.jenisTadika = 'ayam';
    createPersonTadika.pasukanPergigian = 'pasukan ayam';



























































































    createPersonTadika.perluFSGigiB = req.body.baruJumlahGigiPerluFsPerluDibuatTadika;
    createPersonTadika.perluFSGigiS = req.body.semulaJumlahGigiPerluFsPerluDibuatTadika;
    createPersonTadika.perluFsBilGigiFailed = req.body.failedJumlahGigiPerluFsPerluDibuatTadika;
    createPersonTadika.perluFvGigiB = req.body.yaPerluFvPerluDibuatTadika;
    createPersonTadika.tidakPerluFvPerluDibuatTadika = req.body.tidakPerluFvPerluDibuatTadika; // X
    createPersonTadika.perluPRR1MuridB = req.body.baruJumlahGigiPerluPrrPerluDibuatTadika;
    createPersonTadika.perluPRR1MuridS = req.body.semulaJumlahGigiPerluPrrPerluDibuatTadika;
    createPersonTadika.perluTampalanAntGdB = req.body.gdBaruAnteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanAntGdS = req.body.gdSemulaAnteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanAntGkB = req.body.gkBaruAnteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanAntGkS = req.body.gkSemulaAnteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanPosGdB = req.body.gdBaruPosteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanPosGdS = req.body.gdSemulaPosteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanPosGkB = req.body.gkBaruPosteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanPosGkS = req.body.gkSemulaPosteriorSewarnaPerluDibuatTadika;
    createPersonTadika.perluTampalanAmgGdB = req.body.gdBaruPosteriorAmalgamPerluDibuatTadika;
    createPersonTadika.perluTampalanAmgGdS = req.body.gdSemulaPosteriorAmalgamPerluDibuatTadika;
    createPersonTadika.perluTampalanAmgGkB = req.body.gkBaruPosteriorAmalgamPerluDibuatTadika;
    createPersonTadika.perluTampalanAmgGkS = req.body.gkSemulaPosteriorAmalgamPerluDibuatTadika;
    //PENYATA AKHIR 1
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
const Umum = require('../models/Umum');
const Operator = require('../models/Operator');
const Fasiliti = require('../models/Fasiliti');

// GET /
const getAllPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kp, kodFasiliti } = req.user;

  const allPersonUmum = await Umum.find({
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKp: kp,
    createdByKodFasiliti: kodFasiliti,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });

  res.status(200).json({ allPersonUmum });
};

// GET /status-harian
const getAllPersonUmumStatus = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { negeri, daerah, kp, kodFasiliti } = req.user;

  const allPersonUmum = await Umum.find({
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    createdByKp: kp,
    createdByKodFasiliti: kodFasiliti,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });

  // just sending statusReten & tarikhKedatangan to save network bandwith because UserStatusHarian will pull umum on calendar for one whole year
  const allPersonUmumStatus = allPersonUmum.map(
    ({ statusReten, tarikhKedatangan }) => {
      return { statusReten, tarikhKedatangan };
    }
  );

  res.status(200).json({ allPersonUmumStatus });
};

// GET /:id
const getSinglePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  const singlePersonUmum = await Umum.findOne({
    _id: personUmumId,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });

  if (!singlePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ singlePersonUmum });
};

// PATCH /:id
const updatePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  // associate negeri, daerah & kp to each person umum for every update
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;
  req.body.createdByKodFasiliti = req.user.kodFasiliti;

  // save summary of patient history to each operator
  let summary = {};
  let shortened = {};
  Object.keys(req.body).forEach((key) => {
    if (
      key !== '' ||
      key !== '' ||
      key !== null ||
      key !== undefined ||
      key !== 0 ||
      key !== false
    ) {
      shortened[key] = req.body[key];
    }
  });
  const singlePersonUmum = await Umum.findOne({
    _id: personUmumId,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });
  summary = { ...singlePersonUmum._doc, ...shortened };

  // handling kedatangan baru for rawatan operator lain
  if (req.query.operatorLain === 'rawatan-operator-lain') {
    // flipping to 'ulangan-kedatangan' if kedatangan = 'baru-kedatangan'
    if (summary.kedatangan === 'baru-kedatangan') {
      (summary.kedatangan = 'ulangan-kedatangan'),
        (summary.noPendaftaranUlangan = summary.noPendaftaranBaru),
        (summary.noPendaftaranBaru = '');
    }
  }

  let regNum = {};
  if (req.body.createdByMdcMdtb.includes('MDTB') === false) {
    console.log('is pp');
    regNum = { mdcNumber: req.body.createdByMdcMdtb };
  }
  if (req.body.createdByMdcMdtb.includes('MDTB') === true) {
    console.log('is jp');
    regNum = { mdtbNumber: req.body.createdByMdcMdtb };
  }
  const updatedOfficerSummary = await Operator.findOneAndUpdate(
    regNum,
    { $push: { summary } },
    { new: true }
  );

  // handling rawatan operator lain
  if (req.query.operatorLain === 'rawatan-operator-lain') {
    if (req.body.statusReten === 'telah diisi') {
      const updatedStatusReten = await Umum.findOneAndUpdate(
        {
          _id: personUmumId,
          tahunDaftar: new Date().getFullYear(),
          deleted: false,
        },
        { $set: { statusReten: req.body.statusReten } },
        { new: true }
      );
    }

    const updatedSinglePersonUmumRawatanOperatorLain =
      await Umum.findOneAndUpdate(
        {
          _id: personUmumId,
          tahunDaftar: new Date().getFullYear(),
          deleted: false,
        },
        { $push: { rawatanOperatorLain: summary } },
        { new: true }
      );

    return res.status(200).json({ updatedSinglePersonUmumRawatanOperatorLain });
  }

  // default initial reten
  const updatedSinglePersonUmum = await Umum.findOneAndUpdate(
    {
      _id: personUmumId,
      tahunDaftar: new Date().getFullYear(),
      deleted: false,
    },
    req.body,
    { new: true }
  );

  if (!updatedSinglePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ updatedSinglePersonUmum });
};

// PATCH /salah/:id
const retenSalahPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  const { retenSalahReason } = req.body;

  const singlePersonUmum = await Umum.findOne({
    _id: personUmumId,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });

  if (!singlePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  // tanda sebagai reten salah
  if (singlePersonUmum.statusReten === 'telah diisi') {
    const singlePersonUmumRetenSalahStatus = await Umum.findOneAndUpdate(
      {
        _id: personUmumId,
        tahunDaftar: new Date().getFullYear(),
        deleted: false,
      },
      {
        statusReten: 'reten salah',
        retenSalahForOfficer: `${req.body.createdByMdcMdtb} has marked patient as reten salah for ${singlePersonUmum.createdByMdcMdtb}`,
      },
      { new: true }
    );
    const singlePersonUmumRetenSalahReason = await Umum.findOneAndUpdate(
      {
        _id: personUmumId,
        tahunDaftar: new Date().getFullYear(),
        deleted: false,
      },
      { $push: { retenSalahReason: retenSalahReason } },
      { new: true }
    );
  }

  // revert salah
  if (singlePersonUmum.statusReten === 'reten salah') {
    const singlePersonUmumRetenSalahStatus = await Umum.findOneAndUpdate(
      {
        _id: personUmumId,
        tahunDaftar: new Date().getFullYear(),
        deleted: false,
      },
      {
        statusReten: 'telah diisi',
        retenSalahForOfficer: `${req.body.createdByMdcMdtb} has REVERT marked this patient from reten salah for ${singlePersonUmum.createdByMdcMdtb}`,
      },
      { new: true }
    );
    const singlePersonUmumRetenSalahReason = await Umum.findOneAndUpdate(
      {
        _id: personUmumId,
        tahunDaftar: new Date().getFullYear(),
        deleted: false,
      },
      { $push: { retenSalahReason: retenSalahReason } },
      { new: true }
    );
  }

  res.status(200).json({ msg: 'reten salah route success' });
};

// PATCH /delete/:id
const softDeletePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  const { deleteReason } = req.body;

  const singlePersonUmum = await Umum.findOne({
    _id: personUmumId,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });

  if (!singlePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  const singlePersonUmumToDelete = await Umum.findOneAndUpdate(
    {
      _id: personUmumId,
      tahunDaftar: new Date().getFullYear(),
      deleted: false,
    },
    {
      deleted: true,
      deleteReason,
      deletedForOfficer: `${req.body.createdByMdcMdtb} has deleted this patient for ${singlePersonUmum.createdByMdcMdtb}`,
    },
    { new: true }
  );

  res.status(200).json({ singlePersonUmumToDelete });
};

// not used
// DELETE /:id
const deletePersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    params: { id: personUmumId },
  } = req;

  const deletedSinglePersonUmum = await Umum.findOneAndDelete({
    _id: personUmumId,
  });

  if (!deletedSinglePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ deletedSinglePersonUmum });
};

// query /umum
const queryPersonUmum = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { negeri, daerah, kp, kodFasiliti },
    query: { nama, tarikhKedatangan, jenisFasiliti, jenisProgram },
  } = req;
  const queryObject = {};
  queryObject.createdByNegeri = negeri;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByKp = kp;
  queryObject.createdByKodFasiliti = kodFasiliti;
  queryObject.tahunDaftar = new Date().getFullYear();
  queryObject.deleted = false;

  if (nama) {
    queryObject.nama = { $regex: nama, $options: 'i' };
  }

  if (tarikhKedatangan) {
    queryObject.tarikhKedatangan = tarikhKedatangan;
  }

  if (jenisFasiliti) {
    queryObject.jenisFasiliti = jenisFasiliti;
  }

  if (jenisProgram) {
    queryObject.jenisProgram = jenisProgram;
  }

  const umumResultQuery = await Umum.find(queryObject);

  res.status(200).json({ umumResultQuery });
};

// query /umum/kk-kd
const getKkKdList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const kkKdAll = await Fasiliti.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    handler: req.user.kp,
    kodFasilitiHandler: req.user.kodFasiliti,
    jenisFasiliti: 'kkiakd',
    statusPerkhidmatan: 'active',
  });

  res.status(200).json({ kkKdAll });
};

// query /umum/taska-tadika
const getTaskaTadikaList = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const taskaTadikaAll = await Fasiliti.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    handler: req.user.kp,
    kodFasilitiHandler: req.user.kodFasiliti,
    jenisFasiliti: ['taska', 'tadika'],
    statusPerkhidmatan: 'active',
  });

  res.status(200).json({ taskaTadikaAll });
};

// query /umum/events
const getProjekKomuniti = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const projekKomuniti = await Event.find({
    createdByNegeri: req.user.negeri,
    createdByDaerah: req.user.daerah,
    createdByKp: req.user.kp,
    createdByKodFasiliti: req.user.kodFasiliti,
    tarikhStart: { $nin: [null, ''] },
    tarikhEnd: { $nin: [null, ''] },
    tahunDibuat: new Date().getFullYear(),
  });

  res.status(200).json({ projekKomuniti });
};

module.exports = {
  getAllPersonUmum,
  getAllPersonUmumStatus,
  getSinglePersonUmum,
  updatePersonUmum,
  retenSalahPersonUmum,
  softDeletePersonUmum,
  deletePersonUmum,
  queryPersonUmum,
  getKkKdList,
  getTaskaTadikaList,
  getProjekKomuniti,
};

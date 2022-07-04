const Umum = require('../models/Umum');

const getSinglePersonUmum = async (req, res) => {
  const {
    params: { id: personUmumId },
  } = req;

  const singlePersonUmum = await Umum.findOne({ _id: personUmumId });

  if (!singlePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ singlePersonUmum });
};

const updatePersonUmum = async (req, res) => {
  const {
    params: { id: personUmumId },
  } = req;

  // associate negeri, daerah & kp to each person sekolah for every update
  req.body.createdByNegeri = req.user.negeri;
  req.body.createdByDaerah = req.user.daerah;
  req.body.createdByKp = req.user.kp;

  const updatedSinglePersonUmum = await Umum.findOneAndUpdate(
    { _id: personUmumId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedSinglePersonUmum) {
    return res.status(404).json({ msg: `No person with id ${personUmumId}` });
  }

  res.status(200).json({ updatedSinglePersonUmum });
};

module.exports = { getSinglePersonUmum, updatePersonUmum };

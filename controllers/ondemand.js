const Ondemand = require('../models/Ondemand');
const { logger } = require('../logs/logger');

// GET / - untuk dapatkan ondemand setting
const getCurrentOndemandSetting = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [OndemandController] getCurrentOndemandSetting called`
  );

  const currentOndemandSetting = await Ondemand.findOne({
    name: 'current',
  });

  if (!currentOndemandSetting) {
    const currentOndemandSetting = await Ondemand.create({
      name: 'current',
      adminPage: true,
      PG101A: true,
      PG101C: true,
      PG211A: true,
      PG211C: true,
      PG206: true,
      PG207: true,
      PG214: true,
      PGPR201: true,
      PGPRO01: true,
      PGPRO01Combined: true,
      PG201P2: true,
      PGS203P2: true,
      TODP1: true,
      MASA: true,
      BP: true,
      BPE: true,
      GENDER: true,
    });
    return res.status(200).json({ currentOndemandSetting });
  }

  res.status(200).json({ currentOndemandSetting });
};

// PATCH / - untuk update ondemand setting
const updateCurrentOndemandSetting = async (req, res) => {
  logger.info(
    `${req.method} ${req.url} [OndemandController] updateCurrentOndemandSetting called`
  );

  const { ondemandSetting } = req.body;

  const currentOndemandSetting = await Ondemand.findOneAndUpdate(
    { name: 'current' },
    { $set: ondemandSetting },
    { new: true }
  );

  if (!currentOndemandSetting) {
    return res.status(404).json({ msg: 'No current ondemand setting found' });
  }

  res.status(200).json({ currentOndemandSetting });
};

module.exports = {
  getCurrentOndemandSetting,
  updateCurrentOndemandSetting,
};

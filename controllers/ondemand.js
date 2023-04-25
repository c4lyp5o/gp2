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
    return res.status(404).json({ msg: 'No current ondemand setting found' });
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

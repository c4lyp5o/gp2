const { logger } = require('../logs/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  return res.status(500).json({ msg: 'Internal server error' });
};

module.exports = errorHandler;

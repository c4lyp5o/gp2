const Operator = require('../models/Operator');
const logger = require('../logs/logger');

// GET /:operatorId
const getSinglePersonOperator = async (req, res) => {
  logger.info(
    `[operatorController] ${req.method} ${req.url} getSinglePersonOperatorcalled`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const singlePersonOperator = await Operator.findOne({
    _id: req.params.personOperatorId,
  });

  if (!singlePersonOperator) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personOperatorId}` });
  }

  res.status(201).json({ singlePersonOperator });
};

// PATCH /:personOperatorId
const updateSinglePersonOperator = async (req, res) => {
  logger.info(
    `[operatorController] ${req.method} ${req.url} updateSinglePersonOperator called`
  );
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const updatedSinglePersonOperator = await Operator.findByIdAndUpdate(
    { _id: req.params.personOperatorId },
    req.body,
    { new: true }
  );

  if (!updatedSinglePersonOperator) {
    return res
      .status(404)
      .json({ msg: `No person with id ${req.params.personOperatorId}` });
  }

  res.status(200).json({ updatedSinglePersonOperator });
};

// query /operator
const queryPersonOperator = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const {
    user: { kp, kodFasiliti, daerah, negeri },
  } = req;

  const queryObject = {};
  queryObject.createdByKp = kp;
  queryObject.createdByDaerah = daerah;
  queryObject.createdByNegeri = negeri;
  queryObject.createdByKodFasiliti = kodFasiliti;

  const operatorResultQuery = await Operator.find(queryObject);

  res.status(200).json({ operatorResultQuery });
};

module.exports = {
  getSinglePersonOperator,
  updateSinglePersonOperator,
  queryPersonOperator,
};

const { Types } = require('mongoose');
const Operator = require('../models/Operator');
const { logger } = require('../logs/logger');

// not used
// GET
const getSinglePersonOperator = async (req, res) => {
  logger.info(`[summaryController] getSinglePersonOperator called`);

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { id } = req.query;

  const singlePersonOperator = await Operator.findById(id)
    .select('nama')
    .lean();

  if (!singlePersonOperator) {
    return res.status(404).json({ msg: `No person with id ${id}` });
  }

  res.status(201).json(singlePersonOperator);
};

// GET /
const getSinglePersonOperatorSummary = async (req, res) => {
  logger.info(`[summaryController] getSinglePersonOperatorSummarycalled`);

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { id, bulan, tahun } = req.query;

  const singlePersonOperator = await Operator.findById(id)
    .select('nama')
    .lean();

  if (!singlePersonOperator) {
    return res.status(404).json({ msg: `No person with id ${id}` });
  }

  logger.info(
    `[summaryController] getting summary for ${singlePersonOperator.nama}`
  );

  const tarikhMula = `${tahun}-${bulan}-01`;
  const tarikhTamat = `${tahun}-${bulan}-31`;

  {
    process.env.BUILD_ENV === 'production'
      ? null
      : console.table({ id, bulan, tahun, tarikhMula, tarikhTamat });
  }

  const filteredSummary = await Operator.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $project: {
        _id: 0,
        filteredSummary: {
          $filter: {
            input: '$summary',
            as: 'record',
            cond: {
              $and: [
                { $gte: ['$$record.tarikhKedatangan', tarikhMula] },
                { $lte: ['$$record.tarikhKedatangan', tarikhTamat] },
              ],
            },
          },
        },
      },
    },
  ]);

  res.status(201).json(filteredSummary);
};

module.exports = { getSinglePersonOperator, getSinglePersonOperatorSummary };

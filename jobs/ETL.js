const cron = require('cron');
const ETL = require('../controllers/ETLmanifest');
const logger = require('../logs/logger');

module.exports = function () {
  const runETL = new cron.CronJob(
    '0 1 7 * *',
    function () {
      logger.info('From ETL cronjob, im running now. Wish me luck.');
      ETL.initiateETL().then(() => {
        logger.info('From ETL cronjob. im done.');
      });
    },
    null,
    true,
    'Asia/Kuala_Lumpur'
  );
  runETL.start();
};

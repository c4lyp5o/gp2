const cron = require('cron');
const ETL = require('../controllers/ETLmanifest');
const { ETLLogger } = require('../logs/logger');

module.exports = function () {
  const runETL = new cron.CronJob(
    '0 1 7 * *',
    function () {
      logger.info('[ETL] From ETL cronjob, im running now. Wish me luck.');
      ETL.initiateETL().then(() => {
        logger.info('[ETL] From ETL cronjob. im done.');
      });
    },
    null,
    true,
    'Asia/Kuala_Lumpur'
  );
  runETL.start();
};

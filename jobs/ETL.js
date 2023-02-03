const cron = require('cron');
const ETL = require('../controllers/ETLmanifest');

module.exports = function () {
  const ETL = new cron.CronJob(
    '0 1 * * *',
    function () {
      console.log('From ETL cronjob, im running now. Wish me luck.');
      ETL.initiateETL().then(() => {
        console.log('From ETL cronjob. im done.');
      });
    },
    null,
    true,
    'Asia/Kuala_Lumpur'
  );
  ETL.start();
};

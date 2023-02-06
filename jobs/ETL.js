const cron = require('cron');
const ETL = require('../controllers/ETLmanifest');

module.exports = function () {
  const runETL = new cron.CronJob(
    '0 1 7 * *',
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
  runETL.start();
};

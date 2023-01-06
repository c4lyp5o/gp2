const moment = require('moment');

const getdate = async (req, res) => {
  // get a date for today
  const rawToday = new Date();
  const dd = String(rawToday.getDate()).padStart(2, '0');
  const mm = String(rawToday.getMonth() + 1).padStart(2, '0');
  const yyyy = rawToday.getFullYear();
  const dateToday = yyyy + '-' + mm + '-' + dd;

  // get past three days from today
  const rawYesterday = rawToday.setDate(rawToday.getDate() - 1);
  const dateYesterday = moment(rawYesterday).format('YYYY-MM-DD');
  const rawPastTwoDays = rawToday.setDate(rawToday.getDate() - 1);
  const datePastTwoDays = moment(rawPastTwoDays).format('YYYY-MM-DD');

  res.status(200).json({ dateToday, dateYesterday, datePastTwoDays });
};

module.exports = getdate;

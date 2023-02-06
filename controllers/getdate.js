const moment = require('moment');

// GET /
const getdate = async (req, res) => {
  // get a date for today
  // const rawToday = new Date();
  // const dd = String(rawToday.getDate()).padStart(2, '0');
  // const mm = String(rawToday.getMonth() + 1).padStart(2, '0');
  // const yyyy = rawToday.getFullYear();
  // const dateToday = yyyy + '-' + mm + '-' + dd;

  // get past three days from today
  // const rawYesterday = rawToday.setDate(rawToday.getDate() - 1);
  // const dateYesterday = moment(rawYesterday).format('YYYY-MM-DD');
  // const rawPastTwoDays = rawToday.setDate(rawToday.getDate() - 1);
  // const datePastTwoDays = moment(rawPastTwoDays).format('YYYY-MM-DD');

  // formatting date using ISO_8601: https://en.wikipedia.org/wiki/ISO_8601
  // https://momentjs.com/docs/#/displaying/format/
  const dateToday = moment().format();
  const dateYesterday = moment().subtract(1, 'days').format();
  const datePastTwoDays = moment().subtract(2, 'days').format();

  // read the table when reformatting back at FE: https://momentjs.com/docs/#/displaying/format/
  const beThisDate = moment(dateToday).format('YYYY-MM-DD');
  const beThisTime = moment(dateToday).format('HH:mm');

  // be AWARE FE MUST use momentjs for compatibility, NOT new Date()
  // read these when converting from ISO_8601 to JavaScript native Date() object at FE:
  // https://momentjs.com/docs/#/parsing/special-formats/
  // https://momentjs.com/docs/#/displaying/as-javascript-date/
  // JavaScript native Date() object are used by react-datepicker & react-datetime
  const beThisDateObject = moment(dateToday, moment.ISO_8601).toDate();
  const hourForThisDateObject = beThisDateObject.getHours();
  const hourUTCForThisDateObject = beThisDateObject.getUTCHours();

  res.status(200).json({
    dateToday,
    dateYesterday,
    datePastTwoDays,
    beThisDate,
    beThisTime,
    beThisDateObject,
    hourForThisDateObject,
    hourUTCForThisDateObject,
  });
};

module.exports = getdate;

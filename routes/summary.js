const express = require('express');
const router = express.Router();

const {
  //   getSinglePersonOperator, // asalnya nk select('-summary') , tp userinfo dah mencukupi
  getSinglePersonOperatorSummary,
} = require('../controllers/summary');

// router.get('/info', getSinglePersonOperator); // asalnya nk select('-summary'), tp userinfo dah mencukupi
router.get('/', getSinglePersonOperatorSummary);

module.exports = router;

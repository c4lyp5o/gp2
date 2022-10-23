const express = require('express');
const router = express.Router();
const { saveTempKey, verifyTempKey } = require('../controllers/getotp');

router.route('/').get(saveTempKey);
router.route('/verify').get(verifyTempKey);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getCurrentOndemandSetting,
  updateCurrentOndemandSetting,
} = require('../controllers/ondemand');

router.route('/').get(getCurrentOndemandSetting);
router.route('/').patch(updateCurrentOndemandSetting);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getOperatorList,
  getFasilitiList,
} = require('../controllers/pilihOperatorFasiliti');

router.route('/operator').get(getOperatorList);
router.route('/fasiliti').get(getFasilitiList);

module.exports = router;

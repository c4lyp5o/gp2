const express = require('express');
const router = express.Router();

const {
  getSrAndSaveErkm,
  getSmAndSaveErkm,
  getAllAndSaveErkmPerlis,
} = require('../controllers/erkm');

router.route('/sr').get(getSrAndSaveErkm);
router.route('/sm').get(getSmAndSaveErkm);

router.route('/perlis').get(getAllAndSaveErkmPerlis);

module.exports = router;

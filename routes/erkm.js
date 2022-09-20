const express = require('express');
const router = express.Router();

const { getSrAndSaveErkm, getSmAndSaveErkm } = require('../controllers/erkm');

router.route('/sr').get(getSrAndSaveErkm);
router.route('/sm').get(getSmAndSaveErkm);

module.exports = router;

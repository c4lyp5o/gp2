const express = require('express');
const router = express.Router();

const { getAndSaveErkm } = require('../controllers/erkm');

router.route('/').get(getAndSaveErkm);

module.exports = router;

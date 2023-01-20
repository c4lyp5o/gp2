const express = require('express');
const router = express.Router();

const { initiateETL } = require('../controllers/ETLmanifest');

router.get('/initiate', initiateETL);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  initiateETL,
  initiateCustomETL,
} = require('../controllers/ETLmanifest');

router.get('/initiate', initiateETL);
router.get('/initiatecustom', initiateCustomETL);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  initiateETL,
  initiateCustomETL,
  initiateCustomSingleETL,
} = require('../controllers/ETLmanifest');

router.get('/initiate', initiateETL);
router.get('/initiatecustom', initiateCustomETL);
router.get('/initiatecustomsingle', initiateCustomSingleETL);

module.exports = router;

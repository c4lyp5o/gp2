// Base
const express = require('express');
const router = express.Router();

// Controller
const generatecon = require('../controllers/generateRetenController');
const countcon = require('../controllers/countHelper');
const generateTest = require('../controllers/testCount');

// Routes
// router.post('/testroute', generateTest.getDetails);
router.get('/testdownload', generateTest.downloader);
router.get('/testcount', generateTest.testFunction201A);
router.get('/paa', generateTest.popAndAgg);
router.get('/paa2', generateTest.popAndAgg2);
// router.get('/paa3', generateTest.tryPG101);
// router.get('/paa4', generateTest.new201);
// router.get('/paa5', generateTest.tryPG101);

module.exports = router;

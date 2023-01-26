// Base
const express = require('express');
const router = express.Router();
const { adminAuthInt } = require('../middlewares/adminAuth');

// Controller
const generator = require('../controllers/generateRetenController');

// Routes
// router.get('/download', generator.downloader);
router.get('/download', adminAuthInt, generator.startQueue);
router.get('/refresh', generator.refreshTokens);

// debug
// router.get('/debug', generator.debug);

module.exports = router;

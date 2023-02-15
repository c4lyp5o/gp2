// Base
const express = require('express');
const router = express.Router();
const { adminAuth, refreshAuth } = require('../middlewares/adminAuth');

// Controller
const generator = require('../controllers/generateRetenController');

// Routes
// router.get('/download', generator.downloader);
router.get('/download', adminAuth, generator.startQueue);
router.get('/refresh', refreshAuth, generator.refreshTokens);

// debug
router.get('/debug', generator.debug);

module.exports = router;

// Base
const express = require('express');
const router = express.Router();

// Controller
const generator = require('../controllers/generateRetenController');

// Routes
router.get('/download', generator.downloader);

// debug
// router.get('/debug', generator.debug);

module.exports = router;

// Base
const express = require('express');
const router = express.Router();

// Controller
const generator = require('../controllers/generateRetenController');

// Routes
router.get('/download', generator.downloader);
router.post('/find', generator.findFunction);
router.post('/agg', generator.aggFunction);

// debug
router.post('/debug', generator.debug);

module.exports = router;

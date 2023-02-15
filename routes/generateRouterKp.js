// Base
const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/adminAuth');

// Controller
const generator = require('../controllers/generateRetenController');

// Routes
router.get('/download', adminAuth, generator.startQueueKp);

module.exports = router;

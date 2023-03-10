// Base
const express = require('express');
const router = express.Router();
const {
  adminAuth,
  refreshAuth,
  debugAuth,
} = require('../middlewares/adminAuth');

// Controller
const generator = require('../controllers/generateRetenController');

// Routes
router.get('/download', adminAuth, generator.startQueue);
router.get('/refresh', refreshAuth, generator.refreshTokens);
router.get('/kill', refreshAuth, generator.killTokens);

// debug
router.get('/debug', debugAuth, generator.debug);

module.exports = router;

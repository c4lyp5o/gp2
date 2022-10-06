// Base
const express = require('express');
const router = express.Router();

// Controller
const adminAPI = require('../controllers/adminAPI');

// Routes
router.get('/getcipher', adminAPI.getCipher);

router.get('/newroute', adminAPI.getData);
router.post('/newroute', adminAPI.getData);

module.exports = router;

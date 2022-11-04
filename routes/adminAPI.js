// Base
const express = require('express');
const router = express.Router();

// Controller
const { getCipher, getData } = require('../controllers/adminAPI');

// Routes
router.get('/getcipher', getCipher);
router.get('/newroute', getData);
router.post('/newroute', getData);

module.exports = router;

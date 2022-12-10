// Base
const express = require('express');
const router = express.Router();

// Middlewares
const apiKeyVerifier = require('../middlewares/apiKeyVerifier');
const adminAuth = require('../middlewares/adminAuth');

// Controller
const {
  getCipher,
  getData,
  getDataRoute,
  getDataKpRoute,
} = require('../controllers/adminAPI');

// Routes
router.get('/getcipher', getCipher);
router.get('/getdata', adminAuth, getDataRoute);
router.get('/getkpdata', adminAuth, getDataKpRoute);
router.post('/newroute', apiKeyVerifier, getData);

module.exports = router;

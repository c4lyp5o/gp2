// Base
const express = require('express');
const router = express.Router();

// Controller
const {
  getCipher,
  getData,
  getDataRoute,
  getDataKpRoute,
} = require('../controllers/adminAPI');

// Routes
router.get('/getcipher', getCipher);
router.get('/getdata', getDataRoute);
router.get('/getkpdata', getDataKpRoute);
router.post('/newroute', getData);

module.exports = router;

// Base
const express = require('express');
const router = express.Router();

// Middlewares
const { adminAuth, adminAuthInt } = require('../middlewares/adminAuth');

// Controller
const {
  getCipher,
  initialData,
  checkUser,
  loginUser,
  getData,
  getDataRoute,
  getDataKpRoute,
  getOneDataRoute,
  getOneDataKpRoute,
} = require('../controllers/adminAPI');

// Routes
router.get('/getcipher', getCipher);
router.get('/initialdata', initialData);
router.get('/check', checkUser);
router.post('/login', loginUser);
router.get('/getdata', adminAuth, getDataRoute);
router.get('/getkpdata', adminAuth, getDataKpRoute);
router.get('/getonedata', adminAuth, getOneDataRoute);
router.get('/getonekpdata', adminAuth, getOneDataKpRoute);
router.post('/newroute', adminAuthInt, getData);

module.exports = router;

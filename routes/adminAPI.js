// Base
const express = require('express');
const router = express.Router();

// Middlewares
const { adminAuth, adminAuthInt } = require('../middlewares/adminAuth');

// Controller
const {
  // initialData,
  initialDataNegeri,
  initialDataDaerah,
  initialDataKlinik,
  initialDataAdmins,
  checkUser,
  loginUser,
  getData,
  getDataRoute,
  getDataKpRoute,
  getOneDataRoute,
  getOneDataKpRoute,
  getStatisticsData,
  processFasilitiQuery,
  processOperatorQuery,
  processKkiakdQuery,
  processSekolahQuery,
} = require('../controllers/adminAPI');

// Initial Data
// router.get('/initialdata', initialData);
router.get('/getnegeri', initialDataNegeri);
router.get('/getdaerah', initialDataDaerah);
router.get('/getklinik', initialDataKlinik);
router.get('/getadmins', initialDataAdmins);

// Login
router.get('/check', checkUser);
router.post('/login', loginUser);

// Data
router.get('/getdata', adminAuth, getDataRoute);
router.get('/getkpdata', adminAuth, getDataKpRoute);
router.get('/getonedata', adminAuth, getOneDataRoute);
router.get('/getonekpdata', adminAuth, getOneDataKpRoute);

// Statistics
router.get('/getstats', adminAuth, getStatisticsData);

// Fasiliti KP, Operator, KKIA/KD
router.get('/getfasiliti', adminAuth, processFasilitiQuery);
router.get('/getoperator', adminAuth, processOperatorQuery);
router.get('/getkkiakd', adminAuth, processKkiakdQuery);
router.get('/getsekolahMOEIS', adminAuth, processSekolahQuery);

// Legacy
router.post('/newroute', adminAuthInt, getData);

module.exports = router;

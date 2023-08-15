// Base
const express = require('express');
const router = express.Router();

// Middlewares
const {
  adminAuth,
  adminAuthPost,
  adminAuthInt,
} = require('../middlewares/adminAuth');

// Controller
const {
  initialDataNegeri,
  initialDataDaerah,
  initialDataKlinik,
  initialDataAdmins,
  checkUser,
  loginUser,
  getAhqData,
  downloadAhqData,
  getData,
  getDataRoute,
  getDataKpRoute,
  getOneDataRoute,
  getOneDataKpRoute,
  postRoute,
  postRouteKp,
  patchRoute,
  patchRouteKp,
  deleteRoute,
  deleteRouteKp,
  getStatisticsData,
  processFasilitiQuery,
  processOperatorQuery,
  processKkiakdQuery,
  processSekolahQuery,
} = require('../controllers/adminAPI');

// Initial Data
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

// Post Data - nanti pakai
// router.post('/post', adminAuth, postRoute);
// router.post('/postkp', adminAuth, postRouteKp);

// Patch Data - nanti pakai
// router.patch('/patch', adminAuth, patchRoute);
// router.patch('/patchkp', adminAuth, patchRouteKp);

// Delete Data - nanti pakai
// router.delete('/delete', adminAuth, deleteRoute);
// router.delete('/deletekp', adminAuth, deleteRouteKp);

// Statistics
router.get('/getstats', adminAuth, getStatisticsData);

// Fasiliti KP, Operator, KKIA/KD
router.get('/getfasiliti', adminAuth, processFasilitiQuery);
router.get('/getoperator', adminAuth, processOperatorQuery);
router.get('/getkkiakd', adminAuth, processKkiakdQuery);
router.get('/getsekolahMOEIS', adminAuth, processSekolahQuery);

// Ad Hoc
router.post('/ahq', adminAuthPost, getAhqData);
router.post('/ahq-dl', adminAuthPost, downloadAhqData);

// Legacy
router.post('/newroute', adminAuthInt, getData);

module.exports = router;

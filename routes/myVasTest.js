const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/authCheck');
const myVasAuthCheck = require('../middlewares/myVasAuthCheck');

const {
  getMyVasToken,
  getPatientDetails,
  getAppointmentList,
  logOutMyVas,
} = require('../controllers/myVasTest');

// ROUTES ------------------------------------------------------
router.get('/callback', authCheck, getMyVasToken); // ni tutup dgn authCheck sendiri
router.get('/patient-details', myVasAuthCheck, getPatientDetails);
router.get('/appointment-list', myVasAuthCheck, getAppointmentList);
router.get('/logout', authCheck, logOutMyVas); // ni tutup dgn authCheck sendiri

module.exports = router;

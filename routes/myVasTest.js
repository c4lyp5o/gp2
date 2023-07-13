const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/authCheck');

const {
  getMyVasToken,
  getPatientDetails,
  getAppointmentList,
  logOutMyVas,
} = require('../controllers/myVasTest');

// ROUTES ------------------------------------------------------
router.get('/callback', getMyVasToken); // ni tak perlu authCheck
router.get('/patient-details', authCheck, getPatientDetails);
router.get('/appointment-list', authCheck, getAppointmentList);
router.get('/logout', authCheck, logOutMyVas);

module.exports = router;

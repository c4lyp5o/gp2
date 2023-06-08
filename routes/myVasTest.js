const express = require('express');
const router = express.Router();

const {
  getMyVasToken,
  getPatientDetails,
  getAppointmentList,
  logOutMyVas,
} = require('../controllers/myVasTest');

// ROUTES ------------------------------------------------------
router.get('/callback', getMyVasToken);
router.get('/patient-details', getPatientDetails);
router.get('/appointment-list', getAppointmentList);
router.get('/logout', logOutMyVas);

module.exports = router;

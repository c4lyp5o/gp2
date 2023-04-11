const express = require('express');
const router = express.Router();
const {
  getAllSekolahKohortFMR,
  // getAllD1Student,
  getAllD1StudentInRegisteredSekolah,
  // registerSekolahFMR,
  daftarKumuranFMR,
  getAllPersonKohortFMR,
  getPersonKohortFMR,
  updatePersonKohortFMR,
  deletePersonKohortFMR,
  queryPersonKohortFMR,
} = require('../controllers/kohortFMR');

router.route('/').get(getAllSekolahKohortFMR);
router.route('/query').get(getAllD1StudentInRegisteredSekolah);
router.route('/daftar-kumuran').post(daftarKumuranFMR);
// router.route('/daftar/:singleSekolahId').get(registerSekolahFMR);
// router.route('/telah-daftar/').get(getAllPersonKohortFMR);
// router
//   .route('/:personKohortFMRId')
//   .get(getPersonKohortFMR)
//   .patch(updatePersonKohortFMR);

module.exports = router;

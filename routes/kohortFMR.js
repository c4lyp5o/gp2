const express = require('express');
const router = express.Router();
const {
  getAllSekolahFMR,
  getAllD1StudentInSekolahFMR,
  getAllD1StudentInSingleSekolahFMR,
  getMuridDalamKohortFMR,
  daftarMuridMasukKohortFMR,
  daftarKumuranFMR,
  deletePersonKohortFMR,
} = require('../controllers/kohortFMR');

router.route('/').get(getAllSekolahFMR);
router.route('/semua-murid').get(getAllD1StudentInSekolahFMR);
router
  .route('/pilih-murid/:singleSekolahFMRId')
  .get(getAllD1StudentInSingleSekolahFMR);
router.route('/daftar-kumuran').patch(daftarKumuranFMR);
router.route('/murid-kohort').get(getMuridDalamKohortFMR);
router.route('/daftar-murid').post(daftarMuridMasukKohortFMR);
// router.route('/daftar/:singleSekolahId').get(registerSekolahFMR);
// router.route('/telah-daftar/').get(getAllPersonKohortFMR);
// router
//   .route('/:personKohortFMRId')
//   .get(getPersonKohortFMR)
//   .patch(updatePersonKohortFMR);

module.exports = router;

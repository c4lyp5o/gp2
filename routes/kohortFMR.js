const express = require('express');
const router = express.Router();
const {
  getAllSekolahFMR,
  getAllD1StudentInSekolahFMR,
  getAllD1StudentInSingleSekolahFMR,
  getMuridDalamKohortFMR,
  daftarMuridMasukKohortFMR,
  daftarKumuranFMR,
  daftarKumuranKohortFMR,
  deletePersonKohortFMR,
} = require('../controllers/kohortFMR');

router.route('/').get(getAllSekolahFMR);
router.route('/semua-murid').get(getAllD1StudentInSekolahFMR);
router
  .route('/pilih-murid/:singleSekolahFMRId')
  .get(getAllD1StudentInSingleSekolahFMR);
router.route('/daftar-kumuran').patch(daftarKumuranFMR);
router.route('/daftar-kumuran-kohort').patch(daftarKumuranKohortFMR);
router.route('/murid-kohort').get(getMuridDalamKohortFMR);
router.route('/daftar-murid').post(daftarMuridMasukKohortFMR);
router
  .route('/hapus-murid-kohort/:singlePersonKohortFMRId')
  .delete(deletePersonKohortFMR);

module.exports = router;

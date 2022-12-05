const express = require('express');
const router = express.Router();
const {
  getAllPersonSekolahsVanilla,
  getSinglePersonSekolahVanilla,
  getAllPersonSekolahsWithPopulate,
  getSinglePersonSekolahWithPopulate,
  createPersonSekolah,
  createPemeriksaanWithSetPersonSekolah,
  createRawatanWithPushPersonSekolah,
  createKotakWithSetPersonSekolah,
  updateFasiliti,
  updatePemeriksaanSekolah,
  updateKotakSekolah,
  queryPersonSekolah,
} = require('../controllers/sekolah');

// GET
router
  .route('/')
  .get(getAllPersonSekolahsVanilla) /*.post(createPersonSekolah)*/;
// router.route('/:personSekolahId').get(getSinglePersonSekolahVanilla);
router.route('/populate').get(getAllPersonSekolahsWithPopulate);
router
  .route('/populate/:personSekolahId')
  .get(getSinglePersonSekolahWithPopulate);

// POST
router
  .route('/pemeriksaan/:personSekolahId')
  .post(createPemeriksaanWithSetPersonSekolah);
router
  .route('/rawatan/:personSekolahId')
  .post(createRawatanWithPushPersonSekolah);
router.route('/kotak/:personSekolahId').post(createKotakWithSetPersonSekolah);

// PATCH
router.route('/fasiliti/:fasilitiId').patch(updateFasiliti);
router
  .route('/pemeriksaan/ubah/:pemeriksaanSekolahId')
  .patch(updatePemeriksaanSekolah);
router.route('/kotak/ubah/:kotakSekolahId').patch(updateKotakSekolah);

module.exports = router;

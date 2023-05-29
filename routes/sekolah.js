const express = require('express');
const router = express.Router();
const {
  getAllPersonSekolahsVanilla,
  getSinglePersonSekolahVanilla,
  getAllPersonSekolahsWithPopulate,
  getAllPersonSekolahFaceted,
  getSinglePersonSekolahWithPopulate,
  kemaskiniSenaraiPelajar,
  muatturunSenaraiPelajar,
  createPersonSekolah,
  createPemeriksaanWithSetPersonSekolah,
  createRawatanWithPushPersonSekolah,
  createKotakWithSetPersonSekolah,
  updateFasiliti,
  updatePersonSekolah,
  updatePemeriksaanSekolah,
  updateRawatanSekolah,
  updateKotakSekolah,
  queryPersonSekolah,
} = require('../controllers/sekolah');

// GET
router.route('/').get(getAllPersonSekolahsVanilla);
router.route('/:personSekolahId').get(getSinglePersonSekolahVanilla);
router
  .route('/populate/:personSekolahId')
  .get(getSinglePersonSekolahWithPopulate);
router
  .route('/populate-satu-sekolah/:kodSekolah')
  .get(getAllPersonSekolahsWithPopulate);

// experimental
// GET
// router.route('/faceted/:kodSekolah').get(getAllPersonSekolahFaceted);

// router.route('/kemaskini/:fasilitiId').get(kemaskiniSenaraiPelajar);
router.route('/muatturun/:kodSekolah').get(muatturunSenaraiPelajar);

// POST
router.route('/').post(createPersonSekolah);
router
  .route('/pemeriksaan/:personSekolahId')
  .post(createPemeriksaanWithSetPersonSekolah);
router
  .route('/rawatan/:personSekolahId')
  .post(createRawatanWithPushPersonSekolah);
// router.route('/kotak/:personSekolahId').post(createKotakWithSetPersonSekolah);

// PATCH
router.route('/fasiliti/:fasilitiId').patch(updateFasiliti);
router.route('/ubah/:personSekolahId').patch(updatePersonSekolah);
router
  .route('/pemeriksaan/ubah/:pemeriksaanSekolahId')
  .patch(updatePemeriksaanSekolah);
router.route('/rawatan/ubah/:rawatanSekolahId').patch(updateRawatanSekolah);
// router.route('/kotak/ubah/:kotakSekolahId').patch(updateKotakSekolah);

module.exports = router;

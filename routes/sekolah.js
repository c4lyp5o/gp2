const express = require('express');
const router = express.Router();
const {
  getAllPersonSekolahsVanilla,
  getSinglePersonSekolahVanilla,
  getAllPersonSekolahsWithPopulate,
  getSinglePersonSekolahWithPopulate,
  kemaskiniSenaraiPelajar,
  muatturunSenaraiPelajar,
  createPersonSekolah,
  createPemeriksaanWithSetPersonSekolah,
  createRawatanWithPushPersonSekolah,
  updateFasiliti,
  updatePersonSekolah,
  softDeletePersonSekolah,
  softDeletePersonSekolahAfterFilled,
  updatePemeriksaanSekolah,
  updateRawatanSekolah,
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

// PATCH
router.route('/fasiliti/:fasilitiId').patch(updateFasiliti);
router.route('/ubah/:personSekolahId').patch(updatePersonSekolah);
router.route('/delete/:personSekolahId').patch(softDeletePersonSekolah);
router
  .route('/delete-filled/:personSekolahId')
  .patch(softDeletePersonSekolahAfterFilled);
// PATCH reten salah
router
  .route('/pemeriksaan/ubah/:pemeriksaanSekolahId')
  .patch(updatePemeriksaanSekolah);
router.route('/rawatan/ubah/:rawatanSekolahId').patch(updateRawatanSekolah);

module.exports = router;

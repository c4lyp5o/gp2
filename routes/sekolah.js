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
router
  .route('/')
  .get(getAllPersonSekolahsVanilla) /*.post(createPersonSekolah)*/;
router
  .route('/populate-satu-sekolah/:kodSekolah')
  .get(getAllPersonSekolahsWithPopulate);
router
  .route('/populate/:personSekolahId')
  .get(getSinglePersonSekolahWithPopulate);

// expertimental
// GET
// router.route('/faceted/:kodSekolah').get(getAllPersonSekolahFaceted);

// GET kemaskini
router.route('/kemaskini/:fasilitiId').get(kemaskiniSenaraiPelajar);

// GET muatturun
router.route('/muatturun/:fasilitiId').get(muatturunSenaraiPelajar);

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
router.route('/ubah/:personSekolahId').patch(updatePersonSekolah);
router
  .route('/pemeriksaan/ubah/:pemeriksaanSekolahId')
  .patch(updatePemeriksaanSekolah);
router.route('rawatan/ubah/:rawatanSekolahId').patch(updateRawatanSekolah);
router.route('/kotak/ubah/:kotakSekolahId').patch(updateKotakSekolah);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllProgramPromosi,
  getAllAktivitiPromosi,
  getSingleAktivitiPromosi,
  createAktivitiPromosi,
  updateAktvitiPromosi,
  softDeleteAktivitiPromosi,
  deleteAktvitiPromosi,
} = require('../controllers/promosi');

router.route('/').get(getAllProgramPromosi);
router
  .route('/aktiviti/:aktivitiId')
  .get(getSingleAktivitiPromosi)
  .patch(updateAktvitiPromosi);
router.route('/aktiviti/delete/:aktivitiId').patch(softDeleteAktivitiPromosi);
router.route('/aktiviti').post(createAktivitiPromosi);

module.exports = router;

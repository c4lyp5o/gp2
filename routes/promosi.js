const express = require('express');
const router = express.Router();
const {
  getAllProgramPromosi,
  getAllAktivitiPromosi,
  getSingleAktivitiPromosi,
  createAktivitiPromosi,
  updateAktvitiPromosi,
  deleteAktvitiPromosi,
} = require('../controllers/promosi');

router.route('/').get(getAllProgramPromosi);
router
  .route('/aktiviti/:aktivitiId')
  .get(getSingleAktivitiPromosi)
  .patch(updateAktvitiPromosi)
  .delete(deleteAktvitiPromosi);
router.route('/aktiviti').post(createAktivitiPromosi);

module.exports = router;

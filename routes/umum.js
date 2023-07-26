const express = require('express');
const router = express.Router();
const {
  getAllPersonUmum,
  getAllPersonUmumStatus,
  getSinglePersonUmum,
  updatePersonUmum,
  retenSalahPersonUmum,
  softDeletePersonUmum,
  deletePersonUmum,
  toMyVas,
} = require('../controllers/umum');

router.route('/').get(getAllPersonUmum);
router.route('/status-harian').get(getAllPersonUmumStatus);
router.route('/:id').get(getSinglePersonUmum).patch(updatePersonUmum);
router.route('/salah/:id').patch(retenSalahPersonUmum);
router.route('/delete/:id').patch(softDeletePersonUmum);
router.route('/to-myvas').post(toMyVas);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllPersonUmum,
  getSinglePersonUmum,
  updatePersonUmum,
  retenSalahPersonUmum,
  softDeletePersonUmum,
  deletePersonUmum,
} = require('../controllers/umum');

router.route('/').get(getAllPersonUmum);
router.route('/:id').get(getSinglePersonUmum).patch(updatePersonUmum);
router.route('/salah/:id').patch(retenSalahPersonUmum);
router.route('/delete/:id').patch(softDeletePersonUmum);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllPersonUmum,
  getSinglePersonUmum,
  updatePersonUmum,
  deletePersonUmum,
  softDeletePersonUmum,
} = require('../controllers/umum');

router.route('/').get(getAllPersonUmum);
router.route('/:id').get(getSinglePersonUmum).patch(updatePersonUmum);
router.route('/delete/:id').patch(softDeletePersonUmum);

module.exports = router;

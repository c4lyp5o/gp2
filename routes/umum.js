const express = require('express');
const router = express.Router();
const {
  getSinglePersonUmum,
  updatePersonUmum,
  deletePersonUmum,
} = require('../controllers/umum');

router
  .route('/:id')
  .get(getSinglePersonUmum)
  .patch(updatePersonUmum)
  .delete(deletePersonUmum);

module.exports = router;

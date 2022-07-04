const express = require('express');
const router = express.Router();
const {
  getSinglePersonUmum,
  updatePersonUmum,
} = require('../controllers/umum');

router.route('/:id').get(getSinglePersonUmum).patch(updatePersonUmum);

module.exports = router;

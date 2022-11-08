const express = require('express');
const router = express.Router();
const {
  getAllPersonUmum,
  getSinglePersonUmum,
  updatePersonUmum,
  deletePersonUmum,
} = require('../controllers/umum');

router.route('/').get(getAllPersonUmum);
router
  .route('/:id')
  .get(getSinglePersonUmum)
  .patch(updatePersonUmum)
  .delete(deletePersonUmum);

module.exports = router;

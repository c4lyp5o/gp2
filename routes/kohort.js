const express = require('express');
const router = express.Router();
const {
  getSinglePersonKohort,
  updatePersonKohort,
  deletePersonKohort,
  queryPersonKohort,
} = require('../controllers/kohort');

router.route('/').get(queryPersonKohort);
router
  .route('/:kohortType/:personKohortId')
  .get(getSinglePersonKohort)
  .patch(updatePersonKohort);

module.exports = router;

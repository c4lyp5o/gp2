const express = require('express');
const router = express.Router();
const {
  getSinglePersonKohortKotak,
  updatePersonKohortKotak,
  softDeletePersonKOTAK,
  deletePersonKohortKotak,
  queryPersonKohortKotak,
} = require('../controllers/kohortKotak');

router.route('/').get(queryPersonKohortKotak);

// PATCH
router
  .route('/:personKohortKotakId')
  .get(getSinglePersonKohortKotak)
  .patch(updatePersonKohortKotak);
router.route('/delete/:personKohortKotakId').patch(softDeletePersonKOTAK);

module.exports = router;

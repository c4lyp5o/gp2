const express = require('express');
const router = express.Router();
const {
  getSinglePersonKohortKotak,
  updatePersonKohortKotak,
  queryPersonKohortKotak,
} = require('../controllers/kohortKotak');

router.route('/').get(queryPersonKohortKotak);
router
  .route('/:personKohortKotakId')
  .get(getSinglePersonKohortKotak)
  .patch(updatePersonKohortKotak);

module.exports = router;
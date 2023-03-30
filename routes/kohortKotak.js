const express = require('express');
const router = express.Router();
const {
  getSinglePersonKohortKotak,
  updatePersonKohortKotak,
  queryPersonKohortKotak,
} = require('../controllers/kohortKotak');

router.route('/').get(queryPersonKohortKotak);
router
  .route('/:personKohortId')
  .get(getSinglePersonKohortKotak)
  .patch(updatePersonKohortKotak);

module.exports = router;

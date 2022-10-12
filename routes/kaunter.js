const express = require('express');
const router = express.Router();
const {
  createPersonKaunter,
  getSinglePersonKaunter,
  updatePersonKaunter,
  deletePersonKaunter,
  getPersonFromCache,
} = require('../controllers/kaunter');

router.route('/').post(createPersonKaunter);
router
  .route('/:personKaunterId')
  .get(getSinglePersonKaunter)
  .patch(updatePersonKaunter)
  .delete(deletePersonKaunter);
router.route('/check').post(getPersonFromCache);

module.exports = router;

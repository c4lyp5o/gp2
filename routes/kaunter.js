const express = require('express');
const router = express.Router();
const {
  getSinglePersonKaunter,
  createPersonKaunter,
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
router.route('/check/:personKaunterId').get(getPersonFromCache);

module.exports = router;

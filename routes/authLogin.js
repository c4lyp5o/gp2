const express = require('express');
const router = express.Router();
const {
  authFind,
  authLogin,
  authKaunter,
} = require('../controllers/authLogin');

router.route('/find').get(authFind);
router.route('/login').post(authLogin);
router.route('/kaunter/login').post(authKaunter);

module.exports = router;

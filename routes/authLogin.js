const express = require('express');
const router = express.Router();
const { authLogin, authKaunter } = require('../controllers/authLogin');

router.route('/login').post(authLogin);
router.route('/kaunter/login').post(authKaunter);

module.exports = router;

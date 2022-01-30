const express = require('express');
const router = express.Router();
const authLogin = require('../controllers/authLogin');

router.route('/login').post(authLogin);

module.exports = router;
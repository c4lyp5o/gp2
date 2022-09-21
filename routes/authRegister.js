const express = require('express');
const router = express.Router();
const { authRegister } = require('../controllers/authRegister');

router.route('/register').post(authRegister);

module.exports = router;

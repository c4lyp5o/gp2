const express = require('express');
const router = express.Router();
const { createPersonSekolah } = require('../controllers/sekolah');

router.route('/').post(createPersonSekolah);

module.exports = router;
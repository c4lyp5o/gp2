const express = require('express');
const router = express.Router();
const { queryPersonSekolah } = require('../controllers/sekolah');

router.route('/sekolah').get(queryPersonSekolah);

module.exports = router;

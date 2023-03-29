const express = require('express');
const router = express.Router();

const { getSekolahMOEIS, getPelajarMOEIS } = require('../controllers/moeis');

router.route('/sekolah').get(getSekolahMOEIS);
router.route('/pelajar').get(getPelajarMOEIS);

module.exports = router;

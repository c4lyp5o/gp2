const express = require('express');
const router = express.Router();
const kaunter = require('../controllers/kaunter');
const umum = require('../controllers/umum');
const sekolah = require('../controllers/sekolah');

router.route('/kaunter').get(kaunter.queryPersonKaunter);
router.route('/events').get(kaunter.getProjekKomuniti);
router.route('/kaunter/taska-tadika').get(kaunter.getTaskaTadikaList);
router.route('/umum').get(umum.queryPersonUmum);
router.route('/umum/taska-tadika').get(umum.getTaskaTadikaList);
router.route('/sekolah').get(sekolah.queryPersonSekolah);

module.exports = router;

const express = require('express');
const router = express.Router();
const kaunter = require('../controllers/kaunter');
const umum = require('../controllers/umum');
const sekolah = require('../controllers/sekolah');
const promosi = require('../controllers/promosi');

router.route('/kaunter').get(kaunter.queryPersonKaunter);
router.route('/kaunter/taska-tadika').get(kaunter.getTaskaTadikaList);
router.route('/events').get(kaunter.getProjekKomuniti); // TODO to refactor for prefix /kaunter & recheck who else using this route

router.route('/umum').get(umum.queryPersonUmum);
router.route('/umum/taska-tadika').get(umum.getTaskaTadikaList);

router.route('/sekolah').get(sekolah.queryPersonSekolah);

router.route('/promosi').get(promosi.getProgramPromosi);
router.route('/promosi/aktiviti').get(promosi.getAktivitiPromosi);

module.exports = router;

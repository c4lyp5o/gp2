const express = require('express');
const router = express.Router();
const kaunter = require('../controllers/kaunter');
const umum = require('../controllers/umum');
const sekolah = require('../controllers/sekolah');
const kpbmpb = require('../controllers/kpbmpb');
const promosi = require('../controllers/promosi');

router.route('/kaunter').get(kaunter.queryPersonKaunter);
router.route('/kaunter/kk-kd').get(kaunter.getKkKdList);
router.route('/kaunter/taska-tadika').get(kaunter.getTaskaTadikaList);
router.route('/kaunter/events').get(kaunter.getProjekKomuniti);

router.route('/umum').get(umum.queryPersonUmum);
router.route('/umum/kk-kd').get(umum.getKkKdList);
router.route('/umum/taska-tadika').get(umum.getTaskaTadikaList);
router.route('/umum/events').get(umum.getProjekKomuniti);

router.route('/sekolah').get(sekolah.queryPersonSekolah);

router.route('/kpbmpb').get(kpbmpb.getAllKPBMPBForNegeri);
router.route('/kpbmpb/sekolah').get(kpbmpb.getAllKPBMPBForNegeriSekolah);

router.route('/promosi').get(promosi.queryAktivitiPromosi);

module.exports = router;

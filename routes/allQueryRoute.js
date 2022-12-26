const express = require('express');
const router = express.Router();
const kaunter = require('../controllers/kaunter');
const umum = require('../controllers/umum');
const sekolah = require('../controllers/sekolah');
const promosi = require('../controllers/promosi');
const operator = require('../controllers/operator');

router.route('/kaunter').get(kaunter.queryPersonKaunter);
router.route('/kaunter/taska-tadika').get(kaunter.getTaskaTadikaList);
router.route('/kaunter/events').get(kaunter.getProjekKomuniti);

router.route('/umum').get(umum.queryPersonUmum);
router.route('/umum/taska-tadika').get(umum.getTaskaTadikaList);

router.route('/sekolah').get(sekolah.queryPersonSekolah);

router.route('/promosi').get(promosi.queryAktivitiPromosi);

router.route('/operator').get(operator.queryPersonOperator);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getJPNMOEIS,
  getSekolahMOEIS,
  getSingleSekolahMOEIS,
  getPelajarMOEIS,
  getSinglePelajarMOEIS,
  getManualInsertPelajarMOEIS,
  getPrioritySekolahMOEIS,
  getRefreshPelajarMOEIS,
} = require('../controllers/moeis');

router.route('/jpn').get(getJPNMOEIS);
router.route('/sekolah').get(getSekolahMOEIS);
router.route('/singleSekolah').get(getSingleSekolahMOEIS);
router.route('/pelajar').get(getPelajarMOEIS);
router.route('/singlePelajar').get(getSinglePelajarMOEIS);
router.route('/manual-insert-pelajar').get(getManualInsertPelajarMOEIS);
router.route('/priority-sekolah').get(getPrioritySekolahMOEIS);
router.route('/refresh-pelajar').get(getRefreshPelajarMOEIS);

module.exports = router;

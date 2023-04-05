const express = require('express');
const router = express.Router();
const {
  getAllSekolahKohortFMR,
  getAllD1Student,
  registerSekolahFMR,
  getAllPersonKohortFMR,
  getPersonKohortFMR,
  updatePersonKohortFMR,
  deletePersonKohortFMR,
  queryPersonKohortFMR,
} = require('../controllers/kohortFMR');

router.route('/').get(getAllSekolahKohortFMR);
router.route('/query/').get(getAllD1Student);
// router.route('/daftar/:singleSekolahId').get(registerSekolahFMR);
// router.route('/telah-daftar/').get(getAllPersonKohortFMR);
// router
//   .route('/:personKohortFMRId')
//   .get(getPersonKohortFMR)
//   .patch(updatePersonKohortFMR);

module.exports = router;

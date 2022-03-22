const express = require('express');
const router = express.Router();
const { getAllPersonSekolahs, getSinglePersonSekolah, createPersonSekolah, updatePersonSekolah, deletePersonSekolah } = require('../controllers/sekolah');

router.route('/').get(getAllPersonSekolahs).post(createPersonSekolah);
router.route('/:id').get(getSinglePersonSekolah).patch(updatePersonSekolah).delete(deletePersonSekolah);

module.exports = router;
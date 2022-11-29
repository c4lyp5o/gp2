const express = require('express');
const router = express.Router();
const {
  getAllProgramPromosi,
  createAktivitiPromosi,
} = require('../controllers/promosi');

router.route('/').get(getAllProgramPromosi);
router.route('/aktiviti').post(createAktivitiPromosi);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllProgramPromosi } = require('../controllers/promosi');

router.route('/').get(getAllProgramPromosi);

module.exports = router;

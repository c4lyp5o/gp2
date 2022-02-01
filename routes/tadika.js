const express = require('express');
const router = express.Router();
const { getAllPersonTadikas, createPersonTadika } = require('../controllers/tadika');

router.route('/').get(getAllPersonTadikas).post(createPersonTadika);

module.exports = router;
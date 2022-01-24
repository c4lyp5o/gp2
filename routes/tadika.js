const express = require('express');
const router = express.Router();
const { createPersonTadika } = require('../controllers/tadika');

router.route('/').post(createPersonTadika);

module.exports = router;
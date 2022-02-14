const express = require('express');
const router = express.Router();
const { querySinglePersonTadika } = require('../controllers/tadika');

router.route('/tadika').get(querySinglePersonTadika);

module.exports = router;
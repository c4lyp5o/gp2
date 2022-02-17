const express = require('express');
const router = express.Router();
const { queryPersonTadika } = require('../controllers/tadika');

router.route('/tadika').get(queryPersonTadika);

module.exports = router;
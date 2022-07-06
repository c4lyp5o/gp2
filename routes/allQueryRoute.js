const express = require('express');
const router = express.Router();
// const { queryPersonTadika } = require('../controllers/tadika');
const { queryPersonUmum } = require('../controllers/umum');

// router.route('/tadika').get(queryPersonTadika);
router.route('/umum').get(queryPersonUmum);

module.exports = router;

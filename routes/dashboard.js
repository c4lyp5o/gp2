const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard');

router.route('/').get(dashboard);

module.exports = router;
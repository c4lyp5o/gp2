const express = require('express');
const router = express.Router();

const { dpimsService } = require('../controllers/dpims');

router.route('/').get(dpimsService);

module.exports = router;

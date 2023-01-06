const express = require('express');
const router = express.Router();
const getdate = require('../controllers/getdate');

router.route('/').get(getdate);

module.exports = router;

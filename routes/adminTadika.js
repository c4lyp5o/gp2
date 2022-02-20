const express = require('express');
const router = express.Router();
const { adminGetAllPersonTadikas } = require('../controllers/adminTadika');

router.route('/').get(adminGetAllPersonTadikas);

module.exports = router;
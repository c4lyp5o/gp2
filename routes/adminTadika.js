const express = require('express');
const router = express.Router();
const { adminGetAllPersonTadikas, adminGetSinglePersonTadika } = require('../controllers/adminTadika');

router.route('/').get(adminGetAllPersonTadikas);
router.route('/:id').get(adminGetSinglePersonTadika);

module.exports = router;
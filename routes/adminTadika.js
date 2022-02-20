const express = require('express');
const router = express.Router();
const { adminGetAllPersonTadikas, adminGetSinglePersonTadika, adminUpdatePersonTadika } = require('../controllers/adminTadika');

router.route('/').get(adminGetAllPersonTadikas);
router.route('/:id').get(adminGetSinglePersonTadika).patch(adminUpdatePersonTadika);

module.exports = router;
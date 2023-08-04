const express = require('express');
const router = express.Router();
const {
  getSinglePersonOperator,
  updateSinglePersonOperator,
} = require('../controllers/operator');

// router.route('/:personOperatorId');

module.exports = router;

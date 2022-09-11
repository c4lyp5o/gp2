// Base
const express = require('express');
const router = express.Router();

// Controller
const admincon = require('../controllers/adminController');
const adminAPI = require('../controllers/adminAPI');
const testcount = require('../controllers/testCount');

// Routes
router.get('/getcipher', adminAPI.getCipher);

router.get('/', adminAPI.helloUser);
router.post('/', adminAPI.helloUser);

router.get('/newroute', adminAPI.getData);
router.post('/newroute', adminAPI.getData);

router.post('/adduser', adminAPI.addAdmin);
router.post('/getuser', adminAPI.getCurrentUser);

router.post('/login', adminAPI.loginUser);
router.post('/logout', admincon.logOut);

router.get('/testcount', testcount.testFunction);

module.exports = router;

// Base
const express = require('express');
const router = express.Router();

// Controller
const generatecon = require ('../controllers/generateRetenController');

// Routes
// main menu
router.get('/', generatecon.generate_menu);

// be sauron
router.get('/senaraidata', generatecon.showTadikaData);

// pilih reten route
router.get('/pilihreten', generatecon.borangPilihReten);
router.post('/pilihreten', generatecon.borangPilihReten_post);

// pindah data route
router.get('/pindahData', generatecon.generateaAllData);
router.post('/pindahdata', generatecon.generateAllData_post );
router.get('/pindahdata/csv', generatecon.pindahDataCSV);
router.get('/pindahdata/xlsx', generatecon.pindahDataXlsx);

// overview route
router.get('/overview', generatecon.borangOverview);
router.post('/overview', generatecon.borangOverview_post);

// generate reten route
router.get('/pilihreten/generatereport', generatecon.borangPilihReten_post);

module.exports = router;
// Base
const express = require('express');
const router = express.Router();

// Controller
const generatecon = require('../controllers/generateRetenController');
const countcon = require('../controllers/countHelper');
const generateTest = require('../controllers/testCount');

// // Routes
// // main menu
// router.get('/', generatecon.generate_menu);

// // be sauron
// router.get('/senaraidata', generatecon.showTadikaData);

// // pilih reten route
// router.get('/pilihreten', generatecon.borangPilihReten);
// router.post('/pilihreten', generatecon.borangPilihReten_post);

// // pindah data route
// router.get('/pindahData', generatecon.generateaAllData);
// router.post('/pindahdata', generatecon.generateAllData_post );
// router.get('/pindahdata/csv', generatecon.pindahDataCSV);
// router.get('/pindahdata/xlsx', generatecon.pindahDataXlsx);

// // overview route
// router.get('/overview', generatecon.borangOverview);
// router.post('/overview', generatecon.borangOverview_post);

// // generate reten route
// router.get('/pilihreten/generatereport', generatecon.borangPilihReten_post);

router.post('/tadika', generatecon.borangPilihRetenTadika);
router.post('/tadika/reten', generatecon.borangPilihRetenTadika_post);
router.post('/sekolah', generatecon.borangPilihRetenSekolah);
router.post('/sekolah/reten', generatecon.borangPilihRetenSekolah_post);
router.post('/youngadult', generatecon.borangPilihRetenYA);
router.post('/youngadult/reten', generatecon.borangPilihRetenYA_post);
router.post('/buatreten', generatecon.borangPilihRetenTadika_post);

// router.post('/testroute', generateTest.getDetails);
router.get('/testdownload', generateTest.downloader);
router.get('/testcount', generateTest.testFunction201A);
router.get('/paa', generateTest.popAndAgg);
router.get('/paa2', generateTest.popAndAgg2);
// router.get('/paa3', generateTest.tryPG101);
router.get('/paa4', generateTest.new201);
// router.get('/paa5', generateTest.tryPG101);

module.exports = router;

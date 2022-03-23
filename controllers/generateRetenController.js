'use strict';
// const Tadika = require('../models/Tadika');
// const excelHelper = require('./excelHelper');
// const countHelper = require('./countHelper');
// const YAData = require('../models/Sekolah'); to put in the future
// const YAData = require('../models/YA'); to put in the future

// Display generate menu
exports.borangPilihRetenTadika = function(req, res, next) {
  res.render('generatereten', { title: 'Laman Manipulasi Data', tadika: req.body.namaTadika, jenis: req.body.jenisFasiliti });
}

exports.borangPilihRetenTadika_post = function(req, res) {
  var x = req.body.tadikaNama;
  var y = req.body.jenisReten;
  console.log(req.body.tadikaNama);
  console.log(req.body.jenisReten);
  res.send('Hello ' + x + ' & ' + y);
};

exports.borangPilihRetenSekolah = function(req, res, next) {
  res.render('generatereten', { title: 'Laman Manipulasi Data', sekolah: req.body.namaTadika, jenis: req.body.jenisFasiliti });
}

exports.borangPilihRetenSekolah_post = function(req, res) {
  var x = req.body.tadikaNama;
  var y = req.body.jenisReten;
  console.log(req.body.tadikaNama);
  console.log(req.body.jenisReten);
  res.send('Hello ' + x + ' & ' + y);
};

exports.borangPilihRetenYA = function(req, res, next) {
  res.render('generatereten', { title: 'Laman Manipulasi Data', YA: req.body.namaTadika, jenis: req.body.jenisFasiliti });
}

exports.borangPilihRetenYA_post = function(req, res) {
  var x = req.body.tadikaNama;
  var y = req.body.jenisReten;
  console.log(req.body.tadikaNama);
  console.log(req.body.jenisReten);
  res.send('Hello ' + x + ' & ' + y);
};

// // Functions for data dumping
// exports.generateaAllData = function(req, res) {
//   res.render('generateall', { title: 'Download Semua Data' });
// }

// exports.generateAllData_post = function(req, res) {
//   if (req.body.jenisFile == 'CSV') {
//     res.redirect('/generate/main/pindahdata/csv');
//   } else {
//     res.redirect('/generate/main/pindahdata/xlsx');
//   }
// }

// exports.pindahDataCSV = function(req, res) {
//   countHelper.CSVexporter(req, res);
// }

// exports.pindahDataXlsx = async function(req, res) {
//   countHelper.XLSXexporter(req, res);
// }

// Display list of all Tadika Kids.
// exports.showTadikaData = function(req, res) {
//     Tadika.find()
//       .sort([['namaPendaftaranTadika', 'ascending']])
//       .exec(function (err, list_budak) {
//         if (err) { return next(err); }
//         res.render('tadika_list', { title: 'Semua budak tadika', budak_list: list_budak });
//       });
// };

// // Functions for pilih reten
// exports.borangPilihRetenLama = function(req, res) {
//   Tadika.distinct('namaTaskaTadikaPendaftaranTadika', {nama: new RegExp('')}, function(err, listtadika) {
//     if (err) { return next(err); }
//     res.render('generatereten', { title: 'Hasilkan Reten', tadikas: listtadika });
//   });
// };

// // Functions for overview
// exports.borangOverview = function(req, res) {
//   Tadika.distinct('createdByNegeri', {nama: new RegExp('')}, function(err, listnegeri) {
//     if (err) { return next(err); }
//     res.render('overview', { title: 'Overview mengikut negeri', negeri: listnegeri });
//   });
// };

// exports.borangOverview_post = async function(req, res, negeri) {
//   await excelHelper.prepareDocumentLaporan();
//   countHelper.overView(req, res, negeri);
// };
'use strict';
// const Tadika = require('../models/Tadika');
// const excelHelper = require('./excelHelper');
const countHelper = require('./countHelper');
// const YAData = require('../models/Sekolah'); to put in the future
// const YAData = require('../models/YA'); to put in the future

// Display generate menu
exports.borangPilihRetenTadika_post = function (req, res) {
  var x = req.body.tadikaNama;
  var y = req.body.jenisReten;
  console.log(req.body.tadikaNama);
  console.log(req.body.jenisReten);
  res.send('Hello ' + x + ' & ' + y);
};

exports.borangPilihRetenSekolah_post = function (req, res) {
  var x = req.body.tadikaNama;
  var y = req.body.jenisReten;
  console.log(req.body.tadikaNama);
  console.log(req.body.jenisReten);
  res.send('Hello ' + x + ' & ' + y);
};

exports.borangPilihRetenYA_post = function (req, res) {
  var x = req.body.tadikaNama;
  var y = req.body.jenisReten;
  console.log(req.body.tadikaNama);
  console.log(req.body.jenisReten);
  res.send('Hello ' + x + ' & ' + y);
};

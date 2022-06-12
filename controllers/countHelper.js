const fs = require('fs');
const path = require('path');
const async = require('async');
const Excel = require('exceljs');
const Tadika = require('../models/Tadika');
// const moment = require('moment');
// const json2csv = require('json2csv').parse;
// const YAData = require('../models/Sekolah'); to put in the future
// const YAData = require('../models/YA'); to put in the future

exports.filterbyUmur = function(req, res) {
  async.parallel({
    resultTaska: function(callback) {
      Tadika.aggregate([

        { $match: { taska: "1" } },

        { $group: { _id:"$createdByDaerah",
          jumlahBaru : { $sum: { $toDouble:'$kedatanganBaru' } },
          jumlahUlangan : { $sum: { $toDouble:'$kedatanganUlangan' } }, 
          jumlahD : { $sum: { $toDouble:"$statusGigidesidusD" } },
          jumlahM : { $sum: { $toDouble:"$statusGigidesidusM" } },
          jumlahF : { $sum: { $toDouble:"$statusGigidesidusF" } },
          jumlahX : { $sum: { $toDouble:"$statusGigidesidusX" } },
          jumlahDMFX : { $sum: { $cond: [ { $and: [ { $eq: ["$statusGigidesidusD", '0'] }, { $eq: ["$statusGigidesidusM", '0'] }, { $eq: ["$statusGigidesidusF", '0'] }, { $eq: ["$statusGigidesidusX", '0'] } ] }, 1, 0 ] } },
          jumlahSpA : { $sum: { $toDouble:"$kebersihanMulutA" } },
          jumlahSpC : { $sum: { $toDouble:"$kebersihanMulutC" } },
          jumlahSpE : { $sum: { $toDouble:"$kebersihanMulutE" } },
          jumlahTisuKeras : { $sum: { $toDouble:"$traumaTisuKeras" } },
          jumlahTisuLembut : { $sum: { $toDouble:"$traumaTisuLembut" } },
          jumlahPerluFV : { $sum: { $toDouble:"$perluFvMuridB" } },
          jumlahTelahFVB : { $sum: { $toDouble:"$telahFVMuridB" } },
          jumlahTelahFVS : { $sum: { $toDouble:"$telahFVMuridS" } },
          jumlahTelahTampalAntB : { $sum: { $toDouble:"$telahTampalanAntGdB" } },
          jumlahTelahTampalAntS : { $sum: { $toDouble:"$telahTampalanAntGdS" } },
          jumlahTelahTampalPosB : { $sum: { $toDouble:"$telahTampalanPosGdB" } },
          jumlahTelahTampalPosS : { $sum: { $toDouble:"$telahTampalanPosGdS" } },
          cabutan: { $sum: { $toDouble:'$cabutanGd' } },
          jumlahAbses: { $sum: { $toDouble:"$abses" } },
          jumlahPulpotomi: { $sum: { $toDouble:"$pulpotomi" } },
          jumlahCTod: { $sum: { $toDouble:"$ceramahToddler" } },
          jumlahCPar: { $sum: { $toDouble:"$ceramahPenjaga" } },
          jumlahLMG: { $sum: { $toDouble:"$toddlerLMG" } },
          jumlahCRAlow: { $sum: { $toDouble:"$craRendah" } },
          jumlahCRAmid: { $sum: { $toDouble:"$craSederhana" } },
          jumlahCRAhi: { $sum: { $toDouble:"$craTinggi" } }, },},

        { $sort: { _id: 1 } },

        ], callback);
      
        Tadika.aggregate([

          { $match: { tadika: "1" } },
  
          { $group: { _id:"$createdByDaerah",
            jumlahBaru : { $sum: { $toDouble:'$kedatanganBaru' } },
            jumlahUlangan : { $sum: { $toDouble:'$kedatanganUlangan' } }, 
            jumlahD : { $sum: { $toDouble:"$statusGigidesidusD" } },
            jumlahM : { $sum: { $toDouble:"$statusGigidesidusM" } },
            jumlahF : { $sum: { $toDouble:"$statusGigidesidusF" } },
            jumlahX : { $sum: { $toDouble:"$statusGigidesidusX" } },
            jumlahDMFX : { $sum: { $cond: [ { $and: [ { $eq: ["$statusGigidesidusD", '0'] }, { $eq: ["$statusGigidesidusM", '0'] }, { $eq: ["$statusGigidesidusF", '0'] }, { $eq: ["$statusGigidesidusX", '0'] } ] }, 1, 0 ] } },
            jumlahSpA : { $sum: { $toDouble:"$kebersihanMulutA" } },
            jumlahSpC : { $sum: { $toDouble:"$kebersihanMulutC" } },
            jumlahSpE : { $sum: { $toDouble:"$kebersihanMulutE" } },
            jumlahTisuKeras : { $sum: { $toDouble:"$traumaTisuKeras" } },
            jumlahTisuLembut : { $sum: { $toDouble:"$traumaTisuLembut" } },
            jumlahPerluFV : { $sum: { $toDouble:"$perluFvMuridB" } },
            jumlahTelahFVB : { $sum: { $toDouble:"$telahFVMuridB" } },
            jumlahTelahFVS : { $sum: { $toDouble:"$telahFVMuridS" } },
            jumlahTelahTampalAntB : { $sum: { $toDouble:"$telahTampalanAntGdB" } },
            jumlahTelahTampalAntS : { $sum: { $toDouble:"$telahTampalanAntGdS" } },
            jumlahTelahTampalPosB : { $sum: { $toDouble:"$telahTampalanPosGdB" } },
            jumlahTelahTampalPosS : { $sum: { $toDouble:"$telahTampalanPosGdS" } },
            cabutan: { $sum: { $toDouble:'$cabutanGd' } },
            jumlahAbses: { $sum: { $toDouble:"$abses" } },
            jumlahPulpotomi: { $sum: { $toDouble:"$pulpotomi" } },
            jumlahCTod: { $sum: { $toDouble:"$ceramahToddler" } },
            jumlahCPar: { $sum: { $toDouble:"$ceramahPenjaga" } },
            jumlahLMG: { $sum: { $toDouble:"$toddlerLMG" } },
            jumlahCRAlow: { $sum: { $toDouble:"$craRendah" } },
            jumlahCRAmid: { $sum: { $toDouble:"$craSederhana" } },
            jumlahCRAhi: { $sum: { $toDouble:"$craTinggi" } }, },},
  
          { $sort: { _id: 1 } },
  
          ], callback);
        
        Tadika.aggregate([

          { $match: { kkia: "1" } }, // nak ambil data dari mana?
  
          { $group: { _id:"$createdByDaerah",
            jumlahBaru : { $sum: { $toDouble:'$kedatanganBaru' } },
            jumlahUlangan : { $sum: { $toDouble:'$kedatanganUlangan' } }, 
            jumlahD : { $sum: { $toDouble:"$statusGigidesidusD" } },
            jumlahM : { $sum: { $toDouble:"$statusGigidesidusM" } },
            jumlahF : { $sum: { $toDouble:"$statusGigidesidusF" } },
            jumlahX : { $sum: { $toDouble:"$statusGigidesidusX" } },
            jumlahDMFX : { $sum: { $cond: [ { $and: [ { $eq: ["$statusGigidesidusD", '0'] }, { $eq: ["$statusGigidesidusM", '0'] }, { $eq: ["$statusGigidesidusF", '0'] }, { $eq: ["$statusGigidesidusX", '0'] } ] }, 1, 0 ] } },
            jumlahSpA : { $sum: { $toDouble:"$kebersihanMulutA" } },
            jumlahSpC : { $sum: { $toDouble:"$kebersihanMulutC" } },
            jumlahSpE : { $sum: { $toDouble:"$kebersihanMulutE" } },
            jumlahTisuKeras : { $sum: { $toDouble:"$traumaTisuKeras" } },
            jumlahTisuLembut : { $sum: { $toDouble:"$traumaTisuLembut" } },
            jumlahPerluFV : { $sum: { $toDouble:"$perluFvMuridB" } },
            jumlahTelahFVB : { $sum: { $toDouble:"$telahFVMuridB" } },
            jumlahTelahFVS : { $sum: { $toDouble:"$telahFVMuridS" } },
            jumlahTelahTampalAntB : { $sum: { $toDouble:"$telahTampalanAntGdB" } },
            jumlahTelahTampalAntS : { $sum: { $toDouble:"$telahTampalanAntGdS" } },
            jumlahTelahTampalPosB : { $sum: { $toDouble:"$telahTampalanPosGdB" } },
            jumlahTelahTampalPosS : { $sum: { $toDouble:"$telahTampalanPosGdS" } },
            cabutan: { $sum: { $toDouble:'$cabutanGd' } },
            jumlahAbses: { $sum: { $toDouble:"$abses" } },
            jumlahPulpotomi: { $sum: { $toDouble:"$pulpotomi" } },
            jumlahCTod: { $sum: { $toDouble:"$ceramahToddler" } },
            jumlahCPar: { $sum: { $toDouble:"$ceramahPenjaga" } },
            jumlahLMG: { $sum: { $toDouble:"$toddlerLMG" } },
            jumlahCRAlow: { $sum: { $toDouble:"$craRendah" } },
            jumlahCRAmid: { $sum: { $toDouble:"$craSederhana" } },
            jumlahCRAhi: { $sum: { $toDouble:"$craTinggi" } }, },},
  
          { $sort: { _id: 1 } },
  
          ], callback);

        Tadika.aggregate([

          { $match: { outpatient: "1" } }, // nak ambil data dari mana?

          { $group: { _id:"$createdByDaerah",
            jumlahBaru : { $sum: { $toDouble:'$kedatanganBaru' } },
            jumlahUlangan : { $sum: { $toDouble:'$kedatanganUlangan' } }, 
            jumlahD : { $sum: { $toDouble:"$statusGigidesidusD" } },
            jumlahM : { $sum: { $toDouble:"$statusGigidesidusM" } },
            jumlahF : { $sum: { $toDouble:"$statusGigidesidusF" } },
            jumlahX : { $sum: { $toDouble:"$statusGigidesidusX" } },
            jumlahDMFX : { $sum: { $cond: [ { $and: [ { $eq: ["$statusGigidesidusD", '0'] }, { $eq: ["$statusGigidesidusM", '0'] }, { $eq: ["$statusGigidesidusF", '0'] }, { $eq: ["$statusGigidesidusX", '0'] } ] }, 1, 0 ] } },
            jumlahSpA : { $sum: { $toDouble:"$kebersihanMulutA" } },
            jumlahSpC : { $sum: { $toDouble:"$kebersihanMulutC" } },
            jumlahSpE : { $sum: { $toDouble:"$kebersihanMulutE" } },
            jumlahTisuKeras : { $sum: { $toDouble:"$traumaTisuKeras" } },
            jumlahTisuLembut : { $sum: { $toDouble:"$traumaTisuLembut" } },
            jumlahPerluFV : { $sum: { $toDouble:"$perluFvMuridB" } },
            jumlahTelahFVB : { $sum: { $toDouble:"$telahFVMuridB" } },
            jumlahTelahFVS : { $sum: { $toDouble:"$telahFVMuridS" } },
            jumlahTelahTampalAntB : { $sum: { $toDouble:"$telahTampalanAntGdB" } },
            jumlahTelahTampalAntS : { $sum: { $toDouble:"$telahTampalanAntGdS" } },
            jumlahTelahTampalPosB : { $sum: { $toDouble:"$telahTampalanPosGdB" } },
            jumlahTelahTampalPosS : { $sum: { $toDouble:"$telahTampalanPosGdS" } },
            cabutan: { $sum: { $toDouble:'$cabutanGd' } },
            jumlahAbses: { $sum: { $toDouble:"$abses" } },
            jumlahPulpotomi: { $sum: { $toDouble:"$pulpotomi" } },
            jumlahCTod: { $sum: { $toDouble:"$ceramahToddler" } },
            jumlahCPar: { $sum: { $toDouble:"$ceramahPenjaga" } },
            jumlahLMG: { $sum: { $toDouble:"$toddlerLMG" } },
            jumlahCRAlow: { $sum: { $toDouble:"$craRendah" } },
            jumlahCRAmid: { $sum: { $toDouble:"$craSederhana" } },
            jumlahCRAhi: { $sum: { $toDouble:"$craTinggi" } }, },},

          { $sort: { _id: 1 } },

          ], callback);

          Tadika.aggregate([

            { $match: { lain2: "1" } }, // nak ambil data dari mana?
  
            { $group: { _id:"$createdByDaerah",
              jumlahBaru : { $sum: { $toDouble:'$kedatanganBaru' } },
              jumlahUlangan : { $sum: { $toDouble:'$kedatanganUlangan' } }, 
              jumlahD : { $sum: { $toDouble:"$statusGigidesidusD" } },
              jumlahM : { $sum: { $toDouble:"$statusGigidesidusM" } },
              jumlahF : { $sum: { $toDouble:"$statusGigidesidusF" } },
              jumlahX : { $sum: { $toDouble:"$statusGigidesidusX" } },
              jumlahDMFX : { $sum: { $cond: [ { $and: [ { $eq: ["$statusGigidesidusD", '0'] }, { $eq: ["$statusGigidesidusM", '0'] }, { $eq: ["$statusGigidesidusF", '0'] }, { $eq: ["$statusGigidesidusX", '0'] } ] }, 1, 0 ] } },
              jumlahSpA : { $sum: { $toDouble:"$kebersihanMulutA" } },
              jumlahSpC : { $sum: { $toDouble:"$kebersihanMulutC" } },
              jumlahSpE : { $sum: { $toDouble:"$kebersihanMulutE" } },
              jumlahTisuKeras : { $sum: { $toDouble:"$traumaTisuKeras" } },
              jumlahTisuLembut : { $sum: { $toDouble:"$traumaTisuLembut" } },
              jumlahPerluFV : { $sum: { $toDouble:"$perluFvMuridB" } },
              jumlahTelahFVB : { $sum: { $toDouble:"$telahFVMuridB" } },
              jumlahTelahFVS : { $sum: { $toDouble:"$telahFVMuridS" } },
              jumlahTelahTampalAntB : { $sum: { $toDouble:"$telahTampalanAntGdB" } },
              jumlahTelahTampalAntS : { $sum: { $toDouble:"$telahTampalanAntGdS" } },
              jumlahTelahTampalPosB : { $sum: { $toDouble:"$telahTampalanPosGdB" } },
              jumlahTelahTampalPosS : { $sum: { $toDouble:"$telahTampalanPosGdS" } },
              cabutan: { $sum: { $toDouble:'$cabutanGd' } },
              jumlahAbses: { $sum: { $toDouble:"$abses" } },
              jumlahPulpotomi: { $sum: { $toDouble:"$pulpotomi" } },
              jumlahCTod: { $sum: { $toDouble:"$ceramahToddler" } },
              jumlahCPar: { $sum: { $toDouble:"$ceramahPenjaga" } },
              jumlahLMG: { $sum: { $toDouble:"$toddlerLMG" } },
              jumlahCRAlow: { $sum: { $toDouble:"$craRendah" } },
              jumlahCRAmid: { $sum: { $toDouble:"$craSederhana" } },
              jumlahCRAhi: { $sum: { $toDouble:"$craTinggi" } }, },},
  
            { $sort: { _id: 1 } },
  
            ], callback);

            Tadika.aggregate([

              { $match: { agensiluar: "1" } }, // nak ambil data dari mana?
    
              { $group: { _id:"$createdByDaerah",
                jumlahBaru : { $sum: { $toDouble:'$kedatanganBaru' } },
                jumlahUlangan : { $sum: { $toDouble:'$kedatanganUlangan' } }, 
                jumlahD : { $sum: { $toDouble:"$statusGigidesidusD" } },
                jumlahM : { $sum: { $toDouble:"$statusGigidesidusM" } },
                jumlahF : { $sum: { $toDouble:"$statusGigidesidusF" } },
                jumlahX : { $sum: { $toDouble:"$statusGigidesidusX" } },
                jumlahDMFX : { $sum: { $cond: [ { $and: [ { $eq: ["$statusGigidesidusD", '0'] }, { $eq: ["$statusGigidesidusM", '0'] }, { $eq: ["$statusGigidesidusF", '0'] }, { $eq: ["$statusGigidesidusX", '0'] } ] }, 1, 0 ] } },
                jumlahSpA : { $sum: { $toDouble:"$kebersihanMulutA" } },
                jumlahSpC : { $sum: { $toDouble:"$kebersihanMulutC" } },
                jumlahSpE : { $sum: { $toDouble:"$kebersihanMulutE" } },
                jumlahTisuKeras : { $sum: { $toDouble:"$traumaTisuKeras" } },
                jumlahTisuLembut : { $sum: { $toDouble:"$traumaTisuLembut" } },
                jumlahPerluFV : { $sum: { $toDouble:"$perluFvMuridB" } },
                jumlahTelahFVB : { $sum: { $toDouble:"$telahFVMuridB" } },
                jumlahTelahFVS : { $sum: { $toDouble:"$telahFVMuridS" } },
                jumlahTelahTampalAntB : { $sum: { $toDouble:"$telahTampalanAntGdB" } },
                jumlahTelahTampalAntS : { $sum: { $toDouble:"$telahTampalanAntGdS" } },
                jumlahTelahTampalPosB : { $sum: { $toDouble:"$telahTampalanPosGdB" } },
                jumlahTelahTampalPosS : { $sum: { $toDouble:"$telahTampalanPosGdS" } },
                cabutan: { $sum: { $toDouble:'$cabutanGd' } },
                jumlahAbses: { $sum: { $toDouble:"$abses" } },
                jumlahPulpotomi: { $sum: { $toDouble:"$pulpotomi" } },
                jumlahCTod: { $sum: { $toDouble:"$ceramahToddler" } },
                jumlahCPar: { $sum: { $toDouble:"$ceramahPenjaga" } },
                jumlahLMG: { $sum: { $toDouble:"$toddlerLMG" } },
                jumlahCRAlow: { $sum: { $toDouble:"$craRendah" } },
                jumlahCRAmid: { $sum: { $toDouble:"$craSederhana" } },
                jumlahCRAhi: { $sum: { $toDouble:"$craTinggi" } }, },},
    
              { $sort: { _id: 1 } },
    
              ], callback);
    },
}, async function(err, results) {
    if (err) { return res.status(500).json({ err }); }
    console.log(results.resultTaska[1]);
    res.send(results); 
  });
}

exports.createBEGIN = (req, res) => {
  async.parallel({
    pesakitBaru: function(callback) {
      Tadika.countDocuments({ pesakitBaru: "1" }, callback);
    },
    jumlahFasiliti: function(callback) {
      Tadika.countDocuments({ jumlahFasiliti: "1" }, callback);
    },
    jumlahFasilitiLaksanakanBEGIN: function(callback) {
      Tadika.countDocuments({ jumlahFasilitiLaksanakanBEGIN: "1" }, callback);
    },
    peratusFasilitiLaksanakanBEGIN: function(callback) {
      Tadika.countDocuments({ peratusFasilitiLaksanakanBEGIN: "1" }, callback);
    },
    lowCRA: function(callback) {
      Tadika.countDocuments({ lowCRA: "1" }, callback);
    },
    moderateCRA: function(callback) {
      Tadika.countDocuments({ moderateCRA: "1" }, callback);
    },
    highCRA: function(callback) {
      Tadika.countDocuments({ highCRA: "1" }, callback);
    },
    jumlahKKjalaniBEGIN: function(callback) {
      Tadika.countDocuments({ peratusKKjalaniBEGIN: "1" }, callback);
    },
    jumlahKKlaksanakanBEGIN: function(callback) {
      Tadika.countDocuments({ peratusKKjalaniBEGIN: "1" }, callback);
    },
    jumlahHighCRAdoBEGIN: function(callback) {
      Tadika.countDocuments({ jumlahHighCRAdoBEGIN: "1" }, callback);
    },
    peratusHighCRAdoBEGIN: function(callback) {
      Tadika.countDocuments({ peratusHighCRAdoBEGIN: "1" }, callback);
    },
    async function(err, results) {
      try {
        
        // prepare the minigun
        let filename = path.join(__dirname, "..", "public", "exports", "BEGIN.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('BEGIN');

        // Execute them all
        //Taska Reten
        let rowNew = worksheet.getRow(15);
        rowNew.getCell(3).value = results.pesakitBaru; //Pesakit baru Program BEGIN dari Taska
        rowNew.getCell(4).value = results.jumlahFasiliti; //Jumlah Fasiliti Taska
        rowNew.getCell(5).value = results.jumlahFasilitiLaksanakanBEGIN; //Jumlah Fasiliti Laksanakan BEGIN di Taska
        rowNew.getCell(7).value = results.lowCRA; //Jumlah Murid w low CRA and Gums Dz di Taska
        rowNew.getCell(8).value = results.moderateCRA; //Jumlah Murid w moderate CRA and Gums Dz di Taska
        rowNew.getCell(9).value = results.highCRA; //Jumlah Murid w high CRA and Gums Dz di Taska
        rowNew.getCell(10).value = results.jumlahKKlaksanakanBEGIN; //Jumlah Murid Jalani BEGIN di Taska
        await rowNew.commit();

        // Execute operation 66
        //Pra-sekolah atau Tadika
        let rowNew2 = worksheet.getRow(16);
        rowNew2.getCell(3).value = results.pesakitBaru; //Pesakit baru Program BEGIN dari PraSekolah atau Tadika
        rowNew2.getCell(4).value = results.jumlahFasiliti; //Jumlah Fasiliti PraSekolah atau Tadika	
        rowNew2.getCell(5).value = results.jumlahFasilitiLaksanakanBEGIN; //Jumlah Fasiliti Laksanakan BEGIN di PraSekolah atau Tadika
        rowNew2.getCell(7).value = results.lowCRA; //Jumlah Murid w low CRA and Gums Dz di PraSekolah atau Tadika
        rowNew2.getCell(8).value = results.moderateCRA; //Jumlah Murid w moderate CRA and Gums Dz di PraSekolah atau Tadika
        rowNew2.getCell(9).value = results.highCRA; //Jumlah Murid w high CRA and Gums Dz di PraSekolah atau Tadika
        rowNew2.getCell(10).value = results.jumlahKKlaksanakanBEGIN; //Jumlah Murid Jalani BEGIN di PraSekolah atau Tadika
        await rowNew2.commit();

        // Execute operation 67
        //Sekolah Rendah Tahun 1 (termasuk KKI)
        let rowNew3 = worksheet.getRow(17);
        rowNew3.getCell(3).value = results.pesakitBaru; //Pesakit baru Program BEGIN dari Sekolah Rendah Tahun 1
        rowNew3.getCell(4).value = results.jumlahFasiliti; //Jumlah Fasiliti Sekolah Rendah Tahun 1	
        rowNew3.getCell(5).value = results.jumlahFasilitiLaksanakanBEGIN; //Jumlah Fasiliti Laksanakan BEGIN di Sekolah Rendah Tahun 1
        rowNew3.getCell(7).value = results.lowCRA; //Jumlah Murid w low CRA and Gums Dz di Sekolah Rendah Tahun 1
        rowNew3.getCell(8).value = results.moderateCRA; //Jumlah Murid w moderate CRA and Gums Dz di Sekolah Rendah Tahun 1
        rowNew3.getCell(9).value = results.highCRA; //Jumlah Murid w high CRA and Gums Dz di Sekolah Rendah Tahun 1
        rowNew3.getCell(10).value = results.jumlahKKlaksanakanBEGIN; //Jumlah Murid Jalani BEGIN di Sekolah Rendah Tahun 1
        await rowNew3.commit();

        // Execute operation 68
        //Sekolah Rendah Tahun 2 - 6 
        let rowNew4 = worksheet.getRow(18);
        rowNew4.getCell(3).value = results.pesakitBaru; //Pesakit baru Program BEGIN dari Sekolah Rendah Tahun 2 - 6 
        rowNew4.getCell(5).value = results.jumlahFasilitiLaksanakanBEGIN; //Jumlah Fasiliti Laksanakan BEGIN di Sekolah Rendah Tahun 2 - 6 
        rowNew4.getCell(7).value = results.lowCRA; //Jumlah Murid w low CRA and Gums Dz di Sekolah Rendah Tahun 2 - 6 
        rowNew4.getCell(8).value = results.moderateCRA; //Jumlah Murid w moderate CRA and Gums Dz di Sekolah Rendah Tahun 2 - 6 
        rowNew4.getCell(9).value = results.highCRA; //Jumlah Murid w high CRA and Gums Dz di Sekolah Rendah Tahun 2 - 6 
        rowNew4.getCell(12).value = results.jumlahHighCRAdoBEGIN; //Jumlah Murid high CRA jalani BEGIN di Sekolah Rendah Tahun 2 - 6  
        await rowNew4.commit();
        
        let rowNew5 = worksheet.getRow(20);
        rowNew6.getCell(1).value = 'Report Generated by Gi-Ret 2.0';
        rowNew6.commit();

        delete rowNew, rowNew2, rowNew3, rowNew4, rowNew5;
        let newfile = path.join(__dirname, "..", "public", "exports", "test-BEGIN.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);
        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // download the file after 3 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    }
  });
}

exports.createTOD = function(req, res) {
  async.parallel({
      dmfxEqualToZero: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
      resultTaska: function(callback) {
        Tadika.aggregate([
          { $match: { taska: "1" } },
          { $group: { _id:"$createdByDaerah",
            jumlahBaru : { $sum: { $toDouble:'$kedatanganBaru' } },
            jumlahUlangan : { $sum: { $toDouble:'$kedatanganUlangan' } }, 
            jumlahD : { $sum: { $toDouble:"$statusGigidesidusD" } },
            jumlahM : { $sum: { $toDouble:"$statusGigidesidusM" } },
            jumlahF : { $sum: { $toDouble:"$statusGigidesidusF" } },
            jumlahX : { $sum: { $toDouble:"$statusGigidesidusX" } },
            jumlahSpA : { $sum: { $toDouble:"$kebersihanMulutA" } },
            jumlahSpC : { $sum: { $toDouble:"$kebersihanMulutC" } },
            jumlahSpE : { $sum: { $toDouble:"$kebersihanMulutE" } },
            jumlahTisuKeras : { $sum: { $toDouble:"$traumaTisuKeras" } },
            jumlahTisuLembut : { $sum: { $toDouble:"$traumaTisuLembut" } },
            jumlahPerluFV : { $sum: { $toDouble:"$perluFvMuridB" } },
            jumlahTelahFVB : { $sum: { $toDouble:"$telahFVMuridB" } },
            jumlahTelahFVS : { $sum: { $toDouble:"$telahFVMuridS" } },
            jumlahTelahTampalAntB : { $sum: { $toDouble:"$telahTampalanAntGdB" } },
            jumlahTelahTampalAntS : { $sum: { $toDouble:"$telahTampalanAntGdS" } },
            jumlahTelahTampalPosB : { $sum: { $toDouble:"$telahTampalanPosGdB" } },
            jumlahTelahTampalPosS : { $sum: { $toDouble:"$telahTampalanPosGdS" } },
            cabutan: { $sum: { $toDouble:'$cabutanGd' } },
            jumlahAbses: { $sum: { $toDouble:"$abses" } },
            jumlahPulpotomi: { $sum: { $toDouble:"$pulpotomi" } },
            jumlahCTod: { $sum: { $toDouble:"$ceramahToddler" } },
            jumlahCPar: { $sum: { $toDouble:"$ceramahPenjaga" } },
            jumlahLMG: { $sum: { $toDouble:"$toddlerLMG" } },
            jumlahCRAlow: { $sum: { $toDouble:"$craRendah" } },
            jumlahCRAmid: { $sum: { $toDouble:"$craSederhana" } },
            jumlahCRAhi: { $sum: { $toDouble:"$craTinggi" } }, }, } ], callback);
      },      
      // dirujukDariAgensiLuar: function(callback) {
      //   Tadika.countDocuments({ rujuk: "1" }, callback);
      // },
      // toddlerDirujukPadaLawatan: function(callback) {
      //   Tadika.countDocuments({ toddlerDirujukPadaLawatan: "1" }, callback);
      // },
      // toddlerHadirRujukan: function(callback) {
      //   Tadika.countDocuments({ toddlerHadirRujukan: "1" }, callback);
      // },
      // pbToddler: function(callback) {
      //   Tadika.countDocuments({ pbToddler: "1" }, callback);
      // },
      // pbDstatusDMFX: function(callback) {
      //   Tadika.countDocuments({ pbDstatusDMFX: "1" }, callback);
      // },
      // pbMstatusDMFX: function(callback) {
      //   Tadika.countDocuments({ pbMstatusDMFX: "1" }, callback);
      // },
      // pbFstatusDMFX: function(callback) {
      //   Tadika.countDocuments({ pbFstatusDMFX: "1" }, callback);
      // },
      // pbXstatusDMFX: function(callback) {
      //   Tadika.countDocuments({ pbXstatusDMFX: "1" }, callback);
      // },
      // pbDMFXequalToZero: function(callback) {
      //   Tadika.countDocuments({ pbDMFXequalToZero: "1" }, callback);
      // },
      // agensiATM: function(callback) {
      //   Tadika.countDocuments({ agensiATM: "1" }, callback);
      // },
      // agensiIPTA: function(callback) {
      //   Tadika.countDocuments({ agensiIPTA: "1" }, callback);
      // },
      // agensiIPTS: function(callback) {
      //   Tadika.countDocuments({ agensiIPTS: "1" }, callback);
      // },
      // agensiPrivateDentalClinic: function(callback) {
      //   Tadika.countDocuments({ agensiPrivateDentalClinic: "1" }, callback);
      // },
      // agensiNGO: function(callback) {
      //   Tadika.countDocuments({ agensiNGO: "1" }, callback);
      // },
      // agensiIndustri: function(callback) {
      //   Tadika.countDocuments({ agensiIndustri: "1" }, callback);
      // },
  }, async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "TOD.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('TOD');

        let rowNew = worksheet.getRow(19);
        rowNew.getCell(3).value = results.theMother[0].jumlahBaru; //Kedatangan Baru Taska 
        rowNew.getCell(4).value = results.theMother[0].jumlahUlangan; //Kedatangan Ulangan Taska 
        rowNew.getCell(5).value = results.theMother[0].jumlahD; //d Status dmfx Taska
        rowNew.getCell(6).value = results.theMother[0].jumlahM; //m Status dmfx Taska
        rowNew.getCell(7).value = results.theMother[0].jumlahF; //f Status dmfx Taska
        rowNew.getCell(8).value = results.theMother[0].jumlahX; //x Status dmfx Taska
        rowNew.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 Taska 	
        rowNew.getCell(12).value = results.theMother[0].jumlahSpA; //Skor Plak A Taska
        rowNew.getCell(13).value = results.theMother[0].jumlahSpC; //Skor Plak C Taska
        rowNew.getCell(14).value = results.theMother[0].jumlahSpE; //Skor Plak E Taska
        rowNew.getCell(15).value = results.dmfxEqualToZero; //Tidak Perlu Rawatan (TPR) Taska
        rowNew.getCell(16).value = results.theMother[0].jumlahTisuKeras; //Trauma Tisu Lembut Taska
        rowNew.getCell(17).value = results.theMother[0].jumlahTisuLembut; //Trauma Tisu Keras Taska
        rowNew.getCell(19).value = results.theMother[0].jumlahPerluFV; //Bilangan Toddler Baru Perlu FV Taska
        rowNew.getCell(20).value = results.theMother[0].jumlahTelahFVB; //Bilangan Toddler Baru Dibuat FV Taska
        rowNew.getCell(21).value = results.theMother[0].jumlahTelahTampalAntB; //Bilangan Tampalan Anterior baru Taska
        rowNew.getCell(22).value = results.theMother[0].jumlahTelahTampalPosB; //Bilangan Tampalan Posterior baru Taska
        rowNew.getCell(24).value = results.theMother[0].cabutan; //Bilangan Cabutan Taska 
        rowNew.getCell(25).value = results.theMother[0].jumlahAbses; //Bilangan Abses Taska
        rowNew.getCell(26).value = results.theMother[0].jumlahPulpotomi; //Pulpotomi Taska 
        rowNew.getCell(27).value = results.theMother[0].jumlahCTod; //Ceramah Toddler Taska
        rowNew.getCell(28).value = results.theMother[0].jumlahCPar; //Ceramah Dewasa Taska
        rowNew.getCell(29).value = results.theMother[0].jumlahLMG; //LMG Toddler Taska
        rowNew.getCell(33).value = results.theMother[0].jumlahCRAlow; //CRA Rendah Taska
        rowNew.getCell(34).value = results.theMother[0].jumlahCRAmid; //CRA Sederhana Taska
        rowNew.getCell(35).value = results.theMother[0].jumlahCRAhi; //CRA Tinggi Taska
        await rowNew.commit();
        //Toddler Reten (Taska)
        let rowNew2 = worksheet.getRow(20);
        rowNew2.getCell(20).value = results.theMother[0].jumlahTelahFVS; //Bilangan Toddler Semula Dibuat FV Taska
        rowNew2.getCell(21).value = results.theMother[0].jumlahTelahTampalAntS; //Bilangan Tampalan Anterior Ulangan Taska 
        rowNew2.getCell(22).value = results.theMother[0].jumlahTelahTampalPosS; //Bilangan Tampalan Posterior Ulangan Taska
        await rowNew2.commit();

        // //Toddler Reten (Tadika)
        // let rowNew3 = worksheet.getRow(21);
        // rowNew3.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru Tadika 
        // rowNew3.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan Tadika 
        // rowNew3.getCell(5).value = results.dStatusDMFX; //d Status dmfx Tadika
        // rowNew3.getCell(6).value = results.mStatusDMFX; //m Status dmfx Tadika
        // rowNew3.getCell(7).value = results.dStatusDMFX; //f Status dmfx Tadika
        // rowNew3.getCell(8).value = results.xStatusDMFX; //x Status dmfx Tadika
        // rowNew3.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 Tadika 	
        // rowNew3.getCell(12).value = results.skorPlakA; //Skor Plak A Tadika
        // rowNew3.getCell(13).value = results.skorPlakC; //Skor Plak C Tadika
        // rowNew3.getCell(14).value = results.skorPlakE; //Skor Plak E Tadika
        // rowNew3.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) Tadika
        // rowNew3.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut Tadika
        // rowNew3.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras Tadika
        // rowNew3.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV Tadika
        // rowNew3.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV Tadika
        // rowNew3.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru Tadika
        // rowNew3.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru Tadika
        // rowNew3.getCell(24).value = results.cabutan; //Bilangan Cabutan Tadika 
        // rowNew3.getCell(25).value = results.abses; //Bilangan Abses Tadika
        // rowNew3.getCell(26).value = results.pulpotomi; //Pulpotomi Tadika 
        // rowNew3.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler Tadika
        // rowNew3.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa Tadika
        // rowNew3.getCell(29).value = results.toddlerLMG; //LMG Toddler Tadika
        // rowNew3.getCell(33).value = results.lowCRA; //CRA Rendah Tadika
        // rowNew3.getCell(34).value = results.moderateCRA; //CRA Sederhana Tadika
        // rowNew3.getCell(35).value = results.highCRA; //CRA Tinggi Tadika
        // await rowNew3.commit();
        // //Toddler Reten (Tadika)       
        // let rowNew4 = worksheet.getRow(22);
        // rowNew4.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV Tadika
        // rowNew4.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan Tadika 
        // rowNew4.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan Tadika
        // await rowNew4.commit();

        // // Execute batch five KKIA
        // let rowNew5 = worksheet.getRow(23);
        // rowNew5.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru KKIA 
        // rowNew5.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan KKIA 
        // rowNew5.getCell(5).value = results.dStatusDMFX; //d Status dmfx KKIA
        // rowNew5.getCell(6).value = results.mStatusDMFX; //m Status dmfx KKIA
        // rowNew5.getCell(7).value = results.dStatusDMFX; //f Status dmfx KKIA
        // rowNew5.getCell(8).value = results.xStatusDMFX; //x Status dmfx KKIA
        // rowNew5.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 KKIA 	
        // rowNew5.getCell(12).value = results.skorPlakA; //Skor Plak A KKIA
        // rowNew5.getCell(13).value = results.skorPlakC; //Skor Plak C KKIA
        // rowNew5.getCell(14).value = results.skorPlakE; //Skor Plak E KKIA
        // rowNew5.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) KKIA
        // rowNew5.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut KKIA
        // rowNew5.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras KKIA
        // rowNew5.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV KKIA
        // rowNew5.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV KKIA
        // rowNew5.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru KKIA
        // rowNew5.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru KKIA
        // rowNew5.getCell(24).value = results.cabutan; //Bilangan Cabutan KKIA 
        // rowNew5.getCell(25).value = results.abses; //Bilangan Abses KKIA
        // rowNew5.getCell(26).value = results.pulpotomi; //Pulpotomi KKIA 
        // rowNew5.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler KKIA
        // rowNew5.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa KKIA
        // rowNew5.getCell(29).value = results.toddlerLMG; //LMG Toddler KKIA
        // rowNew5.getCell(33).value = results.lowCRA; //CRA Rendah KKIA
        // rowNew5.getCell(34).value = results.moderateCRA; //CRA Sederhana KKIA
        // rowNew5.getCell(35).value = results.highCRA; //CRA Tinggi KKIA
        // await rowNew5.commit();

        // let rowNew6 = worksheet.getRow(24);
        // rowNew6.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV KKIA
        // rowNew6.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan KKIA 
        // rowNew6.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan KKIA
        // await rowNew6.commit();

        // // PESAKIT LUAR
        // let rowNew7 = worksheet.getRow(25);
        // rowNew7.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru PESAKIT LUAR 
        // rowNew7.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan PESAKIT LUAR 
        // rowNew7.getCell(5).value = results.dStatusDMFX; //d Status dmfx PESAKIT LUAR
        // rowNew7.getCell(6).value = results.mStatusDMFX; //m Status dmfx PESAKIT LUAR
        // rowNew7.getCell(7).value = results.dStatusDMFX; //f Status dmfx PESAKIT LUAR
        // rowNew7.getCell(8).value = results.xStatusDMFX; //x Status dmfx PESAKIT LUAR
        // rowNew7.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 PESAKIT LUAR 	
        // rowNew7.getCell(12).value = results.skorPlakA; //Skor Plak A PESAKIT LUAR
        // rowNew7.getCell(13).value = results.skorPlakC; //Skor Plak C PESAKIT LUAR
        // rowNew7.getCell(14).value = results.skorPlakE; //Skor Plak E PESAKIT LUAR
        // rowNew7.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) PESAKIT LUAR
        // rowNew7.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut PESAKIT LUAR
        // rowNew7.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras PESAKIT LUAR
        // rowNew7.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV PESAKIT LUAR
        // rowNew7.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV PESAKIT LUAR
        // rowNew7.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru PESAKIT LUAR
        // rowNew7.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru PESAKIT LUAR
        // rowNew7.getCell(24).value = results.cabutan; //Bilangan Cabutan PESAKIT LUAR 
        // rowNew7.getCell(25).value = results.abses; //Bilangan Abses PESAKIT LUAR
        // rowNew7.getCell(26).value = results.pulpotomi; //Pulpotomi PESAKIT LUAR 
        // rowNew7.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler PESAKIT LUAR
        // rowNew7.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa PESAKIT LUAR
        // rowNew7.getCell(29).value = results.toddlerLMG; //LMG Toddler PESAKIT LUAR
        // rowNew7.getCell(30).value = results.dirujukDariAgensiLuar; //dirujuk daripada Agensi Luar 
        // rowNew7.getCell(33).value = results.lowCRA; //CRA Rendah PESAKIT LUAR
        // rowNew7.getCell(34).value = results.moderateCRA; //CRA Sederhana PESAKIT LUAR
        // rowNew7.getCell(35).value = results.highCRA; //CRA Tinggi PESAKIT LUAR
        // await rowNew7.commit();

        // let rowNew8 = worksheet.getRow(26);
        // rowNew8.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV PESAKIT LUAR
        // rowNew8.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan PESAKIT LUAR
        // await rowNew8.commit();

        // // LAIN LAIN
        // let rowNew9 = worksheet.getRow(27);
        // rowNew9.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru LAIN-LAIN 
        // rowNew9.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan LAIN-LAIN 
        // rowNew9.getCell(5).value = results.dStatusDMFX; //d Status dmfx LAIN-LAIN
        // rowNew9.getCell(6).value = results.mStatusDMFX; //m Status dmfx LAIN-LAIN
        // rowNew9.getCell(7).value = results.dStatusDMFX; //f Status dmfx LAIN-LAIN
        // rowNew9.getCell(8).value = results.xStatusDMFX; //x Status dmfx LAIN-LAIN
        // rowNew9.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 LAIN-LAIN 	
        // rowNew9.getCell(12).value = results.skorPlakA; //Skor Plak A LAIN-LAIN
        // rowNew9.getCell(13).value = results.skorPlakC; //Skor Plak C LAIN-LAIN
        // rowNew9.getCell(14).value = results.skorPlakE; //Skor Plak E LAIN-LAIN
        // rowNew9.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) LAIN-LAIN
        // rowNew9.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut LAIN-LAIN
        // rowNew9.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras LAIN-LAIN
        // rowNew9.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV LAIN-LAIN
        // rowNew9.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV LAIN-LAIN
        // rowNew9.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru LAIN-LAIN
        // rowNew9.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru LAIN-LAIN
        // rowNew9.getCell(24).value = results.cabutan; //Bilangan Cabutan LAIN-LAIN 
        // rowNew9.getCell(25).value = results.abses; //Bilangan Abses LAIN-LAIN
        // rowNew9.getCell(26).value = results.pulpotomi; //Pulpotomi LAIN-LAIN 
        // rowNew9.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler LAIN-LAIN
        // rowNew9.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa LAIN-LAIN
        // rowNew9.getCell(29).value = results.toddlerLMG; //LMG Toddler LAIN-LAIN
        // rowNew9.getCell(33).value = results.lowCRA; //CRA Rendah LAIN-LAIN
        // rowNew9.getCell(34).value = results.moderateCRA; //CRA Sederhana LAIN-LAIN
        // rowNew9.getCell(35).value = results.highCRA; //CRA Tinggi LAIN-LAIN
        // await rowNew9.commit();

        // let rowNew10 = worksheet.getRow(28);
        // rowNew10.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV LAIN-LAIN
        // rowNew10.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan LAIN-LAIN 
        // rowNew10.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan LAIN-LAIN
        // await rowNew10.commit();

        // // AGENSI LUAR
        // let rowNew11 = worksheet.getRow(31);
        // rowNew11.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru AGENSI LUAR 
        // rowNew11.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan AGENSI LUAR 
        // rowNew11.getCell(5).value = results.dStatusDMFX; //d Status dmfx AGENSI LUAR
        // rowNew11.getCell(6).value = results.mStatusDMFX; //m Status dmfx AGENSI LUAR
        // rowNew11.getCell(7).value = results.dStatusDMFX; //f Status dmfx AGENSI LUAR
        // rowNew11.getCell(8).value = results.xStatusDMFX; //x Status dmfx AGENSI LUAR
        // rowNew11.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 AGENSI LUAR 	
        // rowNew11.getCell(12).value = results.skorPlakA; //Skor Plak A AGENSI LUAR
        // rowNew11.getCell(13).value = results.skorPlakC; //Skor Plak C AGENSI LUAR
        // rowNew11.getCell(14).value = results.skorPlakE; //Skor Plak E AGENSI LUAR
        // rowNew11.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) AGENSI LUAR
        // rowNew11.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV AGENSI LUAR
        // rowNew11.getCell(25).value = results.abses; //Bilangan Abses AGENSI LUAR
        // rowNew11.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler AGENSI LUAR
        // rowNew11.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa AGENSI LUAR
        // rowNew11.getCell(29).value = results.toddlerLMG; //LMG Toddler AGENSI LUAR
        // rowNew11.getCell(31).value = results.toddlerDirujukPadaLawatan; //Toddler dirujuk pada Lawatan AGENSI Luar
        // rowNew11.getCell(32).value = results.toddlerHadirRujukan; //Toddler hadir rujukan AGENSI LUAR
        // rowNew11.getCell(33).value = results.lowCRA; //CRA Rendah AGENSI LUAR
        // rowNew11.getCell(34).value = results.moderateCRA; //CRA Sederhana AGENSI LUAR
        // rowNew11.getCell(35).value = results.highCRA; //CRA Tinggi AGENSI LUAR
        // await rowNew11.commit();

        // let rowNew12 = worksheet.getRow(32);
        // rowNew12.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV AGENSI LUAR
        // rowNew12.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan AGENSI LUAR 
        // rowNew12.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan AGENSI LUAR
        // await rowNew12.commit();
        
        let rowNew13 = worksheet.getRow(53);
        rowNew13.getCell(10).value = 'Report Generated by Gi-Ret 2.0';
        rowNew13.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-TOD.xlsx");
        await workbook.xlsx.writeFile(newfile);
        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPGPS2201 = function(req, res) {
  async.parallel({
      pesakitBaru: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      kedatanganUlangan: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      dStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      mStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      fStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      xStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      dmfxEqualToZero: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
      skorPlakA: function(callback) {
        Tadika.countDocuments({ kebersihanMulutA: "1", kedatanganBaru: 1 }, callback);
      },
      skorPlakC: function(callback) {
        Tadika.countDocuments({ kebersihanMulutC: "1", kedatanganBaru: 1 }, callback);
      },
      skorPlakE: function(callback) {
        Tadika.countDocuments({ kebersihanMulutE: "1", kedatanganBaru: 1 }, callback);
      },
      traumaTisuLembut: function(callback) {
        Tadika.countDocuments({ traumaTisuLembut: { $gte: 1 } }, callback);
      },
      traumaTisuKeras: function(callback) {
        Tadika.countDocuments({ traumaTisuKeras: { $gte: 1 } }, callback);
      },
      bilTODperluFV: function(callback) {
        Tadika.countDocuments({ perluFvMuridB: "1", kedatanganBaru: 1 }, callback);
      },
      bilTodBaruDibuatFV: function(callback) {
        Tadika.countDocuments({ telahFVMuridB: "1" }, callback);
      },
      tampalanAnteriorB: function(callback) {
        Tadika.countDocuments({ telahTampalanAntGdB: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tampalanAnteriorS: function(callback) {
        Tadika.countDocuments({ telahTampalanAntGdS: { $gte: 1 }, kedatanganUlangan: 1 }, callback);
      },
      tampalanPosteriorB: function(callback) {
        Tadika.countDocuments({ telahTampalanPosGdB: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tampalanPosteriorS: function(callback) {
        Tadika.countDocuments({ telahTampalanPosGdS: { $gte: 1 }, kedatanganUlangan: 1 }, callback);
      },
      cabutan: function(callback) {
        // Tadika.aggregate([
        //   { $match: { $and: [{ telahCabut: "1" }, { telahFVMuridB: "1" }] } },
        //   { $group: { _id: null, count: { $sum: 1 } } }
        // ], callback);
        Tadika.countDocuments({ cabutanGd: { $gte: 1 } }, callback);
      },
      abses: function(callback) {
        Tadika.countDocuments({ abses: "1" }, callback);
      },
      pulpotomi: function(callback) {
        Tadika.countDocuments({ pulpotomi: "1" }, callback);
      },
      ceramahUtkToddler: function(callback) {
        Tadika.countDocuments({ ceramahToddler: "1" }, callback);
      },
      ceramahUtkDewasa: function(callback) {
        Tadika.countDocuments({ ceramahPenjaga: "1" }, callback);
      },
      toddlerLMG: function(callback) {
        Tadika.countDocuments({ toddlerLMG: "1" }, callback);
      },
      dirujukDariAgensiLuar: function(callback) {
        Tadika.countDocuments({ rujuk: "1" }, callback);
      },
      toddlerDirujukPadaLawatan: function(callback) {
        Tadika.countDocuments({ toddlerDirujukPadaLawatan: "1" }, callback);
      },
      toddlerHadirRujukan: function(callback) {
        Tadika.countDocuments({ toddlerHadirRujukan: "1" }, callback);
      },
      lowCRA: function(callback) {
        Tadika.countDocuments({ craRendah: "1", kedatanganBaru: "1" }, callback);
      },
      moderateCRA: function(callback) {
        Tadika.countDocuments({ craSederhana: "1", kedatanganBaru: "1" }, callback);
      },
      highCRA: function(callback) {
        Tadika.countDocuments({ craTinggi: "1", kedatanganBaru: "1" }, callback);
      },
      pbToddler: function(callback) {
        Tadika.countDocuments({ pbToddler: "1" }, callback);
      },
      pbDstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbDstatusDMFX: "1" }, callback);
      },
      pbMstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbMstatusDMFX: "1" }, callback);
      },
      pbFstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbFstatusDMFX: "1" }, callback);
      },
      pbXstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbXstatusDMFX: "1" }, callback);
      },
      pbDMFXequalToZero: function(callback) {
        Tadika.countDocuments({ pbDMFXequalToZero: "1" }, callback);
      },
      agensiATM: function(callback) {
        Tadika.countDocuments({ agensiATM: "1" }, callback);
      },
      agensiIPTA: function(callback) {
        Tadika.countDocuments({ agensiIPTA: "1" }, callback);
      },
      agensiIPTS: function(callback) {
        Tadika.countDocuments({ agensiIPTS: "1" }, callback);
      },
      agensiPrivateDentalClinic: function(callback) {
        Tadika.countDocuments({ agensiPrivateDentalClinic: "1" }, callback);
      },
      agensiNGO: function(callback) {
        Tadika.countDocuments({ agensiNGO: "1" }, callback);
      },
      agensiIndustri: function(callback) {
        Tadika.countDocuments({ agensiIndustri: "1" }, callback);
      },
  }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PGPS2201.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGPS2201');

        /// 5 tahun
        let rowNew = worksheet.getRow(18);
        rowNew.getCell(2).value =   results.enggan; //B18      5 tahun"
        rowNew.getCell(3).value =   results.kedatanganTidakHadir; //C18      5 tahun
        rowNew.getCell(4).value =   results.enrolmen; //D18      5 tahun
        rowNew.getCell(5).value =   results.kedatanganBaru; //E18      5 tahun
        rowNew.getCell(6).value =   results.kedatanganUlangan; //F18      5 tahun
        rowNew.getCell(8).value =   results.kebersihanMulutA; //H18      5 tahun
        rowNew.getCell(9).value =   results.statusGigidesidusD; //I18      5 tahun
        rowNew.getCell(10).value =   results.statusGigidesidusF; //J18      5 tahun
        rowNew.getCell(11).value =   results.statusGigidesidusX; //K18      5 tahun
        rowNew.getCell(12).value =   results.statusGigidesidusJumlahdfx; //L18      5 tahun
        rowNew.getCell(13).value =   results.statusGigiKekalD; //M18      5 tahun
        rowNew.getCell(14).value =   results.statusGigiKekalM; //N18      5 tahun
        rowNew.getCell(15).value =   results.statusGigiKekalF; //O18      5 tahun
        rowNew.getCell(16).value =   results.statusGigiKekalX; //P18      5 tahun
        rowNew.getCell(17).value =   results.statusGigiKekalJumlahDMFX; //Q18      5 tahun
        rowNew.getCell(18).value =   results.gigiKekalDMFXsamaAtauKurangDari3; //R18      5 tahun
        rowNew.getCell(19).value =   results.totalStatusGigiKekalSamaKosong; //S18      5 tahun
        rowNew.getCell(20).value =   results.MBK; //T18      5 tahun
        rowNew.getCell(21).value =   results.statusBebasKaries; //U18      5 tahun
        rowNew.getCell(22).value =   results.statusGigiDesidusdfx0; //V18      5 tahun
        rowNew.getCell(23).value =   results.mulutBebasGingivitis; //W18      5 tahun
        rowNew.getCell(24).value =   results.tprSMKP; //X18      5 tahun
        rowNew.getCell(25).value =   results.traumaKecederaanGigiAnterior; //Y18      5 tahun
        rowNew.getCell(26).value =   results.cleftAda; //Z18      5 tahun
        rowNew.getCell(27).value =   results.cleftRujuk; //AA18      5 tahun
        rowNew.getCell(29).value =   results.perluFSMuridB; //AC18      5 tahun
        rowNew.getCell(30).value =   results.perluFSGigiB; //AD18      5 tahun
        rowNew.getCell(31).value =   results.perluFvMuridB; //AE18      5 tahun
        rowNew.getCell(32).value =   results.perluFvGigiB; //AF18      5 tahun
        rowNew.getCell(33).value =   results.perluPRR1MuridB; //AG18      5 tahun
        rowNew.getCell(34).value =   results.perluPRR1BGigiB; //AH18      5 tahun
        rowNew.getCell(35).value =   results.perluTampalanAntGdB; //AI18      5 tahun
        rowNew.getCell(36).value =   results.perluTampalanAntGkB; //AJ18      5 tahun
        rowNew.getCell(37).value =   results.perluTampalanPosGdB; //AK18      5 tahun
        rowNew.getCell(38).value =   results.perluTampalanPosGkB; //AL18      5 tahun
        rowNew.getCell(39).value =   results.perluTampalanAmgGdB; //AM18      5 tahun
        rowNew.getCell(40).value =   results.perluTampalanAmgGkB; //AN18      5 tahun
        rowNew.getCell(42).value =   results.telahFSMuridB; //AP18      5 tahun
        rowNew.getCell(43).value =   results.telahFSGigiB; //AQ18      5 tahun
        rowNew.getCell(44).value =   results.telahFVMuridB; //AR18      5 tahun
        rowNew.getCell(45).value =   results.telahFVGigiB; //AS18      5 tahun
        rowNew.getCell(46).value =   results.perluPRR1MuridS; //AT18      5 tahun
        rowNew.getCell(47).value =   results.telahPRR1GigiB; //AU18      5 tahun
        rowNew.getCell(48).value =   results.telahTampalanAntGdB; //AV18      5 tahun
        rowNew.getCell(49).value =   results.telahTampalanAntGkB; //AW18      5 tahun
        rowNew.getCell(50).value =   results.telahTampalanPosGdB; //AX18      5 tahun
        rowNew.getCell(51).value =   results.telahTampalanPosGkB; //AY18      5 tahun
        rowNew.getCell(52).value =   results.telahTampalanAmgGdB; //AZ18      5 tahun
        rowNew.getCell(53).value =   results.telahTampalanAmgGkB; //BA18      5 tahun
        rowNew.getCell(54).value =   results.jumlahTampalanB; //BB18      5 tahun
        rowNew.getCell(55).value =   results.cabutanGd; //BC18      5 tahun
        rowNew.getCell(56).value =   results.cabutanGk; //BD18      5 tahun
        rowNew.getCell(57).value =   results.penskaleran; //BE18      5 tahun
        rowNew.getCell(58).value =   results.kesSelesai; //BF18      5 tahun
        rowNew.commit();

        let rowNew2 = worksheet.getRow(19);
        rowNew2.getCell(8).value =   results.kebersihanMulutC; //H19      5 tahun
        rowNew2.commit();

        let rowNew3 = worksheet.getRow(20);
        rowNew3.getCell(8).value =   results.kebersihanMulutE; //H20      5 tahun
        rowNew3.getCell(30).value =   results.perluFSGigiS; //AD20      5 tahun
        rowNew3.getCell(32).value =   results.perluFvGigiS; //AF20      5 tahun
        rowNew3.getCell(34).value =   results.perluPRR1BGigiS; //AH20      5 tahun
        rowNew3.getCell(35).value =   results.perluTampalanAntGdS; //AI20      5 tahun
        rowNew3.getCell(36).value =   results.perluTampalanAntGkS; //AJ20      5 tahun
        rowNew3.getCell(37).value =   results.perluTampalanPosGdS; //AK20      5 tahun
        rowNew3.getCell(38).value =   results.perluTampalanPosGkS; //AL20      5 tahun
        rowNew3.getCell(39).value =   results.perluTampalanAmgGdS; //AM20      5 tahun
        rowNew3.getCell(40).value =   results.perluTampalanAmgGkS; //AN20      5 tahun
        rowNew3.getCell(43).value =   results.telahFSGigiS; //AQ20      5 tahun
        rowNew3.getCell(45).value =   results.telahFVGigiS; //AS20      5 tahun
        rowNew3.getCell(47).value =   results.telahPRR1GigiS; //AU20      5 tahun
        rowNew3.getCell(48).value =   results.telahTampalanAntGdS; //AV20      5 tahun
        rowNew3.getCell(49).value =   results.telahTampalanAntGkS; //AW20      5 tahun
        rowNew3.getCell(50).value =   results.telahTampalanPosGdS; //AX20      5 tahun
        rowNew3.getCell(51).value =   results.telahTampalanPosGkS; //AY20      5 tahun
        rowNew3.getCell(52).value =   results.telahTampalanAmgGdS; //AZ20      5 tahun
        rowNew3.getCell(53).value =   results.telahTampalanAmgGkS; //BA20      5 tahun
        rowNew3.getCell(54).value =   results.jumlahTampalanS; //BB20      5 tahun
        rowNew3.commit();

        //// 6 tahun
        let rowNew4 = worksheet.getRow(21);
        rowNew4.getCell(2).value =   results.Enggan; //B21      6 tahun"
        rowNew4.getCell(3).value =   results.Tidakhadir; //C21      6 tahun
        rowNew4.getCell(4).value =   results.enrolmen; //D21      6 tahun
        rowNew4.getCell(5).value =   results.Baru; //E21      6 tahun
        rowNew4.getCell(6).value =   results.Ulangan; //F21      6 tahun
        rowNew4.getCell(8).value =   results.kebersihanMulutA; //H21      6 tahun
        rowNew4.getCell(9).value =   results.statusGigidesidusD; //I21      6 tahun
        rowNew4.getCell(10).value =   results.statusGigidesidusF; //J21      6 tahun
        rowNew4.getCell(11).value =   results.statusGigidesidusX; //K21      6 tahun
        rowNew4.getCell(12).value =   results.statusGigidesidusJumlahdfx; //L21      6 tahun
        rowNew4.getCell(13).value =   results.statusGigiKekalD; //M21      6 tahun
        rowNew4.getCell(14).value =   results.statusGigiKekalM; //N21      6 tahun
        rowNew4.getCell(15).value =   results.statusGigiKekalF; //O21      6 tahun
        rowNew4.getCell(16).value =   results.statusGigiKekalX; //P21      6 tahun
        rowNew4.getCell(17).value =   results.statusGigiKekalJumlahDMFX; //Q21      6 tahun
        rowNew4.getCell(18).value =   results.gigiKekalDMFXsamaAtauKurangDari3; //R21      6 tahun
        rowNew4.getCell(19).value =   results.totalStatusGigiKekalSamaKosong; //S21      6 tahun
        rowNew4.getCell(20).value =   results.MBK; //T21      6 tahun
        rowNew4.getCell(21).value =   results.statusBebasKaries; //U21      6 tahun
        rowNew4.getCell(22).value =   results.statusGigiDesidusdfx0; //V21      6 tahun
        rowNew4.getCell(23).value =   results.mulutBebasGingivitis; //W21      6 tahun
        rowNew4.getCell(24).value =   results.tprSMKP; //X21      6 tahun
        rowNew4.getCell(25).value =   results.traumaKecederaanGigiAnterior; //Y21      6 tahun
        rowNew4.getCell(26).value =   results.cleftAda; //Z21      6 tahun
        rowNew4.getCell(27).value =   results.cleftRujuk; //AA21      6 tahun
        rowNew4.getCell(29).value =   results.perluFSMuridB; //AC21      6 tahun
        rowNew4.getCell(30).value =   results.perluFSGigiB; //AD21      6 tahun
        rowNew4.getCell(31).value =   results.perluFvMuridB; //AE21      6 tahun
        rowNew4.getCell(33).value =   results.perluPRR1MuridB; //AG21      6 tahun
        rowNew4.getCell(35).value =   results.perluTampalanAntGdB; //AI21      6 tahun
        rowNew4.getCell(36).value =   results.perluTampalanAntGkB; //AJ21      6 tahun
        rowNew4.getCell(37).value =   results.perluTampalanPosGdB; //AK21      6 tahun
        rowNew4.getCell(38).value =   results.perluTampalanPosGkB; //AL21      6 tahun
        rowNew4.getCell(39).value =   results.perluTampalanAmgGdB; //AM21      6 tahun
        rowNew4.getCell(40).value =   results.perluTampalanAmgGkB; //AN21      6 tahun
        rowNew4.getCell(42).value =   results.telahFSMuridB; //AP21      6 tahun
        rowNew4.getCell(43).value =   results.telahFSGigiB; //AQ21      6 tahun
        rowNew4.getCell(44).value =   results.telahFVMuridB; //AR21      6 tahun
        rowNew4.getCell(45).value =   results.telahFVGigiB; //AS21      6 tahun
        rowNew4.getCell(46).value =   results.perluPRR1MuridS; //AT21      6 tahun
        rowNew4.getCell(48).value =   results.telahTampalanAntGdB; //AV21      6 tahun
        rowNew4.getCell(49).value =   results.telahTampalanAntGkB; //AW21      6 tahun
        rowNew4.getCell(50).value =   results.telahTampalanPosGdB; //AX21      6 tahun
        rowNew4.getCell(51).value =   results.telahTampalanPosGkB; //AY21      6 tahun
        rowNew4.getCell(52).value =   results.telahTampalanAmgGdB; //AZ21      6 tahun
        rowNew4.getCell(53).value =   results.telahTampalanAmgGkB; //BA21      6 tahun
        rowNew4.getCell(54).value =   results.jumlahTampalanB; //BB21      6 tahun
        rowNew4.getCell(55).value =   results.cabutanGd; //BC21      6 tahun
        rowNew4.getCell(56).value =   results.cabutanGk; //BD21      6 tahun
        rowNew4.getCell(57).value =   results.penskaleran; //BE21      6 tahun
        rowNew4.getCell(58).value =   results.kesSelesai; //BF21      6 tahun
        rowNew4.commit();
        
        let rowNew5 = worksheet.getRow(22);
        rowNew5.getCell(8).value =   results.kebersihanMulutC; //H22      6 tahun
        rowNew5.commit();

        let rowNew6 = worksheet.getRow(23);
        rowNew6.getCell(8).value =   results.kebersihanMulutE; //H23      6 tahun
        rowNew6.getCell(30).value =   results.perluFSGigiS; //AD23      6 tahun
        rowNew6.getCell(32).value =   results.perluFvGigiB; //AF23      6 tahun
        rowNew6.getCell(32).value =   results.perluFvGigiS; //AF23      6 tahun
        rowNew6.getCell(34).value =   results.perluPRR1BGigiB; //AH23      6 tahun
        rowNew6.getCell(34).value =   results.perluPRR1BGigiS; //AH23      6 tahun
        rowNew6.getCell(35).value =   results.perluTampalanAntGdS; //AI23      6 tahun
        rowNew6.getCell(36).value =   results.perluTampalanAntGkS; //AJ23      6 tahun
        rowNew6.getCell(37).value =   results.perluTampalanPosGdS; //AK23      6 tahun
        rowNew6.getCell(38).value =   results.perluTampalanPosGkS; //AL23      6 tahun
        rowNew6.getCell(39).value =   results.perluTampalanAmgGdS; //AM23      6 tahun
        rowNew6.getCell(40).value =   results.perluTampalanAmgGkS; //AN23      6 tahun
        rowNew6.getCell(43).value =   results.telahFSGigiS; //AQ23      6 tahun
        rowNew6.getCell(45).value =   results.telahFVGigiS; //AS23      6 tahun
        rowNew6.getCell(47).value =   results.telahPRR1GigiB; //AU23      6 tahun
        rowNew6.getCell(47).value =   results.telahPRR1GigiS; //AU23      6 tahun
        rowNew6.getCell(48).value =   results.telahTampalanAntGdS; //AV23      6 tahun
        rowNew6.getCell(49).value =   results.telahTampalanAntGkS; //AW23      6 tahun
        rowNew6.getCell(50).value =   results.telahTampalanPosGdS; //AX23      6 tahun
        rowNew6.getCell(51).value =   results.telahTampalanPosGkS; //AY23      6 tahun
        rowNew6.getCell(52).value =   results.telahTampalanAmgGdS; //AZ23      6 tahun
        rowNew6.getCell(53).value =   results.telahTampalanAmgGkS; //BA23      6 tahun
        rowNew6.getCell(54).value =   results.jumlahTampalanS; //BB23      6 
        rowNew6.commit();

        let rowNew7 = worksheet.getRow(23);
        rowNew7.getCell(8).value =   results.kebersihanMulutE; //H23      6 tahun
        rowNew7.getCell(30).value =   results.perluFSGigiS; //AD23      6 tahun
        rowNew7.getCell(32).value =   results.perluFvGigiB; //AF23      6 tahun
        rowNew7.getCell(32).value =   results.perluFvGigiS; //AF23      6 tahun
        rowNew7.getCell(34).value =   results.perluPRR1BGigiB; //AH23      6 tahun
        rowNew7.getCell(34).value =   results.perluPRR1BGigiS; //AH23      6 tahun
        rowNew7.getCell(35).value =   results.perluTampalanAntGdS; //AI23      6 tahun
        rowNew7.getCell(36).value =   results.perluTampalanAntGkS; //AJ23      6 tahun
        rowNew7.getCell(37).value =   results.perluTampalanPosGdS; //AK23      6 tahun
        rowNew7.getCell(38).value =   results.perluTampalanPosGkS; //AL23      6 tahun
        rowNew7.getCell(39).value =   results.perluTampalanAmgGdS; //AM23      6 tahun
        rowNew7.getCell(40).value =   results.perluTampalanAmgGkS; //AN23      6 tahun
        rowNew7.getCell(43).value =   results.telahFSGigiS; //AQ23      6 tahun
        rowNew7.getCell(45).value =   results.telahFVGigiS; //AS23      6 tahun
        rowNew7.getCell(47).value =   results.telahPRR1GigiB; //AU23      6 tahun
        rowNew7.getCell(47).value =   results.telahPRR1GigiS; //AU23      6 tahun
        rowNew7.getCell(48).value =   results.telahTampalanAntGdS; //AV23      6 tahun
        rowNew7.getCell(49).value =   results.telahTampalanAntGkS; //AW23      6 tahun
        rowNew7.getCell(50).value =   results.telahTampalanPosGdS; //AX23      6 tahun
        rowNew7.getCell(51).value =   results.telahTampalanPosGkS; //AY23      6 tahun
        rowNew7.getCell(52).value =   results.telahTampalanAmgGdS; //AZ23      6 tahun
        rowNew7.getCell(53).value =   results.telahTampalanAmgGkS; //BA23      6 tahun
        rowNew7.getCell(54).value =   results.jumlahTampalanS; //BB23      6 tahun        // // Execute batch five KKIA
        rowNew7.commit();

        let rowNew8 = worksheet.getRow(31);
        rowNew8.getCell(5).value =   results.bilCeramah; //E31      bilCeramah
        rowNew8.getCell(8).value =   results.bilCeramahpeserta; //H31      bilCeramahPeserta
        rowNew8.commit();

        let rowNew9 = worksheet.getRow(32);
        rowNew9.getCell(5).value =   results.bilRoleplay; //E32      bilRoleplay
        rowNew9.getCell(8).value =   results.bilRoleplaypeserta; //H32      bilRoleplayPeserta
        rowNew9.getCell(58).value =   results.peratusMuridDiliputi; //BC32      peratusMuridDiliputi
        rowNew9.commit();
        
        let rowNew10 = worksheet.getRow(33);
        rowNew10.getCell(5).value =   results.bilLmg; //E33      bilLmg
        rowNew10.getCell(8).value =   results.bilLmgpeserta; //H33      bilLmgPeserta
        rowNew10.commit();

        let rowNew11 = worksheet.getRow(29);
        rowNew11.getCell(58).value =   results.peratusKesSelesai; //BC29      peratusKesSelesai'
        rowNew11.commit();

        let rowNew12 = worksheet.getRow(9);
        rowNew12.getCell(16).value =   results.namaTadika; //F9      
        rowNew12.getCell(8).value =   results.bilhariprojek; //AA9      bil hari projek
        rowNew12.getCell(58).value =   results.tarikhSelesaiRawatan; //AV9      tarikhSelesaiRawatan
        rowNew12.commit();

        let rowNew13 = worksheet.getRow(8);
        rowNew13.getCell(16).value =   results.klinikPergigian; //F8      
        rowNew13.getCell(58).value =   results.tarikhMulaRawatan; //AV8      tarikhMulaRawatan
        rowNew13.commit();

        let rowNew14 = worksheet.getRow(6);
        rowNew14.getCell(1).value =   results.tahun; //A6      tahun
        rowNew14.commit();
        
        let rowNew15 = worksheet.getRow(53);
        rowNew15.getCell(10).value = 'Report Generated by Gi-Ret 2.0';
        rowNew15.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-PGPS2201.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPGPS2202 = function(req, res) {
  async.parallel({
      pesakitBaru: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      kedatanganUlangan: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      dStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      mStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      fStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      xStatusDMFX: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      dmfxEqualToZero: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
      skorPlakA: function(callback) {
        Tadika.countDocuments({ kebersihanMulutA: "1", kedatanganBaru: 1 }, callback);
      },
      skorPlakC: function(callback) {
        Tadika.countDocuments({ kebersihanMulutC: "1", kedatanganBaru: 1 }, callback);
      },
      skorPlakE: function(callback) {
        Tadika.countDocuments({ kebersihanMulutE: "1", kedatanganBaru: 1 }, callback);
      },
      traumaTisuLembut: function(callback) {
        Tadika.countDocuments({ traumaTisuLembut: { $gte: 1 } }, callback);
      },
      traumaTisuKeras: function(callback) {
        Tadika.countDocuments({ traumaTisuKeras: { $gte: 1 } }, callback);
      },
      bilTODperluFV: function(callback) {
        Tadika.countDocuments({ perluFvMuridB: "1", kedatanganBaru: 1 }, callback);
      },
      bilTodBaruDibuatFV: function(callback) {
        Tadika.countDocuments({ telahFVMuridB: "1" }, callback);
      },
      tampalanAnteriorB: function(callback) {
        Tadika.countDocuments({ telahTampalanAntGdB: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tampalanAnteriorS: function(callback) {
        Tadika.countDocuments({ telahTampalanAntGdS: { $gte: 1 }, kedatanganUlangan: 1 }, callback);
      },
      tampalanPosteriorB: function(callback) {
        Tadika.countDocuments({ telahTampalanPosGdB: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tampalanPosteriorS: function(callback) {
        Tadika.countDocuments({ telahTampalanPosGdS: { $gte: 1 }, kedatanganUlangan: 1 }, callback);
      },
      cabutan: function(callback) {
        // Tadika.aggregate([
        //   { $match: { $and: [{ telahCabut: "1" }, { telahFVMuridB: "1" }] } },
        //   { $group: { _id: null, count: { $sum: 1 } } }
        // ], callback);
        Tadika.countDocuments({ cabutanGd: { $gte: 1 } }, callback);
      },
      abses: function(callback) {
        Tadika.countDocuments({ abses: "1" }, callback);
      },
      pulpotomi: function(callback) {
        Tadika.countDocuments({ pulpotomi: "1" }, callback);
      },
      ceramahUtkToddler: function(callback) {
        Tadika.countDocuments({ ceramahToddler: "1" }, callback);
      },
      ceramahUtkDewasa: function(callback) {
        Tadika.countDocuments({ ceramahPenjaga: "1" }, callback);
      },
      toddlerLMG: function(callback) {
        Tadika.countDocuments({ toddlerLMG: "1" }, callback);
      },
      dirujukDariAgensiLuar: function(callback) {
        Tadika.countDocuments({ rujuk: "1" }, callback);
      },
      toddlerDirujukPadaLawatan: function(callback) {
        Tadika.countDocuments({ toddlerDirujukPadaLawatan: "1" }, callback);
      },
      toddlerHadirRujukan: function(callback) {
        Tadika.countDocuments({ toddlerHadirRujukan: "1" }, callback);
      },
      lowCRA: function(callback) {
        Tadika.countDocuments({ craRendah: "1", kedatanganBaru: "1" }, callback);
      },
      moderateCRA: function(callback) {
        Tadika.countDocuments({ craSederhana: "1", kedatanganBaru: "1" }, callback);
      },
      highCRA: function(callback) {
        Tadika.countDocuments({ craTinggi: "1", kedatanganBaru: "1" }, callback);
      },
      pbToddler: function(callback) {
        Tadika.countDocuments({ pbToddler: "1" }, callback);
      },
      pbDstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbDstatusDMFX: "1" }, callback);
      },
      pbMstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbMstatusDMFX: "1" }, callback);
      },
      pbFstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbFstatusDMFX: "1" }, callback);
      },
      pbXstatusDMFX: function(callback) {
        Tadika.countDocuments({ pbXstatusDMFX: "1" }, callback);
      },
      pbDMFXequalToZero: function(callback) {
        Tadika.countDocuments({ pbDMFXequalToZero: "1" }, callback);
      },
      agensiATM: function(callback) {
        Tadika.countDocuments({ agensiATM: "1" }, callback);
      },
      agensiIPTA: function(callback) {
        Tadika.countDocuments({ agensiIPTA: "1" }, callback);
      },
      agensiIPTS: function(callback) {
        Tadika.countDocuments({ agensiIPTS: "1" }, callback);
      },
      agensiPrivateDentalClinic: function(callback) {
        Tadika.countDocuments({ agensiPrivateDentalClinic: "1" }, callback);
      },
      agensiNGO: function(callback) {
        Tadika.countDocuments({ agensiNGO: "1" }, callback);
      },
      agensiIndustri: function(callback) {
        Tadika.countDocuments({ agensiIndustri: "1" }, callback);
      },
  }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PGPS2202.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGPS202');

        // 5 tahun kerajaan
        let rowNew = worksheet.getRow(16);
        rowNew.getCell(3).value =   results.kedatanganBaru; //C16      Kedatangan Baru5 tahun kerajaan
        rowNew.getCell(4).value =   results.kedatanganUlangan; //D16      Kedatangan Ulangan5 tahun kerajaan
        rowNew.getCell(5).value =   results.kebersihanMulutA; //E16      Kebersihan Mulut A5 tahun kerajaan
        rowNew.getCell(6).value =   results.kebersihanMulutC; //F16      Kebersihan Mulut C5 tahun kerajaan
        rowNew.getCell(7).value =   results.kebersihanMulutE; //G16      Kebersihan Mulut E5 tahun kerajaan
        rowNew.getCell(8).value =   results.statusGigidesidusD; //H16      Status Gigi Desidus d5 tahun kerajaan
        rowNew.getCell(9).value =   results.statusGigidesidusF; //I16      Status Gigi Desidus f5 tahun kerajaan
        rowNew.getCell(10).value =   results.statusGigidesidusX; //J16      Status Gigi Desidus x5 tahun kerajaan
        rowNew.getCell(11).value =   results.statusGigidesidusJumlahdfx; //K16      Status Gigi Desidus Jumlah dfx5 tahun kerajaan
        rowNew.getCell(12).value =   results.statusGigiKekalD; //L16      Status Gigi Kekal D5 tahun kerajaan
        rowNew.getCell(13).value =   results.statusGigiKekalM; //M16      Status Gigi Kekal M5 tahun kerajaan
        rowNew.getCell(14).value =   results.statusGigiKekalF; //N16      Status Gigi Kekal F5 tahun kerajaan
        rowNew.getCell(15).value =   results.statusGigiKekalX; //O16      Status Gigi Kekal X5 tahun kerajaan
        rowNew.getCell(16).value =   results.statusGigiKekalJumlahDMFX; //P16      Status Gigi Kekal Jumlah DMFX5 tahun kerajaan
        rowNew.getCell(17).value =   results.gigiKekalDMFXsamaAtauKurangDari3; //Q16      Status Gigi Kekal DMFX <= 35 tahun kerajaan
        rowNew.getCell(18).value =   results.totalStatusGigiKekalSamaKosong; //R16      Status Gigi Kekal X+M = 05 tahun kerajaan
        rowNew.getCell(19).value =   results.MBK; //S16      Mulut Bebas Karies (MBK)5 tahun kerajaan
        rowNew.getCell(20).value =   results.statusBebasKaries; //T16      Status Gigi Kekal Bebas Karies (BK) DMFX = 05 tahun kerajaan
        rowNew.getCell(21).value =   results.statusGigiDesidusdfx0; //U16      Status Gigi Desidus dfx = 05 tahun kerajaan
        rowNew.getCell(22).value =   results.mulutBebasGingivitis; //V16      Mulut Bebas Gingivitis (MBG)5 tahun kerajaan
        rowNew.getCell(23).value =   results.tprSMKP; //W16      Tidak Perlu Rawatan (SMKP)5 tahun kerajaan
        rowNew.getCell(25).value =   results.perluFSMuridB; //Y16      5 tahun kerajaan
        rowNew.getCell(26).value =   results.perluFSGigiB; //Z16      5 tahun kerajaan
        rowNew.getCell(27).value =   results.perluFvMuridB; //AA16      5 tahun kerajaan
        rowNew.getCell(28).value =   results.perluFvGigiB; //AB16      5 tahun kerajaan
        rowNew.getCell(29).value =   results.perluPRR1MuridB; //AC16      5 tahun kerajaan
        rowNew.getCell(30).value =   results.perluPRR1BGigiB; //AD16      5 tahun kerajaan
        rowNew.getCell(32).value =   results.perluFSMuridB; //AF16      5 tahun kerajaan
        rowNew.getCell(33).value =   results.perluFSGigiB; //AG16      5 tahun kerajaan
        rowNew.getCell(34).value =   results.perluFvMuridB; //AH16      5 tahun kerajaan
        rowNew.getCell(35).value =   results.perluFvGigiB; //AI16      5 tahun kerajaan
        rowNew.getCell(36).value =   results.perluPRR1MuridB; //AJ16      5 tahun kerajaan
        rowNew.getCell(37).value =   results.perluPRR1BGigiB; //AK16      5 tahun kerajaan
        rowNew.getCell(38).value =   results.telahTampalanAntGdB; //AL16      5 tahun kerajaan
        rowNew.getCell(39).value =   results.telahTampalanAntGkB; //AM16      5 tahun kerajaan
        rowNew.getCell(40).value =   results.telahTampalanPosGdB; //AN16      5 tahun kerajaan
        rowNew.getCell(41).value =   results.telahTampalanPosGkB; //AO16      5 tahun kerajaan
        rowNew.getCell(42).value =   results.telahTampalanAmgGdB; //AP16      5 tahun kerajaan
        rowNew.getCell(43).value =   results.telahTampalanAmgGkB; //AQ16      5 tahun kerajaan
        rowNew.getCell(44).value =   results.jumlahTampalanB; //AR16      5 tahun kerajaan
        rowNew.getCell(45).value =   results.cabutanGd; //AS16      5 tahun kerajaan
        rowNew.getCell(46).value =   results.cabutanGk; //AT16      5 tahun kerajaan
        rowNew.getCell(47).value =   results.jumlahCabutan; //AU16      5 tahun kerajaan
        rowNew.getCell(48).value =   results.penskaleran; //AV16      5 tahun kerajaan
        rowNew.getCell(49).value =   results.kesSelesai; //AW16      5 tahun kerajaan
        rowNew.getCell(50).value =   results.enrolmen; //AX16      5 tahun kerajaan
        rowNew.getCell(51).value =   results.peratusKesDiliputi; //AY16      5 tahun kerajaan
        rowNew.commit();

        let rowNew2 = worksheet.getRow(17);
        rowNew2.getCell(26).value =   results.perluFSGigiS; //Z17      5 tahun kerajaan
        rowNew2.getCell(28).value =   results.perluFvGigiS; //AB17      5 tahun kerajaan
        rowNew2.getCell(30).value =   results.perluPRR1BGigiS; //AD17      5 tahun kerajaan
        rowNew2.getCell(33).value =   results.perluFSGigiS; //AG17      5 tahun kerajaan
        rowNew2.getCell(35).value =   results.perluFvGigiS; //AI17      5 tahun kerajaan
        rowNew2.getCell(37).value =   results.perluPRR1BGigiS; //AK17      5 tahun kerajaan
        rowNew2.getCell(38).value =   results.telahTampalanAntGdS; //AL17      5 tahun kerajaan
        rowNew2.getCell(39).value =   results.telahTampalanAntGkS; //AM17      5 tahun kerajaan
        rowNew2.getCell(40).value =   results.telahTampalanPosGdS; //AN17      5 tahun kerajaan
        rowNew2.getCell(41).value =   results.telahTampalanPosGkS; //AO17      5 tahun kerajaan
        rowNew2.getCell(42).value =   results.telahTampalanAmgGdS; //AP17      5 tahun kerajaan
        rowNew2.getCell(43).value =   results.telahTampalanAmgGkS; //AQ17      5 tahun kerajaan
        rowNew2.getCell(44).value =   results.jumlahTampalanS; //AR17      5 tahun kerajaan
        rowNew2.commit();

        /// 6 tahun kerajaan
        let rowNew3 = worksheet.getRow(18);
        rowNew3.getCell(3).value =   results.kedatanganBaru; //C18      results.kedatangan Baru6 kerajaan
        rowNew3.getCell(4).value =   results.kedatanganUlangan; //D18      results.kedatangan Ulangan6 kerajaan
        rowNew3.getCell(5).value =   results.kebersihanMulutA; //E18      Kebersihan Mulut A6 kerajaan
        rowNew3.getCell(6).value =   results.kebersihanMulutC; //F18      Kebersihan Mulut C6 kerajaan
        rowNew3.getCell(7).value =   results.kebersihanMulutE; //G18      Kebersihan Mulut E6 kerajaan
        rowNew3.getCell(8).value =   results.statusGigidesidusD; //H18      Status Gigi Desidus d6 kerajaan
        rowNew3.getCell(9).value =   results.statusGigidesidusF; //I18      Status Gigi Desidus f6 kerajaan
        rowNew3.getCell(10).value =   results.statusGigidesidusX; //J18      Status Gigi Desidus x6 kerajaan
        rowNew3.getCell(11).value =   results.statusGigidesidusJumlahdfx; //K18      Status Gigi Desidus Jumlah dfx6 kerajaan
        rowNew3.getCell(12).value =   results.statusGigiKekalD; //L18      Status Gigi Kekal D6 kerajaan
        rowNew3.getCell(13).value =   results.statusGigiKekalM; //M18      Status Gigi Kekal M6 kerajaan
        rowNew3.getCell(14).value =   results.statusGigiKekalF; //N18      Status Gigi Kekal F6 kerajaan
        rowNew3.getCell(15).value =   results.statusGigiKekalX; //O18      Status Gigi Kekal X6 kerajaan
        rowNew3.getCell(16).value =   results.statusGigiKekalJumlahDMFX; //P18      Status Gigi Kekal Jumlah DMFX6 kerajaan
        rowNew3.getCell(17).value =   results.gigiKekalDMFXsamaAtauKurangDari3; //Q18      Status Gigi Kekal DMFX <= 36 kerajaan
        rowNew3.getCell(18).value =   results.totalStatusGigiKekalSamaKosong; //R18      Status Gigi Kekal X+M = 06 kerajaan
        rowNew3.getCell(19).value =   results.MBK; //S18      Mulut Bebas Karies (MBK)6 kerajaan
        rowNew3.getCell(20).value =   results.statusBebasKaries; //T18      Status Gigi Kekal Bebas Karies (BK) DMFX = 06 kerajaan
        rowNew3.getCell(21).value =   results.statusGigiDesidusdfx0; //U18      Status Gigi Desidus dfx = 06 kerajaan
        rowNew3.getCell(22).value =   results.mulutBebasGingivitis; //V18      Mulut Bebas Gingivitis (MBG)6 kerajaan
        rowNew3.getCell(23).value =   results.tprSMKP; //W18      Tidak Perlu Rawatan (SMKP)6 kerajaan
        rowNew3.getCell(25).value =   results.perluFSMuridB; //Y18      6 kerajaan
        rowNew3.getCell(26).value =   results.perluFSGigiB; //Z18      6 kerajaan
        rowNew3.getCell(27).value =   results.perluFvMuridB; //AA18      6 kerajaan
        rowNew3.getCell(28).value =   results.perluFvGigiB; //AB18      6 kerajaan
        rowNew3.getCell(29).value =   results.perluPRR1MuridB; //AC18      6 kerajaan
        rowNew3.getCell(30).value =   results.perluPRR1BGigiB; //AD18      6 kerajaan
        rowNew3.getCell(32).value =   results.perluFSMuridB; //AF18      6 kerajaan
        rowNew3.getCell(33).value =   results.perluFSGigiB; //AG18      6 kerajaan
        rowNew3.getCell(34).value =   results.perluFvMuridB; //AH18      6 kerajaan
        rowNew3.getCell(35).value =   results.perluFvGigiB; //AI18      6 kerajaan
        rowNew3.getCell(36).value =   results.perluPRR1MuridB; //AJ18      6 kerajaan
        rowNew3.getCell(37).value =   results.perluPRR1BGigiB; //AK18      6 kerajaan
        rowNew3.getCell(38).value =   results.telahTampalanAntGdB; //AL18      6 kerajaan
        rowNew3.getCell(39).value =   results.telahTampalanAntGkB; //AM18      6 kerajaan
        rowNew3.getCell(40).value =   results.telahTampalanPosGdB; //AN18      6 kerajaan
        rowNew3.getCell(41).value =   results.telahTampalanPosGkB; //AO18      6 kerajaan
        rowNew3.getCell(42).value =   results.telahTampalanAmgGdB; //AP18      6 kerajaan
        rowNew3.getCell(43).value =   results.telahTampalanAmgGkB; //AQ18      6 kerajaan
        rowNew3.getCell(44).value =   results.jumlahTampalanB; //AR18      6 kerajaan
        rowNew3.getCell(45).value =   results.cabutanGd; //AS18      6 kerajaan
        rowNew3.getCell(46).value =   results.cabutanGk; //AT18      6 kerajaan
        rowNew3.getCell(47).value =   results.jumlahCabutan; //AU18      6 kerajaan
        rowNew3.getCell(48).value =   results.penskaleran; //AV18      6 kerajaan
        rowNew3.getCell(49).value =   results.kesSelesai; //AW18      6 kerajaan
        rowNew3.getCell(50).value =   results.enrolmen; //AX18      6 kerajaan
        rowNew3.getCell(51).value =   results.peratusKesDiliputi; //AY18      6 kerajaan
        rowNew3.commit();

        let rowNew4 = worksheet.getRow(19);
        rowNew4.getCell(26).value =   results.perluFSGigiS; //Z19      6 kerajaan
        rowNew4.getCell(28).value =   results.perluFvGigiS; //AB19      6 kerajaan
        rowNew4.getCell(30).value =   results.perluPRR1BGigiS; //AD19      6 kerajaan
        rowNew4.getCell(33).value =   results.perluFSGigiS; //AG19      6 kerajaan
        rowNew4.getCell(35).value =   results.perluFvGigiS; //AI19      6 kerajaan
        rowNew4.getCell(37).value =   results.perluPRR1BGigiS; //AK19      6 kerajaan
        rowNew4.getCell(38).value =   results.telahTampalanAntGdS; //AL19      6 kerajaan
        rowNew4.getCell(39).value =   results.telahTampalanAntGkS; //AM19      6 kerajaan
        rowNew4.getCell(40).value =   results.telahTampalanPosGdS; //AN19      6 kerajaan
        rowNew4.getCell(41).value =   results.telahTampalanPosGkS; //AO19      6 kerajaan
        rowNew4.getCell(42).value =   results.telahTampalanAmgGdS; //AP19      6 kerajaan
        rowNew4.getCell(43).value =   results.telahTampalanAmgGkS; //AQ19      6 kerajaan
        rowNew4.getCell(44).value =   results.jumlahTampalanS; //AR19      6 kerajaan
        rowNew4.commit();

        //// 5 tahun swasta
        let rowNew5 = worksheet.getRow(22);
        rowNew5.getCell(3).value =   results.kedatanganBaru; //C22      Kedatangan Baru5 tahun swasta"
        rowNew5.getCell(4).value =   results.kedatanganUlangan; //D22      Kedatangan Ulangan5 tahun swasta
        rowNew5.getCell(5).value =   results.kebersihanMulutA; //E22      Kebersihan Mulut A5 tahun swasta
        rowNew5.getCell(6).value =   results.kebersihanMulutC; //F22      Kebersihan Mulut C5 tahun swasta
        rowNew5.getCell(7).value =   results.kebersihanMulutE; //G22      Kebersihan Mulut E5 tahun swasta
        rowNew5.getCell(8).value =   results.statusGigidesidusD; //H22      Status Gigi Desidus d5 tahun swasta
        rowNew5.getCell(9).value =   results.statusGigidesidusF; //I22      Status Gigi Desidus f5 tahun swasta
        rowNew5.getCell(10).value =   results.statusGigidesidusX; //J22      Status Gigi Desidus x5 tahun swasta
        rowNew5.getCell(11).value =   results.statusGigidesidusJumlahdfx; //K22      Status Gigi Desidus Jumlah dfx5 tahun swasta
        rowNew5.getCell(12).value =   results.statusGigiKekalD; //L22      Status Gigi Kekal D5 tahun swasta
        rowNew5.getCell(13).value =   results.statusGigiKekalM; //M22      Status Gigi Kekal M5 tahun swasta
        rowNew5.getCell(14).value =   results.statusGigiKekalF; //N22      Status Gigi Kekal F5 tahun swasta
        rowNew5.getCell(15).value =   results.statusGigiKekalX; //O22      Status Gigi Kekal X5 tahun swasta
        rowNew5.getCell(16).value =   results.statusGigiKekalJumlahDMFX; //P22      Status Gigi Kekal Jumlah DMFX5 tahun swasta
        rowNew5.getCell(17).value =   results.gigiKekalDMFXsamaAtauKurangDari3; //Q22      Status Gigi Kekal DMFX <= 35 tahun swasta
        rowNew5.getCell(18).value =   results.totalStatusGigiKekalSamaKosong; //R22      Status Gigi Kekal X+M = 05 tahun swasta
        rowNew5.getCell(19).value =   results.MBK; //S22      Mulut Bebas Karies (MBK)5 tahun swasta
        rowNew5.getCell(20).value =   results.statusBebasKaries; //T22      Status Gigi Kekal Bebas Karies (BK) DMFX = 05 tahun swasta
        rowNew5.getCell(21).value =   results.statusGigiDesidusdfx0; //U22      Status Gigi Desidus dfx = 05 tahun swasta
        rowNew5.getCell(22).value =   results.mulutBebasGingivitis; //V22      Mulut Bebas Gingivitis (MBG)5 tahun swasta
        rowNew5.getCell(23).value =   results.tprSMKP; //W22      Tidak Perlu Rawatan (SMKP)5 tahun swasta
        rowNew5.getCell(25).value =   results.perluFSMuridB; //Y22      5 tahun swasta
        rowNew5.getCell(26).value =   results.perluFSGigiB; //Z22      5 tahun swasta
        rowNew5.getCell(27).value =   results.perluFvMuridB; //AA22      5 tahun swasta
        rowNew5.getCell(28).value =   results.perluFvGigiB; //AB22      5 tahun swasta
        rowNew5.getCell(29).value =   results.perluPRR1MuridB; //AC22      5 tahun swasta
        rowNew5.getCell(30).value =   results.perluPRR1BGigiB; //AD22      5 tahun swasta
        rowNew5.getCell(32).value =   results.perluFSMuridB; //AF22      5 tahun swasta
        rowNew5.getCell(33).value =   results.perluFSGigiB; //AG22      5 tahun swasta
        rowNew5.getCell(34).value =   results.perluFvMuridB; //AH22      5 tahun swasta
        rowNew5.getCell(35).value =   results.perluFvGigiB; //AI22      5 tahun swasta
        rowNew5.getCell(36).value =   results.perluPRR1MuridB; //AJ22      5 tahun swasta
        rowNew5.getCell(37).value =   results.perluPRR1BGigiB; //AK22      5 tahun swasta
        rowNew5.getCell(38).value =   results.telahTampalanAntGdB; //AL22      5 tahun swasta
        rowNew5.getCell(39).value =   results.telahTampalanAntGkB; //AM22      5 tahun swasta
        rowNew5.getCell(40).value =   results.telahTampalanPosGdB; //AN22      5 tahun swasta
        rowNew5.getCell(41).value =   results.telahTampalanPosGkB; //AO22      5 tahun swasta
        rowNew5.getCell(42).value =   results.telahTampalanAmgGdB; //AP22      5 tahun swasta
        rowNew5.getCell(43).value =   results.telahTampalanAmgGkB; //AQ22      5 tahun swasta
        rowNew5.getCell(44).value =   results.jumlahTampalanB; //AR22      5 tahun swasta
        rowNew5.getCell(45).value =   results.cabutanGd; //AS22      5 tahun swasta
        rowNew5.getCell(46).value =   results.cabutanGk; //AT22      5 tahun swasta
        rowNew5.getCell(47).value =   results.jumlahCabutan; //AU22      5 tahun swasta
        rowNew5.getCell(48).value =   results.penskaleran; //AV22      5 tahun swasta
        rowNew5.getCell(49).value =   results.kesSelesai; //AW22      5 tahun swasta
        rowNew5.getCell(50).value =   results.enrolmen; //AX22      5 tahun swasta
        rowNew5.getCell(51).value =   results.peratusKesDiliputi; //AY22      5 tahun swasta
        rowNew5.commit();

        let rowNew6 = worksheet.getRow(22);
        rowNew6.getCell(26).value =   results.perluFSGigiS; //Z23      5 tahun swasta
        rowNew6.getCell(28).value =   results.perluFvGigiS; //AB23      5 tahun swasta
        rowNew6.getCell(30).value =   results.perluPRR1BGigiS; //AD23      5 tahun swasta
        rowNew6.getCell(33).value =   results.perluFSGigiS; //AG23      5 tahun swasta
        rowNew6.getCell(35).value =   results.perluFvGigiS; //AI23      5 tahun swasta
        rowNew6.getCell(37).value =   results.perluPRR1BGigiS; //AK23      5 tahun swasta
        rowNew6.getCell(38).value =   results.telahTampalanAntGdS; //AL23      5 tahun swasta
        rowNew6.getCell(39).value =   results.telahTampalanAntGkS; //AM23      5 tahun swasta
        rowNew6.getCell(40).value =   results.telahTampalanPosGdS; //AN23      5 tahun swasta
        rowNew6.getCell(41).value =   results.telahTampalanPosGkS; //AO23      5 tahun swasta
        rowNew6.getCell(42).value =   results.telahTampalanAmgGdS; //AP23      5 tahun swasta
        rowNew6.getCell(43).value =   results.telahTampalanAmgGkS; //AQ23      5 tahun swasta
        rowNew6.getCell(44).value =   results.jumlahTampalanS; //AR23      5 tahun swasta
        rowNew6.commit();

        // 6 tahun swasta
        let rowNew7 = worksheet.getRow(24);
        rowNew7.getCell(3).value =   results.kedatanganBaru; //C24      Kedatangan Baru6 swasta
        rowNew7.getCell(4).value =   results.kedatanganUlangan; //D24      Kedatangan Ulangan6 swasta
        rowNew7.getCell(5).value =   results.kebersihanMulutA; //E24      Kebersihan Mulut A6 swasta
        rowNew7.getCell(6).value =   results.kebersihanMulutC; //F24      Kebersihan Mulut C6 swasta
        rowNew7.getCell(7).value =   results.kebersihanMulutE; //G24      Kebersihan Mulut E6 swasta
        rowNew7.getCell(8).value =   results.statusGigidesidusD; //H24      Status Gigi Desidus d6 swasta
        rowNew7.getCell(9).value =   results.statusGigidesidusF; //I24      Status Gigi Desidus f6 swasta
        rowNew7.getCell(10).value =   results.statusGigidesidusX; //J24      Status Gigi Desidus x6 swasta
        rowNew7.getCell(11).value =   results.statusGigidesidusJumlahdfx; //K24      Status Gigi Desidus Jumlah dfx6 swasta
        rowNew7.getCell(12).value =   results.statusGigiKekalD; //L24      Status Gigi Kekal D6 swasta
        rowNew7.getCell(13).value =   results.statusGigiKekalM; //M24      Status Gigi Kekal M6 swasta
        rowNew7.getCell(14).value =   results.statusGigiKekalF; //N24      Status Gigi Kekal F6 swasta
        rowNew7.getCell(15).value =   results.statusGigiKekalX; //O24      Status Gigi Kekal X6 swasta
        rowNew7.getCell(16).value =   results.statusGigiKekalJumlahDMFX; //P24      Status Gigi Kekal Jumlah DMFX6 swasta
        rowNew7.getCell(17).value =   results.gigiKekalDMFXsamaAtauKurangDari3; //Q24      Status Gigi Kekal DMFX <= 36 swasta
        rowNew7.getCell(18).value =   results.totalStatusGigiKekalSamaKosong; //R24      Status Gigi Kekal X+M = 06 swasta
        rowNew7.getCell(19).value =   results.MBK; //S24      Mulut Bebas Karies (MBK)6 swasta
        rowNew7.getCell(20).value =   results.statusBebasKaries; //T24      Status Gigi Kekal Bebas Karies (BK) DMFX = 06 swasta
        rowNew7.getCell(21).value =   results.statusGigiDesidusdfx0; //U24      Status Gigi Desidus dfx = 06 swasta
        rowNew7.getCell(22).value =   results.mulutBebasGingivitis; //V24      Mulut Bebas Gingivitis (MBG)6 swasta
        rowNew7.getCell(23).value =   results.tprSMKP; //W24      Tidak Perlu Rawatan (SMKP)6 swasta
        rowNew7.getCell(25).value =   results.perluFSMuridB; //Y24      6 swasta
        rowNew7.getCell(26).value =   results.perluFSGigiB; //Z24      6 swasta
        rowNew7.getCell(27).value =   results.perluFvMuridB; //AA24      6 swasta
        rowNew7.getCell(28).value =   results.perluFvGigiB; //AB24      6 swasta
        rowNew7.getCell(29).value =   results.perluPRR1MuridB; //AC24      6 swasta
        rowNew7.getCell(30).value =   results.perluPRR1BGigiB; //AD24      6 swasta
        rowNew7.getCell(32).value =   results.perluFSMuridB; //AF24      6 swasta
        rowNew7.getCell(33).value =   results.perluFSGigiB; //AG24      6 swasta
        rowNew7.getCell(34).value =   results.perluFvMuridB; //AH24      6 swasta
        rowNew7.getCell(35).value =   results.perluFvGigiB; //AI24      6 swasta
        rowNew7.getCell(36).value =   results.perluPRR1MuridB; //AJ24      6 swasta
        rowNew7.getCell(37).value =   results.perluPRR1BGigiB; //AK24      6 swasta
        rowNew7.getCell(38).value =   results.telahTampalanAntGdB; //AL24      6 swasta
        rowNew7.getCell(39).value =   results.telahTampalanAntGkB; //AM24      6 swasta
        rowNew7.getCell(40).value =   results.telahTampalanPosGdB; //AN24      6 swasta
        rowNew7.getCell(41).value =   results.telahTampalanPosGkB; //AO24      6 swasta
        rowNew7.getCell(42).value =   results.telahTampalanAmgGdB; //AP24      6 swasta
        rowNew7.getCell(43).value =   results.telahTampalanAmgGkB; //AQ24      6 swasta
        rowNew7.getCell(44).value =   results.jumlahTampalanB; //AR24      6 swasta
        rowNew7.getCell(45).value =   results.cabutanGd; //AS24      6 swasta
        rowNew7.getCell(46).value =   results.cabutanGk; //AT24      6 swasta
        rowNew7.getCell(47).value =   results.jumlahCabutan; //AU24      6 swasta
        rowNew7.getCell(48).value =   results.penskaleran; //AV24      6 swasta
        rowNew7.getCell(49).value =   results.kesSelesai; //AW24      6 swasta
        rowNew7.getCell(50).value =   results.enrolmen; //AX24      6 swasta
        rowNew7.getCell(51).value =   results.peratusKesDiliputi; //AY24      6 swasta
        rowNew7.commit();
        
        let rowNew8 = worksheet.getRow(25);
        rowNew8.getCell(26).value =   results.perluFSGigiS; //Z25      6 swasta
        rowNew8.getCell(28).value =   results.perluFvGigiS; //AB25      6 swasta
        rowNew8.getCell(30).value =   results.perluPRR1BGigiS; //AD25      6 swasta
        rowNew8.getCell(33).value =   results.perluFSGigiS; //AG25      6 swasta
        rowNew8.getCell(35).value =   results.perluFvGigiS; //AI25      6 swasta
        rowNew8.getCell(37).value =   results.perluPRR1BGigiS; //AK25      6 swasta
        rowNew8.getCell(38).value =   results.telahTampalanAntGdS; //AL25      6 swasta
        rowNew8.getCell(39).value =   results.telahTampalanAntGkS; //AM25      6 swasta
        rowNew8.getCell(40).value =   results.telahTampalanPosGdS; //AN25      6 swasta
        rowNew8.getCell(41).value =   results.telahTampalanPosGkS; //AO25      6 swasta
        rowNew8.getCell(42).value =   results.telahTampalanAmgGdS; //AP25      6 swasta
        rowNew8.getCell(43).value =   results.telahTampalanAmgGkS; //AQ25      6 swasta
        rowNew8.getCell(44).value =   results.jumlahTampalanS; //AR25      6 swasta
        rowNew8.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-PGPS2202.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createMMI = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "MMI.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('MMI');

        ////  Pra Sekolah 5 tahun
        let rowNew = worksheet.getRow(14);
        rowNew.getCell(2).value = results.kedatanganBaru; //B14      Pra sekolah 5 tahun
        rowNew.getCell(3).value = results.statusGigiKekalD; //C14      Pra sekolah 5 tahun
        rowNew.getCell(4).value = results.meanD; //D14      Pra sekolah 5 tahun
        rowNew.getCell(5).value = results.bilMuridEmore0; //E14      Pra sekolah 5 tahun
        rowNew.getCell(6).value = results.prevalenceCariesAwal; //F14      Pra sekolah 5 tahun
        rowNew.getCell(7).value = results.bilBKEMoreThan0; //G14      Pra sekolah 5 tahun
        rowNew.getCell(8).value = results.peratusMuridBKEmore0; //H14      Pra sekolah 5 tahun
        rowNew.getCell(10).value = results.perluFSMuridB; //J14      Pra sekolah 5 tahun
        rowNew.getCell(11).value = results.perluFSGigiB; //K14      Pra sekolah 5 tahun
        rowNew.getCell(12).value = results.perluFvMuridB; //L14      Pra sekolah 5 tahun
        rowNew.getCell(13).value = results.perluFvGigiB; //M14      Pra sekolah 5 tahun
        rowNew.getCell(14).value = results.perluPRR1MuridB; //N14      Pra sekolah 5 tahun
        rowNew.getCell(15).value = results.perluPRR1BGigiB; //O14      Pra sekolah 5 tahun
        rowNew.getCell(17).value = results.telahFSMuridB; //Q14      Pra sekolah 5 tahun
        rowNew.getCell(18).value = results.telahFSGigiB; //R14      Pra sekolah 5 tahun
        rowNew.getCell(19).value = results.telahFVMuridB; //S14      Pra sekolah 5 tahun
        rowNew.getCell(20).value = results.telahFVGigiB; //T14      Pra sekolah 5 tahun
        rowNew.getCell(21).value = results.telahPRR1GigiB; //U14      Pra sekolah 5 tahun
        rowNew.getCell(22).value = results.telahPRR1GigiB; //V14      Pra sekolah 5 tahun
        rowNew.commit();

        let rowNew2 = worksheet.getRow(15);
        rowNew2.getCell(11).value = results.perluFSGigiS; //K15      Pra sekolah 5 tahun
        rowNew2.getCell(13).value = results.perluFvGigiS; //M15      Pra sekolah 5 tahun
        rowNew2.getCell(15).value = results.perluPRR1BGigiS; //O15      Pra sekolah 5 tahun
        rowNew2.getCell(17).value = results.telahFSMuridS; //Q15      Pra sekolah 5 tahun
        rowNew2.getCell(18).value = results.telahFSGigiS; //R15      Pra sekolah 5 tahun
        rowNew2.getCell(19).value = results.telahFVMuridS; //S15      Pra sekolah 5 tahun
        rowNew2.getCell(20).value = results.telahFVGigiS; //T15      Pra sekolah 5 tahun
        rowNew2.getCell(21).value = results.telahPRR1MuridS; //U15      Pra sekolah 5 tahun
        rowNew2.getCell(22).value = results.telahPRR1GigiS; //V15      Pra sekolah 5 tahun
        rowNew2.commit();

        //// Pras sekolah 6 tahun
        let rowNew3 = worksheet.getRow(16);
        rowNew3.getCell(2).value = results.kedatanganBaru; //B16      Pra sekolah 6 tahun
        rowNew3.getCell(3).value = results.statusGigiKekalD; //C16      Pra sekolah 6 tahun
        rowNew3.getCell(4).value = results.meanD; //D16      Pra sekolah 6 tahun
        rowNew3.getCell(5).value = results.bilMuridEmore0; //E16      Pra sekolah 6 tahun
        rowNew3.getCell(6).value = results.prevalenceCariesAwal; //F16      Pra sekolah 6 tahun
        rowNew3.getCell(7).value = results.bilBKEMoreThan0; //G16      Pra sekolah 6 tahun
        rowNew3.getCell(8).value = results.peratusMuridBKEmore0; //H16      Pra sekolah 6 tahun
        rowNew3.getCell(10).value = results.perluFSMuridB; //J16      Pra sekolah 6 tahun
        rowNew3.getCell(11).value = results.perluFSGigiB; //K16      Pra sekolah 6 tahun
        rowNew3.getCell(12).value = results.perluFvMuridB; //L16      Pra sekolah 6 tahun
        rowNew3.getCell(13).value = results.perluFvGigiB; //M16      Pra sekolah 6 tahun
        rowNew3.getCell(14).value = results.perluPRR1MuridB; //N16      Pra sekolah 6 tahun
        rowNew3.getCell(15).value = results.perluPRR1BGigiB; //O16      Pra sekolah 6 tahun
        rowNew3.getCell(17).value = results.telahFSMuridB; //Q16      Pra sekolah 6 tahun
        rowNew3.getCell(18).value = results.telahFSGigiB; //R16      Pra sekolah 6 tahun
        rowNew3.getCell(19).value = results.telahFVMuridB; //S16      Pra sekolah 6 tahun
        rowNew3.getCell(20).value = results.telahFVGigiB; //T16      Pra sekolah 6 tahun
        rowNew3.getCell(21).value = results.telahPRR1GigiB; //U16      Pra sekolah 6 tahun
        rowNew3.getCell(22).value = results.telahPRR1GigiB; //V16      Pra sekolah 6 tahun
        rowNew3.commit();

        let rowNew4 = worksheet.getRow(17);
        rowNew4.getCell(11).value = results.perluFSGigiS; //K17      Pra sekolah 6 tahun
        rowNew4.getCell(13).value = results.perluFvGigiS; //M17      Pra sekolah 6 tahun
        rowNew4.getCell(15).value = results.perluPRR1BGigiS; //O17      Pra sekolah 6 tahun
        rowNew4.getCell(17).value = results.telahFSMuridS; //Q17      Pra sekolah 6 tahun
        rowNew4.getCell(18).value = results.telahFSGigiS; //R17      Pra sekolah 6 tahun
        rowNew4.getCell(19).value = results.telahFVMuridS; //S17      Pra sekolah 6 tahun
        rowNew4.getCell(20).value = results.telahFVGigiS; //T17      Pra sekolah 6 tahun
        rowNew4.getCell(21).value = results.telahPRR1MuridS; //U17      Pra sekolah 6 tahun
        rowNew4.getCell(22).value = results.telahPRR1GigiS; //V17      Pra sekolah 6 tahun
        rowNew4.commit();

        //// Tahun 1
        let rowNew5 = worksheet.getRow(18);
        rowNew5.getCell(2).value = results.kedatanganBaru; //B18      Tahun 1
        rowNew5.getCell(3).value = results.statusGigiKekalD; //C18      Tahun 1
        rowNew5.getCell(4).value = results.meanD; //D18      Tahun 1
        rowNew5.getCell(5).value = results.bilMuridEmore0; //E18      Tahun 1
        rowNew5.getCell(6).value = results.prevalenceCariesAwal; //F18      Tahun 1
        rowNew5.getCell(7).value = results.bilBKEMoreThan0; //G18      Tahun 1
        rowNew5.getCell(8).value = results.peratusMuridBKEmore0; //H18      Tahun 1
        rowNew5.getCell(10).value = results.perluFSMuridB; //J18      Tahun 1
        rowNew5.getCell(11).value = results.perluFSGigiB; //K18      Tahun 1
        rowNew5.getCell(12).value = results.perluFvMuridB; //L18      Tahun 1
        rowNew5.getCell(13).value = results.perluFvGigiB; //M18      Tahun 1
        rowNew5.getCell(14).value = results.perluPRR1MuridB; //N18      Tahun 1
        rowNew5.getCell(15).value = results.perluPRR1BGigiB; //O18      Tahun 1
        rowNew5.getCell(17).value = results.telahFSMuridB; //Q18      Tahun 1
        rowNew5.getCell(18).value = results.telahFSGigiB; //R18      Tahun 1
        rowNew5.getCell(19).value = results.telahFVMuridB; //S18      Tahun 1
        rowNew5.getCell(20).value = results.telahFVGigiB; //T18      Tahun 1
        rowNew5.getCell(21).value = results.telahPRR1GigiB; //U18      Tahun 1
        rowNew5.getCell(22).value = results.telahPRR1GigiB; //V18      Tahun 1
        rowNew5.commit();

        let rowNew6 = worksheet.getRow(19);
        rowNew6.getCell(11).value = results.perluFSGigiS; //K19      Tahun 1
        rowNew6.getCell(13).value = results.perluFvGigiS; //M19      Tahun 1
        rowNew6.getCell(15).value = results.perluPRR1BGigiS; //O19      Tahun 1
        rowNew6.getCell(17).value = results.telahFSMuridS; //Q19      Tahun 1
        rowNew6.getCell(18).value = results.telahFSGigiS; //R19      Tahun 1
        rowNew6.getCell(19).value = results.telahFVMuridS; //S19      Tahun 1
        rowNew6.getCell(20).value = results.telahFVGigiS; //T19      Tahun 1
        rowNew6.getCell(21).value = results.telahPRR1MuridS; //U19      Tahun 1
        rowNew6.getCell(22).value = results.telahPRR1GigiS; //V19      Tahun 1
        rowNew6.commit();

        //// Tahun 2 
        let rowNew7 = worksheet.getRow(20);
        rowNew7.getCell(2).value = results.kedatanganBaru; //B20      Tahun 2
        rowNew7.getCell(3).value = results.statusGigiKekalD; //C20      Tahun 2
        rowNew7.getCell(4).value = results.meanD; //D20      Tahun 2
        rowNew7.getCell(5).value = results.bilMuridEmore0; //E20      Tahun 2
        rowNew7.getCell(6).value = results.prevalenceCariesAwal; //F20      Tahun 2
        rowNew7.getCell(7).value = results.bilBKEMoreThan0; //G20      Tahun 2
        rowNew7.getCell(8).value = results.peratusMuridBKEmore0; //H20      Tahun 2
        rowNew7.getCell(10).value = results.perluFSMuridB; //J20      Tahun 2
        rowNew7.getCell(11).value = results.perluFSGigiB; //K20      Tahun 2
        rowNew7.getCell(12).value = results.perluFvMuridB; //L20      Tahun 2
        rowNew7.getCell(13).value = results.perluFvGigiB; //M20      Tahun 2
        rowNew7.getCell(14).value = results.perluPRR1MuridB; //N20      Tahun 2
        rowNew7.getCell(15).value = results.perluPRR1BGigiB; //O20      Tahun 2
        rowNew7.getCell(17).value = results.telahFSMuridB; //Q20      Tahun 2
        rowNew7.getCell(18).value = results.telahFSGigiB; //R20      Tahun 2
        rowNew7.getCell(19).value = results.telahFVMuridB; //S20      Tahun 2
        rowNew7.getCell(20).value = results.telahFVGigiB; //T20      Tahun 2
        rowNew7.getCell(21).value = results.telahPRR1GigiB; //U20      Tahun 2
        rowNew7.getCell(22).value = results.telahPRR1GigiB; //V20      Tahun 2
        rowNew7.commit();

        let rowNew8 = worksheet.getRow(21);
        rowNew8.getCell(11).value = results.perluFSGigiS; //K21      Tahun 2
        rowNew8.getCell(13).value = results.perluFvGigiS; //M21      Tahun 2
        rowNew8.getCell(15).value = results.perluPRR1BGigiS; //O21      Tahun 2
        rowNew8.getCell(17).value = results.telahFSMuridS; //Q21      Tahun 2
        rowNew8.getCell(18).value = results.telahFSGigiS; //R21      Tahun 2
        rowNew8.getCell(19).value = results.telahFVMuridS; //S21      Tahun 2
        rowNew8.getCell(20).value = results.telahFVGigiS; //T21      Tahun 2
        rowNew8.getCell(21).value = results.telahPRR1MuridS; //U21      Tahun 2
        rowNew8.getCell(22).value = results.telahPRR1GigiS; //V21      Tahun 2
        rowNew8.commit();

        ///  Tahun 3
        let rowNew9 = worksheet.getRow(22);
        rowNew9.getCell(2).value = results.kedatanganBaru; //B22      Tahun 3
        rowNew9.getCell(3).value = results.statusGigiKekalD; //C22      Tahun 3
        rowNew9.getCell(4).value = results.meanD; //D22      Tahun 3
        rowNew9.getCell(5).value = results.bilMuridEmore0; //E22      Tahun 3
        rowNew9.getCell(6).value = results.prevalenceCariesAwal; //F22      Tahun 3
        rowNew9.getCell(7).value = results.bilBKEMoreThan0; //G22      Tahun 3
        rowNew9.getCell(8).value = results.peratusMuridBKEmore0; //H22      Tahun 3
        rowNew9.getCell(10).value = results.perluFSMuridB; //J22      Tahun 3
        rowNew9.getCell(11).value = results.perluFSGigiB; //K22      Tahun 3
        rowNew9.getCell(12).value = results.perluFvMuridB; //L22      Tahun 3
        rowNew9.getCell(13).value = results.perluFvGigiB; //M22      Tahun 3
        rowNew9.getCell(14).value = results.perluPRR1MuridB; //N22      Tahun 3
        rowNew9.getCell(15).value = results.perluPRR1BGigiB; //O22      Tahun 3
        rowNew9.getCell(17).value = results.telahFSMuridB; //Q22      Tahun 3
        rowNew9.getCell(18).value = results.telahFSGigiB; //R22      Tahun 3
        rowNew9.getCell(19).value = results.telahFVMuridB; //S22      Tahun 3
        rowNew9.getCell(20).value = results.telahFVGigiB; //T22      Tahun 3
        rowNew9.getCell(21).value = results.telahPRR1GigiB; //U22      Tahun 3
        rowNew9.getCell(22).value = results.telahPRR1GigiB; //V22      Tahun 3
        rowNew9.commit();         

        let rowNew10 = worksheet.getRow(23);
        rowNew10.getCell(11).value = results.perluFSGigiS; //K23      Tahun 3
        rowNew10.getCell(13).value = results.perluFvGigiS; //M23      Tahun 3
        rowNew10.getCell(15).value = results.perluPRR1BGigiS; //O23      Tahun 3
        rowNew10.getCell(17).value = results.telahFSMuridS; //Q23      Tahun 3
        rowNew10.getCell(18).value = results.telahFSGigiS; //R23      Tahun 3
        rowNew10.getCell(19).value = results.telahFVMuridS; //S23      Tahun 3
        rowNew10.getCell(20).value = results.telahFVGigiS; //T23      Tahun 3
        rowNew10.getCell(21).value = results.telahPRR1MuridS; //U23      Tahun 3
        rowNew10.getCell(22).value = results.telahPRR1GigiS; //V23      Tahun 3
        rowNew10.commit();

        /// Tahun 4 
        let rowNew11 = worksheet.getRow(24);
        rowNew11.getCell(2).value = results.kedatanganBaru; //B24      Tahun 4
        rowNew11.getCell(3).value = results.statusGigiKekalD; //C24      Tahun 4
        rowNew11.getCell(4).value = results.meanD; //D24      Tahun 4
        rowNew11.getCell(5).value = results.bilMuridEmore0; //E24      Tahun 4
        rowNew11.getCell(6).value = results.prevalenceCariesAwal; //F24      Tahun 4
        rowNew11.getCell(7).value = results.bilBKEMoreThan0; //G24      Tahun 4
        rowNew11.getCell(8).value = results.peratusMuridBKEmore0; //H24      Tahun 4
        rowNew11.getCell(10).value = results.perluFSMuridB; //J24      Tahun 4
        rowNew11.getCell(11).value = results.perluFSGigiB; //K24      Tahun 4
        rowNew11.getCell(12).value = results.perluFvMuridB; //L24      Tahun 4
        rowNew11.getCell(13).value = results.perluFvGigiB; //M24      Tahun 4
        rowNew11.getCell(14).value = results.perluPRR1MuridB; //N24      Tahun 4
        rowNew11.getCell(15).value = results.perluPRR1BGigiB; //O24      Tahun 4
        rowNew11.getCell(17).value = results.telahFSMuridB; //Q24      Tahun 4
        rowNew11.getCell(18).value = results.telahFSGigiB; //R24      Tahun 4
        rowNew11.getCell(19).value = results.telahFVMuridB; //S24      Tahun 4
        rowNew11.getCell(20).value = results.telahFVGigiB; //T24      Tahun 4
        rowNew11.getCell(21).value = results.telahPRR1GigiB; //U24      Tahun 4
        rowNew11.getCell(22).value = results.telahPRR1GigiB; //V24      Tahun 4
        rowNew11.commit();

        let rowNew12 = worksheet.getRow(25);
        rowNew12.getCell(11).value = results.perluFSGigiS; //K25      Tahun 4
        rowNew12.getCell(13).value = results.perluFvGigiS; //M25      Tahun 4
        rowNew12.getCell(15).value = results.perluPRR1BGigiS; //O25      Tahun 4
        rowNew12.getCell(17).value = results.telahFSMuridS; //Q25      Tahun 4
        rowNew12.getCell(18).value = results.telahFSGigiS; //R25      Tahun 4
        rowNew12.getCell(19).value = results.telahFVMuridS; //S25      Tahun 4
        rowNew12.getCell(20).value = results.telahFVGigiS; //T25      Tahun 4
        rowNew12.getCell(21).value = results.telahPRR1MuridS; //U25      Tahun 4
        rowNew12.getCell(22).value = results.telahPRR1GigiS; //V25      Tahun 4
        rowNew12.commit();

        /// Tahun 5
        let rowNew13 = worksheet.getRow(26);
        rowNew13.getCell(2).value = results.kedatanganBaru; //B26      Tahun 5
        rowNew13.getCell(3).value = results.statusGigiKekalD; //C26      Tahun 5
        rowNew13.getCell(4).value = results.meanD; //D26      Tahun 5
        rowNew13.getCell(5).value = results.bilMuridEmore0; //E26      Tahun 5
        rowNew13.getCell(6).value = results.prevalenceCariesAwal; //F26      Tahun 5
        rowNew13.getCell(7).value = results.bilBKEMoreThan0; //G26      Tahun 5
        rowNew13.getCell(8).value = results.peratusMuridBKEmore0; //H26      Tahun 5
        rowNew13.getCell(10).value = results.perluFSMuridB; //J26      Tahun 5
        rowNew13.getCell(11).value = results.perluFSGigiB; //K26      Tahun 5
        rowNew13.getCell(12).value = results.perluFvMuridB; //L26      Tahun 5
        rowNew13.getCell(13).value = results.perluFvGigiB; //M26      Tahun 5
        rowNew13.getCell(14).value = results.perluPRR1MuridB; //N26      Tahun 5
        rowNew13.getCell(15).value = results.perluPRR1BGigiB; //O26      Tahun 5
        rowNew13.getCell(17).value = results.telahFSMuridB; //Q26      Tahun 5
        rowNew13.getCell(18).value = results.telahFSGigiB; //R26      Tahun 5
        rowNew13.getCell(19).value = results.telahFVMuridB; //S26      Tahun 5
        rowNew13.getCell(20).value = results.telahFVGigiB; //T26      Tahun 5
        rowNew13.getCell(21).value = results.telahPRR1GigiB; //U26      Tahun 5
        rowNew13.getCell(22).value = results.telahPRR1GigiB; //V26      Tahun 5
        rowNew13.commit();

        let rowNew14 = worksheet.getRow(27);
        rowNew14.getCell(11).value = results.perluFSGigiS; //K27      Tahun 5
        rowNew14.getCell(13).value = results.perluFvGigiS; //M27      Tahun 5
        rowNew14.getCell(15).value = results.perluPRR1BGigiS; //O27      Tahun 5
        rowNew14.getCell(17).value = results.telahFSMuridS; //Q27      Tahun 5
        rowNew14.getCell(18).value = results.telahFSGigiS; //R27      Tahun 5
        rowNew14.getCell(19).value = results.telahFVMuridS; //S27      Tahun 5
        rowNew14.getCell(20).value = results.telahFVGigiS; //T27      Tahun 5
        rowNew14.getCell(21).value = results.telahPRR1MuridS; //U27      Tahun 5
        rowNew14.getCell(22).value = results.telahPRR1GigiS; //V27      Tahun 5
        rowNew14.commit();

        //// Tahun 6/Peralihan
        let rowNew15 = worksheet.getRow(28);
        rowNew15.getCell(2).value = results.kedatanganBaru; //B28      Tahun 6"
        rowNew15.getCell(3).value = results.statusGigiKekalD; //C28      Tahun 6
        rowNew15.getCell(4).value = results.meanD; //D28      Tahun 6
        rowNew15.getCell(5).value = results.bilMuridEmore0; //E28      Tahun 6
        rowNew15.getCell(6).value = results.prevalenceCariesAwal; //F28      Tahun 6
        rowNew15.getCell(7).value = results.bilBKEMoreThan0; //G28      Tahun 6
        rowNew15.getCell(8).value = results.peratusMuridBKEmore0; //H28      Tahun 6
        rowNew15.getCell(10).value = results.perluFSMuridB; //J28      Tahun 6
        rowNew15.getCell(11).value = results.perluFSGigiB; //K28      Tahun 6
        rowNew15.getCell(12).value = results.perluFvMuridB; //L28      Tahun 6
        rowNew15.getCell(13).value = results.perluFvGigiB; //M28      Tahun 6
        rowNew15.getCell(14).value = results.perluPRR1MuridB; //N28      Tahun 6
        rowNew15.getCell(15).value = results.perluPRR1BGigiB; //O28      Tahun 6
        rowNew15.getCell(17).value = results.telahFSMuridB; //Q28      Tahun 6
        rowNew15.getCell(18).value = results.telahFSGigiB; //R28      Tahun 6
        rowNew15.getCell(19).value = results.telahFVMuridB; //S28      Tahun 6
        rowNew15.getCell(20).value = results.telahFVGigiB; //T28      Tahun 6
        rowNew15.getCell(21).value = results.telahPRR1GigiB; //U28      Tahun 6
        rowNew15.getCell(22).value = results.telahPRR1GigiB; //V28      Tahun 6
        rowNew15.commit();

        let rowNew16 = worksheet.getRow(29);
        rowNew16.getCell(11).value = results.perluFSGigiS; //K29      Tahun 6
        rowNew16.getCell(13).value = results.perluFvGigiS; //M29      Tahun 6
        rowNew16.getCell(15).value = results.perluPRR1BGigiS; //O29      Tahun 6
        rowNew16.getCell(17).value = results.telahFSMuridS; //Q29      Tahun 6
        rowNew16.getCell(18).value = results.telahFSGigiS; //R29      Tahun 6
        rowNew16.getCell(19).value = results.telahFVMuridS; //S29      Tahun 6
        rowNew16.getCell(20).value = results.telahFVGigiS; //T29      Tahun 6
        rowNew16.getCell(21).value = results.telahPRR1MuridS; //U29      Tahun 6
        rowNew16.getCell(22).value = results.telahPRR1GigiS; //V29      Tahun 6
        rowNew16.commit();

        ///KKI
        let rowNew17 = worksheet.getRow(30);
        rowNew17.getCell(2).value = results.kedatanganBaru; //B30      KKI
        rowNew17.getCell(3).value = results.statusGigiKekalD; //C30      KKI
        rowNew17.getCell(4).value = results.meanD; //D30      KKI
        rowNew17.getCell(5).value = results.bilMuridEmore0; //E30      KKI
        rowNew17.getCell(6).value = results.prevalenceCariesAwal; //F30      KKI
        rowNew17.getCell(7).value = results.bilBKEMoreThan0; //G30      KKI
        rowNew17.getCell(8).value = results.peratusMuridBKEmore0; //H30      KKI
        rowNew17.getCell(10).value = results.perluFSMuridB; //J30      KKI
        rowNew17.getCell(11).value = results.perluFSGigiB; //K30      KKI
        rowNew17.getCell(12).value = results.perluFvMuridB; //L30      KKI
        rowNew17.getCell(13).value = results.perluFvGigiB; //M30      KKI
        rowNew17.getCell(14).value = results.perluPRR1MuridB; //N30      KKI
        rowNew17.getCell(15).value = results.perluPRR1BGigiB; //O30      KKI
        rowNew17.getCell(17).value = results.telahFSMuridB; //Q30      KKI
        rowNew17.getCell(18).value = results.telahFSGigiB; //R30      KKI
        rowNew17.getCell(19).value = results.telahFVMuridB; //S30      KKI
        rowNew17.getCell(20).value = results.telahFVGigiB; //T30      KKI
        rowNew17.getCell(21).value = results.telahPRR1GigiB; //U30      KKI
        rowNew17.getCell(22).value = results.telahPRR1GigiB; //V30      KKI
        rowNew17.commit();

        let rowNew18 = worksheet.getRow(31);
        rowNew18.getCell(11).value = results.perluFSGigiS; //K31      KKI
        rowNew18.getCell(13).value = results.perluFvGigiS; //M31      KKI
        rowNew18.getCell(15).value = results.perluPRR1BGigiS; //O31      KKI
        rowNew18.getCell(17).value = results.telahFSMuridS; //Q31      KKI
        rowNew18.getCell(18).value = results.telahFSGigiS; //R31      KKI
        rowNew18.getCell(19).value = results.telahFVMuridS; //S31      KKI
        rowNew18.getCell(20).value = results.telahFVGigiS; //T31      KKI
        rowNew18.getCell(21).value = results.telahPRR1MuridS; //U31      KKI
        rowNew18.getCell(22).value = results.telahPRR1GigiS; //V31      KKI
        rowNew18.commit();

        /// Others
        let rowNew19 = worksheet.getRow(5);
        rowNew19.getCell(2).value = results.negeri; //B5      negeri
        rowNew19.commit();

        let rowNew20 = worksheet.getRow(6);
        rowNew20.getCell(6).value = results.jumlahSRnegeri; //F6      Jumlah SR seluruh negeri: 
        rowNew20.getCell(11).value = results.tahun; //K6      Tahun:
        rowNew20.commit();

        let rowNew21 = worksheet.getRow(7);
        rowNew21.getCell(6).value = results.jumlahEnrolmenSr; //F7      Jumlah enrolmen SR seluruh negeri:
        rowNew21.getCell(11).value = results.sekolah; //K7      Sekolah:
        rowNew21.commit();

        let rowNew22 = worksheet.getRow(8);
        rowNew22.getCell(6).value = results.jumlahSrTerlibatMMI; //F8      Jumlah SR yang terlibat MMI:
        rowNew22.getCell(11).value = results.klinik; //K8      Klinik:
        rowNew22.commit();

        // // 5 thn kerajaaan
        // let rowNew = worksheet.getRow(17);
        // rowNew.getCell(26).value = results.perluFSGigiS; //Z17      5 tahun kerajaan"
        // rowNew.getCell(28).value = results.perluFvGigiS; //AB17      5 tahun kerajaan
        // rowNew.getCell(30).value = results.perluPRR1BGigiS; //AD17      5 tahun kerajaan
        // rowNew.getCell(33).value = results.perluFSGigiS; //AG17      5 tahun kerajaan
        // rowNew.getCell(35).value = results.perluFvGigiS; //AI17      5 tahun kerajaan
        // rowNew.getCell(37).value = results.perluPRR1BGigiS; //AK17      5 tahun kerajaan
        // rowNew.getCell(38).value = results.telahTampalanAntGdS; //AL17      5 tahun kerajaan
        // rowNew.getCell(39).value = results.telahTampalanAntGkS; //AM17      5 tahun kerajaan
        // rowNew.getCell(40).value = results.telahTampalanPosGdS; //AN17      5 tahun kerajaan
        // rowNew.getCell(41).value = results.telahTampalanPosGkS; //AO17      5 tahun kerajaan
        // rowNew.getCell(42).value = results.telahTampalanAmgGdS; //AP17      5 tahun kerajaan
        // rowNew.getCell(43).value = results.telahTampalanAmgGkS; //AQ17      5 tahun kerajaan
        // rowNew.getCell(44).value = results.jumlahTampalanS; //AR17      5 tahun kerajaan

        // // 6 thn kerajaan
        // let rowNew2 = worksheet.getRow(19);
        // rowNew2.getCell(26).value = results.perluFSGigiS; //Z19      6 kerajaan"
        // rowNew2.getCell(28).value = results.perluFvGigiS; //AB19      6 kerajaan
        // rowNew2.getCell(30).value = results.perluPRR1BGigiS; //AD19      6 kerajaan
        // rowNew2.getCell(33).value = results.perluFSGigiS; //AG19      6 kerajaan
        // rowNew2.getCell(35).value = results.perluFvGigiS; //AI19      6 kerajaan
        // rowNew2.getCell(37).value = results.perluPRR1BGigiS; //AK19      6 kerajaan
        // rowNew2.getCell(38).value = results.telahTampalanAntGdS; //AL19      6 kerajaan
        // rowNew2.getCell(39).value = results.telahTampalanAntGkS; //AM19      6 kerajaan
        // rowNew2.getCell(40).value = results.telahTampalanPosGdS; //AN19      6 kerajaan
        // rowNew2.getCell(41).value = results.telahTampalanPosGkS; //AO19      6 kerajaan
        // rowNew2.getCell(42).value = results.telahTampalanAmgGdS; //AP19      6 kerajaan
        // rowNew2.getCell(43).value = results.telahTampalanAmgGkS; //AQ19      6 kerajaan
        // rowNew2.getCell(44).value = results.jumlahTampalanS; //AR19      6 kerajaan

        // // 5 thn swasta
        // let rowNew3 = worksheet.getRow(23);
        // rowNew3.getCell(26).value = results.perluFSGigiS; //Z23      5 tahun swasta
        // rowNew3.getCell(28).value = results.perluFvGigiS; //AB23      5 tahun swasta
        // rowNew3.getCell(30).value = results.perluPRR1BGigiS; //AD23      5 tahun swasta
        // rowNew3.getCell(33).value = results.perluFSGigiS; //AG23      5 tahun swasta
        // rowNew3.getCell(35).value = results.perluFvGigiS; //AI23      5 tahun swasta
        // rowNew3.getCell(37).value = results.perluPRR1BGigiS; //AK23      5 tahun swasta
        // rowNew3.getCell(38).value = results.telahTampalanAntGdS; //AL23      5 tahun swasta
        // rowNew3.getCell(39).value = results.telahTampalanAntGkS; //AM23      5 tahun swasta
        // rowNew3.getCell(40).value = results.telahTampalanPosGdS; //AN23      5 tahun swasta
        // rowNew3.getCell(41).value = results.telahTampalanPosGkS; //AO23      5 tahun swasta
        // rowNew3.getCell(42).value = results.telahTampalanAmgGdS; //AP23      5 tahun swasta
        // rowNew3.getCell(43).value = results.telahTampalanAmgGkS; //AQ23      5 tahun swasta
        // rowNew3.getCell(44).value = results.jumlahTampalanS; //AR23      5 tahun swasta

        // // 6 thn swasta
        // let rowNew4 = worksheet.getRow(25);
        // rowNew4.getCell(26).value = results.perluFSGigiS; //Z25      6 swasta"
        // rowNew4.getCell(28).value = results.perluFvGigiS; //AB25      6 swasta
        // rowNew4.getCell(30).value = results.perluPRR1BGigiS; //AD25      6 swasta
        // rowNew4.getCell(33).value = results.perluFSGigiS; //AG25      6 swasta
        // rowNew4.getCell(35).value = results.perluFvGigiS; //AI25      6 swasta
        // rowNew4.getCell(37).value = results.perluPRR1BGigiS; //AK25      6 swasta
        // rowNew4.getCell(38).value = results.telahTampalanAntGdS; //AL25      6 swasta
        // rowNew4.getCell(39).value = results.telahTampalanAntGkS; //AM25      6 swasta
        // rowNew4.getCell(40).value = results.telahTampalanPosGdS; //AN25      6 swasta
        // rowNew4.getCell(41).value = results.telahTampalanPosGkS; //AO25      6 swasta
        // rowNew4.getCell(42).value = results.telahTampalanAmgGdS; //AP25      6 swasta
        // rowNew4.getCell(43).value = results.telahTampalanAmgGkS; //AQ25      6 swasta
        // rowNew4.getCell(44).value = results.jumlahTampalanS; //AR25      6 swasta

        // let rowNew5 = worksheet.getRow(5);
        // rowNew5.getCell(2).value =   results.negeri; //B5      negeri"
        // rowNew5.commit();

        // let rowNew6 = worksheet.getRow(6);
        // rowNew6.getCell(6).value =   results.jumlahSRnegeri; //F6      Jumlah SR seluruh negeri: "
        // rowNew6.commit();

        // let rowNew7 = worksheet.getRow(7);
        // rowNew7.getCell(6).value =   results.jumlahEnrolmenSr; //F7      Jumlah enrolmen SR seluruh negeri:"
        // rowNew7.commit();

        // let rowNew8 = worksheet.getRow(8);
        // rowNew8.getCell(6).value =   results.jumlahSrTerlibatMMI; //F8      Jumlah SR yang terlibat MMI:"
        // rowNew8.getCell(11).value =   results.tahun; //K6      Tahun:
        // rowNew8.getCell(11).value =   results.sekolah; //K7      Sekolah:
        // rowNew8.getCell(11).value =   results.klinik; //K8      Klinik:
        // rowNew8.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-MMI.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createOA = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "OA.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('OA');

        //Toddler OA RETEN 
        let rowNew = worksheet.getRow(19);
        rowNew.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Toddler OA
        rowNew.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Toddler OA
        rowNew.getCell(4).value = results.dStatusdfx; //d Status dfx Toddler OA
        rowNew.getCell(5).value = results.fStatusdfx; //f Status dfx Toddler OA
        rowNew.getCell(6).value = results.xStatusdfx; //x Status dfx Toddler OA
        rowNew.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Toddler OA
        rowNew.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Toddler OA
        rowNew.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Toddler OA
        rowNew.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Toddler OA
        rowNew.getCell(14).value = results.skorPlakA; //Skor Plak A Toddler OA
        rowNew.getCell(15).value = results.skorPlakC; //Skor Plak C Toddler OA
        rowNew.getCell(16).value = results.skorPlakE; //Skor Plak E Toddler OA
        rowNew.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = 0) Toddler OA
        rowNew.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Toddler OA
        rowNew.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Toddler OA
        rowNew.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Toddler OA
        rowNew.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Toddler OA
        rowNew.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Toddler OA
        rowNew.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Toddler OA
        rowNew.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Toddler OA
        rowNew.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Toddler OA
        rowNew.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Toddler OA
        rowNew.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Toddler OA
        rowNew.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Toddler OA
        rowNew.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Toddler OA
        rowNew.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Toddler OA
        rowNew.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Toddler OA
        rowNew.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Toddler OA
        rowNew.getCell(48).value = results.penskaleran; //Penskelaran Toddler OA
        rowNew.getCell(49).value = results.txPerio; //Rawatan Periodontik Toddler OA
        rowNew.getCell(50).value = results.txEndo; //Rawatan Endodontik Toddler OA
        rowNew.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Toddler OA
        rowNew.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Toddler OA
        rowNew.getCell(53).value = results.abses; //Abses Toddler OA
        rowNew.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Toddler OA
        rowNew.getCell(55).value = results.fracture; //Fraktur Toddler OA
        rowNew.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Toddler OA
        rowNew.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Toddler OA
        rowNew.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Toddler OA
        rowNew.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Toddler OA
        rowNew.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Toddler OA
        rowNew.getCell(61).value = results.lainLain; //lain-lain Toddler OA
        rowNew.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Toddler OA
        rowNew.getCell(63).value = results.caseCompleted; //kes selesai Toddler OA
        rowNew.getCell(64).value = results.lowCRA; //rendah CRA Toddler OA
        rowNew.getCell(65).value = results.moderateCRA; //sederhana CRA Toddler OA
        rowNew.getCell(66).value = results.highCRA; //tinggi CRA Toddler OA
        rowNew.commit();

        let rowNew2 = worksheet.getRow(20);
        rowNew2.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Toddler OA
        rowNew2.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Toddler OA
        rowNew2.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Toddler OA
        rowNew2.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Toddler OA
        rowNew2.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Toddler OA
        rowNew2.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Toddler OA
        rowNew2.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Toddler OA
        rowNew2.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Toddler OA
        rowNew2.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Toddler OA
        rowNew2.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Toddler OA
        rowNew2.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Toddler OA
        rowNew2.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Toddler OA
        rowNew2.commit();

        //Pra Sekolah RETEN
        let rowNew3 = worksheet.getRow(21);
        rowNew3.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Pra Sekolah
        rowNew3.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Pra Sekolah
        rowNew3.getCell(4).value = results.dStatusdfx; //d Status dfx Pra Sekolah
        rowNew3.getCell(5).value = results.fStatusdfx; //f Status dfx Pra Sekolah
        rowNew3.getCell(6).value = results.xStatusdfx; //x Status dfx Pra Sekolah
        rowNew3.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Pra Sekolah
        rowNew3.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Pra Sekolah
        rowNew3.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Pra Sekolah
        rowNew3.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Pra Sekolah
        rowNew3.getCell(14).value = results.skorPlakA; //Skor Plak A Pra Sekolah
        rowNew3.getCell(15).value = results.skorPlakC; //Skor Plak C Pra Sekolah
        rowNew3.getCell(16).value = results.skorPlakE; //Skor Plak E Pra Sekolah
        rowNew3.getCell(17).value = results.skorGIS0; //Skor GIS 0 Pra Sekolah
        rowNew3.getCell(18).value = results.skorGIS1; //Skor GIS 1 Pra Sekolah
        rowNew3.getCell(19).value = results.skorGIS2; //Skor GIS 2 Pra Sekolah
        rowNew3.getCell(20).value = results.skorGIS3; //Skor GIS 3 Pra Sekolah
        rowNew3.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = results.0) Pra Sekolah
        rowNew3.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Pra Sekolah
        rowNew3.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Pra Sekolah
        rowNew3.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Pra Sekolah
        rowNew3.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Pra Sekolah
        rowNew3.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Pra Sekolah
        rowNew3.getCell(33).value = results.muridBaruPerluFS; //Murid Baru Perlu Sealan Fisur Pra Sekolah
        rowNew3.getCell(34).value = results.gigiBaruPerluFS; //Gigi Baru Perlu Sealan Fisur Pra Sekolah
        rowNew3.getCell(35).value = results.muridBaruTelahFS; //Murid Baru Telah Sealan Fisur Pra Sekolah
        rowNew3.getCell(36).value = results.gigiBaruTelahFS; //Gigi Baru Telah Sealan Fisur Pra Sekolah
        rowNew3.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Pra Sekolah
        rowNew3.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Pra Sekolah
        rowNew3.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Pra Sekolah
        rowNew3.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Pra Sekolah
        rowNew3.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Pra Sekolah
        rowNew3.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Pra Sekolah
        rowNew3.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Pra Sekolah
        rowNew3.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Pra Sekolah
        rowNew3.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Pra Sekolah
        rowNew3.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Pra Sekolah
        rowNew3.getCell(48).value = results.penskaleran; //Penskelaran Pra Sekolah
        rowNew3.getCell(49).value = results.txPerio; //Rawatan Periodontik Pra Sekolah
        rowNew3.getCell(50).value = results.txEndo; //Rawatan Endodontik Pra Sekolah
        rowNew3.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Pra Sekolah
        rowNew3.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Pra Sekolah
        rowNew3.getCell(53).value = results.abses; //Abses Pra Sekolah
        rowNew3.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Pra Sekolah
        rowNew3.getCell(55).value = results.fracture; //Fraktur Pra Sekolah
        rowNew3.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Pra Sekolah
        rowNew3.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Pra Sekolah
        rowNew3.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Pra Sekolah
        rowNew3.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Pra Sekolah
        rowNew3.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Pra Sekolah
        rowNew3.getCell(61).value = results.lainLain; //lain-lain Pra Sekolah
        rowNew3.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Pra Sekolah
        rowNew3.getCell(63).value = results.caseCompleted; //kes selesai Pra Sekolah
        rowNew3.getCell(64).value = results.lowCRA; //rendah CRA Pra Sekolah
        rowNew3.getCell(65).value = results.moderateCRA; //sederhana CRA Pra Sekolah
        rowNew3.getCell(66).value = results.highCRA; //tinggi CRA Pra Sekolah
        rowNew3.commit();

        let rowNew4 = worksheet.getRow(22);
        rowNew4.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Pra Sekolah
        rowNew4.getCell(33).value = results.muridUlanganPerluFS; //Murid Ulangan Perlu Sealan Fisur Pra Sekolah
        rowNew4.getCell(34).value = results.gigiUlanganPerluFS; //Gigi Ulangan Perlu Sealan Fisur Pra Sekolah
        rowNew4.getCell(35).value = results.muridUlanganTelahFS; //Murid Ulangan Telah Sealan Fisur Pra Sekolah
        rowNew4.getCell(36).value = results.gigiUlanganTelahFS; //Gigi Ulangan Telah Sealan Fisur Pra Sekolah
        rowNew4.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Pra Sekolah
        rowNew4.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Pra Sekolah
        rowNew4.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Pra Sekolah
        rowNew4.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Pra Sekolah
        rowNew4.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Pra Sekolah
        rowNew4.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Pra Sekolah
        rowNew4.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Pra Sekolah
        rowNew4.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Pra Sekolah
        rowNew4.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Pra Sekolah
        rowNew4.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Pra Sekolah
        rowNew4.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Pra Sekolah
        rowNew4.commit();

        //Sekolah Rendah RETEN
        let rowNew5 = worksheet.getRow(23);
        rowNew5.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Sekolah Rendah
        rowNew5.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Sekolah Rendah
        rowNew5.getCell(4).value = results.dStatusdfx; //d Status dfx Sekolah Rendah
        rowNew5.getCell(5).value = results.fStatusdfx; //f Status dfx Sekolah Rendah
        rowNew5.getCell(6).value = results.xStatusdfx; //x Status dfx Sekolah Rendah
        rowNew5.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Sekolah Rendah
        rowNew5.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Sekolah Rendah
        rowNew5.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Sekolah Rendah
        rowNew5.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Sekolah Rendah
        rowNew5.getCell(14).value = results.skorPlakA; //Skor Plak A Sekolah Rendah
        rowNew5.getCell(15).value = results.skorPlakC; //Skor Plak C Sekolah Rendah
        rowNew5.getCell(16).value = results.skorPlakE; //Skor Plak E Sekolah Rendah
        rowNew5.getCell(17).value = results.skorGIS0; //Skor GIS 0 Sekolah Rendah
        rowNew5.getCell(18).value = results.skorGIS1; //Skor GIS 1 Sekolah Rendah
        rowNew5.getCell(19).value = results.skorGIS2; //Skor GIS 2 Sekolah Rendah
        rowNew5.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = results.0) Sekolah Rendah
        rowNew5.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Sekolah Rendah
        rowNew5.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Sekolah Rendah
        rowNew5.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Sekolah Rendah
        rowNew5.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Sekolah Rendah
        rowNew5.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Sekolah Rendah
        rowNew5.getCell(33).value = results.muridBaruPerluFS; //Murid Baru Perlu Sealan Fisur Sekolah Rendah
        rowNew5.getCell(34).value = results.gigiBaruPerluFS; //Gigi Baru Perlu Sealan Fisur Sekolah Rendah
        rowNew5.getCell(35).value = results.muridBaruTelahFS; //Murid Baru Telah Sealan Fisur Sekolah Rendah
        rowNew5.getCell(36).value = results.gigiBaruTelahFS; //Gigi Baru Telah Sealan Fisur Sekolah Rendah
        rowNew5.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Sekolah Rendah
        rowNew5.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Sekolah Rendah
        rowNew5.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Sekolah Rendah
        rowNew5.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Sekolah Rendah
        rowNew5.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Sekolah Rendah
        rowNew5.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Sekolah Rendah
        rowNew5.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Sekolah Rendah
        rowNew5.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Sekolah Rendah
        rowNew5.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Sekolah Rendah
        rowNew5.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Sekolah Rendah
        rowNew5.getCell(48).value = results.penskaleran; //Penskelaran Sekolah Rendah
        rowNew5.getCell(49).value = results.txPerio; //Rawatan Periodontik Sekolah Rendah
        rowNew5.getCell(50).value = results.txEndo; //Rawatan Endodontik Sekolah Rendah
        rowNew5.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Sekolah Rendah
        rowNew5.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Sekolah Rendah
        rowNew5.getCell(53).value = results.abses; //Abses Sekolah Rendah
        rowNew5.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Sekolah Rendah
        rowNew5.getCell(55).value = results.fracture; //Fraktur Sekolah Rendah
        rowNew5.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Sekolah Rendah
        rowNew5.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Sekolah Rendah
        rowNew5.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Sekolah Rendah
        rowNew5.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Sekolah Rendah
        rowNew5.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Sekolah Rendah
        rowNew5.getCell(61).value = results.lainLain; //lain-lain Sekolah Rendah
        rowNew5.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Sekolah Rendah
        rowNew5.getCell(63).value = results.caseCompleted; //kes selesai Sekolah Rendah
        rowNew5.getCell(64).value = results.lowCRA; //rendah CRA Sekolah Rendah
        rowNew5.getCell(65).value = results.moderateCRA; //sederhana CRA Sekolah Rendah
        rowNew5.getCell(66).value = results.highCRA; //tinggi CRA Sekolah Rendah
        rowNew5.commit();

        let rowNew6 = worksheet.getRow(24);
        rowNew6.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Sekolah Rendah
        rowNew6.getCell(33).value = results.muridUlanganPerluFS; //Murid Ulangan Perlu Sealan Fisur Sekolah Rendah
        rowNew6.getCell(34).value = results.gigiUlanganPerluFS; //Gigi Ulangan Perlu Sealan Fisur Sekolah Rendah
        rowNew6.getCell(35).value = results.muridUlanganTelahFS; //Murid Ulangan Telah Sealan Fisur Sekolah Rendah
        rowNew6.getCell(36).value = results.gigiUlanganTelahFS; //Gigi Ulangan Telah Sealan Fisur Sekolah Rendah
        rowNew6.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Sekolah Rendah
        rowNew6.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Sekolah Rendah
        rowNew6.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Sekolah Rendah
        rowNew6.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Sekolah Rendah
        rowNew6.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Sekolah Rendah
        rowNew6.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Sekolah Rendah
        rowNew6.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Sekolah Rendah
        rowNew6.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Sekolah Rendah
        rowNew6.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Sekolah Rendah
        rowNew6.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Sekolah Rendah
        rowNew6.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Sekolah Rendah
        rowNew6.commit();

        //Sekolah Menengah RETEN 
        let rowNew7 = worksheet.getRow(25);
        rowNew7.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Sekolah Menengah
        rowNew7.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Sekolah Menengah
        rowNew7.getCell(4).value = results.dStatusdfx; //d Status dfx Sekolah Menengah
        rowNew7.getCell(5).value = results.fStatusdfx; //f Status dfx Sekolah Menengah
        rowNew7.getCell(6).value = results.xStatusdfx; //x Status dfx Sekolah Menengah
        rowNew7.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Sekolah Menengah
        rowNew7.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Sekolah Menengah
        rowNew7.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Sekolah Menengah
        rowNew7.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Sekolah Menengah
        rowNew7.getCell(14).value = results.skorPlakA; //Skor Plak A Sekolah Menengah
        rowNew7.getCell(15).value = results.skorPlakC; //Skor Plak C Sekolah Menengah
        rowNew7.getCell(16).value = results.skorPlakE; //Skor Plak E Sekolah Menengah
        rowNew7.getCell(17).value = results.skorGIS0; //Skor GIS 0 Sekolah Menengah
        rowNew7.getCell(18).value = results.skorGIS1; //Skor GIS 1 Sekolah Menengah
        rowNew7.getCell(19).value = results.skorGIS2; //Skor GIS 2 Sekolah Menengah
        rowNew7.getCell(20).value = results.skorGIS3; //Skor GIS 3 Sekolah Menengah
        rowNew7.getCell(21).value = results.skorBPE0; //Skor BPE 0 Sekolah Menengah
        rowNew7.getCell(22).value = results.skorBPE1; //Skor BPE 1 Sekolah Menengah
        rowNew7.getCell(23).value = results.skorBPE2; //Skor BPE 2 Sekolah Menengah
        rowNew7.getCell(24).value = results.skorBPE3; //Skor BPE 3 Sekolah Menengah
        rowNew7.getCell(25).value = results.skorBPE4; //Skor BPE 4 Sekolah Menengah
        rowNew7.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = results.0) Sekolah Menengah
        rowNew7.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Sekolah Menengah
        rowNew7.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Sekolah Menengah
        rowNew7.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Sekolah Menengah
        rowNew7.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Sekolah Menengah
        rowNew7.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Sekolah Menengah
        rowNew7.getCell(33).value = results.muridBaruPerluFS; //Murid Baru Perlu Sealan Fisur Sekolah Menengah
        rowNew7.getCell(34).value = results.gigiBaruPerluFS; //Gigi Baru Perlu Sealan Fisur Sekolah Menengah
        rowNew7.getCell(35).value = results.muridBaruTelahFS; //Murid Baru Telah Sealan Fisur Sekolah Menengah
        rowNew7.getCell(36).value = results.gigiBaruTelahFS; //Gigi Baru Telah Sealan Fisur Sekolah Menengah
        rowNew7.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Sekolah Menengah
        rowNew7.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Sekolah Menengah
        rowNew7.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Sekolah Menengah
        rowNew7.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Sekolah Menengah
        rowNew7.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Sekolah Menengah
        rowNew7.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Sekolah Menengah
        rowNew7.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Sekolah Menengah
        rowNew7.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Sekolah Menengah
        rowNew7.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Sekolah Menengah
        rowNew7.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Sekolah Menengah
        rowNew7.getCell(48).value = results.penskaleran; //Penskelaran Sekolah Menengah
        rowNew7.getCell(49).value = results.txPerio; //Rawatan Periodontik Sekolah Menengah
        rowNew7.getCell(50).value = results.txEndo; //Rawatan Endodontik Sekolah Menengah
        rowNew7.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Sekolah Menengah
        rowNew7.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Sekolah Menengah
        rowNew7.getCell(53).value = results.abses; //Abses Sekolah Menengah
        rowNew7.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Sekolah Menengah
        rowNew7.getCell(55).value = results.fracture; //Fraktur Sekolah Menengah
        rowNew7.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Sekolah Menengah
        rowNew7.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Sekolah Menengah
        rowNew7.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Sekolah Menengah
        rowNew7.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Sekolah Menengah
        rowNew7.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Sekolah Menengah
        rowNew7.getCell(61).value = results.lainLain; //lain-lain Sekolah Menengah
        rowNew7.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Sekolah Menengah
        rowNew7.getCell(63).value = results.caseCompleted; //kes selesai Sekolah Menengah
        rowNew7.getCell(64).value = results.lowCRA; //rendah CRA Sekolah Menengah
        rowNew7.getCell(65).value = results.moderateCRA; //sederhana CRA Sekolah Menengah
        rowNew7.getCell(66).value = results.highCRA; //tinggi CRA Sekolah Menengah
        rowNew7.commit();

        let rowNew8 = worksheet.getRow(26);
        rowNew8.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Sekolah Menengah
        rowNew8.getCell(33).value = results.muridUlanganPerluFS; //Murid Ulangan Perlu Sealan Fisur Sekolah Menengah
        rowNew8.getCell(34).value = results.gigiUlanganPerluFS; //Gigi Ulangan Perlu Sealan Fisur Sekolah Menengah
        rowNew8.getCell(35).value = results.muridUlanganTelahFS; //Murid Ulangan Telah Sealan Fisur Sekolah Menengah
        rowNew8.getCell(36).value = results.gigiUlanganTelahFS; //Gigi Ulangan Telah Sealan Fisur Sekolah Menengah
        rowNew8.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Sekolah Menengah
        rowNew8.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Sekolah Menengah
        rowNew8.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Sekolah Menengah
        rowNew8.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Sekolah Menengah
        rowNew8.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Sekolah Menengah
        rowNew8.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Sekolah Menengah
        rowNew8.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Sekolah Menengah
        rowNew8.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Sekolah Menengah
        rowNew8.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Sekolah Menengah
        rowNew8.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Sekolah Menengah
        rowNew8.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Sekolah Menengah
        rowNew8.commit();

        //Keperluan Khas RETEN 
        let rowNew9 = worksheet.getRow(27);
        rowNew9.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Keperluan Khas
        rowNew9.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Keperluan Khas
        rowNew9.getCell(4).value = results.dStatusdfx; //d Status dfx Keperluan Khas
        rowNew9.getCell(5).value = results.fStatusdfx; //f Status dfx Keperluan Khas
        rowNew9.getCell(6).value = results.xStatusdfx; //x Status dfx Keperluan Khas
        rowNew9.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Keperluan Khas
        rowNew9.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Keperluan Khas
        rowNew9.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Keperluan Khas
        rowNew9.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Keperluan Khas
        rowNew9.getCell(14).value = results.skorPlakA; //Skor Plak A Keperluan Khas
        rowNew9.getCell(15).value = results.skorPlakC; //Skor Plak C Keperluan Khas
        rowNew9.getCell(16).value = results.skorPlakE; //Skor Plak E Keperluan Khas
        rowNew9.getCell(17).value = results.skorGIS0; //Skor GIS 0 Keperluan Khas
        rowNew9.getCell(18).value = results.skorGIS1; //Skor GIS 1 Keperluan Khas
        rowNew9.getCell(19).value = results.skorGIS2; //Skor GIS 2 Keperluan Khas
        rowNew9.getCell(20).value = results.skorGIS3; //Skor GIS 3 Keperluan Khas
        rowNew9.getCell(21).value = results.skorBPE0; //Skor BPE 0 Keperluan Khas
        rowNew9.getCell(22).value = results.skorBPE1; //Skor BPE 1 Keperluan Khas
        rowNew9.getCell(23).value = results.skorBPE2; //Skor BPE 2 Keperluan Khas
        rowNew9.getCell(24).value = results.skorBPE3; //Skor BPE 3 Keperluan Khas
        rowNew9.getCell(25).value = results.skorBPE4; //Skor BPE 4 Keperluan Khas
        rowNew9.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = results.0) Keperluan Khas
        rowNew9.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Keperluan Khas
        rowNew9.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Keperluan Khas
        rowNew9.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Keperluan Khas
        rowNew9.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Keperluan Khas
        rowNew9.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Keperluan Khas
        rowNew9.getCell(33).value = results.muridBaruPerluFS; //Murid Baru Perlu Sealan Fisur Keperluan Khas
        rowNew9.getCell(34).value = results.gigiBaruPerluFS; //Gigi Baru Perlu Sealan Fisur Keperluan Khas
        rowNew9.getCell(35).value = results.muridBaruTelahFS; //Murid Baru Telah Sealan Fisur Keperluan Khas
        rowNew9.getCell(36).value = results.gigiBaruTelahFS; //Gigi Baru Telah Sealan Fisur Keperluan Khas
        rowNew9.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Keperluan Khas
        rowNew9.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Keperluan Khas
        rowNew9.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Keperluan Khas
        rowNew9.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Keperluan Khas
        rowNew9.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Keperluan Khas
        rowNew9.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Keperluan Khas
        rowNew9.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Keperluan Khas
        rowNew9.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Keperluan Khas
        rowNew9.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Keperluan Khas
        rowNew9.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Keperluan Khas
        rowNew9.getCell(48).value = results.penskaleran; //Penskelaran Keperluan Khas
        rowNew9.getCell(49).value = results.txPerio; //Rawatan Periodontik Keperluan Khas
        rowNew9.getCell(50).value = results.txEndo; //Rawatan Endodontik Keperluan Khas
        rowNew9.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Keperluan Khas
        rowNew9.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Keperluan Khas
        rowNew9.getCell(53).value = results.abses; //Abses Keperluan Khas
        rowNew9.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Keperluan Khas
        rowNew9.getCell(55).value = results.fracture; //Fraktur Keperluan Khas
        rowNew9.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Keperluan Khas
        rowNew9.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Keperluan Khas
        rowNew9.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Keperluan Khas
        rowNew9.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Keperluan Khas
        rowNew9.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Keperluan Khas
        rowNew9.getCell(61).value = results.lainLain; //lain-lain Keperluan Khas
        rowNew9.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Keperluan Khas
        rowNew9.getCell(63).value = results.caseCompleted; //kes selesai Keperluan Khas
        rowNew9.getCell(64).value = results.lowCRA; //rendah CRA Keperluan Khas
        rowNew9.getCell(65).value = results.moderateCRA; //sederhana CRA Keperluan Khas
        rowNew9.getCell(66).value = results.highCRA; //tinggi CRA Keperluan Khas
        rowNew9.commit();

        let rowNew10 = worksheet.getRow(28);
        rowNew10.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Keperluan Khas
        rowNew10.getCell(33).value = results.muridUlanganPerluFS; //Murid Ulangan Perlu Sealan Fisur Keperluan Khas
        rowNew10.getCell(34).value = results.gigiUlanganPerluFS; //Gigi Ulangan Perlu Sealan Fisur Keperluan Khas
        rowNew10.getCell(35).value = results.muridUlanganTelahFS; //Murid Ulangan Telah Sealan Fisur Keperluan Khas
        rowNew10.getCell(36).value = results.gigiUlanganTelahFS; //Gigi Ulangan Telah Sealan Fisur Keperluan Khas
        rowNew10.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Keperluan Khas
        rowNew10.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Keperluan Khas
        rowNew10.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Keperluan Khas
        rowNew10.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Keperluan Khas
        rowNew10.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Keperluan Khas
        rowNew10.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Keperluan Khas
        rowNew10.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Keperluan Khas
        rowNew10.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Keperluan Khas
        rowNew10.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Keperluan Khas
        rowNew10.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Keperluan Khas
        rowNew10.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Keperluan Khas
        rowNew10.commit();

        //Ibu Mengandung RETEN
        let rowNew11 = worksheet.getRow(29);
        rowNew11.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Ibu Mengandung
        rowNew11.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Ibu Mengandung
        rowNew11.getCell(4).value = results.dStatusdfx; //d Status dfx Ibu Mengandung
        rowNew11.getCell(5).value = results.fStatusdfx; //f Status dfx Ibu Mengandung
        rowNew11.getCell(6).value = results.xStatusdfx; //x Status dfx Ibu Mengandung
        rowNew11.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Ibu Mengandung
        rowNew11.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Ibu Mengandung
        rowNew11.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Ibu Mengandung
        rowNew11.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Ibu Mengandung
        rowNew11.getCell(14).value = results.skorPlakA; //Skor Plak A Ibu Mengandung
        rowNew11.getCell(15).value = results.skorPlakC; //Skor Plak C Ibu Mengandung
        rowNew11.getCell(16).value = results.skorPlakE; //Skor Plak E Ibu Mengandung
        rowNew11.getCell(17).value = results.skorGIS0; //Skor GIS 0 Ibu Mengandung
        rowNew11.getCell(18).value = results.skorGIS1; //Skor GIS 1 Ibu Mengandung
        rowNew11.getCell(19).value = results.skorGIS2; //Skor GIS 2 Ibu Mengandung
        rowNew11.getCell(20).value = results.skorGIS3; //Skor GIS 3 Ibu Mengandung
        rowNew11.getCell(21).value = results.skorBPE0; //Skor BPE 0 Ibu Mengandung
        rowNew11.getCell(22).value = results.skorBPE1; //Skor BPE 1 Ibu Mengandung
        rowNew11.getCell(23).value = results.skorBPE2; //Skor BPE 2 Ibu Mengandung
        rowNew11.getCell(24).value = results.skorBPE3; //Skor BPE 3 Ibu Mengandung
        rowNew11.getCell(25).value = results.skorBPE4; //Skor BPE 4 Ibu Mengandung
        rowNew11.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = results.0) Ibu Mengandung
        rowNew11.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Ibu Mengandung
        rowNew11.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Ibu Mengandung
        rowNew11.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Ibu Mengandung
        rowNew11.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Ibu Mengandung
        rowNew11.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Ibu Mengandung
        rowNew11.getCell(33).value = results.muridBaruPerluFS; //Murid Baru Perlu Sealan Fisur Ibu Mengandung
        rowNew11.getCell(34).value = results.gigiBaruPerluFS; //Gigi Baru Perlu Sealan Fisur Ibu Mengandung
        rowNew11.getCell(35).value = results.muridBaruTelahFS; //Murid Baru Telah Sealan Fisur Ibu Mengandung
        rowNew11.getCell(36).value = results.gigiBaruTelahFS; //Gigi Baru Telah Sealan Fisur Ibu Mengandung
        rowNew11.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Ibu Mengandung
        rowNew11.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Ibu Mengandung
        rowNew11.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Ibu Mengandung
        rowNew11.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Ibu Mengandung
        rowNew11.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Ibu Mengandung
        rowNew11.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Ibu Mengandung
        rowNew11.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Ibu Mengandung
        rowNew11.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Ibu Mengandung
        rowNew11.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Ibu Mengandung
        rowNew11.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Ibu Mengandung
        rowNew11.getCell(48).value = results.penskaleran; //Penskelaran Ibu Mengandung
        rowNew11.getCell(49).value = results.txPerio; //Rawatan Periodontik Ibu Mengandung
        rowNew11.getCell(50).value = results.txEndo; //Rawatan Endodontik Ibu Mengandung
        rowNew11.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Ibu Mengandung
        rowNew11.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Ibu Mengandung
        rowNew11.getCell(53).value = results.abses; //Abses Ibu Mengandung
        rowNew11.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Ibu Mengandung
        rowNew11.getCell(55).value = results.fracture; //Fraktur Ibu Mengandung
        rowNew11.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Ibu Mengandung
        rowNew11.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Ibu Mengandung
        rowNew11.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Ibu Mengandung
        rowNew11.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Ibu Mengandung
        rowNew11.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Ibu Mengandung
        rowNew11.getCell(61).value = results.lainLain; //lain-lain Ibu Mengandung
        rowNew11.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Ibu Mengandung
        rowNew11.getCell(63).value = results.caseCompleted; //kes selesai Ibu Mengandung
        rowNew11.getCell(64).value = results.lowCRA; //rendah CRA Ibu Mengandung
        rowNew11.getCell(65).value = results.moderateCRA; //sederhana CRA Ibu Mengandung
        rowNew11.getCell(66).value = results.highCRA; //tinggi CRA Ibu Mengandung
        rowNew11.commit();

        let rowNew12 = worksheet.getRow(30);
        rowNew12.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Ibu Mengandung
        rowNew12.getCell(33).value = results.muridUlanganPerluFS; //Murid Ulangan Perlu Sealan Fisur Ibu Mengandung
        rowNew12.getCell(34).value = results.gigiUlanganPerluFS; //Gigi Ulangan Perlu Sealan Fisur Ibu Mengandung
        rowNew12.getCell(35).value = results.muridUlanganTelahFS; //Murid Ulangan Telah Sealan Fisur Ibu Mengandung
        rowNew12.getCell(36).value = results.gigiUlanganTelahFS; //Gigi Ulangan Telah Sealan Fisur Ibu Mengandung
        rowNew12.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Ibu Mengandung
        rowNew12.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Ibu Mengandung
        rowNew12.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Ibu Mengandung
        rowNew12.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Ibu Mengandung
        rowNew12.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Ibu Mengandung
        rowNew12.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Ibu Mengandung
        rowNew12.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Ibu Mengandung
        rowNew12.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Ibu Mengandung
        rowNew12.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Ibu Mengandung
        rowNew12.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Ibu Mengandung
        rowNew12.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Ibu Mengandung
        rowNew12.commit();

        //Orang Dewasa RETEN 
        let rowNew13 = worksheet.getRow(31);
        rowNew13.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Orang Dewasa
        rowNew13.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Orang Dewasa
        rowNew13.getCell(4).value = results.dStatusdfx; //d Status dfx Orang Dewasa
        rowNew13.getCell(5).value = results.fStatusdfx; //f Status dfx Orang Dewasa
        rowNew13.getCell(6).value = results.xStatusdfx; //x Status dfx Orang Dewasa
        rowNew13.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Orang Dewasa
        rowNew13.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Orang Dewasa
        rowNew13.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Orang Dewasa
        rowNew13.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Orang Dewasa
        rowNew13.getCell(14).value = results.skorPlakA; //Skor Plak A Orang Dewasa
        rowNew13.getCell(15).value = results.skorPlakC; //Skor Plak C Orang Dewasa
        rowNew13.getCell(16).value = results.skorPlakE; //Skor Plak E Orang Dewasa
        rowNew13.getCell(17).value = results.skorGIS0; //Skor GIS 0 Orang Dewasa
        rowNew13.getCell(18).value = results.skorGIS1; //Skor GIS 1 Orang Dewasa
        rowNew13.getCell(19).value = results.skorGIS2; //Skor GIS 2 Orang Dewasa
        rowNew13.getCell(20).value = results.skorGIS3; //Skor GIS 3 Orang Dewasa
        rowNew13.getCell(21).value = results.skorBPE0; //Skor BPE 0 Orang Dewasa
        rowNew13.getCell(22).value = results.skorBPE1; //Skor BPE 1 Orang Dewasa
        rowNew13.getCell(23).value = results.skorBPE2; //Skor BPE 2 Orang Dewasa
        rowNew13.getCell(24).value = results.skorBPE3; //Skor BPE 3 Orang Dewasa
        rowNew13.getCell(25).value = results.skorBPE4; //Skor BPE 4 Orang Dewasa
        rowNew13.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = results.0) Orang Dewasa
        rowNew13.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Orang Dewasa
        rowNew13.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Orang Dewasa
        rowNew13.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Orang Dewasa
        rowNew13.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Orang Dewasa
        rowNew13.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Orang Dewasa
        rowNew13.getCell(33).value = results.muridBaruPerluFS; //Murid Baru Perlu Sealan Fisur Orang Dewasa
        rowNew13.getCell(34).value = results.gigiBaruPerluFS; //Gigi Baru Perlu Sealan Fisur Orang Dewasa
        rowNew13.getCell(35).value = results.muridBaruTelahFS; //Murid Baru Telah Sealan Fisur Orang Dewasa
        rowNew13.getCell(36).value = results.gigiBaruTelahFS; //Gigi Baru Telah Sealan Fisur Orang Dewasa
        rowNew13.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Orang Dewasa
        rowNew13.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Orang Dewasa
        rowNew13.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Orang Dewasa
        rowNew13.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Orang Dewasa
        rowNew13.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Orang Dewasa
        rowNew13.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Orang Dewasa
        rowNew13.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Orang Dewasa
        rowNew13.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Orang Dewasa
        rowNew13.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Orang Dewasa
        rowNew13.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Orang Dewasa
        rowNew13.getCell(48).value = results.penskaleran; //Penskelaran Orang Dewasa
        rowNew13.getCell(49).value = results.txPerio; //Rawatan Periodontik Orang Dewasa
        rowNew13.getCell(50).value = results.txEndo; //Rawatan Endodontik Orang Dewasa
        rowNew13.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Orang Dewasa
        rowNew13.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Orang Dewasa
        rowNew13.getCell(53).value = results.abses; //Abses Orang Dewasa
        rowNew13.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Orang Dewasa
        rowNew13.getCell(55).value = results.fracture; //Fraktur Orang Dewasa
        rowNew13.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Orang Dewasa
        rowNew13.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Orang Dewasa
        rowNew13.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Orang Dewasa
        rowNew13.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Orang Dewasa
        rowNew13.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Orang Dewasa
        rowNew13.getCell(61).value = results.lainLain; //lain-lain Orang Dewasa
        rowNew13.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Orang Dewasa
        rowNew13.getCell(63).value = results.caseCompleted; //kes selesai Orang Dewasa
        rowNew13.getCell(64).value = results.lowCRA; //rendah CRA Orang Dewasa
        rowNew13.getCell(65).value = results.moderateCRA; //sederhana CRA Orang Dewas
        rowNew13.commit();

        let rowNew14 = worksheet.getRow(32);
        rowNew14.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Orang Dewasa
        rowNew14.getCell(33).value = results.muridUlanganPerluFS; //Murid Ulangan Perlu Sealan Fisur Orang Dewasa
        rowNew14.getCell(34).value = results.gigiUlanganPerluFS; //Gigi Ulangan Perlu Sealan Fisur Orang Dewasa
        rowNew14.getCell(35).value = results.muridUlanganTelahFS; //Murid Ulangan Telah Sealan Fisur Orang Dewasa
        rowNew14.getCell(36).value = results.gigiUlanganTelahFS; //Gigi Ulangan Telah Sealan Fisur Orang Dewasa
        rowNew14.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Orang Dewasa
        rowNew14.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Orang Dewasa
        rowNew14.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Orang Dewasa
        rowNew14.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Orang Dewasa
        rowNew14.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Orang Dewasa
        rowNew14.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Orang Dewasa
        rowNew14.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Orang Dewasa
        rowNew14.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Orang Dewasa
        rowNew14.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Orang Dewasa
        rowNew14.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Orang Dewasa
        rowNew14.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Orang Dewasa
        rowNew14.commit();

        //Warga Emas RETEN 
        let rowNew15 = worksheet.getRow(33);
        rowNew15.getCell(2).value = results.kedatanganBaru; //Pesakit Baru Warga Emas
        rowNew15.getCell(3).value = results.kedatanganUlangan; //Pesakit Ulangan Warga Emas
        rowNew15.getCell(4).value = results.dStatusdfx; //d Status dfx Warga Emas
        rowNew15.getCell(5).value = results.fStatusdfx; //f Status dfx Warga Emas
        rowNew15.getCell(6).value = results.xStatusdfx; //x Status dfx Warga Emas
        rowNew15.getCell(8).value = results.dStatusDMFX; //dStatusDMFX Warga Emas
        rowNew15.getCell(9).value = results.mStatusDMFX; //mStatusDMFX Warga Emas
        rowNew15.getCell(10).value = results.fStatusDMFX; //fStatusDMFX Warga Emas
        rowNew15.getCell(11).value = results.xStatusDMFX; //xStatusDMFX Warga Emas
        rowNew15.getCell(14).value = results.skorPlakA; //Skor Plak A Warga Emas
        rowNew15.getCell(15).value = results.skorPlakC; //Skor Plak C Warga Emas
        rowNew15.getCell(16).value = results.skorPlakE; //Skor Plak E Warga Emas
        rowNew15.getCell(17).value = results.skorGIS0; //Skor GIS 0 Warga Emas
        rowNew15.getCell(18).value = results.skorGIS1; //Skor GIS 1 Warga Emas
        rowNew15.getCell(19).value = results.skorGIS2; //Skor GIS 2 Warga Emas
        rowNew15.getCell(20).value = results.skorGIS3; //Skor GIS 3 Warga Emas
        rowNew15.getCell(21).value = results.skorBPE0; //Skor BPE 0 Warga Emas
        rowNew15.getCell(22).value = results.skorBPE1; //Skor BPE 1 Warga Emas
        rowNew15.getCell(23).value = results.skorBPE2; //Skor BPE 2 Warga Emas
        rowNew15.getCell(24).value = results.skorBPE3; //Skor BPE 3 Warga Emas
        rowNew15.getCell(25).value = results.skorBPE4; //Skor BPE 4 Warga Emas
        rowNew15.getCell(26).value = results.dmfxEqualZero; //BK (DMFX = results.0) Warga Emas
        rowNew15.getCell(27).value = results.tpr; //Tidak Perlu Rawatan (TPR) Warga Emas
        rowNew15.getCell(28).value = results.traumaTSL; //Trauma Tooth Surface Loss (TSL) Warga Emas
        rowNew15.getCell(29).value = results.traumaTisuLembut; //Trauma Tisu Lembut Warga Emas
        rowNew15.getCell(30).value = results.traumaTisuKeras; //Trauma Tisu Keras Warga Emas
        rowNew15.getCell(32).value = results.sapuanFluoridaBaru; //Sapuan Fluorida Baru Warga Emas
        rowNew15.getCell(33).value = results.muridBaruPerluFS; //Murid Baru Perlu Sealan Fisur Warga Emas
        rowNew15.getCell(34).value = results.gigiBaruPerluFS; //Gigi Baru Perlu Sealan Fisur Warga Emas
        rowNew15.getCell(35).value = results.muridBaruTelahFS; //Murid Baru Telah Sealan Fisur Warga Emas
        rowNew15.getCell(36).value = results.gigiBaruTelahFS; //Gigi Baru Telah Sealan Fisur Warga Emas
        rowNew15.getCell(37).value = results.tampalanAntGdBaru; //Anterior Tampalan Sewarna GD baru Warga Emas
        rowNew15.getCell(38).value = results.tampalanAntGkBaru; //Anterior Tampalan Sewarna GK baru Warga Emas
        rowNew15.getCell(39).value = results.tampalanPostGdBaru; //Posterior Tampalan Sewarna GD baru Warga Emas
        rowNew15.getCell(40).value = results.tampalanPostGkBaru; //Posterior Tampalan Sewarna GK baru Warga Emas
        rowNew15.getCell(41).value = results.tampalanPostAmgGdBaru; //Posterior Tampalan Amalgam GD Baru Warga Emas
        rowNew15.getCell(42).value = results.tampalanPostAmgGkBaru;//Posterior Tampalan Amalgam GD Baru Warga Emas
        rowNew15.getCell(43).value = results.crownBridgeInlayBaru; //Crown Bridge Inlay baru Warga Emas
        rowNew15.getCell(45).value = results.cabutanGd; //Cabutan Gigi Desidus Warga Emas
        rowNew15.getCell(46).value = results.cabutanGk; //Cabutan Gigi Kekal Warga Emas
        rowNew15.getCell(47).value = results.komplikasiAfterXn; //Komplikasi Selepas Cabutan Warga Emas
        rowNew15.getCell(48).value = results.penskaleran; //Penskelaran Warga Emas
        rowNew15.getCell(49).value = results.txPerio; //Rawatan Periodontik Warga Emas
        rowNew15.getCell(50).value = results.txEndo; //Rawatan Endodontik Warga Emas
        rowNew15.getCell(51).value = results.txOrtho; //Rawatan Ortodontik Warga Emas
        rowNew15.getCell(52).value = results.caseOMOP; //Kes Perubatan Mulut Warga Emas
        rowNew15.getCell(53).value = results.abses; //Abses Warga Emas
        rowNew15.getCell(54).value = results.surgikalXn; //Cabutan Surgikal Warga Emas
        rowNew15.getCell(55).value = results.fracture; //Fraktur Warga Emas
        rowNew15.getCell(56).value = results.otherSurgicalCase; //Kes Surgical yang Lain Warga Emas
        rowNew15.getCell(57).value = results.fullDentureBaruByUnit; //Full denture Baru (Unit) Warga Emas
        rowNew15.getCell(58).value = results.bilPesakitCDbaru; //Full denture Baru (patient) Warga Emas
        rowNew15.getCell(59).value = results.rpdBaruByUnit; //RPD Baru (unit) Warga Emas
        rowNew15.getCell(60).value = results.bilPesakitRPDbaru; //RPD baru (patient) Warga Emas
        rowNew15.getCell(61).value = results.lainLain; //lain-lain Warga Emas
        rowNew15.getCell(62).value = results.bilXRAYdiambil; //Bil X-ray diambil Warga Emas
        rowNew15.getCell(63).value = results.caseCompleted; //kes selesai Warga Emas
        rowNew15.getCell(64).value = results.lowCRA; //rendah CRA Warga Emas
        rowNew15.getCell(65).value = results.moderateCRA; //sederhana CRA Warga Emas
        rowNew15.getCell(66).value = results.highCRA; //tinggi CRA Warga Emas
        rowNew15.commit();
        
        let rowNew16 = worksheet.getRow(34);
        rowNew16.getCell(32).value = results.sapuanFluoridaUlangan; //Sapuan Fluorida Ulangan Warga Emas
        rowNew16.getCell(33).value = results.muridUlanganPerluFS; //Murid Ulangan Perlu Sealan Fisur Warga Emas
        rowNew16.getCell(34).value = results.gigiUlanganPerluFS; //Gigi Ulangan Perlu Sealan Fisur Warga Emas
        rowNew16.getCell(35).value = results.muridUlanganTelahFS; //Murid Ulangan Telah Sealan Fisur Warga Emas
        rowNew16.getCell(36).value = results.gigiUlanganTelahFS; //Gigi Ulangan Telah Sealan Fisur Warga Emas
        rowNew16.getCell(37).value = results.tampalanAntGdUlangan; //Anterior Tampalan Sewarna GD ulangan Warga Emas
        rowNew16.getCell(38).value = results.tampalanAntGkUlangan; //Anterior Tampalan Sewarna GK ulangan Warga Emas
        rowNew16.getCell(39).value = results.tampalanPostGdUlangan; //Posterior Tampalan Sewarna GD ulangan Warga Emas
        rowNew16.getCell(40).value = results.tampalanPostGkUlangan; //Posterior Tampalan Sewarna GK Ulangan Warga Emas
        rowNew16.getCell(41).value = results.tampalanPostAmgGdUlangan; //Posterior Tampalan Amalgam GD Ulangan Warga Emas
        rowNew16.getCell(42).value = results.tampalanPostAmgGkUlangan; //Posteiror Tampalan Amalgam GK Ulangan Warga Emas
        rowNew16.getCell(43).value = results.crownBridgeInlayUlangan; //crownBridgeInlayUlangan Warga Emas
        rowNew16.getCell(57).value = results.fullDentureUlanganByUnit; //Full denture Ulangan (Unit) Warga Emas
        rowNew16.getCell(58).value = results.bilPesakitCDulangan; //Full denture Ulangan (patient) Warga Emas
        rowNew16.getCell(59).value = results.rpdUlanganByUnit; //RPD Ulangan (unit) Warga Emas
        rowNew16.getCell(60).value = results.bilPesakitRPDulangan; //RPD ulangan (patient) Warga Emas
        rowNew16.commit();

        let newfile = results.path.join(__dirname, "..", "public", "exports", "test-OA.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPGPR201 = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PGPR201.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGPR 201');

        //Reten PGPR 201 Coding 
        //Bawah 1 Tahun           
        let rowNew = worksheet.getRow(14);
        rowNew.getCell(2).value = results.baruLMG; //LMG Baru Bawah 1 Tahun 
        rowNew.getCell(3).value = results.ulanganLMG; //LMG Ulangan Bawah 1 Tahun 
        rowNew.getCell(4).value = results.baruCeramah; //Ceramah Baru Bawah 1 Tahun 
        rowNew.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan Bawah 1 Tahun
        rowNew.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel Bawah 1 Tahun
        rowNew.getCell(7).value = results.mainPeranan; //Main Peranan Bawah 1 Tahun
        rowNew.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka Bawah 1 Tahun
        rowNew.getCell(9).value = results.bercerita; //Bercerita Bawah 1 Tahun
        rowNew.getCell(10).value = results.kanserMulut; //Kanser Mulut Bawah 1 Tahun
        rowNew.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance Bawah 1 Tahun
        rowNew.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi  Bawah 1 Tahun
        rowNew.getCell(13).value = results.adviceOHE; //Advice OHE Bawah 1 Tahun
        rowNew.getCell(14).value = results.adviceDiet; //Advice Diet Bawah 1 Tahun
        rowNew.commit();

        //Antara 1 hingga 4 tahun  	
        let rowNew2 = worksheet.getRow(15);
        rowNew2.getCell(2).value = results.baruLMG; //LMG Baru 1 - 4 tahun 
        rowNew2.getCell(3).value = results.ulanganLMG; //LMG Ulangan 1 - 4 tahun 
        rowNew2.getCell(4).value = results.baruCeramah; //Ceramah Baru 1 - 4 tahun 
        rowNew2.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 1 - 4 tahun
        rowNew2.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 1 - 4 tahun
        rowNew2.getCell(7).value = results.mainPeranan; //Main Peranan 1 - 4 tahun
        rowNew2.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 1 - 4 tahun
        rowNew2.getCell(9).value = results.bercerita; //Bercerita 1 - 4 tahun
        rowNew2.getCell(10).value = results.kanserMulut; //Kanser Mulut 1 - 4 tahun
        rowNew2.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 1 - 4 tahun
        rowNew2.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi  1 - 4 tahun
        rowNew2.getCell(13).value = results.adviceOHE; //Advice OHE 1 - 4 tahun
        rowNew2.getCell(14).value = results.adviceDiet; //Advice Diet Antara 1 - 4 tahun
        rowNew2.commit();

        //Antara 5 hingga 6 tahun  	
        let rowNew3 = worksheet.getRow(16);
        rowNew3.getCell(2).value = results.baruLMG; //LMG Baru 5 - 6 tahun 
        rowNew3.getCell(3).value = results.ulanganLMG; //LMG Ulangan 5 - 6 tahun 
        rowNew3.getCell(4).value = results.baruCeramah; //Ceramah Baru 5 - 6 tahun 
        rowNew3.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 5 - 6 tahun
        rowNew3.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 5 - 6 tahun
        rowNew3.getCell(7).value = results.mainPeranan; //Main Peranan 5 - 6 tahun
        rowNew3.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 5 - 6 tahun
        rowNew3.getCell(9).value = results.bercerita; //Bercerita 5 - 6 tahun
        rowNew3.getCell(10).value = results.kanserMulut; //Kanser Mulut 5 - 6 tahun
        rowNew3.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 5 - 6 tahun
        rowNew3.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi  5 - 6 tahun
        rowNew3.getCell(13).value = results.adviceOHE; //Advice OHE 5 - 6 tahun
        rowNew3.getCell(14).value = results.adviceDiet; //Advice Diet 5 - 6 tahun
        rowNew3.commit();

        //Antara 7 hingga 9 tahun 	
        let rowNew4 = worksheet.getRow(17);
        rowNew4.getCell(2).value = results.baruLMG; //LMG Baru 7 - 9 tahun 
        rowNew4.getCell(3).value = results.ulanganLMG; //LMG Ulangan 7 - 9 tahun 
        rowNew4.getCell(4).value = results.baruCeramah; //Ceramah Baru 7 - 9 tahun 
        rowNew4.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 7 - 9 tahun
        rowNew4.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 7 - 9 tahun
        rowNew4.getCell(7).value = results.mainPeranan; //Main Peranan 7 - 9 tahun
        rowNew4.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 7 - 9 tahun
        rowNew4.getCell(9).value = results.bercerita; //Bercerita 7 - 9 tahun
        rowNew4.getCell(10).value = results.kanserMulut; //Kanser Mulut 7 - 9 tahun
        rowNew4.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 7 - 9 tahun
        rowNew4.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 7 - 9 tahun
        rowNew4.getCell(13).value = results.adviceOHE; //Advice OHE 7 - 9 tahun
        rowNew4.getCell(14).value = results.adviceDiet; //Advice Diet 7 - 9 tahun
        rowNew4.commit();

        //Antara 10 hingga 12 tahun  	
        let rowNew5 = worksheet.getRow(18);
        rowNew5.getCell(2).value = results.baruLMG; //LMG Baru 10 - 12 tahun 
        rowNew5.getCell(3).value = results.ulanganLMG; //LMG Ulangan 10 - 12 tahun 
        rowNew5.getCell(4).value = results.baruCeramah; //Ceramah Baru 10 - 12 tahun 
        rowNew5.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 10 - 12 tahun
        rowNew5.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 10 - 12 tahun
        rowNew5.getCell(7).value = results.mainPeranan; //Main Peranan 10 - 12 tahun
        rowNew5.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 10 - 12 tahun
        rowNew5.getCell(9).value = results.bercerita; //Bercerita 10 - 12 tahun
        rowNew5.getCell(10).value = results.kanserMulut; //Kanser Mulut 10 - 12 tahun
        rowNew5.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 10 - 12 tahun
        rowNew5.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 10 - 12 tahun
        rowNew5.getCell(13).value = results.adviceOHE; //Advice OHE 10 - 12 tahun
        rowNew5.getCell(14).value = results.adviceDiet; //Advice Diet 10 - 12 tahun
        rowNew5.commit();

        //Antara 13 hingga 14 tahun 	
        let rowNew6 = worksheet.getRow(19);
        rowNew6.getCell(2).value = results.baruLMG; //LMG Baru 13 - 14 tahun 
        rowNew6.getCell(3).value = results.ulanganLMG; //LMG Ulangan 13 - 14 tahun 
        rowNew6.getCell(4).value = results.baruCeramah; //Ceramah Baru 13 - 14 tahun 
        rowNew6.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 13 - 14 tahun
        rowNew6.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 13 - 14 tahun
        rowNew6.getCell(7).value = results.mainPeranan; //Main Peranan 13 - 14 tahun
        rowNew6.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 13 - 14 tahun
        rowNew6.getCell(9).value = results.bercerita; //Bercerita 13 - 14 tahun
        rowNew6.getCell(10).value = results.kanserMulut; //Kanser Mulut 13 - 14 tahun
        rowNew6.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 13 - 14 tahun
        rowNew6.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 13 - 14 tahun
        rowNew6.getCell(13).value = results.adviceOHE; //Advice OHE 13 - 14 tahun
        rowNew6.getCell(14).value = results.adviceDiet; //Advice Diet 13 - 14 tahun
        rowNew6.commit();

        //Antara 15 hingga 17 tahun        
        let rowNew7 = worksheet.getRow(20);
        rowNew7.getCell(2).value = results.baruLMG; //LMG Baru 15 - 17 tahun 
        rowNew7.getCell(3).value = results.ulanganLMG; //LMG Ulangan 15 - 17 tahun 
        rowNew7.getCell(4).value = results.baruCeramah; //Ceramah Baru 15 - 17 tahun 
        rowNew7.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 15 - 17 tahun
        rowNew7.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 15 - 17 tahun
        rowNew7.getCell(7).value = results.mainPeranan; //Main Peranan 15 - 17 tahun
        rowNew7.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 15 - 17 tahun
        rowNew7.getCell(9).value = results.bercerita; //Bercerita 15 - 17 tahun
        rowNew7.getCell(10).value = results.kanserMulut; //Kanser Mulut 15 - 17 tahun
        rowNew7.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 15 - 17 tahun
        rowNew7.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 15 - 17 tahun
        rowNew7.getCell(13).value = results.adviceOHE; //Advice OHE 15 - 17 tahun
        rowNew7.getCell(14).value = results.adviceDiet; //Advice Diet 15 - 17 tahun
        rowNew7.commit();

        //Antara 18 hingga 19 tahun 	
        let rowNew8 = worksheet.getRow(21);
        rowNew8.getCell(2).value = results.baruLMG; //LMG Baru 18 - 19 tahun 
        rowNew8.getCell(3).value = results.ulanganLMG; //LMG Ulangan 18 - 19 tahun 
        rowNew8.getCell(4).value = results.baruCeramah; //Ceramah Baru 18 - 19 tahun 
        rowNew8.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 18 - 19 tahun
        rowNew8.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 18 - 19 tahun
        rowNew8.getCell(7).value = results.mainPeranan; //Main Peranan 18 - 19 tahun
        rowNew8.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 18 - 19 tahun
        rowNew8.getCell(9).value = results.bercerita; //Bercerita 18 - 19 tahun
        rowNew8.getCell(10).value = results.kanserMulut; //Kanser Mulut 18 - 19 tahun
        rowNew8.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 18 - 19 tahun
        rowNew8.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 18 - 19 tahun
        rowNew8.getCell(13).value = results.adviceOHE; //Advice OHE 18 - 19 tahun
        rowNew8.getCell(14).value = results.adviceDiet; //Advice Diet 18 - 19 tahun
        rowNew8.commit();

        //Antara 20 hingga 29 tahun 	
        let rowNew9 = worksheet.getRow(22);
        rowNew9.getCell(2).value = results.baruLMG; //LMG Baru 20 - 29 Tahun 
        rowNew9.getCell(3).value = results.ulanganLMG; //LMG Ulangan 20 - 29 Tahun 
        rowNew9.getCell(4).value = results.baruCeramah; //Ceramah Baru 20 - 29 Tahun 
        rowNew9.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 20 - 29 Tahun
        rowNew9.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 20 - 29 Tahun
        rowNew9.getCell(7).value = results.mainPeranan; //Main Peranan 20 - 29 Tahun
        rowNew9.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 20 - 29 Tahun
        rowNew9.getCell(9).value = results.bercerita; //Bercerita 20 - 29 Tahun
        rowNew9.getCell(10).value = results.kanserMulut; //Kanser Mulut 20 - 29 Tahun
        rowNew9.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 20 - 29 Tahun
        rowNew9.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 20 - 29 Tahun
        rowNew9.getCell(13).value = results.adviceOHE; //Advice OHE 20 - 29 Tahun
        rowNew9.getCell(14).value = results.adviceDiet; //Advice Diet 20 - 29 Tahun
        rowNew9.commit();

        //Antara 30 hingga 49 tahun        
        let rowNew10 = worksheet.getRow(23);
        rowNew10.getCell(2).value = results.baruLMG; //LMG Baru 30 - 49 Tahun 
        rowNew10.getCell(3).value = results.ulanganLMG; //LMG Ulangan 30 - 49 Tahun 
        rowNew10.getCell(4).value = results.baruCeramah; //Ceramah Baru 30 - 49 Tahun 
        rowNew10.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 30 - 49 Tahun
        rowNew10.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 30 - 49 Tahun
        rowNew10.getCell(7).value = results.mainPeranan; //Main Peranan 30 - 49 Tahun
        rowNew10.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 30 - 49 Tahun
        rowNew10.getCell(9).value = results.bercerita; //Bercerita 30 - 49 Tahun
        rowNew10.getCell(10).value = results.kanserMulut; //Kanser Mulut 30 - 49 Tahun
        rowNew10.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 30 - 49 Tahun
        rowNew10.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 30 - 49 Tahun
        rowNew10.getCell(13).value = results.adviceOHE; //Advice OHE 30 - 49 Tahun
        rowNew10.getCell(14).value = results.adviceDiet; //Advice Diet 30 - 49 Tahun
        rowNew10.commit();

        //Antara 50 hingga 59 tahun	
        let rowNew11 = worksheet.getRow(24);
        rowNew11.getCell(2).value = results.baruLMG; //LMG Baru 50 - 59 Tahun 
        rowNew11.getCell(3).value = results.ulanganLMG; //LMG Ulangan 50 - 59 Tahun 
        rowNew11.getCell(4).value = results.baruCeramah; //Ceramah Baru 50 - 59 Tahun 
        rowNew11.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 50 - 59 Tahun
        rowNew11.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 50 - 59 Tahun
        rowNew11.getCell(7).value = results.mainPeranan; //Main Peranan 50 - 59 Tahun
        rowNew11.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 50 - 59 Tahun
        rowNew11.getCell(9).value = results.bercerita; //Bercerita 50 - 59 Tahun
        rowNew11.getCell(10).value = results.kanserMulut; //Kanser Mulut 50 - 59 Tahun
        rowNew11.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 50 - 59 Tahun
        rowNew11.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 50 - 59 Tahun
        rowNew11.getCell(13).value = results.adviceOHE; //Advice OHE 50 - 59 Tahun
        rowNew11.getCell(14).value = results.adviceDiet; //Advice Diet 50 - 59 Tahun
        rowNew11.commit();

        //60 Tahun dan ke atas	
        let rowNew12 = worksheet.getRow(25);
        rowNew12.getCell(2).value = results.baruLMG; //LMG Baru 60 tahun dan ke atas 
        rowNew12.getCell(3).value = results.ulanganLMG; //LMG Ulangan 60 tahun dan ke atas 
        rowNew12.getCell(4).value = results.baruCeramah; //Ceramah Baru 60 tahun dan ke atas 
        rowNew12.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan 60 tahun dan ke atas
        rowNew12.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel 60 tahun dan ke atas
        rowNew12.getCell(7).value = results.mainPeranan; //Main Peranan 60 tahun dan ke atas
        rowNew12.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka 60 tahun dan ke atas
        rowNew12.getCell(9).value = results.bercerita; //Bercerita 60 tahun dan ke atas
        rowNew12.getCell(10).value = results.kanserMulut; //Kanser Mulut 60 tahun dan ke atas
        rowNew12.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance 60 tahun dan ke atas
        rowNew12.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi 60 tahun dan ke atas
        rowNew12.getCell(13).value = results.adviceOHE; //Advice OHE 60 tahun dan ke atas
        rowNew12.getCell(14).value = results.adviceDiet; //Advice Diet 60 tahun dan ke atas
        rowNew12.commit();

        //Ibu Mengandung          
        let rowNew13 = worksheet.getRow(27);
        rowNew13.getCell(2).value = results.baruLMG; //LMG Baru Ibu Mengandung 
        rowNew13.getCell(3).value = results.ulanganLMG; //LMG Ulangan Ibu Mengandung 
        rowNew13.getCell(4).value = results.baruCeramah; //Ceramah Baru Ibu Mengandung 
        rowNew13.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan Ibu Mengandung
        rowNew13.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel Ibu Mengandung
        rowNew13.getCell(7).value = results.mainPeranan; //Main Peranan Ibu Mengandung
        rowNew13.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka Ibu Mengandung
        rowNew13.getCell(9).value = results.bercerita; //Bercerita Ibu Mengandung
        rowNew13.getCell(10).value = results.kanserMulut; //Kanser Mulut Ibu Mengandung
        rowNew13.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance Ibu Mengandung
        rowNew13.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi Ibu Mengandung
        rowNew13.getCell(13).value = results.adviceOHE; //Advice OHE Ibu Mengandung
        rowNew13.getCell(14).value = results.adviceDiet; //Advice Diet Ibu Mengandung
        rowNew13.commit();

        //Orang Kurang Upaya	
        let rowNew14 = worksheet.getRow(28);
        rowNew14.getCell(2).value = results.baruLMG; //LMG Baru Orang Kurang Upaya 
        rowNew14.getCell(3).value = results.ulanganLMG; //LMG Ulangan Orang Kurang Upaya 
        rowNew14.getCell(4).value = results.baruCeramah; //Ceramah Baru Orang Kurang Upaya 
        rowNew14.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan Orang Kurang Upaya
        rowNew14.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel Orang Kurang Upaya
        rowNew14.getCell(7).value = results.mainPeranan; //Main Peranan Orang Kurang Upaya
        rowNew14.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka Orang Kurang Upaya
        rowNew14.getCell(9).value = results.bercerita; //Bercerita Orang Kurang Upaya
        rowNew14.getCell(10).value = results.kanserMulut; //Kanser Mulut Orang Kurang Upaya
        rowNew14.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance Orang Kurang Upaya
        rowNew14.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi Orang Kurang Upaya
        rowNew14.getCell(13).value = results.adviceOHE; //Advice OHE Orang Kurang Upaya
        rowNew14.getCell(14).value = results.adviceDiet; //Advice Diet Orang Kurang Upaya
        rowNew14.commit();

        //Guru Tadika 	
        let rowNew15 = worksheet.getRow(29);
        rowNew15.getCell(2).value = results.baruLMG; //LMG Baru Guru Tadika 
        rowNew15.getCell(3).value = results.ulanganLMG; //LMG Ulangan Guru Tadika 
        rowNew15.getCell(4).value = results.baruCeramah; //Ceramah Baru Guru Tadika 
        rowNew15.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan Guru Tadika
        rowNew15.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel Guru Tadika
        rowNew15.getCell(7).value = results.mainPeranan; //Main Peranan Guru Tadika
        rowNew15.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka Guru Tadika
        rowNew15.getCell(9).value = results.bercerita; //Bercerita Guru Tadika
        rowNew15.getCell(10).value = results.kanserMulut; //Kanser Mulut Guru Tadika
        rowNew15.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance Guru Tadika
        rowNew15.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi Guru Tadika
        rowNew15.getCell(13).value = results.adviceOHE; //Advice OHE Guru Tadika
        rowNew15.getCell(14).value = results.adviceDiet; //Advice Diet Guru Tadika
        rowNew15.commit();

        //Penjaga Warga Emas        
        let rowNew16 = worksheet.getRow(30);
        rowNew16.getCell(2).value = results.baruLMG; //LMG Baru Penjaga Warga Emas
        rowNew16.getCell(3).value = results.ulanganLMG; //LMG Ulangan Penjaga Warga Emas
        rowNew16.getCell(4).value = results.baruCeramah; //Ceramah Baru Penjaga Warga Emas
        rowNew16.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan Penjaga Warga Emas
        rowNew16.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel Penjaga Warga Emas
        rowNew16.getCell(7).value = results.mainPeranan; //Main Peranan Penjaga Warga Emas
        rowNew16.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka Penjaga Warga Emas
        rowNew16.getCell(9).value = results.bercerita; //Bercerita Penjaga Warga Emas
        rowNew16.getCell(10).value = results.kanserMulut; //Kanser Mulut Penjaga Warga Emas
        rowNew16.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance Penjaga Warga Emas
        rowNew16.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi Penjaga Warga Emas	
        rowNew16.getCell(13).value = results.adviceOHE; //Advice OHE Penjaga Warga Emas	
        rowNew16.getCell(14).value = results.adviceDiet; //Advice Diet Penjaga Warga Emas
        rowNew16.commit();

        //Penjaga PDK   	
        let rowNew17 = worksheet.getRow(31);
        rowNew17.getCell(2).value = results.baruLMG; //LMG Baru Penjaga PDK
        rowNew17.getCell(3).value = results.ulanganLMG; //LMG Ulangan Penjaga PDK
        rowNew17.getCell(4).value = results.baruCeramah; //Ceramah Baru Penjaga PDK
        rowNew17.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan Penjaga PDK
        rowNew17.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel Penjaga PDK	rowNew17.getCell(7).value = results.mainPeranan; //Main Peranan Penjaga PDK	rowNew17.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka Penjaga PDK	rowNew17.getCell(9).value = results.bercerita; //Bercerita Penjaga PDK
        rowNew17.getCell(10).value = results.kanserMulut; //Kanser Mulut Penjaga PDK	rowNew17.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance Penjaga PDK
        rowNew17.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi Penjaga PDK	
        rowNew17.getCell(13).value = results.adviceOHE; //Advice OHE Penjaga PDK	
        rowNew17.getCell(14).value = results.adviceDiet; //Advice Diet Penjaga PDK
        rowNew17.commit();

        //Penjaga Bukan PDK           
        let rowNew18 = worksheet.getRow(32);
        rowNew18.getCell(2).value = results.baruLMG; //LMG Baru Penjaga Bukan PDK
        rowNew18.getCell(3).value = results.ulanganLMG; //LMG Ulangan Penjaga Bukan PDK
        rowNew18.getCell(4).value = results.baruCeramah; //Ceramah Baru Penjaga Bukan PDK
        rowNew18.getCell(5).value = results.ulanganCeramah; //Ceramah Ulangan Penjaga Bukan PDK
        rowNew18.getCell(6).value = results.seminarKursusBengkel; //Kursus Seminar Bengkel Penjaga Bukan PDK	
        rowNew18.getCell(7).value = results.mainPeranan; //Main Peranan Penjaga Bukan PDK	
        rowNew18.getCell(8).value = results.pertunjukanBoneka; //Pertunjukan Boneka Penjaga Bukan PDK	
        rowNew18.getCell(9).value = results.bercerita; //Bercerita Penjaga Bukan PDK
        rowNew18.getCell(10).value = results.kanserMulut; //Kanser Mulut Penjaga Bukan PDK	
        rowNew18.getCell(11).value = results.anticipatoryGuidance; //Anticipatory Guidance Penjaga Bukan PDK
        rowNew18.getCell(12).value = results.advicePlakGigi; //Advice Plak Gigi Penjaga Bukan PDK	
        rowNew18.getCell(13).value = results.adviceOHE; //Advice OHE Penjaga Bukan PDK	
        rowNew18.getCell(14).value = results.adviceDiet; //Advice Diet Penjaga Bukan PDK 
        rowNew18.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-PGPR201.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPPIM03 = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PPIM03.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PPIM03');

        //Reten PPIM03
        //PPIM03 Pra Sekolah 5 Tahun           
        let rowNew = worksheet.getRow(13);
        rowNew.getCell(2).value = results.enrolmen; //Bil Enrolment Pra Sekolah 5 Tahun 
        rowNew.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Pra Sekolah 5 Tahun 
        rowNew.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Pra Sekolah 5 Tahun 
        rowNew.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Pra Sekolah 5 Tahun 
        rowNew.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Pra Sekolah 5 Tahun 
        rowNew.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Pra Sekolah 5 Tahun 
        rowNew.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Pra Sekolah 5 Tahun 
        rowNew.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Pra Sekolah 5 Tahun 
        rowNew.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Pra Sekolah 5 Tahun 
        rowNew.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Pra Sekolah 5 Tahun 
        rowNew.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Pra Sekolah 5 Tahun
        rowNew.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Pra Sekolah 5 Tahun
        rowNew.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Pra Sekolah 5 Tahun
        rowNew.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Pra Sekolah 5 Tahun
        rowNew.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Pra Sekolah 5 Tahun
        rowNew.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Pra Sekolah 5 Tahun
        rowNew.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Pra Sekolah 5 Tahun
        rowNew.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Pra Sekolah 5 Tahun
        rowNew.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Pra Sekolah 5 Tahun
        rowNew.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Pra Sekolah 5 Tahun
        rowNew.commit();

        //PPIM03 Pra Sekolah 6 Tahun
        let rowNew2 = worksheet.getRow(14);
        rowNew2.getCell(2).value = results.enrolmen; //Bil Enrolment Pra Sekolah 6 Tahun 
        rowNew2.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Pra Sekolah 6 Tahun 
        rowNew2.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Pra Sekolah 6 Tahun 
        rowNew2.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Pra Sekolah 6 Tahun 
        rowNew2.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Pra Sekolah 6 Tahun 
        rowNew2.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Pra Sekolah 6 Tahun 
        rowNew2.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Pra Sekolah 6 Tahun 
        rowNew2.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Pra Sekolah 6 Tahun 
        rowNew2.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Pra Sekolah 6 Tahun 
        rowNew2.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Pra Sekolah 6 Tahun 
        rowNew2.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Pra Sekolah 6 Tahun
        rowNew2.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Pra Sekolah 6 Tahun
        rowNew2.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Pra Sekolah 6 Tahun
        rowNew2.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Pra Sekolah 6 Tahun
        rowNew2.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Pra Sekolah 6 Tahun
        rowNew2.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Pra Sekolah 6 Tahun
        rowNew2.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Pra Sekolah 6 Tahun
        rowNew2.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Pra Sekolah 6 Tahun
        rowNew2.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Pra Sekolah 6 Tahun
        rowNew2.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Pra Sekolah 6 Tahun
        rowNew2.commit();

        //PPIM03 Darjah 1 Atau Tingkatan 1
        let rowNew3 = worksheet.getRow(15);
        rowNew3.getCell(2).value = results.enrolmen; //Bil Enrolment Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Darjah 1 Atau Tingkatan 1  
        rowNew3.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Darjah 1 Atau Tingkatan 1 
        rowNew3.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Darjah 1 Atau Tingkatan 1 
        rowNew3.commit();

        //PPIM03 Darjah 2 Atau Tingkatan 2
        let rowNew4 = worksheet.getRow(16);
        rowNew4.getCell(2).value = results.enrolmen; //Bil Enrolment Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Darjah 2 Atau Tingkatan 2 
        rowNew4.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Darjah 2 Atau Tingkatan 2
        rowNew4.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Darjah 2 Atau Tingkatan 2
        rowNew4.commit();
        
        //PPIM03 Darjah 3 Atau Tingkatan 3
        let rowNew5 = worksheet.getRow(17);
        rowNew5.getCell(2).value = results.enrolmen; //Bil Enrolment Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Darjah 3 Atau Tingkatan 3 
        rowNew5.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Darjah 3 Atau Tingkatan 3
        rowNew5.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Darjah 3 Atau Tingkatan 3
        rowNew5.commit();

        //PPIM03 Darjah 4 Atau Tingkatan 4
        let rowNew6 = worksheet.getRow(18);
        rowNew6.getCell(2).value = results.enrolmen; //Bil Enrolment Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Darjah 4 Atau Tingkatan 4 
        rowNew6.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Darjah 4 Atau Tingkatan 4
        rowNew6.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Darjah 4 Atau Tingkatan 4
        rowNew6.commit();

        //PPIM03 Darjah 5 Atau Tingkatan 5
        let rowNew7 = worksheet.getRow(19);
        rowNew7.getCell(2).value = results.enrolmen; //Bil Enrolment Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Darjah 5 Atau Tingkatan 5 
        rowNew7.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Darjah 5 Atau Tingkatan 5
        rowNew7.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Darjah 5 Atau Tingkatan 5
        rowNew7.commit();

        //PPIM03 Darjah 6 (Sekolah Rendah)
        let rowNew8 = worksheet.getRow(20);
        rowNew8.getCell(2).value = results.enrolmen; //Bil Enrolment Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Darjah 6 (Sekolah Rendah) 
        rowNew8.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Darjah 6 (Sekolah Rendah)
        rowNew8.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Darjah 6 (Sekolah Rendah)
        rowNew8.commit();

        //PPIM03 Peralihan
        let rowNew9 = worksheet.getRow(21);
        rowNew9.getCell(2).value = results.enrolmen; //Bil Enrolment Peralihan 
        rowNew9.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu Peralihan 
        rowNew9.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina Peralihan 
        rowNew9.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian Peralihan 
        rowNew9.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain Peralihan 
        rowNew9.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu Peralihan 
        rowNew9.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina Peralihan 
        rowNew9.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian Peralihan 
        rowNew9.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain Peralihan 
        rowNew9.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa Peralihan 
        rowNew9.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik Peralihan
        rowNew9.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha Peralihan
        rowNew9.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain Peralihan
        rowNew9.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi Peralihan
        rowNew9.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki Peralihan
        rowNew9.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan Peralihan
        rowNew9.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki Peralihan
        rowNew9.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan Peralihan
        rowNew9.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki Peralihan
        rowNew9.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan Peralihan
        rowNew9.commit();

        //PPIM03 KKI (SR & SM)
        let rowNew10 = worksheet.getRow(22);
        rowNew10.getCell(2).value = results.enrolmen; //Bil Enrolment KKI (SR & SM) 
        rowNew10.getCell(9).value = results.perokokLelakiMelayu; //Perokok Lelaki Melayu KKI (SR & SM) 
        rowNew10.getCell(10).value = results.perokokLelakiCina; //Perokok Lelaki Cina KKI (SR & SM) 
        rowNew10.getCell(11).value = results.perokokLelakiIndian; //Perokok Lelaki Indian KKI (SR & SM) 
        rowNew10.getCell(12).value = results.perokokLelakiLainLain; //Perokok Lelaki Lain-Lain KKI (SR & SM) 
        rowNew10.getCell(14).value = results.perokokPerempuanMelayu; //Perokok Perempuan Melayu KKI (SR & SM) 
        rowNew10.getCell(15).value = results.perokokPerempuanCina; //Perokok Perempuan Cina KKI (SR & SM) 
        rowNew10.getCell(16).value = results.perokokPerempuanIndian; //Perokok Perempuan Indian KKI (SR & SM) 
        rowNew10.getCell(17).value = results.perokokPerempuanLainLain; //Perokok Perempuan Lain-Lain KKI (SR & SM) 
        rowNew10.getCell(18).value = results.jenisRokokBiasa; //Jenis Rokok Biasa KKI (SR & SM) 
        rowNew10.getCell(19).value = results.jenisRokokElektronik; //Jenis Rokok Elektronik KKI (SR & SM)
        rowNew10.getCell(20).value = results.jenisRokokShisha; //Jenis Rokok Shisha KKI (SR & SM)
        rowNew10.getCell(21).value = results.jenisRokokLainLain; //Jenis Rokok Lain-lain KKI (SR & SM)
        rowNew10.getCell(22).value = results.bilDirujukUntukIntervensi; //Bil Dirujuk untuk Intervensi KKI (SR & SM)
        rowNew10.getCell(25).value = results.bekasPerokokLelaki; //Bekas Perokok Lelaki KKI (SR & SM)
        rowNew10.getCell(26).value = results.bekasPerokokPerempuan; //Bekas Perokok Perempuan KKI (SR & SM)
        rowNew10.getCell(29).value = results.perokokPasifLelaki; //Perokok Pasif Lelaki KKI (SR & SM)
        rowNew10.getCell(30).value = results.perokokPasifPerempuan; //Perokok Pasif Perempuan KKI (SR & SM)
        rowNew10.getCell(33).value = results.bukanPerokokLelaki; //Bukan Perokok Lelaki KKI (SR & SM)
        rowNew10.getCell(34).value = results.bukanPerokokPerempuan; //Bukan Perokok Perempuan KKI (SR & SM)
        rowNew10.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-PPIM03.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPG201A = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PG201A.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PG201A');

        //PG201A
        // Reten Sekolah (Darjah 1)
        let rowNew = worksheet.getRow(17);
        rowNew.getCell(2).value = results.kedatanganEnggan; //Kedatangan enggan (Darjah 1)
        rowNew.getCell(3).value = results.kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 1)
        rowNew.getCell(4).value = results.enrolmen; //Kedatangan enrolmen (Darjah 1)
        rowNew.getCell(5).value = results.kedatanganBaru; //Kedatangan baru (Darjah 1)
        rowNew.getCell(6).value = results.kedatanganUlangan; //Kedatangan ulangan (Darjah 1)
        rowNew.getCell(8).value = results.skorPlakA; //Kebersihan Mulut Skor A (Darjah 1)
        rowNew.getCell(9).value = results.dStatusdfx; //Karies Gigi Desidus (d) (Darjah 1) 
        rowNew.getCell(10).value = results.fStatusdfx; //Telah Ditampal Gigi Desidus (f) (Darjah 1) 
        rowNew.getCell(11).value = results.xStatusdfx; //Gigi Desidus Perlu Ditampal (x) (Darjah 1) 
        rowNew.getCell(13).value = results.eStatusDMFX; //Karies Awal Gigi Kekal (E) (Darjah 1) 
        rowNew.getCell(14).value = results.dStatusDMFX; //Karies Gigi Kekal (D) (Darjah 1) 
        rowNew.getCell(15).value = results.mStatusDMFX; //Gigi Kekal Telah Dicabut (M) (Darjah 1) 
        rowNew.getCell(16).value = results.fStatusDMFX; //Gigi Kekal Telah Ditampal (F) (Darjah 1) 
        rowNew.getCell(17).value = results.xStatusDMFX; //Jumlah DMFX (Darjah 1) 
        rowNew.getCell(19).value = results.gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 1) 
        rowNew.getCell(20).value = results.totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.0  (Darjah 1) 
        rowNew.getCell(21).value = results.eMoreThanZero; //E≥1 (ada karies awal) (Darjah 1) 
        rowNew.getCell(22).value = results.mbk; //Mulut Bebas Karies (MBK) (Darjah 1) 
        rowNew.getCell(23).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 (Darjah 1)
        rowNew.getCell(24).value = results.statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 1)
        rowNew.getCell(25).value = results.dfxEqualToZero; //dfx=0 (Darjah 1) 
        rowNew.getCell(26).value = results.mulutBebasGingivitis; //Mulut Bebas Gingivitis (MBG) (Darjah 1) 
        rowNew.getCell(27).value = results.tprICDAS; //TPR ICDAS (Darjah 1) 
        rowNew.getCell(28).value = results.kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 1) 
        rowNew.getCell(29).value = results.cleftAda; //cleft Ada (Darjah 1) 
        rowNew.getCell(30).value = results.cleftRujuk; //cleft Rujuk (Darjah 1) 
        rowNew.getCell(32).value = results.perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 1) 
        rowNew.getCell(33).value = results.perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 1) 
        rowNew.getCell(34).value = results.perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 1) 
        rowNew.getCell(35).value = results.perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 1) 
        rowNew.getCell(36).value = results.perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 1) 
        rowNew.getCell(37).value = results.perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 1) 
        rowNew.getCell(38).value = results.perluPRR1BGigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 1) 
        rowNew.getCell(39).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1) 
        rowNew.getCell(40).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1) 
        rowNew.getCell(41).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1) 
        rowNew.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1) 
        rowNew.getCell(43).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1) 
        rowNew.getCell(44).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1) 
        rowNew.getCell(46).value = results.telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 1) 
        rowNew.getCell(47).value = results.telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 1) 
        rowNew.getCell(48).value = results.telahFVMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 1) 
        rowNew.getCell(49).value = results.telahFVGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 1) 
        rowNew.getCell(50).value = results.telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 1) 
        rowNew.getCell(51).value = results.telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 1) 
        rowNew.getCell(52).value = results.telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 1) 
        rowNew.getCell(53).value = results.telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 1) 
        rowNew.getCell(54).value = results.telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 1) 
        rowNew.getCell(55).value = results.telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 1) 
        rowNew.getCell(56).value = results.telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 1) 
        rowNew.getCell(57).value = results.telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 1) 
        rowNew.getCell(59).value = results.cabutanGd; // Gigi Desidus Dicabut (Darjah 1)
        rowNew.getCell(60).value = results.cabutanGk; // Gigi Kekal Dicabut (Darjah 1) 
        rowNew.getCell(61).value = results.penskaleran; // Penskelaran (Darjah 1) 
        rowNew.getCell(62).value = results.caseCompleted; // Kes Selesai ICDAS (Darjah 1) 
        rowNew.getCell(63).value = results.skorGIS0; // GIS SKOR 0 (Darjah 1) 
        rowNew.getCell(64).value = results.skorGIS1; // GIS SKOR 1 (Darjah 1) 
        rowNew.getCell(65).value = results.skorGIS2; // GIS SKOR 2 (Darjah 1) 
        rowNew.getCell(66).value = results.skorGIS3; // GIS SKOR 3 (Darjah 1) 
        rowNew.getCell(68).value = results.traumaTSL; // Trauma Tooth Surface Loss (Darjah 1) 
        rowNew.getCell(69).value = results.traumaTisuLembut; // Trauma Tisu Lembut (Darjah 1) 
        rowNew.getCell(70).value = results.traumaTisuKeras;// Trauma Tisu Keras (Darjah 1)
        rowNew.getCell(72).value = results.pesakitBaruAdaFullDenture; // Pesakit baru Ada Full Denture (Darjah 1)
        rowNew.getCel(73).value = results.pesakitBaruAdaPartialDenture; // Pesakit baru Ada Partial Denture (Darjah 1)
        rowNew.getCell(74).value = results.pesakitBaruPerluFullDenture; // Pesakit baru Perlu Full Denture (Darjah 1)
        rowNew.getCell(75).value = results.pesakitBaruPerluPartialDenture; // Pesakit baru Perlu Partial Denture (Darjah 1)
        rowNew.commit();

        let rowNew2 = worksheet.getRow(18);
        rowNew2.getCell(8).value = results.skorPlakC; //Kebersihan Mulut Skor C (Darjah 1)
        rowNew2.commit();

        let rowNew3 = worksheet.getRow(19);
        rowNew3.getCell(8).value = results.skorPlakE; //Kebersihan Mulut Skor E (Darjah 1)
        rowNew3.getCell(33).value = results.perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 1) 
        rowNew3.getCell(35).value = results.perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 1) 
        rowNew3.getCell(36).value = results.perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 1) 
        rowNew3.getCell(37).value = results.perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 1) 
        rowNew3.getCell(38).value = results.perluPRR1BGigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 1)
        rowNew3.getCell(39).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1) 
        rowNew3.getCell(40).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1) 
        rowNew3.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1) 
        rowNew3.getCell(42).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1) 
        rowNew3.getCell(43).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1) 
        rowNew3.getCell(44).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1) 
        rowNew3.getCell(46).value = results.telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 1) 
        rowNew3.getCell(47).value = results.telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 1) 
        rowNew3.getCell(48).value = results.telahFVMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 1) 
        rowNew3.getCell(49).value = results.telahFVGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 1) 
        rowNew3.getCell(50).value = results.telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 1) 
        rowNew3.getCell(51).value = results.telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 1) 
        rowNew3.getCell(52).value = results.telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 1) 
        rowNew3.getCell(53).value = results.telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 1) 
        rowNew3.getCell(54).value = results.telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 1) 
        rowNew3.getCell(55).value = results.telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 1)
        rowNew3.getCell(56).value = results.telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 1) 
        rowNew3.getCell(57).value = results.telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 1) 
        rowNew3.getCell(72).value = results.pesakitUlanganAdaFullDenture; // Pesakit Ulangan Ada Full Denture (Darjah 1)
        rowNew3.getCel(73).value = results.pesakitUlanganAdaPartialDenture; // Pesakit Ulangan Ada Partial Denture (Darjah 1)
        rowNew3.getCell(74).value = results.pesakitUlanganPerluFullDenture; // Pesakit Ulangan Perlu Full Denture (Darjah 1)
        rowNew3.getCell(75).value = results.pesakitUlanganPerluPartialDenture; // Pesakit Ulangan Perlu Partial Denture (Darjah 1)
        rowNew3.commit();

        // Reten Sekolah (Darjah 2)
        let rowNew4 = worksheet.getRow(17);
        rowNew4.getCell(2).value = results.kedatanganEnggan; //Kedatangan enggan (Darjah 2)
        rowNew4.getCell(3).value = results.kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 2)
        rowNew4.getCell(4).value = results.enrolmen; //Kedatangan enrolmen (Darjah 2)
        rowNew4.getCell(5).value = results.kedatanganBaru; //Kedatangan baru (Darjah 2)
        rowNew4.getCell(6).value = results.kedatanganUlangan; //Kedatangan ulangan (Darjah 2)
        rowNew4.getCell(8).value = results.skorPlakA; //Kebersihan Mulut Skor A (Darjah 2)
        rowNew4.getCell(9).value = results.dStatusdfx; //Karies Gigi Desidus (d) (Darjah 2) 
        rowNew4.getCell(10).value = results.fStatusdfx; //Telah Ditampal Gigi Desidus (f) (Darjah 2) 
        rowNew4.getCell(11).value = results.xStatusdfx; //Gigi Desidus Perlu Ditampal (x) (Darjah 2) 
        rowNew4.getCell(13).value = results.eStatusDMFX; //Karies Awal Gigi Kekal (E) (Darjah 2) 
        rowNew4.getCell(14).value = results.dStatusDMFX; //Karies Gigi Kekal (D) (Darjah 2) 
        rowNew4.getCell(15).value = results.mStatusDMFX; //Gigi Kekal Telah Dicabut (M) (Darjah 2) 
        rowNew4.getCell(16).value = results.fStatusDMFX; //Gigi Kekal Telah Ditampal (F) (Darjah 2) 
        rowNew4.getCell(17).value = results.xStatusDMFX; //Jumlah DMFX (Darjah 2) 
        rowNew4.getCell(19).value = results.gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 2) 
        rowNew4.getCell(20).value = results.totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.0  (Darjah 2) 
        rowNew4.getCell(21).value = results.eMoreThanZero; //E≥1 (ada karies awal) (Darjah 2) 
        rowNew4.getCell(22).value = results.mbk; //Mulut Bebas Karies (MBK) (Darjah 2) 
        rowNew4.getCell(23).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 (Darjah 2)
        rowNew4.getCell(24).value = results.statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 2)
        rowNew4.getCell(25).value = results.dfxEqualToZero; //dfx=0 (Darjah 2) 
        rowNew4.getCell(26).value = results.mulutBebasGingivitis; //Mulut Bebas Gingivitis (MBG) (Darjah 2) 
        rowNew4.getCell(27).value = results.tprICDAS; //TPR ICDAS (Darjah 2) 
        rowNew4.getCell(28).value = results.kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 2) 
        rowNew4.getCell(29).value = results.cleftAda; //cleft Ada (Darjah 2) 
        rowNew4.getCell(30).value = results.cleftRujuk; //cleft Rujuk (Darjah 2) 
        rowNew4.getCell(32).value = results.perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 2) 
        rowNew4.getCell(33).value = results.perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 2) 
        rowNew4.getCell(34).value = results.perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 2) 
        rowNew4.getCell(35).value = results.perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 2) 
        rowNew4.getCell(36).value = results.perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 2) 
        rowNew4.getCell(37).value = results.perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 2) 
        rowNew4.getCell(38).value = results.perluPRR1BGigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 2) 
        rowNew4.getCell(39).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 2) 
        rowNew4.getCell(40).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 2) 
        rowNew4.getCell(41).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 2) 
        rowNew4.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 2) 
        rowNew4.getCell(43).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 2) 
        rowNew4.getCell(44).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 2) 
        rowNew4.getCell(46).value = results.telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 2) 
        rowNew4.getCell(47).value = results.telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 2) 
        rowNew4.getCell(48).value = results.telahFVMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 2) 
        rowNew4.getCell(49).value = results.telahFVGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 2) 
        rowNew4.getCell(50).value = results.telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 2) 
        rowNew4.getCell(51).value = results.telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 2) 
        rowNew4.getCell(52).value = results.telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 2) 
        rowNew4.getCell(53).value = results.telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 2) 
        rowNew4.getCell(54).value = results.telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 2) 
        rowNew4.getCell(55).value = results.telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 2) 
        rowNew4.getCell(56).value = results.telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 2) 
        rowNew4.getCell(57).value = results.telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 2) 
        rowNew4.getCell(59).value = results.cabutanGd; // Gigi Desidus Dicabut (Darjah 2)
        rowNew4.getCell(60).value = results.cabutanGk; // Gigi Kekal Dicabut (Darjah 2) 
        rowNew4.getCell(61).value = results.penskaleran; // Penskelaran (Darjah 2) 
        rowNew4.getCell(62).value = results.caseCompleted; // Kes Selesai ICDAS (Darjah 2) 
        rowNew4.getCell(63).value = results.skorGIS0; // GIS SKOR 0 (Darjah 2) 
        rowNew4.getCell(64).value = results.skorGIS1; // GIS SKOR 1 (Darjah 2) 
        rowNew4.getCell(65).value = results.skorGIS2; // GIS SKOR 2 (Darjah 2) 
        rowNew4.getCell(66).value = results.skorGIS3; // GIS SKOR 3 (Darjah 2) 
        rowNew4.getCell(68).value = results.traumaTSL; // Trauma Tooth Surface Loss (Darjah 2) 
        rowNew4.getCell(69).value = results.traumaTisuLembut; // Trauma Tisu Lembut (Darjah 2) 
        rowNew4.getCell(70).value = results.traumaTisuKeras;// Trauma Tisu Keras (Darjah 2)
        rowNew4.getCell(72).value = results.pesakitBaruAdaFullDenture; // Pesakit baru Ada Full Denture (Darjah 2)
        rowNew4.getCel(73).value = results.pesakitBaruAdaPartialDenture; // Pesakit baru Ada Partial Denture (Darjah 2)
        rowNew4.getCell(74).value = results.pesakitBaruPerluFullDenture; // Pesakit baru Perlu Full Denture (Darjah 2)
        rowNew4.getCell(75).value = results.pesakitBaruPerluPartialDenture; // Pesakit baru Perlu Partial Denture (Darjah 2)
        rowNew4.commit();

        let rowNew5 = worksheet.getRow(18);
	      rowNew5.getCell(8).value = results.skorPlakC; //Kebersihan Mulut Skor C (Darjah 2)
        rowNew5.commit();

        let rowNew6 = worksheet.getRow(19);
        rowNew6.getCell(8).value = results.skorPlakE; //Kebersihan Mulut Skor E (Darjah 2)
        rowNew6.getCell(33).value = results.perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 2) 
        rowNew6.getCell(35).value = results.perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 2) 
        rowNew6.getCell(36).value = results.perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 2) 
        rowNew6.getCell(37).value = results.perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 2) 
        rowNew6.getCell(38).value = results.perluPRR1BGigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 2)
        rowNew6.getCell(39).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 2) 
        rowNew6.getCell(40).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 2) 
        rowNew6.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 2) 
        rowNew6.getCell(42).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 2) 
        rowNew6.getCell(43).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 2) 
        rowNew6.getCell(44).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 2) 
        rowNew6.getCell(46).value = results.telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 2) 
        rowNew6.getCell(47).value = results.telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 2) 
        rowNew6.getCell(48).value = results.telahFVMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 2) 
        rowNew6.getCell(49).value = results.telahFVGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 2) 
        rowNew6.getCell(50).value = results.telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 2) 
        rowNew6.getCell(51).value = results.telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 2) 
        rowNew6.getCell(52).value = results.telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 2) 
        rowNew6.getCell(53).value = results.telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 2) 
        rowNew6.getCell(54).value = results.telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 2) 
        rowNew6.getCell(55).value = results.telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 2)
        rowNew6.getCell(56).value = results.telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 2) 
        rowNew6.getCell(57).value = results.telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 2) 
        rowNew6.getCell(72).value = results.pesakitUlanganAdaFullDenture; // Pesakit Ulangan Ada Full Denture (Darjah 2)
        rowNew6.getCel(73).value = results.pesakitUlanganAdaPartialDenture; // Pesakit Ulangan Ada Partial Denture (Darjah 2)
        rowNew6.getCell(74).value = results.pesakitUlanganPerluFullDenture; // Pesakit Ulangan Perlu Full Denture (Darjah 2)
        rowNew6.getCell(75).value = results.pesakitUlanganPerluPartialDenture; // Pesakit Ulangan Perlu Partial Denture (Darjah 2)
        rowNew6.commit();

        // Reten Sekolah (Darjah 3)
        let rowNew7 = worksheet.getRow(17);
        rowNew7.getCell(2).value = results.kedatanganEnggan; //Kedatangan enggan (Darjah 3)
        rowNew7.getCell(3).value = results.kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 3)
        rowNew7.getCell(4).value = results.enrolmen; //Kedatangan enrolmen (Darjah 3)
        rowNew7.getCell(5).value = results.kedatanganBaru; //Kedatangan baru (Darjah 3)
        rowNew7.getCell(6).value = results.kedatanganUlangan; //Kedatangan ulangan (Darjah 3)
        rowNew7.getCell(8).value = results.skorPlakA; //Kebersihan Mulut Skor A (Darjah 3)
        rowNew7.getCell(9).value = results.dStatusdfx; //Karies Gigi Desidus (d) (Darjah 3) 
        rowNew7.getCell(10).value = results.fStatusdfx; //Telah Ditampal Gigi Desidus (f) (Darjah 3) 
        rowNew7.getCell(11).value = results.xStatusdfx; //Gigi Desidus Perlu Ditampal (x) (Darjah 3) 
        rowNew7.getCell(13).value = results.eStatusDMFX; //Karies Awal Gigi Kekal (E) (Darjah 3) 
        rowNew7.getCell(14).value = results.dStatusDMFX; //Karies Gigi Kekal (D) (Darjah 3) 
        rowNew7.getCell(15).value = results.mStatusDMFX; //Gigi Kekal Telah Dicabut (M) (Darjah 3) 
        rowNew7.getCell(16).value = results.fStatusDMFX; //Gigi Kekal Telah Ditampal (F) (Darjah 3) 
        rowNew7.getCell(17).value = results.xStatusDMFX; //Jumlah DMFX (Darjah 3) 
        rowNew7.getCell(19).value = results.gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 3) 
        rowNew7.getCell(20).value = results.totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.0  (Darjah 3) 
        rowNew7.getCell(21).value = results.eMoreThanZero; //E≥1 (ada karies awal) (Darjah 3) 
        rowNew7.getCell(22).value = results.mbk; //Mulut Bebas Karies (MBK) (Darjah 3) 
        rowNew7.getCell(23).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 (Darjah 3)
        rowNew7.getCell(24).value = results.statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 3)
        rowNew7.getCell(25).value = results.dfxEqualToZero; //dfx=0 (Darjah 3) 
        rowNew7.getCell(26).value = results.mulutBebasGingivitis; //Mulut Bebas Gingivitis (MBG) (Darjah 3) 
        rowNew7.getCell(27).value = results.tprICDAS; //TPR ICDAS (Darjah 3) 
        rowNew7.getCell(28).value = results.kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 3) 
        rowNew7.getCell(29).value = results.cleftAda; //cleft Ada (Darjah 3) 
        rowNew7.getCell(30).value = results.cleftRujuk; //cleft Rujuk (Darjah 3) 
        rowNew7.getCell(32).value = results.perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 3) 
        rowNew7.getCell(33).value = results.perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 3) 
        rowNew7.getCell(34).value = results.perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 3) 
        rowNew7.getCell(35).value = results.perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 3) 
        rowNew7.getCell(36).value = results.perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 3) 
        rowNew7.getCell(37).value = results.perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 3) 
        rowNew7.getCell(38).value = results.perluPRR1BGigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 3) 
        rowNew7.getCell(39).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 3) 
        rowNew7.getCell(40).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 3) 
        rowNew7.getCell(41).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 3) 
        rowNew7.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 3) 
        rowNew7.getCell(43).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 3) 
        rowNew7.getCell(44).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 3) 
        rowNew7.getCell(46).value = results.telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 3) 
        rowNew7.getCell(47).value = results.telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 3) 
        rowNew7.getCell(48).value = results.telahFVMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 3) 
        rowNew7.getCell(49).value = results.telahFVGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 3) 
        rowNew7.getCell(50).value = results.telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 3) 
        rowNew7.getCell(51).value = results.telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 3) 
        rowNew7.getCell(52).value = results.telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 3) 
        rowNew7.getCell(53).value = results.telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 3) 
        rowNew7.getCell(54).value = results.telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 3) 
        rowNew7.getCell(55).value = results.telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 3) 
        rowNew7.getCell(56).value = results.telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 3) 
        rowNew7.getCell(57).value = results.telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 3) 
        rowNew7.getCell(59).value = results.cabutanGd; // Gigi Desidus Dicabut (Darjah 3)
        rowNew7.getCell(60).value = results.cabutanGk; // Gigi Kekal Dicabut (Darjah 3) 
        rowNew7.getCell(61).value = results.penskaleran; // Penskelaran (Darjah 3) 
        rowNew7.getCell(62).value = results.caseCompleted; // Kes Selesai ICDAS (Darjah 3) 
        rowNew7.getCell(63).value = results.skorGIS0; // GIS SKOR 0 (Darjah 3) 
        rowNew7.getCell(64).value = results.skorGIS1; // GIS SKOR 1 (Darjah 3) 
        rowNew7.getCell(65).value = results.skorGIS2; // GIS SKOR 2 (Darjah 3) 
        rowNew7.getCell(66).value = results.skorGIS3; // GIS SKOR 3 (Darjah 3) 
        rowNew7.getCell(68).value = results.traumaTSL; // Trauma Tooth Surface Loss (Darjah 3) 
        rowNew7.getCell(69).value = results.traumaTisuLembut; // Trauma Tisu Lembut (Darjah 3) 
        rowNew7.getCell(70).value = results.traumaTisuKeras;// Trauma Tisu Keras (Darjah 3)
        rowNew7.getCell(72).value = results.pesakitBaruAdaFullDenture; // Pesakit baru Ada Full Denture (Darjah 3)
        rowNew7.getCel(73).value = results.pesakitBaruAdaPartialDenture; // Pesakit baru Ada Partial Denture (Darjah 3)
        rowNew7.getCell(74).value = results.pesakitBaruPerluFullDenture; // Pesakit baru Perlu Full Denture (Darjah 3)
        rowNew7.getCell(75).value = results.pesakitBaruPerluPartialDenture; // Pesakit baru Perlu Partial Denture (Darjah 3)
        rowNew7.commit();
        
        let rowNew8 = worksheet.getRow(18);
        rowNew8.getCell(8).value = results.skorPlakC; //Kebersihan Mulut Skor C (Darjah 3)
        rowNew8.commit();

        let rowNew9 = worksheet.getRow(19);
        rowNew9.getCell(8).value = results.skorPlakE; //Kebersihan Mulut Skor E (Darjah 3)
        rowNew9.getCell(33).value = results.perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 3) 
        rowNew9.getCell(35).value = results.perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 3) 
        rowNew9.getCell(36).value = results.perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 3) 
        rowNew9.getCell(37).value = results.perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 3) 
        rowNew9.getCell(38).value = results.perluPRR1BGigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 3)
        rowNew9.getCell(39).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 3) 
        rowNew9.getCell(40).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 3) 
        rowNew9.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 3) 
        rowNew9.getCell(42).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 3) 
        rowNew9.getCell(43).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 3) 
        rowNew9.getCell(44).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 3) 
        rowNew9.getCell(46).value = results.telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 3) 
        rowNew9.getCell(47).value = results.telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 3) 
        rowNew9.getCell(48).value = results.telahFVMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 3) 
        rowNew9.getCell(49).value = results.telahFVGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 3) 
        rowNew9.getCell(50).value = results.telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 3) 
        rowNew9.getCell(51).value = results.telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 3) 
        rowNew9.getCell(52).value = results.telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 3) 
        rowNew9.getCell(53).value = results.telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 3) 
        rowNew9.getCell(54).value = results.telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 3) 
        rowNew9.getCell(55).value = results.telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 3)
        rowNew9.getCell(56).value = results.telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 3) 
        rowNew9.getCell(57).value = results.telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 3) 
        rowNew9.getCell(72).value = results.pesakitUlanganAdaFullDenture; // Pesakit Ulangan Ada Full Denture (Darjah 3)
        rowNew9.getCel(73).value = results.pesakitUlanganAdaPartialDenture; // Pesakit Ulangan Ada Partial Denture (Darjah 3)
        rowNew9.getCell(74).value = results.pesakitUlanganPerluFullDenture; // Pesakit Ulangan Perlu Full Denture (Darjah 3)
        rowNew9.getCell(75).value = results.pesakitUlanganPerluPartialDenture; // Pesakit Ulangan Perlu Partial Denture (Darjah 3)
        rowNew9.commit();

        // Reten Sekolah (Darjah 4)
        let rowNew10 = worksheet.getRow(17);
        rowNew10.getCell(2).value = results.kedatanganEnggan; //Kedatangan enggan (Darjah 4)
        rowNew10.getCell(3).value = results.kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 4)
        rowNew10.getCell(4).value = results.enrolmen; //Kedatangan enrolmen (Darjah 4)
        rowNew10.getCell(5).value = results.kedatanganBaru; //Kedatangan baru (Darjah 4)
        rowNew10.getCell(6).value = results.kedatanganUlangan; //Kedatangan ulangan (Darjah 4)
        rowNew10.getCell(8).value = results.skorPlakA; //Kebersihan Mulut Skor A (Darjah 4)
        rowNew10.getCell(9).value = results.dStatusdfx; //Karies Gigi Desidus (d) (Darjah 4) 
        rowNew10.getCell(10).value = results.fStatusdfx; //Telah Ditampal Gigi Desidus (f) (Darjah 4) 
        rowNew10.getCell(11).value = results.xStatusdfx; //Gigi Desidus Perlu Ditampal (x) (Darjah 4) 
        rowNew10.getCell(13).value = results.eStatusDMFX; //Karies Awal Gigi Kekal (E) (Darjah 4) 
        rowNew10.getCell(14).value = results.dStatusDMFX; //Karies Gigi Kekal (D) (Darjah 4) 
        rowNew10.getCell(15).value = results.mStatusDMFX; //Gigi Kekal Telah Dicabut (M) (Darjah 4) 
        rowNew10.getCell(16).value = results.fStatusDMFX; //Gigi Kekal Telah Ditampal (F) (Darjah 4) 
        rowNew10.getCell(17).value = results.xStatusDMFX; //Jumlah DMFX (Darjah 4) 
        rowNew10.getCell(19).value = results.gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 4) 
        rowNew10.getCell(20).value = results.totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.0  (Darjah 4) 
        rowNew10.getCell(21).value = results.eMoreThanZero; //E≥1 (ada karies awal) (Darjah 4) 
        rowNew10.getCell(22).value = results.mbk; //Mulut Bebas Karies (MBK) (Darjah 4) 
        rowNew10.getCell(23).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 (Darjah 4)
        rowNew10.getCell(24).value = results.statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 4)
        rowNew10.getCell(25).value = results.dfxEqualToZero; //dfx=0 (Darjah 4) 
        rowNew10.getCell(26).value = results.mulutBebasGingivitis; //Mulut Bebas Gingivitis (MBG) (Darjah 4) 
        rowNew10.getCell(27).value = results.tprICDAS; //TPR ICDAS (Darjah 4) 
        rowNew10.getCell(28).value = results.kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 4) 
        rowNew10.getCell(29).value = results.cleftAda; //cleft Ada (Darjah 4) 
        rowNew10.getCell(30).value = results.cleftRujuk; //cleft Rujuk (Darjah 4) 
        rowNew10.getCell(32).value = results.perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 4) 
        rowNew10.getCell(33).value = results.perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 4) 
        rowNew10.getCell(34).value = results.perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 4) 
        rowNew10.getCell(35).value = results.perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 4) 
        rowNew10.getCell(36).value = results.perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 4) 
        rowNew10.getCell(37).value = results.perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 4) 
        rowNew10.getCell(38).value = results.perluPRR1BGigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 4) 
        rowNew10.getCell(39).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 4) 
        rowNew10.getCell(40).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 4) 
        rowNew10.getCell(41).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 4) 
        rowNew10.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 4) 
        rowNew10.getCell(43).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 4) 
        rowNew10.getCell(44).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 4) 
        rowNew10.getCell(46).value = results.telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 4) 
        rowNew10.getCell(47).value = results.telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 4) 
        rowNew10.getCell(48).value = results.telahFVMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 4) 
        rowNew10.getCell(49).value = results.telahFVGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 4) 
        rowNew10.getCell(50).value = results.telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 4) 
        rowNew10.getCell(51).value = results.telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 4) 
        rowNew10.getCell(52).value = results.telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 4) 
        rowNew10.getCell(53).value = results.telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 4) 
        rowNew10.getCell(54).value = results.telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 4) 
        rowNew10.getCell(55).value = results.telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 4) 
        rowNew10.getCell(56).value = results.telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 4) 
        rowNew10.getCell(57).value = results.telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 4) 
        rowNew10.getCell(59).value = results.cabutanGd; // Gigi Desidus Dicabut (Darjah 4)
        rowNew10.getCell(60).value = results.cabutanGk; // Gigi Kekal Dicabut (Darjah 4) 
        rowNew10.getCell(61).value = results.penskaleran; // Penskelaran (Darjah 4) 
        rowNew10.getCell(62).value = results.caseCompleted; // Kes Selesai ICDAS (Darjah 4) 
        rowNew10.getCell(63).value = results.skorGIS0; // GIS SKOR 0 (Darjah 4) 
        rowNew10.getCell(64).value = results.skorGIS1; // GIS SKOR 1 (Darjah 4) 
        rowNew10.getCell(65).value = results.skorGIS2; // GIS SKOR 2 (Darjah 4) 
        rowNew10.getCell(66).value = results.skorGIS3; // GIS SKOR 3 (Darjah 4) 
        rowNew10.getCell(68).value = results.traumaTSL; // Trauma Tooth Surface Loss (Darjah 4) 
        rowNew10.getCell(69).value = results.traumaTisuLembut; // Trauma Tisu Lembut (Darjah 4) 
        rowNew10.getCell(70).value = results.traumaTisuKeras;// Trauma Tisu Keras (Darjah 4)
        rowNew10.getCell(72).value = results.pesakitBaruAdaFullDenture; // Pesakit baru Ada Full Denture (Darjah 4)
        rowNew10.getCel(73).value = results.pesakitBaruAdaPartialDenture; // Pesakit baru Ada Partial Denture (Darjah 4)
        rowNew10.getCell(74).value = results.pesakitBaruPerluFullDenture; // Pesakit baru Perlu Full Denture (Darjah 4)
        rowNew10.getCell(75).value = results.pesakitBaruPerluPartialDenture; // Pesakit baru Perlu Partial Denture (Darjah 4)
        rowNew10.commit();

        let rowNew11 = worksheet.getRow(18);
        rowNew11.getCell(8).value = results.skorPlakC; //Kebersihan Mulut Skor C (Darjah 4)
        rowNew11.commit();

        let rowNew12 = worksheet.getRow(19);
        rowNew12.getCell(8).value = results.skorPlakE; //Kebersihan Mulut Skor E (Darjah 4)
        rowNew12.getCell(33).value = results.perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 4) 
        rowNew12.getCell(35).value = results.perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 4) 
        rowNew12.getCell(36).value = results.perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 4) 
        rowNew12.getCell(37).value = results.perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 4) 
        rowNew12.getCell(38).value = results.perluPRR1BGigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 4)
        rowNew12.getCell(39).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 4) 
        rowNew12.getCell(40).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 4) 
        rowNew12.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 4) 
        rowNew12.getCell(42).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 4) 
        rowNew12.getCell(43).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 4) 
        rowNew12.getCell(44).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 4) 
        rowNew12.getCell(46).value = results.telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 4) 
        rowNew12.getCell(47).value = results.telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 4) 
        rowNew12.getCell(48).value = results.telahFVMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 4) 
        rowNew12.getCell(49).value = results.telahFVGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 4) 
        rowNew12.getCell(50).value = results.telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 4) 
        rowNew12.getCell(51).value = results.telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 4) 
        rowNew12.getCell(52).value = results.telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 4) 
        rowNew12.getCell(53).value = results.telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 4) 
        rowNew12.getCell(54).value = results.telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 4) 
        rowNew12.getCell(55).value = results.telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 4)
        rowNew12.getCell(56).value = results.telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 4) 
        rowNew12.getCell(57).value = results.telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 4) 
        rowNew12.getCell(72).value = results.pesakitUlanganAdaFullDenture; // Pesakit Ulangan Ada Full Denture (Darjah 4)
        rowNew12.getCel(73).value = results.pesakitUlanganAdaPartialDenture; // Pesakit Ulangan Ada Partial Denture (Darjah 4)
        rowNew12.getCell(74).value = results.pesakitUlanganPerluFullDenture; // Pesakit Ulangan Perlu Full Denture (Darjah 4)
        rowNew12.getCell(75).value = results.pesakitUlanganPerluPartialDenture; // Pesakit Ulangan Perlu Partial Denture (Darjah 4)
        rowNew12.commit();

        // Reten Sekolah (Darjah 5)
        let rowNew13 = worksheet.getRow(17);
        rowNew13.getCell(2).value = results.kedatanganEnggan; //Kedatangan enggan (Darjah 5)
        rowNew13.getCell(3).value = results.kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 5)
        rowNew13.getCell(4).value = results.enrolmen; //Kedatangan enrolmen (Darjah 5)
        rowNew13.getCell(5).value = results.kedatanganBaru; //Kedatangan baru (Darjah 5)
        rowNew13.getCell(6).value = results.kedatanganUlangan; //Kedatangan ulangan (Darjah 5)
        rowNew13.getCell(8).value = results.skorPlakA; //Kebersihan Mulut Skor A (Darjah 5)
        rowNew13.getCell(9).value = results.dStatusdfx; //Karies Gigi Desidus (d) (Darjah 5) 
        rowNew13.getCell(10).value = results.fStatusdfx; //Telah Ditampal Gigi Desidus (f) (Darjah 5) 
        rowNew13.getCell(11).value = results.xStatusdfx; //Gigi Desidus Perlu Ditampal (x) (Darjah 5) 
        rowNew13.getCell(13).value = results.eStatusDMFX; //Karies Awal Gigi Kekal (E) (Darjah 5) 
        rowNew13.getCell(14).value = results.dStatusDMFX; //Karies Gigi Kekal (D) (Darjah 5) 
        rowNew13.getCell(15).value = results.mStatusDMFX; //Gigi Kekal Telah Dicabut (M) (Darjah 5) 
        rowNew13.getCell(16).value = results.fStatusDMFX; //Gigi Kekal Telah Ditampal (F) (Darjah 5) 
        rowNew13.getCell(17).value = results.xStatusDMFX; //Jumlah DMFX (Darjah 5) 
        rowNew13.getCell(19).value = results.gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 5) 
        rowNew13.getCell(20).value = results.totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.0  (Darjah 5) 
        rowNew13.getCell(21).value = results.eMoreThanZero; //E≥1 (ada karies awal) (Darjah 5) 
        rowNew13.getCell(22).value = results.mbk; //Mulut Bebas Karies (MBK) (Darjah 5) 
        rowNew13.getCell(23).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 (Darjah 5)
        rowNew13.getCell(24).value = results.statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 5)
        rowNew13.getCell(25).value = results.dfxEqualToZero; //dfx=0 (Darjah 5) 
        rowNew13.getCell(26).value = results.mulutBebasGingivitis; //Mulut Bebas Gingivitis (MBG) (Darjah 5) 
        rowNew13.getCell(27).value = results.tprICDAS; //TPR ICDAS (Darjah 5) 
        rowNew13.getCell(28).value = results.kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 5) 
        rowNew13.getCell(29).value = results.cleftAda; //cleft Ada (Darjah 5) 
        rowNew13.getCell(30).value = results.cleftRujuk; //cleft Rujuk (Darjah 5) 
        rowNew13.getCell(32).value = results.perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 5) 
        rowNew13.getCell(33).value = results.perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 5) 
        rowNew13.getCell(34).value = results.perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 5) 
        rowNew13.getCell(35).value = results.perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 5) 
        rowNew13.getCell(36).value = results.perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 5) 
        rowNew13.getCell(37).value = results.perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 5) 
        rowNew13.getCell(38).value = results.perluPRR1BGigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 5) 
        rowNew13.getCell(39).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 5) 
        rowNew13.getCell(40).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 5) 
        rowNew13.getCell(41).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 5) 
        rowNew13.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 5) 
        rowNew13.getCell(43).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 5) 
        rowNew13.getCell(44).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 5) 
        rowNew13.getCell(46).value = results.telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 5) 
        rowNew13.getCell(47).value = results.telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 5) 
        rowNew13.getCell(48).value = results.telahFVMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 5) 
        rowNew13.getCell(49).value = results.telahFVGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 5) 
        rowNew13.getCell(50).value = results.telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 5) 
        rowNew13.getCell(51).value = results.telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 5) 
        rowNew13.getCell(52).value = results.telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 5) 
        rowNew13.getCell(53).value = results.telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 5) 
        rowNew13.getCell(54).value = results.telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 5) 
        rowNew13.getCell(55).value = results.telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 5) 
        rowNew13.getCell(56).value = results.telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 5) 
        rowNew13.getCell(57).value = results.telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 5) 
        rowNew13.getCell(59).value = results.cabutanGd; // Gigi Desidus Dicabut (Darjah 5)
        rowNew13.getCell(60).value = results.cabutanGk; // Gigi Kekal Dicabut (Darjah 5) 
        rowNew13.getCell(61).value = results.penskaleran; // Penskelaran (Darjah 5) 
        rowNew13.getCell(62).value = results.caseCompleted; // Kes Selesai ICDAS (Darjah 5) 
        rowNew13.getCell(63).value = results.skorGIS0; // GIS SKOR 0 (Darjah 5) 
        rowNew13.getCell(64).value = results.skorGIS1; // GIS SKOR 1 (Darjah 5) 
        rowNew13.getCell(65).value = results.skorGIS2; // GIS SKOR 2 (Darjah 5) 
        rowNew13.getCell(66).value = results.skorGIS3; // GIS SKOR 3 (Darjah 5) 
        rowNew13.getCell(68).value = results.traumaTSL; // Trauma Tooth Surface Loss (Darjah 5) 
        rowNew13.getCell(69).value = results.traumaTisuLembut; // Trauma Tisu Lembut (Darjah 5) 
        rowNew13.getCell(70).value = results.traumaTisuKeras;// Trauma Tisu Keras (Darjah 5)
        rowNew13.getCell(72).value = results.pesakitBaruAdaFullDenture; // Pesakit baru Ada Full Denture (Darjah 5)
        rowNew13.getCel(73).value = results.pesakitBaruAdaPartialDenture; // Pesakit baru Ada Partial Denture (Darjah 5)
        rowNew13.getCell(74).value = results.pesakitBaruPerluFullDenture; // Pesakit baru Perlu Full Denture (Darjah 5)
        rowNew13.getCell(75).value = results.pesakitBaruPerluPartialDenture; // Pesakit baru Perlu Partial Denture (Darjah 5)
        rowNew13.commit();

        let rowNew14 = worksheet.getRow(18);
        rowNew14.getCell(8).value = results.skorPlakC; //Kebersihan Mulut Skor C (Darjah 5)
        rowNew14.commit();

        let rowNew15 = worksheet.getRow(19);
        rowNew15.getCell(8).value = results.skorPlakE; //Kebersihan Mulut Skor E (Darjah 5)
        rowNew15.getCell(33).value = results.perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 5) 
        rowNew15.getCell(35).value = results.perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 5) 
        rowNew15.getCell(36).value = results.perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 5) 
        rowNew15.getCell(37).value = results.perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 5) 
        rowNew15.getCell(38).value = results.perluPRR1BGigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 5)
        rowNew15.getCell(39).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 5) 
        rowNew15.getCell(40).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 5) 
        rowNew15.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 5) 
        rowNew15.getCell(42).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 5) 
        rowNew15.getCell(43).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 5) 
        rowNew15.getCell(44).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 5) 
        rowNew15.getCell(46).value = results.telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 5) 
        rowNew15.getCell(47).value = results.telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 5) 
        rowNew15.getCell(48).value = results.telahFVMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 5) 
        rowNew15.getCell(49).value = results.telahFVGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 5) 
        rowNew15.getCell(50).value = results.telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 5) 
        rowNew15.getCell(51).value = results.telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 5) 
        rowNew15.getCell(52).value = results.telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 5) 
        rowNew15.getCell(53).value = results.telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 5) 
        rowNew15.getCell(54).value = results.telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 5) 
        rowNew15.getCell(55).value = results.telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 5)
        rowNew15.getCell(56).value = results.telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 5) 
        rowNew15.getCell(57).value = results.telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 5) 
        rowNew15.getCell(72).value = results.pesakitUlanganAdaFullDenture; // Pesakit Ulangan Ada Full Denture (Darjah 5)
        rowNew15.getCel(73).value = results.pesakitUlanganAdaPartialDenture; // Pesakit Ulangan Ada Partial Denture (Darjah 5)
        rowNew15.getCell(74).value = results.pesakitUlanganPerluFullDenture; // Pesakit Ulangan Perlu Full Denture (Darjah 5)
        rowNew15.getCell(75).value = results.pesakitUlanganPerluPartialDenture; // Pesakit Ulangan Perlu Partial Denture (Darjah 5)
        rowNew15.commit();

        // Reten Sekolah (Darjah 6 OR Peralihan)
        let rowNew16 = worksheet.getRow(17);
        rowNew16.getCell(2).value = results.kedatanganEnggan; //Kedatangan enggan (Darjah 6 OR Peralihan)
        rowNew16.getCell(3).value = results.kedatanganTidakHadir; //Kedatangan Tidak Hadir (Darjah 6 OR Peralihan)
        rowNew16.getCell(4).value = results.enrolmen; //Kedatangan enrolmen (Darjah 6 OR Peralihan)
        rowNew16.getCell(5).value = results.kedatanganBaru; //Kedatangan baru (Darjah 6 OR Peralihan)
        rowNew16.getCell(6).value = results.kedatanganUlangan; //Kedatangan ulangan (Darjah 6 OR Peralihan)
        rowNew16.getCell(8).value = results.skorPlakA; //Kebersihan Mulut Skor A (Darjah 6 OR Peralihan)
        rowNew16.getCell(9).value = results.dStatusdfx; //Karies Gigi Desidus (d) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(10).value = results.fStatusdfx; //Telah Ditampal Gigi Desidus (f) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(11).value = results.xStatusdfx; //Gigi Desidus Perlu Ditampal (x) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(13).value = results.eStatusDMFX; //Karies Awal Gigi Kekal (E) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(14).value = results.dStatusDMFX; //Karies Gigi Kekal (D) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(15).value = results.mStatusDMFX; //Gigi Kekal Telah Dicabut (M) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(16).value = results.fStatusDMFX; //Gigi Kekal Telah Ditampal (F) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(17).value = results.xStatusDMFX; //Jumlah DMFX (Darjah 6 OR Peralihan) 
        rowNew16.getCell(19).value = results.gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(20).value = results.totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.0  (Darjah 6 OR Peralihan) 
        rowNew16.getCell(21).value = results.eMoreThanZero; //E≥1 (ada karies awal) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(22).value = results.mbk; //Mulut Bebas Karies (MBK) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(23).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 (Darjah 6 OR Peralihan)
        rowNew16.getCell(24).value = results.statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (Darjah 6 OR Peralihan)
        rowNew16.getCell(25).value = results.dfxEqualToZero; //dfx=0 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(26).value = results.mulutBebasGingivitis; //Mulut Bebas Gingivitis (MBG) (Darjah 6 OR Peralihan) 
        rowNew16.getCell(27).value = results.tprICDAS; //TPR ICDAS (Darjah 6 OR Peralihan) 
        rowNew16.getCell(28).value = results.kecederaanGigiAnterior; //Kecederaan gigi Anterior (Darjah 6 OR Peralihan) 
        rowNew16.getCell(29).value = results.cleftAda; //cleft Ada (Darjah 6 OR Peralihan) 
        rowNew16.getCell(30).value = results.cleftRujuk; //cleft Rujuk (Darjah 6 OR Peralihan) 
        rowNew16.getCell(32).value = results.perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (Darjah 6 OR Peralihan) 
        rowNew16.getCell(33).value = results.perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (Darjah 6 OR Peralihan) 
        rowNew16.getCell(34).value = results.perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (Darjah 6 OR Peralihan) 
        rowNew16.getCell(35).value = results.perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (Darjah 6 OR Peralihan) 
        rowNew16.getCell(36).value = results.perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (Darjah 6 OR Peralihan) 
        rowNew16.getCell(37).value = results.perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(38).value = results.perluPRR1BGigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(39).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(40).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(41).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(43).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(44).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(46).value = results.telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (Darjah 6 OR Peralihan) 
        rowNew16.getCell(47).value = results.telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (Darjah 6 OR Peralihan) 
        rowNew16.getCell(48).value = results.telahFVMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (Darjah 6 OR Peralihan) 
        rowNew16.getCell(49).value = results.telahFVGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (Darjah 6 OR Peralihan) 
        rowNew16.getCell(50).value = results.telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(51).value = results.telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(52).value = results.telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(53).value = results.telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(54).value = results.telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(55).value = results.telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(56).value = results.telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(57).value = results.telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (Darjah 6 OR Peralihan) 
        rowNew16.getCell(59).value = results.cabutanGd; // Gigi Desidus Dicabut (Darjah 6 OR Peralihan)
        rowNew16.getCell(60).value = results.cabutanGk; // Gigi Kekal Dicabut (Darjah 6 OR Peralihan) 
        rowNew16.getCell(61).value = results.penskaleran; // Penskelaran (Darjah 6 OR Peralihan) 
        rowNew16.getCell(62).value = results.caseCompleted; // Kes Selesai ICDAS (Darjah 6 OR Peralihan) 
        rowNew16.getCell(63).value = results.skorGIS0; // GIS SKOR 0 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(64).value = results.skorGIS1; // GIS SKOR 1 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(65).value = results.skorGIS2; // GIS SKOR 2 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(66).value = results.skorGIS3; // GIS SKOR 3 (Darjah 6 OR Peralihan) 
        rowNew16.getCell(68).value = results.traumaTSL; // Trauma Tooth Surface Loss (Darjah 6 OR Peralihan) 
        rowNew16.getCell(69).value = results.traumaTisuLembut; // Trauma Tisu Lembut (Darjah 6 OR Peralihan) 
        rowNew16.getCell(70).value = results.traumaTisuKeras;// Trauma Tisu Keras (Darjah 6 OR Peralihan)
        rowNew16.getCell(72).value = results.pesakitBaruAdaFullDenture; // Pesakit baru Ada Full Denture (Darjah 6 OR Peralihan)
        rowNew16.getCel(73).value = results.pesakitBaruAdaPartialDenture; // Pesakit baru Ada Partial Denture (Darjah 6 OR Peralihan)
        rowNew16.getCell(74).value = results.pesakitBaruPerluFullDenture; // Pesakit baru Perlu Full Denture (Darjah 6 OR Peralihan)
        rowNew16.getCell(75).value = results.pesakitBaruPerluPartialDenture; // Pesakit baru Perlu Partial Denture (Darjah 6 OR Peralihan)
        rowNew16.commit();

        let rowNew17 = worksheet.getRow(18);
	      rowNew17.getCell(8).value = results.skorPlakC; //Kebersihan Mulut Skor C (Darjah 6 OR Peralihan)
        rowNew17.commit();

        let rowNew18 = worksheet.getRow(19);
        rowNew18.getCell(8).value = results.skorPlakE; //Kebersihan Mulut Skor E (Darjah 6 OR Peralihan)
        rowNew18.getCell(33).value = results.perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(Darjah 6 OR Peralihan) 
        rowNew18.getCell(35).value = results.perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (Darjah 6 OR Peralihan) 
        rowNew18.getCell(36).value = results.perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (Darjah 6 OR Peralihan) 
        rowNew18.getCell(37).value = results.perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (Darjah 6 OR Peralihan) 
        rowNew18.getCell(38).value = results.perluPRR1BGigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (Darjah 6 OR Peralihan)
        rowNew18.getCell(39).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(40).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(42).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(43).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(44).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(46).value = results.telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (Darjah 6 OR Peralihan) 
        rowNew18.getCell(47).value = results.telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (Darjah 6 OR Peralihan) 
        rowNew18.getCell(48).value = results.telahFVMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (Darjah 6 OR Peralihan) 
        rowNew18.getCell(49).value = results.telahFVGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (Darjah 6 OR Peralihan) 
        rowNew18.getCell(50).value = results.telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (Darjah 6 OR Peralihan) 
        rowNew18.getCell(51).value = results.telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (Darjah 6 OR Peralihan) 
        rowNew18.getCell(52).value = results.telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(53).value = results.telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(54).value = results.telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(55).value = results.telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (Darjah 6 OR Peralihan)
        rowNew18.getCell(56).value = results.telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(57).value = results.telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (Darjah 6 OR Peralihan) 
        rowNew18.getCell(72).value = results.pesakitUlanganAdaFullDenture; // Pesakit Ulangan Ada Full Denture (Darjah 6 OR Peralihan)
        rowNew18.getCel(73).value = results.pesakitUlanganAdaPartialDenture; // Pesakit Ulangan Ada Partial Denture (Darjah 6 OR Peralihan)
        rowNew18.getCell(74).value = results.pesakitUlanganPerluFullDenture; // Pesakit Ulangan Perlu Full Denture (Darjah 6 OR Peralihan)
        rowNew18.getCell(75).value = results.pesakitUlanganPerluPartialDenture; // Pesakit Ulangan Perlu Partial Denture (Darjah 6 OR Peralihan)
        rowNew18.commit();

        // Reten Sekolah (KKI)
        let rowNew19 = worksheet.getRow(17);
        rowNew19.getCell(2).value = results.kedatanganEnggan; //Kedatangan enggan (KKI)
        rowNew19.getCell(3).value = results.kedatanganTidakHadir; //Kedatangan Tidak Hadir (KKI)
        rowNew19.getCell(4).value = results.enrolmen; //Kedatangan enrolmen (KKI)
        rowNew19.getCell(5).value = results.kedatanganBaru; //Kedatangan baru (KKI)
        rowNew19.getCell(6).value = results.kedatanganUlangan; //Kedatangan ulangan (KKI)
        rowNew19.getCell(8).value = results.skorPlakA; //Kebersihan Mulut Skor A (KKI)
        rowNew19.getCell(9).value = results.dStatusdfx; //Karies Gigi Desidus (d) (KKI) 
        rowNew19.getCell(10).value = results.fStatusdfx; //Telah Ditampal Gigi Desidus (f) (KKI) 
        rowNew19.getCell(11).value = results.xStatusdfx; //Gigi Desidus Perlu Ditampal (x) (KKI) 
        rowNew19.getCell(13).value = results.eStatusDMFX; //Karies Awal Gigi Kekal (E) (KKI) 
        rowNew19.getCell(14).value = results.dStatusDMFX; //Karies Gigi Kekal (D) (KKI) 
        rowNew19.getCell(15).value = results.mStatusDMFX; //Gigi Kekal Telah Dicabut (M) (KKI) 
        rowNew19.getCell(16).value = results.fStatusDMFX; //Gigi Kekal Telah Ditampal (F) (KKI) 
        rowNew19.getCell(17).value = results.xStatusDMFX; //Jumlah DMFX (KKI) 
        rowNew19.getCell(19).value = results.gigiKekalDMFXsamaAtauKurangDari3; //Status Gigi Kekal DMFX <= 3 (KKI) 
        rowNew19.getCell(20).value = results.totalStatusGigiKekalSamaKosong; //Status Gigi Kekal X+M = results.0  (KKI) 
        rowNew19.getCell(21).value = results.eMoreThanZero; //E≥1 (ada karies awal) (KKI) 
        rowNew19.getCell(22).value = results.mbk; //Mulut Bebas Karies (MBK) (KKI) 
        rowNew19.getCell(23).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 (KKI)
        rowNew19.getCell(24).value = results.statusBebasKariesTapiElebihDariSatu; //Bebas Karies (BK) tetapi E ≥ 1 (KKI)
        rowNew19.getCell(25).value = results.dfxEqualToZero; //dfx=0 (KKI) 
        rowNew19.getCell(26).value = results.mulutBebasGingivitis; //Mulut Bebas Gingivitis (MBG) (KKI) 
        rowNew19.getCell(27).value = results.tprICDAS; //TPR ICDAS (KKI) 
        rowNew19.getCell(28).value = results.kecederaanGigiAnterior; //Kecederaan gigi Anterior (KKI) 
        rowNew19.getCell(29).value = results.cleftAda; //cleft Ada (KKI) 
        rowNew19.getCell(30).value = results.cleftRujuk; //cleft Rujuk (KKI) 
        rowNew19.getCell(32).value = results.perluFSMuridB; //Bil. Murid Baru perlu Fisur Sealan (KKI) 
        rowNew19.getCell(33).value = results.perluFSGigiB; //Bil. Gigi Baru perlu Fisur Sealan (KKI) 
        rowNew19.getCell(34).value = results.perluFsBilGigiFailed; //Bilangan Gigi 'Failed' Semula FS (KKI) 
        rowNew19.getCell(35).value = results.perluFvMuridB; //Bil. Murid Baru perlu Fluoride varnish (KKI) 
        rowNew19.getCell(36).value = results.perluFvGigiB; //Bil. Gigi Baru perlu Fluoride varnish (KKI) 
        rowNew19.getCell(37).value = results.perluPRR1MuridB; //Bil. Murid Baru perlu PRR Jenis 1 (KKI) 
        rowNew19.getCell(38).value = results.perluPRR1BGigiB; //Bil. Gigi Baru perlu PRR Jenis 1 (KKI) 
        rowNew19.getCell(39).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna Gigi Decidus Baru (KKI) 
        rowNew19.getCell(40).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna Gigi Kekal Baru (KKI) 
        rowNew19.getCell(41).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna Gigi Decidus Baru (KKI) 
        rowNew19.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna Gigi Kekal Baru (KKI) 
        rowNew19.getCell(43).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam Gigi Decidus Baru (KKI) 
        rowNew19.getCell(44).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam Gigi Kekal Baru (KKI) 
        rowNew19.getCell(46).value = results.telahFSMuridB; //Bil. Murid B Telah Menerima Fisur Sealan (KKI) 
        rowNew19.getCell(47).value = results.telahFSGigiB; //Bil. Gigi B Telah Menerima Fisur Sealan (KKI) 
        rowNew19.getCell(48).value = results.telahFVMuridB; //Bil. Murid B Telah Menerima Fluoride Varnish (KKI) 
        rowNew19.getCell(49).value = results.telahFVGigiB; //Bil. Gigi B Telah Menerima Fluoride Varnish (KKI) 
        rowNew19.getCell(50).value = results.telahPRR1MuridB; //Bil. Murid B Telah Menerima PRR Jenis 1 (KKI) 
        rowNew19.getCell(51).value = results.telahPRR1GigiB; //Bil. Gigi B Telah Menerima PRR Jenis 1 (KKI) 
        rowNew19.getCell(52).value = results.telahTampalanAntGdB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Baru (KKI) 
        rowNew19.getCell(53).value = results.telahTampalanAntGkB; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Baru (KKI) 
        rowNew19.getCell(54).value = results.telahTampalanPosGdB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Baru (KKI) 
        rowNew19.getCell(55).value = results.telahTampalanPosGkB; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Baru (KKI) 
        rowNew19.getCell(56).value = results.telahTampalanAmgGdB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Baru (KKI) 
        rowNew19.getCell(57).value = results.telahTampalanAmgGkB; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Baru (KKI) 
        rowNew19.getCell(59).value = results.cabutanGd; // Gigi Desidus Dicabut (KKI)
        rowNew19.getCell(60).value = results.cabutanGk; // Gigi Kekal Dicabut (KKI) 
        rowNew19.getCell(61).value = results.penskaleran; // Penskelaran (KKI) 
        rowNew19.getCell(62).value = results.caseCompleted; // Kes Selesai ICDAS (KKI) 
        rowNew19.getCell(63).value = results.skorGIS0; // GIS SKOR 0 (KKI) 
        rowNew19.getCell(64).value = results.skorGIS1; // GIS SKOR 1 (KKI) 
        rowNew19.getCell(65).value = results.skorGIS2; // GIS SKOR 2 (KKI) 
        rowNew19.getCell(66).value = results.skorGIS3; // GIS SKOR 3 (KKI) 
        rowNew19.getCell(68).value = results.traumaTSL; // Trauma Tooth Surface Loss (KKI) 
        rowNew19.getCell(69).value = results.traumaTisuLembut; // Trauma Tisu Lembut (KKI) 
        rowNew19.getCell(70).value = results.traumaTisuKeras;// Trauma Tisu Keras (KKI)
        rowNew19.getCell(72).value = results.pesakitBaruAdaFullDenture; // Pesakit baru Ada Full Denture (KKI)
        rowNew19.getCel(73).value = results.pesakitBaruAdaPartialDenture; // Pesakit baru Ada Partial Denture (KKI)
        rowNew19.getCell(74).value = results.pesakitBaruPerluFullDenture; // Pesakit baru Perlu Full Denture (KKI)
        rowNew19.getCell(75).value = results.pesakitBaruPerluPartialDenture; // Pesakit baru Perlu Partial Denture (KKI)
        rowNew19.commit();

        let rowNew20 = worksheet.getRow(18);
        rowNew20.getCell(8).value = results.skorPlakC; //Kebersihan Mulut Skor C (KKI)
        rowNew20.commit();

        let rowNew21 = worksheet.getRow(19);
        rowNew21.getCell(8).value = results.skorPlakE; //Kebersihan Mulut Skor E (KKI)
        rowNew21.getCell(33).value = results.perluFSGigiS; //Bil. Gigi Semula perlu Fisur Sealan	(KKI) 
        rowNew21.getCell(35).value = results.perluFvMuridS; //Bil. Murid Semula perlu Fluoride varnish (KKI) 
        rowNew21.getCell(36).value = results.perluFvGigiS; //Bil. Gigi Semula perlu Fluoride varnish (KKI) 
        rowNew21.getCell(37).value = results.perluPRR1MuridS; //Bil. Murid Semula perlu PRR Jenis 1 (KKI) 
        rowNew21.getCell(38).value = results.perluPRR1BGigiS; //Bil. Gigi Semula perlu PRR Jenis 1 (KKI)
        rowNew21.getCell(39).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna Gigi Decidus Semula (KKI) 
        rowNew21.getCell(40).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna Gigi Kekal Semula (KKI) 
        rowNew21.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna Gigi Decidus Semula (KKI) 
        rowNew21.getCell(42).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna Gigi Kekal Semula (KKI) 
        rowNew21.getCell(43).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam Gigi Decidus Semula (KKI) 
        rowNew21.getCell(44).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam Gigi Kekal Semula (KKI) 
        rowNew21.getCell(46).value = results.telahFSMuridS; //Bil. Murid S Telah Menerima Fisur Sealan (KKI) 
        rowNew21.getCell(47).value = results.telahFSGigiS; //Bil. Gigi S Telah Menerima Fisur Sealan (KKI) 
        rowNew21.getCell(48).value = results.telahFVMuridS; //Bil. Murid S Telah Menerima Fluoride Varnish (KKI) 
        rowNew21.getCell(49).value = results.telahFVGigiS; //Bil. Gigi S Telah Menerima Fluoride Varnish (KKI) 
        rowNew21.getCell(50).value = results.telahPRR1MuridS; //Bil. Murid S Telah Menerima PRR Jenis 1 (KKI) 
        rowNew21.getCell(51).value = results.telahPRR1GigiS; //Bil. Gigi S Telah Menerima PRR Jenis 1 (KKI) 
        rowNew21.getCell(52).value = results.telahTampalanAntGdS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Decidus Semula (KKI) 
        rowNew21.getCell(53).value = results.telahTampalanAntGkS; //Telah Dibuat Tampalan Anterior Sewarna Gigi Kekal Semula (KKI) 
        rowNew21.getCell(54).value = results.telahTampalanPosGdS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Decidus Semula (KKI) 
        rowNew21.getCell(55).value = results.telahTampalanPosGkS; //Telah Dibuat Tampalan Posterior Sewarna Gigi Kekal Semula (KKI)
        rowNew21.getCell(56).value = results.telahTampalanAmgGdS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Decidus Semula (KKI) 
        rowNew21.getCell(57).value = results.telahTampalanAmgGkS; //Telah Dibuat Tampalan Posterior Amalgam Gigi Kekal Semula (KKI) 
        rowNew21.getCell(72).value = results.pesakitUlanganAdaFullDenture; // Pesakit Ulangan Ada Full Denture (KKI)
        rowNew21.getCel(73).value = results.pesakitUlanganAdaPartialDenture; // Pesakit Ulangan Ada Partial Denture (KKI)
        rowNew21.getCell(74).value = results.pesakitUlanganPerluFullDenture; // Pesakit Ulangan Perlu Full Denture (KKI)
        rowNew21.getCell(75).value = results.pesakitUlanganPerluPartialDenture; // Pesakit Ulangan Perlu Partial Denture (KKI)
        rowNew21.commit();
        
        let newfile = path.join(__dirname, "..", "public", "exports", "test-PG201A.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPGS203 = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PGS203.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGS 203');

        //Reten PGS 203
        //PraSekolah Tadika (Kerajaan) 
        let rowNew = worksheet.getRow(16);
        rowNew.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(5).value = results.dStatusdfx; //d Status dfx PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(6).value = results.fStatusdfx; //f Status dfx PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(7).value = results.XStatusdfx; //X Status dfx PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(10).value = results.dStatusDMFX; //d Status DMFX PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(11).value = results.mStatusDMFX; //m Status DMFX PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(12).value = results.fStatusDMFX; //f Status DMFX PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(13).value = results.xStatusDMFX; //x Status DMFX PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(25).value = results.tpr; //TPR PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(26).value = results.skorGIS0; //Skor GIS 0 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(27).value = results.skorGIS1; //Skor GIS 1 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(28).value = results.skorGIS2; //Skor GIS 2 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(29).value = results.skorGIS3; //Skor GIS 3 PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(30).value = results.perluFvMurid; //Perlu FV Murid PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(50).value = results.telahFvMurid; //Telah FV Murid PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(70).value = results.cabutanGd; //Cabutan GD PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(71).value = results.cabutanGk; //Cabutan GK PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(73).value = results.penskaleran; //Penskaleran PraSekolah Tadika (Kerajaan) 
        rowNew.getCell(74).value = results.caseCompleted; //Kes Selesai PraSekolah Tadika (Kerajaan) 

        //PraSekolah Tadika (Swasta) 
        let rowNew2 = worksheet.getRow(17);
        rowNew2.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru PraSekolah Tadika (Swasta) 
        rowNew2.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan PraSekolah Tadika (Swasta) 
        rowNew2.getCell(5).value = results.dStatusdfx; //d Status dfx PraSekolah Tadika (Swasta) 
        rowNew2.getCell(6).value = results.fStatusdfx; //f Status dfx PraSekolah Tadika (Swasta) 
        rowNew2.getCell(7).value = results.XStatusdfx; //X Status dfx PraSekolah Tadika (Swasta) 
        rowNew2.getCell(10).value = results.dStatusDMFX; //d Status DMFX PraSekolah Tadika (Swasta) 
        rowNew2.getCell(11).value = results.mStatusDMFX; //m Status DMFX PraSekolah Tadika (Swasta) 
        rowNew2.getCell(12).value = results.fStatusDMFX; //f Status DMFX PraSekolah Tadika (Swasta) 
        rowNew2.getCell(13).value = results.xStatusDMFX; //x Status DMFX PraSekolah Tadika (Swasta) 
        rowNew2.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) PraSekolah Tadika (Swasta) 
        rowNew2.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) PraSekolah Tadika (Swasta) 
        rowNew2.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior PraSekolah Tadika (Swasta) 
        rowNew2.getCell(25).value = results.tpr; //TPR PraSekolah Tadika (Swasta) 
        rowNew2.getCell(26).value = results.skorGIS0; //Skor GIS 0 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(27).value = results.skorGIS1; //Skor GIS 1 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(28).value = results.skorGIS2; //Skor GIS 2 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(29).value = results.skorGIS3; //Skor GIS 3 PraSekolah Tadika (Swasta) 
        rowNew2.getCell(30).value = results.perluFvMurid; //Perlu FV Murid PraSekolah Tadika (Swasta) 
        rowNew2.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid PraSekolah Tadika (Swasta) 
        rowNew2.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(50).value = results.telahFvMurid; //Telah FV Murid PraSekolah Tadika (Swasta) 
        rowNew2.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid PraSekolah Tadika (Swasta) 
        rowNew2.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B PraSekolah Tadika (Swasta) 
        rowNew2.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S PraSekolah Tadika (Swasta) 
        rowNew2.getCell(70).value = results.cabutanGd; //Cabutan GD PraSekolah Tadika (Swasta) 
        rowNew2.getCell(71).value = results.cabutanGk; //Cabutan GK PraSekolah Tadika (Swasta) 
        rowNew2.getCell(73).value = results.penskaleran; //Penskaleran PraSekolah Tadika (Swasta) 
        rowNew2.getCell(74).value = results.caseCompleted; //Kes Selesai PraSekolah Tadika (Swasta) 

        //PraSekolah Tadika (Murid Pendidikan Khas) 
        let rowNew3 = worksheet.getRow(18);
        rowNew3.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(5).value = results.dStatusdfx; //d Status dfx PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(6).value = results.fStatusdfx; //f Status dfx PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(7).value = results.XStatusdfx; //X Status dfx PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(10).value = results.dStatusDMFX; //d Status DMFX PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(11).value = results.mStatusDMFX; //m Status DMFX PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(12).value = results.fStatusDMFX; //f Status DMFX PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(13).value = results.xStatusDMFX; //x Status DMFX PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(25).value = results.tpr; //TPR PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(26).value = results.skorGIS0; //Skor GIS 0 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(27).value = results.skorGIS1; //Skor GIS 1 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(28).value = results.skorGIS2; //Skor GIS 2 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(29).value = results.skorGIS3; //Skor GIS 3 PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(30).value = results.perluFvMurid; //Perlu FV Murid PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(50).value = results.telahFvMurid; //Telah FV Murid PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(70).value = results.cabutanGd; //Cabutan GD PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(71).value = results.cabutanGk; //Cabutan GK PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(73).value = results.penskaleran; //Penskaleran PraSekolah Tadika (Murid Pendidikan Khas) 
        rowNew3.getCell(74).value = results.caseCompleted; //Kes Selesai PraSekolah Tadika (Murid Pendidikan Khas)
        rowNew3.commit();

        //Klinik atau Pusat Pergigian Sekolah (Tahun 1)
        let rowNew4 = worksheet.getRow(20);
        rowNew4.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(5).value = results.dStatusdfx; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(6).value = results.fStatusdfx; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(7).value = results.XStatusdfx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(10).value = results.dStatusDMFX; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(11).value = results.mStatusDMFX; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(12).value = results.fStatusDMFX; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(13).value = results.xStatusDMFX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(25).value = results.tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(26).value = results.skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(27).value = results.skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(28).value = results.skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(29).value = results.skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(70).value = results.cabutanGd; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(71).value = results.cabutanGk; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(73).value = results.penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tahun 1) 
        rowNew4.getCell(74).value = results.caseCompleted; //Kes Selesai Klinik atau Pusat Pergigian Sekolah (Tahun 1)a
        rowNew4.commit();

        //Pasukan atau Klinik Pergigian Bergerak (Tahun 1)
        let rowNew5 = worksheet.getRow(21);
        rowNew5.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(5).value = results.dStatusdfx; //d Status dfx Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(6).value = results.fStatusdfx; //f Status dfx Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(7).value = results.XStatusdfx; //X Status dfx Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(10).value = results.dStatusDMFX; //d Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(11).value = results.mStatusDMFX; //m Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(12).value = results.fStatusDMFX; //f Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(13).value = results.xStatusDMFX; //x Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(25).value = results.tpr; //TPR Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(26).value = results.skorGIS0; //Skor GIS 0 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(27).value = results.skorGIS1; //Skor GIS 1 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(28).value = results.skorGIS2; //Skor GIS 2 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(29).value = results.skorGIS3; //Skor GIS 3 Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(50).value = results.telahFvMurid; //Telah FV Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(70).value = results.cabutanGd; //Cabutan GD Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(71).value = results.cabutanGk; //Cabutan GK Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(73).value = results.penskaleran; //Penskaleran Pasukan atau Klinik Pergigian Bergerak (Tahun 1) 
        rowNew5.getCell(74).value = results.caseCompleted; //Kes Selesai Pasukan atau Klinik Pergigian Bergerak (Tahun 1)
        rowNew5.commit();

        //Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        let rowNew6 = worksheet.getRow(23);
        rowNew6.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(5).value = results.dStatusdfx; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(6).value = results.fStatusdfx; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(7).value = results.XStatusdfx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(10).value = results.dStatusDMFX; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(11).value = results.mStatusDMFX; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(12).value = results.fStatusDMFX; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(13).value = results.xStatusDMFX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(25).value = results.tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(26).value = results.skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(27).value = results.skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(28).value = results.skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(29).value = results.skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(70).value = results.cabutanGd; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(71).value = results.cabutanGk; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(73).value = results.penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.getCell(74).value = results.caseCompleted; //Kes Selesai Klinik atau Pusat Pergigian Sekolah (Tahun 6)
        rowNew6.commit();

        //Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        let rowNew7 = worksheet.getRow(24);
        rowNew7.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(5).value = results.dStatusdfx; //d Status dfx Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(6).value = results.fStatusdfx; //f Status dfx Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(7).value = results.XStatusdfx; //X Status dfx Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(10).value = results.dStatusDMFX; //d Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(11).value = results.mStatusDMFX; //m Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(12).value = results.fStatusDMFX; //f Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(13).value = results.xStatusDMFX; //x Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(25).value = results.tpr; //TPR Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(26).value = results.skorGIS0; //Skor GIS 0 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(27).value = results.skorGIS1; //Skor GIS 1 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(28).value = results.skorGIS2; //Skor GIS 2 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(29).value = results.skorGIS3; //Skor GIS 3 Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(50).value = results.telahFvMurid; //Telah FV Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(70).value = results.cabutanGd; //Cabutan GD Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(71).value = results.cabutanGk; //Cabutan GK Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(73).value = results.penskaleran; //Penskaleran Pasukan atau Klinik Pergigian Bergerak (Tahun 6) 
        rowNew7.getCell(74).value = results.caseCompleted; //Kes Selesai Pasukan atau Klinik Pergigian Bergerak (Tahun 6)
        rowNew7.commit();
        
        //Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        let rowNew8 = worksheet.getRow(26);
        rowNew8.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(5).value = results.dStatusdfx; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(6).value = results.fStatusdfx; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(7).value = results.XStatusdfx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(10).value = results.dStatusDMFX; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(11).value = results.mStatusDMFX; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(12).value = results.fStatusDMFX; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(13).value = results.xStatusDMFX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(25).value = results.tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(26).value = results.skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(27).value = results.skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(28).value = results.skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(29).value = results.skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(70).value = results.cabutanGd; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(71).value = results.cabutanGk; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(73).value = results.penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.getCell(74).value = results.caseCompleted; //Kes Selesai Pusat Pergigian Sekolah (Pendidikan Khas Rendah)
        rowNew8.commit();

        //Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        let rowNew9 = worksheet.getRow(27);
        rowNew9.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(5).value = results.dStatusdfx; //d Status dfx Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(6).value = results.fStatusdfx; //f Status dfx Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(7).value = results.XStatusdfx; //X Status dfx Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(10).value = results.dStatusDMFX; //d Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(11).value = results.mStatusDMFX; //m Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(12).value = results.fStatusDMFX; //f Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(13).value = results.xStatusDMFX; //x Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(25).value = results.tpr; //TPR Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(26).value = results.skorGIS0; //Skor GIS 0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(27).value = results.skorGIS1; //Skor GIS 1 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(28).value = results.skorGIS2; //Skor GIS 2 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(29).value = results.skorGIS3; //Skor GIS 3 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(50).value = results.telahFvMurid; //Telah FV Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(70).value = results.cabutanGd; //Cabutan GD Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(71).value = results.cabutanGk; //Cabutan GK Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(73).value = results.penskaleran; //Penskaleran Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.getCell(74).value = results.caseCompleted; //Kes Selesai Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Rendah)
        rowNew9.commit();

        //Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        let rowNew10 = worksheet.getRow(29);
        rowNew10.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(5).value = results.dStatusdfx; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(6).value = results.fStatusdfx; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(7).value = results.XStatusdfx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(10).value = results.dStatusDMFX; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(11).value = results.mStatusDMFX; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(12).value = results.fStatusDMFX; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(13).value = results.xStatusDMFX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(25).value = results.tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(26).value = results.skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(27).value = results.skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(28).value = results.skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(29).value = results.skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(70).value = results.cabutanGd; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(71).value = results.cabutanGk; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(73).value = results.penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.getCell(74).value = results.caseCompleted; //Kes Selesai Pusat Pergigian Sekolah (Semua Murid Sekolah Rendah)
        rowNew10.commit();

        //Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        let rowNew11 = worksheet.getRow(30);
        rowNew11.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(5).value = results.dStatusdfx; //d Status dfx Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(6).value = results.fStatusdfx; //f Status dfx Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(7).value = results.XStatusdfx; //X Status dfx Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(10).value = results.dStatusDMFX; //d Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(11).value = results.mStatusDMFX; //m Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(12).value = results.fStatusDMFX; //f Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(13).value = results.xStatusDMFX; //x Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(25).value = results.tpr; //TPR Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(26).value = results.skorGIS0; //Skor GIS 0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(27).value = results.skorGIS1; //Skor GIS 1 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(28).value = results.skorGIS2; //Skor GIS 2 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(29).value = results.skorGIS3; //Skor GIS 3 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(50).value = results.telahFvMurid; //Telah FV Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(70).value = results.cabutanGd; //Cabutan GD Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(71).value = results.cabutanGk; //Cabutan GK Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(73).value = results.penskaleran; //Penskaleran Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.getCell(74).value = results.caseCompleted; //Kes Selesai Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Rendah)
        rowNew11.commit();

        //Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        let rowNew12 = worksheet.getRow(32);
        rowNew12.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(5).value = results.dStatusdfx; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(6).value = results.fStatusdfx; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(7).value = results.XStatusdfx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(10).value = results.dStatusDMFX; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(11).value = results.mStatusDMFX; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(12).value = results.fStatusDMFX; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(13).value = results.xStatusDMFX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(25).value = results.tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(26).value = results.skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(27).value = results.skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(28).value = results.skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(29).value = results.skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(70).value = results.cabutanGd; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(71).value = results.cabutanGk; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(73).value = results.penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.getCell(74).value = results.caseCompleted; //Kes Selesai Pusat Pergigian Sekolah (Tingkatan 4)
        rowNew12.commit();

        //Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        let rowNew13 = worksheet.getRow(33);
        rowNew13.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(5).value = results.dStatusdfx; //d Status dfx Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(6).value = results.fStatusdfx; //f Status dfx Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(7).value = results.XStatusdfx; //X Status dfx Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(10).value = results.dStatusDMFX; //d Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(11).value = results.mStatusDMFX; //m Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(12).value = results.fStatusDMFX; //f Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(13).value = results.xStatusDMFX; //x Status DMFX Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(25).value = results.tpr; //TPR Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(26).value = results.skorGIS0; //Skor GIS 0 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(27).value = results.skorGIS1; //Skor GIS 1 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(28).value = results.skorGIS2; //Skor GIS 2 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(29).value = results.skorGIS3; //Skor GIS 3 Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(50).value = results.telahFvMurid; //Telah FV Murid Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(70).value = results.cabutanGd; //Cabutan GD Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(71).value = results.cabutanGk; //Cabutan GK Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(73).value = results.penskaleran; //Penskaleran Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)
        rowNew13.getCell(74).value = results.caseCompleted; //Kes Selesai Pasukan atau Klinik Pergigian Bergerak (Tingkatan 4)\
        rowNew13.commit();

        //Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        let rowNew14 = worksheet.getRow(35);
        rowNew14.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(5).value = results.dStatusdfx; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(6).value = results.fStatusdfx; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(7).value = results.XStatusdfx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(10).value = results.dStatusDMFX; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(11).value = results.mStatusDMFX; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(12).value = results.fStatusDMFX; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(13).value = results.xStatusDMFX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(25).value = results.tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(26).value = results.skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(27).value = results.skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(28).value = results.skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(29).value = results.skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(70).value = results.cabutanGd; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(71).value = results.cabutanGk; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(73).value = results.penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.getCell(74).value = results.caseCompleted; //Kes Selesai Pusat Pergigian Sekolah (Pendidikan Khas Menengah)
        rowNew14.commit();

        //Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        let rowNew15 = worksheet.getRow(36);
        rowNew15.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(5).value = results.dStatusdfx; //d Status dfx Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(6).value = results.fStatusdfx; //f Status dfx Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(7).value = results.XStatusdfx; //X Status dfx Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(10).value = results.dStatusDMFX; //d Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(11).value = results.mStatusDMFX; //m Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(12).value = results.fStatusDMFX; //f Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(13).value = results.xStatusDMFX; //x Status DMFX Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(25).value = results.tpr; //TPR Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(26).value = results.skorGIS0; //Skor GIS 0 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(27).value = results.skorGIS1; //Skor GIS 1 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(28).value = results.skorGIS2; //Skor GIS 2 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(29).value = results.skorGIS3; //Skor GIS 3 Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(50).value = results.telahFvMurid; //Telah FV Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(70).value = results.cabutanGd; //Cabutan GD Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(71).value = results.cabutanGk; //Cabutan GK Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(73).value = results.penskaleran; //Penskaleran Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.getCell(74).value = results.caseCompleted; //Kes Selesai Pasukan atau Klinik Pergigian Bergerak (Pendidikan Khas Menengah)
        rowNew15.commit();

        //Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        let rowNew16 = worksheet.getRow(38);
        rowNew16.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(5).value = results.dStatusdfx; //d Status dfx Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(6).value = results.fStatusdfx; //f Status dfx Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(7).value = results.XStatusdfx; //X Status dfx Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(10).value = results.dStatusDMFX; //d Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(11).value = results.mStatusDMFX; //m Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(12).value = results.fStatusDMFX; //f Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(13).value = results.xStatusDMFX; //x Status DMFX Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(25).value = results.tpr; //TPR Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(26).value = results.skorGIS0; //Skor GIS 0 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(27).value = results.skorGIS1; //Skor GIS 1 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(28).value = results.skorGIS2; //Skor GIS 2 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(29).value = results.skorGIS3; //Skor GIS 3 Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(50).value = results.telahFvMurid; //Telah FV Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(70).value = results.cabutanGd; //Cabutan GD Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(71).value = results.cabutanGk; //Cabutan GK Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(73).value = results.penskaleran; //Penskaleran Klinik atau Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.getCell(74).value = results.caseCompleted; //Kes Selesai Pusat Pergigian Sekolah (Semua Murid Sekolah Menengah)
        rowNew16.commit();

        //Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        let rowNew17 = worksheet.getRow(39);
        rowNew17.getCell(3).value = results.kedatanganEnggan; //Kedatangan Baru Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(4).value = results.kedatanganUlangan; //Kedatangn Ulangan Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(5).value = results.dStatusdfx; //d Status dfx Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(6).value = results.fStatusdfx; //f Status dfx Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(7).value = results.XStatusdfx; //X Status dfx Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(10).value = results.dStatusDMFX; //d Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(11).value = results.mStatusDMFX; //m Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(12).value = results.fStatusDMFX; //f Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(13).value = results.xStatusDMFX; //x Status DMFX Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(16).value = results.mbk; //Mulut Bebas Karies (MBK) Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(17).value = results.dfxEqualToZero; //dfx = results.0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(18).value = results.statusBebasKaries; //Status Gigi Kekal Bebas Karies (BK) DMFX = results.0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(19).value = results.totalStatusGigiKekalSamaKosong; //X + M = results.0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(20).value = results.gigiKekalDMFXsamaAtauKurangDari1; //DMFX <= 1 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(21).value = results.gigiKekalDMFXsamaAtauKurangDari2; //DMFX <=2 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(22).value = results.eMoreThanZero; //E ≥ 1 (ada karies awal) Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(23).value = results.statusBebasKariesTapiElebihDariSatu; //Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(24).value = results.kecederaanGigiAnterior; //Kecederaan Gigi Anterior Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(25).value = results.tpr; //TPR Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(26).value = results.skorGIS0; //Skor GIS 0 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(27).value = results.skorGIS1; //Skor GIS 1 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(28).value = results.skorGIS2; //Skor GIS 2 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(29).value = results.skorGIS3; //Skor GIS 3 Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(30).value = results.perluFvMurid; //Perlu FV Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(31).value = results.perluPRR1Murid; //Perlu PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(32).value = results.perluFSMuridB; //Perlu FS Murid B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(33).value = results.perluFSMuridS; //Perlu FS Murid S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(34).value = results.perluFSGigiB; //Perlu FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(35).value = results.perluFSGigiS; //Perlu FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(36).value = results.perluTampalanAntGdB; //Perlu Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(37).value = results.perluTampalanAntGdS; //Perlu Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(38).value = results.perluTampalanAntGkB; //Perlu Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(39).value = results.perluTampalanAntGkS; //Perlu Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(40).value = results.perluTampalanPosGdB; //Perlu Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(41).value = results.perluTampalanPosGdS; //Perlu Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(42).value = results.perluTampalanPosGkB; //Perlu Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(43).value = results.perluTampalanPosGkS; //Perlu Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(44).value = results.perluTampalanAmgGdB; //Perlu Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(45).value = results.perluTampalanAmgGdS; //Perlu Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(46).value = results.perluTampalanAmgGkB; //Perlu Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(47).value = results.perluTampalanAmgGkS; //Perlu Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(50).value = results.telahFvMurid; //Telah FV Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(51).value = results.telahPRR1Murid; //Telah PRR1 Murid Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(52).value = results.telahFSMuridB; //Telah FS Murid B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(53).value = results.telahFSMuridS; //Telah FS Murid S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(54).value = results.telahFSGigiB; //Telah FS Gigi B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(55).value = results.telahFSGigiS; //Telah FS Gigi S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(56).value = results.telahTampalanAntGdB; //Telah Tampalan Anterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(57).value = results.telahTampalanAntGdS; //Telah Tampalan Anterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(58).value = results.telahTampalanAntGkB; //Telah Tampalan Anterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(59).value = results.telahTampalanAntGkS; //Telah Tampalan Anterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(60).value = results.telahTampalanPosGdB; //Telah Tampalan Posterior Sewarna GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(61).value = results.telahTampalanPosGdS; //Telah Tampalan Posterior Sewarna GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(62).value = results.telahTampalanPosGkB; //Telah Tampalan Posterior Sewarna GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(63).value = results.telahTampalanPosGkS; //Telah Tampalan Posterior Sewarna GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(64).value = results.telahTampalanAmgGdB; //Telah Tampalan Posterior Amalgam GD B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(65).value = results.telahTampalanAmgGdS; //Telah Tampalan Posterior Amalgam GD S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(66).value = results.telahTampalanAmgGkB; //Telah Tampalan Posterior Amalgam GK B Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(67).value = results.telahTampalanAmgGkS; //Telah Tampalan Posterior Amalgam GK S Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(70).value = results.cabutanGd; //Cabutan GD Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(71).value = results.cabutanGk; //Cabutan GK Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(73).value = results.penskaleran; //Penskaleran Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.getCell(74).value = results.caseCompleted; //Kes Selesai Pasukan atau Klinik Pergigian Bergerak (Semua Murid Sekolah Menengah)
        rowNew17.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-PGS203.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPG201SMKP = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PG201SMKP.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PGS201SMKP');

        // darjah/tingkatan 1
        let rowNew = worksheet.getRow(17);
        rowNew.getCell(2).value = results.kedatanganEnggan; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(3).value = results.kedatanganTidakHadir; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(4).value = results.enrolmen; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(5).value = results.kedatanganbaru; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(6).value = results.kedatanganUlangan; // Kedatangan  darjah/tingkatan 1
        rowNew.getCell(7).value = results.skorPlakA; // Skor Plak A darjah/tingkatan 1
        rowNew.getCell(9).value = results.dStatusdfx; // d  darjah/tingkatan 1
        rowNew.getCell(10).value = results.fStatusdfx; // f  darjah/tingkatan 1
        rowNew.getCell(11).value = results.xStatusdfx; // x  darjah/tingkatan 1
        rowNew.getCell(13).value = results.dStatusDMFX; // D  darjah/tingkatan 1
        rowNew.getCell(14).value = results.mStatusDMFX; // M  darjah/tingkatan 1
        rowNew.getCell(15).value = results.fStatusDMFX; // F  darjah/tingkatan 1
        rowNew.getCell(16).value = results.xStatusDMFX; // X  darjah/tingkatan 1
        rowNew.getCell(18).value = results.gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 darjah/tingkatan 1
        rowNew.getCell(19).value = results.totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  darjah/tingkatan 1
        rowNew.getCell(20).value = results.mbk; // Mulut Bebas Karies (MBK)  darjah/tingkatan 1
        rowNew.getCell(21).value = results.statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  darjah/tingkatan 1
        rowNew.getCell(22).value = results.dfxEqualToZero; // dfx = results.0   darjah/tingkatan 1
        rowNew.getCell(23).value = results.mulutBebasGingivitis; // Mulut Bebas Gingivitis (MBG)  darjah/tingkatan 1
        rowNew.getCell(24).value = results.tpr; // Tidak perlu rawatan  darjah/tingkatan 1
        rowNew.getCell(25).value = results.kecederaanGigiAnterior; // X  darjah/tingkatan 1
        rowNew.getCell(26).value = results.cleftAda; // X  darjah/tingkatan 1
        rowNew.getCell(27).value = results.cleftRujuk; // X  darjah/tingkatan 1
        rowNew.getCell(29).value = results.perluFSMuridB; // X  darjah/tingkatan 1
        rowNew.getCell(30).value = results.perluFSGigiB; // X  darjah/tingkatan 1
        rowNew.getCell(31).value = results.perluFsBilGigiFailed; // X  darjah/tingkatan 1
        rowNew.getCell(32).value = results.perluTampalanAntGdB; // X  darjah/tingkatan 1
        rowNew.getCell(33).value = results.perluTampalanAntGkB; // X  darjah/tingkatan 1
        rowNew.getCell(34).value = results.perluTampalanPosGdB; // X  darjah/tingkatan 1
        rowNew.getCell(35).value = results.perluTampalanPosGkB; // X  darjah/tingkatan 1
        rowNew.getCell(36).value = results.perluTampalanAmgGdB; // X  darjah/tingkatan 1
        rowNew.getCell(37).value = results.perluTampalanAmgGkB; // X  darjah/tingkatan 1         
        rowNew.getCell(39).value = results.telahFSMuridB; // telahFSMuridS  darjah/tingkatan 1
        rowNew.getCell(40).value = results.telahFSGigiB; //   darjah/tingkatan 1
        rowNew.getCell(41).value = results.telahTampalanAntGdB; // X  darjah/tingkatan 1
        rowNew.getCell(42).value = results.telahTampalanAntGkB; // X  darjah/tingkatan 1
        rowNew.getCell(43).value = results.telahTampalanPosGdB; // X  darjah/tingkatan 1
        rowNew.getCell(44).value = results.telahTampalanPosGkB; // X  darjah/tingkatan 1
        rowNew.getCell(45).value = results.telahTampalanAmgGdB; // X  darjah/tingkatan 1
        rowNew.getCell(46).value = results.telahTampalanAmgGkB; // X  darjah/tingkatan 1
        rowNew.getCell(48).value = results.cabutanGd// Cabutan GD  darjah/tingkatan 1
        rowNew.getCell(49).value = results.cabutanGk// Cabutan GK  darjah/tingkatan 1
        rowNew.getCell(50).value = results.penskaleran// Penskaleran  darjah/tingkatan 1
        rowNew.getCell(51).value = results.kesSelesai// Kes selesai  darjah/tingkatan 1
        rowNew.getCell(52).value = results.skorGIS0// Skor GIS 0  darjah/tingkatan 1
        rowNew.getCell(53).value = results.skorGIS1// Skor GIS 1  darjah/tingkatan 1
        rowNew.getCell(54).value = results.skorGIS2// Skor GIS 2  darjah/tingkatan 1
        rowNew.getCell(55).value = results.skorGIS3// Skor GIS 3  darjah/tingkatan 1
        rowNew.commit();        
        
        let rowNew2 = worksheet.getRow(18);
        rowNew2.getCell(2).value = results.skorPlakC; // darjah/tingkatan 1
        rowNew2.commit();

        let rowNew3 = worksheet.getRow(19);
        rowNew3.getCell(2).value = results.skorPlakE; // darjah/tingkatan 1
        rowNew3.commit();

        let rowNew4 = worksheet.getRow(19);
        rowNew4.getCell(30).value = results.perluFSGigiS; // darjah/tingkatan 1
        rowNew4.getCell(32).value = results.perluTampalanAntGdS//   darjah/tingkatan 1
        rowNew4.getCell(33).value = results.perluTampalanAntGkS//   darjah/tingkatan 1
        rowNew4.getCell(34).value = results.perluTampalanPosGdS//   darjah/tingkatan 1
        rowNew4.getCell(35).value = results.perluTampalanPosGkS//   darjah/tingkatan 1
        rowNew4.getCell(36).value = results.perluTampalanAmgGdS//   darjah/tingkatan 1
        rowNew4.getCell(37).value = results.perluTampalanAmgGkS//   darjah/tingkatan 1
        rowNew4.getCell(39).value = results.telahFSMuridS//   darjah/tingkatan 1
        rowNew4.getCell(40).value = results.telahFSGigiS//   darjah/tingkatan 1
        rowNew4.getCell(41).value = results.telahTampalanAntGdS//   darjah/tingkatan 1
        rowNew4.getCell(42).value = results.telahTampalanAntGkS//   darjah/tingkatan 1
        rowNew4.getCell(43).value = results.telahTampalanPosGdS//   darjah/tingkatan 1
        rowNew4.getCell(44).value = results.telahTampalanPosGkS//   darjah/tingkatan 1
        rowNew4.getCell(45).value = results.telahTampalanAmgGkS//   darjah/tingkatan 1
        rowNew4.getCell(46).value = results.telahTampalanAmgGkS//   darjah/tingkatan 1
        rowNew4.commit();

        // darjah/tingkatan 2
        let rowNew5 = worksheet.getRow(20);
        rowNew5.getCell(2).value = results.kedatanganEnggan; // Kedatangan  darjah/tingkatan 2
        rowNew5.getCell(3).value = results.kedatanganTidakHadir; // Kedatangan  darjah/tingkatan 2
        rowNew5.getCell(4).value = results.enrolmen; // Kedatangan  darjah/tingkatan 2
        rowNew5.getCell(5).value = results.kedatanganbaru; // Kedatangan  darjah/tingkatan 2
        rowNew5.getCell(6).value = results.kedatanganUlangan; // Kedatangan  darjah/tingkatan 2
        rowNew5.getCell(7).value = results.skorPlakA; // Skor Plak A darjah/tingkatan 2
        rowNew5.getCell(9).value = results.dStatusdfx; // d  darjah/tingkatan 2
        rowNew5.getCell(10).value = results.fStatusdfx; // f  darjah/tingkatan 2
        rowNew5.getCell(11).value = results.xStatusdfx; // x  darjah/tingkatan 2
        rowNew5.getCell(13).value = results.dStatusDMFX; // D  darjah/tingkatan 2
        rowNew5.getCell(14).value = results.mStatusDMFX; // M  darjah/tingkatan 2
        rowNew5.getCell(15).value = results.fStatusDMFX; // F  darjah/tingkatan 2
        rowNew5.getCell(16).value = results.xStatusDMFX; // X  darjah/tingkatan 2
        rowNew5.getCell(18).value = results.gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 darjah/tingkatan 2
        rowNew5.getCell(19).value = results.totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  darjah/tingkatan 2
        rowNew5.getCell(20).value = results.mbk; // Mulut Bebas Karies (MBK)  darjah/tingkatan 2
        rowNew5.getCell(21).value = results.statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  darjah/tingkatan 2
        rowNew5.getCell(22).value = results.dfxEqualToZero; // dfx = results.0   darjah/tingkatan 2
        rowNew5.getCell(23).value = results.mulutBebasGingivitis; // Mulut Bebas Gingivitis (MBG)  darjah/tingkatan 2
        rowNew5.getCell(24).value = results.tpr; // Tidak perlu rawatan  darjah/tingkatan 2
        rowNew5.getCell(25).value = results.kecederaanGigiAnterior; // X  darjah/tingkatan 2
        rowNew5.getCell(26).value = results.cleftAda; // X  darjah/tingkatan 2
        rowNew5.getCell(27).value = results.cleftRujuk; // X  darjah/tingkatan 2
        rowNew5.getCell(29).value = results.perluFSMuridB; // X  darjah/tingkatan 2
        rowNew5.getCell(30).value = results.perluFSGigiB; // X  darjah/tingkatan 2
        rowNew5.getCell(31).value = results.perluFsBilGigiFailed; // X  darjah/tingkatan 2
        rowNew5.getCell(32).value = results.perluTampalanAntGdB; // X  darjah/tingkatan 2
        rowNew5.getCell(33).value = results.perluTampalanAntGkB; // X  darjah/tingkatan 2
        rowNew5.getCell(34).value = results.perluTampalanPosGdB; // X  darjah/tingkatan 2
        rowNew5.getCell(35).value = results.perluTampalanPosGkB; // X  darjah/tingkatan 2
        rowNew5.getCell(36).value = results.perluTampalanAmgGdB; // X  darjah/tingkatan 2
        rowNew5.getCell(37).value = results.perluTampalanAmgGkB; // X  darjah/tingkatan 2         
        rowNew5.getCell(39).value = results.telahFSMuridB; // telahFSMuridS  darjah/tingkatan 2
        rowNew5.getCell(40).value = results.telahFSGigiB; //   darjah/tingkatan 2
        rowNew5.getCell(41).value = results.telahTampalanAntGdB; // X  darjah/tingkatan 2
        rowNew5.getCell(42).value = results.telahTampalanAntGkB; // X  darjah/tingkatan 2
        rowNew5.getCell(43).value = results.telahTampalanPosGdB; // X  darjah/tingkatan 2
        rowNew5.getCell(44).value = results.telahTampalanPosGkB; // X  darjah/tingkatan 2
        rowNew5.getCell(45).value = results.telahTampalanAmgGdB; // X  darjah/tingkatan 2
        rowNew5.getCell(46).value = results.telahTampalanAmgGkB; // X  darjah/tingkatan 2
        rowNew5.getCell(48).value = results.cabutanGd// Cabutan GD  darjah/tingkatan 2
        rowNew5.getCell(49).value = results.cabutanGk// Cabutan GK  darjah/tingkatan 2
        rowNew5.getCell(50).value = results.penskaleran// Penskaleran  darjah/tingkatan 2
        rowNew5.getCell(51).value = results.kesSelesai// Kes selesai  darjah/tingkatan 2
        rowNew5.getCell(52).value = results.skorGIS0// Skor GIS 0  darjah/tingkatan 2
        rowNew5.getCell(53).value = results.skorGIS1// Skor GIS 1  darjah/tingkatan 2
        rowNew5.getCell(54).value = results.skorGIS2// Skor GIS 2  darjah/tingkatan 2
        rowNew5.getCell(55).value = results.skorGIS3// Skor GIS 3  darjah/tingkatan 2
        rowNew5.commit();

        let rowNew6 = worksheet.getRow(21);
        rowNew6.getCell(2).value = results.skorPlakC; // darjah/tingkatan 2
        rowNew6.commit();

        let rowNew7 = worksheet.getRow(22);
        rowNew7.getCell(2).value = results.skorPlakE; // darjah/tingkatan 2
        rowNew7.commit();

        let rowNew8 = worksheet.getRow(22);
        rowNew8.getCell(30).value = results.perluFSGigiS; // darjah/tingkatan 2
        rowNew8.getCell(32).value = results.perluTampalanAntGdS//   darjah/tingkatan 2
        rowNew8.getCell(33).value = results.perluTampalanAntGkS//   darjah/tingkatan 2
        rowNew8.getCell(34).value = results.perluTampalanPosGdS//   darjah/tingkatan 2
        rowNew8.getCell(35).value = results.perluTampalanPosGkS//   darjah/tingkatan 2
        rowNew8.getCell(36).value = results.perluTampalanAmgGdS//   darjah/tingkatan 2
        rowNew8.getCell(37).value = results.perluTampalanAmgGkS//   darjah/tingkatan 2
        rowNew8.getCell(39).value = results.telahFSMuridS//   darjah/tingkatan 2
        rowNew8.getCell(40).value = results.telahFSGigiS//   darjah/tingkatan 2
        rowNew8.getCell(41).value = results.telahTampalanAntGdS//   darjah/tingkatan 2
        rowNew8.getCell(42).value = results.telahTampalanAntGkS//   darjah/tingkatan 2
        rowNew8.getCell(43).value = results.telahTampalanPosGdS//   darjah/tingkatan 2
        rowNew8.getCell(44).value = results.telahTampalanPosGkS//   darjah/tingkatan 2
        rowNew8.getCell(45).value = results.telahTampalanAmgGkS//   darjah/tingkatan 2
        rowNew8.getCell(46).value = results.telahTampalanAmgGkS//   darjah/tingkatan 2
        rowNew8.commit();

        // darjah/tingkatan 3
        let rowNew9 = worksheet.getRow(23);
        rowNew9.getCell(2).value = results.kedatanganEnggan; // Kedatangan  darjah/tingkatan 3
        rowNew9.getCell(3).value = results.kedatanganTidakHadir; // Kedatangan  darjah/tingkatan 3
        rowNew9.getCell(4).value = results.enrolmen; // Kedatangan  darjah/tingkatan 3
        rowNew9.getCell(5).value = results.kedatanganbaru; // Kedatangan  darjah/tingkatan 3
        rowNew9.getCell(6).value = results.kedatanganUlangan; // Kedatangan  darjah/tingkatan 3
        rowNew9.getCell(7).value = results.skorPlakA; // Skor Plak A darjah/tingkatan 3
        rowNew9.getCell(9).value = results.dStatusdfx; // d  darjah/tingkatan 3
        rowNew9.getCell(10).value = results.fStatusdfx; // f  darjah/tingkatan 3
        rowNew9.getCell(11).value = results.xStatusdfx; // x  darjah/tingkatan 3
        rowNew9.getCell(13).value = results.dStatusDMFX; // D  darjah/tingkatan 3
        rowNew9.getCell(14).value = results.mStatusDMFX; // M  darjah/tingkatan 3
        rowNew9.getCell(15).value = results.fStatusDMFX; // F  darjah/tingkatan 3
        rowNew9.getCell(16).value = results.xStatusDMFX; // X  darjah/tingkatan 3
        rowNew9.getCell(18).value = results.gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 darjah/tingkatan 3
        rowNew9.getCell(19).value = results.totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  darjah/tingkatan 3
        rowNew9.getCell(20).value = results.mbk; // Mulut Bebas Karies (MBK)  darjah/tingkatan 3
        rowNew9.getCell(21).value = results.statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  darjah/tingkatan 3
        rowNew9.getCell(22).value = results.dfxEqualToZero; // dfx = results.0   darjah/tingkatan 3
        rowNew9.getCell(23).value = results.mulutBebasGingivitis; // Mulut Bebas Gingivitis (MBG)  darjah/tingkatan 3
        rowNew9.getCell(24).value = results.tpr; // Tidak perlu rawatan  darjah/tingkatan 3
        rowNew9.getCell(25).value = results.kecederaanGigiAnterior; // X  darjah/tingkatan 3
        rowNew9.getCell(26).value = results.cleftAda; // X  darjah/tingkatan 3
        rowNew9.getCell(27).value = results.cleftRujuk; // X  darjah/tingkatan 3
        rowNew9.getCell(29).value = results.perluFSMuridB; // X  darjah/tingkatan 3
        rowNew9.getCell(30).value = results.perluFSGigiB; // X  darjah/tingkatan 3
        rowNew9.getCell(31).value = results.perluFsBilGigiFailed; // X  darjah/tingkatan 3
        rowNew9.getCell(32).value = results.perluTampalanAntGdB; // X  darjah/tingkatan 3
        rowNew9.getCell(33).value = results.perluTampalanAntGkB; // X  darjah/tingkatan 3
        rowNew9.getCell(34).value = results.perluTampalanPosGdB; // X  darjah/tingkatan 3
        rowNew9.getCell(35).value = results.perluTampalanPosGkB; // X  darjah/tingkatan 3
        rowNew9.getCell(36).value = results.perluTampalanAmgGdB; // X  darjah/tingkatan 3
        rowNew9.getCell(37).value = results.perluTampalanAmgGkB; // X  darjah/tingkatan 3         
        rowNew9.getCell(39).value = results.telahFSMuridB; // telahFSMuridS  darjah/tingkatan 3
        rowNew9.getCell(40).value = results.telahFSGigiB; //   darjah/tingkatan 3
        rowNew9.getCell(41).value = results.telahTampalanAntGdB; // X  darjah/tingkatan 3
        rowNew9.getCell(42).value = results.telahTampalanAntGkB; // X  darjah/tingkatan 3
        rowNew9.getCell(43).value = results.telahTampalanPosGdB; // X  darjah/tingkatan 3
        rowNew9.getCell(44).value = results.telahTampalanPosGkB; // X  darjah/tingkatan 3
        rowNew9.getCell(45).value = results.telahTampalanAmgGdB; // X  darjah/tingkatan 3
        rowNew9.getCell(46).value = results.telahTampalanAmgGkB; // X  darjah/tingkatan 3
        rowNew9.getCell(48).value = results.cabutanGd// Cabutan GD  darjah/tingkatan 3
        rowNew9.getCell(49).value = results.cabutanGk// Cabutan GK  darjah/tingkatan 3
        rowNew9.getCell(50).value = results.penskaleran// Penskaleran  darjah/tingkatan 3
        rowNew9.getCell(51).value = results.kesSelesai// Kes selesai  darjah/tingkatan 3
        rowNew9.getCell(52).value = results.skorGIS0// Skor GIS 0  darjah/tingkatan 3
        rowNew9.getCell(53).value = results.skorGIS1// Skor GIS 1  darjah/tingkatan 3
        rowNew9.getCell(54).value = results.skorGIS2// Skor GIS 2  darjah/tingkatan 3
        rowNew9.getCell(55).value = results.skorGIS3// Skor GIS 3  darjah/tingkatan 3
        rowNew9.commit();

        let rowNew10 = worksheet.getRow(24);
        rowNew10.getCell(2).value = results.skorPlakC; // darjah/tingkatan 3
        rowNew10.commit();
        
        let rowNew11 = worksheet.getRow(25);
        rowNew11.getCell(2).value = results.skorPlakE; // darjah/tingkatan 3
        rowNew11.commit();

        let rowNew12 = worksheet.getRow(25);
        rowNew12.getCell(30).value = results.perluFSGigiS; // darjah/tingkatan 3
        rowNew12.getCell(32).value = results.perluTampalanAntGdS//   darjah/tingkatan 3
        rowNew12.getCell(33).value = results.perluTampalanAntGkS//   darjah/tingkatan 3
        rowNew12.getCell(34).value = results.perluTampalanPosGdS//   darjah/tingkatan 3
        rowNew12.getCell(35).value = results.perluTampalanPosGkS//   darjah/tingkatan 3
        rowNew12.getCell(36).value = results.perluTampalanAmgGdS//   darjah/tingkatan 3
        rowNew12.getCell(37).value = results.perluTampalanAmgGkS//   darjah/tingkatan 3
        rowNew12.getCell(39).value = results.telahFSMuridS//   darjah/tingkatan 3
        rowNew12.getCell(40).value = results.telahFSGigiS//   darjah/tingkatan 3
        rowNew12.getCell(41).value = results.telahTampalanAntGdS//   darjah/tingkatan 3
        rowNew12.getCell(42).value = results.telahTampalanAntGkS//   darjah/tingkatan 3
        rowNew12.getCell(43).value = results.telahTampalanPosGdS//   darjah/tingkatan 3
        rowNew12.getCell(44).value = results.telahTampalanPosGkS//   darjah/tingkatan 3
        rowNew12.getCell(45).value = results.telahTampalanAmgGkS//   darjah/tingkatan 3
        rowNew12.getCell(46).value = results.telahTampalanAmgGkS//   darjah/tingkatan 3
        rowNew12.commit();

        // darjah/tingkatan 4
        let rowNew13 = worksheet.getRow(26);
        rowNew13.getCell(2).value = results.kedatanganEnggan; // Kedatangan  darjah/tingkatan 4
        rowNew13.getCell(3).value = results.kedatanganTidakHadir; // Kedatangan  darjah/tingkatan 4
        rowNew13.getCell(4).value = results.enrolmen; // Kedatangan  darjah/tingkatan 4
        rowNew13.getCell(5).value = results.kedatanganbaru; // Kedatangan  darjah/tingkatan 4
        rowNew13.getCell(6).value = results.kedatanganUlangan; // Kedatangan  darjah/tingkatan 4
        rowNew13.getCell(7).value = results.skorPlakA; // Skor Plak A darjah/tingkatan 4
        rowNew13.getCell(9).value = results.dStatusdfx; // d  darjah/tingkatan 4
        rowNew13.getCell(10).value = results.fStatusdfx; // f  darjah/tingkatan 4
        rowNew13.getCell(11).value = results.xStatusdfx; // x  darjah/tingkatan 4
        rowNew13.getCell(13).value = results.dStatusDMFX; // D  darjah/tingkatan 4
        rowNew13.getCell(14).value = results.mStatusDMFX; // M  darjah/tingkatan 4
        rowNew13.getCell(15).value = results.fStatusDMFX; // F  darjah/tingkatan 4
        rowNew13.getCell(16).value = results.xStatusDMFX; // X  darjah/tingkatan 4
        rowNew13.getCell(18).value = results.gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 darjah/tingkatan 4
        rowNew13.getCell(19).value = results.totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  darjah/tingkatan 4
        rowNew13.getCell(20).value = results.mbk; // Mulut Bebas Karies (MBK)  darjah/tingkatan 4
        rowNew13.getCell(21).value = results.statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  darjah/tingkatan 4
        rowNew13.getCell(22).value = results.dfxEqualToZero; // dfx = results.0   darjah/tingkatan 4
        rowNew13.getCell(23).value = results.mulutBebasGingivitis; // Mulut Bebas Gingivitis (MBG)  darjah/tingkatan 4
        rowNew13.getCell(24).value = results.tpr; // Tidak perlu rawatan  darjah/tingkatan 4
        rowNew13.getCell(25).value = results.kecederaanGigiAnterior; // X  darjah/tingkatan 4
        rowNew13.getCell(26).value = results.cleftAda; // X  darjah/tingkatan 4
        rowNew13.getCell(27).value = results.cleftRujuk; // X  darjah/tingkatan 4
        rowNew13.getCell(29).value = results.perluFSMuridB; // X  darjah/tingkatan 4
        rowNew13.getCell(30).value = results.perluFSGigiB; // X  darjah/tingkatan 4
        rowNew13.getCell(31).value = results.perluFsBilGigiFailed; // X  darjah/tingkatan 4
        rowNew13.getCell(32).value = results.perluTampalanAntGdB; // X  darjah/tingkatan 4
        rowNew13.getCell(33).value = results.perluTampalanAntGkB; // X  darjah/tingkatan 4
        rowNew13.getCell(34).value = results.perluTampalanPosGdB; // X  darjah/tingkatan 4
        rowNew13.getCell(35).value = results.perluTampalanPosGkB; // X  darjah/tingkatan 4
        rowNew13.getCell(36).value = results.perluTampalanAmgGdB; // X  darjah/tingkatan 4
        rowNew13.getCell(37).value = results.perluTampalanAmgGkB; // X  darjah/tingkatan 4         
        rowNew13.getCell(39).value = results.telahFSMuridB; // telahFSMuridS  darjah/tingkatan 4
        rowNew13.getCell(40).value = results.telahFSGigiB; //   darjah/tingkatan 4
        rowNew13.getCell(41).value = results.telahTampalanAntGdB; // X  darjah/tingkatan 4
        rowNew13.getCell(42).value = results.telahTampalanAntGkB; // X  darjah/tingkatan 4
        rowNew13.getCell(43).value = results.telahTampalanPosGdB; // X  darjah/tingkatan 4
        rowNew13.getCell(44).value = results.telahTampalanPosGkB; // X  darjah/tingkatan 4
        rowNew13.getCell(45).value = results.telahTampalanAmgGdB; // X  darjah/tingkatan 4
        rowNew13.getCell(46).value = results.telahTampalanAmgGkB; // X  darjah/tingkatan 4
        rowNew13.getCell(48).value = results.cabutanGd// Cabutan GD  darjah/tingkatan 4
        rowNew13.getCell(49).value = results.cabutanGk// Cabutan GK  darjah/tingkatan 4
        rowNew13.getCell(50).value = results.penskaleran// Penskaleran  darjah/tingkatan 4
        rowNew13.getCell(51).value = results.kesSelesai// Kes selesai  darjah/tingkatan 4
        rowNew13.getCell(52).value = results.skorGIS0// Skor GIS 0  darjah/tingkatan 4
        rowNew13.getCell(53).value = results.skorGIS1// Skor GIS 1  darjah/tingkatan 4
        rowNew13.getCell(54).value = results.skorGIS2// Skor GIS 2  darjah/tingkatan 4
        rowNew13.getCell(55).value = results.skorGIS3// Skor GIS 3  darjah/tingkatan 4
        rowNew13.commit();

        let rowNew14 = worksheet.getRow(27);
        rowNew14.getCell(2).value = results.skorPlakC; // darjah/tingkatan 4     
        rowNew14.commit();   

        let rowNew15 = worksheet.getRow(28);
        rowNew15.getCell(2).value = results.skorPlakE; // darjah/tingkatan 4
        rowNew15.commit();

        let rowNew16 = worksheet.getRow(28);
        rowNew16.getCell(30).value = results.perluFSGigiS; // darjah/tingkatan 4
        rowNew16.getCell(32).value = results.perluTampalanAntGdS//   darjah/tingkatan 4
        rowNew16.getCell(33).value = results.perluTampalanAntGkS//   darjah/tingkatan 4
        rowNew16.getCell(34).value = results.perluTampalanPosGdS//   darjah/tingkatan 4
        rowNew16.getCell(35).value = results.perluTampalanPosGkS//   darjah/tingkatan 4
        rowNew16.getCell(36).value = results.perluTampalanAmgGdS//   darjah/tingkatan 4
        rowNew16.getCell(37).value = results.perluTampalanAmgGkS//   darjah/tingkatan 4
        rowNew16.getCell(39).value = results.telahFSMuridS//   darjah/tingkatan 4
        rowNew16.getCell(40).value = results.telahFSGigiS//   darjah/tingkatan 4
        rowNew16.getCell(41).value = results.telahTampalanAntGdS//   darjah/tingkatan 4
        rowNew16.getCell(42).value = results.telahTampalanAntGkS//   darjah/tingkatan 4
        rowNew16.getCell(43).value = results.telahTampalanPosGdS//   darjah/tingkatan 4
        rowNew16.getCell(44).value = results.telahTampalanPosGkS//   darjah/tingkatan 4
        rowNew16.getCell(45).value = results.telahTampalanAmgGkS//   darjah/tingkatan 4
        rowNew16.getCell(46).value = results.telahTampalanAmgGkS//   darjah/tingkatan 4
        rowNew16.commit();

        // darjah/tingkatan 5
        let rowNew17 = worksheet.getRow(29);
        rowNew17.getCell(2).value = results.kedatanganEnggan; // Kedatangan  darjah/tingkatan 5
        rowNew17.getCell(3).value = results.kedatanganTidakHadir; // Kedatangan  darjah/tingkatan 5
        rowNew17.getCell(4).value = results.enrolmen; // Kedatangan  darjah/tingkatan 5
        rowNew17.getCell(5).value = results.kedatanganbaru; // Kedatangan  darjah/tingkatan 5
        rowNew17.getCell(6).value = results.kedatanganUlangan; // Kedatangan  darjah/tingkatan 5
        rowNew17.getCell(7).value = results.skorPlakA; // Skor Plak A darjah/tingkatan 5
        rowNew17.getCell(9).value = results.dStatusdfx; // d  darjah/tingkatan 5
        rowNew17.getCell(10).value = results.fStatusdfx; // f  darjah/tingkatan 5
        rowNew17.getCell(11).value = results.xStatusdfx; // x  darjah/tingkatan 5
        rowNew17.getCell(13).value = results.dStatusDMFX; // D  darjah/tingkatan 5
        rowNew17.getCell(14).value = results.mStatusDMFX; // M  darjah/tingkatan 5
        rowNew17.getCell(15).value = results.fStatusDMFX; // F  darjah/tingkatan 5
        rowNew17.getCell(16).value = results.xStatusDMFX; // X  darjah/tingkatan 5
        rowNew17.getCell(18).value = results.gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 darjah/tingkatan 5
        rowNew17.getCell(19).value = results.totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  darjah/tingkatan 5
        rowNew17.getCell(20).value = results.mbk; // Mulut Bebas Karies (MBK)  darjah/tingkatan 5
        rowNew17.getCell(21).value = results.statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  darjah/tingkatan 5
        rowNew17.getCell(22).value = results.dfxEqualToZero; // dfx = results.0   darjah/tingkatan 5
        rowNew17.getCell(23).value = results.mulutBebasGingivitis; // Mulut Bebas Gingivitis (MBG)  darjah/tingkatan 5
        rowNew17.getCell(24).value = results.tpr; // Tidak perlu rawatan  darjah/tingkatan 5
        rowNew17.getCell(25).value = results.kecederaanGigiAnterior; // X  darjah/tingkatan 5
        rowNew17.getCell(26).value = results.cleftAda; // X  darjah/tingkatan 5
        rowNew17.getCell(27).value = results.cleftRujuk; // X  darjah/tingkatan 5
        rowNew17.getCell(29).value = results.perluFSMuridB; // X  darjah/tingkatan 5
        rowNew17.getCell(30).value = results.perluFSGigiB; // X  darjah/tingkatan 5
        rowNew17.getCell(31).value = results.perluFsBilGigiFailed; // X  darjah/tingkatan 5
        rowNew17.getCell(32).value = results.perluTampalanAntGdB; // X  darjah/tingkatan 5
        rowNew17.getCell(33).value = results.perluTampalanAntGkB; // X  darjah/tingkatan 5
        rowNew17.getCell(34).value = results.perluTampalanPosGdB; // X  darjah/tingkatan 5
        rowNew17.getCell(35).value = results.perluTampalanPosGkB; // X  darjah/tingkatan 5
        rowNew17.getCell(36).value = results.perluTampalanAmgGdB; // X  darjah/tingkatan 5
        rowNew17.getCell(37).value = results.perluTampalanAmgGkB; // X  darjah/tingkatan 5         
        rowNew17.getCell(39).value = results.telahFSMuridB; // telahFSMuridS  darjah/tingkatan 5
        rowNew17.getCell(40).value = results.telahFSGigiB; //   darjah/tingkatan 5
        rowNew17.getCell(41).value = results.telahTampalanAntGdB; // X  darjah/tingkatan 5
        rowNew17.getCell(42).value = results.telahTampalanAntGkB; // X  darjah/tingkatan 5
        rowNew17.getCell(43).value = results.telahTampalanPosGdB; // X  darjah/tingkatan 5
        rowNew17.getCell(44).value = results.telahTampalanPosGkB; // X  darjah/tingkatan 5
        rowNew17.getCell(45).value = results.telahTampalanAmgGdB; // X  darjah/tingkatan 5
        rowNew17.getCell(46).value = results.telahTampalanAmgGkB; // X  darjah/tingkatan 5
        rowNew17.getCell(48).value = results.cabutanGd// Cabutan GD  darjah/tingkatan 5
        rowNew17.getCell(49).value = results.cabutanGk// Cabutan GK  darjah/tingkatan 5
        rowNew17.getCell(50).value = results.penskaleran// Penskaleran  darjah/tingkatan 5
        rowNew17.getCell(51).value = results.kesSelesai// Kes selesai  darjah/tingkatan 5
        rowNew17.getCell(52).value = results.skorGIS0// Skor GIS 0  darjah/tingkatan 5
        rowNew17.getCell(53).value = results.skorGIS1// Skor GIS 1  darjah/tingkatan 5
        rowNew17.getCell(54).value = results.skorGIS2// Skor GIS 2  darjah/tingkatan 5
        rowNew17.getCell(55).value = results.skorGIS3// Skor GIS 3  darjah/tingkatan 5
        rowNew17.commit();

        let rowNew18 = worksheet.getRow(30);
        rowNew18.getCell(2).value = results.skorPlakC; // darjah/tingkatan 5
        rowNew18.commit();

        let rowNew19 = worksheet.getRow(31);
        rowNew19.getCell(2).value = results.skorPlakE; // darjah/tingkatan 5
        rowNew19.commit();

        let rowNew20 = worksheet.getRow(31);
        rowNew20.getCell(30).value = results.perluFSGigiS; // darjah/tingkatan 5
        rowNew20.getCell(32).value = results.perluTampalanAntGdS//   darjah/tingkatan 5
        rowNew20.getCell(33).value = results.perluTampalanAntGkS//   darjah/tingkatan 5
        rowNew20.getCell(34).value = results.perluTampalanPosGdS//   darjah/tingkatan 5
        rowNew20.getCell(35).value = results.perluTampalanPosGkS//   darjah/tingkatan 5
        rowNew20.getCell(36).value = results.perluTampalanAmgGdS//   darjah/tingkatan 5
        rowNew20.getCell(37).value = results.perluTampalanAmgGkS//   darjah/tingkatan 5
        rowNew20.getCell(39).value = results.telahFSMuridS//   darjah/tingkatan 5
        rowNew20.getCell(40).value = results.telahFSGigiS//   darjah/tingkatan 5
        rowNew20.getCell(41).value = results.telahTampalanAntGdS//   darjah/tingkatan 5
        rowNew20.getCell(42).value = results.telahTampalanAntGkS//   darjah/tingkatan 5
        rowNew20.getCell(43).value = results.telahTampalanPosGdS//   darjah/tingkatan 5
        rowNew20.getCell(44).value = results.telahTampalanPosGkS//   darjah/tingkatan 5
        rowNew20.getCell(45).value = results.telahTampalanAmgGkS//   darjah/tingkatan 5
        rowNew20.getCell(46).value = results.telahTampalanAmgGkS//   darjah/tingkatan 5
        rowNew20.commit();

        // 6 /peralihan
        let rowNew21 = worksheet.getRow(32);
        rowNew21.getCell(2).value = results.kedatanganEnggan; // Kedatangan  6 /peralihan
        rowNew21.getCell(3).value = results.kedatanganTidakHadir; // Kedatangan  6 /peralihan
        rowNew21.getCell(4).value = results.enrolmen; // Kedatangan  6 /peralihan
        rowNew21.getCell(5).value = results.kedatanganbaru; // Kedatangan  6 /peralihan
        rowNew21.getCell(6).value = results.kedatanganUlangan; // Kedatangan  6 /peralihan
        rowNew21.getCell(7).value = results.skorPlakA; // Skor Plak A 6 /peralihan
        rowNew21.getCell(9).value = results.dStatusdfx; // d  6 /peralihan
        rowNew21.getCell(10).value = results.fStatusdfx; // f  6 /peralihan
        rowNew21.getCell(11).value = results.xStatusdfx; // x  6 /peralihan
        rowNew21.getCell(13).value = results.dStatusDMFX; // D  6 /peralihan
        rowNew21.getCell(14).value = results.mStatusDMFX; // M  6 /peralihan
        rowNew21.getCell(15).value = results.fStatusDMFX; // F  6 /peralihan
        rowNew21.getCell(16).value = results.xStatusDMFX; // X  6 /peralihan
        rowNew21.getCell(18).value = results.gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 6 /peralihan
        rowNew21.getCell(19).value = results.totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  6 /peralihan
        rowNew21.getCell(20).value = results.mbk; // Mulut Bebas Karies (MBK)  6 /peralihan
        rowNew21.getCell(21).value = results.statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  6 /peralihan
        rowNew21.getCell(22).value = results.dfxEqualToZero; // dfx = results.0   6 /peralihan
        rowNew21.getCell(23).value = results.mulutBebasGingivitis; // Mulut Bebas Gingivitis (MBG)  6 /peralihan
        rowNew21.getCell(24).value = results.tpr; // Tidak perlu rawatan  6 /peralihan
        rowNew21.getCell(25).value = results.kecederaanGigiAnterior; // X  6 /peralihan
        rowNew21.getCell(26).value = results.cleftAda; // X  6 /peralihan
        rowNew21.getCell(27).value = results.cleftRujuk; // X  6 /peralihan
        rowNew21.getCell(29).value = results.perluFSMuridB; // X  6 /peralihan
        rowNew21.getCell(30).value = results.perluFSGigiB; // X  6 /peralihan
        rowNew21.getCell(31).value = results.perluFsBilGigiFailed; // X  6 /peralihan
        rowNew21.getCell(32).value = results.perluTampalanAntGdB; // X  6 /peralihan
        rowNew21.getCell(33).value = results.perluTampalanAntGkB; // X  6 /peralihan
        rowNew21.getCell(34).value = results.perluTampalanPosGdB; // X  6 /peralihan
        rowNew21.getCell(35).value = results.perluTampalanPosGkB; // X  6 /peralihan
        rowNew21.getCell(36).value = results.perluTampalanAmgGdB; // X  6 /peralihan
        rowNew21.getCell(37).value = results.perluTampalanAmgGkB; // X  6 /peralihan         
        rowNew21.getCell(39).value = results.telahFSMuridB; // telahFSMuridS  6 /peralihan
        rowNew21.getCell(40).value = results.telahFSGigiB; //   6 /peralihan
        rowNew21.getCell(41).value = results.telahTampalanAntGdB; // X  6 /peralihan
        rowNew21.getCell(42).value = results.telahTampalanAntGkB; // X  6 /peralihan
        rowNew21.getCell(43).value = results.telahTampalanPosGdB; // X  6 /peralihan
        rowNew21.getCell(44).value = results.telahTampalanPosGkB; // X  6 /peralihan
        rowNew21.getCell(45).value = results.telahTampalanAmgGdB; // X  6 /peralihan
        rowNew21.getCell(46).value = results.telahTampalanAmgGkB; // X  6 /peralihan
        rowNew21.getCell(48).value = results.cabutanGd// Cabutan GD  6 /peralihan
        rowNew21.getCell(49).value = results.cabutanGk// Cabutan GK  6 /peralihan
        rowNew21.getCell(50).value = results.penskaleran// Penskaleran  6 /peralihan
        rowNew21.getCell(51).value = results.kesSelesai// Kes selesai  6 /peralihan
        rowNew21.getCell(52).value = results.skorGIS0// Skor GIS 0  6 /peralihan
        rowNew21.getCell(53).value = results.skorGIS1// Skor GIS 1  6 /peralihan
        rowNew21.getCell(54).value = results.skorGIS2// Skor GIS 2  6 /peralihan
        rowNew21.getCell(55).value = results.skorGIS3// Skor GIS 3  6 /peralihan
        rowNew21.commit();
        
        let rowNew22 = worksheet.getRow(33);
        rowNew22.getCell(2).value = results.skorPlakC; // 6 /peralihan
        rowNew22.commit();

        let rowNew23 = worksheet.getRow(34);
        rowNew23.getCell(2).value = results.skorPlakE; // 6 /peralihan
        rowNew23.commit();

        let rowNew24 = worksheet.getRow(34);
        rowNew24.getCell(30).value = results.perluFSGigiS; // 6 /peralihan
        rowNew24.getCell(32).value = results.perluTampalanAntGdS//   6 /peralihan
        rowNew24.getCell(33).value = results.perluTampalanAntGkS//   6 /peralihan
        rowNew24.getCell(34).value = results.perluTampalanPosGdS//   6 /peralihan
        rowNew24.getCell(35).value = results.perluTampalanPosGkS//   6 /peralihan
        rowNew24.getCell(36).value = results.perluTampalanAmgGdS//   6 /peralihan
        rowNew24.getCell(37).value = results.perluTampalanAmgGkS//   6 /peralihan
        rowNew24.getCell(39).value = results.telahFSMuridS//   6 /peralihan
        rowNew24.getCell(40).value = results.telahFSGigiS//   6 /peralihan
        rowNew24.getCell(41).value = results.telahTampalanAntGdS//   6 /peralihan
        rowNew24.getCell(42).value = results.telahTampalanAntGkS//   6 /peralihan
        rowNew24.getCell(43).value = results.telahTampalanPosGdS//   6 /peralihan
        rowNew24.getCell(44).value = results.telahTampalanPosGkS//   6 /peralihan
        rowNew24.getCell(45).value = results.telahTampalanAmgGkS//   6 /peralihan
        rowNew24.getCell(46).value = results.telahTampalanAmgGkS//   6 /peralihan
        rowNew24.commit();

        // kki
        let rowNew25 = worksheet.getRow(32);
        rowNew25.getCell(2).value = results.kedatanganEnggan; // Kedatangan  kki
        rowNew25.getCell(3).value = results.kedatanganTidakHadir; // Kedatangan  kki
        rowNew25.getCell(4).value = results.enrolmen; // Kedatangan  kki
        rowNew25.getCell(5).value = results.kedatanganbaru; // Kedatangan  kki
        rowNew25.getCell(6).value = results.kedatanganUlangan; // Kedatangan  kki
        rowNew25.getCell(7).value = results.skorPlakA; // Skor Plak A kki
        rowNew25.getCell(9).value = results.dStatusdfx; // d  kki
        rowNew25.getCell(10).value = results.fStatusdfx; // f  kki
        rowNew25.getCell(11).value = results.xStatusdfx; // x  kki
        rowNew25.getCell(13).value = results.dStatusDMFX; // D  kki
        rowNew25.getCell(14).value = results.mStatusDMFX; // M  kki
        rowNew25.getCell(15).value = results.fStatusDMFX; // F  kki
        rowNew25.getCell(16).value = results.xStatusDMFX; // X  kki
        rowNew25.getCell(18).value = results.gigiKekalDMFXsamaAtauKurangDari3; // Status Gigi Kekal DMFX <= 3 kki
        rowNew25.getCell(19).value = results.totalStatusGigiKekalSamaKosong; // Status Gigi Kekal X+M = results.0  kki
        rowNew25.getCell(20).value = results.mbk; // Mulut Bebas Karies (MBK)  kki
        rowNew25.getCell(21).value = results.statusBebasKaries; // Status Gigi Kekal Bebas Karies (BK) DMFX = results.0  kki
        rowNew25.getCell(22).value = results.dfxEqualToZero; // dfx = results.0   kki
        rowNew25.getCell(23).value = results.mulutBebasGingivitis; // Mulut Bebas Gingivitis (MBG)  kki
        rowNew25.getCell(24).value = results.tpr; // Tidak perlu rawatan  kki
        rowNew25.getCell(25).value = results.kecederaanGigiAnterior; // X  kki
        rowNew25.getCell(26).value = results.cleftAda; // X  kki
        rowNew25.getCell(27).value = results.cleftRujuk; // X  kki
        rowNew25.getCell(29).value = results.perluFSMuridB; // X  kki
        rowNew25.getCell(30).value = results.perluFSGigiB; // X  kki
        rowNew25.getCell(31).value = results.perluFsBilGigiFailed; // X  kki
        rowNew25.getCell(32).value = results.perluTampalanAntGdB; // X  kki
        rowNew25.getCell(33).value = results.perluTampalanAntGkB; // X  kki
        rowNew25.getCell(34).value = results.perluTampalanPosGdB; // X  kki
        rowNew25.getCell(35).value = results.perluTampalanPosGkB; // X  kki
        rowNew25.getCell(36).value = results.perluTampalanAmgGdB; // X  kki
        rowNew25.getCell(37).value = results.perluTampalanAmgGkB; // X  kki         
        rowNew25.getCell(39).value = results.telahFSMuridB; // telahFSMuridS  kki
        rowNew25.getCell(40).value = results.telahFSGigiB; //   kki
        rowNew25.getCell(41).value = results.telahTampalanAntGdB; // X  kki
        rowNew25.getCell(42).value = results.telahTampalanAntGkB; // X  kki
        rowNew25.getCell(43).value = results.telahTampalanPosGdB; // X  kki
        rowNew25.getCell(44).value = results.telahTampalanPosGkB; // X  kki
        rowNew25.getCell(45).value = results.telahTampalanAmgGdB; // X  kki
        rowNew25.getCell(46).value = results.telahTampalanAmgGkB; // X  kki
        rowNew25.getCell(48).value = results.cabutanGd// Cabutan GD  kki
        rowNew25.getCell(49).value = results.cabutanGk// Cabutan GK  kki
        rowNew25.getCell(50).value = results.penskaleran// Penskaleran  kki
        rowNew25.getCell(51).value = results.kesSelesai// Kes selesai  kki
        rowNew25.getCell(52).value = results.skorGIS0// Skor GIS 0  kki
        rowNew25.getCell(53).value = results.skorGIS1// Skor GIS 1  kki
        rowNew25.getCell(54).value = results.skorGIS2// Skor GIS 2  kki
        rowNew25.getCell(55).value = results.skorGIS3// Skor GIS 3  kki
        rowNew25.commit();

        let rowNew26 = worksheet.getRow(33);
        rowNew26.getCell(2).value = results.skorPlakC; // kki
        rowNew26.commit();

        let rowNew27 = worksheet.getRow(34);
        rowNew27.getCell(2).value = results.skorPlakE; // kki
        rowNew27.commit();
        
        let rowNew28 = worksheet.getRow(34);
        rowNew28.getCell(30).value = results.perluFSGigiS; // kki
        rowNew28.getCell(32).value = results.perluTampalanAntGdS//   kki
        rowNew28.getCell(33).value = results.perluTampalanAntGkS//   kki
        rowNew28.getCell(34).value = results.perluTampalanPosGdS//   kki
        rowNew28.getCell(35).value = results.perluTampalanPosGkS//   kki
        rowNew28.getCell(36).value = results.perluTampalanAmgGdS//   kki
        rowNew28.getCell(37).value = results.perluTampalanAmgGkS//   kki
        rowNew28.getCell(39).value = results.telahFSMuridS//   kki
        rowNew28.getCell(40).value = results.telahFSGigiS//   kki
        rowNew28.getCell(41).value = results.telahTampalanAntGdS//   kki
        rowNew28.getCell(42).value = results.telahTampalanAntGkS//   kki
        rowNew28.getCell(43).value = results.telahTampalanPosGdS//   kki
        rowNew28.getCell(44).value = results.telahTampalanPosGkS//   kki
        rowNew28.getCell(45).value = results.telahTampalanAmgGkS//   kki
        rowNew28.getCell(46).value = results.telahTampalanAmgGkS//   kki
        rowNew28.commit();

        // others
        let rowNew29 = worksheet.getRow(7);
        rowNew29.getCell(9).value = results.klinik; // 
        rowNew29.commit();

        let rowNew30 = worksheet.getRow(8);
        rowNew30.getCell(9).value = results.sekolah; // 
        rowNew30.commit();

        let rowNew31 = worksheet.getRow(9);
        rowNew31.getCell(9).value = results.jenisPerkhidmatanPergigian; // 
        rowNew31.commit();

        let rowNew32 = worksheet.getRow(7);
        rowNew32.getCell(27).value = results.tarikhTempat; // 
        rowNew32.commit();

        let rowNew33 = worksheet.getRow(8);
        rowNew33.getCell(27).value = results.bilHariProjek; // 
        rowNew32.commit();

        let rowNew34 = worksheet.getRow(7);
        rowNew34.getCell(44).value = results.tarikhMula; // 
        rowNew34.commit();

        let rowNew35 = worksheet.getRow(8);
        rowNew35.getCell(44).value = results.tarikhSelesai; // 
        rowNew35.commit();

        let rowNew36 = worksheet.getRow(9);
        rowNew36.getCell(44).value = results.namaPetugas; //
        rowNew36.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-PGS203.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}

exports.createPPIM05 = function(req, res) {
  async.parallel({
      negeri: function(callback) {
        Tadika.countDocuments({ kedatanganBaru: 1 }, callback);
      },
      jumlahSRnegeri: function(callback) {
        Tadika.countDocuments({ kedatanganUlangan: 1 }, callback);
      },
      jumlahEnrolmenSR: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      jumlahSRterlibatMMI: function(callback) {
        Tadika.countDocuments({ statusGigidesidusM: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      tahun: function(callback) {
        Tadika.countDocuments({ statusGigidesidusF: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      sekolah: function(callback) {
        Tadika.countDocuments({ statusGigidesidusX: { $gte: 1 }, kedatanganBaru: 1 }, callback);
      },
      klinik: function(callback) {
        Tadika.countDocuments({ statusGigidesidusD: "0", statusGigidesidusM: "0", statusGigidesidusF: "0", statusGigidesidusX: 0, kedatanganBaru: 1  }, callback);
      },
    }
  , async function(err, results) {
      console.log(results);
      try {
        let filename = path.join(__dirname, "..", "public", "exports", "PPIM05.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('PPIM05');

        // 5 tahun
        let rowNew = worksheet.getRow(12);
        rowNew.getCell(2).value = results.perokok; // bilanganperokoksemasa 5 tahun
        rowNew.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi 5 tahun
        rowNew.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date 5 tahun
        rowNew.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date 5 tahun
        rowNew.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date 5 tahun
        rowNew.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date 5 tahun
        rowNew.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling 5 tahun
        rowNew.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" 5 tahun
        rowNew.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" 5 tahun
        rowNew.commit();

        // 6 tahun
        let rowNew2 = worksheet.getRow(13);
        rowNew2.getCell(2).value = results.perokok; // bilanganperokoksemasa 6 tahun
        rowNew2.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi 6 tahun
        rowNew2.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date 6 tahun
        rowNew2.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date 6 tahun
        rowNew2.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date 6 tahun
        rowNew2.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date 6 tahun
        rowNew2.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling 6 tahun
        rowNew2.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" 6 tahun
        rowNew2.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" 6 tahun
        rowNew2.commit();

        //Tahun/ tingkatan 1
        let rowNew3 = worksheet.getRow(14);
        rowNew3.getCell(2).value = results.perokok; // bilanganperokoksemasa Tahun/Tingkatan1
        rowNew3.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi Tahun/Tingkatan1
        rowNew3.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date Tahun/Tingkatan1
        rowNew3.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date Tahun/Tingkatan1
        rowNew3.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date Tahun/Tingkatan1
        rowNew3.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date Tahun/Tingkatan1
        rowNew3.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling Tahun/Tingkatan1
        rowNew3.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" Tahun/Tingkatan1
        rowNew3.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" Tahun/Tingkatan1
        rowNew3.commit();

        //Tahun/ tingkatan 2
        let rowNew4 = worksheet.getRow(15);
        rowNew4.getCell(2).value = results.perokok; // bilanganperokoksemasa Tahun/ tingkatan 2
        rowNew4.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi Tahun/ tingkatan 2
        rowNew4.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date Tahun/ tingkatan 2
        rowNew4.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date Tahun/ tingkatan 2
        rowNew4.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date Tahun/ tingkatan 2
        rowNew4.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date Tahun/ tingkatan 2
        rowNew4.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling Tahun/ tingkatan 2
        rowNew4.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" Tahun/ tingkatan 2
        rowNew4.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" Tahun/ tingkatan 2
        rowNew4.commit();

        //Tahun/ tingkatan 3
        let rowNew5 = worksheet.getRow(16);
        rowNew5.getCell(2).value = results.perokok; // bilanganperokoksemasa Tahun/ tingkatan 3
        rowNew5.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi Tahun/ tingkatan 3
        rowNew5.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date Tahun/ tingkatan 3
        rowNew5.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date Tahun/ tingkatan 3
        rowNew5.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date Tahun/ tingkatan 3
        rowNew5.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date Tahun/ tingkatan 3
        rowNew5.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling Tahun/ tingkatan 3
        rowNew5.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" Tahun/ tingkatan 3
        rowNew5.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" Tahun/ tingkatan 3
        rowNew5.commit();

       //Tahun/ tingkatan 4
        let rowNew6 = worksheet.getRow(17);
        rowNew6.getCell(2).value = results.perokok; // bilanganperokoksemasa Tahun/ tingkatan 4
        rowNew6.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi Tahun/ tingkatan 4
        rowNew6.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date Tahun/ tingkatan 4
        rowNew6.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date Tahun/ tingkatan 4
        rowNew6.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date Tahun/ tingkatan 4
        rowNew6.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date Tahun/ tingkatan 4
        rowNew6.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling Tahun/ tingkatan 4
        rowNew6.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" Tahun/ tingkatan 4
        rowNew6.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" Tahun/ tingkatan 4
        rowNew6.commit();

        //Tahun/ tingkatan 5
        let rowNew7 = worksheet.getRow(18);
        rowNew7.getCell(2).value = results.perokok; // bilanganperokoksemasa Tahun/ tingkatan 5
        rowNew7.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi Tahun/ tingkatan 5
        rowNew7.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date Tahun/ tingkatan 5
        rowNew7.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date Tahun/ tingkatan 5
        rowNew7.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date Tahun/ tingkatan 5
        rowNew7.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date Tahun/ tingkatan 5
        rowNew7.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling Tahun/ tingkatan 5
        rowNew7.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" Tahun/ tingkatan 5
        rowNew7.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" Tahun/ tingkatan 5
        rowNew7.commit();

        //Tahun/ tingkatan 6
        let rowNew8 = worksheet.getRow(19);
        rowNew8.getCell(2).value = results.perokok; // bilanganperokoksemasa Tahun/ tingkatan 6
        rowNew8.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi Tahun/ tingkatan 6
        rowNew8.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date Tahun/ tingkatan 6
        rowNew8.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date Tahun/ tingkatan 6
        rowNew8.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date Tahun/ tingkatan 6
        rowNew8.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date Tahun/ tingkatan 6
        rowNew8.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling Tahun/ tingkatan 6
        rowNew8.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" Tahun/ tingkatan 6
        rowNew8.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" Tahun/ tingkatan 6
        rowNew8.commit();

        //Peralihan (SM)
        let rowNew9 = worksheet.getRow(20);
        rowNew9.getCell(2).value = results.perokok; // bilanganperokoksemasa Peralihan (SM)
        rowNew9.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi Peralihan (SM)
        rowNew9.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date Peralihan (SM)
        rowNew9.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date Peralihan (SM)
        rowNew9.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date Peralihan (SM)
        rowNew9.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date Peralihan (SM)
        rowNew9.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling Peralihan (SM)
        rowNew9.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" Peralihan (SM)
        rowNew9.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" Peralihan (SM)
        rowNew9.commit();

        //KKI (SR & SM)
        let rowNew10 = worksheet.getRow(21);
        rowNew10.getCell(2).value = results.perokok; // bilanganperokoksemasa KKI (SR & SM)
        rowNew10.getCell(3).value = results.sertaiIntervensi; // Bil. Perokok Menyertai Intervensi KKI (SR & SM)
        rowNew10.getCell(4).value = results.intervensi3WithQDate; // # perokok menyertai intervensi >3 ada quit date KKI (SR & SM)
        rowNew10.getCell(6).value = results.intervensi3NoQDate; // # perokok menyertai intervensi >3 tiada quit date KKI (SR & SM)
        rowNew10.getCell(8).value = results.intervensiLess3WithQDate; // # perokok menyertai intervensi <3 ada quit date KKI (SR & SM)
        rowNew10.getCell(10).value = results.intervensiLess3NoQDate; // # perokok menyertai intervensi <3 tiada quit date KKI (SR & SM)
        rowNew10.getCell(14).value = results.dirujukKaunseling; // # Perokok dirujuk ke guru kaunseling KKI (SR & SM)
        rowNew10.getCell(15).value = results.berhentiRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Berhenti" KKI (SR & SM)
        rowNew10.getCell(16).value = results.masihRokok6Bulan; // "Status berhenti merokok selepas 6 bulan Tidak Berhenti" KKI (SR & SM)
        rowNew10.commit();
        
        // others
        let rowNew11 = worksheet.getRow(5);
        rowNew11.getCell(2).value = results.tahun; // 
        rowNew11.commit();

        let rowNew12 = worksheet.getRow(6);
        rowNew12.getCell(2).value = results.daerah; // 
        rowNew12.commit();

        let rowNew13 = worksheet.getRow(7);
        rowNew13.getCell(2).value = results.klinik; // 
        rowNew13.commit();

        let rowNew14 = worksheet.getRow(8);
        rowNew14.getCell(2).value = results.sekolah; // 
        rowNew14.commit();

        let newfile = path.join(__dirname, "..", "public", "exports", "test-PPIM05.xlsx");

        // Write the file
        await workbook.xlsx.writeFile(newfile);

        setTimeout(function () {
            fs.unlinkSync(newfile); // delete this file after 30 seconds
          }, 30000)
        setTimeout(function () {
            return res.download(newfile); // delete this file after 30 seconds
          }, 3000)        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
  });
}


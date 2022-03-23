const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const Excel = require('exceljs');
const json2csv = require('json2csv').parse;
const Tadika = require('../models/Tadika');
// const YAData = require('../models/Sekolah'); to put in the future
// const YAData = require('../models/YA'); to put in the future
const fields = ['namaPendaftaranTadika', 'namaTaskaTadikaPendaftaranTadika', 'umurPendaftaranTadika', 'kelasPendaftaranTadika'];

exports.kiraJumlahTadika = function(req, res) {
    Tadika.distinct('namaTaskaTadikaPendaftaranTadika', {nama: new RegExp('')}, function(err, tadikas) {
        if (err) { return res.status(500).json({ err }); }
        res.json(tadikas);
        }
    );
};

exports.filterbyDaerah = function(req, res) {
    Tadika.aggregate([
        { $match: { createdByDaerah: '' } } 
      , { $project: { namaTaskaTadikaPendaftaranTadika: 1, createdByKp: 1, createdByDaerah: 1, createdByNegeri: 1 } } 
      , { $unwind: '$namaTaskaTadikaPendaftaranTadika' } 
      , { $group: { _id: { tadika: '$namaTaskaTadikaPendaftaranTadika', kp: '$createdByKp', daerah: '$createdByDaerah', negeri: '$createdByNegeri' }, count: { $sum: 1 } } }
      , { $sort: { _id: -1 } }        
    ]).exec(function(err, allResult) {
        if (err) { return res.status(500).json({ err }); }
        console.log(allResult);
        res.render('countpage', { title: 'test', allresult: allResult} )
    });
}

exports.filterEverything = function(req, res) {
    Tadika.aggregate([
        { $match: { createdByNegeri: '' } }
      , { $project: { namaTaskaTadikaPendaftaranTadika: 1, createdByKp: 1, createdByDaerah: 1, createdByNegeri: 1 } }
      , { $unwind: '$namaTaskaTadikaPendaftaranTadika' }
      , { $group: {
               _id: { tadika: '$namaTaskaTadikaPendaftaranTadika', kp: '$createdByKp', daerah: '$createdByDaerah', negeri: '$createdByNegeri' }
            , count: { $sum: 1 }
          }
        }
    ]).exec(function(err, allResult) {
        if (err) { return res.status(500).json({ err }); }
        console.log(allResult);
        res.render('countpage', { title: 'test', allresult: allResult} )
    });
}

exports.overView = function(req, res) {
    async.parallel({
        jumlahPelajar: function(callback) {
            Tadika.countDocuments({ createdByNegeri: req.body.negeri }, callback);
        },
        listTadika: function(callback) {
            Tadika
            .find({ createdByNegeri: req.body.negeri })
            .distinct('namaTaskaTadikaPendaftaranTadika', {nama: new RegExp('')}, callback);
        },
        listKP: function(callback) {
            Tadika
            .find({ createdByNegeri: req.body.negeri })
            .distinct('createdByKp', {nama: new RegExp('')}, callback);
        },
        listAll: function(callback) {
            Tadika.aggregate([
                { $match: { createdByNegeri: req.body.negeri } } 
              , { $project: { namaTaskaTadikaPendaftaranTadika: 1, createdByKp: 1, createdByDaerah: 1, createdByNegeri: 1, namaPendaftaranTadika: 1 } } 
              , { $unwind: '$namaTaskaTadikaPendaftaranTadika' } 
              , { $group: { _id: { tadika: '$namaTaskaTadikaPendaftaranTadika', kp: '$createdByKp', daerah: '$createdByDaerah', negeri: '$createdByNegeri' }, count: { $sum: 1 } } }
              , { $sort: { _id: -1 } }        
            ], callback);
        },
        // listTNuri: function(callback) {
        //   Tadika.countDocuments({ namaTaskaTadikaPendaftaranTadika: 'Tabika Kemas Taman Nuri' }, callback);
        // },
        // listTWJ: function(callback) {
        //   Tadika.countDocuments({ namaTaskaTadikaPendaftaranTadika: 'Tabika Kemas Teluk Wanjah' }, callback);
        // },
        // listTT: function(callback) {
        //   Tadika.countDocuments({ namaTaskaTadikaPendaftaranTadika: 'Tabika Kemas Tualang' }, callback);
        // },
        // listUmur4 : function(callback) {
        //   Tadika.countDocuments({ umurPendaftaranTadika: '4' }, callback);
        // },
        // listUmur5 : function(callback) {
        //   Tadika.countDocuments({ umurPendaftaranTadika: '5' }, callback);
        // },
        // listUmur6 : function(callback) {
        //   Tadika.countDocuments({ umurPendaftaranTadika: '6' }, callback);
        // },
    }
    , async function(err, results) {
        try {
        const YearNow = moment().format('YYYY');
        const DateNow = moment().format('DD/MM/YYYY');
        const TimeNow = moment().format('HH:mm');
        alltheData = results.listAll.reverse();
        alltheTadika = results.listTadika;
        alltheKP = results.listKP;
        let filename = path.join(__dirname, "..", "public", "exports", "blank-template.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('Sheet1');
        let rowNew = worksheet.getRow(1);
        rowNew.getCell(1).value = `LAPORAN DATA SEMUA TADIKA YANG ADA BAGI TAHUN ${YearNow}.`;
        let rowNew2 = worksheet.getRow(5);
        let rowNew3 = worksheet.getRow(6);
        let rowNew4 = worksheet.getRow(7);
        let rowNew5 = worksheet.getRow(8);
        let rowNew6 = worksheet.getRow(9);
        let rowNew7 = worksheet.getRow(12);
        rowNew2.getCell(7).value = alltheTadika.length;
        let b = 7;
        alltheTadika.forEach(alltheTadika => {
            rowNew3.getCell(b).value = alltheTadika;
            b++;
        });
        rowNew4.getCell(7).value = results.jumlahPelajar;
        rowNew5.getCell(7).value = alltheKP.length;
        let c = 7;
        alltheKP.forEach(alltheKP => {
            rowNew6.getCell(c).value = alltheKP;
            c++;            
        });
        rowNew7.getCell(1).value = 'Report Generated by Gi-Ret 2.0 on ' + DateNow + ' at ' + TimeNow;
        rowNew2.commit();
        rowNew3.commit();
        rowNew4.commit();
        rowNew5.commit();
        rowNew6.commit();
        rowNew7.commit();
        delete a, b, c, rowNew, rowNew2, rowNew3, rowNew4, rowNew5, rowNew6, rowNew7;
        let newfile = path.join(__dirname, "..", "public", "exports", req.body.negeri + "-Report.xlsx");
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

exports.CSVexporter = function(req, res) {
    Tadika.find().sort([['namaPendaftaranTadika', 'ascending']]).exec(function (err, list_budak) {
        if (err) {
          return res.status(500).json({ err });
        }
        else {
          let csv
          try {
            csv = json2csv(list_budak, { fields });
          } catch (err) {
            return res.status(500).json({ err });
          }
          const dateTime = moment().format('YYYYMMDDhhmmss');
          const filePath = path.join(__dirname, "..", "public", "exports", `FullData-${dateTime}.csv`)
          fs.writeFile(filePath, csv, function (err) {
            if (err) {
              return res.json(err).status(500);
            }
            else {
              setTimeout(function () {
                fs.unlinkSync(filePath); // delete this file after 60 seconds
              }, 60000)
              setTimeout(function () {
                res.download(filePath);
              }, 3000)
            }
          });  
        }
      })
    }

exports.XLSXexporter = async function(req, res) {
    Tadika.find().sort([['namaPendaftaranTadika', 'ascending']]).exec(function (err, list_budak) {
        if (err) {
          return res.status(500).json({ err });
        }
        else {
          let csv
          try {
            csv = json2csv(list_budak, { fields });
          } catch (err) {
            return res.status(500).json({ err });
          }
          const dateTime = moment().format('YYYYMMDDhhmmss');
          const filePath = path.join(__dirname, "..", "public", "exports", `FullData-${dateTime}.csv`)
          fs.writeFile(filePath, csv, function (err) {
            if (err) {
              return res.json(err).status(500);
            }
            else {
              setTimeout(function () {
                fs.unlinkSync(filePath); // delete this file after 60 seconds
              }, 60000)
              const XLSX_file = path.join(__dirname, "..", "public", "exports", `FullData-${dateTime}.xlsx`);
              let csvtobook = new Excel.Workbook();
              csvtobook.csv.readFile(filePath).then(worksheet => {
                console.log(worksheet.getRow(1).getCell(1).value);
                csvtobook.xlsx.writeFile(XLSX_file);
              })          
              setTimeout(function () {
                fs.unlinkSync(XLSX_file); // delete this file after 30 seconds
              }, 30000)
              setTimeout(function () {
                res.download(XLSX_file);
              }, 3000)
            }
          });  
        }
      })
    }

exports.retenBEGIN = (req, res) => {
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
        rowNew6.getCell(1).value = 'Report Generated by Gi-Ret 2.0 on ' + DateNow + ' at ' + TimeNow;
        rowNew6.commit();

        delete rowNew, rowNew2, rowNew3, rowNew4, rowNew5;
        let newfile = path.join(__dirname, "..", "public", "exports", req.body.user + "-BEGIN.xlsx");

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

exports.retenTOD =  (req, res) => {
  async.parallel({
    kedatanganBaru: function(callback) {
      Tadika.countDocuments({ kedatanganBaru: "1" }, callback);
    },
    kedatanganUlangan: function(callback) {
      Tadika.countDocuments({ kedatanganUlangan: "1" }, callback);
    },
    dStatusDMFX: function(callback) {
      Tadika.countDocuments({ dStatusDMFX: "1" }, callback);
    },
    mStatusDMFX: function(callback) {
      Tadika.countDocuments({ mStatusDMFX: "1" }, callback);
    },
    fStatusDMFX: function(callback) {
      Tadika.countDocuments({ fStatusDMFX: "1" }, callback);
    },
    xStatusDMFX: function(callback) {
      Tadika.countDocuments({ xStatusDMFX: "1" }, callback);
    },
    dmfxEqualToZero: function(callback) {
      Tadika.countDocuments({ dmfxEqualToZero: "1" }, callback);
    },
    skorPlakA: function(callback) {
      Tadika.countDocuments({ skorPlakA: "1" }, callback);
    },
    skorPlakC: function(callback) {
      Tadika.countDocuments({ skorPlakC: "1" }, callback);
    },
    skorPlakC: function(callback) {
      Tadika.countDocuments({ skorPlakC: "1" }, callback);
    },
    traumaTisuLembut: function(callback) {
      Tadika.countDocuments({ traumaTisuLembut: "1" }, callback);
    },
    traumaTisuKeras: function(callback) {
      Tadika.countDocuments({ traumaTisuKeras: "1" }, callback);
    },
    bilTODperluFV: function(callback) {
      Tadika.countDocuments({ bilTODperluFV: "1" }, callback);
    },
    bilTodBaruDibuatFV: function(callback) {
      Tadika.bilTodBaruDibuatFV({ tpr: "1" }, callback);
    },
    tampalanAnteriorB: function(callback) {
      Tadika.countDocuments({ tampalanAnteriorB: "1" }, callback);
    },
    tampalanAnteriorS: function(callback) {
      Tadika.countDocuments({ tampalanAnteriorS: "1" }, callback);
    },
    tampalanPosteriorB: function(callback) {
      Tadika.countDocuments({ tampalanPosteriorB: "1" }, callback);
    },
    tampalanPosteriorS: function(callback) {
      Tadika.countDocuments({ tampalanPosteriorS: "1" }, callback);
    },
    cabutan: function(callback) {
      Tadika.countDocuments({ cabutan: "1" }, callback);
    },
    abses: function(callback) {
      Tadika.countDocuments({ abses: "1" }, callback);
    },
    pulpotomi: function(callback) {
      Tadika.countDocuments({ pulpotomi: "1" }, callback);
    },
    ceramahUtkToddler: function(callback) {
      Tadika.countDocuments({ ceramahUtkToddler: "1" }, callback);
    },
    ceramahUtkDewasa: function(callback) {
      Tadika.countDocuments({ ceramahUtkDewasa: "1" }, callback);
    },
    toddlerLMG: function(callback) {
      Tadika.countDocuments({ toddlerLMG: "1" }, callback);
    },
    dirujukDariAgensiLuar: function(callback) {
      Tadika.countDocuments({ dirujukDariAgensiLuar: "1" }, callback);
    },
    toddlerDirujukPadaLawatan: function(callback) {
      Tadika.countDocuments({ toddlerDirujukPadaLawatan: "1" }, callback);
    },
    toddlerHadirRujukan: function(callback) {
      Tadika.countDocuments({ toddlerHadirRujukan: "1" }, callback);
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
    async function(err, results) {
      try {
        // Prepare the minigun
        let filename = path.join(__dirname, "..", "public", "exports", "TOD.xlsx");
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        let worksheet = workbook.getWorksheet('TOD');

        //Toddler Reten (Taska)
        let rowNew = worksheet.getRow(19);
        rowNew.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru Taska 
        rowNew.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan Taska 
        rowNew.getCell(5).value = results.dStatusDMFX; //d Status dmfx Taska
        rowNew.getCell(6).value = results.mStatusDMFX; //m Status dmfx Taska
        rowNew.getCell(7).value = results.dStatusDMFX; //f Status dmfx Taska
        rowNew.getCell(8).value = results.xStatusDMFX; //x Status dmfx Taska
        rowNew.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 Taska 	
        rowNew.getCell(12).value = results.skorPlakA; //Skor Plak A Taska
        rowNew.getCell(13).value = results.skorPlakC; //Skor Plak C Taska
        rowNew.getCell(14).value = results.skorPlakE; //Skor Plak E Taska
        rowNew.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) Taska
        rowNew.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut Taska
        rowNew.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras Taska
        rowNew.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV Taska
        rowNew.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV Taska
        rowNew.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru Taska
        rowNew.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru Taska
        rowNew.getCell(24).value = results.cabutan; //Bilangan Cabutan Taska 
        rowNew.getCell(25).value = results.abses; //Bilangan Abses Taska
        rowNew.getCell(26).value = results.pulpotomi; //Pulpotomi Taska 
        rowNew.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler Taska
        rowNew.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa Taska
        rowNew.getCell(29).value = results.toddlerLMG; //LMG Toddler Taska
        rowNew.getCell(33).value = results.lowCRA; //CRA Rendah Taska
        rowNew.getCell(34).value = results.moderateCRA; //CRA Sederhana Taska
        rowNew.getCell(35).value = results.highCRA; //CRA Tinggi Taska

        //Toddler Reten (Taska)
        let rowNew2 = worksheet.getRow(20);
        rowNew2.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV Taska
        rowNew2.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan Taska 
        rowNew2.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan Taska

        //Toddler Reten (Tadika)
        let rowNew3 = worksheet.getRow(21);
        rowNew3.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru Tadika 
        rowNew3.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan Tadika 
        rowNew3.getCell(5).value = results.dStatusDMFX; //d Status dmfx Tadika
        rowNew3.getCell(6).value = results.mStatusDMFX; //m Status dmfx Tadika
        rowNew3.getCell(7).value = results.dStatusDMFX; //f Status dmfx Tadika
        rowNew3.getCell(8).value = results.xStatusDMFX; //x Status dmfx Tadika
        rowNew3.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 Tadika 	
        rowNew3.getCell(12).value = results.skorPlakA; //Skor Plak A Tadika
        rowNew3.getCell(13).value = results.skorPlakC; //Skor Plak C Tadika
        rowNew3.getCell(14).value = results.skorPlakE; //Skor Plak E Tadika
        rowNew3.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) Tadika
        rowNew3.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut Tadika
        rowNew3.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras Tadika
        rowNew3.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV Tadika
        rowNew3.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV Tadika
        rowNew3.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru Tadika
        rowNew3.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru Tadika
        rowNew3.getCell(24).value = results.cabutan; //Bilangan Cabutan Tadika 
        rowNew3.getCell(25).value = results.abses; //Bilangan Abses Tadika
        rowNew3.getCell(26).value = results.pulpotomi; //Pulpotomi Tadika 
        rowNew3.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler Tadika
        rowNew3.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa Tadika
        rowNew3.getCell(29).value = results.toddlerLMG; //LMG Toddler Tadika
        rowNew3.getCell(33).value = results.lowCRA; //CRA Rendah Tadika
        rowNew3.getCell(34).value = results.moderateCRA; //CRA Sederhana Tadika
        rowNew3.getCell(35).value = results.highCRA; //CRA Tinggi Tadika

        //Toddler Reten (Tadika)       
        let rowNew4 = worksheet.getRow(22);
        rowNew4.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV Tadika
        rowNew4.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan Tadika 
        rowNew4.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan Tadika

        // Execute batch five KKIA
        let rowNew5 = worksheet.getRow(23);
        rowNew5.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru KKIA 
        rowNew5.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan KKIA 
        rowNew5.getCell(5).value = results.dStatusDMFX; //d Status dmfx KKIA
        rowNew5.getCell(6).value = results.mStatusDMFX; //m Status dmfx KKIA
        rowNew5.getCell(7).value = results.dStatusDMFX; //f Status dmfx KKIA
        rowNew5.getCell(8).value = results.xStatusDMFX; //x Status dmfx KKIA
        rowNew5.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 KKIA 	
        rowNew5.getCell(12).value = results.skorPlakA; //Skor Plak A KKIA
        rowNew5.getCell(13).value = results.skorPlakC; //Skor Plak C KKIA
        rowNew5.getCell(14).value = results.skorPlakE; //Skor Plak E KKIA
        rowNew5.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) KKIA
        rowNew5.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut KKIA
        rowNew5.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras KKIA
        rowNew5.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV KKIA
        rowNew5.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV KKIA
        rowNew5.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru KKIA
        rowNew5.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru KKIA
        rowNew5.getCell(24).value = results.cabutan; //Bilangan Cabutan KKIA 
        rowNew5.getCell(25).value = results.abses; //Bilangan Abses KKIA
        rowNew5.getCell(26).value = results.pulpotomi; //Pulpotomi KKIA 
        rowNew5.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler KKIA
        rowNew5.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa KKIA
        rowNew5.getCell(29).value = results.toddlerLMG; //LMG Toddler KKIA
        rowNew5.getCell(33).value = results.lowCRA; //CRA Rendah KKIA
        rowNew5.getCell(34).value = results.moderateCRA; //CRA Sederhana KKIA
        rowNew5.getCell(35).value = results.highCRA; //CRA Tinggi KKIA

        let rowNew6 = worksheet.getRow(24);
        rowNew6.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV KKIA
        rowNew6.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan KKIA 
        rowNew6.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan KKIA

        // PESAKIT LUAR
        let rowNew7 = worksheet.getRow(25);
        rowNew7.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru PESAKIT LUAR 
        rowNew7.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan PESAKIT LUAR 
        rowNew7.getCell(5).value = results.dStatusDMFX; //d Status dmfx PESAKIT LUAR
        rowNew7.getCell(6).value = results.mStatusDMFX; //m Status dmfx PESAKIT LUAR
        rowNew7.getCell(7).value = results.dStatusDMFX; //f Status dmfx PESAKIT LUAR
        rowNew7.getCell(8).value = results.xStatusDMFX; //x Status dmfx PESAKIT LUAR
        rowNew7.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 PESAKIT LUAR 	
        rowNew7.getCell(12).value = results.skorPlakA; //Skor Plak A PESAKIT LUAR
        rowNew7.getCell(13).value = results.skorPlakC; //Skor Plak C PESAKIT LUAR
        rowNew7.getCell(14).value = results.skorPlakE; //Skor Plak E PESAKIT LUAR
        rowNew7.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) PESAKIT LUAR
        rowNew7.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut PESAKIT LUAR
        rowNew7.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras PESAKIT LUAR
        rowNew7.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV PESAKIT LUAR
        rowNew7.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV PESAKIT LUAR
        rowNew7.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru PESAKIT LUAR
        rowNew7.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru PESAKIT LUAR
        rowNew7.getCell(24).value = results.cabutan; //Bilangan Cabutan PESAKIT LUAR 
        rowNew7.getCell(25).value = results.abses; //Bilangan Abses PESAKIT LUAR
        rowNew7.getCell(26).value = results.pulpotomi; //Pulpotomi PESAKIT LUAR 
        rowNew7.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler PESAKIT LUAR
        rowNew7.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa PESAKIT LUAR
        rowNew7.getCell(29).value = results.toddlerLMG; //LMG Toddler PESAKIT LUAR
        rowNew7.getCell(30).value = results.dirujukDariAgensiLuar; //dirujuk daripada Agensi Luar 
        rowNew7.getCell(33).value = results.lowCRA; //CRA Rendah PESAKIT LUAR
        rowNew7.getCell(34).value = results.moderateCRA; //CRA Sederhana PESAKIT LUAR
        rowNew7.getCell(35).value = results.highCRA; //CRA Tinggi PESAKIT LUAR

        let rowNew8 = worksheet.getRow(26);
        rowNew8.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV PESAKIT LUAR
        rowNew8.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan PESAKIT LUAR 

        // LAIN LAIN
        let rowNew9 = worksheet.getRow(27);
        rowNew9.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru LAIN-LAIN 
        rowNew9.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan LAIN-LAIN 
        rowNew9.getCell(5).value = results.dStatusDMFX; //d Status dmfx LAIN-LAIN
        rowNew9.getCell(6).value = results.mStatusDMFX; //m Status dmfx LAIN-LAIN
        rowNew9.getCell(7).value = results.dStatusDMFX; //f Status dmfx LAIN-LAIN
        rowNew9.getCell(8).value = results.xStatusDMFX; //x Status dmfx LAIN-LAIN
        rowNew9.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 LAIN-LAIN 	
        rowNew9.getCell(12).value = results.skorPlakA; //Skor Plak A LAIN-LAIN
        rowNew9.getCell(13).value = results.skorPlakC; //Skor Plak C LAIN-LAIN
        rowNew9.getCell(14).value = results.skorPlakE; //Skor Plak E LAIN-LAIN
        rowNew9.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) LAIN-LAIN
        rowNew9.getCell(16).value = results.traumaTisuLembut; //Trauma Tisu Lembut LAIN-LAIN
        rowNew9.getCell(17).value = results.traumaTisuKeras; //Trauma Tisu Keras LAIN-LAIN
        rowNew9.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV LAIN-LAIN
        rowNew9.getCell(20).value = results.bilTodBaruDibuatFV; //Bilangan Toddler Baru Dibuat FV LAIN-LAIN
        rowNew9.getCell(21).value = results.tampalanAnteriorB; //Bilangan Tampalan Anterior baru LAIN-LAIN
        rowNew9.getCell(22).value = results.tampalanPosteriorB; //Bilangan Tampalan Posterior baru LAIN-LAIN
        rowNew9.getCell(24).value = results.cabutan; //Bilangan Cabutan LAIN-LAIN 
        rowNew9.getCell(25).value = results.abses; //Bilangan Abses LAIN-LAIN
        rowNew9.getCell(26).value = results.pulpotomi; //Pulpotomi LAIN-LAIN 
        rowNew9.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler LAIN-LAIN
        rowNew9.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa LAIN-LAIN
        rowNew9.getCell(29).value = results.toddlerLMG; //LMG Toddler LAIN-LAIN
        rowNew9.getCell(33).value = results.lowCRA; //CRA Rendah LAIN-LAIN
        rowNew9.getCell(34).value = results.moderateCRA; //CRA Sederhana LAIN-LAIN
        rowNew9.getCell(35).value = results.highCRA; //CRA Tinggi LAIN-LAIN

        let rowNew10 = worksheet.getRow(28);
        rowNew10.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV LAIN-LAIN
        rowNew10.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan LAIN-LAIN 
        rowNew10.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan LAIN-LAIN

        // AGENSI LUAR
        let rowNew11 = worksheet.getRow(31);
        rowNew11.getCell(3).value = results.kedatanganBaru; //Kedatangan Baru AGENSI LUAR 
        rowNew11.getCell(4).value = results.kedatanganUlangan; //Kedatangan Ulangan AGENSI LUAR 
        rowNew11.getCell(5).value = results.dStatusDMFX; //d Status dmfx AGENSI LUAR
        rowNew11.getCell(6).value = results.mStatusDMFX; //m Status dmfx AGENSI LUAR
        rowNew11.getCell(7).value = results.dStatusDMFX; //f Status dmfx AGENSI LUAR
        rowNew11.getCell(8).value = results.xStatusDMFX; //x Status dmfx AGENSI LUAR
        rowNew11.getCell(11).value = results.dmfxEqualToZero; //dmfx = 0 AGENSI LUAR 	
        rowNew11.getCell(12).value = results.skorPlakA; //Skor Plak A AGENSI LUAR
        rowNew11.getCell(13).value = results.skorPlakC; //Skor Plak C AGENSI LUAR
        rowNew11.getCell(14).value = results.skorPlakE; //Skor Plak E AGENSI LUAR
        rowNew11.getCell(15).value = results.tpr; //Tidak Perlu Rawatan (TPR) AGENSI LUAR
        rowNew11.getCell(19).value = results.bilTODperluFV; //Bilangan Toddler Baru Perlu FV AGENSI LUAR
        rowNew11.getCell(25).value = results.abses; //Bilangan Abses AGENSI LUAR
        rowNew11.getCell(27).value = results.ceramahUtkToddler; //Ceramah Toddler AGENSI LUAR
        rowNew11.getCell(28).value = results.ceramahUtkDewasa; //Ceramah Dewasa AGENSI LUAR
        rowNew11.getCell(29).value = results.toddlerLMG; //LMG Toddler AGENSI LUAR
        rowNew11.getCell(31).value = results.toddlerDirujukPadaLawatan; //Toddler dirujuk pada Lawatan AGENSI Luar
        rowNew11.getCell(32).value = results.toddlerHadirRujukan; //Toddler hadir rujukan AGENSI LUAR
        rowNew11.getCell(33).value = results.lowCRA; //CRA Rendah AGENSI LUAR
        rowNew11.getCell(34).value = results.moderateCRA; //CRA Sederhana AGENSI LUAR
        rowNew11.getCell(35).value = results.highCRA; //CRA Tinggi AGENSI LUAR

        let rowNew12 = worksheet.getRow(32);
        rowNew12.getCell(20).value = results.bilTodSemulaDibuatFV; //Bilangan Toddler Semula Dibuat FV AGENSI LUAR
        rowNew12.getCell(21).value = results.tampalanAnteriorS; //Bilangan Tampalan Anterior Ulangan AGENSI LUAR 
        rowNew12.getCell(22).value = results.tampalanPosteriorS; //Bilangan Tampalan Posterior Ulangan AGENSI LUAR
        
        let rowNew13 = worksheet.getRow(20);
        rowNew13.getCell(2).value = 'Report Generated by Gi-Ret 2.0 on ' + DateNow + ' at ' + TimeNow;
        rowNew13.commit();

        delete rowNew, rowNew2, rowNew3, rowNew4, rowNew5, rowNew6, rowNew7, rowNew8, rowNew9, rowNew10, rowNew11, rowNew12, rowNew13;

        let newfile = path.join(__dirname, "..", "public", "exports", req.body.user + "-TOD.xlsx");

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





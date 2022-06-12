exports.filterbyUmur = async function(req, res) {
    await Tadika.aggregate([
        { $match: { 'umur': { $gte: "4" } } }
      , { $unwind: '$nama' }
      , { $project: {  
            'statusGigidesidusD': 1,
            'statusGigidesidusM': 1,
            'statusGigidesidusF': 1,
            'statusGigidesidusX': 1,
            'nama.jumlahD': { '$add': [ '$statusGigidesidusD', '$statusGigidesidusM' ] },
           } 
        }  
      , { $group: { 
            '_id': '_$id',
            'statusGigidesidusD': { '$first': '$statusGigidesidusD' },
            'statusGigidesidusM': { '$first': '$statusGigidesidusM' },
            'nama': {
                '$addToSet': '$nama'
            }
          }
        }        
    ]).exec(function(err, allResult) {
        if (err) { return res.status(500).json({ err }); }
        // console.log(allResult[0]);
        // let fullD = 0;
        // for (let i = 0; i < allResult.length; i++) {
        //   // console.log(allResult[i]._id.statusD);
        //   fullD =+ allResult[i]._id.statusD;
        //   console.log(fullD);
        // }
        // console.log(fullD);
        res.send(allResult);
    });
  }

  exports.filterbyUmur = async function(req, res) {
    await Tadika.aggregate([
        { $match: { umur: { $gte: "4" } } }
      , { $unwind: '$nama' }
      , { $project: { 
            nama: 1, 
            statusGigidesidusD: 1, 
            statusGigidesidusM: 1, 
            statusGigidesidusF: 1, 
            statusGigidesidusX: 1,
            jumlahD: { $add: [ $statusGigidesidusD, 0 ] },
           } 
        }  
      , { $group: { _id: { nama: '$nama', statusD: '$statusGigidesidusD', statusM: '$statusGigidesidusM', statusF: '$statusGigidesidusF', statusX: '$statusGigidesidusX'  }, } }
      , { $sort: { _id: -1 } }        
    ]).exec(function(err, allResult) {
        if (err) { return res.status(500).json({ err }); }
        // console.log(allResult[0]);
        let fullD = 0;
        for (let i = 0; i < allResult.length; i++) {
          // console.log(allResult[i]._id.statusD);
          fullD =+ allResult[i]._id.statusD;
          console.log(fullD);
        }
        // console.log(fullD);
        res.send(allResult);
    });
  }

  exports.filterbyUmur = async function(req, res) {
    await Tadika.aggregate([
        { $match: { umur: { $gte: "4" } } }
      , { $project: { nama: 1, statusGigidesidusD: 1, statusGigidesidusM: 1, statusGigidesidusF: 1, statusGigidesidusX: 1 } } 
      , { $unwind: '$nama' } 
      , { $group: { _id: { nama: '$nama', statusD: '$statusGigidesidusD', statusM: '$statusGigidesidusM', statusF: '$statusGigidesidusF', statusX: '$statusGigidesidusX'  }, } }
      , { $sort: { _id: -1 } }        
    ]).exec(function(err, allResult) {
        if (err) { return res.status(500).json({ err }); }
        console.log(allResult[0]);
        res.send(allResult);
    });
  }

  exports.overView = function(req, res) {
    async.parallel({
        pesakitBaru: function(callback) {
            Tadika.countDocuments({ pesakitBaru: "1" }, callback);
        },
        pesakitBaru: function(callback) {
          Tadika.countDocuments({ pesakitBaru: "0" }, callback);
        },
        // listTadika: function(callback) {
        //     Tadika
        //    .find({ createdByNegeri: req.body.negeri })
        //    .distinct('namaTaskaTadikaPendaftaranTadika', {nama: new RegExp('')}, callback);
        // },
        // listKP: function(callback) {
        //     Tadika
        //    .find({ createdByNegeri: req.body.negeri })
        //    .distinct('createdByKp', {nama: new RegExp('')}, callback);
        // },
        // listAll: function(callback) {
        //     Tadika.aggregate([
        //         { $match: { createdByNegeri: req.body.negeri } } 
        //       , { $project: { namaTaskaTadikaPendaftaranTadika: 1, createdByKp: 1, createdByDaerah: 1, createdByNegeri: 1, namaPendaftaranTadika: 1 } } 
        //       , { $unwind: '$namaTaskaTadikaPendaftaranTadika' } 
        //       , { $group: { _id: { tadika: '$namaTaskaTadikaPendaftaranTadika', kp: '$createdByKp', daerah: '$createdByDaerah', negeri: '$createdByNegeri' }, count: { $sum: 1 } } }
        //       , { $sort: { _id: -1 } }        
        //     ], callback);
        // },
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
        console.log(results);
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

exports.kiraJumlahTadika = function(req, res) {
  Tadika.distinct('namaTaskaTadikaPendaftaranTadika', {nama: new RegExp('')}, function(err, tadikas) {
      if (err) { return res.status(500).json({ err }); }
      res.json(tadikas);
      }
  );
};

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
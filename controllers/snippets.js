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
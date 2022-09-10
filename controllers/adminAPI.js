const jwt = require('jsonwebtoken');
const simpleCrypto = require('simple-crypto-js').default;
const mailer = require('nodemailer');
const Superadmin = require('../models/Superadmin');
const Fasiliti = require('../models/Fasiliti');
const Operator = require('../models/Operator');
const Dictionary = {
  kp: 'klinik',
  peg: 'pegawai',
  taska: 'taska',
  tadika: 'tadika',
  sr: 'sekolah-rendah',
  sm: 'sekolah-menengah',
  ins: 'institusi',
  kpb: 'kp-bergerak',
};

exports.getData = async (req, res, next) => {
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'This is the get data route',
    });
  } else {
    console.log('new fn! with body', req.body);
    var { Fn, FType, Data, token, Id } = req.body;
    const theType = Dictionary[FType];
    const dataGeografik = {
      daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
      negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
    };
    switch (Fn) {
      case 'create':
        console.log('create for', theType);
        if (theType !== 'pegawai') {
          Data = {
            ...Data,
            jenisFasiliti: theType,
            createdByDaerah: dataGeografik.daerah,
            createdByNegeri: dataGeografik.negeri,
          };
          const data = await Fasiliti.create(Data);
          res.status(200).json(data);
        }
        if (theType === 'pegawai') {
          Data = {
            ...Data,
            createdByDaerah: dataGeografik.daerah,
            createdByNegeri: dataGeografik.negeri,
          };
          const data = await Operator.create(Data);
          res.status(200).json(data);
        }
        break;
      case 'read':
        console.log('read for', theType);
        if (theType !== 'pegawai') {
          const data = await Fasiliti.find({
            jenisFasiliti: theType,
            dataGeografik,
          });
          res.status(200).json(data);
        }
        if (theType === 'pegawai') {
          const data = await Operator.find({
            createdByDaerah: dataGeografik.daerah,
            createdByNegeri: dataGeografik.negeri,
          });
          res.status(200).json(data);
        }
        break;
      case 'readOne':
        console.log('readOne for', theType);
        if (theType !== 'pegawai') {
          const data = await Fasiliti.findById({
            _id: Id,
          });
          res.status(200).json(data);
        }
        if (theType === 'pegawai') {
          const data = await Operator.findById({
            _id: Id,
          });
          res.status(200).json(data);
        }
        break;
      case 'update':
        console.log('update for', theType);
        if (theType !== 'pegawai') {
          const data = await Fasiliti.findByIdAndUpdate(
            { _id: Id },
            { $set: Data },
            { new: true }
          );
          res.status(200).json(data);
        }
        if (theType === 'pegawai') {
          const data = await Operator.findByIdAndUpdate(
            { _id: Id },
            { $set: Data },
            { new: true }
          );
          res.status(200).json(data);
        }
        break;
      case 'delete':
        console.log('delete for', theType);
        if (theType !== 'pegawai') {
          const data = await Fasiliti.findByIdAndDelete({ _id: Id });
          res.status(200).json(data);
        }
        if (theType === 'pegawai') {
          const data = await Operator.findByIdAndDelete({ _id: Id });
          res.status(200).json(data);
        }
        break;
      default:
        res.status(200).json({
          message: 'This is the default case',
        });
    }
    // const { FType, token } = req.body;
    // const dataGeografik = {
    //   daerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
    //   negeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
    // };
    // const theType = Dictionary[FType];
    // // console.log(req.body.FType, req.body.daerah, req.body.negeri, theType);
    // switch (theType) {
    //   case 'klinik':
    //     // console.log('klinik');
    //     try {
    //       const klinik = await Fasiliti.find({
    //         jenisFasiliti: theType,
    //         dataGeografik,
    //       });
    //       // console.log(klinik);
    //       res.status(200).json(klinik);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   case 'pegawai':
    //     try {
    // const pegawai = await Operator.find({
    //   createdByDaerah: jwt.verify(token, process.env.JWT_SECRET).daerah,
    //   createdByNegeri: jwt.verify(token, process.env.JWT_SECRET).negeri,
    // });
    // console.log(pegawai);
    // res.status(200).json(pegawai);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   case 'taska':
    //     try {
    //       const taska = await Fasiliti.find({
    //         jenisFasiliti: theType,
    //         dataGeografik,
    //       });
    //       res.status(200).json(taska);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   case 'tadika':
    //     try {
    //       const tadika = await Fasiliti.find({
    //         jenisFasiliti: theType,
    //         dataGeografik,
    //       });
    //       res.status(200).json(tadika);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   case 'sekolah-rendah':
    //     try {
    //       const sr = await Fasiliti.find({
    //         jenisFasiliti: theType,
    //         dataGeografik,
    //       });
    //       res.status(200).json(sr);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   case 'sekolah-menengah':
    //     try {
    //       const sm = await Fasiliti.find({
    //         jenisFasiliti: theType,
    //         dataGeografik,
    //       });
    //       res.status(200).json(sm);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   case 'institusi':
    //     try {
    //       const ins = await Fasiliti.find({
    //         jenisFasiliti: theType,
    //         dataGeografik,
    //       });
    //       res.status(200).json(ins);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   case 'kp-bergerak':
    //     try {
    //       const kpb = await Fasiliti.find({
    //         jenisFasiliti: theType,
    //         dataGeografik,
    //       });
    //       res.status(200).json(kpb);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //     break;
    //   default:
    //     res.status(500).json({ message: 'Invalid Fasiliti Type' });
    //     break;
    // }
  }
};

exports.addData = async (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'This is the add data route',
    });
  } else {
    const { FType, daerah, negeri, data } = req.body;
    const theType = Dictionary[FType];
    switch (theType) {
      case 'klinik':
        try {
          const klinik = await Fasiliti.create({
            jenisFasiliti: theType,
            daerah,
            negeri,
            data,
          });
          res.status(200).json(klinik);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'pegawai':
        try {
          const pegawai = await Operator.create({
            createdByDaerah: daerah,
            createdByNegeri: negeri,
            data,
          });
          res.status(200).json(pegawai);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'taska':
        try {
          const taska = await Fasiliti.create({
            jenisFasiliti: theType,
            daerah,
            negeri,
            data,
          });
          res.status(200).json(taska);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'tadika':
        try {
          const tadika = await Fasiliti.create({
            jenisFasiliti: theType,
            daerah,
            negeri,
            data,
          });
          res.status(200).json(tadika);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'sekolah-rendah':
        try {
          const sr = await Fasiliti.create({
            jenisFasiliti: theType,
            daerah,
            negeri,
            data,
          });
          res.status(200).json(sr);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'sekolah-menengah':
        try {
          const sm = await Fasiliti.create({
            jenisFasiliti: theType,
            daerah,
            negeri,
            data,
          });
          res.status(200).json(sm);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'institusi':
        try {
          const ins = await Fasiliti.create({
            jenisFasiliti: theType,
            daerah,
            negeri,
            data,
          });
          res.status(200).json(ins);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'kp-bergerak':
        try {
          const kpb = await Fasiliti.create({
            jenisFasiliti: theType,
            daerah,
            negeri,
            data,
          });
          res.status(200).json(kpb);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      default:
        res.status(500).json({ message: 'Invalid Fasiliti Type' });
        break;
    }
  }
};

exports.updateData = async (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'This is the update data route',
    });
  } else {
    const { FType, daerah, negeri, data } = req.body;
    const theType = Dictionary[FType];
    switch (theType) {
      case 'klinik':
        try {
          const klinik = await Fasiliti.findOneAndUpdate(
            {
              jenisFasiliti: theType,
              daerah,
              negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(klinik);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'pegawai':
        try {
          const pegawai = await Operator.findOneAndUpdate(
            {
              createdByDaerah: daerah,
              createdByNegeri: negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(pegawai);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'taska':
        try {
          const taska = await Fasiliti.findOneAndUpdate(
            {
              jenisFasiliti: theType,
              daerah,
              negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(taska);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'tadika':
        try {
          const tadika = await Fasiliti.findOneAndUpdate(
            {
              jenisFasiliti: theType,
              daerah,
              negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(tadika);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'sekolah-rendah':
        try {
          const sr = await Fasiliti.findOneAndUpdate(
            {
              jenisFasiliti: theType,
              daerah,
              negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(sr);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'sekolah-menengah':
        try {
          const sm = await Fasiliti.findOneAndUpdate(
            {
              jenisFasiliti: theType,
              daerah,
              negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(sm);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'institusi':
        try {
          const ins = await Fasiliti.findOneAndUpdate(
            {
              jenisFasiliti: theType,
              daerah,
              negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(ins);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      case 'kp-bergerak':
        try {
          const kpb = await Fasiliti.findOneAndUpdate(
            {
              jenisFasiliti: theType,
              daerah,
              negeri,
            },
            {
              data,
            },
            {
              new: true,
            }
          );
          res.status(200).json(kpb);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
        break;
      default:
        res.status(500).json({ message: 'Invalid Fasiliti Type' });
        break;
    }
  }
};

async function sendVerificationEmail(email, userId) {
  let theKey = simpleCrypto.generateRandomString(20);
  const update = await Superadmin.findByIdAndUpdate(
    userId,
    {
      tempKey: theKey,
    },
    { new: true }
  );
  // const transporter = mailer.createTransport({
  //   host: process.env.EMAILER_HOST,
  //   port: process.env.EMAILER_PORT,
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAILER_ACCT,
  //     pass: process.env.EMAILER_PASS,
  //   },
  // });
  // const verification = await transporter.sendMail({
  //   from: `"Admin" <${process.env.EMAILER_ACCT}>`,
  //   to: email,
  //   subject: 'Verifikasi Akaun',
  //   text: 'Kunci verifikasi anda adalah: ' + verificationKey + '\n\n',
  //   html:
  //     '<p>Kunci verifikasi anda adalah: </p>' + verificationKey + '<p>\n\n</p>',
  // });
  // console.log('your key: ' + theKey);
  return theKey;
}

exports.helloUser = async (req, res) => {
  const { username } = req.body;
  const User = await Superadmin.findOne({ user_name: username });
  if (req.method === 'POST') {
    if (!User) {
      res.status(401).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }
    // await sendVerificationEmail(process.env.SEND_TO, User._id).catch((err) => {
    //   console.log(err);
    // });
    const xxxKey = await sendVerificationEmail(
      process.env.SEND_TO,
      User._id
    ).catch((err) => {
      console.log(err);
    });
    return res.status(200).json({
      status: 'success',
      message: 'Email sent to ' + process.env.SEND_TO,
      tempKey: xxxKey,
    });
  }
  if (req.method === 'GET') {
    return res.status(200).json({
      Status: 'Success',
      Message: 'This is the modified server response',
    });
  }
};

exports.getCipher = async (req, res) => {
  const crypt = new simpleCrypto(process.env.API_SECRET);
  const cipherText = crypt.encrypt(process.env.API_KEY);
  res.status(200).json({
    status: 'success',
    message: 'Verification route',
    key: cipherText,
  });
};

exports.loginUser = async (req, res) => {
  // console.log(req.body);
  const { username, password, key } = req.body;
  const crypt = new simpleCrypto(process.env.API_SECRET);
  const decipheredText = crypt.decrypt(key);
  if (decipheredText !== process.env.API_KEY) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid API key',
    });
  }
  const User = await Superadmin.findOne({ user_name: username });
  if (!User) {
    const msg = 'Tiada user ini dalam sistem';
    return res.status(401).json({
      status: 'error',
      message: msg,
    });
  }
  if (password !== User.tempKey) {
    const msg = 'Key salah';
    return res.status(401).json({
      status: 'error',
      message: msg,
    });
  }
  const genToken = jwt.sign(
    {
      userId: User._id,
      username: User.user_name,
      daerah: User.daerah,
      negeri: User.negeri,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  verificationKey = '';
  return res.status(200).json({
    status: 'success',
    message: 'Login berjaya',
    adminToken: genToken,
  });
};

exports.addAdmin = async (req, res) => {
  const Admin = new Superadmin({
    user_name: req.body.user_name,
    password: req.body.password,
    daerah: req.body.daerah,
    negeri: req.body.negeri,
  });
  Admin.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Admin berjaya ditambah',
      });
    }
  });
};

exports.getCurrentUser = async (req, res) => {
  const data = {
    userId: jwt.verify(req.body.token, process.env.JWT_SECRET).userId,
    username: jwt.verify(req.body.token, process.env.JWT_SECRET).username,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
  };
  res.status(200).json(data);
};

exports.listKp = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: 'klinik',
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved all KPs',
        });
      }
    }
  );
};

exports.listPg = (req, res) => {
  Operator.find(
    // { daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah },
    { daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved all PGs',
        });
      }
    }
  );
};

exports.listTaska = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: 'taska',
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved all Taskas',
        });
      }
    }
  );
};

exports.listTadika = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: 'tadika',
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved all Tadikas',
        });
      }
    }
  );
};

exports.listSr = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: 'sekolah-rendah',
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved all SRs',
        });
      }
    }
  );
};

exports.listSm = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: 'sekolah-menengah',
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved all SMs',
        });
      }
    }
  );
};

exports.listInstitusi = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: 'institusi',
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved all Institusis',
        });
      }
    }
  );
};

exports.listFacilityType = (req, res) => {
  try {
    Fasiliti.distinct('jenisFasiliti', { nama: new RegExp('') }),
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: 'success',
            data: data,
            message: 'Retrieved all Facility Types',
          });
        }
      };
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.addKp = (req, res) => {
  const kp = new Fasiliti({
    nama: req.body.klinik.toLowerCase(),
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    handler: '',
    jenisFasiliti: 'klinik',
  });
  kp.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Klinik berjaya ditambah',
      });
    }
  });
};

exports.addPg = (req, res) => {
  const pg = new Operator({
    nama: req.body.nama.toLowerCase(),
    gred: req.body.gred.toLowerCase(),
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    kpSkrg: req.body.kp,
    role: req.body.role,
  });
  pg.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'pegawai berjaya ditambah',
      });
    }
  });
};

// tak pakai -----
exports.addTaska = (req, res) => {
  const taska = new Fasiliti({
    nama: req.body.nama,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    handler: req.body.handler,
    jenisFasiliti: 'Taska',
  });
  taska.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Taska berjaya ditambah',
      });
    }
  });
};

exports.addTadika = (req, res) => {
  const tadika = new Fasiliti({
    nama: req.body.nama,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    handler: req.body.handler,
    jenisFasiliti: 'Tadika',
  });
  tadika.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Tadika berjaya ditambah',
      });
    }
  });
};

exports.addSR = (req, res) => {
  const sr = new Fasiliti({
    nama: req.body.nama,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    handler: req.body.handler,
    jenisFasiliti: 'Sekolah Rendah',
  });
  sr.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Sekolah Rendah berjaya ditambah',
      });
    }
  });
};

exports.addSM = (req, res) => {
  const sm = new Fasiliti({
    nama: req.body.nama,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    handler: req.body.handler,
    jenisFasiliti: 'Sekolah Menengah',
  });
  sm.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Sekolah Menengah berjaya ditambah',
      });
    }
  });
};

exports.addInstitusi = (req, res) => {
  const institusi = new Fasiliti({
    nama: req.body.nama,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    handler: req.body.handler,
    jenisFasiliti: 'Institusi',
  });
  institusi.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Institusi berjaya ditambah',
      });
    }
  });
};
// tak pakai -----

exports.deleteData = (req, res) => {
  Fasiliti.findByIdAndDelete(req.body.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      Operator.findByIdAndDelete(req.body.id, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: 'success',
            data: data,
            message: 'Fasiliti berjaya dihapus',
          });
        }
      });
    }
  });
};

exports.findPegawai = (req, res) => {
  Operator.findById(req.body.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Pegawai berjaya dicari',
      });
    }
  });
};

exports.editPegawai = (req, res) => {
  Operator.findByIdAndUpdate(
    req.body.id,
    { gred: req.body.gred, kpSkrg: req.body.kp, role: req.body.role },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Pegawai berjaya dikemaskini',
        });
      }
    }
  );
};

exports.editFacility = async (req, res) => {
  Fasiliti.findByIdAndUpdate(
    req.body.id,
    {
      handler: req.body.handler,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Fasiliti berjaya dikemaskini',
        });
      }
    }
  );
};

exports.addFacility = async (req, res) => {
  // console.log(req.params.id);
  // const jenisFasiliti = Dictionary[req.params.id];
  // console.log(jenisFasiliti);
  const facility = new Fasiliti({
    nama: req.body.nama,
    negeri: jwt.verify(req.body.token, process.env.JWT_SECRET).negeri,
    daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    handler: req.body.handler,
    jenisFasiliti: req.params.id,
  });
  facility.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Fasiliti berjaya ditambah',
      });
    }
  });
};

exports.listFacility = (req, res) => {
  const jenisFasiliti = Dictionary[req.body.jenisFacility];
  Fasiliti.find(
    {
      jenisFasiliti: jenisFasiliti,
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: 'success',
          jenisFasiliti: jenisFasiliti,
          data: data,
          message: 'Retrieved all Fasiliti',
        });
      }
    }
  );
};

exports.findFacility = (req, res) => {
  console.log(req.body.id);
  Fasiliti.findById(req.body.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Fasiliti berjaya dicari',
      });
    }
  });
};

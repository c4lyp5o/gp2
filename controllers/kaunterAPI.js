const jwt = require('jsonwebtoken');
const Superadmin = require('../models/Superadmin');
const Kaunter = require('../models/Kaunter');

async function helloThere(req, res) {
  res.status(200).json({
    message: 'Hello there',
  });
}

async function registerPT(req, res) {
  const { nama, negeri, daerah, kp } = req.body;
  const newKaunter = new Kaunter({
    nama,
    negeri,
    daerah,
    kp,
  });
  try {
    const kaunter = await newKaunter.save();
    res.status(201).json({
      message: 'PT berjaya ditambah',
      kaunter,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function loginPT(req, res) {
  const { nama } = req.body;
  try {
    const kaunter = await Kaunter.findOne({ nama });
    if (!kaunter) {
      return res.status(401).json({
        message: 'PT tidak ditemui',
      });
    }
    const token = jwt.sign(
      {
        kp,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Login berjaya',
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { helloThere, registerPT, loginPT };

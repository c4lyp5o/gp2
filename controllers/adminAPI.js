const jwt = require("jsonwebtoken");
const Superadmin = require("../models/Superadmin");
const Fasiliti = require("../models/Fasiliti");
const Operator = require("../models/Operator");
const async = require("async");
const { token } = require("morgan");

exports.helloUser = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Hello User",
  });
};

exports.loginUser = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  const User = await Superadmin.findOne({ user_name: username });
  if (!User) {
    const msg = "Tiada user ini dalam sistem";
    return res.status(401).json({
      status: "error",
      message: msg,
    });
  }
  if (User.password === password) {
    const genToken = jwt.sign(
      {
        userId: User._id,
        username: User.user_name,
        daerah: User.daerah,
        negeri: User.negeri,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      status: "success",
      message: "Login berjaya",
      token: genToken,
    });
  } else {
    const msg = "Password salah";
    return res.status(401).json({
      status: "error",
      message: msg,
    });
  }
};

exports.listKp = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: "Klinik",
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
      //   daerah: "Kuala Selangor",
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved all KPs",
        });
      }
    }
  );
};

exports.listPg = (req, res) => {
  Operator.find(
    // { daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah },
    { daerah: "Kuala Selangor" },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved all PGs",
        });
      }
    }
  );
};

exports.listTaska = (req, res) => {
  // const payloadUserType = jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah;
  // const daerah = jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah;
  Fasiliti.find(
    {
      jenisFasiliti: "Taska",
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: "Kuala Selangor",
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved all Taskas",
        });
      }
    }
  );
};

exports.listTadika = (req, res) => {
  //   const theTok = req.body.token;
  //   const daerah = jwt.verify(theTok, process.env.JWT_SECRET).daerah;
  Fasiliti.find(
    {
      jenisFasiliti: "Tadika",
      //   daerah: jwt.verify(localStorage.getItem("token"), process.env.JWT_SECRET)
      //     .daerah,
      daerah: jwt.verify(req.body.token, process.env.JWT_SECRET).daerah,
      //   daerah: daerah,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved all Tadikas",
        });
      }
    }
  );
};

exports.listSr = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: "Sekolah Rendah",
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: "Kuala Selangor",
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved all SRs",
        });
      }
    }
  );
};

exports.listSm = (req, res) => {
  Fasiliti.find(
    {
      jenisFasiliti: "Sekolah Menengah",
      //   daerah: jwt.verify(req.cookies.token, process.env.JWT_SECRET).daerah,
      daerah: "Kuala Selangor",
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          status: "success",
          data: data,
          message: "Retrieved all SMs",
        });
      }
    }
  );
};

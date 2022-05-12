// CORE ----------------------------------------------------
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// IMPORT ROUTER -------------------------------------------
// user import
const authLogin = require("./routes/authLogin");
const pilihOperatorFasiliti = require("./routes/pilihOperatorFasiliti");
const dashboard = require("./routes/dashboard");
const tadika = require("./routes/tadika");
const sekolah = require("./routes/sekolah");
const allQueryRoute = require("./routes/allQueryRoute");
// admin import
const adminAuthLogin = require("./routes/adminAuthLogin");
const adminTadika = require("./routes/adminTadika");
// generate import
const genRouter = require("./routes/generateRouter");
const adminRouter = require("./routes/adminRouter");
const adminAPI = require("./routes/adminAPI");

// IMPORT MIDDLEWARES --------------------------------------
const authCheck = require("./middlewares/authCheck");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const genAuth = require("./middlewares/genAuth").verifyToken;

// DATABASE ------------------------------------------------
const connectDB = require("./database/connect");

// CORS OPTIONS
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

// MIDDLEWARES ---------------------------------------------
app.use(express.static("./public"));
app.use(express.static("./public/exports"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// user route
app.use("/api/v1/auth", authLogin);
app.use("/api/v1/pilih", authCheck, pilihOperatorFasiliti);
app.use("/api/v1/dashboard", authCheck, dashboard);
app.use("/api/v1/tadika", authCheck, tadika);
app.use("/api/v1/sekolah", authCheck, sekolah);
app.use("/api/v1/query", authCheck, allQueryRoute);
// admin route
app.use("/api/v1/admin/auth", adminAuthLogin);
app.use("/api/v1/admin/tadika", authCheck, adminTadika);
// generate route
app.use("/api/v1/generate", genRouter);
app.use("/admin", adminRouter);
app.use("/api/v1/superadmin", adminAPI);
//test
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// error handler & not found
app.use(errorHandler);
app.use(notFound);
// use pug
app.set("views", "./views");
app.set("view engine", "pug");

// SERVER --------------------------------------------------
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to Giret Database!");
    app.listen(
      port,
      console.log(`Server is listening at port: ${port}. Lessgo!`)
    );
  } catch (error) {
    console.log("Could not Connect to Giret Database!");
    console.log(error);
  }
};

start();

// CORE --------------------------------------------------------
require('dotenv').config();
require('express-async-errors');
const logger = require('./logs/logger');
const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

// IMPORT ROUTER -----------------------------------------------
// erkm import
const erkm = require('./routes/erkm');

// user import
const authRegister = require('./routes/authRegister');
const authLogin = require('./routes/authLogin');
const identity = require('./routes/identity');
const pilihOperatorFasiliti = require('./routes/pilihOperatorFasiliti');
const umum = require('./routes/umum');
const sekolah = require('./routes/sekolah');
const allQueryRoute = require('./routes/allQueryRoute');

// kaunter
const kaunter = require('./routes/kaunter');

// admin import
const adminAPI = require('./routes/adminAPI');

// generate import
const genRouter = require('./routes/generateRouter');

// otp import
const getotp = require('./routes/getotp');

// IMPORT MIDDLEWARES ------------------------------------------
const apiKeyVerifier = require('./middlewares/apiKeyVerifier');
const authCheck = require('./middlewares/authCheck');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// DATABASE ----------------------------------------------------
const connectDB = require('./database/connect');

// USE MIDDLEWARES ---------------------------------------------
const root = path.join(__dirname, 'client', 'build');
app.use(express.static(root));
app.use(express.json());

// erkm route
app.use('/erkm', authCheck, erkm);
// give erkm token every 5 seconds or sync erkm every 10 mins
// setInterval(async () => {
//   const UserModel = require('./models/User');
//   try {
//     const erkmUser = await UserModel.findOne({
//       username: process.env.ERKM_SERVER_ID,
//       password: process.env.ERKM_SERVER_PASS,
//     });

//     if (!erkmUser) {
//       return console.log('Invalid internal erkm credentials');
//     }

//     const erkmToken = erkmUser.createJWT();

//     console.log({ erkmUser, erkmToken });

//     // await axios.get(`http://localhost:${process.env.PORT}/erkm/sr`, {
//     //   headers: { Authorization: `Bearer ${erkmToken}` },
//     // });
//     // await axios.get(`http://localhost:${process.env.PORT}/erkm/sm`, {
//     //   headers: { Authorization: `Bearer ${erkmToken}` },
//     // });

//     // console.log('Erkm sync done in 10 mins interval');
//   } catch (error) {
//     console.log(error.response.data.msg);
//   }
//   // }, 600000);
// }, 5000);

// user route
app.use('/api/v1/auth', apiKeyVerifier, authLogin, authRegister);
app.use('/api/v1/identity', authCheck, identity);
app.use('/api/v1/pilih', authCheck, pilihOperatorFasiliti);
app.use('/api/v1/umum', authCheck, umum);
// --- get otp for umum deletion
app.use('/api/v1/getotp', getotp);
// ---
app.use('/api/v1/sekolah', authCheck, sekolah);
app.use('/api/v1/query', authCheck, allQueryRoute);

// kaunter route
app.use('/api/v1/kaunter', authCheck, kaunter);

// admin route
app.use('/api/v1/superadmin', apiKeyVerifier, adminAPI);

// generate route
app.use('/api/v1/generate', genRouter);

// for use in deployment
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// error handler & not found
app.use(errorHandler);
app.use(notFound);

// SERVER ------------------------------------------------------
const port = process.env.PORT || 5000;

const start = async () => {
  logger.info('Starting server...');
  try {
    await connectDB(process.env.MONGO_URI);
    logger.info('Connected to database');
    console.log('Connected to Giret Database!');
    app.listen(
      port,
      console.log(`Server is listening at port: ${port}. Lessgo!`),
      logger.info(`Server is listening at port: ${port}. Lessgo!`)
    );
  } catch (error) {
    logger.error(error.message);
    console.log('Could not Connect to Giret Database!');
    console.log(error);
  }
};

start();

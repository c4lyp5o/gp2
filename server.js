// CORE --------------------------------------------------------
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const logger = require('./logs/logger');

// IMPORT ROUTER -----------------------------------------------
// getdate import
const getdate = require('./routes/getdate');

// dpims import
// const dpims = require('./routes/dpims');

// erkm import
// const erkm = require('./routes/erkm');

// user import
const authLogin = require('./routes/authLogin');
const identity = require('./routes/identity');
const pilihOperatorFasiliti = require('./routes/pilihOperatorFasiliti');
const umum = require('./routes/umum');
const sekolah = require('./routes/sekolah');
const promosi = require('./routes/promosi');
const getotp = require('./routes/getotp');
const operator = require('./routes/operator');
const allQueryRoute = require('./routes/allQueryRoute');

// kaunter
const kaunter = require('./routes/kaunter');

// admin import
const adminAPI = require('./routes/adminAPI');

// generate import
const genRouter = require('./routes/generateRouter');

// IMPORT MIDDLEWARES ------------------------------------------
const authCheck = require('./middlewares/authCheck');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// DATABASE ----------------------------------------------------
const connectDB = require('./database/connect');

// USE MIDDLEWARES ---------------------------------------------
const root = path.join(__dirname, 'client', 'build');
app.use(express.static(root));
app.use(express.json({ limit: '50mb' }));

// getting date from the server, better way because it shoudn't rely on the client to have correct date
app.use('/api/v1/getdate', getdate);

// the dpims scrap
// app.use('/dpims', dpims);

// erkm route
// app.use('/erkm', authCheck, erkm);
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
app.use('/api/v1/auth', authLogin);
app.use('/api/v1/identity', authCheck, identity);
app.use('/api/v1/pilih', authCheck, pilihOperatorFasiliti);
app.use('/api/v1/umum', authCheck, umum);
app.use('/api/v1/sekolah', authCheck, sekolah);
app.use('/api/v1/promosi', authCheck, promosi);
app.use('/api/v1/getotp', getotp);
app.use('/api/v1/operator', authCheck, operator);
app.use('/api/v1/query', authCheck, allQueryRoute);

// kaunter route
app.use('/api/v1/kaunter', authCheck, kaunter);

// admin route
app.use('/api/v1/superadmin', adminAPI);

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

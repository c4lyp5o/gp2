// CORE --------------------------------------------------------
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./logs/logger');

// security packages
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// IMPORT ROUTER -----------------------------------------------
// getdate import
const getdate = require('./routes/getdate');

// dpims import
// const dpims = require('./routes/dpims');

// erkm import
// const erkm = require('./routes/erkm');

// MOEIS import
const moeis = require('./routes/moeis');

// user import
const authLogin = require('./routes/authLogin');
const identity = require('./routes/identity');
const pilihOperatorFasiliti = require('./routes/pilihOperatorFasiliti');
const umum = require('./routes/umum');
const sekolah = require('./routes/sekolah');
const promosi = require('./routes/promosi');
const getotp = require('./routes/getotp');
const operator = require('./routes/operator');
const summary = require('./routes/summary');
const allQueryRoute = require('./routes/allQueryRoute');

// kohort import
const kohortKotak = require('./routes/kohortKotak');
const kohortFMR = require('./routes/kohortFMR');

// kaunter
const kaunter = require('./routes/kaunter');

// MyVAS import
const myVas = require('./routes/myVas');

// admin import
const adminAPI = require('./routes/adminAPI');

// generate import
const genRouter = require('./routes/generateRouter');
const genRouterKp = require('./routes/generateRouterKp');

// ETL
const ETL = require('./routes/ETL');

// ondemand setting
const onDemand = require('./routes/ondemand');

// IMPORT MIDDLEWARES ------------------------------------------
const authCheck = require('./middlewares/authCheck');
const moeisAuth = require('./middlewares/moeisAuth');
const { adminAuth, etlAuth } = require('./middlewares/adminAuth');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// DATABASE ----------------------------------------------------
const connectDB = require('./database/connect');

// USE MIDDLEWARES ---------------------------------------------
const root = path.join(__dirname, 'client', 'dist');
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    strictTransportSecurity: false,
    xPoweredBy: false,
  })
);
app.use(async function (req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);
app.use(express.json({ limit: '50mb' }));

// for use in deployment
app.use(express.static(root));

// getting date & time from the server because it shouldn't rely on the client to have correct date & time
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

// moeis route
app.use('/api/v1/moeis', moeisAuth, moeis);

// user route
app.use('/api/v1/auth', authLogin);
app.use('/api/v1/identity', authCheck, identity);
app.use('/api/v1/pilih', authCheck, pilihOperatorFasiliti);
app.use('/api/v1/umum', authCheck, umum);
app.use('/api/v1/sekolah', authCheck, sekolah);
app.use('/api/v1/promosi', authCheck, promosi);
app.use('/api/v1/getotp', authCheck, getotp);
// app.use('/api/v1/operator', authCheck, operator);
app.use('/api/v1/summary', authCheck, summary);
app.use('/api/v1/query', authCheck, allQueryRoute);

// kohort route
app.use('/api/v1/kohort/kotak', authCheck, kohortKotak);
app.use('/api/v1/kohort/fmr', authCheck, kohortFMR);

// kaunter route
app.use('/api/v1/kaunter', authCheck, kaunter);

// MyVAS route
app.use('/api/v1/myvas', myVas);

// admin route
app.use('/api/v1/superadmin', adminAPI);

// generate HQ, Negeri, Daerah route
app.use('/api/v1/generate', genRouter);

// generate KP route
app.use('/api/v1/generatekp', genRouterKp);

// ETL
app.use('/api/v1/etl', etlAuth, ETL);

// ondemand setting
app.use('/api/v1/ondemand', adminAuth, onDemand);

// identify client ip
app.get('/api/v1/ip', async (req, res) => {
  if (process.env.BUILD_ENV === 'unstable') {
    console.log(req.ip);
  }
  return res.status(200).json({ yourIP: req.ip });
});

// for use in deployment
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// not found & error handler
app.use(notFound);
app.use(errorHandler);

// SERVER ------------------------------------------------------
const port = process.env.PORT || 5000;

const start = async () => {
  logger.info('[server] Starting server...');
  try {
    await connectDB(process.env.MONGO_URI);
    logger.info('[server] Connected to Giret Database!');
    app.listen(
      port,
      logger.info(`[server] Server is listening at port: ${port}. Lessgo!`)
    );
    // display application version number everytime server start
    logger.info('[server] v' + process.env.npm_package_version);
  } catch (error) {
    logger.error(error);
  }
};

start();

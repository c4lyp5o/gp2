// CORE ----------------------------------------------------
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');

// IMPORT ROUTER -------------------------------------------
// user import
const authLogin = require('./routes/authLogin');
const identity = require('./routes/identity');
const pilihOperatorFasiliti = require('./routes/pilihOperatorFasiliti');
const sekolah = require('./routes/sekolah');
// const tadika = require('./routes/tadika');
// const allQueryRoute = require('./routes/allQueryRoute');

// admin import
const adminAPI = require('./routes/adminAPI');

// generate import
const genRouter = require('./routes/generateRouter');

// IMPORT MIDDLEWARES --------------------------------------
const authCheck = require('./middlewares/authCheck');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const genAuth = require('./middlewares/genAuth').verifyToken;

// DATABASE ------------------------------------------------
const connectDB = require('./database/connect');

// MIDDLEWARES ---------------------------------------------
const root = path.join(__dirname, 'client', 'build');
app.use(express.static(root));
app.use(express.json());

// user route
app.use('/api/v1/auth', authLogin);
app.use('/api/v1/identity', authCheck, identity);
app.use('/api/v1/pilih', authCheck, pilihOperatorFasiliti);
app.use('/api/v1/sekolah', authCheck, sekolah);
// app.use('/api/v1/tadika', authCheck, tadika);
// app.use('/api/v1/query', authCheck, allQueryRoute);

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

// SERVER --------------------------------------------------
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to Giret Database!');
    app.listen(
      port,
      console.log(`Server is listening at port: ${port}. Lessgo!`)
    );
  } catch (error) {
    console.log('Could not Connect to Giret Database!');
    console.log(error);
  }
};

start();

// CORE ----------------------------------------------------
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// IMPORT ROUTER -------------------------------------------
// user import
const authLogin = require('./routes/authLogin');
const pilihOperatorFasiliti = require('./routes/pilihOperatorFasiliti');
const dashboard = require('./routes/dashboard');
const tadika = require('./routes/tadika');
const sekolah = require('./routes/sekolah');
const allQueryRoute = require('./routes/allQueryRoute');
// admin import
const adminAuthLogin = require('./routes/adminAuthLogin');
const adminTadika = require('./routes/adminTadika');

// IMPORT MIDDLEWARES --------------------------------------
const authCheck = require('./middlewares/authCheck');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// DATABASE ------------------------------------------------
const connectDB = require('./database/connect');

// MIDDLEWARES ---------------------------------------------
app.use(express.json());
app.use(express.static('./public'));
// user route
app.use('/api/v1/auth', authLogin);
app.use('/api/v1/pilih', authCheck, pilihOperatorFasiliti);
app.use('/api/v1/dashboard', authCheck, dashboard);
app.use('/api/v1/tadika', authCheck, tadika);
app.use('/api/v1/sekolah', authCheck, sekolah);
app.use('/api/v1/query', authCheck, allQueryRoute);
// admin route
app.use('/api/v1/admin/auth', adminAuthLogin);
app.use('/api/v1/admin/tadika', authCheck, adminTadika);
// error handler & not found
app.use(errorHandler);
app.use(notFound);

// SERVER --------------------------------------------------
const port = 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Database connected');
        app.listen(port, console.log(`Server is listening at port : ${port}...`));
    } catch (error) {
        console.log(error);
    }
}

start();
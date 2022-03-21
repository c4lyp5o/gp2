// CORE ----------------------------------------------------
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// IMPORT ROUTER -------------------------------------------
// user import
const authLogin = require('./routes/authLogin');
const dashboard = require('./routes/dashboard');
const tadika = require('./routes/tadika');
const sekolah = require('./routes/sekolah');
const allQueryRoute = require('./routes/allQueryRoute');
// admin import
const adminAuthLogin = require('./routes/adminAuthLogin');
const adminTadika = require('./routes/adminTadika');
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
app.use(express.static('./public'));
app.use(express.static('./public/exports'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// user route
app.use('/api/v1/auth', authLogin);
app.use('/api/v1/dashboard', authCheck, dashboard);
app.use('/api/v1/tadika', authCheck, tadika);
app.use('/api/v1/sekolah', authCheck, sekolah);
app.use('/api/v1/query', authCheck, allQueryRoute);
// admin route
app.use('/api/v1/admin/auth', adminAuthLogin);
app.use('/api/v1/admin/tadika', authCheck, adminTadika);
// generate route
app.use('/generate', genAuth, genRouter);
// error handler & not found
app.use(errorHandler);
app.use(notFound);
// use pug
app.set('views', './views');
app.set('view engine', 'pug');

// SERVER --------------------------------------------------
const port = process.env.PORT;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to Giret Database!');
        })
        .catch(err => {
            console.error('Could not Connect to Giret Database!', err);
        });
        app.listen(port, console.log(`Server is listening at port: ${port}. Lessgo!`));
    } catch (error) {
        console.log(error);
    }
}

start();
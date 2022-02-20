// Core
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// Import
// user import
const authLogin = require('./routes/authLogin');
const dashboard = require('./routes/dashboard');
const tadika = require('./routes/tadika');
const sekolah = require('./routes/sekolah');
const allQueryRoute = require('./routes/allQueryRoute');
// admin import
const adminTadika = require('./routes/adminTadika');

const authCheck = require('./middlewares/authCheck');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Database
const connectDB = require('./database/connect');

// Middlewares
app.use(express.json());
app.use(express.static('./public'));
// user route
app.use('/api/v1/auth', authLogin);
app.use('/api/v1/dashboard', authCheck, dashboard);
app.use('/api/v1/tadika', authCheck, tadika);
app.use('/api/v1/sekolah', authCheck, sekolah);
app.use('/api/v1/query', authCheck, allQueryRoute);
// admin route
app.use('/api/v1/admin/tadika', authCheck, adminTadika);
// error handler & not found
app.use(errorHandler);
// app.use(notFound);

// Server
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
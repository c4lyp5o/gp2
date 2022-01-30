require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const authLogin = require('./routes/authLogin');

const tadika = require('./routes/tadika');
const sekolah = require('./routes/sekolah');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Database
const connectDB = require('./database/connect');
// ---------------------------------------------

// Middlewares
app.use(express.json());
app.use(express.static('./public'));
app.use('/api/v1/auth', authLogin);
app.use('/api/v1/tadika', tadika);
app.use('/api/v1/sekolah', sekolah);
app.use(errorHandler);
app.use(notFound);
// ---------------------------------------------

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
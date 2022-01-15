const express = require('express');
const app = express();

app.use(express.static('./public'));

app.all('*', (req, res) => {
    res.status(404).send('Error 404 : Page not found');
});

const port = 3000;

app.listen(port, console.log(`Server is listening at port : ${port}`));
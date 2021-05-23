
const express = require('express');
const path = require('path');

const port = 3000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    res.render('home')
});


app.listen(port, () => {
    console.log('Todo app up and running on ' + port + '.');
});


const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    const welcomeTitle = "Welcome to my ToDo List";
    const timeNow = new Date();

    res.render('list', {
        welcomeTitle: welcomeTitle,
        timeNow: timeNow,
    });
});


app.listen(port, () => {
    console.log('Todo app up and running on ' + port + '.');
});

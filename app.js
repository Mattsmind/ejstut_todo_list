
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.urlencoded({extended: true}));

var items = [];

app.get('/', (req, res) => {

    const today = new Date();

    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };

    var day = today.toLocaleDateString('en-US', options);

    res.render('list', {
        currentDate: day,
        items: items,
    });
});

app.post('/', (req, res) => {
    items.push(req.body.newItem);

    res.redirect('/');
});

app.listen(port, () => {
    console.log('Todo app up and running on ' + port + '.');
});

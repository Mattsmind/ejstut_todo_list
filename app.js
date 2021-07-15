
const express = require('express');
const path = require('path');
const date = require(path.join(__dirname + '/modules', 'date.js'));

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.urlencoded({extended: true}));

const items = [];
const workItems = [];

app.get('/', (req, res) => {

    const day = date.getDate();

    res.render('list', {
        list: '/',
        listTitle: day,
        items: items,
    });
});

app.get('/work', (req, res) => {
    res.render('list', {
        list: '/work',
        listTitle: 'Work List',
        items: workItems,
    });
});

app.post('/', (req, res) => {
    items.push(req.body.newItem);
    res.redirect('/');
});

app.post('/work', (req, res) => {
    workItems.push(req.body.newItem);
    res.redirect('/work');
}); 

app.listen(port, () => {
    console.log('Todo app up and running on ' + port + '.');
});

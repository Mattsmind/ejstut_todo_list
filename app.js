
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

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
    });
});

app.post('/', (req, res) => {
    console.log(req.body.newItem);

    res.send("<h1>SUCCESS!</h1>");
});

app.listen(port, () => {
    console.log('Todo app up and running on ' + port + '.');
});

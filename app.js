
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(path.join(__dirname + '/modules', 'date.js'));

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.urlencoded({extended: true}));

const uri = 'mongodb+srv://mrmattdbadmin:1qazxsw23edcvfr4@cluster0.2ct3s.mongodb.net/todolistDB';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model('Item', itemsSchema);

/*-- DEFAULT ITEMS ------------------------------------------------------------------------------------------*/

const item1 = new Item({
    name: 'Welcome to the todo List!'
});

const item2 = new Item({
    name: 'Fill in the field below and hit the "Add Item" button.'
});

const item3 = new Item({
    name: '<---- Click this to delete an item.'
});

const defaultItems = [item1, item2, item3];

/*-- END DEFAULT ITEMS --------------------------------------------------------------------------------------*/

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {

    const day = date.getDate();

    Item.find({}, (err, items) => {

        if (err) {
            console.log('DATABSE LOOKUP ERROR::: %s', err);
        } else if (items.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log('INSERT ERROR::: %s', err);                     
                } else {
                    console.log('Database populated with default items.');      
                    res.redirect('/');
                }
            });
        } else {
            res.render('list', {
                listTitle: day,
                items: items,
            });
        }
    });
});

app.get('/:listTitle', (req, res) => {
    
    const listTitle = _.capitalize(req.params.listTitle);

    List.findOne({ name: listTitle }, (err, result) => {
        if (!err) {
            if (!result) {
                const list = new List({
                    name: listTitle,
                    items: defaultItems
                });

                list.save();
                
                res.redirect('/' + listTitle);

            } else {
                res.render('list', {
                    listTitle: result.name,
                    items: result.items
                })
            }
        } else {
            console.log('LIST ERROR::::: %s',err);
        }
    });
});

app.post('/', (req, res) => {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item({
        name: itemName
    });

    if (listName === date.getDate()) {
        newItem.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, result) => {
            if (!err) {
                result.items.push(newItem);
                result.save();
                res.redirect('/' + listName);
            } else {
                console.log('ERROR LOCATING LIST::::: %s', err);
            }
        });
    }
});

app.post('/delete', (req, res) => {

    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === date.getDate()) {
        Item.findByIdAndRemove( itemId, err => {
            if (!err) {
                console.log('Deleted Entry: _id::::: %s', itemId);
                res.redirect('/');
            } else {
                console.log('DELETION ERROR::::: %s', err);
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemId } } }, (err, result) => {
            if (!err) {
                console.log('Deleted Entry: %s : _id:: %s', listName, itemId);
                res.redirect('/' + listName);
            } else {
                console.log('UPDATE ERROR::::: %s', err);
            }
        });
    }
});

app.listen(port, () => {
    console.log('Todo app up and running on port %s.', port);
});

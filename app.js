const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const _ = require('lodash');

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("static"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useUnifiedTopology: true, useNewUrlParser: true });

const item = mongoose.Schema({
    itemName: String
});

const Item = mongoose.model("Item",item);

const itemOne = new Item(
    {
        itemName: 'Welcome to TODO List!!'
    });

const itemTwo = new Item(
    {
        itemName: 'Press + to add now list'
    });

const itemThree = new Item(
    {
        itemName: '<----Click to check & Click to delete----> '
    });

const defaultItems = [itemOne,itemTwo,itemThree];

const listSchema = mongoose.Schema({
    name: String,
    items: [item]
});

const List = mongoose.model("List",listSchema);


app.get('/',(req,res) => {
    let currentDate = date.getDate();
    Item.find(function(error,items){
        if(items.length === 0){
            Item.insertMany(defaultItems,(e) => {
                if(e){
                    console.log(e);
                }else{
                    console.log("added");
                }
            });
            res.redirect('/');
        }else{
            if(error){
                console.log(items);
            } else{
                res.render('list',{listTitle: currentDate,newItems: items});
            }
        }
    });
});

app.post('/',(req,res) => {
    const itemname = req.body.task;  
    const category = req.body.button;
    const item = new Item({
        itemName: itemname
    });

        if(category === date.getDate()){
            if(itemname !== '')
            {
                item.save();
            }
            res.redirect('/');            
        } else{
            List.findOne({name: category},(e,list) => {
                if(e){
                    console.log((e));
                } else{
                    if(itemname !== '')
                    {
                        list.items.push(item);
                        list.save();
                    }
                    res.redirect('/' + category);
                }
            });
        }
    
});

app.post('/delete',(req,res) => {
    const index = req.body.index;
    const category = req.body.buttonD;
    if(category === date.getDate()){
        Item.findByIdAndDelete(index,(e,result) => {
            if(e){
                console.log(e);
            } else{
                console.log("Successfully deleted!!");
            }
        });
        res.redirect('/');
    } else{
        List.findOneAndUpdate({name: category},{$pull: {items: {_id: index}}},(e,result) => {
            if(e){
                console.log(e);
            }else{
                console.log("Successfully deleted");
                res.redirect('/' + category);
            }
        });
    }
    
});

app.get("/:customListName",(req,res) => {
    const category = _.capitalize(req.params.customListName);
    
    List.findOne({name: category},(e,lists) => {
        if(e){
            console.log(e);
        } else{
            if(!lists){
                const list = new List({
                    name: category,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + category);
            }
            else{
                res.render('list',{listTitle: lists.name,newItems: lists.items});
            }
        }
    });

});





app.listen(3000,(req,res) => {
    console.log('Application running on port 3000');
});
//jshint esversion:6

const express = require("express");//importing express 
const bodyparser = require("body-parser");//importing body-parser
const mongoose = require("mongoose");//importing mongoose
const app = express();//creating express app 
app.set('view engine', 'ejs');//setting up template engine i.e 'EJS'
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('views'));

// connecting to database.....
mongoose.connect("mongodb://localhost:27017/List", ({ useNewUrlParser: true }));
//adding schema for database..
let schema = mongoose.Schema({
    Item: String,
});
//creating new model...."item"
let item = new mongoose.model("item", schema);
//adding default data to database....
let item1 = new item({
    Item: "Welcome to todo list"
});
let item2 = new item({
    Item: "click + to add new items",
});
let item3 = new item({
    Item: "<-- click here to remove items",
});

//handling request for home route
let dataitem = [item1, item2, item3];
app.get("/", function (req, res) {
    let option = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };
    let day = new Date();
    let cDay = day.toLocaleDateString('en-US', option);//created a date of 'Today'
    item.find({}, function (err, founditems) {

        if (founditems.length === 0) {
            item.insertMany(dataitem, function (err) {
                if (err) { console.log(err); }
                else {
                    console.log("we are done with adding default  data ");
                }
            });
            res.redirect('/');
        } else {
            res.render('index', { item: cDay, listitem: founditems });//rendering a html 
        }
    });
});

//handling post request  for home route
app.post("/", function (req, res) {
    //adding new entries to database
    let temp = req.body.item;
    let newItem = new item({
        Item: temp,
    });
    newItem.save();
    res.redirect("/");
});
//creating a delete route to delete data frome database
app.post('/delete', function (req, res) {
    let check = req.body.checkbox;
    item.findByIdAndRemove(check, function (err) {
        console.log(err);
    });
    res.redirect('/');
});

//creating a port for listening our app
app.listen("3000", function () {
    console.log("server stareted @http://localhost:3000");
});

//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");
const openssl = require('openssl-nodejs');

mongoose.connect('mongodb://localhost:27017/secretdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
    email: String, // String is shorthand for {type: String}
    password: String
});

var secret = process.env.SECRET;
userSchema.plugin(encrypt, {
    secret: secret,
    excludeFromEncryption: ['email']
});



// to use the user schema we create a  model 
const User = mongoose.model('User', userSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bParser.urlencoded({
    extended: true
}));
app.get("/", function (req, res) {
    res.render("home");
})
app.get("/register", function (req, res) {
    res.render("register");
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/secrets", function (req, res) {
    res.render("secrets");
})
app.post("/register", function (req, res) {
    console.log(req.body.email, req.body.password)
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    })
    newUser.save(function () {
        if (!err) {
            res.render("/secrets")
        }
    });
})
app.listen(3000, function () {
    console.log("server started");
})
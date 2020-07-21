//REQUIRING PACKAGES, MODULES AND OTHER EXTERNAL FILES
var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  path = require('path');


//SETTING UP app FOR USING EXPRESS
var app = express();


//DATABASE CONNECTIONS
// mongoose.connect('mongodb://localhost:27017/CARE_DB', {useUnifiedTopology: true,useNewUrlParser: true});
mongoose.connect('mongodb+srv://shaktimaan:Mridul%23123@cluster0.4gzmr.mongodb.net/Jhansi?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("We are connected to MongoDB");
});


//TEMPLATE ENGINE
app.set("view engine", "ejs");


//SERVING THE ASSETS DIRECTORY
app.use('/assets', express.static('assets'));
//app.use(express.static(__dirname + "/public"));


//BODY-PARSER SETUPS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// REQUIRING SCHEMA MODELS
var Child = require("./models/child");
var Cci = require("./models/cci2");


//REQUIRING ROUTES
var basicRoutes = require("./routes/index"),
  cwcRoutes = require("./routes/cwcRoutes"),
  cciRoutes = require("./routes/cciRoutes");
  loginRoutes = require("./routes/loginRoutes");




//USING ROUTES
app.use(basicRoutes);
app.use(cwcRoutes);
app.use(cciRoutes);
app.use(loginRoutes);




app.get('/newAttendance', function(req, res){
  res.render('newattendance.ejs');
});



app.get('/loginAdmin', function(req, res){
  res.render('login/loginAdmin.ejs');
});


app.get('/cwcEmployeeReg', function(req, res){
  res.render('form/cwcEmployeeReg.ejs');
});

///for testing only
app.post('/updatingField', function(req, res){
  Child.updateMany({cci_name: "St.Judes"},  { $set: { number: 1}},{new:true}).then((result, err) => {
    return res.status(200).json({ data: result, message:"Value Updated" });
})
});





//LISTENING ON PORT 3000
app.listen(3000, function () {
  console.log("Server has started.");
});
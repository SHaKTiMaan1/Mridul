const e = require("express");

var express = require("express"),
  router = express.Router(),
  Child = require("../models/child"),
  Cci = require("../models/cci2.js");



//this is post request of the Child Registration Form
router.post('/addChild', function (req, res) {

  var C_Id = (req.body.fname + req.body.gender);
  var childId = "";

  dateEntered = "";
  dateSelected = req.body.reg_date;
  // console.log(typeof(req.body.reg_date));
  yyyy = dateSelected.substring(0,4);
  mm = dateSelected.substring(5,7);
  dd =dateSelected.substring(8,10);
   
  dateEntered = dd + '-' +mm + '-' +yyyy ;
  console.log(dateEntered);
  //First get te strength of CCI.
  Cci.findOne({ cci_name: req.body.cci_name }, 'cci_id strength', function (err, CciFound) {
    if (err) {
      console.log(err);
    }
    else {
      // console.log(CciFound);

      let strength = CciFound.strength;// strength means the number admiitted till now
      strength++;// incementing by 1 to get new number to append at last in ChildId
      let rollNo = strength.toString();//cnverting number to string

      childId = C_Id.concat(rollNo);
      let prefix = CciFound.cci_id;
      childId = prefix.concat(childId);//Finally The Child Id is conactinaton of CCiId +Firstname of child + Its gender+ and at last the its serial number for cci.



      Child.create(
        {
          fname: req.body.fname,
          lname: req.body.lname,
          C_Id: childId,
          number: rollNo,
          age: req.body.age,
          cci_name: req.body.cci_name,
          cci_id: prefix,
          reg_date: dateEntered,// Date made to String
          gender: req.body.gender,
          witness: req.body.witness
        },

        function (err, child) {
          if (err) { console.log(err); }
          else {
            // console.log(child);// This prints the the whoole info filled in form in Terminal.
            let cciname = req.body.cci_name;
            res.redirect('/registered/' + childId + '/' + cciname);// Here we are passing the ChildId in the request body and in above ->(**)  we will do req.body.params to get that name and print in the success ejs page.
          }

        });

        
    }
  // This code increment the strength field of the Cci in which child is registered by 1 .
    Cci.findOneAndUpdate({cci_name: req.body.cci_name},{$inc:{strength: 1}},{new: true}, function(err, result){
      if(err){
        console.log(err);
      }
      else{
        console.log(result);
      }
    });

  });



 
});


//This Get request for Child Registration form.
router.get('/addChild/:district/:cwcOfficialName', function (req, res) {

  Cci.find({"cci_address.district": req.params.district}, function (err, allCci) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("childReg.ejs", { district: req.params.district, cci: allCci, cwcOfficialName: req.params.cwcOfficialName });
    }
  });

});



//Eligibility Pool of District
router.get('/new', function (req, res) {
  res.render("table.ejs");
});

//Get request for sucess page when child gets registered
//  this is (**)
router.get('/registered/:id/:name', function (req, res) {
  res.render("success.ejs", {
    cciname: req.params.name,
    C_Id: req.params.id
  });
});





//NOT WORKING NEED CHANGES...B.COZ OF DATEFORMAT CHANGED TO STRING.
//Eligibility Pool route/
//This need a change in code as Date format is changed.

router.get('/details', function (req, res) {
  // var date=  new Date( parseInt((new Date().getTime - 172800000),10));
  //in below,   logic is to get those values which are older than three months, $lt --> less than.
  //new Date().getTime() --> this gives the time elapsed in ms from a date (a specific date of mongoDB ) and 17280000000000 is 3 months in milliseconds. then this difference is converted into  date format by new Date(____).
  Child.find({ reg_date: { $lt: new Date(new Date().getTime() - 7889400000) } }, function (err, allChild) {
    if (err) {
      console.log(err);
    } else {
      //  res.set('Content-Type', 'text/html');
      //  console.log(date.toString());
      console.log(allChild);
      res.render("table.ejs", { Child: allChild });
    }
  });
});



module.exports = router;
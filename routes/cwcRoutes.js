const e = require("express");

var express = require("express"),
  router = express.Router(),
  Child = require("../models/child"),
  Cci = require("../models/cci2.js");


router.get("/cwc", function (req, res) {
  res.render("cwclanding.ejs");
});


router.get('/addChild/:district', function (req, res) {

  Cci.find({}, function (err, allCci) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("form/addChild.ejs", { district: req.params.district, cci: allCci });
    }
  });

});



//Eligibility Pool of District
router.get('/new', function (req, res) {
  res.render("table.ejs");
});


//  this is (**)
router.get('/registered/:id/:name', function (req, res) {
  res.render("success.ejs", {
    cciname: req.params.name,
    C_Id: req.params.id
  });
});



router.post('/addChild', function (req, res) {

  var C_Id = (req.body.fname + req.body.gender);
  var childId = "";

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
          reg_date: req.body.reg_date,
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



router.get('/details', function (req, res) {
  // var date=  new Date( parseInt((new Date().getTime - 172800000),10));
  //in below,   logic is to get those values which are older than three months, $lt --> less than.
  //new Date().getTime() --> this gives the time elapsed in ms from a date (a specific date of mongoDB ) and 17280000000000 is 3 months in milliseconds. then this difference is converted into  date format by new Date(____).
  Child.find({ reg_date: { $lt: new Date(new Date().getTime() - 17280000000) } }, function (err, allChild) {
    if (err) {
      console.log(err);
    } else {
      //  res.set('Content-Type', 'text/html');
      //  console.log(date.toString());
      res.render("table.ejs", { Child: allChild });
    }
  });
});




module.exports = router;



var express = require("express"),
    router = express.Router(),
    Cci = require("../models/cci2.js"), //This is the model for CCI collection. The collection where CCI Data get stored after registration.
    Child = require("../models/child.js"), // This is the model for Child collection.The collection where child Data get stored after registration. 
    attendance = require("../models/attendance.js"); //This is model for attendance collection.   

    
// CCI Registration
router.get('/addCci', function (req, res) {
  res.render("addCci.ejs");
});

// CCi details Page GET Request
router.get('/cciInfo', function (req, res) {
//Find function on Cci collection, this will return all cci in dattabase to variable allCci which wil be passed to variable "cci" in ejs template in res.render function.
    
  Cci.find({}, function (err, allCci) {
    if (err) {
      console.log(err);
    }
    else 
    {
      Child.find({}, function (err, child) {
        if(err)
        {
          console.log(error);
        }
        else
        {//After finding allchildren and passing it to variable "child" we will pass these variables to "cci" and "child" variable in cciInfi.ejs.
          res.render('cciInfo.ejs', { cci: allCci, child: child });
        }
      });
    }
  });
});



// ADD CCI POST Request

router.post('/addCci', function (req, res) {

  // variables for the logic of cci_id 
  let distname = req.body.district;
  distname = distname.substring(0, 3);
  // console.log(distname);
  let cciname = req.body.name;
  cciname = cciname.charAt(0, 3);
  let ID = "";

  // This function finds the latest cci added and return its count value which is udes to make CCI-ID

  Cci.findOne({ "cci_address.district": req.body.district }, 'cci_name count')
    .sort('-count')// this function find the ccis of particular district and give name and count of the cci of max count value.
    .exec(function (err, result) {// Saving the cci in result  variable.
      if (err) {
        console.log(err);
      }
      else {
        console.log(result.count); // This count means the number of CCI already in the district.
        let count = result.count;
        count++;
        console.log(count); 
        // Logic for the cci_id
        ID = distname.concat(cciname, count);
        console.log(ID);

        // NOw This below function is kept under the findOne function's else stetement b.coz keeping it outside creates a problem cci count calculate hota rhta h background me aur cci.create function chl jaata hai -- result ki cci ki field khaali reh jaaati hai...   :)

        // To create the document in database
        Cci.create(
          {
            count: count,
            cci_id: ID,
            cci_name: req.body.name,
            cci_HeadName: {
              fname: req.body.fname,
              lname: req.body.lname,
            },
            cci_HeadID: req.body.cci_HeadID,
            cci_address: {
              address: req.body.address,
              district: req.body.district,
              state: req.body.state
            },
            contact_Info: {
              contact_no: req.body.contact_no,
              email: req.body.email
            }
          },
          function (err, Cci) {
            if (err) {
              console.log(err);
            }
            else {
              console.log(Cci); // console.log details registered of the new CCi
            }
          }
        );

      }
      let Cciname = req.body.name;
      res.redirect('/ccisuccess/' + ID + '/' + Cciname);//Cciname and ID will be used in success page for reteiving data of a particular CCI.
    });


});


router.get('/ccisuccess/:id/:name', function (req, res) {
  res.render("cciregsuccess.ejs", { id: req.params.id, name: req.params.name}
  );
});



// I did this to create first document in attendance collection. 
// router.post('/createTest', function(req, res){
//   attendance.create(
//     {
//       C_Id: "Sample",

//       name:"Sample",
      
//       cci_id: "Sample",
      
//       Present:"true"
//     },
    
//     function(err, created){
//     if(err)
//     {
//       console.log(err);
//     }
//     else
//     {
//       console.log(created);
//     }
//   });
// });



//Roue for getting atendance of a CCI
router.get('/attendance/:cciId/:cciname', function(req, res){
  let cciid = req.params.cciId;
  // console.log(cciid);
  attendance.find({cci_id: req.params.cciId  }, function(err, allchild){
    if(err){
      console.log(err);
    }
    else
    {
      console.log(allchild);
      res.render('attendance.ejs', {child: allchild , cci_name:req.params.cciname});
    }
  });

});


router.get('/getdetails', function(req, res){
  attendance.find({}, function(err, data){
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.send(data);
    }
  });
});

module.exports = router;

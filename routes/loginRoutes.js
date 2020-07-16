const router = require('express').Router();
const bcrypt = require('bcryptjs');
// const CciEmployee   = require('../models/cciEmployee');
const CwcEmployee = require('../models/cwcEmployee');

const Cci = require('../models/cci2.js');



router.get('/login/cwcEmployee', function(req, res){
  
  res.render('login/loginCWC.ejs');
});



router.get("/testing", function(req, res){
  res.render('testing.ejs');
})


router.post("/addCwcEmployee", async (req, res) => {

 

  // //CHECKING IF USER ALREADY EXISTS
  // const emailExists = await CwcEmployee.findOne({ email: req.body.email });
  // if (emailExists) return res.status(400).send('Email Already Exists');

  // console.log("Email doesn't already exist");

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const testpass = req.body.password;
  const hashedPassword = await bcrypt.hash(testpass , salt);

  console.log("Password hashed " + hashedPassword);

  //CREATING A NEW CWC EMPLOYEE
  const employee = new CwcEmployee({
    fname: req.body.fname,
    lname: req.body.lname,
    contactNumber: req.body.contact_number,
    district: req.body.district,
    state: req.body.state,
    email: req.body.email,
    // employee_id: "098",
    password: hashedPassword
  });


  console.log("Employee Created " + employee);

  try {
    const savedEmployee = await employee.save();

    console.log("Employee saved " + savedEmployee);

    res.send("Registered");
    //this below post request is to create a first sample document of count 0 so that count wla code ache se kkaam kar  paaye...
    Cci.create(
      {
        count: 0,
  
        cci_name:"Sample",
        
        cci_id: "Sample",

        cci_address : {
           
          district: req.body.district
          
        }
        
      },
      
      function(err, created){
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log(created);
      }
    });
  } catch (err) {
    console.log("We got some error");
    res.send("There was error" + err);
  }
});




router.post("/login/cwcEmployee", async (req, res) => {


  //CHECKING IF USER ALREADY EXISTS
  const employee = await CwcEmployee.findOne({ email: req.body.email });
  if (!employee) res.send("Employee doesn't exist");

  console.log('Found Employee ' + employee);
  //CHECKING IF PASSWORD IS CORRECT
  console.log(bcrypt.hash(req.body.password, bcrypt.genSalt(10)));

  const isPasswordValid = await bcrypt.compare(req.body.password, employee.password);

  console.log("isPasswordValid : " + isPasswordValid);
  if (isPasswordValid) {
    res.render("cwclanding.ejs", { cwcOfficial: employee });
  } else {
    res.send("Wrong Password !!");
  }
});




module.exports = router;
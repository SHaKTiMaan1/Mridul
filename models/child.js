var mongoose = require("mongoose");

var ChildSchema = new mongoose.Schema({
    fname        : String,
    lname        : String,
    C_Id        : String, //ChildId
    number       : Number,// This number shows the nth child in CCi. Serial number of child admitted to this cci.
    age         : Number,
    dob         : {type: Date },// When Child is registered again after investigation is done.
    cci_name    : String,
    cci_id      : String,
    status      : String,// O, A, S
    guardian_details : {
        Guardian_1 : {
            name: String,
            age: Number
        }, 
        Guardian_2 : {
            name: String,
            age: Number
        } 
    },

    reg_date    : String,//date when found and registered for first time.
    gender      : String,
    witness     : String// CWC Official Witness ID
});

module.exports = mongoose.model("Child", ChildSchema);


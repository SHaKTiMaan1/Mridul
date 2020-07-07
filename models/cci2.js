var mongoose = require("mongoose");

var CciSchema = new mongoose.Schema({
    count: Number,
    cci_name: String,
    cci_id: String,
    cci_HeadName:{
    fname    : String,
    lname    : String,
    },
    cci_HeadID: String,
    cci_address : {
      address : String, 
      district: String,
      state: String
    },
    contact_Info: {
      contact_no :String,
      email: String
    }

    
});

module.exports = mongoose.model("Cci", CciSchema);
var mongoose = require("mongoose");

var CciSchema = new mongoose.Schema({
    count: Number,
    cci_name: String,
    cci_id: String,
    strength: Number,
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
    },
    attendance:[
      {
        date : {
            type : String
        },
        data:[{
            C_Id : {
                type : String
            },
            firstName  : {
                type        : String,
            },
            middleName : {
                type        : String
            },
            lastName   : {
                type        : String
            },
            present : {
                type : Boolean
            }
        }]
    }
    ]

    
});

module.exports = mongoose.model("Cci", CciSchema);
var mongoose = require("mongoose");

var attendanceSchema = new mongoose.Schema({
  C_Id: String,

name:String,

cci_id:String,

Present: Boolean

});

module.exports = mongoose.model("attendance", attendanceSchema);
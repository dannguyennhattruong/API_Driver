const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Use of Date.now() function 
var d = Date(Date.now()); 
  
// Converting the number of millisecond in date string 
a = d.toString()

const TripSchema = new Schema({
  PassengerId: {
    type: String,
    required: true
  },
  DriverId: {
    type: String,
    required: true
  },
  Pick_up: {
    type: Boolean,
    default: false
  },
  Drop_off: {
    type: Boolean,
    default: false
  },
  Distance: {
    type: Number,
    default: 1
  },
  Price: {
    type: Number,
    required: true,
    default: 5000
  },
  TimeStart : {
      type:Date,
      default :Date.now
  },
  TimeEnd : {
      type : Date

  }
});

const Trip = mongoose.model("Trip", TripSchema);
module.exports = Trip;

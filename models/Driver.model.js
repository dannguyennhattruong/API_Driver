const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const JWT_KEY = "WinterIsComingGOT2019";
//--------------------------------------------------------------------------------------

const driverSchema = new Schema({
  Fullname: String,
  Age: Number,
  School: String,
  TripId : String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});
//--------------------------------------------------------------------------------------

driverSchema.pre("save", async function(next) {
  // Hash the password before saving the user model
  const driver = this;
  if (driver.isModified("password")) {
    driver.password = await bcrypt.hash(driver.password, 8);
  }
  next();
});
//--------------------------------------------------------------------------------------

driverSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const driver = this;
  const token = jwt.sign({ _id: driver._id }, JWT_KEY);
  driver.tokens = driver.tokens.concat({ token });
  // await driver.save()
  // return token
};
//--------------------------------------------------------------------------------------

driverSchema.statics.findByCredentials = async (email, password) => {
  // console.log({email,password})
  // Search for a user by email and password.
  const driver = await Driver.findOne({ email });
  // console.log(driver)
  if (!driver) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, driver.password);
  console.log(isPasswordMatch);
  if (!isPasswordMatch) {
    // throw new Error({ error: 'Invalid login credentials' })
    return !driver;
  }
  return driver;
};
//--------------------------------------------------------------------------------------

driverSchema.set("toJSON", { virtuals: true });
//--------------------------------------------------------------------------------------

const Driver = mongoose.model("Driver", driverSchema);
module.exports = Driver;

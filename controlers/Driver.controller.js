const Driver = require("../models/Driver.model.js");
const Trip = require("../models/Trip.model");
// const jwt = require("jsonwebtoken");
//-----------------------------------------------------------------------

//Create new driver
exports.CreateDriver = async (req, res) => {
  // Create a new user
  try {
    const driver = new Driver(
      // {Fullname: req.body.Fullname || "NoName",
      // Age: req.body.Age,
      // School: req.body.School,
      // email : req.body.email,
      // password : req.body.password}
      req.body
    );

    const token = await driver.generateAuthToken();
    await driver.save();
    console.log(token);
    res.status(201).send({ driver, token });
  } catch (error) {
    res.status(400).send(error);
  }
};
//------------------------------------------------------------------------

//Find 1 driver by driver's id
exports.findOne = (req, res) => {
  Driver.findById(req.params.id, (err, doc) => {
    if (!err) res.json(doc);
    else res.send(err);
  });
};
//------------------------------------------------------------------------

//Find all drivers in db
exports.findAll = (req, res) => {
  Driver.find({}, (err, doc) => {
    !err ? res.send(JSON.stringify(doc, "/t", 4)) : res.send(err);
    // console.log(JSON.stringify(doc, "/t", 4));
  });
};
//------------------------------------------------------------------------

//Update 1 driver by driver's id
exports.UpdateDriver = (req, res) => {
  if (!req.body.Fullname && !req.body.Age && !req.body.School) {
    return res.status(400).send({
      message: "Driver content can not be empty"
    });
  }

  Driver.findByIdAndUpdate(
    req.params.id,
    {
      Fullname: req.body.Fullname || "NoName",
      Age: req.body.Age,
      School: req.body.School
    },
    { new: true },
    (err, docc) => {
      if (!err) res.json(docc);
      else res.send(err);
    }
  );
};
//------------------------------------------------------------------------

//Destroy 1 driver by driver's id
exports.RemoveDriver = (req, res) => {
  Driver.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err)
      res.send({
        message: `${req.params.id} was deleted from db successfully!`
      });
    else res.send(err);
  });
};
//------------------------------------------------------------------------

//Check driver exist
exports.isExist = (req, res) => {
  Driver.findById(req.params.id, (err, doc) => {
    if (!err) res.send({ exist: true, Info: doc });
    else res.send({ exist: false });
  });
};
//------------------------------------------------------------------------

//log user info by name
exports.findByName = (req, res) => {
  console.log(req.params.name);
  Driver.find({ Fullname: req.params.name }, (err, doc) => {
    !err
      ? res.json(doc)
      : res.send({ message: `${req.params.name} is not exis` });
  });
};
//------------------------------------------------------------------------

//log users info by school
exports.findBySchool = (req, res) => {
  Driver.find({ School: req.params.school }, (err, doc) => {
    !err ? res.json(doc) : res.send({ message: "error" });
  });
};
//-------------------------------------------------------------------------

//log driver & token while driver is loging
exports.getDriverLogin = async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;

    const driver = await Driver.findByCredentials(email, password);
    if (!driver) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await driver.generateAuthToken();
    res.send({ driver, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

//get History trip

exports.getHistoryTrip = (req, res) => {
  // Use of Date.now() function
  var d = Date(Date.now());

  // Converting the number of millisecond in date string
  a = d.toString();
  const id_driver = req.params.id;
  console.log(id_driver);
  const trip = Trip.find({ DriverId: id_driver }, (err, doc) => {
    if (!doc.Drop_off) doc.Drop_off = true;

    if (!err) res.json(doc);
    else res.send(err);
  });
};

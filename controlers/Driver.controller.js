const Driver = require("../models/Driver.model.js");
const Trip = require("../models/Trip.model");

const jwt = require('jsonwebtoken');
const secret = 'dannguyennhattruong2019'
const bcrypt = require("bcryptjs");
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

    req.body
    ,
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
    // console.log(req.body);

    const driver = await Driver.findByCredentials(email, password);
    // console.log(driver)
    if (!driver) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await driver.generateAuthToken();
    res.send({ driver, token });
    // console.log(driver);
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

exports.getDriverLogined = (req, res) => {
  Driver.find({}, (err, doc) => {
    if (!err) {
      let driver = doc;
      let newArr = [];
      for (let i in driver) {
        console.log(driver[i].tokens[0] === undefined);
        if (driver[i].tokens[0] !== undefined) {
          newArr.push(driver[i]);
        }
      }
      // console.log(newArr);
      res.send(JSON.stringify(newArr));
    } else res.send(err);
  });
  // const keys = Object.keys(driver)
};

exports.driverLogout = async (req, res) => {
  try {
    req.driver.tokens = req.driver.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.driver.save();
    res.send(req.driver);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.logoutAllDrivers = async (req, res) => {
  try {
    req.driver.tokens.splice(0, req.driver.tokens.length);
    await req.driver.save();
    res.send(req.driver);
  } catch (error) {
    res.status(500).send(error);
  }

}

exports.forgotPassword = (req, res) => {
  res.send('<form action="/passwordreset" method="POST">' +
    '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
    '<input type="submit" value="Reset Password" />' +
    '</form>');
}


exports.passwordReset = (req, res) => {
  if (req.body.email !== undefined) {
    var emailAddress = req.body.email;
    // console.log('email '+emailAddress)

    // TODO: Using email, find user from your database.
    Driver.find({ email: emailAddress }, (err, doc) => {
      var payload = {
        id: doc[0].id,        // User ID from database
        email: emailAddress
      };
      console.log('/passwordreset : method : Post : payload' + payload)

      // TODO: Make this a one-time-use token by using the user's
      // current password hash from the database, and combine it
      // with the user's created date to make a very unique secret key!
      // For example:
      // var secret = user.password + ‘-' + user.created.getTime();
      var secret = 'WinterIsComingGOT2019';

      var token = jwt.sign(payload, secret);
      console.log('/passwordreset : method : Post' + token)

      // TODO: Send email containing link to reset password.
      // In our case, will just return a link to click.
      res.send('<p>Are you ' + doc[0].Fullname + '? </p><br/><a href="/resetpassword/' + payload.id + '/' + token + '">Reset password  </a>');
    })

  } else {
    res.send('Email address is missing.');
  }
}

exports.passwordSubmit = (req, res) => {
  // TODO: Fetch user from database using
  // req.params.id
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combine it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();
  var secret = 'WinterIsComingGOT2019';
  var payload = jwt.decode(req.params.token, secret);
  console.log('/resetpassword/:id/:token method : get: ' + payload, req.params.token)

  // TODO: Gracefully handle decoding issues.
  // Create form to reset password.
  res.send('<form action="/resetpassword" method="POST">' +
    '<input type="hidden" name="id" value="' + payload.id + '" />' +
    '<input type="hidden" name="token" value="' + req.params.token + '" />' +
    '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
    '<input type="submit" value="Reset Password" />' +
    '</form>');
}

exports.resetPwdResult = async (req, res) => {
  // TODO: Fetch user from database using
  // req.body.id
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combining it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();
  var secret = 'WinterIsComingGOT2019';
  console.log(req.body.token)

  var payload = jwt.decode(req.body.token, secret);
  console.log(payload)

  // TODO: Gracefully handle decoding issues.
  // TODO: Hash password from
  // req.body.password
  const password = await bcrypt.hash(req.body.password, 8);

  Driver.findByIdAndUpdate(payload.id, { password: password }, { new: true }, (err, doc) => {
    console.log(doc);
    res.send('Your password has been successfully changed. ' + doc);
  })

}
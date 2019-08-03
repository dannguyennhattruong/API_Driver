module.exports = app => {
  const auth = require("../middleware/auth");
  // const express = require('express');
  // const router = express.Router()
  const driver = require("../controlers/Driver.controller.js");
  const Driver = require('../models/Driver.model')
  const trip = require("../controlers/Trip.controller");
  const jwt = require('jsonwebtoken')
  //----------------------------------------------------------------------------

  // Create a new Driver
  app.post("/api/drivers", driver.CreateDriver);
  //----------------------------------------------------------------------------

  // Retrieve all Drivers
  app.get("/api/drivers", driver.findAll);
  //----------------------------------------------------------------------------

  //Retrieve a single driver with driverId
  app.get("/api/drivers/:id", driver.findOne);
  //----------------------------------------------------------------------------

  // Update a Driver with Id
  app.put("/api/drivers/:id", driver.UpdateDriver);
  //----------------------------------------------------------------------------

  // Delete a Driver with Id
  app.delete("/api/drivers/:id", driver.RemoveDriver);
  //----------------------------------------------------------------------------

  //Check Existence's driver in db
  app.get("/api/drivers/:id/exist", driver.isExist);
  //----------------------------------------------------------------------------

  //Search 1 or more drivers by name
  app.get("/api/drivers/SearchByname/:name", driver.findByName);
  //----------------------------------------------------------------------------

  //Search drivers by Schoolname
  app.get("/api/drivers/SearchBySchool/:school", driver.findBySchool);
  //----------------------------------------------------------------------------

  //Log user login into system
  app.post("/api/drivers/login", driver.getDriverLogin);
  //----------------------------------------------------------------------------

  // View logged in user profile
  app.get("/api/drivers/me/profile", auth, async (req, res) => {
    res.send(req.driver);
  });
  //----------------------------------------------------------------------------

  // Log user out of the application
  app.post("/api/drivers/logout", auth, async (req, res) => {
    try {
      req.driver.tokens = req.driver.tokens.filter(token => {
        return token.token != req.token;
      });
      await req.driver.save();
      res.send(req.driver);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //----------------------------------------------------------------------------

  // Log user out of all devices
  app.post("/api/drivers/logoutall", auth, async (req, res) => {
    try {
      req.driver.tokens.splice(0, req.driver.tokens.length);
      await req.driver.save();
      res.send(req.driver);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/api/drivers/auth/getAllDriverLogin", driver.getDriverLogined);

  app.get('/forgotpassword', function (req, res) {
    res.send('<form action="/passwordreset" method="POST">' +
      '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
      '<input type="submit" value="Reset Password" />' +
      '</form>');
  });

  app.post('/resetpassword', function (req, res) {
    // TODO: Fetch user from database using
    // req.body.id
    // TODO: Decrypt one-time-use token using the user's
    // current password hash from the database and combining it
    // with the user's created date to make a very unique secret key!
    // For example,
    // var secret = user.password + ‘-' + user.created.getTime();
    var secret = 'dannguyennhattruong';

    var payload = jwt.sign(req.body.token, secret);
    console.log(payload.id)

    // TODO: Gracefully handle decoding issues.
    // TODO: Hash password from
    // req.body.password
    Driver.findByIdAndUpdate(payload.id , {password : req.body.password},{new :true},(err,doc)=> {
      console.log(doc)
    })
    res.send('Your password has been successfully changed.');
  });

  app.post('/passwordreset', function (req, res) {
    if (req.body.email !== undefined) {
      var emailAddress = req.body.email;
      console.log('email '+emailAddress)

      // TODO: Using email, find user from your database.
      Driver.find({ email: emailAddress }, (err, doc) => {
        var payload = {
          id: doc[0].id,        // User ID from database
          email: emailAddress
        };
        console.log('payload ' +payload)

        // TODO: Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + ‘-' + user.created.getTime();
        var secret = 'dannguyennhattruong';

        var token = jwt.sign(payload, secret);
        console.log(doc[0])

        // TODO: Send email containing link to reset password.
        // In our case, will just return a link to click.
        res.send('<p>Are you '+doc[0].Fullname +'? </p><br/><a href="/resetpassword/' + payload.id + '/' + token + '">Reset password</a>');
      })

    } else {
      res.send('Email address is missing.');
    }
  });

  app.get('/resetpassword/:id/:token', function (req, res) {
    // TODO: Fetch user from database using
    // req.params.id
    // TODO: Decrypt one-time-use token using the user's
    // current password hash from the database and combine it
    // with the user's created date to make a very unique secret key!
    // For example,
    // var secret = user.password + ‘-' + user.created.getTime();
    var secret = 'dannguyennhattruong';
    var payload = jwt.decode(req.params.token, secret);
    console.log(payload, req.params.token)

    // TODO: Gracefully handle decoding issues.
    // Create form to reset password.
    res.send('<form action="/resetpassword" method="POST">' +
      '<input type="hidden" name="id" value="' + payload.id + '" />' +
      '<input type="hidden" name="token" value="' + req.params.token + '" />' +
      '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
      '<input type="submit" value="Reset Password" />' +
      '</form>');
  });


  //=====================================================================

  app.get("/api/drivers/history/:id", driver.getHistoryTrip);

  app.post("/api/trips", trip.CreateTrip);

  app.get("/api/trips", trip.FindAllTrips);

  app.get("/api/trips/driver/:tripId", trip.getInfoDriver);
};
//----------------------------------------------------------------------------

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
  app.post("/api/drivers/logout", auth, driver.driverLogout);
  //----------------------------------------------------------------------------

  // Log user out of all devices
  app.post("/api/drivers/logoutall", auth, driver.logoutAllDrivers);

  app.get("/api/drivers/auth/getAllDriverLogin", driver.getDriverLogined);

  app.get('/forgotpassword', driver.forgotPassword);

  app.post('/resetpassword', driver.resetPwdResult);

  app.post('/passwordreset', driver.passwordReset);

  app.get('/resetpassword/:id/:token', driver.passwordSubmit);


  //=====================================================================

  app.get("/api/drivers/history/:id", driver.getHistoryTrip);

  app.post("/api/trips", trip.CreateTrip);

  app.get("/api/trips", trip.FindAllTrips);

  app.get("/api/trips/driver/:tripId", trip.getInfoDriver);
};
//----------------------------------------------------------------------------

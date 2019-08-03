const Trip = require("../models/Trip.model");
const Driver = require("../models/Driver.model");

exports.CreateTrip = (req, res) => {
  try {
    const trip = new Trip(req.body);
    trip.save();
    res.send(trip);
  } catch {
    throw new Error("Failed");
  }
};

exports.FindAllTrips = (req, res) => {
  Trip.find({}, (err, doc) => {
    if (!err) res.send(doc);
    else res.send(err);
  });
};

exports.getInfoDriver = (req, res) => {
  console.log(req.params.tripId);
  Trip.findById(req.params.tripId, (err, doc) => {
    if (!err) {
      const driver_id = doc.DriverId;
      Driver.findById(driver_id, (err, doc) => {
        if (!err) res.send(doc);
        else res.send(err);
      });
    } else res.send(err);
  });
};

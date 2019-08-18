//-------------------------------------------------------------------------------//
const express = require("express");

const app = express();

// const router = express.Router()

const route = require("./routes/Driver.route.js");
const serviceRoute = require('./routes/microService');

const mongoose = require("mongoose");
// const auth = require("./middleware/auth");

const bodyParser = require("body-parser");
const axios = require("axios");
//-------------------------------------------------------------------------------//

mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/exp2";
//-------------------------------------------------------------------------------//

// Connecting to the database
mongoose
  .connect(url, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000 !! :D");
  setInterval(() => {
    axios.get('http://localhost:5555/service/trip/driver/3000')
    .then(result => {
      console.log(result.data);
    })
    .catch(err => console.log(err));
  }, 10 * 1000);
});

mongoose.set("useFindAndModify", false);
//-------------------------------------------------------------------------------//

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

route(app);
serviceRoute(app);
//-------------------------------------------------------------------------------//
app.get("/drivers", (req, res) => {
  axios
    .get("http://localhost:3000/api/drivers")
    .then(function(response) {
      // handle success
      const dataAccess = response.data;
      const entries = Object.entries(dataAccess);
      let newArr = [];
      for (const [key, Driver] of entries) {
        newArr.push({ Key: key, Driver: Driver });
      }
      let string = "";
      const el = newArr.map(
        x =>
          `<Label>Full Name:<Label> ${x.Driver.Fullname}  <Label>Age:</Label> ${
            x.Driver.Age
          }  <Label>School:</Label> ${x.Driver.School}<br/>`
      );
      for (let i = 0; i < el.length; i++) {
        string += el[i];
      }
      res.send(string);
      // console.log(response);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
      console.log("done");
    });
});
// router.get('/api/drivers/me', auth, async(req, res) => {
//   // View logged in user profile
//   res.send(req.driver)
// })

//------------------------------------------------------------------------------------------------------------
// app.get('/api/drivers/:id',(req,res,next) => {
//     next()
// },driverController.findOne)

// app.post('/api/drivers', (req, res, next) => {
//     next()
// }, driverController.CreateDriver)

// app.put('/api/drivers/:id', (req, res, next) => {
//     next()
// },driverController.UpdateDriver)

// app.delete('/api/drivers/:id',(req,res,next) => {
//     next()
// },driverController.RemoveDriver)

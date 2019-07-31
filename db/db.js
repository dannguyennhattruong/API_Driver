
// module.exports = (app) => {
//     const mongoose = require('mongoose');

//     mongoose.Promise = global.Promise;



//     mongoose.set('useFindAndModify', false)

//     app.use(mongoose, (mongoose) => {
//         // Connecting to the database
//         mongoose.connect('mongodb://localhost:27017/exp2', {
//             useNewUrlParser: true
//         }).then(() => {
//             console.log("Successfully connected to the database");
//         }).catch(err => {
//             console.log('Could not connect to the database. Exiting now...', err);
//             process.exit();
//         });
//     })
// }
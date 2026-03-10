const mongoose = require('mongoose');
require("dotenv").config();

const DBConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((e) => {
        console.log(e)
    });
}
module.exports = DBConnection;
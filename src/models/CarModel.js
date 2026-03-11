const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({

  brand: String,
  model: String,
  year: Number,
  price: Number,
  mileage: Number,
  fuelType: String,
  transmission: String

}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({

  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true,
    enum: ["1st owner", "2nd owner", "3rd owner", "4th owner"]
  },
  price: {
    type: Number,
    required: true
  },
  mileage: {
    type: String,
    required: true,
    trim: true
  },
  fuelType: {
    type: String,
    required: true,
    enum: ["Petrol", "Diesel", "Electric", "CNG"]
  },
  transmission: {
    type: String,
    required: true,
    enum: ["Manual", "Automatic"]
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  image: {
    type: String,
    default: "",
    trim: true
  }

}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
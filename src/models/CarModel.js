const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: null
  },
  addedByRole: {
    type: String,
    default: ""
  },
  addedByName: {
    type: String,
    default: "",
    trim: true
  },
  addedByEmail: {
    type: String,
    default: "",
    trim: true
  },

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
    enum: ["1st owner", "2nd owner", "3rd owner", "4th owner","5th owner", "6th owner", "7th owner", "8th owner", "9th owner", "10th owner"]
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
    enum: ["Manual", "Automatic","Semi-Automatic"]
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
  },
  images: {
    type: [String],
    default: []
  }

}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
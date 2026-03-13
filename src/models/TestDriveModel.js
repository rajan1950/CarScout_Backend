const mongoose = require("mongoose");

const testDriveSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("TestDrive", testDriveSchema);
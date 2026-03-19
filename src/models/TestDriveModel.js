const mongoose = require("mongoose");

const testDriveSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
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
  },

  reminderSent: {
    type: Boolean,
    default: false
  },

  reminderSentAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("TestDrive", testDriveSchema);
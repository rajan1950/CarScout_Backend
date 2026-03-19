const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },

  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car"
  },

  rating: {
    type: Number,
    required: true
  },

  comment: {
    type: String
  } 

}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
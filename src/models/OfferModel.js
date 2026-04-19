const mongoose = require("mongoose");

const OFFER_STATUSES = ["pending", "accepted", "rejected", "countered"];

const offerSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },
    offeredPrice: {
      type: Number,
      required: true,
      min: 1
    },
    message: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: OFFER_STATUSES,
      default: "pending"
    },
    lastActionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    },
    nextActionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    }
  },
  { timestamps: true }
);

offerSchema.index({ buyerId: 1, sellerId: 1, carId: 1, status: 1 });
offerSchema.index({ nextActionBy: 1, status: 1, createdAt: -1 });

const Offer = mongoose.model("Offer", offerSchema);

module.exports = { Offer, OFFER_STATUSES };
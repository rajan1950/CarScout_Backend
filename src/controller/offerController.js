const mongoose = require("mongoose");

const { Offer } = require("../models/OfferModel");
const User = require("../models/UserModel");
const Car = require("../models/CarModel");
const { createNotification } = require("../services/NotificationService");

const UPDATE_ACTIONS = ["accept", "reject"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const offerPopulate = [
  { path: "buyerId", select: "firstname lastname email role" },
  { path: "sellerId", select: "firstname lastname email role" },
  { path: "carId" },
  { path: "lastActionBy", select: "firstname lastname email role" },
  { path: "nextActionBy", select: "firstname lastname email role" }
];

const idsEqual = (a, b) => String(a || "") === String(b || "");

const getUserDisplayName = (user) => {
  const first = String(user?.firstname || "").trim();
  const last = String(user?.lastname || "").trim();
  const full = `${first} ${last}`.trim();

  if (full) {
    return full;
  }

  return String(user?.email || "User").trim() || "User";
};

const handleServerError = (res, error, fallbackMessage) => {
  return res.status(500).json({
    message: fallbackMessage,
    error: error.message
  });
};

const createOffer = async (req, res) => {
  try {
    const { sellerId, carId, offeredPrice, message = "" } = req.body;
    const buyerId = req.user && req.user.id;
    const buyerRole = req.user && req.user.role;

    if (!buyerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (buyerRole !== "buyer") {
      return res.status(403).json({ message: "Only buyers can create offers" });
    }

    if (!carId || offeredPrice == null) {
      return res.status(400).json({
        message: "carId and offeredPrice are required"
      });
    }

    if (!isValidObjectId(carId)) {
      return res.status(400).json({ message: "Invalid carId" });
    }

    if (sellerId && !isValidObjectId(sellerId)) {
      return res.status(400).json({ message: "Invalid sellerId" });
    }

    const numericOfferedPrice = Number(offeredPrice);
    if (!Number.isFinite(numericOfferedPrice) || numericOfferedPrice <= 0) {
      return res.status(400).json({ message: "offeredPrice must be a positive number" });
    }

    const [car, buyer] = await Promise.all([
      Car.findById(carId),
      User.findById(buyerId)
    ]);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const carPrice = Number(car.price || 0);
    if (Number.isFinite(carPrice) && carPrice > 0 && numericOfferedPrice >= carPrice) {
      return res.status(400).json({
        message: "Offer price must be lower than listed car price"
      });
    }

    const carSellerId = car.sellerId || car.createdBy || null;
    let resolvedSellerId = sellerId || carSellerId || null;

    if (!resolvedSellerId && car.addedByEmail) {
      const sellerByEmail = await User.findOne({
        email: String(car.addedByEmail).trim().toLowerCase(),
        role: "seller"
      }).select("_id");

      if (sellerByEmail?._id) {
        resolvedSellerId = sellerByEmail._id;
      }
    }

    if (!resolvedSellerId) {
      return res.status(400).json({
        message: "Seller not configured for this car"
      });
    }

    if (carSellerId && sellerId && !idsEqual(carSellerId, sellerId)) {
      return res.status(400).json({
        message: "sellerId does not match this car owner"
      });
    }

    if (String(buyerId) === String(resolvedSellerId)) {
      return res.status(400).json({ message: "Buyer and seller cannot be same" });
    }

    const seller = await User.findById(resolvedSellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.role !== "seller") {
      return res.status(400).json({ message: "Provided sellerId does not belong to seller" });
    }

    const duplicateOffer = await Offer.findOne({
      buyerId,
      sellerId: resolvedSellerId,
      carId,
      status: { $in: ["pending", "countered"] }
    });

    if (duplicateOffer) {
      return res.status(409).json({
        message: "An active offer already exists for this car and seller",
        data: duplicateOffer
      });
    }

    const offer = await Offer.create({
      buyerId,
      sellerId: resolvedSellerId,
      carId,
      offeredPrice: numericOfferedPrice,
      message,
      status: "pending",
      lastActionBy: buyerId,
      nextActionBy: resolvedSellerId
    });

    await createNotification({
      recipientId: resolvedSellerId,
      type: "offer",
      title: "New offer received",
      body: `${getUserDisplayName(buyer)} offered Rs.${numericOfferedPrice.toLocaleString("en-IN")} for your listing.`,
      data: {
        offerId: offer._id,
        carId,
        actorId: buyerId,
        action: "create"
      },
      priority: "high"
    });

    const populatedOffer = await Offer.findById(offer._id).populate(offerPopulate);

    return res.status(201).json({
      message: "Offer created successfully",
      data: populatedOffer
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to create offer");
  }
};

const getOffers = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const userRole = req.user && req.user.role;
    const { type, status } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filter = {};

    if (userRole === "admin") {
      // Admins can inspect all offers.
    } else if (type === "sent") {
      filter.buyerId = userId;
    } else if (type === "received") {
      filter.sellerId = userId;
    } else if (userRole === "seller") {
      filter.sellerId = userId;
    } else {
      filter.buyerId = userId;
    }

    if (status) {
      filter.status = status;
    }

    const offers = await Offer.find(filter)
      .populate(offerPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: offers.length,
      data: offers
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to fetch offers");
  }
};

const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const userId = req.user && req.user.id;
    const userRole = req.user && req.user.role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid offer id" });
    }

    if (!UPDATE_ACTIONS.includes(action)) {
      return res.status(400).json({
        message: `action must be one of: ${UPDATE_ACTIONS.join(", ")}`
      });
    }

    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const isOfferSeller = idsEqual(offer.sellerId, userId);
    const isAdmin = userRole === "admin";

    if (!isOfferSeller && !isAdmin) {
      return res.status(403).json({
        message: "Only assigned seller can approve or reject this offer"
      });
    }

    if (offer.status === "accepted" || offer.status === "rejected") {
      return res.status(400).json({
        message: "This offer is already finalized"
      });
    }

    const actorId = userId;
    const recipientId = offer.buyerId;

    if (action === "accept") {
      offer.status = "accepted";
      offer.nextActionBy = null;
    }

    if (action === "reject") {
      offer.status = "rejected";
      offer.nextActionBy = null;
    }

    offer.lastActionBy = actorId;
    await offer.save();

    const actorUser = await User.findById(actorId).select("firstname lastname email");
    const actorName = getUserDisplayName(actorUser);

    if (action === "accept") {
      await createNotification({
        recipientId,
        type: "offer",
        title: "Offer accepted",
        body: `${actorName} accepted the offer for this car.`,
        data: {
          offerId: offer._id,
          carId: offer.carId,
          actorId,
          action
        },
        priority: "high"
      });
    }

    if (action === "reject") {
      await createNotification({
        recipientId,
        type: "offer",
        title: "Offer rejected",
        body: `${actorName} rejected the offer for this car.`,
        data: {
          offerId: offer._id,
          carId: offer.carId,
          actorId,
          action
        },
        priority: "medium"
      });
    }

    const populatedOffer = await Offer.findById(offer._id).populate(offerPopulate);

    return res.status(200).json({
      message: "Offer updated successfully",
      data: populatedOffer
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to update offer");
  }
};

module.exports = {
  createOffer,
  getOffers,
  updateOffer
};
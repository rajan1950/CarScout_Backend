const mongoose = require("mongoose");

const Wishlist = require("../models/WishlistModel");
const User = require("../models/UserModel");
const Car = require("../models/CarModel");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleServerError = (res, error, fallbackMessage) => {
  res.status(500).json({
    message: fallbackMessage,
    error: error.message
  });
};

const addToWishlist = async (req, res) => {
  try {
    const { userId, carId } = req.body;

    if (!userId || !carId) {
      return res.status(400).json({
        message: "userId and carId are required"
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(carId)) {
      return res.status(400).json({
        message: "Invalid userId or carId"
      });
    }

    const [user, car] = await Promise.all([
      User.findById(userId),
      Car.findById(carId)
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const existingItem = await Wishlist.findOne({ userId, carId });
    if (existingItem) {
      return res.status(409).json({
        message: "Car already exists in wishlist"
      });
    }

    const wishlistItem = await Wishlist.create({ userId, carId });

    const populatedItem = await Wishlist.findById(wishlistItem._id)
      .populate("userId", "firstname lastname email role")
      .populate("carId");

    return res.status(201).json({
      message: "Car added to wishlist",
      data: populatedItem
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Car already exists in wishlist"
      });
    }

    return handleServerError(res, error, "Failed to add car to wishlist");
  }
};

const getAllWishlistItems = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find()
      .populate("userId", "firstname lastname email role")
      .populate("carId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: wishlistItems.length,
      data: wishlistItems
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to fetch wishlist items");
  }
};

const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlistItems = await Wishlist.find({ userId })
      .populate("userId", "firstname lastname email role")
      .populate("carId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: wishlistItems.length,
      data: wishlistItems
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to fetch user wishlist");
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, carId } = req.body;

    if (!userId || !carId) {
      return res.status(400).json({
        message: "userId and carId are required"
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(carId)) {
      return res.status(400).json({
        message: "Invalid userId or carId"
      });
    }

    const deletedItem = await Wishlist.findOneAndDelete({ userId, carId });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Wishlist item not found"
      });
    }

    return res.status(200).json({
      message: "Car removed from wishlist"
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to remove wishlist item");
  }
};

const deleteWishlistItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid wishlist id" });
    }

    const deletedItem = await Wishlist.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    return res.status(200).json({
      message: "Wishlist item deleted"
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to delete wishlist item");
  }
};

module.exports = {
  addToWishlist,
  getAllWishlistItems,
  getUserWishlist,
  removeFromWishlist,
  deleteWishlistItemById
};
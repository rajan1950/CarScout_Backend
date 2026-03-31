const mongoose = require("mongoose");

const Booking = require("../models/BookingModel");
const User = require("../models/UserModel");
const Car = require("../models/CarModel");

const VALID_BOOKING_STATUSES = ["pending", "confirmed", "cancelled"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleServerError = (res, error, fallbackMessage) => {
  res.status(500).json({
    message: fallbackMessage,
    error: error.message
  });
};

const createBooking = async (req, res) => {
  try {
    const { userId, carId, bookingDate } = req.body;

    if (!userId || !carId || !bookingDate) {
      return res.status(400).json({
        message: "userId, carId and bookingDate are required"
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(carId)) {
      return res.status(400).json({
        message: "Invalid userId or carId"
      });
    }

    const parsedDate = new Date(bookingDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid bookingDate"
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

    const booking = await Booking.create({
      userId,
      carId,
      bookingDate: parsedDate,
      status: "pending"
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("userId", "firstname lastname email role")
      .populate("carId");

    return res.status(201).json({
      message: "Booking created successfully",
      data: populatedBooking
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to create booking");
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "firstname lastname email role")
      .populate("carId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to fetch bookings");
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ userId })
      .populate("userId", "firstname lastname email role")
      .populate("carId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to fetch user bookings");
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    if (!VALID_BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${VALID_BOOKING_STATUSES.join(", ")}`
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("userId", "firstname lastname email role")
      .populate("carId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking status updated",
      data: booking
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to update booking status");
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking deleted successfully"
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to delete booking");
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  deleteBooking
};
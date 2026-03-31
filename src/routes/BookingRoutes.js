const express = require("express");

const {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  deleteBooking
} = require("../controller/BookingController");

const router = express.Router();

router.post("/add", createBooking);
router.get("/all", getAllBookings);
router.get("/user/:userId", getUserBookings);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

module.exports = router;
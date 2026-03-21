const User = require("../models/UserModel");
const Car = require("../models/CarModel");
const Inquiry = require("../models/InquiryModel");

// GET DASHBOARD STATS
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalInquiry = await Inquiry.countDocuments();

    res.json({
      users: totalUsers,
      cars: totalCars,
      inquiries: totalInquiry
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User Deleted"
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ALL CARS
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE CAR
const deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);

    res.json({
      message: "Car Deleted"
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ALL INQUIRIES
const getAllInquiry = async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    res.json(inquiries);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  deleteUser,
  getAllCars,
  deleteCar,
  getAllInquiry
};

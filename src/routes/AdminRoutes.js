const express = require("express");

const {
  getDashboard,
  getAllUsers,
  deleteUser,
  getAllCars,
  deleteCar,
  getAllInquiry
} = require("../controller/AdminController");

const router = express.Router();

//localhost:5000/api/admin/dashboard
router.get("/dashboard", getDashboard);
//localhost:5000/api/admin/users
router.get("/users", getAllUsers);
//localhost:5000/api/admin/user/delete/:id
router.delete("/user/delete/:id", deleteUser);
//localhost:5000/api/admin/cars
router.get("/cars", getAllCars);
//localhost:5000/api/admin/car/delete/:id
router.delete("/car/delete/:id", deleteCar);
//localhost:5000/api/admin/inquiries
router.get("/inquiries", getAllInquiry);



module.exports = router;
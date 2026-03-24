const express = require("express");

const {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar
} = require("../controller/CarController");

const router = express.Router();

const upload = require("../middleware/UploadMiddleware");

router.post("/add",upload.single("image"), createCar);//localhost:4444/car/add
router.get("/all", getAllCars);//localhost:4444/car/all
router.get("/:id", getCarById);//localhost:4444/car/1
router.put("/:id", updateCar);//localhost:4444/car/1
router.delete("/:id", deleteCar);//localhost:4444/car/1

module.exports = router;
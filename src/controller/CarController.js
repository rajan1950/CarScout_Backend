const Car = require("../models/CarModel");


// CREATE CAR
const createCar = async (req, res) => {
  try {

    const car = await Car.create(req.body);

    res.status(201).json({
      message: "Car Created",
      data: car
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


// GET CAR BY ID
const getCarById = async (req, res) => {
  try {

    const car = await Car.findById(req.params.id);

    res.json(car);

  } catch (error) {
    res.status(500).json(error);
  }
};


// UPDATE CAR
const updateCar = async (req, res) => {
  try {

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(car);

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


module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar
};
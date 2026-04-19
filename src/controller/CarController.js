const Car = require("../models/CarModel");
const { uploadToCloudinary } = require("../utils/CloudinaryUtils");

const normalizeOwner = (owner) => {
  if (owner === undefined || owner === null) {
    return owner;
  }

  const ownerMap = {
    "1": "1st owner",
    "2": "2nd owner",
    "3": "3rd owner",
    "4": "4th owner",
    "1st": "1st owner",
    "2nd": "2nd owner",
    "3rd": "3rd owner",
    "4th": "4th owner",
    "1st owner": "1st owner",
    "2nd owner": "2nd owner",
    "3rd owner": "3rd owner",
    "4th owner": "4th owner"
  };

  const key = String(owner).trim().toLowerCase();
  return ownerMap[key] || owner;
};

const normalizeCarPayload = (body = {}, fileUrls = []) => ({
  sellerId: body.sellerId || body.createdBy || body.userId || null,
  createdBy: body.createdBy || body.userId || body.sellerId || null,
  addedByRole: body.addedByRole || "",
  addedByName: body.addedByName || "",
  addedByEmail: body.addedByEmail || "",
  brand: body.brand,
  model: body.model,
  city: body.city,
  year: Number(body.year),
  owner: normalizeOwner(body.owner),
  mileage: body.mileage,
  fuelType: body.fuelType,
  transmission: body.transmission,
  price: Number(body.price),
  description: body.description || "",
  image: fileUrls[0] || body.image || "",
  images: fileUrls.length ? fileUrls : (Array.isArray(body.images) ? body.images : [])
});

const validateCarPayload = (payload) => {
  const requiredFields = ["brand", "model", "city", "year", "owner", "mileage", "fuelType", "transmission", "price"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      return `${field} is required`;
    }
  }

  if (Number.isNaN(payload.year) || payload.year < 1980) {
    return "year must be a valid number";
  }

  if (Number.isNaN(payload.price) || payload.price <= 0) {
    return "price must be a valid number";
  }

  return null;
};


// CREATE CAR
const createCar = async (req, res) => {
  try {
    const imageFiles = [
      ...((req.files && req.files.image) || []),
      ...((req.files && req.files.images) || [])
    ];

    if (!imageFiles.length) {
      return res.status(400).json({
        message: "at least one image is required"
      });
    }

    const uploadedImages = await Promise.all(
      imageFiles.map((file) => uploadToCloudinary(file.buffer))
    );
    const imageUrls = uploadedImages
      .map((item) => item && item.secure_url)
      .filter(Boolean);

    if (!imageUrls.length) {
      return res.status(500).json({
        message: "failed to upload car images"
      });
    }

    // console.log("file....",req.file); // Log the uploaded file information

    const payload = normalizeCarPayload({ ...req.body }, imageUrls);
    const validationError = validateCarPayload(payload);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const car = await Car.create(payload);

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

    const payload = normalizeCarPayload(req.body);
    const validationError = validateCarPayload(payload);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
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
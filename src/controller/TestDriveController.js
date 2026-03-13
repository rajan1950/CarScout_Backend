const TestDrive = require("../models/TestDriveModel");


// CREATE TEST DRIVE
const createTestDrive = async (req, res) => {
  try {

    const testDrive = await TestDrive.create(req.body);

    res.status(201).json({
      message: "Test Drive Booked",
      data: testDrive
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


// GET ALL TEST DRIVES
const getAllTestDrives = async (req, res) => {
  try {

    const testDrives = await TestDrive.find()
      .populate("userId")
      .populate("carId");

    res.json(testDrives);

  } catch (error) {
    res.status(500).json(error);
  }
};


// GET TEST DRIVE BY ID
const getTestDriveById = async (req, res) => {
  try {

    const testDrive = await TestDrive.findById(req.params.id)
      .populate("userId")
      .populate("carId");

    res.json(testDrive);

  } catch (error) {
    res.status(500).json(error);
  }
};


// UPDATE TEST DRIVE
const updateTestDrive = async (req, res) => {
  try {

    const testDrive = await TestDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(testDrive);

  } catch (error) {
    res.status(500).json(error);
  }
};


// DELETE TEST DRIVE
const deleteTestDrive = async (req, res) => {
  try {

    await TestDrive.findByIdAndDelete(req.params.id);

    res.json({
      message: "Test Drive Deleted"
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = {
  createTestDrive,
  getAllTestDrives,
  getTestDriveById,
  updateTestDrive,
  deleteTestDrive
};
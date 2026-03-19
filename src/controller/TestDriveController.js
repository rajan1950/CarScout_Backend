const TestDrive = require("../models/TestDriveModel");
const { createNotification } = require("../services/NotificationService");


// CREATE TEST DRIVE
const createTestDrive = async (req, res) => {
  try {

    const testDrive = await TestDrive.create(req.body);

    await createNotification({
      recipientId: testDrive.userId,
      type: "test_drive",
      title: "Test drive booked",
      body: "Your test drive request has been submitted successfully.",
      data: {
        testDriveId: testDrive._id,
        carId: testDrive.carId,
        status: testDrive.status
      },
      priority: "medium",
      channel: "in_app"
    });

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

    const existingTestDrive = await TestDrive.findById(req.params.id);
    if (!existingTestDrive) {
      return res.status(404).json({
        message: "Test Drive not found"
      });
    }

    const testDrive = await TestDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (req.body.status && req.body.status !== existingTestDrive.status) {
      await createNotification({
        recipientId: testDrive.userId,
        type: "test_drive",
        title: "Test drive status updated",
        body: `Your test drive status is now ${req.body.status}.`,
        data: {
          testDriveId: testDrive._id,
          carId: testDrive.carId,
          previousStatus: existingTestDrive.status,
          currentStatus: req.body.status
        },
        priority: "high",
        channel: "in_app"
      });
    }

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
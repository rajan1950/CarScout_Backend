const TestDrive = require("../models/TestDriveModel");
const { createNotification } = require("../services/NotificationService");

const REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;
const REMINDER_POLL_INTERVAL_MS = 60 * 1000;

const shouldSkipReminderForStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return normalized === "cancelled" || normalized === "completed";
};

const triggerReminderForTestDrive = async (testDrive) => {
  await createNotification({
    recipientId: testDrive.userId,
    type: "test_drive",
    title: "Test drive reminder",
    body: "Your test drive is scheduled within the next 24 hours.",
    data: {
      testDriveId: testDrive._id,
      carId: testDrive.carId,
      date: testDrive.date,
      location: testDrive.location,
      status: testDrive.status
    },
    priority: "high",
    channel: "in_app"
  });

  testDrive.reminderSent = true;
  testDrive.reminderSentAt = new Date();
  await testDrive.save();
};

const processDueTestDriveReminders = async () => {
  const now = new Date();
  const upcomingThreshold = new Date(now.getTime() + REMINDER_WINDOW_MS);

  const dueTestDrives = await TestDrive.find({
    // Only consider test drives that haven't had a reminder sent yet
    reminderSent: { $ne: true },
    // Only consider test drives that are scheduled in the future but within the reminder window
    date: { $gt: now, $lte: upcomingThreshold }
  });

  for (const testDrive of dueTestDrives) {
    if (shouldSkipReminderForStatus(testDrive.status)) {
      continue;
    }

    await triggerReminderForTestDrive(testDrive);
  }
};

let reminderWorkerStarted = false;

const startTestDriveReminderWorker = () => {
  if (reminderWorkerStarted) {
    return;
  }

  reminderWorkerStarted = true;

  processDueTestDriveReminders().catch(() => {});

  setInterval(() => {
    processDueTestDriveReminders().catch(() => {});
  }, REMINDER_POLL_INTERVAL_MS);
};


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

    const testDriveTime = new Date(testDrive.date).getTime();
    const nowTime = Date.now();

    if (!Number.isNaN(testDriveTime) && testDriveTime > nowTime && testDriveTime - nowTime <= REMINDER_WINDOW_MS) {
      await triggerReminderForTestDrive(testDrive);
    }

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

    const updatePayload = { ...req.body };

    if (req.body.date && new Date(req.body.date).getTime() !== new Date(existingTestDrive.date).getTime()) {
      updatePayload.reminderSent = false;
      updatePayload.reminderSentAt = null;
    }

    const testDrive = await TestDrive.findByIdAndUpdate(req.params.id, updatePayload, { new: true });

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

    const updatedDateTime = new Date(testDrive.date).getTime();
    const nowTime = Date.now();

    if (
      !testDrive.reminderSent &&
      !Number.isNaN(updatedDateTime) &&
      updatedDateTime > nowTime &&
      updatedDateTime - nowTime <= REMINDER_WINDOW_MS &&
      !shouldSkipReminderForStatus(testDrive.status)
    ) {
      await triggerReminderForTestDrive(testDrive);
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
  deleteTestDrive,
  startTestDriveReminderWorker
};
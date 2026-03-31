const mongoose = require("mongoose");

const Report = require("../models/ReportModel");
const User = require("../models/UserModel");
const Car = require("../models/CarModel");

const VALID_REPORT_STATUSES = ["pending", "resolved", "rejected"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleServerError = (res, error, fallbackMessage) => {
  res.status(500).json({
    message: fallbackMessage,
    error: error.message
  });
};

const createReport = async (req, res) => {
  try {
    const { userId, carId, reason, description } = req.body;

    if (!userId || !carId || !reason) {
      return res.status(400).json({
        message: "userId, carId and reason are required"
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(carId)) {
      return res.status(400).json({
        message: "Invalid userId or carId"
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

    const report = await Report.create({
      userId,
      carId,
      reason,
      description: description || "",
      status: "pending"
    });

    const populatedReport = await Report.findById(report._id)
      .populate("userId", "firstname lastname email role")
      .populate("carId");

    return res.status(201).json({
      message: "Report submitted successfully",
      data: populatedReport
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to create report");
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("userId", "firstname lastname email role")
      .populate("carId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reports.length,
      data: reports
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to fetch reports");
  }
};

const getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reports = await Report.find({ userId })
      .populate("userId", "firstname lastname email role")
      .populate("carId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reports.length,
      data: reports
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to fetch user reports");
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    if (!VALID_REPORT_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${VALID_REPORT_STATUSES.join(", ")}`
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("userId", "firstname lastname email role")
      .populate("carId");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({
      message: "Report status updated",
      data: report
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to update report status");
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({
      message: "Report deleted successfully"
    });
  } catch (error) {
    return handleServerError(res, error, "Failed to delete report");
  }
};

module.exports = {
  createReport,
  getAllReports,
  getUserReports,
  updateReportStatus,
  deleteReport
};
const express = require("express");

const {
  createReport,
  getAllReports,
  getUserReports,
  updateReportStatus,
  deleteReport
} = require("../controller/ReportController");

const router = express.Router();

router.post("/add", createReport);
//localhost:4444/report/all
router.get("/all", getAllReports);
router.get("/user/:userId", getUserReports);
router.patch("/:id/status", updateReportStatus);
router.delete("/:id", deleteReport);

module.exports = router;
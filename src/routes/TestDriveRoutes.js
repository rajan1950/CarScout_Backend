const express = require("express");

const {
  createTestDrive,
  getAllTestDrives,
  getTestDriveById,
  updateTestDrive,
  deleteTestDrive
} = require("../controller/TestDriveController");

const router = express.Router();

router.post("/add", createTestDrive);        
router.get("/all", getAllTestDrives);        
router.get("/:id", getTestDriveById);        
router.put("/:id", updateTestDrive);         
router.delete("/:id", deleteTestDrive);      
module.exports = router;
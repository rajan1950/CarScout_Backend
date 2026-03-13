const express = require("express");

const {
  createTestDrive,
  getAllTestDrives,
  getTestDriveById,
  updateTestDrive,
  deleteTestDrive
} = require("../controller/TestDriveController");

const router = express.Router();
//localhost:5000/api/testdrives/add
router.post("/add", createTestDrive);  
//localhost:5000/api/testdrives/all      
router.get("/all", getAllTestDrives);   
//localhost:5000/api/testdrives/:id     
router.get("/:id", getTestDriveById);
//localhost:5000/api/testdrives/:id        
router.put("/:id", updateTestDrive);
//localhost:5000/api/testdrives/:id         
router.delete("/:id", deleteTestDrive);      
module.exports = router;
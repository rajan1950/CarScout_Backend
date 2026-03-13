const express = require("express");
const router = express.Router();

const { createInquiry, getAllInquiry, getInquiryById, updateInquiry, deleteInquiry } = require("../controller/InquiryConroller")
//localhost:4444/inquiry/create
router.post("/create", createInquiry);
//localhost:4444/inquiry/all
router.get("/all", getAllInquiry);
//localhost:4444/inquiry/:id
router.get("/:id", getInquiryById);
//localhost:4444/inquiry/update/:id
router.put("/update/:id", updateInquiry);
//localhost:4444/inquiry/delete/:id
router.delete("/delete/:id", deleteInquiry)

module.exports = router;
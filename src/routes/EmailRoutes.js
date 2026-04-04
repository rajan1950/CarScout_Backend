const express = require("express");
const router = express.Router();

const { sendMail } = require("../controller/EmailController");

// localhost:4444/email/send
router.post("/send", sendMail);

module.exports = router;

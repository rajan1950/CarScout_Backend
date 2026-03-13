const express = require("express");
const router = express.Router();

const {createMessage, getAllMessages} = require("../controller/MessageController")

// create message
//localhost:4444/message/create

router.post("/create", createMessage);

// get all messages
//localhost:4444/message/all
router.get("/all", getAllMessages);

module.exports = router;
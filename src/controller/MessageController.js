const Message = require("../models/MessageModel");

const createMessage = async (req, res) => {
  try {

    const message = await Message.create(req.body);

    res.status(201).json({
      message: "Message sent successfully",
      data: message
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


const getAllMessages = async (req, res) => {
  try {

    const messages = await Message.find();

    res.json(messages);

  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = {
  createMessage,
  getAllMessages
};
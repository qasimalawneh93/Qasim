const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to get conversation", error: err.message });
  }
};

module.exports = { sendMessage, getConversation };

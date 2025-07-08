const SupportTicket = require("../models/SupportTicket");

const createTicket = async (req, res) => {
  try {
    const { category, message } = req.body;
    const ticket = await SupportTicket.create({
      user: req.user.id,
      category,
      message
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to create support ticket", error: err.message });
  }
};

const getUserTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to get support tickets", error: err.message });
  }
};

module.exports = { createTicket, getUserTickets };

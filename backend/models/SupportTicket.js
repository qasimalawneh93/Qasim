const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: ["booking", "payment", "technical", "behavior"], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SupportTicket", supportTicketSchema);

const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  amount: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Earning", earningSchema);

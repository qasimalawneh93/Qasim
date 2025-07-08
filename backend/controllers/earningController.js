const Earning = require("../models/Earning");

const getEarningsByTeacher = async (req, res) => {
  try {
    const earnings = await Earning.find({ teacher: req.user.id });
    res.status(200).json(earnings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch earnings", error: err.message });
  }
};

module.exports = { getEarningsByTeacher };

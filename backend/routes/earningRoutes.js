const express = require("express");
const router = express.Router();
const { getEarningsByTeacher } = require("../controllers/earningController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getEarningsByTeacher);

module.exports = router;

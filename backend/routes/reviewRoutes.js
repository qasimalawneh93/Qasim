const express = require("express");
const router = express.Router();
const { createReview, getReviewsForTeacher } = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createReview);
router.get("/teacher/:teacherId", getReviewsForTeacher);

module.exports = router;

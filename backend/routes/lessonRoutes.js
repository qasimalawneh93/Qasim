const express = require("express");
const router = express.Router();
const { createLesson, getAllLessons, getLessonById, deleteLesson } = require("../controllers/lessonController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createLesson);
router.get("/", getAllLessons);
router.get("/:id", getLessonById);
router.delete("/:id", verifyToken, deleteLesson);

module.exports = router;

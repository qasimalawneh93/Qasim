const Lesson = require("../models/Lesson");

const createLesson = async (req, res) => {
  try {
    const { title, description, language, price, duration, availableSlots } = req.body;
    const newLesson = new Lesson({
      teacher: req.user.id,
      title,
      description,
      language,
      price,
      duration,
      availableSlots
    });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ message: "Lesson creation failed", error: err.message });
  }
};

const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate("teacher", "name email");
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Failed to get lessons", error: err.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("teacher", "name email");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Failed to get lesson", error: err.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    if (lesson.teacher.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    await lesson.remove();
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lesson", error: err.message });
  }
};

module.exports = { createLesson, getAllLessons, getLessonById, deleteLesson };

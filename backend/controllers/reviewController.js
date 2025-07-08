const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const { teacher, rating, comment } = req.body;
    const review = await Review.create({
      student: req.user.id,
      teacher,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to create review", error: err.message });
  }
};

const getReviewsForTeacher = async (req, res) => {
  try {
    const reviews = await Review.find({ teacher: req.params.teacherId }).populate("student", "name");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to get reviews", error: err.message });
  }
};

module.exports = { createReview, getReviewsForTeacher };

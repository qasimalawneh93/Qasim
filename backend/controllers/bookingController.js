const Booking = require("../models/Booking");
const Lesson = require("../models/Lesson");

const createBooking = async (req, res) => {
  try {
    const { lessonId, scheduledTime } = req.body;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const booking = new Booking({
      student: req.user.id,
      teacher: lesson.teacher,
      lesson: lesson._id,
      scheduledTime
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ student: req.user.id }, { teacher: req.user.id }]
    }).populate("lesson").populate("student", "name email").populate("teacher", "name email");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to get bookings", error: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (![booking.teacher.toString(), booking.student.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking", error: err.message });
  }
};

module.exports = { createBooking, getUserBookings, updateBookingStatus };

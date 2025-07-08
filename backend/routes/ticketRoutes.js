const express = require("express");
const router = express.Router();
const { createTicket, getUserTickets } = require("../controllers/ticketController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createTicket);
router.get("/", verifyToken, getUserTickets);

module.exports = router;

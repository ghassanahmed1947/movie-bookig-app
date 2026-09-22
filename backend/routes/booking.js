import express from "express";
import Booking from "../models/booking.js";

const router = express.Router();

// CREATE a booking
router.post("/", async (req, res) => {
  try {
    const { movie, movieTitle, showtime, customerName, contactNo, seats } = req.body;

    if (!movie || !movieTitle || !showtime || !customerName || !contactNo || !seats) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const booking = await Booking.create({
      movie,
      movieTitle,
      showtime,
      customerName,
      contactNo,
      seats,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all bookings (optional - useful for testing/admin view)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
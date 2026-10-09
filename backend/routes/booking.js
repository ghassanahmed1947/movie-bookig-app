import express from "express";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// CREATE a booking (sirf login user)
router.post("/", protect, async (req, res) => {
  try {
    const { movie, showtime, customerName, contactNo, seats } = req.body;

    if (!movie || !showtime || !customerName || !contactNo || !seats) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Movie ka naam aur poster database se lete hain, frontend par bharosa nahi
    const movieDoc = await Movie.findById(movie);
    if (!movieDoc) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const booking = await Booking.create({
      user: req.userId,
      movie: movieDoc._id,
      movieTitle: movieDoc.title,
      posterUrl: movieDoc.posterUrl,
      showtime,
      customerName,
      contactNo,
      seats: Number(seats),
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET meri bookings (sirf login user ki apni)
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET saari bookings (sirf admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CANCEL a booking (sirf wohi user jis ki booking hai)
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


export default router;
import express from "express";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";
import Location from "../models/location.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// CREATE a booking (sirf login user)
router.post("/", protect, async (req, res) => {
  try {
    const {
      movie,
      location,
      showDate,
      showTime,
      customerName,
      contactNo,
      seats,
    } = req.body;

    if (
      !movie ||
      !location ||
      !showDate ||
      !showTime ||
      !customerName ||
      !contactNo ||
      !seats
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const seatCount = Number(seats);
    if (!Number.isInteger(seatCount) || seatCount < 1) {
      return res.status(400).json({ message: "Seats must be a whole number, at least 1" });
    }

    const movieDoc = await Movie.findById(movie);
    if (!movieDoc) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Ye show sach mein admin ne is movie ke liye rakha hai ya nahi
    const showExists = movieDoc.shows.some(
      (s) => s.date === showDate && s.time === showTime
    );
    if (!showExists) {
      return res
        .status(400)
        .json({ message: "Selected show is not available for this movie" });
    }

    // Guzre hue show ki booking nahi ho sakti
    if (new Date(`${showDate}T${showTime}:00`) <= new Date()) {
      return res.status(400).json({ message: "This show has already started" });
    }

    const locationDoc = await Location.findById(location);
    if (!locationDoc) {
      return res.status(404).json({ message: "Selected cinema not found" });
    }

    const booking = await Booking.create({
      user: req.userId,
      movie: movieDoc._id,
      movieTitle: movieDoc.title,
      posterUrl: movieDoc.posterUrl,
      location: locationDoc._id,
      locationName: locationDoc.name,
      locationCity: locationDoc.city,
      locationAddress: locationDoc.address,
      locationMapUrl: locationDoc.mapUrl,
      showDate,
      showTime,
      customerName,
      contactNo,
      seats: seatCount,
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
import express from "express";
import Movie from "../models/movie.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET all movies (sab ke liye)
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single movie by ID (sab ke liye)
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ADD a movie (sirf admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, posterUrl, category, showtimes } = req.body;

    if (!title || !posterUrl) {
      return res.status(400).json({ message: "Title and poster URL are required" });
    }

    const movieData = { title, description, posterUrl, category };
    if (showtimes && showtimes.length > 0) {
      movieData.showtimes = showtimes;
    }

    const movie = await Movie.create(movieData);
    res.status(201).json(movie);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE a movie (sirf admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
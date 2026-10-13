import express from "express";
import Movie from "../models/movie.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// Shows ko saaf karta hai: format check, duplicate hatana, tarteeb dena.
// Koi show galat ho to null wapas karta hai.
const cleanShows = (shows) => {
  if (!Array.isArray(shows)) return [];

  const seen = new Set();
  const result = [];

  for (const s of shows) {
    const date = String(s?.date || "").trim();
    const time = String(s?.time || "").trim();

    if (!DATE_RE.test(date) || !TIME_RE.test(time)) return null;

    const key = `${date}T${time}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ date, time });
    }
  }

  return result.sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );
};

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
    const { title, description, posterUrl, category, shows } = req.body;

    if (!title || !posterUrl) {
      return res.status(400).json({ message: "Title and poster URL are required" });
    }

    const cleanedShows = cleanShows(shows);
    if (cleanedShows === null) {
      return res.status(400).json({ message: "One of the show dates or times is invalid" });
    }
    if (cleanedShows.length === 0) {
      return res.status(400).json({ message: "Please add at least one show (date and time)" });
    }

    const movie = await Movie.create({
      title,
      description,
      posterUrl,
      category,
      shows: cleanedShows,
    });
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
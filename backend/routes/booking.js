import express from "express";
import { query, newId, toMovie, toLocation, toBooking } from "../db.js";
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

    const movieDoc = toMovie(
      (await query("SELECT * FROM movies WHERE id = $1", [String(movie)])).rows[0]
    );
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

    const locationDoc = toLocation(
      (await query("SELECT * FROM locations WHERE id = $1", [String(location)])).rows[0]
    );
    if (!locationDoc) {
      return res.status(404).json({ message: "Selected cinema not found" });
    }

    const { rows } = await query(
      `INSERT INTO bookings (
         id, user_id, movie_id, movie_title, poster_url,
         location_id, location_name, location_city, location_address, location_map_url,
         show_date, show_time, customer_name, contact_no, seats
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        newId(), req.userId, movieDoc._id, movieDoc.title, movieDoc.posterUrl,
        locationDoc._id, locationDoc.name, locationDoc.city, locationDoc.address, locationDoc.mapUrl,
        showDate, showTime, customerName, contactNo, seatCount,
      ]
    );

    res.status(201).json(toBooking(rows[0]));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET meri bookings (sirf login user ki apni)
router.get("/my", protect, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(rows.map(toBooking));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET saari bookings (sirf admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows.map(toBooking));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CANCEL a booking (sirf wohi user jis ki booking hai)
router.delete("/:id", protect, async (req, res) => {
  try {
    const { rowCount } = await query(
      "DELETE FROM bookings WHERE id = $1 AND user_id = $2",
      [req.params.id, req.userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movie.js";
import bookingRoutes from "./routes/booking.js";
import locationRoutes from "./routes/location.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Har API request se pehle database tayyar ho
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/locations", locationRoutes);

app.get("/", (req, res) => {
  res.send("Movie Booking API is running");
});

// Vercel ke liye app export hota hai
export default app;

// Apne computer par chalane ke liye (Vercel par ye nahi chalta)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((err) => console.error("Database connection error:", err));
}

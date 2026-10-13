import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movie.js";
import bookingRoutes from "./routes/booking.js";
import locationRoutes from "./routes/location.js";
import User from "./models/user.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/locations", locationRoutes);

app.get("/", (req, res) => {
  res.send("Movie Booking API is running");
});

// .env ki email aur password se admin account banata (ya update karta) hai
const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env, admin not created");
    return;
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      {
        $set: { password: hashed, role: "admin" },
        $setOnInsert: { name: "Admin" },
      },
      { upsert: true }
    );

    console.log(`Admin account ready: ${email}`);
  } catch (err) {
    console.error("Admin setup failed:", err.message);
  }
};

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await ensureAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
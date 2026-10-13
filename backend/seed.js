import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/movie.js";

dotenv.config();

// Abhi khali hai. Movies ab admin panel se add hoti hain.
// Kabhi ek sath bohat si movies daalni hon to yahan likh kar `node seed.js` chalayen.
const sampleMovies = [];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected for seeding");

    if (sampleMovies.length === 0) {
      console.log("sampleMovies is empty, nothing to add.");
      process.exit();
    }

    await Movie.insertMany(sampleMovies);
    console.log(`${sampleMovies.length} movies added successfully!`);
    process.exit();
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
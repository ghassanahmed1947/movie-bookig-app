import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/movie.js";

dotenv.config();

const sampleMovies = [
  {
    title: "The Last Horizon",
    description: "A gripping sci-fi adventure across the stars.",
    posterUrl: "https://placehold.co/300x450?text=The+Last+Horizon",
    category: "Now Showing",
  },
  {
    title: "Shadows of Karachi",
    description: "A thrilling crime drama set in the streets of Karachi.",
    posterUrl: "https://placehold.co/300x450?text=Shadows+of+Karachi",
    category: "Now Showing",
  },
  {
    title: "Laugh Out Loud",
    description: "A hilarious comedy that will keep you entertained.",
    posterUrl: "https://placehold.co/300x450?text=Laugh+Out+Loud",
    category: "Now Showing",
  },
  {
    title: "Galaxy Wars: Rebirth",
    description: "The epic saga continues in this highly anticipated sequel.",
    posterUrl: "https://placehold.co/300x450?text=Galaxy+Wars",
    category: "Coming Soon",
  },
  {
    title: "The Silent Witness",
    description: "A courtroom thriller that will keep you guessing till the end.",
    posterUrl: "https://placehold.co/300x450?text=Silent+Witness",
    category: "Coming Soon",
  },
   {
    title: "The Silent Witness",
    description: "A courtroom thriller that will keep you guessing till the end.",
    posterUrl: "https://placehold.co/300x450?text=Silent+Witness",
    category: "Coming Soon",
  },
  {
    title: "Weekend Getaway",
    description: "A feel-good family movie perfect for weekend viewing.",
    posterUrl: "https://placehold.co/300x450?text=Weekend+Getaway",
    category: "Weekend",
  },
  {
    title: "Family Fun Night",
    description: "An animated adventure the whole family will enjoy.",
    posterUrl: "https://placehold.co/300x450?text=Family+Fun+Night",
    category: "Weekend",
  },
  {
    title: "Fire & Fury",
    description: "This year's most talked about action blockbuster.",
    posterUrl: "https://placehold.co/300x450?text=Fire+%26+Fury",
    category: "Hot Movies",
  },
  {
    title: "Midnight Chase",
    description: "A high-octane thriller breaking box office records.",
    posterUrl: "https://placehold.co/300x450?text=Midnight+Chase",
    category: "Hot Movies",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected for seeding");
    await Movie.deleteMany();
    await Movie.insertMany(sampleMovies);
    console.log("Sample movies added successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
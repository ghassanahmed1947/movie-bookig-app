import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/movie.js";

dotenv.config();

const sampleMovies = [
  {
    title: "Spider Man No Way Home",
    description: "A gripping sci-fi adventure across the stars.",
    posterUrl: "/images/spiderman.png",
    category: "Now Showing",
  },

  {
    title: "X MEN",
    description: "A thrilling crime drama set in the streets of Karachi.",
 posterUrl: "/images/x.men.jfif",
    category: "Now Showing",
  },
  {
    title: "Jumanji The Next Level",
    description: "A hilarious comedy that will keep you entertained.",
    posterUrl: "/images/jumanji.jfif",
    category: "Now Showing",
  },
  {
    title: "Extraction 4",
    description: "The epic saga continues in this highly anticipated sequel.",
    posterUrl: "/images/Extraction.jfif",
    category: "Coming Soon",
  },
  {
    title: "John Wick 4",
    description: "A courtroom thriller that will keep you guessing till the end.",
    posterUrl: "/images/john-wick.jfif",
    category: "Coming Soon",
  },
   {
    title: "Terminator: Dark Fate",
    description: "A courtroom thriller that will keep you guessing till the end.",
    posterUrl: "/images/Terminator.jfif",
    category: "Coming Soon",
  },
  {
    title: "Top Gun Maverick",
    description: "A feel-good family movie perfect for weekend viewing.",
    posterUrl: "/images/Top-Gun-Maverick.jfif",
    category: "Weekend",
  },
  {
    title: "Mission Impossible",
    description: "An animated adventure the whole family will enjoy.",
    posterUrl: "/images/Mission-Impossible.jfif",
    category: "Weekend",
  },
  {
    title: "Mad Max: Fury Road",
    description: "This year's most talked about action blockbuster.",
    posterUrl: "/images/Mad-Max.jfif",
    category: "Hot Movies",
  },
  {
    title: "Uncharted",
    description: "A high-octane thriller breaking box office records.",
    posterUrl: "/images/uncharted.jfif",
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
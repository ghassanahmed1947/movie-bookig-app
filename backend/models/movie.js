import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    posterUrl: { type: String },
    category: {
      type: String,
      enum: ["Now Showing", "Coming Soon", "Weekend", "Hot Movies"],
      default: "Now Showing",
    },
    showtimes: {
      type: [String],
      default: ["2:00 AM", "5:00 AM", "8:00 AM"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
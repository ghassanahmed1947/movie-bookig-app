import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm (24 ghante)
  },
  { _id: false }
);

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
    shows: { type: [showSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
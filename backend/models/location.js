import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    mapUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
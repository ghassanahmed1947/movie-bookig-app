import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    movieTitle: { type: String, required: true },
    posterUrl: { type: String },

    // Cinema ki jaankari
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    locationName: { type: String, required: true },
    locationCity: { type: String, required: true },
    locationAddress: { type: String },
    locationMapUrl: { type: String },

    showtime: { type: String, required: true },
    customerName: { type: String, required: true },
    contactNo: { type: String, required: true },
    seats: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
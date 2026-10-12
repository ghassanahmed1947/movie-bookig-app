import express from "express";
import Location from "../models/location.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Check karta hai ke link asli Google Maps ka hai ya nahi
const isValidMapUrl = (value) => {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;

    const host = url.hostname.toLowerCase();

    // Chhote share links (maps.app.goo.gl/...)
    if (host === "maps.app.goo.gl" || host === "goo.gl") return true;

    // maps.google.com/...
    if (host.startsWith("maps.google.")) return true;

    // google.com/maps/...
    if (/^(www\.)?google\./.test(host) && url.pathname.startsWith("/maps")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

// GET saari locations (sab ke liye, shehar aur naam ke hisab se sorted)
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().sort({ city: 1, name: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ADD a location (sirf admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, city, address, phone, mapUrl } = req.body;

    if (!name?.trim() || !city?.trim() || !address?.trim()) {
      return res
        .status(400)
        .json({ message: "Name, city and address are required" });
    }

    // Map link optional hai, lekin dia ho to sahi hona chahiye
    const cleanMapUrl = mapUrl?.trim() || "";
    if (cleanMapUrl && !isValidMapUrl(cleanMapUrl)) {
      return res
        .status(400)
        .json({ message: "Please paste a valid Google Maps link" });
    }

    // Ek hi shehar mein same naam ka cinema dobara na ban sake
    const exists = await Location.findOne({
      name: name.trim(),
      city: city.trim(),
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "This cinema already exists in that city" });
    }

    const location = await Location.create({
      name,
      city,
      address,
      phone,
      mapUrl: cleanMapUrl,
    });
    res.status(201).json(location);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE a location (sirf admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ message: "Location deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
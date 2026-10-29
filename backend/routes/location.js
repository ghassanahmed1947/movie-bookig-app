import express from "express";
import { query, newId, toLocation } from "../db.js";
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
    const { rows } = await query("SELECT * FROM locations ORDER BY city, name");
    res.json(rows.map(toLocation));
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
    const { rows: exists } = await query(
      "SELECT id FROM locations WHERE name = $1 AND city = $2",
      [name.trim(), city.trim()]
    );
    if (exists.length > 0) {
      return res
        .status(400)
        .json({ message: "This cinema already exists in that city" });
    }

    const { rows } = await query(
      `INSERT INTO locations (id, name, city, address, phone, map_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [newId(), name.trim(), city.trim(), address.trim(), phone?.trim() || "", cleanMapUrl]
    );
    res.status(201).json(toLocation(rows[0]));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE a location (sirf admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { rowCount } = await query("DELETE FROM locations WHERE id = $1", [req.params.id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ message: "Location deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
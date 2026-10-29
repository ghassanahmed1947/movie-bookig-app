import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, newId } from "../db.js";

const router = express.Router();

// Token banane ka helper (id aur role token ke andar rakhte hain)
const createToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// SIGNUP (hamesha normal user banata hai)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin wali email se koi signup nahi kar sakta
    if (cleanEmail === process.env.ADMIN_EMAIL?.trim().toLowerCase()) {
      return res.status(400).json({ message: "This email is reserved" });
    }

    const { rows: existing } = await query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO users (id, name, email, password, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, name, email, role`,
      [newId(), name.trim(), cleanEmail, hashedPassword]
    );
    const user = rows[0];

    res.status(201).json({
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LOGIN (user aur admin dono yahin se)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await query("SELECT * FROM users WHERE email = $1", [
      email?.trim().toLowerCase() || "",
    ]);
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password || "", user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
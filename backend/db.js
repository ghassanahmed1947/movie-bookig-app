import "dotenv/config";
import pg from "pg";
import bcrypt from "bcryptjs";

// Vercel (Storage tab -> Neon Postgres) ye variable khud add kar deta hai
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString || "");

export const pool = new pg.Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 5,
});

export const query = (text, params) => pool.query(text, params);

// ---------- Tables (pehli dafa khud ban jati hain) ----------
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS movies (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    poster_url  TEXT,
    category    TEXT NOT NULL DEFAULT 'Now Showing'
                CHECK (category IN ('Now Showing', 'Coming Soon', 'Weekend', 'Hot Movies')),
    shows       JSONB NOT NULL DEFAULT '[]',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS locations (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    city        TEXT NOT NULL,
    address     TEXT NOT NULL,
    phone       TEXT,
    map_url     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- Movie ya cinema delete ho jaye tab bhi purani bookings apni copy rakhti hain
  CREATE TABLE IF NOT EXISTS bookings (
    id                TEXT PRIMARY KEY,
    user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id          TEXT NOT NULL,
    movie_title       TEXT NOT NULL,
    poster_url        TEXT,
    location_id       TEXT NOT NULL,
    location_name     TEXT NOT NULL,
    location_city     TEXT NOT NULL,
    location_address  TEXT,
    location_map_url  TEXT,
    show_date         TEXT NOT NULL,
    show_time         TEXT NOT NULL,
    customer_name     TEXT NOT NULL,
    contact_no        TEXT NOT NULL,
    seats             INTEGER NOT NULL CHECK (seats >= 1),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings (user_id, created_at DESC);
`;

// .env ki email aur password se admin account banata (ya update karta) hai
const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD missing, admin not created");
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await query(
    `INSERT INTO users (id, name, email, password, role)
     VALUES ($1, 'Admin', $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin'`,
    [newId(), email, hashed]
  );
  console.log(`Admin account ready: ${email}`);
};

// Ek hi dafa setup, phir har request par wahi promise
let ready = null;
export const connectDB = () => {
  if (!connectionString) {
    return Promise.reject(new Error("DATABASE_URL is not set"));
  }
  if (!ready) {
    ready = (async () => {
      await query(schema);
      await ensureAdmin();

      // SEED_DEMO=true ho aur koi film na ho to demo data khud daal do (pehli deploy ke liye)
      if (process.env.SEED_DEMO === "true") {
        const { rows } = await query("SELECT COUNT(*)::int AS n FROM movies");
        if (rows[0].n === 0) {
          const { seedDemo } = await import("./demo-data.js");
          await seedDemo();
        }
      }
      console.log("Postgres ready");
    })().catch((err) => {
      ready = null; // agli request par phir koshish
      throw err;
    });
  }
  return ready;
};

// ---------- Helpers ----------
export const newId = () => crypto.randomUUID().replace(/-/g, "");

// Database ki rows ko wahi shakal do jo frontend pehle (MongoDB se) leta tha
export const toMovie = (r) =>
  r && {
    _id: r.id,
    title: r.title,
    description: r.description,
    posterUrl: r.poster_url,
    category: r.category,
    shows: r.shows || [],
    createdAt: r.created_at,
  };

export const toLocation = (r) =>
  r && {
    _id: r.id,
    name: r.name,
    city: r.city,
    address: r.address,
    phone: r.phone,
    mapUrl: r.map_url,
    createdAt: r.created_at,
  };

export const toBooking = (r) =>
  r && {
    _id: r.id,
    user: r.user_id,
    movie: r.movie_id,
    movieTitle: r.movie_title,
    posterUrl: r.poster_url,
    location: r.location_id,
    locationName: r.location_name,
    locationCity: r.location_city,
    locationAddress: r.location_address,
    locationMapUrl: r.location_map_url,
    showDate: r.show_date,
    showTime: r.show_time,
    customerName: r.customer_name,
    contactNo: r.contact_no,
    seats: r.seats,
    createdAt: r.created_at,
  };

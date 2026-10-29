// Demo data: films, cinemas, ek demo user aur uski bookings.
// Showtimes hamesha "aaj" se aage ke 21 din ke liye bante hain,
// is liye jab bhi seed chalayen, site par taaza shows nazar aate hain.
import bcrypt from "bcryptjs";
import { query, newId } from "./db.js";

const pad = (n) => String(n).padStart(2, "0");
const dayFromToday = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Har din ke time slots, kuch dinon ke liye (step = har kitne din baad show)
const schedule = (times, { days = 21, step = 1, startIn = 0 } = {}) => {
  const shows = [];
  for (let i = startIn; i < startIn + days; i += step) {
    for (const time of times) shows.push({ date: dayFromToday(i), time });
  }
  return shows;
};

export const demoCinemas = [
  {
    name: "Grand Regal Clifton",
    city: "Karachi",
    address: "Block 5, Clifton, Karachi",
    mapUrl: "https://maps.google.com/?q=Clifton+Block+5+Karachi",
  },
  {
    name: "Starlight Cinema DHA",
    city: "Karachi",
    address: "Khayaban-e-Ittehad, DHA Phase 6, Karachi",
    mapUrl: "https://maps.google.com/?q=DHA+Phase+6+Karachi",
  },
  {
    name: "Picture Palace Gulberg",
    city: "Lahore",
    address: "Main Boulevard, Gulberg III, Lahore",
    mapUrl: "https://maps.google.com/?q=Gulberg+III+Lahore",
  },
  {
    name: "Capital Screens F-7",
    city: "Islamabad",
    address: "Jinnah Super Market, F-7 Markaz, Islamabad",
    mapUrl: "https://maps.google.com/?q=F-7+Markaz+Islamabad",
  },
];

export const demoMovies = () => [
  {
    title: "Spider-Man: Far From Home",
    category: "Now Showing",
    posterUrl: "/images/spiderman.png",
    description: "Peter Parker's school trip to Europe turns into a fight against a new threat that claims to come from another world.",
    shows: schedule(["13:30", "16:30", "19:30", "22:15"]),
  },
  {
    title: "Top Gun: Maverick",
    category: "Now Showing",
    posterUrl: "/images/Top-Gun-Maverick.jfif",
    description: "Maverick returns to train a new class of fighter pilots for a mission none of them expect to survive.",
    shows: schedule(["15:00", "18:00", "21:30"]),
  },
  {
    title: "Mission: Impossible",
    category: "Now Showing",
    posterUrl: "/images/Mission-Impossible.jfif",
    description: "Ethan Hunt and his team race across the world to stop a weapon before it falls into the wrong hands.",
    shows: schedule(["17:15", "20:45"]),
  },
  {
    title: "John Wick",
    category: "Hot Movies",
    posterUrl: "/images/john-wick.jfif",
    description: "A retired hitman goes back to the only work he knows after the people who wronged him take everything.",
    shows: schedule(["21:00", "23:45"]),
  },
  {
    title: "Extraction",
    category: "Hot Movies",
    posterUrl: "/images/Extraction.jfif",
    description: "A mercenary with nothing left to lose is hired to rescue a kidnapped boy from a city locked down around him.",
    shows: schedule(["19:00", "22:30"]),
  },
  {
    title: "Uncharted",
    category: "Hot Movies",
    posterUrl: "/images/uncharted.jfif",
    description: "A street-smart thief teams up with a seasoned hunter to chase a fortune lost five hundred years ago.",
    shows: schedule(["14:15", "18:45"]),
  },
  {
    title: "Mad Max: Fury Road",
    category: "Weekend",
    posterUrl: "/images/Mad-Max.jfif",
    description: "A desert chase across a wasteland where fuel and water decide who lives. Late-night weekend screenings only.",
    shows: schedule(["23:30"], { days: 21, step: 3 }),
  },
  {
    title: "Jumanji",
    category: "Weekend",
    posterUrl: "/images/jumanji.jfif",
    description: "Four friends get pulled into a video game and have to play their way out. A family pick for the weekend.",
    shows: schedule(["11:00", "14:00"], { days: 21, step: 3 }),
  },
  {
    title: "Terminator",
    category: "Weekend",
    posterUrl: "/images/Terminator.jfif",
    description: "A machine is sent back in time with one target. A classic back on the big screen for weekend nights.",
    shows: schedule(["22:00"], { days: 21, step: 7 }),
  },
  {
    title: "Avengers: Endgame",
    category: "Coming Soon",
    posterUrl: "/images/endgame.jfif",
    description: "The surviving Avengers assemble for one last attempt to undo the damage. Re-release opens next week.",
    shows: schedule(["16:00", "20:00"], { days: 14, startIn: 7 }),
  },
  {
    title: "X-Men",
    category: "Coming Soon",
    posterUrl: "/images/x.men.jfif",
    description: "Mutants with extraordinary powers are caught between a world that fears them and a war of their own. Opens in ten days.",
    shows: schedule(["18:30", "21:45"], { days: 11, startIn: 10 }),
  },
];

export const DEMO_USER = {
  name: "Demo Viewer",
  email: "demo@cinebook.pk",
  password: "demo1234",
};

// Demo data daalta hai. Dobara chalane par purani demo films/cinemas update ho jati hain,
// duplicate nahi bantin. Admin ki apni add ki hui cheezen nahi chhedta.
export const seedDemo = async ({ log = console.log } = {}) => {
  // ---- Cinemas ----
  const cinemaIds = {};
  for (const c of demoCinemas) {
    const { rows } = await query("SELECT id FROM locations WHERE name = $1 AND city = $2", [c.name, c.city]);
    if (rows[0]) {
      cinemaIds[c.name] = rows[0].id;
      await query("UPDATE locations SET address = $2, map_url = $3 WHERE id = $1", [rows[0].id, c.address, c.mapUrl]);
    } else {
      const id = newId();
      await query(
        "INSERT INTO locations (id, name, city, address, phone, map_url) VALUES ($1,$2,$3,$4,'',$5)",
        [id, c.name, c.city, c.address, c.mapUrl]
      );
      cinemaIds[c.name] = id;
    }
  }

  // ---- Movies (naye shows ke sath) ----
  const movieIds = {};
  const movies = demoMovies();
  // Ulta daalte hain taake list mein pehli film sab se upar aaye (newest first)
  for (const m of [...movies].reverse()) {
    const { rows } = await query("SELECT id FROM movies WHERE title = $1", [m.title]);
    if (rows[0]) {
      movieIds[m.title] = rows[0].id;
      await query(
        "UPDATE movies SET description = $2, poster_url = $3, category = $4, shows = $5 WHERE id = $1",
        [rows[0].id, m.description, m.posterUrl, m.category, JSON.stringify(m.shows)]
      );
    } else {
      const id = newId();
      await query(
        "INSERT INTO movies (id, title, description, poster_url, category, shows) VALUES ($1,$2,$3,$4,$5,$6)",
        [id, m.title, m.description, m.posterUrl, m.category, JSON.stringify(m.shows)]
      );
      movieIds[m.title] = id;
    }
  }

  // ---- Demo user + uski 3 bookings (do aane wali, ek guzri hui) ----
  const hashed = await bcrypt.hash(DEMO_USER.password, 10);
  const { rows: users } = await query(
    `INSERT INTO users (id, name, email, password, role) VALUES ($1,$2,$3,$4,'user')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password
     RETURNING id`,
    [newId(), DEMO_USER.name, DEMO_USER.email, hashed]
  );
  const userId = users[0].id;

  await query("DELETE FROM bookings WHERE user_id = $1", [userId]);

  const book = async (title, cinema, dayOffset, time, seats, createdDaysAgo) => {
    const m = movies.find((x) => x.title === title);
    const c = demoCinemas.find((x) => x.name === cinema);
    await query(
      `INSERT INTO bookings (
         id, user_id, movie_id, movie_title, poster_url,
         location_id, location_name, location_city, location_address, location_map_url,
         show_date, show_time, customer_name, contact_no, seats, created_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, now() - ($16 || ' days')::interval)`,
      [
        newId(), userId, movieIds[title], title, m.posterUrl,
        cinemaIds[cinema], c.name, c.city, c.address, c.mapUrl,
        dayFromToday(dayOffset), time, DEMO_USER.name, "0300-0000000", seats, String(createdDaysAgo),
      ]
    );
  };

  await book("Spider-Man: Far From Home", "Grand Regal Clifton", 1, "19:30", 2, 1);
  await book("Top Gun: Maverick", "Picture Palace Gulberg", 4, "21:30", 4, 0);
  await book("Mad Max: Fury Road", "Starlight Cinema DHA", -6, "23:30", 3, 9);

  log(`Demo data ready: ${demoCinemas.length} cinemas, ${movies.length} films, demo login ${DEMO_USER.email} / ${DEMO_USER.password}`);
};

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clapperboard, Clock3, MapPin, Search, Ticket } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BulbFrame } from "../components/Brand";
import { getUpcomingShows, formatShowTime } from "../utils/shows";

const categories = ["Now Showing", "Coming Soon", "Weekend", "Hot Movies"];

// "Thu 29" jaisa chhota din
const dayLabel = (date) => {
  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short" });
  return `${weekday} ${d}`;
};

const bookLink = (movieId, show) =>
  show ? `/book/${movieId}?date=${show.date}&time=${show.time}` : `/book/${movieId}`;

/* ================= HERO MARQUEE ================= */
function Marquee({ movies, loading }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Sab se jaldi shuru hone wali 4 films
  const billed = useMemo(
    () =>
      movies
        .map((m) => ({ ...m, upcoming: getUpcomingShows(m.shows) }))
        .filter((m) => m.upcoming.length > 0)
        .sort((a, b) =>
          `${a.upcoming[0].date}T${a.upcoming[0].time}`.localeCompare(
            `${b.upcoming[0].date}T${b.upcoming[0].time}`
          )
        )
        .slice(0, 4),
    [movies]
  );

  useEffect(() => {
    if (paused || billed.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % billed.length), 5000);
    return () => clearInterval(t);
  }, [paused, billed.length]);

  const current = billed[active] || billed[0];

  return (
    <BulbFrame>
      <div
        className="grid gap-4 lg:grid-cols-[1.05fr_1fr]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Letterboard */}
        <div className="letterboard rounded-2xl p-5 sm:p-7">
          <p className="font-display text-xl font-bold text-brass">Now playing</p>

          <ul className="mt-4">
            {(loading || billed.length === 0) &&
              ["Doors open soon", "Check back tonight"].map((line) => (
                <li key={line} className="flex h-12 items-center font-display text-3xl font-extrabold uppercase tracking-[0.06em] text-paper/40">
                  {loading ? <span className="h-6 w-2/3 animate-pulse rounded bg-white/10" /> : line}
                </li>
              ))}

            {!loading &&
              billed.map((m, i) => {
                const first = m.upcoming[0];
                const sameDay = m.upcoming.filter((s) => s.date === first.date).slice(0, 3);
                const isActive = i === active;
                return (
                  <li key={m._id}>
                    <button
                      onClick={() => setActive(i)}
                      aria-pressed={isActive}
                      className={`group flex min-h-12 w-full flex-wrap items-center justify-between gap-x-4 py-1.5 text-left transition-colors ${
                        isActive ? "text-paper" : "text-paper/45 hover:text-paper/80"
                      }`}
                    >
                      <span className="flex items-center gap-3 font-display text-[28px] font-extrabold uppercase leading-none tracking-[0.06em] sm:text-[34px]">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${
                            isActive ? "bg-brass shadow-[0_0_12px_3px_rgb(232_176_75/0.7)]" : "bg-white/15"
                          }`}
                        />
                        <span className="line-clamp-1">{m.title}</span>
                      </span>
                      <span className="pl-5 font-display text-lg font-semibold tracking-wide text-brass/90">
                        {dayLabel(first.date)}{" "}
                        {sameDay.map((s) => formatShowTime(s.time)).join("  ")}
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Screen */}
        <div className="relative flex flex-col justify-end rounded-2xl bg-black/40 p-4 sm:p-6">
          <div className="beam pointer-events-none absolute inset-x-0 -top-4 h-24" aria-hidden />
          <div className="screen-glow relative aspect-video overflow-hidden rounded-xl bg-black">
            {billed.map((m, i) => (
              <img
                key={m._id}
                src={m.posterUrl}
                alt={i === active ? m.title : ""}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {!current && (
              <div className="absolute inset-0 grid place-items-center text-smoke">
                <Clapperboard size={40} />
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-smoke">{current ? current.category : "Showtimes appear here"}</p>
              <h2 className="mt-1 line-clamp-1 text-4xl font-extrabold text-paper">
                {current ? current.title : "The screen is warming up"}
              </h2>
            </div>
            {current && (
              <button
                onClick={() => navigate(bookLink(current._id, current.upcoming[0]))}
                className="btn-brass"
              >
                <Ticket size={16} /> Book next show
              </button>
            )}
          </div>
        </div>
      </div>
    </BulbFrame>
  );
}

/* ================= MOVIE CARD ================= */
function MovieCard({ movie }) {
  const navigate = useNavigate();
  const upcoming = getUpcomingShows(movie.shows);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-ink-2 transition-colors hover:border-brass/40">
      <div className="relative aspect-video overflow-hidden bg-black">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs text-paper backdrop-blur">
          {movie.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-3">
        <h3 className="text-[32px] font-extrabold text-paper">{movie.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-smoke">
          {movie.description || "Details coming soon."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {upcoming.length > 0 ? (
            upcoming.slice(0, 3).map((s) => (
              <Link
                key={`${s.date}-${s.time}`}
                to={bookLink(movie._id, s)}
                className="chip text-xs"
                title="Book this show"
              >
                <Clock3 size={13} className="text-brass" />
                {dayLabel(s.date)}, {formatShowTime(s.time)}
              </Link>
            ))
          ) : (
            <span className="text-sm text-smoke-2">No shows scheduled yet</span>
          )}
          {upcoming.length > 3 && (
            <span className="self-center text-xs text-smoke">+{upcoming.length - 3} more</span>
          )}
        </div>

        <button
          onClick={() => navigate(`/book/${movie._id}`)}
          className="btn-ghost mt-5 w-full group-hover:border-brass group-hover:bg-brass group-hover:text-ink"
        >
          <Ticket size={16} /> Book seats
        </button>
      </div>
    </article>
  );
}

/* ================= PAGE ================= */
function Home() {
  const [movies, setMovies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api
      .get("/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.error("Failed to load movies:", err))
      .finally(() => setLoading(false));

    api
      .get("/locations")
      .then((res) => setLocations(res.data))
      .catch(() => setLocations([]));
  }, []);

  const searched = movies.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );
  const visible = searched.filter((m) => category === "All" || m.category === category);
  const counts = Object.fromEntries(
    categories.map((c) => [c, searched.filter((m) => m.category === c).length])
  );
  const cities = [...new Set(locations.map((l) => l.city))].sort();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar search={search} onSearch={setSearch} />

      {/* HERO */}
      <header className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] text-paper sm:text-7xl">
            Pick a film. Pick a show. We'll keep your seat warm.
          </h1>
          <p className="max-w-xs text-smoke md:text-right">
            Live showtimes from {cities.length > 0 ? `${locations.length} cinema${locations.length === 1 ? "" : "s"}` : "our cinemas"}, booked in under a minute.
          </p>
        </div>
        <Marquee movies={movies} loading={loading} />
      </header>

      {/* FILMS */}
      <main id="movies" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-8">
        <div className="flex flex-col gap-5 border-t border-line pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-5xl font-black text-paper">Find your film</h2>
            <p className="mt-2 text-smoke">Tap a showtime to jump straight to booking it.</p>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {["All", ...categories].map((c) =>
              c === "All" || counts[c] > 0 ? (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className="chip"
                >
                  {c}
                  <span className="text-xs opacity-60">
                    {c === "All" ? searched.length : counts[c]}
                  </span>
                </button>
              ) : null
            )}
          </div>
        </div>

        {/* Mobile search */}
        <label className="relative mt-6 block lg:hidden">
          <span className="sr-only">Search films</span>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke" />
          <input
            type="search"
            placeholder="Search films"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input rounded-full pl-11"
          />
        </label>

        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-[22px] bg-white/[0.04]" />
            ))}
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="mt-8 rounded-[22px] border border-dashed border-line px-6 py-20 text-center">
            <Clapperboard className="mx-auto text-smoke" size={36} />
            <h3 className="mt-4 text-3xl font-bold text-paper">
              {movies.length === 0 ? "No films on the bill yet" : "Nothing matches that"}
            </h3>
            <p className="mt-2 text-smoke">
              {movies.length === 0
                ? "New films will show up here as soon as they're scheduled."
                : "Try a different title or switch back to All."}
            </p>
            {(search || category !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="btn-ghost mt-6"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* CINEMAS */}
      {cities.length > 0 && (
        <section className="border-y border-line bg-velvet-deep/40">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-4xl font-black text-paper">Playing near you</h2>
              <p className="mt-2 text-smoke">
                {locations.length} cinema{locations.length === 1 ? "" : "s"} in {cities.length} cit{cities.length === 1 ? "y" : "ies"}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link key={c} to="/locations" className="chip">
                  <MapPin size={14} className="text-brass" /> {c}
                </Link>
              ))}
              <Link to="/locations" className="btn-brass">
                See all cinemas
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default Home;

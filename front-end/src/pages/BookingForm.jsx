import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Phone,
  Minus,
  Plus,
  ArrowLeft,
  Ticket,
  MapPin,
  Navigation,
  Check,
} from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatShowDate, formatShowTime, getUpcomingShows } from "../utils/shows";

const parts = (date) => {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    weekday: dt.toLocaleDateString("en-US", { weekday: "short" }),
    day: d,
    month: dt.toLocaleDateString("en-US", { month: "short" }),
  };
};

// Form ka ek numbered hissa
function Step({ n, title, done, children }) {
  return (
    <section className="relative border-l border-line pb-10 pl-8 last:pb-0 sm:pl-10">
      <span
        className={`absolute -left-[17px] top-0 grid h-8 w-8 place-items-center rounded-full border font-display text-lg font-bold transition-colors ${
          done ? "border-brass bg-brass text-ink" : "border-line bg-ink text-paper"
        }`}
      >
        {done ? <Check size={16} strokeWidth={3} /> : n}
      </span>
      <h2 className="text-3xl font-extrabold text-paper">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TicketLine({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-paper-ink/60">{label}</p>
      <p className={`mt-0.5 font-display text-xl font-bold leading-tight ${value ? "" : "text-paper-ink/30"}`}>
        {value || "Not chosen"}
      </p>
    </div>
  );
}

function BookingForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [movie, setMovie] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locLoaded, setLocLoaded] = useState(false);
  const [form, setForm] = useState({
    showDate: "",
    showTime: "",
    city: "",
    locationId: "",
    customerName: user.name || "",
    contactNo: "",
    seats: 1,
  });
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const availableShows = getUpcomingShows(movie?.shows || []);
  const availableDates = [...new Set(availableShows.map((show) => show.date))];
  const dateShows = availableShows.filter((show) => show.date === form.showDate);

  useEffect(() => {
    // Login ke baghair booking nahi ho sakti
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get(`/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
        const shows = getUpcomingShows(res.data.shows || []);
        // Home page se kisi khaas show par click kiya ho to wahi chuna hua aaye
        const wanted = shows.find(
          (s) => s.date === params.get("date") && s.time === params.get("time")
        );
        const pick = wanted || shows[0];
        setForm((f) => ({
          ...f,
          showDate: pick?.date || "",
          showTime: pick?.time || "",
        }));
      })
      .catch(() => setLoadError("We couldn't find that film. It may have been removed."));

    api
      .get("/locations")
      .then((res) => {
        setLocations(res.data);
        // Sirf ek shehar ho to wo khud hi chun lo
        const only = [...new Set(res.data.map((l) => l.city))];
        if (only.length === 1) setForm((f) => ({ ...f, city: only[0] }));
      })
      .catch(() => setLocations([]))
      .finally(() => setLocLoaded(true));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setSeats = (n) => setForm((f) => ({ ...f, seats: Math.max(1, n) }));

  const cities = [...new Set(locations.map((l) => l.city))].sort();
  const cityCinemas = locations.filter((l) => l.city === form.city);
  const selectedCinema = locations.find((l) => l._id === form.locationId);
  const noCinemas = locLoaded && locations.length === 0;
  const seatsNum = Number(form.seats) || 0;

  const missing = !form.locationId
    ? "Choose a cinema to continue."
    : !form.showTime
    ? "Pick a showtime to continue."
    : seatsNum < 1
    ? "Add at least one seat."
    : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (missing) {
      setMessage(missing);
      return;
    }
    setSaving(true);

    try {
      await api.post("/bookings", {
        movie: id,
        location: form.locationId,
        showDate: form.showDate,
        showTime: form.showTime,
        customerName: form.customerName,
        contactNo: form.contactNo,
        seats: Number(form.seats),
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // Token expire ho gaya to dobara login karwao
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setMessage(err.response?.data?.message || "Booking didn't go through. Check your details and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
          <h1 className="text-5xl font-black text-paper">Film not found</h1>
          <p className="text-smoke">{loadError}</p>
          <button onClick={() => navigate("/")} className="btn-brass">
            Back to films
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
          <div className="h-64 animate-pulse rounded-[22px] bg-white/[0.04]" />
        </div>
      </div>
    );
  }

  const disabled =
    saving || noCinemas || !locLoaded || availableShows.length === 0 || !form.showTime || !form.locationId;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* FILM HEADER */}
      <header className="relative overflow-hidden border-b border-line">
        <img
          src={movie.posterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-smoke hover:text-paper">
            <ArrowLeft size={16} /> All films
          </Link>

          <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,420px)_1fr]">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="screen-glow aspect-video w-full rounded-2xl bg-black object-cover"
            />
            <div>
              <span className="chip pointer-events-none text-xs">{movie.category}</span>
              <h1 className="mt-4 text-6xl font-black text-paper sm:text-7xl">{movie.title}</h1>
              {movie.description && (
                <p className="mt-4 max-w-xl leading-relaxed text-smoke">{movie.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-12 px-4 py-12 sm:px-8 lg:grid-cols-[1fr_380px]">
        {/* LEFT: steps or success */}
        {success ? (
          <div className="rise-in self-start">
            <p className="font-display text-2xl font-bold text-brass">You're booked</p>
            <h2 className="mt-2 text-6xl font-black text-paper">See you at the movies.</h2>
            <p className="mt-4 max-w-lg text-smoke">
              {form.seats} seat{Number(form.seats) === 1 ? "" : "s"} for {movie.title} on{" "}
              {formatShowDate(form.showDate)} at {formatShowTime(form.showTime)}
              {selectedCinema ? `, ${selectedCinema.name}, ${selectedCinema.city}` : ""}. Your
              ticket with its QR code is waiting in My tickets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate("/my-bookings")} className="btn-brass">
                <Ticket size={16} /> Open my tickets
              </button>
              <button onClick={() => navigate("/")} className="btn-ghost">
                Book another film
              </button>
            </div>
          </div>
        ) : (
          <form id="booking-form" onSubmit={handleSubmit} className="ml-4">
            {/* 1. CINEMA */}
            <Step n={1} title="Choose a cinema" done={!!selectedCinema}>
              {noCinemas ? (
                <div className="notice-warn">
                  No cinemas have been added yet, so booking isn't open. Please check back soon.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="City">
                    {cities.map((c) => (
                      <button
                        type="button"
                        key={c}
                        aria-pressed={form.city === c}
                        onClick={() => setForm({ ...form, city: c, locationId: "" })}
                        className="chip"
                      >
                        <MapPin size={14} /> {c}
                      </button>
                    ))}
                    {!locLoaded && <span className="text-sm text-smoke">Loading cities…</span>}
                  </div>

                  {form.city && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {cityCinemas.map((l) => {
                        const on = form.locationId === l._id;
                        return (
                          <button
                            type="button"
                            key={l._id}
                            aria-pressed={on}
                            onClick={() => setForm({ ...form, locationId: l._id })}
                            className={`rounded-2xl border p-4 text-left transition-colors ${
                              on
                                ? "border-brass bg-brass/10"
                                : "border-line bg-ink-2 hover:border-brass/40"
                            }`}
                          >
                            <span className="flex items-start justify-between gap-3">
                              <span className="font-display text-2xl font-bold text-paper">{l.name}</span>
                              <span
                                className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                                  on ? "border-brass bg-brass text-ink" : "border-line"
                                }`}
                              >
                                {on && <Check size={12} strokeWidth={3} />}
                              </span>
                            </span>
                            <span className="mt-2 block text-sm text-smoke">{l.address}</span>
                            {l.phone && <span className="mt-1 block text-sm text-smoke">{l.phone}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedCinema?.mapUrl && (
                    <a
                      href={selectedCinema.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm text-brass hover:text-brass-soft"
                    >
                      <Navigation size={14} /> Directions to {selectedCinema.name}
                    </a>
                  )}
                </>
              )}
            </Step>

            {/* 2. SHOWTIME */}
            <Step n={2} title="Pick a showtime" done={!!form.showTime}>
              {availableShows.length === 0 ? (
                <p className="text-smoke">No upcoming shows for this film right now.</p>
              ) : (
                <>
                  <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Date">
                    {availableDates.map((date) => {
                      const p = parts(date);
                      const on = form.showDate === date;
                      return (
                        <button
                          type="button"
                          key={date}
                          aria-pressed={on}
                          aria-label={formatShowDate(date)}
                          onClick={() => {
                            const firstShow = availableShows.find((show) => show.date === date);
                            setForm((f) => ({ ...f, showDate: date, showTime: firstShow?.time || "" }));
                          }}
                          className={`flex w-[72px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors ${
                            on
                              ? "border-brass bg-brass text-ink"
                              : "border-line bg-ink-2 text-paper hover:border-brass/40"
                          }`}
                        >
                          <span className={`text-xs ${on ? "text-ink/70" : "text-smoke"}`}>{p.weekday}</span>
                          <span className="font-display text-3xl font-extrabold leading-none">{p.day}</span>
                          <span className={`text-xs ${on ? "text-ink/70" : "text-smoke"}`}>{p.month}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Time">
                    {dateShows.map((show) => (
                      <button
                        type="button"
                        key={show.time}
                        aria-pressed={form.showTime === show.time}
                        onClick={() => setForm({ ...form, showTime: show.time })}
                        className="chip px-5 py-2.5 font-display text-lg font-bold"
                      >
                        {formatShowTime(show.time)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Step>

            {/* 3. DETAILS */}
            <Step n={3} title="Your seats and details" done={false}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="customerName" className="field-label">Full name</label>
                  <div className="field">
                    <User className="shrink-0 text-smoke" size={18} />
                    <input
                      id="customerName"
                      type="text"
                      name="customerName"
                      placeholder="Name on the ticket"
                      value={form.customerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactNo" className="field-label">Contact number</label>
                  <div className="field">
                    <Phone className="shrink-0 text-smoke" size={18} />
                    <input
                      id="contactNo"
                      type="tel"
                      name="contactNo"
                      placeholder="03XX-XXXXXXX"
                      value={form.contactNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="seats" className="field-label">Seats</label>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="inline-flex items-center rounded-full border border-line bg-ink-2 p-1">
                    <button
                      type="button"
                      onClick={() => setSeats(seatsNum - 1)}
                      disabled={seatsNum <= 1}
                      className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30"
                      aria-label="Remove a seat"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      id="seats"
                      type="number"
                      name="seats"
                      min="1"
                      value={form.seats}
                      onChange={handleChange}
                      className="w-14 bg-transparent text-center font-display text-3xl font-extrabold text-paper outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSeats(seatsNum + 1)}
                      className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
                      aria-label="Add a seat"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Seat row: jitni seats, utni roshan */}
                  <div className="flex items-end gap-1.5" aria-hidden>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-6 w-5 rounded-t-lg rounded-b-sm border-b-4 transition-colors duration-300 ${
                          i < seatsNum
                            ? "border-brass-soft bg-brass"
                            : "border-white/10 bg-white/[0.06]"
                        }`}
                        style={{ transitionDelay: `${i * 25}ms` }}
                      />
                    ))}
                    {seatsNum > 10 && (
                      <span className="ml-1 font-display text-lg font-bold text-brass">+{seatsNum - 10}</span>
                    )}
                  </div>
                </div>
              </div>
            </Step>
          </form>
        )}

        {/* RIGHT: live ticket */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]">
            <div className="notch-bottom rounded-t-[22px] bg-paper p-6 text-paper-ink">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-extrabold">CineBook</span>
                <span className="rounded-full border border-paper-ink/25 px-2.5 py-0.5 text-xs">Admit one per seat</span>
              </div>
              <h3 className="mt-5 text-4xl font-black leading-[0.95]">{movie.title}</h3>
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="col-span-2">
                  <TicketLine
                    label="Cinema"
                    value={selectedCinema && `${selectedCinema.name}, ${selectedCinema.city}`}
                  />
                </div>
                <TicketLine label="Date" value={form.showDate && `${parts(form.showDate).weekday}, ${parts(form.showDate).month} ${parts(form.showDate).day}`} />
                <TicketLine label="Time" value={form.showTime && formatShowTime(form.showTime)} />
                <TicketLine label="Name" value={form.customerName} />
                <TicketLine label="Seats" value={seatsNum > 0 && String(seatsNum)} />
              </div>
            </div>
            <div className="mx-[14px] perf-h" />
            <div
              className={`notch-top rounded-b-[22px] bg-paper-2 px-6 py-4 text-paper-ink ${
                success ? "tear-away" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-paper-ink/60">Stub</span>
                <span className="font-display text-2xl font-black">
                  Admit {seatsNum || "–"}
                </span>
              </div>
            </div>
          </div>

          {!success && (
            <div className="mt-6">
              {message && <div className="notice-err mb-4">{message}</div>}
              <button type="submit" form="booking-form" disabled={disabled} className="btn-brass w-full py-3.5 text-base">
                <Ticket size={18} />
                {saving ? "Booking your seats…" : "Confirm booking"}
              </button>
              {!saving && missing && !noCinemas && (
                <p className="mt-3 text-center text-sm text-smoke">{missing}</p>
              )}
            </div>
          )}
        </aside>
      </main>

      <Footer />
    </div>
  );
}

export default BookingForm;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, MapPin, Navigation, QrCode, X } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";
import TicketModal from "../components/TicketModal";
import { formatShowDate, formatShowTime, isUpcoming } from "../utils/shows";

const stubParts = (date) => {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    top: `${dt.toLocaleDateString("en-US", { weekday: "short" })}, ${dt.toLocaleDateString("en-US", { month: "short" })}`,
    day: d,
  };
};

function BookingTicket({ b, past, cancelling, onView, onCancel }) {
  const stub = b.showDate ? stubParts(b.showDate) : null;

  return (
    <article
      className={`ticket-sm flex flex-col overflow-hidden rounded-[22px] bg-paper text-paper-ink sm:flex-row ${
        past ? "opacity-70" : ""
      }`}
    >
      {/* Still */}
      <div className="relative aspect-video shrink-0 bg-black sm:aspect-auto sm:w-52">
        <img
          src={b.posterUrl}
          alt={b.movieTitle}
          className={`h-full w-full object-cover ${past ? "grayscale" : ""}`}
        />
      </div>

      {/* Details */}
      <div className="relative min-w-0 flex-1 p-5 sm:p-6">
        {past && (
          <span className="stamp absolute right-5 top-5 px-3 py-0.5 text-xl font-black text-velvet/70">
            Shown
          </span>
        )}
        <h3 className="pr-20 text-4xl font-black leading-[0.95]">{b.movieTitle}</h3>

        {b.locationName && (
          <div className="mt-3 flex items-start gap-2 text-sm">
            <MapPin size={15} className="mt-0.5 shrink-0 text-velvet" />
            <span>
              <span className="font-semibold">
                {b.locationName}, {b.locationCity}
              </span>
              {b.locationAddress && (
                <span className="block text-paper-ink/60">{b.locationAddress}</span>
              )}
              {b.locationMapUrl && (
                <a
                  href={b.locationMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-medium text-velvet underline-offset-2 hover:underline"
                >
                  <Navigation size={12} /> Directions
                </a>
              )}
            </span>
          </div>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-paper-ink/55">Name</dt>
            <dd className="font-semibold">{b.customerName}</dd>
          </div>
          <div>
            <dt className="text-xs text-paper-ink/55">Contact</dt>
            <dd className="font-semibold">{b.contactNo}</dd>
          </div>
          <div>
            <dt className="text-xs text-paper-ink/55">Booked on</dt>
            <dd className="font-semibold">{new Date(b.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      {/* Perforation */}
      <div className="perf-h mx-5 sm:hidden" />
      <div className="perf-v my-5 hidden sm:block" />

      {/* Stub */}
      <div className="flex shrink-0 flex-row items-center justify-between gap-4 bg-paper-2 p-5 sm:w-[198px] sm:flex-col sm:items-stretch sm:justify-center sm:text-center">
        <div>
          {stub ? (
            <>
              <p className="text-sm text-paper-ink/60">{stub.top}</p>
              <p className="font-display text-6xl font-black leading-none">{stub.day}</p>
              <p className="font-display text-xl font-bold">{formatShowTime(b.showTime)}</p>
            </>
          ) : (
            <p className="font-display text-xl font-bold">{b.showtime}</p>
          )}
          <p className="mt-1 text-sm">
            Admit <span className="font-bold">{b.seats}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onView}
            className="btn bg-paper-ink px-4 py-2 text-paper hover:bg-velvet"
          >
            <QrCode size={15} /> View ticket
          </button>
          <button
            onClick={onCancel}
            disabled={cancelling}
            className="btn px-4 py-1.5 text-velvet hover:bg-velvet/10"
          >
            <X size={14} />
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      </div>
    </article>
  );
}

function MyBookings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [ticketBooking, setTicketBooking] = useState(null);

  useEffect(() => {
    // Login na ho to login page par bhej do
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        setError("Your tickets didn't load. Refresh the page to try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const confirmCancel = async () => {
    if (!bookingToCancel) return;

    const booking = bookingToCancel;
    setCancellingId(booking._id);
    setError("");

    try {
      await api.delete(`/bookings/${booking._id}`);
      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "That booking couldn't be cancelled. Try again.");
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  };

  const bookingWhen = (b) =>
    b.showDate
      ? `${formatShowDate(b.showDate)}, ${formatShowTime(b.showTime)}`
      : b.showtime;

  // Aane wale shows pehle (jaldi wala upar), purane neeche
  const key = (b) => `${b.showDate || ""}T${b.showTime || ""}`;
  const upcoming = bookings
    .filter((b) => !b.showDate || isUpcoming({ date: b.showDate, time: b.showTime }))
    .sort((a, b) => key(a).localeCompare(key(b)));
  const past = bookings
    .filter((b) => b.showDate && !isUpcoming({ date: b.showDate, time: b.showTime }))
    .sort((a, b) => key(b).localeCompare(key(a)));

  const renderList = (list, isPast) => (
    <div className="space-y-5">
      {list.map((b) => (
        <BookingTicket
          key={b._id}
          b={b}
          past={isPast}
          cancelling={cancellingId === b._id}
          onView={() => setTicketBooking(b)}
          onCancel={() => setBookingToCancel(b)}
        />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-8">
        <p className="text-smoke">Hi {user.name?.split(" ")[0] || "there"},</p>
        <h1 className="mt-1 text-6xl font-black text-paper">Your tickets</h1>

        {error && <div className="notice-err mt-8">{error}</div>}

        {loading && (
          <div className="mt-10 space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-[22px] bg-white/[0.04]" />
            ))}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="mt-10 rounded-[22px] border border-dashed border-line px-6 py-20 text-center">
            <Ticket className="mx-auto text-smoke" size={36} />
            <h2 className="mt-4 text-3xl font-bold text-paper">No tickets yet</h2>
            <p className="mt-2 text-smoke">Book a film and your ticket will land here with its QR code.</p>
            <button onClick={() => navigate("/")} className="btn-brass mt-6">
              Browse films
            </button>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-5 text-3xl font-extrabold text-paper">
              Coming up <span className="text-smoke">{upcoming.length}</span>
            </h2>
            {renderList(upcoming, false)}
          </section>
        )}

        {past.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-3xl font-extrabold text-paper">
              Already shown <span className="text-smoke">{past.length}</span>
            </h2>
            {renderList(past, true)}
          </section>
        )}
      </main>

      <Footer />

      <TicketModal booking={ticketBooking} onClose={() => setTicketBooking(null)} />

      <ConfirmModal
        open={!!bookingToCancel}
        title="Cancel this booking?"
        message={
          bookingToCancel
            ? `Your ${bookingToCancel.seats} seat(s) for "${bookingToCancel.movieTitle}" on ${bookingWhen(bookingToCancel)}${
                bookingToCancel.locationName ? ` (${bookingToCancel.locationName})` : ""
              } will be released. This can't be undone.`
            : ""
        }
        confirmText="Cancel booking"
        cancelText="Keep it"
        loading={cancellingId !== null}
        onConfirm={confirmCancel}
        onCancel={() => setBookingToCancel(null)}
      />
    </div>
  );
}

export default MyBookings;

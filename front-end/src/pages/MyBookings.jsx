import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clapperboard,
  LogOut,
  Ticket,
  Clock3,
  Users,
  Phone,
  User,
  CalendarDays,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import api from "../api";
import ConfirmModal from "../components/ConfirmModal";

function MyBookings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);

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
        setError("Could not load your bookings. Please try again.");
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
      // List mein se turant hata do, dobara fetch ki zaroorat nahi
      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "Could not cancel booking.");
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#080c16]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30">
              <Clapperboard size={24} />
            </div>
            <h1 className="text-xl font-extrabold tracking-wide">
              Cine<span className="text-red-500">Book</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Movies</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-medium transition"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 py-12">
        <div className="mb-10">
          <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Welcome, {user.name}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">My Bookings</h2>
          <p className="text-gray-500 mt-2">
            All the movies you have booked.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl text-sm border bg-red-500/10 border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20 bg-[#0d1320] border border-white/[0.07] rounded-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-5">
              <Ticket className="text-gray-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold">No bookings yet</h3>
            <p className="text-gray-500 mt-2">
              Book a movie and it will show up here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-sm transition"
            >
              Browse Movies
            </button>
          </div>
        )}

        {/* Bookings list */}
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="flex flex-col sm:flex-row gap-5 bg-[#0d1320] border border-white/[0.07] hover:border-red-500/20 rounded-2xl p-5 transition"
            >
              <img
                src={b.posterUrl}
                alt={b.movieTitle}
                className="w-full sm:w-28 h-44 sm:h-40 object-contain rounded-xl bg-slate-950 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold truncate">{b.movieTitle}</h3>
                  <span className="shrink-0 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2.5">
                    <Clock3 size={16} className="text-red-500 shrink-0" />
                    <span>
                      Showtime: <span className="text-white">{b.showtime}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Users size={16} className="text-red-500 shrink-0" />
                    <span>
                      Seats: <span className="text-white">{b.seats}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <User size={16} className="text-red-500 shrink-0" />
                    <span>
                      Name: <span className="text-white">{b.customerName}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-red-500 shrink-0" />
                    <span>
                      Contact: <span className="text-white">{b.contactNo}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CalendarDays size={14} />
                    Booked on {new Date(b.createdAt).toLocaleDateString()}
                  </div>

                  <button
                    onClick={() => setBookingToCancel(b)}
                    disabled={cancellingId === b._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white text-xs font-medium transition disabled:opacity-60"
                  >
                    <Trash2 size={14} />
                    {cancellingId === b._id ? "Cancelling..." : "Cancel Booking"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#050811] py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} CineBook. All rights reserved.
      </footer>

      <ConfirmModal
        open={!!bookingToCancel}
        title="Cancel this booking?"
        message={
          bookingToCancel
            ? `Your ${bookingToCancel.seats} seat(s) for "${bookingToCancel.movieTitle}" at ${bookingToCancel.showtime} will be cancelled. This can't be undone.`
            : ""
        }
        confirmText="Yes, cancel booking"
        cancelText="Keep booking"
        loading={cancellingId !== null}
        onConfirm={confirmCancel}
        onCancel={() => setBookingToCancel(null)}
      />
    </div>
  );
}

export default MyBookings;
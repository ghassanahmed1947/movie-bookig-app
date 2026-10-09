import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Users,
  Clock,
  Clapperboard,
  ArrowLeft,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import api from "../api";

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [movie, setMovie] = useState(null);
  const [form, setForm] = useState({
    showtime: "",
    customerName: user.name || "",
    contactNo: "",
    seats: 1,
  });
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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
        setForm((f) => ({ ...f, showtime: res.data.showtimes[0] }));
      })
      .catch(() => setLoadError("Movie not found."));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      await api.post("/bookings", {
        movie: id,
        showtime: form.showtime,
        customerName: form.customerName,
        contactNo: form.contactNo,
        seats: Number(form.seats),
      });
      setSuccess(true);
    } catch (err) {
      // Token expire ho gaya to dobara login karwao
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setMessage(err.response?.data?.message || "Booking failed");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-gray-400">{loadError}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-sm transition"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
        <p className="text-gray-400">Loading movie details...</p>
      </div>
    );
  }

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
              onClick={() => navigate("/my-bookings")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <Ticket size={16} className="text-red-400" />
              <span className="hidden sm:inline">My Bookings</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Movies</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 px-5 sm:px-8 py-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* MOVIE CARD */}
          <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl shadow-black/20 h-fit">
            <div className="bg-slate-950 flex items-center justify-center p-2">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-80 object-contain rounded-xl"
              />
            </div>

            <div className="p-6">
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                {movie.category}
              </span>

              <h2 className="text-2xl font-bold mt-4">{movie.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                {movie.description}
              </p>

              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-2">
                  Available Showtimes
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.showtimes.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FORM / SUCCESS */}
          {success ? (
            <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-fit">
              <CheckCircle2 className="text-green-500 mb-4" size={52} />
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400 text-sm">
                {form.seats} seat(s) for{" "}
                <span className="text-white font-medium">{movie.title}</span>
              </p>
              <p className="text-gray-400 text-sm mb-7">
                Showtime: <span className="text-white">{form.showtime}</span>
              </p>

              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full bg-red-600 hover:bg-red-500 transition py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
              >
                <Ticket size={18} />
                View My Bookings
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-white/10 transition py-3 rounded-xl font-semibold"
              >
                Book Another Movie
              </button>
            </div>
          ) : (
            <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-6 sm:p-8 h-fit">
              <h3 className="text-xl font-semibold mb-6">Booking Details</h3>

              {message && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-5">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Showtime
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition">
                    <Clock className="text-gray-500 mr-3" size={18} />
                    <select
                      name="showtime"
                      value={form.showtime}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm"
                    >
                      {movie.showtimes.map((t) => (
                        <option key={t} value={t} className="text-black">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Full Name
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition">
                    <User className="text-gray-500 mr-3" size={18} />
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Enter your name"
                      value={form.customerName}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Contact Number
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition">
                    <Phone className="text-gray-500 mr-3" size={18} />
                    <input
                      type="tel"
                      name="contactNo"
                      placeholder="03XX-XXXXXXX"
                      value={form.contactNo}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Number of Seats
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition">
                    <Users className="text-gray-500 mr-3" size={18} />
                    <input
                      type="number"
                      name="seats"
                      min="1"
                      value={form.seats}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 transition py-3.5 rounded-xl font-semibold shadow-lg shadow-red-900/20"
                >
                  {saving ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#050811] py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} CineBook. All rights reserved.
      </footer>
    </div>
  );
}

export default BookingForm;
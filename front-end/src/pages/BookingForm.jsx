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
} from "lucide-react";
import api from "../api";

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [form, setForm] = useState({
    showtime: "",
    customerName: "",
    contactNo: "",
    seats: 1,
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/movies/${id}`).then((res) => {
      setMovie(res.data);
      setForm((f) => ({ ...f, showtime: res.data.showtimes[0] }));
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/bookings", {
        movie: id,
        movieTitle: movie.title,
        ...form,
        seats: Number(form.seats),
      });
      setSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-gray-400">Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Clapperboard className="text-red-500" size={26} />
          <span className="text-xl font-bold tracking-wide">CineBook</span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Back to Movies
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* MOVIE DETAILS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg h-fit">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                {movie.description}
              </p>

              <div className="mt-5">
                <p className="text-xs uppercase text-gray-500 mb-2 tracking-wide">
                  Available Showtimes
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.showtimes.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING FORM / SUCCESS */}
          {success ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center h-fit">
              <CheckCircle2 className="text-green-500 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400 text-sm mb-1">
                {form.seats} seat(s) for{" "}
                <span className="text-white font-medium">{movie.title}</span>
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Showtime: {form.showtime}
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-red-600 hover:bg-red-700 transition py-2.5 rounded-md font-medium"
              >
                Book Another Movie
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
              <h3 className="text-lg font-semibold mb-5">Booking Details</h3>

              {message && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-md mb-4">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs uppercase text-gray-500 tracking-wide mb-1.5 block">
                    Showtime
                  </label>
                  <div className="flex items-center border border-slate-700 rounded-md px-3 py-2.5 bg-slate-800/50">
                    <Clock className="text-slate-400 mr-3" size={18} />
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
                  <label className="text-xs uppercase text-gray-500 tracking-wide mb-1.5 block">
                    Full Name
                  </label>
                  <div className="flex items-center border border-slate-700 rounded-md px-3 py-2.5 bg-slate-800/50">
                    <User className="text-slate-400 mr-3" size={18} />
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Enter your name"
                      value={form.customerName}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-500 tracking-wide mb-1.5 block">
                    Contact Number
                  </label>
                  <div className="flex items-center border border-slate-700 rounded-md px-3 py-2.5 bg-slate-800/50">
                    <Phone className="text-slate-400 mr-3" size={18} />
                    <input
                      type="tel"
                      name="contactNo"
                      placeholder="03XX-XXXXXXX"
                      value={form.contactNo}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-500 tracking-wide mb-1.5 block">
                    Number of Seats
                  </label>
                  <div className="flex items-center border border-slate-700 rounded-md px-3 py-2.5 bg-slate-800/50">
                    <Users className="text-slate-400 mr-3" size={18} />
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
                  className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-md font-semibold"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-6 mt-auto text-center text-xs text-gray-600">
        © {new Date().getFullYear()} CineBook. All rights reserved.
      </footer>
    </div>
  );
}

export default BookingForm;
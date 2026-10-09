import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clapperboard,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Phone,
  Clock3,
  Star,
  ChevronRight,
  Search,
  Play,
  Ticket,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import api from "../api";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    api
      .get("/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => {
        console.error("Failed to load movies:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    "Now Showing",
    "Coming Soon",
    "Weekend",
    "Hot Movies",
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-[#080c16]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30">
                <Clapperboard size={24} />
              </div>

              <div>
                <h1 className="text-xl font-extrabold tracking-wide">
                  Cine<span className="text-red-500">Book</span>
                </h1>
                <p className="text-[10px] text-gray-500 tracking-[0.25em] uppercase">
                  Movie Experience
                </p>
              </div>
            </div>

            {/* NAV LINKS */}
            <div className="hidden lg:flex items-center gap-8 text-sm">
              <a
                href="#movies"
                className="text-white hover:text-red-400 transition"
              >
                Movies
              </a>

              <a
                href="#locations"
                className="text-gray-400 hover:text-white transition"
              >
                Locations
              </a>

              <a
                href="#offers"
                className="text-gray-400 hover:text-white transition"
              >
                Offers
              </a>

              <a
                href="#contact"
                className="text-gray-400 hover:text-white transition"
              >
                Contact
              </a>
            </div>

            {/* SEARCH */}
                        {/* SEARCH + AUTH */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search movies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-52 lg:w-64 bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500/60 focus:bg-white/10 transition"
                />
              </div>

              {user ? (
                <>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
                  >
                    <Ticket size={16} className="text-red-400" />
                    <span className="hidden sm:inline">My Bookings</span>
                  </button>

                  {user.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
                    >
                      <ShieldCheck size={16} className="text-red-400" />
                      <span className="hidden sm:inline">Admin</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-medium transition"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
                  >
                    <LogIn size={16} />
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-medium transition"
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-[#080c16] to-[#070b14]" />

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto w-full px-5 sm:px-8 py-20">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              <Play size={14} fill="currentColor" />
              Your cinema, your way
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Movies feel
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                better here.
              </span>
            </h2>

            <p className="mt-6 text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Discover the latest blockbusters, choose your favorite seats,
              and book your perfect movie night in just a few clicks.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <button
                onClick={() =>
                  document
                    .getElementById("movies")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group px-6 py-3.5 bg-red-600 hover:bg-red-500 rounded-xl font-semibold flex items-center gap-2 transition shadow-xl shadow-red-900/30"
              >
                Explore Movies
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("locations")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition"
              >
                Find a Cinema
              </button>

            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">

              <div>
                <p className="text-2xl font-bold">{movies.length}+</p>
                <p className="text-xs text-gray-500 mt-1">Movies Available</p>
              </div>

              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-gray-500 mt-1">Online Booking</p>
              </div>

              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-xs text-gray-500 mt-1">Customer Rating</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= MOVIES ================= */}
      <main
        id="movies"
        className="max-w-7xl mx-auto px-5 sm:px-8 py-20"
      >

        {/* Section heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">

          <div>
            <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">
              What's playing
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold">
              Find your next movie
            </h2>

            <p className="text-gray-500 mt-2">
              Pick a movie and reserve your seats.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-gray-500 text-sm">
            <Clock3 size={16} />
            Fast & easy booking
          </div>

        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-8 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-red-500/60"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[470px] rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Movies */}
        {!loading && filteredMovies.length > 0 && (
          <div className="space-y-16">

            {categories.map((category) => {
              const categoryMovies = filteredMovies.filter(
                (movie) => movie.category === category
              );

              if (categoryMovies.length === 0) return null;

              return (
                <section key={category}>

                  {/* Category title */}
                  <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center gap-3">
                      <div className="w-1 h-7 bg-red-500 rounded-full" />

                      <h3 className="text-xl sm:text-2xl font-bold">
                        {category}
                      </h3>
                    </div>

                    <span className="text-xs text-gray-500">
                      {categoryMovies.length} movies
                    </span>

                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {categoryMovies.map((movie) => (

                      <div
                        key={movie._id}
                        className="group bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-red-500/30 hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-black/20"
                      >

                       {/* Poster */}
<div className="relative h-[180px] overflow-hidden bg-slate-950 flex items-center justify-center p-1">

  <img
    src={movie.posterUrl}
    alt={movie.title}
    onLoad={() => console.log("Loaded:", movie.posterUrl)}
    onError={() => console.log("FAILED to load:", movie.posterUrl)}
    className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition duration-500"
  />

  {/* Gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

  {/* Category badge */}
  <div className="absolute top-4 left-4">
    <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium">
      {movie.category}
    </span>
  </div>

  {/* Rating */}
  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs">
    <Star
      size={13}
      fill="#fbbf24"
      className="text-yellow-400"
    />
    <span>4.8</span>
  </div>

  {/* Play overlay */}
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">

    <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl shadow-red-900/40">

      <Play
        size={22}
        fill="white"
      />

    </div>

  </div>

</div>

                        {/* Content */}
                        <div className="p-5">

                          <h4 className="text-lg font-bold truncate">
                            {movie.title}
                          </h4>

                          <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
                            {movie.description}
                          </p>

                          {/* Showtimes */}
                          {movie.showtimes?.length > 0 && (
                            <div className="mt-4">

                              <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-2">
                                Showtimes
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {movie.showtimes.map((time) => (
                                  <span
                                    key={time}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                                  >
                                    {time}
                                  </span>
                                ))}
                              </div>

                            </div>
                          )}

                          {/* Button */}
                          <button
                            onClick={() =>
                              navigate(`/book/${movie._id}`)
                            }
                            className="mt-5 w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-sm transition shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                          >
                            Book Now
                            <ChevronRight size={17} />
                          </button>

                        </div>
                      </div>

                    ))}

                  </div>
                </section>
              );
            })}

          </div>
        )}

        {/* Empty state */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-24">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-5">
              <Clapperboard className="text-gray-600" size={28} />
            </div>

            <h3 className="text-xl font-semibold">
              No movies found
            </h3>

            <p className="text-gray-500 mt-2">
              Try searching with a different movie name.
            </p>

          </div>
        )}

      </main>

      {/* ================= LOCATION ================= */}
      <section
        id="locations"
        className="border-y border-white/10 bg-[#0a0f1b]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>
              <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-3">
                Visit us
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold">
                Your movie night starts here.
              </h2>

              <p className="text-gray-500 mt-4 max-w-xl leading-relaxed">
                Enjoy the latest movies in a comfortable environment with
                easy online booking and convenient showtimes.
              </p>

              <div className="mt-7 space-y-4">

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <MapPin className="text-red-500" size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Our Cinema</p>
                    <p className="font-medium">
                      Main Boulevard, Karachi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Phone className="text-red-500" size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Call us</p>
                    <p className="font-medium">
                      +92 300 1234567
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="relative">

              <div className="absolute inset-0 bg-red-600/10 blur-3xl" />

              <div className="relative bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 sm:p-10 overflow-hidden">

                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-black/10" />

                <Clapperboard
                  size={45}
                  className="mb-8 text-white/80"
                />

                <h3 className="text-2xl sm:text-3xl font-bold">
                  Ready for your next movie?
                </h3>

                <p className="text-red-100 mt-3">
                  Browse our movies and book your seats today.
                </p>

                <button
                  onClick={() =>
                    document
                      .getElementById("movies")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-7 bg-white text-red-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition"
                >
                  Browse Movies
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        id="contact"
        className="bg-[#050811] border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="md:col-span-2">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                  <Clapperboard size={21} />
                </div>

                <span className="text-xl font-bold">
                  Cine<span className="text-red-500">Book</span>
                </span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed max-w-md mt-5">
                Your neighborhood cinema, now online. Discover movies,
                choose your seats and enjoy a seamless booking experience.
              </p>

              <div className="flex gap-3 mt-6">

                <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600 border border-white/10 flex items-center justify-center transition">
                  <Heart size={18} />
                </button>

                <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600 border border-white/10 flex items-center justify-center transition">
                  <Share2 size={18} />
                </button>

                <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600 border border-white/10 flex items-center justify-center transition">
                  <MessageCircle size={18} />
                </button>

              </div>

            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold mb-5">Quick Links</h4>

              <div className="space-y-3 text-sm text-gray-500">
                <a href="#movies" className="block hover:text-white transition">
                  Movies
                </a>

                <a href="#locations" className="block hover:text-white transition">
                  Locations
                </a>

                <a href="#offers" className="block hover:text-white transition">
                  Offers
                </a>

                <a href="#contact" className="block hover:text-white transition">
                  Contact
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-5">Contact</h4>

              <div className="space-y-4 text-sm text-gray-500">

                <div className="flex gap-3">
                  <MapPin size={18} className="text-red-500 shrink-0" />
                  <span>Main Boulevard, Karachi</span>
                </div>

                <div className="flex gap-3">
                  <Phone size={18} className="text-red-500 shrink-0" />
                  <span>+92 300 1234567</span>
                </div>

                <div className="flex gap-3">
                  <MessageCircle size={18} className="text-red-500 shrink-0" />
                  <span>support@cinebook.com</span>
                </div>

              </div>
            </div>

          </div>

          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-gray-600">
            <p>
              © {new Date().getFullYear()} CineBook. All rights reserved.
            </p>

            <p>
              Made for movie lovers 🎬
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;
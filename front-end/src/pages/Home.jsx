import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clapperboard, Heart, Share2, MessageCircle, MapPin, Phone } from "lucide-react";
import api from "../api";

function Home() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/movies").then((res) => setMovies(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Clapperboard className="text-red-500" size={26} />
          <span className="text-xl font-bold tracking-wide">CineBook</span>
        </div>
        <div className="hidden sm:flex gap-6 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition">Now Showing</a>
          <a href="#" className="hover:text-white transition">Locations</a>
          <a href="#" className="hover:text-white transition">Offers</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 px-6 py-14 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Book Your Next Movie Night
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Pick a movie, choose your showtime, and reserve your seats in seconds.
        </p>
      </div>

      {/* MOVIES SECTIONS */}
      <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full space-y-14">
        {["Now Showing", "Coming Soon", "Weekend", "Hot Movies"].map((category) => {
          const categoryMovies = movies.filter((m) => m.category === category);
          if (categoryMovies.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="text-xl font-semibold mb-6 border-l-4 border-red-600 pl-3">
                {category}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categoryMovies.map((movie) => (
                  <div
                    key={movie._id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/30 hover:-translate-y-1 transition duration-200"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-5">
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {movie.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {movie.showtimes?.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded-full text-gray-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate(`/book/${movie._id}`)}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 transition py-2.5 rounded-md font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {movies.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No movies available right now. Please check back soon.
          </p>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-10 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-400">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clapperboard className="text-red-500" size={20} />
              <span className="text-white font-semibold">CineBook</span>
            </div>
            <p>Your neighborhood cinema, now online. Book seats in seconds.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Contact</h4>
            <p className="flex items-center gap-2 mb-2">
              <MapPin size={16} /> Main Boulevard, Karachi
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> +92 300 1234567
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Follow Us</h4>
            <div className="flex gap-4">
              <Heart className="hover:text-white cursor-pointer transition" size={20} />
              <Share2 className="hover:text-white cursor-pointer transition" size={20} />
              <MessageCircle className="hover:text-white cursor-pointer transition" size={20} />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          © {new Date().getFullYear()} CineBook. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
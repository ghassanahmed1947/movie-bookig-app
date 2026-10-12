import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clapperboard, MapPin, Phone, Ticket, ArrowLeft , Navigation} from "lucide-react";
import api from "../api";

function Locations() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    api
      .get("/locations")
      .then((res) => setLocations(res.data))
      .catch(() => setError("Could not load cinemas. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const cities = [...new Set(locations.map((l) => l.city))];

  const grouped = cities
    .filter((c) => selectedCity === "All" || c === selectedCity)
    .map((city) => ({
      city,
      items: locations.filter((l) => l.city === city),
    }));

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
            {user && (
              <button
                onClick={() => navigate("/my-bookings")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
              >
                <Ticket size={16} className="text-red-400" />
                <span className="hidden sm:inline">My Bookings</span>
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Movies</span>
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 py-12">
        <div className="mb-10">
          <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Find a cinema
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Our Locations</h2>
          <p className="text-gray-500 mt-2">
            All the cinemas where you can book your seats.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl text-sm border bg-red-500/10 border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* City filter */}
        {!loading && cities.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {["All", ...cities].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  selectedCity === c
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && locations.length === 0 && (
          <div className="text-center py-20 bg-[#0d1320] border border-white/[0.07] rounded-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-5">
              <MapPin className="text-gray-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold">No cinemas yet</h3>
            <p className="text-gray-500 mt-2">
              Cinemas will appear here once they are added.
            </p>
          </div>
        )}

        {/* Grouped by city */}
        <div className="space-y-12">
          {grouped.map(({ city, items }) => (
            <section key={city}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 bg-red-500 rounded-full" />
                  <h3 className="text-xl sm:text-2xl font-bold">{city}</h3>
                </div>
                <span className="text-xs text-gray-500">
                  {items.length} {items.length === 1 ? "cinema" : "cinemas"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((loc) => (
                  <div
                    key={loc._id}
                    className="bg-[#0d1320] border border-white/[0.07] hover:border-red-500/30 rounded-2xl p-6 transition shadow-xl shadow-black/20"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                      <Clapperboard className="text-red-500" size={22} />
                    </div>

                    <h4 className="text-lg font-bold">{loc.name}</h4>

                    <div className="mt-4 space-y-3 text-sm text-gray-400">
                      <div className="flex items-start gap-2.5">
                        <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{loc.address}</span>
                      </div>

                      {loc.phone && (
                        <div className="flex items-center gap-2.5">
                          <Phone size={16} className="text-red-500 shrink-0" />
                          <span>{loc.phone}</span>
                        </div>
                      )}
                    </div>

                                       <div className="mt-6 flex gap-3">
                      {loc.mapUrl && (
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-medium transition"
                        >
                          <Navigation size={15} />
                          Get Directions
                        </a>
                      )}

                      <button
                        onClick={() => navigate("/")}
                        className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition"
                      >
                        Book a movie
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#050811] py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} CineBook. All rights reserved.
      </footer>
    </div>
  );
}

export default Locations;
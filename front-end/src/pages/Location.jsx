import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Navigation, Film } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Locations() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    api
      .get("/locations")
      .then((res) => setLocations(res.data))
      .catch(() => setError("Cinemas didn't load. Refresh the page to try again."))
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
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-6xl font-black text-paper sm:text-7xl">Our cinemas</h1>
            <p className="mt-3 max-w-md text-smoke">
              Every screen you can book on CineBook, sorted by city.
            </p>
          </div>

          {!loading && cities.length > 1 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by city">
              {["All", ...cities].map((c) => (
                <button key={c} onClick={() => setSelectedCity(c)} aria-pressed={selectedCity === c} className="chip">
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <div className="notice-err mt-8">{error}</div>}

        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-[22px] bg-white/[0.04]" />
            ))}
          </div>
        )}

        {!loading && !error && locations.length === 0 && (
          <div className="mt-10 rounded-[22px] border border-dashed border-line px-6 py-20 text-center">
            <MapPin className="mx-auto text-smoke" size={36} />
            <h2 className="mt-4 text-3xl font-bold text-paper">No cinemas yet</h2>
            <p className="mt-2 text-smoke">Cinemas will appear here once they're added.</p>
          </div>
        )}

        <div className="mt-12 space-y-14">
          {grouped.map(({ city, items }) => (
            <section key={city}>
              <div className="mb-6 flex items-baseline gap-4 border-b border-line pb-3">
                <h2 className="text-4xl font-black text-paper">{city}</h2>
                <span className="text-sm text-smoke">
                  {items.length} {items.length === 1 ? "cinema" : "cinemas"}
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((loc) => (
                  <article
                    key={loc._id}
                    className="group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-ink-2 p-6 transition-colors hover:border-brass/40"
                  >
                    {/* Chhota sa marquee sign */}
                    <div className="mb-5 flex items-center gap-1.5" aria-hidden>
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-brass/30 transition-colors duration-300 group-hover:bg-brass"
                          style={{ transitionDelay: `${i * 40}ms` }}
                        />
                      ))}
                    </div>

                    <h3 className="text-3xl font-extrabold text-paper">{loc.name}</h3>

                    <div className="mt-4 space-y-2.5 text-sm text-smoke">
                      <p className="flex items-start gap-2.5">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-brass" />
                        {loc.address}
                      </p>
                      {loc.phone && (
                        <a href={`tel:${loc.phone}`} className="flex items-center gap-2.5 hover:text-paper">
                          <Phone size={16} className="shrink-0 text-brass" />
                          {loc.phone}
                        </a>
                      )}
                    </div>

                    <div className="mt-auto flex gap-2 pt-6">
                      {loc.mapUrl && (
                        <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 px-3">
                          <Navigation size={15} /> Directions
                        </a>
                      )}
                      <button onClick={() => navigate("/")} className="btn-brass flex-1 px-3">
                        <Film size={15} /> See films
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Locations;

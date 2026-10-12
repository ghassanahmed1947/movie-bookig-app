import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clapperboard,
  LogOut,
  Trash2,
  Plus,
  Film,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";
import api from "../api";
import ConfirmModal from "../components/ConfirmModal";

const categories = ["Now Showing", "Coming Soon", "Weekend", "Hot Movies"];

const emptyMovie = {
  title: "",
  description: "",
  posterUrl: "",
  category: "Now Showing",
};

const emptyLocation = {
  name: "",
  city: "",
  address: "",
  phone: "",
  mapUrl: "",
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/60 placeholder-gray-600 transition";
const labelClass =
  "text-xs uppercase tracking-wide text-gray-500 mb-1.5 block";

function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tab, setTab] = useState("movies");

  const [movies, setMovies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [locationForm, setLocationForm] = useState(emptyLocation);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delete popup: { type: "movie" | "location", item }
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMovies = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.error("Failed to load movies:", err);
    } finally {
      setMoviesLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Failed to load locations:", err);
    } finally {
      setLocationsLoading(false);
    }
  };

  useEffect(() => {
    // Admin na ho to login par bhej do
    if (user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchMovies();
    fetchLocations();
  }, []);

  const switchTab = (name) => {
    setTab(name);
    setMessage({ type: "", text: "" });
  };

  const handleMovieChange = (e) => {
    setMovieForm({ ...movieForm, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e) => {
    setLocationForm({ ...locationForm, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSaving(true);

    try {
      await api.post("/movies", movieForm);
      setMessage({ type: "success", text: "Movie added successfully!" });
      setMovieForm(emptyMovie);
      fetchMovies();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add movie",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSaving(true);

    try {
      await api.post("/locations", locationForm);
      setMessage({ type: "success", text: "Cinema added successfully!" });
      setLocationForm(emptyLocation);
      fetchLocations();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add cinema",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);
    try {
      if (toDelete.type === "movie") {
        await api.delete(`/movies/${toDelete.item._id}`);
        setMessage({
          type: "success",
          text: `"${toDelete.item.title}" deleted.`,
        });
        fetchMovies();
      } else {
        await api.delete(`/locations/${toDelete.item._id}`);
        setMessage({
          type: "success",
          text: `"${toDelete.item.name}" deleted.`,
        });
        fetchLocations();
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete",
      });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cities = [...new Set(locations.map((l) => l.city))];

  const modalTitle =
    toDelete?.type === "location" ? "Delete this cinema?" : "Delete this movie?";

  const modalMessage = toDelete
    ? toDelete.type === "location"
      ? `"${toDelete.item.name}" (${toDelete.item.city}) will be removed. Old bookings will still show their cinema details.`
      : `"${toDelete.item.title}" will be removed from the website. This can't be undone.`
    : "";

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#080c16]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30">
              <Clapperboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide">
                Cine<span className="text-red-500">Book</span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.25em] uppercase">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-400">
              {user.name}
            </span>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">View Site</span>
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

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="mb-8">
          <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Dashboard
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            {tab === "movies" ? "Manage Movies" : "Manage Locations"}
          </h2>
          <p className="text-gray-500 mt-2">
            {tab === "movies"
              ? "Add new movies or remove the ones you don't need."
              : "Add the cinemas that use CineBook, or remove them."}
          </p>
        </div>

        {/* TABS */}
        <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1 mb-8">
          <button
            onClick={() => switchTab("movies")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              tab === "movies"
                ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Film size={16} />
            Movies
            <span className="text-xs opacity-70">({movies.length})</span>
          </button>

          <button
            onClick={() => switchTab("locations")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              tab === "locations"
                ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MapPin size={16} />
            Locations
            <span className="text-xs opacity-70">({locations.length})</span>
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-8 p-4 rounded-xl text-sm border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ================= MOVIES TAB ================= */}
        {tab === "movies" && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* ADD FORM */}
            <div className="lg:col-span-2">
              <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-6 lg:sticky lg:top-28">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Plus className="text-red-500" size={18} />
                  </div>
                  <h3 className="text-lg font-semibold">Add New Movie</h3>
                </div>

                <form onSubmit={handleAddMovie} className="space-y-4">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Movie title"
                      value={movieForm.title}
                      onChange={handleMovieChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      placeholder="Short description"
                      value={movieForm.description}
                      onChange={handleMovieChange}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Poster URL</label>
                    <input
                      type="text"
                      name="posterUrl"
                      placeholder="/images/spiderman.png"
                      value={movieForm.posterUrl}
                      onChange={handleMovieChange}
                      className={inputClass}
                      required
                    />
                    <p className="text-[11px] text-gray-600 mt-1.5">
                      Local image: /images/filename.png, ya koi online image link.
                    </p>
                  </div>

                  {movieForm.posterUrl && (
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                      <img
                        src={movieForm.posterUrl}
                        alt="Preview"
                        onError={(e) => (e.target.style.display = "none")}
                        onLoad={(e) => (e.target.style.display = "block")}
                        className="w-14 h-20 object-cover rounded-lg bg-slate-950"
                      />
                      <p className="text-xs text-gray-500">Poster preview</p>
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Category</label>
                    <select
                      name="category"
                      value={movieForm.category}
                      onChange={handleMovieChange}
                      className={inputClass}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="text-black">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 transition py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20"
                  >
                    {saving ? "Adding..." : "Add Movie"}
                  </button>
                </form>
              </div>
            </div>

            {/* MOVIES LIST */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">All Movies</h3>
                <span className="text-xs text-gray-500">
                  {movies.length} total
                </span>
              </div>

              {moviesLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              )}

              {!moviesLoading && movies.length === 0 && (
                <div className="text-center py-16 bg-[#0d1320] border border-white/[0.07] rounded-2xl">
                  <Film className="mx-auto text-gray-600 mb-3" size={32} />
                  <p className="text-gray-400">No movies yet.</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Add your first movie from the form.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="flex items-center gap-4 bg-[#0d1320] border border-white/[0.07] hover:border-red-500/20 rounded-2xl p-4 transition"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-lg bg-slate-950 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{movie.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {movie.description}
                      </p>
                      <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
                        {movie.category}
                      </span>
                    </div>

                    <button
                      onClick={() => setToDelete({ type: "movie", item: movie })}
                      className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-600 border border-red-500/20 flex items-center justify-center text-red-400 hover:text-white transition shrink-0"
                      title="Delete movie"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= LOCATIONS TAB ================= */}
        {tab === "locations" && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* ADD FORM */}
            <div className="lg:col-span-2">
              <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-6 lg:sticky lg:top-28">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Plus className="text-red-500" size={18} />
                  </div>
                  <h3 className="text-lg font-semibold">Add New Cinema</h3>
                </div>

                <form onSubmit={handleAddLocation} className="space-y-4">
                  <div>
                    <label className={labelClass}>Cinema Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Cinepax Ocean Mall"
                      value={locationForm.name}
                      onChange={handleLocationChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      name="city"
                      list="city-suggestions"
                      placeholder="e.g. Karachi"
                      value={locationForm.city}
                      onChange={handleLocationChange}
                      className={inputClass}
                      required
                    />
                    <datalist id="city-suggestions">
                      {cities.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <p className="text-[11px] text-gray-600 mt-1.5">
                      Pehle se add shehar suggestion mein aayenge, taake spelling
                      same rahe.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Address</label>
                    <textarea
                      name="address"
                      rows="3"
                      placeholder="Full address"
                      value={locationForm.address}
                      onChange={handleLocationChange}
                      className={`${inputClass} resize-none`}
                      required
                    />
                  </div>
{/* 
                  <div>
                    <label className={labelClass}>
                      Phone <span className="normal-case text-gray-600">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="021-XXXXXXX"
                      value={locationForm.phone}
                      onChange={handleLocationChange}
                      className={inputClass}
                    />
                  </div> */}

                                    <div>
                    <label className={labelClass}>
                      Google Maps Link{" "}
                      <span className="normal-case text-gray-600">(optional)</span>
                    </label>
                    <input
                      type="url"
                      name="mapUrl"
                      placeholder="https://maps.app.goo.gl/..."
                      value={locationForm.mapUrl}
                      onChange={handleLocationChange}
                      className={inputClass}
                    />
                    <p className="text-[11px] text-gray-600 mt-1.5">
                      Google Maps mein cinema kholen, Share dabayen, Copy link
                      karen aur yahan paste karen.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 transition py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20"
                  >
                    {saving ? "Adding..." : "Add Cinema"}
                  </button>
                </form>
              </div>
            </div>

            {/* LOCATIONS LIST */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">All Cinemas</h3>
                <span className="text-xs text-gray-500">
                  {locations.length} total
                </span>
              </div>

              {locationsLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              )}

              {!locationsLoading && locations.length === 0 && (
                <div className="text-center py-16 bg-[#0d1320] border border-white/[0.07] rounded-2xl">
                  <MapPin className="mx-auto text-gray-600 mb-3" size={32} />
                  <p className="text-gray-400">No cinemas yet.</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Add your first cinema from the form.
                  </p>
                </div>
              )}

              <div className="space-y-8">
                {cities.map((city) => (
                  <div key={city}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-5 bg-red-500 rounded-full" />
                      <h4 className="font-semibold">{city}</h4>
                    </div>

                    <div className="space-y-3">
                      {locations
                        .filter((l) => l.city === city)
                        .map((loc) => (
                          <div
                            key={loc._id}
                            className="flex items-start gap-4 bg-[#0d1320] border border-white/[0.07] hover:border-red-500/20 rounded-2xl p-4 transition"
                          >
                            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                              <Clapperboard className="text-red-500" size={20} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold truncate">{loc.name}</h5>

                              <div className="flex items-start gap-2 text-sm text-gray-500 mt-1.5">
                                <MapPin size={14} className="shrink-0 mt-0.5" />
                                <span>{loc.address}</span>
                              </div>

                              {loc.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                  <Phone size={14} className="shrink-0" />
                                  <span>{loc.phone}</span>
                                </div>
                              )}
                            </div>

                             {loc.mapUrl && (
                                <a
                                  href={loc.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 mt-1.5"
                                >
                                  <ExternalLink size={14} className="shrink-0" />
                                  View on Google Maps
                                </a>
                              )}

                            <button
                              onClick={() =>
                                setToDelete({ type: "location", item: loc })
                              }
                              className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-600 border border-red-500/20 flex items-center justify-center text-red-400 hover:text-white transition shrink-0"
                              title="Delete cinema"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        open={!!toDelete}
        title={modalTitle}
        message={modalMessage}
        confirmText="Yes, delete"
        cancelText="Keep it"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default Admin;
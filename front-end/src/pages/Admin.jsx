import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clapperboard, LogOut, Trash2, Plus, Film, ExternalLink } from "lucide-react";
import api from "../api";
import ConfirmModal from "../components/ConfirmModal";

const categories = ["Now Showing", "Coming Soon", "Weekend", "Hot Movies"];

const emptyForm = {
  title: "",
  description: "",
  posterUrl: "",
  category: "Now Showing",
};

function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMovies = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.error("Failed to load movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Admin na ho to login par bhej do
    if (user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSaving(true);

    try {
      await api.post("/movies", form);
      setMessage({ type: "success", text: "Movie added successfully!" });
      setForm(emptyForm);
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

  const confirmDelete = async () => {
    if (!movieToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/movies/${movieToDelete._id}`);
      setMessage({ type: "success", text: `"${movieToDelete.title}" deleted.` });
      fetchMovies();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete movie",
      });
    } finally {
      setDeleting(false);
      setMovieToDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
        <div className="mb-10">
          <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Dashboard
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Manage Movies</h2>
          <p className="text-gray-500 mt-2">
            Add new movies or remove the ones you don't need.
          </p>
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

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Movie title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/60 placeholder-gray-600 transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Short description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/60 placeholder-gray-600 transition resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Poster URL
                  </label>
                  <input
                    type="text"
                    name="posterUrl"
                    placeholder="/images/spiderman.png"
                    value={form.posterUrl}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/60 placeholder-gray-600 transition"
                    required
                  />
                  <p className="text-[11px] text-gray-600 mt-1.5">
                    Local image: /images/filename.png, ya koi online image link.
                  </p>
                </div>

                {form.posterUrl && (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <img
                      src={form.posterUrl}
                      alt="Preview"
                      onError={(e) => (e.target.style.display = "none")}
                      onLoad={(e) => (e.target.style.display = "block")}
                      className="w-14 h-20 object-cover rounded-lg bg-slate-950"
                    />
                    <p className="text-xs text-gray-500">Poster preview</p>
                  </div>
                )}

                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/60 transition"
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

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && movies.length === 0 && (
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
                    onClick={() => setMovieToDelete(movie)}
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
      </main>

      <ConfirmModal
        open={!!movieToDelete}
        title="Delete this movie?"
        message={
          movieToDelete
            ? `"${movieToDelete.title}" will be removed from the website. This can't be undone.`
            : ""
        }
        confirmText="Yes, delete"
        cancelText="Keep movie"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setMovieToDelete(null)}
      />
    </div>
  );
}

export default Admin;
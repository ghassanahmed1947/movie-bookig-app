import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Clapperboard } from "lucide-react";
import api from "../api";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Role ke hisab se redirect
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30">
            <Clapperboard size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide">
            Cine<span className="text-red-500">Book</span>
          </h1>
        </div>

        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-8 shadow-xl shadow-black/30">
          <h2 className="text-2xl font-bold">Create account</h2>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Sign up to book your favorite movies.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                Full Name
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition">
                <User className="text-gray-500 mr-3" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                Email
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition">
                <Mail className="text-gray-500 mr-3" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                Password
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition">
                <Lock className="text-gray-500 mr-3" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 transition py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
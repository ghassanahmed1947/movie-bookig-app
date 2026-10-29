import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import api from "../api";
import AuthLayout from "../components/AuthLayout";

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
      setError(err.response?.data?.message || "Sign up didn't work. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join CineBook" subtitle="One account for every cinema, every show.">
      {error && <div className="notice-err mb-5">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="field-label">Full name</label>
          <div className="field">
            <User className="shrink-0 text-smoke" size={18} />
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <div className="field">
            <Mail className="shrink-0 text-smoke" size={18} />
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <div className="field">
            <Lock className="shrink-0 text-smoke" size={18} />
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Choose a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-brass w-full py-3.5 text-base">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-smoke">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brass hover:text-brass-soft">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;

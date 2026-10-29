import { NavLink, useNavigate } from "react-router-dom";
import { Film, MapPin, Ticket, ShieldCheck, LogOut, Search } from "lucide-react";
import { Logo } from "./Brand";

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors ${
    isActive ? "bg-white/[0.08] text-paper" : "text-smoke hover:text-paper"
  }`;

// Sab pages ka ek hi navbar
function Navbar({ search, onSearch, subtitle }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Logo subtitle={subtitle} />

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={linkClass}>
            <Film size={16} /> Films
          </NavLink>
          <NavLink to="/locations" className={linkClass}>
            <MapPin size={16} /> Cinemas
          </NavLink>
          {user && (
            <NavLink to="/my-bookings" className={linkClass}>
              <Ticket size={16} /> My tickets
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              <ShieldCheck size={16} /> Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onSearch && (
            <label className="relative hidden lg:block">
              <span className="sr-only">Search films</span>
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-smoke" />
              <input
                type="search"
                placeholder="Search films"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="w-56 rounded-full border border-line bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-smoke-2 focus:border-brass/60"
              />
            </label>
          )}

          {/* Mobile par chhote icon links */}
          <div className="flex items-center gap-1 md:hidden">
            <NavLink to="/locations" className={linkClass} aria-label="Cinemas">
              <MapPin size={18} />
            </NavLink>
            {user && (
              <NavLink to="/my-bookings" className={linkClass} aria-label="My tickets">
                <Ticket size={18} />
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink to="/admin" className={linkClass} aria-label="Admin">
                <ShieldCheck size={18} />
              </NavLink>
            )}
          </div>

          {user ? (
            <button onClick={handleLogout} className="btn-ghost px-3.5 sm:px-5" title="Log out">
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="btn-ghost">
                Log in
              </button>
              <button onClick={() => navigate("/signup")} className="btn-brass hidden sm:inline-flex">
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

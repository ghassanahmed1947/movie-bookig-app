import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Brand";

function Footer() {
  return (
    <footer id="contact" className="mt-auto border-t border-line bg-black/20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-smoke">
            Your neighbourhood cinema, online. Pick a film, pick a show, and
            your ticket is ready before the trailers start.
          </p>
        </div>

        <div className="text-sm">
          <h4 className="mb-4 text-xl text-paper">Explore</h4>
          <ul className="space-y-2.5 text-smoke">
            <li><Link to="/" className="hover:text-paper">Films</Link></li>
            <li><Link to="/locations" className="hover:text-paper">Cinemas</Link></li>
            <li><Link to="/my-bookings" className="hover:text-paper">My tickets</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <h4 className="mb-4 text-xl text-paper">Box office</h4>
          <ul className="space-y-3 text-smoke">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-brass" /> Main Boulevard, Karachi</li>
            <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-brass" /> +92 300 1234567</li>
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-brass" /> support@cinebook.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-smoke-2 sm:px-8">
          © {new Date().getFullYear()} CineBook. Made for people who stay for the credits.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

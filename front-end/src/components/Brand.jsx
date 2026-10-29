import { Link } from "react-router-dom";

// Chhota sa ticket jaisa logo + naam
export function Logo({ to = "/", subtitle }) {
  return (
    <Link to={to} className="group flex items-center gap-3" aria-label="CineBook home">
      <span
        className="ticket grid h-10 w-14 place-items-center rounded-md font-display text-lg font-extrabold text-paper-ink transition-transform duration-300 group-hover:-rotate-6"
        style={{ "--cut": "50%", "--notch": "5px", background: "var(--color-brass)" }}
      >
        CB
      </span>
      <span className="leading-none">
        <span className="block font-display text-2xl font-extrabold tracking-wide text-paper">
          CineBook
        </span>
        {subtitle && (
          <span className="mt-1 block text-[11px] text-smoke">{subtitle}</span>
        )}
      </span>
    </Link>
  );
}

// Marquee ki chamakti bulb wali frame
export function BulbFrame({ children, className = "", inset = 16 }) {
  return (
    <div
      className={`relative rounded-[28px] bg-gradient-to-b from-velvet to-velvet-deep ${className}`}
      style={{ padding: inset }}
    >
      <span className="bulb-strip left-6 right-6 top-0" style={{ height: inset }} aria-hidden />
      <span className="bulb-strip bottom-0 left-6 right-6" style={{ height: inset, animationDelay: "0.45s" }} aria-hidden />
      <span className="bulb-strip v bottom-6 left-0 top-6" style={{ width: inset, animationDelay: "0.45s" }} aria-hidden />
      <span className="bulb-strip v bottom-6 right-0 top-6" style={{ width: inset }} aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}

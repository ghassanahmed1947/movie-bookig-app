import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { Download, X, MapPin } from "lucide-react";
import { formatShowDate, formatShowTime } from "../utils/shows";

const INK = "#140b10";

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-paper-ink/55">{label}</p>
      <p className="mt-0.5 break-words font-display text-lg font-bold leading-tight">{value}</p>
    </div>
  );
}

// Ticket ki kati hui line + dono taraf gol cut
function Perforation() {
  return (
    <div className="relative h-6">
      <div className="absolute -left-3 top-0 h-6 w-6 rounded-full" style={{ background: INK }} />
      <div className="absolute -right-3 top-0 h-6 w-6 rounded-full" style={{ background: INK }} />
      <div className="perf-h absolute left-5 right-5 top-[11px]" />
    </div>
  );
}

function TicketModal({ booking, onClose }) {
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  // Escape dabane par popup band ho jaye
  useEffect(() => {
    if (!booking) return;
    setError("");

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [booking, onClose]);

  if (!booking) return null;

  const b = booking;
  const code = String(b._id).slice(-8).toUpperCase();

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    setDownloading(true);
    setError("");

    try {
      const dataUrl = await toPng(ticketRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: INK,
      });

      const safeTitle = b.movieTitle.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");

      const link = document.createElement("a");
      link.download = `CineBook-${safeTitle}-${code}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Ticket download failed:", err);
      setError("The ticket image couldn't be created. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-6 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Your ticket"
    >
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="rise-in relative w-full max-w-[372px]">
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-3xl font-extrabold text-paper">Your ticket</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-paper transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===== Ye hissa image ban kar download hota hai ===== */}
        <div ref={ticketRef} className="mx-auto w-[340px] p-4" style={{ background: INK }}>
          <div className="overflow-hidden rounded-[22px] bg-paper text-paper-ink">
            <div className="flex items-center justify-between bg-velvet px-5 py-3 text-paper">
              <span className="font-display text-xl font-extrabold tracking-wide">CineBook</span>
              <span className="rounded-full border border-paper/40 px-2.5 py-0.5 text-[11px]">E-ticket</span>
            </div>

            <div className="aspect-video bg-black">
              <img src={b.posterUrl} alt={b.movieTitle} className="h-full w-full object-cover" />
            </div>

            <div className="px-5 pb-4 pt-4">
              <h4 className="text-[34px] font-black leading-[0.95]">{b.movieTitle}</h4>

              {b.locationName && (
                <div className="mt-3 flex items-start gap-2 text-sm">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-velvet" />
                  <span>
                    <span className="font-semibold">
                      {b.locationName}, {b.locationCity}
                    </span>
                    {b.locationAddress && (
                      <span className="block text-xs text-paper-ink/60">{b.locationAddress}</span>
                    )}
                  </span>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {b.showDate ? (
                  <>
                    <Detail label="Date" value={formatShowDate(b.showDate)} />
                    <Detail label="Starts" value={formatShowTime(b.showTime)} />
                  </>
                ) : (
                  <Detail label="Showtime" value={b.showtime} />
                )}
                <Detail label="Seats" value={b.seats} />
                <Detail label="Name" value={b.customerName} />
              </div>
            </div>

            <Perforation />

            <div className="flex items-center gap-4 bg-paper-2 px-5 pb-5 pt-3">
              <div className="rounded-xl bg-white p-2">
                <QRCodeSVG value={String(b._id)} size={104} level="M" bgColor="#ffffff" fgColor="#2b1a12" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-paper-ink/55">Booking ID</p>
                <p className="font-display text-2xl font-black tracking-[0.12em]">{code}</p>
                <p className="mt-2 text-[11px] leading-snug text-paper-ink/60">
                  Show this QR code at the cinema entrance.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ===== Download hone wala hissa yahan khatam ===== */}

        {error && <div className="notice-err mt-4">{error}</div>}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-brass mt-4 w-full py-3.5 text-base"
        >
          <Download size={18} />
          {downloading ? "Preparing image…" : "Download ticket"}
        </button>

        <p className="mt-3 text-center text-xs text-smoke">
          Image apne phone ya laptop mein save karen aur cinema ke darwaze par dikhayen.
        </p>
      </div>
    </div>
  );
}

export default TicketModal;

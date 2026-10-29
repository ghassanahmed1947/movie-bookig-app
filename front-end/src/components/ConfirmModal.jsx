import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  // Escape dabane par popup band ho jaye
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true">
      {/* Dark backdrop (is par click karne se bhi band hoga) */}
      <div onClick={() => !loading && onCancel()} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="panel rise-in relative w-full max-w-md p-7 shadow-2xl shadow-black/60">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/5 text-smoke transition-colors hover:bg-white/10 hover:text-paper disabled:opacity-50"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-err/10 text-err">
          <AlertTriangle size={22} />
        </div>

        <h3 className="text-3xl font-extrabold text-paper">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-smoke">{message}</p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <button onClick={onCancel} disabled={loading} className="btn-ghost flex-1 py-3">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn flex-1 bg-err py-3 text-ink hover:bg-err/85"
          >
            {loading ? "Please wait…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

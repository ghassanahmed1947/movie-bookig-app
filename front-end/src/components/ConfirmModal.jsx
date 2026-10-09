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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark backdrop (is par click karne se bhi band hoga) */}
      <div
        onClick={() => !loading && onCancel()}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Popup box */}
      <div className="relative w-full max-w-md bg-[#0d1320] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/50">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <AlertTriangle className="text-red-500" size={26} />
        </div>

        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed mt-2">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-7">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold shadow-lg shadow-red-900/30 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
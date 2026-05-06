"use client";

import { create } from "zustand";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

interface ConfirmStore extends ConfirmState {
  show: (opts: {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  hide: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  open: false,
  title: "Confirm Action",
  message: "",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  onConfirm: null,
  onCancel: null,

  show: (opts) =>
    set({
      open: true,
      title: opts.title || "Confirm Action",
      message: opts.message,
      confirmLabel: opts.confirmLabel || "Confirm",
      cancelLabel: opts.cancelLabel || "Cancel",
      onConfirm: opts.onConfirm,
      onCancel: opts.onCancel || null,
    }),

  hide: () =>
    set({
      open: false,
      onConfirm: null,
      onCancel: null,
    }),
}));

// Shorthand helper
export const confirm = (message: string, onConfirm: () => void, title?: string) => {
  useConfirmStore.getState().show({ message, onConfirm, title });
};

export default function ConfirmDialog() {
  const { open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, hide } =
    useConfirmStore();

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm?.();
    hide();
  };

  const handleCancel = () => {
    onCancel?.();
    hide();
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="animate-fadeUp w-full max-w-sm rounded-[1.75rem] p-6 relative"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          style={{ color: "#475569" }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(239,68,68,0.1)" }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "#ef4444" }} />
          </div>
          <h3 className="text-lg font-black text-white">{title}</h3>
        </div>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all"
            style={{ border: "1px solid var(--border)" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

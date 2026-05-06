"use client";

import { create } from "zustand";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const handleConfirm = () => {
    onConfirm?.();
    hide();
  };

  const handleCancel = () => {
    onCancel?.();
    hide();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[1.75rem] p-6 relative border border-slate-200 dark:border-white/10 shadow-2xl"
          >
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{title}</h3>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{message}</p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 transition-all shadow-lg shadow-red-500/20"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

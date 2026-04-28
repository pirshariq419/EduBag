"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToastStore, Toast as ToastType } from "@/store/toastStore";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/30",
    icon: "text-emerald-500",
    bar: "bg-emerald-500",
    text: "text-emerald-900 dark:text-emerald-100",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/30",
    icon: "text-red-500",
    bar: "bg-red-500",
    text: "text-red-900 dark:text-red-100",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/30",
    icon: "text-blue-500",
    bar: "bg-blue-500",
    text: "text-blue-900 dark:text-blue-100",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/30",
    icon: "text-amber-500",
    bar: "bg-amber-500",
    text: "text-amber-900 dark:text-amber-100",
  },
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const colors = colorMap[toast.type];
  const Icon = iconMap[toast.type];
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / toast.duration!) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [toast.duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden w-full max-w-[380px] rounded-2xl border ${colors.bg} ${colors.border} shadow-xl backdrop-blur-xl`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div className={`mt-0.5 shrink-0 ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className={`flex-1 text-sm font-semibold leading-snug ${colors.text}`}>
          {toast.message}
        </p>
        <button
          onClick={() => removeToast(toast.id)}
          className="shrink-0 p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="h-[3px] w-full bg-black/5 dark:bg-white/5">
          <motion.div
            className={`h-full ${colors.bar}`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 w-[calc(100%-2rem)] max-w-[400px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full flex justify-center">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

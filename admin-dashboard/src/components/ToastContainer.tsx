"use client";

import { useEffect, useState } from "react";
import { useToastStore, Toast } from "@/store/toastStore";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap = {
  success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: "#10b981", bar: "#10b981", text: "#a7f3d0" },
  error:   { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  icon: "#ef4444", bar: "#ef4444", text: "#fecaca" },
  info:    { bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.25)", icon: "#818cf8", bar: "#6366f1", text: "#c7d2fe" },
  warning: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)", icon: "#f59e0b", bar: "#f59e0b", text: "#fde68a" },
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const s = styleMap[toast.type];
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
    <div
      className="animate-fadeUp relative overflow-hidden w-full max-w-[380px] rounded-2xl shadow-2xl"
      style={{ background: s.bg, border: `1px solid ${s.border}`, backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div className="mt-0.5 shrink-0">
          <Icon className="w-5 h-5" style={{ color: s.icon }} />
        </div>
        <p className="flex-1 text-sm font-semibold leading-snug" style={{ color: s.text }}>
          {toast.message}
        </p>
        <button
          onClick={() => removeToast(toast.id)}
          className="shrink-0 p-0.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
        </button>
      </div>
      {toast.duration && toast.duration > 0 && (
        <div className="h-[3px] w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full transition-none" style={{ width: `${progress}%`, background: s.bar }} />
        </div>
      )}
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 w-[calc(100%-2rem)] max-w-[400px] pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full flex justify-center">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}

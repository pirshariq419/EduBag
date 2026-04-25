"use client";
import { Bell, Search } from "lucide-react";

export default function Topbar({ title }: { title: string }) {
  return (
    <header
      className="flex items-center justify-between px-8 py-4 sticky top-0 z-20"
      style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}
    >
      <div>
        <h1 className="text-xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-xs font-semibold mt-0.5" style={{ color: "#334155" }}>
          EduBag Owner Panel
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "#475569" }}
        >
          <Bell className="w-4 h-4" />
        </button>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "#6366f1" }}
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Admin
        </div>
      </div>
    </header>
  );
}

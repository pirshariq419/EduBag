"use client";
import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import api from "@/lib/api";
import {
  Users, BookOpen, FileText, CreditCard,
  TrendingUp, Activity, ArrowUpRight, Sparkles, Building2
} from "lucide-react";

interface Stats {
  users: number;
  notes: number;
  tests: number;
  resources: number;
  colleges: number;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats>({ users: 0, notes: 0, tests: 0, resources: 0, colleges: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [u, n, t, r, c] = await Promise.allSettled([
          api.get("/auth/users"),
          api.get("/notes"),
          api.get("/tests"),
          api.get("/resources"),
          api.get("/colleges"),
        ]);
        setStats({
          users:     u.status === "fulfilled" ? (u.value.data.count || u.value.data.data?.length || 0) : 0,
          notes:     n.status === "fulfilled" ? (n.value.data.count || n.value.data.data?.length || 0) : 0,
          tests:     t.status === "fulfilled" ? (t.value.data.count || t.value.data.data?.length || 0) : 0,
          resources: r.status === "fulfilled" ? (r.value.data.count || r.value.data.data?.length || 0) : 0,
          colleges:  c.status === "fulfilled" ? (c.value.data.count || c.value.data.data?.length || 0) : 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const cards = [
    { label: "Total Users",      value: stats.users,     icon: Users,    color: "#6366f1", bg: "rgba(99,102,241,0.1)"  },
    { label: "Academic Assets",  value: stats.resources, icon: FileText, color: "#06b6d4", bg: "rgba(6,182,212,0.1)"   },
    { label: "Colleges Listed",  value: stats.colleges,  icon: Building2, color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
    { label: "System Alerts",    value: "0 Active",      icon: Activity, color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  ];

  const activity = [
    { text: "New PYQ uploaded: JKBOSE Class 12 Physics 2024",    time: "2 mins ago",   dot: "#6366f1" },
    { text: "Syllabus updated: NEET UG 2025",                     time: "18 mins ago",  dot: "#10b981" },
    { text: "New user registered: ali.khan@gmail.com",            time: "1 hour ago",   dot: "#8b5cf6" },
    { text: "College added: GMC Handwara",                        time: "3 hours ago",  dot: "#f59e0b" },
  ];

  return (
    <div>
      <Topbar title="Overview" />
      <div className="px-4 md:px-8 py-8 space-y-10">

        {/* Welcome Banner */}
        <div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" style={{ color: "#818cf8" }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#6366f1" }}>
                  Welcome back, Owner
                </span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">EduBag Control Center</h2>
              <p className="text-sm mt-1 font-medium" style={{ color: "#475569" }}>
                Manage your entire platform from here — PYQs, Syllabi, Colleges & Users.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-green-400">System Online</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div key={c.label} className="card card-hover p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                  <c.icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4" style={{ color: "#1e293b" }} />
              </div>
              {loading ? (
                <div className="h-8 w-16 rounded-lg animate-pulse" style={{ background: "var(--surface2)" }} />
              ) : (
                <p className="text-3xl font-black text-white">{c.value}</p>
              )}
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>{c.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-sm uppercase tracking-wider">Live Activity</h3>
              <span className="badge badge-green">Live</span>
            </div>
            <div className="space-y-4">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: a.dot, boxShadow: `0 0 6px ${a.dot}` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 leading-snug">{a.text}</p>
                    <p className="text-xs mt-0.5 font-semibold" style={{ color: "#334155" }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-black text-white text-sm uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Manage PYQs",    href: "/dashboard/pyq",      color: "#6366f1" },
                { label: "Manage Syllabus", href: "/dashboard/syllabus",  color: "#8b5cf6" },
                { label: "Manage Colleges", href: "/dashboard/colleges",  color: "#f59e0b" },
                { label: "View Users",      href: "/dashboard/users",     color: "#10b981" },
              ].map((q) => (
                <a
                  key={q.label}
                  href={q.href}
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] hover:opacity-90"
                  style={{ background: `${q.color}20`, border: `1px solid ${q.color}30`, color: q.color }}
                >
                  {q.label}
                </a>
              ))}
            </div>

            {/* Revenue snapshot */}
            <div
              className="mt-2 rounded-2xl p-5"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f59e0b" }}>Monthly Revenue</p>
                  <p className="text-2xl font-black text-white mt-1">₹24,500</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-black text-green-400">+18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

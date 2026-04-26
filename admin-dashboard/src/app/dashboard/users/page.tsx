"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { Search, Crown, Users, Shield } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  examTarget?: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/auth/users")
      .then((r) => setUsers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const students = users
    .filter(u => u.role !== "admin")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filtered = students.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.phone && u.phone.toLowerCase().includes(search.toLowerCase()))
  );


  return (
    <div>
      <Topbar title="Users" />
      <div className="px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Students",  value: students.length,                                color: "#6366f1" },
          ].map((s) => (
            <div key={s.label} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                <Users className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..." className="input pl-11" />
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                  {["Name", "Email", "Phone", "Exam Target", "Role", "Joined"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>No users found</td></tr>
                ) : filtered.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white"
                          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-200">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{u.email || "—"}</td>
                    <td className="px-5 py-4 text-slate-400">{u.phone || "—"}</td>
                    <td className="px-5 py-4 text-slate-400">{u.examTarget || "—"}</td>
                    <td className="px-5 py-4">
                      {u.role === "admin"
                        ? <span className="badge badge-red"><Shield className="w-3 h-3" /> Admin</span>
                        : <span className="badge badge-gray">User</span>}
                    </td>

                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

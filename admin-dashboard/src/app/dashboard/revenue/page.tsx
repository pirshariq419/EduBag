"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import { CreditCard, TrendingUp, IndianRupee, Users, Loader2 } from "lucide-react";

export default function RevenuePage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/payments");
        setPayments(res.data.data || []);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalSubscribers = new Set(payments.map(p => p.user?._id)).size;

  const stats = [
    { label: "Total Revenue",    value: `₹${totalRevenue.toLocaleString()}`, change: "All Time", icon: IndianRupee,  color: "#f59e0b" },
    { label: "Unique Customers", value: totalSubscribers,                    change: "Lifetime", icon: Users,        color: "#6366f1" },
    { label: "Total Sales",      value: payments.length,                    change: "Completed", icon: CreditCard,   color: "#8b5cf6" },
    { label: "Avg Ticket",       value: `₹${payments.length ? Math.round(totalRevenue / payments.length) : 0}`, change: "Per Order", icon: TrendingUp,   color: "#10b981" },
  ];

  return (
    <div>
      <Topbar title="Revenue" />
      <div className="px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <span className="badge badge-green">{s.change}</span>
              </div>
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-black text-white text-sm uppercase tracking-widest">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                  {["User", "Plan", "Amount", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>Loading...</td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#334155" }}>No transactions found.</td></tr>
                ) : payments.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-semibold text-slate-200">{t.user?.name || "Deleted User"}</td>
                    <td className="px-5 py-4"><span className={`badge badge-indigo`}>{t.planType || "Pro"}</span></td>
                    <td className="px-5 py-4 font-black text-white">₹{t.amount}</td>
                    <td className="px-5 py-4 text-slate-400">{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-4"><span className="badge badge-green">{t.status}</span></td>
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

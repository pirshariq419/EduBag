"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Shield, Eye, EyeOff, Loader2, Lock, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Admin login strictly uses email, but backend expects 'identifier'
      const res = await api.post("/auth/login", { identifier: email, password });
      const { token } = res.data;
      
      localStorage.setItem("edubag_admin_token", token);
      const me = await api.get("/auth/me");
      
      if (me.data.data?.role !== "admin") {
        localStorage.removeItem("edubag_admin_token");
        setError("Access denied. You are not an admin.");
        return;
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div
        className="relative w-full max-w-md animate-fadeUp"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "2rem",
          padding: "3rem",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-white">
              EduBag <span style={{ color: "#818cf8" }}>Admin</span>
            </h1>
            <p className="text-xs font-semibold mt-1" style={{ color: "#475569" }}>
              OWNER CONTROL CENTER
            </p>
          </div>
        </div>

        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <Lock className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@edubag.in"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#475569" }}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2 py-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "#475569" }}>
          Restricted access · EduBag Owner only
        </p>
      </div>
    </div>
  );
}

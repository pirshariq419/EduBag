"use client";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import api from "@/lib/api";
import { Lock, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/updatepassword", {
        currentPassword,
        newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err?.response?.data?.error || 'Failed to update password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Topbar title="Account Settings" />
      <div className="px-8 py-8 max-w-2xl">
        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Security</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update your admin credentials</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-fadeUp ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
          <h3 className="text-sm font-black text-indigo-400 mb-2">Security Tip</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use a combination of letters, numbers, and symbols to create a strong password. 
            Avoid using the same password you use for other accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

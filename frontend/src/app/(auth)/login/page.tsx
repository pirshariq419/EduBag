"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Lock, ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend login now strictly uses email to match admin security
    await login(email, password);
    const token = localStorage.getItem("edubag_token");
    if (token) router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] dark:bg-[#0b0b0d] flex flex-col items-center justify-center px-4 py-20 pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px]"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2d2f31] dark:text-white mb-2">
            Log in to your EduBag account
          </h1>
          <div className="h-1 w-12 bg-[#a435f0] rounded-full" />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1c1d1f] p-8 border border-[#d1d7dc] dark:border-white/10 shadow-sm rounded-lg">
          {error && (
            <div className="bg-[#fcbca0] text-[#2d2f31] px-4 py-3 rounded-md mb-6 text-sm font-bold flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded-full text-xs">!</span>
              {error}
              <button onClick={clearError} className="ml-auto">×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-[#2d2f31] dark:text-white">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-md border border-[#2d2f31] dark:border-white/20 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2d2f31] dark:focus:ring-white transition text-sm font-medium dark:text-white"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-[#2d2f31] dark:text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 rounded-md border border-[#2d2f31] dark:border-white/20 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2d2f31] dark:focus:ring-white transition text-sm font-medium pr-12 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a435f0] text-white py-4 rounded-md font-bold hover:bg-[#8710d8] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4 flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#d1d7dc] dark:border-white/10 text-center">
            <p className="text-sm text-[#2d2f31] dark:text-slate-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#a435f0] font-bold hover:text-[#8710d8] underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-[#6a6f73] dark:text-slate-500 leading-relaxed px-4">
          By logging in, you agree to our Terms of Use and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

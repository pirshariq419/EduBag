"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Eye, EyeOff, Target, ArrowRight, User as UserIcon, Phone, Mail, Camera, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [examTarget, setExamTarget] = useState("N/A");
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { register, loading, error, clearError, loadUser } = useAuthStore();
  const router = useRouter();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Just show a local preview for now
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      alert("Please provide either an email or phone number.");
      return;
    }

    try {
      // 1. Register the user
      await register(name, email, phone, password, examTarget);
      
      // Check if registration was successful (token exists)
      const token = localStorage.getItem("edubag_token");
      if (!token) return;

      // 2. If there's an avatar file, upload it now that we are logged in
      if (avatarFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("type", "avatar");

        const res = await api.post("/uploads", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        // 3. Update user details with the uploaded avatar URL
        await api.put("/auth/updatedetails", { avatar: res.data.data });
        await loadUser();
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] dark:bg-[#0b0b0d] flex flex-col items-center justify-center px-4 py-20 pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px]"
      >
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-[#2d2f31] dark:text-white mb-2">
            Sign up and start learning
          </h1>
          <div className="h-1 w-12 bg-[#a435f0] rounded-full mx-auto sm:mx-0" />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1c1d1f] p-8 border border-[#d1d7dc] dark:border-white/10 shadow-sm rounded-lg relative z-10">
          {error && (
            <div className="bg-[#fcbca0] text-[#2d2f31] px-4 py-3 rounded-md mb-6 text-sm font-bold flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded-full text-xs">!</span>
              {error}
              <button onClick={clearError} className="ml-auto text-lg leading-none">×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#a435f0]">
                  {avatar ? (
                    <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-[#a435f0] text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Profile Picture (Optional)</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-bold text-[#2d2f31] dark:text-white">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-md border border-[#2d2f31] dark:border-white/20 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2d2f31] dark:focus:ring-white transition text-sm font-medium dark:text-white"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-[#2d2f31] dark:text-white">Email Address</label>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">At least one required</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 pl-10 rounded-md border border-[#2d2f31] dark:border-white/20 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2d2f31] dark:focus:ring-white transition text-sm font-medium dark:text-white"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-[#2d2f31] dark:text-white">Phone Number</label>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">At least one required</span>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 7006XXXXXX"
                  className="w-full px-4 py-3 pl-10 rounded-md border border-[#2d2f31] dark:border-white/20 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2d2f31] dark:focus:ring-white transition text-sm font-medium dark:text-white"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-[#2d2f31] dark:text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
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

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-[#2d2f31] dark:text-white">Exam Target</label>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Optional</span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 rounded-md border border-[#2d2f31] dark:border-white/20 bg-transparent dark:bg-[#1c1d1f] flex items-center justify-between text-sm font-medium text-[#2d2f31] dark:text-white hover:border-[#a435f0] transition-all"
                >
                  <span className="truncate">
                    {examTarget === "N/A" ? "N/A / Not Decided" : examTarget === "JEE" ? "JEE (Engineering)" : examTarget === "NEET" ? "NEET (Medical)" : examTarget === "BOARDS" ? "Board Exams" : "Other"}
                  </span>
                  <Target className={`w-4 h-4 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180 text-[#a435f0]' : 'text-gray-400'}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 top-full mt-2 left-0 w-full bg-white dark:bg-[#1c1d1f] border border-[#d1d7dc] dark:border-white/10 rounded-lg shadow-2xl overflow-hidden"
                      >
                        {[
                          { id: "N/A", label: "N/A / Not Decided" },
                          { id: "JEE", label: "JEE (Engineering)" },
                          { id: "NEET", label: "NEET (Medical)" },
                          { id: "BOARDS", label: "Board Exams" },
                          { id: "OTHER", label: "Other" },
                        ].map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setExamTarget(option.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                              examTarget === option.id ? 'text-[#a435f0] bg-[#a435f0]/5' : 'text-[#2d2f31] dark:text-white'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a435f0] text-white py-4 rounded-md font-bold hover:bg-[#8710d8] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4 flex items-center justify-center gap-2"
            >
              {loading ? "Creating account..." : "Sign up"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#d1d7dc] dark:border-white/10 text-center">
            <p className="text-sm text-[#2d2f31] dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#a435f0] font-bold hover:text-[#8710d8] underline underline-offset-4">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-[#6a6f73] dark:text-slate-500 leading-relaxed px-4">
          By signing up, you agree to our Terms of Use and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

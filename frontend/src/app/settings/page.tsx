"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Settings as SettingsIcon, Save, Loader2, 
  Shield, CreditCard, ChevronLeft, Crown, Target,
  Bell, Key, LogOut, CheckCircle2, AlertCircle,
  Mail, Phone, Camera, Trash2
} from "lucide-react";
import Link from "next/link";

type Section = "profile" | "security";

export default function SettingsPage() {
  const { user, loadUser, logout } = useAuthStore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    examTarget: "General",
    avatar: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        examTarget: user.examTarget || "General",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Convert image to a small base64 data URI (stored directly in MongoDB)
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX = 200; // 200x200 max for avatars
            let w = img.width, h = img.height;
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else       { w = Math.round(w * MAX / h); h = MAX; }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
          };
          img.onerror = reject;
          img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Update local form state
      setForm(prev => ({ ...prev, avatar: dataUri }));
      
      // Save directly to database (no file upload needed)
      await api.put("/auth/updatedetails", { 
        ...form,
        avatar: dataUri 
      });
      
      // Reload user in auth store
      await loadUser();
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err?.response?.data?.error || "Failed to upload image. Please try a smaller file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.put("/auth/updatedetails", form);
      await loadUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const MENU_ITEMS: { id: Section; label: string; icon: any; color: string }[] = [
    { id: "profile",      label: "My Profile",   icon: User,       color: "indigo" },
    { id: "security",     label: "Security",     icon: Shield,     color: "red" },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group">
              <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Hub</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Manage your EduBag experience</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Active</span>
            </div>
            <button 
              onClick={() => { logout(); router.push("/"); }}
              className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {MENU_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all relative group ${
                    active 
                    ? "bg-white/10 border border-white/10 text-white shadow-xl shadow-black/20" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-indigo-400' : 'group-hover:text-slate-300'}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                  {active && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-8 mb-12">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-[2.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl group-hover:rotate-6 transition-transform overflow-hidden">
                          {form.avatar ? (
                            <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                          
                          {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        
                        <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-500 text-white shadow-lg cursor-pointer hover:bg-indigo-600 hover:scale-110 transition-all">
                          <Camera className="w-4 h-4" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                        </label>

                        {form.avatar && (
                          <button 
                            onClick={() => {
                              setForm({...form, avatar: ""});
                              api.put("/auth/updatedetails", { ...form, avatar: null });
                            }}
                            className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-red-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight mb-1">{user.name}</h2>
                        <div className="flex flex-col gap-1">
                          {user.email && <p className="text-slate-500 font-bold text-sm">{user.email}</p>}
                          {user.phone && <p className="text-slate-500 font-bold text-sm">{user.phone}</p>}
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Display Name</label>
                          <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                              required
                              value={form.name}
                              onChange={(e) => setForm({...form, name: e.target.value})}
                              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                              type="email"
                              value={form.email}
                              onChange={(e) => setForm({...form, email: e.target.value})}
                              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Phone Number</label>
                          <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                              value={form.phone}
                              onChange={(e) => setForm({...form, phone: e.target.value})}
                              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Academic Path</label>
                          <div className="relative group">
                            <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <select 
                              value={form.examTarget}
                              onChange={(e) => setForm({...form, examTarget: e.target.value})}
                              className="w-full pl-14 pr-12 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all appearance-none text-white"
                            >
                              <option className="bg-[#1a1b23]" value="General">General</option>
                              <option className="bg-[#1a1b23]" value="NEET">NEET UG</option>
                              <option className="bg-[#1a1b23]" value="JEE">JEE Mains</option>
                              <option className="bg-[#1a1b23]" value="BOARDS">JKBOSE / Boards</option>
                              <option className="bg-[#1a1b23]" value="OTHER">Other Exams</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 border-t border-white/5">
                        <button 
                          disabled={loading}
                          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {loading ? "Updating..." : "Save Profile"}
                        </button>
                        {success && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-green-400 font-bold text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Settings updated successfully
                          </motion.div>
                        )}
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}



              {activeSection === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
                >
                   <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                   <div className="relative z-10">
                      <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-xl">
                          <Key className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black tracking-tight mb-1">Update Security</h2>
                          <p className="text-slate-500 font-bold text-sm">Last updated {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>

                      <PasswordChangeForm />
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-700 font-bold text-[10px] uppercase tracking-[0.3em] mt-24">
          EduBag Privacy & Security · Managed Encryption Active
        </p>
      </div>
    </div>
  );
}

function PasswordChangeForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match");
    }

    setLoading(true);
    try {
      await api.put("/auth/updatepassword", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Current Password</label>
          <div className="relative group">
            <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-400 transition-colors" />
            <input 
              type="password"
              required
              value={form.currentPassword}
              onChange={(e) => setForm({...form, currentPassword: e.target.value})}
              placeholder="••••••••••••"
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-red-500 outline-none font-bold text-sm transition-all" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">New Password</label>
            <input 
              type="password"
              required
              value={form.newPassword}
              onChange={(e) => setForm({...form, newPassword: e.target.value})}
              placeholder="Min. 8 chars"
              className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Confirm New</label>
            <input 
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
              placeholder="Repeat password"
              className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all" 
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 text-red-400 text-xs font-bold px-2"
          >
            <AlertCircle className="w-4 h-4" /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 text-green-400 text-xs font-bold px-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Password updated successfully
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        disabled={loading}
        className="w-full md:w-auto px-12 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 hover:-translate-y-1 transition-all disabled:opacity-50 shadow-xl"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

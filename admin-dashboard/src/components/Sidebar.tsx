"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, FileText, BookOpen, GraduationCap,
  Users, CreditCard, LogOut, Shield, ChevronRight,
  Settings, List, CheckSquare, MessageSquare, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { label: "Overview",  href: "/dashboard",          icon: LayoutDashboard },
  { label: "Mock Tests",href: "/dashboard/tests",    icon: CheckSquare },
  { label: "Forum",     href: "/dashboard/forum",    icon: MessageSquare },
  { label: "Exams",     href: "/dashboard/categories", icon: List },
  { label: "PYQ Papers",href: "/dashboard/pyq",       icon: FileText },
  { label: "Syllabus",  href: "/dashboard/syllabus",  icon: BookOpen },
  { label: "Colleges",  href: "/dashboard/colleges",  icon: GraduationCap },
  { label: "Users",     href: "/dashboard/users",     icon: Users },

  { label: "Settings",  href: "/dashboard/settings",  icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("edubag_admin_token");
    router.push("/login");
  };

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5 shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-white leading-none">EduBag</p>
          <p className="text-[10px] font-bold mt-0.5 uppercase tracking-widest text-indigo-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${active ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-40" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1 border-t border-white/5 pt-4 shrink-0">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold w-full text-left text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4 shrink-0" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/30"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 shrink-0 sticky top-0 bg-[#0a0a0f] border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a0f] z-50 flex flex-col border-r border-white/10 shadow-2xl"
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-6 right-4 p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

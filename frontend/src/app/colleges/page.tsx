"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CollegeCard from "@/components/CollegeCard";
import { Sparkles, Stethoscope, Laptop, Building2, Search, Filter, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

interface College {
  _id: string;
  name: string;
  image: string;
  location: string;
  description: string;
  websiteUrl: string;
  category?: string;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const res = await api.get("/colleges");
        setColleges(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const TABS = [
    { name: "All",         icon: Building2,   color: "indigo" },
    { name: "Medical",     icon: Stethoscope, color: "teal" },
    { name: "Engineering", icon: Laptop,      color: "blue" },
    { name: "General",     icon: GraduationCap, color: "purple" },
  ];

  const filtered = useMemo(() => {
    return colleges.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.location.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "All" || c.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [colleges, search, activeTab]);

  const handleCollegeClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 pb-24 relative overflow-hidden min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10 md:mb-16 pt-6 md:pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] md:text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm mb-4 md:mb-6"
          >
            <Sparkles className="w-3 md:w-4 h-3 md:h-4" /> Higher Education
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6 px-4"
          >
            Institution <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Explorer</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed px-6"
          >
            Explore the best medical, engineering, and general degree colleges across Jammu and Kashmir to plan your academic journey.
          </motion.p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="mb-8 md:mb-12 space-y-6 md:space-y-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Tabs */}
            <div className="flex items-center justify-start sm:justify-center p-1 md:p-1.5 bg-white dark:bg-slate-900 rounded-2xl md:rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto w-full lg:w-auto scrollbar-hide pb-1 md:pb-1.5">
              {TABS.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                    activeTab === tab.name 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <tab.icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or city..."
                className="w-full pl-11 pr-4 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-indigo-500 outline-none font-bold text-sm text-slate-700 dark:text-slate-200 shadow-sm group-hover:shadow-md transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-96 rounded-[2rem] bg-slate-200 dark:bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">No Institutions Found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((college) => (
                <motion.div
                  layout
                  key={college._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <CollegeCard 
                    name={college.name}
                    image={college.image}
                    description={college.description}
                    link={college.websiteUrl}
                    location={college.location}
                    onLockedClick={() => handleCollegeClick(college.websiteUrl)}
                    isLocked={false} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

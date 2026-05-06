"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { motion } from "framer-motion";
import {
  BookOpen, ClipboardCheck, GraduationCap, Crown,
  TrendingUp, Clock, Star, ChevronRight, BarChart3,
  User, Settings, LogOut, Zap, ShieldCheck, Target,
  ArrowUpRight, Sparkles
} from "lucide-react";

interface RecentResult {
  _id: string;
  test: { title: string; exam?: string; subject?: string };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

export default function DashboardPage() {
  const { user, loadUser, logout } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ testsTaken: 0, highestScore: 0, avgScore: 0 });
  const [recentResults, setRecentResults] = useState<RecentResult[]>([]);

  useEffect(() => {
    const init = async () => {
      await loadUser();
      const token = localStorage.getItem("edubag_token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await api.get("/tests/my-results");
        const results: RecentResult[] = res.data.data || [];
        setRecentResults(results.slice(0, 3));

        if (results.length > 0) {
          const testsTaken = results.length;
          let highestScore = 0;
          let totalScorePercentage = 0;

          results.forEach((r) => {
            const percentage = Math.round((r.score / r.totalQuestions) * 100) || 0;
            if (percentage > highestScore) highestScore = percentage;
            totalScorePercentage += percentage;
          });

          setStats({
            testsTaken,
            highestScore,
            avgScore: Math.round(totalScorePercentage / testsTaken)
          });
        }
      } catch { /* ignore */ }
    };
    init();
  }, [loadUser, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-md" 
        />
      </div>
    );
  }

  const quickLinks = [
    { title: "Study Hub", desc: "Learn Now", icon: BookOpen, href: "/learn", color: "from-blue-500 to-indigo-500" },
    { title: "PYQ Bank", desc: "Archive 2013-26", icon: BarChart3, href: "/pyq", color: "from-indigo-500 to-purple-500" },
    { title: "Syllabus", desc: "Exam Guides", icon: ShieldCheck, href: "/syllabus", color: "from-purple-500 to-pink-500" },
    { title: "Colleges", desc: "Explore JK", icon: GraduationCap, href: "/colleges", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        
        {/* Top Profile Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                  Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{user.name.split(' ')[0]}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                   <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                     {user.examTarget || "General"} Student
                   </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/settings" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
               <Settings className="w-5 h-5" />
             </Link>
             <button 
               onClick={() => { logout(); router.push("/"); }}
               className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold uppercase text-[11px] tracking-widest hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-all border border-red-100 dark:border-transparent"
             >
               <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="md:col-span-2 relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                  <Target className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Avg Test Score</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.avgScore}% <span className="text-lg text-slate-400 font-bold">Accuracy</span></p>
                </div>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.avgScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                <span className="uppercase tracking-widest mr-2 text-[10px] text-indigo-500">Next Goal:</span>
                Improve average to {Math.min(100, stats.avgScore + 10)}%
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
             <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2 border border-emerald-100 dark:border-emerald-500/20">
               <TrendingUp className="w-7 h-7" />
             </div>
             <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">{stats.testsTaken}</p>
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mock Tests Taken</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
             <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 border border-blue-100 dark:border-blue-500/20">
               <BookOpen className="w-7 h-7" />
             </div>
             <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">{stats.highestScore}%</p>
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Highest Score</p>
          </motion.div>
        </div>

        {/* Action Grid & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
               <Sparkles className="w-6 h-6 text-indigo-500" /> Essential Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quickLinks.map((item, idx) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>{/* end lg:col-span-2 */}

          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
               <Clock className="w-6 h-6 text-purple-500" /> Recent Tests
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-6 shadow-sm flex flex-col">
               {recentResults.length > 0 ? (
                 <div className="space-y-4 flex-grow">
                   {recentResults.map((result) => (
                     <div key={result._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                       <div>
                         <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{result.test?.title || "Mock Test"}</p>
                         <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{new Date(result.completedAt).toLocaleDateString()}</p>
                       </div>
                       <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full font-black text-xs">
                         {Math.round((result.score / result.totalQuestions) * 100) || 0}%
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-12 text-center flex flex-col items-center justify-center flex-grow">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">No tests taken yet</p>
                  </div>
               )}
              <Link href="/tests" className="block w-full py-4 mt-4 text-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border-t border-slate-100 dark:border-white/5">
                Take a Mock Test
              </Link>
            </div>

            {/* Daily Tip Card */}
            <div className="p-8 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 space-y-4">
               <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                 <ShieldCheck className="w-4 h-4" /> Study Tip
               </div>
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                 "Consistent 2-hour focused sessions are better than 8-hour marathon burns. Use the Pomodoro technique to stay sharp."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

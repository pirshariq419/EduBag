"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Brain, Clock, Search, ShieldCheck, ChevronRight, X } from "lucide-react";

interface Test {
  _id: string;
  title: string;
  type: string;
  exam: string;
  subject: string;
  durationMinutes: number;
  isPremium: boolean;
  questions: any[];
}

export default function TestsHubPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get("/tests");
        setTests(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleTakeTest = (test: Test) => {
    router.push(`/tests/${test._id}`);
  };

  const filtered = tests.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    (t.exam && t.exam.toLowerCase().includes(search.toLowerCase())) ||
    (t.subject && t.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
      <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 pt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
          >
            <Brain className="w-4 h-4" /> Interactive Learning
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Mock Test <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Engine</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto text-lg">
            Evaluate your preparation with timed mock tests and receive detailed post-test performance analysis.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by exam (e.g. NEET), subject, or title..."
            className="w-full pl-14 pr-6 py-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-indigo-500 outline-none font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-bold">No mock tests found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((test) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${test.type === 'Full-Length' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                    {test.type}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{test.title}</h3>
                
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
                  {test.exam && <span className="uppercase tracking-wide">{test.exam}</span>}
                  {test.exam && test.subject && <span>•</span>}
                  {test.subject && <span>{test.subject}</span>}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> {test.durationMinutes} Mins</div>
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-500" /> {test.questions?.length || 0} Qs</div>
                  </div>

                  <button 
                    onClick={() => handleTakeTest(test)}
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] shadow-lg shadow-slate-200 dark:shadow-none"
                  >
                    Start Test <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, FileText,
  BookOpen, Calendar, Sparkles, Zap, Eye, Search
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import Image from "next/image";
import api from "@/lib/api";
import dynamic from "next/dynamic";

const PdfViewerModal = dynamic(() => import("@/components/PdfViewerModal"), { ssr: false });

interface Subject {
  name: string;
  url: string;
}

interface YearData {
  year: number;
  subjects: Subject[];
}

interface ClassData {
  name: string;
  years: YearData[];
}

interface ExamCategory {
  id: string;
  name: string;
  logo?: string;
  classes?: ClassData[];
  years?: YearData[];
}

export default function PYQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [openClass, setOpenClass] = useState<string | null>(null);
  const [openYear, setOpenYear] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewerPdf, setViewerPdf] = useState<{ url: string; name: string } | null>(null);
  const { user } = useAuthStore();

  const [categories, setCategories] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, resRes] = await Promise.all([
          api.get("/categories"),
          api.get("/resources?type=pyq"),
        ]);
        setCategories(catRes.data.data || []);
        setResources(resRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build the structured exam data from API responses
  const examData: ExamCategory[] = useMemo(() => {
    // Filter resources based on searchTerm
    const filteredResources = (resources || []).filter((r: any) => {
      if (!searchTerm.trim()) return true;
      const search = searchTerm.toLowerCase();
      return (
        r.title?.toLowerCase().includes(search) ||
        r.subject?.toLowerCase().includes(search) ||
        r.exam?.toLowerCase().includes(search) ||
        r.class?.toLowerCase().includes(search) ||
        String(r.year).includes(search)
      );
    });

    // Get categories that show on PYQ pages (type === 'pyq' or 'all')
    const pyqCategories = (categories || []).filter(
      (c: any) => c && c.type !== "syllabus"
    );

    // Build exam data structure
    const exams: ExamCategory[] = pyqCategories.map((cat: any) => {
      const exam: ExamCategory = {
        id: cat.id,
        name: cat.name,
        logo: cat.logo,
      };

      // Get all resources for this exam
      const examResources = filteredResources.filter(
        (r: any) => r.exam === cat.id
      );

      // If we are searching and this exam has no matching resources, we might want to skip it
      // unless the exam name itself matches.
      if (searchTerm.trim() && examResources.length === 0 && !cat.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null;
      }

      // Separate class-based resources from direct year-based
      const classResources = examResources.filter((r: any) => r.class);
      const directResources = examResources.filter((r: any) => !r.class);

      // Build class-based structure
      if (classResources.length > 0) {
        const classMap: Record<string, YearData[]> = {};
        classResources.forEach((r: any) => {
          if (!classMap[r.class]) classMap[r.class] = [];
          let yearEntry = classMap[r.class].find((y) => y.year === r.year);
          if (!yearEntry) {
            yearEntry = { year: r.year, subjects: [] };
            classMap[r.class].push(yearEntry);
          }
          yearEntry.subjects.push({ name: r.title || r.subject, url: r.fileUrl });
        });

        exam.classes = Object.entries(classMap).map(([name, years]) => ({
          name,
          years: years.sort((a, b) => b.year - a.year),
        }));
      }

      // Build direct year-based structure
      if (directResources.length > 0) {
        const yearMap: Record<number, Subject[]> = {};
        directResources.forEach((r: any) => {
          if (!yearMap[r.year]) yearMap[r.year] = [];
          yearMap[r.year].push({ name: r.title || r.subject, url: r.fileUrl });
        });

        exam.years = Object.entries(yearMap)
          .map(([year, subjects]) => ({ year: Number(year), subjects }))
          .sort((a, b) => b.year - a.year);
      }

      return exam;
    }).filter(Boolean) as ExamCategory[];

    return exams;
  }, [categories, resources, searchTerm]);

  const mainCategory = examData.find((c) => c.id === "jkbose");
  const otherCategories = examData.filter((c) => c.id !== "jkbose");

  const openPdfViewer = (url: string, name: string) => {
    setViewerPdf({ url, name });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
      <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 pt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Academic Resource Hub
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Previous Year <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600 dark:from-indigo-400 dark:to-teal-400">Papers</span>
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-600 to-teal-600 mx-auto rounded-full mt-4 opacity-80" />
        </div>

        {/* Local Search Bar */}
        <div className="mb-12 relative group max-w-2xl mx-auto">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            placeholder="Search papers by subject, year or exam (e.g. 'Physics 2024')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-[2rem] py-5 pl-14 pr-6 text-sm md:text-base font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm hover:shadow-md dark:text-white"
          />
        </div>

        {/* Main Content Area (JKBOSE) */}
        {mainCategory && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-200 dark:border-white/10 mb-8 transition-all hover:shadow-xl">
            <div className="p-1">
              <button
                onClick={(e) => {
                  const target = e.currentTarget;
                  const isOpening = openId !== "jkbose";
                  setOpenId(isOpening ? "jkbose" : null);
                  if (isOpening) {
                    setTimeout(() => {
                      const y = target.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }, 300);
                  }
                }}
                className={`w-full p-8 flex flex-col items-center justify-center gap-6 transition-all duration-500 rounded-[2rem] ${
                  openId === "jkbose" ? "bg-slate-900 dark:bg-slate-800 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-24 h-24 rounded-[2rem] p-3 flex items-center justify-center overflow-hidden transition-all duration-500 shadow-sm ${
                    openId === "jkbose" ? "bg-white scale-110 shadow-lg" : "bg-slate-50 dark:bg-white/10"
                  }`}>
                    <Image 
                      src={mainCategory.logo || "/images/jkbose.png"} 
                      alt="JKBOSE" 
                      width={90} 
                      height={90} 
                      style={{ width: "auto", height: "auto" }}
                      className="object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/90?text=JKBOSE"; }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl font-black tracking-tight ${openId === "jkbose" ? "text-white" : "text-slate-900 dark:text-white"}`}>{mainCategory.name}</span>
                    <div className={`transition-transform duration-500 ${openId === "jkbose" ? "rotate-180 text-indigo-500" : "text-slate-400"}`}>
                      <ChevronDown className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {openId === "jkbose" && mainCategory.classes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 space-y-6 overflow-hidden"
                  >
                    {mainCategory.classes.map((cls) => {
                      const isClsOpen = openClass === cls.name;
                      return (
                        <div key={cls.name} className="space-y-4">
                          <button
                            onClick={() => setOpenClass(isClsOpen ? null : cls.name)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border ${
                              isClsOpen 
                              ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 shadow-md" 
                              : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5"
                            }`}
                          >
                            <span className="font-bold text-lg text-slate-900 dark:text-white">{cls.name} Archive</span>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isClsOpen ? "rotate-180" : ""}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isClsOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="pl-4 space-y-3 overflow-hidden"
                              >
                                {cls.years.map((y) => (
                                  <YearSection 
                                    key={y.year} 
                                    yearData={y} 
                                    isOpen={openYear === `jkbose-${cls.name}-${y.year}`}
                                    onToggle={() => setOpenYear(openYear === `jkbose-${cls.name}-${y.year}` ? null : `jkbose-${cls.name}-${y.year}`)}
                                    onViewPdf={openPdfViewer}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Other Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherCategories.map((cat) => (
            <div key={cat.id} className="relative group">
              <button
                onClick={(e) => {
                  const target = e.currentTarget;
                  const isOpening = openId !== cat.id;
                  setOpenId(isOpening ? cat.id : null);
                  if (isOpening) {
                    setTimeout(() => {
                      const y = target.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }, 300);
                  }
                }}
                className={`w-full py-6 px-8 rounded-[2rem] flex items-center justify-between gap-4 font-bold transition-all duration-300 shadow-sm border border-slate-200 dark:border-white/10 ${
                  openId === cat.id 
                  ? "bg-slate-900 dark:bg-slate-800 text-white translate-y-[-2px] shadow-lg" 
                  : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center p-2 shadow-sm transition-colors ${openId === cat.id ? "bg-white/10" : "bg-slate-50 dark:bg-white/5"}`}>
                    {cat.logo ? (
                      <Image 
                        src={cat.logo} 
                        alt={cat.name || "Exam"} 
                        width={32} 
                        height={32} 
                        style={{ width: "auto", height: "auto" }}
                        className="object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/32?text=" + (cat.name ? cat.name[0] : "E"); }}
                      />
                    ) : (
                      <BookOpen className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>
                  <span className="text-lg">{cat.name}</span>
                </div>
                <div className={`transition-transform duration-500 ${openId === cat.id ? "rotate-180 text-indigo-500" : "text-slate-400"}`}>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </button>

              <AnimatePresence>
                {openId === cat.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col gap-4 shadow-lg overflow-hidden"
                  >
                    {cat.years?.map((y) => (
                      <YearSection 
                        key={y.year} 
                        yearData={y} 
                        isOpen={openYear === `${cat.id}-${y.year}`}
                        onToggle={() => setOpenYear(openYear === `${cat.id}-${y.year}` ? null : `${cat.id}-${y.year}`)}
                        onViewPdf={openPdfViewer}
                      />
                    ))}
                    {/* If this exam has classes instead of direct years */}
                    {cat.classes?.map((cls) => {
                      const isClsOpen = openClass === `${cat.id}-${cls.name}`;
                      return (
                        <div key={cls.name} className="space-y-3">
                          <button
                            onClick={() => setOpenClass(isClsOpen ? null : `${cat.id}-${cls.name}`)}
                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all border ${
                              isClsOpen
                                ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 shadow-md"
                                : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5"
                            }`}
                          >
                            <span className="font-bold text-slate-900 dark:text-white">{cls.name}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isClsOpen ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {isClsOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-3 space-y-3 overflow-hidden">
                                {cls.years.map((y) => (
                                  <YearSection key={y.year} yearData={y} isOpen={openYear === `${cat.id}-${cls.name}-${y.year}`}
                                    onToggle={() => setOpenYear(openYear === `${cat.id}-${cls.name}-${y.year}` ? null : `${cat.id}-${cls.name}-${y.year}`)}
                                    onViewPdf={openPdfViewer} />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                    {/* No data state */}
                    {!cat.years?.length && !cat.classes?.length && (
                      <p className="text-center py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">No papers available yet</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Empty state if no categories at all */}
        {examData.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700" />
            <h3 className="text-xl font-black text-slate-500">No exams available yet</h3>
            <p className="text-sm text-slate-400">Papers will appear here once added by the admin.</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-20 text-center text-slate-500 text-sm font-bold opacity-80">
          <p>© EduBag Archive | Official Previous Year Papers Repository</p>
        </div>
      </div>

      {/* Inline PDF Viewer Overlay */}
      <AnimatePresence>
        {viewerPdf && (
          <PdfViewerModal
            url={viewerPdf.url}
            name={viewerPdf.name}
            onClose={() => setViewerPdf(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function YearSection({ yearData, isOpen, onToggle, onViewPdf }: any) {
  const currentYear = new Date().getFullYear();
  const isLatest = yearData.year === currentYear;
  
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-300 border ${
          isOpen 
          ? "bg-slate-900 dark:bg-slate-800 text-white border-transparent shadow-xl ring-4 ring-indigo-500/10" 
          : "bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isOpen ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400"
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-black text-base">{yearData.year} Edition</span>
              {isLatest && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-[10px] font-black text-white uppercase tracking-widest animate-pulse">
                  Latest
                </span>
              )}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isOpen ? "text-indigo-300" : "text-slate-400"}`}>
              {yearData.subjects.length} Question Papers
            </p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isOpen ? "bg-white/10 rotate-180" : "bg-slate-100 dark:bg-white/5"
        }`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 pb-4 overflow-hidden"
          >
            {yearData.subjects.map((sub: any, idx: number) => {
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    onViewPdf(sub.url, sub.name);
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl transition-all border group relative overflow-hidden text-left bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-lg hover:-translate-y-0.5 text-slate-900 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                      {sub.name.toLowerCase().includes('math') ? <Zap className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-black text-sm">{sub.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        View Paper
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    <Eye className="w-5 h-5" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

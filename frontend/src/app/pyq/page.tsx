"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, ChevronUp, FileText, Download,
  BookOpen, GraduationCap, Calendar, Search, Sparkles, Zap
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import api from "@/lib/api";

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

// Helper to generate years range
const generateYears = (examId: string, className: string, start: number, end: number, subjects: string[]): YearData[] => {
  const years: YearData[] = [];
  for (let y = start; y >= end; y--) {
    years.push({
      year: y,
      subjects: subjects.map(s => {
        let fileName = "";
        let folderPath = `/assets/pyq/${examId}`;
        
        if (examId === "jkbose") {
          const shortClass = className.replace("class-", ""); // 10th, 11th, 12th
          folderPath = `/assets/pyq/jkbose/${shortClass}`;
          fileName = `Class ${shortClass} ${s} ${y}.pdf`;
        } else if (examId === "neet-ug") {
          folderPath = `/assets/pyq/neet ug`;
          fileName = y === 2025 ? `NEET Paper 2025.pdf` : `NEET ${y} Paper.pdf`;
        } else if (examId === "neet-pg") {
          folderPath = `/assets/pyq/neet pg`;
          fileName = y === 2025 ? `NEET PG Paper 2025.pdf` : `NEET PG ${y} Paper.pdf`;
        } else if (examId === "jee-advanced") {
          folderPath = `/assets/pyq/jee advanced`;
          fileName = `JEE Adv ${y} Paper.pdf`;
        } else if (examId === "skaust") {
          folderPath = `/assets/pyq/skaust_k`;
          fileName = `SKAUST-K UET ${y}.pdf`;
        } else if (examId === "jkbopee") {
          folderPath = `/assets/pyq/jkbopee bsc nursing`;
          fileName = `JKBOPEE B.Sc Nursing ${y}.pdf`;
        }

        return {
          name: s,
          url: `${folderPath}/${fileName}`
        };
      })
    });
  }
  return years;
};

// Helper for JEE Mains shifts
const generateJeeMainsYears = (start: number, end: number): YearData[] => {
  const years: YearData[] = [];
  for (let y = start; y >= end; y--) {
    years.push({
      year: y,
      subjects: [
        { name: "Shift 1 - Question Paper", url: `/assets/pyq/jee mains/JEE ${y}(Shift-1) Paper.pdf` },
        { name: "Shift 2 - Question Paper", url: `/assets/pyq/jee mains/JEE ${y}(Shift-2) Paper.pdf` },
        { name: "Shift 3 - Question Paper", url: `/assets/pyq/jee mains/JEE ${y}(Shift-3) Paper.pdf` },
      ]
    });
  }
  return years;
};

const pyqData: ExamCategory[] = [
  {
    id: "jkbose",
    name: "JKBOSE",
    logo: "/images/jkbose.png",
    classes: [
      { 
        name: "Class 10th", 
        years: generateYears("jkbose", "class-10th", 2026, 2013, ["English", "Mathematics", "Science", "Social Science", "Urdu"]) 
      },
      { 
        name: "Class 11th", 
        years: generateYears("jkbose", "class-11th", 2026, 2013, ["English", "Physics", "Chemistry", "Zoology", "Botany", "Mathematics", "Phy. Edu.", "Political Science"]) 
      },
      { 
        name: "Class 12th", 
        years: generateYears("jkbose", "class-12th", 2026, 2013, ["English", "Physics", "Chemistry", "Zoology", "Botany", "Mathematics", "Phy. Edu.", "History"]) 
      }
    ]
  },
  {
    id: "neet-ug",
    name: "NEET UG",
    logo: "/images/neetug.png",
    years: generateYears("neet-ug", "", 2026, 2013, ["Question Paper"])
  },
  {
    id: "jee-mains",
    name: "JEE Mains",
    logo: "/images/jeemain.png",
    years: generateJeeMainsYears(2026, 2013)
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced",
    logo: "/images/jeeadvanced.jpg",
    years: generateYears("jee-advanced", "", 2026, 2013, ["Question Paper"])
  },
  {
    id: "neet-pg",
    name: "NEET PG",
    logo: "/images/neetpg.jpg",
    years: generateYears("neet-pg", "", 2026, 2020, ["Question Paper"])
  },
  {
    id: "jkbopee",
    name: "JKBOPEE Nursing",
    logo: "/images/jkbopeeb.jpg",
    years: generateYears("jkbopee", "", 2026, 2020, ["Question Paper"])
  },
  {
    id: "skaust",
    name: "SKAUST-K UET",
    logo: "/images/skaustsyl.jpg",
    years: generateYears("skaust", "", 2026, 2013, ["Question Paper"])
  }
];

export default function PYQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [openClass, setOpenClass] = useState<string | null>(null);
  const [openYear, setOpenYear] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicData, setDynamicData] = useState<ExamCategory[]>([]);
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories (Exams)
        const catRes = await api.get("/categories");
        setCategories(catRes.data.data);

        // Fetch Resources
        const res = await api.get("/resources?type=pyq");
        const resources = res.data.data || [];
        
        const grouped: ExamCategory[] = [];
        resources.forEach((r: any) => {
           let exam = grouped.find(e => e.id === r.exam.toLowerCase());
           if (!exam) {
             exam = { id: r.exam.toLowerCase(), name: r.exam, classes: [] };
             grouped.push(exam);
           }
           
           if (r.class) {
             let cls = exam.classes?.find(c => c.name === r.class);
             if (!cls) {
               cls = { name: r.class, years: [] };
               exam.classes?.push(cls);
             }
             
             let yr = cls.years.find(y => y.year === r.year);
             if (!yr) {
               yr = { year: r.year, subjects: [] };
               cls.years.push(yr);
             }
             yr.subjects.push({ name: r.title, url: r.fileUrl });
           } else if (r.year) {
              // Direct year-based subjects (like NEET)
              if (!exam.years) exam.years = [];
              let yr = exam.years.find(y => y.year === r.year);
              if (!yr) {
                yr = { year: r.year, subjects: [] };
                exam.years.push(yr);
              }
              yr.subjects.push({ name: r.title, url: r.fileUrl });
           }
        });
        setDynamicData(grouped);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const finalData = useMemo(() => {
    // Start with a clone of hardcoded data
    let data = JSON.parse(JSON.stringify(pyqData));

    // 1. Merge Dynamic Categories (Exams) from DB
    if (categories && Array.isArray(categories)) {
      categories.forEach(cat => {
        if (!cat || cat.type === "syllabus") return;
        const existing = data.find((e: any) => e.id === cat.id);
        if (existing) {
          existing.name = cat.name || existing.name;
          existing.logo = cat.logo || existing.logo;
        } else {
          data.push({ id: cat.id, name: cat.name || "Unknown", logo: cat.logo || null, classes: [], years: [] });
        }
      });
    }

    // 2. Merge Dynamic Resources
    if (dynamicData && Array.isArray(dynamicData)) {
      dynamicData.forEach(dynExam => {
        const exam = data.find((e: any) => e.id === dynExam.id);
        if (exam) {
          if (dynExam.classes) {
            dynExam.classes.forEach((dynCls: any) => {
              let cls = exam.classes?.find((c: any) => c.name === dynCls.name);
              if (!cls) {
                cls = { name: dynCls.name, years: [] };
                exam.classes?.push(cls);
              }
              dynCls.years.forEach((dynYr: any) => {
                let yr = cls.years.find((y: any) => y.year === dynYr.year);
                if (yr) {
                  dynYr.subjects.forEach((s: any) => {
                    if (!yr.subjects.find((es: any) => es.url === s.url)) yr.subjects.push(s);
                  });
                } else {
                  cls.years.push(dynYr);
                }
              });
            });
          }
          if (dynExam.years) {
            if (!exam.years) exam.years = [];
            dynExam.years.forEach((dynYr: any) => {
              let yr = exam.years.find((y: any) => y.year === dynYr.year);
              if (yr) {
                dynYr.subjects.forEach((s: any) => {
                  if (!yr.subjects.find((es: any) => es.url === s.url)) yr.subjects.push(s);
                });
              } else {
                exam.years.push(dynYr);
              }
            });
          }
        }
      });
    }
    return data;
  }, [categories, dynamicData]);

  const mainCategory = finalData.find((c: any) => c.id === "jkbose");
  const otherCategories = finalData.filter((c: any) => c.id !== "jkbose");

  const handleDownload = (e: React.MouseEvent, url: string) => {
    if (url.includes("undefined") || url.endsWith("/")) {
      e.preventDefault();
      alert("This resource is coming soon!");
      return;
    }
  };

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

        {/* Main Content Area (JKBOSE) */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-200 dark:border-white/10 mb-8 transition-all hover:shadow-xl">
          <div className="p-1">
            <button
              onClick={() => setOpenId(openId === "jkbose" ? null : "jkbose")}
              className={`w-full p-8 flex flex-col items-center justify-center gap-6 transition-all duration-500 rounded-[2rem] ${
                openId === "jkbose" ? "bg-slate-900 dark:bg-slate-800 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-24 h-24 rounded-[2rem] p-3 flex items-center justify-center overflow-hidden transition-all duration-500 shadow-sm ${
                  openId === "jkbose" ? "bg-white scale-110 shadow-lg" : "bg-slate-50 dark:bg-white/10"
                }`}>
                  <Image 
                    src="/images/jkbose.png" 
                    alt="JKBOSE" 
                    width={90} 
                    height={90} 
                    style={{ height: "auto" }}
                    className="object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/90?text=JKBOSE"; }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-black tracking-tight ${openId === "jkbose" ? "text-white" : "text-slate-900 dark:text-white"}`}>JKBOSE</span>
                  <div className={`transition-transform duration-500 ${openId === "jkbose" ? "rotate-180 text-indigo-500" : "text-slate-400"}`}>
                    <ChevronDown className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {openId === "jkbose" && mainCategory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 space-y-6"
                >
                  {mainCategory.classes?.map((cls: any) => {
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
                              className="pl-4 space-y-3"
                            >
                              {cls.years.map((y: any) => (
                                <YearSection 
                                  key={y.year} 
                                  yearData={y} 
                                  isOpen={openYear === `jkbose-${cls.name}-${y.year}`}
                                  onToggle={() => setOpenYear(openYear === `jkbose-${cls.name}-${y.year}` ? null : `jkbose-${cls.name}-${y.year}`)}
                                  handleDownload={handleDownload}
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

        {/* Other Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherCategories.map((cat: any) => (
            <div key={cat.id} className="relative group">
              <button
                onClick={() => setOpenId(openId === cat.id ? null : cat.id)}
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
                        style={{ height: "auto" }}
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
                    className="mt-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col gap-4 shadow-lg"
                  >
                    {cat.years?.map((y: any) => (
                      <YearSection 
                        key={y.year} 
                        yearData={y} 
                        isOpen={openYear === `${cat.id}-${y.year}`}
                        onToggle={() => setOpenYear(openYear === `${cat.id}-${y.year}` ? null : `${cat.id}-${y.year}`)}
                        handleDownload={handleDownload}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>



        {/* Footer Info */}
        <div className="mt-20 text-center text-slate-500 text-sm font-bold opacity-80">
          <p>© EduBag Archive | Official Previous Year Papers Repository</p>
        </div>
      </div>
    </div>
  );
}

function YearSection({ yearData, isOpen, onToggle, handleDownload }: any) {
  const isLatest = yearData.year === 2026;
  
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 pb-4"
          >
            {yearData.subjects.map((sub: any, idx: number) => {
              const isComingSoon = sub.url.includes("undefined") || sub.url.endsWith("/");
              
              return (
                <motion.a
                  key={idx}
                  href={isComingSoon ? "#" : sub.url}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={(e) => handleDownload(e, sub.url)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all border group relative overflow-hidden ${
                    isComingSoon
                    ? "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-60 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-lg hover:-translate-y-0.5 text-slate-900 dark:text-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isComingSoon
                      ? "bg-slate-200 dark:bg-white/5 text-slate-400"
                      : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                    }`}>
                      {sub.name.toLowerCase().includes('math') ? <Zap className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-black text-sm">{sub.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {isComingSoon ? "Available Soon" : "Free Download"}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isComingSoon
                    ? "text-slate-300"
                    : "text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  }`}>
                    <Download className="w-5 h-5" />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, Download, BookOpen, GraduationCap, Search, Lock, Sparkles
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface SyllabusItem {
  id: string;
  name: string;
  pdfUrl: string;
}

interface Category {
  id: string;
  name: string;
  items: SyllabusItem[];
  logo?: string;
}

const syllabusData: Category[] = [
  {
    id: "jkbose",
    name: "JKBOSE",
    logo: "/images/jkbose.png",
    items: [
      { id: "class-10", name: "Class 10th", pdfUrl: "/assets/syllabus/jkbose/10th/Class 10th JKBOSE Syllabus.pdf" },
      { id: "class-11", name: "Class 11th", pdfUrl: "/assets/syllabus/jkbose/11th/Class 11th JKBOSE Syllabus.pdf" },
      { id: "class-12", name: "Class 12th", pdfUrl: "/assets/syllabus/jkbose/12th/Class 12th JKBOSE Syllabus.pdf" },
    ]
  },
  {
    id: "neetug",
    name: "NEET UG",
    logo: "/images/neetug.png",
    items: [{ id: "neet-ug", name: "NEET UG Syllabus", pdfUrl: "/assets/syllabus/neet ug/NEET UG Syllabus 2026.pdf" }]
  },
  {
    id: "neetpg",
    name: "NEET PG",
    logo: "/images/neetpg.jpg",
    items: [{ id: "neet-pg", name: "NEET PG Syllabus", pdfUrl: "/assets/syllabus/neet pg/NEET PG Syllabus 2026.pdf" }]
  },
  {
    id: "jeemain",
    name: "JEE Mains",
    logo: "/images/jeemain.png",
    items: [{ id: "jee-mains", name: "JEE Mains Syllabus", pdfUrl: "/assets/syllabus/jee mains/JEE Mains 2026 Syllabus.pdf" }]
  },
  {
    id: "jeeadvanced",
    name: "JEE Advanced",
    logo: "/images/jeeadvanced.jpg",
    items: [{ id: "jee-advanced", name: "JEE Advanced Syllabus", pdfUrl: "/assets/syllabus/jee advanced/JEE Advanced 2026 Syllabus.pdf" }]
  },
  {
    id: "skaust",
    name: "SKAUST",
    logo: "/images/skaustsyl.jpg",
    items: [{ id: "skaust-uet", name: "SKAUST-K UET", pdfUrl: "/assets/syllabus/skaust/SKAUST-K UET 2026 Syllabus.pdf" }]
  },
  {
    id: "jkbopee",
    name: "JKBOPEE B.Sc Nursing",
    logo: "/images/jkbopeeb.jpg",
    items: [{ id: "jkbopee-nursing", name: "B.Sc Nursing Syllabus", pdfUrl: "/assets/syllabus/jkbopee bsc nursing/JKBOPEE B.Sc Nursing Entrance Syllabus 2026.pdf" }]
  },
  {
    id: "jkpsc",
    name: "JKPSC KAS",
    logo: "/images/jkpsc.jpg",
    items: [{ id: "jkpsc-kas", name: "KAS Prelims & Mains", pdfUrl: "/assets/syllabus/jkpsc kas/JKPSC KAS Syllabus 2026.pdf" }]
  }
];

export default function SyllabusPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [dynamicItems, setDynamicItems] = useState<any[]>([]);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get("/categories");
        setCategories(catRes.data.data);

        const res = await api.get("/resources?type=syllabus");
        setDynamicItems(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const finalData = useMemo(() => {
    let data = JSON.parse(JSON.stringify(syllabusData));

    // 1. Merge Categories
    if (categories && Array.isArray(categories)) {
      categories.forEach(cat => {
        if (!cat || cat.type === "pyq") return;
        const catId = cat.id?.toLowerCase() || cat._id;
        const existing = data.find((e: any) => e.id === catId);
        if (existing) {
          existing.name = cat.name || existing.name;
          existing.logo = cat.logo || existing.logo;
        } else {
          data.push({ id: catId, name: cat.name || "Unknown", logo: cat.logo || null, items: [] });
        }
      });
    }

    // 2. Merge Items
    if (dynamicItems && Array.isArray(dynamicItems)) {
      dynamicItems.forEach(item => {
        if (!item || !item.exam) return;
        const exam = data.find((e: any) => e.id === item.exam.toLowerCase());
        if (exam) {
          if (!exam.items.find((i: any) => i.pdfUrl === item.fileUrl)) {
            exam.items.push({ id: item._id, name: item.title, pdfUrl: item.fileUrl });
          }
        }
      });
    }

    return data;
  }, [categories, dynamicItems]);

  const mainCategory = finalData.find((c: any) => c.id === "jkbose");
  const otherCategories = finalData.filter((c: any) => c.id !== "jkbose");

  const handleDownload = (e: React.MouseEvent, item: SyllabusItem) => {
    // All Syllabus are free in Freemium model
    return;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
      <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 pt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest border border-orange-100 dark:border-orange-500/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Academic Curriculum
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">Syllabus</span>
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-600 to-red-600 mx-auto rounded-full mt-4 opacity-80" />
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-200 dark:border-white/10 mb-8 transition-all hover:shadow-xl">
          
          {/* JKBOSE Section */}
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
                    style={{ width: "auto", height: "auto" }}
                    className="object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/90?text=JKBOSE"; }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-black tracking-tight ${openId === "jkbose" ? "text-white" : "text-slate-900 dark:text-white"}`}>JKBOSE</span>
                  <div className={`transition-transform duration-500 ${openId === "jkbose" ? "rotate-180 text-orange-500" : "text-slate-400"}`}>
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
                  className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-10 flex flex-col items-center gap-4 rounded-b-[2rem]"
                >
                  {mainCategory.items.map((item: any) => (
                    <a
                      key={item.id || item.pdfUrl}
                      href={item.pdfUrl || "#"}
                      onClick={(e) => handleDownload(e, item)}
                      className="w-full max-w-md py-4 px-8 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center justify-between group"
                    >
                      <span className="flex-grow font-bold">{item.name}</span>
                      <Download className="w-5 h-5 opacity-60 group-hover:opacity-100 shrink-0 transition-opacity" />
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

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
                        alt={cat.name || "Category"} 
                        width={32} 
                        height={32} 
                        style={{ width: "auto", height: "auto" }}
                        className="object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/32?text=" + (cat.name ? cat.name[0] : "C"); }}
                      />
                    ) : (
                      <BookOpen className="w-6 h-6 text-orange-500" />
                    )}
                  </div>
                  <span className="text-lg">{cat.name}</span>
                </div>
                <div className={`transition-transform duration-500 ${openId === cat.id ? "rotate-180 text-orange-500" : "text-slate-400"}`}>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </button>

              <AnimatePresence>
                {openId === cat.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col gap-3 shadow-lg"
                  >
                    {cat.items.map((item: any) => {
                      const isComingSoon = !item.pdfUrl || item.pdfUrl.includes("undefined") || item.pdfUrl.endsWith("/");
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all border border-slate-100 dark:border-white/5 group ${
                            isComingSoon
                            ? "bg-slate-100 dark:bg-white/5 opacity-60 cursor-not-allowed"
                            : "bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:border-indigo-200 dark:hover:border-indigo-500/30 text-slate-900 dark:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-[15px]">{item.name}</span>
                              {isComingSoon && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Soon</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isComingSoon ? <Lock className="w-4 h-4 text-slate-400" /> : <a href={item.pdfUrl} onClick={(e) => handleDownload(e, item)}><Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-colors" /></a>}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center text-slate-500 text-sm font-bold opacity-80">
          <p>© EduBag Academic Resources | Official Curriculum Repository</p>
        </div>
      </div>
    </div>
  );
}

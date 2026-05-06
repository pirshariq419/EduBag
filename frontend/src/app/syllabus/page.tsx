"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, BookOpen, Lock, Sparkles, Eye, Search
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import dynamic from "next/dynamic";

const PdfViewerModal = dynamic(() => import("@/components/PdfViewerModal"), { ssr: false });

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

export default function SyllabusPage() {
  const [openId, setOpenId] = useState<string | null>(null);
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
          api.get("/resources?type=syllabus"),
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

  // Build the structured syllabus data from API responses
  const syllabusData: Category[] = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    
    // Get categories that show on syllabus pages (type === 'syllabus' or 'all')
    const syllabusCategories = (categories || []).filter(
      (c: any) => c && c.type !== "pyq"
    );

    return syllabusCategories.map((cat: any) => {
      const catResources = (resources || []).filter(
        (r: any) => r.exam === cat.id
      );

      // Filter items based on searchTerm
      const filteredItems = catResources.map((r: any) => ({
        id: r._id,
        name: r.title,
        pdfUrl: r.fileUrl,
      })).filter(item => {
        if (!search) return true;
        return item.name.toLowerCase().includes(search);
      });

      // If we are searching and this category has no matching items, check if the category name matches
      if (search && filteredItems.length === 0 && !cat.name.toLowerCase().includes(search)) {
        return null;
      }

      return {
        id: cat.id,
        name: cat.name,
        logo: cat.logo,
        items: filteredItems,
      };
    }).filter(Boolean) as Category[];
  }, [categories, resources, searchTerm]);

  const mainCategory = syllabusData.find((c) => c.id === "jkbose");
  const otherCategories = syllabusData.filter((c) => c.id !== "jkbose");

  const openPdfViewer = (e: React.MouseEvent, item: SyllabusItem) => {
    e.preventDefault();
    setViewerPdf({ url: item.pdfUrl, name: item.name });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Syllabus...</p>
        </div>
      </div>
    );
  }

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

        {/* Local Search Bar */}
        <div className="mb-12 relative group max-w-2xl mx-auto">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            placeholder="Search syllabus guides (e.g. 'Class 12th', 'NEET')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-[2rem] py-5 pl-14 pr-6 text-sm md:text-base font-bold focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm hover:shadow-md dark:text-white"
          />
        </div>

        {/* Main Content Area */}
        {mainCategory && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-200 dark:border-white/10 mb-8 transition-all hover:shadow-xl">
            {/* JKBOSE Section */}
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
                    <div className={`transition-transform duration-500 ${openId === "jkbose" ? "rotate-180 text-orange-500" : "text-slate-400"}`}>
                      <ChevronDown className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {openId === "jkbose" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-10 flex flex-col items-center gap-4 rounded-b-[2rem] overflow-hidden"
                  >
                    {mainCategory.items.map((item) => (
                      <button
                        key={item.id || item.pdfUrl}
                        onClick={(e) => openPdfViewer(e, item)}
                        className="w-full max-w-md py-4 px-8 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center justify-between group cursor-pointer"
                      >
                        <span className="flex-grow font-bold text-left">{item.name}</span>
                        <Eye className="w-5 h-5 opacity-60 group-hover:opacity-100 shrink-0 transition-opacity" />
                      </button>
                    ))}
                    {mainCategory.items.length === 0 && (
                      <p className="text-slate-400 font-bold italic">No matching guides found</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

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
                    className="mt-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col gap-3 shadow-lg overflow-hidden"
                  >
                    {cat.items.length === 0 ? (
                      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-white/5 opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[15px]">Syllabus</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Not Found</span>
                          </div>
                        </div>
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                    ) : cat.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={(e) => openPdfViewer(e, item)}
                        className="flex items-center justify-between p-4 rounded-xl transition-all border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:border-indigo-200 dark:hover:border-indigo-500/30 text-slate-900 dark:text-white cursor-pointer group w-full text-left"
                      >
                        <span className="font-bold text-[15px]">{item.name}</span>
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-colors" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {syllabusData.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700" />
            <h3 className="text-xl font-black text-slate-500">No matching syllabi found</h3>
            <p className="text-sm text-slate-400">Try a different search term or browse the categories.</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-20 text-center text-slate-500 text-sm font-bold opacity-80">
          <p>© EduBag Academic Resources | Official Curriculum Repository</p>
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

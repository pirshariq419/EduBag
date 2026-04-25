"use client";

import Link from "next/link";
import {
  BookOpen, ClipboardCheck, FileText, GraduationCap,
  ArrowRight, Atom, FlaskConical, Calculator, Leaf, ChevronRight, Search, Building2
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const examCategories = [
  {
    exam: "JEE",
    label: "JEE Mains & Advanced",
    desc: "Engineering entrance — Physics, Chemistry, Mathematics",
    gradient: "from-blue-600 to-indigo-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    subjects: [
      { name: "Physics", icon: Atom, topics: 24, color: "text-blue-600 dark:text-blue-400" },
      { name: "Chemistry", icon: FlaskConical, topics: 28, color: "text-indigo-600 dark:text-indigo-400" },
      { name: "Mathematics", icon: Calculator, topics: 30, color: "text-purple-600 dark:text-purple-400" },
    ],
  },
  {
    exam: "NEET",
    label: "NEET (UG)",
    desc: "Medical entrance — Physics, Chemistry, Biology",
    gradient: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    subjects: [
      { name: "Biology", icon: Leaf, topics: 38, color: "text-emerald-600 dark:text-emerald-400" },
      { name: "Physics", icon: Atom, topics: 20, color: "text-blue-600 dark:text-blue-400" },
      { name: "Chemistry", icon: FlaskConical, topics: 22, color: "text-indigo-600 dark:text-indigo-400" },
    ],
  },
  {
    exam: "BOARDS",
    label: "JKBOSE Class 11 & 12",
    desc: "J&K Board — All streams covered",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    subjects: [
      { name: "Physics", icon: Atom, topics: 15, color: "text-blue-600 dark:text-blue-400" },
      { name: "Chemistry", icon: FlaskConical, topics: 16, color: "text-indigo-600 dark:text-indigo-400" },
      { name: "Mathematics", icon: Calculator, topics: 14, color: "text-purple-600 dark:text-purple-400" },
    ],
  },
];

const quickLinks = [
  { title: "Previous Papers", desc: "PYQs with solutions", href: "/pyq", icon: BookOpen, color: "from-amber-400 to-amber-500" },
  { title: "Official Syllabus", desc: "Latest exam syllabus PDFs", href: "/syllabus", icon: GraduationCap, color: "from-emerald-500 to-emerald-600" },
  { title: "College Guide", desc: "Explore top institutes", href: "/colleges", icon: GraduationCap, color: "from-blue-500 to-blue-600" },
];

function LearnContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (query) {
      const filtered = examCategories.filter(cat => 
        cat.label.toLowerCase().includes(query.toLowerCase()) ||
        cat.desc.toLowerCase().includes(query.toLowerCase()) ||
        cat.subjects.some(s => s.name.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Search Results Section */}
      {query && (
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-[#a435f0]/10 text-[#a435f0]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Search results for "{query}"</h2>
              <p className="text-slate-500 text-sm">{results.length} resources found</p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((res) => (
                <Link
                  key={res.exam}
                  href={`/pyq?exam=${res.exam}`}
                  className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-[#a435f0]/30 transition-all shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${res.gradient} flex items-center justify-center text-white`}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{res.label}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{res.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-[#a435f0] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              <p className="text-lg font-bold">No exact matches found.</p>
              <p className="text-sm">Try searching for JEE, NEET, or specific subjects.</p>
            </div>
          )}
        </motion.section>
      )}

      {/* Hero */}
      <section className="text-center pt-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
          Start{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a435f0] to-[#8710d8] dark:from-indigo-400 dark:to-purple-400">
            Learning
          </span>{" "}
          Today
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
          Choose your exam stream and dive into curated syllabus guides, 
          official resource links, and previous year questions — all in one place.
        </p>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              <ChevronRight className="w-4 h-4 text-slate-400 mt-3 group-hover:translate-x-1 group-hover:text-[#a435f0] transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Exam Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">Study by Exam</h2>
        <div className="space-y-8">
          {examCategories.map((cat) => (
            <div key={cat.exam} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
              <div className={`bg-gradient-to-r ${cat.gradient} p-8 md:p-10 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div>
                    <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full mb-3 inline-block tracking-widest uppercase">
                      {cat.exam}
                    </span>
                    <h3 className="text-3xl font-black tracking-tight">{cat.label}</h3>
                    <p className="text-white/80 text-sm font-medium mt-2">{cat.desc}</p>
                  </div>
                  <Link
                    href={`/pyq?exam=${cat.exam}`}
                    className="inline-flex md:flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-50 px-6 py-3 rounded-full font-bold transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm w-fit"
                  >
                    View Previous Papers <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {cat.subjects.map((sub) => (
                  <Link
                    key={sub.name}
                    href={`/pyq?exam=${cat.exam}&subject=${sub.name}`}
                    className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-[#a435f0]/30 transition-all shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center`}>
                        <sub.icon className={`w-6 h-6 ${sub.color}`} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{sub.name}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{sub.topics} chapters</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-[#a435f0] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Resources...</div>}>
      <LearnContent />
    </Suspense>
  );
}

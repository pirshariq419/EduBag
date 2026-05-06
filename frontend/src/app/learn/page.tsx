"use client";

import Link from "next/link";
import {
  BookOpen, ClipboardCheck, FileText, GraduationCap,
  ArrowRight, Atom, FlaskConical, Calculator, Leaf, ChevronRight, Search, Building2, Brain, MessageSquare,
  Clock, Star, Calendar, ArrowUpRight, Bot
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import api from "@/lib/api";

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
  { title: "AI Mock Tests", desc: "Practice with smart tests", href: "/tests", icon: Brain, color: "from-[#a435f0] to-[#8710d8]" },
  { title: "Previous Papers", desc: "PYQs with solutions", href: "/pyq", icon: BookOpen, color: "from-amber-400 to-amber-500" },
  { title: "Official Syllabus", desc: "Latest exam syllabus PDFs", href: "/syllabus", icon: ClipboardCheck, color: "from-emerald-500 to-emerald-600" },
  { title: "Community Forum", desc: "Discuss with peers", href: "/forum", icon: MessageSquare, color: "from-indigo-500 to-blue-500" },
  { title: "College Guide", desc: "Explore top institutes", href: "/colleges", icon: Building2, color: "from-cyan-500 to-teal-500" },
];

function LearnContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const [results, setResults] = useState<{resources: any[], tests: any[], posts: any[]}>({ resources: [], tests: [], posts: [] });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setSearching(true);
        try {
          const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
          setResults(res.data.data);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setSearching(false);
        }
      }
    };
    fetchResults();
  }, [query]);

  const hasResults = results.resources.length > 0 || results.tests.length > 0 || results.posts.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      
      {/* Search Results Section */}
      {query && (
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-[#a435f0]/10 text-[#a435f0]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Search Results</h2>
              <p className="text-slate-500 font-medium">Showing results for "{query}"</p>
            </div>
          </div>

          {searching ? (
            <div className="py-20 text-center space-y-4">
               <div className="w-10 h-10 border-4 border-[#a435f0] border-t-transparent rounded-full animate-spin mx-auto" />
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Searching Database...</p>
            </div>
          ) : hasResults ? (
            <div className="space-y-12">
              
              {/* Question Papers & Syllabus */}
              {results.resources.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Academic Papers ({results.resources.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.resources.map((res) => (
                      <Link
                        key={res._id}
                        href={res.type === 'pyq' ? '/pyq' : '/syllabus'}
                        className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-indigo-400/50 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{res.title}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">{res.exam}</span>
                              <span className="text-[10px] font-bold text-slate-400">• {res.year}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Tests */}
              {results.tests.length > 0 && (
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> AI Mock Tests ({results.tests.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.tests.map((test) => (
                      <Link
                        key={test._id}
                        href="/tests"
                        className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-purple-400/50 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-500 shadow-sm">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{test.title}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">{test.exam}</span>
                              <span className="text-[10px] font-bold text-slate-400">• {test.subject}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Forum Discussions */}
              {results.posts.length > 0 && (
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Community Discussions ({results.posts.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {results.posts.map((post) => (
                      <Link
                        key={post._id}
                        href={`/forum/${post._id}`}
                        className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-400/50 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-500 shadow-sm">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Posted by {post.author?.name || 'Anonymous'}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-20 opacity-50 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black">No exact matches found.</p>
                <p className="text-sm font-medium">Try searching for broader terms like "JEE", "Physics", or "JKBOSE".</p>
              </div>
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
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium mt-4">
          Choose your exam stream and dive into AI-powered mock tests, official syllabus guides, 
          previous year questions, and a vibrant student community — all in one place.
        </p>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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

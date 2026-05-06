"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BookOpen, FileText, GraduationCap, 
  ArrowRight, Sparkles, Zap, Crown, ShieldCheck, 
  Star, Search, ChevronRight, Library, Target, Award,
  Bot, BarChart3, MessageSquare
} from "lucide-react";

const features = [
  {
    title: "AI Mock Tests",
    desc: "Generate smart mock tests instantly and track your accuracy with detailed performance analytics.",
    icon: BarChart3,
    color: "from-indigo-600 to-purple-600",
    href: "/tests",
    badge: "AI Powered"
  },
  {
    title: "EduBot AI Tutor",
    desc: "Your 24/7 personal academic assistant. Get complex concepts explained instantly.",
    icon: Bot,
    color: "from-purple-600 to-pink-600",
    href: "/learn",
    badge: "New"
  },
  {
    title: "Community Forum",
    desc: "Ask doubts, share tips, and solve problems together with students across J&K.",
    icon: MessageSquare,
    color: "from-blue-600 to-cyan-600",
    href: "/forum",
  },
  {
    title: "PYQ Archive",
    desc: "Download complete Previous Year Papers from 2013-2026. 100% Free.",
    icon: FileText,
    color: "from-emerald-600 to-teal-600",
    href: "/pyq",
  },
  {
    title: "College Explorer",
    desc: "Navigate J&K college cutoffs, courses, and placement statistics easily.",
    icon: GraduationCap,
    color: "from-amber-500 to-orange-600",
    href: "/colleges",
  },
  {
    title: "Official Syllabus",
    desc: "Up-to-date, verified exam guides for JKBOSE, NEET, JEE, and more.",
    icon: Library,
    color: "from-rose-500 to-red-600",
    href: "/syllabus",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col pb-32 overflow-hidden bg-white dark:bg-[#050508] text-slate-900 dark:text-white">
      
      {/* Hero Section: Professional Academic Focus */}
      <section className="relative min-h-[600px] md:min-h-[750px] w-full flex items-center pt-20 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3 h-3" /> Next-Gen Learning Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              The Ultimate Hub for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">J&K Students.</span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Access 100% free PYQs, explore college cutoffs, discuss with peers, and evaluate your preparation using our state-of-the-art AI Mock Test Engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/pyq"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                Browse Free PYQs
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60 grayscale dark:invert transition-all hover:grayscale-0">
               <img src="/images/uok.jpg" alt="UoK" className="h-8 object-contain" loading="eager" />
               <img src="/images/skims.jpg" alt="SKIMS" className="h-8 object-contain" loading="eager" />
               <img src="/images/nitsri.jpg" alt="NIT" className="h-8 object-contain" loading="eager" />
               <img src="/images/iitjmu.jpg" alt="IIT" className="h-8 object-contain" loading="eager" />
            </div>
          </motion.div>

          {/* Abstract Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 w-full aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-[4rem] border border-white/10 backdrop-blur-3xl p-8 flex items-center justify-center overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
               <div className="relative z-20 grid grid-cols-2 gap-6 w-full h-full">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-end group-hover:-translate-y-2 transition-transform duration-500">
                    <Target className="w-10 h-10 text-indigo-400 mb-4" />
                    <p className="text-xl font-black">Success Oriented</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-end translate-y-12 group-hover:translate-y-10 transition-transform duration-500">
                    <Zap className="w-10 h-10 text-amber-400 mb-4" />
                    <p className="text-xl font-black">Instant Access</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-end -translate-y-6 group-hover:-translate-y-8 transition-transform duration-500">
                    <Bot className="w-10 h-10 text-emerald-400 mb-4" />
                    <p className="text-xl font-black">AI Assistance</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-end translate-y-6 group-hover:translate-y-4 transition-transform duration-500">
                    <ShieldCheck className="w-10 h-10 text-blue-400 mb-4" />
                    <p className="text-xl font-black">Verified Data</p>
                  </div>
               </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-indigo-500/5 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-purple-500/5 rounded-full animate-pulse [animation-delay:1s]" />
          </motion.div>
        </div>
      </section>

      {/* Trust Bar (Updated Stats) */}
      <div className="w-full border-y border-slate-100 dark:border-white/5 py-16 bg-slate-50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">10K+</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Active Learners</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">50K+</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Questions Gen.</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">500+</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Forum Discussions</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">100%</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Free Core Access</p>
          </div>
        </div>
      </div>

      {/* 6-Pillar Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32 space-y-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">An Ecosystem For Success</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
            Everything you need to ace your exams, organize your study routine, and secure admission into your dream college.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Link 
              href={feature.href}
              key={feature.title}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 flex flex-col"
              >
                {feature.badge && (
                  <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                    {feature.badge}
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8 flex-grow">
                  {feature.desc}
                </p>
                <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase text-[11px] tracking-widest group-hover:gap-4 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Professional Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-10 mb-20">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Ready to test your knowledge?</h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                Create a free account to unlock our AI Mock Tests, save your progress, and join thousands of students in the community forum.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/signup"
                className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 transition-all"
              >
                Sign Up For Free
              </Link>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
              No credit card required. Ever.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

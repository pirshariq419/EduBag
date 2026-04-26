"use client";

import { motion } from "framer-motion";
import { Lock, Eye, ShieldAlert, Server } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <Lock className="w-4 h-4" /> Privacy
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy <span className="text-indigo-600 dark:text-indigo-500">Policy</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Last Updated: April 24, 2026</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-200 dark:border-white/10 shadow-xl space-y-12"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Eye className="w-5 h-5" />
              </div>
              1. Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We collect information that you provide directly to us, such as when you create an account, or subscribe to our newsletter. This may include your name, email address, and exam preferences.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Server className="w-5 h-5" />
              </div>
              2. How We Use Your Data
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We use the information we collect to personalize your learning experience, process transactions, send periodic emails about your progress, and improve our platform's functionality based on your feedback.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              3. Data Security
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We implement a variety of security measures to maintain the safety of your personal information. Your data is handled securely and is protected against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              4. Cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              EduBag uses cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Have concerns about your privacy? <a href="/contact" className="text-indigo-600 hover:underline">Contact us</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

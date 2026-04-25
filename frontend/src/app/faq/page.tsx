"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "What is EduBag?",
    answer: "EduBag is a dedicated educational platform for students in Jammu & Kashmir. We provide premium study materials, previous year question papers (PYQs), and mock tests specifically tailored for JKBOSE, NEET, JEE, and other regional competitive exams."
  },
  {
    question: "Is the content on EduBag free?",
    answer: "Yes, absolutely! EduBag is completely free for all students. We believe in providing equal access to high-quality educational resources without any paywalls."
  },
  {
    question: "Can I download the notes for offline use?",
    answer: "Yes! Most of our notes and previous year papers are available in PDF format which you can download and study offline at your convenience."
  },
  {
    question: "Are the mock tests timed?",
    answer: "Yes, our mock tests are designed to simulate real exam conditions with timers. After completion, you receive a detailed performance analysis including correct answers and your score."
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
          >
            <HelpCircle className="w-4 h-4" /> Help Center
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked <span className="text-indigo-600 dark:text-indigo-500">Questions</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
            Everything you need to know about EduBag and our services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full p-8 flex items-center justify-between text-left gap-4"
              >
                <span className="text-lg font-bold text-slate-900 dark:text-white">{faq.question}</span>
                <div className={`transition-transform duration-300 ${activeIndex === index ? "rotate-180 text-indigo-600" : "text-slate-400"}`}>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 pb-8"
                  >
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium pt-2 border-t border-slate-100 dark:border-white/5">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
          <h3 className="text-2xl font-black mb-4">Still have questions?</h3>
          <p className="text-slate-400 font-medium mb-8">We're here to help you. Reach out to our support team.</p>
          <a href="mailto:pirshariq419@gmail.com" className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

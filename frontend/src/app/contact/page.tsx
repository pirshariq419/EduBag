"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" /> Get in Touch
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Our Team</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email Us", val: "pirshariq419@gmail.com", desc: "For general inquiries and support", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
              { icon: Phone, title: "Call Us", val: "+91 7889851259", desc: "Mon-Sat, 10am to 6pm IST", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
              { icon: MapPin, title: "Visit Us", val: "Kupwara, J&K", desc: "Jammu & Kashmir, India - 193222", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">{item.title}</h3>
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.val}</p>
                <p className="text-sm font-medium text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-xl"
            >
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white font-medium resize-none"
                  />
                </div>
                <button className="w-full py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 group">
                  Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

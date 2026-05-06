"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, X, Send, BrainCircuit, 
  ArrowRight, Loader2, ChevronDown
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

interface Message {
  role: 'bot' | 'user';
  text: string;
  links?: { label: string, href: string }[];
}

export default function EduBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Automatically close chatbot when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm EduBot, your personal AI tutor. How can I help you ace your exams today?`,
      links: [
        { label: "Find PYQs", href: "/pyq" },
        { label: "View Syllabus", href: "/syllabus" },
        { label: "Mock Tests", href: "/tests" }
      ]
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    if (!user) {
      setMessages(prev => [
        ...prev, 
        { role: 'user', text: input },
        { role: 'bot', text: "Please log in or create an account to chat with me! I need to know who I'm teaching.", links: [{ label: "Login / Register", href: "/login" }] }
      ]);
      setInput("");
      return;
    }

    const userMsg = input;
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Map to just role and text for the API
      const apiMessages = newMessages.map(m => ({ role: m.role, text: m.text }));
      
      const res = await api.post("/ai/chat", { messages: apiMessages });
      
      setMessages(prev => [...prev, { role: 'bot', text: res.data.data }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      if (err?.response?.status === 401) {
        setMessages(prev => [...prev, { role: 'bot', text: "Your session has expired. Please log in again to continue chatting.", links: [{ label: "Login", href: "/login" }] }]);
      } else if (err?.response?.status === 429) {
        setMessages(prev => [...prev, { role: 'bot', text: "Whoa, slow down! Let me process your previous questions first. Give me a minute." }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to my brain right now. Please try again later." }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, originY: 1, originX: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="pointer-events-auto mb-4 w-[calc(100vw-32px)] sm:w-[380px] h-[65vh] sm:h-[550px] max-h-[600px] bg-white dark:bg-[#0c0d12] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 p-5 bg-slate-900 dark:bg-[#12131a] text-white flex items-center justify-between border-b border-slate-200 dark:border-white/5 relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-[#a435f0]/20 rounded-full blur-[40px]" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#a435f0] to-[#8710d8] flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight text-white">EduBot AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all relative z-20"
                aria-label="Close chat"
              >
                <ChevronDown className="w-6 h-6 text-slate-400 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth custom-scrollbar bg-slate-50/50 dark:bg-transparent"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeUp`}>
                  <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'order-2' : ''}`}>
                    <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20' 
                        : 'bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/5 shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.links && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.links.map((link, li) => (
                          <Link 
                            key={li} 
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1b23] border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          >
                            {link.label} <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-white/5 p-4 rounded-[1.5rem] rounded-tl-none border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSend}
              className="shrink-0 p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0d12] flex items-center gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all relative group overflow-hidden ${
          isOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90 shadow-none' : 'bg-gradient-to-br from-[#a435f0] to-[#8710d8] text-white shadow-purple-500/30'
        }`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}

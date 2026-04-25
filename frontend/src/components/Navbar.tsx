"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { 
  LayoutDashboard, LogOut, Search,  
  Menu, X, BookOpen, GraduationCap, ChevronRight, UserCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const searchSuggestions = [
  { id: "neet-pyq", title: "NEET Previous Papers", type: "PYQ", href: "/pyq", icon: BookOpen },
  { id: "jkbose-12", title: "JKBOSE Class 12th Syllabus", type: "Syllabus", href: "/syllabus", icon: GraduationCap },
  { id: "med-colleges", title: "Top Medical Colleges J&K", type: "Colleges", href: "/colleges", icon: LayoutDashboard },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, loadUser, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = searchQuery.trim() === "" 
    ? [] 
    : searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/learn?search=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0b0b0d] border-b border-slate-200 dark:border-white/10 h-16 flex items-center shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 w-full flex items-center gap-2 md:gap-4 lg:gap-8">
        
        {/* Logo */}
        <Link 
          href="/" 
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex-shrink-0"
        >
          <Image
            src="/images/logo.png"
            alt="EduBag Logo"
            width={100}
            height={40}
            priority
            loading="eager"
            style={{ width: "auto", height: "auto" }}
            className="h-8 md:h-10 object-contain"
          />
        </Link>

        {/* Explore Link (Desktop) */}
        <Link href="/learn" className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#a435f0] transition-colors">
          Explore
        </Link>

        {/* Search Bar (Desktop) */}
        <div ref={searchRef} className="hidden md:block flex-grow max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#a435f0] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search for PYQs, Syllabus, Colleges..."
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-[#a435f0] transition-all dark:text-white"
            />
          </form>

          {/* Search Dropdown Preview */}
          <AnimatePresence>
            {showDropdown && searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1c1d1f] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-2">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 group-hover:text-[#a435f0] transition-colors">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.type}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-slate-500 font-medium italic">
                        Press Enter to search for "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
                {filteredSuggestions.length > 0 && (
                  <div className="bg-slate-50 dark:bg-white/5 p-3 text-center border-t border-slate-100 dark:border-white/5">
                    <button 
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-[#a435f0] hover:underline"
                    >
                      See all results
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation & Auth */}
        <div className="hidden lg:flex items-center gap-5">
          <Link href="/pyq" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#a435f0] transition-colors">
            PYQs
          </Link>
          <Link href="/syllabus" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#a435f0] transition-colors">
            Syllabus
          </Link>
          <Link href="/colleges" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#a435f0] transition-colors">
            Colleges
          </Link>
          <Link href="/tests" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#a435f0] transition-colors">
            Mock Tests
          </Link>
          <Link href="/forum" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#a435f0] transition-colors">
            Forum
          </Link>

        </div>

        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {mounted && user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/dashboard"
                className="hidden xs:flex items-center gap-2 px-4 py-2 text-sm font-bold border border-slate-900 dark:border-white rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : mounted ? (
            <div className="flex items-center gap-1 md:gap-2">
              <Link
                href="/login"
                className="px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-sm font-bold border border-slate-900 dark:border-white text-slate-900 dark:text-white rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="hidden xs:flex px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md"
              >
                Sign up
              </Link>
            </div>
          ) : null}



          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-900 dark:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:hidden fixed inset-0 top-16 bg-white dark:bg-[#0b0b0d] z-40 overflow-y-auto"
          >
             <div className="p-6 space-y-6">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const query = (e.currentTarget.elements.namedItem('mobile-search') as HTMLInputElement).value;
                    if (query.trim()) {
                      router.push(`/learn?search=${encodeURIComponent(query)}`);
                      setIsOpen(false);
                    }
                  }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="mobile-search"
                    type="text" 
                    placeholder="Search"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#a435f0] dark:text-white"
                  />
                </form>
                <div className="flex flex-col gap-4 font-bold text-slate-700 dark:text-slate-200">
                  <Link href="/" onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Home</Link>
                  <Link href="/learn" onClick={() => setIsOpen(false)}>Learn</Link>
                  <Link href="/pyq" onClick={() => setIsOpen(false)}>Previous Papers</Link>
                  <Link href="/syllabus" onClick={() => setIsOpen(false)}>Syllabus</Link>
                  <Link href="/tests" onClick={() => setIsOpen(false)}>Mock Tests</Link>
                  <Link href="/forum" onClick={() => setIsOpen(false)}>Forum</Link>
                  <Link href="/colleges" onClick={() => setIsOpen(false)}>Colleges</Link>
                </div>
                <hr className="border-slate-100 dark:border-white/5" />
                {mounted && user ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-center py-3 bg-slate-900 text-white rounded-md font-bold">Dashboard</Link>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="py-3 border border-slate-900 text-slate-900 dark:border-white dark:text-white text-center rounded-md font-bold">Log in</Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-center rounded-md font-bold">Sign up</Link>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

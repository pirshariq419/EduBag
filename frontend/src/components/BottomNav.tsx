"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, BookOpen, FileText, 
  LayoutDashboard, ClipboardList
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "PYQ", href: "/pyq", icon: FileText },
  { name: "Syllabus", href: "/syllabus", icon: ClipboardList },
  { name: "Me", href: "/dashboard", icon: LayoutDashboard },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="relative flex flex-col items-center justify-center h-full flex-1 group transition-colors"
            >
              <div className={`flex flex-col items-center justify-center transition-all duration-300 ${
                isActive ? "scale-110" : "scale-100"
              }`}>
                <item.icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white"
                  }`} 
                />
                <span className={`text-[10px] font-bold mt-1 transition-colors ${
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white"
                }`}>
                  {item.name}
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/4 right-1/4 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-b-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Mail, MapPin, Phone, Code2, Heart, Award } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          
          {/* Brand & Description */}
          <div className="space-y-6 lg:col-span-1 flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-black tracking-tight italic">
              Edu<span className="text-indigo-600 dark:text-indigo-500">Bag</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Empowering J&K students with premium, curated educational resources to ace board and competitive exams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li><Link href="/learn" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Study Material</Link></li>
              <li><Link href="/pyq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Previous Papers</Link></li>
              <li><Link href="/tests" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Mock Tests</Link></li>
              <li><Link href="/colleges" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">College Guide</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li><Link href="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help & FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">No Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 text-center md:text-left">Contact</h4>
            <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-start justify-center md:justify-start gap-3 text-center md:text-left">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                <p>Kupwara, Jammu & Kashmir<br/>India - 193222</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                <p>+91 7889851259</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                <p>pirshariq419@gmail.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              © {new Date().getFullYear()} EduBag. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
              <Award className="w-4 h-4 text-indigo-500" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Founder & Developer</span>
                <span className="text-[11px] font-black text-slate-900 dark:text-white">Mohammad Shariq Pir</span>
              </div>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> in J&K
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

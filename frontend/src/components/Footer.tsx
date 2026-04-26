import Link from "next/link";
import { Mail, Heart, Award } from "lucide-react";

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
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5 flex flex-col items-center md:items-start w-full">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2 text-center md:text-left">Contact</h4>
            
            {/* Embed Map */}
            <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105267.37803608779!2d74.1953118128362!3d34.42602717830026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1b6988899fa0b%3A0xc540306bbdb830c7!2sKupwara%2C%20Jammu%20and%20Kashmir!5e0!3m2!1sen!2sin!4v1714109151240!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 w-full pt-4">
              <a href="mailto:pirshariq419@gmail.com" className="group" aria-label="Email">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-all duration-300">
                  <Mail className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                </div>
              </a>

              <a href="https://instagram.com/pirshariq419" target="_blank" rel="noopener noreferrer" className="group" aria-label="Instagram">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-pink-50 dark:group-hover:bg-pink-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-500 group-hover:text-pink-500 transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
              </a>

              <a href="https://linkedin.com/in/pirshariq419" target="_blank" rel="noopener noreferrer" className="group" aria-label="LinkedIn">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-6 text-center pb-24 md:pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 w-full">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-500/30 shrink-0 shadow-inner">
                <img 
                  src="/founder.jpg" 
                  alt="MOHAMMAD SHARIQ PIR" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start leading-none justify-center">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400 mb-1">Founder & Developer</span>
                <span className="text-xs sm:text-sm font-black tracking-wide text-slate-900 dark:text-white">MOHAMMAD SHARIQ PIR</span>
              </div>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> in J&K
            </p>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            © {new Date().getFullYear()} EduBag. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

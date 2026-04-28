import Image from 'next/image';
import { ExternalLink, MapPin, Lock } from 'lucide-react';
import { toast } from '@/store/toastStore';

interface CollegeCardProps {
  name: string;
  image: string;
  location: string;
  description: string;
  link: string;
  isLocked?: boolean;
  onLockedClick?: () => void;
}

export default function CollegeCard({ name, image, location, description, link, isLocked, onLockedClick }: CollegeCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onLockedClick) {
      e.preventDefault();
      onLockedClick();
    } else if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      toast.info("Official link not available yet.");
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image || "/images/logo.png"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
        <div className="absolute bottom-4 left-5 right-5 z-10">
          <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-200 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" /> {location || "J&K, India"}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow bg-white dark:bg-slate-900 relative">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-grow line-clamp-3 leading-relaxed">
          {description}
        </p>
        <button
          onClick={handleClick}
          className={`inline-flex items-center justify-between w-full px-6 py-3.5 rounded-full font-bold transition-all group/btn border ${
            isLocked 
            ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20" 
            : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md"
          }`}
        >
          <span>{isLocked ? "Unlock Access" : "Visit Website"}</span>
          {isLocked ? <Lock className="w-4 h-4 text-amber-500" /> : <ExternalLink className="w-4 h-4 text-slate-400 group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400 transition-colors" />}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, X, FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure the worker to use the unpkg CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerModalProps {
  url: string;
  name: string;
  onClose: () => void;
}

export default function PdfViewerModal({ url, name, onClose }: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Update container width and device type on mount and resize
    const updateDimensions = () => {
      setContainerWidth(Math.min(window.innerWidth - 32, 1000));
      setIsMobile(window.innerWidth < 768);
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Track scroll position on mobile to update current page number
  useEffect(() => {
    if (!isMobile || !numPages) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageStr = entry.target.id.split('-').pop();
          if (pageStr) setPageNumber(parseInt(pageStr, 10));
        }
      });
    }, {
      root: document.getElementById('pdf-scroll-container'),
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    });

    for (let i = 1; i <= numPages; i++) {
      const el = document.getElementById(`pdf-page-${i}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [numPages, isMobile, scale]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-slate-900 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-white font-bold truncate text-sm md:text-base">{name}</h3>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {numPages && (
            <div className="hidden md:flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-white/5">
              <button 
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className="p-1.5 hover:bg-white/10 rounded-md disabled:opacity-50 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= numPages) setPageNumber(val);
                  }}
                  className="w-10 bg-slate-700/50 rounded text-center text-xs font-bold text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500 px-1 py-0.5 mx-1"
                />
                <span className="text-xs font-bold text-slate-400 mr-2">
                  / {numPages}
                </span>
              </div>
              <button 
                onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
                className="p-1.5 hover:bg-white/10 rounded-md disabled:opacity-50 text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-white/5">
             <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 hover:bg-white/10 rounded-md text-slate-300 transition-colors">
               <ZoomOut className="w-4 h-4" />
             </button>
             <span className="text-xs font-bold text-slate-300 px-2 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
             <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-1.5 hover:bg-white/10 rounded-md text-slate-300 transition-colors">
               <ZoomIn className="w-4 h-4" />
             </button>
          </div>

          {/* Mobile Jump-to-page / Indicator */}
          {numPages && isMobile && (
            <div className="flex md:hidden items-center gap-1 bg-slate-800 rounded-lg p-1 border border-white/5 ml-1">
              <input 
                type="number" 
                min={1} 
                max={numPages}
                value={pageNumber}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= numPages) {
                    setPageNumber(val);
                    document.getElementById(`pdf-page-${val}`)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-10 bg-slate-700/50 rounded text-center text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500 py-1"
              />
              <span className="text-xs text-slate-400 font-bold pr-1">/ {numPages}</span>
            </div>
          )}

          <a
            href={url}
            download
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all ml-1 md:ml-2"
          >
            <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span>
          </a>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all ml-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div id="pdf-scroll-container" className="flex-1 min-h-0 bg-slate-950 flex flex-col items-center overflow-auto p-4 custom-scrollbar">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center text-slate-400 mt-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
              <p className="font-bold animate-pulse">Loading Document...</p>
            </div>
          }
          error={
            <div className="text-red-400 mt-32 font-bold p-6 bg-red-500/10 rounded-xl border border-red-500/20 text-center max-w-md">
              <FileText className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-80" />
              <p className="text-lg mb-2">Failed to load PDF</p>
              <p className="text-sm opacity-80 mb-6 text-red-300">The file might be corrupted or the link is invalid.</p>
              <a href={url} download className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download File Instead
              </a>
            </div>
          }
          className="flex flex-col items-center transition-all duration-300"
        >
          {numPages && (
            <div className="mb-4 flex flex-col items-center">
               {isMobile ? (
                 // Mobile: Continuous scroll view
                 Array.from(new Array(numPages), (el, index) => (
                   <div key={`page_${index + 1}`} id={`pdf-page-${index + 1}`} className="relative mb-6">
                     <Page 
                       pageNumber={index + 1} 
                       scale={scale} 
                       width={containerWidth}
                       className="shadow-2xl shadow-black/50 bg-white rounded-lg overflow-hidden"
                       renderTextLayer={true}
                       renderAnnotationLayer={true}
                       loading={
                         <div className="flex items-center justify-center w-full h-[60vh] bg-slate-900 rounded-lg">
                           <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                         </div>
                       }
                     />

                   </div>
                 ))
               ) : (
                 // Desktop: Single page view
                 <Page 
                   pageNumber={pageNumber} 
                   scale={scale} 
                   width={containerWidth}
                   className="shadow-2xl shadow-black/50 mb-4 bg-white rounded-lg overflow-hidden"
                   renderTextLayer={true}
                   renderAnnotationLayer={true}
                   loading={
                     <div className="flex items-center justify-center w-full h-[60vh] bg-slate-900 rounded-lg">
                       <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                     </div>
                   }
                 />
               )}
            </div>
          )}
        </Document>

        {/* Mobile Zoom Controls Only */}
        {numPages && (
          <div className="md:hidden flex flex-col items-center gap-3 mt-2 mb-8 w-full max-w-xs shrink-0">
            {/* Zoom */}
            <div className="flex items-center justify-between w-full bg-slate-800 rounded-xl p-2 border border-white/5 shadow-lg">
               <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                 <ZoomOut className="w-5 h-5" />
               </button>
               <span className="text-sm font-bold text-white px-4">{Math.round(scale * 100)}%</span>
               <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                 <ZoomIn className="w-5 h-5" />
               </button>
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 1);
        }
      `}} />
    </motion.div>
  );
}

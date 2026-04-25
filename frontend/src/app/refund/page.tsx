"use client";

import { motion } from "framer-motion";
import { XCircle, CreditCard, ShieldAlert, AlertCircle } from "lucide-react";

export default function NoRefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest border border-red-200 dark:border-red-500/20 shadow-sm"
          >
            <XCircle className="w-4 h-4" /> Strict Policy
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            No Refund <span className="text-indigo-600 dark:text-indigo-500">Policy</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Last Updated: April 25, 2026</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-200 dark:border-white/10 shadow-xl space-y-12"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              1. Final Sale Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Due to the digital nature of the services provided by EduBag (including but not limited to PDF downloads, Mock Tests, and Premium Notes), **all sales are final**. Once a Pro Membership is purchased and access to digital content is granted, we do not offer any refunds or credits for any reason.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              2. Digital Content Access
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Access to premium resources is instant upon successful payment. Because the value is delivered immediately, the right of withdrawal or refund is waived at the moment of purchase. We highly recommend exploring our free resources before upgrading.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <CreditCard className="w-5 h-5" />
              </div>
              3. Transaction Errors
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              In the rare event of a confirmed **duplicate payment** due to a technical glitch, we will process a refund for the extra transaction. You must report such cases within 24 hours with valid proof of payment.
            </p>
          </section>

          <div className="p-8 bg-red-50/50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-500/10">
             <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
               <span className="text-red-600 dark:text-red-400 uppercase tracking-widest text-[10px] mr-2">Important:</span>
               By upgrading to EduBag Pro, you acknowledge and agree to this No Refund Policy. We do not provide prorated refunds for early cancellations or unused days.
             </p>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Have questions before you buy? <a href="/contact" className="text-indigo-600 hover:underline">Contact our support team</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

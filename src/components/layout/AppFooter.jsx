import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function AppFooter({ lang, onOpenLogoModal, onOpenFeedbackTab }) {
  return (
    <footer className="bg-[#0B0E14] light-theme:bg-white border-t border-[#D4AF37]/40 light-theme:border-amber-300/40 py-8 mt-12 text-sm text-[#94A3B8] light-theme:text-slate-700 shadow-2xl transition-colors">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-64.png" 
            alt="The Tirumala Verse logo"
            className="w-10 h-10 rounded-full border-2 border-[#FFD700] cursor-pointer hover:scale-110 transition-transform shadow-md" 
            onClick={onOpenLogoModal}
          />
          <div>
            <p className="font-serif text-base font-bold gold-gradient-text">
              The Tirumala Verse
            </p>
            <p className="text-xs text-[#94A3B8] light-theme:text-slate-600 font-medium">
              {lang === 'en'
                ? 'Your Independent Guide to Tirumala'
                : 'మీ స్వతంత్ర తిరుమల దివ్య దర్శిని'}
            </p>
          </div>
        </div>

        {/* Give Feedback Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenFeedbackTab}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-black" />
            <span>Give Feedback</span>
          </button>
        </div>
      </div>

      {/* HIGH-CONTRAST READABLE FOOTER DISCLAIMER */}
      <div className="container pt-6 mt-6 border-t border-white/10 light-theme:border-slate-200">
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#141923] light-theme:bg-amber-50/90 border border-[#D4AF37]/40 light-theme:border-amber-300/60 shadow-xl text-xs sm:text-sm text-slate-100 light-theme:text-slate-900 leading-relaxed font-medium">
          <p>
            <span className="font-black text-[#FFD700] light-theme:text-[#B45309] uppercase tracking-wider block sm:inline mb-1 sm:mb-0 mr-1.5 text-xs sm:text-sm">
              ⚠️ Disclaimer:
            </span>
            <span>
              TheTirumalaVerse is an independent, privately run informational blog, cultural encyclopedia, and travel guide. This website is not affiliated with, authorized, maintained, sponsored, or endorsed by the Tirumala Tirupati Devasthanams (TTD), the Government of Andhra Pradesh, or any official religious administration. The official booking portal of the temple trust is accessible exclusively at{' '}
            </span>
            <a 
              href="https://ttdevasthanams.ap.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#60A5FA] light-theme:text-[#1D4ED8] font-bold underline hover:brightness-125"
            >
              ttdevasthanams.ap.gov.in
            </a>
            <span>
              . All official ticket quotas, seva bookings, and accommodation reservations must be made directly through their authorized platform. We do not sell tickets, collect payments, or offer commercial booking services.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

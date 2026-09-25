import React from 'react';
import { MessageSquare } from 'lucide-react';
import { isModifiedClick } from '../../utils/navigation';

export default function AppFooter({ lang, onNavigate, onOpenLogoModal, onOpenFeedbackTab }) {
  const handleLinkClick = (href, e) => {
    if (isModifiedClick(e)) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    }
  };

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

      {/* INTERNAL NAVIGATION SECTION */}
      <div className="container pt-6 mt-6 border-t border-white/10 light-theme:border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-left">

          {/* Core Pages */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#FFD700] light-theme:text-amber-800">
              {lang === 'en' ? 'Core Pages' : 'ముఖ్య విభాగాలు'}
            </h3>
            <ul className="space-y-1.5 font-medium">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLinkClick('/', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Home' : 'హోమ్ పేజీ'}
                </a>
              </li>
              <li>
                <a
                  href="/calendar"
                  onClick={(e) => handleLinkClick('/calendar', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Festival Calendar' : 'ఉత్సవాల క్యాలెండర్'}
                </a>
              </li>
              <li>
                <a
                  href="/sevas"
                  onClick={(e) => handleLinkClick('/sevas', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Daily Sevas' : 'నిత్య సేవలు'}
                </a>
              </li>
              <li>
                <a
                  href="/tokens"
                  onClick={(e) => handleLinkClick('/tokens', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Darshan Tokens' : 'దర్శనం టోకెన్లు'}
                </a>
              </li>
              <li>
                <a
                  href="/glossary"
                  onClick={(e) => handleLinkClick('/glossary', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Utsavam Glossary' : 'ఉత్సవ నిఘంటువు'}
                </a>
              </li>
            </ul>
          </div>

          {/* Festival Guides */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#FFD700] light-theme:text-amber-800">
              {lang === 'en' ? 'Festival Guides' : 'ఉత్సవ సమగ్ర మార్గదర్శకాలు'}
            </h3>
            <ul className="space-y-1.5 font-medium">
              <li>
                <a
                  href="/festivals/garuda-vahanam"
                  onClick={(e) => handleLinkClick('/festivals/garuda-vahanam', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Garuda Vahanam Guide' : 'గరుడ వాహనం మార్గదర్శిని'}
                </a>
              </li>
              <li>
                <a
                  href="/festivals/rathotsavam"
                  onClick={(e) => handleLinkClick('/festivals/rathotsavam', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Rathotsavam Guide' : 'రథోత్సవం మార్గదర్శిని'}
                </a>
              </li>
              <li>
                <a
                  href="/festivals/pavithrotsavam"
                  onClick={(e) => handleLinkClick('/festivals/pavithrotsavam', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Pavithrotsavam Guide' : 'పవిత్రోత్సవం మార్గదర్శిని'}
                </a>
              </li>
              <li>
                <a
                  href="/festivals/brahmotsavam"
                  onClick={(e) => handleLinkClick('/festivals/brahmotsavam', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Brahmotsavam Guide' : 'బ్రహ్మోత్సవాల మార్గదర్శిని'}
                </a>
              </li>
            </ul>
          </div>

          {/* Shrines & References */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#FFD700] light-theme:text-amber-800">
              {lang === 'en' ? 'Shrines & References' : 'పుణ్యక్షేత్రాలు & ఆధారాలు'}
            </h3>
            <ul className="space-y-1.5 font-medium">
              <li>
                <a
                  href="/temples"
                  onClick={(e) => handleLinkClick('/temples', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? '7 Sacred Shrines' : 'సప్త పుణ్యక్షేత్రాలు'}
                </a>
              </li>
              <li>
                <a
                  href="/references"
                  onClick={(e) => handleLinkClick('/references', e)}
                  className="text-[#94A3B8] light-theme:text-slate-700 hover:text-[#FFD700] light-theme:hover:text-amber-800 transition-colors inline-block py-0.5"
                >
                  {lang === 'en' ? 'Historical References' : 'చారిత్రక ఆధారాలు & గ్రంథాలు'}
                </a>
              </li>
            </ul>
          </div>

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

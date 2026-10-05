import useGlossary from "../hooks/useGlossary";
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { GLOSSARY_CATEGORIES } from '../data/utsavaGlossary';
import { Search, BookOpen, HelpCircle, Info, ChevronDown, ChevronUp, Image as ImageIcon, X, ChevronLeft, ChevronRight, Edit3, Compass, ArrowRight } from 'lucide-react';
import { isModifiedClick } from '../utils/navigation';

const FESTIVAL_GUIDE_MAP = {
  'garuda-seva': {
    href: '/festivals/garuda-vahanam',
    name: 'Garuda Vahanam',
    nameTe: 'గరుడ వాహన సేవ',
    title: 'Garuda Vahanam',
  },
  'rathotsavam': {
    href: '/festivals/rathotsavam',
    name: 'Rathotsavam',
    nameTe: 'రథోత్సవం',
    title: 'Rathotsavam',
  },
  'pavithrotsavam': {
    href: '/festivals/pavithrotsavam',
    name: 'Pavithrotsavam',
    nameTe: 'పవిత్రోత్సవం',
    title: 'Pavithrotsavam',
  },
  'brahmotsavam-origin': {
    href: '/festivals/brahmotsavam',
    name: 'Brahmotsavam',
    nameTe: 'బ్రహ్మోత్సవాలు',
    title: 'Brahmotsavam',
  },
  'vaikhanasa-archakas': {
    href: '/festivals/kainkaryaparas',
    name: 'Temple Kainkaryaparas Guide',
    nameTe: 'కైంకర్యపరుల సమగ్ర గైడ్',
    title: 'Temple Kainkaryaparas',
  },
  'jeeyangar-system': {
    href: '/festivals/kainkaryaparas',
    name: 'Jeeyangar Institution Guide',
    nameTe: 'జీయంగార్ల వ్యవస్థ సమగ్ర గైడ్',
    title: 'Jeeyangar Institution',
  },
  'acharya-purushas': {
    href: '/festivals/kainkaryaparas',
    name: 'Acharya Purushas Guide',
    nameTe: 'ఆచార్య పురుషుల సమగ్ర గైడ్',
    title: 'Acharya Purushas',
  },
  'sannidhi-golla': {
    href: '/festivals/sannidhi-golla',
    name: 'Sannidhi Golla Guide',
    nameTe: 'సన్నిధి గొల్ల సమగ్ర గైడ్',
    title: 'Sannidhi Golla',
  },
  'sikhamani-garland': {
    href: '/festivals/pushpa-kainkaryam',
    name: 'Pushpa Kainkaryam Guide',
    nameTe: 'పుష్ప కైంకర్య సమగ్ర గైడ్',
    title: 'Pushpa Kainkaryam',
  },
  'pula-ara': {
    href: '/festivals/pushpa-kainkaryam',
    name: 'Pushpa Kainkaryam Guide',
    nameTe: 'పుష్ప కైంకర్య సమగ్ర గైడ్',
    title: 'Pushpa Kainkaryam',
  },
  'sapthagiri-eleven-names': {
    href: '/festivals/sapthagiri-geography',
    name: 'Sapthagiri Geography Guide',
    nameTe: 'సప్తగిరి భౌగోళిక సమగ్ర గైడ్',
    title: 'Sapthagiri Geography',
  },
  'swami-pushkarini-tirthas': {
    href: '/festivals/sapthagiri-geography',
    name: 'Pushkarini Tirthas Guide',
    nameTe: 'పుష్కరిణి తీర్థాల గైడ్',
    title: 'Pushkarini Tirthas',
  },
  'silathoranam': {
    href: '/festivals/sapthagiri-geography',
    name: 'Silathoranam & Geography Guide',
    nameTe: 'శిలాతోరణం & సప్తగిరి గైడ్',
    title: 'Silathoranam',
  },
  'sankeertana-bhandagaram': {
    href: '/festivals/sankeertana-bhandagaram',
    name: 'Sankeertana Bhandagaram Guide',
    nameTe: 'సంకీర్తన భాండాగారం సమగ్ర గైడ్',
    title: 'Sankeertana Bhandagaram',
  },
  'veturi-prabhakara-sastry': {
    href: '/festivals/sankeertana-bhandagaram',
    name: 'Annamacharya Copper Plates Guide',
    nameTe: 'అన్నమయ్య రాగిరేకుల గైడ్',
    title: 'Annamacharya Discovery',
  },
  'sadhu-subrahmanya-sastri': {
    href: '/festivals/epigraphical-centenary',
    name: 'Epigraphical Report Centenary Guide',
    nameTe: 'శాసన పరిశోధన శతాబ్ది గైడ్',
    title: 'Epigraphical Centenary',
  },
  'rathi-ratham': {
    href: '/festivals/rathotsavam',
    name: 'Rathotsavam & Chariot Guide',
    nameTe: 'రథోత్సవ సమగ్ర గైడ్',
    title: 'Rathotsavam',
  },
  'kaltheru': {
    href: '/festivals/rathotsavam',
    name: 'Rathotsavam & Rock Chariot Guide',
    nameTe: 'రథోత్సవ సమగ్ర గైడ్',
    title: 'Rathotsavam',
  },
};

export default function UtsavamGlossary({ 
  lang = 'en', 
  targetTermId, 
  customGlossaryEdits = {}, 
  isAdminLoggedIn,
  onOpenAdminEditTerm,
  onNavigate
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTermId, setExpandedTermId] = useState(null);
  const [showRightFade, setShowRightFade] = useState(false);

  const categoryNavRef = useRef(null);

  const checkCategoryNavScroll = useCallback(() => {
    if (categoryNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryNavRef.current;
      const hasMoreRight = scrollLeft + clientWidth < scrollWidth - 6;
      setShowRightFade(hasMoreRight);
    }
  }, []);

  useEffect(() => {
    checkCategoryNavScroll();
    window.addEventListener('resize', checkCategoryNavScroll);
    return () => window.removeEventListener('resize', checkCategoryNavScroll);
  }, [checkCategoryNavScroll]);

  // Gallery Lightbox Modal State
  const [activeGalleryTerm, setActiveGalleryTerm] = useState(null);
  const [galleryImgIndex, setGalleryImgIndex] = useState(0);

  const termRefs = useRef({});

  // Helper function to parse images into standard objects
  const parseImagesList = (rawImgs) => {
    if (!Array.isArray(rawImgs)) return [];
    return rawImgs.map(img => {
      if (!img) return null;
      if (typeof img === 'string' && img.trim() !== '') {
        return { url: img.trim(), caption: '' };
      }
      if (typeof img === 'object' && img.url && typeof img.url === 'string' && img.url.trim() !== '') {
        return { url: img.url.trim(), caption: img.caption || '' };
      }
      return null;
    }).filter(Boolean);
  };

  // Merge default terms with Admin custom edits
 const allTermsList = useGlossary(customGlossaryEdits);


  // Filtered & Strictly Sorted Terms (Ascending Order A-Z / అ-ఱ)
  const filteredTerms = useMemo(() => {
    const list = allTermsList.filter(item => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchTerm.trim().toLowerCase();
      if (!q) return matchesCat;

      const termEn = (item.term || '').toLowerCase();
      const termTe = (item.termTe || '').toLowerCase();
      const descEn = (item.shortDesc || '').toLowerCase();
      const descTe = (item.shortDescTe || '').toLowerCase();
      const detailEn = (item.detailedMeaning || '').toLowerCase();
      const detailTe = (item.detailedMeaningTe || '').toLowerCase();

      const matchesSearch =
        termEn.includes(q) ||
        termTe.includes(q) ||
        descEn.includes(q) ||
        descTe.includes(q) ||
        detailEn.includes(q) ||
        detailTe.includes(q);

      return matchesCat && matchesSearch;
    });

    // Sort in ascending order based on active language
    return list.sort((a, b) => {
      const nameA = lang === 'en' ? a.term : a.termTe;
      const nameB = lang === 'en' ? b.term : b.termTe;
      return nameA.localeCompare(nameB, lang === 'te' ? 'te' : 'en');
    });
  }, [allTermsList, searchTerm, selectedCategory, lang]);

  // Auto-scroll to target term if redirected from Calendar Event card
  useEffect(() => {
    if (targetTermId) {
      setExpandedTermId(targetTermId);
      setTimeout(() => {
        const el = termRefs.current[targetTermId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [targetTermId]);

  const toggleExpand = (id) => {
    setExpandedTermId(prev => prev === id ? null : id);
  };


  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* HEADER HERO BANNER - Premium Redesign */}
      <div className="dark-hero-card relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-xl dark:shadow-2xl">
        {/* Vibrant Gradient Overlay to override flat black !important class */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b05] via-[#0B0E14] to-[#141923] opacity-80 pointer-events-none"></div>
        
        {/* Glowing Orbs for ambiance */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/15 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FF5722]/15 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col items-start gap-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-[#D4AF37]/10 border border-amber-300 dark:border-[#D4AF37]/30 text-amber-800 dark:text-[#FFD700] text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'en' ? 'Utsava Shabda Kosh' : 'ఉత్సవ శబ్ద కోశం'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold gold-gradient-text leading-tight">
              {lang === 'en' ? 'Festival & Utsavam Glossary' : 'ఉత్సవాలు, వాహనాలు & భక్తుల దివ్య నిఘంటువు'}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium max-w-3xl">
              {lang === 'en'
                ? 'Explore Vedic origins, Puranic history, Alwar pasurams, royal traditions, and sacred meanings of terms, rituals, Vahanas, Naivedyams, and Great Devotees associated with Tirumala Utsavams.'
                : 'తిరుమల శ్రీవారి బ్రహ్మోత్సవాలు, దివ్య వాహనాలు, పంచబేరాలు, నైవేద్యాలు మరియు మహనీయ భక్తుల వెనుకున్న పవిత్రమైన అంతరార్థాలు, పురాణ ప్రాశస్త్యాలను ఇక్కడ వివరంగా తెలుసుకోండి.'}
            </p>
          </div>

          {/* SEARCH BAR - Floating & Elegant */}
          <div className="pt-2 relative max-w-2xl">
            <div className="relative flex items-center group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <Search className="w-5 h-5 absolute left-5 text-[#FFD700] z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Search (e.g. Brahmotsavam, Garuda, Ramanuja, Naivedyam)...'
                    : 'శోధించండి (ఉదా: బ్రహ్మోత్సవం, గరుడ, రామానుజ, నైవేద్యం)...'
                }
                className="w-full pl-14 pr-12 py-4 rounded-2xl bg-black/40 backdrop-blur-md border border-[#D4AF37]/50 text-white placeholder-slate-400 focus:border-[#FFD700] focus:bg-black/60 focus:outline-none text-sm sm:text-base shadow-inner transition-all relative z-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-black/60 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-[#D4AF37]/30 text-xs transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* CATEGORY FILTER CHIPS - Sticky Header */}
      <div className="sticky top-[64px] sm:top-[72px] z-40 -mx-4 px-4 py-3 sm:mx-0 sm:px-0 sm:py-2 bg-gradient-to-b from-[#f8fafc]/95 to-[#f8fafc]/80 dark:from-[#0B0E14]/95 dark:to-[#0B0E14]/80 backdrop-blur-xl border-y border-amber-200/50 dark:border-[#D4AF37]/20 shadow-sm transition-all">
        <div className="relative max-w-full">
          <div
            ref={categoryNavRef}
            onScroll={checkCategoryNavScroll}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1"
          >
            {GLOSSARY_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-[#D4AF37]/20 scale-105'
                      : 'bg-white dark:bg-[#141923] text-slate-600 dark:text-[#94A3B8] hover:text-amber-800 dark:hover:text-[#FFD700] border border-slate-200 dark:border-[#D4AF37]/30 hover:border-amber-400 dark:hover:border-[#D4AF37]/60 hover:shadow-md'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'en' ? cat.labelEn : cat.labelTe}</span>
                </button>
              );
            })}
          </div>
          {/* Subtle Mobile Right-Edge Fade Scroll Indicator */}
          {showRightFade && (
            <div
              className="sm:hidden absolute top-0 right-0 bottom-1 w-8 pointer-events-none z-10 bg-gradient-to-l from-white dark:from-[#0B0E14] to-transparent transition-opacity duration-300"
            />
          )}
        </div>
      </div>

      {/* RESULTS COUNT SUMMARY & SORTING INDICATOR */}
      <div className="flex items-center justify-between text-xs text-slate-700 dark:text-[#94A3B8] px-1 font-mono font-bold">
        <span>
          {lang === 'en'
            ? `Showing ${filteredTerms.length} terms (Ascending Order A-Z)`
            : `మొత్తం ${filteredTerms.length} పదాలు కనిపించాయి (అకారాది క్రమం అ-ఱ)`}
        </span>
        {searchTerm && (
          <span className="text-amber-700 dark:text-[#FFD700] italic">
            {lang === 'en' ? `Filtered by "${searchTerm}"` : `"${searchTerm}" శోధన ఫలితాలు`}
          </span>
        )}
      </div>

      {/* TERMS GRID LIST (SORTED ASCENDING + GOLD HOVER GLOW + HIGH CONTRAST) */}
      {filteredTerms.length === 0 ? (
        <div className="glass-card p-10 text-center rounded-3xl border border-[#D4AF37]/30 space-y-3">
          <HelpCircle className="w-12 h-12 text-[#FFD700] mx-auto opacity-60 animate-bounce" />
          <h4 className="font-serif text-lg font-bold text-white">
            {lang === 'en' ? 'No terms found' : 'ఏ పదాలు కనిపించలేదు'}
          </h4>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            {lang === 'en'
              ? 'Try searching with a different keyword like "Brahmotsavam", "Garuda", "Ramanuja", or "Ankurarpanam".'
              : 'దయచేసి "బ్రహ్మోత్సవం", "గరుడ", "రామానుజ", లేదా "అంకురార్పణ" వంటి పదాలతో మళ్లీ ప్రయత్నించండి.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-[#FFD700] text-xs font-bold hover:bg-[#D4AF37]/20 transition-all"
          >
            {lang === 'en' ? 'Reset Search' : 'శోధనను రీసెట్ చేయండి'}
          </button>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-5 sm:gap-6 space-y-5 sm:space-y-6 pb-4">
          {filteredTerms.map((item) => {
            const isExpanded = expandedTermId === item.id;
            const validImages = Array.isArray(item.images)
              ? item.images.filter(img => {
                  if (typeof img === 'string') return img.trim() !== '';
                  return img && typeof img.url === 'string' && img.url.trim() !== '';
                })
              : [];

            const hasAdminImages = validImages.length > 0;

            return (
              <div
                key={item.id}
                ref={el => termRefs.current[item.id] = el}
                onClick={() => toggleExpand(item.id)}
                className={`glass-card glossary-card-hover glossary-term-card break-inside-avoid relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all duration-500 flex flex-col justify-between group cursor-pointer border ${
                  isExpanded
                    ? 'border-[#D4AF37] bg-white dark:bg-[#141923]/95 shadow-[0_8px_30px_rgb(212,175,55,0.15)] ring-1 ring-[#FFD700]/30'
                    : 'border-slate-200 dark:border-[#D4AF37]/20 bg-[#0B0E14]/60 hover:bg-[#141923]/90 hover:shadow-xl hover:shadow-[#D4AF37]/5 hover:border-[#D4AF37]/50'
                }`}
              >
                {/* Subtle Hover Gradient Glow inside Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-transparent to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  {/* Top Bar: Title & Category & Admin Edit Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#FFD700] transition-colors tracking-tight">
                        {lang === 'en' ? item.term : item.termTe}
                      </h3>
                      <span className="block mt-1 text-xs sm:text-sm text-[#FFD700]/80 font-sans font-medium">
                        {lang === 'en' ? item.termTe : item.term}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFD700] font-bold uppercase tracking-wider shadow-sm">
                        {(item.category || "general").replace("_", " ")}
                      </span>
                      
                      {isAdminLoggedIn && onOpenAdminEditTerm && (
                        <button
                          onClick={() => onOpenAdminEditTerm(item)}
                          className="px-2 py-1 rounded-md bg-[#FF5722]/10 hover:bg-[#FF5722]/20 border border-[#FF5722]/30 text-[#FF5722] text-[10px] font-extrabold flex items-center gap-1 transition-all"
                          title="Edit term text & add custom images"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                    {lang === 'en' ? item.shortDesc : item.shortDescTe}
                  </p>

                  {/* Festival Guide Link */}
                  {FESTIVAL_GUIDE_MAP[item.id] && (
                    <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={FESTIVAL_GUIDE_MAP[item.id].href}
                        onClick={(e) => {
                          if (isModifiedClick(e)) return;
                          e.preventDefault();
                          const targetHref = FESTIVAL_GUIDE_MAP[item.id].href;
                          if (onNavigate) {
                            onNavigate(targetHref);
                          } else {
                            window.history.pushState({ path: targetHref }, '', targetHref);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-[#D4AF37]/10 dark:to-[#D4AF37]/5 text-amber-900 dark:text-[#FFD700] border border-amber-200 dark:border-[#D4AF37]/30 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md cursor-pointer group/guide"
                      >
                        <Compass className="w-4 h-4 text-[#FF5722] group-hover/guide:rotate-[20deg] transition-transform duration-300" />
                        <span>
                          {lang === 'en'
                            ? `${FESTIVAL_GUIDE_MAP[item.id].name} Guide`
                            : `${FESTIVAL_GUIDE_MAP[item.id].nameTe} సమగ్ర గైడ్`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover/guide:translate-x-1 group-hover/guide:opacity-100 transition-all duration-300" />
                      </a>
                    </div>
                  )}

                  {/* Admin Custom Image Gallery */}
                  {hasAdminImages && (
                    <div className="pt-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                        {validImages.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            onClick={() => {
                              setActiveGalleryTerm(item);
                              setGalleryImgIndex(imgIdx);
                            }}
                            className="relative h-24 w-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#D4AF37]/30 shadow-sm hover:shadow-lg cursor-pointer group/img shrink-0"
                          >
                            <img
                              src={typeof img === 'string' ? img : img.url}
                              alt={(typeof img === 'string' ? '' : img.caption) || item.term}
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors duration-500"></div>
                            {typeof img !== 'string' && img.caption && (
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent pt-4 pb-1.5 px-2 text-[10px] text-white truncate text-center font-medium">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Meaning Expansion */}
                  <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
                        <span className="text-[11px] sm:text-xs font-bold text-[#FFD700] uppercase tracking-widest flex items-center gap-1.5">
                          <Info className="w-4 h-4" />
                          {lang === 'en' ? 'Detailed History & Meaning' : 'వివరమైన నేపథ్యం & పురాణ అంతరార్థం'}
                        </span>
                        <div className="detailed-meaning-box text-sm sm:text-base text-slate-200 leading-loose bg-[#0B0E14]/50 p-4 sm:p-5 rounded-2xl border border-white/5 whitespace-pre-line font-medium shadow-inner">
                          {lang === 'en' ? item.detailedMeaning : item.detailedMeaningTe}
                        </div>
                        {item.sourceAttribution ? (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[10px] sm:text-[11px] text-slate-300 space-y-0.5 mt-2">
                            <div className="font-bold text-[#FFD700] flex items-center gap-1">
                              <span>📜</span>
                              <span>{lang === 'en' ? 'Source Citation & Research Attribution:' : 'పరిశోధనా మూలం & పత్రికాధారం:'}</span>
                            </div>
                            <div className="text-slate-300 pl-4 font-medium">
                              <span className="text-amber-200">"{item.sourceAttribution.articleTitle}"</span>
                              {item.sourceAttribution.author && <span> — {item.sourceAttribution.author}</span>}
                              {item.sourceAttribution.translator && <span> ({item.sourceAttribution.translator})</span>}
                              <span>, {item.sourceAttribution.publication} ({item.sourceAttribution.issueDate})</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-2 ml-1">
                            📜 {lang === 'en' ? 'Source: TTD Sapthagiri Magazine (Sept 2020)' : 'ఆధారం: టిటిడి సప్తగిరి పత్రిక (సెప్టెంబరు 2020)'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Read More / Less Toggle Button */}
                  <div className="pt-2 flex justify-end">
                    <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/20 text-amber-700 dark:text-[#FFD700] text-xs font-bold transition-all duration-300">
                      <span>{isExpanded ? (lang === 'en' ? 'Show Less' : 'తక్కువ') : (lang === 'en' ? 'Read More' : 'మరిన్ని వివరాలు')}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADMIN IMAGE GALLERY LIGHTBOX MODAL */}
      {activeGalleryTerm && Array.isArray(activeGalleryTerm.images) && activeGalleryTerm.images.length > 0 && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setActiveGalleryTerm(null)}
        >
          <div className="flex items-center justify-between z-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#FFD700] text-sm sm:text-base">
                📷 {lang === 'en' ? activeGalleryTerm.term : activeGalleryTerm.termTe} — Gallery
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono font-bold text-[#94A3B8]">
                {galleryImgIndex + 1} / {activeGalleryTerm.images.length}
              </span>
            </div>

            <button
              onClick={() => setActiveGalleryTerm(null)}
              className="px-3 py-1.5 rounded-full bg-red-600 text-white font-extrabold text-xs"
            >
              Close ✕
            </button>
          </div>

          <div 
            className="relative flex-grow flex items-center justify-center my-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={activeGalleryTerm.images[galleryImgIndex].url} 
              alt={activeGalleryTerm.images[galleryImgIndex].caption || activeGalleryTerm.term}
              className="max-h-[80vh] max-w-full object-contain rounded-xl border border-[#D4AF37]/50 shadow-2xl"
            />

            {activeGalleryTerm.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryImgIndex(prev => prev === 0 ? activeGalleryTerm.images.length - 1 : prev - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 text-[#FFD700] hover:bg-black border border-[#D4AF37] flex items-center justify-center shadow-2xl"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryImgIndex(prev => prev === activeGalleryTerm.images.length - 1 ? 0 : prev + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 text-[#FFD700] hover:bg-black border border-[#D4AF37] flex items-center justify-center shadow-2xl"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {activeGalleryTerm.images[galleryImgIndex].caption && (
            <div className="text-center z-10 max-w-md mx-auto" onClick={e => e.stopPropagation()}>
              <div className="p-3 rounded-xl bg-black/80 border border-[#D4AF37]/40 text-[#FFD700] font-bold text-xs shadow-xl">
                📷 {activeGalleryTerm.images[galleryImgIndex].caption}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

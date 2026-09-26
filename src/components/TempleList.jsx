import React from 'react';
import { MapPin, Clock, Shirt, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { TEMPLES } from '../data/templeEvents';
import { isModifiedClick } from '../utils/navigation';

const TEMPLE_CONTEXTUAL_LINKS = {
  'tirumala-main': [
    {
      label: 'Daily Sevas Guide',
      labelTe: 'నిత్య సేవల గైడ్',
      href: '/sevas',
      type: 'route',
    },
    {
      label: 'Darshan Tokens Guide',
      labelTe: 'దర్శనం టోకెన్ల గైడ్',
      href: '/tokens',
      type: 'route',
    },
    {
      label: 'Brahmotsavam Guide',
      labelTe: 'బ్రహ్మోత్సవాల గైడ్',
      href: '/festivals/brahmotsavam',
      type: 'route',
    },
  ],
  'tiruchanur': [
    {
      label: 'Brahmotsavam Guide',
      labelTe: 'బ్రహ్మోత్సవాల గైడ్',
      href: '/festivals/brahmotsavam',
      type: 'route',
    },
  ],
  'govindaraja': [
    {
      label: 'Govindaraja Utsavam Lore',
      labelTe: 'గోవిందరాజ ఉత్సవ విశేషాలు',
      href: '/glossary',
      type: 'glossary',
      termId: 'andal-neerattam-utsavam',
    },
  ],
  'srinivasa-mangapuram': [
    {
      label: 'Brahmotsavam Guide',
      labelTe: 'బ్రహ్మోత్సవాల గైడ్',
      href: '/festivals/brahmotsavam',
      type: 'route',
    },
  ],
  'narayanavanam': [
    {
      label: 'Kalyanotsavam Lore',
      labelTe: 'కల్యాణోత్సవ విశేషాలు',
      href: '/glossary',
      type: 'glossary',
      termId: 'kalyanotsavam',
    },
  ],
  'kodandarama': [
    {
      label: 'Pavithrotsavam Guide',
      labelTe: 'పవిత్రోత్సవం గైడ్',
      href: '/festivals/pavithrotsavam',
      type: 'route',
    },
  ],
};

export default function TempleList({ lang, onSelectTemple, onNavigate, onNavigateToGlossary }) {
  return (
    <div className="space-y-6 py-4">
      {/* Title Header */}
      <div className="glass-card p-6 border-l-4 border-l-[#FFD700] border-[#D4AF37]/30">
        <div className="flex items-center gap-3 mb-2">
          <Compass className="w-6 h-6 text-[#FFD700]" />
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            {lang === 'en' ? 'The 7 Sacred Shrines of Tirumala & Tirupati' : 'తిరుమల-తిరుపతి సప్త దివ్య పుణ్యక్షేత్రాలు'}
          </h1>
        </div>
        <p className="text-sm text-[#94A3B8] max-w-3xl">
          {lang === 'en'
            ? 'Each of these 7 sacred temples holds profound spiritual significance in the divine legend of Lord Venkateswara and Goddess Padmavathi. Click "View Events" on any temple to view its dedicated calendar.'
            : 'శ్రీ వేంకటేశ్వర స్వామి మరియు పద్మావతి అమ్మవార్ల దివ్య గాథతో ముడిపడి ఉన్న 7 పుణ్యక్షేత్రాల సమాచారం.'}
        </p>
      </div>

      {/* Temple Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLES.slice(0, 7).map(temple => (
          <div 
            key={temple.id}
            className="glass-card overflow-hidden flex flex-col justify-between border border-[#D4AF37]/30 hover:border-[#FFD700] transition-all hover:-translate-y-1 group"
          >
            <div>
              {/* Image Header */}
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={temple.image} 
                  alt={temple.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-black/40"></div>
                
                <span 
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-black shadow-lg"
                  style={{ backgroundColor: temple.color }}
                >
                  {temple.badge}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors leading-snug">
                  {lang === 'en' ? temple.name : temple.teluguName}
                </h3>

                <p className="text-xs text-[#FFD700] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>{temple.deity}</span>
                </p>

                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                  {temple.description}
                </p>

                {/* Info List */}
                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#3A86EF] shrink-0" />
                    <span>{temple.location} ({temple.distanceFromStation})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#FFB703] shrink-0" />
                    <span>{temple.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shirt className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                    <span className="truncate">{temple.dressCode}</span>
                  </div>
                </div>

                {/* Contextual Guides / Quick Links (only rendered if temple has any) */}
                {TEMPLE_CONTEXTUAL_LINKS[temple.id] && (
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] font-bold">
                      {lang === 'en' ? 'Quick Guides' : 'త్వరిత గైడ్లు'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {TEMPLE_CONTEXTUAL_LINKS[temple.id].map((link, idx) => (
                        <a
                          key={`${temple.id}-guide-${idx}`}
                          href={link.href}
                          onClick={(e) => {
                            if (isModifiedClick(e)) return;
                            e.preventDefault();
                            if (link.type === 'glossary' && link.termId && onNavigateToGlossary) {
                              onNavigateToGlossary(link.termId);
                            } else if (onNavigate) {
                              onNavigate(link.href);
                            } else {
                              window.history.pushState({}, '', link.href);
                              window.dispatchEvent(new PopStateEvent('popstate'));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold bg-amber-500/10 dark:bg-[#D4AF37]/15 hover:bg-amber-500/20 dark:hover:bg-[#D4AF37]/30 text-amber-900 dark:text-[#FFD700] hover:text-amber-950 dark:hover:text-white border border-amber-600/30 dark:border-[#D4AF37]/40 hover:border-amber-600 dark:hover:border-[#FFD700] transition-all shadow-sm cursor-pointer"
                        >
                          {lang === 'en' ? link.label : (link.labelTe || link.label)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Action Footer: CLICK SHOWS ONLY THAT TEMPLE'S EVENTS IN CALENDAR */}
            <div className="p-4 bg-[#0B0E14]/80 border-t border-[#D4AF37]/20 flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8] font-bold">
                {lang === 'en' ? 'Filter Shrine Events' : 'ఈ ఆలయ ఉత్సవాలు'}
              </span>
              <a
                href="/calendar"
                onClick={(e) => {
                  if (isModifiedClick(e)) return;
                  e.preventDefault();
                  onSelectTemple(temple.id);
                }}
                className="btn-gold text-xs py-1.5 px-3"
              >
                <span>{lang === 'en' ? 'View Temple Events' : 'ఉత్సవాలు చూడు'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

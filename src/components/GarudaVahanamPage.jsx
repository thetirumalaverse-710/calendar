import React, { useMemo, useRef, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Star,
} from 'lucide-react';
import { getFestivalTopic, matchFestivalEvents } from '../data/festivalTopics';
import { TEMPLES } from '../data/templeEvents';
import { getTempleFilterLabel } from '../utils/templeHelpers';
import useTheme from '../hooks/useTheme';
import { isModifiedClick } from '../utils/navigation';
import { getISTNowComponents } from '../utils/indiaTime';
import { MEDIA_ITEMS } from '../data/mediaAndReferences';

/* ─────────────────────────────────────────────
   Gallery data — no images stored locally.
   Photographs and media © Tirumala Tirupati Devasthanams
   and original content creators.
   Links point to original posts on Instagram and X.
───────────────────────────────────────────── */

const GALLERY_MEDIA = [
  {
    id: 'ig-jul29',
    platform: 'instagram',
    postUrl: 'https://www.instagram.com/p/DbYXmTfE2Na/',
    occasion: 'Pournami Garuda Seva',
    occasionTe: 'పౌర్ణమి గరుడ సేవ',
    dateLabel: 'July 29, 2026',
    dateLabelTe: 'జూలై 29, 2026',
    creator: 'TTD Official',
    creatorTe: 'TTD అధికారికం',
    badgeType: 'ttd',
  },
  {
    id: 'ig-sep26-video',
    platform: 'instagram',
    postUrl: 'https://www.instagram.com/p/Ddyj7WNhrzY/',
    occasion: 'Pournami Garuda Seva',
    occasionTe: 'పౌర్ణమి గరుడ సేవ',
    dateLabel: 'September 26, 2026',
    dateLabelTe: 'సెప్టెంబరు 26, 2026',
    creator: 'in.tirupati',
    creatorTe: 'in.tirupati',
    badgeType: 'creator',
  },
  {
    id: 'ig-aug17-video',
    platform: 'instagram',
    postUrl: 'https://www.instagram.com/p/DcJnYlgSgp5/',
    occasion: 'Garuda Panchami',
    occasionTe: 'గరుడ పంచమి',
    dateLabel: 'August 17, 2026',
    dateLabelTe: 'ఆగస్టు 17, 2026',
    creator: 'in.tirupati',
    creatorTe: 'in.tirupati',
    badgeType: 'creator',
  },
  {
    id: 'x-sep26',
    platform: 'x',
    tweetUrl: 'https://twitter.com/TTDevasthanams/status/2103856879428583521',
    displayUrl: 'https://x.com/TTDevasthanams/status/2103856879428583521',
    tweetText:
      'పౌర్ణమి గరుడసేవతో భక్తులకు కనువిందు చేసిన శ్రీ మలయప్పస్వామివారు. సర్వాలంకార భూషితుడై గరుడునిపై తిరుమల మాడ వీధుల్లో విహరిస్తూ భక్తులను కటాక్షించారు. #PournamiGarudaSeva #GarudaSeva #MalayappaSwamy #Tirumala #TTD',
    occasion: 'Pournami Garuda Seva 2026',
    occasionTe: 'పౌర్ణమి గరుడ సేవ 2026',
    dateLabel: 'September 26, 2026',
    dateLabelTe: 'సెప్టెంబరు 26, 2026',
    creator: 'TTD Official',
    creatorTe: 'TTD అధికారికం',
    badgeType: 'ttd',
  },
  {
    id: 'ig-aug28',
    platform: 'instagram',
    postUrl: 'https://www.instagram.com/p/Dcl7JnpE8Sh/',
    occasion: 'Garuda Vahana Seva',
    occasionTe: 'గరుడ వాహన సేవ',
    dateLabel: 'August 28, 2026',
    dateLabelTe: 'ఆగస్టు 28, 2026',
    creator: 'TTD Official',
    creatorTe: 'TTD అధికారికం',
    badgeType: 'ttd',
  },
  {
    id: 'ig-jan25',
    platform: 'instagram',
    postUrl: 'https://www.instagram.com/p/DT7K2UVEw0r/',
    occasion: 'Ratha Saptami Garuda Vahanam',
    occasionTe: 'రథసప్తమి గరుడ వాహనం',
    dateLabel: 'January 25, 2026',
    dateLabelTe: 'జనవరి 25, 2026',
    creator: 'TTD Official',
    creatorTe: 'TTD అధికారికం',
    badgeType: 'ttd',
  },
];

/* ─────────────────────────────────────────────
   Garuda Seva — Gallery sub-components
───────────────────────────────────────────── */

/**
 * Native Instagram post embed using the official embed.js mechanism.
 * Uses an IntersectionObserver to reliably trigger Instagram's embed processor.
 */
function GarudaInstagramEmbed({ postUrl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const processEmbed = () => {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    if (window.instgrm?.Embeds) {
      processEmbed();
    } else {
      let script = document.querySelector('script[src*="instagram.com/embed.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', processEmbed);
      const interval = setInterval(() => {
        if (window.instgrm?.Embeds) {
          processEmbed();
          clearInterval(interval);
        }
      }, 300);
      return () => {
        script.removeEventListener('load', processEmbed);
        clearInterval(interval);
      };
    }

    if (containerRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            processEmbed();
          }
        },
        { rootMargin: '400px 0px' }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [postUrl]);

  return (
    <div ref={containerRef} className="w-full flex justify-center items-start overflow-hidden">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '8px',
          margin: '1px auto',
          maxWidth: '540px',
          minWidth: '326px',
          padding: 0,
          width: '99.375%',
        }}
      >
        <div style={{ padding: '16px' }}>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#FFFFFF',
              lineHeight: 0,
              padding: '0 0',
              textAlign: 'center',
              textDecoration: 'none',
              width: '100%',
            }}
          >
            View this post on Instagram
          </a>
        </div>
      </blockquote>
    </div>
  );
}

/**
 * Twitter native embed blockquote.
 * widgets.js is loaded lazily (via IntersectionObserver in parent),
 * so this renders as a plain blockquote until the script inflates it
 * into a Twitter iframe.
 */
function GarudaTweetEmbed({ post, isLight }) {
  return (
    <div className="w-full flex justify-center items-start overflow-hidden">
      <blockquote
        className="twitter-tweet"
        data-theme={isLight ? 'light' : 'dark'}
        data-dnt="true"
        data-conversation="none"
        style={{ margin: '0 auto', maxWidth: '540px', width: '100%' }}
      >
        <p lang="te" dir="ltr">{post.tweetText}</p>
        &mdash; Tirumala Tirupati Devasthanams (@TTDevasthanams){' '}
        <a href={post.tweetUrl}>{post.dateLabel}</a>
      </blockquote>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Seamless Hero Embed Component
   Carefully frames the official TTD Instagram embed
   to display the authentic procession photograph
   seamlessly without clunky social media chrome.
   100% legal, non-infringing official embed.
───────────────────────────────────────────── */

function SeamlessHeroEmbed({ isLight, isTe }) {
  const postUrl = 'https://www.instagram.com/p/DbYXmTfE2Na/';
  const embedUrl = 'https://www.instagram.com/p/DbYXmTfE2Na/embed/';

  return (
    <div className={`relative min-h-[360px] sm:min-h-[460px] lg:min-h-full overflow-hidden rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl flex items-center justify-center ${
      isLight ? 'bg-amber-100/40' : 'bg-black'
    }`}>
      {/* Framed official embed iframe: strictly clipped to show only the photo */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <iframe
          src={embedUrl}
          title="Lord Malayappa Swamy on Golden Garuda Vahanam"
          className="w-[110%] sm:w-[106%] h-[740px] max-w-none border-0 -mt-14 scale-105 pointer-events-auto"
          scrolling="no"
          loading="eager"
        />
      </div>

      {/* Edge gradient blends */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? 'linear-gradient(to right, rgba(254,250,240,0.85) 0%, rgba(254,250,240,0.2) 35%, transparent 60%), linear-gradient(to top, rgba(254,250,240,0.8) 0%, transparent 25%)'
            : 'linear-gradient(to right, rgba(26,20,8,0.92) 0%, rgba(26,20,8,0.3) 35%, transparent 60%), linear-gradient(to top, rgba(13,10,5,0.95) 0%, transparent 28%)',
        }}
        aria-hidden="true"
      />

      {/* Discrete, elegant frosted glass attribution chip */}
      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-3.5 right-3.5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-medium shadow-lg transition-all duration-200 hover:scale-105 ${
          isLight
            ? 'bg-white/85 hover:bg-white border-amber-300 text-amber-950 shadow-amber-900/10'
            : 'bg-black/75 hover:bg-black/90 border-[#D4AF37]/50 text-amber-200 shadow-black/40'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>{isTe ? 'TTD అధికారిక ఇన్‌స్టాగ్రామ్' : 'Official TTD Instagram'}</span>
        <ExternalLink className="w-3 h-3 opacity-75" />
      </a>

      {/* Subtle bottom-left caption */}
      <div className="absolute bottom-3.5 left-4 z-20 max-w-[280px] pointer-events-none hidden sm:block">
        <p className={`text-[10px] leading-tight drop-shadow ${isLight ? 'text-amber-950/80' : 'text-white/80'}`}>
          {isTe
            ? 'శ్రీ మలయప్పస్వామి సువర్ణ గరుడ వాహనం · తిరుమల'
            : 'Lord Malayappa Swamy on Golden Garuda Vahanam · Tirumala'}
        </p>
      </div>
    </div>
  );
}


function formatDateDisplay(dateStr, lang) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return dateStr; }
}

const OrnamentDivider = ({ className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
    <span className="text-[#D4AF37]/50 text-base select-none" aria-hidden="true">✦</span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
  </div>
);

function SectionLabel({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="block w-1 h-5 rounded-full bg-gradient-to-b from-[#FFD700] to-[#FF5722] shrink-0" />
      <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#B45309]">
        {children}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

export default function GarudaVahanamPage({
  events = [],
  lang = 'en',
  themeMode: propThemeMode,
  onNavigateToCalendarSearch,
  onSelectEvent,
}) {
  const { themeMode: hookThemeMode } = useTheme();
  const themeMode = propThemeMode || hookThemeMode;
  const isLight = themeMode === 'light';

  const topic = useMemo(() => getFestivalTopic('garuda-vahanam'), []);

  const templeMap = useMemo(() => {
    const map = new Map();
    TEMPLES.forEach(t => map.set(t.id, t));
    return map;
  }, []);

  const allMatchedEvents = useMemo(
    () => matchFestivalEvents(events, topic),
    [events, topic]
  );

  const futureEvents = useMemo(() => {
    const { dateStr: todayStr } = getISTNowComponents();
    return allMatchedEvents.filter(evt => {
      const relevantDate = evt.endDate || evt.startDate || '';
      return relevantDate >= todayStr;
    });
  }, [allMatchedEvents]);

  /* ── Lazy-load Twitter widgets.js and Instagram embed.js via IntersectionObserver ── */
  const galleryRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        /* ── Twitter widgets.js ── */
        if (window.twttr?.widgets) {
          window.twttr.widgets.load(galleryRef.current);
        } else if (!document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) {
          const s = document.createElement('script');
          s.src = 'https://platform.twitter.com/widgets.js';
          s.async = true;
          s.charset = 'utf-8';
          s.onload = () => window.twttr?.widgets?.load(galleryRef.current);
          document.head.appendChild(s);
        }

        /* ── Instagram embed.js ── */
        if (window.instgrm?.Embeds) {
          window.instgrm.Embeds.process();
        } else if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
          const ig = document.createElement('script');
          ig.src = 'https://www.instagram.com/embed.js';
          ig.async = true;
          ig.onload = () => {
            if (window.instgrm?.Embeds) {
              window.instgrm.Embeds.process();
            }
          };
          document.body.appendChild(ig);
        }
      },
      { rootMargin: '300px 0px' }
    );

    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  if (!topic) return null;

  const isTe = lang === 'te';
  const ctaSearchQuery = topic.searchQuery || 'Garuda Vahanam';
  const handleCtaClick = () => {
    if (onNavigateToCalendarSearch) onNavigateToCalendarSearch(ctaSearchQuery);
  };

  /* ── Theme palette ── */
  const heroSurface = isLight
    ? 'bg-gradient-to-br from-[#FEFAF0] via-[#FFF8E7] to-[#FEF3D0]'
    : 'bg-gradient-to-br from-[#1a1408] via-[#1c1a0e] to-[#14120a]';

  const t = {
    pageBg:       isLight ? 'bg-[#FDFAF3]'                      : 'bg-[#0B0E14]',
    surfaceHigh:  isLight ? 'bg-white border-amber-200/80'       : 'bg-[#141923] border-[#D4AF37]/20',
    surfaceMid:   isLight ? 'bg-amber-50/60 border-amber-200/50' : 'bg-[#0d1118] border-white/8',
    surfaceWarm:  isLight ? 'bg-[#FFFBF0] border-amber-300/40'  : 'bg-[#181410] border-[#D4AF37]/18',
    textPrimary:  isLight ? 'text-[#1C0A00]'                    : 'text-white',
    textSecondary:isLight ? 'text-[#3D2000]'                    : 'text-slate-300',
    textMuted:    isLight ? 'text-[#7C5C1E]'                    : 'text-[#94A3B8]',
    goldAccent:   isLight ? 'text-amber-700'                    : 'text-[#FFD700]',
    divider:      isLight ? 'divide-amber-200/60'               : 'divide-[#D4AF37]/10',
    goldBorder:   isLight ? 'border-amber-300/50'               : 'border-[#D4AF37]/30',
    labelText:    isLight ? 'text-amber-800'                    : 'text-[#D4AF37]',
    calloutBg:    isLight ? 'bg-amber-50/90 border-amber-200/60' : 'bg-[#0d1118] border-[#D4AF37]/10',
    hoverRow:     isLight ? 'hover:bg-amber-50/60'              : 'hover:bg-[#141923]/40',
  };

  /* Gallery colour for the surrounding section */
  const gallerySectionBg = isLight
    ? 'bg-gradient-to-b from-[#FEFAF0] to-[#FFF8E7]'
    : 'bg-gradient-to-b from-[#0B0E14] to-[#0e0c08]';

  return (
    <article className="space-y-0 max-w-5xl mx-auto tv-fade-up">

      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <section
        className={`relative overflow-hidden rounded-3xl border ${t.goldBorder} shadow-lg mb-10 ${heroSurface}`}
      >
        {/* Radial glows */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(255,193,7,0.18) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(255,87,34,0.08) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: text */}
          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-extrabold tracking-widest uppercase ${
                  isLight
                    ? 'border-amber-400/60 bg-amber-100/80 text-amber-800'
                    : 'border-[#FFD700]/35 bg-[#FFD700]/10 text-[#FFD700]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full tv-live-dot"
                  style={{ backgroundColor: isLight ? '#D97706' : '#FFD700' }} />
                {isTe ? topic.heroBadgeTe : topic.heroBadge}
              </span>
            </div>

            <h1
              className={`font-serif font-extrabold leading-none tracking-tight mb-4 ${t.textPrimary}`}
              style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}
            >
              <span className="gold-gradient-text">{isTe ? topic.h1Te : topic.h1}</span>
            </h1>

            <p className={`font-serif text-base sm:text-lg font-semibold leading-snug mb-4 ${t.textSecondary}`}>
              {isTe ? topic.subtitleTe : topic.subtitle}
            </p>

            <p className={`text-sm leading-relaxed mb-7 ${t.textMuted}`}>
              {isTe ? topic.descriptionTe : topic.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`/calendar?search=${encodeURIComponent(ctaSearchQuery)}`}
                onClick={e => { if (isModifiedClick(e)) return; e.preventDefault(); handleCtaClick(); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                           bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#FFA000]
                           text-black font-extrabold text-sm shadow-md tv-interactive cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{isTe ? (topic.calendarCtaTe || 'క్యాలెండర్‌లో చూడండి') : (topic.calendarCta || 'View in Calendar')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <span className={`text-xs font-mono ${t.textMuted}`}>
                {isTe
                  ? `${futureEvents.length} రాబోయే సేవలు`
                  : `${futureEvents.length} upcoming occurrence${futureEvents.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Right: Seamless Framed Official Embed (Carefully framed to show authentic photo with zero clunky chrome) */}
          <SeamlessHeroEmbed isLight={isLight} isTe={isTe} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. FESTIVAL INTRODUCTION
      ══════════════════════════════════════════════ */}
      <section className="py-10 px-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-0 items-start">
          <div className="lg:pr-10 mb-8 lg:mb-0">
            <SectionLabel className="mb-5">
              {isTe ? 'గురించి' : 'About the Festival'}
            </SectionLabel>
            <blockquote className="relative">
              <span
                className="absolute -top-2 -left-2 text-6xl leading-none select-none font-serif"
                style={{ color: isLight ? 'rgba(212,175,55,0.22)' : 'rgba(212,175,55,0.20)' }}
                aria-hidden="true"
              >"</span>
              <p className={`font-serif text-lg sm:text-xl font-semibold leading-relaxed pl-4 italic ${t.textPrimary}`}>
                {isTe
                  ? 'గరుత్మంతుడు శ్రీమహావిష్ణువుకు నిత్యసూరి, దాసుడు, సఖుడు మరియు పతాక చిహ్నం.'
                  : 'Lord Garutmanta is the eternal servant, companion, throne, and emblem of Lord Maha Vishnu.'}
              </p>
            </blockquote>
          </div>
          <div className={`hidden lg:block w-px self-stretch ${isLight ? 'bg-amber-200' : 'bg-[#D4AF37]/15'}`} />
          <div className="lg:pl-10">
            <p className={`text-sm sm:text-base leading-relaxed ${t.textSecondary}`}>
              {isTe ? topic.summaryTe : topic.summary}
            </p>
          </div>
        </div>
      </section>

      <OrnamentDivider className="mb-2" />

      {/* ══════════════════════════════════════════════
          3. WHAT IS GARUDA VAHANAM?
      ══════════════════════════════════════════════ */}
      <section className="py-10">
        <SectionLabel className="mb-6">
          {isTe ? 'గరుడ వాహనం అంటే ఏమిటి?' : 'What is Garuda Vahanam?'}
        </SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={`rounded-2xl border p-5 sm:p-6 ${t.surfaceWarm} tv-card-hover`}>
            <div className="flex items-start gap-3 mb-3">
              <span className={`text-xl mt-0.5 ${t.goldAccent}`}>🦅</span>
              <h3 className={`font-serif text-base font-bold leading-snug ${t.textPrimary}`}>
                {isTe ? 'గరుడుడు — శ్రీహరి వాహనం' : 'Garuda — The Divine Vahana of Srivari'}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${t.textSecondary}`}>
              {isTe
                ? 'వైష్ణవ సాంప్రదాయంలో గరుత్మంతుడు పరమాత్ముని వాహనంగా భావించబడతాడు. గరుడ వాహనంపై వేంచేసి శ్రీమలయప్పస్వామి మాడ వీధులలో భక్తులకు దర్శనమిస్తారు.'
                : 'In Vaishnava tradition, Garutmanta (Garuda) is the sacred vahana and banner of Lord Maha Vishnu. During Garuda Vahanam, Lord Malayappa Swamy is seated upon the magnificent Golden Garuda and taken in a grand procession around the four Mada Streets of Tirumala, offering an extraordinary darshan to hundreds of thousands of gathered devotees.'}
            </p>
          </div>

          <div className={`rounded-2xl border p-5 sm:p-6 ${t.surfaceWarm} tv-card-hover`}>
            <div className="flex items-start gap-3 mb-3">
              <span className={`text-xl mt-0.5 ${t.goldAccent}`}>🛕</span>
              <h3 className={`font-serif text-base font-bold leading-snug ${t.textPrimary}`}>
                {isTe ? 'తిరుమలలో గరుడ సేవ విశిష్టత' : 'Why Garuda Seva is Supreme at Tirumala'}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${t.textSecondary}`}>
              {isTe
                ? 'తిరుమల బ్రహ్మోత్సవాలలో 5వ రోజు రాత్రి జరిగే గరుడసేవను అన్ని వాహన సేవలలో అత్యుత్కృష్టంగా పరిగణిస్తారు. ఈ రోజు మాత్రమే మలయప్పస్వామికి మూలవిరాట్ సన్నిధి ప్రాచీన ఆభరణాలు అలంకరిస్తారు.'
                : 'The Garuda Seva on Day 5 night of Srivari Brahmotsavams is considered the pinnacle of all vahana processions. On this exceptional night, Lord Malayappa Swamy is uniquely adorned with the priceless ancient jewels from the Moola Virat sanctum — a sight not seen on any other occasion. Lakhs of pilgrims throng the Mada Streets for this once-a-year darshan.'}
            </p>
          </div>

          <div className={`rounded-2xl border p-5 sm:p-6 ${t.surfaceWarm} tv-card-hover`}>
            <div className="flex items-start gap-3 mb-3">
              <span className={`text-xl mt-0.5 ${t.goldAccent}`}>🙏</span>
              <h3 className={`font-serif text-base font-bold leading-snug ${t.textPrimary}`}>
                {isTe ? 'గరుడ సేవలో భక్తుల అనుభవం' : 'What Devotees Witness During Garuda Seva'}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${t.textSecondary}`}>
              {isTe
                ? 'శ్రీ మలయప్పస్వామి స్వర్ణ గరుడ వాహనంపై కొలువుదీరి, వరద హస్తముద్రతో, మూలవిరాట్ ఆభరణాలను ధరించి, మాడ వీధుల్లో సాగుతారు.'
                : 'Devotees witness Lord Malayappa Swamy in rare Moola Virat jewels, seated in Varada Mudra (boon-granting posture) upon the resplendent Golden Garuda, escorted by Vedic chanting, temple musicians, and thousands of devotees chanting "Govinda Govinda." The procession moves majestically around all four Mada Streets.'}
            </p>
          </div>

          <div className={`rounded-2xl border p-5 sm:p-6 ${t.surfaceWarm} tv-card-hover`}>
            <div className="flex items-start gap-3 mb-3">
              <span className={`text-xl mt-0.5 ${t.goldAccent}`}>🚩</span>
              <h3 className={`font-serif text-base font-bold leading-snug ${t.textPrimary}`}>
                {isTe ? 'ధ్వజారోహణం & గరుడ ధ్వజం' : 'Garuda Flag & Brahmotsavam Inauguration'}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${t.textSecondary}`}>
              {isTe
                ? 'ప్రతి బ్రహ్మోత్సవం ప్రారంభంలో గరుడ ధ్వజారోహణం నిర్వహిస్తారు. గరుడ పతాకాన్ని ఆలయ ధ్వజస్తంభంపై ఆరోహించడం ద్వారా ముక్కోటి దేవతలను ఉత్సవానికి ఆహ్వానిస్తారు.'
                : 'At the inauguration of every Brahmotsavam, the Garuda flag (Dhwajarohanam) is hoisted atop the Dwajasthambham, symbolically inviting all celestial devas to the festival. Without his flag, no Brahmotsavam begins. The Garuda Puranam, one of the 18 Mahapuranas, was also revealed by Lord Vishnu to Garuda himself.'}
            </p>
          </div>
        </div>
      </section>

      <OrnamentDivider className="mb-2" />

      {/* ══════════════════════════════════════════════
          4. GALLERY — Garuda Seva: TTD & Original Content Creators
          Visuals © Tirumala Tirupati Devasthanams & Original Content Creators.
          No media is downloaded or hosted locally.
          Instagram posts embedded via official Instagram embed.js.
          X posts embedded via native Twitter widget (lazy-loaded).
      ══════════════════════════════════════════════ */}
      <section
        ref={galleryRef}
        className={`py-10 rounded-3xl ${gallerySectionBg}`}
      >
        {/* Section header */}
        <div className="mb-7">
          <SectionLabel className="mb-3">
            {isTe ? 'TTD మరియు కంటెంట్ క్రియేటర్స్' : 'TTD & Original Content Creators'}
          </SectionLabel>
          <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-1 ${t.textPrimary}`}>
            {isTe ? 'గరుడ సేవ — చిత్రాలు & వీడియోలు' : 'Garuda Seva — TTD & Content Creators'}
          </h2>
          <p className={`text-xs ${t.textMuted}`}>
            {isTe
              ? 'తిరుమల తిరుపతి దేవస్థానాలు మరియు భక్తి కంటెంట్ క్రియేటర్ల నుండి దివ్య దర్శన దృశ్యాలు. అసలు పోస్ట్‌లకు లింక్‌లు జోడించబడ్డాయి.'
              : 'Visual coverage from Tirumala Tirupati Devasthanams and devotional content creators. All media © respective creators & TTD — original posts linked.'}
          </p>
        </div>

        {/* Gallery Grid: items-stretch ensures equal height boxes across columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {GALLERY_MEDIA.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col h-full ${
                isLight
                  ? 'bg-amber-50/70 border-amber-200/80 shadow-sm'
                  : 'bg-[#15110a] border-[#D4AF37]/20 shadow-sm'
              } tv-card-hover transition-all duration-300`}
            >
              {/* Card Header with unified height and alignment */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-amber-500/15 min-h-[46px]">
                <div className="min-w-0 pr-2">
                  <span className={`block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider truncate ${
                    isLight ? 'text-amber-800' : 'text-[#FFD700]'
                  }`}>
                    {isTe ? item.occasionTe : item.occasion}
                  </span>
                  <span className={`text-[10px] block ${t.textMuted}`}>
                    {isTe ? item.dateLabelTe : item.dateLabel}
                  </span>
                </div>
                <span
                  className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded border whitespace-nowrap ${
                    item.platform === 'instagram'
                      ? item.badgeType === 'creator'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                        : 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20'
                      : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
                  }`}
                >
                  {item.platform === 'instagram'
                    ? `Instagram · ${isTe ? item.creatorTe : item.creator}`
                    : `X · ${isTe ? item.creatorTe : item.creator}`}
                </span>
              </div>

              {/* Embed media container - stretches full height so card bottoms align perfectly */}
              <div className="flex-1 flex flex-col justify-start items-center w-full overflow-hidden">
                {item.platform === 'instagram' ? (
                  <GarudaInstagramEmbed postUrl={item.postUrl} />
                ) : (
                  <div className="w-full flex justify-center" style={{ maxWidth: '540px' }}>
                    <GarudaTweetEmbed post={item} isLight={isLight} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gallery footer attribution */}
        <div className={`mt-7 pt-5 border-t text-center ${isLight ? 'border-amber-200/60' : 'border-[#D4AF37]/10'}`}>
          <p className={`text-[11px] ${t.textMuted}`}>
            {isTe
              ? 'ఛాయాచిత్రాలు మరియు వీడియోలు అన్నీ © సంబంధిత క్రియేటర్లు మరియు తిరుమల తిరుపతి దేవస్థానాలు.'
              : 'All photographs and media © respective creators and Tirumala Tirupati Devasthanams.'}
            {' · '}
            <a
              href="https://x.com/TTDevasthanams"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold hover:underline ${isLight ? 'text-amber-700' : 'text-[#D4AF37]'}`}
            >
              @TTDevasthanams on X
            </a>
            {' · '}
            <a
              href="https://www.instagram.com/ttdevasthanams/"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold hover:underline ${isLight ? 'text-amber-700' : 'text-[#D4AF37]'}`}
            >
              @ttdevasthanams on Instagram
            </a>
            {' · '}
            <a
              href="https://www.instagram.com/in.tirupati/"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold hover:underline ${isLight ? 'text-amber-700' : 'text-[#D4AF37]'}`}
            >
              @in.tirupati on Instagram
            </a>
          </p>
        </div>
      </section>

      <OrnamentDivider className="mb-2" />

      {/* ══════════════════════════════════════════════
          5. SACRED ADORNMENTS
      ══════════════════════════════════════════════ */}
      <section className="py-10">
        <SectionLabel className="mb-6">
          {isTe ? 'దివ్య అలంకారాలు' : 'Sacred Adornments & Heritage Regalia'}
        </SectionLabel>

        <div className="space-y-4">
          {topic.adornments[0] && (
            <div className={`relative overflow-hidden rounded-2xl border ${t.surfaceHigh} p-6 sm:p-8 tv-card-hover`}>
              <div
                className="absolute top-0 right-0 text-[8rem] font-extrabold leading-none pr-4 select-none pointer-events-none"
                style={{ color: isLight ? 'rgba(212,175,55,0.07)' : 'rgba(212,175,55,0.06)' }}
                aria-hidden="true"
              >01</div>
              <div className="relative">
                <span className={`inline-block mb-3 text-[10px] font-extrabold tracking-[0.18em] uppercase px-2.5 py-1 rounded-md ${isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#FFD700]/10 text-[#FFD700]'}`}>
                  {isTe ? 'ప్రధాన అలంకారం' : 'Featured Adornment'}
                </span>
                <h3 className={`font-serif text-xl sm:text-2xl font-bold mb-3 ${t.textPrimary}`}>
                  {isTe ? topic.adornments[0].titleTe : topic.adornments[0].title}
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${t.textSecondary}`}>
                  {isTe ? topic.adornments[0].descTe : topic.adornments[0].desc}
                </p>
              </div>
            </div>
          )}

          {topic.adornments.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topic.adornments.slice(1).map((item, idx) => (
                <div
                  key={idx + 1}
                  className={`relative overflow-hidden rounded-2xl border ${t.surfaceMid} p-5 sm:p-6 tv-card-hover`}
                >
                  <div
                    className="absolute top-0 right-0 text-[5rem] font-extrabold leading-none pr-3 select-none pointer-events-none"
                    style={{ color: isLight ? 'rgba(212,175,55,0.07)' : 'rgba(212,175,55,0.06)' }}
                    aria-hidden="true"
                  >0{idx + 2}</div>
                  <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF5722] mb-4" />
                  <h3 className={`font-serif text-base sm:text-lg font-bold mb-2.5 leading-snug ${t.textPrimary}`}>
                    {isTe ? item.titleTe : item.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${t.textSecondary}`}>
                    {isTe ? item.descTe : item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <OrnamentDivider className="mb-2" />

      {/* ══════════════════════════════════════════════
          6. THEOLOGY — chapter-list layout
      ══════════════════════════════════════════════ */}
      <section className="py-10">
        <SectionLabel className="mb-8">
          {isTe ? 'శ్రీవైష్ణవ సంప్రదాయం' : 'Sri Vaishnava Tradition & Theology'}
        </SectionLabel>

        <div className={`space-y-0 divide-y ${t.divider}`}>
          {topic.theology.map((item, idx) => (
            <div
              key={idx}
              className={`py-7 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 group transition-colors duration-200 ${t.hoverRow} -mx-4 px-4 rounded-xl`}
            >
              <div>
                <span className={`block font-mono text-[10px] tracking-widest uppercase mb-2 ${t.labelText}`}>
                  {String(idx + 1).padStart(2, '0')} / {String(topic.theology.length).padStart(2, '0')}
                </span>
                <h3 className={`font-serif text-base font-bold leading-snug ${t.textPrimary}`}>
                  {isTe ? item.titleTe : item.title}
                </h3>
              </div>
              <div className="flex items-start gap-4">
                <div className={`hidden md:block mt-1 w-0.5 self-stretch rounded-full ${isLight ? 'bg-amber-200' : 'bg-[#D4AF37]/15'} transition-colors`} />
                <p className={`text-sm sm:text-base leading-relaxed flex-1 ${t.textSecondary}`}>
                  {isTe ? item.descTe : item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-8 rounded-2xl border-l-[3px] border-l-[#D4AF37] p-5 sm:p-6 ${t.calloutBg} border`}>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-base mt-0.5">ℹ️</span>
            <h4 className={`font-serif text-base font-bold ${t.textPrimary}`}>
              {isTe ? topic.occasionsInfo.titleTe : topic.occasionsInfo.title}
            </h4>
          </div>
          <p className={`text-sm leading-relaxed ml-7 ${t.textMuted}`}>
            {isTe ? topic.occasionsInfo.descTe : topic.occasionsInfo.desc}
          </p>
          <div className="ml-7 mt-4">
            <a
              href="/temples"
              onClick={e => {
                if (isModifiedClick(e)) return;
                e.preventDefault();
                window.history.pushState({}, '', '/temples');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold ${t.goldAccent} hover:underline cursor-pointer transition-colors`}
            >
              <span>{isTe ? 'సప్త దివ్య పుణ్యక్షేత్రాల సమాచారం' : 'View Sacred Shrines Directory'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <OrnamentDivider className="mb-2" />

      {/* ══════════════════════════════════════════════
          7. UPCOMING GARUDA VAHANA SEVA DATES
             Future-only, IST-aware, cross-temple
      ══════════════════════════════════════════════ */}
      <section className="py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <SectionLabel className="mb-3">
              {isTe ? 'రాబోయే సేవలు' : 'Upcoming Schedule'}
            </SectionLabel>
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${t.textPrimary}`}>
              {isTe ? 'గరుడ వాహన సేవ తేదీలు' : 'Garuda Vahana Seva Dates'}
            </h2>
            <p className={`text-xs mt-1 ${t.textMuted}`}>
              {isTe
                ? 'అన్ని ఆలయాల రాబోయే గరుడ సేవలు — మాస్టర్ క్యాలెండర్ నుండి స్వయంచాలకంగా'
                : 'Upcoming Garuda Seva across all temples — live-synced from the festival calendar'}
            </p>
          </div>

          <a
            href={`/calendar?search=${encodeURIComponent(ctaSearchQuery)}`}
            onClick={e => { if (isModifiedClick(e)) return; e.preventDefault(); handleCtaClick(); }}
            className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isLight
                ? 'bg-amber-50 border-amber-400/50 text-amber-800 hover:bg-amber-100'
                : 'bg-[#141923] border-[#D4AF37]/40 text-[#FFD700] hover:bg-[#D4AF37]/10'
            }`}
          >
            <span>{isTe ? 'పూర్తి క్యాలెండర్‌లో చూడండి' : 'Open in Calendar'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {futureEvents.length === 0 ? (
          <div className={`rounded-2xl border ${t.surfaceMid} p-10 text-center`}>
            <Star className={`w-8 h-8 mx-auto mb-3 ${t.textMuted} opacity-40`} />
            <p className={`text-sm font-semibold mb-1 ${t.textPrimary}`}>
              {isTe ? 'రాబోయే గరుడ సేవలు అందుబాటులో లేవు' : 'No upcoming Garuda Seva on record'}
            </p>
            <p className={`text-xs ${t.textMuted}`}>
              {isTe
                ? 'క్యాలెండర్‌లో తదుపరి సేవలను శోధించండి.'
                : 'Check the full calendar for the next scheduled occurrences across all temples.'}
            </p>
            <a
              href={`/calendar?search=${encodeURIComponent(ctaSearchQuery)}`}
              onClick={e => { if (isModifiedClick(e)) return; e.preventDefault(); handleCtaClick(); }}
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold cursor-pointer tv-interactive"
              style={{ color: isLight ? '#B45309' : '#FFD700' }}
            >
              <span>{isTe ? 'క్యాలెండర్ తెరవండి' : 'Open Calendar'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureEvents.map((evt, idx) => {
              const temple = templeMap.get(evt.templeId);
              const templeLabel = temple ? getTempleFilterLabel(temple, lang) : evt.templeId;
              const formattedDate = formatDateDisplay(evt.startDate, lang);
              const isMultiDay = evt.endDate && evt.endDate !== evt.startDate;
              const formattedEndDate = isMultiDay ? formatDateDisplay(evt.endDate, lang) : null;

              return (
                <button
                  key={evt.id || idx}
                  type="button"
                  onClick={() => onSelectEvent && onSelectEvent(evt)}
                  className={`text-left rounded-2xl border overflow-hidden tv-card-hover tv-gold-glow group w-full cursor-pointer ${
                    isLight
                      ? 'bg-white border-amber-200/60 hover:border-amber-400'
                      : 'bg-[#141923] border-[#D4AF37]/20 hover:border-[#FFD700]'
                  }`}
                >
                  <div className="h-1 w-full" style={{ backgroundColor: temple?.color || '#D4AF37' }} />
                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-black leading-none"
                        style={{ backgroundColor: temple?.color || '#D4AF37' }}
                      >
                        {temple?.badge || (temple ? temple.name : 'Tirumala')}
                      </span>
                      {evt.crowdBadge && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isLight
                            ? 'bg-amber-100 border border-amber-300 text-amber-800'
                            : 'bg-amber-500/15 border border-amber-500/30 text-[#FFD700]'
                        }`}>
                          {evt.crowdBadge}
                        </span>
                      )}
                    </div>

                    <h3 className={`event-card-title font-serif text-base font-bold leading-snug mb-2 transition-colors ${
                      isLight
                        ? 'text-[#1C0A00] group-hover:text-amber-700'
                        : 'text-white group-hover:text-[#FFD700]'
                    }`}>
                      {isTe && evt.titleTe ? evt.titleTe : evt.title}
                    </h3>

                    {evt.vahanam && (
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1.5 vahanam-value">
                        <span className={isLight ? 'text-amber-600' : 'text-[#FF5722]'}>✦</span>
                        <span className={isLight ? 'text-amber-900' : ''}>{evt.vahanam}</span>
                      </p>
                    )}

                    <p className={`text-xs leading-relaxed line-clamp-2 mb-4 ${t.textMuted}`}>
                      {isTe && evt.descriptionTe ? evt.descriptionTe : evt.description}
                    </p>

                    <div className={`pt-3 border-t flex flex-col gap-1.5 text-xs ${
                      isLight ? 'border-amber-100' : 'border-white/8'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-semibold ${t.goldAccent}`}>
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {formattedDate}{formattedEndDate ? ` — ${formattedEndDate}` : ''}
                        </span>
                      </div>
                      {(evt.time || evt.startTime) && (
                        <div className={`flex items-center gap-1.5 ${t.textMuted}`}>
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{evt.time || evt.startTime}</span>
                        </div>
                      )}
                      <div className={`flex items-center gap-1.5 ${t.textMuted}`}>
                        <MapPin className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                        <span className="truncate">{templeLabel || evt.location}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          8. CTA FOOTER — warm/light, no dark block
      ══════════════════════════════════════════════ */}
      <section
        className={`relative overflow-hidden rounded-3xl border ${t.goldBorder} p-8 sm:p-12 ${heroSurface}`}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLight
              ? 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,193,7,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,175,55,0.10) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative text-center">
          <OrnamentDivider className="mb-8 max-w-xs mx-auto" />

          <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-3 ${t.textPrimary}`}>
            {isTe
              ? (topic.planDarshanTitleTe || `ఇంటరాక్టివ్ క్యాలెండర్‌లో ${topic.searchQuery}ను ప్లాన్ చేయండి`)
              : (topic.planDarshanTitle || `Plan Your Garuda Vahanam Darshan`)}
          </h2>
          <p className={`text-sm max-w-lg mx-auto leading-relaxed mb-8 ${t.textMuted}`}>
            {isTe
              ? `అన్ని ఆలయాల ${topic.searchQuery} సేవలను తేదీల వారీగా శోధించండి, రోజువారీ సమయాలు మరియు నిత్య సేవల వివరాలను పరిశీలించండి.`
              : `Explore scheduled timings across all temples, download PDF panchangams, and add Garuda Seva reminders directly to your personal calendar.`}
          </p>

          <a
            href={`/calendar?search=${encodeURIComponent(ctaSearchQuery)}`}
            onClick={e => { if (isModifiedClick(e)) return; e.preventDefault(); handleCtaClick(); }}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl
                       bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#FFA000]
                       text-black font-extrabold text-sm shadow-lg
                       tv-interactive cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>
              {isTe
                ? (topic.searchCalendarCtaTe || `క్యాలెండర్‌లో ${topic.searchQuery} శోధించండి`)
                : (topic.calendarCta || `View Garuda Vahanam in Calendar`)}
            </span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <OrnamentDivider className="mt-8 max-w-xs mx-auto" />
        </div>
      </section>

    </article>
  );
}

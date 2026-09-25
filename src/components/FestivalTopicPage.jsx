import React, { useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Layers
} from 'lucide-react';
import { getFestivalTopic, matchFestivalEvents } from '../data/festivalTopics';
import { TEMPLES } from '../data/templeEvents';
import { getTempleFilterLabel } from '../utils/templeHelpers';
import useTheme from '../hooks/useTheme';
import { isModifiedClick } from '../utils/navigation';

function formatDateDisplay(dateStr, lang) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return dateObj.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function FestivalTopicPage({
  slug = 'garuda-vahanam',
  events = [],
  lang = 'en',
  themeMode: propThemeMode,
  onNavigateToCalendarSearch,
  onSelectEvent
}) {
  const { themeMode: hookThemeMode } = useTheme();
  const themeMode = propThemeMode || hookThemeMode;
  const isLight = themeMode === 'light';

  const topic = useMemo(() => getFestivalTopic(slug), [slug]);

  const templeMap = useMemo(() => {
    const map = new Map();
    TEMPLES.forEach(t => map.set(t.id, t));
    return map;
  }, []);

  // Dynamically match events from the master events dataset using topic search keywords
  const matchedEvents = useMemo(() => {
    return matchFestivalEvents(events, topic);
  }, [events, topic]);

  if (!topic) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className={`text-2xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Festival Topic Not Found</h2>
        <p className="text-sm text-[#94A3B8] max-w-md">
          The requested festival topic could not be found. Please browse our calendar or glossary.
        </p>
        <button
          onClick={() => onNavigateToCalendarSearch && onNavigateToCalendarSearch('')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-sm shadow-lg hover:scale-105 transition-all"
        >
          Go to Calendar
        </button>
      </div>
    );
  }

  const isTe = lang === 'te';
  const ctaSearchQuery = topic.searchQuery || 'Garuda Vahanam';

  const handleCtaClick = () => {
    if (onNavigateToCalendarSearch) {
      onNavigateToCalendarSearch(ctaSearchQuery);
    }
  };

  return (
    <article className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* 1. HERO HEADER SECTION */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/40 space-y-5 bg-gradient-to-br from-[#141923] via-[#0B0E14] to-[#0B0E14] shadow-2xl relative overflow-hidden">
        {/* Glow backdrop accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF5722]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTe ? topic.heroBadgeTe : topic.heroBadge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold gold-gradient-text tracking-tight leading-tight">
            {isTe ? topic.h1Te : topic.h1}
          </h1>

          <p className={`font-serif text-base sm:text-xl font-semibold leading-snug ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            {isTe ? topic.subtitleTe : topic.subtitle}
          </p>

          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-3xl pt-1">
            {isTe ? topic.summaryTe : topic.summary}
          </p>

          {/* Primary Call to Action */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <a
              href={`/calendar?search=${encodeURIComponent(ctaSearchQuery)}`}
              onClick={(e) => {
                if (isModifiedClick(e)) return;
                e.preventDefault();
                handleCtaClick();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#FFA000] text-black font-extrabold text-sm flex items-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>{isTe ? (topic.calendarCtaTe || `క్యాలెండర్‌లో ${topic.searchQuery} చూడండి`) : (topic.calendarCta || `View ${topic.searchQuery} in Calendar`)}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </a>
            <span className="text-xs text-[#94A3B8] font-medium">
              {isTe
                ? `(మొత్తం ${matchedEvents.length} ఉత్సవాలు క్యాలెండర్‌లో నమోదు చేయబడ్డాయి)`
                : `(${matchedEvents.length} scheduled occurrences across temple calendars)`}
            </span>
          </div>
        </div>
      </section>

      {/* 2. SACRED ADORNMENTS & PURANIC MEANINGS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-[#FFD700]" />
          <h2 className={`font-serif text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isTe ? 'దివ్య అలంకారాలు & విశిష్ట ఆభరణాలు' : 'Sacred Adornments & Heritage Regalia'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topic.adornments.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-[#D4AF37]/30 hover:border-[#FFD700] transition-colors space-y-2 bg-[#141923]/60 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="w-7 h-7 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] font-mono text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <h3 className={`font-serif text-base font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isTe ? item.titleTe : item.title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {isTe ? item.descTe : item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SPIRITUAL & VEDIC SIGNIFICANCE */}
      <section className="glass-card p-6 rounded-2xl border border-[#D4AF37]/30 space-y-4 bg-[#141923]/80">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#3A86EF]" />
          <h2 className={`font-serif text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isTe ? 'శ్రీవైష్ణవ సంప్రదాయం & వేద ప్రాశస్త్యం' : 'Spiritual Significance in Sri Vaishnava Tradition'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {topic.theology.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-amber-50/60 border-amber-600/20' : 'bg-[#0B0E14] border-white/10'}`}
            >
              <h3 className="font-serif text-base font-bold gold-gradient-text">
                {isTe ? item.titleTe : item.title}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-[#CBD5E1]'}`}>
                {isTe ? item.descTe : item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Multiple Temples Note */}
        <div className={`p-4 rounded-xl border-l-4 border-l-[#FFD700] text-xs sm:text-sm leading-relaxed space-y-1 ${isLight ? 'bg-amber-50/80 border-amber-600/30 text-slate-700' : 'bg-[#0B0E14]/90 border-white/10 text-[#94A3B8]'}`}>
          <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>
            ℹ️ {isTe ? topic.occasionsInfo.titleTe : topic.occasionsInfo.title}
          </span>
          <p>{isTe ? topic.occasionsInfo.descTe : topic.occasionsInfo.desc}</p>
        </div>
      </section>

      {/* 4. SCHEDULED OCCURRENCES FROM MASTER CALENDAR */}
      <section className="space-y-4">
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${isLight ? 'border-slate-300' : 'border-white/10'}`}>
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FFD700]" />
              <h2 className={`font-serif text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isTe ? (topic.occurrencesTitleTe || `${topic.searchQuery} దర్శన తేదీలు & సమయాలు`) : 'Scheduled Occurrences & Darshan Dates'}
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {isTe
                ? 'మాస్టర్ క్యాలెండర్ నుండి స్వయంచాలకంగా పొందబడిన ఉత్సవాల జాబితా'
                : 'Automatically synchronized from the active temple festival calendar'}
            </p>
          </div>

          <button
            onClick={handleCtaClick}
            className={`self-start sm:self-auto px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
              isLight
                ? 'bg-amber-500/10 border-amber-600/40 text-amber-800 hover:bg-amber-500/20'
                : 'bg-[#141923] border-[#D4AF37]/60 text-[#FFD700] hover:bg-[#D4AF37]/20'
            }`}
          >
            <span>{isTe ? 'పూర్తి క్యాలెండర్‌లో చూడండి' : 'Open in Calendar'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {matchedEvents.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center text-[#94A3B8] text-sm">
            {isTe
              ? (topic.emptyOccurrencesTe || `ప్రస్తుతం రాబోయే ఉత్సవాలలో ${topic.searchQuery} వివరాలు అందుబాటులో లేవు.`)
              : 'No scheduled occurrences currently recorded in the active festival dataset.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedEvents.map((evt, idx) => {
              const temple = templeMap.get(evt.templeId);
              const templeLabel = temple ? getTempleFilterLabel(temple, lang) : evt.templeId;
              const formattedDate = formatDateDisplay(evt.startDate, lang);
              const isMultiDay = evt.endDate && evt.endDate !== evt.startDate;
              const formattedEndDate = isMultiDay ? formatDateDisplay(evt.endDate, lang) : null;

              return (
                <div
                  key={evt.id || idx}
                  onClick={() => onSelectEvent && onSelectEvent(evt)}
                  className="glass-card p-5 rounded-2xl border border-[#D4AF37]/30 hover:border-[#FFD700] transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between space-y-3 bg-[#141923]/70 group"
                >
                  <div className="space-y-2">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-black shadow-sm"
                        style={{ backgroundColor: temple?.color || '#D4AF37' }}
                      >
                        {temple?.badge || (temple ? temple.name : 'Tirumala')}
                      </span>

                      {evt.crowdBadge && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[#FFD700] text-[10px] font-bold">
                          {evt.crowdBadge}
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h3 className={`event-card-title font-serif text-base sm:text-lg font-bold leading-snug transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-amber-700' : 'text-white group-hover:text-[#FFD700]'
                    }`}>
                      {isTe && evt.titleTe ? evt.titleTe : evt.title}
                    </h3>

                    {/* Vahanam tag if specific */}
                    {evt.vahanam && (
                      <p className={`text-xs font-semibold flex items-center gap-1.5 ${
                        isLight ? 'text-amber-800' : 'text-[#FFD700]'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
                        <span>{evt.vahanam}</span>
                      </p>
                    )}

                    {/* Description preview */}
                    <p className={`text-xs line-clamp-3 leading-relaxed ${
                      isLight ? 'text-slate-700 font-medium' : 'text-[#94A3B8]'
                    }`}>
                      {isTe && evt.descriptionTe ? evt.descriptionTe : evt.description}
                    </p>
                  </div>

                  {/* Metadata Footer: Date, Time & Temple Location */}
                  <div className={`pt-3 border-t space-y-1.5 text-xs ${
                    isLight ? 'border-slate-200 text-slate-700' : 'border-white/10 text-[#CBD5E1]'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-medium ${
                      isLight ? 'text-amber-800' : 'text-[#FFD700]'
                    }`}>
                      <Calendar className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-amber-700' : 'text-[#FFD700]'}`} />
                      <span>
                        {formattedDate}
                        {formattedEndDate ? ` — ${formattedEndDate}` : ''}
                      </span>
                    </div>

                    {evt.time && (
                      <div className={`flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
                        <Clock className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-[#94A3B8]'}`} />
                        <span>{evt.time}</span>
                      </div>
                    )}

                    <div className={`flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
                      <MapPin className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                      <span className="truncate">{templeLabel || evt.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. BOTTOM PROMINENT CTA BANNER */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/50 text-center space-y-3 bg-gradient-to-r from-[#141923] via-[#0B0E14] to-[#141923] shadow-2xl">
        <Sparkles className="w-8 h-8 text-[#FFD700] mx-auto animate-pulse" />
        <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {isTe ? (topic.planDarshanTitleTe || `ఇంటరాక్టివ్ క్యాలెండర్‌లో ${topic.searchQuery}ను ప్లాన్ చేయండి`) : (topic.planDarshanTitle || `Plan Your ${topic.searchQuery} Darshan in the Calendar`)}
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          {isTe
            ? `అన్ని ఆలయాల ${topic.searchQuery} సేవలను తేదీల వారీగా శోధించండి, రోజువారీ సమయాలు మరియు నిత్య సేవల వివరాలను పరిశీలించండి.`
            : `Explore scheduled timings, download PDF panchangams, and add ${topic.searchQuery} reminders directly to your calendar.`}
        </p>
        <div className="pt-2">
          <a
            href={`/calendar?search=${encodeURIComponent(ctaSearchQuery)}`}
            onClick={(e) => {
              if (isModifiedClick(e)) return;
              e.preventDefault();
              handleCtaClick();
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FFD700] to-[#FF5722] text-black font-extrabold text-sm inline-flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>{isTe ? (topic.searchCalendarCtaTe || `క్యాలెండర్‌లో ${topic.searchQuery} శోధించండి`) : (topic.calendarCta || `View ${topic.searchQuery} in Calendar`)}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </a>
        </div>
      </section>
    </article>
  );
}

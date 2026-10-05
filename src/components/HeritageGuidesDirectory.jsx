import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Compass,
  FileText,
  MapPin,
  Clock
} from 'lucide-react';
import { FESTIVAL_TOPICS } from '../data/festivalTopics';
import useTheme from '../hooks/useTheme';
import { isModifiedClick } from '../utils/navigation';

const TOPIC_CATEGORIES = [
  { id: 'all', labelEn: 'All Standalone Guides (12)', labelTe: 'అన్ని సమగ్ర గైడ్లు (12)', icon: '📚' },
  { id: 'vahanas_festivals', labelEn: 'Vahana & Festival Traditions', labelTe: 'వాహన సేవలు & బ్రహ్మోత్సవాలు', icon: '🦅' },
  { id: 'kainkaryams_lineages', labelEn: 'Temple Lineages & Kainkaryams', labelTe: 'కైంకర్యపరులు & పూజా విధులు', icon: '🕉️' },
  { id: 'history_epigraphy', labelEn: 'History, Inscriptions & Sacred Lore', labelTe: 'చరిత్ర, శాసనాలు & పురాణ గాథలు', icon: '📜' }
];

const CATEGORY_MAP = {
  'garuda-vahanam': 'vahanas_festivals',
  'rathotsavam': 'vahanas_festivals',
  'brahmotsavam': 'vahanas_festivals',
  'pavithrotsavam': 'vahanas_festivals',
  'kainkaryaparas': 'kainkaryams_lineages',
  'sannidhi-golla': 'kainkaryams_lineages',
  'divya-prabandham-liturgy': 'kainkaryams_lineages',
  'pushpa-kainkaryam': 'kainkaryams_lineages',
  'sapthagiri-geography': 'history_epigraphy',
  'sankeertana-bhandagaram': 'history_epigraphy',
  'govindaraja-legend': 'history_epigraphy',
  'epigraphical-centenary': 'history_epigraphy'
};

export default function HeritageGuidesDirectory({
  lang = 'en',
  onSelectTopic
}) {
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';
  const isTe = lang === 'te';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const topicsList = useMemo(() => {
    return Object.values(FESTIVAL_TOPICS);
  }, []);

  const filteredTopics = useMemo(() => {
    return topicsList.filter(topic => {
      const cat = CATEGORY_MAP[topic.slug] || 'history_epigraphy';
      const matchesCat = selectedCategory === 'all' || cat === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCat;

      const title = (topic.h1 || topic.title || '').toLowerCase();
      const titleTe = (topic.h1Te || topic.titleTe || '').toLowerCase();
      const subtitle = (topic.subtitle || '').toLowerCase();
      const subtitleTe = (topic.subtitleTe || '').toLowerCase();
      const summary = (topic.summary || '').toLowerCase();
      const summaryTe = (topic.summaryTe || '').toLowerCase();

      return (
        matchesCat &&
        (title.includes(q) ||
          titleTe.includes(q) ||
          subtitle.includes(q) ||
          subtitleTe.includes(q) ||
          summary.includes(q) ||
          summaryTe.includes(q))
      );
    });
  }, [topicsList, searchQuery, selectedCategory]);

  const handleTopicClick = (e, slug) => {
    if (isModifiedClick(e)) return;
    e.preventDefault();
    if (onSelectTopic) {
      onSelectTopic(slug);
    } else {
      const targetUrl = `/festivals/${slug}`;
      window.history.pushState({ tab: 'festival-topic' }, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* HERO BANNER */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/40 space-y-4 bg-gradient-to-br from-[#141923] via-[#0B0E14] to-[#141923] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-extrabold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isTe ? 'సమగ్ర పరిశోధనా పత్రాలు & దివ్య గైడ్లు' : 'Standalone Heritage Guides & Treatises'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold gold-gradient-text tracking-tight leading-tight">
            {isTe ? 'తిరుమల సమగ్ర విశేష వ్యాసాలు & దివ్య దర్శిని' : 'Tirumala Heritage Guides & Treatises'}
          </h1>

          <p className={`font-serif text-base sm:text-lg font-semibold leading-snug ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            {isTe
              ? 'శ్రీవారి త్రివిధ కైంకర్యపరులు, సన్నిధి గొల్ల, దివ్య ప్రబంధ పారాయణ క్రమం, పూలమాలలు, శతాబ్దాల శాసన పరిశోధన మరియు పవిత్ర క్షేత్ర గాథలు'
              : 'Detailed standalone explorations into temple functionaries, Sannidhi Golla, Divya Prabandham liturgy, sacred garlands, and centuries of epigraphical discoveries.'}
          </p>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-3xl pt-1">
            {isTe
              ? 'ప్రతి వ్యాసం టిటిడి సప్తగిరి పత్రికలలో ప్రచురితమైన ప్రామాణిక పరిశోధనా గ్రంథాల ఆధారంగా పునర్లిఖించబడి, స్పష్టమైన మూలాలను మరియు పూర్తి సమాచారాన్ని అందిస్తుంది.'
              : 'Each standalone guide is curated and synthesized from peer-reviewed research published by Tirumala Tirupati Devasthanams (TTD) in Sapthagiri Magazine, complete with historical citations.'}
          </p>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TOPIC_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-md font-extrabold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isTe ? cat.labelTe : cat.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isTe ? 'వ్యాసాలలో వెతకండి...' : 'Search guides e.g. Golla, Crown...'}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0E14] border border-[#D4AF37]/40 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
          </div>
        </div>
      </section>

      {/* GUIDES GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map(topic => {
          const targetUrl = `/festivals/${topic.slug}`;
          return (
            <article
              key={topic.slug}
              className="glass-card p-6 rounded-3xl border border-[#D4AF37]/30 hover:border-[#FFD700] transition-all bg-[#141923]/70 hover:bg-[#141923] flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                {/* Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-extrabold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>{isTe ? topic.heroBadgeTe : topic.heroBadge}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold px-2 py-0.5 rounded bg-white/5">
                    12 min read
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug group-hover:text-[#FFD700] transition-colors">
                  <a
                    href={targetUrl}
                    onClick={e => handleTopicClick(e, topic.slug)}
                    className="hover:underline cursor-pointer"
                  >
                    {isTe ? topic.h1Te : topic.h1}
                  </a>
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-snug">
                  {isTe ? topic.subtitleTe : topic.subtitle}
                </p>

                {/* Summary */}
                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                  {isTe ? topic.summaryTe : topic.summary}
                </p>
              </div>

              {/* Footer with Citation & Read CTA */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                {topic.sourceAttribution && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium truncate">
                    <span>📜</span>
                    <span className="truncate">
                      <strong>Source:</strong> {topic.sourceAttribution.publication} ({topic.sourceAttribution.issueDate})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={targetUrl}
                    onClick={e => handleTopicClick(e, topic.slug)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>{isTe ? 'పూర్తి గైడ్ చదవండి' : 'Read Full Standalone Guide'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-xs text-[#94A3B8] font-mono">
                    /{topic.slug}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

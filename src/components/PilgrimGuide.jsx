import HeritageGuidesDirectory from './HeritageGuidesDirectory';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Building,
  HelpCircle,
  QrCode,
  HeartHandshake,
  ShieldAlert,
  ChevronDown,
  CheckCircle,
  Copy,
  Mail,
  MapPin,
  Sparkles,
  Info,
  Clock,
  BookOpen
} from 'lucide-react';
import {
  ABBREVIATION_CATEGORIES,
  TTD_ABBREVIATIONS,
  LADDU_KIOSK_GUIDE,
  KALYANAMAHAPRASADAM_GUIDE,
  PILGRIM_ETIQUETTE_RULES,
  PILGRIM_FAQS
} from '../data/pilgrimData';
import useTheme from '../hooks/useTheme';

export default function PilgrimGuide({ lang = 'en', defaultSection = 'abbreviations', onSelectTopic }) {
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';
  const isTe = lang === 'te';

  const [activeSection, setActiveSection] = useState(defaultSection);

  // Abbreviations state
  const [abbrSearch, setAbbrSearch] = useState('');
  const [selectedAbbrCat, setSelectedAbbrCat] = useState('all');

  // Laddu KIOSK ticket mode state
  const [kioskMode, setKioskMode] = useState('ticket'); // 'ticket' or 'aadhaar'

  // FAQs state
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedFaqCat, setSelectedFaqCat] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Address copy state
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    const addr = KALYANAMAHAPRASADAM_GUIDE.officialAddress;
    const text = `${addr.designation}\n${addr.organization}\n${addr.building}\n${addr.street}\n${addr.city} - ${addr.pinCode}, ${addr.state}\n${addr.country}`;
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Filtered abbreviations
  const filteredAbbreviations = useMemo(() => {
    return TTD_ABBREVIATIONS.filter(item => {
      const matchesCat = selectedAbbrCat === 'all' || item.category === selectedAbbrCat;
      const q = abbrSearch.trim().toLowerCase();
      if (!q) return matchesCat;

      const code = item.code.toLowerCase();
      const nameEn = item.nameEn.toLowerCase();
      const nameTe = (item.nameTe || '').toLowerCase();
      const descEn = (item.descEn || '').toLowerCase();
      const descTe = (item.descTe || '').toLowerCase();

      return (
        matchesCat &&
        (code.includes(q) ||
          nameEn.includes(q) ||
          nameTe.includes(q) ||
          descEn.includes(q) ||
          descTe.includes(q))
      );
    });
  }, [abbrSearch, selectedAbbrCat]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return PILGRIM_FAQS.filter(faq => {
      const matchesCat = selectedFaqCat === 'all' || faq.category === selectedFaqCat;
      const q = faqSearch.trim().toLowerCase();
      if (!q) return matchesCat;

      const qEn = faq.questionEn.toLowerCase();
      const qTe = (faq.questionTe || '').toLowerCase();
      const aEn = faq.answerEn.toLowerCase();
      const aTe = (faq.answerTe || '').toLowerCase();

      return matchesCat && (qEn.includes(q) || qTe.includes(q) || aEn.includes(q) || aTe.includes(q));
    });
  }, [faqSearch, selectedFaqCat]);

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* 1. HERO BANNER */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/40 space-y-4 bg-gradient-to-br from-[#141923] via-[#0B0E14] to-[#141923] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-extrabold">
            <Building className="w-3.5 h-3.5" />
            <span>{isTe ? 'అధికారిక యాత్రికుల మార్గదర్శిని' : 'Official Pilgrim Manual & Directory'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold gold-gradient-text tracking-tight leading-tight">
            {isTe ? 'తిరుమల యాత్రికుల సమాచార నిధి & సేవలు' : 'Tirumala Pilgrim Guide & Directory'}
          </h1>

          <p className={`font-serif text-base sm:text-lg font-semibold leading-snug ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            {isTe
              ? 'TTD సంక్షిప్త పదాల అర్థాలు, డిజిటల్ లడ్డూ కియోస్క్ విధానం, కల్యాణ ప్రసాదం మరియు ఆలయ నియమావళి'
              : 'Decoded TTD abbreviations, automated laddu KIOSK workflows, wedding card blessings, and sanctum etiquette.'}
          </p>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-3xl pt-1">
            {isTe
              ? 'తిరుమల క్షేత్ర పర్యటనలో భక్తులకు ఎదురయ్యే సందేహాలు, వసతి సంక్షిప్త నామాలు, లడ్డూ కొనుగోలు విధానం మరియు సాంప్రదాయ నియమాలను సులభంగా అర్థం చేసుకునేందుకు ఈ మార్గదర్శిని రూపొందించబడింది.'
              : 'Essential guidance for pilgrims navigating Tirumala. Find accommodation codes, learn how to purchase additional laddus via UPI KIOSKs, request blessed wedding gifts, and review sanctum etiquette.'}
          </p>
        </div>

        {/* 2. SECTION TABS */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-white/10">
          <button
            onClick={() => setActiveSection('abbreviations')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSection === 'abbreviations'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg font-extrabold'
                : 'bg-white/5 text-[#CBD5E1] hover:text-[#FFD700] hover:bg-white/10'
            }`}
          >
            <span>🏛️</span>
            <span>{isTe ? 'TTD సంక్షిప్త పదాలు (24)' : 'TTD Abbreviations (24)'}</span>
          </button>

          <button
            onClick={() => setActiveSection('laddu-kiosk')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSection === 'laddu-kiosk'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg font-extrabold'
                : 'bg-white/5 text-[#CBD5E1] hover:text-[#FFD700] hover:bg-white/10'
            }`}
          >
            <span>📱</span>
            <span>{isTe ? 'లడ్డూ UPI కియోస్క్ గైడ్' : 'Smart Laddu KIOSK Guide'}</span>
          </button>

          <button
            onClick={() => setActiveSection('kalyanam')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSection === 'kalyanam'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg font-extrabold'
                : 'bg-white/5 text-[#CBD5E1] hover:text-[#FFD700] hover:bg-white/10'
            }`}
          >
            <span>💌</span>
            <span>{isTe ? 'కల్యాణ ప్రసాదం తపాలా సేవ' : 'Wedding Invitation Blessings'}</span>
          </button>

          <button
            onClick={() => setActiveSection('etiquette')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSection === 'etiquette'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg font-extrabold'
                : 'bg-white/5 text-[#CBD5E1] hover:text-[#FFD700] hover:bg-white/10'
            }`}
          >
            <span>🌸</span>
            <span>{isTe ? 'ఆలయ నియమావళి & పూల నిషేధం' : 'Sanctum Etiquette & Rules'}</span>
          </button>

          <button
            onClick={() => setActiveSection('faqs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSection === 'faqs'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg font-extrabold'
                : 'bg-white/5 text-[#CBD5E1] hover:text-[#FFD700] hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#FFD700]" />
            <span>{isTe ? 'ప్రశ్నోత్తరాలు (FAQs)' : 'Pilgrim FAQs'}</span>
          </button>

          <button
            onClick={() => setActiveSection('heritage-guides')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSection === 'heritage-guides'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg font-extrabold'
                : 'bg-white/5 text-[#CBD5E1] hover:text-[#FFD700] hover:bg-white/10'
            }`}
          >
            <span>📚</span>
            <span>{isTe ? 'సమగ్ర విశేష గైడ్లు (12)' : 'Heritage Guides (12)'}</span>
          </button>
        </div>
      </section>

      {/* SECTION 1: TTD ABBREVIATIONS DECODER */}
      {activeSection === 'abbreviations' && (
        <section className="space-y-6">
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/30 space-y-4 bg-[#141923]/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className={`font-serif text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isTe ? 'తిరుమల నివాస & సేవ సంక్షిప్త పదాల అర్థాలు' : 'TTD Facilities & Enclaves Decoder'}
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  {isTe
                    ? 'మీ గదుల రసీదు లేదా సూచిక బోర్డులపై ఉన్న సంక్షిప్త రూపాన్ని సెర్చ్ చేయండి'
                    : 'Search acronyms printed on accommodation slips, boards, and registration counters'}
                </p>
              </div>

              {/* Instant Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]" />
                <input
                  type="text"
                  value={abbrSearch}
                  onChange={e => setAbbrSearch(e.target.value)}
                  placeholder={isTe ? 'ఉదా: VQC, GNC, PJN...' : 'Search code e.g. VQC, GNC, PJN...'}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0E14] border border-[#D4AF37]/40 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              {ABBREVIATION_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedAbbrCat(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    selectedAbbrCat === cat.id
                      ? 'bg-[#FFD700] text-black shadow'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isTe ? cat.labelTe : cat.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Abbreviations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAbbreviations.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 hover:border-[#FFD700] transition-all bg-[#141923]/60 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-[#FFD700]/50 text-[#FFD700] font-mono font-extrabold text-sm sm:text-base tracking-wide">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className={`font-serif text-base font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {isTe ? item.nameTe : item.nameEn}
                  </h3>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {isTe ? item.descTe : item.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Source Attribution Badge */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>📜 <strong>Source:</strong> "Know Tirumala Through Abbreviations", Sapthagiri English Magazine (October 2026)</span>
            <span className="text-[11px] text-amber-400 font-semibold">Tirumala Tirupati Devasthanams (TTD)</span>
          </div>
        </section>
      )}

      {/* SECTION 2: SMART LADDU KIOSK GUIDE */}
      {activeSection === 'laddu-kiosk' && (
        <section className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 space-y-5 bg-[#141923]/80">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-[#FFD700]" />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text">
                  {isTe ? LADDU_KIOSK_GUIDE.titleTe : LADDU_KIOSK_GUIDE.titleEn}
                </h2>
                <p className="text-xs text-[#94A3B8] pt-0.5">
                  {isTe ? LADDU_KIOSK_GUIDE.subtitleTe : LADDU_KIOSK_GUIDE.subtitleEn}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTe ? LADDU_KIOSK_GUIDE.overviewTe : LADDU_KIOSK_GUIDE.overviewEn}
            </p>

            {/* Quota Rules Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {LADDU_KIOSK_GUIDE.quotaRules.map((rule, idx) => (
                <div
                  key={idx}
                  onClick={() => setKioskMode(idx === 0 ? 'ticket' : 'aadhaar')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    (idx === 0 && kioskMode === 'ticket') || (idx === 1 && kioskMode === 'aadhaar')
                      ? 'bg-amber-500/15 border-[#FFD700] ring-1 ring-[#FFD700]'
                      : 'bg-[#0B0E14]/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{idx === 0 ? '🎫' : '🆔'}</span>
                    <h3 className="font-serif text-sm font-bold text-[#FFD700]">
                      {isTe ? rule.titleTe : rule.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed pt-2">
                    {isTe ? rule.descTe : rule.descEn}
                  </p>
                </div>
              ))}
            </div>

            {/* Step-by-Step Flow */}
            <div className="pt-4 space-y-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <span>⚡</span>
                <span>{isTe ? 'కియోస్క్ యంత్రాల వినియోగ విధానం (5 సులువైన దశలు)' : 'Step-by-Step Self-Service Process (5 Simple Steps)'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                {LADDU_KIOSK_GUIDE.steps.map(step => (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl bg-[#0B0E14] border border-white/10 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="w-6 h-6 rounded-full bg-[#FFD700]/20 text-[#FFD700] font-mono text-xs font-bold flex items-center justify-center border border-[#FFD700]/40">
                        {step.step}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-slate-100">
                        {isTe ? step.titleTe : step.titleEn}
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                        {isTe ? step.descTe : step.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source citation */}
            <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
              📜 <strong>Source:</strong> "KIOSK machines at Laddu Counters in Tirumala", Sapthagiri English Magazine (September 2026)
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: KALYANAMAHAPRASADAM (WEDDING BLESSINGS) */}
      {activeSection === 'kalyanam' && (
        <section className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 space-y-6 bg-[#141923]/80">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#FFD700]" />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text">
                  {isTe ? KALYANAMAHAPRASADAM_GUIDE.titleTe : KALYANAMAHAPRASADAM_GUIDE.titleEn}
                </h2>
                <p className="text-xs text-[#94A3B8] pt-0.5">
                  {isTe ? KALYANAMAHAPRASADAM_GUIDE.subtitleTe : KALYANAMAHAPRASADAM_GUIDE.subtitleEn}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTe ? KALYANAMAHAPRASADAM_GUIDE.overviewTe : KALYANAMAHAPRASADAM_GUIDE.overviewEn}
            </p>

            {/* Official Postal Card Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1c2230] to-[#141923] border-2 border-amber-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-400" />
                    {isTe ? 'వివాహ పత్రికను పంపవలసిన అధికారిక చిరునామా' : 'Official Postal Dispatch Address for Invitation Cards'}
                  </span>
                  <p className="text-xs text-[#94A3B8]">
                    {isTe ? KALYANAMAHAPRASADAM_GUIDE.dispatchWindowTe : KALYANAMAHAPRASADAM_GUIDE.dispatchWindowEn}
                  </p>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-center"
                >
                  {copiedAddress ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAddress ? (isTe ? 'చిరునామా కాపీ అయింది!' : 'Copied!') : (isTe ? 'చిరునామా కాపీ చేయండి' : 'Copy Address')}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0E14] border border-white/10 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                <p className="font-bold text-[#FFD700]">{KALYANAMAHAPRASADAM_GUIDE.officialAddress.designation}</p>
                <p>{KALYANAMAHAPRASADAM_GUIDE.officialAddress.organization}</p>
                <p>{KALYANAMAHAPRASADAM_GUIDE.officialAddress.building}</p>
                <p>{KALYANAMAHAPRASADAM_GUIDE.officialAddress.street}</p>
                <p>{KALYANAMAHAPRASADAM_GUIDE.officialAddress.city} - {KALYANAMAHAPRASADAM_GUIDE.officialAddress.pinCode}, {KALYANAMAHAPRASADAM_GUIDE.officialAddress.state}</p>
                <p>{KALYANAMAHAPRASADAM_GUIDE.officialAddress.country}</p>
              </div>
            </div>

            {/* Received Gift Contents */}
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                <span>{isTe ? 'దంపతులకు తపాలా ద్వారా లభించే దివ్య ప్రసాద కానుకలు' : 'Sanctified Wedding Gifts Dispatched by TTD to Newlyweds'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {KALYANAMAHAPRASADAM_GUIDE.kitContents.map((kit, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0B0E14] border border-white/10 space-y-1.5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#FFD700]">
                        {isTe ? kit.itemTe : kit.itemEn}
                      </h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed pt-1">
                        {isTe ? kit.descTe : kit.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source citation */}
            <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
              📜 <strong>Source:</strong> "Lord Venkateswara Mahaprasadam - The Lord's Blessings at Your Door Step", Sapthagiri English Magazine (September 2026)
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: SACRED ETIQUETTE & SANCTUM RULES */}
      {activeSection === 'etiquette' && (
        <section className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 space-y-6 bg-[#141923]/80">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text">
                {isTe ? 'తిరుమల యాత్రికుల పవిత్ర ప్రవర్తనా నియమావళి' : 'Sacred Pilgrim Etiquette & Temple Conduct'}
              </h2>
              <p className="text-xs text-[#94A3B8] pt-0.5">
                {isTe
                  ? 'భృగు సంహిత మరియు వైఖానస ఆగమ శాస్త్రాల ప్రకారం దర్శన సమయంలో పాటించవలసిన నియమాలు'
                  : 'Agamic decorum and behavioural guidelines as prescribed in the Bhrigu Samhita and TTD regulations.'}
              </p>
            </div>

            {/* Special Highlight: No Flowers Rule */}
            <div className="p-5 rounded-2xl bg-red-950/40 border-2 border-red-500/50 space-y-2">
              <div className="flex items-center gap-2 text-red-300 font-serif font-bold text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>{isTe ? PILGRIM_ETIQUETTE_RULES[0].titleTe : PILGRIM_ETIQUETTE_RULES[0].titleEn}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {isTe ? PILGRIM_ETIQUETTE_RULES[0].descTe : PILGRIM_ETIQUETTE_RULES[0].descEn}
              </p>
            </div>

            {/* Grid of Other Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PILGRIM_ETIQUETTE_RULES.slice(1).map((rule, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0B0E14] border border-white/10 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#FFD700]">
                      {isTe ? rule.titleTe : rule.titleEn}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed pt-1.5">
                      {isTe ? rule.descTe : rule.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Source citation */}
            <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
              📜 <strong>Source:</strong> "Tirumala Brahmotsavam: Divine Celebration and Pilgrim's Etiquette" by Dr. Raghavendra Siddharth, Sapthagiri English Magazine (September 2025)
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: PILGRIM & TEMPLE FAQS */}
      {activeSection === 'faqs' && (
        <section className="space-y-6">
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/30 space-y-4 bg-[#141923]/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className={`font-serif text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isTe ? 'తరచుగా అడిగే పవిత్ర ప్రశ్నలు & సమాధానాలు' : 'Frequently Asked Pilgrim & Ritual Questions'}
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  {isTe ? 'ఆలయ నియమాలు, దర్శన పద్ధతులు మరియు సంప్రదాయాల సమగ్ర సమాచారం' : 'Verified answers on sanctum traditions, laddu kiosks, offerings, and etiquette'}
                </p>
              </div>

              {/* Instant Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                  placeholder={isTe ? 'ప్రశ్నలలో వెతకండి...' : 'Search questions or keywords...'}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0E14] border border-[#D4AF37]/40 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              {[
                { id: 'all', labelEn: 'All Questions', labelTe: 'అన్ని ప్రశ్నలు' },
                { id: 'rules', labelEn: 'Sacred Rules', labelTe: 'ఆలయ నియమాలు' },
                { id: 'rituals', labelEn: 'Rituals & Sanctions', labelTe: 'పూజలు & క్రతువులు' },
                { id: 'traditions', labelEn: 'Puranic Traditions', labelTe: 'పురాణ సంప్రదాయాలు' },
                { id: 'amenities', labelEn: 'Pilgrim Amenities', labelTe: 'యాత్రికుల సేవలు' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFaqCat(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedFaqCat === cat.id
                      ? 'bg-[#FFD700] text-black shadow'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{isTe ? cat.labelTe : cat.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-3">
            {filteredFaqs.map(faq => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="glass-card rounded-2xl border border-[#D4AF37]/30 hover:border-[#FFD700] transition-colors bg-[#141923]/60 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold flex items-center justify-center shrink-0">
                        Q
                      </span>
                      <h3 className={`font-serif text-sm sm:text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {isTe ? faq.questionTe : faq.questionEn}
                      </h3>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 space-y-3 border-t border-white/5">
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#0B0E14] p-4 rounded-xl border border-white/5">
                        {isTe ? faq.answerTe : faq.answerEn}
                      </div>

                      {faq.source && (
                        <div className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1.5 pl-1">
                          <span>📜</span>
                          <span><strong>Source:</strong> {faq.source}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 6: HERITAGE & STANDALONE GUIDES DIRECTORY */}
      {activeSection === 'heritage-guides' && (
        <HeritageGuidesDirectory
          lang={lang}
          onSelectTopic={onSelectTopic}
        />
      )}
    </div>
  );
}

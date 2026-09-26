import React from 'react';
import { BookOpen, ExternalLink, Scroll, Landmark, Feather, ArrowRight } from 'lucide-react';
import { REFERENCES_LIST } from '../data/mediaAndReferences';
import { isModifiedClick } from '../utils/navigation';

export default function ReferencesList({ lang = 'en', onNavigate, onNavigateToGlossary }) {
  const handleInternalLink = (href, e, glossaryTermId = null) => {
    if (isModifiedClick(e)) return;
    e.preventDefault();

    if (glossaryTermId && onNavigateToGlossary) {
      onNavigateToGlossary(glossaryTermId);
    } else if (onNavigate) {
      onNavigate(href);
    } else {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="glass-card p-6 sm:p-8 border-l-4 border-l-[#3A86EF] border-[#D4AF37]/30">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-[#3A86EF]" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
            {lang === 'en' ? 'References & Historical Literature' : 'ఆధారాలు & చారిత్రక గ్రంథాలు'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
          {lang === 'en'
            ? 'Discover the documentary heritage, liturgical scriptures, sanctum inscriptions, and devotional literature underpinning Tirumala and Tirupati temple traditions.'
            : 'తిరుమల క్షేత్ర చరిత్ర, ఆగమ శాస్త్రాలు, తాళ్లపాక అన్నమయ్య సంకీర్తనలు మరియు ప్రాచీన ఆలయ శాసనాల ఆధార సమాహారం.'}
        </p>
      </div>

      {/* The Three Archival Pillars Section */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3A86EF]" />
            <span>
              {lang === 'en'
                ? 'The Three Archival Pillars of Tirumala Heritage'
                : 'తిరుమల చారిత్రక వారసత్వపు మూడు ప్రధాన స్తంభాలు'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {lang === 'en'
              ? 'Our festival schedules, ritual descriptions, and deity attributes are strictly grounded in these three primary historical traditions:'
              : 'ఉత్సవాల కాలపట్టికలు, పూజా విధానాలు మరియు వాహన సేవల వివరాలు ఈ మూడు ప్రాథమిక చారిత్రక ఆధారాలపై ఆధారపడి ఉన్నాయి:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Agama Sastra */}
          <div className="glass-card p-5 sm:p-6 border border-[#D4AF37]/30 hover:border-[#FFD700] rounded-2xl transition-all space-y-3 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3A86EF]/15 border border-[#3A86EF]/40 flex items-center justify-center text-[#3A86EF]">
                <Scroll className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors leading-snug">
                {lang === 'en' ? '1. Agama Sastra & Ritual Manuals' : '1. ఆగమ శాస్త్రం & పూజా నియమావళి'}
              </h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {lang === 'en'
                  ? 'Sanctum worship in Tirumala follows ancient Vaikhanasa Agama codes. Ritual manuals define the sequence of daily kainkaryams, purification rites, and festival vahana processions.'
                  : 'తిరుమల ఆలయ అర్చనా విధానం ప్రాచీన వైఖానస ఆగమోక్తంగా సాగుతుంది. నిత్య కైంకర్యాలు, సంప్రోక్షణలు మరియు ఉత్సవ వాహన సేవల క్రమాన్ని ఆగమ శాస్త్ర గ్రంథాలు నిర్దేశిస్తాయి.'}
              </p>
            </div>
            <div className="pt-3 border-t border-white/10">
              <a
                href="/glossary"
                onClick={(e) => handleInternalLink('/glossary', e, 'vaikhanasa-aradhana')}
                className="text-xs font-bold text-[#FFD700] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Explore Vaikhanasa Lore' : 'వైఖానస ఆగమ విశేషాలు'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pillar 2: Epigraphical Inscriptions */}
          <div className="glass-card p-5 sm:p-6 border border-[#D4AF37]/30 hover:border-[#FFD700] rounded-2xl transition-all space-y-3 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB703]/15 border border-[#FFB703]/40 flex items-center justify-center text-[#FFB703]">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors leading-snug">
                {lang === 'en' ? '2. Temple Stone Inscriptions' : '2. ఆలయ ప్రాకార శాసన సంపద'}
              </h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {lang === 'en'
                  ? 'Centuries of historical endowments and royal grants are documented on stone walls across the Seven Hills, recording patronage by the Pallava, Chola, Saluva, and Vijayanagara dynasties.'
                  : 'శతాబ్దాల నాటి దానధర్మాలు, ఉత్సవ నిర్వహణ వివరాలు పల్లవ, చోళ, సాళువ మరియు విజయనగర రాజవంశాల కాలం నాటి రాతి శాసనాలలో నిక్షిప్తమై ఉన్నాయి.'}
              </p>
            </div>
            <div className="pt-3 border-t border-white/10">
              <a
                href="/temples"
                onClick={(e) => handleInternalLink('/temples', e)}
                className="text-xs font-bold text-[#FFD700] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'en' ? 'View 7 Sacred Shrines' : 'సప్త దివ్య పుణ్యక్షేత్రాలు'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pillar 3: Annamacharya Sankirtanas */}
          <div className="glass-card p-5 sm:p-6 border border-[#D4AF37]/30 hover:border-[#FFD700] rounded-2xl transition-all space-y-3 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5722]/15 border border-[#FF5722]/40 flex items-center justify-center text-[#FF5722]">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors leading-snug">
                {lang === 'en' ? '3. Annamacharya Sankirtana Archives' : '3. తాళ్లపాక అన్నమయ్య సంకీర్తనా భాండాగారం'}
              </h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {lang === 'en'
                  ? 'Saint Tallapaka Annamacharya (1408–1503) composed 32,000 sankirtanas preserved on copper plates, vividly celebrating Lord Venkateswara’s vahana sevas, daily naivedyams, and divine pastimes.'
                  : 'తాళ్లపాక అన్నమాచార్యులు (1408–1503) రచించిన 32,000 రాగిరేకుల సంకీర్తనలు శ్రీవారి నిత్య కైంకర్యాలు, వాహన సేవలు మరియు ప్రసాదాల ప్రాశస్త్యాన్ని భక్తిరసభరితంగా వివరిస్తాయి.'}
              </p>
            </div>
            <div className="pt-3 border-t border-white/10">
              <a
                href="/glossary"
                onClick={(e) => handleInternalLink('/glossary', e, 'sri-annamacharya')}
                className="text-xs font-bold text-[#FFD700] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Saint Annamacharya Biography' : 'శ్రీ అన్నమాచార్య విశేషాలు'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Reference Records Grid */}
      <section className="space-y-4 pt-2">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
          <span>
            {lang === 'en' ? 'Archival Literature & Reference Records' : 'పరిశోధనా గ్రంథాలు & ప్రామాణిక పత్రాలు'}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REFERENCES_LIST.map(ref => (
            <div key={ref.id} className="glass-card p-5 sm:p-6 border border-[#D4AF37]/30 hover:border-[#FFD700] rounded-2xl transition-all space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="badge-gold text-[10px] uppercase font-bold">{ref.type}</span>
                <span className="text-xs font-mono font-bold text-[#FFD700]">{ref.year}</span>
              </div>

              <h3 className="font-serif text-lg font-bold text-white leading-snug">
                {lang === 'en' ? ref.title : ref.titleTe}
              </h3>

              <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#0B0E14] p-3 rounded-lg border border-white/5">
                {lang === 'en' ? ref.summary : ref.summaryTe}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-[#CBD5E1]">
                <span>Publisher: {ref.publisher}</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FFD700] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Read More</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

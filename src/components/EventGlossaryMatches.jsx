import { useMemo } from 'react';
import { UTSAVA_GLOSSARY_TERMS } from '../data/utsavaGlossary';
import { BookOpen, ExternalLink } from 'lucide-react';
import { isModifiedClick } from '../utils/navigation';

// Common words that appear in nearly all festival descriptions and cause false-positive tag floods
const OVERLY_GENERIC_KEYWORDS = new Set([
  'tirumala',
  'utsavam',
  'temple',
  'deity',
  'swamy',
  'seva',
  'morning',
  'evening',
  'night',
  'alankaram',
  'abhishekam',
  'door',
  'gate',
  'vastram'
]);

// Maximum number of contextual terms to display so they never overwhelm the actual description
const MAX_MATCHED_TERMS = 4;

export default function EventGlossaryMatches({
  event,
  lang,
  onClose,
  onNavigateToGlossary
}) {
  const matchingGlossaryTerms = useMemo(() => {
    if (!event || !Array.isArray(UTSAVA_GLOSSARY_TERMS)) return [];

    const titleEn = (event.title || '').toLowerCase();
    const titleTe = (event.titleTe || '').toLowerCase();
    const vahanam = (event.vahanam || '').toLowerCase();
    const descEn = (event.description || '').toLowerCase();
    const descTe = (event.descriptionTe || '').toLowerCase();

    const scored = [];

    for (const gTerm of UTSAVA_GLOSSARY_TERMS) {
      if (!gTerm || !gTerm.term) continue;

      const termEn = gTerm.term.toLowerCase();
      const termTe = (gTerm.termTe || '').toLowerCase();

      let score = 0;

      // 1. Direct match with Procession Vahanam (Highest priority)
      if (vahanam && (vahanam.includes(termEn) || termEn.includes(vahanam))) {
        score += 20;
      }

      // 2. Direct match with Event Title
      if (titleEn.includes(termEn) || (termTe && titleTe.includes(termTe))) {
        score += 15;
      }

      // 3. Exact term in event description (moderate weight if not generic)
      if (descEn.includes(termEn) || (termTe && descTe.includes(termTe))) {
        if (!OVERLY_GENERIC_KEYWORDS.has(termEn)) {
          score += 6;
        }
      }

      // 4. Relevant related keywords check (only specific keywords)
      if (Array.isArray(gTerm.relatedEventKeywords)) {
        for (const kw of gTerm.relatedEventKeywords) {
          if (!kw) continue;
          const kwLower = String(kw).toLowerCase();
          if (OVERLY_GENERIC_KEYWORDS.has(kwLower) || kwLower.length < 4) continue;

          if (vahanam.includes(kwLower)) {
            score += 10;
          } else if (titleEn.includes(kwLower) || titleTe.includes(kwLower)) {
            score += 8;
          } else if (descEn.includes(kwLower) || descTe.includes(kwLower)) {
            score += 2;
          }
        }
      }

      // Only qualify terms that meet minimum relevance threshold
      if (score >= 6) {
        scored.push({ gTerm, score });
      }
    }

    // Sort by highest relevance score first, then limit to at most MAX_MATCHED_TERMS
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_MATCHED_TERMS)
      .map(item => item.gTerm);
  }, [event]);

  if (matchingGlossaryTerms.length === 0) {
    return null;
  }

  return (
    <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#141923] to-[#1A1500] border border-[#FFD700]/30 space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#FFD700] uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>
            {lang === 'en'
              ? 'Related Terms'
              : 'సంబంధిత పదాలు'}
          </span>
        </div>

        <span className="text-[10px] text-[#94A3B8] font-normal lowercase">
          {lang === 'en'
            ? '(tap term to read meaning)'
            : '(వివరణ కోసం పదాన్ని నొక్కండి)'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {matchingGlossaryTerms.map(term => (
          <a
            key={term.id}
            href="/glossary"
            onClick={(e) => {
              if (isModifiedClick(e)) return;
              e.preventDefault();
              onClose();

              if (onNavigateToGlossary) {
                onNavigateToGlossary(term.id);
              }
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/70 hover:bg-[#FFD700] text-[#FFD700] hover:text-black border border-[#D4AF37]/40 transition-all flex items-center gap-1.5 shadow-sm group/badge cursor-pointer"
            title={`Click to read complete glossary entry for ${term.term}`}
          >
            <span>
              📖 {lang === 'en' ? term.term : (term.termTe || term.term)}
            </span>

            <ExternalLink className="w-3 h-3 group-hover/badge:scale-110" />
          </a>
        ))}
      </div>
    </div>
  );
}
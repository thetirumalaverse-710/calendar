import React from 'react';
import { Clock } from 'lucide-react';

export default function ScheduleViewHeader({
  lang,
  todayLabel,
  monthKeys,
  effectiveMonthFilter,
  setActiveMonthFilter
}) {
  return (
    <div className="glass-card p-4 border-2 border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-3 bg-[#0B0E14] shadow-xl">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#FF5722]/20 border border-[#FF5722]/50 flex items-center justify-center text-[#FF5722]">
          <Clock className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold gold-gradient-text">
            {lang === 'en' ? 'Schedule View' : 'షెడ్యూల్ దర్శిని'}
          </h3>

          <p className="text-[11px] text-[#94A3B8]">
            {lang === 'en'
              ? `Upcoming events from ${todayLabel}`
              : `${todayLabel} నుండి రాబోయే ఉత్సవాలు`}
          </p>
        </div>
      </div>

      {/* Month Filters */}
      {monthKeys.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          <button
            type="button"
            onClick={() => setActiveMonthFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              effectiveMonthFilter === 'all'
                ? 'bg-[#FF5722] text-white shadow-md'
                : 'bg-[#141923] text-[#94A3B8] hover:text-white border border-white/10'
            }`}
          >
            {lang === 'en' ? 'All Upcoming' : 'అన్ని రాబోయే ఉత్సవాలు'}
          </button>

          {monthKeys.map(monthName => (
            <button
              type="button"
              key={monthName}
              onClick={() => setActiveMonthFilter(monthName)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                effectiveMonthFilter === monthName
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-md'
                  : 'bg-[#141923] text-[#94A3B8] hover:text-[#FFD700] border border-white/10'
              }`}
            >
              {monthName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

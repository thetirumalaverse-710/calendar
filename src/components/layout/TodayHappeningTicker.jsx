import React from 'react';

export default function TodayHappeningTicker({ todayEvent, lang, onSelectEvent }) {
  if (!todayEvent) return null;

  return (
    <div 
      onClick={() => onSelectEvent(todayEvent)}
      className="bg-gradient-to-r from-red-900 via-[#E65100] to-[#141923] text-white py-2 px-4 cursor-pointer border-b border-[#FFD700]/50 shadow-md overflow-hidden relative group"
      title="Click to view full event card details"
    >
      <div className="container flex items-center justify-between gap-3 text-xs sm:text-sm font-extrabold">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
          <span className="px-2 py-0.5 rounded bg-red-600 text-white uppercase text-[10px] tracking-wider">
            {lang === 'en' ? 'Happening Today' : 'ఈ రోజు జరుగుతోంది'}
          </span>
        </div>

        <div className="truncate flex-grow text-center font-serif text-[#FFD700] tracking-wide">
          {lang === 'en' ? todayEvent.title : (todayEvent.titleTe || todayEvent.title)}
          {todayEvent.vahanam && ` — 🐎 ${todayEvent.vahanam}`}
        </div>

        <div className="shrink-0 text-[11px] font-sans underline text-[#FFD700] group-hover:scale-105 transition-transform">
          {lang === 'en' ? 'View Details ➔' : 'వివరాలు చూడండి ➔'}
        </div>
      </div>
    </div>
  );
}

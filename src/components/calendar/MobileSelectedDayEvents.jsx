import React from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles
} from 'lucide-react';
import { TEMPLES } from '../../data/templeEvents';

export default function MobileSelectedDayEvents({
  lang,
  selectedDayEvents,
  onSelectEvent
}) {
  return (
    <div className="mt-3 space-y-2">

      {selectedDayEvents.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 text-center border border-white/10">
          <CalendarIcon className="w-8 h-8 mx-auto text-[#D4AF37]/50 mb-2" />

          <p className="text-xs font-bold text-[#94A3B8]">
            {lang === 'en'
              ? 'No events on this date'
              : 'ఈ తేదీన కార్యక్రమాలు లేవు'}
          </p>

          <p className="text-[10px] text-[#64748B] mt-1">
            {lang === 'en'
              ? 'Select another date to view its events.'
              : 'మరొక తేదీని ఎంచుకోండి.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />

            <h3 className="font-serif text-base font-extrabold text-[#FFD700]">
              {lang === 'en'
                ? "Today's / Selected Events"
                : 'ఎంచుకున్న తేదీ ఉత్సవాలు'}
            </h3>
          </div>

          {selectedDayEvents.map(evt => {
            const temple =
              TEMPLES.find(
                t => t.id === evt.templeId
              );

            return (
              <button
                key={evt.id}
                type="button"
                onClick={() =>
                  onSelectEvent(evt)
                }
                className="w-full text-left rounded-2xl glass-card border-2 border-[#D4AF37]/60 p-3 shadow-lg active:scale-[0.99] transition-all hover:border-[#FFD700]"
              >
                <div className="flex items-start gap-3">

                  <div
                    className="w-2 self-stretch rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        temple?.color ||
                        '#FFD700'
                    }}
                  />

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2">
                      <h4 className="event-card-title font-serif text-sm font-black leading-snug">
                        {lang === 'en'
                          ? evt.title
                          : evt.titleTe ||
                            evt.title}
                      </h4>

                      <span className="shrink-0 text-[9px] font-black text-[#FF5722] dark:text-[#FFD700]">
                        VIEW
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-bold mt-1">
                      {lang === 'en'
                        ? temple?.name ||
                          'Tirumala'
                        : temple?.nameTe ||
                          temple?.name ||
                          'తిరుమల'}
                    </p>

                    <p className="text-[10px] text-slate-700 dark:text-[#94A3B8]/90 mt-1.5 line-clamp-2">
                      {lang === 'en'
                        ? evt.description ||
                          'Temple event'
                        : evt.descriptionTe ||
                          evt.description ||
                          'ఆలయ కార్యక్రమం'}
                    </p>

                  </div>
                </div>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

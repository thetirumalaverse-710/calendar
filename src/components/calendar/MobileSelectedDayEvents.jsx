import React from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock
} from 'lucide-react';
import { TEMPLES } from '../../data/templeEvents';
import { getEventStatus } from '../../utils/eventStatus';
import { formatEventTiming, getIndiaDateString } from '../../utils/indiaTime';

export default function MobileSelectedDayEvents({
  lang,
  selectedDayEvents,
  selectedDate,
  todayIST,
  currentIST,
  onSelectEvent
}) {
  const effectiveToday = todayIST || getIndiaDateString();
  const isTodayDate = selectedDate === effectiveToday;

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
              {isTodayDate
                ? (lang === 'en' ? "Today's Events" : 'ఈ రోజు ఉత్సవాలు')
                : (lang === 'en' ? 'Events on Selected Date' : 'ఎంచుకున్న తేదీ ఉత్సవాలు')}
            </h3>
          </div>

          {selectedDayEvents.map(evt => {
            const temple =
              TEMPLES.find(
                t => t.id === evt.templeId
              );
            const statusObj = getEventStatus(evt, currentIST);

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

                      <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase shadow ${statusObj.colorClass}`}>
                        {lang === 'en' ? statusObj.status : statusObj.statusTe}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-bold">
                        {lang === 'en'
                          ? temple?.name ||
                            'Tirumala'
                          : temple?.nameTe ||
                            temple?.name ||
                            'తిరుమల'}
                      </p>

                      <span className="text-[10px] font-mono text-amber-500 dark:text-[#FFD700] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF5722]" />
                        {formatEventTiming(evt)}
                      </span>
                    </div>

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

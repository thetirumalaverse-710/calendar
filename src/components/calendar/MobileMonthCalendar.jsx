import React from 'react';
import { TEMPLES } from '../../data/templeEvents';
import {
  getDateString,
  getTodayIST
} from '../../utils/calendarMonthUtils';

export default function MobileMonthCalendar({
  lang,
  activeMonth,
  firstDayIndex,
  totalDays,
  selectedDate,
  selectedDateLabel,
  selectedDayEvents,
  getEventsForDay,
  onSelectDate
}) {
  return (
    <div className="rounded-2xl border-2 border-[#D4AF37]/40 bg-[#0B0E14] shadow-2xl p-2.5">

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {(
          lang === 'en'
            ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            : ['ఆ', 'సో', 'మం', 'బు', 'గు', 'శు', 'శ']
        ).map((day, index) => (
          <div
            key={index}
            className={`text-center py-1.5 text-[10px] font-black ${
              index === 0 || index === 6
                ? 'text-[#FF5722]'
                : 'text-[#FFD700]'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">

        {Array.from({
          length: firstDayIndex
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="h-11 rounded-lg bg-[#141923]/30 border border-white/5"
          />
        ))}

        {Array.from({
          length: totalDays
        }).map((_, index) => {

          const day = index + 1;

          const dateStr = getDateString(
            activeMonth.year,
            activeMonth.month,
            day
          );

          const dayEvents =
            getEventsForDay(day);

          const hasEvents =
            dayEvents.length > 0;

          const isToday =
            dateStr === getTodayIST();

          const isSelected =
            dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() =>
                onSelectDate(dateStr)
              }
              className={`h-11 rounded-lg border relative flex flex-col items-center justify-center transition-all active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#FFD700] to-[#FF5722] border-[#FFD700] text-black shadow-lg ring-2 ring-[#FFD700]/40'
                  : isToday
                    ? 'bg-amber-100 border-[#FF5722] text-[#FF5722] ring-1 ring-[#FF5722]'
                    : hasEvents
                      ? 'bg-white border-[#D4AF37] text-slate-900'
                      : 'bg-white border-slate-200 text-slate-900'
              }`}
            >

              <span className="text-xs font-black leading-none">
                {day}
              </span>

              {hasEvents && (
                <div className="flex items-center gap-0.5 mt-1">
                  {dayEvents
                    .slice(0, 3)
                    .map(evt => {
                      const temple =
                        TEMPLES.find(
                          t =>
                            t.id ===
                            evt.templeId
                        );

                      return (
                        <span
                          key={evt.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              temple?.color ||
                              '#FF5722'
                          }}
                        />
                      );
                    })}
                </div>
              )}

              {dayEvents.length > 3 && (
                <span className="absolute top-0.5 right-0.5 text-[7px] font-black">
                  +{dayEvents.length - 3}
                </span>
              )}

            </button>
          );
        })}
      </div>

      {/* Selected Date Indicator */}
      <div className="mt-3 px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/30 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold">
            {lang === 'en'
              ? 'Selected date'
              : 'ఎంచుకున్న తేదీ'}
          </p>

          <p className="text-xs font-extrabold text-[#FFD700]">
            {selectedDateLabel}
          </p>
        </div>

        {selectedDayEvents.length > 0 && (
          <span className="px-2 py-1 rounded-full bg-[#FF5722] text-white text-[9px] font-black">
            {selectedDayEvents.length}
          </span>
        )}
      </div>
    </div>
  );
}

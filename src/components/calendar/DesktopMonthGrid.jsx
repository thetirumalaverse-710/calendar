import React from 'react';
import { TEMPLES } from '../../data/templeEvents';
import {
  getDateString,
  getEventsForDate,
  getTodayIST
} from '../../utils/calendarMonthUtils';

export default function DesktopMonthGrid({
  monthObj,
  events,
  lang,
  onSelectEvent
}) {
  const { year, month } = monthObj;

  const daysOfWeekEn = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
  ];

  const daysOfWeekTe = [
    'ఆది',
    'సోమ',
    'మంగళ',
    'బుధ',
    'గురు',
    'శుక్ర',
    'శని'
  ];

  const firstDayIndex =
    new Date(year, month, 1).getDay();

  const totalDays =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const getEventsForDay = dayNum => {
    const dateStr = getDateString(
      year,
      month,
      dayNum
    );

    return getEventsForDate(events, dateStr);
  };

  const gridCells = [];

  for (
    let i = 0;
    i < firstDayIndex;
    i++
  ) {
    gridCells.push(
      <div
        key={`empty-${i}`}
        className="min-h-[120px] bg-[#141923]/40 border border-white/5 rounded-xl"
      />
    );
  }

  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {
    const dateStr = getDateString(
      year,
      month,
      day
    );

    const dayEvents =
      getEventsForDay(day);

    const isToday =
      dateStr === getTodayIST();

    const eventWithImage =
      dayEvents.find(
        e =>
          (Array.isArray(e.images) &&
            e.images.length > 0 &&
            e.images[0]?.url) ||
          e.imageUrl
      );

    const dayImageUrl =
      eventWithImage
        ? eventWithImage.images?.[0]
            ?.url ||
          eventWithImage.imageUrl
        : null;

    const totalPhotos =
      dayEvents.reduce(
        (total, event) =>
          total +
          (Array.isArray(event.images) &&
          event.images.length > 0
            ? event.images.length
            : event.imageUrl
              ? 1
              : 0),
        0
      );

    gridCells.push(
      <div
        key={`day-${day}`}
        className={`min-h-[130px] p-2 rounded-xl border transition-all flex flex-col justify-between shadow-md relative overflow-hidden ${
          isToday
            ? 'bg-amber-100 border-[#FF5722] ring-2 ring-[#FF5722]'
            : dayEvents.length > 0
              ? 'bg-white border-2 border-[#D4AF37] hover:border-[#FFD700] hover:shadow-lg hover:scale-[1.02]'
              : 'bg-white border border-slate-200 hover:border-[#D4AF37]'
        }`}
      >

        <div className="flex items-center justify-between z-10">
          <span
            className={`text-base font-extrabold ${
              isToday
                ? 'text-[#FF5722]'
                : 'text-slate-900'
            }`}
          >
            {day}
          </span>

          {dayEvents.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#FF5722] text-white text-[10px] font-black flex items-center justify-center shadow">
              {dayEvents.length}
            </span>
          )}
        </div>

        {dayImageUrl && (
          <div
            onClick={e => {
              e.stopPropagation();
              onSelectEvent(
                eventWithImage
              );
            }}
            className="my-1 w-full h-16 rounded-md overflow-hidden relative group cursor-pointer border border-black/10 shadow-sm shrink-0"
          >
            <img
              src={dayImageUrl}
              alt="Festival Event"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={e => {
                e.currentTarget.parentElement.style.display =
                  'none';
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

            {totalPhotos > 1 && (
              <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[#FFD700] text-[9px] font-extrabold shadow">
                📷 {totalPhotos}
              </span>
            )}
          </div>
        )}

        <div className="space-y-1 mt-1 overflow-y-auto max-h-[75px] no-scrollbar z-10">
          {dayEvents.map(evt => {
            const temple =
              TEMPLES.find(
                t =>
                  t.id === evt.templeId
              );

            return (
              <button
                key={evt.id}
                type="button"
                onClick={() =>
                  onSelectEvent(evt)
                }
                className="w-full p-1.5 rounded text-[10px] font-extrabold text-black cursor-pointer hover:scale-105 transition-transform truncate shadow-sm flex items-center justify-between border border-black/10 text-left"
                style={{
                  backgroundColor:
                    temple?.color ||
                    '#FFD700'
                }}
                title={`${evt.title} (${temple?.name || ''})`}
              >
                <span className="truncate">
                  {lang === 'en'
                    ? evt.title
                    : evt.titleTe ||
                      evt.title}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-3">

      <div className="grid grid-cols-7 gap-2 text-center font-extrabold text-xs text-[#FFD700] py-2 bg-[#141923] rounded-xl border border-[#D4AF37]/30">
        {(lang === 'en'
          ? daysOfWeekEn
          : daysOfWeekTe
        ).map((dayName, index) => (
          <div
            key={index}
            className={
              index === 0
                ? 'text-[#FF5722]'
                : ''
            }
          >
            {dayName}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {gridCells}
      </div>
    </div>
  );
}

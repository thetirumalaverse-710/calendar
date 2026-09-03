import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { MONTHS_LIST } from '../../utils/calendarMonthUtils';

export default function CalendarMonthHeader({
  lang,
  activeMonth,
  activeMonthIndex,
  onMonthChange,
  onPrevMonth,
  onNextMonth,
  onGoToToday
}) {
  return (
    <div className="glass-card p-3 sm:p-4 border-2 border-[#D4AF37]/50 flex flex-wrap items-center justify-between gap-3 bg-[#0B0E14] shadow-2xl">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FF5722] p-0.5 flex items-center justify-center text-black font-extrabold shadow-md shrink-0">
          <CalendarIcon className="w-5 h-5" />
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-3xl font-extrabold gold-gradient-text">
            {lang === 'en'
              ? activeMonth.label
              : activeMonth.labelTe}
          </h2>

          <p className="hidden sm:block text-[10px] sm:text-[11px] text-[#94A3B8]">
            {lang === 'en'
              ? 'Swipe or drag left/right or use arrow keys'
              : 'ఎడమ లేదా కుడి వైపుకు స్వైప్ చేయండి'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">

        <label
          htmlFor="calendar-month-select"
          className="sr-only"
        >
          Select month
        </label>

        <select
          id="calendar-month-select"
          value={activeMonthIndex}
          onChange={onMonthChange}
          className="flex-1 sm:flex-initial min-w-[130px] px-2.5 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/60 text-[#FFD700] text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
        >
          {MONTHS_LIST.map((item, index) => (
            <option
              key={index}
              value={index}
            >
              {lang === 'en'
                ? item.label
                : item.labelTe}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 shrink-0">

          <button
            type="button"
            onClick={onGoToToday}
            className="min-w-[44px] min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all shadow-md bg-[#141923] text-[#FFD700] border-2 border-[#D4AF37] hover:bg-[#D4AF37]/20 active:scale-95 cursor-pointer"
            title={lang === 'en' ? "Jump to Today's Date" : 'ఈ రోజు తేదీకి వెళ్లండి'}
          >
            <span>{lang === 'en' ? 'Today' : 'ఈ రోజు'}</span>
          </button>

          <button
            type="button"
            onClick={onPrevMonth}
            disabled={activeMonthIndex === 0}
            aria-label={lang === 'en' ? 'Previous month' : 'గత నెల'}
            className={`min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all shadow-md ${
              activeMonthIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-[#141923] text-[#94A3B8] border border-white/10'
                : 'bg-[#141923] text-[#FFD700] border-2 border-[#D4AF37] hover:bg-[#D4AF37]/20 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />

            <span className="hidden sm:inline">
              {lang === 'en' ? 'Prev' : 'గత'}
            </span>
          </button>

          <button
            type="button"
            onClick={onNextMonth}
            disabled={
              activeMonthIndex ===
              MONTHS_LIST.length - 1
            }
            aria-label={lang === 'en' ? 'Next month' : 'తరువాతి నెల'}
            className={`min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all shadow-md ${
              activeMonthIndex ===
              MONTHS_LIST.length - 1
                ? 'opacity-40 cursor-not-allowed bg-[#141923] text-[#94A3B8] border border-white/10'
                : 'bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black hover:brightness-110 active:scale-95'
            }`}
          >
            <span className="hidden sm:inline">
              {lang === 'en' ? 'Next' : 'తరువాతి'}
            </span>

            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}

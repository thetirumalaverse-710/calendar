import { getIndiaDateString } from './indiaTime.js';

export const MONTHS_LIST = [
  { year: 2026, month: 0, label: 'January 2026', labelTe: 'జనవరి 2026' },
  { year: 2026, month: 1, label: 'February 2026', labelTe: 'ఫిబ్రవరి 2026' },
  { year: 2026, month: 2, label: 'March 2026', labelTe: 'మార్చి 2026' },
  { year: 2026, month: 3, label: 'April 2026', labelTe: 'ఏప్రిల్ 2026' },
  { year: 2026, month: 4, label: 'May 2026', labelTe: 'మే 2026' },
  { year: 2026, month: 5, label: 'June 2026', labelTe: 'జూన్ 2026' },
  { year: 2026, month: 6, label: 'July 2026', labelTe: 'జూలై 2026' },
  { year: 2026, month: 7, label: 'August 2026', labelTe: 'ఆగస్టు 2026' },
  { year: 2026, month: 8, label: 'September 2026', labelTe: 'సెప్టెంబర్ 2026' },
  { year: 2026, month: 9, label: 'October 2026', labelTe: 'అక్టోబర్ 2026' },
  { year: 2026, month: 10, label: 'November 2026', labelTe: 'నవంబర్ 2026' },
  { year: 2026, month: 11, label: 'December 2026', labelTe: 'డిసెంబర్ 2026' },
  { year: 2027, month: 0, label: 'January 2027', labelTe: 'జనవరి 2027' },
  { year: 2027, month: 1, label: 'February 2027', labelTe: 'ఫిబ్రవరి 2027' },
  { year: 2027, month: 2, label: 'March 2027', labelTe: 'మార్చి 2027' },
  { year: 2027, month: 3, label: 'April 2027', labelTe: 'ఏప్రిల్ 2027' }
];

export const getTodayIST = () => getIndiaDateString();

export const getDateString = (year, month, day) => {
  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

export const getMonthPrefix = (year, month) =>
  `${year}-${String(month + 1).padStart(2, '0')}`;

export const getInitialMonthIndex = () => {
  const today = getTodayIST();
  const year = Number(today.slice(0, 4));
  const month = Number(today.slice(5, 7)) - 1;

  const index = MONTHS_LIST.findIndex(
    item => item.year === year && item.month === month
  );

  return index !== -1 ? index : 6;
};

export const getEventsForDate = (events, dateStr) => {
  if (!dateStr || !Array.isArray(events)) return [];
  return events.filter(evt => {
    if (!evt?.startDate) return false;
    const end = evt.endDate || evt.startDate;
    return evt.startDate <= dateStr && dateStr <= end;
  });
};

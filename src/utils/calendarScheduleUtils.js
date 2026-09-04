export const monthsEn = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const monthsTe = [
  'జనవరి',
  'ఫిబ్రవరి',
  'మార్చి',
  'ఏప్రిల్',
  'మే',
  'జూన్',
  'జూలై',
  'ఆగస్టు',
  'సెప్టెంబరు',
  'అక్టోబరు',
  'నవంబరు',
  'డిసెంబరు'
];

import { getIndiaDateString } from './indiaTime.js';

export function getTodayStr() {
  return getIndiaDateString();
}

export function getCurrentMonthKey(todayStr, lang) {
  try {
    const [year, month] = todayStr
      .split('-')
      .map(Number);

    const monthName =
      lang === 'en'
        ? monthsEn[month - 1]
        : monthsTe[month - 1];

    return `${monthName} ${year}`;
  } catch {
    return 'August 2026';
  }
}

export function formatScheduleDate(dateStr, lang) {
  try {
    const [y, m, d] = dateStr
      .split('-')
      .map(Number);

    const dateObj = new Date(
      y,
      m - 1,
      d
    );

    const daysEn = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ];

    const daysTe = [
      'ఆది',
      'సోమ',
      'మంగళ',
      'బుధ',
      'గురు',
      'శుక్ర',
      'శని'
    ];

    const monthsShortEn = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const monthsShortTe = [
      'జన',
      'ఫిబ్ర',
      'మార్చి',
      'ఏప్రి',
      'మే',
      'జూన్',
      'జూలై',
      'ఆగ',
      'సెప్టెం',
      'అక్టో',
      'నవం',
      'డిసెం'
    ];

    const dayOfWeek =
      lang === 'en'
        ? daysEn[dateObj.getDay()]
        : daysTe[dateObj.getDay()];

    const dayNum = dateObj.getDate();

    const monthShort =
      lang === 'en'
        ? monthsShortEn[dateObj.getMonth()]
        : monthsShortTe[dateObj.getMonth()];

    const monthFull =
      dateObj.toLocaleString(
        lang === 'en'
          ? 'en-US'
          : 'te-IN',
        {
          month: 'long',
          year: 'numeric'
        }
      );

    return {
      dayOfWeek,
      dayNum,
      monthShort,
      monthFull,
      year: y,
      monthIndex: m - 1,
      dateObj
    };
  } catch {
    return {
      dayOfWeek: '',
      dayNum: dateStr,
      monthShort: '',
      monthFull: '',
      year: 2026,
      monthIndex: 0,
      dateObj: new Date()
    };
  }
}

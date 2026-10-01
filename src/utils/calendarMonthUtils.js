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

const BRAHMOTSAVAM_VAHANAS = {
  1: { en: "Pedda Sesha Vahanam", te: "పెద్ద శేష వాహనం" },
  2: { en: "Chinna Sesha & Hamsa Vahanam", te: "చిన్న శేష & హంస వాహనం" },
  3: { en: "Simha & Muthyapu Pandiri Vahanam", te: "సింహ & ముత్యపు పందిరి వాహనం" },
  4: { en: "Kalpa Vriksha & Sarva Bhoopala Vahanam", te: "కల్ప వృక్ష & సర్వ భూపాల వాహనం" },
  5: { en: "Mohini Avataram & Garuda Vahanam", te: "మోహినీ అవతారం & గరుడ వాహనం" },
  6: { en: "Hanumantha & Gaja Vahanam", te: "హనుమంత & గజ వాహనం" },
  7: { en: "Surya Prabha & Chandra Prabha Vahanam", te: "సూర్య ప్రభ & చంద్ర ప్రభ వాహనం" },
  8: { en: "Rathotsavam & Aswa Vahanam", te: "రథోత్సవం & అశ్వ వాహనం" },
  9: { en: "Chakra Snanam", te: "చక్ర స్నానం" }
};

export const getEventsForDate = (events, dateStr) => {
  if (!dateStr || !Array.isArray(events)) return [];
  
  const filtered = events.filter(evt => {
    if (!evt?.startDate) return false;
    const end = evt.endDate || evt.startDate;
    return evt.startDate <= dateStr && dateStr <= end;
  });

  const uniqueMap = new Map();
  
  filtered.forEach(evt => {
    const key = `${evt.title}_${evt.startDate}`;
    
    if (!uniqueMap.has(key)) {
      const clonedEvt = { ...evt };
      const end = evt.endDate || evt.startDate;
      
      if (evt.startDate !== end) {
        const parseDateStr = (ds) => {
            const [y, m, d] = ds.split('-');
            return Date.UTC(y, m - 1, d);
        };
        const startUTC = parseDateStr(evt.startDate);
        const currentUTC = parseDateStr(dateStr);
        const dayDiff = Math.floor((currentUTC - startUTC) / (1000 * 60 * 60 * 24)) + 1;
        
        if (dayDiff > 0) {
            let vahanamEn = "";
            let vahanamTe = "";
            
            if (evt.title.toLowerCase().includes('brahmotsavam')) {
                // Remove the default summary vahanam string so it doesn't repeat every day
                clonedEvt.vahanam = undefined;

                if (BRAHMOTSAVAM_VAHANAS[dayDiff]) {
                    vahanamEn = ` - ${BRAHMOTSAVAM_VAHANAS[dayDiff].en}`;
                    vahanamTe = ` - ${BRAHMOTSAVAM_VAHANAS[dayDiff].te}`;
                }
            }

            clonedEvt.title = `${evt.title} (Day ${dayDiff})${vahanamEn}`;
            if (evt.titleTe) {
                clonedEvt.titleTe = `${evt.titleTe} (${dayDiff}వ రోజు)${vahanamTe}`;
            } else {
                clonedEvt.titleTe = `${evt.title} (Day ${dayDiff})${vahanamTe}`;
            }
        }
      }
      
      uniqueMap.set(key, clonedEvt);
    }
  });
  
  return Array.from(uniqueMap.values());
};

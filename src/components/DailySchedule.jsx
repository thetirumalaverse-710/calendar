import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Utensils, Sparkles, Calendar, Ticket, Layers, Info } from 'lucide-react';

// Exact day-by-day weekly sevas extracted from TTD Official Schedule Images
export const WEEKLY_MAIN_TEMPLE_SEVAS = [
  {
    day: 'Monday',
    dayTe: 'సోమవారం',
    specialSeva: 'Special Seva: Vishesha Puja (05:30 to 07:00 hrs) (Weekly Seva)',
    color: '#FF5722',
    schedule: [
      { time: '03:00 - 03:30 hrs', seva: 'Suprabhatam', desc: 'Awakening ritual with sacred hymns' },
      { time: '03:30 - 04:00 hrs', seva: 'Thomala Seva (Ekantam)', desc: 'Garland decoration ritual' },
      { time: '04:00 - 04:15 hrs', seva: 'Koluvu and Panchanga Sravanam (Ekantam)', desc: 'Royal court & daily almanac reading' },
      { time: '04:15 - 05:00 hrs', seva: 'First Archana i.e., Sahasranama Archana (Ekantam)', desc: '1000 Holy Names recitation' },
      { time: '08:00 - 09:00 hrs', seva: 'Visesha Puja (Weekly Seva)', desc: 'Special Monday Visesha Homam & Puja' },
      { time: '07:00 - 19:00 hrs', seva: 'Sarva Darshanam', desc: 'General pilgrim darshan' },
      { time: '12:00 - 17:00 hrs', seva: 'Kalyanotsavam, Brahmotsavam, Vasanthostavam, Unjal Seva', desc: 'Arjitha Sevas in Sampangi Prakaram' },
      { time: '17:30 - 18:30 hrs', seva: 'Sahasra Deepalankarana Seva', desc: '1000 Ghee Lamp Swing Ritual' },
      { time: '19:00 - 20:00 hrs', seva: 'Suddhi, Night Kainkaryams (Ekantam) and Night Bell', desc: 'Night cleansing & offerings' },
      { time: '20:00 - 01:00 hrs', seva: 'Night Darshanam', desc: 'Late evening general darshan' },
      { time: '01:00 - 01:30 hrs', seva: 'Suddi and preparations for Ekanta Seva', desc: 'Final repose preparations' },
      { time: '01:30 hrs', seva: 'Ekanta Seva', desc: 'Lullaby and night slumber' }
    ]
  },
  {
    day: 'Tuesday',
    dayTe: 'మంగళవారం',
    specialSeva: 'Special Seva: Ashtadala Pada Padmaradhana (06:00 - 07:00 hrs) (Weekly Seva)',
    color: '#FFB703',
    schedule: [
      { time: '03:00 - 03:30 hrs', seva: 'Suprabhatam', desc: 'Awakening ritual' },
      { time: '03:30 - 04:00 hrs', seva: 'Thomala Seva', desc: 'Garland decoration' },
      { time: '04:00 - 04:15 hrs', seva: 'Koluvu and Panchanga Sravanam (Ekantam)', desc: 'Daily court & almanac' },
      { time: '04:15 - 05:00 hrs', seva: 'First Archana i.e., Sahasranama Archana', desc: '1000 names chanting' },
      { time: '06:00 - 07:00 hrs', seva: 'Suddi Ashtadala Pada Padmaradhana Second Bell (Weekly Seva)', desc: '108 Gold Lotus Flowers worship' },
      { time: '07:00 - 19:00 hrs', seva: 'Darshanam', desc: 'General darshan hours' },
      { time: '12:00 - 17:00 hrs', seva: 'Kalyanostavam, Brahmostavam, Vasanthostavam, Unjal Seva', desc: 'Daytime Arjitha Sevas' },
      { time: '17:30 - 18:30 hrs', seva: 'Sahasra Deepalankarana Seva', desc: '1000 lamps swing seva' },
      { time: '19:00 - 20:00 hrs', seva: 'Suddhi, Night Kainkaryams (Ekantam) and Night Bell', desc: 'Cleansing & night bell' },
      { time: '20:00 - 01:00 hrs', seva: 'Darshanam', desc: 'Night darshan' },
      { time: '01:00 - 01:30 hrs', seva: 'Suddi and preparations for Ekanta Seva', desc: 'Repose setup' },
      { time: '01:30 hrs', seva: 'Ekanta Seva', desc: 'Final night repose' }
    ]
  },
  {
    day: 'Wednesday',
    dayTe: 'బుధవారం',
    specialSeva: 'Special Seva: Sahasrakalasa Abhishekam (06:00 - 08:00 hrs) (Weekly Seva)',
    color: '#3A86EF',
    schedule: [
      { time: '03:00 - 03:30 hrs', seva: 'Suprabhatam', desc: 'Morning invocation' },
      { time: '03:30 - 04:00 hrs', seva: 'Thomala Seva', desc: 'Garland decoration' },
      { time: '04:00 - 04:15 hrs', seva: 'Koluvu and Panchanga Sravanam inside Bangaru Vakili (Ekantam)', desc: 'Sanctum court' },
      { time: '04:15 - 05:00 hrs', seva: 'First Archana i.e., Sahasranama Archana (Ekantam)', desc: 'Archana chanting' },
      { time: '06:00 - 08:00 hrs', seva: 'SahasraKalasa Abhishekam Second Archana (Ekantam) and Bell (Weekly Seva)', desc: '1008 Silver Vessel Holy Water Bath' },
      { time: '09:30 - 19:00 hrs', seva: 'Darshanam', desc: 'Daytime pilgrim darshan' },
      { time: '12:00 - 17:00 hrs', seva: 'Kalyanostavam, Brahmostavam, Vasanthostavam, Unjal Seva', desc: 'Daily Arjitha Sevas' },
      { time: '17:30 - 18:30 hrs', seva: 'Sahasra Deepalankarana Seva', desc: '1000 ghee lamps seva' },
      { time: '19:00 - 20:00 hrs', seva: 'Suddhi, Night Kainkaryams (Ekantam) and Night Bell', desc: 'Night kainkaryam' },
      { time: '20:00 - 01:00 hrs', seva: 'Darshanam', desc: 'Night darshan' },
      { time: '01:00 - 01:30 hrs', seva: 'Suddi and preparations for Ekanta Seva', desc: 'Bedtime preparations' },
      { time: '01:30 hrs', seva: 'Ekanta Seva', desc: 'Final night slumber' }
    ]
  },
  {
    day: 'Thursday',
    dayTe: 'గురువారం',
    specialSeva: 'Special Seva: Tiruppavada (06:00 - 08:00 hrs) & Poolangi Alankaram (21:00 - 22:00 hrs) (Weekly Seva)',
    color: '#800020',
    schedule: [
      { time: '03:00 - 03:30 hrs', seva: 'Suprabhatam', desc: 'Morning awakening' },
      { time: '03:30 - 04:00 hrs', seva: 'Thomala Seva', desc: 'Flower decoration' },
      { time: '04:00 - 04:15 hrs', seva: 'Koluvu and Panchanga Sravanam inside Bangaru Vakili (Ekantam)', desc: 'Court & almanac' },
      { time: '04:15 - 05:00 hrs', seva: 'First Archana i.e., Sahasranama Archana', desc: '1000 names archana' },
      { time: '06:00 - 07:00 hrs', seva: 'Sallimpu, Second Archana (Ekantam), Tiruppavada, Second Bell (Weekly Seva)', desc: 'Pulihora mound offering' },
      { time: '08:00 - 19:00 hrs', seva: 'Darshanam', desc: 'Daytime pilgrim darshan' },
      { time: '12:00 - 17:00 hrs', seva: 'Kalyanostavam, Brahmostavam, Vasanthostavam, Unjal Seva', desc: 'Arjitha Sevas' },
      { time: '17:30 - 18:30 hrs', seva: 'Sahasra Deepalankarana Seva', desc: 'Lamp swing ritual' },
      { time: '19:00 - 21:00 hrs', seva: 'Pedda Suddhi, Night Kainkaryams, Poolangi Alankaram and Night Bell', desc: 'Full Flower Armour Adornment' },
      { time: '21:00 - 01:00 hrs', seva: 'Poolangi Alankaram and Darshanam (Weekly Seva)', desc: 'Darshan of Lord adorned in Jasmine Garlands' },
      { time: '01:00 - 01:30 hrs', seva: 'Suddi and preparations for Ekanta Seva', desc: 'Late night setup' },
      { time: '01:30 hrs', seva: 'Ekanta Seva', desc: 'Final night slumber' }
    ]
  },
  {
    day: 'Friday',
    dayTe: 'శుక్రవారం',
    specialSeva: 'Special Seva: Abhishekam & Nijapada Darsanam (04:30 - 06:00 hrs) (Weekly Seva)',
    color: '#D4AF37',
    schedule: [
      { time: '03:00 - 03:30 hrs', seva: 'Suprabhatam', desc: 'Morning awakening' },
      { time: '03:00 - 04:00 hrs', seva: 'Sallimpu, Suddi, Nityakatla Kainkaryams, Morning I Bell and preparation for Abhishekam', desc: 'Sanctum preparation' },
      { time: '04:30 - 06:00 hrs', seva: 'Abhishekam and Nijapada Darsanam (Weekly Seva)', desc: 'Holy Fragrant Water Bath & Feet Darshan' },
      { time: '06:00 - 07:00 hrs', seva: 'Samarpana', desc: 'Offering of fresh Vastrams' },
      { time: '07:00 - 08:00 hrs', seva: 'Thomala Seva and Archana (Ekantam)', desc: 'Garland adornment & Archana' },
      { time: '09:00 - 20:00 hrs', seva: 'Darshanam', desc: 'Daytime pilgrim darshan' },
      { time: '12:00 - 17:00 hrs', seva: 'Kalyanostavam, Brahmostavam, Vasanthostavam, Unjal Seva', desc: 'Arjitha Sevas' },
      { time: '18:00 - 20:00 hrs', seva: 'Sahasra Deepalankarana Seva at Kolimi Mandapam and Procession along Mada streets', desc: 'Street Procession' },
      { time: '20:00 - 21:00 hrs', seva: 'Suddhi, Night Kainkaryams (Ekantam) and Night Bell', desc: 'Night cleansing' },
      { time: '21:00 - 01:00 hrs', seva: 'Darshanam', desc: 'Night general darshan' },
      { time: '01:00 - 01:30 hrs', seva: 'Suddi and preparations for Ekanta Seva', desc: 'Bedtime preparations' },
      { time: '01:30 hrs', seva: 'Ekanta Seva', desc: 'Final night slumber' }
    ]
  },
  {
    day: 'Saturdays & Sundays',
    dayTe: 'శని & ఆదివారాలు',
    specialSeva: 'Weekend High Pilgrim Demand Hours (Darshanam may continue beyond 01:00 hrs)',
    color: '#9C27B0',
    schedule: [
      { time: '03:00 - 03:30 hrs', seva: 'Suprabhatam', desc: 'Morning awakening' },
      { time: '03:30 - 04:00 hrs', seva: 'ThomalaSeva (Ekantam)', desc: 'Garland decoration (Ekantam)' },
      { time: '04:00 - 04:15 hrs', seva: 'Koluvu and Panchanga Sravanam (Ekantam)', desc: 'Court & almanac' },
      { time: '04:00 - 04:30 hrs', seva: 'First Archana, Sahasranama Archana (Ekantam)', desc: '1000 names archana' },
      { time: '06:30 - 07:00 hrs', seva: 'FirstBell, Bali and Sattumura', desc: 'Morning bell & offering' },
      { time: '07:00 - 07:30 hrs', seva: 'Suddhi Second Archana (Ekantam), SecondBell, etc.', desc: 'Second Archana' },
      { time: '07:30 - 19:00 hrs', seva: 'Darshanam', desc: 'Continuous weekend darshan' },
      { time: '12:00 - 17:00 hrs', seva: 'Kalyanostavam, Brahmostavam, Vasanthostavam, Unjal Seva', desc: 'Arjitha Sevas' },
      { time: '17:30 - 18:30 hrs', seva: 'Sahasra Deepalankarana Seva', desc: '1000 ghee lamps seva' },
      { time: '19:00 - 20:00 hrs', seva: 'Suddhi, Night Kainkaryams (Ekantam) and Night Bell', desc: 'Cleansing & night bell' },
      { time: '20:00 - 01:00 hrs', seva: 'Darshanam', desc: 'Late night weekend darshan' },
      { time: '01:00 - 01:30 hrs', seva: 'Suddi and preparations for Ekanta Seva', desc: 'Repose setup' },
      { time: '01:30 hrs', seva: 'Ekanta Seva', desc: 'Night repose' }
    ]
  }
];

// WEEKLY SEVAS PERFORMED AT SRIVARI TEMPLE (Clean Table: Day, Seva Name, Seva Time)
export const OFFICIAL_WEEKLY_SEVAS_TABLE = [
  {
    day: 'Monday',
    sevaName: 'Visesha Pooja',
    isWeeklySeva: true,
    sevaTime: '07:30 a.m.'
  },
  {
    day: 'Tuesday',
    sevaName: 'Ashtadala Pada Padmaradhana',
    isWeeklySeva: true,
    sevaTime: '06:00 a.m.'
  },
  {
    day: 'Wednesday',
    sevaName: 'Sahasra Kalasabhishekam',
    isWeeklySeva: true,
    sevaTime: '06:00 a.m.'
  },
  {
    day: 'Thursday',
    sevaName: 'Tiruppavada Seva',
    isWeeklySeva: true,
    sevaTime: '06:15 a.m.'
  },
  {
    day: 'Friday',
    sevaName: 'Abhishekam',
    isWeeklySeva: true,
    sevaTime: '03:30 a.m.'
  },
  {
    day: 'Friday',
    sevaName: 'Civet Vessel',
    isWeeklySeva: true,
    sevaTime: '03:30 a.m.'
  },
  {
    day: 'Friday',
    sevaName: 'Musk Vessel',
    isWeeklySeva: true,
    sevaTime: '03:30 a.m.'
  },
  {
    day: 'Friday',
    sevaName: 'Nijapada Darsanam',
    isWeeklySeva: true,
    sevaTime: '05:30 a.m.'
  },
  {
    day: 'Friday',
    sevaName: 'Vastralankara Seva',
    isWeeklySeva: true,
    sevaTime: '03:30 a.m.'
  }
];

// PERIODICAL SEVAS PERFORMED AT SRIVARI TEMPLE
export const PERIODICAL_SEVAS_LIST = [
  { name: 'Teppotsavam or float festival', frequency: '5 days a Year (March)', category: 'Annual Periodical Seva' },
  { name: 'Vasanthotsavam', frequency: '3 days a year (March or April)', category: 'Annual Periodical Seva' },
  { name: 'Padmavathi Parinayam', frequency: '3 days a year (May)', category: 'Annual Periodical Seva' },
  { name: 'Abhideyaka Abhishekam', frequency: '3 days a year (June-Annual)', category: 'Annual Periodical Seva' },
  { name: 'Pushpa Pallaki', frequency: '(July)', category: 'Annual Periodical Seva' },
  { name: 'Pushpa Yagam', frequency: '(November)', category: 'Annual Periodical Seva' },
  { name: 'Koil Alwar Thirumanjanam', frequency: '(4 times in a year)', category: 'Quarterly Periodical Seva' },
  { name: 'Pavithrotsavams', frequency: '3 days a year (August)', category: 'Annual Periodical Seva' }
];

// TTD OFFICIAL SPECIAL PROGRAMME + ANNUAL BRAHMOTSAVAM 2026
// Special schedule: 14 September 2026 to 23 September 2026
export const BRAHMOTSAVAM_2026_SCHEDULE = [
  {
    date: '2026-09-14',
    title: 'Ankurarpanam',
    dayLabel: '14-09-2026 • MONDAY',
    subtitle: 'Special Programme in connection with Annual Brahmotsavam',
    highlights: [
      { time: '03:00 AM – 03:30 AM', event: 'Suprabhatham' },
      { time: '03:30 AM – 06:00 AM', event: 'Suddhi, Thomala Seva (Ekantham), Koluvu, Panchanga Sravanam, Ekanta Thirumanjanam to Sri Malayappa Swamyvaru, all Utsava Deities and related rituals' },
      { time: '06:00 AM – 10:00 AM', event: 'Sarvadarshanam' },
      { time: '10:00 AM – 10:30 AM', event: 'Suddhi, II Archana (Ekantham) and II Bell' },
      { time: '10:30 AM – 05:00 PM', event: 'Sarvadarshanam' },
      { time: '12:00 PM – 04:00 PM', event: 'Kalyanotsavam, Unjal Seva and Arjitha Brahmotsavam (No Sahasra Deepalankara Seva)' },
      { time: '05:00 PM – 07:00 PM', event: 'Visesha Samarpana to Sri Senadhipathi Varu, Suddhi, Night Kainkaryams, Night Bell and Tiruveesam Bell' },
      { time: '07:00 PM – 12:30 AM', event: 'Sarvadarshanam' },
      { time: '07:00 PM – 08:00 PM', event: 'Procession of Sri Senadhipathivaru around four Mada Streets in connection with Ankurarpanam' },
      { time: '08:00 PM – 09:00 PM', event: 'Asthanam at Ranganayakula Mandapam' },
      { time: '12:30 AM – 01:00 AM', event: 'Suddhi and Preparation for Ekanta Seva' },
      { time: '01:00 AM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-15',
    title: 'First Day of Brahmotsavam',
    dayLabel: '15-09-2026 • TUESDAY',
    highlights: [
      { time: '03:30 PM – 05:30 PM', event: 'Procession of Utsava Deities in Gold Tiruchi' },
      { time: '06:21 PM – 06:35 PM', event: 'Dwajarohanam Sumuhurtham (Meena Lagnam)' },
      { time: '09:00 PM – 11:00 PM', event: 'Pedda Sesha Vahanam' },
    ],
    schedule: [
      { time: '03:00 AM – 03:30 AM', event: 'Suprabhatham' },
      { time: '03:30 AM – 10:00 AM', event: 'Viswaroopa Sarvadarshanam / Suddhi, Thomala Seva (Ekantham), Koluvu, Panchanga Sravanam, Ekanta Thirumanjanam and related rituals' },
      { time: '10:00 AM – 11:30 AM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru and Utsava Deities' },
      { time: '11:30 AM – 05:30 PM', event: 'Sarvadarshanam (No Theertham and No Satari)' },
      { time: '11:30 AM – 01:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru and Ubhayanancharulu at Bangaru Vakili' },
      { time: '12:30 PM – 03:30 PM', event: 'Religious Functions and Yagasala activities in connection with Dwajarohanam, Dattam' },
      { time: '03:30 PM – 05:30 PM', event: 'Procession of Sri Malayappa Swamyvaru with Ubhayanancharulu in Gold Tiruchi and Parivara Deities' },
      { time: '05:30 PM – 07:00 PM', event: 'Dwajarohanam, Sumuhurtham 6:21 PM to 6:35 PM (Meena Lagnam) and Asthanam at Tirumala Mada Streets' },
      { time: '07:00 PM – 08:00 PM', event: 'Visesha Samarpana to Utsava Deities at Ranganayakula Mandapam' },
      { time: '08:00 PM – 09:00 PM', event: 'Suddhi, II Archana (Ekantham), II Bell, Bahumanam to Archakas, Suddhi, Night Kainkaryams and Night Bell' },
      { time: '08:00 PM – 09:00 PM', event: 'Procession of Utsava Deities to Vahana Mandapam and Samarpana on Pedda Sesha Vahanam' },
      { time: '09:00 PM – 12:30 AM', event: 'Sarvadarshanam' },
      { time: '09:00 PM – 11:00 PM', event: 'Pedda Sesha Vahanam' },
      { time: '11:00 PM – 12:00 AM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '12:30 AM – 01:00 AM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '01:00 AM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-16',
    title: 'Second Day of Brahmotsavam',
    dayLabel: '16-09-2026 • WEDNESDAY',
    highlights: [
      { time: '08:00 AM – 10:00 AM', event: 'Chinna Sesha Vahanam' },
      { time: '01:00 PM – 03:00 PM', event: 'Snapana Thirumanjanam – I Day' },
      { time: '07:00 PM – 09:00 PM', event: 'Hamsa Vahanam' },
    ],
    schedule: [
      { time: '03:00 AM – 03:30 AM', event: 'Suprabhatham' },
      { time: '03:30 AM – 06:00 AM', event: 'Suddhi, Thomala Seva (Ekantham), Koluvu, Panchanga Sravanam, Ekanta Thirumanjanam to Utsava Deities' },
      { time: '06:00 AM – 04:00 PM', event: 'Sarvadarshanam' },
      { time: '06:00 AM – 07:00 AM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '07:00 AM – 08:00 AM', event: 'Procession of Sri Malayappa Swamyvaru alone to Vahana Mandapam and Samarpana on Chinna Sesha Vahanam' },
      { time: '08:00 AM – 10:00 AM', event: 'Chinna Sesha Vahanam' },
      { time: '10:00 AM – 11:00 AM', event: 'Return to Temple, Asthanam at Ranganayakula Mandapam and Sallimpu of Special Jewels' },
      { time: '11:00 AM – 01:00 PM', event: 'Preparation for Snapana Thirumanjanam' },
      { time: '01:00 PM – 03:00 PM', event: 'Snapana Thirumanjanam – I Day' },
      { time: '03:00 PM – 06:00 PM', event: 'Suddhi, II Archana (Ekantham), II Bell, Night Kainkaryams and Night Bell' },
      { time: '04:00 PM – 06:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '06:00 PM – 12:30 AM', event: 'Sarvadarshanam' },
      { time: '06:00 PM – 07:00 PM', event: 'Procession of Sri Malayappa Swamyvaru alone to Vahana Mandapam and Samarpana on Hamsa Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Hamsa Vahanam' },
      { time: '09:00 PM – 10:00 PM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '12:30 AM – 01:00 AM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '01:00 AM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-17',
    title: 'Third Day of Brahmotsavam',
    dayLabel: '17-09-2026 • THURSDAY',
    highlights: [
      { time: '08:00 AM – 10:00 AM', event: 'Simha Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Muthyapu Pandiri Vahanam' },
    ],
    schedule: [
      { time: '03:00 AM – 03:30 AM', event: 'Suprabhatham' },
      { time: '03:30 AM – 06:00 AM', event: 'Suddhi, Thomala Seva (Ekantham), Koluvu, Panchanga Sravanam, Ekanta Thirumanjanam to Utsava Deities' },
      { time: '06:00 AM – 04:00 PM', event: 'Sarvadarshanam' },
      { time: '06:00 AM – 07:00 AM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '07:00 AM – 08:00 AM', event: 'Procession of Sri Malayappa Swamyvaru to Vahana Mandapam and Samarpana on Simha Vahanam' },
      { time: '08:00 AM – 10:00 AM', event: 'Simha Vahanam' },
      { time: '10:00 AM – 11:00 AM', event: 'Return to Temple, Asthanam at Ranganayakula Mandapam and Sallimpu of Special Jewels' },
      { time: '04:00 PM – 06:00 PM', event: 'Sallimpu, Suddhi, II Archana (Ekantham), II Bell, Pedda Suddhi, Poolangi Samarpana, Night Kainkaryams and Night Bell' },
      { time: '04:00 PM – 06:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru along with Ubhayanancharulu at Ranganayakula Mandapam' },
      { time: '06:00 PM – 12:30 AM', event: 'Poolangi Sarvadarshanam' },
      { time: '06:00 PM – 07:00 PM', event: 'Procession of Sri Malayappa Swamyvaru along with Ubhayanancharulu to Vahana Mandapam and Samarpana on Muthyapu Pandiri Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Muthyapu Pandiri (Muthupandal) Vahanam' },
      { time: '09:00 PM – 10:00 PM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '12:30 AM – 01:00 AM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '01:00 AM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-18',
    title: 'Fourth Day of Brahmotsavam',
    dayLabel: '18-09-2026 • FRIDAY',
    highlights: [
      { time: '08:00 AM – 10:00 AM', event: 'Kalpa Vriksha Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Sarva Bhoopala Vahanam' },
    ],
    schedule: [
      { time: '02:00 AM – 02:30 AM', event: 'Suprabhatham' },
      { time: '02:30 AM – 03:30 AM', event: 'Suddhi, Nityakaitla Kainkaryams and Preparation for Abhishekam' },
      { time: '03:30 AM – 05:00 AM', event: 'Abhishekam' },
      { time: '05:00 AM – 06:00 AM', event: 'Samarpana' },
      { time: '06:00 AM – 07:00 AM', event: 'Thomala Seva (Ekantham), II Archana (Ekantham), II Bell, Bali and Sathumora' },
      { time: '07:00 AM – 04:00 PM', event: 'Sarvadarshanam' },
      { time: '06:00 AM – 07:00 AM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru along with Ubhayanancharulu at Ranganayakula Mandapam' },
      { time: '07:00 AM – 08:00 AM', event: 'Procession of Sri Malayappa Swamyvaru along with Ubhayanancharulu to Vahana Mandapam and Samarpana on Kalpa Vriksha Vahanam' },
      { time: '08:00 AM – 10:00 AM', event: 'Kalpa Vriksha Vahanam' },
      { time: '10:00 AM – 11:00 AM', event: 'Return to Temple, Asthanam at Ranganayakula Mandapam and Sallimpu of Special Jewels' },
      { time: '03:00 PM – 04:00 PM', event: 'Reception and Procession of sacred garlands of Goddess Sri Andal of Srivilliputtur from HH Sri Pedda Jeeyangar Mutt to Sri TTT around four Mada Streets' },
      { time: '04:00 PM – 05:00 PM', event: 'Suddhi, Night Kainkaryams and Night Bell' },
      { time: '04:00 PM – 06:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru along with Ubhayanancharulu at Ranganayakula Mandapam' },
      { time: '05:00 PM – 12:30 AM', event: 'Sarvadarshanam' },
      { time: '06:00 PM – 07:00 PM', event: 'Procession of Sri Malayappa Swamyvaru along with Ubhayanancharulu to Vahana Mandapam and Samarpana on Sarva Bhoopala Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Sarva Bhoopala Vahanam' },
      { time: '09:00 PM – 10:00 PM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '12:30 AM – 01:00 AM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '01:00 AM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-19',
    title: 'Fifth Day of Brahmotsavam',
    dayLabel: '19-09-2026 • SATURDAY',
    highlights: [
      { time: '08:00 AM – 10:00 AM', event: 'Mohini Avataram (Nachiar Thirukkolam, Pallaki Utsavam)' },
      { time: '06:30 PM – 11:30 PM', event: 'Garuda Vahanam' },
    ],
    schedule: [
      { time: '03:00 AM – 03:30 AM', event: 'Suprabhatham' },
      { time: '03:30 AM – 06:00 AM', event: 'Suddhi, Thomala Seva (Ekantham), Koluvu, Panchanga Sravanam, Ekanta Thirumanjanam to Utsava Deities' },
      { time: '06:00 AM – 02:00 PM', event: 'Sarvadarshanam' },
      { time: '06:00 AM – 08:00 AM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru and Sri Krishna Swamyvaru at Ranganayakula Mandapam' },
      { time: '08:00 AM – 10:00 AM', event: 'Mohini Avataram with Golden Parrot (Nachiar Thirukkolam) in Pallaki' },
      { time: '10:00 AM – 11:00 AM', event: 'Asthanam at Ranganayakula Mandapam and Sallimpu of Special Jewels' },
      { time: '02:00 PM – 04:00 PM', event: 'Suddhi, IInd Archana (Ekantham), II Bell, Night Kainkaryams and Night Bell' },
      { time: '02:00 PM – 04:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '04:00 PM – 12:30 AM', event: 'Sarvadarshanam' },
      { time: '04:00 PM – 05:00 PM', event: 'Procession of Sri Malayappa Swamyvaru alone to Vahana Mandapam' },
      { time: '04:30 PM – 06:30 PM', event: 'Procession of Sri Lakshmi Haram, Makarakanti, Sahasra Namavali Haram and New Melchat Vasthram to Vahana Mandapam and Samarpana on Garuda Vahanam' },
      { time: '06:30 PM – 11:30 PM', event: 'Garuda Vahanam' },
      { time: '11:30 PM – 12:30 AM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '12:30 AM – 01:00 AM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '01:00 AM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-20',
    title: 'Sixth Day of Brahmotsavam',
    dayLabel: '20-09-2026 • SUNDAY',
    highlights: [
      { time: '08:00 AM – 10:00 AM', event: 'Hanumantha Vahanam' },
      { time: '04:00 PM – 05:00 PM', event: 'Ratharanga Dolotsavam (Golden Chariot)' },
      { time: '07:00 PM – 09:00 PM', event: 'Gaja Vahanam' },
    ],
    schedule: [
      { time: '03:00 AM – 03:30 AM', event: 'Suprabhatham' },
      { time: '03:30 AM – 06:00 AM', event: 'Suddhi, Thomala Seva (Ekantham), Koluvu, Panchanga Sravanam, Ekanta Thirumanjanam to Utsava Deities' },
      { time: '06:00 AM – 12:00 Noon', event: 'Sarvadarshanam' },
      { time: '06:00 AM – 07:00 AM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '07:00 AM – 08:00 AM', event: 'Procession of Sri Malayappa Swamyvaru to Vahana Mandapam and Samarpana on Hanumantha Vahanam' },
      { time: '08:00 AM – 10:00 AM', event: 'Hanumantha Vahanam' },
      { time: '10:00 AM – 11:00 AM', event: 'Return to Temple, Asthanam at Ranganayakula Mandapam and Sallimpu of Special Jewels' },
      { time: '12:00 Noon – 01:00 PM', event: 'Suddhi, II Archana (Ekantham) and II Bell' },
      { time: '01:00 PM – 05:00 PM', event: 'Sarvadarshanam' },
      { time: '01:00 PM – 02:00 PM', event: 'Samarpana to Sri Malayappa Swamyvaru along with Ubhayanancharulu at Ranganayakula Mandapam' },
      { time: '02:00 PM – 03:00 PM', event: 'Vasanthotsava Archanam at Ranganayakula Mandapam' },
      { time: '03:00 PM – 04:00 PM', event: 'Procession of Sri Malayappa Swamyvaru along with Ubhayanancharulu for Ratharanga Dolotsavam and Samarpana on Golden Chariot' },
      { time: '04:00 PM – 05:00 PM', event: 'Ratha Ranga Dolotsavam (Swarna Ratha Seva), Return to Temple and Sallimpu of Jewels' },
      { time: '05:00 PM – 06:00 PM', event: 'Suddhi, Night Kainkaryams and Night Bell' },
      { time: '05:00 PM – 06:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '06:00 PM – 12:30 AM', event: 'Sarvadarshanam' },
      { time: '06:00 PM – 07:00 PM', event: 'Procession of Sri Malayappa Swamyvaru to Vahana Mandapam and Samarpana on Gaja Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Gaja Vahanam' },
      { time: '09:00 PM – 10:00 PM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '12:30 AM – 01:00 AM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '01:00 AM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-21',
    title: 'Seventh Day of Brahmotsavam',
    dayLabel: '21-09-2026 • MONDAY',
    highlights: [
      { time: '08:00 AM – 10:00 AM', event: 'Surya Prabha Vahanam' },
      { time: '01:00 PM – 03:00 PM', event: 'Snapana Thirumanjanam – II Day' },
      { time: '07:00 PM – 09:00 PM', event: 'Chandra Prabha Vahanam' },
    ],
    schedule: [
      { time: '03:00 AM – 03:30 AM', event: 'Suprabhatham' },
      { time: '03:30 AM – 06:00 AM', event: 'Suddhi, Thomala Seva (Ekantham), Koluvu, Panchanga Sravanam, Ekanta Thirumanjanam to Utsava Deities' },
      { time: '06:00 AM – 04:00 PM', event: 'Sarvadarshanam' },
      { time: '06:00 AM – 07:00 AM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '07:00 AM – 08:00 AM', event: 'Procession of Sri Malayappa Swamyvaru to Vahana Mandapam and Samarpana on Surya Prabha Vahanam' },
      { time: '08:00 AM – 10:00 AM', event: 'Surya Prabha Vahanam' },
      { time: '10:00 AM – 11:00 AM', event: 'Return to Temple, Asthanam at Ranganayakula Mandapam and Sallimpu of Special Jewels' },
      { time: '11:00 AM – 01:00 PM', event: 'Preparation for Snapana Thirumanjanam' },
      { time: '01:00 PM – 03:00 PM', event: 'Snapana Thirumanjanam – II Day' },
      { time: '04:00 PM – 06:00 PM', event: 'Suddhi, II Archana (Ekantham), II Bell, Suddhi, Night Kainkaryams and Night Bell' },
      { time: '04:00 PM – 06:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '06:00 PM – 10:30 PM', event: 'Sarvadarshanam' },
      { time: '06:00 PM – 07:00 PM', event: 'Procession of Sri Malayappa Swamyvaru to Vahana Mandapam and Samarpana on Chandra Prabha Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Chandra Prabha Vahanam' },
      { time: '09:00 PM – 10:00 PM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '10:30 PM – 11:00 PM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '11:00 PM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-22',
    title: 'Eighth Day of Brahmotsavam',
    dayLabel: '22-09-2026 • TUESDAY',
    highlights: [
      { time: '07:00 AM', event: 'Rathotsavam (Car Festival)' },
      { time: '07:00 PM – 09:00 PM', event: 'Aswa Vahanam' },
    ],
    schedule: [
      { time: '12:05 AM – 02:00 AM', event: 'Suprabhatham (Ekantham), Suddhi, Thomala Seva, Koluvu, Panchanga Sravanam and I Archana (Sahasranamam)' },
      { time: '02:00 AM – 04:00 PM', event: 'Sarvadarshanam' },
      { time: '02:00 AM – 04:00 AM', event: 'Procession of Utsava Deities to Ratha Mandapam, Punyahavachanam, Navagraha Dhanam and religious functions connected with Rathotsavam' },
      { time: '03:00 AM – 03:30 AM', event: 'Ratharohanam Sumuhurtham (Kataka Lagnam)' },
      { time: '07:00 AM', event: 'Car Dragging (Ratha Gamanamu)' },
      { time: '04:00 PM – 06:00 PM', event: 'Visesha Samarpana to Sri Malayappa Swamyvaru alone at Ranganayakula Mandapam' },
      { time: '04:00 PM – 06:00 PM', event: 'Suddhi, II Archana (Ekantham), II Bell, Night Kainkaryams and Night Bell' },
      { time: '06:00 PM – 11:00 PM', event: 'Sarvadarshanam' },
      { time: '06:00 PM – 07:00 PM', event: 'Procession of Sri Malayappa Swamyvaru to Vahana Mandapam and Samarpana on Aswa Vahanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Aswa Vahanam' },
      { time: '09:00 PM – 10:00 PM', event: 'Return to Temple and Sallimpu of Special Jewels at Ranganayakula Mandapam' },
      { time: '11:00 PM – 11:30 PM', event: 'Suddhi, Thiruveesam Bell and Preparation for Ekanta Seva' },
      { time: '11:30 PM', event: 'Ekanta Seva' },
    ],
  },

  {
    date: '2026-09-23',
    title: 'Ninth Day of Brahmotsavam',
    dayLabel: '23-09-2026 • WEDNESDAY',
    highlights: [
      { time: '03:00 AM – 06:00 AM', event: 'Pallaki Utsavam & Tiruchi Utsavam, Snapana Thirumanjanam and Chakrasnanam' },
      { time: '07:00 PM – 09:00 PM', event: 'Dwajavarohanam Procession' },
    ],
    schedule: [
      { time: '01:00 AM – 01:30 AM', event: 'Suprabhatham (Ekantham)' },
      { time: '01:30 AM – 03:00 AM', event: 'Suddhi, Thomala Seva, Koluvu, Panchanga Sravanam, I Archana, I Bell, Bali and Ali (All Ekantham)' },
      { time: '03:00 AM – 09:00 AM', event: 'Sarvadarshanam (No Theertham and No Satari)' },
      { time: '03:00 AM – 06:00 AM', event: 'Pallaki Utsavam & Tiruchi Utsavam around four Mada Streets, Choornaabhishekam, functions at Ranganayakula Mandapam and preparation for Snapana Thirumanjanam' },
      { time: '06:00 AM – 09:00 AM', event: 'Snapana Thirumanjanam, Chakrasnanam and related functions at Sri Varaha Swamyvari Temple' },
      { time: '09:00 AM – 10:00 AM', event: 'Sathumora in Srivari Sannidhi' },
      { time: '10:00 AM – 05:00 PM', event: 'Sarvadarshanam' },
      { time: '05:00 PM – 07:00 PM', event: 'Suddhi, II Archana (Ekantham), II Bell, Suddhi, Night Kainkaryams, Bell and religious functions at Yagasala and Srivari Sannidhi' },
      { time: '05:00 PM – 07:00 PM', event: 'Visesha Samarpana to Utsava Deities at Ranganayakula Mandapam' },
      { time: '07:00 PM – 08:30 PM', event: 'Sarvadarshanam (No Theertham and No Satari)' },
      { time: '07:00 PM – 08:30 PM', event: 'Procession of Sri Malayappa Swamyvaru with Ubhayanancharulu in Gold Tiruchi (Avabhratha Procession) around four Mada Streets' },
      { time: '08:30 PM – 10:00 PM', event: 'Religious functions connected to Dwaja Avarohanam at Dwajastambham, Ihal Dosa Padi Nivedana and Dwaja Avarohanam' },
      { time: '10:00 PM – 10:30 PM', event: 'Sallimpu of Special Jewels' },
      { time: '10:30 PM – 11:00 PM', event: 'Sravanam Asthanam at Bangaru Vakili' },
      { time: '11:00 PM – 11:30 PM', event: 'Night Bell and Thiruveesam Bell' },
      { time: '11:30 PM – 12:00 AM', event: 'Bahumanam to Archakas' },
      { time: '12:00 AM – 12:30 AM', event: 'Suddhi and Preparation for Ekanta Seva' },
      { time: '12:30 AM', event: 'Ekanta Seva' },
    ],
  },
];

export default function DailySchedule({ lang, themeMode = 'dark' }) {
  const isLight = themeMode === 'light';
  const getIndiaDate = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

const todayIndia = getIndiaDate();

const activeBrahmotsavam =
  BRAHMOTSAVAM_2026_SCHEDULE.find(
    (item) => item.date === todayIndia
  );

const isBrahmotsavamPeriod = Boolean(activeBrahmotsavam);
  const [selectedDayTab, setSelectedDayTab] = useState('Monday');
  const [viewSection, setViewSection] = useState('daily'); // 'daily' | 'weekly-table' | 'periodical'
  const [showRightFade, setShowRightFade] = useState(false);
  const [selectedBrahmotsavamDate, setSelectedBrahmotsavamDate] = useState(
    activeBrahmotsavam?.date || BRAHMOTSAVAM_2026_SCHEDULE[0].date
  );

  const selectedBrahmotsavam =
    BRAHMOTSAVAM_2026_SCHEDULE.find(
      (item) => item.date === selectedBrahmotsavamDate
    ) || BRAHMOTSAVAM_2026_SCHEDULE[0];

  const dayNavRef = useRef(null);

  const checkDayNavScroll = useCallback(() => {
    if (dayNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = dayNavRef.current;
      const hasMoreRight = scrollLeft + clientWidth < scrollWidth - 6;
      setShowRightFade(hasMoreRight);
    }
  }, []);

  useEffect(() => {
    checkDayNavScroll();
    window.addEventListener('resize', checkDayNavScroll);
    return () => window.removeEventListener('resize', checkDayNavScroll);
  }, [checkDayNavScroll, viewSection]);

  const activeDayObj = WEEKLY_MAIN_TEMPLE_SEVAS.find(d => d.day === selectedDayTab) || WEEKLY_MAIN_TEMPLE_SEVAS[0];

  const cardBgClass = isLight ? 'bg-white border-slate-200 text-slate-900 shadow-lg' : 'bg-[#0B0E14] border-[#D4AF37]/40 text-white shadow-2xl';
  const itemBgClass = isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-500' : 'bg-[#141923] border-[#D4AF37]/20 hover:border-[#FFD700]';
  const itemTitleClass = isLight ? 'text-slate-900 font-bold font-serif text-base' : 'text-white font-bold font-serif text-base';
  const timeBadgeClass = isLight ? 'bg-amber-50 border-amber-300 text-amber-900 font-mono text-xs font-bold' : 'bg-[#0B0E14] border-[#D4AF37]/40 text-[#FFD700] font-mono text-xs font-bold';

  return (
    <div className="space-y-6 py-4">
      {isBrahmotsavamPeriod ? (
        <>
          {/* TTD SPECIAL PROGRAMME: 14–23 SEPTEMBER 2026 */}
          <div className={`glass-card p-4 sm:p-6 border-l-4 border-l-[#FFD700] ${isLight ? 'bg-white border-slate-200' : 'border-[#D4AF37]/30'}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Sparkles className="w-6 h-6 text-[#FFD700]" />
                  <h2 className="font-serif text-2xl font-bold gold-gradient-text">
                    {lang === 'en' ? 'Annual Brahmotsavam 2026' : 'వార్షిక బ్రహ్మోత్సవం 2026'}
                  </h2>
                </div>
                <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-[#CBD5E1]'}`}>
                  {lang === 'en'
                    ? 'TTD Special Programme • 14 September 2026 to 23 September 2026'
                    : 'టీటీడీ ప్రత్యేక కార్యక్రమం • 14 సెప్టెంబర్ 2026 నుండి 23 సెప్టెంబర్ 2026 వరకు'}
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-[#FFD700]/15 border border-[#D4AF37]/40 text-[#FFD700] text-xs font-extrabold">
                {selectedBrahmotsavam.dayLabel}
              </span>
            </div>
          </div>

          <div className="relative max-w-full">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {BRAHMOTSAVAM_2026_SCHEDULE.map(item => (
                <button
                  key={item.date}
                  onClick={() => setSelectedBrahmotsavamDate(item.date)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all flex items-center gap-2 shadow-md ${
                    selectedBrahmotsavamDate === item.date
                      ? 'bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black ring-2 ring-[#FFD700]'
                      : isLight
                      ? 'bg-white text-slate-800 border border-slate-300 hover:bg-amber-50'
                      : 'bg-[#141923] text-[#FFD700] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(`${item.date}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`glass-card p-4 sm:p-6 border-2 space-y-4 ${cardBgClass}`}>
            <div className={`border-b pb-3 ${isLight ? 'border-slate-200' : 'border-[#D4AF37]/30'}`}>
              <h3 className={`font-serif text-xl font-bold ${isLight ? 'text-amber-900' : 'text-[#FFD700]'}`}>
                {selectedBrahmotsavam.title}
              </h3>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
                {selectedBrahmotsavam.dayLabel}
              </p>
            </div>
            <div className="space-y-2">
              {selectedBrahmotsavam.highlights.map((item, idx) => (
                <div key={`highlight-${idx}`} className={`p-3.5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${itemBgClass}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] shrink-0" />
                    <h4 className={itemTitleClass}>{item.event}</h4>
                  </div>
                  <div className={`px-3 py-1 rounded-lg border shrink-0 self-start sm:self-auto ${timeBadgeClass}`}>
                    ⏱️ {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedBrahmotsavam.schedule?.length > 0 && (
            <div className={`glass-card p-4 sm:p-6 border-2 space-y-4 ${cardBgClass}`}>
              <div className={`border-b pb-3 ${isLight ? 'border-slate-200' : 'border-[#D4AF37]/30'}`}>
                <h3 className={`font-serif text-xl font-bold flex items-center gap-2 ${isLight ? 'text-amber-900' : 'text-[#FFD700]'}`}>
                  <Calendar className="w-5 h-5 text-[#FF5722]" />
                  {lang === 'en' ? 'Complete Daily Programme' : 'పూర్తి దినచర్య కార్యక్రమం'}
                </h3>
              </div>

              <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-500">Sarvadarshanam</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-500">Important Seva / Utsavam</span>
                </span>
              </div>

              <div className="space-y-2">
                {selectedBrahmotsavam.schedule.map((item, idx) => {
                  // Match the source schedule's visual emphasis:
                  // green = darshan availability, red = important ritual/procession highlights.
                  const eventParts = item.event.split(/(Sarvadarshanam|Vahanam|Utsavam|Utsavam|Dwajarohanam|Rathotsavam|Chakrasnanam|Snapana Thirumanjanam|Abhishekam|Suprabhatham|Ekanta Seva)/gi);

                  return (
                    <div key={`schedule-${idx}`} className={`p-3.5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${itemBgClass}`}>
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] mt-1.5 shrink-0" />
                        <h4 className={`${itemTitleClass} leading-relaxed`}>
                          {eventParts.map((part, partIdx) => {
                            const lower = part.toLowerCase();
                            const isGreen = lower === 'sarvadarshanam';
                            const isRed = [
                              'vahanam',
                              'utsavam',
                              'dwajarohanam',
                              'rathotsavam',
                              'chakrasnanam',
                              'snapana thirumanjanam',
                              'abhishekam',
                              'suprabhatham',
                              'ekanta seva'
                            ].includes(lower);

                            return (
                              <span
                                key={partIdx}
                                className={
                                  isGreen
                                    ? 'text-green-500 font-black'
                                    : isRed
                                    ? 'text-red-500 font-black'
                                    : ''
                                }
                              >
                                {part}
                              </span>
                            );
                          })}
                        </h4>
                      </div>
                      <div className={`px-3 py-1 rounded-lg border shrink-0 self-start sm:self-auto ${timeBadgeClass}`}>
                        ⏱️ {item.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
      {/* Header */}
      <div className={`glass-card p-4 sm:p-6 border-l-4 border-l-[#FFD700] flex flex-wrap items-center justify-between gap-4 ${isLight ? 'bg-white border-slate-200' : 'border-[#D4AF37]/30'}`}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Clock className="w-6 h-6 text-[#FFD700]" />
            <h2 className="font-serif text-2xl font-bold gold-gradient-text">
              {lang === 'en' ? 'Srivari Temple Daily, Weekly & Periodical Sevas' : 'తిరుమల శ్రీవారి నిత్య, వారపు & కాలిక సేవల పట్టిక'}
            </h2>
          </div>
          <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-[#CBD5E1]'}`}>
            {lang === 'en'
              ? 'Official schedules for Lord Venkateswara Main Temple in Tirumala including day-wise Kainkaryams, Weekly Seva details, and Periodical Festivals.'
              : 'శ్రీవారి ఆలయంలో జరిగే నిత్య సేవలు, వారపు సేవలు మరియు వార్షిక కాలిక సేవల పూర్తి సమాచారం.'}
          </p>
        </div>

        {/* Section Switcher Tabs */}
        <div className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border w-full sm:w-auto overflow-x-auto no-scrollbar ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0B0E14] border-[#D4AF37]/40'}`}>
          <button
            onClick={() => setViewSection('daily')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
              viewSection === 'daily'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Daily Timetable' : 'నిత్య సేవలు'}</span>
          </button>

          <button
            onClick={() => setViewSection('weekly-table')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
              viewSection === 'weekly-table'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Weekly Sevas' : 'వారపు సేవలు'}</span>
          </button>

          <button
            onClick={() => setViewSection('periodical')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
              viewSection === 'periodical'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Periodical Sevas' : 'కాలిక సేవలు'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: DAILY & WEEKLY DAY-BY-DAY TIMETABLE */}
      {viewSection === 'daily' && (
        <div className="space-y-4">
          {/* Day-by-Day Selector Tabs */}
          <div className="relative max-w-full">
            <div
              ref={dayNavRef}
              onScroll={checkDayNavScroll}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2"
            >
              {WEEKLY_MAIN_TEMPLE_SEVAS.map(dayItem => (
                <button
                  key={dayItem.day}
                  onClick={() => setSelectedDayTab(dayItem.day)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all flex items-center gap-2 shadow-md ${
                    selectedDayTab === dayItem.day
                      ? 'bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black ring-2 ring-[#FFD700]'
                      : isLight
                      ? 'bg-white text-slate-800 border border-slate-300 hover:bg-amber-50'
                      : 'bg-[#141923] text-[#FFD700] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'en' ? dayItem.day : dayItem.dayTe}</span>
                </button>
              ))}
            </div>

            {/* Subtle Mobile Right-Edge Fade Scroll Indicator */}
            {showRightFade && (
              <div
                className="sm:hidden absolute top-0 right-0 bottom-2 w-8 pointer-events-none z-10 bg-gradient-to-l from-[#0B0E14] [.light-theme_&]:from-white to-transparent transition-opacity duration-300"
              />
            )}
          </div>

          {/* Active Day Timetable Card */}
          <div className={`glass-card p-4 sm:p-6 border-2 space-y-4 ${cardBgClass}`}>
            {/* Special Seva Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#990000] via-[#FF5722] to-[#990000] text-white flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFD700] block">
                  {lang === 'en' ? `${activeDayObj.day} Highlight` : `${activeDayObj.dayTe} ముఖ్యాంశం`}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-extrabold text-white">
                  {activeDayObj.specialSeva}
                </h3>
              </div>
              <span className="px-3 py-1 bg-black/40 rounded-full text-xs font-bold border border-[#FFD700]/40 text-[#FFD700]">
                Tirumala Main Sanctum
              </span>
            </div>

            {/* Timetable List */}
            <div className="space-y-2 pt-2">
              {activeDayObj.schedule.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${itemBgClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] shrink-0"></span>
                    <div>
                      <h4 className={itemTitleClass}>
                        <span>{item.seva}</span>
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-lg border shrink-0 self-start sm:self-auto ${timeBadgeClass}`}>
                    ⏱️ {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CLEAN WEEKLY SEVAS TABLE (DAY, SEVA NAME WITH WEEKLY TAG, SEVA TIME) */}
      {viewSection === 'weekly-table' && (
        <div className={`glass-card p-4 sm:p-6 border-2 space-y-4 ${cardBgClass}`}>
          <div className={`border-b pb-3 ${isLight ? 'border-slate-200' : 'border-[#D4AF37]/30'}`}>
            <h3 className="font-serif text-xl font-bold text-[#FFD700] flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#FF5722]" />
              <span className={isLight ? 'text-amber-900' : 'text-[#FFD700]'}>
                {lang === 'en' ? 'Weekly Sevas Performed at Srivari Temple' : 'శ్రీవారి ఆలయంలో వారపు సేవల సమయాలు'}
              </span>
            </h3>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
              Specific day weekly sevas and their performed timing.
            </p>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={isLight ? 'bg-slate-100 text-amber-900 border-b border-slate-300 font-serif text-sm' : 'bg-[#141923] text-[#FFD700] border-b border-[#D4AF37]/40 font-serif text-sm'}>
                  <th className="p-3.5">Day</th>
                  <th className="p-3.5">Seva Name</th>
                  <th className="p-3.5">Seva Time</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${isLight ? 'divide-slate-200 text-slate-800' : 'divide-white/10 text-white'}`}>
                {OFFICIAL_WEEKLY_SEVAS_TABLE.map((row, rIdx) => (
                  <tr key={rIdx} className={isLight ? 'hover:bg-slate-50 transition-colors' : 'hover:bg-[#141923]/60 transition-colors'}>
                    <td className="p-3.5 font-bold text-[#FF5722] text-sm">{row.day}</td>
                    <td className={`p-3.5 font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <span>{row.sevaName}</span>
                      <span className={isLight ? 'ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300' : 'ml-2 px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] text-[11px] font-bold border border-[#D4AF37]/40'}>
                        (Weekly Seva)
                      </span>
                    </td>
                    <td className={`p-3.5 font-mono font-bold text-sm ${isLight ? 'text-amber-800' : 'text-[#FFD700]'}`}>⏱️ {row.sevaTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: PERIODICAL SEVAS */}
      {viewSection === 'periodical' && (
        <div className={`glass-card p-4 sm:p-6 border-2 space-y-4 ${cardBgClass}`}>
          <div className={`border-b pb-3 ${isLight ? 'border-slate-200' : 'border-[#D4AF37]/30'}`}>
            <h3 className="font-serif text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF5722]" />
              <span className={isLight ? 'text-amber-900' : 'text-[#FFD700]'}>
                {lang === 'en' ? 'Periodical Sevas (Annual Religious Occurrences)' : 'శ్రీవారి ఆలయంలో కాలిక సేవలు'}
              </span>
            </h3>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
              Annual events of religious significance performed in Tirumala following the importance of particular asterism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERIODICAL_SEVAS_LIST.map((pSeva, pIdx) => (
              <div key={pIdx} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${itemBgClass}`}>
                <div>
                  <span className="badge-gold text-[10px] uppercase font-extrabold">{pSeva.category}</span>
                  <h4 className={`font-serif text-sm sm:text-base font-bold mt-1.5 leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {pSeva.name}
                  </h4>
                </div>

                <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold self-start sm:self-auto shrink-0 ${timeBadgeClass}`}>
                  ⏱️ {pSeva.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


        </>
      )}
    </div>
  );
}

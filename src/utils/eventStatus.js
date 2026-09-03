/**
 * DATA CLASSIFICATION & TIME WINDOW DOCUMENTATION:
 * - `getEventStatus` calculates time-aware live event status in Indian Standard Time (IST / Asia-Kolkata).
 * - Qualitative time windows used for status calculation:
 *     * Morning:   06:00 - 12:00 IST
 *     * Afternoon: 12:00 - 17:00 IST
 *     * Evening:   17:00 - 21:00 IST
 *     * Night:     21:00 - 24:00 IST
 *   Note: These qualitative windows are internal website status-calculation guidance windows, NOT official TTD timings.
 */

export function parseTimeWindow(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const str = timeStr.trim();
  if (!str) return null;

  const lower = str.toLowerCase();

  // Qualitative windows (internal website guidance windows)
  if (lower.includes('morning') || lower.includes('ఉదయం')) {
    return { startMins: 6 * 60, endMins: 12 * 60 }; // 06:00 - 12:00 IST
  }
  if (lower.includes('afternoon') || lower.includes('మధ్యాహ్నం')) {
    return { startMins: 12 * 60, endMins: 17 * 60 }; // 12:00 - 17:00 IST
  }
  if (lower.includes('evening') || lower.includes('సాయంత్రం')) {
    return { startMins: 17 * 60, endMins: 21 * 60 }; // 17:00 - 21:00 IST
  }
  if (lower.includes('night') || lower.includes('రాత్రి')) {
    return { startMins: 21 * 60, endMins: 24 * 60 }; // 21:00 - 24:00 IST
  }

  // Parse individual time string (e.g. '06:21 PM', '4 PM', '12:00 AM')
  function parseSingleTime(tStr, isEndPos = false, startMinsRef = null) {
    const clean = tStr.trim().toUpperCase();
    const match = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3];

    // Special midnight end handling (e.g. '06:30 PM - 12:00 AM' or '12 AM' at range end)
    if (isEndPos && hours === 12 && (ampm === 'AM' || (!ampm && startMinsRef !== null && startMinsRef >= 12 * 60))) {
      return 24 * 60; // 1440m (Midnight / 24:00 IST)
    }

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // Range match (e.g., '06:21 PM - 06:35 PM' or '06:30 PM - 12:00 AM')
  const rangeMatch = str.split(/[-–—]|(?:\bTO\b)/i);
  if (rangeMatch.length >= 2) {
    const startMins = parseSingleTime(rangeMatch[0]);
    const endMins = parseSingleTime(rangeMatch[1], true, startMins);
    if (startMins !== null && endMins !== null) {
      return { startMins, endMins: endMins < startMins ? endMins + 24 * 60 : endMins };
    }
  }

  // Single time (e.g., '04:00 PM', '7:30 AM')
  const singleMins = parseSingleTime(str);
  if (singleMins !== null) {
    // Single exact time without explicit end: LIVE NOW from start time through remainder of event date (24:00 / 1440m IST)
    return { startMins: singleMins, endMins: 24 * 60 };
  }

  return null;
}

export function getEventStatus(eventOrStartDate, endDateParam, timeParam, customIST) {
  let startDate, endDate, timeStr, istOverride;

  if (typeof eventOrStartDate === 'object' && eventOrStartDate !== null) {
    startDate = eventOrStartDate.startDate;
    endDate = eventOrStartDate.endDate || eventOrStartDate.startDate;
    timeStr = eventOrStartDate.time;
    istOverride = endDateParam;
  } else {
    startDate = eventOrStartDate;
    endDate = endDateParam || startDate;
    timeStr = timeParam;
    istOverride = customIST;
  }

  // Helper to extract current IST date and time components
  let currentIST = istOverride;
  if (!currentIST) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(now);

    const getPart = type => parts.find(p => p.type === type)?.value;
    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    let hour = parseInt(getPart('hour'), 10);
    if (hour === 24) hour = 0;
    const minute = parseInt(getPart('minute'), 10);

    currentIST = {
      dateStr: `${year}-${month}-${day}`,
      minutesSinceMidnight: hour * 60 + minute,
    };
  }

  const liveObj = {
    status: 'LIVE NOW',
    statusTe: '🔴 ప్రత్యక్ష సేవ / ప్రసారం',
    colorClass: 'bg-red-600 text-white font-extrabold animate-pulse shadow-lg ring-2 ring-red-400',
    bgCardBorder: 'border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  };

  const upcomingObj = {
    status: 'UPCOMING',
    statusTe: 'రాబోయే ఉత్సవం',
    colorClass: 'bg-[#FF5722] text-white',
    bgCardBorder: 'border-[#D4AF37]/30',
  };

  const completedObj = {
    status: 'COMPLETED',
    statusTe: 'పూర్తయినది',
    colorClass: 'bg-[#94A3B8]/30 text-[#94A3B8]',
    bgCardBorder: 'border-white/10',
  };

  // 1. Completely before startDate
  if (currentIST.dateStr < startDate) {
    return upcomingObj;
  }

  // 2. Completely after endDate
  if (currentIST.dateStr > endDate) {
    return completedObj;
  }

  // 3. Current date is within startDate and endDate
  const timeWin = parseTimeWindow(timeStr);

  if (!timeWin) {
    // Missing / unparseable time: Fallback to date-based full day active
    return liveObj;
  }

  // Single-day event
  if (currentIST.dateStr === startDate && currentIST.dateStr === endDate) {
    if (currentIST.minutesSinceMidnight < timeWin.startMins) {
      return upcomingObj;
    } else if (currentIST.minutesSinceMidnight <= timeWin.endMins) {
      return liveObj;
    } else {
      return completedObj;
    }
  }

  // Multi-day event boundary logic
  if (currentIST.dateStr === startDate) {
    if (currentIST.minutesSinceMidnight < timeWin.startMins) {
      return upcomingObj;
    }
    return liveObj;
  }

  if (currentIST.dateStr === endDate) {
    if (currentIST.minutesSinceMidnight <= timeWin.endMins) {
      return liveObj;
    }
    return completedObj;
  }

  // Intermediate days of multi-day event
  return liveObj;
}

// Open Google Calendar Event Creation URL directly
export function openGoogleCalendar(event) {
  const title = encodeURIComponent(event.title || 'Tirumala Temple Event');
  const description = encodeURIComponent((event.description || '') + (event.location ? `\n\nLocation: ${event.location}` : ''));
  const location = encodeURIComponent(event.location || 'Tirumala Tirupati Devasthanams');
  
  const start = (event.startDate || '').replace(/-/g, '');
  let end = (event.endDate || event.startDate || '').replace(/-/g, '');
  
 if (start === end) {
  const [year, month, day] = event.startDate.split('-').map(Number);
  const sDate = new Date(Date.UTC(year, month - 1, day + 1));

  end = sDate.toISOString().split('T')[0].replace(/-/g, '');
}

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}&location=${location}`;
  window.open(googleUrl, '_blank');
}

// Open Apple Calendar (.ics data URL / webcal handler)
export function openAppleCalendar(event) {
  const title = event.title || 'Tirumala Temple Event';
  const description = event.description || 'Tirumala Utsavam Event';
  const startDateStr = (event.startDate || '').replace(/-/g, '');
  const endDateStr = (event.endDate || event.startDate || '').replace(/-/g, '');

  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tirumala Utsavam Portal//NONSGML v1.0//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${event.id || Date.now()}@tirumala-utsavam
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;VALUE=DATE:${startDateStr}
DTEND;VALUE=DATE:${endDateStr}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:Tirumala Tirupati Devasthanams
END:VEVENT
END:VCALENDAR`;

  const isAppleDevice = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent);
  
  if (isAppleDevice) {
    // Directly launches native Apple Calendar app on iOS/macOS without downloading file
    const encoded = encodeURIComponent(icsData);
    window.location.href = `data:text/calendar;charset=utf8,${encoded}`;
  } else {
    // Directs to Apple iCloud Calendar on web browsers
    window.open('https://www.icloud.com/calendar', '_blank');
  }
}

// Multi-Platform Social Sharing Utility (WhatsApp, X, Reddit, Facebook, Threads, Copy Link)
export function shareToPlatform(platform, event, lang = 'en') {
  const title = lang === 'te' && event.titleTe ? event.titleTe : event.title;
  const date = event.startDate === event.endDate ? event.startDate : `${event.startDate} to ${event.endDate}`;
  const time = event.time ? `\n⏰ Time: ${event.time}` : '';
  const location = event.location ? `\n🛕 Location: ${event.location}` : '';
  const vahanam = event.vahanam ? `\n🐎 Vahanam: ${event.vahanam}` : '';
  const currentUrl = window.location.href;

  const shareText = `🙏 *Tirumala Temple Event Update* 🙏\n\n✨ *${title}*\n📅 Date: ${date}${time}${location}${vahanam}\n\n📖 Read full schedule on The Tirumala Verse:\n${currentUrl}`;

  switch (platform) {
    case 'whatsapp': {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
      break;
    }
    case 'x': {
      const tweet = `🙏 Tirumala Temple Event: ${title} (${date}) 🛕\n\nRead more on The Tirumala Verse: ${currentUrl}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
      window.open(url, '_blank');
      break;
    }
    case 'facebook': {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
      break;
    }
    case 'reddit': {
      const url = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(`Tirumala Utsavam: ${title}`)}`;
      window.open(url, '_blank');
      break;
    }
    case 'threads': {
      const url = `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
      break;
    }
    case 'instagram': {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${shareText}`);
        toast.info(lang === 'te' ? 'ఉత్సవ సమాచారం కాపీ చేయబడింది! ఇన్‌స్టాగ్రామ్ ఓపెన్ అవుతోంది...' : 'Event details copied! Opening Instagram...');
      }
      window.open('https://www.instagram.com', '_blank');
      break;
    }
    case 'telegram': {
  const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  window.open(url, '_blank');
  break;
}
    case 'copy': {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${shareText}`);
        toast.success(lang === 'te' ? 'లింక్ విజయవంతంగా కాపీ చేయబడింది!' : 'Link & event details copied to clipboard!');
      } else {
        toast.info(lang === 'te' ? 'కాపీ చేయబడింది: ' + currentUrl : 'Copied link: ' + currentUrl);
      }
      break;
    }
    default:
      break;
  }
}

// 1-Click WhatsApp Share compatibility
export function shareToWhatsApp(event, lang = 'en') {
  shareToPlatform('whatsapp', event, lang);
}

// Apple / iCal Download compatibility
export function downloadIcsCalendarFile(event) {
  openAppleCalendar(event);
}

// Automatically convert Wikimedia file page links & Drive links to direct image URLs
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let cleanUrl = url.trim();

  if (cleanUrl.startsWith('event-photos/')) {
    return `https://rjdltvopbejhvbheindb.supabase.co/storage/v1/object/public/${cleanUrl}`;
  }

  if (cleanUrl.includes('commons.wikimedia.org/wiki/File:')) {
    const filename = cleanUrl.split('File:')[1].split('#')[0].split('?')[0];
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
  }

  if (cleanUrl.includes('drive.google.com/file/d/')) {
    const fileId = cleanUrl.split('/d/')[1].split('/')[0];
    return `https://lh3.googleusercontent.com/d/${fileId}=s1600`;
  }

  return cleanUrl;
}

// Compress & Resize PC uploaded image files to prevent localStorage / Supabase payload quota overflow
export function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Defensive normalization of all event images into array of { url, caption } objects
export function normalizeEventImages(event) {
  const allImages = [];
  if (!event) return allImages;

  if (event.images) {
    let rawImages = event.images;
    if (typeof rawImages === 'string') {
      try {
        rawImages = JSON.parse(rawImages);
      } catch {
        rawImages = [rawImages];
      }
    }
    if (Array.isArray(rawImages)) {
      rawImages.forEach(img => {
        if (typeof img === 'string' && img.trim() !== '') {
          allImages.push({ url: normalizeImageUrl(img.trim()), caption: event.title || '' });
        } else if (img && typeof img === 'object' && img.url && String(img.url).trim() !== '') {
          allImages.push({ url: normalizeImageUrl(String(img.url).trim()), caption: img.caption || '' });
        }
      });
    }
  }
  if (allImages.length === 0 && event.imageUrl && String(event.imageUrl).trim() !== '') {
    allImages.push({ url: normalizeImageUrl(String(event.imageUrl).trim()), caption: event.title || '' });
  }

  return allImages;
}

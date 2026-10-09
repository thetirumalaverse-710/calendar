/**
 * Route-specific SEO Metadata definitions and lightweight DOM updater.
 * Establishes unique <title>, <meta name="description">, canonical URL,
 * Open Graph, and Twitter metadata for core public routes.
 *
 * NOTE: Client-side metadata updates do not replace server-side / prerendered HTML
 * for scrapers that do not execute JavaScript. This structures route canonicals and
 * metadata cleanly prior to build-time prerendering.
 */

import { getFestivalTopic } from '../data/festivalTopics.js';

export const SITE_ORIGIN = 'https://thetirumalaverse.in';

export const ROUTE_SEO_METADATA = {
  '/': {
    title: 'The Tirumala Verse | Tirumala Festival Calendar 2026-2027, SSD & DD Tokens & Sevas Guide',
    description:
      'The Tirumala Verse - Your independent guide to Tirumala & Tirupati. 2026-2027 TTD festival calendar, Brahmotsavam dates, Garuda Vahanam, live SSD vs DD tokens status, and daily sevas schedule across Tirumala temples.',
    canonical: `${SITE_ORIGIN}/`,
    ogTitle: 'The Tirumala Verse | Tirumala Festival Calendar 2026-2027, SSD & DD Tokens & Sevas Guide',
    ogDescription:
      'The Tirumala Verse - Your independent guide to Tirumala & Tirupati. 2026-2027 TTD festival calendar, Brahmotsavam dates, Garuda Vahanam, live SSD vs DD tokens status, and daily sevas schedule.',
    ogUrl: `${SITE_ORIGIN}/`,
    twitterTitle: 'The Tirumala Verse | Tirumala Festival Calendar 2026-2027, SSD & DD Tokens & Sevas Guide',
    twitterDescription:
      'The Tirumala Verse - Your independent guide to Tirumala & Tirupati. 2026-2027 TTD festival calendar, Brahmotsavam dates, Garuda Vahanam, live SSD vs DD tokens status, and daily sevas schedule.',
  },
  '/calendar': {
    title: 'The Tirumala Verse | Tirumala & TTD Festival Calendar 2026-2027: Brahmotsavams & Utsavams',
    description:
      'Explore upcoming Tirumala and Tirupati temple festivals, official 2026-2027 monthly utsavams, Brahmotsavams dates, and vahana sevas with interactive calendar filters and search.',
    canonical: `${SITE_ORIGIN}/calendar`,
    ogTitle: 'The Tirumala Verse | Tirumala & TTD Festival Calendar 2026-2027: Brahmotsavams & Utsavams',
    ogDescription:
      'Explore upcoming Tirumala and Tirupati temple festivals, official 2026-2027 monthly utsavams, Brahmotsavams dates, and vahana sevas with interactive calendar filters and search.',
    ogUrl: `${SITE_ORIGIN}/calendar`,
    twitterTitle: 'The Tirumala Verse | Tirumala & TTD Festival Calendar 2026-2027: Brahmotsavams & Utsavams',
    twitterDescription:
      'Explore upcoming Tirumala and Tirupati temple festivals, official 2026-2027 monthly utsavams, Brahmotsavams dates, and vahana sevas with interactive calendar filters and search.',
  },
  '/glossary': {
    title: 'Festival & Utsavam Glossary | The Tirumala Verse',
    description:
      'Explore Vedic origins, Puranic history, Alwar pasurams, and sacred meanings of terms, rituals, Vahanas, Naivedyams, and Great Devotees associated with Tirumala Utsavams.',
    canonical: `${SITE_ORIGIN}/glossary`,
    ogTitle: 'Festival & Utsavam Glossary | The Tirumala Verse',
    ogDescription:
      'Explore Vedic origins, Puranic history, Alwar pasurams, and sacred meanings of terms, rituals, Vahanas, Naivedyams, and Great Devotees associated with Tirumala Utsavams.',
    ogUrl: `${SITE_ORIGIN}/glossary`,
    twitterTitle: 'Festival & Utsavam Glossary | The Tirumala Verse',
    twitterDescription:
      'Explore Vedic origins, Puranic history, Alwar pasurams, and sacred meanings of terms, rituals, Vahanas, Naivedyams, and Great Devotees associated with Tirumala Utsavams.',
  },
  '/sevas': {
    title: 'Daily, Weekly & Periodical Sevas Schedule | The Tirumala Verse',
    description:
      'Information on Lord Venkateswara temple schedules in Tirumala, including day-wise Kainkaryams, Weekly Seva details, and Periodical Festivals.',
    canonical: `${SITE_ORIGIN}/sevas`,
    ogTitle: 'Daily, Weekly & Periodical Sevas Schedule | The Tirumala Verse',
    ogDescription:
      'Information on Lord Venkateswara temple schedules in Tirumala, including day-wise Kainkaryams, Weekly Seva details, and Periodical Festivals.',
    ogUrl: `${SITE_ORIGIN}/sevas`,
    twitterTitle: 'Daily, Weekly & Periodical Sevas Schedule | The Tirumala Verse',
    twitterDescription:
      'Information on Lord Venkateswara temple schedules in Tirumala, including day-wise Kainkaryams, Weekly Seva details, and Periodical Festivals.',
  },
  '/tokens': {
    title: 'The Tirumala Verse | SSD vs DD Tokens in Tirumala: Meaning, Difference & Live Status',
    description:
      'Comprehensive guide to SSD (Slotted Sarva Darshan) and DD (Divya Darshan) tokens in Tirumala Tirupati. Understand key differences, counter locations, rules, and daily quota availability.',
    canonical: `${SITE_ORIGIN}/tokens`,
    ogTitle: 'The Tirumala Verse | SSD vs DD Tokens in Tirumala: Meaning, Difference & Live Status',
    ogDescription:
      'Comprehensive guide to SSD (Slotted Sarva Darshan) and DD (Divya Darshan) tokens in Tirumala Tirupati. Understand key differences, counter locations, rules, and daily quota availability.',
    ogUrl: `${SITE_ORIGIN}/tokens`,
    twitterTitle: 'The Tirumala Verse | SSD vs DD Tokens in Tirumala: Meaning, Difference & Live Status',
    twitterDescription:
      'Comprehensive guide to SSD (Slotted Sarva Darshan) and DD (Divya Darshan) tokens in Tirumala Tirupati. Understand key differences, counter locations, rules, and daily quota availability.',
  },
  '/overview': {
    title: 'Experience Sacred Tirumala Utsavams & Festivals | The Tirumala Verse',
    description:
      'Explore Tirumala & Tirupati temple festivals, interactive calendar events, and daily Nitya Seva timings based on published TTD schedules.',
    canonical: `${SITE_ORIGIN}/overview`,
    ogTitle: 'Experience Sacred Tirumala Utsavams & Festivals | The Tirumala Verse',
    ogDescription:
      'Explore Tirumala & Tirupati temple festivals, interactive calendar events, and daily Nitya Seva timings based on published TTD schedules.',
    ogUrl: `${SITE_ORIGIN}/overview`,
    twitterTitle: 'Experience Sacred Tirumala Utsavams & Festivals | The Tirumala Verse',
    twitterDescription:
      'Explore Tirumala & Tirupati temple festivals, interactive calendar events, and daily Nitya Seva timings based on published TTD schedules.',
  },
  '/feedback': {
    title: 'Community Feedback & Suggestions | The Tirumala Verse',
    description:
      'Help improve The Tirumala Verse portal. Report bugs, submit feature suggestions, or share content corrections with our team.',
    canonical: `${SITE_ORIGIN}/feedback`,
    ogTitle: 'Community Feedback & Suggestions | The Tirumala Verse',
    ogDescription:
      'Help improve The Tirumala Verse portal. Report bugs, submit feature suggestions, or share content corrections with our team.',
    ogUrl: `${SITE_ORIGIN}/feedback`,
    twitterTitle: 'Community Feedback & Suggestions | The Tirumala Verse',
    twitterDescription:
      'Help improve The Tirumala Verse portal. Report bugs, submit feature suggestions, or share content corrections with our team.',
  },
  '/festivals/garuda-vahanam': {
    title:
      'Garuda Vahanam at Tirumala | Dates, Significance & Seva Guide | The Tirumala Verse',
    description:
      'Learn about Garuda Vahanam at Tirumala, its significance, and scheduled occurrences. Explore Garuda Vahanam dates and related events in the Tirumala festival calendar.',
    canonical: `${SITE_ORIGIN}/festivals/garuda-vahanam`,
    ogTitle:
      'Garuda Vahanam at Tirumala | Dates, Significance & Seva Guide | The Tirumala Verse',
    ogDescription:
      'Learn about Garuda Vahanam at Tirumala, its significance, and scheduled occurrences. Explore Garuda Vahanam dates and related events in the Tirumala festival calendar.',
    ogUrl: `${SITE_ORIGIN}/festivals/garuda-vahanam`,
    twitterTitle:
      'Garuda Vahanam at Tirumala | Dates, Significance & Seva Guide | The Tirumala Verse',
    twitterDescription:
      'Learn about Garuda Vahanam at Tirumala, its significance, and scheduled occurrences. Explore Garuda Vahanam dates and related events in the Tirumala festival calendar.',
  },
  '/festivals/rathotsavam': {
    title:
      'Rathotsavam at Tirumala | Dates, Significance & Chariot Festival Guide | The Tirumala Verse',
    description:
      'Learn about Rathotsavam at Tirumala, its spiritual significance, and scheduled chariot occurrences. Explore Rathotsavam dates across Tirumala and Tirupati shrines in the festival calendar.',
    canonical: `${SITE_ORIGIN}/festivals/rathotsavam`,
    ogTitle:
      'Rathotsavam at Tirumala | Dates, Significance & Chariot Festival Guide | The Tirumala Verse',
    ogDescription:
      'Learn about Rathotsavam at Tirumala, its spiritual significance, and scheduled chariot occurrences. Explore Rathotsavam dates across Tirumala and Tirupati shrines in the festival calendar.',
    ogUrl: `${SITE_ORIGIN}/festivals/rathotsavam`,
    twitterTitle:
      'Rathotsavam at Tirumala | Dates, Significance & Chariot Festival Guide | The Tirumala Verse',
    twitterDescription:
      'Learn about Rathotsavam at Tirumala, its spiritual significance, and scheduled chariot occurrences. Explore Rathotsavam dates across Tirumala and Tirupati shrines in the festival calendar.',
  },
  '/festivals/pavithrotsavam': {
    title:
      'Pavithrotsavam at Tirumala | Dates, Significance & Ritual Guide | The Tirumala Verse',
    description:
      'Learn about Pavithrotsavam at Tirumala, its annual purification significance, and multi-day ritual schedule. Explore Pavithrotsavam dates and ceremonies across Tirumala and Tirupati temples.',
    canonical: `${SITE_ORIGIN}/festivals/pavithrotsavam`,
    ogTitle:
      'Pavithrotsavam at Tirumala | Dates, Significance & Ritual Guide | The Tirumala Verse',
    ogDescription:
      'Learn about Pavithrotsavam at Tirumala, its annual purification significance, and multi-day ritual schedule. Explore Pavithrotsavam dates and ceremonies across Tirumala and Tirupati temples.',
    ogUrl: `${SITE_ORIGIN}/festivals/pavithrotsavam`,
    twitterTitle:
      'Pavithrotsavam at Tirumala | Dates, Significance & Ritual Guide | The Tirumala Verse',
    twitterDescription:
      'Learn about Pavithrotsavam at Tirumala, its annual purification significance, and multi-day ritual schedule. Explore Pavithrotsavam dates and ceremonies across Tirumala and Tirupati temples.',
  },
  '/festivals/brahmotsavam': {
    title:
      'Tirumala Navarathri Brahmotsavam 2026 Schedule, 18 Vahana Sevas & Dates | The Tirumala Verse',
    description:
      'Complete guide to Tirumala Srivari Navarathri Brahmotsavams 2026 (Oct 11–21) & 2027 dates. Official 9-day morning & evening timetable, 18 Vahana Sevas, 17 Harathi points, Swarna Ratham, and temple history.',
    canonical: `${SITE_ORIGIN}/festivals/brahmotsavam`,
    ogTitle:
      'Tirumala Navarathri Brahmotsavam 2026 Schedule, 18 Vahana Sevas & Dates | The Tirumala Verse',
    ogDescription:
      'Complete guide to Tirumala Srivari Navarathri Brahmotsavams 2026 (Oct 11–21) & 2027 dates. Official 9-day morning & evening timetable, 18 Vahana Sevas, 17 Harathi points, Swarna Ratham, and temple history.',
    ogUrl: `${SITE_ORIGIN}/festivals/brahmotsavam`,
    twitterTitle:
      'Tirumala Navarathri Brahmotsavam 2026 Schedule, 18 Vahana Sevas & Dates | The Tirumala Verse',
    twitterDescription:
      'Complete guide to Tirumala Srivari Navarathri Brahmotsavams 2026 (Oct 11–21) & 2027 dates. Official 9-day morning & evening timetable, 18 Vahana Sevas, 17 Harathi points, Swarna Ratham, and temple history.',
  },
};

/**
 * Returns the route metadata object for a given path.
 * Strips query parameters and hash, and falls back to homepage metadata.
 *
 * @param {string} pathname
 * @returns {typeof ROUTE_SEO_METADATA['/']}
 */
export function getRouteMetadata(pathname) {
  if (!pathname) return ROUTE_SEO_METADATA['/'];

  // Normalize: remove query strings/hashes if present and trailing slash
  const pathOnly = pathname.split('?')[0].split('#')[0];
  const cleanPath = pathOnly.replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();

  if (lowerPath === '/calendar-page') {
    return ROUTE_SEO_METADATA['/calendar'];
  }

  if (ROUTE_SEO_METADATA[lowerPath]) {
    return ROUTE_SEO_METADATA[lowerPath];
  }

  // Dynamic /festivals/<slug> handling
  if (lowerPath.startsWith('/festivals/')) {
    const slug = lowerPath.slice('/festivals/'.length);
    const topic = getFestivalTopic(slug);
    if (topic) {
      return {
        title: topic.title,
        description: topic.description,
        canonical: topic.canonical,
        ogTitle: topic.title,
        ogDescription: topic.description,
        ogUrl: topic.canonical,
        twitterTitle: topic.title,
        twitterDescription: topic.description,
      };
    }
  }

  return ROUTE_SEO_METADATA['/'];
}

function setMetaTag(selector, attrName, value) {
  if (!value || typeof document === 'undefined') return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/meta\[([a-zA-Z0-9_-]+)="([^"]+)"\]/);
    if (match) {
      element.setAttribute(match[1], match[2]);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attrName, value);
}

function setCanonicalTag(href) {
  if (!href || typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Applies route-appropriate SEO metadata to document.head.
 * Ensures the canonical URL never includes search query strings or event deep links.
 *
 * @param {string} pathname
 */
export function updateRouteMetadata(pathname) {
  if (typeof document === 'undefined') return;

  const meta = getRouteMetadata(pathname);

  // 1. Update <title>
  if (meta.title && document.title !== meta.title) {
    document.title = meta.title;
  }

  // 2. Update canonical URL (self-referencing canonical, strictly without query params)
  setCanonicalTag(meta.canonical);

  // 3. Update meta description
  setMetaTag('meta[name="description"]', 'content', meta.description);

  // 4. Update Open Graph tags
  setMetaTag('meta[property="og:title"]', 'content', meta.ogTitle);
  setMetaTag('meta[property="og:description"]', 'content', meta.ogDescription);
  setMetaTag('meta[property="og:url"]', 'content', meta.ogUrl);

  // 5. Update Twitter tags
  setMetaTag('meta[name="twitter:title"]', 'content', meta.twitterTitle);
  setMetaTag('meta[name="twitter:description"]', 'content', meta.twitterDescription);
}

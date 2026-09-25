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
    title: 'The Tirumala Verse | Your Independent Guide to Tirumala',
    description:
      'The Tirumala Verse - Your independent guide to Tirumala. 2026-27 Panchangam events, Brahmotsavams, Vahana Sevas, and daily rituals across Tirumala & Tirupati temples.',
    canonical: `${SITE_ORIGIN}/`,
    ogTitle: 'The Tirumala Verse | Your Independent Guide to Tirumala',
    ogDescription:
      'Explore Tirumala and Tirupati festivals, utsavams, sevas, vahanas, and temple events in one independent community calendar.',
    ogUrl: `${SITE_ORIGIN}/`,
    twitterTitle: 'The Tirumala Verse | Your Independent Guide to Tirumala',
    twitterDescription:
      'Explore Tirumala and Tirupati festivals, utsavams, sevas, vahanas, and temple events in one independent community calendar.',
  },
  '/calendar': {
    title: 'Temple Utsavams & Festival Calendar 2026-27 | The Tirumala Verse',
    description:
      'Explore upcoming Tirumala and Tirupati temple festivals, monthly utsavams, Brahmotsavams, and vahana sevas with interactive calendar filters and search.',
    canonical: `${SITE_ORIGIN}/calendar`,
    ogTitle: 'Temple Utsavams & Festival Calendar 2026-27 | The Tirumala Verse',
    ogDescription:
      'Explore upcoming Tirumala and Tirupati temple festivals, monthly utsavams, Brahmotsavams, and vahana sevas with interactive calendar filters and search.',
    ogUrl: `${SITE_ORIGIN}/calendar`,
    twitterTitle: 'Temple Utsavams & Festival Calendar 2026-27 | The Tirumala Verse',
    twitterDescription:
      'Explore upcoming Tirumala and Tirupati temple festivals, monthly utsavams, Brahmotsavams, and vahana sevas with interactive calendar filters and search.',
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
    title: 'SSD & DD Free Darshan Tokens Guide | The Tirumala Verse',
    description:
      'Information and live status for Slotted Sarva Darshan (SSD) and Divya Darshan (DD) free offline darshan tokens issued across Tirupati counters.',
    canonical: `${SITE_ORIGIN}/tokens`,
    ogTitle: 'SSD & DD Free Darshan Tokens Guide | The Tirumala Verse',
    ogDescription:
      'Information and live status for Slotted Sarva Darshan (SSD) and Divya Darshan (DD) free offline darshan tokens issued across Tirupati counters.',
    ogUrl: `${SITE_ORIGIN}/tokens`,
    twitterTitle: 'SSD & DD Free Darshan Tokens Guide | The Tirumala Verse',
    twitterDescription:
      'Information and live status for Slotted Sarva Darshan (SSD) and Divya Darshan (DD) free offline darshan tokens issued across Tirupati counters.',
  },
  '/temples': {
    title: 'The 7 Sacred Shrines of Tirumala & Tirupati | The Tirumala Verse',
    description:
      'Discover the 7 sacred temples of Tirumala and Tirupati, their spiritual significance in the divine legend of Lord Venkateswara and Goddess Padmavathi, and festival schedules.',
    canonical: `${SITE_ORIGIN}/temples`,
    ogTitle: 'The 7 Sacred Shrines of Tirumala & Tirupati | The Tirumala Verse',
    ogDescription:
      'Discover the 7 sacred temples of Tirumala and Tirupati, their spiritual significance in the divine legend of Lord Venkateswara and Goddess Padmavathi, and festival schedules.',
    ogUrl: `${SITE_ORIGIN}/temples`,
    twitterTitle: 'The 7 Sacred Shrines of Tirumala & Tirupati | The Tirumala Verse',
    twitterDescription:
      'Discover the 7 sacred temples of Tirumala and Tirupati, their spiritual significance in the divine legend of Lord Venkateswara and Goddess Padmavathi, and festival schedules.',
  },
  '/references': {
    title: 'References & Historical Literature | The Tirumala Verse',
    description:
      'Access historical manuscripts, temple manuals, Annamacharya sankirtana records, and epigraphical research on Tirumala and Tirupati temples.',
    canonical: `${SITE_ORIGIN}/references`,
    ogTitle: 'References & Historical Literature | The Tirumala Verse',
    ogDescription:
      'Access historical manuscripts, temple manuals, Annamacharya sankirtana records, and epigraphical research on Tirumala and Tirupati temples.',
    ogUrl: `${SITE_ORIGIN}/references`,
    twitterTitle: 'References & Historical Literature | The Tirumala Verse',
    twitterDescription:
      'Access historical manuscripts, temple manuals, Annamacharya sankirtana records, and epigraphical research on Tirumala and Tirupati temples.',
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

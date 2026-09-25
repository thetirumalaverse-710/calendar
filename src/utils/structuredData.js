/**
 * Route-specific Structured Data (JSON-LD) manager for WebPage and BreadcrumbList.
 * Preserves the static WebSite and Organization schema defined in index.html.
 */

import { getRouteMetadata, SITE_ORIGIN } from './seoMetadata.js';
import { getFestivalTopic } from '../data/festivalTopics.js';

export const ROUTE_SCRIPT_ID = 'route-structured-data';

const BREADCRUMB_CONFIG = {
  '/': [
    { name: 'Home', item: `${SITE_ORIGIN}/` }
  ],
  '/calendar': [
    { name: 'Home', item: `${SITE_ORIGIN}/` },
    { name: 'Festival Calendar', item: `${SITE_ORIGIN}/calendar` }
  ],
  '/glossary': [
    { name: 'Home', item: `${SITE_ORIGIN}/` },
    { name: 'Utsavam Glossary', item: `${SITE_ORIGIN}/glossary` }
  ],
  '/sevas': [
    { name: 'Home', item: `${SITE_ORIGIN}/` },
    { name: 'Daily Sevas', item: `${SITE_ORIGIN}/sevas` }
  ],
  '/tokens': [
    { name: 'Home', item: `${SITE_ORIGIN}/` },
    { name: 'Darshan Tokens', item: `${SITE_ORIGIN}/tokens` }
  ],
  '/temples': [
    { name: 'Home', item: `${SITE_ORIGIN}/` },
    { name: 'Sacred Shrines', item: `${SITE_ORIGIN}/temples` }
  ],
  '/references': [
    { name: 'Home', item: `${SITE_ORIGIN}/` },
    { name: 'Historical References', item: `${SITE_ORIGIN}/references` }
  ]
};

const FESTIVAL_NAMES = {
  'garuda-vahanam': 'Garuda Vahanam',
  'rathotsavam': 'Rathotsavam',
  'pavithrotsavam': 'Pavithrotsavam',
  'brahmotsavam': 'Brahmotsavam'
};

/**
 * Builds the breadcrumb items list for a normalized route.
 *
 * @param {string} pathname
 * @param {object|null} [metadata=null]
 * @returns {Array<{ name: string, item: string }> | null}
 */
export function getBreadcrumbItems(pathname, metadata = null) {
  if (!pathname) return null;

  const pathOnly = pathname.split('?')[0].split('#')[0];
  const cleanPath = pathOnly.replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();

  const normalizedPath = lowerPath === '/calendar-page' ? '/calendar' : lowerPath;

  if (BREADCRUMB_CONFIG[normalizedPath]) {
    return BREADCRUMB_CONFIG[normalizedPath];
  }

  if (normalizedPath.startsWith('/festivals/')) {
    const slug = normalizedPath.slice('/festivals/'.length);
    const topic = getFestivalTopic(slug);
    if (topic) {
      const festivalName = FESTIVAL_NAMES[slug] || topic.searchQuery || topic.h1;
      const canonicalUrl = (metadata && metadata.canonical) || topic.canonical || `${SITE_ORIGIN}/festivals/${slug}`;
      return [
        { name: 'Home', item: `${SITE_ORIGIN}/` },
        { name: 'Festival Guides', item: `${SITE_ORIGIN}/calendar` },
        { name: festivalName, item: canonicalUrl }
      ];
    }
  }

  return null;
}

/**
 * Builds the route-specific structured data JSON-LD graph.
 *
 * @param {string} pathname
 * @returns {object | null}
 */
export function buildRouteStructuredData(pathname) {
  if (!pathname) return null;

  const pathOnly = pathname.split('?')[0].split('#')[0];
  const cleanPath = pathOnly.replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();

  const normalizedPath = lowerPath === '/calendar-page' ? '/calendar' : lowerPath;

  // Supported routes check
  const isCoreSupported = Boolean(BREADCRUMB_CONFIG[normalizedPath]);
  const isFestivalTopic = normalizedPath.startsWith('/festivals/') && Boolean(getFestivalTopic(normalizedPath.slice('/festivals/'.length)));

  if (!isCoreSupported && !isFestivalTopic) {
    // Utility / unsupported routes (/feedback, /overview, unknown)
    return null;
  }

  const meta = getRouteMetadata(pathname);
  if (!meta || !meta.canonical) return null;

  const canonicalUrl = meta.canonical;
  const graph = [];

  // 1. WebPage Schema
  graph.push({
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: meta.title,
    description: meta.description,
    isPartOf: {
      '@id': `${SITE_ORIGIN}/#website`
    },
    inLanguage: 'en'
  });

  // 2. BreadcrumbList Schema
  const breadcrumbs = getBreadcrumbItems(pathname, meta);
  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.item
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

/**
 * Updates or removes the route-specific JSON-LD script element in document.head.
 *
 * @param {string} pathname
 */
export function updateRouteStructuredData(pathname) {
  if (typeof document === 'undefined') return;

  let scriptEl = document.getElementById(ROUTE_SCRIPT_ID);
  const data = buildRouteStructuredData(pathname);

  if (!data) {
    if (scriptEl && scriptEl.parentNode) {
      scriptEl.parentNode.removeChild(scriptEl);
    }
    return;
  }

  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = ROUTE_SCRIPT_ID;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  scriptEl.textContent = JSON.stringify(data, null, 2);
}

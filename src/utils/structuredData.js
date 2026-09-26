/**
 * Route-specific Structured Data (JSON-LD) manager for WebPage and BreadcrumbList.
 * Preserves the static WebSite and Organization schema defined in index.html.
 */

import { getRouteMetadata, SITE_ORIGIN } from './seoMetadata.js';
import { getFestivalTopic } from '../data/festivalTopics.js';
import { TOKEN_FAQS } from '../data/tokenFaqData.js';
import { TEMPLES } from '../data/templeEvents.js';

export const ROUTE_SCRIPT_ID = 'route-structured-data';

let dynamicTokenFaqs = null;

/**
 * Updates the in-memory dynamic Token FAQ dataset used for FAQPage schema generation.
 * @param {Array} faqs
 */
export function setDynamicTokenFaqs(faqs) {
  if (Array.isArray(faqs) && faqs.length > 0) {
    dynamicTokenFaqs = faqs;
  }
}

/**
 * Updates dynamic FAQ dataset and synchronizes the single route structured-data script if on /tokens.
 * @param {Array} faqs
 */
export function updateTokenFaqStructuredData(faqs) {
  setDynamicTokenFaqs(faqs);
  if (typeof window !== 'undefined') {
    const cleanPath = window.location.pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    if (cleanPath.toLowerCase() === '/tokens') {
      updateRouteStructuredData('/tokens');
    }
  }
}

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

  // 3. FAQPage Schema (Strictly for /tokens only, matching visible FAQ content)
  const effectiveFaqs = (Array.isArray(dynamicTokenFaqs) && dynamicTokenFaqs.length > 0)
    ? dynamicTokenFaqs
    : TOKEN_FAQS;

  const activeFaqsForSchema = effectiveFaqs.filter(
    (faq) => faq.isActive !== false && faq.is_active !== false
  );

  if (normalizedPath === '/tokens' && activeFaqsForSchema.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: activeFaqsForSchema.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // 4. ItemList Schema (Strictly for /temples only, representing the 7 sacred shrines)
  if (normalizedPath === '/temples' && Array.isArray(TEMPLES)) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#itemlist`,
      name: 'The 7 Sacred Shrines of Tirumala & Tirupati',
      numberOfItems: 7,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: TEMPLES.slice(0, 7).map((temple, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'HinduTemple',
          name: temple.name,
          ...(temple.teluguName
            ? { alternateName: temple.teluguName }
            : {}),
          description: temple.description,
          address: {
            '@type': 'PostalAddress',
            addressLocality: temple.location
          }
        }
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

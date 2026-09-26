import { pullGlossaryFromCloud, saveGlossaryTermToCloud, deleteGlossaryTermFromCloud} from "./utils/glossaryCloud";
import useEvents from "./hooks/useEvents";
import useAdmin from "./hooks/useAdmin";
import useTheme from "./hooks/useTheme";
import useLocalStorage from "./hooks/usePersistentState";
import useCurrentIST from "./hooks/useCurrentIST";
import { STORAGE_KEYS } from "./config/storageKeys";
import { APP_CONFIG } from "./config/appConfig";
import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import { loadStoredFeedback, saveStoredFeedback } from './utils/feedbackStorage';
import AdminTopRibbon from './components/layout/AdminTopRibbon';
import TodayHappeningTicker from './components/layout/TodayHappeningTicker';
import TtdLiveStreamModal from './components/layout/TtdLiveStreamModal';
import LogoLightboxModal from './components/layout/LogoLightboxModal';
import NotificationPreferencesModal from './components/layout/NotificationPreferencesModal';
import AppFooter from './components/layout/AppFooter';
import ToastContainer from './components/common/ToastContainer';
import { subscribeToWebPush, unsubscribeFromWebPush, ELIGIBLE_NOTIFICATION_TEMPLES } from './utils/webPush';
import { supabase } from './utils/supabaseClient';
import { updateRouteMetadata } from './utils/seoMetadata';
import { updateRouteStructuredData } from './utils/structuredData';
import { isModifiedClick } from './utils/navigation';

const CalendarView = lazy(() => import('./components/CalendarView'));
const DailySchedule = lazy(() => import('./components/DailySchedule'));
const CommunityFeedback = lazy(() => import('./components/CommunityFeedback'));
const UtsavamGlossary = lazy(() => import('./components/UtsavamGlossary'));
const SSDTokens = lazy(() => import('./components/SSDTokens'));
const AdminPortalModal = lazy(() => import('./components/AdminPortalModal'));
const EventDetailModal = lazy(() => import('./components/EventDetailModal'));
const TempleList = lazy(() => import('./components/TempleList'));
const ReferencesList = lazy(() => import('./components/ReferencesList'));
const FestivalTopicPage = lazy(() => import('./components/FestivalTopicPage'));
const loadInitialEvents = () =>
  import('./data/initialEvents').then(module => module.INITIAL_EVENTS);
import { getFestivalTopic } from './data/festivalTopics';

const ROUTE_MAP = {
  '/': 'home',
  '/calendar': 'calendar-page',
  '/calendar-page': 'calendar-page',
  '/glossary': 'glossary',
  '/sevas': 'sevas',
  '/tokens': 'tokens',
  '/feedback': 'feedback',
  '/temples': 'temples',
  '/references': 'references',
  '/overview': 'home',
};

const TAB_TO_PATH = {
  'home': '/',
  'calendar-page': '/calendar',
  'glossary': '/glossary',
  'sevas': '/sevas',
  'tokens': '/tokens',
  'feedback': '/feedback',
  'temples': '/temples',
  'references': '/references',
  'overview': '/',
};

const PORTAL_CARDS = [
  {
    href: '/calendar',
    icon: '📅',
    badge: 'Interactive',
    title: 'Festival Calendar 2026–2027',
    titleTe: 'ఉత్సవాల క్యాలెండర్ 2026–2027',
    desc: 'Browse multi-day Brahmotsavams, monthly utsavams, Vahana Sevas, and filter events by month and shrine.',
    descTe: 'వార్షిక బ్రహ్మోత్సవాలు, వాహన సేవలు మరియు పర్వదినాల క్యాలెండర్ నెల మరియు ఆలయం వారీగా వీక్షించండి.',
    cta: 'View Calendar',
    ctaTe: 'క్యాలెండర్ చూడండి',
  },
  {
    href: '/sevas',
    icon: '⏰',
    badge: 'Timetable',
    title: 'Daily & Weekly Sevas',
    titleTe: 'నిత్య & వారపు సేవలు',
    desc: 'Srivari temple daily timetable, Nitya Kainkaryams, weekly sevas schedule, and Anna Prasadam timings.',
    descTe: 'శ్రీవారి ఆలయ దినచర్య, నిత్య కైంకర్యాలు, వారపు ప్రత్యేక సేవలు మరియు అన్నప్రసాదం సమయాలు.',
    cta: 'View Seva Schedule',
    ctaTe: 'సేవల పట్టిక చూడండి',
  },
  {
    href: '/tokens',
    icon: '🎟️',
    badge: 'Live Status',
    title: 'SSD & DD Darshan Tokens',
    titleTe: 'SSD & DD దర్శన టోకెన్లు',
    desc: 'Counter locations, live status updates, reporting rules, dress code, and issuance guidelines in Tirupati.',
    descTe: 'తిరుపతిలోని ఉచిత దర్శన టోకెన్ కౌంటర్లు, లైవ్ సమాచారం, రిపోర్టింగ్ నియమాలు మరియు మార్గదర్శకాలు.',
    cta: 'Check Token Status',
    ctaTe: 'టోకెన్ వివరాలు చూడండి',
  },
  {
    href: '/temples',
    icon: '🏛️',
    badge: '7 Shrines',
    title: 'The 7 Sacred Shrines',
    titleTe: 'సప్త దివ్య పుణ్యక్షేత్రాలు',
    desc: 'Spiritual significance, deity lore, temple timings, dress codes, and locations of Tirumala & Tirupati shrines.',
    descTe: 'తిరుమల మరియు తిరుపతి పరిసరాలలోని 7 ప్రధాన దివ్య క్షేత్రాల విశిష్టత, సమయాలు మరియు దర్శన వివరాలు.',
    cta: 'Explore Temples',
    ctaTe: 'క్షేత్రాలు అన్వేషించండి',
  },
  {
    href: '/glossary',
    icon: '📖',
    badge: 'Meanings',
    title: 'Utsavam & Ritual Glossary',
    titleTe: 'ఉత్సవ నిఘంటువు',
    desc: 'Vedic meanings of ritual terms, Vahanams, sacred Naivedyams, and Puranic festival backgrounds.',
    descTe: 'ఉత్సవ పదాల అర్థాలు, వాహన విశేషాలు, శ్రీవారి నైవేద్యాలు మరియు వైదిక సాంప్రదాయాల సమగ్ర నిఘంటువు.',
    cta: 'Search Glossary',
    ctaTe: 'నిఘంటువు శోధించండి',
  },
  {
    href: '/references',
    icon: '📜',
    badge: 'Archives',
    title: 'Historical Literature & References',
    titleTe: 'చారిత్రక ఆధారాలు & గ్రంథాలు',
    desc: 'Documentary research, Agama ritual manuals, temple stone inscriptions, and Annamacharya archives.',
    descTe: 'ఆగమ శాస్త్ర నియమావళి, ప్రాచీన ఆలయ శాసనాలు మరియు తాళ్లపాక అన్నమయ్య సంకీర్తనా భాండాగార ఆధారాలు.',
    cta: 'View References',
    ctaTe: 'ఆధారాలు చూడండి',
  },
];

function getFestivalSlugFromPath(pathname) {
  if (!pathname) return null;
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();
  if (lowerPath.startsWith('/festivals/')) {
    const slug = lowerPath.slice('/festivals/'.length);
    if (getFestivalTopic(slug)) {
      return slug;
    }
  }
  return null;
}

function isValidRoute(pathname) {
  if (!pathname) return false;
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();
  if (ROUTE_MAP[lowerPath]) return true;
  if (lowerPath.startsWith('/festivals/')) {
    const slug = lowerPath.slice('/festivals/'.length);
    return Boolean(getFestivalTopic(slug));
  }
  return false;
}

function getTabFromPathname(pathname) {
  if (!pathname) return 'home';
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();
  if (lowerPath.startsWith('/festivals/')) {
    const slug = lowerPath.slice('/festivals/'.length);
    if (getFestivalTopic(slug)) {
      return 'festival-topic';
    }
    return 'calendar-page';
  }
  return ROUTE_MAP[lowerPath] || 'home';
}

function getPathnameFromTab(tab) {
  return TAB_TO_PATH[tab] || '/';
}

export default function App() {
  // Custom URL Routing & Tab state: 'calendar-page', 'overview', 'temples', 'references', 'sevas', 'feedback', 'festival-topic'
  const [activeTab, setActiveTabState] = useState(() => getTabFromPathname(window.location.pathname));
  const [festivalSlug, setFestivalSlug] = useState(() => getFestivalSlugFromPath(window.location.pathname));
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  const setActiveTab = (tab, replace = false) => {
    setActiveTabState(tab);
    setFestivalSlug(null);
    const targetPath = getPathnameFromTab(tab);
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab }, '', targetPath);
      } else {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
    setCurrentPath(targetPath);
  };

  const handleNavigateHome = () => {
    setActiveTabState('home');
    setFestivalSlug(null);
    if (window.location.pathname !== '/') {
      window.history.pushState({ tab: 'home' }, '', '/');
    }
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCalendarSearch = (searchQuery) => {
    setActiveTabState('calendar-page');
    setFestivalSlug(null);
    const targetPath = `/calendar?search=${encodeURIComponent(searchQuery || '')}`;
    window.history.pushState({ tab: 'calendar-page' }, '', targetPath);
    setCurrentPath(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePath = (path) => {
    const cleanPath = path.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    const lowerPath = cleanPath.toLowerCase();
    const tab = getTabFromPathname(lowerPath);
    const slug = getFestivalSlugFromPath(lowerPath);
    setActiveTabState(tab);
    setFestivalSlug(slug);
    if (window.location.pathname !== path) {
      window.history.pushState({ tab }, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync route-specific SEO metadata and structured data
  useEffect(() => {
    updateRouteMetadata(window.location.pathname);
    updateRouteStructuredData(window.location.pathname);
  }, [currentPath, activeTab]);

  const eventsListRef = useRef(null);

  useEffect(() => {
    const handlePopState = () => {
      const currentTab = getTabFromPathname(window.location.pathname);
      const slug = getFestivalSlugFromPath(window.location.pathname);
      setActiveTabState(currentTab);
      setFestivalSlug(slug);
      setCurrentPath(window.location.pathname);

      // Deep linking support when navigating browser history
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const eventId = searchParams.get('event');
        if (eventId && Array.isArray(eventsListRef.current) && eventsListRef.current.length > 0) {
          const matched = eventsListRef.current.find(e => e && String(e.id) === String(eventId));
          if (matched) setSelectedEventModal(matched);
        } else if (!eventId) {
          setSelectedEventModal(null);
        }
      } catch (err) {
        console.warn('Popstate event link handling error:', err);
      }
    };

    window.addEventListener('popstate', handlePopState);

    const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/';
    if (!isValidRoute(cleanPath)) {
      window.history.replaceState({ tab: 'home' }, '', '/' + window.location.search + window.location.hash);
      setCurrentPath('/');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const [lang, setLang] = useState('en'); // 'en' | 'te'

  // Theme Mode state ('dark' | 'light') 
  const { themeMode, setThemeMode, toggleTheme } = useTheme();

  const [selectedTemple, setSelectedTemple] = useState('all');
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  // Admin Modal States
  const [adminModalMode, setAdminModalMode] = useState(null); // null | 'login' | 'edit-event' | 'add-event' | 'feedback-inbox'
  const [targetEventToEdit, setTargetEventToEdit] = useState(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Admin Logged In State
  const { isAdminLoggedIn, setIsAdminLoggedIn, login, logout } = useAdmin();

  // Dynamic Events State Initializer with complete merge for edited default events & deleted tracking
  const [initialEvents, setInitialEvents] = useState(null);

  const {
    events: eventsList,
    addEvent,
    updateEvent,
    deleteEvent,
    eventsInitialized,
  } = useEvents(initialEvents);

  eventsListRef.current = eventsList;

  // Deep linking: Automatically open event modal if ?event=<id> is present in URL on direct load
  const handledDeepLinkRef = useRef(false);

  useEffect(() => {
    if (handledDeepLinkRef.current) return;
    if (!eventsInitialized || !Array.isArray(eventsList) || eventsList.length === 0) return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const eventId = searchParams.get('event');
      if (eventId) {
        const matched = eventsList.find(e => e && String(e.id) === String(eventId));
        if (matched) {
          setSelectedEventModal(matched);
        }
      }
      handledDeepLinkRef.current = true;
    } catch (err) {
      console.warn('Failed to parse event deep link:', err);
    }
  }, [eventsInitialized, eventsList]);

  useEffect(() => {
    let cancelled = false;

    loadInitialEvents()
      .then(loadedEvents => {
        if (!cancelled) {
          setInitialEvents(loadedEvents);
        }
      })
      .catch(err => {
        console.error('Failed to load initial events:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Defensive Community Feedback Submissions State Initializer
  const [feedbackList, setFeedbackList] = useState(() => loadStoredFeedback());

  useEffect(() => {
    saveStoredFeedback(feedbackList);
  }, [feedbackList]);

  // Notifications State & Preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try {
      return localStorage.getItem('tirumala_notifications_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [subscribedTemples, setSubscribedTemples] = useState(() => {
    try {
      const stored = localStorage.getItem('tirumala_notification_temples');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [...ELIGIBLE_NOTIFICATION_TEMPLES];
  });

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const handleToggleNotifications = () => {
    setIsNotifModalOpen(true);
  };

  const handleSaveNotificationPreferences = async (selectedTemples) => {
    const sub = await subscribeToWebPush(supabase, selectedTemples);
    if (sub) {
      setNotificationsEnabled(true);
      setSubscribedTemples(selectedTemples);
      try {
        localStorage.setItem('tirumala_notifications_enabled', 'true');
        localStorage.setItem('tirumala_notification_temples', JSON.stringify(selectedTemples));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDisableNotifications = async () => {
    await unsubscribeFromWebPush(supabase);
    setNotificationsEnabled(false);
    try {
      localStorage.setItem('tirumala_notifications_enabled', 'false');
    } catch (e) {
      console.error(e);
    }
  };

  // TTD YouTube Live Stream State (Default to Official SVBC/TTD Live Link)
  const DEFAULT_TTD_LIVE_URL = 'https://www.youtube.com/live/Z6nHz5CU10I?si=s15-FIsreA6ltSQl';

  const [ttdLiveUrl, setTtdLiveUrl] = useState(() => {
    try {
      return localStorage.getItem('tirumala_ttd_live_url') || DEFAULT_TTD_LIVE_URL;
    } catch {
      return DEFAULT_TTD_LIVE_URL;
    }
  });
  const [isLiveStreamModalOpen, setIsLiveStreamModalOpen] = useState(false);

  const handleSaveTtdLiveUrl = (newUrl) => {
    setTtdLiveUrl(newUrl);
    try {
      localStorage.setItem('tirumala_ttd_live_url', newUrl);
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Custom Glossary Edits State
  const [customGlossaryEdits, setCustomGlossaryEdits] = useState(() => {
    try {
      const stored = localStorage.getItem('tirumala_custom_glossary_edits');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    let cancelled = false;

    async function syncGlossaryFromCloud() {
      const result = await pullGlossaryFromCloud();

      if (
        !result.success ||
        !Array.isArray(result.glossary)
      ) {
        return;
      }

      const edits = {};

      for (const term of result.glossary) {
        edits[term.id] = term;
      }

      if (cancelled) return;

      setCustomGlossaryEdits(prev => {
        const merged = {
          ...edits,
          ...prev
        };

        localStorage.setItem(
          "tirumala_custom_glossary_edits",
          JSON.stringify(merged)
        );

        return merged;
      });
    }

    syncGlossaryFromCloud();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveGlossaryEdit = async (termId, updatedData) => {
    const cleanedData = {
  ...updatedData,
  images: Array.isArray(updatedData.images)
    ? updatedData.images.filter(img => {
        if (typeof img === 'string') {
          return img.trim() !== '';
        }

        return (
          img &&
          typeof img.url === 'string' &&
          img.url.trim() !== ''
        );
      })
    : []
};
    setCustomGlossaryEdits(prev => {
      const next = {
        ...prev,
        [termId]: cleanedData
      };

      try {
        localStorage.setItem(
          "tirumala_custom_glossary_edits",
          JSON.stringify(next)
        );
      } catch (e) {
        console.error(e);
      }

      return next;
    });

    const result = await saveGlossaryTermToCloud({
      id: termId,
      ...cleanedData
    });

    if (!result.success) {
      console.warn("Glossary cloud sync failed:", result.message);
    } else {
      console.log("✅ Glossary synced to cloud");
    }
  };

  const handleDeleteGlossaryTerm = async (termId) => {
    if (!termId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this glossary term?"
    );

    if (!confirmed) return;

    const result = await deleteGlossaryTermFromCloud(termId);

    if (!result.success) {
      console.warn(
        "Glossary cloud delete failed:",
        result.message
      );

      alert(
        `Glossary cloud delete failed: ${result.message}`
      );

      return;
    }

    // Remove from local custom glossary edits
    setCustomGlossaryEdits(prev => {
      const next = { ...prev };

      delete next[termId];

      try {
        localStorage.setItem(
          "tirumala_custom_glossary_edits",
          JSON.stringify(next)
        );
      } catch (e) {
        console.error(e);
      }

      return next;
    });

    // Clear the selected glossary term
    setTargetGlossaryTermId(null);
    setTargetGlossaryTermToEdit(null);

    // Close the admin editor
    setAdminModalMode(null);

    console.log("✅ Glossary term deleted from cloud");
  };

  // Direct Glossary Navigation State
  const [targetGlossaryTermId, setTargetGlossaryTermId] = useState(null);
  const [targetGlossaryTermToEdit, setTargetGlossaryTermToEdit] = useState(null);

  const handleNavigateToGlossary = (termId) => {
    setTargetGlossaryTermId(termId);
    setActiveTab('glossary');
  };

  const handleOpenAdminEditTerm = (term) => {
    setTargetGlossaryTermToEdit(term);
    setAdminModalMode('edit-glossary');
  };

  // Detect Today's Active Event for Rolling Ticker (Strict Rule A & I: IST canonical comparison)
  const currentIST = useCurrentIST();
  const todayStr = currentIST.dateStr;

  const safeEventsList = Array.isArray(eventsList) ? eventsList : [];
  const todayEvent = useMemo(() => {
    if (!Array.isArray(safeEventsList)) return null;
    return safeEventsList.find(e => {
      if (!e || typeof e !== 'object' || !e.startDate) return false;
      const end = e.endDate || e.startDate;
      return e.startDate <= todayStr && todayStr <= end;
    });
  }, [safeEventsList, todayStr]);

  // Automatic Daily Desktop/Mobile Push Notification for Today's Active Utsavam
  // Automatic Daily Desktop/Mobile Push Notification for Today's Active Utsavam
useEffect(() => {
  if (
    !notificationsEnabled ||
    !todayEvent ||
    !('Notification' in window) ||
    Notification.permission !== 'granted'
  ) {
    return;
  }

  const lastNotifiedDate = localStorage.getItem(
    'tirumala_last_notified_date'
  );

  if (lastNotifiedDate === todayStr) {
    return;
  }

  const showTodayNotification = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification(
          '🌸 Today Tirumala Utsavam Alert!',
          {
            body: `${todayEvent.title} is taking place today at Tirumala Tirupati temples! Tap to view details.`,
            icon: '/logo-64.png',
            badge: '/logo-64.png',
            data: {
              url: 'https://thetirumalaverse.in/'
            },
            tag: `tirumala-daily-${todayStr}`
          }
        );

        localStorage.setItem(
          'tirumala_last_notified_date',
          todayStr
        );
      }
    } catch (error) {
      console.warn(
        'Could not show daily Utsavam notification:',
        error
      );
    }
  };

  showTodayNotification();
}, [notificationsEnabled, todayEvent, todayStr]);

  // Feedback Handlers
  const handleAddFeedback = (newFeedback) => {
    setFeedbackList(prev => [newFeedback, ...prev]);
  };

  const handleUpdateFeedback = (updatedFeedback) => {
    setFeedbackList(prev => prev.map(f => f.id === updatedFeedback.id ? updatedFeedback : f));
  };

  const handleDeleteFeedback = (feedbackId) => {
    setFeedbackList(prev => prev.filter(f => f.id !== feedbackId));
  };

  // Admin CRUD operations for events
  const handleAddEvent = addEvent;
  const handleUpdateEvent = updateEvent;
  const handleDeleteEvent = deleteEvent;

  const handleOpenEditModalForEvent = (event) => {
    setTargetEventToEdit(event);
    setAdminModalMode('edit-event');
  };

  const handleOpenAddEventModal = () => {
    setTargetEventToEdit(null);
    setAdminModalMode('add-event');
  };

  const handleSelectTempleFromHeroOrList = (templeId) => {
    setSelectedTemple(templeId);
    setActiveTab('calendar-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const safeFeedbackList = Array.isArray(feedbackList) ? feedbackList : [];
  const newFeedbackCount = safeFeedbackList.filter(f => f.status === 'New').length;

  if (!eventsInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="text-[#FFD700] font-serif text-lg">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      
      {/* SEAMLESS ADMIN TOP BAR */}
      {isAdminLoggedIn && (
        <AdminTopRibbon
          onOpenAddEventModal={handleOpenAddEventModal}
          onOpenAdminModalMode={setAdminModalMode}
          feedbackCount={safeFeedbackList.length}
          newFeedbackCount={newFeedbackCount}
          onLogout={logout}
        />
      )}

      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateHome={handleNavigateHome}
        lang={lang}
        setLang={setLang}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={(requestedMode) => {
          if (isAdminLoggedIn) {
            setAdminModalMode(requestedMode || 'feedback-inbox');
          } else {
            setAdminModalMode('login');
          }
        }}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
        ttdLiveUrl={ttdLiveUrl}
        onOpenLiveStream={() => setIsLiveStreamModalOpen(true)}
      />

      {/* ROLLING TICKER BANNER FOR TODAY'S HAPPENING EVENT */}
      <TodayHappeningTicker
        todayEvent={todayEvent}
        lang={lang}
        onSelectEvent={setSelectedEventModal}
      />

      {/* Hero Banner (Shown on Home/Overview tab) */}
      {(activeTab === 'home' || activeTab === 'overview') && (
        <HeroBanner
          lang={lang}
          events={eventsList}
          onSelectTemple={handleSelectTempleFromHeroOrList}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow container py-4">
        <Suspense
          fallback={
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="text-[#FFD700] font-serif text-lg">
                Loading...
              </div>
            </div>
          }
        >
          {/* HOMEPAGE PORTAL HUB SECTION */}
          {(activeTab === 'home' || activeTab === 'overview') && (
            <div className="space-y-8 pb-8">
              {/* Homepage Dedicated H1 & Intro Banner */}
              <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {lang === 'en' ? (
                    <>The Tirumala Verse: <span className="gold-gradient-text">Independent Guide to Tirumala & Tirupati Temples</span></>
                  ) : (
                    <>ది తిరుమల వర్స్: <span className="gold-gradient-text">తిరుమల & తిరుపతి క్షేత్రాల స్వతంత్ర దర్శిని</span></>
                  )}
                </h1>
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                  {lang === 'en'
                    ? 'Explore authentic festival schedules, daily seva timetables, free SSD & DD token guidance, sacred temple histories, and ritual glossaries curated for devotees.'
                    : 'భక్తుల సౌకర్యార్థం అధికారిక ఉత్సవ పట్టికలు, నిత్య సేవా సమయాలు, ఉచిత దర్శన టోకెన్ల సమాచారం, క్షేత్ర విశేషాలు మరియు సమగ్ర వైదిక నిఘంటువు.'}
                </p>
              </div>

              {/* Six Pillar Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PORTAL_CARDS.map((card) => (
                  <a
                    key={card.href}
                    href={card.href}
                    onClick={(e) => {
                      if (isModifiedClick(e)) return;
                      e.preventDefault();
                      handleNavigatePath(card.href);
                    }}
                    className="glass-card p-6 rounded-2xl border border-[#D4AF37]/30 hover:border-[#FFD700] hover:bg-[#141923]/90 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:-translate-y-1 block text-inherit no-underline"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-2.5 rounded-xl bg-[#0B0E14] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                          {card.icon}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700]">
                          {card.badge}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors">
                        {lang === 'en' ? card.title : card.titleTe}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                        {lang === 'en' ? card.desc : card.descTe}
                      </p>
                    </div>
                    <div className="pt-4 mt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-bold text-[#FFD700] group-hover:text-white">
                      <span>{lang === 'en' ? card.cta : card.ctaTe}</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* DEDICATED FULL-PAGE CALENDAR SECTION */}
          {activeTab === 'calendar-page' && (
            <div className="space-y-4">
              <CalendarView
                events={safeEventsList}
                lang={lang}
                selectedTemple={selectedTemple}
                setSelectedTemple={setSelectedTemple}
                onSelectEvent={setSelectedEventModal}
                isAdminLoggedIn={isAdminLoggedIn}
                onEditEvent={handleOpenEditModalForEvent}
                onDeleteEvent={handleDeleteEvent}
                onOpenAddEvent={handleOpenAddEventModal}
              />
            </div>
          )}

          {/* SACRED SHRINES SECTION */}
          {activeTab === 'temples' && (
            <TempleList
              lang={lang}
              onSelectTemple={handleSelectTempleFromHeroOrList}
              onNavigate={handleNavigatePath}
              onNavigateToGlossary={handleNavigateToGlossary}
            />
          )}

          {/* REFERENCES & HISTORICAL LITERATURE SECTION */}
          {activeTab === 'references' && (
            <ReferencesList
              lang={lang}
              onNavigate={handleNavigatePath}
              onNavigateToGlossary={handleNavigateToGlossary}
            />
          )}

          {/* UTSAVAM & FESTIVAL GLOSSARY SECTION */}
          {activeTab === 'glossary' && (
            <UtsavamGlossary
              lang={lang}
              targetTermId={targetGlossaryTermId}
              customGlossaryEdits={customGlossaryEdits}
              isAdminLoggedIn={isAdminLoggedIn}
              onOpenAdminEditTerm={handleOpenAdminEditTerm}
              onNavigate={handleNavigatePath}
            />
          )}

          {/* DAILY SEVAS & ANNA PRASADAM SECTION */}
          {activeTab === 'sevas' && (
            <DailySchedule
              lang={lang}
              themeMode={themeMode}
              onNavigateToGlossary={handleNavigateToGlossary}
              onNavigate={handleNavigatePath}
            />
          )}

          {/* SSD & DD TOKENS SECTION */}
          {activeTab === 'tokens' && (
            <SSDTokens
              lang={lang}
              themeMode={themeMode}
            />
          )}

          {/* COMMUNITY FEEDBACK SYSTEM SECTION */}
          {activeTab === 'feedback' && (
            <CommunityFeedback
              lang={lang}
              onSubmitFeedback={handleAddFeedback}
            />
          )}

          {/* FESTIVAL TOPIC PAGE SECTION */}
          {activeTab === 'festival-topic' && (
            <FestivalTopicPage
              slug={festivalSlug || 'garuda-vahanam'}
              events={safeEventsList}
              lang={lang}
              themeMode={themeMode}
              onNavigateToCalendarSearch={handleNavigateToCalendarSearch}
              onSelectEvent={setSelectedEventModal}
            />
          )}
        </Suspense>
      </main>

      {/* Event Detail Modal Popup */}
      {selectedEventModal && (
        <Suspense fallback={null}>
          <EventDetailModal
            event={selectedEventModal}
            onClose={() => {
              setSelectedEventModal(null);
              try {
                if (window.location.search.includes('event=')) {
                  const searchParams = new URLSearchParams(window.location.search);
                  searchParams.delete('event');
                  const remaining = searchParams.toString();
                  const newUrl = window.location.pathname + (remaining ? `?${remaining}` : '') + window.location.hash;
                  window.history.replaceState(window.history.state, '', newUrl);
                }
              } catch (e) {
                console.warn('Failed to clean event parameter from URL:', e);
              }
            }}
            lang={lang}
            isAdminLoggedIn={isAdminLoggedIn}
            onEditEvent={handleOpenEditModalForEvent}
            onNavigateToGlossary={handleNavigateToGlossary}
          />
        </Suspense>
      )}

      {/* Admin Quick Action Modal */}
      {adminModalMode && (
        <Suspense fallback={null}>
          <AdminPortalModal
            mode={adminModalMode}
            onClose={() => setAdminModalMode(null)}
            lang={lang}
            themeMode={themeMode}
            events={safeEventsList}
            login={login}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            targetEvent={targetEventToEdit}
            feedbackList={safeFeedbackList}
            onUpdateFeedback={handleUpdateFeedback}
            onDeleteFeedback={handleDeleteFeedback}
            targetGlossaryTerm={targetGlossaryTermToEdit}
            onSaveGlossaryEdit={handleSaveGlossaryEdit}
            onDeleteGlossaryTerm={handleDeleteGlossaryTerm}
            ttdLiveUrl={ttdLiveUrl}
            onSaveTtdLiveUrl={handleSaveTtdLiveUrl}
          />
        </Suspense>
      )}

      {/* TTD YOUTUBE LIVE STREAM EMBEDDED MODAL */}
      <TtdLiveStreamModal
        isOpen={isLiveStreamModalOpen}
        ttdLiveUrl={ttdLiveUrl}
        onClose={() => setIsLiveStreamModalOpen(false)}
      />

      {/* LOGO FULL-SIZE LIGHTBOX MODAL POPUP */}
      <LogoLightboxModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* EVENT NOTIFICATION PREFERENCES MODAL */}
      <NotificationPreferencesModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        lang={lang}
        themeMode={themeMode}
        notificationsEnabled={notificationsEnabled}
        currentTemples={subscribedTemples}
        onSave={handleSaveNotificationPreferences}
        onDisable={handleDisableNotifications}
      />

      {/* Footer with Disclaimer & Feedback Link */}
      <AppFooter
        lang={lang}
        onNavigate={handleNavigatePath}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenFeedbackTab={() => {
          setActiveTab('feedback');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Toast Notifications Container */}
      <ToastContainer themeMode={themeMode} />
    </div>
  );
}

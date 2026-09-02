import { pullGlossaryFromCloud, saveGlossaryTermToCloud, deleteGlossaryTermFromCloud} from "./utils/glossaryCloud";
import useEvents from "./hooks/useEvents";
import useAdmin from "./hooks/useAdmin";
import useTheme from "./hooks/useTheme";
import useLocalStorage from "./hooks/usePersistentState";
import { STORAGE_KEYS } from "./config/storageKeys";
import { APP_CONFIG } from "./config/appConfig";
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import { loadStoredFeedback, saveStoredFeedback } from './utils/feedbackStorage';
import AdminTopRibbon from './components/layout/AdminTopRibbon';
import TodayHappeningTicker from './components/layout/TodayHappeningTicker';
import TtdLiveStreamModal from './components/layout/TtdLiveStreamModal';
import LogoLightboxModal from './components/layout/LogoLightboxModal';
import AppFooter from './components/layout/AppFooter';
import ToastContainer from './components/common/ToastContainer';
import { subscribeToWebPush, unsubscribeFromWebPush } from './utils/webPush';
import { supabase } from './utils/supabaseClient';

const CalendarView = lazy(() => import('./components/CalendarView'));
const DailySchedule = lazy(() => import('./components/DailySchedule'));
const CommunityFeedback = lazy(() => import('./components/CommunityFeedback'));
const UtsavamGlossary = lazy(() => import('./components/UtsavamGlossary'));
const SSDTokens = lazy(() => import('./components/SSDTokens'));
const AdminPortalModal = lazy(() => import('./components/AdminPortalModal'));
const EventDetailModal = lazy(() => import('./components/EventDetailModal'));
const TempleList = lazy(() => import('./components/TempleList'));
const ReferencesList = lazy(() => import('./components/ReferencesList'));
const loadInitialEvents = () =>
  import('./data/initialEvents').then(module => module.INITIAL_EVENTS);

const ROUTE_MAP = {
  '/': 'calendar-page',
  '/calendar': 'calendar-page',
  '/calendar-page': 'calendar-page',
  '/glossary': 'glossary',
  '/sevas': 'sevas',
  '/tokens': 'tokens',
  '/feedback': 'feedback',
  '/temples': 'temples',
  '/references': 'references',
  '/overview': 'overview',
};

const TAB_TO_PATH = {
  'calendar-page': '/',
  'glossary': '/glossary',
  'sevas': '/sevas',
  'tokens': '/tokens',
  'feedback': '/feedback',
  'temples': '/temples',
  'references': '/references',
  'overview': '/overview',
};

function getTabFromPathname(pathname) {
  if (!pathname) return 'calendar-page';
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return ROUTE_MAP[cleanPath.toLowerCase()] || 'calendar-page';
}

function getPathnameFromTab(tab) {
  return TAB_TO_PATH[tab] || '/';
}

export default function App() {
  // Custom URL Routing & Tab state: 'calendar-page', 'overview', 'temples', 'references', 'sevas', 'feedback'
  const [activeTab, setActiveTabState] = useState(() => getTabFromPathname(window.location.pathname));

  const setActiveTab = (tab, replace = false) => {
    setActiveTabState(tab);
    const targetPath = getPathnameFromTab(tab);
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab }, '', targetPath);
      } else {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const currentTab = getTabFromPathname(window.location.pathname);
      setActiveTabState(currentTab);
    };

    window.addEventListener('popstate', handlePopState);

    const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/';
    if (!ROUTE_MAP[cleanPath.toLowerCase()]) {
      window.history.replaceState({ tab: 'calendar-page' }, '', '/');
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

  // Notifications State
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try {
      return localStorage.getItem('tirumala_notifications_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const sub = await subscribeToWebPush(supabase);
      if (sub) {
        setNotificationsEnabled(true);
        localStorage.setItem('tirumala_notifications_enabled', 'true');
      }
    } else {
      await unsubscribeFromWebPush(supabase);
      setNotificationsEnabled(false);
      localStorage.setItem('tirumala_notifications_enabled', 'false');
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
    setCustomGlossaryEdits(prev => {
      const next = {
        ...prev,
        [termId]: updatedData
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
      ...updatedData
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

  // Detect Today's Active Event for Rolling Ticker
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const safeEventsList = Array.isArray(eventsList) ? eventsList : [];
  const todayEvent = useMemo(() => {
    if (!Array.isArray(safeEventsList)) return null;
    return safeEventsList.find(e => e && typeof e === 'object' && e.startDate && e.endDate && e.startDate <= todayStr && e.endDate >= todayStr);
  }, [safeEventsList, todayStr]);

  // Automatic Daily Desktop/Mobile Push Notification for Today's Active Utsavam
  useEffect(() => {
    if (notificationsEnabled && todayEvent && 'Notification' in window && Notification.permission === 'granted') {
      const lastNotifiedDate = localStorage.getItem('tirumala_last_notified_date');
      if (lastNotifiedDate !== todayStr) {
        new Notification('🌸 Today Tirumala Utsavam Alert!', {
          body: `${todayEvent.title} is taking place today at Tirumala Tirupati temples! Tap to view details.`,
          icon: '/logo-64.png',
          badge: '/logo-64.png'
        });
        localStorage.setItem('tirumala_last_notified_date', todayStr);
      }
    }
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

      {/* Hero Banner (Shown on Overview tab) */}
      {activeTab === 'overview' && (
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

          {/* OVERVIEW SECTION */}
          {activeTab === 'overview' && (
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
          )}

          {/* SACRED SHRINES SECTION */}
          {activeTab === 'temples' && (
            <TempleList
              lang={lang}
              onSelectTemple={handleSelectTempleFromHeroOrList}
            />
          )}

          {/* REFERENCES & HISTORICAL LITERATURE SECTION */}
          {activeTab === 'references' && (
            <ReferencesList
              lang={lang}
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
            />
          )}

          {/* DAILY SEVAS & ANNA PRASADAM SECTION */}
          {activeTab === 'sevas' && (
            <DailySchedule
              lang={lang}
              themeMode={themeMode}
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
        </Suspense>
      </main>

      {/* Event Detail Modal Popup */}
      {selectedEventModal && (
        <Suspense fallback={null}>
          <EventDetailModal
            event={selectedEventModal}
            onClose={() => setSelectedEventModal(null)}
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

      {/* Footer with Disclaimer & Feedback Link */}
      <AppFooter
        lang={lang}
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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock as ClockIcon,
  MessageSquare,
  Globe,
  Lock,
  Sun,
  Moon,
  BookOpen
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  lang, 
  setLang, 
  themeMode, 
  setThemeMode, 
  onOpenAdmin,
  onOpenLogoModal,
  isAdminLoggedIn,
  notificationsEnabled,
  onToggleNotifications,
  ttdLiveUrl,
  onOpenLiveStream
}) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showRightFade, setShowRightFade] = useState(false);

  const navRef = useRef(null);
  const tabRefs = useRef({});

  const checkNavScroll = useCallback(() => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      const hasMoreRight = scrollLeft + clientWidth < scrollWidth - 6;
      setShowRightFade(hasMoreRight);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  useEffect(() => {
    checkNavScroll();
    window.addEventListener('resize', checkNavScroll);
    return () => window.removeEventListener('resize', checkNavScroll);
  }, [checkNavScroll, lang, activeTab]);

  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl && navRef.current) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/95 border-b border-[#D4AF37]/30 shadow-2xl transition-colors">
      
      {/* Main Header Navigation Container */}
      <div className="container py-2 space-y-2">
        
        {/* TOP ROW: Brand Logo & Title on Left + Control Buttons on Right */}
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 group min-w-0 flex-1 ml-0.5 sm:ml-0">
            <div 
              onClick={onOpenLogoModal}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#FFD700] shadow-md group-hover:scale-110 transition-transform bg-[#E65100] flex items-center justify-center cursor-pointer shrink-0"
              title="Click to view Logo in full size"
            >
              <img 
                src="/logo-64.png" 
                alt="Tirumala Logo" 
                className="w-full h-full object-contain p-0.5" 
                style={{ width: '32px', height: '32px' }}
              />
            </div>

            <div onClick={() => setActiveTab('calendar-page')} className="cursor-pointer min-w-0 flex-1">
              <h1 className="font-serif text-sm sm:text-2xl font-extrabold gold-gradient-text tracking-tight leading-tight !block w-full truncate">
                The Tirumala Verse
              </h1>
              <p className="hidden sm:block text-xs text-[#94A3B8] tracking-wider font-medium">
                {lang === 'en' ? 'Your Independent Guide to Tirumala' : 'మీ స్వతంత్ర తిరుమల దివ్య దర్శిని'}
              </p>
            </div>
          </div>

          {/* CONTROL BUTTONS: THEME, ADMIN & LANGUAGE (Ultra-compact on phone screens) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {!isOnline && (
              <span className="px-1.5 py-0.5 rounded-lg bg-red-900/80 border border-red-500 text-red-200 text-[10px] font-bold flex items-center gap-1 shadow animate-pulse" title="Network disconnected - Serving cached events">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}

            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="px-2 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1 shadow hover:scale-105 transition-all"
                title="Install Tirumala Utsavam App"
              >
                <span>📱 <span className="hidden sm:inline">Install</span></span>
              </button>
            )}

            {/* DESKTOP TTD YOUTUBE LIVE STREAM BUTTON (≥640px ONLY) */}
            {ttdLiveUrl && (
              <div className="hidden sm:block shrink-0">
                <button
                  onClick={onOpenLiveStream}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-lg shrink-0"
                  title="Watch TTD Daily YouTube Live Stream"
                >
                  <span>🔴 TTD Live</span>
                </button>
              </div>
            )}

            {/* NOTIFICATIONS TOGGLE BUTTON */}
            <button
              onClick={onToggleNotifications}
              aria-label={
                notificationsEnabled
                  ? (lang === 'en' ? 'Manage notification preferences' : 'నోటిఫికేషన్ ప్రాధాన్యతలను నిర్వహించండి')
                  : (lang === 'en' ? 'Enable event notifications' : 'ఈవెంట్ నోటిఫికేషన్లను ప్రారంభించండి')
              }
              className={`w-[30px] h-[30px] sm:w-auto sm:h-auto p-1 sm:px-2 sm:py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors border ${
                notificationsEnabled
                  ? 'bg-amber-500/20 border-[#FFD700] text-[#FFD700]'
                  : 'bg-[#141923] border-[#D4AF37]/40 text-[#94A3B8] hover:text-[#FFD700]'
              }`}
              title={notificationsEnabled ? (lang === 'en' ? 'Manage Event Notification Preferences' : 'నోటిఫికేషన్ ప్రాధాన్యతలు') : (lang === 'en' ? 'Enable Event Notifications' : 'ఈవెంట్ నోటిఫికేషన్లు')}
            >
              <span>{notificationsEnabled ? '🔔' : '🔕'}</span>
              <span className="hidden sm:inline text-[11px]">
                {notificationsEnabled ? 'Alerts On' : 'Alerts'}
              </span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              aria-label={
                themeMode === 'dark'
                  ? (lang === 'en' ? 'Switch to Light Mode' : 'లైట్ మోడ్‌కి మారండి')
                  : (lang === 'en' ? 'Switch to Dark Mode' : 'డార్క్ మోడ్‌కి మారండి')
              }
              className="w-[30px] h-[30px] sm:w-auto sm:h-auto p-1 sm:px-2.5 sm:py-1 rounded-lg bg-[#141923] border border-[#D4AF37]/50 text-[#FFD700] hover:bg-[#D4AF37]/20 transition-colors flex items-center justify-center gap-1 text-xs font-bold shadow-sm"
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span className="hidden sm:inline text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span className="hidden sm:inline text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Admin Login Button */}
            <button
              onClick={onOpenAdmin}
              className="w-[30px] h-[30px] sm:w-auto sm:h-auto p-1 sm:px-2.5 sm:py-1 rounded-lg bg-[#FF5722]/20 border border-[#FF5722]/50 text-[#FF5722] hover:bg-[#FF5722]/30 text-xs font-extrabold flex items-center justify-center gap-1 transition-colors shadow-sm"
              title="Admin Login"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Admin' : 'అడ్మిన్'}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
              className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-[#D4AF37]/50 bg-[#141923] text-[#FFD700] text-[11px] sm:text-xs font-extrabold flex items-center gap-1 hover:bg-[#D4AF37]/20 transition-colors shadow-sm shrink-0"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFD700]" />
              <span>{lang === 'en' ? 'TE' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* MOBILE TTD YOUTUBE LIVE UTILITY ROW (<640px ONLY) */}
        {ttdLiveUrl && (
          <div className="sm:hidden flex items-center justify-end pt-0.5">
            <button
              onClick={onOpenLiveStream}
              className="px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 text-[10px] font-extrabold flex items-center gap-1 hover:bg-red-900/60 transition-colors shadow-sm"
              title="Watch TTD Daily YouTube Live Stream"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>{lang === 'en' ? 'TTD Live' : 'TTD లైవ్'}</span>
            </button>
          </div>
        )}

        {/* BOTTOM ROW: Smooth Scrolling Navigation Tabs */}
        <div className="relative max-w-full">
          <nav
            ref={navRef}
            onScroll={checkNavScroll}
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full"
          >
            <button
              ref={el => (tabRefs.current['calendar-page'] = el)}
              onClick={() => setActiveTab('calendar-page')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shrink-0 transition-all shadow-md ${
                activeTab === 'calendar-page'
                  ? 'bg-[#141923] text-[#FFD700] ring-2 ring-[#FFD700] border border-[#FFD700]'
                  : 'bg-[#141923] text-[#FFD700] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'
              }`}
            >
              <span>📅 {lang === 'en' ? 'Calendar' : 'క్యాలెండర్'}</span>
            </button>

            <button
              ref={el => (tabRefs.current['glossary'] = el)}
              onClick={() => setActiveTab('glossary')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'glossary'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] shadow-md font-extrabold'
                  : 'text-[#CBD5E1] hover:text-[#FFD700] hover:bg-[#141923]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#FFD700]" />
              <span>{lang === 'en' ? 'Glossary / Meanings' : 'నిఘంటువు / పదాల అర్థాలు'}</span>
            </button>

            <button
              ref={el => (tabRefs.current['sevas'] = el)}
              onClick={() => setActiveTab('sevas')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'sevas'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] shadow-md'
                  : 'text-[#CBD5E1] hover:text-[#FFD700] hover:bg-[#141923]'
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Sevas' : 'సేవలు'}</span>
            </button>

            <button
              ref={el => (tabRefs.current['tokens'] = el)}
              onClick={() => setActiveTab('tokens')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'tokens'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] shadow-md'
                  : 'text-[#CBD5E1] hover:text-[#FFD700] hover:bg-[#141923]'
              }`}
            >
              <span>🎟️</span>
              <span>
                {lang === 'en' ? 'SSD / DD Tokens' : 'SSD / DD టోకెన్లు'}
              </span>
            </button>

            {/* COMMUNITY FEEDBACK BUTTON / ADMIN INBOX */}
            <button
              ref={el => (tabRefs.current['feedback'] = el)}
              onClick={() => {
                if (isAdminLoggedIn) {
                  onOpenAdmin('feedback-inbox');
                } else {
                  setActiveTab('feedback');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'feedback'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] shadow-md'
                  : 'text-[#CBD5E1] hover:text-[#FFD700] hover:bg-[#141923]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#FF5722]" />
              <span>{isAdminLoggedIn ? (lang === 'en' ? 'Feedback Inbox' : 'అభిప్రాయాల ఇన్బాక్స్') : (lang === 'en' ? 'Feedback' : 'అభిప్రాయాలు')}</span>
            </button>
          </nav>

          {/* Subtle Mobile Right-Edge Fade Scroll Indicator */}
          {showRightFade && (
            <div
              className="sm:hidden absolute top-0 right-0 bottom-0 w-8 pointer-events-none z-10 bg-gradient-to-l from-[#0B0E14] [.light-theme_&]:from-white to-transparent transition-opacity duration-300"
            />
          )}
        </div>

      </div>
    </header>
  );
}

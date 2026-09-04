import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TEMPLES } from '../data/templeEvents';
import { getEventStatus, openGoogleCalendar, openAppleCalendar, shareToPlatform, normalizeEventImages } from '../utils/eventStatus';
import { formatEventTiming } from '../utils/indiaTime';
import { X, Calendar, Clock, Edit } from 'lucide-react';
import EventGalleryCarousel from './event/EventGalleryCarousel';
import EventShareDropdown from './event/EventShareDropdown';
import EventImageLightbox from './event/EventImageLightbox';

const EventGlossaryMatches = lazy(
  () => import('./EventGlossaryMatches')
);

export default function EventDetailModal({
  event,
  onClose,
  lang,
  isAdminLoggedIn,
  onEditEvent,
  onNavigateToGlossary
}) {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!event) return null;

  const temple = TEMPLES.find(t => t.id === event.templeId);
  const statusObj = getEventStatus(event);

  // Share dropdown menu state
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gallery & Lightbox State
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Robust Defensive Images List Normalization
  const allImages = normalizeEventImages(event);

  const activeImage = allImages[activeImgIndex] || allImages[0];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleLightboxPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleLightboxNext = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleShareClick = (platform) => {
    if (platform === 'copy') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    shareToPlatform(platform, event, lang);
    setIsShareMenuOpen(false);
  };

  const eventTitle = lang === 'en' ? event.title : (event.titleTe || event.title);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className="glass-card max-w-2xl w-full p-0 relative animate-slide-up bg-[#0B0E14] border-2 border-[#D4AF37]/50 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            aria-label={lang === 'en' ? 'Close event details' : 'ఈ వివరాలను మూసివేయండి'}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 text-[#FFD700] hover:bg-black border border-[#D4AF37]/50 flex items-center justify-center transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* EVENT GALLERY CAROUSEL (If images present) */}
          <EventGalleryCarousel
            allImages={allImages}
            activeImgIndex={activeImgIndex}
            activeImage={activeImage}
            eventTitle={event.title}
            onImageClick={() => {
              setLightboxIndex(activeImgIndex);
              setIsLightboxOpen(true);
            }}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            onSelectThumbnail={setActiveImgIndex}
          />

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Header Badges & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pr-10">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shadow-md ${statusObj.colorClass}`}>
                  {lang === 'en' ? statusObj.status : statusObj.statusTe}
                </span>

                <span
                  className="px-3 py-1 rounded-lg text-xs font-extrabold text-black shadow-md inline-block"
                  style={{ backgroundColor: temple?.color || '#FFD700' }}
                >
                  {lang === 'en' ? temple?.name : temple?.nameTe}
                </span>
              </div>

              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    onClose();
                    onEditEvent(event);
                  }}
                  className="px-3 py-1 rounded-full bg-[#FF5722] text-white text-xs font-extrabold flex items-center gap-1 shadow-lg hover:brightness-110"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Event</span>
                </button>
              )}
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold gold-gradient-text">
                {eventTitle}
              </h2>

              {/* Date & Time Indicator */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-mono font-bold text-[#FFD700] mt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FF5722]" />
                  <span>
                    {event.startDate === event.endDate
                      ? event.startDate
                      : `${event.startDate} to ${event.endDate}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-4 h-4 text-[#FF5722]" />
                  <span>{formatEventTiming(event)} (IST)</span>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="p-4 rounded-xl bg-[#141923] border border-[#D4AF37]/30 text-sm text-white/90 leading-relaxed space-y-2">
              <p className="whitespace-pre-line">
                {lang === 'en' ? event.description : (event.descriptionTe || event.description)}
              </p>
            </div>

            {/* Vehicle / Vahanam details if applicable */}
            {event.vahanam && (
              <div className="p-3 rounded-lg bg-[#FF5722]/10 border border-[#FF5722]/40 text-xs font-bold text-[#FF5722] flex items-center gap-2">
                <span>{lang === 'en' ? '🛕 Vahanam / Procession Vehicle:' : '🛕 వాహనం / ఊరేగింపు వాహనం:'}</span>
                <span className="vahanam-value font-extrabold">{event.vahanam}</span>
              </div>
            )}

            {/* CONTEXTUAL UTSAVAM TERMS EXPLAINED (Clicking navigates directly to Glossary focused on that term) */}
            <Suspense fallback={null}>
              <EventGlossaryMatches
                event={event}
                lang={lang}
                onClose={onClose}
                onNavigateToGlossary={onNavigateToGlossary}
              />
            </Suspense>

            {/* Action Buttons: Google Calendar, Apple Calendar, and Social Share */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* GOOGLE CALENDAR BUTTON */}
                <button
                  onClick={() => openGoogleCalendar(event)}
                  className="px-3.5 py-2 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  title="Add to Google Calendar"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-white font-extrabold" style={{ color: '#FFFFFF' }}>Google Calendar</span>
                </button>

                {/* APPLE CALENDAR BUTTON */}
                <button
                  onClick={() => openAppleCalendar(event)}
                  className="px-3.5 py-2 rounded-xl bg-black border-2 border-[#FFD700] hover:bg-slate-900 text-[#FFD700] font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  title="Direct to Apple Calendar"
                >
                  <span className="text-base">🍏</span>
                  <span className="font-extrabold text-[#FFD700]">Apple Calendar</span>
                </button>
              </div>

              {/* EXPANDED SOCIAL SHARE DROPDOWN MENU */}
              <EventShareDropdown
                lang={lang}
                isShareMenuOpen={isShareMenuOpen}
                copiedLink={copiedLink}
                onToggleShareMenu={() => setIsShareMenuOpen(!isShareMenuOpen)}
                onShareClick={handleShareClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ENLARGED FULL SCREEN LIGHTBOX MODAL */}
      <EventImageLightbox
        isOpen={isLightboxOpen}
        eventTitle={event.title}
        allImages={allImages}
        lightboxIndex={lightboxIndex}
        onClose={() => setIsLightboxOpen(false)}
        onPrevImage={handleLightboxPrev}
        onNextImage={handleLightboxNext}
      />
    </>
  );
}

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EventImageLightbox({
  isOpen,
  eventTitle,
  allImages,
  lightboxIndex,
  onClose,
  onPrevImage,
  onNextImage
}) {
  if (!isOpen || allImages.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6"
      onClick={onClose}
    >
      {/* Lightbox Top Header */}
      <div className="flex items-center justify-between z-10 w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#FFD700] text-sm sm:text-base">
            {eventTitle}
          </span>
          {allImages.length > 1 && (
            <span className="px-2.5 py-0.5 rounded bg-white/10 text-xs font-mono font-bold text-[#94A3B8]">
              {lightboxIndex + 1} / {allImages.length}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-all flex items-center gap-1 shadow-lg ml-auto"
          title="Close enlarged view"
        >
          <X className="w-5 h-5" />
          <span>Close</span>
        </button>
      </div>

      {/* Lightbox Main Image & Navigation Arrows */}
      <div 
        className="relative flex-grow flex items-center justify-center my-2 sm:my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={allImages[lightboxIndex].url} 
          alt={allImages[lightboxIndex].caption || eventTitle} 
          className="max-h-[80vh] max-w-full object-contain shadow-2xl rounded-xl border border-white/20 animate-scale-up"
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/80 text-[#FFD700] hover:bg-black border border-[#D4AF37] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
              title="Previous photo"
            >
              <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9" />
            </button>

            <button
              onClick={onNextImage}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/80 text-[#FFD700] hover:bg-black border border-[#D4AF37] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
              title="Next photo"
            >
              <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9" />
            </button>
          </>
        )}
      </div>

      {/* Lightbox Bottom Caption Bar */}
      <div className="text-center z-10 max-w-2xl mx-auto w-full" onClick={(e) => e.stopPropagation()}>
        {allImages[lightboxIndex].caption ? (
          <div className="p-3 rounded-xl bg-black/80 border border-[#D4AF37]/40 text-[#FFD700] font-bold text-xs sm:text-sm shadow-xl">
            📷 {allImages[lightboxIndex].caption}
          </div>
        ) : (
          <div className="text-xs text-[#94A3B8] font-mono">
            Tap ✕ Close or click anywhere outside to return
          </div>
        )}
      </div>
    </div>
  );
}

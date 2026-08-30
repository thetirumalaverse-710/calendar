import React from 'react';

export default function TtdLiveStreamModal({ isOpen, ttdLiveUrl, onClose }) {
  if (!isOpen || !ttdLiveUrl) return null;

  return (
    <div className="modal-overlay z-[99999]" onClick={onClose}>
      <div 
        className="glass-card p-4 border-2 border-red-500 max-w-3xl w-full bg-[#0B0E14] text-center rounded-2xl relative space-y-3 shadow-2xl animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-serif font-bold text-red-500 text-sm sm:text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span>🔴 TTD Daily YouTube Live Stream</span>
          </span>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full bg-[#141923] text-white hover:text-[#FFD700] text-xs border border-white/20"
          >
            ✕
          </button>
        </div>

        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/20">
          <iframe
            className="w-full h-full"
            src={
              ttdLiveUrl.includes('embed/')
                ? ttdLiveUrl
                : `https://www.youtube.com/embed/${
                    ttdLiveUrl.includes('/live/')
                      ? ttdLiveUrl.split('/live/')[1].split('?')[0].split('&')[0]
                      : ttdLiveUrl.includes('v=')
                      ? ttdLiveUrl.split('v=')[1].split('&')[0]
                      : ttdLiveUrl.includes('youtu.be/')
                      ? ttdLiveUrl.split('youtu.be/')[1].split('?')[0]
                      : ttdLiveUrl
                  }?autoplay=1`
            }
            title="TTD Daily Live Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="text-xs text-[#94A3B8] font-mono">
          Live broadcast provided via Tirumala Tirupati Devasthanams (TTD)
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Share2, Check, Copy } from 'lucide-react';

export default function EventShareDropdown({
  lang,
  isShareMenuOpen,
  copiedLink,
  onToggleShareMenu,
  onShareClick
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggleShareMenu}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4 text-black" />
        <span>{lang === 'en' ? 'Share Event' : 'పంచుకోండి'}</span>
      </button>

      {isShareMenuOpen && (
        <div className="
          absolute right-0 bottom-12
          w-60
          bg-[#141923]
          light-theme:bg-white
          border-2 border-[#FFD700]
          light-theme:border-[#D4AF37]
          rounded-2xl
          shadow-2xl
          p-2
          space-y-1
          z-50
          animate-scale-up
        ">
          
          {/* WHATSAPP */}
          <button
            onClick={() => onShareClick('whatsapp')}
            className="
              w-full text-left px-3 py-2.5 rounded-xl
              hover:bg-green-50
              light-theme:hover:bg-green-50
              hover:bg-white/10
              text-[#166534]
              light-theme:text-[#166534]
              text-xs font-bold
              flex items-center gap-2.5
              transition-colors
            "
          >
            <svg className="w-4 h-4 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.149 4.194 4.306-1.129z"/>
            </svg>
            <span style={{ color: '#25D366' }}>WhatsApp</span>
          </button>

          {/* X(TWITTER)  */}
          <button
            onClick={() => onShareClick('x')}
            className="
              w-full text-left px-3 py-2.5 rounded-xl
              hover:bg-slate-100
              light-theme:hover:bg-slate-100
              text-[#111827]
              text-xs font-bold
              flex items-center gap-2.5
              transition-colors
            "
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.244 2.25H21.5L14.39 10.37L22.75 21.75H16.2L11.07 14.85L5.17 21.75H1.91L9.52 13.05L1.5 2.25H8.22L12.86 8.55L18.244 2.25ZM17.1 19.75H18.9L7.24 4.15H5.31L17.1 19.75Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-[#111827] font-bold">
              X (Twitter)
            </span>
          </button>

          {/* FACEBOOK */}
          <button
            onClick={() => onShareClick('facebook')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-bold text-white flex items-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4 text-[#1877F2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-[#1877F2] font-bold">
              Facebook
            </span>
          </button>

          {/* REDDIT */}
          <button
            onClick={() => onShareClick('reddit')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-bold text-white flex items-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4 text-[#FF4500] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.196-.491.956 0 1.733.777 1.733 1.734 0 .658-.363 1.222-.898 1.516.02.179.034.363.034.55 0 2.8-3.32 5.07-7.414 5.07-4.095 0-7.416-2.27-7.416-5.07 0-.18.013-.362.033-.54-.53-.294-.89-.855-.89-1.515 0-.957.777-1.734 1.734-1.734.469 0 .89.182 1.198.49 1.193-.855 2.846-1.417 4.667-1.489l.926-4.343 3.32.697a1.246 1.246 0 0 1 1.252-1.144z"/>
            </svg>
            <span className="text-[#C2410C] font-bold">
              Reddit
            </span>
          </button>

          {/* INSTAGRAM */}
          <button
            onClick={() => onShareClick('instagram')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-bold text-white flex items-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4 text-[#E4405F] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-[#C0265E] font-bold">
              Instagram
            </span>
          </button>

          {/* THREADS */}
          <button
            onClick={() => onShareClick('threads')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-bold text-white flex items-center gap-2.5 transition-colors"
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.2 11.1c-.2-3.1-2-5.1-5.2-5.1-3.4 0-5.4 2-5.4 5.9 0 4.2 2.1 6.5 5.8 6.5 3.2 0 5.2-1.6 5.2-4.1 0-2.3-1.7-3.7-4.4-3.7-2.2 0-3.5 1-3.5 2.5 0 1.2 1 2 2.3 2 1.2 0 2-.6 2-1.6 0-.8-.6-1.3-1.6-1.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#111827] font-bold">
              Threads
            </span>
          </button>

          {/* COPY LINK & TEXT */}
          <button
            onClick={() => onShareClick('copy')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-bold text-[#FFD700] flex items-center gap-2.5 border-t border-white/10 pt-2 transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-green-400 shrink-0" /> : <Copy className="w-4 h-4 text-[#B45309] shrink-0" />}
            <span className="text-green-700 font-bold">
              {copiedLink ? 'Copied!' : 'Copy Link & Text'}
            </span>
          </button>

        </div>
      )}
    </div>
  );
}

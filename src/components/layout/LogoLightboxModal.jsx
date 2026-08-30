import React from 'react';
import { X } from 'lucide-react';

export default function LogoLightboxModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-card p-6 border-2 border-[#FFD700] max-w-sm w-full text-center relative animate-slide-up bg-[#0B0E14]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#94A3B8] hover:text-[#FFD700] p-2 rounded-full bg-[#141923] border border-[#D4AF37]/30"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-lg font-bold gold-gradient-text mb-3">
          The Tirumala Verse Official Symbol
        </h3>

        <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#FFD700] bg-[#E65100] p-2 shadow-2xl flex items-center justify-center">
          <img 
            src="/logo-192.png" 
            alt="Tirumala Gopuram Logo" 
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-xs text-[#94A3B8] mt-4 leading-relaxed">
          Sacred insignia representing the divine Gopuram and Srivari Tirunamam.
        </p>
      </div>
    </div>
  );
}

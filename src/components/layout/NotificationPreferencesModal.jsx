import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { ELIGIBLE_NOTIFICATION_TEMPLES } from '../../utils/webPush';

export default function NotificationPreferencesModal({
  isOpen,
  onClose,
  lang = 'en',
  themeMode = 'dark',
  notificationsEnabled = false,
  currentTemples = ELIGIBLE_NOTIFICATION_TEMPLES,
  onSave,
  onDisable
}) {
  const [selectedTemples, setSelectedTemples] = useState(currentTemples);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTemples(
        Array.isArray(currentTemples) && currentTemples.length > 0
          ? currentTemples
          : [...ELIGIBLE_NOTIFICATION_TEMPLES]
      );
    }
  }, [isOpen, currentTemples]);

  if (!isOpen) return null;

  const isLight = themeMode === 'light';

  const templeOptions = [
    {
      id: 'tirumala-main',
      nameEn: 'Tirumala Temple',
      nameTe: 'తిరుమల శ్రీ వేంకటేశ్వరస్వామి ఆలయం',
      locationEn: 'Tirumala Hills',
      locationTe: 'తిరుమల కొండలు',
      icon: '🛕'
    },
    {
      id: 'tiruchanur',
      nameEn: 'Sri Padmavathi Ammavari Temple',
      nameTe: 'శ్రీ పద్మావతి అమ్మవారి ఆలయం (తిరుచానూరు)',
      locationEn: 'Tiruchanur, Tirupati',
      locationTe: 'తిరుచానూరు, తిరుపతి',
      icon: '🌸'
    }
  ];

  const handleToggleTemple = (templeId) => {
    setSelectedTemples((prev) => {
      if (prev.includes(templeId)) {
        return prev.filter((id) => id !== templeId);
      } else {
        return [...prev, templeId];
      }
    });
  };

  const handleSave = async () => {
    if (selectedTemples.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSave(selectedTemples);
      onClose();
    } catch (e) {
      console.error('Error saving notification preferences:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable = async () => {
    if (isDisabling) return;
    setIsDisabling(true);
    try {
      await onDisable();
      onClose();
    } catch (e) {
      console.error('Error disabling notifications:', e);
    } finally {
      setIsDisabling(false);
    }
  };

  const hasSelectedAny = selectedTemples.length > 0;

  return (
    <div
      className="modal-overlay z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >
      <div
        className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 relative transition-all animate-scale-up ${
          isLight
            ? 'bg-white border-[#D4AF37] text-gray-900'
            : 'bg-[#0B0E14] border-[#D4AF37]/50 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-[#D4AF37]/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="notification-modal-title"
                className="font-serif font-bold text-base sm:text-lg leading-tight gold-gradient-text"
              >
                {lang === 'en' ? 'Event Notifications' : 'ఈవెంట్ నోటిఫికేషన్లు'}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">
                {lang === 'en'
                  ? 'Select temples to receive push alerts'
                  : 'నోటిఫికేషన్‌ల కోసం ఆలయాలను ఎంచుకోండి'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={lang === 'en' ? 'Close dialog' : 'మూసివేయండి'}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#141923] dark:hover:bg-[#1f2635] text-gray-500 dark:text-[#94A3B8] transition-colors border border-gray-200 dark:border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle Information Box */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed flex items-start gap-2">
          <Shield className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {lang === 'en'
              ? 'Receive notifications 30 minutes before timed events and morning updates for all-day events.'
              : 'సమయం నిర్ణయించిన సేవలకు 30 నిమిషాల ముందు మరియు రోజువారీ ఉత్సవాల అప్‌డేట్‌లను పొందండి.'}
          </span>
        </div>

        {/* Checkbox Options List */}
        <div className="space-y-2.5 py-1">
          <label className="text-xs font-bold text-gray-700 dark:text-[#FFD700] block">
            {lang === 'en'
              ? 'Eligible Temples (Select one or both):'
              : 'అనుమతించబడిన ఆలయాలు (ఒకటి లేదా రెండింటినీ ఎంచుకోండి):'}
          </label>

          {templeOptions.map((temple) => {
            const isChecked = selectedTemples.includes(temple.id);

            return (
              <div
                key={temple.id}
                onClick={() => handleToggleTemple(temple.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all min-h-[52px] select-none ${
                  isChecked
                    ? isLight
                      ? 'bg-amber-50 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'bg-[#141923] border-[#FFD700] ring-1 ring-[#FFD700]'
                    : isLight
                    ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    : 'bg-[#0B0E14] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="text-xl shrink-0">{temple.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                      {lang === 'en' ? temple.nameEn : temple.nameTe}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-[#94A3B8] truncate">
                      {lang === 'en' ? temple.locationEn : temple.locationTe}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-500 text-black'
                      : 'bg-transparent border-gray-400 dark:border-gray-600'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 text-black stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation Warning if nothing selected */}
        {!hasSelectedAny && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {lang === 'en'
                ? 'Please select at least one temple to receive alerts.'
                : 'దయచేసి నోటిఫికేషన్‌ల కోసం కనీసం ఒక ఆలయాన్ని ఎంచుకోండి.'}
            </span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasSelectedAny || isSubmitting || isDisabling}
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px] ${
              !hasSelectedAny || isSubmitting || isDisabling
                ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed border border-transparent'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black hover:brightness-110 active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>{lang === 'en' ? 'Saving...' : 'సేవ్ చేస్తోంది...'}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>
                  {notificationsEnabled
                    ? lang === 'en'
                      ? 'Update Preferences'
                      : 'ప్రాధాన్యతలను నవీకరించండి'
                    : lang === 'en'
                    ? 'Enable Notifications'
                    : 'నోటిఫికేషన్లు ప్రారంభించండి'}
                </span>
              </>
            )}
          </button>

          {notificationsEnabled && (
            <button
              type="button"
              onClick={handleDisable}
              disabled={isSubmitting || isDisabling}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              {isDisabling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                  <span>{lang === 'en' ? 'Disabling...' : 'నిలిపివేస్తోంది...'}</span>
                </>
              ) : (
                <span>
                  {lang === 'en' ? 'Disable Notifications' : 'నోటిఫికేషన్లు నిలిపివేయండి'}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

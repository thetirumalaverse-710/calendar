import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { subscribeToast } from '../../utils/toast';

export default function ToastContainer({ themeMode = 'dark' }) {
  const [toasts, setToasts] = useState([]);
  const isLight = themeMode === 'light';

  useEffect(() => {
    const unsubscribe = subscribeToast(newToast => {
      setToasts(prev => [...prev, newToast]);

      if (newToast.duration > 0) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration);
      }
    });

    return unsubscribe;
  }, []);

  const removeToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[999999] flex flex-col gap-2.5 max-w-sm w-full px-3 sm:px-0 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border p-3.5 shadow-2xl flex items-center justify-between gap-3 transition-all transform animate-slide-in ${
              isLight
                ? isSuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : isWarning
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : isError
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-white border-amber-400/50 text-slate-900'
                : isSuccess
                ? 'bg-[#0E1B14] border-emerald-500/40 text-emerald-200'
                : isWarning
                ? 'bg-[#1C150A] border-amber-500/40 text-amber-200'
                : isError
                ? 'bg-[#1F0A0D] border-rose-500/40 text-rose-200'
                : 'bg-[#111722] border-[#D4AF37]/40 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
              {!isSuccess && !isWarning && !isError && (
                <Info className="w-5 h-5 text-[#D4AF37] shrink-0" />
              )}

              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

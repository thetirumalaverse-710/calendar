import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EventEditorActions({
  targetEvent,
  lang,
  onDeleteEvent,
  onClose
}) {
  return (
    <div className="flex justify-between items-center gap-2 pt-2">
      <div>
        {targetEvent && (
          <button
            type="button"
            onClick={async () => {
              const confirmed = window.confirm(
                lang === 'en'
                  ? `Are you sure you want to permanently delete "${targetEvent.title}"?\n\nThis action cannot be undone.`
                  : `మీరు "${targetEvent.title}" ఉత్సవాన్ని శాశ్వతంగా తొలగించాలనుకుంటున్నారా?\n\nఈ చర్యను రద్దు చేయలేరు.`
              );

              if (!confirmed) {
                return;
              }

              try {
                await onDeleteEvent(targetEvent.id);
                onClose();
              } catch (error) {
                console.error('Delete event failed:', error);

                alert(
                  lang === 'en'
                    ? 'Failed to delete the event. Please try again.'
                    : 'ఉత్సవాన్ని తొలగించడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
                );
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 hover:text-white border border-red-500/50 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Event
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#141923] text-white border border-white/20 text-xs font-bold"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black font-extrabold text-xs shadow-lg"
        >
          {targetEvent ? 'Save Changes' : 'Publish Event Live'}
        </button>
      </div>
    </div>
  );
}

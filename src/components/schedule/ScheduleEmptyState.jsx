import React from 'react';
import { Calendar } from 'lucide-react';

export default function ScheduleEmptyState({ lang }) {
  return (
    <div className="glass-card p-12 text-center text-[#94A3B8] space-y-3">
      <Calendar className="w-12 h-12 mx-auto text-[#D4AF37]/40" />

      <h3 className="font-serif text-lg font-bold text-white">
        {lang === 'en' ? 'No Upcoming Events' : 'రాబోయే ఉత్సవాలు లేవు'}
      </h3>

      <p className="text-xs text-[#64748B]">
        {lang === 'en'
          ? 'There are no active or upcoming temple events at this time.'
          : 'ప్రస్తుతం క్రియాశీల లేదా రాబోయే ఆలయ ఉత్సవాలు లేవు.'}
      </p>
    </div>
  );
}

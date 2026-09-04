import React, { useEffect, useState } from 'react';
import { Edit2, AlertCircle } from 'lucide-react';
import { normalizeImageUrl } from '../../utils/eventStatus';
import { parseTimeToMinutes, formatEventTiming } from '../../utils/indiaTime';
import {
  getTodayIST,
  getInitialImages,
  getEmptyEventForm
} from '../../utils/adminEventEditorUtils';

import EventBasicDetailsForm from './event/EventBasicDetailsForm';
import EventPhotosManager from './event/EventPhotosManager';
import EventEditorActions from './event/EventEditorActions';

export default function AdminEventEditor({
  lang,
  targetEvent,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onClose
}) {
  const [eventForm, setEventForm] = useState(getEmptyEventForm());
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setValidationError(null);
    if (targetEvent) {
      setEventForm({
        title: targetEvent.title || '',
        titleTe: targetEvent.titleTe || '',
        templeId: targetEvent.templeId || 'tirumala-main',
        startDate: targetEvent.startDate || getTodayIST(),
        endDate: targetEvent.endDate || targetEvent.startDate || getTodayIST(),
        startTime: targetEvent.startTime || '07:00',
        endTime: targetEvent.endTime || '',
        timingSource: targetEvent.timingSource || (targetEvent.startTime ? 'admin' : 'default'),
        category: targetEvent.category || 'brahmotsavam',
        vahanam: targetEvent.vahanam || '',
        description: targetEvent.description || '',
        descriptionTe: targetEvent.descriptionTe || '',
        imageUrl: targetEvent.imageUrl || '',
        images: getInitialImages(targetEvent)
      });
    } else {
      setEventForm(getEmptyEventForm());
    }
  }, [targetEvent]);

  const handleAddImageField = () => {
    setEventForm(prev => ({
      ...prev,
      images: [...prev.images, { url: '', caption: '' }]
    }));
  };

  const handleRemoveImageField = index => {
    setEventForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageFieldChange = (index, field, value) => {
    setEventForm(prev => {
      const updated = [...prev.images];

      const cleanValue =
        field === 'url' ? normalizeImageUrl(value) : value;

      updated[index] = {
        ...updated[index],
        [field]: cleanValue
      };

      return {
        ...prev,
        images: updated
      };
    });
  };

  const handleSaveEvent = e => {
    e.preventDefault();
    setValidationError(null);

    if (!eventForm.title.trim()) {
      setValidationError(lang === 'en' ? 'Event title is required.' : 'ఉత్సవం శీర్షిక అవసరం.');
      return;
    }

    // 1. Validate Date Formats and Range (Rule A & B)
    if (!eventForm.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventForm.startDate)) {
      setValidationError(lang === 'en' ? 'Please provide a valid start date (YYYY-MM-DD).' : 'దయచేసి సరైన ప్రారంభ తేదీని నమోదు చేయండి.');
      return;
    }
    if (!eventForm.endDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventForm.endDate)) {
      setValidationError(lang === 'en' ? 'Please provide a valid end date (YYYY-MM-DD).' : 'దయచేసి సరైన ముగింపు తేదీని నమోదు చేయండి.');
      return;
    }
    if (eventForm.endDate < eventForm.startDate) {
      setValidationError(lang === 'en' ? 'End date cannot be earlier than start date.' : 'ముగింపు తేదీ ప్రారంభ తేదీ కంటే ముందు ఉండకూడదు.');
      return;
    }

    // 2. Validate Timings (Rule C & Section 11)
    const startMins = parseTimeToMinutes(eventForm.startTime || '07:00');
    if (startMins === null) {
      setValidationError(lang === 'en' ? 'Please provide a valid start time.' : 'దయచేసి సరైన ప్రారంభ సమయాన్ని నమోదు చేయండి.');
      return;
    }

    if (eventForm.endTime) {
      const endMins = parseTimeToMinutes(eventForm.endTime);
      if (endMins === null) {
        setValidationError(lang === 'en' ? 'Please provide a valid end time.' : 'దయచేసి సరైన ముగింపు సమయాన్ని నమోదు చేయండి.');
        return;
      }
      if (eventForm.startDate === eventForm.endDate && endMins <= startMins) {
        setValidationError(
          lang === 'en'
            ? 'Available Until (End Time) must be later than Available From (Start Time).'
            : 'ముగింపు సమయం ప్రారంభ సమయం కంటే తరువాత ఉండాలి.'
        );
        return;
      }
    }

    const cleanedImages = (eventForm.images || [])
      .filter(img => img.url && img.url.trim() !== '')
      .map(img => ({
        url: img.url.trim(),
        caption: (img.caption || '').trim()
      }));

    const formattedTime = formatEventTiming({
      startTime: eventForm.startTime,
      endTime: eventForm.endTime
    });

    const eventPayload = {
      ...eventForm,
      startTime: eventForm.startTime || '07:00',
      endTime: eventForm.endTime || null,
      timingSource: eventForm.timingSource || 'admin',
      time: formattedTime,
      images: cleanedImages,
      imageUrl: cleanedImages.length > 0 ? cleanedImages[0].url : ''
    };

    if (targetEvent) {
      onUpdateEvent({
        ...targetEvent,
        ...eventPayload
      });

      alert(
        lang === 'en'
          ? 'Event updated live on website!'
          : 'ఉత్సవం నవీకరించబడింది!'
      );
    } else {
      const newEvent = {
        id: `custom-evt-${Date.now()}`,
        ...eventPayload
      };

      onAddEvent(newEvent);

      alert(
        lang === 'en'
          ? 'New event added live on website!'
          : 'కొత్త ఉత్సవం జతచేయబడింది!'
      );
    }

    onClose();
  };

  return (
    <form onSubmit={handleSaveEvent} className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-2 border-b border-[#D4AF37]/30 pb-3">
        <Edit2 className="w-5 h-5 text-[#FF5722]" />

        <h3 className="font-serif text-lg font-bold text-white">
          {targetEvent
            ? `Edit Event: ${targetEvent.title}`
            : 'Add New Temple Event'}
        </h3>
      </div>

      {/* VALIDATION ERROR BANNER */}
      {validationError && (
        <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/60 text-red-200 text-xs flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-bold">{validationError}</span>
        </div>
      )}

      {/* BASIC DETAILS */}
      <EventBasicDetailsForm
        eventForm={eventForm}
        setEventForm={setEventForm}
      />

      {/* PHOTOS MANAGER */}
      <EventPhotosManager
        eventForm={eventForm}
        targetEvent={targetEvent}
        handleAddImageField={handleAddImageField}
        handleRemoveImageField={handleRemoveImageField}
        handleImageFieldChange={handleImageFieldChange}
      />

      {/* EDITOR ACTIONS */}
      <EventEditorActions
        targetEvent={targetEvent}
        lang={lang}
        onDeleteEvent={onDeleteEvent}
        onClose={onClose}
      />
    </form>
  );
}
import React, { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import { normalizeImageUrl } from '../../utils/eventStatus';
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

  useEffect(() => {
    if (targetEvent) {
      setEventForm({
        title: targetEvent.title || '',
        titleTe: targetEvent.titleTe || '',
        templeId: targetEvent.templeId || 'tirumala-main',
        startDate: targetEvent.startDate || getTodayIST(),
        endDate: targetEvent.endDate || getTodayIST(),
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

    if (!eventForm.title.trim()) {
      return;
    }

    const cleanedImages = (eventForm.images || [])
      .filter(img => img.url && img.url.trim() !== '')
      .map(img => ({
        url: img.url.trim(),
        caption: (img.caption || '').trim()
      }));

    const eventPayload = {
      ...eventForm,
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
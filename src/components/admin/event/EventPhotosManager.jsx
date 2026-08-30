import React from 'react';
import { Image, Plus } from 'lucide-react';
import EventPhotoItem from './EventPhotoItem';

export default function EventPhotosManager({
  eventForm,
  targetEvent,
  handleAddImageField,
  handleRemoveImageField,
  handleImageFieldChange
}) {
  return (
    <div className="space-y-3 p-3.5 rounded-xl bg-[#141923] border border-[#D4AF37]/40">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD700]">
          <Image className="w-4 h-4 text-[#FF5722]" />
          <span>
            Event Photos & Captions ({eventForm.images.length})
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddImageField}
          className="px-2.5 py-1 rounded bg-[#FF5722] hover:bg-[#E65100] text-white text-[10px] font-extrabold flex items-center gap-1 shadow"
        >
          <Plus className="w-3 h-3" />
          <span>Add Photo</span>
        </button>
      </div>

      {eventForm.images.map((imgObj, idx) => (
        <EventPhotoItem
          key={idx}
          imgObj={imgObj}
          idx={idx}
          targetEvent={targetEvent}
          eventForm={eventForm}
          handleRemoveImageField={handleRemoveImageField}
          handleImageFieldChange={handleImageFieldChange}
        />
      ))}
    </div>
  );
}

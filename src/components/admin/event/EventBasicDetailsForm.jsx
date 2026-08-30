import React from 'react';
import { TEMPLES } from '../../../data/templeEvents';

export default function EventBasicDetailsForm({ eventForm, setEventForm }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-[#FFD700] block mb-1">
            Event Title (English) *
          </label>

          <input
            type="text"
            value={eventForm.title}
            onChange={e =>
              setEventForm(prev => ({
                ...prev,
                title: e.target.value
              }))
            }
            placeholder="e.g. Srivari Brahmotsavam"
            className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#FFD700] block mb-1">
            Event Title (Telugu)
          </label>

          <input
            type="text"
            value={eventForm.titleTe}
            onChange={e =>
              setEventForm(prev => ({
                ...prev,
                titleTe: e.target.value
              }))
            }
            placeholder="ఉత్సవం పేరు"
            className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-[#FFD700] block mb-1">
            Temple Shrine
          </label>

          <select
            value={eventForm.templeId}
            onChange={e =>
              setEventForm(prev => ({
                ...prev,
                templeId: e.target.value
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-[#FFD700] text-xs font-bold"
          >
            {TEMPLES.map(temple => (
              <option key={temple.id} value={temple.id}>
                {temple.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#FFD700] block mb-1">
            Start Date *
          </label>

          <input
            type="date"
            value={eventForm.startDate}
            onChange={e =>
              setEventForm(prev => ({
                ...prev,
                startDate: e.target.value
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs font-mono"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#FFD700] block mb-1">
            End Date *
          </label>

          <input
            type="date"
            value={eventForm.endDate}
            onChange={e =>
              setEventForm(prev => ({
                ...prev,
                endDate: e.target.value
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs font-mono"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-[#FFD700] block mb-1">
            Category
          </label>

          <input
            type="text"
            value={eventForm.category}
            onChange={e =>
              setEventForm(prev => ({
                ...prev,
                category: e.target.value
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#FFD700] block mb-1">
            Vahanam
          </label>

          <input
            type="text"
            value={eventForm.vahanam}
            onChange={e =>
              setEventForm(prev => ({
                ...prev,
                vahanam: e.target.value
              }))
            }
            className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#FFD700] block mb-1">
          Description
        </label>

        <textarea
          rows={3}
          value={eventForm.description}
          onChange={e =>
            setEventForm(prev => ({
              ...prev,
              description: e.target.value
            }))
          }
          className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-[#FFD700] block mb-1">
          Description (Telugu)
        </label>

        <textarea
          rows={3}
          value={eventForm.descriptionTe}
          onChange={e =>
            setEventForm(prev => ({
              ...prev,
              descriptionTe: e.target.value
            }))
          }
          className="w-full px-3 py-2 rounded-xl bg-[#141923] border border-[#D4AF37]/50 text-white text-xs"
        />
      </div>
    </>
  );
}

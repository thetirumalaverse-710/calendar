import React from 'react';
import { TEMPLES } from '../../../data/templeEvents';
import { Clock, Info } from 'lucide-react';
import { formatTime12Hr } from '../../../utils/indiaTime';

function parse24to12(time24) {
  if (!time24) return { hour: '07', minute: '00', ampm: 'AM' };
  const parts = time24.split(':');
  let h = parseInt(parts[0], 10);
  if (isNaN(h)) return { hour: '07', minute: '00', ampm: 'AM' };
  const m = parts[1] ? String(parseInt(parts[1], 10)).padStart(2, '0') : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return { hour: String(h).padStart(2, '0'), minute: m, ampm };
}

function format12to24(hour12, minute, ampm) {
  let h = parseInt(hour12, 10);
  if (isNaN(h)) h = 7;
  const m = parseInt(minute, 10);
  const minStr = String(isNaN(m) ? 0 : m).padStart(2, '0');
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${minStr}`;
}

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export default function EventBasicDetailsForm({ eventForm, setEventForm }) {
  const startParts = parse24to12(eventForm.startTime || '07:00');
  const hasEndTime = Boolean(eventForm.endTime);
  const endParts = parse24to12(eventForm.endTime || '10:30');

  const handleStartChange = (field, val) => {
    const next = { ...startParts, [field]: val };
    const time24 = format12to24(next.hour, next.minute, next.ampm);
    setEventForm(prev => ({
      ...prev,
      startTime: time24,
      timingSource: 'admin'
    }));
  };

  const handleEndChange = (field, val) => {
    const next = { ...endParts, [field]: val };
    const time24 = format12to24(next.hour, next.minute, next.ampm);
    setEventForm(prev => ({
      ...prev,
      endTime: time24,
      timingSource: 'admin'
    }));
  };

  const handleToggleEndTime = (enabled) => {
    setEventForm(prev => ({
      ...prev,
      endTime: enabled ? (prev.endTime || '10:30') : '',
      timingSource: 'admin'
    }));
  };

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
            onChange={e => {
              const newStartDate = e.target.value;
              setEventForm(prev => {
                const shouldSyncEnd = !prev.endDate || prev.endDate < newStartDate || prev.endDate === prev.startDate;
                return {
                  ...prev,
                  startDate: newStartDate,
                  endDate: shouldSyncEnd ? newStartDate : prev.endDate
                };
              });
            }}
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
            min={eventForm.startDate}
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

      {/* EVENT TIMINGS (IST Asia/Kolkata) */}
      <div className="p-3 rounded-xl bg-[#141923]/80 border border-[#D4AF37]/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD700]">
            <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Event Timings (Indian Standard Time - IST)</span>
          </div>

          {eventForm.timingSource === 'default' ? (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[#FFD700] text-[10px] font-mono border border-amber-500/40 flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-400" />
              <span>Timing: Default 7:00 AM</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
              Admin Configured
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AVAILABLE FROM / START TIME */}
          <div>
            <label className="text-xs font-bold text-white block mb-1.5">
              Available From / Start Time (12h AM/PM) *
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={startParts.hour}
                onChange={e => handleStartChange('hour', e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0B0E14] border border-[#D4AF37]/50 text-white text-xs font-mono font-bold"
              >
                {HOURS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className="text-white font-bold">:</span>
              <select
                value={startParts.minute}
                onChange={e => handleStartChange('minute', e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0B0E14] border border-[#D4AF37]/50 text-white text-xs font-mono font-bold"
              >
                {MINUTES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="flex rounded-lg border border-[#D4AF37]/50 overflow-hidden text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleStartChange('ampm', 'AM')}
                  className={`px-2 py-1.5 transition-colors ${startParts.ampm === 'AM' ? 'bg-[#FFD700] text-black' : 'bg-[#0B0E14] text-white/70'}`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleStartChange('ampm', 'PM')}
                  className={`px-2 py-1.5 transition-colors ${startParts.ampm === 'PM' ? 'bg-[#FFD700] text-black' : 'bg-[#0B0E14] text-white/70'}`}
                >
                  PM
                </button>
              </div>

              <span className="text-xs font-mono text-[#FFD700] ml-2">
                = {formatTime12Hr(eventForm.startTime || '07:00')} IST
              </span>
            </div>
          </div>

          {/* AVAILABLE UNTIL / END TIME (OPTIONAL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={hasEndTime}
                  onChange={e => handleToggleEndTime(e.target.checked)}
                  className="rounded text-[#FF5722] focus:ring-[#FFD700]"
                />
                <span>Available Until / End Time (Optional)</span>
              </label>

              {hasEndTime && (
                <button
                  type="button"
                  onClick={() => handleToggleEndTime(false)}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Clear End Time
                </button>
              )}
            </div>

            {hasEndTime ? (
              <div className="flex items-center gap-1.5">
                <select
                  value={endParts.hour}
                  onChange={e => handleEndChange('hour', e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0B0E14] border border-[#D4AF37]/50 text-white text-xs font-mono font-bold"
                >
                  {HOURS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="text-white font-bold">:</span>
                <select
                  value={endParts.minute}
                  onChange={e => handleEndChange('minute', e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0B0E14] border border-[#D4AF37]/50 text-white text-xs font-mono font-bold"
                >
                  {MINUTES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <div className="flex rounded-lg border border-[#D4AF37]/50 overflow-hidden text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleEndChange('ampm', 'AM')}
                    className={`px-2 py-1.5 transition-colors ${endParts.ampm === 'AM' ? 'bg-[#FFD700] text-black' : 'bg-[#0B0E14] text-white/70'}`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEndChange('ampm', 'PM')}
                    className={`px-2 py-1.5 transition-colors ${endParts.ampm === 'PM' ? 'bg-[#FFD700] text-black' : 'bg-[#0B0E14] text-white/70'}`}
                  >
                    PM
                  </button>
                </div>

                <span className="text-xs font-mono text-[#FFD700] ml-2">
                  = {formatTime12Hr(eventForm.endTime)} IST
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic pt-1">
                No end time configured (event remains active through the end of the day).
              </p>
            )}
          </div>
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

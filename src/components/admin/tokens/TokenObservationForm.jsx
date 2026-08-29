import React from "react";
import { Plus } from "lucide-react";

export default function TokenObservationForm({
  tokenDay,
  observationForm,
  setObservationForm,
  addObservation,
  saving,
  cardClass,
  headingClass,
  mutedClass,
  inputClass,
}) {
  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5 text-[#D4AF37]" />

        <h3 className={`font-black ${headingClass}`}>
          Add Token Observation
        </h3>
      </div>

      {!tokenDay ? (
        <div className={`text-sm ${mutedClass}`}>
          Save the token issuance session first.
        </div>
      ) : (
        <form onSubmit={addObservation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                Observation Time
              </span>

              <input
                type="datetime-local"
                value={observationForm.observed_at}
                onChange={(e) =>
                  setObservationForm({
                    ...observationForm,
                    observed_at: e.target.value,
                  })
                }
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                SSD Remaining
              </span>

              <input
                type="number"
                min="0"
                value={observationForm.ssd_remaining}
                onChange={(e) =>
                  setObservationForm({
                    ...observationForm,
                    ssd_remaining: e.target.value,
                  })
                }
                placeholder="e.g. 6748"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                DD Remaining
              </span>

              <input
                type="number"
                min="0"
                value={observationForm.dd_remaining}
                onChange={(e) =>
                  setObservationForm({
                    ...observationForm,
                    dd_remaining: e.target.value,
                  })
                }
                placeholder="e.g. 1431"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                SSD Status
              </span>

              <select
                value={observationForm.ssd_status}
                onChange={(e) =>
                  setObservationForm({
                    ...observationForm,
                    ssd_status: e.target.value,
                  })
                }
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>

            <label className="block">
              <span className={`text-xs font-bold ${mutedClass}`}>
                DD Status
              </span>

              <select
                value={observationForm.dd_status}
                onChange={(e) =>
                  setObservationForm({
                    ...observationForm,
                    dd_status: e.target.value,
                  })
                }
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Raw Source Text
            </span>

            <textarea
              rows="3"
              value={observationForm.raw_text}
              onChange={(e) =>
                setObservationForm({
                  ...observationForm,
                  raw_text: e.target.value,
                })
              }
              placeholder="Paste the source message here if useful..."
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none focus:border-[#D4AF37] ${inputClass}`}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] font-black text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Observation
          </button>
        </form>
      )}
    </section>
  );
}

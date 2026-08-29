import React from "react";
import { Clock, Save } from "lucide-react";

export default function TokenIssuanceForm({
  dayForm,
  setDayForm,
  saveTokenDay,
  saving,
  getNextCalendarDate,
  cardClass,
  headingClass,
  mutedClass,
  inputClass,
}) {
  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#D4AF37]" />

        <h3 className={`font-black ${headingClass}`}>
          Token Issuance Session
        </h3>
      </div>

      <form onSubmit={saveTokenDay} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Issuance Date
            </span>

            <input
              type="date"
              value={dayForm.issuance_date}
              onChange={(e) => {
                const issuanceDate = e.target.value;

                setDayForm((previous) => ({
                  ...previous,
                  issuance_date: issuanceDate,
                  darshan_date: getNextCalendarDate(issuanceDate),
                }));
              }}
              className={`w-full rounded-xl border px-3 py-2 text-sm ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Darshan Date
            </span>

            <input
              type="date"
              value={dayForm.darshan_date}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  darshan_date: e.target.value,
                })
              }
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Issuance Status
            </span>

            <select
              value={dayForm.issuance_status}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  issuance_status: e.target.value,
                })
              }
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
            >
              <option value="active">Tokens Issued</option>
              <option value="no_issuance">No Token Issuance</option>
            </select>
          </label>

          {dayForm.issuance_status === "no_issuance" && (
            <div className="sm:col-span-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
              <div className="font-extrabold text-amber-300">
                ⚠️ No SSD/DD token issuance
              </div>
              <div className={`mt-1 text-xs ${mutedClass}`}>
                No tokens are issued on Wednesdays for Thursday darshan.
              </div>
            </div>
          )}

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Issuance Start
            </span>

            <input
              type="datetime-local"
              value={dayForm.issuance_started_at}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  issuance_started_at: e.target.value,
                })
              }
              disabled={dayForm.issuance_status === "no_issuance"}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              SSD Quota
            </span>

            <input
              type="number"
              min="0"
              value={dayForm.ssd_quota}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  ssd_quota: e.target.value,
                })
              }
              placeholder="e.g. 10000"
              disabled={dayForm.issuance_status === "no_issuance"}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              DD Quota
            </span>

            <input
              type="number"
              min="0"
              value={dayForm.dd_quota}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  dd_quota: e.target.value,
                })
              }
              placeholder="e.g. 2000"
              disabled={dayForm.issuance_status === "no_issuance"}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Source
            </span>

            <select
              value={dayForm.source_type}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  source_type: e.target.value,
                })
              }
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
            >
              <option value="manual">Manual</option>
              <option value="telegram">Telegram</option>
              <option value="official">Official</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="block">
            <span className={`text-xs font-bold ${mutedClass}`}>
              Source Reference
            </span>

            <input
              type="text"
              value={dayForm.source_reference}
              onChange={(e) =>
                setDayForm({
                  ...dayForm,
                  source_reference: e.target.value,
                })
              }
              placeholder="Optional source/message reference"
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#D4AF37] ${inputClass}`}
            />
          </label>
        </div>

        <label className="block">
          <span className={`text-xs font-bold ${mutedClass}`}>
            Notes
          </span>

          <textarea
            rows="3"
            value={dayForm.notes}
            onChange={(e) =>
              setDayForm({
                ...dayForm,
                notes: e.target.value,
              })
            }
            placeholder="Optional notes about this token issuance session..."
            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none focus:border-[#D4AF37] ${inputClass}`}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0B0E14] font-black text-xs flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Token Session"}
        </button>
      </form>
    </section>
  );
}

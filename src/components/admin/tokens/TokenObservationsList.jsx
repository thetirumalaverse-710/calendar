import React from "react";
import { Trash2 } from "lucide-react";

export default function TokenObservationsList({
  observations,
  deleteObservation,
  saving,
  cardClass,
  headingClass,
  mutedClass,
  isLight,
}) {
  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className={`font-black ${headingClass}`}>
            Token Observations
          </h3>

          <p className={`text-xs mt-1 ${mutedClass}`}>
            {observations.length} observation
            {observations.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {observations.length === 0 ? (
        <div className={`text-sm ${mutedClass}`}>
          No observations recorded yet.
        </div>
      ) : (
        <div className="space-y-2">
          {observations.map((observation) => (
            <div
              key={observation.id}
              className={`rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                isLight
                  ? "bg-white border-slate-200 text-slate-900"
                  : "bg-[#0B0E14] border-white/10 text-white"
              }`}
            >
              {/* Observation details */}
              <div className="min-w-0">
                <p
                  className={`text-xs font-black ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  {new Date(observation.observed_at).toLocaleString()}
                </p>

                <div className="flex flex-wrap gap-6 mt-2">
                  <div className="text-sm font-bold">
                    <span
                      className="mr-1"
                      style={{
                        color: isLight ? "#475569" : "#CBD5E1",
                      }}
                    >
                      SSD:
                    </span>

                    <span
                      className="font-black"
                      style={{
                        color: isLight ? "#0F172A" : "#FFFFFF",
                      }}
                    >
                      {String(observation.ssd_remaining ?? "—")}
                    </span>
                  </div>

                  <div className="text-sm font-bold">
                    <span
                      className="mr-1"
                      style={{
                        color: isLight ? "#475569" : "#CBD5E1",
                      }}
                    >
                      DD:
                    </span>

                    <span
                      className="font-black"
                      style={{
                        color: isLight ? "#0F172A" : "#FFFFFF",
                      }}
                    >
                      {String(observation.dd_remaining ?? "—")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => deleteObservation(observation.id)}
                disabled={saving}
                className="self-end sm:self-auto p-2 rounded-lg text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                title="Delete observation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

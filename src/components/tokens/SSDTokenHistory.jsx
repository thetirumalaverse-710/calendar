import React from "react";
import { Clock, History } from "lucide-react";
import {
  formatTokenDate,
  formatTokenTime,
  getHistoryDayDetails,
} from "../../utils/tokenUtils";

export default function SSDTokenHistory({
  isLight,
  cardClass,
  headingClass,
  mutedClass,
  text,
  history,
  historyLoading,
}) {
  return (
    <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <History className="w-5 h-5 text-[#D4AF37]" />

        <h2 className={`font-black text-lg ${headingClass}`}>
          {text.history}
        </h2>
      </div>

      <p className={`text-xs mb-4 ${mutedClass}`}>
        Previous token issuance days and their recorded observations.
      </p>

      {historyLoading ? (
        <div
          className={`rounded-xl border border-dashed p-6 text-center ${
            isLight
              ? "border-slate-300 bg-slate-50"
              : "border-white/10 bg-[#0B0E14]"
          }`}
        >
          <Clock className="w-7 h-7 mx-auto text-slate-400 mb-2" />

          <p className={`text-sm font-bold ${headingClass}`}>
            Loading token history...
          </p>
        </div>
      ) : history.length === 0 ? (
        <div
          className={`rounded-xl border border-dashed p-6 text-center ${
            isLight
              ? "border-slate-300 bg-slate-50"
              : "border-white/10 bg-[#0B0E14]"
          }`}
        >
          <History className="w-7 h-7 mx-auto text-slate-400 mb-2" />

          <p className={`text-sm font-bold ${headingClass}`}>
            {text.noHistory}
          </p>

          <p className={`text-xs mt-1 ${mutedClass}`}>
            {text.noHistoryText}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr
                className={
                  isLight
                    ? "bg-slate-50 border-b border-slate-200"
                    : "bg-[#0B0E14] border-b border-white/10"
                }
              >
                <th
                  className={`px-4 py-3 text-xs font-black ${headingClass}`}
                >
                  Date
                </th>

                <th
                  className={`px-4 py-3 text-xs font-black ${headingClass}`}
                >
                  Issuance Start
                </th>

                <th
                  className={`px-4 py-3 text-xs font-black ${headingClass}`}
                >
                  SSD
                </th>

                <th
                  className={`px-4 py-3 text-xs font-black ${headingClass}`}
                >
                  DD
                </th>

                <th
                  className={`px-4 py-3 text-xs font-black ${headingClass}`}
                >
                  Last Observation
                </th>

                <th
                  className={`px-4 py-3 text-xs font-black ${headingClass}`}
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((day) => {
                const { observations, lastObservation, historyStatus } =
                  getHistoryDayDetails(day);

                return (
                  <tr
                    key={day.id}
                    className={
                      isLight
                        ? "border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
                        : "border-b border-white/10 last:border-b-0 hover:bg-white/[0.02]"
                    }
                  >
                    <td className="px-4 py-4">
                      <div
                        className={`text-sm font-black whitespace-nowrap ${headingClass}`}
                      >
                        {formatTokenDate(day.issuance_date)}
                      </div>

                      <div className={`text-[10px] mt-1 ${mutedClass}`}>
                        {observations.length} observation
                        {observations.length === 1 ? "" : "s"}
                      </div>
                    </td>

                    <td className={`px-4 py-4 text-xs ${mutedClass}`}>
                      {day.issuance_started_at ? (
                        <span className={`font-bold ${headingClass}`}>
                          {formatTokenTime(day.issuance_started_at)} IST
                        </span>
                      ) : (
                        "Not recorded"
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div
                        className={`text-sm font-black ${
                          day.ssd_completed_at
                            ? "text-green-600"
                            : headingClass
                        }`}
                      >
                        {day.ssd_completed_at
                          ? "Completed"
                          : lastObservation?.ssd_remaining ?? "—"}
                      </div>

                      {day.ssd_completed_at && (
                        <div className={`text-[10px] mt-1 ${mutedClass}`}>
                          {formatTokenTime(day.ssd_completed_at)} IST
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div
                        className={`text-sm font-black ${
                          day.dd_completed_at
                            ? "text-green-600"
                            : headingClass
                        }`}
                      >
                        {day.dd_completed_at
                          ? "Completed"
                          : lastObservation?.dd_remaining ?? "—"}
                      </div>

                      {day.dd_completed_at && (
                        <div className={`text-[10px] mt-1 ${mutedClass}`}>
                          {formatTokenTime(day.dd_completed_at)} IST
                        </div>
                      )}
                    </td>

                    <td className={`px-4 py-4 text-xs ${mutedClass}`}>
                      {lastObservation
                        ? `${formatTokenTime(lastObservation.observed_at)} IST`
                        : "—"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase whitespace-nowrap ${
                          historyStatus === "COMPLETED"
                            ? isLight
                              ? "bg-green-100 text-green-700"
                              : "bg-green-500/10 text-green-400"
                            : historyStatus === "RECORDED"
                            ? isLight
                              ? "bg-blue-100 text-blue-700"
                              : "bg-blue-500/10 text-blue-400"
                            : isLight
                            ? "bg-slate-100 text-slate-600"
                            : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {historyStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

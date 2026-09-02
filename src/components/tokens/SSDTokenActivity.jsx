import React from "react";
import { Activity, AlertTriangle, Clock } from "lucide-react";
import {
  formatTokenTime,
  getActivityTokenValues,
} from "../../utils/tokenUtils";

export default function SSDTokenActivity({
  isLight,
  cardClass,
  headingClass,
  mutedClass,
  text,
  lang,
  tokenLoading,
  tokenError,
  activityEvents,
  tokenDay,
  ssdStatus,
  ddStatus,
  isNoIssuance,
  isTodayWednesday,
}) {
  return (
    <section
      className={`rounded-2xl border p-4 sm:p-6 mb-5 ${cardClass}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-[#D4AF37]" />

        <h2 className={`font-black text-lg ${headingClass}`}>
          {text.todayActivity}
        </h2>
      </div>

      <p className={`text-xs mb-5 ${mutedClass}`}>
        {lang === "te"
          ? "జారీ ప్రారంభం, టోకెన్ పరిశీలనలు మరియు పూర్తయిన సమయాలు క్రమానుసారంగా చూపబడతాయి."
          : "Issuance start, token observations, and completion times are shown chronologically."}
      </p>

      {tokenLoading ? (
        <div
          className={`rounded-xl border border-dashed p-6 text-center ${
            isLight
              ? "border-slate-300 bg-slate-50"
              : "border-white/10 bg-[#0B0E14]"
          }`}
        >
          <Clock className="w-7 h-7 mx-auto text-slate-400 mb-2" />

          <p className={`text-sm font-bold ${headingClass}`}>
            Loading today's token activity...
          </p>
        </div>
      ) : tokenError ? (
        <div
          className={`rounded-xl border border-dashed p-6 text-center ${
            isLight
              ? "border-red-200 bg-red-50"
              : "border-red-500/20 bg-red-500/5"
          }`}
        >
          <AlertTriangle className="w-7 h-7 mx-auto text-red-500 mb-2" />

          <p className={`text-sm font-bold ${headingClass}`}>
            Unable to load token activity
          </p>

          <p className={`text-xs mt-1 ${mutedClass}`}>
            Please try again later.
          </p>
        </div>
      ) : activityEvents.length === 0 ? (
        <div
          className={`rounded-xl border border-dashed p-6 text-center ${
            isLight
              ? "border-slate-300 bg-slate-50"
              : "border-white/10 bg-[#0B0E14]"
          }`}
        >
          <Clock className="w-7 h-7 mx-auto text-slate-400 mb-2" />

          <p className={`text-sm font-bold ${headingClass}`}>
            {isNoIssuance
              ? "No Token Issuance Today"
              : "No activity recorded yet"}
          </p>

          <p className={`text-xs mt-1 ${mutedClass}`}>
            {isTodayWednesday
              ? text.wednesdayNotice
              : isNoIssuance
              ? text.genericNoIssuanceNotice ||
                "No token issuance scheduled for today."
              : "No SSD/DD token activity has been recorded for today."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[720px] text-left">
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
                  Time
                </th>

                <th
                  className={`px-4 py-3 text-xs font-black ${headingClass}`}
                >
                  Activity
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
              </tr>
            </thead>

            <tbody>
              {activityEvents.map((event) => {
                const { ssdValue, ddValue } = getActivityTokenValues({
                  event,
                  tokenDay,
                  ssdStatus,
                  ddStatus,
                });

                return (
                  <tr
                    key={event.id}
                    className={
                      isLight
                        ? "border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
                        : "border-b border-white/10 last:border-b-0 hover:bg-white/[0.02]"
                    }
                  >
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-black whitespace-nowrap ${headingClass}`}
                      >
                        {formatTokenTime(event.time)} IST
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className={`text-sm font-bold ${headingClass}`}>
                        {event.title}
                      </div>

                      <div className={`text-[10px] mt-1 ${mutedClass}`}>
                        {event.label}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-black ${
                          ssdValue === "Completed"
                            ? "text-green-500"
                            : headingClass
                        }`}
                      >
                        {ssdValue}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-black ${
                          ddValue === "Completed"
                            ? "text-green-500"
                            : headingClass
                        }`}
                      >
                        {ddValue}
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

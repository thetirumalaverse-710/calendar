import React from "react";
import { Info, Radio } from "lucide-react";
import { TOKEN_INFO } from "../../data/tokenInfo";
import {
  formatTokenDateTime,
  formatTokenTime,
} from "../../utils/tokenUtils";

function LiveTokenCard({
  isLight,
  headingClass,
  mutedClass,
  tokenInfo,
  shortName,
  status,
  isNoIssuance,
  hasObservation,
  tokenLoading,
  latestObservation,
  tokenDay,
  quotaKey,
  remainingKey,
  completedAt,
  text,
}) {
  return (
    <div
      className={`tv-card-hover rounded-xl border p-4 ${
        isLight
          ? "bg-slate-50 border-slate-200 hover:border-[#D4AF37]/60 hover:bg-white"
          : "bg-[#0B0E14] border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#111722]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-extrabold text-sm ${headingClass}`}>
            {tokenInfo.name}
          </p>

          <p className={`text-[11px] mt-1 ${mutedClass}`}>
            {shortName}
          </p>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
            isNoIssuance
              ? "bg-slate-500/10 text-slate-500"
              : status === "active" || status === "completed"
              ? "bg-green-500/10 text-green-500"
              : "bg-slate-500/10 text-slate-500"
          }`}
        >
          {isNoIssuance
            ? "No issuance"
            : status === "completed"
            ? "Completed"
            : status === "active"
            ? "Active"
            : text.noData}
        </span>
      </div>

      <div className="mt-5">
        <p className={`text-xs ${mutedClass}`}>
          Current availability
        </p>

        <p className={`text-2xl font-black mt-1 ${headingClass}`}>
          {tokenLoading
            ? "..."
            : status === "completed"
            ? "Completed"
            : latestObservation?.[remainingKey] ??
              tokenDay?.[quotaKey] ??
              "—"}
        </p>
      </div>

      {completedAt && (
        <div className={`mt-3 text-[10px] font-bold ${mutedClass}`}>
          Completed at{" "}
          <span className={headingClass}>
            {formatTokenTime(completedAt)} IST
          </span>
        </div>
      )}

      <div
        className={`mt-4 pt-3 border-t ${
          isLight ? "border-slate-200" : "border-white/10"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold ${mutedClass}`}>
            Status
          </span>

          <span
            className={`text-[10px] font-extrabold ${
              status === "active"
                ? "text-green-500"
                : status === "completed"
                ? "text-green-500"
                : "text-slate-500"
            }`}
          >
            {isNoIssuance
              ? "No issuance today"
              : status === "completed"
              ? "Completed"
              : status === "active"
              ? "Active"
              : hasObservation
              ? "Unavailable"
              : "Awaiting observation"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SSDTokenLiveStatus({
  isLight,
  cardClass,
  headingClass,
  mutedClass,
  text,
  tokenDay,
  latestObservation,
  tokenLoading,
  ssdStatus,
  ddStatus,
  isNoIssuance,
  hasObservation,
  liveSource,
}) {
  const issuanceStartedAt = tokenDay?.issuance_started_at
    ? new Date(tokenDay.issuance_started_at)
    : null;

  const ssdCompletedAt = tokenDay?.ssd_completed_at
    ? new Date(tokenDay.ssd_completed_at)
    : null;

  const ddCompletedAt = tokenDay?.dd_completed_at
    ? new Date(tokenDay.dd_completed_at)
    : null;

  const lastUpdated = latestObservation?.observed_at
    ? new Date(latestObservation.observed_at)
    : null;

  return (
    <section
      className={`rounded-2xl border p-4 sm:p-6 mb-5 ${cardClass}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#FF5722]" />

          <h2 className={`font-black text-lg ${headingClass}`}>
            {text.liveStatus}
          </h2>
        </div>

        <div className="flex flex-col sm:items-end gap-1">
          <div className={`text-[10px] font-bold ${mutedClass}`}>
            {text.source}: {liveSource || text.notAvailable}
          </div>

          {issuanceStartedAt && (
            <div className={`text-[10px] font-bold ${mutedClass}`}>
              Issuance started: {formatTokenTime(issuanceStartedAt)} IST
            </div>
          )}

          {lastUpdated && (
            <div className={`text-[10px] font-bold ${mutedClass}`}>
              Last updated: {formatTokenDateTime(lastUpdated)} IST
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LiveTokenCard
          isLight={isLight}
          headingClass={headingClass}
          mutedClass={mutedClass}
          tokenInfo={TOKEN_INFO.ssd}
          shortName="SSD"
          status={ssdStatus}
          isNoIssuance={isNoIssuance}
          hasObservation={hasObservation}
          tokenLoading={tokenLoading}
          latestObservation={latestObservation}
          tokenDay={tokenDay}
          quotaKey="ssd_quota"
          remainingKey="ssd_remaining"
          completedAt={ssdCompletedAt}
          text={text}
        />

        <LiveTokenCard
          isLight={isLight}
          headingClass={headingClass}
          mutedClass={mutedClass}
          tokenInfo={TOKEN_INFO.dd}
          shortName="DD"
          status={ddStatus}
          isNoIssuance={isNoIssuance}
          hasObservation={hasObservation}
          tokenLoading={tokenLoading}
          latestObservation={latestObservation}
          tokenDay={tokenDay}
          quotaKey="dd_quota"
          remainingKey="dd_remaining"
          completedAt={ddCompletedAt}
          text={text}
        />
      </div>

      <div
        className={`mt-4 rounded-xl border p-3 flex gap-3 ${
          isLight
            ? "bg-green-50 border-green-200"
            : "bg-green-500/5 border-green-500/20"
        }`}
      >
        <Info className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />

        <p className={`text-xs leading-relaxed ${mutedClass}`}>
          {text.awaiting}
        </p>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Info,
  ExternalLink,
  Ticket,
  History,
  Radio,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { TOKEN_INFO } from "../data/tokenInfo";
import { getTodayTokenData } from "../utils/tokenCloud";

export default function SSDDTokens({ lang = "en", themeMode = "dark" }) {
  const isLight = themeMode === "light";

    const [tokenData, setTokenData] = useState({
    tokenDay: null,
    observations: [],
  });

  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadTokenData = async () => {
      try {
        setTokenLoading(true);
        setTokenError(null);

      const result = await getTodayTokenData();

        if (!cancelled) {
          setTokenData(result);
        }
      } catch (error) {
        console.error("Failed to load SSD/DD token data:", error);

        if (!cancelled) {
          setTokenError(error);
        }
      } finally {
        if (!cancelled) {
          setTokenLoading(false);
        }
      }
    };

    loadTokenData();

    // Refresh every 10 minutes while this page is open.
    const intervalId = window.setInterval(loadTokenData, 10 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const latestObservation =
    tokenData.observations.length > 0
      ? tokenData.observations[tokenData.observations.length - 1]
      : null;

  const liveSource =
  latestObservation?.source_type === "telegram"
    ? "Telegram"
    : latestObservation?.source_type || null;

  const lastUpdated = latestObservation?.observed_at
  ? new Date(latestObservation.observed_at)
  : null;

  const tokenDay = tokenData.tokenDay;

const isNoIssuance =
  tokenDay?.issuance_status === "no_issuance";

const hasObservation =
  Boolean(latestObservation);

const ssdStatus =
  latestObservation?.ssd_status ?? null;

const ddStatus =
  latestObservation?.dd_status ?? null;

  const text = {
    title: lang === "te" ? "SSD & DD టోకెన్లు" : "SSD & DD Tokens",

    subtitle:
      lang === "te"
        ? "తిరుపతిలో జారీ చేసే ఉచిత దర్శన టోకెన్లు"
        : "Free offline darshan tokens issued in Tirupati",

    liveStatus: lang === "te" ? "లైవ్ టోకెన్ స్థితి" : "Live Token Status",

    todayActivity:
      lang === "te"
        ? "ఈరోజు టోకెన్ కార్యకలాపాలు"
        : "Today's Token Activity",

    history:
      lang === "te"
        ? "ఇటీవలి టోకెన్ చరిత్ర"
        : "Recent Token History",

    where:
      lang === "te"
        ? "టోకెన్లు ఎక్కడ పొందాలి?"
        : "Where to Get Tokens",

    how:
      lang === "te"
        ? "ఎలా పనిచేస్తాయి?"
        : "How It Works",

    requirements:
      lang === "te"
        ? "అవసరాలు"
        : "Requirements",

    important:
      lang === "te"
        ? "ముఖ్యమైన సమాచారం"
        : "Important Information",

    noData:
      lang === "te"
        ? "డేటా అందుబాటులో లేదు"
        : "No live data",

    unavailable:
      lang === "te"
        ? "ప్రస్తుతం ప్రత్యక్ష టోకెన్ సమాచారం అందుబాటులో లేదు."
        : "Live token information is not available yet.",

    awaiting:
  lang === "te"
    ? "ప్రత్యక్ష డేటా అందుబాటులో ఉంది — మూలం: Telegram."
    : "Live data connected — Source: Telegram",

    source:
      lang === "te"
        ? "లైవ్ డేటా మూలం"
        : "Live data source",

    notAvailable:
      lang === "te"
        ? "ఇంకా సమాచారం లేదు"
        : "Information not available yet",

    noHistory:
      lang === "te"
        ? "ఇంకా చరిత్ర డేటా లేదు"
        : "No historical token data yet",

    noHistoryText:
      lang === "te"
        ? "లైవ్ డేటా మూలం అనుసంధానమైన తర్వాత రోజువారీ చరిత్ర ఇక్కడ స్వయంచాలకంగా రూపొందుతుంది."
        : "Daily token history will automatically build once the live data source is connected.",
  };

  const pageClass = isLight
    ? "bg-slate-50 text-slate-900"
    : "bg-[#0B0E14] text-white";

  const cardClass = isLight
    ? "bg-white border-slate-200 shadow-sm"
    : "bg-[#111722] border-white/10";

  const mutedClass = isLight
    ? "text-slate-600"
    : "text-white/65";

  const headingClass = isLight
    ? "text-slate-900"
    : "text-white";

  const innerClass = isLight
    ? "bg-slate-50 border-slate-200"
    : "bg-[#0B0E14] border-white/10";

  const renderCentre = (centre) => (
    <div
      key={centre.id}
      className={`tv-card-hover rounded-xl border p-4 ${cardClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <div className="min-w-0">
            <h4 className={`font-extrabold text-sm ${headingClass}`}>
              {centre.name}
            </h4>

            <p className={`text-xs mt-1 ${mutedClass}`}>
              {centre.location}
            </p>
          </div>
        </div>

        {centre.mapUrl && (
          <a
            href={centre.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#FF5722] text-white text-[10px] font-extrabold flex items-center gap-1 hover:bg-[#e64a19] transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Map
          </a>
        )}
      </div>
    </div>
  );

  return (
    <main className={`min-h-[calc(100vh-120px)] ${pageClass}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-8">

        {/* ========================================================= */}
        {/* HERO */}
        {/* ========================================================= */}

        <section
          className={`rounded-2xl border p-5 sm:p-7 mb-5 overflow-hidden relative ${
            isLight
              ? "bg-white border-slate-200"
              : "bg-gradient-to-br from-[#151A24] to-[#0E121A] border-[#D4AF37]/25"
          }`}
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#D4AF37]/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Ticket className="w-5 h-5 text-[#D4AF37]" />

              <span className="text-[#D4AF37] text-xs font-extrabold uppercase tracking-wider">
                Free Darshan
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-4xl font-black tracking-tight ${headingClass}`}
            >
              {text.title}
            </h1>

            <p className={`mt-2 text-sm sm:text-base ${mutedClass}`}>
              {text.subtitle}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold">
                Offline
              </span>

              <span className="px-2.5 py-1 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722] text-[10px] font-bold">
                TTD
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LIVE TOKEN STATUS */}
        {/* ========================================================= */}

        <section className={`rounded-2xl border p-4 sm:p-6 mb-5 ${cardClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#FF5722]" />

              <h2 className={`font-black text-lg ${headingClass}`}>
                {text.liveStatus}
              </h2>
            </div>

            <div className={`text-[10px] font-bold ${mutedClass}`}>
  {text.source}: {liveSource || text.notAvailable}
</div>

{lastUpdated && (
  <div className={`text-[10px] font-bold ${mutedClass}`}>
    Last updated:{" "}
    {lastUpdated.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}{" "}
    IST
  </div>
)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* SSD LIVE CARD */}
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
                    {TOKEN_INFO.ssd.name}
                  </p>

                  <p className={`text-[11px] mt-1 ${mutedClass}`}>
                    SSD
                  </p>
                </div>

                <span
  className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
    isNoIssuance
      ? "bg-slate-500/10 text-slate-500"
      : ssdStatus === "active"
      ? "bg-green-500/10 text-green-500"
      : "bg-slate-500/10 text-slate-500"
  }`}
>
  {isNoIssuance
    ? "No issuance"
    : ssdStatus === "active"
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
  : latestObservation?.ssd_status === "completed"
  ? "Completed"
  : latestObservation?.ssd_remaining ?? "—"}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t ${
                isLight ? "border-slate-200" : "border-white/10"
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold ${mutedClass}`}>
                    Status
                  </span>

                  <span
  className={`text-[10px] font-extrabold ${
    ssdStatus === "active"
      ? "text-green-500"
      : "text-slate-500"
  }`}
>
  {isNoIssuance
  ? "No issuance today"
  : ssdStatus === "completed"
  ? "Completed"
  : ssdStatus === "active"
  ? "Active"
  : hasObservation
  ? "Unavailable"
  : "Awaiting observation"}
</span>
                </div>
              </div>
            </div>

            {/* DD LIVE CARD */}
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
                    {TOKEN_INFO.dd.name}
                  </p>

                  <p className={`text-[11px] mt-1 ${mutedClass}`}>
                    DD
                  </p>
                </div>

                <span
  className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
    isNoIssuance
      ? "bg-slate-500/10 text-slate-500"
      : ddStatus === "active"
      ? "bg-green-500/10 text-green-500"
      : "bg-slate-500/10 text-slate-500"
  }`}
>
  {isNoIssuance
    ? "No issuance"
    : ddStatus === "active"
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
  : latestObservation?.dd_status === "completed"
  ? "Completed"
  : latestObservation?.dd_remaining ?? "—"}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t ${
                isLight ? "border-slate-200" : "border-white/10"
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold ${mutedClass}`}>
                    Status
                  </span>

                <span
  className={`text-[10px] font-extrabold ${
    ddStatus === "active"
      ? "text-green-500"
      : "text-slate-500"
  }`}
>
  {isNoIssuance
    ? "No issuance today"
    : ddStatus === "completed"
    ? "Completed"
    : ddStatus === "active"
    ? "Active"
    : hasObservation
    ? "Unavailable"
    : "Awaiting observation"}
</span>  
                </div>
              </div>
            </div>
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

        {/* ========================================================= */}
        {/* TODAY'S TOKEN ACTIVITY */}
        {/* ========================================================= */}

        <section className={`rounded-2xl border p-4 sm:p-6 mb-5 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[#D4AF37]" />

            <h2 className={`font-black text-lg ${headingClass}`}>
              {text.todayActivity}
            </h2>
          </div>

          <p className={`text-xs mb-5 ${mutedClass}`}>
            Live observations collected during today's token issuance will
            appear here chronologically.
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
) : tokenData.observations.length === 0 ? (
  <div
    className={`rounded-xl border border-dashed p-6 text-center ${
      isLight
        ? "border-slate-300 bg-slate-50"
        : "border-white/10 bg-[#0B0E14]"
    }`}
  >
    <Clock className="w-7 h-7 mx-auto text-slate-400 mb-2" />

    <p className={`text-sm font-bold ${headingClass}`}>
      No activity recorded yet
    </p>

    <p className={`text-xs mt-1 ${mutedClass}`}>
      No SSD/DD token observations have been recorded for today.
    </p>
  </div>
) : (
  <div className="space-y-3">
    {tokenData.observations.map((observation) => {
      const observedTime = new Date(
        observation.observed_at
      ).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

      return (
        <div
          key={observation.id}
          className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
            isLight
              ? "bg-slate-50 border-slate-200 hover:bg-white hover:border-[#D4AF37]/50"
              : "bg-[#0B0E14] border-white/10 hover:bg-[#151A24] hover:border-[#D4AF37]/40"
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className={`text-sm font-black ${headingClass}`}>
              {observedTime}
            </span>

            <span className={`text-[10px] font-bold ${mutedClass}`}>
              Observation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg p-3 ${innerClass}`}>
              <p className={`text-[10px] font-bold ${mutedClass}`}>
                SSD Remaining
              </p>

              <p className={`text-lg font-black mt-1 ${headingClass}`}>
{observation.ssd_status === "completed"
  ? "Completed"
  : observation.ssd_remaining ?? "—"}
              </p>
            </div>

            <div className={`rounded-lg p-3 ${innerClass}`}>
              <p className={`text-[10px] font-bold ${mutedClass}`}>
                DD Remaining
              </p>

              <p className={`text-lg font-black mt-1 ${headingClass}`}>
                {observation.dd_status === "completed"
  ? "Completed"
  : observation.dd_remaining ?? "—"}
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}
          
        </section>

        {/* ========================================================= */}
        {/* IMPORTANT INFORMATION */}
        {/* ========================================================= */}

        <section
          className={`rounded-2xl border p-4 sm:p-5 mb-5 ${
            isLight
              ? "bg-orange-50 border-orange-200"
              : "bg-orange-500/5 border-orange-500/20"
          }`}
        >
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />

            <div>
              <h2 className={`font-black text-base ${headingClass}`}>
                {text.important}
              </h2>

              <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${mutedClass}`}>
                <strong className={headingClass}>
                  Token issuance times are not fixed.
                </strong>{" "}
                TTD may begin issuing tokens at different times depending on
                crowd conditions and operational arrangements. Historical
                timings shown on this website are observations and should not
                be treated as a guaranteed schedule.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WHERE TO GET TOKENS */}
        {/* ========================================================= */}

        <section className="mb-5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />

            <h2 className={`font-black text-lg ${headingClass}`}>
              {text.where}
            </h2>
          </div>

          {/* SSD CENTRES */}
          <div className={`rounded-2xl border p-5 sm:p-6 mb-4 ${cardClass}`}>
            <h3 className={`font-black text-base mb-3 ${headingClass}`}>
              {TOKEN_INFO.ssd.name} (SSD)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TOKEN_INFO.ssd.centres.map(renderCentre)}
            </div>
          </div>

          {/* DD CENTRE */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
            <h3 className={`font-black text-base mb-2 ${headingClass}`}>
              {TOKEN_INFO.dd.name} (DD)
            </h3>

            <p className={`text-xs mb-3 ${mutedClass}`}>
              DD tokens are issued at a separate counter at Bhudevi Complex.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TOKEN_INFO.dd.centres.map(renderCentre)}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW IT WORKS */}
        {/* ========================================================= */}

        <section className={`rounded-2xl border p-5 sm:p-6 mb-5 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#D4AF37]" />

            <h2 className={`font-black text-lg ${headingClass}`}>
              {text.how}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            {[
              {
                n: "01",
                title: "Obtain the token",
                body: "Visit the applicable token centre and follow the instructions given there.",
              },
              {
                n: "02",
                title: "Check your slot",
                body: "Read the reporting date and time assigned on your token.",
              },
              {
                n: "03",
                title: "Report on time",
                body: "Reach the designated reporting point according to your assigned slot.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className={`tv-card-hover rounded-xl border p-4 ${
                  isLight
                    ? "bg-slate-50 border-slate-200 hover:border-[#D4AF37]/50 hover:bg-white"
                    : "bg-[#0B0E14] border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#151A24]"
                }`}
              >
                <span className="text-[#D4AF37] text-xs font-black">
                  {step.n}
                </span>

                <h3 className={`font-extrabold text-sm mt-2 ${headingClass}`}>
                  {step.title}
                </h3>

                <p className={`text-xs mt-1.5 leading-relaxed ${mutedClass}`}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* REQUIREMENTS */}
        {/* ========================================================= */}

        <section className={`rounded-2xl border p-5 sm:p-6 mb-5 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />

            <h2 className={`font-black text-lg ${headingClass}`}>
              {text.requirements}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              "Carry the original Aadhaar card.",
              "Each person must physically stand in the queue to obtain a token.",
              "The token specifies the assigned reporting date and time for darshan.",
            ].map((item, index) => (
              <div key={index} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-black flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <p className={`text-sm leading-relaxed ${mutedClass}`}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* RECENT HISTORY */}
        {/* ========================================================= */}

        <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-2">
            <History className="w-5 h-5 text-[#D4AF37]" />

            <h2 className={`font-black text-lg ${headingClass}`}>
              {text.history}
            </h2>
          </div>

          <p className={`text-xs mb-4 ${mutedClass}`}>
            This section will eventually show the historical issuance patterns
            that help pilgrims understand how token timings have varied over
            previous days and weeks.
          </p>

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
        </section>

      </div>
    </main>
  );
}
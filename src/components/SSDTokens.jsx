import React, { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import SSDTokenActivity from "./tokens/SSDTokenActivity";
import SSDTokenHistory from "./tokens/SSDTokenHistory";
import SSDTokenHowItWorks from "./tokens/SSDTokenHowItWorks";
import SSDTokenImportantInfo from "./tokens/SSDTokenImportantInfo";
import SSDTokenLiveStatus from "./tokens/SSDTokenLiveStatus";
import SSDTokenLocations from "./tokens/SSDTokenLocations";
import SSDTokenRequirements from "./tokens/SSDTokenRequirements";
import {
  getRecentTokenHistory,
  getTodayTokenData,
} from "../utils/tokenCloud";
import { isIndiaWednesday } from "../utils/indiaTime";
import {
  buildTokenActivityEvents,
  getLatestObservation,
} from "../utils/tokenUtils";

export default function SSDDTokens({ lang = "en", themeMode = "dark" }) {
  const isLight = themeMode === "light";

  const [tokenData, setTokenData] = useState({
    tokenDay: null,
    observations: [],
    history: [],
  });

  const [historyLoading, setHistoryLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadTokenData = async () => {
      try {
        setTokenLoading(true);
        setTokenError(null);

        const [todayResult, historyResult] = await Promise.all([
          getTodayTokenData(),
          getRecentTokenHistory(7),
        ]);

        if (!cancelled) {
          setTokenData({
            ...todayResult,
            history: historyResult,
          });
        }
      } catch (error) {
        console.error("Failed to load SSD/DD token data:", error);

        if (!cancelled) {
          setTokenError(error);
        }
      } finally {
        if (!cancelled) {
          setTokenLoading(false);
          setHistoryLoading(false);
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

  const latestObservation = getLatestObservation(tokenData.observations);
  const tokenDay = tokenData.tokenDay;
  const isTodayWednesday = isIndiaWednesday();
  const isNoIssuance =
    isTodayWednesday || tokenDay?.issuance_status === "no_issuance";
  const hasObservation = Boolean(latestObservation);

  /*
   * Prefer the status stored on token_days because it represents
   * the current state of the entire issuance day.
   *
   * Fall back to the latest observation when necessary.
   */
  const ssdStatus =
    tokenDay?.ssd_status ?? latestObservation?.ssd_status ?? null;

  const ddStatus =
    tokenDay?.dd_status ?? latestObservation?.dd_status ?? null;

  const liveSource =
    latestObservation?.source_type === "telegram"
      ? "Telegram"
      : latestObservation?.source_type || null;

  const activityEvents = buildTokenActivityEvents({
    tokenDay,
    observations: tokenData.observations,
    lang,
  });

  const text = {
    title:
      lang === "te"
        ? "SSD & DD టోకెన్లు"
        : "SSD & DD Tokens",

    subtitle:
      lang === "te"
        ? "తిరుపతిలో జారీ చేసే ఉచిత దర్శన టోకెన్లు"
        : "Free offline darshan tokens issued in Tirupati",

    liveStatus:
      lang === "te"
        ? "లైవ్ టోకెన్ స్థితి"
        : "Live Token Status",

    lastUpdated:
      lang === "te"
        ? "చివరిగా నవీకరించబడింది"
        : "Last updated",

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

    requirements: lang === "te" ? "అవసరాలు" : "Requirements",

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
        ? "టోకెన్ సమాచారం స్వయంచాలకంగా నవీకరించబడుతుంది. లైవ్ డేటా మూలం: Telegram."
        : "Token information is updated automatically. Live data source: Telegram.",

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

    wednesdayNotice:
      lang === "te"
        ? "గురువారం దర్శనం కోసం బుధవారం టోకెన్లు జారీ చేయబడవు."
        : "No tokens are issued on Wednesdays for Thursday darshan.",

    genericNoIssuanceNotice:
      lang === "te"
        ? "ఈరోజు టోకెన్ల జారీ లేదు."
        : "No token issuance scheduled for today.",
  };

  const pageClass = isLight
    ? "bg-slate-50 text-slate-900"
    : "bg-[#0B0E14] text-white";

  const cardClass = isLight
    ? "bg-white border-slate-200 shadow-sm"
    : "bg-[#111722] border-white/10";

  const mutedClass = isLight ? "text-slate-600" : "text-white/65";
  const headingClass = isLight ? "text-slate-900" : "text-white";

  return (
    <main className={`min-h-[calc(100vh-120px)] ${pageClass}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-8">
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

        <SSDTokenLiveStatus
          isLight={isLight}
          cardClass={cardClass}
          headingClass={headingClass}
          mutedClass={mutedClass}
          text={text}
          tokenDay={tokenDay}
          latestObservation={latestObservation}
          tokenLoading={tokenLoading}
          ssdStatus={ssdStatus}
          ddStatus={ddStatus}
          isNoIssuance={isNoIssuance}
          isTodayWednesday={isTodayWednesday}
          hasObservation={hasObservation}
          liveSource={liveSource}
        />

        <SSDTokenActivity
          isLight={isLight}
          cardClass={cardClass}
          headingClass={headingClass}
          mutedClass={mutedClass}
          text={text}
          lang={lang}
          tokenLoading={tokenLoading}
          tokenError={tokenError}
          activityEvents={activityEvents}
          tokenDay={tokenDay}
          ssdStatus={ssdStatus}
          ddStatus={ddStatus}
          isNoIssuance={isNoIssuance}
          isTodayWednesday={isTodayWednesday}
        />

        <SSDTokenImportantInfo
          isLight={isLight}
          headingClass={headingClass}
          mutedClass={mutedClass}
          text={text}
          lang={lang}
        />

        <SSDTokenLocations
          cardClass={cardClass}
          headingClass={headingClass}
          mutedClass={mutedClass}
          text={text}
        />

        <SSDTokenHowItWorks
          isLight={isLight}
          cardClass={cardClass}
          headingClass={headingClass}
          mutedClass={mutedClass}
          text={text}
        />

        <SSDTokenRequirements
          cardClass={cardClass}
          headingClass={headingClass}
          mutedClass={mutedClass}
          text={text}
        />

        <SSDTokenHistory
          isLight={isLight}
          cardClass={cardClass}
          headingClass={headingClass}
          mutedClass={mutedClass}
          text={text}
          history={tokenData.history}
          historyLoading={historyLoading}
        />
      </div>
    </main>
  );
}

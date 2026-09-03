export function getLatestObservation(observations = []) {
  return observations.length > 0
    ? observations[observations.length - 1]
    : null;
}

export function formatTokenTime(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTokenDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export function formatTokenDateTime(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function buildTokenActivityEvents({
  tokenDay,
  observations = [],
  lang = "en",
}) {
  const activityEvents = [];

  if (tokenDay?.issuance_started_at) {
    activityEvents.push({
      id: "issuance-start",
      type: "start",
      time: tokenDay.issuance_started_at,
      title:
        lang === "te"
          ? "టోకెన్ల జారీ ప్రారంభమైంది"
          : "Token Issuance Started",
      label:
        lang === "te"
          ? "జారీ ప్రారంభం"
          : "Issuance Start",
    });
  }

  if (tokenDay?.ssd_completed_at) {
    activityEvents.push({
      id: "ssd-completed",
      type: "ssd-completed",
      time: tokenDay.ssd_completed_at,
      title:
        lang === "te"
          ? "SSD టోకెన్ల కోటా పూర్తయింది"
          : "SSD Token Quota Completed",
      label:
        lang === "te"
          ? "SSD పూర్తయింది"
          : "SSD Completed",
    });
  }

  if (tokenDay?.dd_completed_at) {
    activityEvents.push({
      id: "dd-completed",
      type: "dd-completed",
      time: tokenDay.dd_completed_at,
      title:
        lang === "te"
          ? "DD టోకెన్ల కోటా పూర్తయింది"
          : "DD Token Quota Completed",
      label:
        lang === "te"
          ? "DD పూర్తయింది"
          : "DD Completed",
    });
  }

  observations.forEach((observation) => {
    activityEvents.push({
      id: `observation-${observation.id}`,
      type: "observation",
      time: observation.observed_at,
      title:
        lang === "te"
          ? "టోకెన్ పరిశీలన"
          : "Token Observation",
      label: lang === "te" ? "పరిశీలన" : "Observation",
      observation,
    });
  });

  return activityEvents.sort(
    (a, b) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
  );
}

export function getActivityTokenValues({
  event,
  tokenDay,
}) {
  const observation = event?.observation;

  function formatVal(val) {
    if (val === null || val === undefined || val === "") return "—";
    return val;
  }

  let ssdValue = "—";
  let ddValue = "—";

  if (event?.type === "start") {
    ssdValue = formatVal(tokenDay?.ssd_quota);
    ddValue = formatVal(tokenDay?.dd_quota);
  } else if (event?.type === "ssd-completed") {
    ssdValue = "Completed";
    ddValue = formatVal(observation?.dd_remaining);
  } else if (event?.type === "dd-completed") {
    ssdValue = formatVal(observation?.ssd_remaining);
    ddValue = "Completed";
  } else if (event?.type === "observation") {
    ssdValue = formatVal(observation?.ssd_remaining);
    ddValue = formatVal(observation?.dd_remaining);
  }

  return { ssdValue, ddValue };
}

export function getHistoryDayDetails(day) {
  const observations = day.observations || [];
  const lastObservation = getLatestObservation(observations);
  const ssdCompleted = day.ssd_status === "completed";
  const ddCompleted = day.dd_status === "completed";
  const dayCompleted = ssdCompleted && ddCompleted;

  return {
    observations,
    lastObservation,
    historyStatus: dayCompleted
      ? "COMPLETED"
      : observations.length > 0
      ? "RECORDED"
      : "NO DATA",
  };
}

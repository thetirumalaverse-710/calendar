import { supabase } from "./supabaseClient";

/**
 * Get today's token day.
 */
export async function getTodayTokenDay(dateOverride = null) {
  const today =
    dateOverride ||
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  const { data, error } = await supabase
    .from("token_days")
    .select("*")
    .eq("issuance_date", today)
    .maybeSingle();

  if (error) {
    console.error("Failed to load today's token data:", error);
    throw error;
  }

  return data;
}


/**
 * Get observations for a particular token day.
 */
export async function getTokenObservations(tokenDayId) {
  if (!tokenDayId) {
    return [];
  }

  const { data, error } = await supabase
    .from("token_observations")
    .select("*")
    .eq("token_day_id", tokenDayId)
    .order("observed_at", { ascending: true });

  if (error) {
    console.error("Failed to load token observations:", error);
    throw error;
  }

  return data || [];
}


/**
 * Load today's token day together with its observations.
 */
export async function getTodayTokenData(dateOverride = null) {
  const tokenDay = await getTodayTokenDay(dateOverride);

  if (!tokenDay) {
    return {
      tokenDay: null,
      observations: [],
    };
  }

  const observations = await getTokenObservations(tokenDay.id);

  return {
    tokenDay,
    observations,
  };
}

/**
 * Get recent completed token days with their observations.
 */
export async function getRecentTokenHistory(limit = 7) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const { data: days, error } = await supabase
    .from("token_days")
    .select("*")
    .lt("issuance_date", today)
    .order("issuance_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(
      "Failed to load recent token history:",
      error
    );
    throw error;
  }

  if (!days || days.length === 0) {
    return [];
  }

  const dayIds = days.map((day) => day.id);

  const { data: observations, error: observationError } =
    await supabase
      .from("token_observations")
      .select("*")
      .in("token_day_id", dayIds)
      .order("observed_at", { ascending: true });

  if (observationError) {
    console.error(
      "Failed to load historical token observations:",
      observationError
    );
    throw observationError;
  }

  return days.map((day) => {
    const dayObservations =
      (observations || []).filter(
        (observation) =>
          observation.token_day_id === day.id
      );

    return {
      ...day,
      observations: dayObservations,
    };
  });
}
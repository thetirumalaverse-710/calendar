import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Ticket,
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import {
  getIndiaDateString,
  getIndiaDateTimeLocalValue,
} from "../../utils/indiaTime";

import TokenIssuanceForm from "./tokens/TokenIssuanceForm";
import TokenSessionStatus from "./tokens/TokenSessionStatus";
import TokenObservationForm from "./tokens/TokenObservationForm";
import TokenObservationsList from "./tokens/TokenObservationsList";

export default function AdminTokenManager({
  lang = "en",
  themeMode = "dark",
}) {
  const isLight = themeMode === "light";

  const [tokenDay, setTokenDay] = useState(null);
  const [observations, setObservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRequestRef = useRef(0);

  const [dayForm, setDayForm] = useState({
    issuance_date: getIndiaDateString(),
    darshan_date: "",
    issuance_status: "active",
    issuance_started_at: "",
    ssd_quota: "",
    dd_quota: "",
    source_type: "manual",
    source_reference: "",
    notes: "",
  });

  const getObservationDateTime = (dateString) => {
    if (!dateString) return getIndiaDateTimeLocalValue();

    const now = getIndiaDateTimeLocalValue();
    const time = now.slice(11, 16);

    return `${dateString}T${time}`;
  };

  const [observationForm, setObservationForm] = useState({
    observed_at: getObservationDateTime(dayForm.issuance_date),
    ssd_remaining: "",
    dd_remaining: "",
    ssd_status: "active",
    dd_status: "active",
    source_type: "manual",
    source_reference: "",
    raw_text: "",
  });

  useEffect(() => {
    if (!dayForm.issuance_date) return;

    setObservationForm((previous) => ({
      ...previous,
      observed_at: getObservationDateTime(dayForm.issuance_date),
    }));
  }, [dayForm.issuance_date]);

  const headingClass = isLight ? "!text-slate-900" : "!text-white";

  const mutedClass = isLight ? "!text-slate-600" : "!text-slate-300";

  const cardClass = isLight
    ? "bg-white border-slate-200"
    : "bg-[#111722] border-white/10";

  const inputClass = isLight
    ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
    : "bg-[#0B0E14] border-white/10 text-white placeholder:text-white/30";

  const getNextCalendarDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-").map(Number);

    // Use noon to avoid timezone/DST edge cases.
    const date = new Date(year, month - 1, day, 12, 0, 0);
    date.setDate(date.getDate() + 1);

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const loadTokenData = async () => {
    if (!dayForm.issuance_date) {
      setTokenDay(null);
      setObservations([]);
      setMessage("");
      return;
    }

    const requestId = ++loadRequestRef.current;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const selectedDate = dayForm.issuance_date;

      const nextDate = getNextCalendarDate(selectedDate);

      const [year, month, selectedDay] = selectedDate.split("-").map(Number);
      const isWednesday =
        new Date(year, month - 1, selectedDay, 12, 0, 0).getDay() === 3;

      const { data: day, error: dayError } = await supabase
        .from("token_days")
        .select("*")
        .eq("issuance_date", selectedDate)
        .maybeSingle();

      if (requestId !== loadRequestRef.current) {
        return;
      }

      if (dayError) {
        throw dayError;
      }

      // EXISTING SESSION
      if (day) {
        if (requestId !== loadRequestRef.current) {
          return;
        }
        setTokenDay(day);

        setDayForm((previous) => ({
          ...previous,
          issuance_date: day.issuance_date,
          darshan_date: day.darshan_date ?? "",
          issuance_status: day.issuance_status ?? "active",
          issuance_started_at: day.issuance_started_at
            ? new Intl.DateTimeFormat("sv-SE", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
                .format(new Date(day.issuance_started_at))
                .replace(" ", "T")
            : "",
          ssd_quota: day.ssd_quota ?? "",
          dd_quota: day.dd_quota ?? "",
          source_type: day.source_type ?? "manual",
          source_reference: day.source_reference ?? "",
          notes: day.notes ?? "",
        }));

        const { data: observationRows, error: observationError } =
          await supabase
            .from("token_observations")
            .select("*")
            .eq("token_day_id", day.id)
            .order("observed_at", { ascending: false });

        if (requestId !== loadRequestRef.current) {
          return;
        }

        if (observationError) {
          throw observationError;
        }

        setObservations(observationRows || []);
        return;
      }

      // NEW SESSION
      if (requestId !== loadRequestRef.current) {
        return;
      }

      setTokenDay(null);
      setObservations([]);

      setDayForm((previous) => ({
        ...previous,
        darshan_date: nextDate,
        issuance_status: isWednesday ? "no_issuance" : "active",
        issuance_started_at: "",
        ssd_quota: "",
        dd_quota: "",
        source_type: "manual",
        source_reference: "",
        notes: "",
      }));
    } catch (err) {
      console.error("Failed to load token data:", err);
      setTokenDay(null);
      setObservations([]);
      setError(err.message || "Failed to load token session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokenData();
  }, [dayForm.issuance_date]);

  const saveTokenDay = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        issuance_date: dayForm.issuance_date,
        darshan_date: dayForm.darshan_date || null,
        issuance_status: dayForm.issuance_status,
        issuance_started_at: dayForm.issuance_started_at
          ? new Date(dayForm.issuance_started_at).toISOString()
          : null,

        ssd_quota:
          dayForm.ssd_quota === "" ? null : Number(dayForm.ssd_quota),

        dd_quota:
          dayForm.dd_quota === "" ? null : Number(dayForm.dd_quota),

        source_type: dayForm.source_type || null,
        source_reference: dayForm.source_reference || null,
        notes: dayForm.notes || null,
      };

      const { data, error: saveError } = await supabase
        .from("token_days")
        .upsert(payload, {
          onConflict: "issuance_date",
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setTokenDay(data);

      await loadTokenData();

      setMessage("Token day saved successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save token day.");
    } finally {
      setSaving(false);
    }
  };

  const addObservation = async (event) => {
    event.preventDefault();

    if (!tokenDay) {
      setError("Save the token issuance session before adding an observation.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        token_day_id: tokenDay.id,

        observed_at: observationForm.observed_at
          ? new Date(observationForm.observed_at).toISOString()
          : new Date().toISOString(),

        ssd_remaining:
          observationForm.ssd_remaining === ""
            ? null
            : Number(observationForm.ssd_remaining),

        dd_remaining:
          observationForm.dd_remaining === ""
            ? null
            : Number(observationForm.dd_remaining),

        ssd_status: observationForm.ssd_status,
        dd_status: observationForm.dd_status,

        source_type: observationForm.source_type || "manual",
        source_reference: observationForm.source_reference || null,
        raw_text: observationForm.raw_text || null,
      };

      const { error: insertError } = await supabase
        .from("token_observations")
        .insert(payload);

      if (insertError) throw insertError;

      setObservationForm({
        observed_at: getObservationDateTime(dayForm.issuance_date),
        ssd_remaining: "",
        dd_remaining: "",
        ssd_status: "active",
        dd_status: "active",
        source_type: "manual",
        source_reference: "",
        raw_text: "",
      });

      await loadTokenData();

      setMessage("Token observation added successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add observation.");
    } finally {
      setSaving(false);
    }
  };

  const deleteObservation = async (id) => {
    const confirmed = window.confirm(
      "Delete this token observation? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { error: deleteError } = await supabase
        .from("token_observations")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await loadTokenData();

      setMessage("Observation deleted.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete observation.");
    } finally {
      setSaving(false);
    }
  };

  const setDayStatus = async (type, status) => {
    if (!tokenDay) return;

    try {
      setSaving(true);
      setError("");

      const field = type === "ssd" ? "ssd_status" : "dd_status";

      const { data, error: updateError } = await supabase
        .from("token_days")
        .update({
          [field]: status,
        })
        .eq("id", tokenDay.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setTokenDay(data);
      setMessage(
        `${type.toUpperCase()} status changed to ${status}.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#D4AF37]" />

            <h2 className={`text-xl font-black ${headingClass}`}>
              {lang === "te"
                ? "SSD / DD టోకెన్ నిర్వహణ"
                : "SSD / DD Token Management"}
            </h2>
          </div>

          <p className={`text-xs mt-1 ${mutedClass}`}>
            {lang === "te"
              ? "రోజువారీ టోకెన్ సమాచారం నిర్వహించండి"
              : "Manage daily SSD and DD token information"}
          </p>
        </div>

        <button
          type="button"
          onClick={loadTokenData}
          disabled={loading || saving}
          className="px-3 py-2 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold flex items-center gap-2 hover:bg-[#D4AF37]/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 flex items-center gap-2 text-green-500 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2 text-red-500 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* TOKEN DAY FORM */}
      <TokenIssuanceForm
        dayForm={dayForm}
        setDayForm={setDayForm}
        saveTokenDay={saveTokenDay}
        saving={saving}
        getNextCalendarDate={getNextCalendarDate}
        cardClass={cardClass}
        headingClass={headingClass}
        mutedClass={mutedClass}
        inputClass={inputClass}
      />

      {/* CURRENT STATUS */}
      <TokenSessionStatus
        tokenDay={tokenDay}
        setDayStatus={setDayStatus}
        cardClass={cardClass}
        headingClass={headingClass}
        mutedClass={mutedClass}
        isLight={isLight}
      />

      {/* ADD OBSERVATION */}
      <TokenObservationForm
        tokenDay={tokenDay}
        observationForm={observationForm}
        setObservationForm={setObservationForm}
        addObservation={addObservation}
        saving={saving}
        cardClass={cardClass}
        headingClass={headingClass}
        mutedClass={mutedClass}
        inputClass={inputClass}
      />

      {/* OBSERVATION HISTORY */}
      <TokenObservationsList
        observations={observations}
        deleteObservation={deleteObservation}
        saving={saving}
        cardClass={cardClass}
        headingClass={headingClass}
        mutedClass={mutedClass}
        isLight={isLight}
      />
    </div>
  );
}